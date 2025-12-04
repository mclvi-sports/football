import type {
  GMArchetype,
  GMArchetypeId,
  GMBackground,
  GMBackgroundId,
  GMBonuses,
  GMPersona,
  GMSynergy,
  SynergyKey,
} from '@/types/gm-persona';
import { synergyMap } from '@/lib/data/gm-personas';

/**
 * Get synergy for a background and archetype combination
 * Returns null if no synergy exists
 */
export function getSynergy(
  backgroundId: GMBackgroundId,
  archetypeId: GMArchetypeId
): GMSynergy | null {
  const key: SynergyKey = `${backgroundId}_${archetypeId}`;
  return synergyMap[key] || null;
}

/**
 * Check if a background has synergy with a given archetype
 */
export function hasSynergy(
  backgroundId: GMBackgroundId,
  archetypeId: GMArchetypeId
): boolean {
  return getSynergy(backgroundId, archetypeId) !== null;
}

/**
 * Get all backgrounds that have synergy with a given archetype
 */
export function getBackgroundsWithSynergy(
  archetypeId: GMArchetypeId,
  backgrounds: GMBackground[]
): GMBackground[] {
  return backgrounds.filter((bg) => hasSynergy(bg.id, archetypeId));
}

/**
 * Calculate default bonuses (starting values before modifiers)
 */
function getDefaultBonuses(): GMBonuses {
  return {
    scoutingAccuracy: 0,
    contractNegotiation: 0,
    tradeAcceptance: 0,
    playerDevelopment: 0,
    faAppeal: 0,
    teamMorale: 0,
    capSpace: 0,
    ownerPatience: 0,
    coachAppeal: 0,
    fanLoyalty: 0,
  };
}

/**
 * Calculate combined bonuses for a GM persona
 * Based on FINAL-gm-skills-perks-system.md bonuses
 */
export function calculateBonuses(
  background: GMBackground,
  archetype: GMArchetype,
  synergy: GMSynergy | null
): GMBonuses {
  const bonuses = getDefaultBonuses();

  // Apply background bonuses (from FINAL spec)
  switch (background.id) {
    case 'scout':
      bonuses.scoutingAccuracy += 10;
      // +1 sleeper/draft is tracked separately
      break;
    case 'cap_analyst':
      bonuses.capSpace += 5; // +$5M
      bonuses.contractNegotiation += 5; // -5% demands
      break;
    case 'coach':
      bonuses.playerDevelopment += 10;
      bonuses.coachAppeal += 5;
      break;
    case 'agent':
      bonuses.contractNegotiation += 10; // -10% demands
      bonuses.faAppeal += 10;
      break;
    case 'analytics':
      bonuses.scoutingAccuracy += 5; // +5% all evaluation
      break;
    case 'legacy':
      bonuses.fanLoyalty += 15;
      bonuses.ownerPatience += 10;
      break;
  }

  // Apply archetype bonuses (from starting skill effects)
  switch (archetype.id) {
    case 'the_builder':
      bonuses.playerDevelopment += 10; // Training Boost effect
      break;
    case 'the_closer':
      bonuses.tradeAcceptance += 10; // Trade Master effect
      break;
    case 'the_economist':
      bonuses.capSpace += 3; // +$3M from Salary Cap Wizard
      break;
    case 'the_talent_scout':
      bonuses.scoutingAccuracy += 10; // Hidden Gem effect
      break;
    case 'the_culture_builder':
      bonuses.teamMorale += 15; // Morale Master effect (60% min floor)
      break;
    case 'the_innovator':
      bonuses.scoutingAccuracy += 5; // Inside Sources effect
      break;
  }

  // Apply synergy bonuses (from FINAL spec)
  if (synergy) {
    switch (synergy.id) {
      case 'scout_talent_scout':
        bonuses.scoutingAccuracy += 15; // +3 sleepers + exact OVR R1
        break;
      case 'cap_analyst_economist':
        bonuses.capSpace += 8; // +$8M total
        bonuses.contractNegotiation += 10; // -10% demands
        break;
      case 'coach_builder':
        bonuses.playerDevelopment += 40; // +40% young player dev
        break;
      case 'agent_closer':
        bonuses.contractNegotiation += 15; // -15% demands
        bonuses.tradeAcceptance += 25; // +25% trade acceptance
        break;
      case 'analytics_innovator':
        bonuses.scoutingAccuracy += 20; // Full opponent scouting
        break;
      case 'legacy_culture_builder':
        bonuses.teamMorale += 25;
        bonuses.fanLoyalty += 20;
        break;
    }
  }

  return bonuses;
}

/**
 * Create a complete GM Persona from selected background and archetype
 */
export function createGMPersona(
  background: GMBackground,
  archetype: GMArchetype
): GMPersona {
  const synergy = getSynergy(background.id, archetype.id);
  const bonuses = calculateBonuses(background, archetype, synergy);

  return {
    background,
    archetype,
    synergy,
    bonuses,
    startingSkill: archetype.startingSkill,
    skillDiscountCategory: archetype.skillDiscountCategory,
    skillDiscountPercent: 15, // Always 15% as per FINAL spec
  };
}

/**
 * Get passive bonus display string for a background
 */
export function getPassiveBonus(background: GMBackground): string {
  return background.passiveBonus;
}

/**
 * Get synergy bonus display string for an archetype
 */
export function getSynergyBonusText(archetype: GMArchetype): string {
  return archetype.synergyBonus;
}

/**
 * Check if selecting this archetype would trigger synergy with the current background
 */
export function wouldTriggerSynergy(
  background: GMBackground,
  archetype: GMArchetype
): boolean {
  return background.bestArchetype === archetype.id;
}

/**
 * Get the recommended archetype for a background (the one that triggers synergy)
 */
export function getRecommendedArchetype(background: GMBackground): GMArchetypeId {
  return background.bestArchetype;
}
