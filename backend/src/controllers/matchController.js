import { getMatchesByDate } from "../services/footballApi.js";

export const showMatches = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.render("matches", { matches: [] });
    }

    const matches = await getMatchesByDate(date);

    res.render("matches", { matches });
  } catch (error) {
    console.error(error);
    res.status(500).send("Cannot load matches");
  }
};
