/**
 * Schedule Module
 *
 * Exports for NFL-style schedule generation with CSP solver.
 * Workorder: WO-SCHEDULE-SOLVER-001
 */

// Types
export type {
  LeagueSchedule,
  WeekSchedule,
  ScheduledGame,
  TeamSchedule,
  Matchup,
  GameType,
  TimeSlot,
  GameDay,
  DivisionInfo,
  TeamStanding,
  ScheduleGeneratorConfig,
  ScheduleStats,
  ScheduleValidation,
} from './types';

// Generator functions
export { generateSchedule, getScheduleStats, validateSchedule } from './schedule-generator';

// Store functions
export {
  storeSchedule,
  getSchedule,
  getTeamScheduleById,
  getWeekScheduleByNumber,
  clearSchedule,
} from './schedule-store';

// CSP Solver (for advanced usage)
export { ScheduleCSPSolver, assignmentsToWeekSchedules } from './csp-solver';
export type { CSPVariable, CSPResult, CSPOptions, ConstraintFn } from './csp-solver';

// Constraints (for customization)
export {
  teamPlaysOncePerWeek,
  createByeWeekConstraint,
  createWeekCapacityConstraint,
  createNFLConstraints,
  validateTeamGameCounts,
  validateNoExcessiveMatchups,
} from './constraints';
