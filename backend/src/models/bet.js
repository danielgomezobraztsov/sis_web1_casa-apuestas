import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fixtureId: Number,
  homeTeam: String,
  awayTeam: String,
  selection: { type: String, enum: ["home", "draw", "away"], required: true },
  odd: Number,
  amount: Number,
  potentialWin: Number,
  status: { type: String, enum: ["pending", "won", "lost"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Bet", betSchema);
