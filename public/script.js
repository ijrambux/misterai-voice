const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

let mediaRecorder;
let audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = e => {
    ws.send(e.data);
  };
});

document.getElementById("pttBtn").onmousedown = () => {
  audioChunks = [];
  mediaRecorder.start(100); // تسجيل كل 100ms
};

document.getElementById("pttBtn").onmouseup = () => {
  mediaRecorder.stop();
};

// استقبال الصوت وتشغيله
ws.onmessage = e => {
  const audioBlob = new Blob([e.data], { type: "audio/webm" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};
