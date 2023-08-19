function log(..._log){
    console.log(..._log);
}
let content = document.querySelector("body")

function dot(x, y, size, color, id) {
    let rem = document.createElement("div")
    rem.className = "id_" + id
    rem.style.position = "absolute"
    rem.style.left = x-size/2+innerWidth/2 + "px"
    rem.style.top = y-size/2+innerHeight/2 + "px"
    rem.style.width = size + "px"
    rem.style.height = size + "px"
    rem.style.backgroundColor = color
    rem.style.borderRadius = "50%"
    content.append(rem)
}
function createBall(x, y, size, xVel, yVel) {
    ball.push({
        x: x,
        y: y,
        xOld: x - xVel,
        yOld: y - yVel,
        size: size
    })
}
function eraseAll() {
    content.innerHTML = ""
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt(((x1-x2)**2)+((y1-y2)**2))
}
let ball = []
let subSteps = 20
let x, y, aCon, bCon, maxDis, dis = 0

let xGrav = 0
let yGrav = -1

function update(){
    for (aCon = 0; aCon < ball.length; aCon++) {
        x = ball[aCon].x
        y = ball[aCon].y
        
        ball[aCon].x = (x+(x-(ball[aCon].xOld)))-xGrav
        ball[aCon].y = (y+(y-(ball[aCon].yOld)))-yGrav
        
        ball[aCon].xOld = x
        ball[aCon].yOld = y
    }
    for (let i = 0; i < subSteps; i++) {
        for (aCon = 0; aCon < ball.length; aCon++) {
            maxDis = 300-ball[aCon].size/2
            let dis = distance(ball[aCon].x, ball[aCon].y, 0, 0)
            if (dis > maxDis) {
                ball[aCon].x = ball[aCon].x/dis*maxDis
                ball[aCon].y = ball[aCon].y/dis*maxDis
            }
        }
        for (aCon = 0; aCon < ball.length; aCon++) {
            for (bCon = 0; bCon < ball.length; bCon++) {
                if (aCon != bCon) {
                    maxDis = (ball[aCon].size+ball[bCon].size)/2
                    dis = distance(ball[aCon].x, ball[aCon].y, ball[bCon].x, ball[bCon].y)
                    if (dis < maxDis) {
                        x = ball[aCon].x - ball[bCon].x
                        y = ball[aCon].y - ball[bCon].y

                        ball[aCon].x = (ball[aCon].x) + ( (x / dis) * (0.5 * (maxDis-dis) ) )
                        ball[aCon].y = (ball[aCon].y) + ( (y / dis) * (0.5 * (maxDis-dis) ) )
                        ball[bCon].x = (ball[bCon].x) - ( (x / dis) * (0.5 * (maxDis-dis) ) )
                        ball[bCon].y = (ball[bCon].y) - ( (y / dis) * (0.5 * (maxDis-dis) ) )
                    }
                }
            }
        }
    }
}
function render() {
    dot(0, 0, 600, "#ffffff", "container")
    for (aCon = 0; aCon < ball.length; aCon++) {
        dot(ball[aCon].x, ball[aCon].y, ball[aCon].size, "#ff0000", aCon)
    }
}

function loop(e) {
    const sec = e / 1000
    
    eraseAll()
    update()
    render()
    
    
    requestAnimationFrame(loop)
}

loop(0)

addEventListener("keydown", (e)=>{
    if (e.key == " ") {
        createBall(0, 0, (Math.random() * 50), ((Math.random()-0.5) * 50), ((Math.random()-0.5) * 50))
    }
    if (e.key == "t") {
        console.log(ball)
    }
})