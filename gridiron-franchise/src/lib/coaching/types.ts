/**
 * Coaching Staff System Types
 *
 * Types for the coaching staff following FINAL-coaching-staff-system.md
 */

// ============================================================================
// COACH POSITIONS & CORE TYPES
// ============================================================================

export type CoachPosition = 'HC' | 'OC' | 'DC' | 'ST';

export type CoachPhilosophy = 'aggressive' | 'balanced' | 'conservative';

// ============================================================================
// SCHEMES
// ============================================================================

export type OffensiveScheme =
  | 'west_coast'
  | 'spread'
  | 'pro_style'
  | 'air_raid'
  | 'power_run'
  | 'zone_run';

export type DefensiveScheme =
  | '4-3_base'
  | '3-4_base'
  | 'cover_2'
  | 'cover_3'
  | 'man_blitz'
  | 'zone_blitz';

export type SpecialTeamsScheme = 'aggressive_returns' | 'conservative' | 'coverage_specialist';

export type CoachScheme = OffensiveScheme | DefensiveScheme | SpecialTeamsScheme;

// ============================================================================
// SCHEME DETAILS
// ============================================================================

export interface SchemeInfo {
  id: string;
  name: string;
  philosophy: string;
  bestFor: string;
  bonuses: string[];
  penalties: string[];
}

export const OFFENSIVE_SCHEMES: Record<OffensiveScheme, SchemeInfo> = {
  west_coast: {
    id: 'west_coast',
    name: 'West Coast',
    philosophy: 'Short timing passes',
    bestFor: 'Accurate QBs, possession WRs',
    bonuses: ['+3 Short Acc', '+2 Short RR'],
    penalties: ['-2 Deep Acc'],
  },
  spread: {
    id: 'spread',
    name: 'Spread',
    philosophy: 'Space defense, fast tempo',
    bestFor: 'Mobile QBs, fast WRs',
    bonuses: ['+3 Speed', '+2 Route Running'],
    penalties: ['-2 Run Block'],
  },
  pro_style: {
    id: 'pro_style',
    name: 'Pro Style',
    philosophy: 'Balanced run/pass',
    bestFor: 'Pocket QBs, power RBs',
    bonuses: ['+2 all offensive'],
    penalties: [],
  },
  air_raid: {
    id: 'air_raid',
    name: 'Air Raid',
    philosophy: 'Vertical passing',
    bestFor: 'Strong arms, deep threats',
    bonuses: ['+4 Deep Acc', '+3 Deep RR'],
    penalties: ['-3 Run Block', '-2 Carry'],
  },
  power_run: {
    id: 'power_run',
    name: 'Power Run',
    philosophy: 'Physical downhill',
    bestFor: 'Power RBs, strong OL',
    bonuses: ['+4 Truck', '+3 Run Block', '+2 STR'],
    penalties: ['-3 all passing'],
  },
  zone_run: {
    id: 'zone_run',
    name: 'Zone Run',
    philosophy: 'Outside zone, misdirection',
    bestFor: 'Elusive RBs, athletic OL',
    bonuses: ['+4 Elusive', '+3 AGI', '+2 Vision'],
    penalties: ['-2 Trucking'],
  },
};

