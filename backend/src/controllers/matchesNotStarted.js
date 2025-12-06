import { getMatchesByDate } from "../services/footballApi.js";

export const matchesNotStarted = async (req, res) => {
  try {
    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    const matches = await getMatchesByDate(today);

    const upcomingMatches = matches.filter(m =>
      m.fixture.status.short === "NS" || m.fixture.status.elapsed === null
    );

    res.render("gamble", { matches: upcomingMatches });

  } catch (error) {
    console.error("Error loading upcoming matches:", error);
    res.status(500).send("Error loading upcoming matches");
  }
};
