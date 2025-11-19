const express = require("express");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  console.log("User connected");

  ws.on("message", msg => {
    // إعادة بث الصوت لكل المستخدمين
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => console.log("User disconnected"));
});
