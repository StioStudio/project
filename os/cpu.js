const testDiv = document.createElement("div")
testDiv.style.height = "100%"
document.body.append(testDiv)
function onSpace(_func){
    addEventListener("keydown", (e)=>{
        if(e.key == " "){
            _func(e)
        }
    })
}
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
    error: (e) => _realConsole.error.bind(_realConsole, ...consoleOutput(e)),
}
const localConsole = {
    log: win.createConsole.log(`cpu`),
    error: win.createConsole.error(`cpu`),
}
win.console = { ...console, ...localConsole }
let url = new URL(document.location.href)
let path = url.pathname.split("/")
if(path[path.length-1] == "index.html") {
    path.pop()
    path.shift()
}
// win.console.log(path)
// testDiv.style.bottom
let isType = {
    script: [
        "script",
        "js",
        "javascript",
    ],
    website: [
        "website",
        "html",
    ]
}
onSpace(()=>{
    win.console.log(...script)
})
let rem;
let scriptCounter = 0
let boxCounter = 0
let content = {
    element: document.querySelector("main#content.content"),
    display: {
        getNumber(e, _orientation = "height"){
            if(e instanceof HTMLElement){
                return e.getBoundingClientRect()[_orientation]
            }
            if(typeof e == "number"){
                return e
            }
            win.console.error(e, "is wrong")
        },
        height(){
            let rem = 0;
            this.top.forEach((e)=>{
                rem += this.getNumber(e)
            })
            this.bottom.forEach((e)=>{
                rem += this.getNumber(e)
            })
            return rem
        },
        width(){
            let rem = 0;
            this.left.forEach((e)=>{
                rem += this.getNumber(e, "width")
            })
            this.right.forEach((e)=>{
                console.log(e)
                rem += this.getNumber(e, "width")
            })
            return rem
        },
        topInterrupted(){
            let rem = 0;
            this.top.forEach((e)=>{
                rem += this.getNumber(e)
            })
            return rem
        },
        bottomInterrupted(){
            let rem = 0;
            this.bottom.forEach((e)=>{
                rem += this.getNumber(e)
            })
            return rem
        },
        leftInterrupted(){
            let rem = 0;
            this.left.forEach((e)=>{
                rem += this.getNumber(e)
            })
            return rem
        },
        rightInterrupted(){
            let rem = 0;
            this.right.forEach((e)=>{
                rem += this.getNumber(e)
            })
            return rem
        },
        top: [testDiv],
        bottom: [100],
        left: [],
        right: [],
        addDisplayInterrupter(place, length){
            if(!["top", "bottom", "left", "right"].includes(place))return win.console.error(place, "is not a valid place")
            this[place].push(length)
        }
    },
}
// setTimeout(()=>{
//     content.display.addDisplayInterrupter("top", 10)
//     console.log(content.display.height())
// }, 2000)
// content.display.addDisplayInterrupter("top", 10)
// console.log(content.display.height())

let script = []

