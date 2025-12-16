/**
 * Scheme Modifiers
 *
 * Calculates scheme matchup advantages and applies play tendencies
 * based on the schemes module.
 */

import {
  OffensiveScheme,
  DefensiveScheme,
  SchemeMatchupResult,
  MATCHUP_MODIFIERS,
  PlayTendencies,
} from '../schemes/types';
import {
  OFFENSIVE_SCHEMES,
  DEFENSIVE_SCHEMES,
} from '../schemes/scheme-data';
import { GameSituation } from './types';

// ============================================================================
// SCHEME MATCHUP CALCULATION
// ============================================================================

/**
 * Calculate the matchup result between an offensive and defensive scheme
 */
export function calculateSchemeMatchup(
  offenseScheme: OffensiveScheme,
  defenseScheme: DefensiveScheme
): SchemeMatchupResult {
  const offense = OFFENSIVE_SCHEMES[offenseScheme];
  const defense = DEFENSIVE_SCHEMES[defenseScheme];

  // Check if offense is strong against this defense
  if (offense.strongAgainst.includes(defenseScheme)) {
    // Check if defense is also strong against offense (cancel out)
    if (defense.strongAgainst.includes(offenseScheme)) {
      return 'neutral';
    }
    return 'strong_advantage';
  }

  // Check if offense is weak against this defense
  if (offense.weakAgainst.includes(defenseScheme)) {
    return 'strong_disadvantage';
  }

  // Check if defense is strong against this offense
  if (defense.strongAgainst.includes(offenseScheme)) {
    return 'slight_disadvantage';
  }

  // Check if defense is weak against this offense
  if (defense.weakAgainst.includes(offenseScheme)) {
    return 'slight_advantage';
  }

  return 'neutral';
}

/**
 * Get the OVR modifier for a scheme matchup
 */
export function getSchemeMatchupModifier(
  offenseScheme: OffensiveScheme,
  defenseScheme: DefensiveScheme
): number {
  const result = calculateSchemeMatchup(offenseScheme, defenseScheme);
  return MATCHUP_MODIFIERS[result];
}

// ============================================================================
// PLAY CALLING TENDENCIES
// ============================================================================

export type DownDistance =
  | 'first_and_10'
  | 'second_and_short'
  | 'second_and_long'
  | 'third_and_short'
  | 'third_and_long'
  | 'red_zone'
  | 'goal_line';

/**
 * Determine the current down/distance situation
 */
export function getDownDistanceSituation(
  down: number,
  yardsToGo: number,
  ballPosition: number
): DownDistance {
  // Goal line (inside the 5)
  if (ballPosition >= 95) {
    return 'goal_line';
  }

  // Red zone (inside the 20)
  if (ballPosition >= 80) {
    return 'red_zone';
  }

  // Standard down/distance
  if (down === 1) {
    return 'first_and_10';
  }

  if (down === 2) {
    return yardsToGo <= 3 ? 'second_and_short' : 'second_and_long';
  }

  // 3rd or 4th down
  return yardsToGo <= 3 ? 'third_and_short' : 'third_and_long';
}

/**
 * Get pass/run tendency percentages for a scheme and situation
 */
export function getPlayTendency(
  scheme: OffensiveScheme,
  situation: DownDistance
): { pass: number; run: number } {
  const schemeData = OFFENSIVE_SCHEMES[scheme];
  return schemeData.playCallingTendencies[situation];
}

/**
 * Decide whether to pass or run based on scheme tendencies
 * Returns true for pass, false for run
 */
export function shouldPass(
  scheme: OffensiveScheme,
  down: number,
  yardsToGo: number,
  ballPosition: number,
  randomValue?: number
): boolean {
  const situation = getDownDistanceSituation(down, yardsToGo, ballPosition);
  const tendency = getPlayTendency(scheme, situation);

  // Use provided random value or generate one
  const roll = randomValue ?? Math.random() * 100;

  return roll < tendency.pass;
}

// ============================================================================
// PASS DISTRIBUTION
// ============================================================================

export type PassDepth = 'short' | 'medium' | 'deep';

/**
 * Get pass depth distribution for a scheme
 */
export function getPassDistribution(
  scheme: OffensiveScheme
): { short: number; medium: number; deep: number } {
  return OFFENSIVE_SCHEMES[scheme].passDistribution;
}

/**
 * Determine pass depth based on scheme distribution
 */
export function determinePassDepth(
  scheme: OffensiveScheme,
  randomValue?: number
): PassDepth {
  const distribution = getPassDistribution(scheme);
  const roll = randomValue ?? Math.random() * 100;

  if (roll < distribution.short) {
    return 'short';
  } else if (roll < distribution.short + distribution.medium) {
    return 'medium';
  }
  return 'deep';
}

