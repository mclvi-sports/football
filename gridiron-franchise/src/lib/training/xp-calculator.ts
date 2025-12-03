/**
 * XP Calculator Module
 * WO-TRAINING-SYSTEM-001 | XP-001, XP-002, XP-003
 *
 * Calculates XP earned from games, practice, training camp, and bye weeks
 */

import { Player, Position } from '../types';
import {
  GameXPResult,
  PracticeXPResult,
  PracticeFocusType,
  PracticeIntensity,
  DevelopmentModifiers,
} from './types';
import {
  GAME_BASE_XP,
  GAME_WIN_BONUS,
  getPerformanceXPBonus,
  PRACTICE_BASE_XP,
  PRACTICE_INTENSITY_MODIFIERS,
  BYE_WEEK_XP_MULTIPLIER,
  TRAINING_CAMP_WEEKLY_XP,
  ROOKIE_TRAINING_CAMP_BONUS,
  FIRST_STARTER_BONUS,
  OFFSEASON_PROGRAM_XP,
  AWARD_XP_BONUSES,
  TRAIT_DEVELOPMENT_EFFECTS,
} from './training-constants';

// =============================================================================
// GAME XP CALCULATION (XP-001)
// =============================================================================

/**
 * Calculate XP earned from playing a game
 */
export function calculateGameXP(
  player: Player,
  won: boolean,
  performanceGrade: number,
  modifiers: DevelopmentModifiers
): GameXPResult {
  const breakdown: { source: string; amount: number }[] = [];

  // Base XP for playing
  const baseXP = GAME_BASE_XP;
  breakdown.push({ source: 'Game Played', amount: baseXP });

  // Win bonus
  const winBonus = won ? GAME_WIN_BONUS : 0;
  if (winBonus > 0) {
    breakdown.push({ source: 'Win Bonus', amount: winBonus });
  }

  // Performance bonus
  const performanceBonus = getPerformanceXPBonus(performanceGrade);
  if (performanceBonus > 0) {
    breakdown.push({ source: `Performance (${performanceGrade})`, amount: performanceBonus });
  }

  // Calculate subtotal before modifiers
  const subtotal = baseXP + winBonus + performanceBonus;

  // Apply modifiers
  const modifierBonus = Math.round(subtotal * (modifiers.totalMultiplier - 1));
  if (modifierBonus > 0) {
    breakdown.push({ source: 'Development Bonuses', amount: modifierBonus });
  }

  const totalXP = subtotal + modifierBonus;

  return {
    baseXP,
    winBonus,
    performanceBonus,
    modifierBonus,
    totalXP,
    breakdown,
  };
}

// =============================================================================
// PRACTICE XP CALCULATION (XP-002)
// =============================================================================

/**
 * Get positions affected by a practice focus
 */
export function getAffectedPositions(focus: PracticeFocusType): Position[] {
  switch (focus) {
    case 'passing':
      return [Position.QB, Position.WR, Position.TE];
    case 'running':
      return [Position.RB, Position.LT, Position.LG, Position.C, Position.RG, Position.RT];
    case 'pass_rush':
      return [Position.DE, Position.DT, Position.OLB];
    case 'coverage':
      return [Position.CB, Position.FS, Position.SS, Position.MLB, Position.OLB];
    case 'red_zone_offense':
      return [Position.QB, Position.WR, Position.TE, Position.RB];
    case 'red_zone_defense':
      return [Position.DE, Position.DT, Position.MLB, Position.OLB, Position.CB, Position.FS, Position.SS];
    case 'special_teams':
      return [Position.K, Position.P];
    case 'conditioning':
    case 'film_study':
    case 'recovery':
      return Object.values(Position);
    default:
      return [];
  }
}

/**
 * Check if player benefits from practice focus
 */
export function playerBenefitsFromFocus(player: Player, focus: PracticeFocusType): boolean {
  const affectedPositions = getAffectedPositions(focus);
  return affectedPositions.includes(player.position);
}

/**
 * Calculate XP earned from weekly practice
 */
