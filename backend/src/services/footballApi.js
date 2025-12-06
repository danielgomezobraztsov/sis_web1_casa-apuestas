import axios from "axios";

const API_URL = "https://v3.football.api-sports.io";

export const getMatchesByDate = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/fixtures`, {
      params: { date },
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
        "x-rapidapi-host": "v3.football.api-sports.io"
      }
    });

    return response.data.response; // Array of matches
  } catch (error) {
    console.error("Error fetching matches:", error.response?.data || error);
    return [];
  }
};


export const getLiveMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/fixtures`, {
      params: { live: "all" },
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
        "x-rapidapi-host": "v3.football.api-sports.io"
      }
    });

    return response.data.response; 
  } catch (error) {
    console.error("Error fetching live matches:", error.response?.data || error);
    return [];
  }
};

export const getFixtureById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/fixtures`, {
      params: { id },
      headers: {
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
        "x-rapidapi-host": "v3.football.api-sports.io"
      }
    });

    return res.data.response[0];
  } catch (err) {
    console.error("Error fetching fixture:", err.response?.data || err);
    return null;
  }
};

