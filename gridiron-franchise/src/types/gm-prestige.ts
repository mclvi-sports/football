// GM Prestige System Types
// Aligned with FINAL-gm-skills-perks-system.md Part 7

// Prestige tier levels
export type PrestigeTierId = 'none' | 'hall_of_fame' | 'legend' | 'goat';

// Prestige tier definition
export interface PrestigeTier {
  id: PrestigeTierId;
  name: string;
  title: string;
  requirements: PrestigeRequirement[];
  unlocks: PrestigeUnlock[];
  description: string;
}

// Requirement to unlock prestige tier
export interface PrestigeRequirement {
  type: 'championships' | 'dynasties';
  value: number;
}

// What gets unlocked at each prestige tier
export interface PrestigeUnlock {
  type: 'skill_tier' | 'equipment_slot' | 'custom_skill';
  value: string;
  description: string;
}

// Player's prestige state
export interface GMPrestigeState {
  currentTier: PrestigeTierId;
  championships: number;
  dynasties: number;
  customSkillCreated: boolean;
  customSkillId?: string;
  unlockedAt?: number; // timestamp when current tier was unlocked
}

// Custom skill creation (for GOAT tier)
export interface CustomSkillCreation {
  name: string;
  category: string;
  effect: string;
  tier: 'platinum' | 'diamond';
}
