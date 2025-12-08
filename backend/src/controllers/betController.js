import Bet from "../models/bet.js";
import User from "../models/user.js";
import { getFixtureById } from "../services/footballApi.js";

export const createBet = async (req, res) => {
  try {
    const { selection, amount, fixture, odd_home, odd_draw, odd_away } = req.body;

    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).send("User not authenticated");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(401).send("User not found");

    const amountNumber = Number(amount);
    let oddSelected = null;

    if (selection === "home") oddSelected = Number(odd_home);
    else if (selection === "draw") oddSelected = Number(odd_draw);
    else if (selection === "away") oddSelected = Number(odd_away);

    if (!oddSelected || amountNumber <= 0 || isNaN(amountNumber)) {
      return res.status(400).send("Invalid bet values");
    }

    // VALIDAR SALDO
    if (user.balance < amountNumber) {
      return res.status(400).send("No tienes suficiente saldo para apostar.");
    }

    // 🔥 OBTENER NOMBRES DEL PARTIDO
    const fixtureData = await getFixtureById(fixture);
    const homeTeam = fixtureData?.teams?.home?.name || "Equipo Local";
    const awayTeam = fixtureData?.teams?.away?.name || "Equipo Visitante";

    // Buscar apuesta existente
    const existingBet = await Bet.findOne({
      userId,
      fixtureId: fixture,
      selection
    });

    if (existingBet) {
      existingBet.amount += amountNumber;
      existingBet.potentialWin = existingBet.amount * oddSelected;
      await existingBet.save();
    } else {
      await Bet.create({
        userId,
        fixtureId: fixture,
        homeTeam,
        awayTeam,
        selection,
        odd: oddSelected,
        amount: amountNumber,
        potentialWin: oddSelected * amountNumber,
        status: "pending",
        createdAt: new Date(),
      });
    }

    user.balance -= amountNumber;
    await user.save();

    req.session.user.balance = user.balance;
    req.session.save();

    return res.redirect("/gamble/my-bets");

  } catch (err) {
    console.error("Bet creation error:", err);
    return res.status(500).send("Internal server error");
  }
};
