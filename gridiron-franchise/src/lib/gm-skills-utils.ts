// GM Skills Utility Functions
// Synergy detection, stacking rules, and effect calculations

import type {
  SkillCategoryId,
  SkillTierId,
  GMSkillDefinition,
  SkillSetBonus,
  StackingRule,
  OwnedSkill,
  EquippedSkill,
} from '@/types/gm-skills';
import {
  allSkills,
  getSkillById,
  skillSetBonuses,
  stackingRules,
  skillCategories,
  getStandardSkills,
  getPrestigeSkills,
} from '@/data/gm-skills';
import { SKILL_TIER_COSTS } from '@/types/gm-skills';

// ============================================================================
// OWNED SKILLS MANAGEMENT
// ============================================================================

/**
 * Check if player owns a skill at any tier
 */
export function ownsSkill(ownedSkills: OwnedSkill[], skillId: string): boolean {
  return ownedSkills.some((s) => s.skillId === skillId);
}

/**
 * Get the highest tier owned for a skill
 */
export function getOwnedTier(
  ownedSkills: OwnedSkill[],
  skillId: string
): SkillTierId | null {
  const owned = ownedSkills.find((s) => s.skillId === skillId);
  return owned?.unlockedTier || null;
}

/**
 * Check if player can purchase next tier
 */
export function canPurchaseNextTier(
  ownedSkills: OwnedSkill[],
  skillId: string,
  availableGP: number
): { canPurchase: boolean; nextTier: SkillTierId | null; cost: number | null } {
  const skill = getSkillById(skillId);
  if (!skill) {
    return { canPurchase: false, nextTier: null, cost: null };
  }

  const currentTier = getOwnedTier(ownedSkills, skillId);
  const tiers = skill.tiers;

  // Find next tier
  let nextTierIndex = 0;
  if (currentTier) {
    const currentIndex = tiers.findIndex((t) => t.tier === currentTier);
    nextTierIndex = currentIndex + 1;
  }

  if (nextTierIndex >= tiers.length) {
    return { canPurchase: false, nextTier: null, cost: null };
  }

  const nextTier = tiers[nextTierIndex];
  return {
    canPurchase: availableGP >= nextTier.cost,
    nextTier: nextTier.tier,
    cost: nextTier.cost,
  };
}

// ============================================================================
// SET BONUS DETECTION
// ============================================================================

/**
 * Check if "The Scout" set bonus is active (3 scouting skills)
 */
export function hasScoutSetBonus(equippedSkills: EquippedSkill[]): boolean {
  const scoutingCount = equippedSkills.filter((e) => {
    const skill = getSkillById(e.skillId);
    return skill?.category === 'scouting_draft';
  }).length;
  return scoutingCount >= 3;
}

/**
 * Check if "The Builder" set bonus is active (3 development skills)
 */
export function hasBuilderSetBonus(equippedSkills: EquippedSkill[]): boolean {
  const devCount = equippedSkills.filter((e) => {
    const skill = getSkillById(e.skillId);
    return skill?.category === 'player_development';
  }).length;
  return devCount >= 3;
}

/**
 * Check if "The Dealmaker" set bonus is active (3 contract/trade skills)
 */
export function hasDealmakerSetBonus(equippedSkills: EquippedSkill[]): boolean {
  const contractTradeCount = equippedSkills.filter((e) => {
    const skill = getSkillById(e.skillId);
    return skill?.category === 'contracts_money' || skill?.category === 'trades';
  }).length;
  return contractTradeCount >= 3;
}

/**
 * Check if "The Executive" set bonus is active (1 skill from 5+ categories)
 */
export function hasExecutiveSetBonus(equippedSkills: EquippedSkill[]): boolean {
  const categories = new Set<SkillCategoryId>();
  for (const equipped of equippedSkills) {
    const skill = getSkillById(equipped.skillId);
    if (skill) {
      categories.add(skill.category);
    }
  }
  return categories.size >= 5;
}

/**
 * Check if "The Specialist" set bonus is active (3 Gold skills, same category)
 */
