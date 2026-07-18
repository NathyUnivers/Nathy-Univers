/* ==========================================
   FORÊT VIVANTE
   Bloc 1 : Initialisation
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const foret = document.getElementById("foret-vivante");

    if (!foret) return;

    const smartphone = window.innerWidth <= 768;

    /* ---------- Positions disponibles ---------- */

    const positionsForetPC = [

        { x: 14, y: 72 },
        { x: 22, y: 60 },
        { x: 31, y: 44 },
        { x: 38, y: 68 },
        { x: 46, y: 55 },
        { x: 55, y: 37 },
        { x: 61, y: 63 },
        { x: 69, y: 48 },
        { x: 77, y: 69 },
        { x: 84, y: 56 },
        { x: 89, y: 42 }

    ];

    const positionsForetMobile = [

    { x: 18, y: 22 },
    { x: 30, y: 18 },
    { x: 45, y: 24 },
    { x: 60, y: 20 },
    { x: 75, y: 18 },

    { x: 22, y: 34 },
    { x: 38, y: 38 },
    { x: 55, y: 36 },
    { x: 70, y: 34 },

    { x: 48, y: 48 },
    { x: 78, y: 46 }

];

    const margeGauche = [

        { x: 3, y: 28 },
        { x: 6, y: 72 },
        { x: 8, y: 50 },
        { x: 10, y: 82 }

    ];

    const margeDroite = [

        { x: 92, y: 22 },
        { x: 95, y: 48 },
        { x: 97, y: 74 },
        { x: 93, y: 88 },
        { x: 90, y: 36 }

    ];

    const positionsForet = smartphone ? positionsForetMobile : positionsForetPC;

    console.log("🌿 Forêt Vivante initialisée");


/* ==========================================
   FORÊT VIVANTE
   Bloc 2 : Création des lucioles
========================================== */

    function creerLuciole(position, couleur, zone = "foret") {

        const luciole = document.createElement("div");

        luciole.classList.add("firefly");
        luciole.classList.add(couleur);

        luciole.style.left = position.x + "%";
        luciole.style.top = position.y + "%";

        /* Taille aléatoire */

        const tailleBase = 4 + Math.random() * 3;
        const taille = zone === "marge" ? tailleBase * 0.9 : tailleBase;

        luciole.style.width = taille + "px";
        luciole.style.height = taille + "px";

        /* Animation légèrement différente */

        luciole.style.animationDuration =
            (3 + Math.random() * 3) + "s";

        foret.appendChild(luciole);

    }

    /* ---------- Création des lucioles ---------- */

const image = document.querySelector(".hero-image");

if (smartphone && image) {

    const rect = image.getBoundingClientRect();
    const hero = foret.getBoundingClientRect();

    // 14 lucioles réparties dans l'image
    for (let i = 0; i < 14; i++) {

        const luciole = document.createElement("div");

        const couleurs = ["gold", "gold", "gold", "silver", "blue"];

        luciole.classList.add("firefly");
        luciole.classList.add(
            couleurs[Math.floor(Math.random() * couleurs.length)]
        );

        const x = rect.left - hero.left + Math.random() * rect.width;
        const y = rect.top - hero.top + Math.random() * rect.height;

        luciole.style.left = x + "px";
        luciole.style.top = y + "px";

        const taille = 4 + Math.random() * 3;

        luciole.style.width = taille + "px";
        luciole.style.height = taille + "px";

        luciole.style.animationDuration =
            (3 + Math.random() * 3) + "s";

        foret.appendChild(luciole);
    }

} else {

    positionsForet
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .forEach(position => {

            creerLuciole(position, "gold", "foret");

        });

    margeGauche
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .forEach((position, index) => {

            creerLuciole(
                position,
                index === 0 ? "silver" : "blue",
                "marge"
            );

        });

    margeDroite
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .forEach((position, index) => {

            if (index === 2) {

                creerLuciole(position, "blue", "marge");

            } else {

                creerLuciole(position, "silver", "marge");

            }

        });

    });
        
    
 

