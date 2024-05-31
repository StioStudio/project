const number1x = document.querySelector("#number1x")
const number1y = document.querySelector("#number1y")
const inputType = document.querySelector("#inputType")
const number2x = document.querySelector("#number2x")
const number2y = document.querySelector("#number2y")
const output = document.querySelector("#output")

const test = document.createElement("input")

const num = {
    _1: {
        get x() {
            return Number(number1x.value)
        },
        get y() {
            return Number(number1y.value)
        },
    },
    _2: {
        get x() {
            return Number(number2x.value)
        },
        get y() {
            return Number(number2y.value)
        },
    },
    get type() {
        return inputType.value
    },    
}

number1x.addEventListener("change", (e)=>{
    update()
})
number1y.addEventListener("change", (e)=>{
    update()
})
number2x.addEventListener("change", (e)=>{
    update()
})
number2y.addEventListener("change", (e)=>{
    update()
})
inputType.addEventListener("change", (e)=>{
    update()
})

function update() {
    switch (num.type) {
        case "add":
            const addX = num._1.x + num._2.x
            const addY = num._1.y + num._2.y

            output.textContent = `x: ${addX} , y: ${addY}`
            break;
        case "sub":
            const subX = num._1.x - num._2.x
            const subY = num._1.y - num._2.y

            output.textContent = `x: ${subX} , y: ${subY}`
            break;
        case "mul":
            output.textContent = num._1.x * num._2.x + num._1.y * num._2.y
            break;
        case "del":
            output.textContent = num._1.x / num._2.x + num._1.y / num._2.y
            break;
    
        default:
            break;
    }
}