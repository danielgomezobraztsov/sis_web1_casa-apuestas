import axios from "axios";

const API_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-rapidapi-key": process.env.FOOTBALL_API_KEY,
  "x-rapidapi-host": "v3.football.api-sports.io"
};

export async function getTeamStrength(teamId, leagueId, season = 2024) {
  try {
    // Obtener standings del equipo
    const standingRes = await axios.get(`${API_URL}/standings`, {
      params: { league: leagueId, season },
      headers
    });

    const standings = standingRes.data.response[0].league.standings[0];
    const teamStanding = standings.find(t => t.team.id == teamId);

    const points = teamStanding.points;
    const position = teamStanding.rank;
    const goalDiff = teamStanding.all.goals.for - teamStanding.all.goals.against;

    // Convertimos posición en un valor inverso (1 = 100, último = muy bajo)
    const maxTeams = standings.length;
    const positionScore = ((maxTeams - position + 1) / maxTeams) * 100;

    // Obtener últimos 5 resultados
    const formRes = await axios.get(`${API_URL}/fixtures`, {
      params: { team: teamId, last: 5 },
      headers
    });

    const lastMatches = formRes.data.response;

    let momentumScore = 0;
    lastMatches.forEach(m => {
      const isHome = m.teams.home.id == teamId;
      const goalsFor = isHome ? m.goals.home : m.goals.away;
      const goalsAgainst = isHome ? m.goals.away : m.goals.home;

      if (goalsFor > goalsAgainst) momentumScore += 3; // win
      else if (goalsFor === goalsAgainst) momentumScore += 1; // draw
    });

    // normalizar a 0-100
    momentumScore = (momentumScore / 15) * 100;

    // Modelo híbrido final
    const strength =
      points * 0.40 +
      positionScore * 0.30 +
      goalDiff * 2 * 0.20 +
      momentumScore * 0.10;

    return Number(strength.toFixed(2));

  } catch (err) {
    console.error("Ranking Hybrid Error:", err.response?.data || err);
    return 50; // fallback neutral
  }
}
