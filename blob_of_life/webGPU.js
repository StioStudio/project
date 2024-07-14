const canvas = document.querySelector("#webgpu-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
const context = canvas.getContext("webgpu");

const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
    device: device,
    format: presentationFormat,
    alphaMode: "premultiplied"
});

const numParticles = 7000;
const simulationDistance = 100.0;

const blobTypeData = new Float32Array([
    0.5, -0.5,
    // Add more forces if needed
]);

const blobData = new Float32Array(numParticles * 8);
for (let i = 0; i < numParticles; i++) {
    blobData[i * 8 + 0] = Math.random() * canvas.width; // x
    blobData[i * 8 + 1] = Math.random() * canvas.height; // y
    blobData[i * 8 + 2] = 0; // vel_x
    blobData[i * 8 + 3] = 0; // vel_y
    blobData[i * 8 + 4] = Math.floor(Math.random() * 10); // type
    blobData[i * 8 + 5] = Math.random() * 0.1; // size
    blobData[i * 8 + 6] = Math.random(); // color r
    blobData[i * 8 + 7] = Math.random(); // color g
}

const blobTypeBuffer = device.createBuffer({
    size: blobTypeData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
});
device.queue.writeBuffer(blobTypeBuffer, 0, blobTypeData);

const blobBuffer = device.createBuffer({
    size: blobData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
});
device.queue.writeBuffer(blobBuffer, 0, blobData);

const computeShaderCode = `
@group(0) @binding(0) var<storage, read> blobTypes: array<f32>;
@group(0) @binding(1) var<storage, read_write> blobs: array<vec4<f32>>;

const canvasWidth: f32 = ${canvas.width}.0;
const canvasHeight: f32 = ${canvas.height}.0;
const simulationDistance: f32 = ${simulationDistance}.0;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let i = global_id.x;
    if (i >= ${numParticles}u) { return; }

    var blob = blobs[i];
    var vel_x = blob.z;
    var vel_y = blob.w;

    for (var j = 0u; j < ${numParticles}u; j++) {
        if (i == j) { continue; }

        let otherBlob = blobs[j];
        let dx = otherBlob.x - blob.x;
        let dy = otherBlob.y - blob.y;
        let distance = sqrt(dx * dx + dy * dy);
        if (distance < simulationDistance) {
            let force = blobTypes[0] / distance;
            let angle = atan2(dy, dx);
            vel_x += force * cos(angle);
            vel_y += force * sin(angle);
        }
    }

    vel_x *= 0.95;
    vel_y *= 0.95;

    blob.x = (blob.x + vel_x + canvasWidth) % canvasWidth;
    blob.y = (blob.y + vel_y + canvasHeight) % canvasHeight;
    blob.z = vel_x;
    blob.w = vel_y;
    blobs[i] = blob;
}
`;

const vertexShaderCode = `
struct VertexOutput {
    @builtin(position) position: vec4<f32>;
    @location(0) color: vec3<f32>;
};

@vertex
fn main(@location(0) position: vec2<f32>, @location(1) color: vec3<f32>) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(position, 0.0, 1.0);
    output.color = color;
    return output;
}
`;

const fragmentShaderCode = `
@fragment
fn main(@location(0) color: vec3<f32>) -> @location(0) vec4<f32> {
    return vec4<f32>(color, 1.0);
}
`;

const computeModule = device.createShaderModule({
    code: computeShaderCode
});

const vertexModule = device.createShaderModule({
    code: vertexShaderCode
});

const fragmentModule = device.createShaderModule({
    code: fragmentShaderCode
});

const computePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
        bindGroupLayouts: [
            device.createBindGroupLayout({
                entries: [
                    { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                    { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }
                ]
            })
        ]
    }),
    compute: {
        module: computeModule,
        entryPoint: 'main'
    }
});

const renderPipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
        bindGroupLayouts: []
    }),
    vertex: {
        module: vertexModule,
        entryPoint: 'main',
        buffers: [
            {
                arrayStride: 8 * Float32Array.BYTES_PER_ELEMENT,
                attributes: [
                    { shaderLocation: 0, format: 'float32x2', offset: 0 },
                    { shaderLocation: 1, format: 'float32x3', offset: 6 * Float32Array.BYTES_PER_ELEMENT }
                ]
            }
        ]
    },
    fragment: {
        module: fragmentModule,
        entryPoint: 'main',
        targets: [{ format: presentationFormat }]
    },
    primitive: {
        topology: 'point-list'
    }
});

const bindGroup = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
        { binding: 0, resource: { buffer: blobTypeBuffer } },
        { binding: 1, resource: { buffer: blobBuffer } }
    ]
});

function frame() {
    const commandEncoder = device.createCommandEncoder();

    // Compute pass
    {
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(Math.ceil(numParticles / 64));
        computePass.end();
    }

    // Render pass
    {
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: context.getCurrentTexture().createView(),
                    loadOp: 'clear',
                    storeOp: 'store',
                    clearValue: { r: 0, g: 0, b: 0, a: 1 }
                }
            ]
        });

        renderPass.setPipeline(renderPipeline);
        renderPass.setVertexBuffer(0, blobBuffer);
        renderPass.draw(numParticles);
        renderPass.end();
    }

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
}

frame();