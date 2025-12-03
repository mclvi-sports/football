/**
 * Training System Constants
 * WO-TRAINING-SYSTEM-001 | CONST-001
 *
 * All values derived from FINAL-training-system.md spec
 */

import { Position } from '../types';
import {
  AgeCurve,
  AttributeCategoryConfig,
  BadgeCost,
  PotentialConfig,
  PracticeFocusType,
} from './types';

// =============================================================================
// XP EARNING CONSTANTS
// =============================================================================

/** Base XP for playing a game */
export const GAME_BASE_XP = 50;

/** Bonus XP for winning a game */
export const GAME_WIN_BONUS = 25;

/** Performance grade XP bonuses */
export const PERFORMANCE_XP_BONUSES: Record<string, number> = {
  '90-100': 100,  // Elite performance
  '85-89': 75,    // Excellent
  '80-84': 50,    // Very Good
  '75-79': 35,    // Good
  '70-74': 20,    // Average
  '65-69': 10,    // Below Average
  'below65': 0,   // Poor
};

/** Get XP bonus for a performance grade */
export function getPerformanceXPBonus(grade: number): number {
  if (grade >= 90) return PERFORMANCE_XP_BONUSES['90-100'];
  if (grade >= 85) return PERFORMANCE_XP_BONUSES['85-89'];
  if (grade >= 80) return PERFORMANCE_XP_BONUSES['80-84'];
  if (grade >= 75) return PERFORMANCE_XP_BONUSES['75-79'];
  if (grade >= 70) return PERFORMANCE_XP_BONUSES['70-74'];
  if (grade >= 65) return PERFORMANCE_XP_BONUSES['65-69'];
  return PERFORMANCE_XP_BONUSES['below65'];
}

/** Practice XP by focus type */
export const PRACTICE_BASE_XP: Record<PracticeFocusType, number> = {
  passing: 50,
  running: 50,
  pass_rush: 50,
  coverage: 50,
  red_zone_offense: 45,
  red_zone_defense: 45,
  special_teams: 50,
  conditioning: 30,
  film_study: 40,
  recovery: 20,
};

/** Practice intensity modifiers */
export const PRACTICE_INTENSITY_MODIFIERS = {
  high: 1.5,    // +50% XP, +15% injury risk
  normal: 1.0,  // Standard
  light: 0.7,   // -30% XP, -50% injury risk
  rest: 0.0,    // No XP, no injury risk
};

/** Training camp daily XP */
export const TRAINING_CAMP_DAILY_XP = {
  morning: 30,    // Position drills
  afternoon: 40,  // Team practice
  evening: 20,    // Film study
  total: 90,
};

/** Training camp weekly totals */
export const TRAINING_CAMP_WEEKLY_XP = {
  week13: { min: 400, max: 500 },  // Conditioning
  week14: { min: 350, max: 450 },  // Installation
  week15: { min: 300, max: 400 },  // Preparation
};

/** Rookie bonus during training camp */
export const ROOKIE_TRAINING_CAMP_BONUS = 0.25; // +25%

/** First-time starter bonus */
export const FIRST_STARTER_BONUS = 0.15; // +15%

/** Offseason program weekly XP by participation */
export const OFFSEASON_PROGRAM_XP = {
  full: 40,     // 5 days/week
  partial: 25,  // 3 days/week
  minimal: 10,  // 1 day/week
  none: 0,
};

/** Bye week XP multiplier */
export const BYE_WEEK_XP_MULTIPLIER = 1.5; // +50%

/** Award XP bonuses */
export const AWARD_XP_BONUSES = {
  pro_bowl: 500,
  all_pro: 750,
  weekly_award: 200,
  mvp: 1000,
  championship: 500,
  playoff_game: 100,
};

// =============================================================================
// ATTRIBUTE PROGRESSION CONSTANTS
// =============================================================================

