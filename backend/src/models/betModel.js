import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },

  matchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Match",
    required: true 
  },

  apiMatchId: { 
    type: Number, 
    required: true 
  }, 

  pick: { 
    type: String, 
    enum: ["home", "draw", "away"], 
    required: true 
  },

  stake: { type: Number, required: true },   
  odd: { type: Number, required: true },     

  status: { 
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Bet", betSchema);
