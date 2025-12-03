/**
 * Training System Module
 * WO-TRAINING-SYSTEM-001 | INDEX-001
 *
 * Barrel export for training system
 */

// Types
export * from './types';

// Constants
export {
  // XP earning constants
  GAME_BASE_XP,
  GAME_WIN_BONUS,
  PERFORMANCE_XP_BONUSES,
  getPerformanceXPBonus,
  PRACTICE_BASE_XP,
  PRACTICE_INTENSITY_MODIFIERS,
  TRAINING_CAMP_DAILY_XP,
  TRAINING_CAMP_WEEKLY_XP,
  ROOKIE_TRAINING_CAMP_BONUS,
  FIRST_STARTER_BONUS,
  OFFSEASON_PROGRAM_XP,
  BYE_WEEK_XP_MULTIPLIER,
  AWARD_XP_BONUSES,

  // Attribute progression constants
  ATTRIBUTE_CATEGORY_CONFIGS,
  POSITION_ATTRIBUTE_RELEVANCE,
  RELEVANCE_COST_MODIFIERS,

  // Age curve constants
  AGE_CURVES,
  getAgeCurve,

  // Potential constants
  POTENTIAL_CONFIGS,
  POTENTIAL_SOFT_CAP_THRESHOLD,
  POTENTIAL_SOFT_CAP_PENALTY,
  OVERACHIEVER_POTENTIAL_BONUS,

  // Badge constants
  BADGE_COSTS,
  BADGE_SLOTS_BY_OVR,
  getBadgeSlots,

  // Facility constants
  TRAINING_ROOM_BONUSES,
  WEIGHT_ROOM_BONUSES,
  PRACTICE_FACILITY_BONUSES,

  // Coaching constants
  POSITION_COACH_BONUSES,
  COORDINATOR_BONUSES,
  SCHEME_FIT_BONUSES,

  // Trait constants
  TRAIT_DEVELOPMENT_EFFECTS,

  // GM perk constants
  GM_PERK_EFFECTS,

  // AI progression constants
  AI_DEVELOPMENT_BY_ROLE,
  MAX_YEARLY_OVR_GAIN,
  AI_DEVELOPMENT_VARIANCE,
} from './training-constants';

// XP Calculator functions
export {
  calculateGameXP,
  getAffectedPositions,
  playerBenefitsFromFocus,
  calculatePracticeXP,
  calculateTrainingCampXP,
  calculateTotalTrainingCampXP,
  calculateByeWeekXP,
  getExpectedParticipation,
  calculateOffseasonProgramXP,
  calculateAwardXP,
  calculateTotalAwardXP,
  calculateTraitXPModifier,
  calculateExpectedSeasonXP,
} from './xp-calculator';

export type { OffseasonParticipation, AwardType } from './xp-calculator';

// Progression Engine functions
export {
  // Attribute costs
  getAttributeCategory,
  getBaseCost,
  getPositionRelevanceModifier,
  calculateAttributeCost,

  // Attribute upgrades
  canUpgradeAttribute,
  applyAttributeUpgrade,

  // Age progression
  calculateAgeProgression,

  // Development modifiers
  calculateFacilityBonus,
  calculateStaffBonus,
  calculateSchemeFitBonus,
  calculateGMPerkBonus,
  calculateTraitModifier,
  calculateDevelopmentModifiers,

  // Badge progression
  getBadgeUpgradeCost,
  getNextBadgeTier,
  canUpgradeBadge,
  applyBadgeUpgrade,

  // AI progression
  calculateAIPlayerDevelopment,
} from './progression-engine';

// Training Store functions
export {
  // Core store operations
  getTrainingStore,
  saveTrainingStore,
  createEmptyStore,
  clearTrainingStore,

  // Team state management
  initializeTeamTrainingState,
  createEmptyTrainingProgress,
  getTeamTrainingState,
  saveTeamTrainingState,
  initializeAllTeams,

  // Player progress CRUD
  getPlayerProgress,
  updatePlayerProgress,
  addPlayerXP,
  spendPlayerXP,
  updatePlayerBadgeProgress,
  setPlayerModifiers,

  // Practice focus
  getPracticeFocus,
  setPracticeFocus,
  advanceWeek,
  advanceAllTeamsWeek,
  startNewSeason,

  // Coach's favorites
  getCoachsFavorites,
  setCoachsFavorites,
  isCoachsFavorite,

  // Bulk operations
  getAllPlayerProgress,
  getPlayersSortedByXP,
  getTeamTotalXP,
  getTeamAverageXP,

  // Debug/testing
  exportTrainingStore,
  importTrainingStore,
} from './training-store';

// Integration functions (INT-001, INT-002, INT-003)
export {
  // Game XP
  awardGameXP,
  // Practice XP
  awardPracticeXP,
  // Training camp
  runTrainingCamp,
  // Offseason
  runOffseasonProgram,
  awardSeasonAwards,
  applyAgeProgression,
  // AI Development
  simulateAITeamDevelopment,
  // Week processing
  processWeekTraining,
  // Initialization
  initializeTrainingForFranchise,
  initializeTeamTraining,
  addPlayerToTraining,
  removePlayerFromTraining,
} from './training-integration';

export type {
  GameXPAwardResult,
  WeekXPSummary,
  TrainingCampSummary,
} from './training-integration';