export function hasSpecialistSetBonus(equippedSkills: EquippedSkill[]): boolean {
  const categoryGoldCount = new Map<SkillCategoryId, number>();

  for (const equipped of equippedSkills) {
    if (equipped.tier === 'gold') {
      const skill = getSkillById(equipped.skillId);
      if (skill) {
        const count = categoryGoldCount.get(skill.category) || 0;
        categoryGoldCount.set(skill.category, count + 1);
      }
    }
  }

  for (const count of categoryGoldCount.values()) {
    if (count >= 3) return true;
  }
  return false;
}

/**
 * Get all active set bonuses
 */
export function getActiveSetBonuses(equippedSkills: EquippedSkill[]): SkillSetBonus[] {
  const active: SkillSetBonus[] = [];

  for (const bonus of skillSetBonuses) {
    let isActive = false;

    switch (bonus.id) {
      case 'the_scout':
        isActive = hasScoutSetBonus(equippedSkills);
        break;
      case 'the_builder':
        isActive = hasBuilderSetBonus(equippedSkills);
        break;
      case 'the_dealmaker':
        isActive = hasDealmakerSetBonus(equippedSkills);
        break;
      case 'the_executive':
        isActive = hasExecutiveSetBonus(equippedSkills);
        break;
      case 'the_specialist':
        isActive = hasSpecialistSetBonus(equippedSkills);
        break;
    }

    if (isActive) {
      active.push(bonus);
    }
  }

  return active;
}

// ============================================================================
// STACKING & DIMINISHING RETURNS
// ============================================================================

/**
 * Count equipped skills in a category
 */
export function countEquippedInCategory(
  equippedSkills: EquippedSkill[],
  category: SkillCategoryId
): number {
  return equippedSkills.filter((e) => {
    const skill = getSkillById(e.skillId);
    return skill?.category === category;
  }).length;
}

/**
 * Calculate diminishing returns multiplier
 */
export function getDiminishingReturnsMultiplier(
  equippedSkills: EquippedSkill[],
  skillId: string
): number {
  const skill = getSkillById(skillId);
  if (!skill) return 1;

  // Find applicable stacking rule
  let threshold = Infinity;
  let effectiveness = 100;

  if (skill.category === 'contracts_money') {
    // Cap bonuses
    const count = countEquippedInCategory(equippedSkills, 'contracts_money');
    if (count >= 3) {
      threshold = 3;
      effectiveness = 50;
    }
  } else if (skill.category === 'player_development') {
    // Development bonuses
    const count = countEquippedInCategory(equippedSkills, 'player_development');
    if (count >= 3) {
      threshold = 3;
      effectiveness = 75;
    }
  } else if (skill.category === 'scouting_draft') {
    // Scouting bonuses
    const count = countEquippedInCategory(equippedSkills, 'scouting_draft');
    if (count >= 4) {
      threshold = 4;
      effectiveness = 50;
    }
  }

  // Check if this is beyond threshold
  const countInCategory = countEquippedInCategory(equippedSkills, skill.category);
  if (countInCategory > threshold) {
    return effectiveness / 100;
  }

  return 1;
}

/**
 * Check if skill can be stacked (for position-based skills)
 */
export function canStackSkill(
  equippedSkills: EquippedSkill[],
  skillId: string,
  positionGroup?: string
): boolean {
  const skill = getSkillById(skillId);
  if (!skill) return false;

  // Non-stackable skills can only be equipped once
  if (!skill.stackable) {
    return !equippedSkills.some((e) => e.skillId === skillId);
  }

  // Stackable skills can be equipped multiple times for different positions
  if (positionGroup) {
    return !equippedSkills.some(
      (e) => e.skillId === skillId && e.positionGroup === positionGroup
    );
  }

  return true;
}

// ============================================================================
// EFFECT CALCULATIONS
// ============================================================================

/**
 * Get total cap space bonus from equipped skills
 */
