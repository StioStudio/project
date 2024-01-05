info.language = info.language.cookie
basicSetup()
await lastUpdated({path: "index.html", repo: "project"})
// let rem = await(await fetch("/assets/projects.json")).json()
let rem = await(await fetch("./projects.json")).json()
contentCreate(rem)