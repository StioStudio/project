basicSetup()
await lastUpdated({path: "about-you/index.html", repo: "project"})

const display = document.querySelector(".display")

let outputs = {}
document.querySelectorAll("output").forEach(e => {
    outputs[e.getAttribute("name")] = e
})
function update(_name, _value) {
    outputs[_name].elm.innerText = _value
}
async function addOutput(_name, _value, {isLink = false} = {}) {
    const output = isLink ? `
    <div class="margin-8px">
        <a name="${_name.remove(" ", "/")}" href="${_value}">${_name}</a>
        <br>
    </div>`
    : `
    <div class="margin-8px">
        ${_name}: <output name="${_name.remove(" ", "/")}" class="output" type="text">...</output>
        <br>
    </div>`

    display.insertAdjacentHTML("beforeend", output)
    const rem = display.querySelector(`[name="${_name.remove(" ", "/")}"]`)
    outputs[_name] = {
        name: _name,
        elm: rem,
        value: "..."
    }
    if(typeof _value == "function") {
        _value(outputs[_name].elm)
    }
    else {
        setTimeout(async ()=>{
            outputs[_name].value = await _value
            if(!isLink)outputs[_name].elm.innerText = await _value
        })
    }
    return rem
}

addOutput("IP Address", info.ipAddress)
addOutput("Inner Height", `${innerHeight}px`)
addOutput("Inner Width", `${innerWidth}px`)
addOutput("Outer Height", `${outerHeight}px`)
addOutput("Outer Width", `${outerWidth}px`)
addOutput("URL/link", location)
addOutput("Languages", navigator.languages)
addOutput("Cookie Enabled?", navigator.cookieEnabled)
addOutput("Logical processors available", navigator.hardwareConcurrency)
addOutput("Device Memory", navigator.deviceMemory)
addOutput("Network type", navigator.connection.effectiveType)
addOutput("Battery charging", (await navigator.getBattery()).charging)
addOutput("Battery chargingTime", (await navigator.getBattery()).chargingTime == Infinity ? Infinity : `${(await navigator.getBattery()).chargingTime / 60}min`)
addOutput("Battery dischargingTime", (await navigator.getBattery()).dischargingTime == Infinity ? Infinity : `${(await navigator.getBattery()).dischargingTime / 60}min`)
addOutput("Battery level", `${(await navigator.getBattery()).level * 100}%`)
const iss = new Promise(async (resolve, reject) => {
    resolve((await(await fetch("https://info.stio.studio/")).json()))
})
addOutput("asOrganization", (await iss).asOrganization)
addOutput("asn", (await iss).asn)
addOutput("colo", (await iss).colo)
addOutput("continent", (await iss).continent)
addOutput("country", (await iss).country)
addOutput("latitude", (await iss).latitude)
addOutput("longitude", (await iss).longitude)
addOutput("Google maps link", `https://www.google.com/maps/place/${(await iss).latitude}+${(await iss).longitude}`, {isLink: true})
addOutput("timezone", (await iss).timezone)

addOutput("App Version", navigator.appVersion)
addOutput("User Agent", navigator.userAgent)
const _UAParser = new UAParser()
addOutput("Browser", _UAParser.getBrowser().name)
addOutput("Browser version", _UAParser.getBrowser().version)
addOutput("CPU", _UAParser.getCPU().architecture)
addOutput("Device model", _UAParser.getDevice().model)
addOutput("Device type", _UAParser.getDevice().type)
addOutput("Device vendor", _UAParser.getDevice().vendor)
addOutput("Engine", _UAParser.getEngine().name)
addOutput("Engine version", _UAParser.getEngine().version)
addOutput("OS", _UAParser.getOS().name)
addOutput("OS version", _UAParser.getOS().version)







