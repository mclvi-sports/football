/**
 * Season Module
 *
 * Exports all season simulation functionality.
 */

// Types
export * from './types';

// Standings
export {
  createInitialStandings,
  createEmptyRecord,
  updateStandingsWithGame,
  getWinPercentage,
  getPointDifferential,
  calculateRankings,
  calculatePlayoffSeeds,
  checkClinching,
  getDivisionStandings,
  getConferenceStandings,
  getPlayoffPicture,
  formatRecord,
  formatStreak,
} from './standings';

// Playoffs
export {
  generatePlayoffBracket,
  recordPlayoffResult,
  getMatchupsForRound,
  isRoundComplete,
  getCurrentRound,
  getRemainingMatchups,
  setByeTeam,
} from './playoffs';

// Season Simulator
export { SeasonSimulator, createSeasonSimulator } from './season-simulator';
