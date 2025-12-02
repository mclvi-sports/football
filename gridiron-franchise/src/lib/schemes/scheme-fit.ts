/**
 * Scheme Fit System
 *
 * Calculates player scheme fit based on archetype and attributes.
 * Based on FINAL-schemes-system.md
 */

import {
  OffensiveScheme,
  DefensiveScheme,
  SchemeFit,
  SCHEME_FIT_MODIFIERS,
  ADJUSTMENT_WEEKS,
  SCHEME_FAMILIES,
  ArchetypeSchemeAffinity,
} from './types';

// ============================================================================
// ARCHETYPE SCHEME AFFINITIES
// ============================================================================

/**
 * QB archetypes and their natural scheme fits
 */
export const QB_SCHEME_AFFINITY: ArchetypeSchemeAffinity = {
  field_general: {
    west_coast: 'perfect',
    pro_style: 'good',
    spread: 'neutral',
    air_raid: 'neutral',
    power_run: 'poor',
    zone_run: 'neutral',
  },
  scrambler: {
    spread: 'perfect',
    zone_run: 'good',
    west_coast: 'neutral',
    air_raid: 'neutral',
    pro_style: 'poor',
    power_run: 'poor',
  },
  dual_threat: {
    spread: 'perfect',
    zone_run: 'good',
    pro_style: 'neutral',
    west_coast: 'neutral',
    air_raid: 'poor',
    power_run: 'poor',
  },
  gunslinger: {
    air_raid: 'perfect',
    spread: 'good',
    pro_style: 'neutral',
    west_coast: 'poor',
    power_run: 'terrible',
    zone_run: 'poor',
  },
  pocket_passer: {
    pro_style: 'perfect',
    west_coast: 'good',
    air_raid: 'good',
    spread: 'neutral',
    power_run: 'neutral',
    zone_run: 'poor',
  },
  game_manager: {
    power_run: 'perfect',
    zone_run: 'good',
    pro_style: 'good',
    west_coast: 'neutral',
    spread: 'poor',
    air_raid: 'terrible',
  },
};

/**
 * RB archetypes and their natural scheme fits
 */
export const RB_SCHEME_AFFINITY: ArchetypeSchemeAffinity = {
  power_back: {
    power_run: 'perfect',
    pro_style: 'good',
    zone_run: 'neutral',
    west_coast: 'poor',
    spread: 'poor',
    air_raid: 'terrible',
  },
  speed_back: {
    zone_run: 'perfect',
    spread: 'good',
    pro_style: 'neutral',
    west_coast: 'neutral',
    power_run: 'poor',
    air_raid: 'poor',
  },
  receiving_back: {
    west_coast: 'perfect',
    spread: 'good',
    air_raid: 'good',
    pro_style: 'neutral',
    zone_run: 'neutral',
    power_run: 'poor',
  },
  all_purpose: {
    pro_style: 'perfect',
    west_coast: 'good',
    spread: 'good',
    zone_run: 'neutral',
    power_run: 'neutral',
    air_raid: 'neutral',
  },
  bruiser: {
    power_run: 'perfect',
    pro_style: 'good',
    zone_run: 'poor',
    west_coast: 'poor',
    spread: 'terrible',
    air_raid: 'terrible',
  },
};

/**
 * WR archetypes and their natural scheme fits
 */
export const WR_SCHEME_AFFINITY: ArchetypeSchemeAffinity = {
  deep_threat: {
    air_raid: 'perfect',
    spread: 'good',
    pro_style: 'neutral',
    zone_run: 'poor',
    west_coast: 'poor',
    power_run: 'terrible',
  },
  possession: {
    west_coast: 'perfect',
    pro_style: 'good',
    spread: 'neutral',
    air_raid: 'neutral',
    zone_run: 'poor',
    power_run: 'poor',
  },
  playmaker: {
    spread: 'perfect',
    west_coast: 'good',
    pro_style: 'good',
    air_raid: 'neutral',
    zone_run: 'neutral',
    power_run: 'poor',
  },
  slot: {
    west_coast: 'perfect',
    spread: 'perfect',
    pro_style: 'good',
    air_raid: 'neutral',
    zone_run: 'poor',
    power_run: 'poor',
  },
  red_zone: {
    pro_style: 'perfect',
    air_raid: 'good',
    west_coast: 'good',
    spread: 'neutral',
    power_run: 'neutral',
    zone_run: 'poor',
  },
  blocking_wr: {
    power_run: 'perfect',
    zone_run: 'perfect',
    pro_style: 'good',
    west_coast: 'poor',
    spread: 'poor',
    air_raid: 'terrible',
  },
};

