// Box
let canvas = document.querySelector("canvas");

const hide = document.querySelector(".hide");
const box = document.querySelector(".box");

hide.addEventListener("click", () => {
    box.classList.toggle("show")
    box.classList.value.includes("show") ? hide.textContent = "HIDE" : hide.textContent = "SHOW";
})

const totalBlobsNumber = document.querySelector(".total-blobs-number")
const totalBlobsSlider = document.querySelector(".total-blobs-slider")
const blobsTypesNumber = document.querySelector(".blobs-types-number")
const blobsTypesSlider = document.querySelector(".blobs-types-slider")
const screenNumber = document.querySelector(".screen-number")
const screenSlider = document.querySelector(".screen-slider")
const simulationDistanceNumber = document.querySelector(".simulationDistance-number")
const simulationDistanceSlider = document.querySelector(".simulationDistance-slider")
const submit = document.querySelector(".submit")

totalBlobsNumber.addEventListener("change", (e) => {
    totalBlobsSlider.value = e.target.value
})

totalBlobsSlider.addEventListener("input", (e) => {
    totalBlobsNumber.value = e.target.value
})

blobsTypesNumber.addEventListener("change", (e) => {
    blobsTypesSlider.value = e.target.value
})

blobsTypesSlider.addEventListener("input", (e) => {
    blobsTypesNumber.value = e.target.value
})

screenNumber.addEventListener("change", (e) => {
    screenSlider.value = e.target.value * 10
})

screenSlider.addEventListener("input", (e) => {
    screenNumber.value = e.target.value / 10
})

simulationDistanceNumber.addEventListener("change", (e) => {
    simulationDistanceSlider.value = e.target.value
})

simulationDistanceSlider.addEventListener("input", (e) => {
    simulationDistanceNumber.value = e.target.value
})

let runs = 0

submit.addEventListener("click", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    runs++
    simulate(runs)
})

simulate(runs)

function simulate(_runs) {
    let ctx = canvas.getContext("2d");

    // console.log(screenNumber.value, blobsTypesNumber.value, totalBlobsNumber.value)

    canvas.width = window.innerWidth * Number(screenNumber.value);
    canvas.height = window.innerHeight * Number(screenNumber.value);


    let blobsTypes = createBlobTypes(Number(blobsTypesNumber.value));
    let blobs = createBlobs(Number(totalBlobsNumber.value));

    let simulationDistance = Number(simulationDistanceSlider.value);


    function drawBlob(x, y, radius, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    const blue = "blue";
    const red = "red";
    const green = "green";

    // let blobsTypes = [
    //     {
    //         index: 0,
    //         color: blue,
    //         meAttracts(obj) {
    //             return this.forceMeAttracts[obj.index];
    //         },
    //         thisAttracts(obj) {
    //             return this.forceThisAttracts[obj.index];
    //         },
    //         forceMeAttracts: [
    //             0.5,
    //         ],
    //         forceThisAttracts: [
    //             -0.5,
    //         ],
    //     },
    // ];

    function createBlobTypes(amount) {
        return new Array(amount).fill(0).map((v, index) => {
            return createBlobType({ index: index, force: blobForce(amount), size: 5 });
            // return createBlobType({ index: index, force: blobForce(amount), size: (Math.random() + 1) * 2.5 });
        });
    }

    function createBlobType({
        index = 0,
        color = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
        force = [],
        size = 5,
    }) {
        return {
            index,
            color,
            meAttracts(obj) {
                return this.force[obj.index];
            },
            thisAttracts(obj) {
                return obj.force[this.index];
            },
            force,
            size,
        };
    }

    function blobForce(amount) {
        return new Array(amount).fill(0).map(() => (Math.random() - 0.5) * 2);
    }

    function createBlobs(amount) {
        return new Array(amount).fill(0).map(() => createBlob());
    }

    function createBlob() {
        return {
            x: canvas.width * Math.random(),
            y: canvas.height * Math.random(),
            vel_x: 0,
            vel_y: 0,
            type: Math.round((blobsTypes.length - 1) * Math.random())
        };
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let gridSize = simulationDistance / 2;
        let grid = {};

        blobs.forEach(blob => {
            let gridX = Math.floor(blob.x / gridSize);
            let gridY = Math.floor(blob.y / gridSize);

            let key = `${gridX},${gridY}`;
            if (!grid[key]) grid[key] = [];
            grid[key].push(blob);
        });

        blobs.forEach(blob => {
            let gridX = Math.floor(blob.x / gridSize);
            let gridY = Math.floor(blob.y / gridSize);

            function applyForces(blob, otherBlob, dx, dy) {
                if (blob === otherBlob) return;

                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < blobsTypes[blob.type].size + blobsTypes[otherBlob.type].size) {
                    let force = -1.5 / distance;
                    blob.vel_x += force * dx / distance;
                    blob.vel_y += force * dy / distance;
                }

                if (distance < simulationDistance) {
                    let force = blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) / distance;
                    blob.vel_x += force * dx / distance;
                    blob.vel_y += force * dy / distance;
                }
            }

            // Check neighboring cells and account for wrapping
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let keyX = (gridX + i + Math.ceil(canvas.width / gridSize)) % Math.ceil(canvas.width / gridSize);
                    let keyY = (gridY + j + Math.ceil(canvas.height / gridSize)) % Math.ceil(canvas.height / gridSize);
                    let key = `${keyX},${keyY}`;
                    if (grid[key]) {
                        grid[key].forEach(otherBlob => {
                            const x = [
                                otherBlob.x - blob.x,
                                otherBlob.x - blob.x - canvas.width,
                                otherBlob.x - blob.x + canvas.width
                            ]
                            const xAbs = [
                                Math.abs(x[0]),
                                Math.abs(x[1]),
                                Math.abs(x[2])
                            ]

                            const y = [
                                otherBlob.y - blob.y,
                                otherBlob.y - blob.y - canvas.height,
                                otherBlob.y - blob.y + canvas.height
                            ]
                            const yAbs = [
                                Math.abs(y[0]),
                                Math.abs(y[1]),
                                Math.abs(y[2])
                            ]

                            applyForces(blob, otherBlob, x[xAbs.indexOf(Math.min(...xAbs))], y[yAbs.indexOf(Math.min(...yAbs))]);
                        });
                    }
                }
            }

            blob.vel_x *= 0.95;
            blob.vel_y *= 0.95;
        });

        blobs.forEach(blob => {
            blob.x += blob.vel_x;
            blob.y += blob.vel_y;

            if (blob.x > canvas.width) blob.x -= canvas.width;
            if (blob.x < 0) blob.x += canvas.width;
            if (blob.y > canvas.height) blob.y -= canvas.height;
            if (blob.y < 0) blob.y += canvas.height;

            drawBlob(blob.x, blob.y, blobsTypes[blob.type].size, blobsTypes[blob.type].color);
        });

        if (runs == _runs) {
            requestAnimationFrame(update);
        }
    }

    update();
}