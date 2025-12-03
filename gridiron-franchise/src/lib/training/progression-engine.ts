/**
 * Progression Engine Module
 * WO-TRAINING-SYSTEM-001 | PROG-001, PROG-002, PROG-003, PROG-004, BADGE-001
 *
 * Handles attribute upgrades, age progression, and badge progression
 */

import { Player, PlayerAttributes, Position, BadgeTier } from '../types';

// Helper to safely get attribute value from PlayerAttributes
function getAttributeValue(attributes: PlayerAttributes, key: string): number | undefined {
  return (attributes as unknown as Record<string, number>)[key];
}
import {
  AttributeUpgradeResult,
  OffseasonProgressionResult,
  DevelopmentModifiers,
  DevelopmentModifier,
  BadgeProgress,
  AttributeCategory,
  TrainingProgress,
} from './types';
import {
  ATTRIBUTE_CATEGORY_CONFIGS,
  POSITION_ATTRIBUTE_RELEVANCE,
  RELEVANCE_COST_MODIFIERS,
  getAgeCurve,
  POTENTIAL_SOFT_CAP_THRESHOLD,
  POTENTIAL_SOFT_CAP_PENALTY,
  OVERACHIEVER_POTENTIAL_BONUS,
  BADGE_COSTS,
  getBadgeSlots,
  TRAINING_ROOM_BONUSES,
  WEIGHT_ROOM_BONUSES,
  PRACTICE_FACILITY_BONUSES,
  POSITION_COACH_BONUSES,
  COORDINATOR_BONUSES,
  SCHEME_FIT_BONUSES,
  TRAIT_DEVELOPMENT_EFFECTS,
  GM_PERK_EFFECTS,
  AI_DEVELOPMENT_BY_ROLE,
  MAX_YEARLY_OVR_GAIN,
  AI_DEVELOPMENT_VARIANCE,
} from './training-constants';

// =============================================================================
// ATTRIBUTE COST CALCULATION (PROG-001)
// =============================================================================

/**
 * Get the category of an attribute
 */
export function getAttributeCategory(attributeKey: string): AttributeCategory | null {
  for (const config of ATTRIBUTE_CATEGORY_CONFIGS) {
    if (config.attributes.includes(attributeKey)) {
      return config.category;
    }
  }
  return null;
}

/**
 * Get base cost for an attribute category
 */
export function getBaseCost(category: AttributeCategory): number {
  const config = ATTRIBUTE_CATEGORY_CONFIGS.find(c => c.category === category);
  return config?.baseCost || 100;
}

/**
 * Get position relevance modifier for an attribute
 */
export function getPositionRelevanceModifier(position: Position, attributeKey: string): number {
  const relevanceMap = POSITION_ATTRIBUTE_RELEVANCE[position];
  if (!relevanceMap) return RELEVANCE_COST_MODIFIERS.secondary;

  const relevance = relevanceMap[attributeKey] || 'secondary';
  return RELEVANCE_COST_MODIFIERS[relevance];
}

/**
 * Calculate the XP cost to upgrade an attribute by 1 point
 * Formula: Cost = BaseCost * (1 + (CurrentValue - 60) * 0.05) * PositionModifier * AgeModifier
 */
export function calculateAttributeCost(
  player: Player,
  attributeKey: string,
  currentValue: number
): number {
  // Get attribute category
  const category = getAttributeCategory(attributeKey);
  if (!category) return 0;

  // Get base cost
  const baseCost = getBaseCost(category);

  // Calculate value scaling (higher attributes cost more)
  const valueScaling = 1 + (currentValue - 60) * 0.05;

  // Get position relevance modifier
  const positionModifier = getPositionRelevanceModifier(player.position, attributeKey);

  // Get age modifier
  const ageCurve = getAgeCurve(player.age);
  const ageModifier = ageCurve.xpCostModifier;

  // Calculate base cost
  let cost = baseCost * valueScaling * positionModifier * ageModifier;

  // Apply potential soft cap penalty if near ceiling
  const potentialCeiling = player.potential;
  const effectiveCeiling = player.traits.includes('Overachiever')
    ? potentialCeiling + OVERACHIEVER_POTENTIAL_BONUS
    : potentialCeiling;

  if (player.overall >= effectiveCeiling * POTENTIAL_SOFT_CAP_THRESHOLD) {
    cost *= POTENTIAL_SOFT_CAP_PENALTY;
  }

  return Math.round(cost);
}

