const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (!navigator.gpu) {
    console.error("WebGPU not supported on this browser.");
} else {
    initializeWebGPU();
}

async function initializeWebGPU() {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const context = canvas.getContext("webgpu");

    const swapChainFormat = "bgra8unorm";
    context.configure({
        device,
        format: swapChainFormat,
        alphaMode: "premultiplied",
    });

    const blobCount = 20000;
    const blobSize = 0.003; // Adjusted blob size
    const blobTypesCount = 10;
    const simulationDistance = 100.0;

    // Define blob types, forces, and colors
    const blobTypes = new Float32Array(blobTypesCount * blobTypesCount);
    for (let i = 0; i < blobTypesCount; i++) {
        for (let j = 0; j < blobTypesCount; j++) {
            blobTypes[i * blobTypesCount + j] = (Math.random() - 0.5) * 2.0; // Random forces
        }
    }

    const colors = new Float32Array(blobTypesCount * 4);
    for (let i = 0; i < blobTypesCount; i++) {
        colors[i * 4 + 0] = Math.random(); // R
        colors[i * 4 + 1] = Math.random(); // G
        colors[i * 4 + 2] = Math.random(); // B
        colors[i * 4 + 3] = 1.0;           // A
    }

    const blobTypeBuffer = device.createBuffer({
        size: blobTypes.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Float32Array(blobTypeBuffer.getMappedRange()).set(blobTypes);
    blobTypeBuffer.unmap();

    const colorBuffer = device.createBuffer({
        size: colors.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Float32Array(colorBuffer.getMappedRange()).set(colors);
    colorBuffer.unmap();

    // Create blobs data
    const blobs = new Float32Array(blobCount * 5);
    for (let i = 0; i < blobCount; i++) {
        blobs[i * 5 + 0] = Math.random() * canvas.width;  // x
        blobs[i * 5 + 1] = Math.random() * canvas.height; // y
        blobs[i * 5 + 2] = (Math.random() - 0.5) * 2.0; // vel_x
        blobs[i * 5 + 3] = (Math.random() - 0.5) * 2.0; // vel_y
        blobs[i * 5 + 4] = Math.floor(Math.random() * blobTypesCount); // type
    }

    const blobBuffer = device.createBuffer({
        size: blobs.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true,
    });
    new Float32Array(blobBuffer.getMappedRange()).set(blobs);
    blobBuffer.unmap();

    const renderBlobBuffer = device.createBuffer({
        size: blobs.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });

    const computeShaderCode = `
        @group(0) @binding(0) var<storage, read_write> blobs: array<vec4<f32>>;
        @group(0) @binding(1) var<storage> blobTypes: array<f32>;

        @compute @workgroup_size(64)
        fn updateBlobs(@builtin(global_invocation_id) id: vec3<u32>) {
            let i = id.x;
            if (i >= ${blobCount}u) { return; }

            var blob = blobs[i];
            var newPos = blob.xy + blob.zw;

            if (newPos.x > ${canvas.width}.0) { newPos.x -= ${canvas.width}.0; }
            if (newPos.x < 0.0) { newPos.x += ${canvas.width}.0; }
            if (newPos.y > ${canvas.height}.0) { newPos.y -= ${canvas.height}.0; }
            if (newPos.y < 0.0) { newPos.y += ${canvas.height}.0; }

            var force = vec2<f32>(0.0, 0.0);
            for (var j = 0u; j < ${blobCount}u; j++) {
                if (i == j) { continue; }

                var otherBlob = blobs[j];
                var dx = otherBlob.x - blob.x;
                var dy = otherBlob.y - blob.y;
                var distance = sqrt(dx * dx + dy * dy);
                if (distance < ${simulationDistance}) {
                    var forceMagnitude = blobTypes[u32(blob.w) * ${blobTypesCount} + u32(otherBlob.w)] / distance;
                    var angle = atan2(dy, dx);
                    force += forceMagnitude * vec2<f32>(cos(angle), sin(angle));
                }
            }

            var newVel = blob.zw + force * 0.1; // Apply force to velocity
            newVel *= 0.95; // Dampen velocity

            blobs[i] = vec4<f32>(newPos, newVel);
        }
    `;

    const vertexShaderCode = `
        @group(0) @binding(0) var<storage> blobs: array<vec4<f32>>;
        @group(0) @binding(1) var<storage> colors: array<vec4<f32>>;

        struct VertexOutput {
            @builtin(position) Position: vec4<f32>,
            @location(0) color: vec4<f32>,
        };

        @vertex
        fn vs_main(@builtin(vertex_index) VertexIndex: u32, @builtin(instance_index) InstanceIndex: u32) -> VertexOutput {
            var pos = array<vec2<f32>, 6>(
                vec2<f32>(-1.0, -1.0),
                vec2<f32>(1.0, -1.0),
                vec2<f32>(-1.0, 1.0),
                vec2<f32>(1.0, -1.0),
                vec2<f32>(1.0, 1.0),
                vec2<f32>(-1.0, 1.0)
            );

            let blob = blobs[InstanceIndex];
            let x = blob.x / ${canvas.width}.0 * 2.0 - 1.0;
            let y = blob.y / ${canvas.height}.0 * -2.0 + 1.0;

            var output: VertexOutput;
            output.Position = vec4<f32>(pos[VertexIndex] * ${blobSize} + vec2<f32>(x, y), 0.0, 1.0);
            output.color = colors[u32(blob.w)];
            return output;
        }
    `;

    const fragmentShaderCode = `
        @fragment
        fn fs_main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
            return color;
        }
    `;

    const computeShaderModule = device.createShaderModule({ code: computeShaderCode });
    const vertexShaderModule = device.createShaderModule({ code: vertexShaderCode });
    const fragmentShaderModule = device.createShaderModule({ code: fragmentShaderCode });

    const computeBindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: "storage",
            },
        }, {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
                type: "read-only-storage",
            },
        }],
    });

    const renderBindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
                type: "read-only-storage",
            },
        }, {
            binding: 1,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
                type: "read-only-storage",
            },
        }],
    });

    const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [computeBindGroupLayout] }),
        compute: {
            module: computeShaderModule,
            entryPoint: "updateBlobs",
        },
    });

    const renderPipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({ bindGroupLayouts: [renderBindGroupLayout] }),
        vertex: {
            module: vertexShaderModule,
            entryPoint: "vs_main",
        },
        fragment: {
            module: fragmentShaderModule,
            entryPoint: "fs_main",
            targets: [{
                format: swapChainFormat,
            }],
        },
        primitive: {
            topology: "triangle-list",
        },
    });

    const computeBindGroup = device.createBindGroup({
        layout: computeBindGroupLayout,
        entries: [{
            binding: 0,
            resource: {
                buffer: blobBuffer,
            },
        }, {
            binding: 1,
            resource: {
                buffer: blobTypeBuffer,
            },
        }],
    });

    const renderBindGroup = device.createBindGroup({
        layout: renderBindGroupLayout,
        entries: [{
            binding: 0,
            resource: {
                buffer: renderBlobBuffer,
            },
        }, {
            binding: 1,
            resource: {
                buffer: colorBuffer,
            },
        }],
    });

    function frame() {
        const commandEncoder = device.createCommandEncoder();

        // Compute shader
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, computeBindGroup);
        computePass.dispatchWorkgroups(Math.ceil(blobCount / 64));
        computePass.end();

        commandEncoder.copyBufferToBuffer(blobBuffer, 0, renderBlobBuffer, 0, blobs.byteLength);

        // Render blobs
        const textureView = context.getCurrentTexture().createView();
        const renderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                loadOp: 'clear',
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                storeOp: 'store',
            }],
        };

        const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, renderBindGroup);
        renderPass.draw(6, blobCount, 0, 0);
        renderPass.end();

        const commandBuffer = commandEncoder.finish();
        device.queue.submit([commandBuffer]);

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}
