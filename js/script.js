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

    let formulaireReponse = null;
    let commentaireSelectionne = null;

afficherLikes();
document.querySelectorAll(".creation").forEach(creation => {

    const commentaires = creation.querySelector(".commentaires-container");

    chargerCommentaires(
        creation.dataset.slug,
        commentaires
    );

});

document.querySelectorAll(".btn-commentaire").forEach(bouton => {

    bouton.addEventListener("click", () => {

        const creation = bouton.closest(".creation");

        const commentaires = creation.querySelector(".commentaires-container");

        if (commentaires.style.display === "block") {

            commentaires.style.display = "none";

        } else {

    commentaires.style.display = "block";
    chargerCommentaires(creation.dataset.slug, commentaires);

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

    bouton.disabled = true;

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

    bouton.disabled = false;

    return;
}

champ.value = "";
champPseudo.value = "";
await chargerCommentaires(slug, commentaires);
bouton.disabled = false;

    });

});

function formaterDate(dateUTC) {

    const date = new Date(dateUTC);
    const maintenant = new Date();

    const memeJour =
        date.getDate() === maintenant.getDate() &&
        date.getMonth() === maintenant.getMonth() &&
        date.getFullYear() === maintenant.getFullYear();

    const heure = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (memeJour) {
        return `Aujourd'hui à ${heure}`;
    }

    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }) + ` à ${heure}`;

}

async function chargerCommentaires(slug, commentaires) {

    const liste = commentaires.querySelector(".liste-commentaires");
    const message = commentaires.querySelector(".aucun-commentaire");
    const compteur = commentaires
        .closest(".creation")
        .querySelector(".comments-count");

    const { data, error } = await db
        .from("commentaires")
        .select("*")
        .eq("slug", slug)
        .order("created_at", { ascending: false });

        console.log("Commentaires récupérés :", data);

    const commentairesPrincipaux = data.filter(commentaire => commentaire.parent_id === null);

    const reponses = data.filter(commentaire => commentaire.parent_id !== null);

console.log("Commentaires :", commentairesPrincipaux);

console.log("Réponses :", reponses);

    if (error) {
        console.error("Erreur chargement :", error);
        return;
    }

    liste.innerHTML = "";
    compteur.textContent = data.length;

    if (data.length === 0) {
        message.style.display = "block";
        return;
    }

    message.style.display = "none";

 data.forEach(commentaire => {

    const bloc = creerBlocCommentaire(commentaire);

    liste.appendChild(bloc);

});

}

function afficherFormulaireReponse(zoneReponse, commentaireId, pseudo) {

    commentaireSelectionne = commentaireId;

    if (formulaireReponse) {
        formulaireReponse.remove();
    }

    formulaireReponse = document.createElement("div");
    formulaireReponse.className = "formulaire-reponse";

    formulaireReponse.innerHTML = `
        <div class="titre-reponse">
            🌙 Réponse à <strong>${pseudo}</strong>
        </div>

        <textarea
            class="champ-reponse"
            rows="4"
            placeholder="Écrire une réponse..."></textarea>

        <button class="btn-envoyer-reponse">
            Envoyer
        </button>
    `;

    const boutonEnvoyer = formulaireReponse.querySelector(".btn-envoyer-reponse");

boutonEnvoyer.addEventListener("click", () => {

    const creation = zoneReponse.closest(".creation");
    const slug = creation.dataset.slug;

    envoyerReponse(slug);

});

    zoneReponse.appendChild(formulaireReponse);

}

async function envoyerReponse(slug) {

    const champ = formulaireReponse.querySelector(".champ-reponse");

    const texte = champ.value.trim();

    if (texte === "") return;

    const { error } = await db
        .from("commentaires")
        .insert([
            {
                slug: slug,
                pseudo: "Nathy",
                message: texte,
                parent_id: commentaireSelectionne
            }
        ]);

    if (error) {
        console.error(error);
        return;
    }

    formulaireReponse.remove();
    formulaireReponse = null;

}

function creerBlocCommentaire(commentaire) {

    const bloc = document.createElement("div");
    bloc.className = "commentaire";

    const zoneReponse = document.createElement("div");
    zoneReponse.className = "zone-reponse";

    bloc.innerHTML = `
        <div class="commentaire-entete">
            <strong>${commentaire.pseudo}</strong>
            <span class="commentaire-separateur">•</span>
            <span class="commentaire-date">
                ${formaterDate(commentaire.created_at)}
            </span>
        </div>

        <p class="commentaire-texte">
            ${commentaire.message}
        </p>

        <button
            class="btn-repondre"
            data-id="${commentaire.id}">
            Répondre
        </button>
    `;

    bloc.appendChild(zoneReponse);

    const boutonRepondre = bloc.querySelector(".btn-repondre");

    boutonRepondre.addEventListener("click", () => {

        afficherFormulaireReponse(
            zoneReponse,
            commentaire.id,
            commentaire.pseudo
        );

    });

    return bloc;

}