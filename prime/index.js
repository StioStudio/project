const primeNum = []
var number = 1

var timeUpdater = Date.now()

const update = async () => {
    number++
    const sqrtNum = Math.sqrt(number)
    var i = 0;
    if (await new Promise((resolve, reject) => {
        while (true) {
            if (number % primeNum[i] == 0) {
                resolve(false)
                return
            }
            if (sqrtNum <= primeNum[i] || primeNum[i] == undefined) {
                resolve(true)
                return
            }
            i++
        }
    })
    ) {
        primeNum.push(number)
    }
    if (timeUpdater + 1000 < Date.now()) {
        timeUpdater = Date.now()
        requestAnimationFrame(update)
    }
    else {
        update()
    }
}
update()

const time = Date.now()

const log = document.querySelector(".log")
log.addEventListener("click", () => {
    console.log(primeNum, Date.now() - time)
})

const download = document.querySelector(".download")
download.addEventListener("click", async () => {
    const blob = new Blob([primeNum.join('\n')], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prime.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
})