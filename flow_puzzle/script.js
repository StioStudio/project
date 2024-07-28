const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const size = {
    get width() {
        return canvas.width
    },
    set width(value) {
        canvas.width = value
    },
    get rWidth() {
        return tableWidth * 100 / canvas.width
    },
    get height() {
        return canvas.height
    },
    set height(value) {
        canvas.height = value
    },
    get rHeight() {
        return tableHeight * 100 / canvas.height
    },
    get ratio() {
        return Math.max(this.rHeight, this.rWidth)
    },
}

const hide = document.querySelector(".hide");
const box = document.querySelector(".box");

hide.addEventListener("click", () => {
    box.classList.toggle("show")
    box.classList.value.includes("show") ? hide.textContent = "HIDE" : hide.textContent = "SHOW";
})

const tableHeightNumber = document.querySelector(".table-height-number")
const tableHeightSlider = document.querySelector(".table-height-slider")
const tableWidthNumber = document.querySelector(".table-width-number")
const tableWidthSlider = document.querySelector(".table-width-slider")
const colorOptions = document.querySelector(".color-options")
const newColorInput = document.querySelector(".new-color-input")
const newColorSubmit = document.querySelector(".new-color-submit")
const colorShowBox = document.querySelector(".color-show-box")

const clearLines = document.querySelector(".clear-lines")
const clearBlobs = document.querySelector(".clear-blobs")
const solve = document.querySelector(".solve")
const isSolved = document.querySelector(".is-solved")

clearLines.addEventListener("click", () => {
    lines = []
})
clearBlobs.addEventListener("click", () => {
    table = []
    updateTable({ _tableWidth: Number(tableWidthNumber.value), _tableHeight: Number(tableHeightNumber.value) })
})

let tableWidth = 0
let tableHeight = 0

let table = []
function updateTable({ _tableWidth, _tableHeight }) {
    if (_tableWidth) tableWidth = _tableWidth
    if (_tableHeight) tableHeight = _tableHeight


    canvas.width = Math.min(100 * tableWidth, innerWidth)
    canvas.height = Math.min(100 * tableHeight, innerHeight)

    const ratio = size.ratio

    canvas.width = Math.min(100 / ratio * tableWidth, innerWidth)
    canvas.height = Math.min(100 / ratio * tableHeight, innerHeight)

    for (let i = 0; i < tableWidth; i++) {
        if (!table[i]) table[i] = []
        for (let j = 0; j < tableHeight; j++) {
            if (!table[i][j]) table[i][j] = 0
        }

    }
}

updateTable({ _tableWidth: 4, _tableHeight: 4 })

tableHeightNumber.addEventListener("change", (e) => {
    tableHeightSlider.value = e.target.value
    updateTable({ _tableHeight: Number(e.target.value) })
})
tableHeightSlider.addEventListener("input", (e) => {
    tableHeightNumber.value = e.target.value
    updateTable({ _tableHeight: Number(e.target.value) })
})
tableWidthNumber.addEventListener("change", (e) => {
    tableWidthSlider.value = e.target.value
    updateTable({ _tableWidth: Number(e.target.value) })
})
tableWidthSlider.addEventListener("input", (e) => {
    tableWidthNumber.value = e.target.value
    updateTable({ _tableWidth: Number(e.target.value) })
})

function newColor(color) {
    let option = document.createElement("option")
    option.value = color
    option.textContent = color
    colorOptions.appendChild(option)
    return option
}

colorOptions.addEventListener("change", (e) => {
    colorShowBox.style.backgroundColor = colorOptions.value
})

newColorSubmit.addEventListener("click", (e) => {
    newColor(newColorInput.value)
    colorOptions.value = newColorInput.value
    newColorInput.value = ""
})

newColor("delete")
newColor("red")
newColor("green")
newColor("blue")
newColor("yellow")

colorShowBox.style.backgroundColor = colorOptions.value

let lines = []

for (let i = 0; i < tableWidth; i++) {
    table[i] = []
    for (let j = 0; j < tableHeight; j++) {
        table[i][j] = 0
    }
}

table[0][0] = {
    color: "red"
}
table[3][0] = {
    color: "red"
}
table[0][1] = {
    color: "green"
}
table[3][1] = {
    color: "green"
}

// lines.push({
//     from: [0, 1],
//     to: [1, 1],
//     color: "green"
// })
// lines.push({
//     from: [1, 1],
//     to: [2, 1],
//     color: "green"
// })
// lines.push({
//     from: [2, 1],
//     to: [3, 1],
//     color: "green"
// })
// lines.push({
//     from: [0, 0],
//     to: [1, 0],
//     color: "red"
// })
// lines.push({
//     from: [1, 0],
//     to: [2, 0],
//     color: "red"
// })
// lines.push({
//     from: [2, 0],
//     to: [3, 0],
//     color: "red"
// })