export function calculatePracticeXP(
  player: Player,
  focus: PracticeFocusType,
  intensity: PracticeIntensity,
  facilityBonus: number,
  staffBonus: number,
  gmPerkBonus: number
): PracticeXPResult {
  // Check if player benefits from this focus
  const benefits = playerBenefitsFromFocus(player, focus);

  // Get base XP (0 if player doesn't benefit from focus, except universal focuses)
  const isUniversalFocus = ['conditioning', 'film_study', 'recovery'].includes(focus);
  let baseXP = 0;

  if (benefits || isUniversalFocus) {
    baseXP = PRACTICE_BASE_XP[focus];
  }

  // Apply intensity modifier
  const intensityModifier = PRACTICE_INTENSITY_MODIFIERS[intensity];
  const afterIntensity = Math.round(baseXP * intensityModifier);

  // Calculate trait bonus
  let traitBonus = 0;
  for (const trait of player.traits) {
    const effect = TRAIT_DEVELOPMENT_EFFECTS[trait];
    if (effect) {
      // High Motor specifically affects practice XP
      if (trait === 'High Motor') {
        traitBonus += effect.xpModifier;
      }
      // Lazy trait reduces practice XP
      if (trait === 'Lazy') {
        traitBonus += effect.xpModifier; // This is negative
      }
    }
  }

  // Calculate bonus amounts
  const facilityBonusAmount = Math.round(afterIntensity * facilityBonus);
  const staffBonusAmount = Math.round(afterIntensity * staffBonus);
  const gmPerkBonusAmount = Math.round(afterIntensity * gmPerkBonus);
  const traitBonusAmount = Math.round(afterIntensity * traitBonus);

  const totalXP = afterIntensity + facilityBonusAmount + staffBonusAmount + gmPerkBonusAmount + traitBonusAmount;

  return {
    baseXP,
    facilityBonus: facilityBonusAmount,
    staffBonus: staffBonusAmount,
    gmPerkBonus: gmPerkBonusAmount,
    traitBonus: traitBonusAmount,
    intensityModifier,
    totalXP: Math.max(0, totalXP), // Never negative
  };
}

// =============================================================================
// TRAINING CAMP XP CALCULATION (XP-003)
// =============================================================================

/**
 * Calculate XP earned during training camp week
 */
export function calculateTrainingCampXP(
  player: Player,
  week: 13 | 14 | 15,
  modifiers: DevelopmentModifiers,
  isRookie: boolean,
  isFirstTimeStarter: boolean
): number {
  // Get base XP range for the week
  const weekKey = `week${week}` as keyof typeof TRAINING_CAMP_WEEKLY_XP;
  const { min, max } = TRAINING_CAMP_WEEKLY_XP[weekKey];

  // Random base within range
  const baseXP = Math.round(min + Math.random() * (max - min));

  // Apply rookie bonus
  let multiplier = 1;
  if (isRookie) {
    multiplier += ROOKIE_TRAINING_CAMP_BONUS;
  }

  // Apply first-time starter bonus
  if (isFirstTimeStarter) {
    multiplier += FIRST_STARTER_BONUS;
  }

  // Apply development modifiers
  multiplier *= modifiers.totalMultiplier;

  // Check for Injury Prone trait (reduces training camp XP)
  if (player.traits.includes('Injury Prone')) {
    const effect = TRAIT_DEVELOPMENT_EFFECTS['Injury Prone'];
    multiplier += effect.xpModifier; // This is negative
  }

  return Math.round(baseXP * multiplier);
}

/**
 * Calculate total training camp XP for all three weeks
 */
export function calculateTotalTrainingCampXP(
  player: Player,
  modifiers: DevelopmentModifiers,
  isRookie: boolean,
  isFirstTimeStarter: boolean
): number {
  const week13 = calculateTrainingCampXP(player, 13, modifiers, isRookie, isFirstTimeStarter);
  const week14 = calculateTrainingCampXP(player, 14, modifiers, isRookie, isFirstTimeStarter);
  const week15 = calculateTrainingCampXP(player, 15, modifiers, isRookie, isFirstTimeStarter);

  return week13 + week14 + week15;
}

// =============================================================================
// BYE WEEK XP CALCULATION (XP-003)
// =============================================================================

/**
 * Calculate XP earned during bye week
 */
export function calculateByeWeekXP(
  player: Player,
  focus: PracticeFocusType,
  intensity: PracticeIntensity,
  facilityBonus: number,
  staffBonus: number,
  gmPerkBonus: number
): PracticeXPResult {
  // Calculate normal practice XP first
  const normalResult = calculatePracticeXP(
    player,
    focus,
    intensity,
    facilityBonus,
    staffBonus,
    gmPerkBonus
  );

  // Apply bye week multiplier
  const byeWeekXP = Math.round(normalResult.totalXP * BYE_WEEK_XP_MULTIPLIER);

  return {
    ...normalResult,
    totalXP: byeWeekXP,
  };
}

// =============================================================================
// OFFSEASON PROGRAM XP CALCULATION
// =============================================================================

export type OffseasonParticipation = 'full' | 'partial' | 'minimal' | 'none';

/**
 * Determine likely participation level based on player traits and age
 */
