const testDiv = document.createElement("div");
const content = document.querySelector(".content");
content.append(testDiv)

testDiv.style = "height: 400px; background-color: #ff0000;"

// Random code:
testDiv.addEventListener("click", (e)=>{
    testDiv.style = "height: 0px; background-color: transparent ;"
})