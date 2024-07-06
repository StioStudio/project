import { secondTokenizer, tokenizer } from "./comp.js"

let text = document.createElement("div")
text = document.querySelector('div.text')

text.innerText = localStorage.getItem("text")
render()

function update() {
    localStorage.setItem("text", text.innerText)
    requestAnimationFrame(update)
}
update()

document.querySelector("input").addEventListener("click", render)

function render() {
    let v = text.innerText
    let o = text.cloneNode(true)
    o.innerHTML = ""
    let tokens = secondTokenizer(tokenizer(v))
    // console.clear()
    console.log(...tokens)
    // tokens.push({ token_type: "Newline", lexeme: "\n" })
    // console.log(tokens)
    let index = 0
    while (!(!(v.length > 0) || (tokens[index] == undefined) )) {
        console.log(tokens[index])
        let token = tokens[index].lexeme
        // console.log(v, v.length, token)
        v = v.slice(token.length, v.length)

        let color = tokenColor(tokens[index])
        let elm = createColoredElm(color)
        if (elm == "black") {
            elm = token
        }
        else {
            elm.innerText = token
        }
        o.append(elm)
        index++
    }
    text.replaceWith(o)
    text = document.querySelector('div.text')
    // text.textContent = value.slice(0, value.selectionStart) + "|" + value.slice(value.selectionStart, value.length)
    // text.textContent = value
}

function createColoredElm(color) {
    let elm = document.createElement("span")
    elm.style.color = color
    return elm
}

function tokenColor(token) {
    switch (token.token_type) {
        case "Identifier":
            return "#ff0000a0"
        case "String":
            return "#008000a0"
        case "NumberLiteral":
        case "Type":
            return "#ffff00b0"
        case "Colon": 
        case "Plus":
        case "Minus":
        case "Star":
        case "Slash":
        case "Equal":
            return "#0000ffb0"
        case "LeftParen":
        case "RightParen":
        case "LeftCurBra":
        case "RightCurBra":
        case "Comma":
        case "Semicolon":
            return "#800080a0"
        case "Comment":
            return "#d3d3d3a0"
        default:
            return "black"
    }
}