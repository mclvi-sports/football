/**
 * Season Stats Aggregation
 *
 * Functions to aggregate player statistics across all games
 * in a season, producing season totals and leaderboards.
 */

import { Position } from '../types';
import { PlayerGameStats } from '../sim/types';
import { GameResult } from './types';

// ============================================================================
// PLAYER SEASON STATS
// ============================================================================

export interface PlayerSeasonStats {
  playerId: string;
  playerName: string;
  position: Position;
  teamId: string; // Actual team ID (e.g., 'NYE', 'BOS')
  gamesPlayed: number;
  passing: {
    attempts: number;
    completions: number;
    yards: number;
    touchdowns: number;
    interceptions: number;
    sacked: number;
    completionPct: number; // Calculated
    yardsPerAttempt: number; // Calculated
    passerRating: number; // Calculated
  };
  rushing: {
    carries: number;
    yards: number;
    touchdowns: number;
    fumbles: number;
    long: number;
    yardsPerCarry: number; // Calculated
  };
  receiving: {
    targets: number;
    catches: number;
    yards: number;
    touchdowns: number;
    long: number;
    catchPct: number; // Calculated
    yardsPerCatch: number; // Calculated
  };
  defense: {
    tackles: number;
    sacks: number;
    interceptions: number;
    passDeflections: number;
    fumbleRecoveries: number;
  };
  kicking: {
    fgAttempts: number;
    fgMade: number;
    fgPct: number; // Calculated
    xpAttempts: number;
    xpMade: number;
    xpPct: number; // Calculated
    punts: number;
    puntYards: number;
    puntAvg: number; // Calculated
  };
}

// ============================================================================
// STAT AGGREGATION
// ============================================================================

/**
 * Aggregate all player stats from completed games into season totals
 */
export function aggregateSeasonStats(
  completedGames: GameResult[]
): Map<string, PlayerSeasonStats> {
  const statsMap = new Map<string, PlayerSeasonStats>();

  for (const game of completedGames) {
    for (const playerStats of game.playerStats) {
      // Resolve actual team ID from 'away'/'home'
      const actualTeamId =
        playerStats.teamId === 'away' ? game.awayTeamId : game.homeTeamId;

      let seasonStats = statsMap.get(playerStats.playerId);

      if (!seasonStats) {
        // Initialize new player season stats
        seasonStats = createEmptySeasonStats(
          playerStats.playerId,
          playerStats.playerName,
          playerStats.position,
          actualTeamId
        );
        statsMap.set(playerStats.playerId, seasonStats);
      }

      // Check if player actually participated in this game
      const participated =
        playerStats.passing.attempts > 0 ||
        playerStats.rushing.carries > 0 ||
        playerStats.receiving.targets > 0 ||
        playerStats.defense.tackles > 0 ||
        playerStats.kicking.fgAttempts > 0 ||
        playerStats.kicking.punts > 0;

      if (participated) {
        seasonStats.gamesPlayed++;
      }

      // Aggregate passing stats
      seasonStats.passing.attempts += playerStats.passing.attempts;
      seasonStats.passing.completions += playerStats.passing.completions;
      seasonStats.passing.yards += playerStats.passing.yards;
      seasonStats.passing.touchdowns += playerStats.passing.touchdowns;
      seasonStats.passing.interceptions += playerStats.passing.interceptions;
      seasonStats.passing.sacked += playerStats.passing.sacked;

      // Aggregate rushing stats
      seasonStats.rushing.carries += playerStats.rushing.carries;
      seasonStats.rushing.yards += playerStats.rushing.yards;
      seasonStats.rushing.touchdowns += playerStats.rushing.touchdowns;
      seasonStats.rushing.fumbles += playerStats.rushing.fumbles;
      seasonStats.rushing.long = Math.max(
        seasonStats.rushing.long,
        playerStats.rushing.long
      );

      // Aggregate receiving stats
      seasonStats.receiving.targets += playerStats.receiving.targets;
      seasonStats.receiving.catches += playerStats.receiving.catches;
      seasonStats.receiving.yards += playerStats.receiving.yards;
      seasonStats.receiving.touchdowns += playerStats.receiving.touchdowns;
      seasonStats.receiving.long = Math.max(
        seasonStats.receiving.long,
        playerStats.receiving.long
      );

      // Aggregate defense stats
      seasonStats.defense.tackles += playerStats.defense.tackles;
      seasonStats.defense.sacks += playerStats.defense.sacks;
      seasonStats.defense.interceptions += playerStats.defense.interceptions;
      seasonStats.defense.passDeflections += playerStats.defense.passDeflections;
      seasonStats.defense.fumbleRecoveries += playerStats.defense.fumbleRecoveries;

      // Aggregate kicking stats
      seasonStats.kicking.fgAttempts += playerStats.kicking.fgAttempts;
      seasonStats.kicking.fgMade += playerStats.kicking.fgMade;
      seasonStats.kicking.xpAttempts += playerStats.kicking.xpAttempts;
      seasonStats.kicking.xpMade += playerStats.kicking.xpMade;
      seasonStats.kicking.punts += playerStats.kicking.punts;
      seasonStats.kicking.puntYards += playerStats.kicking.puntYards;
    }
  }

  // Calculate derived stats for all players
  for (const stats of statsMap.values()) {
    calculateDerivedStats(stats);
  }

  return statsMap;
}

