let content = document.querySelector(".content")
let project_json = await(await fetch("./music/projects.json")).json()
let project = []

project_json.forEach(e => {
    let rem = new DOMParser().parseFromString(`
    <video controls="" autoplay="" name="media">
        <source src="http://localhost:8000/project/music-player/music/${e[0]}" type="audio/${e[1]}">
    </video>`
    , "text/html").querySelector("video")
    project.push(rem)
})
let audioPlay = 0
let lastAudioPlay = 0

let bt1 = new DOMParser().parseFromString(`<button class="btn btn-1"></button>`, "text/html").querySelector("button")
content.append(bt1)
setAudioPlay(0)
content.append(project[audioPlay])
let bt2 = new DOMParser().parseFromString(`<button class="btn btn-2"></button>`, "text/html").querySelector("button")
content.append(bt2)

bt1.addEventListener("click", (e)=>{
    last()
})

bt2.addEventListener("click", (e)=>{
    next()
})

function changeAudioContent(){
    content.querySelector("video").replaceWith(project[audioPlay])
    project[audioPlay].play()
}

function setAudioPlay(_num) {
    lastAudioPlay = audioPlay
    audioPlay = _num
}

function next() {
    if(audioPlay < project.length - 1) {
        setAudioPlay(audioPlay + 1)
        changeAudioContent()
    }
}
function last() {
    if(audioPlay > 0) {
        setAudioPlay(audioPlay - 1)
        changeAudioContent()
    }
}

// project.forEach(e => {
//     e.addEventListener("canplaythrough", (event) => {
//         content.append(e)
//         e.play()
//     });
// })