/** Base XP cost per attribute point by category */
export const ATTRIBUTE_CATEGORY_CONFIGS: AttributeCategoryConfig[] = [
  {
    category: 'physical',
    baseCost: 150,
    attributes: ['SPD', 'ACC', 'AGI', 'STR', 'JMP'],
  },
  {
    category: 'technical',
    baseCost: 100,
    attributes: [
      // Passing
      'THP', 'SAC', 'MAC', 'DAC', 'TUP', 'TOR', 'PAC', 'BSK',
      // Rushing
      'CAR', 'BTK', 'TRK', 'ELU', 'SPM', 'JKM', 'SFA', 'VIS',
      // Receiving
      'CTH', 'CIT', 'SPC', 'RTE', 'REL', 'RAC', 'SRR', 'MRR', 'DRR',
      // Blocking
      'PBK', 'RBK', 'IBL', 'PBP', 'PBF', 'RBP', 'RBF', 'LBK',
      // Defense
      'TAK', 'POW', 'PMV', 'FMV', 'BSH', 'PUR', 'MCV', 'ZCV', 'PRS',
      // Special Teams
      'KPW', 'KAC', 'KOP', 'PPW', 'PUA', 'CLU', 'CON', 'RET',
    ],
  },
  {
    category: 'mental',
    baseCost: 75,
    attributes: ['AWR', 'PRC'],
  },
  {
    category: 'durability',
    baseCost: 125,
    attributes: ['STA', 'INJ'],
  },
];

/** Position relevance modifiers for attribute costs */
export const POSITION_ATTRIBUTE_RELEVANCE: Record<Position, Record<string, 'primary' | 'secondary' | 'tertiary'>> = {
  [Position.QB]: {
    THP: 'primary', SAC: 'primary', MAC: 'primary', DAC: 'primary',
    TUP: 'primary', TOR: 'primary', PAC: 'primary', BSK: 'primary',
    AWR: 'primary', PRC: 'primary',
    SPD: 'secondary', ACC: 'secondary', AGI: 'secondary',
    STR: 'tertiary', JMP: 'tertiary',
  },
  [Position.RB]: {
    CAR: 'primary', BTK: 'primary', TRK: 'primary', ELU: 'primary',
    SPM: 'primary', JKM: 'primary', SFA: 'primary', VIS: 'primary',
    SPD: 'primary', ACC: 'primary', AGI: 'primary',
    CTH: 'secondary', RTE: 'secondary', PBK: 'secondary',
    STR: 'secondary', AWR: 'secondary',
  },
  [Position.WR]: {
    CTH: 'primary', CIT: 'primary', SPC: 'primary', REL: 'primary',
    SRR: 'primary', MRR: 'primary', DRR: 'primary', RAC: 'primary',
    SPD: 'primary', ACC: 'primary', AGI: 'primary',
    AWR: 'secondary', JMP: 'secondary',
    STR: 'tertiary', RBK: 'tertiary',
  },
  [Position.TE]: {
    CTH: 'primary', CIT: 'primary', RTE: 'primary', RBK: 'primary', PBK: 'primary',
    SPD: 'secondary', ACC: 'secondary', STR: 'secondary',
    AWR: 'secondary', SPC: 'secondary',
  },
  [Position.LT]: {
    PBP: 'primary', PBF: 'primary', RBP: 'primary', RBF: 'primary',
    STR: 'primary', AWR: 'primary',
    AGI: 'secondary', ACC: 'secondary',
  },
  [Position.LG]: {
    PBP: 'primary', PBF: 'primary', RBP: 'primary', RBF: 'primary',
    STR: 'primary', AWR: 'primary',
    AGI: 'secondary', ACC: 'secondary',
  },
  [Position.C]: {
    PBP: 'primary', PBF: 'primary', RBP: 'primary', RBF: 'primary',
    STR: 'primary', AWR: 'primary',
    AGI: 'secondary', ACC: 'secondary',
  },
  [Position.RG]: {
    PBP: 'primary', PBF: 'primary', RBP: 'primary', RBF: 'primary',
    STR: 'primary', AWR: 'primary',
    AGI: 'secondary', ACC: 'secondary',
  },
  [Position.RT]: {
    PBP: 'primary', PBF: 'primary', RBP: 'primary', RBF: 'primary',
    STR: 'primary', AWR: 'primary',
    AGI: 'secondary', ACC: 'secondary',
  },
  [Position.DE]: {
    PMV: 'primary', FMV: 'primary', BSH: 'primary', TAK: 'primary',
    SPD: 'primary', ACC: 'primary', STR: 'primary',
    PUR: 'secondary', AWR: 'secondary', AGI: 'secondary',
  },
  [Position.DT]: {
    PMV: 'primary', FMV: 'primary', BSH: 'primary', TAK: 'primary',
    STR: 'primary', POW: 'primary',
    AWR: 'secondary', PUR: 'secondary',
    SPD: 'tertiary', AGI: 'tertiary',
  },
  [Position.MLB]: {
    TAK: 'primary', BSH: 'primary', PUR: 'primary', AWR: 'primary', PRC: 'primary',
    ZCV: 'secondary', MCV: 'secondary', SPD: 'secondary',
    PMV: 'tertiary', FMV: 'tertiary',
  },
  [Position.OLB]: {
    TAK: 'primary', BSH: 'primary', PUR: 'primary', PMV: 'primary', FMV: 'primary',
    SPD: 'primary', AWR: 'secondary',
    ZCV: 'secondary', MCV: 'secondary',
  },
  [Position.CB]: {
    MCV: 'primary', ZCV: 'primary', PRS: 'primary', SPD: 'primary',
    ACC: 'primary', AGI: 'primary', AWR: 'primary', PRC: 'primary',
    TAK: 'secondary', JMP: 'secondary',
  },
  [Position.FS]: {
    ZCV: 'primary', MCV: 'primary', AWR: 'primary', PRC: 'primary',
    SPD: 'primary', ACC: 'primary', TAK: 'secondary',
    PUR: 'secondary', JMP: 'secondary',
  },
  [Position.SS]: {
    TAK: 'primary', ZCV: 'primary', MCV: 'primary', POW: 'primary',
    SPD: 'primary', AWR: 'primary',
    BSH: 'secondary', PUR: 'secondary',
  },
  [Position.K]: {
    KPW: 'primary', KAC: 'primary', KOP: 'primary', CLU: 'primary', CON: 'primary',
    AWR: 'secondary',
  },
  [Position.P]: {
    PPW: 'primary', PUA: 'primary', CON: 'primary',
    AWR: 'secondary',
  },
};