export function getExpectedParticipation(player: Player): OffseasonParticipation {
  // Gym Rat always participates fully
  if (player.traits.includes('Gym Rat')) {
    return 'full';
  }

  // Lazy trait reduces participation
  if (player.traits.includes('Lazy')) {
    return Math.random() < 0.5 ? 'minimal' : 'none';
  }

  // Team Leader has higher participation
  if (player.traits.includes('Team Leader')) {
    return Math.random() < 0.85 ? 'full' : 'partial';
  }

  // Age-based participation rates
  if (player.age <= 25) {
    // Young players: 90% full
    const roll = Math.random();
    if (roll < 0.9) return 'full';
    if (roll < 0.95) return 'partial';
    return 'minimal';
  } else if (player.age <= 30) {
    // Prime players: 70% full
    const roll = Math.random();
    if (roll < 0.7) return 'full';
    if (roll < 0.85) return 'partial';
    if (roll < 0.95) return 'minimal';
    return 'none';
  } else {
    // Veterans: 50% full
    const roll = Math.random();
    if (roll < 0.5) return 'full';
    if (roll < 0.7) return 'partial';
    if (roll < 0.85) return 'minimal';
    return 'none';
  }
}

/**
 * Calculate XP earned from offseason program
 */
export function calculateOffseasonProgramXP(
  player: Player,
  participation: OffseasonParticipation,
  weeksParticipated: number,
  modifiers: DevelopmentModifiers
): number {
  const weeklyXP = OFFSEASON_PROGRAM_XP[participation];
  const baseXP = weeklyXP * weeksParticipated;

  // Apply modifiers
  return Math.round(baseXP * modifiers.totalMultiplier);
}

// =============================================================================
// AWARD XP CALCULATION
// =============================================================================

export type AwardType = keyof typeof AWARD_XP_BONUSES;

/**
 * Calculate XP earned from an award
 */
export function calculateAwardXP(awardType: AwardType): number {
  return AWARD_XP_BONUSES[awardType];
}

/**
 * Calculate total XP from multiple awards
 */
export function calculateTotalAwardXP(awards: AwardType[]): number {
  return awards.reduce((total, award) => total + calculateAwardXP(award), 0);
}

// =============================================================================
// TRAIT-BASED XP MODIFIER
// =============================================================================

/**
 * Calculate total XP modifier from player traits
 */
export function calculateTraitXPModifier(player: Player, context: 'all' | 'physical' | 'mental' | 'practice'): number {
  let modifier = 0;

  for (const trait of player.traits) {
    const effect = TRAIT_DEVELOPMENT_EFFECTS[trait];
    if (!effect) continue;

    switch (context) {
      case 'all':
        // Quick Learner and Slow Learner affect all XP
        if (trait === 'Quick Learner' || trait === 'Slow Learner') {
          modifier += effect.xpModifier;
        }
        // Focused and Unfocused affect all XP
        if (trait === 'Focused' || trait === 'Unfocused') {
          modifier += effect.xpModifier;
        }
        break;

      case 'physical':
        // Gym Rat affects physical XP
        if (trait === 'Gym Rat') {
          modifier += effect.xpModifier;
        }
        break;

      case 'mental':
        // Film Junkie affects mental XP
        if (trait === 'Film Junkie') {
          modifier += effect.xpModifier;
        }
        break;

      case 'practice':
        // High Motor and Lazy affect practice XP
        if (trait === 'High Motor' || trait === 'Lazy') {
          modifier += effect.xpModifier;
        }
        break;
    }
  }

  return modifier;
}

// =============================================================================
// EXPECTED SEASONAL XP
// =============================================================================

/**
 * Calculate expected XP for a season based on role
 */
export function calculateExpectedSeasonXP(
  role: 'franchise_star' | 'starter' | 'backup' | 'practice_squad',
  makesPlayoffs: boolean
): { min: number; max: number } {
  const ranges = {
    franchise_star: { regular: { min: 2500, max: 3500 }, playoffs: { min: 500, max: 800 } },
    starter: { regular: { min: 1800, max: 2500 }, playoffs: { min: 300, max: 500 } },
    backup: { regular: { min: 800, max: 1200 }, playoffs: { min: 100, max: 200 } },
    practice_squad: { regular: { min: 400, max: 600 }, playoffs: { min: 0, max: 0 } },
  };

  const roleRange = ranges[role];
  const regularMin = roleRange.regular.min;
  const regularMax = roleRange.regular.max;
  const playoffMin = makesPlayoffs ? roleRange.playoffs.min : 0;
  const playoffMax = makesPlayoffs ? roleRange.playoffs.max : 0;

  return {
    min: regularMin + playoffMin,
    max: regularMax + playoffMax,
  };
}
