/**
 * College Stats Generator
 * Generates realistic college career statistics for draft prospects
 *
 * Stats are influenced by:
 * - Draft round (higher picks = better stats)
 * - Position
 * - College tier (Blue Blood players have more opportunities)
 */

import { Position, CollegeStats, CollegeCareer } from '../types';
import { CollegeTier } from '../data/colleges';
import { generateAccolades } from '../data/college-accolades';

// Years played distribution based on draft position
const YEARS_DISTRIBUTION: Record<number | 'UDFA', { min: number; max: number; avg: number }> = {
  1: { min: 2, max: 4, avg: 3 },   // Early declares
  2: { min: 3, max: 4, avg: 3.5 },
  3: { min: 3, max: 5, avg: 4 },
  4: { min: 3, max: 5, avg: 4 },
  5: { min: 4, max: 5, avg: 4.5 },
  6: { min: 4, max: 5, avg: 4.5 },
  7: { min: 4, max: 5, avg: 5 },
  UDFA: { min: 4, max: 5, avg: 5 },
};

// Games per season (bowl games included)
const GAMES_PER_SEASON = 13;

// Stat ranges by position and round tier (higher = better player)
interface StatRanges {
  perGame: Record<string, { min: number; max: number }>;
  career: Record<string, { min: number; max: number }>;
}

function getStatMultiplier(round: number | 'UDFA'): number {
  if (round === 'UDFA') return 0.6;
  if (round === 1) return 1.3;
  if (round === 2) return 1.15;
  if (round === 3) return 1.0;
  if (round === 4) return 0.9;
  if (round === 5) return 0.8;
  if (round === 6) return 0.7;
  return 0.65;
}

function getTierBonus(tier: CollegeTier): number {
  switch (tier) {
    case 'blue_blood': return 1.15;
    case 'elite': return 1.1;
    case 'power5': return 1.0;
    case 'group5': return 0.9;
    case 'fcs': return 0.85;
    default: return 1.0;
  }
}

function randomInRange(min: number, max: number, multiplier: number = 1): number {
  const base = min + Math.random() * (max - min);
  return Math.round(base * multiplier);
}

function randomFloat(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

/**
 * Generate college stats for QB
 */
function generateQBStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const gamesStarted = Math.round(games * randomFloat(0.7, 1.0));
  const attemptsPerGame = randomInRange(25, 40, multiplier);
  const totalAttempts = gamesStarted * attemptsPerGame;
  const completionPct = randomFloat(58 + multiplier * 5, 68 + multiplier * 5);
  const completions = Math.round(totalAttempts * (completionPct / 100));
  const yardsPerAttempt = randomFloat(7.0, 9.5);

  return {
    passingYards: Math.round(completions * yardsPerAttempt * 1.1),
    passingTDs: randomInRange(Math.round(games * 1.5), Math.round(games * 2.5), multiplier),
    interceptions: randomInRange(Math.round(games * 0.3), Math.round(games * 0.8), 1 / multiplier),
    completionPct,
    rushingYards: randomInRange(-100, 800, multiplier), // Negative for sacks
    rushingTDs: randomInRange(0, Math.round(games * 0.3), multiplier),
    carries: randomInRange(Math.round(games * 2), Math.round(games * 6), 1),
  };
}

/**
 * Generate college stats for RB
 */
function generateRBStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const carriesPerGame = randomInRange(12, 22, multiplier);
  const totalCarries = Math.round(games * carriesPerGame * randomFloat(0.8, 1.0));
  const ypc = randomFloat(4.5, 6.5);

  return {
    carries: totalCarries,
    rushingYards: Math.round(totalCarries * ypc),
    rushingTDs: randomInRange(Math.round(games * 0.5), Math.round(games * 1.2), multiplier),
    receptions: randomInRange(Math.round(games * 1), Math.round(games * 3), multiplier),
    receivingYards: randomInRange(100, 600, multiplier),
    receivingTDs: randomInRange(0, Math.round(games * 0.2), multiplier),
  };
}

/**
 * Generate college stats for WR
 */
function generateWRStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const recPerGame = randomFloat(3, 7) * multiplier;
  const totalRec = Math.round(games * recPerGame);
  const ypr = randomFloat(12, 16);

  return {
    receptions: totalRec,
    receivingYards: Math.round(totalRec * ypr),
    receivingTDs: randomInRange(Math.round(games * 0.3), Math.round(games * 0.8), multiplier),
    rushingYards: randomInRange(0, 150, multiplier), // Jet sweeps
    rushingTDs: randomInRange(0, 3, multiplier),
  };
}

/**
 * Generate college stats for TE
 */
function generateTEStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const recPerGame = randomFloat(2, 5) * multiplier;
  const totalRec = Math.round(games * recPerGame);
  const ypr = randomFloat(10, 14);

  return {
    receptions: totalRec,
    receivingYards: Math.round(totalRec * ypr),
    receivingTDs: randomInRange(Math.round(games * 0.15), Math.round(games * 0.4), multiplier),
  };
}