async function getIpAddress(){
    return (await(await fetch("https://api64.ipify.org/?format=json")).json()).ip
}
function foreverLoop(_stop, _func) {
    const _loop = (e)=>{
        // console.log(!script[_stop].script.stop, _stop)
        if(!script[_stop].script.stop){
            _func(e)
            requestAnimationFrame(_loop)
        }
    }
    requestAnimationFrame(_loop)
}
function getFileById(fileId) {
    // MW
    win.console.error("MW")
}
function newBox(_append = false, {classList = []} = {}) {
    const rem = {
        content: content.element,
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
        hide(bool = true){
            if(bool) {
                rem.element.style.display = "none"
            }
            else {
                rem.element.style.display = "block"
            }    
        },
        show(bool = true){
            if(bool) {
                rem.element.style.display = "block"
            }
            else {
                rem.element.style.display = "none"
            }    
        },
    }

    rem.element.className = `box ${classList.join(" ")}`
    rem.element.id = `box-${boxCounter}`
    rem.id = boxCounter

    if(_append){content.element.append(rem.element)}

    boxCounter++
    return rem
}
function newWindow(_append = false, {_scriptCounter} = {}) {
    const rem = {
        content: content.element,
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
        hide(bool = true){
            if(bool) {
                rem.element.style.display = "none"
            }
            else {
                rem.element.style.display = "block"
            }    
        },
        show(bool = true){
            if(bool) {
                rem.element.style.display = "block"
            }
            else {
                rem.element.style.display = "none"
            }
        },
        max(bool = true){
            this.width(innerWidth-10)
            this.height(innerHeight-10)
            this.x(0)
            this.y(0) 
        },
        close(_scriptCounter){
            if(!(typeof _scriptCounter == "number")){win.console.error("_scriptCounter needs a number. You gave: ", _scriptCounter);return}
            if(isType.script.includes(script[_scriptCounter].script.type)){
                script[_scriptCounter].script.stop = true
            }
            // console.log(script, _scriptCounter)
            // document.createElement("div").
            script[_scriptCounter].box.element.remove()
            script[_scriptCounter] = {
                script: {
                    stop: true
                }
            }
            // console.log(script)
        },
    }
    // win.console.log(rem)
    Object.entries(rem.resize).forEach(e => {    
        rem.resize[e[0]] = {
            content: content.element,
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
        // console.log(e)
        e[1].element = document.createElement("div")
        e[1].element.className = `${e[0]} titleBarButton`
        rem.titleBar.element.append(e[1].element)
    })
    
    let rem_a = document.createElement("div")
    rem_a.className = "hideItem1"
    rem.titleBar.buttons.hide.element.append(rem_a.cloneNode(true))
    // rem.titleBar.buttons.hide.toggle = false
    // rem.titleBar.buttons.hide.click = ()=>{
    //     rem.titleBar.buttons.hide.toggle = true
    //     rem.hide(rem.titleBar.buttons.hide.toggle)
    // }
    rem_a.className = "closeItem1"
    rem.titleBar.buttons.close.element.append(rem_a.cloneNode(true))
    rem_a.className = "closeItem2"
    rem.titleBar.buttons.close.element.append(rem_a.cloneNode(true))
    rem_a.className = "max_minItem1"
    rem.titleBar.buttons.max_min.element.append(rem_a.cloneNode(true))

    if(typeof _scriptCounter == "number"){
        rem.titleBar.buttons.hide.element.addEventListener("click", ()=>{rem.hide()})
        rem.titleBar.buttons.max_min.element.addEventListener("click", ()=>{rem.max()})
        rem.titleBar.buttons.close.element.addEventListener("click", ()=>{rem.close(_scriptCounter)})
        addEventListener("keydown", (e)=>{if (e.key == " "){rem.show()}})
    }

    rem.contentBox.className = "contentBox"
    rem.element.append(rem.titleBar.element)
    rem.element.append(rem.contentBox)
        
    if(_append){content.element.append(rem.element)}

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
    rem.width(innerWidth-10)
    rem.height(innerHeight-10)
    rem.x(0)
    rem.y(0)
    rem.minHeight = 150
    rem.minWidth = 300

    boxCounter++
    return rem
}

function urlHandler(_url) {
    let url = _url
    if(_url.slice(0, 2) == "./") {
        url = path + _url.slice(2, _url.length)
    }
    return url
}

// let hi = "./hello/hi.js"
// [].toString()
// "".replace(",", "/")
async function runScript(scriptURL, {giveInfo = {}, type = "script", iframe = true} = {}) {
    let _path = scriptURL.split("/").slice(0, scriptURL.split("/").length - 1)
    _path.shift()
    
    let scriptInfo = {
        settings: undefined,
        info: {
            script: undefined,
            scriptCounter,
            scriptURL,
            scriptFolderPath: path.concat(_path),
            scriptId: scriptURL.split("/")[scriptURL.split("/").length -1],
        },
        giveInfo,
        runScriptLocal(e){runScript(`${this.info.scriptFolderPath}${e}`)},
        runScript,
        getFileById,
        newBox,
        newWindow,
        foreverLoop: (_func) => foreverLoop(scriptInfo.info.scriptCounter, _func),
        stop: false,
        type,
        _realConsole,
        getIpAddress,
    }
    scriptCounter++

    if(isType.script.includes(type)){
        const [module] = await Promise.all([
            import(scriptURL)
        ]);
                
        scriptInfo.settings = module.settings
        scriptInfo.info.script = module
        // console.log(scriptInfo)

        // move to newBox MW
        // document.createElement("div").addEventListener("click")

        // windowsConsole.logAuthor = `${module.settings.type}: ${scriptCounter}, ${scriptInfo.info.scriptId}`
        const localConsole = {
            log: win.createConsole.log(`${module.settings.type}: ${scriptInfo.info.scriptCounter}, ${scriptInfo.info.scriptId}`),
            error: win.createConsole.error(`${module.settings.type}: ${scriptInfo.info.scriptCounter}, ${scriptInfo.info.scriptId}`),
        }
        script[scriptInfo.info.scriptCounter] = {
            script: scriptInfo,
            console: { ...console, ...localConsole },
        }
        if(module.settings.type == "app") {
            let rem = newWindow(true, {_scriptCounter: scriptInfo.info.scriptCounter})
            script[scriptInfo.info.scriptCounter].box = rem
        }
        if(module.settings.type == "script") {
            script[scriptInfo.info.scriptCounter].content = content.element
        }


        module.default(script[scriptInfo.info.scriptCounter])
    }
    if(isType.website.includes(type)){
        let rem = newWindow(true, {_scriptCounter: scriptInfo.info.scriptCounter})
        if(iframe) {
            let rem_a = document.createElement("iframe")
            rem_a.src = scriptURL
            rem_a.style = "width: 100%; height: 100%; border: 0;"
            rem.contentBox.append(rem_a)
        }
        else {
            // console.log(scriptURL)
            rem.contentBox.innerHTML = await(await fetch(scriptURL)).text()
        }
        const localConsole = {
            log: win.createConsole.log(`${type}: ${scriptInfo.info.scriptCounter}, ${scriptInfo.info.scriptId}`),
            error: win.createConsole.error(`${type}: ${scriptInfo.info.scriptCounter}, ${scriptInfo.info.scriptId}`),
        }
        script[scriptInfo.info.scriptCounter] = {
            script: scriptInfo,
            console: { ...console, ...localConsole },
            box: rem,
        }
    }
}

// for (let index = 0; index < 1; index++) {
// }

// runScript("./C/systemApps/taskBar.js", {giveInfo: {scriptOrWebsite: "script"}})
runScript("./C/systemApps/runScripts.js", {giveInfo: {scriptOrWebsite: "script"}})
// runScript("https://stio.studio", {type: "html"})

// addEventListener("keydown", (e)=>{
//     win.console.log(script)
// })