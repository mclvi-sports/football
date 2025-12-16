/**
 * Career Stats Generator
 *
 * Generates realistic historical career stats for experienced players
 * during league population. This ensures the league doesn't start
 * with empty career history.
 */

import { Player, Position } from '../types';
import { LEAGUE_TEAMS } from '../data/teams';
import {
  PlayerCareerStats,
  CareerSeasonEntry,
  PassingStats,
  RushingStats,
  ReceivingStats,
  DefenseStats,
  KickingStats,
} from '../career-stats/types';
import {
  bulkSaveCareerStats,
  clearCareerStatsStore,
} from '../career-stats/career-stats-store';
import { FullGameData, TeamRosterData } from '../dev-player-store';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ============================================================================
// CAREER ARC MODIFIERS
// ============================================================================

/**
 * Get career arc modifier based on player's age during season.
 * Prime years (26-29) are baseline (1.0).
 */
function getCareerArcModifier(age: number): number {
  if (age <= 22) {
    // Rookie: 70-85% of prime
    return randomFloat(0.70, 0.85);
  } else if (age <= 25) {
    // Young: 85-95% of prime
    return randomFloat(0.85, 0.95);
  } else if (age <= 29) {
    // Prime: 100%
    return randomFloat(0.95, 1.05);
  } else if (age <= 32) {
    // Veteran: 90-95% of prime
    return randomFloat(0.88, 0.95);
  } else {
    // Elder (33+): 75-85% of prime
    return randomFloat(0.70, 0.85);
  }
}

/**
 * Get OVR scaling factor.
 * 80 OVR is baseline (1.0).
 */
function getOvrScaling(ovr: number): number {
  const baseline = 80;
  const diff = ovr - baseline;
  // Each point above/below 80 adjusts output by ~3%
  return 1.0 + (diff * 0.03);
}

/**
 * Estimate what the player's OVR was during a past season.
 * Younger players had lower OVR, veterans may have declined.
 */
function estimatePastOvr(currentOvr: number, currentAge: number, pastAge: number): number {
  const ageDiff = currentAge - pastAge;

  // Young players (under 26) were developing
  if (pastAge < 26) {
    // Lose 2-4 OVR per year going back
    const devLoss = ageDiff * randomFloat(2, 4);
    return Math.max(55, currentOvr - devLoss);
  }

  // Prime years (26-29) were similar
  if (pastAge >= 26 && pastAge <= 29) {
    return currentOvr + randomInt(-2, 2);
  }

  // Veteran decline (30+)
  // Player was better in the past if they're currently declining
  if (currentAge > 29 && pastAge < currentAge) {
    const declineRecovery = (currentAge - pastAge) * randomFloat(1, 2);
    return Math.min(99, currentOvr + declineRecovery);
  }

  return currentOvr;
}

// ============================================================================
// GAMES PLAYED LOGIC
// ============================================================================

/**
 * Generate games played for a season based on OVR and position.
 */
function generateGamesPlayed(ovr: number, position: Position): number {
  // Base games for starters
  const baseGames = 17;

  // OVR affects playing time
  let gamesModifier: number;
  if (ovr >= 85) {
    // Star player: 15-17 games
    gamesModifier = randomFloat(0.88, 1.0);
  } else if (ovr >= 75) {
    // Starter: 14-17 games
    gamesModifier = randomFloat(0.82, 1.0);
  } else if (ovr >= 65) {
    // Backup: 10-16 games
    gamesModifier = randomFloat(0.59, 0.94);
  } else {
    // Depth: 4-12 games
    gamesModifier = randomFloat(0.24, 0.71);
  }

  // Position-based injury risk adjustment
  const injuryRisk: Record<Position, number> = {
    [Position.QB]: 0.95,
    [Position.RB]: 0.85, // Higher injury risk
    [Position.WR]: 0.90,
    [Position.TE]: 0.88,
    [Position.LT]: 0.92,
    [Position.LG]: 0.93,
    [Position.C]: 0.94,
    [Position.RG]: 0.93,
    [Position.RT]: 0.92,
    [Position.DE]: 0.90,
    [Position.DT]: 0.91,
    [Position.MLB]: 0.88,
    [Position.OLB]: 0.89,
    [Position.CB]: 0.90,
    [Position.FS]: 0.91,
    [Position.SS]: 0.90,
    [Position.K]: 0.98, // Rarely injured
    [Position.P]: 0.98,
  };

  const positionMod = injuryRisk[position] || 0.90;
  const finalGames = Math.round(baseGames * gamesModifier * positionMod);

  return clamp(finalGames, 1, 17);
}

