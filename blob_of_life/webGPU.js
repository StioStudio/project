// HTML canvas setup for WebGPU
const canvas = document.querySelector("canvas");
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();
const context = canvas.getContext('webgpu');

canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({
    device: device,
    format: format,
    alphaMode: 'opaque'
});

// Vertex Shader
const vertexShaderWGSL = `
struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(1) color : vec3<f32>
};

@vertex
fn main(@location(0) position : vec2<f32>, @location(1) color : vec3<f32>) -> VertexOutput {
    var output : VertexOutput;
    output.position = vec4<f32>(position, 0.0, 1.0);
    output.color = color;
    return output;
}
`;

// Fragment Shader
const fragmentShaderWGSL = `
@fragment
fn main(@location(1) color : vec3<f32>) -> @location(0) vec4<f32> {
    return vec4<f32>(color, 1.0); // Use passed color
}
`;

const vertexShaderModule = device.createShaderModule({
    code: vertexShaderWGSL
});

const fragmentShaderModule = device.createShaderModule({
    code: fragmentShaderWGSL
});

// Pipeline layout
const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: []
});

const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
        module: vertexShaderModule,
        entryPoint: 'main',
        buffers: [{
            arrayStride: 20, // 2 floats for position + 3 floats for color
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: 'float32x2'
                },
                {
                    shaderLocation: 1,
                    offset: 8,
                    format: 'float32x3'
                }
            ]
        }]
    },
    fragment: {
        module: fragmentShaderModule,
        entryPoint: 'main',
        targets: [{
            format: format
        }]
    },
    primitive: {
        topology: 'point-list'
    }
});

function blobForce(amount) {
    return new Array(amount).fill(0).map((v, index, ary) => { return (Math.random() - 0.5) * 2 })
}

function createBlobTypes(amount) {
    return new Array(amount).fill(0).map((v, index, ary) => {
        let type = createBlobType()
        type.forces = blobForce(amount)
        return type
    })
}

function createBlobType(
    color = [Math.random(), Math.random(), Math.random()],
    forces = []
) {
    return {
        color,
        forces,
    }
}

const blobTypes = createBlobTypes(20);


// Blob data setup
// const blobTypes = [
//     { color: [1.0, 0.0, 0.0], forces: blobForce(7) }, // Red, attracted to itself, repelled by green
//     { color: [0.0, 1.0, 0.0], forces: blobForce(7) }, // Green, repelled by red, attracted to itself and blue
//     { color: [0.0, 0.0, 1.0], forces: blobForce(7) },  // Blue, neutral to red, attracted to green and itself
//     { color: [1.0, 1.0, 0.0], forces: blobForce(7) },
//     { color: [1.0, 0.0, 1.0], forces: blobForce(7) },
//     { color: [0.0, 1.0, 1.0], forces: blobForce(7) },
//     { color: [1.0, 1.0, 1.0], forces: blobForce(7) },
// ];

console.log(blobTypes)

let blobs = createBlobs(5000); // Adjust amount as needed

function createBlobs(amount) {
    return new Array(amount).fill(0).map(() => createBlob());
}

function createBlob() {
    const type = Math.floor(Math.random() * blobTypes.length);
    return {
        x: ((canvas.width - 800) * Math.random()) + 400,
        y: ((canvas.height - 800) * Math.random()) + 400,
        vel_x: 0,
        vel_y: 0,
        type: type,
        color: blobTypes[type].color
    };
}

// Buffers
const blobBuffer = device.createBuffer({
    size: blobs.length * 4 * (2 + 3), // 2 floats for position + 3 floats for color per blob
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
});

const renderPassDescriptor = {
    colorAttachments: [{
        view: undefined, // Assigned later
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 1, g: 1, b: 1, a: 1 }
    }]
};

// Update and draw function
function updateAndDraw() {
    // Update blob positions and apply forces
    blobs.forEach(blob => {
        let force_x = 0;
        let force_y = 0;

        blobs.forEach(otherBlob => {
            if (blob !== otherBlob) {
                const dx = otherBlob.x - blob.x;
                const dy = otherBlob.y - blob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 0 && distance < 100) { // Interaction range
                    const force = blobTypes[blob.type].forces[otherBlob.type];
                    force_x += force * dx / distance;
                    force_y += force * dy / distance;
                }
            }
        });

        // Apply forces to velocities
        blob.vel_x += force_x * 0.01; // Scale forces down
        blob.vel_y += force_y * 0.01;

        // Apply some velocity decay
        blob.vel_x *= 0.95;
        blob.vel_y *= 0.95;

        // Update positions
        blob.x += blob.vel_x;
        blob.y += blob.vel_y;

        // Keep blobs within bounds
        if (blob.x < 0 || blob.x > canvas.width) blob.vel_x *= -1;
        if (blob.y < 0 || blob.y > canvas.height) blob.vel_y *= -1;
    });

    // Write blob data to the buffer
    const blobData = new Float32Array(blobs.length * (2 + 3)); // 2 for position + 3 for color
    blobs.forEach((blob, i) => {
        blobData[i * 5] = (blob.x / canvas.width) * 2 - 1;
        blobData[i * 5 + 1] = (blob.y / canvas.height) * 2 - 1;
        blobData[i * 5 + 2] = blob.color[0];
        blobData[i * 5 + 3] = blob.color[1];
        blobData[i * 5 + 4] = blob.color[2];
    });

    device.queue.writeBuffer(blobBuffer, 0, blobData.buffer);

    // Render pass
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, blobBuffer);
    passEncoder.draw(blobs.length, 1, 0, 0); // Drawing points for each blob

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(updateAndDraw);
}

updateAndDraw();
