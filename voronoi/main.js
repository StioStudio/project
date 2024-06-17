// Box
const totalPointsNumber = document.querySelector(".total-points-number")
const totalPointsSlider = document.querySelector(".total-points-slider")
const submit = document.querySelector(".submit")

totalPointsNumber.addEventListener("change", (e) => {
    totalPointsSlider.value = e.target.value
})

totalPointsSlider.addEventListener("input", (e) => {
    totalPointsNumber.value = e.target.value
})

submit.addEventListener("click", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    simulate()
})

simulate()

// Main
async function simulate() {
    const TOTAL_POINTS = totalPointsNumber.value;
    const canvas = document.querySelector("canvas");
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    function randomColor() {
        return [Math.random(), Math.random(), Math.random(), 1.0];
    }

    const points = new Float32Array(TOTAL_POINTS * 6);
    for (let i = 0; i < TOTAL_POINTS; i++) {
        points[i * 6] = Math.random() * canvas.width;
        points[i * 6 + 1] = Math.random() * canvas.height;
        const color = randomColor();
        points[i * 6 + 2] = color[0];
        points[i * 6 + 3] = color[1];
        points[i * 6 + 4] = color[2];
        points[i * 6 + 5] = color[3]; // alpha value
    }

    const pointBuffer = device.createBuffer({
        size: points.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    });
    new Float32Array(pointBuffer.getMappedRange()).set(points);
    pointBuffer.unmap();

    const bindGroupLayout = device.createBindGroupLayout({
        entries: [{
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: { type: "read-only-storage" }
        }]
    });

    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    const module = device.createShaderModule({
        code: `
        struct Point {
            position: vec2<f32>,
            r: f32,
            g: f32,
            b: f32,
            a: f32
        };

        @group(0) @binding(0) var<storage, read> points: array<Point>;

        struct VertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
        };

        @vertex
        fn vertex_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
            var output: VertexOutput;
            output.position = vec4<f32>(f32(vertexIndex % 2u) * 2.0 - 1.0, f32(vertexIndex / 2u) * 2.0 - 1.0, 0.0, 1.0);
            return output;
        }

        @fragment
        fn fragment_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
            var closestDist = f32(1e6);
            var closestColor = vec4<f32>(0.0, 0.0, 0.0, 1.0);

            for (var i = 0u; i < arrayLength(&points); i = i + 1u) {
                let point = points[i];
                let dist = distance(point.position, fragCoord.xy);

                if (dist < closestDist) {
                    closestDist = dist;
                    closestColor = vec4<f32>(point.r, point.g, point.b, point.a);
                }
            }
            
            return closestColor;
        }
    `
    });

    const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module,
            entryPoint: "vertex_main"
        },
        fragment: {
            module,
            entryPoint: "fragment_main",
            targets: [{
                format: navigator.gpu.getPreferredCanvasFormat()
            }]
        },
        primitive: {
            topology: "triangle-strip",
            stripIndexFormat: "uint32"
        }
    });

    const pointPipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module,
            entryPoint: "vertex_main"
        },
        fragment: {
            module,
            entryPoint: "fragment_main",
            targets: [{
                format: navigator.gpu.getPreferredCanvasFormat()
            }]
        },
        primitive: {
            topology: "point-list"
        }
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{
            binding: 0,
            resource: {
                buffer: pointBuffer
            }
        }]
    });

    const context = canvas.getContext("webgpu");
    context.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: "opaque"
    });

    function draw() {
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 1 }
            }]
        });

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(4);
        passEncoder.setPipeline(pointPipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(TOTAL_POINTS);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);
    }

    draw()
}