// =============================================================================
// ATTRIBUTE UPGRADE (PROG-002)
// =============================================================================

/**
 * Check if a player can upgrade an attribute
 */
export function canUpgradeAttribute(
  player: Player,
  attributeKey: string,
  availableXP: number
): { canUpgrade: boolean; reason?: string } {
  const currentValue = getAttributeValue(player.attributes, attributeKey);

  // Check if attribute exists
  if (currentValue === undefined) {
    return { canUpgrade: false, reason: 'Invalid attribute' };
  }

  // Check if at maximum (99)
  if (currentValue >= 99) {
    return { canUpgrade: false, reason: 'Attribute at maximum (99)' };
  }

  // Check potential ceiling
  const potentialCeiling = player.potential;
  const effectiveCeiling = player.traits.includes('Overachiever')
    ? potentialCeiling + OVERACHIEVER_POTENTIAL_BONUS
    : potentialCeiling;

  if (player.overall >= effectiveCeiling) {
    return { canUpgrade: false, reason: 'Player has reached potential ceiling' };
  }

  // Check if enough XP
  const cost = calculateAttributeCost(player, attributeKey, currentValue);
  if (availableXP < cost) {
    return { canUpgrade: false, reason: `Not enough XP (need ${cost}, have ${availableXP})` };
  }

  return { canUpgrade: true };
}

/**
 * Apply an attribute upgrade to a player
 */
export function applyAttributeUpgrade(
  player: Player,
  attributeKey: string,
  availableXP: number
): AttributeUpgradeResult {
  const check = canUpgradeAttribute(player, attributeKey, availableXP);

  if (!check.canUpgrade) {
    return {
      success: false,
      attribute: attributeKey,
      oldValue: getAttributeValue(player.attributes, attributeKey) || 0,
      newValue: getAttributeValue(player.attributes, attributeKey) || 0,
      xpCost: 0,
      remainingXP: availableXP,
      error: check.reason,
    };
  }

  const oldValue = getAttributeValue(player.attributes, attributeKey) || 0;
  const cost = calculateAttributeCost(player, attributeKey, oldValue);
  const newValue = oldValue + 1;

  return {
    success: true,
    attribute: attributeKey,
    oldValue,
    newValue,
    xpCost: cost,
    remainingXP: availableXP - cost,
  };
}

// =============================================================================
// AGE PROGRESSION (PROG-003)
// =============================================================================

/**
 * Calculate yearly attribute changes based on age
 */
export function calculateAgeProgression(player: Player): OffseasonProgressionResult {
  const ageCurve = getAgeCurve(player.age);
  const attributeChanges: OffseasonProgressionResult['attributeChanges'] = [];

  // Get physical attributes
  const physicalAttrs = ATTRIBUTE_CATEGORY_CONFIGS.find(c => c.category === 'physical')?.attributes || [];
  const mentalAttrs = ATTRIBUTE_CATEGORY_CONFIGS.find(c => c.category === 'mental')?.attributes || [];
  const technicalAttrs = ATTRIBUTE_CATEGORY_CONFIGS.find(c => c.category === 'technical')?.attributes || [];

  // Apply physical changes
  for (const attr of physicalAttrs) {
    const currentValue = getAttributeValue(player.attributes, attr);
    if (currentValue === undefined) continue;

    const change = ageCurve.physicalChange;
    if (change !== 0) {
      const newValue = Math.max(40, Math.min(99, currentValue + change));
      if (newValue !== currentValue) {
        attributeChanges.push({
          attribute: attr,
          oldValue: currentValue,
          newValue,
          reason: change > 0 ? 'age_progression' : 'age_regression',
        });
      }
    }
  }

  // Apply mental changes
  for (const attr of mentalAttrs) {
    const currentValue = getAttributeValue(player.attributes, attr);
    if (currentValue === undefined) continue;

    const change = ageCurve.mentalChange;
    if (change !== 0) {
      const newValue = Math.max(40, Math.min(99, currentValue + change));
      if (newValue !== currentValue) {
        attributeChanges.push({
          attribute: attr,
          oldValue: currentValue,
          newValue,
          reason: change > 0 ? 'age_progression' : 'age_regression',
        });
      }
    }
  }

  // Apply technical changes (sample - apply to position-relevant attrs)
  const relevantTechnical = technicalAttrs.filter(attr => {
    const relevance = POSITION_ATTRIBUTE_RELEVANCE[player.position]?.[attr];
    return relevance === 'primary' || relevance === 'secondary';
  });

  for (const attr of relevantTechnical) {
    const currentValue = getAttributeValue(player.attributes, attr);
    if (currentValue === undefined) continue;

    const change = ageCurve.technicalChange;
    if (change !== 0) {
      const newValue = Math.max(40, Math.min(99, currentValue + change));
      if (newValue !== currentValue) {
        attributeChanges.push({
          attribute: attr,
          oldValue: currentValue,
          newValue,
          reason: change > 0 ? 'age_progression' : 'age_regression',
        });
      }
    }
  }

  // Calculate OVR change (simplified - average of changes)
  const totalChange = attributeChanges.reduce((sum, c) => sum + (c.newValue - c.oldValue), 0);
  const avgChange = attributeChanges.length > 0 ? totalChange / attributeChanges.length : 0;
  const ovrChange = Math.round(avgChange);

  return {
    playerId: player.id,
    ageChange: 1,
    attributeChanges,
    ovrChange,
    newOVR: Math.max(40, Math.min(99, player.overall + ovrChange)),
  };
}

