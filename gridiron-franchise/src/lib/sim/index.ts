/**
 * Simulation Module
 *
 * Public API for the game simulation engine.
 * Use simulateGameWithRosters() for the high-level integration.
 */

// Main game runner API
export {
  simulateGameWithRosters,
  getGameLeaders,
  getPlayerStatsById,
  getTeamPlayerStats,
  type SimulateGameOptions,
} from './game-runner';

// Types
export type {
  GameResult,
  PlayerGameStats,
  SimStats,
  SimTeam,
  SimState,
  PlayResult,
  PlayType,
  PlayResultType,
  GameSettings,
  GameType,
  Weather,
  HomeAdvantage,
  GameSituation,
  SimBadge,
  SimTrait,
  OffensiveScheme,
  DefensiveScheme,
} from './types';

// Team adapter (for custom team building)
export { adaptTeamRoster, getStarter, formatPlayerName } from './team-adapter';

// Low-level simulator class (for advanced usage)
export { Simulator } from './simulator';
