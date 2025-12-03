// GM Persona Types
// Aligned with FINAL-gm-skills-perks-system.md specification

// Background type identifiers (from FINAL spec Part 1)
export type GMBackgroundId =
  | 'scout'
  | 'cap_analyst'
  | 'coach'
  | 'agent'
  | 'analytics'
  | 'legacy';

// Archetype type identifiers (from FINAL spec Part 1)
export type GMArchetypeId =
  | 'the_builder'
  | 'the_closer'
  | 'the_economist'
  | 'the_talent_scout'
  | 'the_culture_builder'
  | 'the_innovator';

// Synergy occurs when background + archetype align (1:1 mapping)
export type GMSynergyId =
  | 'scout_talent_scout'
  | 'cap_analyst_economist'
  | 'coach_builder'
  | 'agent_closer'
  | 'analytics_innovator'
  | 'legacy_culture_builder';

// Skill category for discounts and organization
export type SkillCategory =
  | 'scouting_draft'
  | 'contracts_money'
  | 'trades'
  | 'player_development'
  | 'team_management'
  | 'coaching_staff'
  | 'facilities_operations'
  | 'meta_qol';

// Skill tier levels
export type SkillTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

// Starting skill definition
export interface GMSkill {
  id: string;
  name: string;
  tier: SkillTier;
  description: string;
  category: SkillCategory;
}

// Background definition (from FINAL spec)
export interface GMBackground {
  id: GMBackgroundId;
  name: string;
  icon: string;
  description: string;
  passiveBonus: string; // Single passive bonus as per FINAL spec
  bestArchetype: GMArchetypeId; // The archetype that triggers synergy
}

// Archetype definition (from FINAL spec)
export interface GMArchetype {
  id: GMArchetypeId;
  name: string;
  icon: string;
  philosophy: string;
  description: string;
  startingSkill: GMSkill;
  synergyBonus: string; // Bonus when paired with matching background
  skillDiscountCategory: SkillCategory;
  recommendedFor: string;
}

// Synergy definition (1:1 mapping from FINAL spec)
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
  faAppeal: number;
  teamMorale: number;
  capSpace: number; // in millions
  ownerPatience: number;
  coachAppeal: number;
  fanLoyalty: number;
}

// Complete GM persona combining background, archetype, and optional synergy
export interface GMPersona {
  background: GMBackground;
  archetype: GMArchetype;
  synergy: GMSynergy | null;
  bonuses: GMBonuses;
  startingSkill: GMSkill;
  skillDiscountCategory: SkillCategory;
  skillDiscountPercent: number; // Always 15% as per spec
}

// Synergy key for lookup (format: backgroundId_archetypeId)
export type SynergyKey = `${GMBackgroundId}_${GMArchetypeId}`;