/** Position relevance cost modifiers */
export const RELEVANCE_COST_MODIFIERS = {
  primary: 0.8,    // 20% cheaper
  secondary: 1.0,  // Standard
  tertiary: 1.3,   // 30% more expensive
};

// =============================================================================
// AGE CURVE CONSTANTS
// =============================================================================

/** Age development curves */
export const AGE_CURVES: AgeCurve[] = [
  {
    minAge: 21,
    maxAge: 22,
    phase: 'growth',
    physicalChange: 3,
    technicalChange: 2,
    mentalChange: 1,
    xpCostModifier: 0.8,
  },
  {
    minAge: 23,
    maxAge: 24,
    phase: 'developing',
    physicalChange: 2,
    technicalChange: 2,
    mentalChange: 2,
    xpCostModifier: 0.8,
  },
  {
    minAge: 25,
    maxAge: 27,
    phase: 'prime',
    physicalChange: 1,
    technicalChange: 1,
    mentalChange: 2,
    xpCostModifier: 1.0,
  },
  {
    minAge: 28,
    maxAge: 29,
    phase: 'maintenance',
    physicalChange: 0,
    technicalChange: 1,
    mentalChange: 1,
    xpCostModifier: 1.2,
  },
  {
    minAge: 30,
    maxAge: 32,
    phase: 'early_decline',
    physicalChange: -1,
    technicalChange: 0,
    mentalChange: 1,
    xpCostModifier: 1.5,
  },
  {
    minAge: 33,
    maxAge: 35,
    phase: 'declining',
    physicalChange: -2,
    technicalChange: -1,
    mentalChange: 0,
    xpCostModifier: 2.0,
  },
  {
    minAge: 36,
    maxAge: 99,
    phase: 'steep_decline',
    physicalChange: -3,
    technicalChange: -2,
    mentalChange: -1,
    xpCostModifier: 2.0,
  },
];

