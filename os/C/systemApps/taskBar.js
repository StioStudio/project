export default async function({script, content, console}) {
    // console.log(content)

    let taskBar = script.newBox(true, {classList: ["hi", "wow"]})
    taskBar.element.style.bottom = "0px"
    taskBar.element.style.top = "auto"
    taskBar.element.style.width = "100%"
    taskBar.element.style.height = "50px"
    taskBar.element.style.padding = "0px"
    taskBar.element.style.borderRadius = "0"
    taskBar.element.style.backgroundColor = "#281e24"
    taskBar.element.style.zIndex = 1
    content.append(taskBar.element)
    // Contine MW
    // console.log(script.foreverLoop)
    
}
export const settings = {
    type: "script",
}