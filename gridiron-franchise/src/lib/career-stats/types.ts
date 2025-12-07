/**
 * Career Stats Types
 *
 * Stores year-by-year statistics for players with cumulative totals.
 * Uses localStorage for persistence across browser sessions.
 */

import { Position } from "../types";

// ============================================================================
// STAT CATEGORY INTERFACES
// ============================================================================

export interface PassingStats {
  attempts: number;
  completions: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
  sacked: number;
  completionPct: number;
  yardsPerAttempt: number;
  passerRating: number;
}

export interface RushingStats {
  carries: number;
  yards: number;
  touchdowns: number;
  fumbles: number;
  long: number;
  yardsPerCarry: number;
}

export interface ReceivingStats {
  targets: number;
  catches: number;
  yards: number;
  touchdowns: number;
  long: number;
  catchPct: number;
  yardsPerCatch: number;
}

export interface DefenseStats {
  tackles: number;
  sacks: number;
  interceptions: number;
  passDeflections: number;
  fumbleRecoveries: number;
}

export interface KickingStats {
  fgAttempts: number;
  fgMade: number;
  fgPct: number;
  xpAttempts: number;
  xpMade: number;
  xpPct: number;
  punts: number;
  puntYards: number;
  puntAvg: number;
}

// ============================================================================
// CAREER STATS INTERFACES
// ============================================================================

/**
 * Single season entry for career history
 */
export interface CareerSeasonEntry {
  year: number;
  teamId: string;
  teamAbbrev: string;
  gamesPlayed: number;
  passing: PassingStats;
  rushing: RushingStats;
  receiving: ReceivingStats;
  defense: DefenseStats;
  kicking: KickingStats;
}

/**
 * Full career record for a player
 */
export interface PlayerCareerStats {
  playerId: string;
  playerName: string;
  position: Position;
  seasons: CareerSeasonEntry[];
  careerTotals: {
    gamesPlayed: number;
    passing: PassingStats;
    rushing: RushingStats;
    receiving: ReceivingStats;
    defense: DefenseStats;
    kicking: KickingStats;
  };
  lastUpdated: string;
}

/**
 * Store structure for all players
 */
export interface CareerStatsStore {
  version: number;
  players: Record<string, PlayerCareerStats>;
  lastUpdated: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CAREER_STATS_STORAGE_KEY = "gridiron-career-stats";
export const CAREER_STATS_VERSION = 1;