/** Get age curve for a given age */
export function getAgeCurve(age: number): AgeCurve {
  return AGE_CURVES.find(curve => age >= curve.minAge && age <= curve.maxAge) || AGE_CURVES[AGE_CURVES.length - 1];
}

// =============================================================================
// POTENTIAL CONSTANTS
// =============================================================================

/** Potential tier configurations */
export const POTENTIAL_CONFIGS: PotentialConfig[] = [
  { tier: 'superstar', minOVR: 95, maxOVR: 99, rarity: 5 },
  { tier: 'star', minOVR: 88, maxOVR: 94, rarity: 15 },
  { tier: 'starter', minOVR: 80, maxOVR: 87, rarity: 35 },
  { tier: 'backup', minOVR: 72, maxOVR: 79, rarity: 30 },
  { tier: 'bust', minOVR: 65, maxOVR: 71, rarity: 15 },
];

/** Soft cap penalty (at 90% of potential) */
export const POTENTIAL_SOFT_CAP_THRESHOLD = 0.9;
export const POTENTIAL_SOFT_CAP_PENALTY = 1.5; // +50% XP cost

/** Overachiever trait bonus */
export const OVERACHIEVER_POTENTIAL_BONUS = 3;

// =============================================================================
// BADGE PROGRESSION CONSTANTS
// =============================================================================

/** Badge tier costs */
export const BADGE_COSTS: BadgeCost[] = [
  { tier: 'bronze', cost: 500, cumulativeCost: 500 },
  { tier: 'silver', cost: 1500, cumulativeCost: 2000 },
  { tier: 'gold', cost: 3500, cumulativeCost: 5500 },
  { tier: 'hof', cost: 8000, cumulativeCost: 13500 },
];

/** Badge slots by OVR */
export const BADGE_SLOTS_BY_OVR: { minOVR: number; maxOVR: number; slots: number }[] = [
  { minOVR: 60, maxOVR: 69, slots: 2 },
  { minOVR: 70, maxOVR: 74, slots: 3 },
  { minOVR: 75, maxOVR: 79, slots: 4 },
  { minOVR: 80, maxOVR: 84, slots: 5 },
  { minOVR: 85, maxOVR: 99, slots: 6 },
];

/** Get badge slots for a given OVR */
export function getBadgeSlots(ovr: number): number {
  const config = BADGE_SLOTS_BY_OVR.find(c => ovr >= c.minOVR && ovr <= c.maxOVR);
  return config?.slots || 2;
}

// =============================================================================
// FACILITY BONUS CONSTANTS
// =============================================================================

/** Training room XP bonuses by quality (1-10 stars) */
export const TRAINING_ROOM_BONUSES: Record<number, number> = {
  10: 0.30, // +30%
  9: 0.25,
  8: 0.20,
  7: 0.16,
  6: 0.12,
  5: 0.08,
  4: 0.05,
  3: 0.03,
  2: 0.00,
  1: 0.00,
};

/** Weight room XP bonuses by quality (for physical attributes) */
export const WEIGHT_ROOM_BONUSES: Record<number, number> = {
  10: 0.40, // +40%
  9: 0.35,
  8: 0.30,
  7: 0.25,
  6: 0.20,
  5: 0.15,
  4: 0.10,
  3: 0.05,
  2: 0.00,
  1: 0.00,
};

/** Practice facility XP bonuses by quality */
export const PRACTICE_FACILITY_BONUSES: Record<number, number> = {
  10: 0.30, // +30%
  9: 0.25,
  8: 0.20,
  7: 0.16,
  6: 0.12,
  5: 0.08,
  4: 0.05,
  3: 0.03,
  2: 0.00,
  1: 0.00,
};

// =============================================================================
// COACHING BONUS CONSTANTS
// =============================================================================

