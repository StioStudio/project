let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth
canvas.height = window.innerHeight


function drawBlob(x, y, radius, color) {
    ctx.beginPath();
    ctx.fillStyle = color
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

const blue = "blue"
const red = "red"
const green = "green"

let blobsTypes = [
    {
        index: 0,
        color: blue,
        meAttracts(obj) {
            return this.forceMeAttracts[obj.index]
        },
        thisAttracts(obj) {
            return this.forceThisAttracts[obj.index]
        },
        forceMeAttracts: [
            0.5,
        ],
        forceThisAttracts: [
            -0.5,
        ],
    },
]

function createBlobTypes(amount) {
    return new Array(amount).fill(0).map((v, index, ary) => {
        return createBlobType({ index: index, force: blobForce(amount), size: 5 })
    })
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
            return this.force[obj.index]
        },
        thisAttracts(obj) {
            return obj.force[this.index]
        },
        force,
        size,
    }
}

function blobForce(amount) {
    return new Array(amount).fill(0).map((v, index, ary) => { return (Math.random() - 0.5) * 2 })
}

let blobs = [
    {
        x: 10,
        y: 10,
        vel_x: 0,
        vel_y: 0,
        type: blue
    }
]

function createBlobs(amount) {
    return new Array(amount).fill(0).map((v, index, ary) => {
        return createBlob()
    })
}

function createBlob() {
    return {
        x: ((canvas.width - 800) * Math.random()) + 400,
        y: ((canvas.height - 800) * Math.random()) + 400,
        vel_x: 0,
        vel_y: 0,
        type: Math.round((blobsTypes.length - 1) * Math.random())
    }
}


blobsTypes = createBlobTypes(8)
blobs = createBlobs(600)

let simulationDistance = 100

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    blobs.forEach((blob, index) => {
        blobs.forEach((otherBlob, otherIndex) => {
            function simBlob(xOffset, yOffset) {
                if (blob === otherBlob) return; // Ensure we are not comparing the blob to itself

                // Calculate the distance including offsets
                let distance = Math.sqrt((blob.x - (otherBlob.x + xOffset)) ** 2 + (blob.y - (otherBlob.y + yOffset)) ** 2);

                if (distance !== 0) {
                    // Check for repulsion or attraction forces within interaction distance
                    if (distance < blobsTypes[blob.type].size * 2) {
                        let x = (otherBlob.x + xOffset) - blob.x;
                        let y = (otherBlob.y + yOffset) - blob.y;

                        let force = -2 / distance; // Repulsion force
                        let vector = Math.atan2(y, x);

                        // Apply repulsion force
                        blob.vel_x += force * Math.cos(vector);
                        blob.vel_y += force * Math.sin(vector);
                    }

                    // Apply attraction or other forces within simulation distance
                    if (distance < simulationDistance) {
                        let x = (otherBlob.x + xOffset) - blob.x;
                        let y = (otherBlob.y + yOffset) - blob.y;

                        let force = blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) / distance;
                        let vector = Math.atan2(y, x);

                        // Apply attraction force
                        blob.vel_x += force * Math.cos(vector);
                        blob.vel_y += force * Math.sin(vector);
                    }
                }
            }

            // Normal force application
            simBlob(0, 0);

            // Overflow force application
            if (blob.x > canvas.width / 2) {
                simBlob(canvas.width, 0);  // Wrap around to the right
            } else {
                simBlob(-canvas.width, 0); // Wrap around to the left
            }

            if (blob.y > canvas.height / 2) {
                simBlob(0, canvas.height);  // Wrap around to the bottom
            } else {
                simBlob(0, -canvas.height); // Wrap around to the top
            }

        })

        blob.vel_x *= 0.95
        blob.vel_y *= 0.95
    })
    blobs.forEach((blob, index) => {
        blob.x += blob.vel_x
        blob.y += blob.vel_y

        if (blob.x > canvas.width) {
            blob.x -= canvas.width
        }
        if (blob.x < 0) {
            blob.x += canvas.width
        }
        if (blob.y > canvas.height) {
            blob.y -= canvas.height
        }
        if (blob.y < 0) {
            blob.y += canvas.height
        }

        drawBlob(blob.x, blob.y, blobsTypes[blob.type].size, blobsTypes[blob.type].color)
    })
    requestAnimationFrame(update)
}

update()