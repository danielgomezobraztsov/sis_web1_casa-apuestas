import User from "../models/user.js";
import RouletteBet from "../models/rouletteBet.js";

export const playRoulette = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { amount, selection } = req.body;

        // ❌ Validación de apuesta
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        if (!["red", "black", "green"].includes(selection)) {
            return res.status(400).json({ error: "Invalid selection" });
        }

        const user = await User.findById(userId);

        // ❌ Nuevo check: si el usuario tiene 0, ni intentamos restar
        if (user.balance <= 0) {
            return res.status(400).json({ error: "Your balance is 0. Add funds to play." });
        }

        // ❌ Check normal: si no tiene suficiente para amount
        if (user.balance < amount) {
            return res.status(400).json({ error: "Not enough balance" });
        }

        // 🎯 Número 0–11 para coincidir con el frontend
        const number = Math.floor(Math.random() * 12);

        // 🎨 Mapeo exacto
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

        // 🏆 Determinar resultado
        if (selection === color) {
            win = true;

            // Payout adaptado a tus probabilidades
            payout = (color === "green") ? amount * 3 : amount * 2;

            user.balance += payout;
        } else {
            user.balance -= amount;
        }

        await user.save();

        // Registrar apuesta
        await RouletteBet.create({
            userId,
            amount,
            selection,
            resultNumber: number,
            resultColor: color,
            win,
            payout
        });

        // Actualizar sesión
        req.session.user.balance = user.balance;
        req.session.save();

        return res.json({
            success: true,
            number,
            color,
            win,
            payout,
            newBalance: user.balance
        });

    } catch (err) {
        console.error("Roulette error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
