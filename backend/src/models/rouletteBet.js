import mongoose from "mongoose";

const rouletteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: Number,
    selection: { type: String, enum: ["red", "black", "green"], required: true },
    resultNumber: Number,
    resultColor: String,
    win: Boolean,
    payout: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("RouletteBet", rouletteSchema);
