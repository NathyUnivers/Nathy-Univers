const canvas = document.getElementById("aurores");
const ctx = canvas.getContext("2d");

let temps = 0;

function redimensionner() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

redimensionner();

window.addEventListener("resize", () => {
    redimensionner();
    dessiner();
});

function dessinerVoile(yBase, amplitude, couleur1, couleur2, opacite) {

    ctx.save();

    const respiration = Math.sin(temps * 0.8 + yBase * 0.01) * amplitude;
    const derive = Math.sin(temps * 0.18 + yBase * 0.005) * 70;

    ctx.translate(derive, yBase + respiration);

    ctx.beginPath();

    ctx.moveTo(-150, 0);

    for (let x = -150; x <= canvas.width + 150; x += 8) {

        const y =
            Math.sin(x * 0.006 + temps * 0.45) * 28 +
            Math.sin(x * 0.013 - temps * 0.28) * 14 +
            Math.sin(x * 0.022 + temps * 0.12) * 8;

        ctx.lineTo(x, y);

    }

    for (let x = canvas.width + 150; x >= -150; x -= 8) {

        const y =
            Math.sin(x * 0.006 + temps * 0.45) * 28 +
            Math.sin(x * 0.013 - temps * 0.28) * 14 +
            Math.sin(x * 0.022 + temps * 0.12) * 8 +
            95;

        ctx.lineTo(x, y);

    }

    ctx.closePath();

    const voile = ctx.createLinearGradient(
        0, -40,
        0, 140
    );

    voile.addColorStop(0.00, `rgba(${couleur1},0)`);
    voile.addColorStop(0.20, `rgba(${couleur1},${opacite})`);
    voile.addColorStop(0.60, `rgba(${couleur2},${opacite * 0.8})`);
    voile.addColorStop(1.00, `rgba(${couleur2},0)`);

    ctx.fillStyle = voile;

    ctx.filter = "blur(55px)";

    ctx.fill();

    ctx.restore();

}

function dessiner() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    temps += 0.004;

    // Voile principal : turquoise
    dessinerVoile(
        canvas.height * 0.38,
        20,
        "40,255,255",
        "80,220,255",
        0.24
    );

    // Voile secondaire : turquoise bleuté / argent
    dessinerVoile(
        canvas.height * 0.53,
        15,
        "180,245,255",
        "255,255,255",
        0.12
    );

    // Voile supérieur : violet discret
    dessinerVoile(
        canvas.height * 0.25,
        28,
        "120,170,255",
        "170,90,255",
        0.10
    );

}

function animer() {

    dessiner();

    requestAnimationFrame(animer);

}

animer();