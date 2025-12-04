import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

// 📅 Fecha de HOY en UTC
function getTodayUTC() {
    const now = new Date();
    return new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    )).toISOString().split("T")[0];
}

router.get("/", async (req, res) => {
    if (!API_KEY) return res.render("results", { results: {} });

    const date = getTodayUTC();

    console.log("📅 Consultando partidos FT para la fecha:", date);

    try {
        // 🔥 ESTA ES LA CONSULTA CORRECTA (igual que tu curl)
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            params: {
                date,
                status: "FT"   // <-- Igual que el curl
            },
            headers: {
                "x-apisports-key": API_KEY
            }
        });

        const matches = response.data.response || [];

        console.log(`✔ Partidos FT encontrados: ${matches.length}`);

        // Agrupamos las ligas para el EJS
        const results = {};

        matches.forEach(match => {
            const leagueId = match.league.id;

            if (!results[leagueId]) {
                results[leagueId] = {
                    leagueName: match.league.name,
                    matches: []
                };
            }

            results[leagueId].matches.push(match);
        });

        res.render("results", { results });

    } catch (error) {
        console.error("❌ ERROR resultado:", error.response?.data || error);
        res.render("results", { results: {} });
    }
});

export default router;
