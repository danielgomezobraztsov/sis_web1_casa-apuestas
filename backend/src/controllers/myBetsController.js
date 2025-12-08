import Bet from "../models/bet.js";
import Match from "../models/match.js";

export const showMyBets = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).send("User not authenticated");
    }

    const bets = await Bet.find({ userId }).sort({ createdAt: -1 });

    // AGRUPAR POR PARTIDO Y OBTENER INFO DEL PARTIDO
    const groupedBets = {};
    const matchesInfo = {};

    for (const bet of bets) {
      // Buscar información del partido en MongoDB
      const match = await Match.findOne({ apiId: bet.fixtureId });

      if (!groupedBets[bet.fixtureId]) {
        groupedBets[bet.fixtureId] = [];
        matchesInfo[bet.fixtureId] = match;
      }

      groupedBets[bet.fixtureId].push(bet);
    }

    res.render("my-bets", { groupedBets, matchesInfo });

  } catch (error) {
    console.error("Error loading bets:", error);
    res.status(500).send("Internal server error");
  }
};