export const DEFENSIVE_SCHEMES: Record<DefensiveScheme, SchemeInfo> = {
  '4-3_base': {
    id: '4-3_base',
    name: '4-3 Base',
    philosophy: 'Four DL, three LBs',
    bestFor: 'Strong DL, versatile LBs',
    bonuses: ['+3 DL pass rush', '+2 LB tackle'],
    penalties: ['-2 DB coverage'],
  },
  '3-4_base': {
    id: '3-4_base',
    name: '3-4 Base',
    philosophy: 'Three DL, four LBs',
    bestFor: 'Big DL, rush OLBs',
    bonuses: ['+3 OLB rush', '+2 flexibility'],
    penalties: ['-2 DL run stop'],
  },
  cover_2: {
    id: 'cover_2',
    name: 'Cover 2',
    philosophy: 'Two deep safeties',
    bestFor: 'Fast safeties, zone CBs',
    bonuses: ['+4 Zone', '+3 deep defense'],
    penalties: ['-3 Man', 'weak intermediate'],
  },
  cover_3: {
    id: 'cover_3',
    name: 'Cover 3',
    philosophy: 'Three deep zones',
    bestFor: 'Ball-hawk DBs',
    bonuses: ['+3 Zone', '+2 INTs'],
    penalties: ['-2 run defense'],
  },
  man_blitz: {
    id: 'man_blitz',
    name: 'Man Blitz',
    philosophy: 'Aggressive man + pressure',
    bestFor: 'Lockdown CBs, rushers',
    bonuses: ['+5 Man', '+4 pass rush'],
    penalties: ['-4 Zone', 'big play risk'],
  },
  zone_blitz: {
    id: 'zone_blitz',
    name: 'Zone Blitz',
    philosophy: 'Disguised pressure',
    bestFor: 'Smart LBs, versatile DL',
    bonuses: ['+3 Play Rec', '+3 Blitz'],
    penalties: ['-2 Man'],
  },
};

export const ST_SCHEMES: Record<SpecialTeamsScheme, SchemeInfo> = {
  aggressive_returns: {
    id: 'aggressive_returns',
    name: 'Aggressive Returns',
    philosophy: 'Return everything',
    bestFor: 'Dynamic returners',
    bonuses: ['+5 return yards', '+3% TD chance'],
    penalties: ['+2% turnover risk'],
  },
  conservative: {
    id: 'conservative',
    name: 'Conservative',
    philosophy: 'Fair catch often',
    bestFor: 'Safe ball handling',
    bonuses: ['-3% turnover risk'],
    penalties: ['-5 return yards'],
  },
  coverage_specialist: {
    id: 'coverage_specialist',
    name: 'Coverage Specialist',
    philosophy: 'Elite coverage',
    bestFor: 'Fast gunners',
    bonuses: ['-10 opponent return yards'],
    penalties: [],
  },
};

// ============================================================================
// PERKS
// ============================================================================

export type PerkTier = 1 | 2 | 3;

export interface Perk {
  id: string;
  name: string;
  tier: PerkTier;
  effect: string;
}

export type HCPerkId =
  | 'motivator'
  | 'genius_mind'
  | 'disciplinarian'
  | 'winners_mentality'
  | 'clock_master'
  | 'rebuild_specialist';

export type OCPerkId =
  | 'qb_whisperer'
  | 'run_game_specialist'
  | 'passing_game_guru'
  | 'red_zone_maestro'
  | 'tempo_controller'
  | 'creative_play_caller';

export type DCPerkId =
  | 'defensive_genius'
  | 'turnover_creator'
  | 'blitz_master'
  | 'run_stopper'
  | 'coverage_specialist'
  | 'db_developer';

export type STPerkId =
  | 'kicking_coach'
  | 'return_specialist'
  | 'coverage_expert'
  | 'field_position_master';

export type PerkId = HCPerkId | OCPerkId | DCPerkId | STPerkId;

// ============================================================================
// COACH ATTRIBUTES
// ============================================================================

export interface BaseCoachAttributes {
  schemeKnowledge: number; // 60-99
  playerDevelopment: number; // 60-99
  motivation: number; // 60-99
  gamePlanning: number; // 60-99
  adaptability: number; // 60-99
}

export interface HCAttributes extends BaseCoachAttributes {
  leadership: number; // 60-99
  clockManagement: number; // 60-99
  challengeSuccess: number; // 60-99
  discipline: number; // 60-99
  offensiveKnowledge: number; // 60-99
  defensiveKnowledge: number; // 60-99
}

export interface OCAttributes extends BaseCoachAttributes {
  playCalling: number; // 60-99
  redZoneOffense: number; // 60-99
  qbDevelopment: number; // 60-99
}