export function getTotalCapBonus(equippedSkills: EquippedSkill[]): number {
  let total = 0;
  const capSkillIds = ['salary_cap_wizard', 'cap_genius', 'financial_wizard'];

  for (const equipped of equippedSkills) {
    if (capSkillIds.includes(equipped.skillId)) {
      const skill = getSkillById(equipped.skillId);
      if (skill) {
        const tierEffect = skill.tiers.find((t) => t.tier === equipped.tier);
        if (tierEffect) {
          // Parse cap bonus from effect string (e.g., "+$3M extra cap space")
          const match = tierEffect.effect.match(/\+\$(\d+)M/);
          if (match) {
            const bonus = parseInt(match[1], 10);
            const multiplier = getDiminishingReturnsMultiplier(
              equippedSkills,
              equipped.skillId
            );
            total += bonus * multiplier;
          }
        }
      }
    }
  }

  return total;
}

/**
 * Get total scouting accuracy bonus
 */
export function getTotalScoutingBonus(equippedSkills: EquippedSkill[]): number {
  let total = 0;

  for (const equipped of equippedSkills) {
    const skill = getSkillById(equipped.skillId);
    if (skill?.category === 'scouting_draft') {
      const tierEffect = skill.tiers.find((t) => t.tier === equipped.tier);
      if (tierEffect) {
        // Parse OVR bonus from effect string
        const match = tierEffect.effect.match(/\+(\d+)\s*OVR/);
        if (match) {
          const bonus = parseInt(match[1], 10);
          const multiplier = getDiminishingReturnsMultiplier(
            equippedSkills,
            equipped.skillId
          );
          total += bonus * multiplier;
        }
      }
    }
  }

  return Math.round(total);
}

/**
 * Get total development XP bonus percentage
 */
export function getTotalDevBonus(equippedSkills: EquippedSkill[]): number {
  let total = 0;

  for (const equipped of equippedSkills) {
    const skill = getSkillById(equipped.skillId);
    if (skill?.category === 'player_development') {
      const tierEffect = skill.tiers.find((t) => t.tier === equipped.tier);
      if (tierEffect) {
        // Parse XP bonus from effect string
        const match = tierEffect.effect.match(/\+(\d+)%\s*XP/);
        if (match) {
          const bonus = parseInt(match[1], 10);
          const multiplier = getDiminishingReturnsMultiplier(
            equippedSkills,
            equipped.skillId
          );
          total += bonus * multiplier;
        }
      }
    }
  }

  return Math.round(total);
}

/**
 * Get total trade acceptance bonus
 */
export function getTotalTradeBonus(equippedSkills: EquippedSkill[]): number {
  let total = 0;

  for (const equipped of equippedSkills) {
    const skill = getSkillById(equipped.skillId);
    if (skill?.category === 'trades') {
      const tierEffect = skill.tiers.find((t) => t.tier === equipped.tier);
      if (tierEffect) {
        const match = tierEffect.effect.match(/(\d+)%.*(?:willing|acceptance)/i);
        if (match) {
          total += parseInt(match[1], 10);
        }
      }
    }
  }

  return total;
}

// ============================================================================
// SKILL AVAILABILITY
// ============================================================================

/**
 * Get skills available to purchase based on prestige level
 */
export function getAvailableSkills(hasPrestigeTier1: boolean, hasPrestigeTier2: boolean): GMSkillDefinition[] {
  const standard = getStandardSkills();

  if (!hasPrestigeTier1) {
    return standard;
  }

  const prestige = getPrestigeSkills();
  const platinum = prestige.filter(s => s.tiers.some(t => t.tier === 'platinum'));
  const diamond = prestige.filter(s => s.tiers.some(t => t.tier === 'diamond'));

  if (hasPrestigeTier2) {
    return [...standard, ...platinum, ...diamond];
  }

  return [...standard, ...platinum];
}

/**
 * Get skills by unlock status
 */
export function categorizeSkillsByOwnership(
  ownedSkills: OwnedSkill[]
): {
  owned: GMSkillDefinition[];
  available: GMSkillDefinition[];
  locked: GMSkillDefinition[];
} {
  const standard = getStandardSkills();
  const owned: GMSkillDefinition[] = [];
  const available: GMSkillDefinition[] = [];

  for (const skill of standard) {
    if (ownsSkill(ownedSkills, skill.id)) {
      owned.push(skill);
    } else {
      available.push(skill);
    }
  }

  // Prestige skills are locked until prestige tier unlocked
  const locked = getPrestigeSkills();

  return { owned, available, locked };
}
