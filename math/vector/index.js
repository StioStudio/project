(async () => {
    const number1x = document.querySelector("#number1x")
    const number1y = document.querySelector("#number1y")
    const inputType = document.querySelector("#inputType")
    const number2x = document.querySelector("#number2x")
    const number2y = document.querySelector("#number2y")
    const output = document.querySelector("#outputCor")

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
        get inputType() {
            return inputType.value
        }
    }

    number1x.addEventListener("change", (e) => {
        update()
    })
    number1y.addEventListener("change", (e) => {
        update()
    })
    number2x.addEventListener("change", (e) => {
        update()
    })
    number2y.addEventListener("change", (e) => {
        update()
    })
    inputType.addEventListener("change", (e) => {
        update()
    })

    function update() {
        switch (num.inputType) {
            case "add":
                const addX = num._1.x + num._2.x
                const addY = num._1.y + num._2.y

                output.textContent = `[${addX} , ${addY}]`
                break;
            case "sub":
                const subX = num._1.x - num._2.x
                const subY = num._1.y - num._2.y

                output.textContent = `[${subX} , ${subY}]`
                break;
            case "mul":
                output.textContent = num._1.x * num._2.x + num._1.y * num._2.y
                break;
            default:
                break;
        }
    }
})();

(async () => {
    const u = document.querySelector("#U")
    const v = document.querySelector("#V")
    const angle = document.querySelector("#angle")
    const output = document.querySelector("#outputSca")

    const test = document.createElement("input")

    const num = {
        get u() {
            return Number(u.value)
        },
        get v() {
            return Number(v.value)
        },
        get angle() {
            return Number(angle.value)
        },
        get inputType() {
            return inputType.value
        }
    }

    u.addEventListener("change", (e) => {
        update()
    })
    v.addEventListener("change", (e) => {
        update()
    })
    angle.addEventListener("change", (e) => {
        update()
    })

    function update() {
        output.textContent = num.u*num.v*Math.cos(num.angle / 180 * Math.PI)
    }
})()