export interface DCAttributes extends BaseCoachAttributes {
  playCalling: number; // 60-99
  redZoneDefense: number; // 60-99
  turnoverCreation: number; // 60-99
}

export interface STAttributes extends BaseCoachAttributes {
  kickingGame: number; // 60-99
  returnGame: number; // 60-99
  coverageUnits: number; // 60-99
}

export type CoachAttributes = HCAttributes | OCAttributes | DCAttributes | STAttributes;

// ============================================================================
// CONTRACT
// ============================================================================

export interface CoachContract {
  salary: number; // Annual salary in millions
  yearsTotal: number;
  yearsRemaining: number;
  guaranteedRemaining: number; // millions
}

// ============================================================================
// COACH
// ============================================================================

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  position: CoachPosition;
  age: number;
  experience: number; // Years as a coach
  ovr: number; // 60-99
  attributes: CoachAttributes;
  scheme: CoachScheme;
  philosophy: CoachPhilosophy;
  perks: Perk[];
  contract: CoachContract;
  xp: number;
  retirementRisk: number; // 0-100 percentage
}

// ============================================================================
// TEAM COACHING STAFF
// ============================================================================

export interface CoachingStaff {
  teamId: string;
  headCoach: Coach;
  offensiveCoordinator: Coach;
  defensiveCoordinator: Coach;
  specialTeamsCoordinator: Coach;
  totalSalary: number; // Combined annual salary
  staffChemistry: number; // 0-100
  avgOvr: number;
}

// ============================================================================
// LEAGUE COACHING
// ============================================================================

export interface LeagueCoaching {
  teams: Record<string, CoachingStaff>;
  generatedAt: string;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface CoachingStats {
  avgHCRating: number;
  avgOCRating: number;
  avgDCRating: number;
  avgSTRating: number;
  avgOverallRating: number;
  eliteCoaches: number; // 90+
  greatCoaches: number; // 85-89
  goodCoaches: number; // 80-84
  averageCoaches: number; // 75-79
  belowAverageCoaches: number; // 70-74
  poorCoaches: number; // 60-69
  totalSalaries: number;
  avgTeamSalary: number;
  schemeDistribution: {
    offensive: Record<OffensiveScheme, number>;
    defensive: Record<DefensiveScheme, number>;
    specialTeams: Record<SpecialTeamsScheme, number>;
  };
  topHCs: { teamId: string; name: string; ovr: number }[];
  bottomHCs: { teamId: string; name: string; ovr: number }[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PERK_XP_COSTS: Record<PerkTier, number> = {
  1: 1000,
  2: 3000,
  3: 7000,
};

export const HC_PERKS: Record<HCPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  motivator: {
    name: 'Motivator',
    effects: { 1: '+10% morale', 2: '+20% morale', 3: '+30% morale, never quit' },
  },
  genius_mind: {
    name: 'Genius Mind',
    effects: { 1: '+2 AWR all', 2: '+4 AWR all', 3: '+6 AWR, perfect game plans' },
  },
  disciplinarian: {
    name: 'Disciplinarian',
    effects: { 1: '-25% penalties', 2: '-50% penalties', 3: '-75% penalties' },
  },
  winners_mentality: {
    name: "Winner's Mentality",
    effects: { 1: '+2 playoff OVR', 2: '+3 playoff OVR', 3: '+5 playoff OVR' },
  },
  clock_master: {
    name: 'Clock Master',
    effects: { 1: '+20% timeout efficiency', 2: '+40%, better 2-min', 3: 'Perfect clock management' },
  },
  rebuild_specialist: {
    name: 'Rebuild Specialist',
    effects: { 1: '+10% young dev', 2: '+25% young dev', 3: '+50% young dev' },
  },
};

export const OC_PERKS: Record<OCPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  qb_whisperer: {
    name: 'QB Whisperer',
    effects: { 1: '+25% QB dev', 2: '+50% QB dev', 3: '+100% QB dev' },
  },
  run_game_specialist: {
    name: 'Run Game Specialist',
    effects: { 1: '+3 RB/OL run', 2: '+5 RB/OL run', 3: '+8 RB/OL run' },
  },
  passing_game_guru: {
    name: 'Passing Game Guru',
    effects: { 1: '+3 passing', 2: '+5 passing', 3: '+8 passing' },
  },
  red_zone_maestro: {
    name: 'Red Zone Maestro',
    effects: { 1: '+5 RZ offense', 2: '+8 RZ offense', 3: '+12 RZ, 90%+ TD' },
  },
  tempo_controller: {
    name: 'Tempo Controller',
    effects: { 1: '+10% no-huddle', 2: '+20%, tires D', 3: '+30%, no subs' },
  },
  creative_play_caller: {
    name: 'Creative Play Caller',
    effects: { 1: '10 trick plays', 2: '20 tricks, +10%', 3: '30 tricks, +25%' },
  },
};

export const DC_PERKS: Record<DCPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  defensive_genius: {
    name: 'Defensive Genius',
    effects: { 1: '+3 all defense', 2: '+5 all defense', 3: '+8 all, top 5 D' },
  },
  turnover_creator: {
    name: 'Turnover Creator',
    effects: { 1: '+25% TO chance', 2: '+50% TO chance', 3: '+75% TO, 3+/game' },
  },
  blitz_master: {
    name: 'Blitz Master',
    effects: { 1: '+3 blitz rush', 2: '+5 blitz rush', 3: '+8 blitz, 5+ sacks' },
  },
  run_stopper: {
    name: 'Run Stopper',
    effects: { 1: '+3 run defense', 2: '+5 run defense', 3: '+8 run, <75 yards' },
  },
  coverage_specialist: {
    name: 'Coverage Specialist',
    effects: { 1: '+3 coverage', 2: '+5 coverage', 3: '+8 coverage, lockdown' },
  },
  db_developer: {
    name: 'DB Developer',
    effects: { 1: '+25% DB dev', 2: '+50% DB dev', 3: '+100% DB dev' },
  },
};

