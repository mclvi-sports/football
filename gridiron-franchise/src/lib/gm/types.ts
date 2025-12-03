// ============================================================================
// GM TYPES
// ============================================================================

/**
 * GM Background - Career history providing permanent passive bonuses
 */
export type GMBackground =
  | 'scout'        // Former scouting director
  | 'cap_analyst'  // Salary cap expert
  | 'coach'        // Former coordinator/HC
  | 'agent'        // Former player agent
  | 'analytics'    // Data-driven executive
  | 'legacy';      // Family football dynasty

/**
 * GM Archetype - Management style with starting skill
 */
export type GMArchetype =
  | 'builder'        // Draft and develop
  | 'closer'         // Win now, big moves
  | 'economist'      // Cap efficiency
  | 'talent_scout'   // Find hidden gems
  | 'culture_builder' // Team chemistry
  | 'innovator';     // Analytics edge

/**
 * GM Bonuses - Calculated from background + archetype + synergy
 */
export interface GMBonuses {
  scoutingAccuracy: number;    // % bonus to prospect evaluation
  contractDemands: number;     // % reduction in player salary demands
  tradeAcceptance: number;     // % bonus to CPU trade acceptance
  playerDevelopment: number;   // % bonus to young player XP
  freeAgentAppeal: number;     // % bonus to FA preference
  teamMorale: number;          // % bonus to morale floor
  capSpace: number;            // Bonus cap space in millions
  ownerPatience: number;       // Bonus years before hot seat
  coachAppeal: number;         // % bonus to hire elite coaches
  fanLoyalty: number;          // % bonus to fan satisfaction
  sleepersPerDraft: number;    // Extra sleeper prospects revealed
}

/**
 * GM Contract
 */
export interface GMContract {
  years: number;
  salary: number;  // In millions
}

/**
 * GM - General Manager for a team
 */
export interface GM {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  background: GMBackground;
  archetype: GMArchetype;
  hasSynergy: boolean;
  bonuses: GMBonuses;
  age: number;
  experience: number;  // Years as GM
  contract: GMContract;
  isPlayer: boolean;   // true = user's GM, false = CPU GM
}

/**
 * League GMs - All GMs in the league (Player GM mode)
 */
export interface LeagueGMs {
  playerTeamId: string;
  playerGM: GM;
  cpuGMs: Record<string, GM>;  // teamId -> GM (excludes player team)
  generatedAt: string;
}

/**
 * Owner Mode GMs - All 32 GMs are CPU-generated (Owner model)
 * User picks team after generation, inherits pre-assigned GM
 */
export interface OwnerModeGMs {
  mode: 'owner';
  allGMs: Record<string, GM>;  // all 32 teams
  playerTeamId: string | null; // set when user picks team
  generatedAt: string;
}

/**
 * Background Definition - For UI and generation
 */
export interface BackgroundDefinition {
  id: GMBackground;
  name: string;
  description: string;
  bonuses: Partial<GMBonuses>;
  synergyArchetype: GMArchetype;
}

/**
 * Archetype Definition - For UI and generation
 */
export interface ArchetypeDefinition {
  id: GMArchetype;
  name: string;
  philosophy: string;
  startingSkill: string;
  bonuses: Partial<GMBonuses>;
  synergyBackground: GMBackground;
}

/**
 * Synergy Definition - Bonus when background + archetype align
 */
export interface SynergyDefinition {
  background: GMBackground;
  archetype: GMArchetype;
  name: string;
  description: string;
  bonuses: Partial<GMBonuses>;
}
