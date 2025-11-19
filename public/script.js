const socket = io();

// إرسال رسالة
function sendMessage() {
    const input = document.getElementById("msgInput");
    if (input.value.trim() === "") return;

    socket.emit("sendMessage", input.value);
    input.value = "";
}

// استقبال رسالة
socket.on("receiveMessage", msg => {
    document.getElementById("messages").innerHTML += `<p>💬 ${msg}</p>`;
});

// تسجيل صوت وإرساله
let recorder;
let chunks = [];

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => {
        chunks.push(e.data);
        const blob = new Blob(chunks, { type: "audio/webm" });
        chunks = [];

        blob.arrayBuffer().then(buffer => {
            socket.emit("voiceData", buffer);
        });
    };
});

const btn = document.getElementById("voiceBtn");

btn.onmousedown = () => recorder.start(300);
btn.onmouseup = () => recorder.stop();

// استقبال صوت وتشغيله
socket.on("voiceData", buffer => {
    const blob = new Blob([buffer], { type: "audio/webm" });
    new Audio(URL.createObjectURL(blob)).play();
});
