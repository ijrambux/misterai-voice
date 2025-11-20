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
    stars.forEach(st => {
        ctx.fillStyle = "#00ffc8";
        ctx.fillRect(st.x, st.y, st.s, st.s);
        st.y += st.sp;
        if (st.y > canvas.height) {
            st.y = 0;
            st.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(animate);
}
animate();
