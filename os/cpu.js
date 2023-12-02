let rem;
let scriptCounter = 0
let boxCounter = 0
let content = document.querySelector("main#content.content")

function updateBox(box, boxElement = box.element) {
    boxElement.style.left = `${box.x}px`
    boxElement.style.top = `${box.y}px`
}
function newBox(_append = false) {
    let rem = {
        content,
        element: document.createElement("div"),
        id: 0,
        varX: 0,
        varY: 0,
        x(x){
            this.element.style.left = `${x}px`
            this.varX = x
        },
        y(y){
            this.element.style.top = `${y}px`
            this.varY = y
        },
        varWidth: 0,
        varHeight: 0,
        width(width){
            this.element.style.width = `${width}px`
            this.width = width
        },
        height(height){
            this.element.style.height = `${height}px`
            this.varHeight = height
        },
        drag: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        titleBar: document.createElement("div"),
        contentBox: document.createElement("div"),
        resize: {
            a1: document.createElement("div"),
            a2: document.createElement("div"),
            a3: document.createElement("div"),
            b1: document.createElement("div"),
            b3: document.createElement("div"),
            c1: document.createElement("div"),
            c2: document.createElement("div"),
            c3: document.createElement("div"),
        },
    }

    Object.entries(rem.resize).forEach(e => {
        // console.log(e[1])
        e[1].style = `height: 30px;
        width: 30px;
        position: absolute;
        background-color: gray;
        z-index: -1;`
        e[1].className = `resize resize-${e[0]}`
        rem.element.append(e[1])
    });
    rem.resize.a1.style.left = "0px"
    rem.resize.a1.style.top = "0px"
    rem.resize.a2.style.left = "30px"
    rem.resize.a2.style.top = "0px"
    rem.resize.a2.style.width = "calc(100% - 60px)"
    rem.resize.a3.style.right = "0px"
    rem.resize.a3.style.top = "0px"
    rem.resize.b1.style.left = "0px"
    rem.resize.b1.style.top = "30px"
    rem.resize.b1.style.height = "calc(100% - 60px)"
    rem.resize.b3.style.right = "0px"
    rem.resize.b3.style.top = "30px"
    rem.resize.b3.style.height = "calc(100% - 60px)"
    rem.resize.c1.style.left = "0px"
    rem.resize.c1.style.bottom = "0px"
    rem.resize.c2.style.left = "30px"
    rem.resize.c2.style.bottom = "0px"
    rem.resize.c2.style.width = "calc(100% - 60px)"
    rem.resize.c3.style.right = "0px"
    rem.resize.c3.style.bottom = "0px"
    
    rem.element.className = "box"
    rem.element.style = `left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    background-color: black;
    position: absolute;
    border-radius: 8px;
    overflow: hidden;
    padding: 5px;
    z-index: -1;`
    rem.element.id = `box-${boxCounter}`
    rem.id = boxCounter
    
    rem.titleBar.className = "titleBar"
    rem.titleBar.style = `height: 30px;
    width: 100%;
    background-color: red;
    border-radius: 3px 3px 0px 0px;`

    rem.contentBox.className = "contentBox"
    rem.contentBox.style = `height: calc(100% - 30px);
    width: 100%;
    background-color: blue;
    border-radius: 0px 0px 3px 3px;`

    rem.element.append(rem.titleBar)
    rem.element.append(rem.contentBox)
        
    if(_append){content.append(rem.element)}
    boxCounter++
    return rem
}

const consoleOutput = (logAuthor = "[page]") => {
    const style = {
      // Remember to change these as well on cs.js
      leftPrefix: "background:  #24b0ff; color: white; border-radius: 0.5rem 0 0 0.5rem; padding: 0 0.5rem",
      rightPrefix:
        "background: #222; color: white; border-radius: 0 0.5rem 0.5rem 0; padding: 0 0.5rem; font-weight: bold",
      text: "",
    };
    return [`%cWindows%c${logAuthor}%c`, style.leftPrefix, style.rightPrefix, style.text];
};

let script = []
let windowsConsole = {
    logAuthor: "cpu",
    log(...e){console.log.bind(console, ...consoleOutput(this.logAuthor), ...e)()}
}

// let hi = "./hello/hi.js"
// [].toString()
// "".replace(",", "/")
async function runScript(scriptURL) {
    const [module] = await Promise.all([
        import(scriptURL)
    ]);

    let scriptInfo = {
        settings: module.settings,
        info: {
            scriptCounter,
            scriptURL,
            scriptFolderPath: scriptURL.split("/").slice(0, scriptURL.split("/").length - 1).toString().replace(",", "/"),
            scriptId: scriptURL.split("/")[scriptURL.split("/").length -1],
        },
        runScript(e){runScript(`${this.info.scriptFolderPath}${e}`)},
        updateBox,
    }
    
    let rem = newBox(true)
    
    // move to newBox MW
    // document.createElement("div").addEventListener("click")
    rem.titleBar.addEventListener("pointerdown", (e)=>{
        rem.drag = true
        rem.dragOffsetX = e.x - rem.varX
        rem.dragOffsetY = e.y - rem.varY
    })
    rem.content.addEventListener("pointermove", (e)=>{
        if(rem.drag) {
            rem.x(e.x - rem.dragOffsetX)
            rem.y(e.y - rem.dragOffsetY)
        }
    })
    rem.content.addEventListener("pointerup", (e)=>{
        rem.drag = false
    })

    Object.entries(rem.resize).forEach(e => {
        e[1].addEventListener("click", (a)=>{
            console.log(e)
        })
    })

    windowsConsole.logAuthor = `${module.settings.type}: ${scriptCounter}, ${scriptInfo.info.scriptId}`
    const localConsole = windowsConsole
    script[scriptCounter] = {
        script: scriptInfo,
        console: {...console, ...localConsole},
        box: rem,
    }
    windowsConsole.logAuthor = "cpu"
    
    module.default(script[scriptCounter])
    
    scriptCounter++
}

for (let index = 0; index < 3; index++) {
    runScript("./C/userscript.js")
}





