// ============================================================================
// POSITION-SPECIFIC STAT GENERATORS
// ============================================================================

function generatePassingStats(
  ovr: number,
  gamesPlayed: number,
  arcModifier: number,
  isStarter: boolean
): PassingStats {
  const ovrScale = getOvrScaling(ovr);
  const gameScale = gamesPlayed / 17;
  const starterMod = isStarter ? 1.0 : randomFloat(0.1, 0.3);
  const totalMod = ovrScale * arcModifier * gameScale * starterMod;

  // Base stats for 80 OVR starter over 17 games
  const baseAttempts = randomInt(480, 560);
  const baseCompPct = randomFloat(0.63, 0.67);
  const baseYardsPerAtt = randomFloat(7.0, 8.0);
  const baseTdPct = randomFloat(0.045, 0.055);
  const baseIntPct = randomFloat(0.018, 0.028);

  const attempts = Math.round(baseAttempts * totalMod);
  const compPct = clamp(baseCompPct + (ovr - 80) * 0.003, 0.50, 0.75);
  const completions = Math.round(attempts * compPct);
  const yardsPerAtt = clamp(baseYardsPerAtt + (ovr - 80) * 0.05, 5.5, 10.0);
  const yards = Math.round(attempts * yardsPerAtt);
  const touchdowns = Math.round(attempts * baseTdPct * ovrScale);
  const interceptions = Math.round(attempts * baseIntPct / ovrScale);
  const sacked = Math.round(randomInt(20, 45) * gameScale * (1.1 - ovrScale * 0.1));

  // Calculate passer rating
  const a = clamp((compPct - 0.3) * 5, 0, 2.375);
  const b = clamp((yardsPerAtt - 3) * 0.25, 0, 2.375);
  const c = clamp((touchdowns / Math.max(attempts, 1)) * 20, 0, 2.375);
  const d = clamp(2.375 - (interceptions / Math.max(attempts, 1)) * 25, 0, 2.375);
  const passerRating = ((a + b + c + d) / 6) * 100;

  return {
    attempts,
    completions,
    yards,
    touchdowns,
    interceptions,
    sacked,
    completionPct: attempts > 0 ? (completions / attempts) * 100 : 0,
    yardsPerAttempt: attempts > 0 ? yards / attempts : 0,
    passerRating: attempts > 0 ? passerRating : 0,
  };
}

function generateRushingStats(
  ovr: number,
  gamesPlayed: number,
  arcModifier: number,
  position: Position,
  isStarter: boolean
): RushingStats {
  const ovrScale = getOvrScaling(ovr);
  const gameScale = gamesPlayed / 17;

  // Different base stats by position
  let baseCarries: number;
  let baseYpc: number;

  if (position === Position.RB) {
    const starterMod = isStarter ? 1.0 : randomFloat(0.15, 0.35);
    baseCarries = randomInt(220, 300) * starterMod;
    baseYpc = randomFloat(4.2, 4.8);
  } else if (position === Position.QB) {
    baseCarries = randomInt(30, 80);
    baseYpc = randomFloat(4.0, 5.5);
  } else if (position === Position.WR) {
    baseCarries = randomInt(5, 20);
    baseYpc = randomFloat(5.0, 8.0);
  } else {
    // Other positions rarely rush
    return createEmptyRushingStats();
  }

  const totalMod = ovrScale * arcModifier * gameScale;
  const carries = Math.round(baseCarries * totalMod);
  const ypc = clamp(baseYpc + (ovr - 80) * 0.03, 3.0, 6.5);
  const yards = Math.round(carries * ypc);
  const touchdowns = Math.round(carries * randomFloat(0.03, 0.05) * ovrScale);
  const fumbles = Math.round(carries * randomFloat(0.005, 0.015) / ovrScale);
  const long = Math.round(randomInt(25, 75) * ovrScale);

  return {
    carries,
    yards,
    touchdowns,
    fumbles,
    long: clamp(long, 10, 99),
    yardsPerCarry: carries > 0 ? yards / carries : 0,
  };
}

