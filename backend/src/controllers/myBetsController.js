import Bet from "../models/bet.js";

export const showMyBets = async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).send("User not authenticated");
    }

    const bets = await Bet.find({ userId })
      .sort({ createdAt: -1 });

    res.render("my-bets", { bets });

  } catch (err) {
    console.error("Error loading bets:", err);
    res.status(500).send("Internal server error");
  }
};
