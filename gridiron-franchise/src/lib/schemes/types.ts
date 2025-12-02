/**
 * Schemes System Types
 *
 * Defines all offensive, defensive, and special teams schemes.
 * Schemes are separate from coaches - coaches have scheme preferences,
 * but schemes themselves are system-wide definitions.
 *
 * Based on FINAL-schemes-system.md
 */

// ============================================================================
// SCHEME TYPES
// ============================================================================

export type OffensiveScheme =
  | 'west_coast'
  | 'spread'
  | 'pro_style'
  | 'air_raid'
  | 'power_run'
  | 'zone_run';

export type DefensiveScheme =
  | '4-3'
  | '3-4'
  | 'cover_2'
  | 'cover_3'
  | 'man_blitz'
  | 'zone_blitz';

export type STPhilosophy =
  | 'aggressive'
  | 'conservative'
  | 'coverage_specialist';

// ============================================================================
// SCHEME FIT SYSTEM
// ============================================================================

export type SchemeFit = 'perfect' | 'good' | 'neutral' | 'poor' | 'terrible';

export const SCHEME_FIT_MODIFIERS: Record<SchemeFit, number> = {
  perfect: 5,
  good: 2,
  neutral: 0,
  poor: -2,
  terrible: -5,
};

export const ADJUSTMENT_WEEKS = 4;

// ============================================================================
// SCHEME FAMILIES (for faster adjustment between similar schemes)
// ============================================================================

export const SCHEME_FAMILIES = {
  passing: ['west_coast', 'air_raid', 'spread'] as OffensiveScheme[],
  running: ['power_run', 'zone_run'] as OffensiveScheme[],
  balanced: ['pro_style'] as OffensiveScheme[],
  man_defense: ['man_blitz'] as DefensiveScheme[],
  zone_defense: ['cover_2', 'cover_3', 'zone_blitz'] as DefensiveScheme[],
  front_based: ['4-3', '3-4'] as DefensiveScheme[],
};

// ============================================================================
// ATTRIBUTE MODIFIER
// ============================================================================

export interface AttributeModifier {
  attribute: string;
  value: number;
  positions?: string[]; // If empty/undefined, applies to all
}

// ============================================================================
// PLAY TENDENCIES
// ============================================================================

export interface PlayTendencies {
  first_and_10: { pass: number; run: number };
  second_and_short: { pass: number; run: number };
  second_and_long: { pass: number; run: number };
  third_and_short: { pass: number; run: number };
  third_and_long: { pass: number; run: number };
  red_zone: { pass: number; run: number };
  goal_line: { pass: number; run: number };
}

export interface PassDistribution {
  short: number;  // 0-10 yards
  medium: number; // 10-20 yards
  deep: number;   // 20+ yards
}

// ============================================================================
// POSITION REQUIREMENT (for ideal personnel)
// ============================================================================

export interface PositionRequirement {
  position: string;
  idealArchetypes: string[];
  keyAttributes: string[];
  thresholds: {
    perfect: number;
    good: number;
    neutral: number;
    poor: number;
  };
}

// ============================================================================
// PERSONNEL PACKAGE (for defensive schemes)
// ============================================================================

export interface PersonnelPackage {
  name: string;
  personnel: string;
  usage: string;
}

// ============================================================================
// OFFENSIVE SCHEME DEFINITION
// ============================================================================

export interface OffensiveSchemeDefinition {
  id: OffensiveScheme;
  name: string;
  philosophy: string;
  playStyle: string;

  idealPersonnel: PositionRequirement[];

  attributeBonuses: AttributeModifier[];
  attributePenalties: AttributeModifier[];

  playCallingTendencies: PlayTendencies;
  passDistribution: PassDistribution;

  strongAgainst: DefensiveScheme[];
  weakAgainst: DefensiveScheme[];
}

// ============================================================================
// DEFENSIVE SCHEME DEFINITION
// ============================================================================

export interface DefensiveSchemeDefinition {
  id: DefensiveScheme;
  name: string;
  baseFormation: string;
  philosophy: string;

  idealPersonnel: PositionRequirement[];

  attributeBonuses: AttributeModifier[];
  attributePenalties: AttributeModifier[];

  personnelPackages: PersonnelPackage[];

  strongAgainst: OffensiveScheme[];
  weakAgainst: OffensiveScheme[];
}

// ============================================================================
// ST PHILOSOPHY DEFINITION
// ============================================================================

export interface STPhilosophyDefinition {
  id: STPhilosophy;
  name: string;
  focus: string;
  riskLevel: 'low' | 'medium' | 'high';

  bonuses: { effect: string; value: string }[];
  penalties: { effect: string; value: string }[];

  idealPersonnel: string[];
}

// ============================================================================
// PLAYER SCHEME FIT
// ============================================================================

export interface PlayerSchemeFit {
  playerId: string;
  schemeFits: {
    [schemeId: string]: {
      fit: SchemeFit;
      ovrModifier: number;
      adjustmentWeeksRemaining: number;
    };
  };
}

// ============================================================================
// ARCHETYPE SCHEME AFFINITY
// ============================================================================

export type ArchetypeSchemeAffinity = Record<string, Record<string, SchemeFit>>;

// ============================================================================
// SCHEME MATCHUP RESULT
// ============================================================================

export type SchemeMatchupResult =
  | 'strong_advantage'
  | 'slight_advantage'
  | 'neutral'
  | 'slight_disadvantage'
  | 'strong_disadvantage';

export const MATCHUP_MODIFIERS: Record<SchemeMatchupResult, number> = {
  strong_advantage: 5,
  slight_advantage: 2,
  neutral: 0,
  slight_disadvantage: -2,
  strong_disadvantage: -5,
};
