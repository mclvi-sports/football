/**
 * Coaching Staff System Types
 *
 * Types for the coaching staff following FINAL-coaching-staff-system.md
 * Schemes are imported from the separate schemes module.
 */

import {
  OffensiveScheme,
  DefensiveScheme,
  STPhilosophy,
} from '../schemes/types';

// Re-export scheme types for convenience
export type { OffensiveScheme, DefensiveScheme, STPhilosophy };

// ============================================================================
// COACH POSITIONS & CORE TYPES
// ============================================================================

export type CoachPosition = 'HC' | 'OC' | 'DC' | 'STC';

export type CoachPhilosophy = 'aggressive' | 'balanced' | 'conservative' | 'innovative';

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
  | 'players_coach';

export type OCPerkId =
  | 'qb_whisperer'
  | 'red_zone_specialist'
  | 'tempo_tactician'
  | 'run_game_architect'
  | 'passing_guru'
  | 'play_designer';

export type DCPerkId =
  | 'turnover_machine'
  | 'pass_rush_specialist'
  | 'coverage_master'
  | 'run_stuffer'
  | 'blitz_master'
  | 'bend_dont_break';

export type STPerkId =
  | 'leg_whisperer'
  | 'return_specialist'
  | 'coverage_ace'
  | 'situational_genius';

export type PerkId = HCPerkId | OCPerkId | DCPerkId | STPerkId;

// ============================================================================
// COACH ATTRIBUTES
// ============================================================================

export interface BaseCoachAttributes {
  schemeMastery: number; // 60-99
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
  mediaHandling: number; // 60-99
}

export interface OCAttributes extends BaseCoachAttributes {
  playCalling: number; // 60-99
  redZoneOffense: number; // 60-99
  qbDevelopment: number; // 60-99
  tempoControl: number; // 60-99
  creativity: number; // 60-99
}

export interface DCAttributes extends BaseCoachAttributes {
  playCalling: number; // 60-99
  redZoneDefense: number; // 60-99
  turnoverCreation: number; // 60-99
  blitzDesign: number; // 60-99
  coverageDisguise: number; // 60-99
}

export interface STCAttributes extends BaseCoachAttributes {
  kickingGame: number; // 60-99
  returnGame: number; // 60-99
  coverageUnits: number; // 60-99
  situational: number; // 60-99
  gunnerDevelopment: number; // 60-99
}

export type CoachAttributes = HCAttributes | OCAttributes | DCAttributes | STCAttributes;

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

  // Scheme preferences - position-specific
  offensiveScheme?: OffensiveScheme; // HC & OC have this
  defensiveScheme?: DefensiveScheme; // HC & DC have this
  stPhilosophy?: STPhilosophy; // STC has this

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
  avgSTCRating: number;
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
    specialTeams: Record<STPhilosophy, number>;
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
    effects: {
      1: '+10% team morale',
      2: '+20% team morale',
      3: '+30% team morale, team never gives up',
    },
  },
  genius_mind: {
    name: 'Genius Mind',
    effects: {
      1: '+2 AWR to all players',
      2: '+4 AWR to all players',
      3: '+6 AWR to all players, perfect game plans',
    },
  },
  disciplinarian: {
    name: 'Disciplinarian',
    effects: {
      1: '-25% team penalties',
      2: '-50% team penalties',
      3: '-75% team penalties, no personal fouls',
    },
  },
  winners_mentality: {
    name: "Winner's Mentality",
    effects: {
      1: '+2 OVR in playoff games',
      2: '+4 OVR in playoff games',
      3: '+6 OVR in playoff games, clutch bonus',
    },
  },
  clock_master: {
    name: 'Clock Master',
    effects: {
      1: 'Better timeout usage, +1 challenge/game',
      2: 'Optimal 2-minute drill, +2 challenges',
      3: 'Perfect clock management, auto-win ties',
    },
  },
  players_coach: {
    name: "Players' Coach",
    effects: {
      1: '+5% player loyalty, -10% holdouts',
      2: '+10% loyalty, -25% holdouts',
      3: '+20% loyalty, players take discounts',
    },
  },
};