function generateReceivingStats(
  ovr: number,
  gamesPlayed: number,
  arcModifier: number,
  position: Position,
  isStarter: boolean
): ReceivingStats {
  const ovrScale = getOvrScaling(ovr);
  const gameScale = gamesPlayed / 17;
  const starterMod = isStarter ? 1.0 : randomFloat(0.2, 0.4);

  // Different base stats by position
  let baseTargets: number;
  let baseCatchPct: number;
  let baseYpc: number;

  if (position === Position.WR) {
    baseTargets = randomInt(100, 140);
    baseCatchPct = randomFloat(0.62, 0.68);
    baseYpc = randomFloat(12.0, 14.5);
  } else if (position === Position.TE) {
    baseTargets = randomInt(65, 95);
    baseCatchPct = randomFloat(0.64, 0.72);
    baseYpc = randomFloat(10.0, 12.5);
  } else if (position === Position.RB) {
    baseTargets = randomInt(35, 65);
    baseCatchPct = randomFloat(0.70, 0.80);
    baseYpc = randomFloat(7.0, 9.5);
  } else {
    // Other positions rarely receive
    return createEmptyReceivingStats();
  }

  const totalMod = ovrScale * arcModifier * gameScale * starterMod;
  const targets = Math.round(baseTargets * totalMod);
  const catchPct = clamp(baseCatchPct + (ovr - 80) * 0.005, 0.50, 0.85);
  const catches = Math.round(targets * catchPct);
  const ypc = clamp(baseYpc + (ovr - 80) * 0.1, 7.0, 18.0);
  const yards = Math.round(catches * ypc);
  const touchdowns = Math.round(catches * randomFloat(0.06, 0.10) * ovrScale);
  const long = Math.round(randomInt(30, 80) * ovrScale);

  return {
    targets,
    catches,
    yards,
    touchdowns,
    long: clamp(long, 15, 99),
    catchPct: targets > 0 ? (catches / targets) * 100 : 0,
    yardsPerCatch: catches > 0 ? yards / catches : 0,
  };
}

