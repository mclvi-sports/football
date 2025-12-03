// Team Tier Starting Configuration Types
// Aligned with FINAL-gm-skills-perks-system.md Part 6

// Team tier levels
export type TeamTierLevel = 'elite' | 'good' | 'average' | 'below_average' | 'rebuilding';

// Starting configuration for each tier
export interface TeamTierConfig {
  tier: TeamTierLevel;
  name: string;
  description: string;
  startingGP: number;
  startingSlots: number;
  startingSkills: 'background_and_archetype' | 'archetype_only';
  ownerPatience: {
    years: number;
    description: string;
  };
  bonuses?: {
    gpMultiplier?: number; // e.g., +50% GP from development = 1.5
    bonusType?: string;
  };
}

// Team tier thresholds based on previous season performance
export interface TierThresholds {
  tier: TeamTierLevel;
  minWins?: number;
  maxWins?: number;
  madePlayoffs?: boolean;
  wonChampionship?: boolean;
}
