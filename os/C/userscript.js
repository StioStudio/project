export default function({script, box, console}) {
    console.log(script, box)
    
    box.width(Math.random()*innerWidth)
    box.height(Math.random()*innerHeight)
    box.x(Math.random()*innerWidth)
    box.y(Math.random()*innerHeight)
    let rem = document.createElement("iframe")
    rem.src = "https://stio.studio"
    rem.style = "width: 100%; height: 100%;"
    box.contentBox.append(rem)

    // setTimeout(()=>{
    //     script.runScript("/userscript.js")
    // }, 5000)
}

export const settings = {
    type: "app"
}