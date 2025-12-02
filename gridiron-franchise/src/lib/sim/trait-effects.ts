/**
 * Trait Effects
 *
 * Calculate trait-based modifiers during simulation based on game situation.
 * Implements trait effects from FINAL-traits-system.md.
 */

import { GameSituation, SimTrait } from './types';

// ============================================================================
// TRAIT DEFINITIONS
// ============================================================================

interface TraitEffect {
  name: string;
  condition: (situation: GameSituation) => boolean;
  modifier: number; // OVR modifier when active
  isNegative: boolean;
  description: string;
}

export const TRAIT_EFFECTS: TraitEffect[] = [
  // Positive Situational Traits
  {
    name: 'Ice in Veins',
    condition: (s) => s.isClutch || s.isPlayoffs,
    modifier: 10,
    isNegative: false,
    description: '+10 all attrs in clutch/playoff situations',
  },
  {
    name: 'Comeback Artist',
    condition: (s) => s.isTrailing && s.quarter === 4,
    modifier: 8,
    isNegative: false,
    description: '+8 all attrs when trailing in Q4',
  },
  {
    name: 'Prime Time Player',
    condition: (s) => s.isPrimeTime,
    modifier: 5,
    isNegative: false,
    description: '+5 OVR in prime time games',
  },
  {
    name: 'Frontrunner',
    condition: (s) => s.isLeading && s.teamScore - s.opponentScore >= 14,
    modifier: 5,
    isNegative: false,
    description: '+5 when leading by 14+',
  },
  {
    name: 'Red Zone Specialist',
    condition: (s) => s.inRedZone,
    modifier: 8,
    isNegative: false,
    description: '+8 in red zone',
  },
  {
    name: 'Goal Line Warrior',
    condition: (s) => s.inGoalLine,
    modifier: 10,
    isNegative: false,
    description: '+10 in goal line situations',
  },
  {
    name: 'Third Down Specialist',
    condition: (s) => s.down === 3,
    modifier: 6,
    isNegative: false,
    description: '+6 on third down',
  },
  {
    name: 'Fourth Quarter Closer',
    condition: (s) => s.quarter === 4 && s.isLeading,
    modifier: 6,
    isNegative: false,
    description: '+6 when leading in Q4',
  },

  // Negative Situational Traits
  {
    name: 'Chokes Under Pressure',
    condition: (s) => s.isClutch || s.isPlayoffs,
    modifier: -10,
    isNegative: true,
    description: '-10 all attrs in clutch/playoff situations',
  },
  {
    name: 'Slow Starter',
    condition: (s) => s.quarter === 1,
    modifier: -5,
    isNegative: true,
    description: '-5 in first quarter',
  },

  // Always-Active Traits (returned as special values)
  {
    name: 'Iron Man',
    condition: () => true,
    modifier: 0, // Special: -75% injury chance
    isNegative: false,
    description: '-75% injury chance',
  },
  {
    name: 'Durable',
    condition: () => true,
    modifier: 0, // Special: -40% injury chance
    isNegative: false,
    description: '-40% injury chance',
  },
  {
    name: 'Injury Prone',
    condition: () => true,
    modifier: 0, // Special: +75% injury chance
    isNegative: true,
    description: '+75% injury chance',
  },
  {
    name: 'Workhorse',
    condition: () => true,
    modifier: 0, // Special: +10 stamina, no fatigue
    isNegative: false,
    description: '+10 stamina, no fatigue',
  },
  {
    name: 'Aggressive',
    condition: () => true,
    modifier: 2, // +10% big play, +10% turnover
    isNegative: false,
    description: '+10% big play chance, +10% turnover chance',
  },
  {
    name: 'Disciplined',
    condition: () => true,
    modifier: 0, // Special: -75% penalty chance
    isNegative: false,
    description: '-75% penalty chance',
  },
  {
    name: 'Hot Head',
    condition: () => true,
    modifier: 2, // +50% penalty, +2 physical
    isNegative: true,
    description: '+50% penalty chance, +2 physical',
  },
  {
    name: 'High Football IQ',
    condition: () => true,
    modifier: 3,
    isNegative: false,
    description: '+3 awareness',
  },
  {
    name: 'Film Junkie',
    condition: () => true,
    modifier: 2,
    isNegative: false,
    description: '+2 awareness',
  },
  {
    name: 'Ball Hawk',
    condition: () => true,
    modifier: 0, // Special: +5% INT chance
    isNegative: false,
    description: '+5% INT chance',
  },
];

// ============================================================================
// SITUATION DETECTION
// ============================================================================

/**
 * Detect current game situation from state
 */
