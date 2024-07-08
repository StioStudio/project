let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

function drawBlob(x, y, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

const blue = "blue";
const red = "red";
const green = "green";

let blobsTypes = [
    {
        index: 0,
        color: blue,
        meAttracts(obj) {
            return this.forceMeAttracts[obj.index];
        },
        thisAttracts(obj) {
            return this.forceThisAttracts[obj.index];
        },
        forceMeAttracts: [
            0.5,
        ],
        forceThisAttracts: [
            -0.5,
        ],
    },
];

function createBlobTypes(amount) {
    return new Array(amount).fill(0).map((v, index) => {
        return createBlobType({ index: index, force: blobForce(amount), size: 5 });
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
        // x: ((canvas.width - 800) * Math.random()) + 400,
        // y: ((canvas.height - 800) * Math.random()) + 400,
        vel_x: 0,
        vel_y: 0,
        type: Math.round((blobsTypes.length - 1) * Math.random())
    };
}

blobsTypes = createBlobTypes(10);
let blobs = createBlobs(3000);

let simulationDistance = 100;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let gridSize = simulationDistance/2;
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

            if (distance < blobsTypes[blob.type].size * 2) {
                let force = -2 / distance;
                let vector = Math.atan2(dy, dx);
                blob.vel_x += force * Math.cos(vector);
                blob.vel_y += force * Math.sin(vector);
            }

            if (distance < simulationDistance) {
                let force = blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) / distance;
                let vector = Math.atan2(dy, dx);
                blob.vel_x += force * Math.cos(vector);
                blob.vel_y += force * Math.sin(vector);
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
                        applyForces(blob, otherBlob, otherBlob.x - blob.x, otherBlob.y - blob.y);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x + canvas.width, otherBlob.y - blob.y);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x - canvas.width, otherBlob.y - blob.y);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x, otherBlob.y - blob.y + canvas.height);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x, otherBlob.y - blob.y - canvas.height);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x + canvas.width, otherBlob.y - blob.y + canvas.height);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x - canvas.width, otherBlob.y - blob.y + canvas.height);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x + canvas.width, otherBlob.y - blob.y - canvas.height);
                        applyForces(blob, otherBlob, otherBlob.x - blob.x - canvas.width, otherBlob.y - blob.y - canvas.height);
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

    requestAnimationFrame(update);
}

update();