/**
 * Generate college stats for OL
 */
function generateOLStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const gamesStarted = Math.round(games * randomFloat(0.6, 1.0) * multiplier);
  // Lower sacks allowed = better player
  const sacksAllowedPerGame = randomFloat(0.05, 0.3) / multiplier;

  return {
    sacksAllowed: Math.round(gamesStarted * sacksAllowedPerGame),
    pancakeBlocks: randomInRange(Math.round(gamesStarted * 0.5), Math.round(gamesStarted * 2), multiplier),
  };
}

/**
 * Generate college stats for DL
 */
function generateDLStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const tacklesPerGame = randomFloat(2, 5) * multiplier;

  return {
    tackles: Math.round(games * tacklesPerGame),
    tacklesForLoss: randomInRange(Math.round(games * 0.5), Math.round(games * 1.5), multiplier),
    sacks: randomFloat(games * 0.2, games * 0.8) * multiplier,
    forcedFumbles: randomInRange(0, Math.round(games * 0.1), multiplier),
  };
}

/**
 * Generate college stats for LB
 */
function generateLBStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const tacklesPerGame = randomFloat(5, 10) * multiplier;

  return {
    tackles: Math.round(games * tacklesPerGame),
    tacklesForLoss: randomInRange(Math.round(games * 0.3), Math.round(games * 1.0), multiplier),
    sacks: randomFloat(0, games * 0.3) * multiplier,
    forcedFumbles: randomInRange(0, Math.round(games * 0.1), multiplier),
    interceptionsDef: randomInRange(0, Math.round(years * 1.5), multiplier),
    passesDefended: randomInRange(Math.round(games * 0.1), Math.round(games * 0.4), multiplier),
  };
}

/**
 * Generate college stats for DB
 */
function generateDBStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const tacklesPerGame = randomFloat(3, 6) * multiplier;

  return {
    tackles: Math.round(games * tacklesPerGame),
    interceptionsDef: randomInRange(Math.round(years * 0.5), Math.round(years * 3), multiplier),
    passesDefended: randomInRange(Math.round(games * 0.3), Math.round(games * 0.8), multiplier),
    forcedFumbles: randomInRange(0, Math.round(years * 0.5), multiplier),
  };
}

/**
 * Generate college stats for K
 */
function generateKStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const fgAttempts = randomInRange(Math.round(games * 1.2), Math.round(games * 2), 1);
  const fgPct = randomFloat(70 + multiplier * 10, 85 + multiplier * 5);

  return {
    fieldGoalsMade: Math.round(fgAttempts * (fgPct / 100)),
    fieldGoalsAttempted: fgAttempts,
    longFieldGoal: randomInRange(45, 55, multiplier),
  };
}

/**
 * Generate college stats for P
 */
function generatePStats(years: number, games: number, multiplier: number): Partial<CollegeStats> {
  const puntsPerGame = randomFloat(3, 6);

  return {
    punts: Math.round(games * puntsPerGame),
    puntAverage: randomFloat(40 + multiplier * 3, 46 + multiplier * 2),
  };
}

/**
 * Generate complete college career for a prospect
 */
export function generateCollegeCareer(
  position: Position,
  round: number | 'UDFA',
  collegeTier: CollegeTier,
  randomFn: () => number = Math.random
): CollegeCareer {
  // Determine years played
  const yearsDist = YEARS_DISTRIBUTION[round] ?? YEARS_DISTRIBUTION.UDFA;
  const years = Math.round(yearsDist.min + randomFn() * (yearsDist.max - yearsDist.min));

  // Calculate games
  const gamesPlayed = years * GAMES_PER_SEASON - Math.floor(randomFn() * 5); // Some missed games
  const multiplier = getStatMultiplier(round) * getTierBonus(collegeTier);

  // Generate position-specific stats
  let positionStats: Partial<CollegeStats> = {};

  switch (position) {
    case Position.QB:
      positionStats = generateQBStats(years, gamesPlayed, multiplier);
      break;
    case Position.RB:
      positionStats = generateRBStats(years, gamesPlayed, multiplier);
      break;
    case Position.WR:
      positionStats = generateWRStats(years, gamesPlayed, multiplier);
      break;
    case Position.TE:
      positionStats = generateTEStats(years, gamesPlayed, multiplier);
      break;
    case Position.LT:
    case Position.LG:
    case Position.C:
    case Position.RG:
    case Position.RT:
      positionStats = generateOLStats(years, gamesPlayed, multiplier);
      break;
    case Position.DE:
    case Position.DT:
      positionStats = generateDLStats(years, gamesPlayed, multiplier);
      break;
    case Position.MLB:
    case Position.OLB:
      positionStats = generateLBStats(years, gamesPlayed, multiplier);
      break;
    case Position.CB:
    case Position.FS:
    case Position.SS:
      positionStats = generateDBStats(years, gamesPlayed, multiplier);
      break;
    case Position.K:
      positionStats = generateKStats(years, gamesPlayed, multiplier);
      break;
    case Position.P:
      positionStats = generatePStats(years, gamesPlayed, multiplier);
      break;
  }

  // Calculate games started based on round
  const startRatio = round === 1 ? 0.85 : round === 2 ? 0.8 : round === 'UDFA' ? 0.5 : 0.7;
  const gamesStarted = Math.round(gamesPlayed * startRatio * randomFn() * 0.3 + startRatio * 0.7);

  const stats: CollegeStats = {
    gamesPlayed,
    gamesStarted,
    years,
    ...positionStats,
  };

  // Generate accolades
  const accolades = generateAccolades(position, round, randomFn);

  // Calculate years started (at least 1 for draftable players)
  const yearsStarted = Math.max(1, Math.round(years * startRatio));

  // Captain chance based on round
  const captainChance = round === 1 ? 0.6 : round === 2 ? 0.4 : round === 'UDFA' ? 0.1 : 0.25;
  const captain = randomFn() < captainChance;

  // Bowl games
  const bowlGamesPlayed = Math.min(years, Math.round(years * (collegeTier === 'blue_blood' ? 1 : collegeTier === 'elite' ? 0.9 : 0.7)));
  const bowlWins = Math.round(bowlGamesPlayed * randomFn() * (multiplier > 1 ? 0.7 : 0.5));

  return {
    stats,
    accolades,
    yearsStarted,
    captain,
    bowlGamesPlayed,
    bowlWins,
  };
}