function generateDefenseStats(
  ovr: number,
  gamesPlayed: number,
  arcModifier: number,
  position: Position,
  isStarter: boolean
): DefenseStats {
  const ovrScale = getOvrScaling(ovr);
  const gameScale = gamesPlayed / 17;
  const starterMod = isStarter ? 1.0 : randomFloat(0.25, 0.5);
  const totalMod = ovrScale * arcModifier * gameScale * starterMod;

  // Position-based tackle expectations
  const tackleBase: Record<Position, number> = {
    [Position.MLB]: randomInt(90, 130),
    [Position.OLB]: randomInt(60, 95),
    [Position.SS]: randomInt(70, 100),
    [Position.FS]: randomInt(55, 85),
    [Position.CB]: randomInt(45, 75),
    [Position.DE]: randomInt(40, 65),
    [Position.DT]: randomInt(35, 55),
    // Non-defensive positions
    [Position.QB]: 0,
    [Position.RB]: 0,
    [Position.WR]: 0,
    [Position.TE]: 0,
    [Position.LT]: 0,
    [Position.LG]: 0,
    [Position.C]: 0,
    [Position.RG]: 0,
    [Position.RT]: 0,
    [Position.K]: 0,
    [Position.P]: 0,
  };

  // Sack expectations
  const sackBase: Record<Position, number> = {
    [Position.DE]: randomFloat(6, 14),
    [Position.DT]: randomFloat(2, 6),
    [Position.OLB]: randomFloat(3, 10),
    [Position.MLB]: randomFloat(1, 4),
    [Position.CB]: randomFloat(0, 2),
    [Position.SS]: randomFloat(0.5, 2.5),
    [Position.FS]: randomFloat(0, 1.5),
    // Non-pass-rushing positions
    [Position.QB]: 0,
    [Position.RB]: 0,
    [Position.WR]: 0,
    [Position.TE]: 0,
    [Position.LT]: 0,
    [Position.LG]: 0,
    [Position.C]: 0,
    [Position.RG]: 0,
    [Position.RT]: 0,
    [Position.K]: 0,
    [Position.P]: 0,
  };

  // INT expectations
  const intBase: Record<Position, number> = {
    [Position.CB]: randomFloat(2, 5),
    [Position.FS]: randomFloat(2, 5),
    [Position.SS]: randomFloat(1, 3),
    [Position.MLB]: randomFloat(0.5, 2),
    [Position.OLB]: randomFloat(0, 1.5),
    [Position.DE]: randomFloat(0, 0.5),
    [Position.DT]: randomFloat(0, 0.3),
    // Non-defensive positions
    [Position.QB]: 0,
    [Position.RB]: 0,
    [Position.WR]: 0,
    [Position.TE]: 0,
    [Position.LT]: 0,
    [Position.LG]: 0,
    [Position.C]: 0,
    [Position.RG]: 0,
    [Position.RT]: 0,
    [Position.K]: 0,
    [Position.P]: 0,
  };

  // PD expectations
  const pdBase: Record<Position, number> = {
    [Position.CB]: randomInt(10, 18),
    [Position.FS]: randomInt(6, 12),
    [Position.SS]: randomInt(4, 10),
    [Position.MLB]: randomInt(2, 6),
    [Position.OLB]: randomInt(1, 4),
    [Position.DE]: randomInt(0, 3),
    [Position.DT]: randomInt(0, 2),
    // Non-defensive positions
    [Position.QB]: 0,
    [Position.RB]: 0,
    [Position.WR]: 0,
    [Position.TE]: 0,
    [Position.LT]: 0,
    [Position.LG]: 0,
    [Position.C]: 0,
    [Position.RG]: 0,
    [Position.RT]: 0,
    [Position.K]: 0,
    [Position.P]: 0,
  };

  const tackles = Math.round((tackleBase[position] || 0) * totalMod);
  const sacks = Math.round((sackBase[position] || 0) * totalMod * 10) / 10;
  const interceptions = Math.round((intBase[position] || 0) * totalMod);
  const passDeflections = Math.round((pdBase[position] || 0) * totalMod);
  const fumbleRecoveries = randomInt(0, 2) * (isStarter ? 1 : 0);

  return {
    tackles,
    sacks,
    interceptions,
    passDeflections,
    fumbleRecoveries,
  };
}

