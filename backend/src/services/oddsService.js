import { getTeamStrength } from "./rankingService.js";

export async function calculateOdds(homeId, awayId, leagueId, season) {
  const S1 = await getTeamStrength(homeId, leagueId, season);
  const S2 = await getTeamStrength(awayId, leagueId, season);

  // Se normalizan los valores
  const R1 = (S1 / S2) + 1;
  const R2 = (S2 / S1) + 1;
  const tie = Math.abs(S1 - S2) / 20 + 1;

  // conversión a cuotas decimales
  const oddHome = (3 / R1).toFixed(2);
  const oddAway = (3 / R2).toFixed(2);
  const oddDraw = (3 / tie).toFixed(2);

  return {
    oddHome,
    oddAway,
    oddDraw,
    raw: { R1, R2, tie, S1, S2 }
  };
}
