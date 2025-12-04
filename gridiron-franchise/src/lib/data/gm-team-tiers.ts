import type { TeamTierConfig, TeamTierLevel, TierThresholds } from '@/types/gm-team-tier';

// ============================================================================
// TEAM TIER CONFIGURATIONS
// ============================================================================

export const teamTierConfigs: TeamTierConfig[] = [
  {
    tier: 'elite',
    name: 'Elite',
    description: 'Championship contender with a stacked roster',
    startingGP: 200,
    startingSlots: 2,
    startingSkills: 'background_and_archetype',
    ownerPatience: {
      years: 5,
      description: 'High (5+ years)',
    },
  },
  {
    tier: 'good',
    name: 'Good',
    description: 'Playoff team with solid foundation',
    startingGP: 150,
    startingSlots: 2,
    startingSkills: 'background_and_archetype',
    ownerPatience: {
      years: 4,
      description: 'Moderate (4 years)',
    },
  },
  {
    tier: 'average',
    name: 'Average',
    description: 'Middle of the pack, could go either way',
    startingGP: 100,
    startingSlots: 1,
    startingSkills: 'archetype_only',
    ownerPatience: {
      years: 3,
      description: 'Moderate (3-4 years)',
    },
  },
  {
    tier: 'below_average',
    name: 'Below Average',
    description: 'Struggling team needing improvement',
    startingGP: 75,
    startingSlots: 1,
    startingSkills: 'archetype_only',
    ownerPatience: {
      years: 2,
      description: 'Low (2-3 years)',
    },
  },
  {
    tier: 'rebuilding',
    name: 'Rebuilding',
    description: 'Starting from scratch with high draft picks',
    startingGP: 50,
    startingSlots: 1,
    startingSkills: 'archetype_only',
    ownerPatience: {
      years: 2,
      description: 'Very Low (2 years)',
    },
    bonuses: {
      gpMultiplier: 1.5, // +50% GP from development achievements
      bonusType: 'development',
    },
  },
];

// ============================================================================
// TIER THRESHOLDS (for determining team tier)
// ============================================================================

export const tierThresholds: TierThresholds[] = [
  {
    tier: 'elite',
    minWins: 12,
    madePlayoffs: true,
  },
  {
    tier: 'good',
    minWins: 10,
    maxWins: 11,
    madePlayoffs: true,
  },
  {
    tier: 'average',
    minWins: 7,
    maxWins: 9,
  },
  {
    tier: 'below_average',
    minWins: 4,
    maxWins: 6,
  },
  {
    tier: 'rebuilding',
    minWins: 0,
    maxWins: 3,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get tier config by tier level
 */
export function getTierConfig(tier: TeamTierLevel): TeamTierConfig | undefined {
  return teamTierConfigs.find((c) => c.tier === tier);
}

/**
 * Determine team tier based on previous season performance
 */
export function determineTeamTier(
  wins: number,
  madePlayoffs: boolean,
  wonChampionship: boolean
): TeamTierLevel {
  // Championship winner is elite
  if (wonChampionship) {
    return 'elite';
  }

  // Playoff team with 12+ wins is elite
  if (madePlayoffs && wins >= 12) {
    return 'elite';
  }

  // Playoff team with 10-11 wins is good
  if (madePlayoffs && wins >= 10) {
    return 'good';
  }

  // Non-playoff team with good record might still be good
  if (wins >= 10) {
    return 'good';
  }

  // 7-9 wins is average
  if (wins >= 7) {
    return 'average';
  }

  // 4-6 wins is below average
  if (wins >= 4) {
    return 'below_average';
  }

  // 0-3 wins is rebuilding
  return 'rebuilding';
}

/**
 * Get starting GP for a tier
 */
export function getStartingGP(tier: TeamTierLevel): number {
  const config = getTierConfig(tier);
  return config?.startingGP || 100;
}

/**
 * Get starting slots for a tier
 */
export function getStartingSlots(tier: TeamTierLevel): number {
  const config = getTierConfig(tier);
  return config?.startingSlots || 1;
}

/**
 * Get owner patience years for a tier
 */
export function getOwnerPatience(tier: TeamTierLevel): number {
  const config = getTierConfig(tier);
  return config?.ownerPatience.years || 3;
}

/**
 * Check if tier gets background skill or just archetype
 */
export function getsBackgroundSkill(tier: TeamTierLevel): boolean {
  const config = getTierConfig(tier);
  return config?.startingSkills === 'background_and_archetype';
}

/**
 * Get GP multiplier for development achievements (rebuilding bonus)
 */
export function getGPMultiplier(tier: TeamTierLevel): number {
  const config = getTierConfig(tier);
  return config?.bonuses?.gpMultiplier || 1;
}

/**
 * Calculate tier-adjusted points for an achievement
 */
export function calculateTierAdjustedPoints(
  basePoints: number,
  tier: TeamTierLevel,
  achievementType: string
): number {
  const config = getTierConfig(tier);

  // Only rebuilding teams get bonus for development achievements
  if (
    config?.bonuses?.gpMultiplier &&
    config?.bonuses?.bonusType === achievementType
  ) {
    return Math.round(basePoints * config.bonuses.gpMultiplier);
  }

  return basePoints;
}

/**
 * Get all tier names for display
 */
export function getAllTierNames(): { tier: TeamTierLevel; name: string }[] {
  return teamTierConfigs.map((c) => ({ tier: c.tier, name: c.name }));
}

/**
 * Get tier summary for display
 */
export function getTierSummary(tier: TeamTierLevel): {
  name: string;
  gp: number;
  slots: number;
  patience: string;
} {
  const config = getTierConfig(tier);
  if (!config) {
    return { name: 'Unknown', gp: 0, slots: 0, patience: 'Unknown' };
  }

  return {
    name: config.name,
    gp: config.startingGP,
    slots: config.startingSlots,
    patience: config.ownerPatience.description,
  };
}
