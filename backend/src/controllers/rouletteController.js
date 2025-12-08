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

        // 🎯 0–36 actual result
        const number = Math.floor(Math.random() * 37);

        const color =
            number === 0 ? "green" :
            number <= 18 ? "red" : "black";

        let win = false;
        let payout = 0;

        // 🎉 Determine win/loss
        if (selection === color) {
            win = true;
            payout =
                color === "green"
                    ? amount * 14
                    : amount * 2;

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