export function detectSituation(
  quarter: number,
  clock: number,
  down: number,
  yardsToGo: number,
  ballPosition: number,
  teamScore: number,
  opponentScore: number,
  isPlayoffs: boolean,
  isPrimeTime: boolean,
  possession: 'away' | 'home'
): GameSituation {
  const isClutch =
    quarter >= 4 && clock <= 120 && Math.abs(teamScore - opponentScore) <= 8;

  // Red zone: within 20 yards of opponent's end zone
  const inRedZone =
    (possession === 'away' && ballPosition >= 80) ||
    (possession === 'home' && ballPosition <= 20);

  // Goal line: within 5 yards of opponent's end zone
  const inGoalLine =
    (possession === 'away' && ballPosition >= 95) ||
    (possession === 'home' && ballPosition <= 5);

  return {
    quarter,
    clock,
    down,
    yardsToGo,
    ballPosition,
    teamScore,
    opponentScore,
    isClutch,
    isPlayoffs,
    isPrimeTime,
    isTrailing: teamScore < opponentScore,
    isLeading: teamScore > opponentScore,
    inRedZone,
    inGoalLine,
    possession,
  };
}

// ============================================================================
// TRAIT MODIFIER CALCULATION
// ============================================================================

/**
 * Get total OVR modifier from a player's traits given the current situation
 */
export function getTraitModifier(
  traits: SimTrait[],
  playerId: string,
  situation: GameSituation
): number {
  let totalModifier = 0;

  // Get traits for this player
  const playerTraits = traits.filter((t) => t.playerId === playerId);

  for (const playerTrait of playerTraits) {
    const traitDef = TRAIT_EFFECTS.find((t) => t.name === playerTrait.name);
    if (traitDef && traitDef.condition(situation)) {
      totalModifier += traitDef.modifier;
    }
  }

  return totalModifier;
}

/**
 * Get total OVR modifier for a team based on active traits
 */
export function getTeamTraitModifier(
  traits: SimTrait[],
  situation: GameSituation
): number {
  let totalModifier = 0;
  const processedPlayers = new Set<string>();

  for (const trait of traits) {
    // Only count each player once with their best trait
    if (processedPlayers.has(trait.playerId)) continue;

    const traitDef = TRAIT_EFFECTS.find((t) => t.name === trait.name);
    if (traitDef && traitDef.condition(situation) && traitDef.modifier !== 0) {
      totalModifier += traitDef.modifier * 0.2; // Scaled for team effect
      processedPlayers.add(trait.playerId);
    }
  }

  return Math.round(totalModifier);
}

/**
 * Check if a player has a specific trait
 */
export function hasTrait(
  traits: SimTrait[],
  playerId: string,
  traitName: string
): boolean {
  return traits.some((t) => t.playerId === playerId && t.name === traitName);
}

/**
 * Get injury chance modifier for a player
 */
export function getInjuryChanceModifier(
  traits: SimTrait[],
  playerId: string
): number {
  if (hasTrait(traits, playerId, 'Iron Man')) return -0.75;
  if (hasTrait(traits, playerId, 'Durable')) return -0.40;
  if (hasTrait(traits, playerId, 'Injury Prone')) return 0.75;
  return 0;
}

/**
 * Get penalty chance modifier for a player
 */
export function getPenaltyChanceModifier(
  traits: SimTrait[],
  playerId: string
): number {
  if (hasTrait(traits, playerId, 'Disciplined')) return -0.75;
  if (hasTrait(traits, playerId, 'Hot Head')) return 0.50;
  return 0;
}

/**
 * Get big play/turnover modifiers for aggressive players
 */
export function getAggressiveModifiers(
  traits: SimTrait[],
  playerId: string
): { bigPlayBonus: number; turnoverPenalty: number } {
  if (hasTrait(traits, playerId, 'Aggressive')) {
    return { bigPlayBonus: 0.10, turnoverPenalty: 0.10 };
  }
  return { bigPlayBonus: 0, turnoverPenalty: 0 };
}

/**
 * Get interception chance modifier for ball hawks
 */
export function getBallHawkModifier(
  traits: SimTrait[],
  playerId: string
): number {
  if (hasTrait(traits, playerId, 'Ball Hawk')) return 0.05;
  return 0;
}

/**
 * Get active trait descriptions for UI display
 */
export function getActiveTraits(
  traits: SimTrait[],
  situation: GameSituation
): { playerName: string; traitName: string; effect: string }[] {
  const active: { playerName: string; traitName: string; effect: string }[] = [];

  for (const trait of traits) {
    const traitDef = TRAIT_EFFECTS.find((t) => t.name === trait.name);
    if (traitDef && traitDef.condition(situation) && traitDef.modifier !== 0) {
      active.push({
        playerName: trait.playerId, // Would need player lookup for name
        traitName: trait.name,
        effect: traitDef.description,
      });
    }
  }

  return active;
}
