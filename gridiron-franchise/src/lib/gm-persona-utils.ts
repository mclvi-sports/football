import type {
  GMArchetype,
  GMArchetypeId,
  GMBackground,
  GMBackgroundId,
  GMBonuses,
  GMPersona,
  GMSynergy,
  SynergyKey,
} from "@/types/gm-persona";
import { synergyMap } from "@/data/gm-personas";

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
    playerTrust: 0,
    teamMorale: 0,
    capSpace: 0,
    ownerPatience: 0,
  };
}

/**
 * Calculate combined bonuses for a GM persona
 * Note: This is a simplified version - actual values would need game balancing
 */
export function calculateBonuses(
  background: GMBackground,
  archetype: GMArchetype,
  synergy: GMSynergy | null
): GMBonuses {
  const bonuses = getDefaultBonuses();

  // Apply background bonuses (simplified mapping)
  switch (background.id) {
    case "former_player":
      bonuses.playerTrust += 15;
      bonuses.teamMorale += 10;
      bonuses.ownerPatience -= 10;
      break;
    case "analytics_expert":
      bonuses.scoutingAccuracy += 20;
      bonuses.playerTrust -= 10;
      break;
    case "college_scout":
      bonuses.scoutingAccuracy += 25;
      break;
    case "coaching_tree":
      bonuses.playerDevelopment += 15;
      bonuses.contractNegotiation -= 10;
      break;
    case "agent_specialist":
      bonuses.contractNegotiation += 20;
      bonuses.scoutingAccuracy -= 10;
      break;
    case "media_insider":
      bonuses.tradeAcceptance += 15;
      bonuses.scoutingAccuracy -= 15;
      break;
  }

  // Apply archetype bonuses
  switch (archetype.id) {
    case "scout_guru":
      bonuses.scoutingAccuracy += 10;
      break;
    case "cap_wizard":
      bonuses.capSpace += 5000000;
      bonuses.contractNegotiation += 10;
      break;
    case "trade_shark":
      bonuses.tradeAcceptance += 10;
      break;
    case "player_developer":
      bonuses.playerDevelopment += 20;
      break;
    case "win_now_executive":
      bonuses.teamMorale += 20;
      break;
    case "motivator":
      bonuses.teamMorale += 25;
      bonuses.playerTrust += 10;
      break;
  }

  // Apply synergy bonuses
  if (synergy) {
    switch (synergy.id) {
      case "the_mentor":
        bonuses.playerDevelopment += 10;
        break;
      case "the_moneyball":
        bonuses.scoutingAccuracy += 10;
        break;
      case "the_draft_whisperer":
        bonuses.scoutingAccuracy += 10;
        break;
      case "the_dealmaker":
        bonuses.contractNegotiation += 10;
        break;
      case "the_academy":
        bonuses.playerDevelopment += 15;
        break;
      case "the_insider":
        bonuses.tradeAcceptance += 10;
        break;
      case "the_closer":
        bonuses.playerTrust += 10;
        break;
      case "the_optimizer":
        bonuses.capSpace += 2000000;
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
    startingSkill: archetype.skill,
    skillDiscountCategory: archetype.skillDiscountCategory,
    skillDiscountPercent: 15,
  };
}

/**
 * Get all strengths (bonuses) for display
 */
export function getAllStrengths(
  background: GMBackground,
  archetype: GMArchetype
): string[] {
  return [...archetype.bonuses, ...background.bonuses];
}

/**
 * Get all weaknesses for display
 */
export function getAllWeaknesses(background: GMBackground): string[] {
  return [background.weakness];
}
