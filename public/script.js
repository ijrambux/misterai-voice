const socket = io();

const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const users = document.getElementById("users");
const talkBtn = document.getElementById("talkBtn");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPanel = document.getElementById("emojiPanel");
const speakingStatus = document.getElementById("speakingStatus");

// اسم عشوائي
const username = "MisterAI_" + Math.floor(Math.random() * 9999);
socket.emit("join", username);

// تحديث قائمة المتصلين
socket.on("users", list => {
    users.innerHTML = "";
    list.forEach(u => users.innerHTML += `<li>👤 ${u}</li>`);
});

// إرسال رسالة
sendBtn.onclick = () => {
    if (msgInput.value.trim() !== "") {
        socket.emit("chatMessage", msgInput.value);
        msgInput.value = "";
    }
};

// استقبال رسالة
socket.on("chatMessage", data => {
    messages.innerHTML += `<p><strong>${data.user}:</strong> ${data.msg}</p>`;
    messages.scrollTop = messages.scrollHeight;
});

// ===== لوحة الإيموجي =====
emojiBtn.onclick = () => {
    emojiPanel.classList.toggle("hidden");
};

emojiPanel.querySelectorAll("*").forEach(em => {
    em.onclick = () => {
        msgInput.value += " " + em.innerText;
        emojiPanel.classList.add("hidden");
    };
});

// ===== الصوت Push-To-Talk =====
let recorder;
let chunks = [];

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        chunks = [];
        socket.emit("voice", blob);
        socket.emit("stopSpeaking", username);
    };
});

// بداية التحدث
talkBtn.onmousedown = () => {
    talkBtn.classList.add("recording");
    recorder.start();
    socket.emit("speaking", username);
};

// توقف التحدث
talkBtn.onmouseup = () => {
    talkBtn.classList.remove("recording");
    recorder.stop();
};

// تشغيل صوت الآخرين
socket.on("voice", blob => {
    new Audio(URL.createObjectURL(blob)).play();
});

// إظهار المتحدث
socket.on("speaking", user => {
    speakingStatus.innerHTML = `🎤 ${user} يتحدث الآن...`;
});

// إخفاء الإشارة
socket.on("stopSpeaking", () => {
    speakingStatus.innerHTML = "";
});
