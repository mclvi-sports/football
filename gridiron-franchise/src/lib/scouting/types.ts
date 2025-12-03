/**
 * Scouting System Types
 *
 * Types for the scouting department following FINAL-scout-system.md
 */

// ============================================================================
// SCOUT ROLES & CORE TYPES
// ============================================================================

export type ScoutRole = 'director' | 'area' | 'pro' | 'national';

export type PositionExpertise = 'offensive' | 'defensive' | 'special_teams' | 'generalist';

export type RegionalExpertise = 'east_coast' | 'west_coast' | 'midwest' | 'south' | 'national';

// ============================================================================
// SCOUT ATTRIBUTES
// ============================================================================

export interface ScoutAttributes {
  talentEvaluation: number; // 60-99 - Accuracy of OVR assessment
  potentialAssessment: number; // 60-99 - Projecting player ceiling
  traitRecognition: number; // 60-99 - Identifying player traits
  bustDetection: number; // 60-99 - Identifying players likely to underperform
  sleeperDiscovery: number; // 60-99 - Finding hidden talent
  workEthic: number; // 60-99 - Coverage thoroughness
}

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

export type ScoutPerkId =
  | 'sharp_eye'
  | 'data_analyst'
  | 'trait_hunter'
  | 'red_flag_detector'
  | 'diamond_finder'
  | 'elite_evaluator'
  | 'future_sight'
  | 'mind_reader'
  | 'bust_buster'
  | 'hidden_gem_expert'
  | 'perfect_scout'
  | 'oracle'
  | 'psychologist'
  | 'bust_proof'
  | 'treasure_hunter'
  | 'college_connections'
  | 'pro_scout_expert'
  | 'raw_talent_spotter'
  | 'cerebral_scout'
  | 'speed_scout'
  | 'durability_expert';

// ============================================================================
// CONTRACT
// ============================================================================

export interface ScoutContract {
  salary: number; // Annual salary in millions
  yearsTotal: number;
  yearsRemaining: number;
}

// ============================================================================
// SCOUT
// ============================================================================

export interface Scout {
  id: string;
  firstName: string;
  lastName: string;
  role: ScoutRole;
  age: number;
  experience: number; // Years as a scout
  ovr: number; // 60-99
  attributes: ScoutAttributes;
  positionExpertise: PositionExpertise;
  regionalExpertise: RegionalExpertise;
  perks: Perk[];
  contract: ScoutContract;
  xp: number;
  weeklyPoints: number; // Calculated from work ethic
  retirementRisk: number; // 0-100 percentage
}

// ============================================================================
// SCOUTING DEPARTMENT
// ============================================================================

export interface ScoutingDepartment {
  teamId: string;
  director: Scout;
  areaScouts: Scout[]; // 0-2
  proScout: Scout | null; // 0-1
  nationalScout: Scout | null; // 0-1
  totalBudget: number; // Combined annual salary
  weeklyPoints: number; // Combined scouting points
  scoutCount: number;
  avgOvr: number;
}

// ============================================================================
// LEAGUE SCOUTING
// ============================================================================

