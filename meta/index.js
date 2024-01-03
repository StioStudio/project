basicSetup()
await lastUpdated({path: "meta/index.html", repo: "project"})
const metaDisplay = document.querySelector(".metatags-display")
updateMeta()
document.querySelectorAll(".meta").forEach(a => {
    a.addEventListener("input", () => {
        updateMeta()
    })
})
function updateMeta() {
    let meta = {}
    document.querySelectorAll(".meta").forEach(e => {
        meta[e.getAttribute("name")] = e.value
    })
    // console.log(meta)

    metaDisplay.innerText = `<title>${meta.Title}</title>
    <meta property='og:title' content='${meta.Title}'/>
    <meta property='og:description' content="${meta.Description}"/>
    
    <meta name="language" content="${meta.Language}">
    
    <meta name="og:type" content="${meta.Type}"/>
    
    <meta name="owner" content="${meta.Owner}">
    <meta name="author" content="${meta.Author}">
    <meta name="reply-to" content="${meta.Email}">
    <meta name="og:email" content="${meta.Email}"/>
    <meta name="og:country-name" content="${meta.Country}"/>
    
    <link rel="icon" href="${meta.Icon}" type="image/x-icon" sizes="any"/>
    <link rel="shortcut icon" href="${meta.Icon}" type="image/x-icon" sizes="any"/>
    
    <meta property='og:image' content='${meta.Image}'/>
    <meta property='og:image:secure_url' content='${meta.Image}'/>
    <meta property='og:image:type' content='image/${meta.ImageType}'/>
    <meta property='og:image:width' content='${meta.Width}'/>
    <meta property='og:image:height' content='${meta.Height}'/>
    <meta property='og:image:alt' content="${meta.ImageAlt}"/>
    
    <meta name="keywords" content="${meta.Keywords}"/>`
}

async function clipboard({_type = "img"}, _content) {
    try {
        let data = _content
        if (_type == "img") {
            data = await fetch(_content);
            data = await data.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [data.type]: data,
                }),
            ]);
        }
        if (_type == "text") {
            navigator.clipboard.writeText(data)
        }
    } catch (err) {
        console.error(err.name, err.message);
    }
}

// document.createElement("div").addEventListener("click", ()=>{})
document.querySelector(".copyMetatags").addEventListener("click", ()=>{
    clipboard({_type: "text"}, metaDisplay.innerText)
})