/**
 * Defensive archetypes and their scheme fits
 */
export const DEFENSIVE_SCHEME_AFFINITY: ArchetypeSchemeAffinity = {
  // DL
  speed_rusher: {
    '4-3': 'perfect',
    'man_blitz': 'perfect',
    'cover_2': 'good',
    'cover_3': 'good',
    '3-4': 'neutral',
    'zone_blitz': 'neutral',
  },
  power_rusher: {
    '4-3': 'perfect',
    '3-4': 'good',
    'man_blitz': 'good',
    'cover_2': 'neutral',
    'cover_3': 'neutral',
    'zone_blitz': 'poor',
  },
  run_stuffer: {
    '4-3': 'perfect',
    '3-4': 'good',
    'cover_3': 'good',
    'cover_2': 'neutral',
    'man_blitz': 'poor',
    'zone_blitz': 'poor',
  },
  nose_tackle: {
    '3-4': 'perfect',
    '4-3': 'neutral',
    'cover_2': 'poor',
    'cover_3': 'poor',
    'man_blitz': 'poor',
    'zone_blitz': 'poor',
  },
  // LB
  run_stopper_lb: {
    '4-3': 'perfect',
    '3-4': 'good',
    'cover_2': 'neutral',
    'cover_3': 'poor',
    'man_blitz': 'poor',
    'zone_blitz': 'poor',
  },
  coverage_lb: {
    'cover_2': 'perfect',
    'cover_3': 'good',
    'zone_blitz': 'good',
    '4-3': 'neutral',
    '3-4': 'neutral',
    'man_blitz': 'poor',
  },
  edge_rusher: {
    '3-4': 'perfect',
    'man_blitz': 'perfect',
    '4-3': 'good',
    'zone_blitz': 'good',
    'cover_2': 'poor',
    'cover_3': 'poor',
  },
  hybrid_lb: {
    'zone_blitz': 'perfect',
    '3-4': 'good',
    'cover_2': 'good',
    'cover_3': 'neutral',
    '4-3': 'neutral',
    'man_blitz': 'neutral',
  },
  // CB
  shutdown_corner: {
    'man_blitz': 'perfect',
    '4-3': 'good',
    '3-4': 'good',
    'cover_2': 'neutral',
    'cover_3': 'poor',
    'zone_blitz': 'poor',
  },
  zone_corner: {
    'cover_2': 'perfect',
    'cover_3': 'perfect',
    'zone_blitz': 'good',
    '4-3': 'neutral',
    '3-4': 'neutral',
    'man_blitz': 'poor',
  },
  ball_hawk: {
    'cover_3': 'perfect',
    'cover_2': 'good',
    'zone_blitz': 'good',
    '4-3': 'neutral',
    '3-4': 'neutral',
    'man_blitz': 'poor',
  },
  // S
  deep_safety: {
    'cover_2': 'perfect',
    'cover_3': 'good',
    'zone_blitz': 'neutral',
    '4-3': 'neutral',
    '3-4': 'neutral',
    'man_blitz': 'poor',
  },
  box_safety: {
    '4-3': 'perfect',
    '3-4': 'good',
    'cover_3': 'good',
    'cover_2': 'neutral',
    'man_blitz': 'neutral',
    'zone_blitz': 'poor',
  },
  hybrid_safety: {
    'zone_blitz': 'perfect',
    '3-4': 'good',
    'cover_2': 'good',
    'cover_3': 'neutral',
    '4-3': 'neutral',
    'man_blitz': 'neutral',
  },
};

// ============================================================================
// SCHEME FIT CALCULATION
// ============================================================================

/**
 * Get scheme fit for a player based on their archetype
 */
export function getArchetypeSchemeFit(
  archetype: string,
  scheme: OffensiveScheme | DefensiveScheme,
  positionGroup: 'QB' | 'RB' | 'WR' | 'DEF'
): SchemeFit {
  let affinityMap: ArchetypeSchemeAffinity;

  switch (positionGroup) {
    case 'QB':
      affinityMap = QB_SCHEME_AFFINITY;
      break;
    case 'RB':
      affinityMap = RB_SCHEME_AFFINITY;
      break;
    case 'WR':
      affinityMap = WR_SCHEME_AFFINITY;
      break;
    case 'DEF':
      affinityMap = DEFENSIVE_SCHEME_AFFINITY;
      break;
    default:
      return 'neutral';
  }

  const archetypeAffinities = affinityMap[archetype];
  if (!archetypeAffinities) {
    return 'neutral';
  }

  return (archetypeAffinities[scheme] as SchemeFit) || 'neutral';
}

