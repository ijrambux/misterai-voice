import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = [];

io.on("connection", socket => {
    
    socket.on("join", user => {
        socket.userName = user;
        users.push(user);

        io.emit("systemMessage", `🔵 ${user} انضم إلى الدردشة`);
        io.emit("updateUsers", users);
    });

    socket.on("sendMessage", data => {
        io.emit("receiveMessage", data);
    });

    socket.on("voiceData", data => {
        socket.broadcast.emit("voiceData", data);
    });

    socket.on("disconnect", () => {
        if (socket.userName) {
            users = users.filter(u => u !== socket.userName);
            io.emit("systemMessage", `🔴 ${socket.userName} غادر الدردشة`);
            io.emit("updateUsers", users);
        }
    });
});

server.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
