/**
 * Career Stats Store
 *
 * sessionStorage persistence for player career statistics.
 * Uses sessionStorage to avoid quota issues - stats are regenerated
 * when starting a new game anyway.
 */

import { Position } from "../types";
import { PlayerSeasonStats } from "../season/season-stats";
import {
  CareerStatsStore,
  PlayerCareerStats,
  CareerSeasonEntry,
  PassingStats,
  RushingStats,
  ReceivingStats,
  DefenseStats,
  KickingStats,
  CAREER_STATS_STORAGE_KEY,
  CAREER_STATS_VERSION,
} from "./types";

// ============================================================================
// STORAGE HELPERS
// ============================================================================

export function getCareerStatsStore(): CareerStatsStore {
  if (typeof window === "undefined") return createEmptyStore();

  try {
    const stored = sessionStorage.getItem(CAREER_STATS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Handle version migrations if needed
      if (parsed.version !== CAREER_STATS_VERSION) {
        return migrateStore(parsed);
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error reading career stats store:", error);
  }

  return createEmptyStore();
}

export function saveCareerStatsStore(store: CareerStatsStore): void {
  if (typeof window === "undefined") return;

  try {
    store.lastUpdated = new Date().toISOString();
    sessionStorage.setItem(CAREER_STATS_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Error saving career stats store:", error);
  }
}

function createEmptyStore(): CareerStatsStore {
  return {
    version: CAREER_STATS_VERSION,
    players: {},
    lastUpdated: new Date().toISOString(),
  };
}

function migrateStore(old: unknown): CareerStatsStore {
  // Future-proof migration logic
  console.warn("Migrating career stats store from old version");
  return createEmptyStore();
}

// ============================================================================
// PLAYER CAREER CRUD
// ============================================================================

export function getPlayerCareerStats(
  playerId: string
): PlayerCareerStats | null {
  const store = getCareerStatsStore();
  return store.players[playerId] || null;
}

export function savePlayerCareerStats(stats: PlayerCareerStats): void {
  const store = getCareerStatsStore();
  stats.lastUpdated = new Date().toISOString();
  store.players[stats.playerId] = stats;
  saveCareerStatsStore(store);
}

/**
 * Bulk save multiple player career stats at once.
 * Much more efficient than calling savePlayerCareerStats repeatedly.
 */
export function bulkSaveCareerStats(allStats: PlayerCareerStats[]): void {
  if (typeof window === "undefined") return;
  if (allStats.length === 0) return;

  const store = getCareerStatsStore();
  const now = new Date().toISOString();

  for (const stats of allStats) {
    stats.lastUpdated = now;
    store.players[stats.playerId] = stats;
  }

  saveCareerStatsStore(store);
}

export function deletePlayerCareerStats(playerId: string): void {
  const store = getCareerStatsStore();
  delete store.players[playerId];
  saveCareerStatsStore(store);
}

// ============================================================================
// SEASON DATA INTEGRATION
// ============================================================================

export function addSeasonToCareer(
  playerId: string,
  playerName: string,
  position: Position,
  seasonStats: PlayerSeasonStats,
  year: number,
  teamAbbrev: string
): void {
  const store = getCareerStatsStore();
  let career = store.players[playerId];

  if (!career) {
    career = createEmptyCareerStats(playerId, playerName, position);
  }

  // Check if season already exists (update) or is new (add)
  const existingIdx = career.seasons.findIndex((s) => s.year === year);
  const seasonEntry: CareerSeasonEntry = {
    year,
    teamId: seasonStats.teamId,
    teamAbbrev,
    gamesPlayed: seasonStats.gamesPlayed,
    passing: { ...seasonStats.passing },
    rushing: { ...seasonStats.rushing },
    receiving: { ...seasonStats.receiving },
    defense: { ...seasonStats.defense },
    kicking: { ...seasonStats.kicking },
  };

  if (existingIdx >= 0) {
    career.seasons[existingIdx] = seasonEntry;
  } else {
    career.seasons.push(seasonEntry);
    career.seasons.sort((a, b) => a.year - b.year);
  }

  // Recalculate career totals
  recalculateCareerTotals(career);

  store.players[playerId] = career;
  saveCareerStatsStore(store);
}

// ============================================================================
// EMPTY STRUCTURE CREATORS
// ============================================================================

function createEmptyCareerStats(
  playerId: string,
  playerName: string,
  position: Position
): PlayerCareerStats {
  return {
    playerId,
    playerName,
    position,
    seasons: [],
    careerTotals: {
      gamesPlayed: 0,
      passing: createEmptyPassingStats(),
      rushing: createEmptyRushingStats(),
      receiving: createEmptyReceivingStats(),
      defense: createEmptyDefenseStats(),
      kicking: createEmptyKickingStats(),
    },
    lastUpdated: new Date().toISOString(),
  };
}

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
// CAREER TOTALS CALCULATION
// ============================================================================

function recalculateCareerTotals(career: PlayerCareerStats): void {
  const totals = {
    gamesPlayed: 0,
    passing: createEmptyPassingStats(),
    rushing: createEmptyRushingStats(),
    receiving: createEmptyReceivingStats(),
    defense: createEmptyDefenseStats(),
    kicking: createEmptyKickingStats(),
  };

  for (const season of career.seasons) {
    totals.gamesPlayed += season.gamesPlayed;

    // Sum passing stats
    totals.passing.attempts += season.passing.attempts;
    totals.passing.completions += season.passing.completions;
    totals.passing.yards += season.passing.yards;
    totals.passing.touchdowns += season.passing.touchdowns;
    totals.passing.interceptions += season.passing.interceptions;
    totals.passing.sacked += season.passing.sacked;

    // Sum rushing stats
    totals.rushing.carries += season.rushing.carries;
    totals.rushing.yards += season.rushing.yards;
    totals.rushing.touchdowns += season.rushing.touchdowns;
    totals.rushing.fumbles += season.rushing.fumbles;
    totals.rushing.long = Math.max(totals.rushing.long, season.rushing.long);

    // Sum receiving stats
    totals.receiving.targets += season.receiving.targets;
    totals.receiving.catches += season.receiving.catches;
    totals.receiving.yards += season.receiving.yards;
    totals.receiving.touchdowns += season.receiving.touchdowns;
    totals.receiving.long = Math.max(
      totals.receiving.long,
      season.receiving.long
    );

    // Sum defense stats
    totals.defense.tackles += season.defense.tackles;
    totals.defense.sacks += season.defense.sacks;
    totals.defense.interceptions += season.defense.interceptions;
    totals.defense.passDeflections += season.defense.passDeflections;
    totals.defense.fumbleRecoveries += season.defense.fumbleRecoveries;

    // Sum kicking stats
    totals.kicking.fgAttempts += season.kicking.fgAttempts;
    totals.kicking.fgMade += season.kicking.fgMade;
    totals.kicking.xpAttempts += season.kicking.xpAttempts;
    totals.kicking.xpMade += season.kicking.xpMade;
    totals.kicking.punts += season.kicking.punts;
    totals.kicking.puntYards += season.kicking.puntYards;
  }

  // Calculate derived stats (averages, percentages)
  if (totals.passing.attempts > 0) {
    totals.passing.completionPct =
      (totals.passing.completions / totals.passing.attempts) * 100;
    totals.passing.yardsPerAttempt =
      totals.passing.yards / totals.passing.attempts;
    totals.passing.passerRating = calculatePasserRating(
      totals.passing.completions,
      totals.passing.attempts,
      totals.passing.yards,
      totals.passing.touchdowns,
      totals.passing.interceptions
    );
  }

  if (totals.rushing.carries > 0) {
    totals.rushing.yardsPerCarry =
      totals.rushing.yards / totals.rushing.carries;
  }

  if (totals.receiving.targets > 0) {
    totals.receiving.catchPct =
      (totals.receiving.catches / totals.receiving.targets) * 100;
  }
  if (totals.receiving.catches > 0) {
    totals.receiving.yardsPerCatch =
      totals.receiving.yards / totals.receiving.catches;
  }

  if (totals.kicking.fgAttempts > 0) {
    totals.kicking.fgPct =
      (totals.kicking.fgMade / totals.kicking.fgAttempts) * 100;
  }
  if (totals.kicking.xpAttempts > 0) {
    totals.kicking.xpPct =
      (totals.kicking.xpMade / totals.kicking.xpAttempts) * 100;
  }
  if (totals.kicking.punts > 0) {
    totals.kicking.puntAvg = totals.kicking.puntYards / totals.kicking.punts;
  }

  career.careerTotals = totals;
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
  const d = Math.min(
    Math.max(2.375 - (interceptions / attempts) * 25, 0),
    2.375
  );

  return ((a + b + c + d) / 6) * 100;
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export function clearCareerStatsStore(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CAREER_STATS_STORAGE_KEY);
}

export function getAllCareerStats(): Record<string, PlayerCareerStats> {
  return getCareerStatsStore().players;
}

export function getCareerStatsCount(): number {
  return Object.keys(getCareerStatsStore().players).length;
}
