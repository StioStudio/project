document.querySelector(".input-1").value = 1
document.querySelector(".input-2").value = 6
document.querySelector(".input-3").value = 9

let input = {
    a: document.querySelector(".input-1").value,
    b: document.querySelector(".input-2").value,
    c: document.querySelector(".input-3").value
}

code()

addEventListener("change", ()=>{
    setTimeout(code, 10)
})

function code(){
    input = {
        a: document.querySelector(".input-1").value,
        b: document.querySelector(".input-2").value,
        c: document.querySelector(".input-3").value
    }
    let rem = (sumOgProdukt(input.a - 0, input.b - 0, input.c - 0))
    console.log(rem)
    document.querySelector(".output-1").innerHTML = rem[0]
    document.querySelector(".output-2").innerHTML = rem[1]
}

function sumOgProdukt(a, b, c) {
    return [
        (((-b) + Math.sqrt((b**2) - (4*a*c))) / (2*a)),
        (((-b) - Math.sqrt((b**2) - (4*a*c))) / (2*a))
    ]
}