import User from "../models/user.js";
import RouletteBet from "../models/rouletteBet.js";

export const playRoulette = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const { amount, selection } = req.body;

        if (!amount || amount <= 0 || !["red", "black", "green"].includes(selection)) {
            return res.status(400).json({ error: "Invalid bet" });
        }

        const user = await User.findById(userId);
        if (user.balance < amount) {
            return res.status(400).json({ error: "Not enough balance" });
        }

        // 🎯 Número 0–11 para coincidir con frontend de 12 segmentos
        const number = Math.floor(Math.random() * 12);

        // Mapeo exacto de colores según el frontend
        const colorMap = {
            0: "green",
            1: "red",
            2: "black",
            3: "red",
            4: "black",
            5: "green",
            6: "red",
            7: "black",
            8: "green",
            9: "red",
            10: "black",
            11: "green"
        };

        const color = colorMap[number];

        let win = false;
        let payout = 0;

        // 🎉 Determine win/loss
        if (selection === color) {
            win = true;
            // Probabilidades ajustadas para 12 números
            // Verdes: 4 de 12 (33%), Rojo/negro: 8 de 12 (67%)
            payout = color === "green" 
                ? amount * 3   // Paga 3:1 para verde (4 verdes de 12)
                : amount * 2;  // Paga 2:1 para rojo/negro (8 de 12)

            user.balance += payout;
        } else {
            user.balance -= amount;
        }

        await user.save();

        // Save bet
        await RouletteBet.create({
            userId,
            amount,
            selection,
            resultNumber: number,
            resultColor: color,
            win,
            payout
        });

        // Update session balance
        req.session.user.balance = user.balance;
        req.session.save();

        return res.json({
            success: true,
            number,      // 0-11 para frontend
            color,       // color exacto
            win,
            payout,
            newBalance: user.balance
        });

    } catch (err) {
        console.error("Roulette error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};