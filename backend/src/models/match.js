import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  apiId: { type: Number, required: true, unique: true }, 

  league: {
    id: Number,
    name: String,
    country: String,
    season: Number,
    round: String,
  },

  teams: {
    home: {
      id: Number,
      name: String,
      logo: String,
    },
    away: {
      id: Number,
      name: String,
      logo: String,
    }
  },

  date: { type: Date, required: true },

  status: {
    long: String,
    short: String,
    elapsed: Number,
  },

  goals: {
    home: Number,
    away: Number,
  },

  odds: {
    home: Number,
    draw: Number,
    away: Number,
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Match", matchSchema);
