import axios from "axios";

export const showBetPage = async (req, res) => {
  const fixtureId = req.params.fixtureId;

  try {
    // Llamamos a API-FOOTBALL para obtener información del partido concreto
    const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: { id: fixtureId },
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
        "x-rapidapi-host": "v3.football.api-sports.io"
      }
    });

    const match = response.data.response[0];

    if (!match) return res.status(404).send("Match not found");

    res.render("bet", { match });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading bet page");
  }
};