/**
 * Get yards range for each pass depth
 */
export function getPassYardsRange(depth: PassDepth): { min: number; max: number } {
  switch (depth) {
    case 'short':
      return { min: -2, max: 8 };
    case 'medium':
      return { min: 8, max: 18 };
    case 'deep':
      return { min: 18, max: 45 };
  }
}

// ============================================================================
// SCHEME ATTRIBUTE BONUSES
// ============================================================================

/**
 * Get attribute bonuses for players in a scheme
 */
export function getSchemeAttributeBonuses(
  scheme: OffensiveScheme,
  position?: string
): Record<string, number> {
  const schemeData = OFFENSIVE_SCHEMES[scheme];
  const bonuses: Record<string, number> = {};

  for (const bonus of schemeData.attributeBonuses) {
    // Apply if no position specified, or if position matches
    if (!bonus.positions || !position || bonus.positions.includes(position)) {
      bonuses[bonus.attribute] = (bonuses[bonus.attribute] || 0) + bonus.value;
    }
  }

  return bonuses;
}

/**
 * Get attribute penalties for players in a scheme
 */
export function getSchemeAttributePenalties(
  scheme: OffensiveScheme,
  position?: string
): Record<string, number> {
  const schemeData = OFFENSIVE_SCHEMES[scheme];
  const penalties: Record<string, number> = {};

  for (const penalty of schemeData.attributePenalties) {
    if (!penalty.positions || !position || penalty.positions.includes(position)) {
      penalties[penalty.attribute] = (penalties[penalty.attribute] || 0) + penalty.value;
    }
  }

  return penalties;
}

// ============================================================================
// DEFENSIVE SCHEME BONUSES
// ============================================================================

/**
 * Get defensive scheme attribute bonuses
 */
export function getDefensiveSchemeAttributeBonuses(
  scheme: DefensiveScheme,
  position?: string
): Record<string, number> {
  const schemeData = DEFENSIVE_SCHEMES[scheme];
  const bonuses: Record<string, number> = {};

  for (const bonus of schemeData.attributeBonuses) {
    if (!bonus.positions || !position || bonus.positions.includes(position)) {
      bonuses[bonus.attribute] = (bonuses[bonus.attribute] || 0) + bonus.value;
    }
  }

  return bonuses;
}

/**
 * Get defensive scheme attribute penalties
 */
export function getDefensiveSchemeAttributePenalties(
  scheme: DefensiveScheme,
  position?: string
): Record<string, number> {
  const schemeData = DEFENSIVE_SCHEMES[scheme];
  const penalties: Record<string, number> = {};

  for (const penalty of schemeData.attributePenalties) {
    if (!penalty.positions || !position || penalty.positions.includes(position)) {
      penalties[penalty.attribute] = (penalties[penalty.attribute] || 0) + penalty.value;
    }
  }

  return penalties;
}

// ============================================================================
// COMBINED GAME MODIFIERS
// ============================================================================

export interface SchemeGameModifiers {
  offenseMatchupBonus: number;
  defenseMatchupBonus: number;
  passChance: number;
  runChance: number;
  offenseAttributeBonuses: Record<string, number>;
  offenseAttributePenalties: Record<string, number>;
  defenseAttributeBonuses: Record<string, number>;
  defenseAttributePenalties: Record<string, number>;
}

/**
 * Calculate all scheme-related modifiers for a game
 */
export function calculateSchemeGameModifiers(
  offenseScheme: OffensiveScheme,
  defenseScheme: DefensiveScheme,
  situation: GameSituation
): SchemeGameModifiers {
  // Matchup bonuses
  const matchupResult = calculateSchemeMatchup(offenseScheme, defenseScheme);
  const matchupMod = MATCHUP_MODIFIERS[matchupResult];

  // Offense gets the matchup bonus if advantage, defense if disadvantage
  const offenseMatchupBonus = matchupMod > 0 ? matchupMod : 0;
  const defenseMatchupBonus = matchupMod < 0 ? Math.abs(matchupMod) : 0;

  // Play tendency for current situation
  const downDistance = getDownDistanceSituation(
    situation.down,
    situation.yardsToGo,
    situation.ballPosition
  );
  const tendency = getPlayTendency(offenseScheme, downDistance);

  return {
    offenseMatchupBonus,
    defenseMatchupBonus,
    passChance: tendency.pass,
    runChance: tendency.run,
    offenseAttributeBonuses: getSchemeAttributeBonuses(offenseScheme),
    offenseAttributePenalties: getSchemeAttributePenalties(offenseScheme),
    defenseAttributeBonuses: getDefensiveSchemeAttributeBonuses(defenseScheme),
    defenseAttributePenalties: getDefensiveSchemeAttributePenalties(defenseScheme),
  };
}
