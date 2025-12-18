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

// Season Stats Aggregation
export {
  aggregateSeasonStats,
  getSeasonLeaders,
  getPlayerSeasonStats,
  getTeamSeasonStats,
  getPositionSeasonStats,
  formatPassingLine,
  formatRushingLine,
  formatReceivingLine,
  formatDefenseLine,
  type PlayerSeasonStats,
  type SeasonLeaders,
} from './season-stats';

// Combine Event (Week 19)
export {
  simulateCombine,
  getProspectsForDay,
  getCombineDayForPosition,
  formatMeasurable,
  getPositionAverage,
  COMBINE_SCHEDULE,
  type CombinePerformance,
  type CombineStockChange,
  type CombineStoryline,
  type CombineStorylineType,
  type CombineResults,
} from './combine-event';

// Pro Day Event (Week 20)
export {
  simulateProDayWeek,
  generateProDay,
  conductPrivateWorkout,
  getProDaysForDay,
  getCollegesForProDayDay,
  canAffordPrivateWorkout,
  getPrivateWorkoutCost,
  formatCharacterAssessment,
  PRIVATE_WORKOUT_COST,
  MAX_PRIVATE_WORKOUTS,
  type ProDayVisit,
  type ProDayProspectResult,
  type PrivateWorkout,
  type ProDaySchedule,
  type CharacterAssessment,
} from './pro-day-event';
