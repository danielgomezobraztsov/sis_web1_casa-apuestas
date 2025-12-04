import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// CARGAR .env CORRECTAMENTE (clave para resolver tu error)
dotenv.config();

const router = express.Router();

const API_KEY = process.env.FOOTBALL_API_KEY;
console.log("API KEY en results:", API_KEY);

const BASE_URL = "https://v3.football.api-sports.io";

const LEAGUES = [39, 140, 135, 2, 3];

// ---- FECHA REAL (IGNORANDO LA FECHA DE TU WINDOWS) ----
function getRealYesterdayUTC() {
    const now = new Date();

    const utcDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));

    const yesterday = new Date(utcDate.getTime() - 86400000);
    return yesterday.toISOString().split("T")[0];
}

router.get("/", async (req, res) => {
    try {
        const yesterday = getRealYesterdayUTC();

        console.log("Fecha usada para API:", yesterday);

        if (!API_KEY) {
            console.log("ERROR: API KEY NO DEFINIDA");
            return res.render("results", { results: {} });
        }

        let resultsByLeague = {};

        for (let leagueId of LEAGUES) {
            const response = await axios.get(`${BASE_URL}/fixtures`, {
                params: {
                    date: yesterday,
                    league: leagueId,
                    season: 2024
                },
                headers: {
                    "x-apisports-key": API_KEY
                }
            });

            resultsByLeague[leagueId] = response.data.response;
        }

        res.render("results", { results: resultsByLeague });

    } catch (error) {
        console.error("ERROR EN RESULTS:", error);
        res.render("results", { results: {} });
    }
});

export default router;
