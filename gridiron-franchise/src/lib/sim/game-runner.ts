/**
 * Game Runner
 *
 * High-level API for simulating games with roster data.
 * Connects the roster generator output to the simulation engine.
 */

import { TeamRosterData } from '../dev-player-store';
import { Simulator } from './simulator';
import { adaptTeamRoster } from './team-adapter';
import {
  GameResult,
  GameSettings,
  GameType,
  Weather,
  HomeAdvantage,
  PlayerGameStats,
} from './types';

// ============================================================================
// GAME SIMULATION OPTIONS
// ============================================================================

export interface SimulateGameOptions {
  /** Game type affects modifiers and atmosphere */
  gameType?: GameType;
  /** Weather conditions affect passing and kicking */
  weather?: Weather;
  /** Home field advantage level */
  homeAdvantage?: HomeAdvantage;
  /** Include debug log in results */
  includeDebugLog?: boolean;
}

const DEFAULT_OPTIONS: Required<SimulateGameOptions> = {
  gameType: 'regular',
  weather: 'clear',
  homeAdvantage: 'normal',
  includeDebugLog: false,
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that team roster data is complete enough for simulation
 */
function validateTeamRoster(
  team: TeamRosterData,
  label: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!team) {
    errors.push(`${label} team data is missing`);
    return { valid: false, errors };
  }

  if (!team.team) {
    errors.push(`${label} team info is missing`);
  }

  if (!team.roster) {
    errors.push(`${label} roster is missing`);
  } else {
    if (!team.roster.players || team.roster.players.length === 0) {
      errors.push(`${label} has no players`);
    }
    if (!team.roster.depthChart) {
      errors.push(`${label} depth chart is missing`);
    }
  }

  if (!team.tier) {
    errors.push(`${label} tier is missing`);
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// MAIN API
// ============================================================================

/**
 * Simulate a game between two teams using their roster data.
 *
 * @param awayTeam - Away team roster data from roster generator
 * @param homeTeam - Home team roster data from roster generator
 * @param options - Optional game settings
 * @returns GameResult with scores, team stats, and individual player stats
 *
 * @example
 * ```typescript
 * import { simulateGameWithRosters } from '@/lib/sim';
 * import { getTeamRoster } from '@/lib/dev-player-store';
 *
 * const awayTeam = getTeamRoster('BUF');
 * const homeTeam = getTeamRoster('KC');
 *
 * const result = simulateGameWithRosters(awayTeam, homeTeam, {
 *   gameType: 'playoff',
 *   weather: 'snow',
 *   homeAdvantage: 'loud',
 * });
 *
 * console.log(`Final: ${result.awayTeam.abbrev} ${result.awayScore} - ${result.homeTeam.abbrev} ${result.homeScore}`);
 * ```
 */
export function simulateGameWithRosters(
  awayTeam: TeamRosterData,
  homeTeam: TeamRosterData,
  options: SimulateGameOptions = {}
): GameResult {
  // Merge options with defaults
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate inputs
  const awayValidation = validateTeamRoster(awayTeam, 'Away');
  const homeValidation = validateTeamRoster(homeTeam, 'Home');

  if (!awayValidation.valid || !homeValidation.valid) {
    const allErrors = [...awayValidation.errors, ...homeValidation.errors];
    throw new Error(`Invalid roster data: ${allErrors.join('; ')}`);
  }

  // Convert roster data to SimTeam format
  const awaySimTeam = adaptTeamRoster(awayTeam);
  const homeSimTeam = adaptTeamRoster(homeTeam);

  // Create and configure simulator
  const sim = new Simulator();
  sim.settings.away = awaySimTeam;
  sim.settings.home = homeSimTeam;
  sim.settings.gameType = opts.gameType;
  sim.settings.weather = opts.weather;
  sim.settings.homeAdvantage = opts.homeAdvantage;

  // Initialize game modifiers (schemes, coaching, facilities)
  sim.initializeGameModifiers();

  // Run the simulation
  const plays = sim.simulateGame();

  // Extract player stats as array
  const playerStats: PlayerGameStats[] = Array.from(sim.playerStats.values());

  // Build result
  const result: GameResult = {
    success: true,
    awayScore: sim.state.awayScore,
    homeScore: sim.state.homeScore,
    awayTeam: {
      id: awaySimTeam.id,
      name: `${awaySimTeam.city} ${awaySimTeam.name}`,
      abbrev: awaySimTeam.abbrev,
    },
    homeTeam: {
      id: homeSimTeam.id,
      name: `${homeSimTeam.city} ${homeSimTeam.name}`,
      abbrev: homeSimTeam.abbrev,
    },
    teamStats: {
      away: sim.stats.away,
      home: sim.stats.home,
    },
    playerStats,
    plays,
    settings: {
      gameType: opts.gameType,
      weather: opts.weather,
      homeAdvantage: opts.homeAdvantage,
    },
    totalPlays: sim.plays,
  };

  // Include debug log if requested
  if (opts.includeDebugLog) {
    result.debugLog = sim.debugLog;
  }

  return result;
}

/**
 * Get a summary of player stats for display
 */
export function getGameLeaders(result: GameResult): {
  passing: PlayerGameStats | null;
  rushing: PlayerGameStats | null;
  receiving: PlayerGameStats | null;
  tackles: PlayerGameStats | null;
} {
  let passing: PlayerGameStats | null = null;
  let rushing: PlayerGameStats | null = null;
  let receiving: PlayerGameStats | null = null;
  let tackles: PlayerGameStats | null = null;

  for (const stats of result.playerStats) {
    // Passing leader (by yards)
    if (!passing || stats.passing.yards > passing.passing.yards) {
      if (stats.passing.attempts > 0) {
        passing = stats;
      }
    }

    // Rushing leader (by yards)
    if (!rushing || stats.rushing.yards > rushing.rushing.yards) {
      if (stats.rushing.carries > 0) {
        rushing = stats;
      }
    }

    // Receiving leader (by yards)
    if (!receiving || stats.receiving.yards > receiving.receiving.yards) {
      if (stats.receiving.catches > 0) {
        receiving = stats;
      }
    }

    // Tackle leader
    if (!tackles || stats.defense.tackles > tackles.defense.tackles) {
      if (stats.defense.tackles > 0) {
        tackles = stats;
      }
    }
  }

  return { passing, rushing, receiving, tackles };
}

/**
 * Get stats for a specific player by ID
 */
export function getPlayerStatsById(
  result: GameResult,
  playerId: string
): PlayerGameStats | undefined {
  return result.playerStats.find((p) => p.playerId === playerId);
}

/**
 * Get all stats for a specific team
 */
export function getTeamPlayerStats(
  result: GameResult,
  teamId: 'away' | 'home'
): PlayerGameStats[] {
  return result.playerStats.filter((p) => p.teamId === teamId);
}
