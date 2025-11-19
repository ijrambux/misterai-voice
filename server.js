const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    maxHttpBufferSize: 1e8
});

app.use(express.static("public"));

let users = [];

io.on("connection", socket => {

    socket.on("join", username => {
        socket.username = username;
        users.push(username);
        io.emit("users", users);
    });

    socket.on("chatMessage", msg => {
        io.emit("chatMessage", { user: socket.username, msg });
    });

    socket.on("voice", blob => {
        io.emit("voice", blob);
    });

    socket.on("speaking", user => {
        io.emit("speaking", user);
    });

    socket.on("stopSpeaking", user => {
        io.emit("stopSpeaking", user);
    });

    socket.on("disconnect", () => {
        users = users.filter(u => u !== socket.username);
        io.emit("users", users);
    });

});

http.listen(3000, () => console.log("🔥 Server running on :3000"));