/**
 * Create empty season stats structure for a player
 */
function createEmptySeasonStats(
  playerId: string,
  playerName: string,
  position: Position,
  teamId: string
): PlayerSeasonStats {
  return {
    playerId,
    playerName,
    position,
    teamId,
    gamesPlayed: 0,
    passing: {
      attempts: 0,
      completions: 0,
      yards: 0,
      touchdowns: 0,
      interceptions: 0,
      sacked: 0,
      completionPct: 0,
      yardsPerAttempt: 0,
      passerRating: 0,
    },
    rushing: {
      carries: 0,
      yards: 0,
      touchdowns: 0,
      fumbles: 0,
      long: 0,
      yardsPerCarry: 0,
    },
    receiving: {
      targets: 0,
      catches: 0,
      yards: 0,
      touchdowns: 0,
      long: 0,
      catchPct: 0,
      yardsPerCatch: 0,
    },
    defense: {
      tackles: 0,
      sacks: 0,
      interceptions: 0,
      passDeflections: 0,
      fumbleRecoveries: 0,
    },
    kicking: {
      fgAttempts: 0,
      fgMade: 0,
      fgPct: 0,
      xpAttempts: 0,
      xpMade: 0,
      xpPct: 0,
      punts: 0,
      puntYards: 0,
      puntAvg: 0,
    },
  };
}

/**
 * Calculate derived stats (percentages, averages, ratings)
 */
function calculateDerivedStats(stats: PlayerSeasonStats): void {
  // Passing
  if (stats.passing.attempts > 0) {
    stats.passing.completionPct =
      (stats.passing.completions / stats.passing.attempts) * 100;
    stats.passing.yardsPerAttempt =
      stats.passing.yards / stats.passing.attempts;
    stats.passing.passerRating = calculatePasserRating(
      stats.passing.completions,
      stats.passing.attempts,
      stats.passing.yards,
      stats.passing.touchdowns,
      stats.passing.interceptions
    );
  }

  // Rushing
  if (stats.rushing.carries > 0) {
    stats.rushing.yardsPerCarry = stats.rushing.yards / stats.rushing.carries;
  }

  // Receiving
  if (stats.receiving.targets > 0) {
    stats.receiving.catchPct =
      (stats.receiving.catches / stats.receiving.targets) * 100;
  }
  if (stats.receiving.catches > 0) {
    stats.receiving.yardsPerCatch =
      stats.receiving.yards / stats.receiving.catches;
  }

  // Kicking
  if (stats.kicking.fgAttempts > 0) {
    stats.kicking.fgPct =
      (stats.kicking.fgMade / stats.kicking.fgAttempts) * 100;
  }
  if (stats.kicking.xpAttempts > 0) {
    stats.kicking.xpPct =
      (stats.kicking.xpMade / stats.kicking.xpAttempts) * 100;
  }
  if (stats.kicking.punts > 0) {
    stats.kicking.puntAvg = stats.kicking.puntYards / stats.kicking.punts;
  }
}

/**
 * Calculate NFL passer rating
 */
function calculatePasserRating(
  completions: number,
  attempts: number,
  yards: number,
  touchdowns: number,
  interceptions: number
): number {
  if (attempts === 0) return 0;

  // Component calculations (capped at 2.375)
  const a = Math.min(Math.max((completions / attempts - 0.3) * 5, 0), 2.375);
  const b = Math.min(Math.max((yards / attempts - 3) * 0.25, 0), 2.375);
  const c = Math.min(Math.max((touchdowns / attempts) * 20, 0), 2.375);
  const d = Math.min(Math.max(2.375 - (interceptions / attempts) * 25, 0), 2.375);

  return ((a + b + c + d) / 6) * 100;
}

// ============================================================================
// LEADERBOARDS
// ============================================================================

export interface SeasonLeaders {
  passingYards: PlayerSeasonStats[];
  passingTDs: PlayerSeasonStats[];
  passerRating: PlayerSeasonStats[];
  rushingYards: PlayerSeasonStats[];
  rushingTDs: PlayerSeasonStats[];
  receivingYards: PlayerSeasonStats[];
  receivingTDs: PlayerSeasonStats[];
  receptions: PlayerSeasonStats[];
  tackles: PlayerSeasonStats[];
  sacks: PlayerSeasonStats[];
  interceptions: PlayerSeasonStats[];
}

/**
 * Get season leaders for all major statistical categories
 */
