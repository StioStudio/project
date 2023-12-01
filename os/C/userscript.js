export default function({script, box, console}) {
    console.log(script, box)
    
    box.width(Math.random()*500)
    box.height(Math.random()*500)
    box.x(Math.random()*innerWidth)
    box.y(Math.random()*innerHeight)

    // setTimeout(()=>{
    //     script.runScript("/userscript.js")
    // }, 5000)
}

export const settings = {
    type: "app"
}