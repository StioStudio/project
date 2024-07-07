let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 2
canvas.height = window.innerHeight * 2


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
    let types = new Array(amount).fill(0).map((v, index, ary) => {
        let type = createBlobType()
        type.index = index
        type.force = blobForce(amount)
        return type
    })

    return types
}

function createBlobType(
    index = 0,
    color = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
    force = []
) {
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

blobsTypes = createBlobTypes(7)
// blobsTypes = [
//     createBlobType(0, red, [
//         0,
//         1
//     ]),
//     createBlobType(1, blue, [
//         -1,
//         0
//     ])
// ]

blobs = createBlobs(1000)

blobs.forEach((blob, index) => {
    blob.x += blob.vel_x
    blob.y += blob.vel_y
    drawBlob(blob.x, blob.y, 5, blobsTypes[blob.type].color)
})

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    blobs.forEach((blob, index) => {
        blobs.forEach((otherBlob, otherIndex) => {
            if (blob == otherBlob) return
            // let distance = Math.sqrt((blob.x - otherBlob.x) ** 2 + (blob.y - otherBlob.y) ** 2)
            // if (distance < 100 /*&& distance > 5*/) {
            //     let x = otherBlob.x - blob.x
            //     let y = otherBlob.y - blob.y
            //     let force = blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) / distance
            //     // console.log(force)
            //     let vector = Math.atan(x / y)
            //     vector *= 180 / Math.PI
            //     if (y < 0) vector += 180
            //     blob.vel_x += force * Math.cos(vector)
            //     blob.vel_y += force * Math.sin(vector)
            // }
            // let distance = Math.sqrt((blob.x - otherBlob.x) ** 2 + (blob.y - otherBlob.y) ** 2)
            // if (distance < 100) {
            //     let x = otherBlob.x - blob.x
            //     let y = otherBlob.y - blob.y
            //     // blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) gives the force between the 2 blobs. (-1 to 1)
            //     let force = blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) / distance
            //     let vector = Math.atan2(x / y)
            //     if (y < 0) vector += Math.PI
            //     blob.vel_x += force * Math.cos(vector)
            //     blob.vel_y += force * Math.sin(vector)
            // }

            let distance = Math.sqrt((blob.x - otherBlob.x) ** 2 + (blob.y - otherBlob.y) ** 2);

            if (distance !== 0) {
                if (distance < 10) {
                    let x = otherBlob.x - blob.x;
                    let y = otherBlob.y - blob.y;
                    
                    // blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) gives the force between the 2 blobs. (-1 to 1)
                    let force = -1 / distance;
                    
                    let vector = Math.atan2(y, x); // Correct way to calculate the angle
                    
                    // Apply force in the direction of the vector
                    blob.vel_x += force * Math.cos(vector);
                    blob.vel_y += force * Math.sin(vector);
                }
                else if (distance < 100) {
                    let x = otherBlob.x - blob.x;
                    let y = otherBlob.y - blob.y;
                    
                    // blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) gives the force between the 2 blobs. (-1 to 1)
                    let force = blobsTypes[blob.type].meAttracts(blobsTypes[otherBlob.type]) / distance;
                    
                    let vector = Math.atan2(y, x); // Correct way to calculate the angle
                    
                    // Apply force in the direction of the vector
                    blob.vel_x += force * Math.cos(vector);
                    blob.vel_y += force * Math.sin(vector);
                }
            }

            // else if (distance < 5) {
            //     let x = otherBlob.x - blob.x
            //     let y = otherBlob.y - blob.y
            //     let force = -0.1 / distance
            //     let vector = Math.atan(x / y)
            //     vector *= 180 / Math.PI
            //     if (x < 0) vector += 180
            //     // console.log(vector, blob.x, blob.y)
            //     blob.vel_x += force * Math.cos(vector)
            //     blob.vel_y += force * Math.sin(vector)
            // }
        })

        blob.vel_x *= 0.95
        blob.vel_y *= 0.95
    })
    blobs.forEach((blob, index) => {
        blob.x += blob.vel_x
        blob.y += blob.vel_y
        drawBlob(blob.x, blob.y, 5, blobsTypes[blob.type].color)
    })
    requestAnimationFrame(update)
}

requestAnimationFrame(update)
setTimeout(() => {
}, 1000)