export const OC_PERKS: Record<OCPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  qb_whisperer: {
    name: 'QB Whisperer',
    effects: {
      1: '+25% QB XP gain',
      2: '+50% QB XP gain, +2 QB OVR',
      3: '+75% QB XP gain, +4 QB OVR, unlocks potential',
    },
  },
  red_zone_specialist: {
    name: 'Red Zone Specialist',
    effects: {
      1: '+10% red zone TD rate',
      2: '+20% red zone TD rate',
      3: '+30% red zone TD rate, goal line package',
    },
  },
  tempo_tactician: {
    name: 'Tempo Tactician',
    effects: {
      1: 'No-huddle +5% efficiency',
      2: 'No-huddle +10%, defense fatigues faster',
      3: 'No-huddle +15%, hurry-up mastery',
    },
  },
  run_game_architect: {
    name: 'Run Game Architect',
    effects: {
      1: '+0.3 YPC team average',
      2: '+0.6 YPC, +25% RB XP',
      3: '+1.0 YPC, elite run blocking bonus',
    },
  },
  passing_guru: {
    name: 'Passing Guru',
    effects: {
      1: '+3% completion rate',
      2: '+5% completion, +25% WR/TE XP',
      3: '+8% completion, deep ball specialist',
    },
  },
  play_designer: {
    name: 'Play Designer',
    effects: {
      1: '+10% trick play success',
      2: '+20% trick plays, unique formations',
      3: '+30% trick plays, unpredictable offense',
    },
  },
};

export const DC_PERKS: Record<DCPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  turnover_machine: {
    name: 'Turnover Machine',
    effects: {
      1: '+10% turnover chance',
      2: '+20% turnover chance',
      3: '+30% turnover chance, strip specialist',
    },
  },
  pass_rush_specialist: {
    name: 'Pass Rush Specialist',
    effects: {
      1: '+2 to all pass rush moves',
      2: '+4 pass rush, +25% DE/DT XP',
      3: '+6 pass rush, blitz packages elite',
    },
  },
  coverage_master: {
    name: 'Coverage Master',
    effects: {
      1: '+2 to all coverage ratings',
      2: '+4 coverage, +25% CB/S XP',
      3: '+6 coverage, shutdown ability',
    },
  },
  run_stuffer: {
    name: 'Run Stuffer',
    effects: {
      1: '-0.3 opponent YPC',
      2: '-0.6 YPC, +25% LB XP',
      3: '-1.0 YPC, goal line stand specialist',
    },
  },
  blitz_master: {
    name: 'Blitz Master',
    effects: {
      1: '+15% blitz success rate',
      2: '+25% blitz success, disguised looks',
      3: '+35% blitz success, chaos defense',
    },
  },
  bend_dont_break: {
    name: "Bend Don't Break",
    effects: {
      1: '-10% opponent red zone TD rate',
      2: '-20% red zone TDs, force FGs',
      3: '-30% red zone TDs, goal line elite',
    },
  },
};

export const STC_PERKS: Record<STPerkId, { name: string; effects: Record<PerkTier, string> }> = {
  leg_whisperer: {
    name: 'Leg Whisperer',
    effects: {
      1: '+3 to K/P ratings',
      2: '+5 K/P ratings, clutch kicking',
      3: '+8 K/P ratings, ice-proof kickers',
    },
  },
  return_specialist: {
    name: 'Return Specialist',
    effects: {
      1: '+5 return yards average',
      2: '+10 return yards, +2% return TD',
      3: '+15 return yards, +5% return TD',
    },
  },
  coverage_ace: {
    name: 'Coverage Ace',
    effects: {
      1: '-5 opponent return yards',
      2: '-10 return yards, +25% ST tackles',
      3: '-15 return yards, elite gunners',
    },
  },
  situational_genius: {
    name: 'Situational Genius',
    effects: {
      1: '+15% fake punt/FG success',
      2: '+25% fakes, +10% onside kick',
      3: '+35% fakes, +20% onside, surprise plays',
    },
  },
};

// Salary ranges by OVR (in millions)
export const HC_SALARY_RANGES: Record<string, [number, number]> = {
  '95-99': [12, 15],
  '90-94': [9, 12],
  '85-89': [6, 9],
  '80-84': [4, 6],
  '75-79': [2, 4],
  '70-74': [1, 2],
  '60-69': [0.5, 1],
};

export const COORDINATOR_SALARY_RANGES: Record<string, { OC: [number, number]; DC: [number, number]; STC: [number, number] }> = {
  '90-99': { OC: [6, 8], DC: [6, 8], STC: [2, 3] },
  '85-89': { OC: [4, 6], DC: [4, 6], STC: [1.5, 2] },
  '80-84': { OC: [2.5, 4], DC: [2.5, 4], STC: [1, 1.5] },
  '75-79': { OC: [1.5, 2.5], DC: [1.5, 2.5], STC: [0.8, 1] },
  '70-74': { OC: [0.8, 1.5], DC: [0.8, 1.5], STC: [0.5, 0.8] },
  '60-69': { OC: [0.5, 0.8], DC: [0.5, 0.8], STC: [0.3, 0.5] },
};