// =============================================================================
// DEVELOPMENT MODIFIERS (PROG-004)
// =============================================================================

/**
 * Calculate facility bonus based on facility quality
 */
export function calculateFacilityBonus(
  trainingRoomQuality: number,
  weightRoomQuality: number,
  practiceFacilityQuality: number,
  forPhysical: boolean = false
): number {
  const trainingBonus = TRAINING_ROOM_BONUSES[trainingRoomQuality] || 0;
  const practiceBonus = PRACTICE_FACILITY_BONUSES[practiceFacilityQuality] || 0;

  // Weight room bonus only applies to physical attributes
  const weightBonus = forPhysical ? (WEIGHT_ROOM_BONUSES[weightRoomQuality] || 0) : 0;

  return trainingBonus + practiceBonus + weightBonus;
}

/**
 * Calculate staff bonus based on coach quality
 */
export function calculateStaffBonus(
  positionCoachOVR: number,
  coordinatorOVR: number
): number {
  // Find position coach bonus
  const positionBonus = POSITION_COACH_BONUSES.find(
    b => positionCoachOVR >= b.minOVR && positionCoachOVR <= b.maxOVR
  )?.bonus || 0;

  // Find coordinator bonus
  const coordBonus = COORDINATOR_BONUSES.find(
    b => coordinatorOVR >= b.minOVR && coordinatorOVR <= b.maxOVR
  )?.bonus || 0;

  return positionBonus + coordBonus;
}

/**
 * Calculate scheme fit bonus
 */
export function calculateSchemeFitBonus(
  fitLevel: 'perfect' | 'good' | 'neutral' | 'poor' | 'mismatch'
): number {
  return SCHEME_FIT_BONUSES[fitLevel];
}

/**
 * Calculate GM perk bonus for a specific player
 */
export function calculateGMPerkBonus(
  perkName: string,
  perkTier: 'bronze' | 'silver' | 'gold',
  isCoachsFavorite: boolean = false
): number {
  if (perkName === 'coachs_favorite' && isCoachsFavorite) {
    const perkConfig = GM_PERK_EFFECTS.coachs_favorite[perkTier];
    return perkConfig.bonus;
  }

  if (perkName === 'position_coach') {
    const perkConfig = GM_PERK_EFFECTS.position_coach[perkTier];
    return perkConfig.bonus;
  }

  return 0;
}

/**
 * Calculate trait-based development modifier
 */
export function calculateTraitModifier(player: Player): number {
  let modifier = 0;

  for (const trait of player.traits) {
    const effect = TRAIT_DEVELOPMENT_EFFECTS[trait];
    if (effect) {
      modifier += effect.xpModifier;
    }
  }

  return modifier;
}

/**
 * Calculate all development modifiers for a player
 */