export const ST_PERKS: Record<STPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  kicking_coach: {
    name: 'Kicking Coach',
    effects: { 1: '+3 K/P', 2: '+5 K/P', 3: '+8 K/P, 95%+ FG' },
  },
  return_specialist: {
    name: 'Return Specialist',
    effects: { 1: '+5 return yards', 2: '+10 yards', 3: '+15 yards, TD every 3 games' },
  },
  coverage_expert: {
    name: 'Coverage Expert',
    effects: { 1: '-5 opp yards', 2: '-10 opp yards', 3: '-15 yards, no ST scores' },
  },
  field_position_master: {
    name: 'Field Position Master',
    effects: { 1: '+3 avg position', 2: '+5 avg position', 3: '+8 position' },
  },
};

// Salary ranges by OVR (in millions)
export const HC_SALARY_RANGES: Record<string, [number, number]> = {
  '95-99': [12, 15],
  '90-94': [10, 12],
  '85-89': [8, 10],
  '80-84': [6, 8],
  '75-79': [4, 6],
  '70-74': [2, 4],
  '60-69': [1, 2],
};

export const COORDINATOR_SALARY_RANGES: Record<string, { OC: [number, number]; DC: [number, number]; ST: [number, number] }> = {
  '90-99': { OC: [4, 6], DC: [4, 6], ST: [2, 3] },
  '85-89': { OC: [3, 4], DC: [3, 4], ST: [1.5, 2] },
  '80-84': { OC: [2, 3], DC: [2, 3], ST: [1, 1.5] },
  '75-79': { OC: [1.5, 2], DC: [1.5, 2], ST: [0.8, 1] },
  '70-74': { OC: [1, 1.5], DC: [1, 1.5], ST: [0.6, 0.8] },
  '60-69': { OC: [0.5, 1], DC: [0.5, 1], ST: [0.4, 0.6] },
};