function generateKickingStats(
  ovr: number,
  gamesPlayed: number,
  arcModifier: number,
  position: Position,
  isStarter: boolean
): KickingStats {
  if (position !== Position.K && position !== Position.P) {
    return createEmptyKickingStats();
  }

  const ovrScale = getOvrScaling(ovr);
  const gameScale = gamesPlayed / 17;
  const starterMod = isStarter ? 1.0 : randomFloat(0.1, 0.3);
  const totalMod = ovrScale * arcModifier * gameScale * starterMod;

  if (position === Position.K) {
    const fgAttempts = Math.round(randomInt(28, 38) * totalMod);
    const fgPct = clamp(randomFloat(0.82, 0.92) + (ovr - 80) * 0.003, 0.70, 0.98);
    const fgMade = Math.round(fgAttempts * fgPct);

    const xpAttempts = Math.round(randomInt(35, 50) * totalMod);
    const xpPct = clamp(randomFloat(0.94, 0.98) + (ovr - 80) * 0.002, 0.88, 1.0);
    const xpMade = Math.round(xpAttempts * xpPct);

    return {
      fgAttempts,
      fgMade,
      fgPct: fgAttempts > 0 ? (fgMade / fgAttempts) * 100 : 0,
      xpAttempts,
      xpMade,
      xpPct: xpAttempts > 0 ? (xpMade / xpAttempts) * 100 : 0,
      punts: 0,
      puntYards: 0,
      puntAvg: 0,
    };
  } else {
    // Punter
    const punts = Math.round(randomInt(55, 75) * totalMod);
    const puntAvg = clamp(randomFloat(44, 48) + (ovr - 80) * 0.1, 40, 52);
    const puntYards = Math.round(punts * puntAvg);

    return {
      fgAttempts: 0,
      fgMade: 0,
      fgPct: 0,
      xpAttempts: 0,
      xpMade: 0,
      xpPct: 0,
      punts,
      puntYards,
      puntAvg: punts > 0 ? puntYards / punts : 0,
    };
  }
}

// ============================================================================
// EMPTY STAT CREATORS
// ============================================================================

function createEmptyPassingStats(): PassingStats {
  return {
    attempts: 0,
    completions: 0,
    yards: 0,
    touchdowns: 0,
    interceptions: 0,
    sacked: 0,
    completionPct: 0,
    yardsPerAttempt: 0,
    passerRating: 0,
  };
}

function createEmptyRushingStats(): RushingStats {
  return {
    carries: 0,
    yards: 0,
    touchdowns: 0,
    fumbles: 0,
    long: 0,
    yardsPerCarry: 0,
  };
}

function createEmptyReceivingStats(): ReceivingStats {
  return {
    targets: 0,
    catches: 0,
    yards: 0,
    touchdowns: 0,
    long: 0,
    catchPct: 0,
    yardsPerCatch: 0,
  };
}

function createEmptyDefenseStats(): DefenseStats {
  return {
    tackles: 0,
    sacks: 0,
    interceptions: 0,
    passDeflections: 0,
    fumbleRecoveries: 0,
  };
}

function createEmptyKickingStats(): KickingStats {
  return {
    fgAttempts: 0,
    fgMade: 0,
    fgPct: 0,
    xpAttempts: 0,
    xpMade: 0,
    xpPct: 0,
    punts: 0,
    puntYards: 0,
    puntAvg: 0,
  };
}

// ============================================================================
// MAIN GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate a single season of stats for a player.
 */
function generateSeasonStats(
  position: Position,
  ovr: number,
  age: number,
  isStarter: boolean
): Omit<CareerSeasonEntry, 'year' | 'teamId' | 'teamAbbrev'> {
  const arcModifier = getCareerArcModifier(age);
  const gamesPlayed = generateGamesPlayed(ovr, position);

  // Determine which stat categories this position uses
  const isOffensiveSkill = [Position.QB, Position.RB, Position.WR, Position.TE].includes(position);
  const isDefense = [Position.DE, Position.DT, Position.MLB, Position.OLB, Position.CB, Position.FS, Position.SS].includes(position);
  const isSpecialTeams = [Position.K, Position.P].includes(position);
  const isOLine = [Position.LT, Position.LG, Position.C, Position.RG, Position.RT].includes(position);

  return {
    gamesPlayed,
    passing: position === Position.QB
      ? generatePassingStats(ovr, gamesPlayed, arcModifier, isStarter)
      : createEmptyPassingStats(),
    rushing: [Position.RB, Position.QB, Position.WR].includes(position)
      ? generateRushingStats(ovr, gamesPlayed, arcModifier, position, isStarter)
      : createEmptyRushingStats(),
    receiving: [Position.WR, Position.TE, Position.RB].includes(position)
      ? generateReceivingStats(ovr, gamesPlayed, arcModifier, position, isStarter)
      : createEmptyReceivingStats(),
    defense: isDefense
      ? generateDefenseStats(ovr, gamesPlayed, arcModifier, position, isStarter)
      : createEmptyDefenseStats(),
    kicking: isSpecialTeams
      ? generateKickingStats(ovr, gamesPlayed, arcModifier, position, isStarter)
      : createEmptyKickingStats(),
  };
}