/** Position coach XP bonuses by OVR */
export const POSITION_COACH_BONUSES: { minOVR: number; maxOVR: number; bonus: number }[] = [
  { minOVR: 95, maxOVR: 99, bonus: 0.25 },
  { minOVR: 90, maxOVR: 94, bonus: 0.20 },
  { minOVR: 85, maxOVR: 89, bonus: 0.15 },
  { minOVR: 80, maxOVR: 84, bonus: 0.10 },
  { minOVR: 75, maxOVR: 79, bonus: 0.05 },
  { minOVR: 70, maxOVR: 74, bonus: 0.00 },
  { minOVR: 0, maxOVR: 69, bonus: -0.05 },
];

/** Coordinator XP bonuses by OVR */
export const COORDINATOR_BONUSES: { minOVR: number; maxOVR: number; bonus: number }[] = [
  { minOVR: 95, maxOVR: 99, bonus: 0.15 },
  { minOVR: 90, maxOVR: 94, bonus: 0.12 },
  { minOVR: 85, maxOVR: 89, bonus: 0.08 },
  { minOVR: 80, maxOVR: 84, bonus: 0.05 },
  { minOVR: 0, maxOVR: 79, bonus: 0.00 },
];

/** Scheme fit bonuses */
export const SCHEME_FIT_BONUSES = {
  perfect: 0.15,    // +15%
  good: 0.08,       // +8%
  neutral: 0.00,    // 0%
  poor: -0.10,      // -10%
  mismatch: -0.20,  // -20%
};

// =============================================================================
// TRAIT EFFECT CONSTANTS
// =============================================================================

/** Development-affecting traits */
export const TRAIT_DEVELOPMENT_EFFECTS: Record<string, { xpModifier: number; description: string }> = {
  'Gym Rat': { xpModifier: 0.20, description: '+20% physical XP, always attends workouts' },
  'Quick Learner': { xpModifier: 0.15, description: '+15% all XP' },
  'Film Junkie': { xpModifier: 0.25, description: '+25% mental XP (AWR, PRC only)' },
  'Team Leader': { xpModifier: 0.10, description: '+10% team XP when on roster' },
  'High Motor': { xpModifier: 0.10, description: '+10% practice XP' },
  'Focused': { xpModifier: 0.05, description: '+5% XP, no distractions' },
  'Lazy': { xpModifier: -0.20, description: '-20% practice XP' },
  'Slow Learner': { xpModifier: -0.15, description: '-15% all XP' },
  'Unfocused': { xpModifier: -0.10, description: '-10% XP' },
  'Party Animal': { xpModifier: -0.15, description: '-15% XP during season' },
  'Injury Prone': { xpModifier: -0.10, description: '-10% training camp XP' },
};

// =============================================================================
// GM PERK CONSTANTS
// =============================================================================

/** GM development perk effects */
export const GM_PERK_EFFECTS = {
  coachs_favorite: {
    bronze: { count: 2, bonus: 0.25 },
    silver: { count: 3, bonus: 0.50 },
    gold: { count: 5, bonus: 1.00 },
  },
  training_boost: {
    bronze: { maxAge: 25, devSpeed: 1 },
    silver: { maxAge: 25, devSpeed: 2 },
    gold: { maxAge: 27, devSpeed: 3 },
  },
  veteran_mentor: {
    bronze: { declineReduction: 0.25 },
    silver: { declineReduction: 0.50 },
    gold: { noDeclineUntilAge: 33 },
  },
  position_coach: {
    bronze: { bonus: 0.15 },
    silver: { bonus: 0.25 },
    gold: { bonus: 0.40 },
  },
  scheme_fit_master: {
    bronze: { adaptSpeed: 0.25 },
    silver: { adaptSpeed: 0.50 },
    gold: { instantAdapt: true, ovrBonus: 2 },
  },
};

// =============================================================================
// AI TEAM PROGRESSION CONSTANTS
// =============================================================================

/** AI team base development by role */
export const AI_DEVELOPMENT_BY_ROLE = {
  starter: 2,       // +2 OVR/year
  backup: 1,        // +1 OVR/year
  practice_squad: 0.5, // +0.5 OVR/year
};

/** Maximum OVR gain per season */
export const MAX_YEARLY_OVR_GAIN = 5;

/** Random variance for AI development */
export const AI_DEVELOPMENT_VARIANCE = { min: 0.8, max: 1.2 };
