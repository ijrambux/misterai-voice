import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", socket => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", msg => {
        io.emit("receiveMessage", msg);
    });

    socket.on("voiceData", data => {
        socket.broadcast.emit("voiceData", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
