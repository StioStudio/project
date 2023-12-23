export default async function({script, box, console}) {
    // console.log(script)
    box.width(innerWidth-10)
    box.height(innerHeight-10)
    box.x(0)
    box.y(0)
    box.minHeight = 150
    box.minWidth = 300
    // document.createElement("div").addEventListener("click", (e)=>{
    //     console.log(e)
    // })
    if(script.giveInfo.scriptOrWebsite == "script") {
        // rem.src = "./C/runScripts.html"
        let rem = await (await fetch("./C/systemApps/assets/runScripts.html")).text()
        const parser = new DOMParser();
        rem = parser.parseFromString(rem, 'text/html').querySelector("html")
        // console.log(rem)
        box.contentBox.append(rem)
        
        box.contentBox.querySelector(".scriptButton").addEventListener("click", (e)=>{
            // console.log(box.contentBox.querySelector(".input").value)
            script.runScript(box.contentBox.querySelector(".input").value, {giveInfo: {
                scriptOrWebsite: "script"
            }})
        })    
        box.contentBox.querySelector(".websiteButton").addEventListener("click", (e)=>{
            script.runScript("./C/systemApps/runScripts.js", {giveInfo: {
                scriptOrWebsite: "website",
                websiteURL: box.contentBox.querySelector(".input").value
            }})
        })    
    }
    else {
        let rem = document.createElement("iframe")
        rem.src = script.giveInfo.websiteURL
        rem.style = "width: 100%; height: 100%; border: 0;"
        box.contentBox.append(rem)
    }
        // setTimeout(()=>{
            //     script.runScript("/userscript.js")
    // }, 5000)
}

export const settings = {
    type: "app"
}