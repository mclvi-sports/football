import type { PrestigeTier, PrestigeTierId } from '@/types/gm-prestige';

// ============================================================================
// PRESTIGE TIER DEFINITIONS
// ============================================================================

export const prestigeTiers: PrestigeTier[] = [
  {
    id: 'none',
    name: 'None',
    title: 'GM',
    requirements: [],
    unlocks: [],
    description: 'Standard GM without prestige achievements',
  },
  {
    id: 'hall_of_fame',
    name: 'Hall of Fame GM',
    title: 'Prestige I',
    requirements: [{ type: 'championships', value: 3 }],
    unlocks: [
      {
        type: 'skill_tier',
        value: 'platinum',
        description: 'Access to Platinum skills (1,000 GP)',
      },
      {
        type: 'equipment_slot',
        value: '6',
        description: '+1 Equipment Slot (total 6)',
      },
    ],
    description: 'Proven winner with 3 championship rings',
  },
  {
    id: 'legend',
    name: 'Legend',
    title: 'Prestige II',
    requirements: [{ type: 'championships', value: 5 }],
    unlocks: [
      {
        type: 'equipment_slot',
        value: '7',
        description: '+1 Equipment Slot (total 7)',
      },
    ],
    description: 'Multiple championships cement your legacy',
  },
  {
    id: 'goat',
    name: 'GOAT',
    title: 'Prestige III',
    requirements: [
      { type: 'championships', value: 7 },
      { type: 'dynasties', value: 2 },
    ],
    unlocks: [
      {
        type: 'skill_tier',
        value: 'diamond',
        description: 'Access to Diamond skills (2,000 GP)',
      },
      {
        type: 'custom_skill',
        value: 'custom',
        description: 'Create one custom skill',
      },
    ],
    description: 'The Greatest Of All Time - unmatched dominance',
  },
];

// ============================================================================
// PLATINUM SKILLS (unlocked at Hall of Fame)
// ============================================================================

export const platinumSkillsInfo = {
  tier: 'platinum' as const,
  cost: 1000,
  requiredPrestige: 'hall_of_fame' as PrestigeTierId,
  skills: [
    {
      id: 'dynasty_builder',
      name: 'Dynasty Builder',
      effect: 'Championship teams stay together 2 extra years',
    },
    {
      id: 'talent_magnet',
      name: 'Talent Magnet',
      effect: 'Top 3 FAs always consider your team',
    },
    {
      id: 'draft_oracle',
      name: 'Draft Oracle',
      effect: 'See bust/steal outcome before drafting',
    },
    {
      id: 'cap_genius',
      name: 'Cap Genius',
      effect: '+$15M cap, no dead money on cuts',
    },
    {
      id: 'player_whisperer',
      name: 'Player Whisperer',
      effect: 'Any player will restructure',
    },
  ],
};

// ============================================================================
// DIAMOND SKILLS (unlocked at GOAT)
// ============================================================================

export const diamondSkillsInfo = {
  tier: 'diamond' as const,
  cost: 2000,
  requiredPrestige: 'goat' as PrestigeTierId,
  skills: [
    {
      id: 'perfect_evaluation',
      name: 'Perfect Evaluation',
      effect: 'See true OVR of all players, all teams',
    },
    {
      id: 'trade_emperor',
      name: 'Trade Emperor',
      effect: 'Force 2 trades per season',
    },
    {
      id: 'development_god',
      name: 'Development God',
      effect: 'All under 28 gain +5 OVR/season',
    },
    {
      id: 'financial_wizard',
      name: 'Financial Wizard',
      effect: '+$25M cap, -25% all salaries',
    },
    {
      id: 'legacy',
      name: 'Legacy',
      effect: 'Retire jerseys, Hall of Fame ceremonies',
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get prestige tier by ID
 */
export function getPrestigeTier(id: PrestigeTierId): PrestigeTier | undefined {
  return prestigeTiers.find((t) => t.id === id);
}

/**
 * Determine prestige tier based on achievements
 */
export function determinePrestigeTier(
  championships: number,
  dynasties: number
): PrestigeTierId {
  // Check GOAT first (7 championships OR 2 dynasties)
  if (championships >= 7 || dynasties >= 2) {
    return 'goat';
  }

  // Check Legend (5 championships)
  if (championships >= 5) {
    return 'legend';
  }

  // Check Hall of Fame (3 championships)
  if (championships >= 3) {
    return 'hall_of_fame';
  }

  return 'none';
}

/**
 * Check if prestige tier is unlocked
 */
export function isPrestigeUnlocked(
  tier: PrestigeTierId,
  championships: number,
  dynasties: number
): boolean {
  const currentTier = determinePrestigeTier(championships, dynasties);

  const tierOrder: PrestigeTierId[] = ['none', 'hall_of_fame', 'legend', 'goat'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const checkIndex = tierOrder.indexOf(tier);

  return currentIndex >= checkIndex;
}

/**
 * Get progress toward next prestige tier
 */
export function getPrestigeProgress(
  championships: number,
  dynasties: number
): {
  currentTier: PrestigeTierId;
  nextTier: PrestigeTierId | null;
  progressPercent: number;
  requirement: { type: string; current: number; target: number } | null;
} {
  const currentTier = determinePrestigeTier(championships, dynasties);

  if (currentTier === 'goat') {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      requirement: null,
    };
  }

  let nextTier: PrestigeTierId;
  let target: number;

  switch (currentTier) {
    case 'none':
      nextTier = 'hall_of_fame';
      target = 3;
      break;
    case 'hall_of_fame':
      nextTier = 'legend';
      target = 5;
      break;
    case 'legend':
      nextTier = 'goat';
      target = 7;
      break;
    default:
      nextTier = 'hall_of_fame';
      target = 3;
  }

  const progressPercent = Math.min(100, Math.round((championships / target) * 100));

  return {
    currentTier,
    nextTier,
    progressPercent,
    requirement: {
      type: 'championships',
      current: championships,
      target,
    },
  };
}

/**
 * Get max equipment slots for prestige tier
 */
export function getPrestigeMaxSlots(tier: PrestigeTierId): number {
  switch (tier) {
    case 'goat':
    case 'legend':
      return 7;
    case 'hall_of_fame':
      return 6;
    default:
      return 5;
  }
}

/**
 * Check if platinum skills are unlocked
 */
export function hasPlatinumAccess(tier: PrestigeTierId): boolean {
  return tier === 'hall_of_fame' || tier === 'legend' || tier === 'goat';
}

/**
 * Check if diamond skills are unlocked
 */
export function hasDiamondAccess(tier: PrestigeTierId): boolean {
  return tier === 'goat';
}

/**
 * Check if custom skill creation is unlocked
 */
export function hasCustomSkillAccess(tier: PrestigeTierId): boolean {
  return tier === 'goat';
}

/**
 * Get all prestige tier names for display
 */
export function getAllPrestigeTierNames(): { id: PrestigeTierId; name: string; title: string }[] {
  return prestigeTiers.map((t) => ({
    id: t.id,
    name: t.name,
    title: t.title,
  }));
}
