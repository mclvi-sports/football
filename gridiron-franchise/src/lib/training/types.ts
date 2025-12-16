/**
 * Training System Types
 * WO-TRAINING-SYSTEM-001 | TYPE-001
 */

import { BadgeTier } from '../types';

// =============================================================================
// XP SOURCE TYPES
// =============================================================================

export type XPSourceType =
  | 'game'
  | 'practice'
  | 'training_camp'
  | 'offseason_program'
  | 'bye_week'
  | 'award'
  | 'focus_training';

export interface XPSource {
  type: XPSourceType;
  amount: number;
  week: number;
  season: number;
  timestamp: string;
  details?: {
    gameResult?: 'win' | 'loss';
    performanceGrade?: number;
    practiceFocus?: PracticeFocusType;
    awardType?: string;
  };
}

// =============================================================================
// PRACTICE FOCUS TYPES
// =============================================================================

export type PracticeFocusType =
  | 'passing'
  | 'running'
  | 'pass_rush'
  | 'coverage'
  | 'red_zone_offense'
  | 'red_zone_defense'
  | 'special_teams'
  | 'conditioning'
  | 'film_study'
  | 'recovery';

export type PracticeIntensity = 'high' | 'normal' | 'light' | 'rest';

export interface PracticeFocus {
  teamId: string;
  week: number;
  season: number;
  focus: PracticeFocusType;
  intensity: PracticeIntensity;
}

// =============================================================================
// ATTRIBUTE CATEGORY TYPES
// =============================================================================

export type AttributeCategory = 'physical' | 'technical' | 'mental' | 'durability';

export interface AttributeCategoryConfig {
  category: AttributeCategory;
  baseCost: number;
  attributes: string[];
}

// =============================================================================
// AGE DEVELOPMENT TYPES
// =============================================================================

export type DevelopmentPhase =
  | 'growth'        // 21-24
  | 'developing'    // 23-24
  | 'prime'         // 25-27
  | 'maintenance'   // 28-29
  | 'early_decline' // 30-32
  | 'declining'     // 33-35
  | 'steep_decline'; // 36+

export interface AgeCurve {
  minAge: number;
  maxAge: number;
  phase: DevelopmentPhase;
  physicalChange: number;   // Per year
  technicalChange: number;  // Per year
  mentalChange: number;     // Per year
  xpCostModifier: number;   // Multiplier for XP costs
}

// =============================================================================
// POTENTIAL TYPES
// =============================================================================

export type PotentialTier = 'superstar' | 'star' | 'starter' | 'backup' | 'bust';

export interface PotentialConfig {
  tier: PotentialTier;
  minOVR: number;
  maxOVR: number;
  rarity: number; // Percentage
}

// =============================================================================
// BADGE PROGRESSION TYPES
// =============================================================================

export interface BadgeProgress {
  badgeId: string;
  tier: BadgeTier;
  xpInvested: number;
  unlockedAt?: string;
  upgradedAt?: string;
}

export interface BadgeCost {
  tier: BadgeTier;
  cost: number;
  cumulativeCost: number;
}

// =============================================================================
// DEVELOPMENT MODIFIER TYPES
// =============================================================================

export type ModifierSource =
  | 'facility_training_room'
  | 'facility_weight_room'
  | 'facility_practice'
  | 'coach_position'
  | 'coach_coordinator'
  | 'gm_perk'
  | 'trait'
  | 'scheme_fit'
  | 'age';

export interface DevelopmentModifier {
  source: ModifierSource;
  type: 'xp_bonus' | 'cost_reduction' | 'attribute_bonus';
  value: number; // Percentage or flat bonus
  description: string;
  expiresAt?: string;
}

export interface DevelopmentModifiers {
  facilityBonus: number;
  staffBonus: number;
  gmPerkBonus: number;
  traitBonus: number;
  schemeFitBonus: number;
  ageModifier: number;
  totalMultiplier: number;
  activeModifiers: DevelopmentModifier[];
}

// =============================================================================
// TRAINING PROGRESS TYPES
// =============================================================================

export interface AttributeXP {
  [attributeKey: string]: number;
}

export interface TrainingHistory {
  week: number;
  season: number;
  xpEarned: number;
  source: XPSourceType;
  details?: string;
}

export interface TrainingProgress {
  playerId: string;
  currentXP: number;
  totalXPEarned: number;
  seasonXP: number;
  lastUpdated: string;

  // Attribute-specific XP tracking
  attributeXP: AttributeXP;

  // Badge progression
  badgeProgress: BadgeProgress[];

  // Active modifiers
  activeModifiers: DevelopmentModifier[];

  // History (last 50 entries)
  history: TrainingHistory[];

  // Focus training state
  focusAttribute?: string;
  focusWeeksRemaining?: number;
}

// =============================================================================
// TEAM TRAINING STATE
// =============================================================================

export interface TeamTrainingState {
  teamId: string;
  season: number;
  currentWeek: number;
  practiceFocus: PracticeFocus;
  playerProgress: Record<string, TrainingProgress>;
  coachsFavorites: string[]; // Player IDs selected for Coach's Favorite perk
}

// =============================================================================
// XP CALCULATION RESULTS
// =============================================================================

export interface GameXPResult {
  baseXP: number;
  winBonus: number;
  performanceBonus: number;
  modifierBonus: number;
  totalXP: number;
  breakdown: {
    source: string;
    amount: number;
  }[];
}

export interface PracticeXPResult {
  baseXP: number;
  facilityBonus: number;
  staffBonus: number;
  gmPerkBonus: number;
  traitBonus: number;
  intensityModifier: number;
  totalXP: number;
}

export interface AttributeUpgradeResult {
  success: boolean;
  attribute: string;
  oldValue: number;
  newValue: number;
  xpCost: number;
  remainingXP: number;
  error?: string;
}

// =============================================================================
// OFFSEASON PROGRESSION (AGE-002)
// =============================================================================

/**
 * AGE-002: Position-specific decline phase
 */
export type DeclinePhase = 'growth' | 'prime' | 'early_decline' | 'steep_decline' | 'twilight';

export interface OffseasonProgressionResult {
  playerId: string;
  ageChange: number;
  attributeChanges: {
    attribute: string;
    oldValue: number;
    newValue: number;
    reason: 'age_progression' | 'age_regression' | 'training' | 'potential_cap';
  }[];
  ovrChange: number;
  newOVR: number;
  // AGE-002: Position-specific decline info for UI display
  declinePhase?: DeclinePhase;
  isInPrimeYears?: boolean;
  yearsUntilDecline?: number;
}

// =============================================================================
// STORE TYPES
// =============================================================================

export interface TrainingStoreState {
  initialized: boolean;
  teams: Record<string, TeamTrainingState>;
  globalSeason: number;
  globalWeek: number;
}

export const TRAINING_STORAGE_KEY = 'gridiron_training_progress';