/**
 * Calculate scheme fit based on key attributes
 */
export function calculateAttributeBasedFit(
  playerAttributes: Record<string, number>,
  keyAttributes: string[],
  thresholds: { perfect: number; good: number; neutral: number; poor: number }
): SchemeFit {
  const scores: SchemeFit[] = [];

  for (const attr of keyAttributes) {
    const value = playerAttributes[attr] || 0;

    if (value >= thresholds.perfect) {
      scores.push('perfect');
    } else if (value >= thresholds.good) {
      scores.push('good');
    } else if (value >= thresholds.neutral) {
      scores.push('neutral');
    } else if (value >= thresholds.poor) {
      scores.push('poor');
    } else {
      scores.push('terrible');
    }
  }

  // Average the scores
  return averageSchemeFit(scores);
}

/**
 * Average multiple scheme fit values
 */
function averageSchemeFit(fits: SchemeFit[]): SchemeFit {
  if (fits.length === 0) return 'neutral';

  const fitValues: Record<SchemeFit, number> = {
    perfect: 4,
    good: 3,
    neutral: 2,
    poor: 1,
    terrible: 0,
  };

  const total = fits.reduce((sum, fit) => sum + fitValues[fit], 0);
  const avg = total / fits.length;

  if (avg >= 3.5) return 'perfect';
  if (avg >= 2.5) return 'good';
  if (avg >= 1.5) return 'neutral';
  if (avg >= 0.5) return 'poor';
  return 'terrible';
}

/**
 * Get OVR modifier for a scheme fit level
 */
export function getSchemeFitOvrModifier(fit: SchemeFit): number {
  return SCHEME_FIT_MODIFIERS[fit];
}

// ============================================================================
// SCHEME ADJUSTMENT
// ============================================================================

/**
 * Check if two schemes are in the same family (for faster adjustment)
 */
export function areInSameFamily(
  scheme1: OffensiveScheme | DefensiveScheme,
  scheme2: OffensiveScheme | DefensiveScheme
): boolean {
  for (const family of Object.values(SCHEME_FAMILIES)) {
    if (family.includes(scheme1 as never) && family.includes(scheme2 as never)) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate adjustment weeks when changing schemes
 */
export function calculateAdjustmentWeeks(
  oldScheme: OffensiveScheme | DefensiveScheme,
  newScheme: OffensiveScheme | DefensiveScheme,
  playerTraits: {
    awareness?: number;
    hasQuickLearner?: boolean;
    hasSlowLearner?: boolean;
    age?: number;
  }
): number {
  let weeks = ADJUSTMENT_WEEKS;

  // Same family = faster adjustment
  if (areInSameFamily(oldScheme, newScheme)) {
    weeks -= 1;
  }

  // High awareness = faster
  if (playerTraits.awareness && playerTraits.awareness >= 85) {
    weeks -= 1;
  }

  // Quick learner trait
  if (playerTraits.hasQuickLearner) {
    weeks -= 1;
  }

  // Slow learner trait
  if (playerTraits.hasSlowLearner) {
    weeks += 2;
  }

  // Age 30+ = slower
  if (playerTraits.age && playerTraits.age >= 30) {
    weeks += 1;
  }

  // Minimum 1 week, maximum 6 weeks
  return Math.max(1, Math.min(6, weeks));
}

/**
 * Calculate effective fit modifier during adjustment period
 */
export function getAdjustmentPeriodModifier(
  baseFit: SchemeFit,
  weeksRemaining: number
): number {
  const baseModifier = SCHEME_FIT_MODIFIERS[baseFit];

  // Reduce bonus during adjustment
  if (weeksRemaining >= 4) {
    return baseModifier * 0.25; // 25% of bonus in week 1
  } else if (weeksRemaining >= 3) {
    return baseModifier * 0.5; // 50% of bonus in week 2
  } else if (weeksRemaining >= 2) {
    return baseModifier * 0.75; // 75% of bonus in week 3
  } else if (weeksRemaining >= 1) {
    return baseModifier * 0.9; // 90% of bonus in week 4
  }

  return baseModifier; // Full bonus
}
