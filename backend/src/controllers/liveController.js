import { getLiveMatches } from "../services/footballApi.js";

export const showLiveMatches = async (req, res) => {
  try {
    const matches = await getLiveMatches();
    res.render("live", { matches });
  } catch (error) {
    console.error(error);
    res.status(500).send("Couldn't load live match data");
  }
};
