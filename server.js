const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {

    socket.on("chatMessage", data => {
        io.emit("chatMessage", data);
    });

    socket.on("voiceMessage", data => {
        io.emit("voiceMessage", data);
    });

});

http.listen(3000, () => console.log("🔥 Server running on port 3000"));

