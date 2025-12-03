// GM Skills System Types
// Aligned with FINAL-gm-skills-perks-system.md specification

// Skill Categories (8 categories)
export type SkillCategoryId =
  | 'scouting_draft'
  | 'contracts_money'
  | 'trades'
  | 'player_development'
  | 'team_management'
  | 'coaching_staff'
  | 'facilities_operations'
  | 'meta_qol';

// Skill tier levels with costs
export type SkillTierId = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface SkillTier {
  id: SkillTierId;
  name: string;
  cost: number; // GP cost
  powerLevel: string;
}

// Skill tier costs from FINAL spec
export const SKILL_TIER_COSTS: Record<SkillTierId, number> = {
  bronze: 100,
  silver: 250,
  gold: 500,
  platinum: 1000,
  diamond: 2000,
};

// Individual skill effect at a tier
export interface SkillTierEffect {
  tier: SkillTierId;
  effect: string;
  cost: number;
}

// Complete skill definition
export interface GMSkillDefinition {
  id: string;
  name: string;
  category: SkillCategoryId;
  tiers: SkillTierEffect[];
  stackable?: boolean; // Can equip multiple (e.g., Position Guru for different positions)
  goldOnly?: boolean; // Only available at Gold tier (e.g., Blockbuster)
  note?: string; // Additional info
}

// Skill category metadata
export interface SkillCategory {
  id: SkillCategoryId;
  name: string;
  icon: string;
  description: string;
}

// Owned skill state (player's progress)
export interface OwnedSkill {
  skillId: string;
  unlockedTier: SkillTierId;
  purchasedAt: number; // timestamp
}

// Equipped skill (in active slot)
export interface EquippedSkill {
  slotIndex: number;
  skillId: string;
  tier: SkillTierId;
  positionGroup?: string; // For Position Guru/Position Coach
}

// Skill set bonus (synergy between skills)
export interface SkillSetBonus {
  id: string;
  name: string;
  requirement: string;
  requiredSkillCount: number;
  requiredCategories?: SkillCategoryId[];
  requiredSkillIds?: string[];
  bonus: string;
}

// Stacking rule
export interface StackingRule {
  id: string;
  description: string;
  allowed: boolean;
  condition?: string;
  diminishingReturns?: {
    threshold: number;
    effectiveness: number;
  };
}

// Player's complete skill state
export interface GMSkillsState {
  ownedSkills: OwnedSkill[];
  equippedSkills: EquippedSkill[];
  unlockedSlots: number; // 1-7
  activeSetBonuses: string[]; // IDs of active set bonuses
}

// Position groups for Position Guru / Position Coach
export type PositionGroup =
  | 'QB'
  | 'RB'
  | 'WR'
  | 'TE'
  | 'OL'
  | 'DL'
  | 'LB'
  | 'DB'
  | 'ST';

export const POSITION_GROUPS: PositionGroup[] = [
  'QB',
  'RB',
  'WR',
  'TE',
  'OL',
  'DL',
  'LB',
  'DB',
  'ST',
];