/**
 * Generate complete career history for a player.
 */
export function generateCareerHistory(
  player: Player,
  teamId: string
): PlayerCareerStats | null {
  // Only generate for players with experience
  if (player.experience <= 0) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const teamAbbrev = teamId; // Team ID is the abbreviation

  const seasons: CareerSeasonEntry[] = [];

  // Generate each past season
  for (let i = 0; i < player.experience; i++) {
    const seasonYear = currentYear - player.experience + i;
    const ageForSeason = player.age - player.experience + i;
    const pastOvr = estimatePastOvr(player.overall, player.age, ageForSeason);

    // Determine if player was starter (higher OVR = more likely starter)
    const isStarter = pastOvr >= 70 || (pastOvr >= 60 && Math.random() < 0.3);

    const seasonStats = generateSeasonStats(
      player.position,
      pastOvr,
      ageForSeason,
      isStarter
    );

    seasons.push({
      year: seasonYear,
      teamId,
      teamAbbrev,
      ...seasonStats,
    });
  }

  // Calculate career totals
  const careerTotals = calculateCareerTotals(seasons);

  return {
    playerId: player.id,
    playerName: `${player.firstName} ${player.lastName}`,
    position: player.position,
    seasons,
    careerTotals,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculate career totals from season entries.
 */
function calculateCareerTotals(seasons: CareerSeasonEntry[]): PlayerCareerStats['careerTotals'] {
  const totals = {
    gamesPlayed: 0,
    passing: createEmptyPassingStats(),
    rushing: createEmptyRushingStats(),
    receiving: createEmptyReceivingStats(),
    defense: createEmptyDefenseStats(),
    kicking: createEmptyKickingStats(),
  };

  for (const season of seasons) {
    totals.gamesPlayed += season.gamesPlayed;

    // Sum passing
    totals.passing.attempts += season.passing.attempts;
    totals.passing.completions += season.passing.completions;
    totals.passing.yards += season.passing.yards;
    totals.passing.touchdowns += season.passing.touchdowns;
    totals.passing.interceptions += season.passing.interceptions;
    totals.passing.sacked += season.passing.sacked;

    // Sum rushing
    totals.rushing.carries += season.rushing.carries;
    totals.rushing.yards += season.rushing.yards;
    totals.rushing.touchdowns += season.rushing.touchdowns;
    totals.rushing.fumbles += season.rushing.fumbles;
    totals.rushing.long = Math.max(totals.rushing.long, season.rushing.long);

    // Sum receiving
    totals.receiving.targets += season.receiving.targets;
    totals.receiving.catches += season.receiving.catches;
    totals.receiving.yards += season.receiving.yards;
    totals.receiving.touchdowns += season.receiving.touchdowns;
    totals.receiving.long = Math.max(totals.receiving.long, season.receiving.long);

    // Sum defense
    totals.defense.tackles += season.defense.tackles;
    totals.defense.sacks += season.defense.sacks;
    totals.defense.interceptions += season.defense.interceptions;
    totals.defense.passDeflections += season.defense.passDeflections;
    totals.defense.fumbleRecoveries += season.defense.fumbleRecoveries;

    // Sum kicking
    totals.kicking.fgAttempts += season.kicking.fgAttempts;
    totals.kicking.fgMade += season.kicking.fgMade;
    totals.kicking.xpAttempts += season.kicking.xpAttempts;
    totals.kicking.xpMade += season.kicking.xpMade;
    totals.kicking.punts += season.kicking.punts;
    totals.kicking.puntYards += season.kicking.puntYards;
  }

  // Calculate derived stats
  if (totals.passing.attempts > 0) {
    totals.passing.completionPct = (totals.passing.completions / totals.passing.attempts) * 100;
    totals.passing.yardsPerAttempt = totals.passing.yards / totals.passing.attempts;

    // Calculate passer rating
    const compPct = totals.passing.completions / totals.passing.attempts;
    const ypa = totals.passing.yards / totals.passing.attempts;
    const tdPct = totals.passing.touchdowns / totals.passing.attempts;
    const intPct = totals.passing.interceptions / totals.passing.attempts;

    const a = clamp((compPct - 0.3) * 5, 0, 2.375);
    const b = clamp((ypa - 3) * 0.25, 0, 2.375);
    const c = clamp(tdPct * 20, 0, 2.375);
    const d = clamp(2.375 - intPct * 25, 0, 2.375);
    totals.passing.passerRating = ((a + b + c + d) / 6) * 100;
  }

  if (totals.rushing.carries > 0) {
    totals.rushing.yardsPerCarry = totals.rushing.yards / totals.rushing.carries;
  }

  if (totals.receiving.targets > 0) {
    totals.receiving.catchPct = (totals.receiving.catches / totals.receiving.targets) * 100;
  }
  if (totals.receiving.catches > 0) {
    totals.receiving.yardsPerCatch = totals.receiving.yards / totals.receiving.catches;
  }

  if (totals.kicking.fgAttempts > 0) {
    totals.kicking.fgPct = (totals.kicking.fgMade / totals.kicking.fgAttempts) * 100;
  }
  if (totals.kicking.xpAttempts > 0) {
    totals.kicking.xpPct = (totals.kicking.xpMade / totals.kicking.xpAttempts) * 100;
  }
  if (totals.kicking.punts > 0) {
    totals.kicking.puntAvg = totals.kicking.puntYards / totals.kicking.punts;
  }

  return totals;
}

// ============================================================================
// BULK GENERATION FOR LEAGUE
// ============================================================================

/**
 * Generate career stats for all players in the league data.
 * Call this after rosters are generated and stored.
 * Uses bulk save to avoid blocking the UI thread.
 */
export function generateCareerStatsForAllPlayers(fullGameData: FullGameData): void {
  // Clear existing career stats
  clearCareerStatsStore();

  // Collect all stats in memory first
  const allStats: PlayerCareerStats[] = [];

  // Process each team's roster
  for (const teamData of fullGameData.teams) {
    const teamId = teamData.team.id;

    for (const player of teamData.roster.players) {
      if (player.experience > 0) {
        const careerStats = generateCareerHistory(player, teamId);
        if (careerStats) {
          allStats.push(careerStats);
        }
      }
    }
  }

  // Single bulk save to localStorage
  bulkSaveCareerStats(allStats);

  console.log(`Generated career stats for ${allStats.length} experienced players`);
}

/**
 * Generate career stats for free agents.
 * Optional: Call after FA pool is generated.
 * Uses bulk save to avoid blocking the UI thread.
 */
export function generateCareerStatsForFreeAgents(freeAgents: Player[]): void {
  // Collect all stats in memory first
  const allStats: PlayerCareerStats[] = [];

  for (const player of freeAgents) {
    if (player.experience > 0) {
      // Free agents use a generic "FA" team abbreviation
      const careerStats = generateCareerHistory(player, 'FA');
      if (careerStats) {
        allStats.push(careerStats);
      }
    }
  }

  // Single bulk save to localStorage
  bulkSaveCareerStats(allStats);

  console.log(`Generated career stats for ${allStats.length} experienced free agents`);
}
