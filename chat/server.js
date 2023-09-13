const io = require("socket.io")(3000)

io.on("connection", socket => {
    socket.emit("chat-message", "hello")
})