export function calculateDevelopmentModifiers(
  player: Player,
  facilities: { trainingRoom: number; weightRoom: number; practiceFacility: number },
  staff: { positionCoachOVR: number; coordinatorOVR: number },
  schemeFit: 'perfect' | 'good' | 'neutral' | 'poor' | 'mismatch',
  gmPerks: { name: string; tier: 'bronze' | 'silver' | 'gold' }[],
  isCoachsFavorite: boolean
): DevelopmentModifiers {
  const activeModifiers: DevelopmentModifier[] = [];

  // Facility bonus
  const facilityBonus = calculateFacilityBonus(
    facilities.trainingRoom,
    facilities.weightRoom,
    facilities.practiceFacility
  );
  if (facilityBonus > 0) {
    activeModifiers.push({
      source: 'facility_training_room',
      type: 'xp_bonus',
      value: facilityBonus,
      description: `Facility bonus: +${Math.round(facilityBonus * 100)}%`,
    });
  }

  // Staff bonus
  const staffBonus = calculateStaffBonus(staff.positionCoachOVR, staff.coordinatorOVR);
  if (staffBonus !== 0) {
    activeModifiers.push({
      source: 'coach_position',
      type: 'xp_bonus',
      value: staffBonus,
      description: `Staff bonus: ${staffBonus >= 0 ? '+' : ''}${Math.round(staffBonus * 100)}%`,
    });
  }

  // Scheme fit bonus
  const schemeFitBonus = calculateSchemeFitBonus(schemeFit);
  if (schemeFitBonus !== 0) {
    activeModifiers.push({
      source: 'scheme_fit',
      type: 'xp_bonus',
      value: schemeFitBonus,
      description: `Scheme fit: ${schemeFitBonus >= 0 ? '+' : ''}${Math.round(schemeFitBonus * 100)}%`,
    });
  }

  // GM perk bonus
  let gmPerkBonus = 0;
  for (const perk of gmPerks) {
    const bonus = calculateGMPerkBonus(perk.name, perk.tier, isCoachsFavorite);
    gmPerkBonus += bonus;
  }
  if (gmPerkBonus > 0) {
    activeModifiers.push({
      source: 'gm_perk',
      type: 'xp_bonus',
      value: gmPerkBonus,
      description: `GM perks: +${Math.round(gmPerkBonus * 100)}%`,
    });
  }

  // Trait bonus
  const traitBonus = calculateTraitModifier(player);
  if (traitBonus !== 0) {
    activeModifiers.push({
      source: 'trait',
      type: 'xp_bonus',
      value: traitBonus,
      description: `Traits: ${traitBonus >= 0 ? '+' : ''}${Math.round(traitBonus * 100)}%`,
    });
  }

  // Age modifier (affects cost, not XP gain)
  const ageCurve = getAgeCurve(player.age);
  const ageModifier = ageCurve.xpCostModifier;

  // Calculate total multiplier (1 + all bonuses)
  const totalMultiplier = 1 + facilityBonus + staffBonus + schemeFitBonus + gmPerkBonus + traitBonus;

  return {
    facilityBonus,
    staffBonus,
    gmPerkBonus,
    traitBonus,
    schemeFitBonus,
    ageModifier,
    totalMultiplier: Math.max(0.5, totalMultiplier), // Floor at 50%
    activeModifiers,
  };
}

// =============================================================================
// BADGE PROGRESSION (BADGE-001)
// =============================================================================

/**
 * Get cost to upgrade a badge to the next tier
 */
export function getBadgeUpgradeCost(currentTier: BadgeTier | null): number {
  if (currentTier === null) {
    // Unlocking bronze
    return BADGE_COSTS.find(b => b.tier === 'bronze')?.cost || 500;
  }

  const tiers: BadgeTier[] = ['bronze', 'silver', 'gold', 'hof'];
  const currentIndex = tiers.indexOf(currentTier);

  if (currentIndex >= tiers.length - 1) {
    // Already at HoF
    return 0;
  }

  const nextTier = tiers[currentIndex + 1];
  return BADGE_COSTS.find(b => b.tier === nextTier)?.cost || 0;
}

/**
 * Get the next tier for a badge
 */
export function getNextBadgeTier(currentTier: BadgeTier | null): BadgeTier | null {
  if (currentTier === null) return 'bronze';
  if (currentTier === 'bronze') return 'silver';
  if (currentTier === 'silver') return 'gold';
  if (currentTier === 'gold') return 'hof';
  return null; // Already at HoF
}