export interface LeagueScouting {
  teams: Record<string, ScoutingDepartment>;
  generatedAt: string;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface ScoutingStats {
  avgDirectorRating: number;
  avgScoutRating: number;
  totalScouts: number;
  eliteScouts: number; // 90+
  greatScouts: number; // 85-89
  goodScouts: number; // 80-84
  averageScouts: number; // 75-79
  belowAverageScouts: number; // 70-74
  poorScouts: number; // 60-69
  totalSalaries: number;
  avgDepartmentBudget: number;
  avgWeeklyPoints: number;
  positionExpertiseDistribution: Record<PositionExpertise, number>;
  regionalExpertiseDistribution: Record<RegionalExpertise, number>;
  topDepartments: { teamId: string; avgOvr: number; weeklyPoints: number }[];
  bottomDepartments: { teamId: string; avgOvr: number; weeklyPoints: number }[];
}

// ============================================================================
// ROLE INFO
// ============================================================================

export interface RoleInfo {
  id: ScoutRole;
  name: string;
  description: string;
  required: boolean;
  maxPerTeam: number;
  bonus: string;
}

export const SCOUT_ROLES: Record<ScoutRole, RoleInfo> = {
  director: {
    id: 'director',
    name: 'Scouting Director',
    description: 'Lead all scouting operations',
    required: true,
    maxPerTeam: 1,
    bonus: '+5 to all department scouting',
  },
  area: {
    id: 'area',
    name: 'Area Scout',
    description: 'Cover specific college region',
    required: false,
    maxPerTeam: 2,
    bonus: '+15 in assigned region',
  },
  pro: {
    id: 'pro',
    name: 'Pro Scout',
    description: 'Evaluate free agents and trade targets',
    required: false,
    maxPerTeam: 1,
    bonus: '+20 to free agent scouting',
  },
  national: {
    id: 'national',
    name: 'National Scout',
    description: 'Generalist coverage',
    required: false,
    maxPerTeam: 1,
    bonus: 'No bonus or penalty',
  },
};

// ============================================================================
// EXPERTISE INFO
// ============================================================================

export interface ExpertiseInfo {
  id: PositionExpertise;
  name: string;
  positions: string;
  bonus: string;
  penalty: string;
}

export const POSITION_EXPERTISE: Record<PositionExpertise, ExpertiseInfo> = {
  offensive: {
    id: 'offensive',
    name: 'Offensive Specialist',
    positions: 'QB, RB, WR, TE, OL',
    bonus: '+10 offense',
    penalty: '-5 defense',
  },
  defensive: {
    id: 'defensive',
    name: 'Defensive Specialist',
    positions: 'DL, LB, DB',
    bonus: '+10 defense',
    penalty: '-5 offense',
  },
  special_teams: {
    id: 'special_teams',
    name: 'Special Teams Specialist',
    positions: 'K, P',
    bonus: '+15 specialists',
    penalty: '-5 others',
  },
  generalist: {
    id: 'generalist',
    name: 'Generalist',
    positions: 'All positions',
    bonus: 'None',
    penalty: 'None',
  },
};

export interface RegionInfo {
  id: RegionalExpertise;
  name: string;
  coverage: string;
  bonus: string;
}

export const REGIONAL_EXPERTISE: Record<RegionalExpertise, RegionInfo> = {
  east_coast: {
    id: 'east_coast',
    name: 'East Coast',
    coverage: 'ACC, Big Ten (East), SEC (East)',
    bonus: '+10 region, +5% sleeper',
  },
  west_coast: {
    id: 'west_coast',
    name: 'West Coast',
    coverage: 'Pac-12, Mountain West, Big 12 (West)',
    bonus: '+10 region, +5% sleeper',
  },
  midwest: {
    id: 'midwest',
    name: 'Midwest',
    coverage: 'Big Ten (West), Big 12 (Central)',
    bonus: '+10 region, +5% sleeper',
  },
  south: {
    id: 'south',
    name: 'South',
    coverage: 'SEC (West), ACC (South), C-USA',
    bonus: '+10 region, +5% sleeper',
  },
  national: {
    id: 'national',
    name: 'National',
    coverage: 'All regions',
    bonus: 'No bonus or penalty',
  },
};

// ============================================================================
// PERK DEFINITIONS
// ============================================================================

export const SCOUT_PERKS: Record<string, { name: string; tier: PerkTier; effect: string; requires?: string }> = {
  // Tier 1
  sharp_eye: { name: 'Sharp Eye', tier: 1, effect: '+5 Talent Evaluation' },
  data_analyst: { name: 'Data Analyst', tier: 1, effect: '+5 Potential Assessment' },
  trait_hunter: { name: 'Trait Hunter', tier: 1, effect: '+5 Trait Recognition, +1 trait revealed' },
  red_flag_detector: { name: 'Red Flag Detector', tier: 1, effect: '+5 Bust Detection' },
  diamond_finder: { name: 'Diamond Finder', tier: 1, effect: '+5 Sleeper Discovery, +1 hidden gem per draft' },
  // Tier 2
  elite_evaluator: { name: 'Elite Evaluator', tier: 2, effect: '+10 Talent Eval, within ±2 OVR', requires: 'sharp_eye' },
  future_sight: { name: 'Future Sight', tier: 2, effect: '+10 Potential, see range ±3', requires: 'data_analyst' },
  mind_reader: { name: 'Mind Reader', tier: 2, effect: '+10 Trait Rec, reveal all major traits', requires: 'trait_hunter' },
  bust_buster: { name: 'Bust Buster', tier: 2, effect: '+10 Bust Detection, 75% accuracy', requires: 'red_flag_detector' },
  hidden_gem_expert: { name: 'Hidden Gem Expert', tier: 2, effect: '+10 Sleeper, 3-4 sleepers/draft', requires: 'diamond_finder' },
  // Tier 3
  perfect_scout: { name: 'Perfect Scout', tier: 3, effect: '+15 Talent, exact OVR', requires: 'elite_evaluator' },
  oracle: { name: 'Oracle', tier: 3, effect: '+15 Potential, exact ceiling', requires: 'future_sight' },
  psychologist: { name: 'Psychologist', tier: 3, effect: '+15 Trait, ALL revealed', requires: 'mind_reader' },
  bust_proof: { name: 'Bust Proof', tier: 3, effect: '+15 Bust, 90%+ accuracy', requires: 'bust_buster' },
  treasure_hunter: { name: 'Treasure Hunter', tier: 3, effect: '+15 Sleeper, 5+/draft', requires: 'hidden_gem_expert' },
  // Unique perks
  college_connections: { name: 'College Connections', tier: 1, effect: '+10 scouting at 5 chosen schools' },
  pro_scout_expert: { name: 'Pro Scout Expert', tier: 2, effect: '+15 free agent evaluation' },
  raw_talent_spotter: { name: 'Raw Talent Spotter', tier: 1, effect: '+10 physical eval, -5 mental' },
  cerebral_scout: { name: 'Cerebral Scout', tier: 1, effect: '+10 mental eval, -5 physical' },
  speed_scout: { name: 'Speed Scout', tier: 1, effect: 'See exact Speed rating' },
  durability_expert: { name: 'Durability Expert', tier: 2, effect: '+15 injury rating eval' },
};

// ============================================================================
// SALARY RANGES
// ============================================================================

export const DIRECTOR_SALARY_RANGES: Record<string, [number, number]> = {
  '95-99': [1.8, 2.2],
  '90-94': [1.4, 1.8],
  '85-89': [1.0, 1.4],
  '80-84': [0.7, 1.0],
  '75-79': [0.5, 0.7],
  '70-74': [0.35, 0.5],
  '60-69': [0.2, 0.35],
};

export const AREA_NATIONAL_SALARY_RANGES: Record<string, [number, number]> = {
  '90-99': [0.8, 1.2],
  '85-89': [0.6, 0.8],
  '80-84': [0.45, 0.6],
  '75-79': [0.3, 0.45],
  '70-74': [0.2, 0.3],
  '60-69': [0.15, 0.2],
};

export const PRO_SCOUT_SALARY_RANGES: Record<string, [number, number]> = {
  '90-99': [1.0, 1.5],
  '85-89': [0.7, 1.0],
  '80-84': [0.5, 0.7],
  '75-79': [0.35, 0.5],
  '70-74': [0.25, 0.35],
  '60-69': [0.175, 0.25],
};

// ============================================================================
// PERK XP COSTS
// ============================================================================

export const PERK_XP_COSTS: Record<PerkTier, number> = {
  1: 1000,
  2: 3000,
  3: 7000,
};

// ============================================================================
// XP SYSTEM (Part 9)
// ============================================================================

export interface XPRecord {
  amount: number;
  reason: string;
  season: number;
  draftPickId?: string;
  timestamp: number;
}

export const XP_GAIN_VALUES = {
  CORRECT_GRADE: 50, // ±2 OVR accuracy
  HIDDEN_GEM: 200, // Late pick becomes star
  BUST_AVOIDED: 150, // Flagged player busts elsewhere
  DRAFT_HIT_EARLY: 300, // Rounds 1-3
  DRAFT_HIT_LATE: 500, // Rounds 4-7
  UDFA_MAKES_ROSTER: 250,
} as const;

export const XP_SPEND_COSTS = {
  ATTRIBUTE_POINT: 500,
  TIER_1_PERK: 1000,
  TIER_2_PERK: 3000,
  TIER_3_PERK: 7000,
} as const;

// ============================================================================
// SCOUTING POINTS (Part 10)
// ============================================================================

export type ProspectTier = 'top' | 'mid' | 'late' | 'udfa' | 'free_agent' | 'trade_target';
export type SeasonPeriod = 'pre_season' | 'mid_season' | 'late_season' | 'combine' | 'pro_days' | 'draft';

export interface ScoutingAssignment {
  id: string;
  scoutId: string;
  prospectId: string;
  pointsSpent: number;
  week: number;
  period: SeasonPeriod;
  reportGenerated: boolean;
  reportId?: string;
}

export interface WeeklyPointsState {
  week: number;
  available: number;
  spent: number;
  assignments: ScoutingAssignment[];
}

export const SCOUTING_POINT_COSTS: Record<ProspectTier, number> = {
  top: 50, // Rounds 1-2
  mid: 30, // Rounds 3-4
  late: 15, // Rounds 5-7
  udfa: 10,
  free_agent: 25,
  trade_target: 40,
};

export const PERIOD_MODIFIERS: Record<SeasonPeriod, number> = {
  pre_season: 0.75, // -25% cost
  mid_season: 1.0, // Normal
  late_season: 1.25, // +25% cost
  combine: 0, // Free physical data
  pro_days: 0, // Free position data
  draft: 1.0, // Normal
};

// Week ranges for each period
export const SEASON_PERIODS: Record<SeasonPeriod, [number, number]> = {
  pre_season: [1, 8],
  mid_season: [9, 14],
  late_season: [15, 18],
  combine: [19, 19],
  pro_days: [20, 20],
  draft: [21, 21],
};

// ============================================================================
// SCOUTING REPORTS (Part 11)
// ============================================================================

export type PotentialVisibility = 'exact' | 'range' | 'tier' | 'vague' | 'hidden';
export type DraftGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export interface ScoutingReport {
  id: string;
  prospectId: string;
  scoutId: string;
  generatedAt: number;
  week: number;

  // Revealed info (based on scout quality)
  scoutedOvr: number; // True OVR ± error
  ovrConfidence: number; // 0-100%
  potentialVisibility: PotentialVisibility;
  potentialValue?: number | [number, number] | string;

  traitsRevealed: string[];
  traitsHidden: number;

  attributesRevealed: string[]; // Which attrs shown

  bustRisk: number; // 0-100%
  sleeperFlag: boolean;

  draftGrade: DraftGrade;
  roundProjection: number; // 1-7

  textSummary: string; // Generated report text
}

// Report quality thresholds by scout OVR
export const REPORT_QUALITY_TIERS = {
  ELITE: { minOvr: 95, ovrError: 1, potential: 'exact', traitCount: 'all', confidence: 95 },
  GREAT: { minOvr: 85, ovrError: 2, potential: 'range', traitCount: 4, confidence: 85 },
  GOOD: { minOvr: 75, ovrError: 4, potential: 'tier', traitCount: 3, confidence: 72 },
  AVERAGE: { minOvr: 65, ovrError: 6, potential: 'vague', traitCount: 2, confidence: 55 },
  POOR: { minOvr: 60, ovrError: 8, potential: 'hidden', traitCount: 1, confidence: 45 },
} as const;

// ============================================================================
// SCOUT MARKET & HIRING (Part 8)
// ============================================================================

export interface ScoutPool {
  directors: Scout[];
  areaScouts: Scout[];
  proScouts: Scout[];
  nationalScouts: Scout[];
  lastRefresh: number;
}

export interface HiringOffer {
  scoutId: string;
  teamId: string;
  salaryOffer: number;
  contractYears: number;
  timestamp: number;
}

export interface HiringCompetition {
  scoutId: string;
  offers: HiringOffer[];
  winningTeamId: string | null;
  resolved: boolean;
}

// Pool sizes per role
export const SCOUT_POOL_SIZES = {
  directors: { min: 10, max: 15 },
  areaScouts: { min: 20, max: 30 },
  proScouts: { min: 8, max: 12 },
  nationalScouts: { min: 10, max: 15 },
} as const;

// Hiring competition weights
export const HIRING_WEIGHTS = {
  salary: 0.40,
  teamSuccess: 0.20,
  facilities: 0.15,
  jobSecurity: 0.15,
  location: 0.10,
} as const;

// ============================================================================
// RECOMMENDATIONS (Part 12)
// ============================================================================

export type RecommendationType = 'top_prospect' | 'sleeper' | 'bust_warning' | 'best_available';

export interface ScoutRecommendation {
  id: string;
  type: RecommendationType;
  prospectId: string;
  scoutId: string;
  confidence: number;
  reason: string;
  position: string;
  timestamp: number;
}

// ============================================================================
// DRAFT INTEGRATION (Part 14)
// ============================================================================

export interface DraftPickAccuracy {
  pickId: string;
  prospectId: string;
  scoutId: string;
  scoutedOvr: number;
  trueOvr: number;
  error: number;
  xpAwarded: number;
  season: number;
  revealed: boolean; // True OVR revealed after Year 2
}

export interface ScoutAccuracyReport {
  scoutId: string;
  season: number;
  totalPicks: number;
  avgError: number;
  correctGrades: number; // ±2 OVR
  hiddenGemsFound: number;
  bustsAvoided: number;
  totalXpEarned: number;
}

// ============================================================================
// RETIREMENT
// ============================================================================

export const RETIREMENT_RISK_BY_AGE: Record<string, number> = {
  '25-62': 0,
  '63-68': 0.15,
  '69-72': 0.30,
  '73+': 0.50,
};

export const RETENTION_BONUS_RANGE: [number, number] = [0.025, 0.1]; // $25K-$100K
