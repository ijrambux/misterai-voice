const socket = io();

let userName = "Mister AI 🤖";
let recorder;
let chunks = [];

// عند الدخول
socket.emit("join", userName);

// تحديث قائمة المستخدمين
socket.on("updateUsers", users => {
    const usersList = users.map(u => `• ${u}`).join("<br>");
    document.getElementById("users").innerHTML = `<strong>المتصلون:</strong><br>${usersList}`;
});

// إرسال رسالة كتابية
function sendMessage() {
    const input = document.getElementById("msgInput");
    if (input.value.trim() === "") return;

    socket.emit("sendMessage", { user: userName, msg: input.value });
    input.value = "";
}

// استقبال رسالة
socket.on("receiveMessage", data => {
    const { user, msg } = data;
    document.getElementById("messages").innerHTML +=
        `<p><strong>${user}:</strong> ${msg}</p>`;
});

// إشعارات النظام
socket.on("systemMessage", msg => {
    document.getElementById("messages").innerHTML += `<p class="system">${msg}</p>`;
});

// تفعيل المايك
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

// استقبال صوت
socket.on("voiceData", buffer => {
    const blob = new Blob([buffer], { type: "audio/webm" });
    new Audio(URL.createObjectURL(blob)).play();
});
