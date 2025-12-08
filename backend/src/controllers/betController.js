import Bet from "../models/bet.js";

export const createBet = async (req, res) => {
  try {
    const { selection, amount, fixture, odd_home, odd_draw, odd_away } = req.body;

    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).send("User not authenticated");
    }

    // Obtener usuario con balance
    const user = await User.findById(userId);
    if (!user) return res.status(401).send("User not found");

    // Convertir valores
    const amountNumber = Number(amount);
    let oddSelected = null;

    if (selection === "home") oddSelected = Number(odd_home);
    else if (selection === "draw") oddSelected = Number(odd_draw);
    else if (selection === "away") oddSelected = Number(odd_away);

    // Validaciones
    if (!oddSelected || amountNumber <= 0 || isNaN(amountNumber)) {
      return res.status(400).send("Invalid bet values");
    }

    //VALIDAR SALDO SUFICIENTE
    if (user.balance < amountNumber) {
      return res.status(400).send("No tienes suficiente saldo para apostar.");
    }

    //Buscar apuesta existente (mismo usuario + partido + selección)
    const existingBet = await Bet.findOne({
      userId,
      fixtureId: fixture,
      selection
    });

    if (existingBet) {
      //Sumar a la apuesta existente
      existingBet.amount += amountNumber;
      existingBet.potentialWin = existingBet.amount * oddSelected;
      await existingBet.save();
    } else {
      // 🆕 Crear nueva apuesta
      await Bet.create({
        userId,
        fixtureId: fixture,
        selection,
        odd: oddSelected,
        amount: amountNumber,
        potentialWin: oddSelected * amountNumber,
        status: "pending",
        createdAt: new Date(),
      });
    }

    //RESTAR DEL BALANCE DEL USUARIO
    user.balance -= amountNumber;
    await user.save();

    //ACTUALIZAR SESIÓN
    req.session.user.balance = user.balance;
    req.session.save();

    return res.redirect("/gamble/my-bets");

  } catch (err) {
    console.error("Bet creation error:", err);
    return res.status(500).send("Internal server error");
  }
};