/**
 * Format stats for display based on position
 */
export function formatCollegeStats(position: Position, stats: CollegeStats): string {
  const lines: string[] = [];
  lines.push(`${stats.gamesPlayed} GP, ${stats.gamesStarted} GS (${stats.years} years)`);

  switch (position) {
    case Position.QB:
      if (stats.passingYards !== undefined) {
        lines.push(`${stats.passingYards} yds, ${stats.passingTDs} TD, ${stats.interceptions} INT (${stats.completionPct}%)`);
        if (stats.rushingYards !== undefined && stats.rushingYards > 100) {
          lines.push(`${stats.rushingYards} rush yds, ${stats.rushingTDs} rush TD`);
        }
      }
      break;
    case Position.RB:
      if (stats.rushingYards !== undefined) {
        const ypc = stats.carries ? (stats.rushingYards / stats.carries).toFixed(1) : '0.0';
        lines.push(`${stats.rushingYards} yds, ${ypc} YPC, ${stats.rushingTDs} TD`);
        if (stats.receptions) {
          lines.push(`${stats.receptions} rec, ${stats.receivingYards} rec yds`);
        }
      }
      break;
    case Position.WR:
    case Position.TE:
      if (stats.receptions !== undefined) {
        const ypr = stats.receptions ? (stats.receivingYards! / stats.receptions).toFixed(1) : '0.0';
        lines.push(`${stats.receptions} rec, ${stats.receivingYards} yds, ${ypr} YPR, ${stats.receivingTDs} TD`);
      }
      break;
    case Position.LT:
    case Position.LG:
    case Position.C:
    case Position.RG:
    case Position.RT:
      if (stats.sacksAllowed !== undefined) {
        lines.push(`${stats.sacksAllowed} sacks allowed, ${stats.pancakeBlocks} pancakes`);
      }
      break;
    case Position.DE:
    case Position.DT:
      if (stats.tackles !== undefined) {
        lines.push(`${stats.tackles} tkl, ${stats.tacklesForLoss} TFL, ${stats.sacks?.toFixed(1)} sacks`);
      }
      break;
    case Position.MLB:
    case Position.OLB:
      if (stats.tackles !== undefined) {
        lines.push(`${stats.tackles} tkl, ${stats.tacklesForLoss} TFL, ${stats.sacks?.toFixed(1)} sacks`);
        if (stats.interceptionsDef) {
          lines.push(`${stats.interceptionsDef} INT, ${stats.passesDefended} PD`);
        }
      }
      break;
    case Position.CB:
    case Position.FS:
    case Position.SS:
      if (stats.tackles !== undefined) {
        lines.push(`${stats.tackles} tkl, ${stats.interceptionsDef} INT, ${stats.passesDefended} PD`);
      }
      break;
    case Position.K:
      if (stats.fieldGoalsMade !== undefined) {
        const pct = stats.fieldGoalsAttempted ? ((stats.fieldGoalsMade / stats.fieldGoalsAttempted) * 100).toFixed(1) : '0.0';
        lines.push(`${stats.fieldGoalsMade}/${stats.fieldGoalsAttempted} FG (${pct}%), long ${stats.longFieldGoal}`);
      }
      break;
    case Position.P:
      if (stats.punts !== undefined) {
        lines.push(`${stats.punts} punts, ${stats.puntAverage?.toFixed(1)} avg`);
      }
      break;
  }

  return lines.join('\n');
}
