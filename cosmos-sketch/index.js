const colorOptions = document.querySelector(".color-options")
const submit = document.querySelector(".submit")
const showHide = document.querySelector(".hide")
const box = document.querySelector(".box")

showHide.addEventListener("click", () => {
    box.classList.toggle("show")
    box.classList.value.includes("show") ? showHide.textContent = "HIDE" : showHide.textContent = "SHOW";
})

submit.addEventListener("click", runSimulation)

function addColorOption(_name) {
    const option = document.createElement("option")
    option.value = _name
    option.textContent = _name
    colorOptions.appendChild(option)
}

addColorOption("blue-red")
addColorOption("blue")
addColorOption("brown-green")
addColorOption("green")
addColorOption("red-yellow")

async function runSimulation() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function giveRandomPositionInsideOf(x1, y1, x2, y2) {
        return {
            x: Math.random() * (x2 - x1) + x1,
            y: Math.random() * (y2 - y1) + y1
        }
    }

    function randomTF() {
        return Math.random() > 0.5;
    }

    function random(from, to) {
        return Math.random() * (to - from) + from;
    }

    function beginPath() {
        ctx.beginPath();
    }

    function stroke(style) {
        if (style) ctx.strokeStyle = style;
        ctx.stroke();
    }

    function fill(style) {
        if (style) ctx.fillStyle = style;
        ctx.fill();
    }

    function lineWidth(width) {
        ctx.lineWidth = width;
    }

    function line(x1, y1, x2, y2) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }

    function circle(x, y, radius) {
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
    }

    function rect(x, y, width, height) {
        ctx.rect(x, y, width, height);
    }

    function point(x, y) {
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
    }

    function loop(times, callback) {
        for (let i = 0; i < times; i++) {
            callback(i);
        }
    }

    function color({ r = 0, g = r, b = g, a = 1 }) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function lerp(from, to, t) {
        return from + (to - from) * t;
    }


    let COLORS = await (await fetch(`colors/${colorOptions.value}.json`)).json()
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    COLORS = COLORS.map(hexToRgb);
    // console.log(COLORS);

    function randomColor(a = 1) {
        const rem = COLORS[Math.floor(Math.random() * COLORS.length)]
        return color({ r: rem.r, g: rem.r, b: rem.b, a });
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    for (let i = 0; i < COLORS.length; i++) {
        gradient.addColorStop(i / (COLORS.length - 1), color(COLORS[i]));
    }
    rect(0, 0, canvas.width, canvas.height);
    fill(gradient);

    loop(7, i => {
        const pos = giveRandomPositionInsideOf(0, 0, canvas.width, canvas.height);
        beginPath();
        circle(pos.x, pos.y, random(200, 400));
        fill(color({
            r: randomTF() ? 255 : 220,
            a: 20 / 255
        }));
    });

    loop(15, i => {
        const pos = giveRandomPositionInsideOf(0, 0, canvas.width, canvas.height);
        beginPath();
        circle(pos.x, pos.y, 40);
        lineWidth(2);
        stroke(randomColor(random(0, 1)));
    });

    loop(50, i => {
        const pos = giveRandomPositionInsideOf(20, 20, canvas.width - 20, canvas.height / 2);
        beginPath();
        point(pos.x, pos.y);
        lineWidth(3);
        stroke(randomColor(random(0, 1)));

        beginPath();
        ctx.lineCap = 'round';
        line(pos.x, pos.y - random(20, 40), pos.x, pos.y + random(20, 40));
        lineWidth(2);
        stroke(randomColor(random(0, 1)));
    });


    loop(10, i => {
        let randomPosition_a = giveRandomPositionInsideOf(0, 0, canvas.width, canvas.height);
        const from = {
            x: randomPosition_a.x,
            y: randomPosition_a.y,
            radius: 100
        };
        let randomPosition_b = giveRandomPositionInsideOf(0, 0, canvas.width, canvas.height);
        const to = {
            x: randomPosition_b.x + ((randomPosition_a.x - randomPosition_b.x) / 2),
            y: randomPosition_b.y + ((randomPosition_a.y - randomPosition_b.y) / 2),
            radius: 60
        };
        const steps = 30;
        // const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        // for (let i = 0; i < steps; i++) {
        //     const p = i / (steps - 1);
        //     const color = `rgba(${Math.floor(lerp(0, 255, p))}, ${Math.floor(lerp(0, 255, p))}, ${Math.floor(lerp(0, 255, p))}, ${0})`;
        //     gradient.addColorStop(p, color);
        // }
        ctx.fillStyle = gradient;
        beginPath();
        circle(from.x, from.y, from.radius);

        const COLOR = randomColor(20 / 255);

        fill(COLOR);
        for (let i = 0; i < steps; i++) {
            const p = i / (steps - 1);
            const x = lerp(from.x, to.x, p);
            const y = lerp(from.y, to.y, p);
            const radius = lerp(from.radius, to.radius, p);
            ctx.strokeStyle = gradient;
            beginPath();
            circle(x, y, radius);
            stroke(COLOR);
        }
    })

    loop(100, i => {
        const pos = giveRandomPositionInsideOf(100, 140, 120, canvas.height - 140);
        rectangleCallback(pos.x, pos.y, 20, 50);
    });
    loop(100, i => {
        const pos = giveRandomPositionInsideOf(canvas.width - 100, 140, canvas.width - 120, canvas.height - 140);
        rectangleCallback(pos.x, pos.y, 20, 50);
    });
    loop(100, i => {
        const pos = giveRandomPositionInsideOf(140, 100, canvas.width - 140, 120);
        rectangleCallback(pos.x, pos.y, 50, 20);
    });
    loop(100, i => {
        const pos = giveRandomPositionInsideOf(140, canvas.height - 100, canvas.width - 140, canvas.height - 120);
        rectangleCallback(pos.x, pos.y, 50, 20);
    });

    function rectangleCallback(x, y, w, h) {
        beginPath();
        rect(x, y, w, h);
        fill(randomColor(random(0, 0.2)));
    }
}

runSimulation();