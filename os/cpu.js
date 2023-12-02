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
            this.varWidth = width
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
            a1: {},
            a2: {},
            a3: {},
            b1: {},
            b3: {},
            c1: {},
            c2: {},
            c3: {},
        },
    }

    Object.entries(rem.resize).forEach(e => {    
        rem.resize[e[0]] = {
            content,
            element: document.createElement("div"),
            id: 0,
            varX: 0,
            varY: 0,
            remX: 0,
            remY: 0,
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
            remHeight: 0,
            remWidth: 0,
            drag: false,
            dragOffsetX: 0,
            dragOffsetY: 0,
            upDown: 0,
            rightLeft: 0,
        }
    });
    Object.entries(rem.resize).forEach(e => {
        // console.log(e[1])
        e[1].element.style = `height: 30px;
        width: 30px;
        position: absolute;
        background-color: gray;
        z-index: -1;`
        e[1].element.className = `resize resize-${e[0]}`
        rem.element.append(e[1].element)
    });
    // console.log(rem)
    rem.resize.a1.element.style.left = "0px"
    rem.resize.a1.element.style.top = "0px"
    rem.resize.a1.rightLeft = -1
    rem.resize.a1.upDown = -1
    rem.resize.a2.element.style.left = "30px"
    rem.resize.a2.element.style.top = "0px"
    rem.resize.a2.element.style.width = "calc(100% - 60px)"
    rem.resize.a2.rightLeft = 0
    rem.resize.a2.upDown = -1
    rem.resize.a3.element.style.right = "0px"
    rem.resize.a3.element.style.top = "0px"
    rem.resize.a3.rightLeft = 1
    rem.resize.a3.upDown = -1
    rem.resize.b1.element.style.left = "0px"
    rem.resize.b1.element.style.top = "30px"
    rem.resize.b1.element.style.height = "calc(100% - 60px)"
    rem.resize.b1.rightLeft = -1
    rem.resize.b1.upDown = 0
    rem.resize.b3.element.style.right = "0px"
    rem.resize.b3.element.style.top = "30px"
    rem.resize.b3.element.style.height = "calc(100% - 60px)"
    rem.resize.b3.rightLeft = 1
    rem.resize.b3.upDown = 0
    rem.resize.c1.element.style.left = "0px"
    rem.resize.c1.element.style.bottom = "0px"
    rem.resize.c1.rightLeft = -1
    rem.resize.c1.upDown = 1
    rem.resize.c2.element.style.left = "30px"
    rem.resize.c2.element.style.bottom = "0px"
    rem.resize.c2.element.style.width = "calc(100% - 60px)"
    rem.resize.c2.rightLeft = 0
    rem.resize.c2.upDown = 1
    rem.resize.c3.element.style.right = "0px"
    rem.resize.c3.element.style.bottom = "0px"
    rem.resize.c3.rightLeft = 1
    rem.resize.c3.upDown = 1
    
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
    border-radius: 0px 0px 3px 3px;
    overflow: hidden;`

    rem.element.append(rem.titleBar)
    rem.element.append(rem.contentBox)
        
    if(_append){content.append(rem.element)}

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
        e[1].element.addEventListener("pointerdown", (a)=>{
            // console.log(e)
            e[1].drag = true
            e[1].dragOffsetX = a.x - e[1].varX
            e[1].dragOffsetY = a.y - e[1].varY
            e[1].remY = e[1].varY
            e[1].remX = e[1].varX
            e[1].remHeight = rem.varHeight
            e[1].remWidth = rem.varWidth
        })
        e[1].content.addEventListener("pointermove", (a)=>{
            if(e[1].drag) {
                console.log(e[1].dragOffsetX, e[1].dragOffsetY)
                if(e[1].rightLeft == 1) {
                    rem.width(e[1].remWidth + a.x - e[1].dragOffsetX + e[1].varX)
                }
                if(e[1].upDown == 1) {
                    rem.height(e[1].remHeight + a.y - e[1].dragOffsetY + e[1].varY)
                }
                if(e[1].rightLeft == -1) {
                    rem.x(a.x + rem.dragOffsetX)
                    rem.width(e[1].remWidth - a.x + e[1].dragOffsetX + e[1].remX)
                }
                if(e[1].upDown == -1) {
                    rem.y(a.y + rem.dragOffsetY)
                    rem.height(e[1].remHeight - a.y + e[1].dragOffsetY + e[1].remY)
                }
            }
        })
        e[1].content.addEventListener("pointerup", (a)=>{
            e[1].drag = false
        })
    })

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

for (let index = 0; index < 1; index++) {
    runScript("./C/userscript.js")
}





























