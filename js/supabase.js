const SUPABASE_URL = "https://mgvfougddqbhpufnouom.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_4XP5smvqkCD7mB6OQt3dtg_l0GR360M";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function testConnexion() {
    const { data, error } = await db
        .from("Créations")
        .select("*")
        .eq("slug", "dragon-fusion");

    console.log("Résultat :", data);
    console.log("Erreur :", error);
}

testConnexion();