import axios from "axios";

// --- Algoritmo simple para generar "odds híbridas" ---
function generateHybridOdds(homeStrength, awayStrength) {
  // Seguridad básica
  if (homeStrength <= 0) homeStrength = 1;
  if (awayStrength <= 0) awayStrength = 1;

  const total = homeStrength + awayStrength;

  const probHome = homeStrength / total;
  const probAway = awayStrength / total;

  const probDraw = (probHome + probAway) / 4;

  // Convert probabilities to decimal odds
  const decimal = p => Number((1 / p + 0.2).toFixed(2));

  return {
    home: decimal(probHome),
    draw: decimal(probDraw),
    away: decimal(probAway)
  };
}

export const showBetPage = async (req, res) => {
  try {
    const fixtureId = req.params.fixtureId;

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        params: { id: fixtureId },
        headers: {
          "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
          "x-rapidapi-host": "v3.football.api-sports.io"
        }
      }
    );

    const match = response.data.response[0];
    if (!match) return res.status(404).send("Match not found");

    // --- Extract data ---
    const homeTeam = match.teams.home.name;
    const awayTeam = match.teams.away.name;
    const homeLogo = match.teams.home.logo;
    const awayLogo = match.teams.away.logo;

    const league = match.league.name;
    const date = match.fixture.date;

    // --- Create synthetic odds ---
    const odds = generateHybridOdds(
      match.teams.home.id % 100,
      match.teams.away.id % 100
    );

    res.render("bet", {
      fixtureId,
      homeTeam,
      awayTeam,
      homeLogo,
      awayLogo,
      league,
      date,
      odds
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bet page");
  }
};
