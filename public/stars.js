const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 2,
        sp: Math.random() * 2 + 0.5
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        ctx.fillStyle = "#00ffc8";
        ctx.fillRect(s.x, s.y, s.s, s.s);
        s.y += s.sp;
        if (s.y > canvas.height) s.y = 0;
    });
    requestAnimationFrame(animate);
}
animate();