canvas.addEventListener("pointerup", (e) => {
    let squareX = Math.floor((e.x - canvas.offsetLeft) / 100 * size.ratio)
    let squareY = Math.floor((e.y - canvas.offsetTop) / 100 * size.ratio)

    if (tableHeight - 1 < squareY || tableWidth - 1 < squareX) return
    if (colorOptions.value === "delete") {
        table[squareX][squareY] = 0
    }
    else {
        table[squareX][squareY] = {
            color: colorOptions.value
        }
    }
})

function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Squares and blobs
    for (let i = 0; i < tableWidth; i++) {
        for (let j = 0; j < tableHeight; j++) {
            ctx.fillStyle = 'black'
            ctx.fillRect(i * 100 / size.ratio + 2 / size.ratio, j * 100 / size.ratio + 2 / size.ratio, 96 / size.ratio, 96 / size.ratio)

            if (table[i][j] != 0) {
                ctx.fillStyle = table[i][j].color
                ctx.beginPath()
                ctx.arc(i * 100 / size.ratio + 50 / size.ratio, j * 100 / size.ratio + 50 / size.ratio, 25 / size.ratio, 0, 2 * Math.PI)
                ctx.fill()
            }

        }
    }

    // Lines
    for (let i = 0; i < lines.length; i++) {
        ctx.strokeStyle = lines[i].color
        ctx.lineWidth = 20 / size.ratio
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(lines[i].from[0] * 100 / size.ratio + 50 / size.ratio, lines[i].from[1] * 100 / size.ratio + 50 / size.ratio)
        ctx.lineTo(lines[i].to[0] * 100 / size.ratio + 50 / size.ratio, lines[i].to[1] * 100 / size.ratio + 50 / size.ratio)
        ctx.stroke()
    }

    requestAnimationFrame(draw)
}
draw()


const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0]  // up
];

const isValidMove = (grid, x, y, color, visited) => {
    return x >= 0 && y >= 0 && x < tableWidth && y < tableHeight &&
           (grid[x][y] === 0 || grid[x][y] === color) &&
           !visited[x][y];
};

const solvePuzzle = (grid, colorPositions, colorIndex = 0, lines = []) => {
    if (colorIndex >= colorPositions.length) {
        // Check if the entire grid is filled
        for (let i = 0; i < tableWidth; i++) {
            for (let j = 0; j < tableHeight; j++) {
                if (grid[i][j] === 0) return false;
            }
        }
        return true;
    }

    const { start, end, color } = colorPositions[colorIndex];
    let visited = Array.from({ length: tableWidth }, () => Array(tableHeight).fill(false));
    return backtrack(grid, start[0], start[1], end, color, colorPositions, colorIndex, visited, lines);
};

const backtrack = (grid, x, y, end, color, colorPositions, colorIndex, visited, lines) => {
    if (x === end[0] && y === end[1]) {
        // Recurse for the next color
        return solvePuzzle(grid, colorPositions, colorIndex + 1, lines);
    }

    visited[x][y] = true;

    for (const [dx, dy] of directions) {
        const nx = x + dx, ny = y + dy;

        if (isValidMove(grid, nx, ny, color, visited)) {
            grid[nx][ny] = color;
            lines.push({ from: [x, y], to: [nx, ny], color });

            if (backtrack(grid, nx, ny, end, color, colorPositions, colorIndex, visited, lines)) {
                return true;
            }

            grid[nx][ny] = 0; // Backtrack
            lines.pop(); // Remove the last line segment
        }
    }

    visited[x][y] = false;
    return false;
};

const findColorPositions = (table) => {
    const positions = {};
    for (let i = 0; i < tableWidth; i++) {
        for (let j = 0; j < tableHeight; j++) {
            const cell = table[i][j];
            if (cell !== 0) {
                const { color } = cell;
                if (!positions[color]) {
                    positions[color] = { color, start: [i, j], end: null };
                } else {
                    positions[color].end = [i, j];
                }
            }
        }
    }
    return Object.values(positions);
};

const algorithm = () => {
    const grid = Array.from({ length: tableWidth }, () => Array(tableHeight).fill(0));
    const colorPositions = findColorPositions(table);

    for (const { start, color } of colorPositions) {
        grid[start[0]][start[1]] = color;
    }

    lines = [];
    if (solvePuzzle(grid, colorPositions, 0, lines)) {
        // console.log('Solution found:', grid);
        isSolved.innerHTML = "Solution found"
        // console.log('Lines:', lines);
        // Update your visualization with the lines array
        drawLines(lines);
    } else {
        isSolved.innerHTML = "No solution found"
        // console.log('');
    }
};

const drawLines = (lines) => {
    // Clear existing lines
    lines.forEach(line => {
        // Drawing logic here
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 20 / size.ratio;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(line.from[0] * 100 / size.ratio + 50 / size.ratio, line.from[1] * 100 / size.ratio + 50 / size.ratio);
        ctx.lineTo(line.to[0] * 100 / size.ratio + 50 / size.ratio, line.to[1] * 100 / size.ratio + 50 / size.ratio);
        ctx.stroke();
    });
};


solve.addEventListener('click', () => {
    try {
        algorithm();
    } catch (error) {
        isSolved.innerHTML = "Error!"
    }
})