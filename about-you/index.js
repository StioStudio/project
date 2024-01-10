basicSetup()
await lastUpdated({path: "about-you/index.html", repo: "project"})

const display = document.querySelector(".display")

let meta = {}
document.querySelectorAll("output").forEach(e => {
    meta[e.getAttribute("name")] = e
})
function update(_name, _value) {
    meta[_name].elm.innerText = _value
}
async function addOutput(_name, _value) {
    display.insertAdjacentHTML("beforeend", `
    <div class="margin-8px">
        ${_name}: <output name="${_name.remove(" ", "/")}" class="output" type="text">...</output>
        <br>
    </div>`)
    const rem = display.querySelector(`.output[name="${_name.remove(" ", "/")}"]`)
    meta[_name] = {
        name: _name,
        elm: rem,
        value: "..."
    }
    if(typeof _value == "function") {
        _value(meta[_name].elm)
    }
    else {
        setTimeout(async ()=>{
            meta[_name].value = await _value
            meta[_name].elm.innerText = await _value
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
addOutput("App Version", navigator.appVersion)
addOutput("User Agent", navigator.userAgent)
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
addOutput("timezone", (await iss).timezone)
