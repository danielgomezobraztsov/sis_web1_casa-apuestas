import Bet from "../models/bet.js";

export const createBet = async (req, res) => {
  try {
    const { selection, amount, fixture, odd_home, odd_draw, odd_away } = req.body;

    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).send("User not authenticated");
    }

    // Seleccionar la odd correcta según el botón
    let oddSelected = null;

    if (selection === "home") oddSelected = Number(odd_home);
    else if (selection === "draw") oddSelected = Number(odd_draw);
    else if (selection === "away") oddSelected = Number(odd_away);

    const amountNumber = Number(amount);

    if (!oddSelected || isNaN(oddSelected) || isNaN(amountNumber) || amountNumber <= 0) {
      console.log("Invalid bet input:", { oddSelected, amountNumber });
      return res.status(400).send("Invalid bet values");
    }

    const potentialWin = oddSelected * amountNumber;

    await Bet.create({
      userId,
      fixtureId: fixture,
      selection,
      odd: oddSelected,
      amount: amountNumber,
      potentialWin,
      status: "pending",
      createdAt: new Date(),
    });

    return res.redirect("/gamble/my-bets");
  } catch (err) {
    console.error("Bet creation error:", err);
    return res.status(500).send("Internal server error");
  }
};