/**
 * Check if player can upgrade a badge
 */
export function canUpgradeBadge(
  player: Player,
  badgeProgress: BadgeProgress[],
  badgeId: string,
  availableXP: number
): { canUpgrade: boolean; reason?: string } {
  // Find current badge progress
  const progress = badgeProgress.find(b => b.badgeId === badgeId);
  const currentTier = progress?.tier || null;

  // Check if already at max
  if (currentTier === 'hof') {
    return { canUpgrade: false, reason: 'Badge already at Hall of Fame tier' };
  }

  // Check badge slots
  const equippedCount = badgeProgress.filter(b => b.tier !== null).length;
  const maxSlots = getBadgeSlots(player.overall);

  // If unlocking new badge, check slot availability
  if (currentTier === null && equippedCount >= maxSlots) {
    return { canUpgrade: false, reason: `No badge slots available (${equippedCount}/${maxSlots})` };
  }

  // Check XP cost
  const cost = getBadgeUpgradeCost(currentTier);
  if (availableXP < cost) {
    return { canUpgrade: false, reason: `Not enough XP (need ${cost}, have ${availableXP})` };
  }

  return { canUpgrade: true };
}

/**
 * Apply badge upgrade
 */
export function applyBadgeUpgrade(
  badgeProgress: BadgeProgress[],
  badgeId: string,
  availableXP: number
): { success: boolean; newProgress: BadgeProgress[]; xpCost: number; error?: string } {
  // Find or create badge progress
  let progress = badgeProgress.find(b => b.badgeId === badgeId);
  const currentTier = progress?.tier || null;

  const cost = getBadgeUpgradeCost(currentTier);
  const nextTier = getNextBadgeTier(currentTier);

  if (nextTier === null) {
    return {
      success: false,
      newProgress: badgeProgress,
      xpCost: 0,
      error: 'Badge already at maximum tier',
    };
  }

  if (availableXP < cost) {
    return {
      success: false,
      newProgress: badgeProgress,
      xpCost: 0,
      error: 'Not enough XP',
    };
  }

  // Create new progress array
  const newProgress = [...badgeProgress];

  if (progress) {
    // Update existing
    const index = newProgress.findIndex(b => b.badgeId === badgeId);
    newProgress[index] = {
      ...progress,
      tier: nextTier,
      xpInvested: (progress.xpInvested || 0) + cost,
      upgradedAt: new Date().toISOString(),
    };
  } else {
    // Create new
    newProgress.push({
      badgeId,
      tier: nextTier,
      xpInvested: cost,
      unlockedAt: new Date().toISOString(),
    });
  }

  return {
    success: true,
    newProgress,
    xpCost: cost,
  };
}

// =============================================================================
// AI TEAM PROGRESSION
// =============================================================================

/**
 * Calculate AI team player development for offseason
 */
export function calculateAIPlayerDevelopment(
  player: Player,
  role: 'starter' | 'backup' | 'practice_squad',
  facilityModifier: number = 1.0
): number {
  // Base development by role
  const baseDev = AI_DEVELOPMENT_BY_ROLE[role];

  // Apply age curve
  const ageCurve = getAgeCurve(player.age);
  const ageChange = (ageCurve.physicalChange + ageCurve.technicalChange + ageCurve.mentalChange) / 3;

  // Calculate potential-based modifier
  const potentialGap = player.potential - player.overall;
  const potentialModifier = potentialGap > 0 ? Math.min(1.5, 1 + potentialGap / 20) : 0.5;

  // Random variance
  const variance = AI_DEVELOPMENT_VARIANCE.min + Math.random() * (AI_DEVELOPMENT_VARIANCE.max - AI_DEVELOPMENT_VARIANCE.min);

  // Calculate total development
  let totalDev = (baseDev + ageChange) * potentialModifier * facilityModifier * variance;

  // Cap at max yearly gain
  totalDev = Math.min(totalDev, MAX_YEARLY_OVR_GAIN);

  // Cannot exceed potential
  const maxOVR = player.potential;
  const projectedOVR = player.overall + totalDev;
  if (projectedOVR > maxOVR) {
    totalDev = maxOVR - player.overall;
  }

  return Math.round(totalDev * 10) / 10; // Round to 1 decimal
}
