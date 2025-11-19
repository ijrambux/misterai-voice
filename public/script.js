const socket = io();

// إرسال رسالة
function sendMessage() {
    const input = document.getElementById("msgInput");
    if (input.value.trim() !== "") {
        socket.emit("sendMessage", input.value);
        input.value = "";
    }
}

// استقبال رسالة
socket.on("receiveMessage", msg => {
    document.getElementById("messages").innerHTML += `<p>💬 ${msg}</p>`;
});

// تسجيل صوت وارساله
let mediaRecorder;
let chunks = [];

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
        chunks.push(e.data);
        const blob = new Blob(chunks, { type: "audio/webm" });
        chunks = [];

        blob.arrayBuffer().then(buffer => {
            socket.emit("voiceData", buffer);
        });
    };
});

document.getElementById("voiceBtn").onmousedown = () => {
    mediaRecorder.start(200);
};

document.getElementById("voiceBtn").onmouseup = () => {
    mediaRecorder.stop();
};

// تشغيل الصوت عند وصوله
socket.on("voiceData", buffer => {
    const blob = new Blob([buffer], { type: "audio/webm" });
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
});

