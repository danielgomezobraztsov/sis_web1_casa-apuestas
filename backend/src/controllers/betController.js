import Bet from "../models/betModel.js";

export const createBet = async (req, res) => {
  try {
    const { matchId, pick, stake } = req.body;

    await Bet.create({
      userId: req.session.user._id,
      matchId,
      pick,
      stake,
      createdAt: new Date()
    });

    res.redirect("/gamble");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating bet");
  }
};
