import axios from "axios";

export const showBetPage = async (req, res) => {
  const fixtureId = req.params.fixtureId;

  try {
    // Obtener el partido concreto
    const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: { id: fixtureId },
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
        "x-rapidapi-host": "v3.football.api-sports.io"
      }
    });

    const match = response.data.response[0];
    if (!match) return res.status(404).send("Match not found");

    // Extraer datos útiles
    const homeTeam = match.teams.home.name;
    const awayTeam = match.teams.away.name;

    const homeLogo = match.teams.home.logo;
    const awayLogo = match.teams.away.logo;

    const league = match.league.name;
    const date = match.fixture.date;

    res.render("bet", {
      fixtureId,
      homeTeam,
      awayTeam,
      homeLogo,
      awayLogo,
      league,
      date
    });

  } catch (error) {
    console.log("Error loading bet page:", error.response?.data || error);
    res.status(500).send("Error loading bet page");
  }
};