export function getSeasonLeaders(
  statsMap: Map<string, PlayerSeasonStats>,
  topN: number = 10
): SeasonLeaders {
  const allStats = Array.from(statsMap.values());

  return {
    passingYards: getTopPlayers(allStats, (s) => s.passing.yards, topN, (s) => s.passing.attempts > 50),
    passingTDs: getTopPlayers(allStats, (s) => s.passing.touchdowns, topN, (s) => s.passing.attempts > 50),
    passerRating: getTopPlayers(allStats, (s) => s.passing.passerRating, topN, (s) => s.passing.attempts > 100),
    rushingYards: getTopPlayers(allStats, (s) => s.rushing.yards, topN, (s) => s.rushing.carries > 20),
    rushingTDs: getTopPlayers(allStats, (s) => s.rushing.touchdowns, topN, (s) => s.rushing.carries > 20),
    receivingYards: getTopPlayers(allStats, (s) => s.receiving.yards, topN, (s) => s.receiving.catches > 10),
    receivingTDs: getTopPlayers(allStats, (s) => s.receiving.touchdowns, topN, (s) => s.receiving.catches > 10),
    receptions: getTopPlayers(allStats, (s) => s.receiving.catches, topN, (s) => s.receiving.catches > 0),
    tackles: getTopPlayers(allStats, (s) => s.defense.tackles, topN, (s) => s.defense.tackles > 0),
    sacks: getTopPlayers(allStats, (s) => s.defense.sacks, topN, (s) => s.defense.sacks > 0),
    interceptions: getTopPlayers(allStats, (s) => s.defense.interceptions, topN, (s) => s.defense.interceptions > 0),
  };
}

/**
 * Get top N players by a stat, with optional filter
 */
function getTopPlayers(
  stats: PlayerSeasonStats[],
  getValue: (s: PlayerSeasonStats) => number,
  topN: number,
  filter?: (s: PlayerSeasonStats) => boolean
): PlayerSeasonStats[] {
  let filtered = filter ? stats.filter(filter) : stats;
  return filtered.sort((a, b) => getValue(b) - getValue(a)).slice(0, topN);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get season stats for a specific player
 */
export function getPlayerSeasonStats(
  statsMap: Map<string, PlayerSeasonStats>,
  playerId: string
): PlayerSeasonStats | undefined {
  return statsMap.get(playerId);
}

/**
 * Get all players from a specific team
 */
export function getTeamSeasonStats(
  statsMap: Map<string, PlayerSeasonStats>,
  teamId: string
): PlayerSeasonStats[] {
  return Array.from(statsMap.values()).filter((s) => s.teamId === teamId);
}

/**
 * Get players by position
 */
export function getPositionSeasonStats(
  statsMap: Map<string, PlayerSeasonStats>,
  position: Position
): PlayerSeasonStats[] {
  return Array.from(statsMap.values()).filter((s) => s.position === position);
}

/**
 * Format stat line for display
 */
export function formatPassingLine(stats: PlayerSeasonStats): string {
  const p = stats.passing;
  return `${p.completions}/${p.attempts}, ${p.yards} yds, ${p.touchdowns} TD, ${p.interceptions} INT (${p.passerRating.toFixed(1)} rating)`;
}

export function formatRushingLine(stats: PlayerSeasonStats): string {
  const r = stats.rushing;
  return `${r.carries} car, ${r.yards} yds, ${r.touchdowns} TD (${r.yardsPerCarry.toFixed(1)} avg)`;
}

export function formatReceivingLine(stats: PlayerSeasonStats): string {
  const r = stats.receiving;
  return `${r.catches} rec, ${r.yards} yds, ${r.touchdowns} TD (${r.yardsPerCatch.toFixed(1)} avg)`;
}

export function formatDefenseLine(stats: PlayerSeasonStats): string {
  const d = stats.defense;
  return `${d.tackles} tkl, ${d.sacks} sacks, ${d.interceptions} INT, ${d.passDeflections} PD`;
}

// ============================================================================
// CURRENT SEASON STATS (from sessionStorage)
// ============================================================================

const SEASON_STATE_KEY = 'seasonState';

/**
 * Get a player's current season stats from completed games in sessionStorage
 */
export function getPlayerCurrentSeasonStats(playerId: string): PlayerSeasonStats | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(SEASON_STATE_KEY);
    if (!stored) return null;

    const state = JSON.parse(stored);
    if (!state.completedGames || state.completedGames.length === 0) return null;

    // Aggregate all stats from completed games
    const statsMap = aggregateSeasonStats(state.completedGames);

    return statsMap.get(playerId) || null;
  } catch (error) {
    console.error('Error getting player season stats:', error);
    return null;
  }
}

/**
 * Get all current season stats (from sessionStorage)
 */
export function getCurrentSeasonStats(): Map<string, PlayerSeasonStats> | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(SEASON_STATE_KEY);
    if (!stored) return null;

    const state = JSON.parse(stored);
    if (!state.completedGames || state.completedGames.length === 0) return null;

    return aggregateSeasonStats(state.completedGames);
  } catch (error) {
    console.error('Error getting season stats:', error);
    return null;
  }
}
