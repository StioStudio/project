let rem;
let scriptCounter = 0
let boxCounter = 0
let content = document.querySelector("main#content.content")
let script = []
const _realConsole = console
const win = {}

const consoleOutput = (logAuthor = "[page]") => {
    const style = {
      // Remember to change these as well on cs.js
      leftPrefix: "background:  #24b0ff; color: white; border-radius: 0.5rem 0 0 0.5rem; padding: 0 0.5rem",
      rightPrefix:
        "background: #222; color: white; border-radius: 0 0.5rem 0.5rem 0; padding: 0 0.5rem; font-weight: bold",
      text: "",
    };
    return [`%cWindows%c${logAuthor}%c`, style.leftPrefix, style.rightPrefix, style.text];
}
win.createConsole = {
    log: (e) => _realConsole.log.bind(_realConsole, ...consoleOutput(e)),
}
const localConsole = {
    log: win.createConsole.log(`cpu`),
}
win.console = { ...console, ...localConsole }


function updateBox(box, boxElement = box.element) {
    boxElement.style.left = `${box.x}px`
    boxElement.style.top = `${box.y}px`
}
function newBox(_append = false) {
    const rem = {
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
        titleBar: {
            element: document.createElement("div"),
            tempButton: document.createElement("div"),
            dragBar: {
                element: document.createElement("div"),
            },
            addButton(element){

            },
            buttons: {
                hide: {},
                max_min: {},
                close: {},
            }
        },
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
        minHeight: 100,
        minWidth: 100,
    }
    // win.console.log(rem)
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
    rem.resize.a1.rightLeft = -1
    rem.resize.a1.upDown = -1
    rem.resize.a2.rightLeft = 0
    rem.resize.a2.upDown = -1
    rem.resize.a3.rightLeft = 1
    rem.resize.a3.upDown = -1
    rem.resize.b1.rightLeft = -1
    rem.resize.b1.upDown = 0
    rem.resize.b3.rightLeft = 1
    rem.resize.b3.upDown = 0
    rem.resize.c1.rightLeft = -1
    rem.resize.c1.upDown = 1
    rem.resize.c2.rightLeft = 0
    rem.resize.c2.upDown = 1
    rem.resize.c3.rightLeft = 1
    rem.resize.c3.upDown = 1

    Object.entries(rem.resize).forEach(e => {
        e[1].element.className = `resize resize-${e[0]} resizeRL${e[1].rightLeft} resizeUD${e[1].upDown}`
        rem.element.append(e[1].element)
    })
    
    rem.element.className = "box"
    rem.element.id = `box-${boxCounter}`
    rem.id = boxCounter
    
    rem.titleBar.element.className = "titleBar"
    rem.titleBar.dragBar.element.className = "dragBar"
    rem.titleBar.element.append(rem.titleBar.dragBar.element)

    Object.entries(rem.titleBar.buttons).forEach(e => {    
        console.log(e)
        e[1].element = document.createElement("div")
        e[1].element.className = `${e[0]} titleBarButton`
        rem.titleBar.element.append(e[1].element)
    })
    
    let rem_a = document.createElement("div")
    rem_a.className = "hideItem1"
    rem.titleBar.buttons.hide.element.append(rem_a.cloneNode(true))
    rem.titleBar.buttons.hide.toggle = true
    rem.titleBar.buttons.hide.click = ()=>{
        rem.titleBar.buttons.hide.toggle = !rem.titleBar.buttons.hide.toggle
        console.log(rem.titleBar.buttons.hide.toggle)
        if(rem.titleBar.buttons.hide.toggle) {
            rem.element.style.display = "block"
        }
        else {
            rem.element.style.display = "none"
        }
    }
    rem.titleBar.buttons.hide.element.addEventListener("click", rem.titleBar.buttons.hide.click)
    document.addEventListener("keydown", rem.titleBar.buttons.hide.click)
    rem_a.className = "closeItem1"
    rem.titleBar.buttons.close.element.append(rem_a.cloneNode(true))
    rem_a.className = "closeItem2"
    rem.titleBar.buttons.close.element.append(rem_a.cloneNode(true))
    rem_a.className = "max_minItem1"
    rem.titleBar.buttons.max_min.element.append(rem_a.cloneNode(true))

    rem.contentBox.className = "contentBox"
    rem.element.append(rem.titleBar.element)
    rem.element.append(rem.contentBox)
        
    if(_append){content.append(rem.element)}

    rem.titleBar.dragBar.element.addEventListener("pointerdown", (e)=>{
        rem.drag = true
        rem.dragOffsetX = e.x - rem.varX
        rem.dragOffsetY = e.y - rem.varY
        rem.element.setPointerCapture(e.pointerId)
    })
    rem.content.addEventListener("pointermove", (e)=>{
        if(rem.drag) {
            rem.x(e.x - rem.dragOffsetX)
            rem.y(e.y - rem.dragOffsetY)
        }
    })
    rem.content.addEventListener("pointerup", (e)=>{
        rem.drag = false
        rem.element.releasePointerCapture(e.pointerId)
    })

    Object.entries(rem.resize).forEach(e => {    
        e[1].element.addEventListener("pointerdown", (a)=>{
            // console.log(e)
            e[1].drag = true
            e[1].dragOffsetX = a.x - rem.varX
            e[1].dragOffsetY = a.y - rem.varY
            e[1].remX = rem.varX
            e[1].remY = rem.varY
            e[1].remWidth = rem.varWidth
            e[1].remHeight = rem.varHeight
            rem.element.setPointerCapture(a.pointerId)
            // win.console.log(e)
        })
        e[1].content.addEventListener("pointermove", (a)=>{
            if(e[1].drag) {
                const point = {
                    x: a.x,
                    y: a.y,
                }
                // console.log(e[1].remX + e[1].remWidth - rem.minWidth, e[1].remY + e[1].remHeight - rem.minHeight)
                if(e[1].rightLeft == 1) {
                    if(e[1].remWidth + point.x - e[1].dragOffsetX - e[1].remX > rem.minWidth) {
                        rem.width(e[1].remWidth + point.x - e[1].dragOffsetX - e[1].remX)
                    }
                    else {
                        rem.width(rem.minWidth)
                    }
                }
                if(e[1].upDown == 1) {
                    if(e[1].remHeight + point.y - e[1].dragOffsetY - e[1].remY > rem.minHeight) {
                        rem.height(e[1].remHeight + point.y - e[1].dragOffsetY - e[1].remY)
                    }
                    else {
                        rem.height(rem.minHeight)
                    }
                }
                if(e[1].rightLeft == -1) {
                    if(e[1].remWidth - a.x + e[1].remX > rem.minWidth) {
                        rem.width(e[1].remWidth - a.x + e[1].remX)
                        rem.x(point.x)
                    }
                    else {
                        rem.width(rem.minWidth)
                        rem.x(e[1].remX + e[1].remWidth - rem.minWidth)
                    }
                }
                if(e[1].upDown == -1) {
                    if(e[1].remHeight - a.y + e[1].remY > rem.minHeight) {
                        rem.height(e[1].remHeight - a.y + e[1].remY)
                        rem.y(point.y)
                    }
                    else {
                        rem.height(rem.minHeight)
                        rem.y(e[1].remY + e[1].remHeight - rem.minHeight)
                    }
                }
            }
        })
        e[1].content.addEventListener("pointerup", (a)=>{
            e[1].drag = false
            rem.element.releasePointerCapture(a.pointerId)
        })
    })

    boxCounter++
    return rem
}

// let hi = "./hello/hi.js"
// [].toString()
// "".replace(",", "/")
async function runScript(scriptURL, {giveInfo = {}} = {}) {
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
        runScriptLocal(e){runScript(`${this.info.scriptFolderPath}${e}`)},
        runScript,
        updateBox,
        giveInfo,
    }
    
    let rem = newBox(true)
    
    // move to newBox MW
    // document.createElement("div").addEventListener("click")

    // windowsConsole.logAuthor = `${module.settings.type}: ${scriptCounter}, ${scriptInfo.info.scriptId}`
    const localConsole = {
        log: win.createConsole.log(`${module.settings.type}: ${scriptCounter}, ${scriptInfo.info.scriptId}`),
    }
    script[scriptCounter] = {
        script: scriptInfo,
        console: { ...console, ...localConsole },
        box: rem,
    }
    
    module.default(script[scriptCounter])
    
    scriptCounter++
}

for (let index = 0; index < 1; index++) {
    runScript("./C/runScripts.js", {giveInfo: {scriptOrWebsite: "script"}})
}