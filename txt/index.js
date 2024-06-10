const download = queryselector("#hello")
document.documentElement.addEventListener("click", async () => {
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