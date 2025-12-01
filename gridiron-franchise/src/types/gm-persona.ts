// GM Persona Types
// Defines all types for the GM Persona Creation system

// Background type identifiers
export type GMBackgroundId =
  | "former_player"
  | "analytics_expert"
  | "college_scout"
  | "coaching_tree"
  | "agent_specialist"
  | "media_insider";

// Archetype type identifiers
export type GMArchetypeId =
  | "scout_guru"
  | "cap_wizard"
  | "trade_shark"
  | "player_developer"
  | "win_now_executive"
  | "motivator";

// Synergy type identifiers
export type GMSynergyId =
  | "the_mentor"
  | "the_moneyball"
  | "the_draft_whisperer"
  | "the_dealmaker"
  | "the_academy"
  | "the_insider"
  | "the_closer"
  | "the_optimizer";

// Skill category for discounts
export type SkillCategory =
  | "scouting_draft"
  | "contracts_money"
  | "trades"
  | "player_development"
  | "team_management";

// Starting skill definition
export interface GMSkill {
  name: string;
  tier: "Bronze" | "Silver" | "Gold";
  description: string;
}

// Background definition
export interface GMBackground {
  id: GMBackgroundId;
  name: string;
  icon: string;
  description: string;
  bonuses: string[];
  weakness: string;
  bestPairedWith: string[];
}

// Archetype definition
export interface GMArchetype {
  id: GMArchetypeId;
  name: string;
  icon: string;
  philosophy: string;
  description: string;
  bonuses: string[];
  skill: GMSkill;
  skillDiscountCategory: SkillCategory;
  recommendedFor: string;
}

// Synergy definition
export interface GMSynergy {
  id: GMSynergyId;
  name: string;
  backgroundId: GMBackgroundId;
  archetypeId: GMArchetypeId;
  bonus: string;
}

// Calculated bonuses for a GM persona
export interface GMBonuses {
  scoutingAccuracy: number;
  contractNegotiation: number;
  tradeAcceptance: number;
  playerDevelopment: number;
  playerTrust: number;
  teamMorale: number;
  capSpace: number;
  ownerPatience: number;
}

// Complete GM persona combining background, archetype, and optional synergy
export interface GMPersona {
  background: GMBackground;
  archetype: GMArchetype;
  synergy: GMSynergy | null;
  bonuses: GMBonuses;
  startingSkill: GMSkill;
  skillDiscountCategory: SkillCategory;
  skillDiscountPercent: number;
}

// Synergy key for lookup (format: backgroundId_archetypeId)
export type SynergyKey = `${GMBackgroundId}_${GMArchetypeId}`;
