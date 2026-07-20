// ==========================
// LIGHTBOX
// ==========================

const lightbox = document.getElementById("lightbox");

if (lightbox) {

    const imageLightbox = document.getElementById("image-lightbox");
    const fermerLightbox = document.querySelector(".fermer-lightbox");
    const flecheGauche = document.querySelector(".fleche-gauche");
    const flecheDroite = document.querySelector(".fleche-droite");

    const images = document.querySelectorAll(".creation .miniature");

    let imageCourante = 0;

    // ==========================
    // OUVRIR LA LIGHTBOX
    // ==========================

    images.forEach((image, index) => {

        image.addEventListener("click", () => {

            imageCourante = index;

            imageLightbox.src = image.src;
            imageLightbox.alt = image.alt;

            lightbox.classList.add("active");

        });

    });

    // ==========================
    // FERMER
    // ==========================

    function fermer() {

        lightbox.classList.remove("active");

    }

    fermerLightbox.addEventListener("click", fermer);

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            fermer();
        }

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            fermer();
        }

    });

    // ==========================
    // CHANGER D'IMAGE
    // ==========================

    function afficherImage(index) {

        imageLightbox.src = images[index].src;
        imageLightbox.alt = images[index].alt;

    }

    flecheDroite.addEventListener("click", (event) => {

        event.stopPropagation();

        imageCourante++;

        if (imageCourante >= images.length) {
            imageCourante = 0;
        }

        afficherImage(imageCourante);

    });

    flecheGauche.addEventListener("click", (event) => {

        event.stopPropagation();

        imageCourante--;

        if (imageCourante < 0) {
            imageCourante = images.length - 1;
        }

        afficherImage(imageCourante);

    });

}

// ==========================
// PROTECTION DES IMAGES
// ==========================

document.querySelectorAll("img").forEach((image) => {

    image.addEventListener("contextmenu", (event) => {

        event.preventDefault();

    });

    image.addEventListener("dragstart", (event) => {

        event.preventDefault();

    });

});

// ==========================
// PROTECTION DES CARTES
// ==========================

document.querySelectorAll(".carte-explorer").forEach((carte) => {

    carte.addEventListener("contextmenu", (event) => {

        event.preventDefault();

    });

});

    async function afficherLikes() {

       const creations = document.querySelectorAll(".creation");

    for (const creation of creations) {

        const slug = creation.dataset.slug;

        if (!slug) continue;

        const zoneLikes = creation.querySelector(".likes-container");
        const bouton = zoneLikes.querySelector(".btn-like");
        const coeur = bouton.querySelector(".icone-coeur");

        const { data, error } = await db
            .from("Créations")
            .select("likes")
            .eq("slug", slug)
            .single();

        if (error) {
            console.error("Erreur pour", slug, error);
            continue;
        }

        zoneLikes.querySelector(".likes-count").textContent = data.likes;

        console.log("Listener ajouté pour :", slug);

        bouton.addEventListener("click", async () => {

         console.log("Clic sur :", slug);

        const cleVote = `like-${slug}`;

if (localStorage.getItem(cleVote)) {
    return;
}

    const nouveauScore = data.likes + 1;

    const { error } = await db
        .from("Créations")
        .update({ likes: nouveauScore })
        .eq("slug", slug);

    if (error) {
        console.error(error);
        return;
    }

    data.likes = nouveauScore;
    localStorage.setItem(cleVote, "true");
    zoneLikes.querySelector(".likes-count").textContent = nouveauScore; 

    coeur.classList.remove("pop");
    void coeur.offsetWidth;
    coeur.classList.add("pop");

});
};
    }

afficherLikes();

document.querySelectorAll(".btn-commentaire").forEach(bouton => {

    bouton.addEventListener("click", () => {

        const creation = bouton.closest(".creation");

        const commentaires = creation.querySelector(".commentaires-container");

        if (commentaires.style.display === "block") {

            commentaires.style.display = "none";

        } else {

            commentaires.style.display = "block";

        }

    });

});

document.querySelectorAll(".btn-publier").forEach(bouton => {

    bouton.addEventListener("click", async () => {

        const commentaires = bouton.closest(".commentaires-container");
        const creation = bouton.closest(".creation");
        const slug = creation.dataset.slug;

        const champPseudo = commentaires.querySelector(".champ-pseudo");
        const champ = commentaires.querySelector(".champ-commentaire");
        const liste = commentaires.querySelector(".liste-commentaires");
        const message = commentaires.querySelector(".aucun-commentaire");

        const pseudo = champPseudo.value.trim() || "Anonyme";
        const texte = champ.value.trim();

    if (texte === "") return;

       message.style.display = "none";

       const { error } = await db
    .from("commentaires")
    .insert([
        {
            slug: slug,
            pseudo: pseudo,
            message: texte
        }
    ]);

    if (error) {
         console.error("Erreur Supabase :", error);
    return;
}

champ.value = "";
champPseudo.value = "";

    });

});