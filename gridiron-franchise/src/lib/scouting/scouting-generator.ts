/**
 * Scouting Department Generator
 *
 * Generates scouting departments for all 32 teams based on team tier.
 * Follows rules from FINAL-scout-system.md
 */

import { Tier } from '../types';
import { LEAGUE_TEAMS } from '../data/teams';
import {
  Scout,
  ScoutRole,
  ScoutingDepartment,
  LeagueScouting,
  ScoutingStats,
  ScoutAttributes,
  ScoutContract,
  PositionExpertise,
  RegionalExpertise,
  Perk,
  PerkTier,
  ScoutPool,
  SCOUT_PERKS,
  SCOUT_POOL_SIZES,
} from './types';

// ============================================================================
// FIRST NAMES & LAST NAMES
// ============================================================================

const FIRST_NAMES = [
  'Mike', 'John', 'Bill', 'Andy', 'Sean', 'Kyle', 'Matt', 'Dan', 'Pete', 'Ron',
  'Brian', 'Kevin', 'Doug', 'Steve', 'Tom', 'Jim', 'Joe', 'Dave', 'Pat', 'Frank',
  'Gary', 'Tony', 'Bruce', 'Rick', 'Mark', 'Chris', 'Jeff', 'Robert', 'Dennis', 'Eric',
  'Todd', 'Greg', 'James', 'Anthony', 'Scott', 'Nick', 'Adam', 'Paul', 'Ken', 'Ray',
  'Marcus', 'Derrick', 'Terrell', 'DeShawn', 'Carlos', 'Miguel', 'Jamal', 'Andre',
];

const LAST_NAMES = [
  'Williams', 'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Taylor', 'Thomas',
  'Moore', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez',
  'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen',
  'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson',
  'Chen', 'Patel', 'Kim', 'Nguyen', 'Park', 'Singh', 'Santos', 'Rodriguez',
];

// ============================================================================
// OVR RANGES BY TEAM TIER
// ============================================================================

interface TierScoutRanges {
  director: { min: number; max: number };
  area: { min: number; max: number };
  pro: { min: number; max: number };
  national: { min: number; max: number };
  scoutCount: number; // Total scouts including director
}

const TIER_SCOUT_RANGES: Record<Tier, TierScoutRanges> = {
  [Tier.Elite]: {
    director: { min: 88, max: 95 },
    area: { min: 80, max: 88 },
    pro: { min: 82, max: 88 },
    national: { min: 78, max: 85 },
    scoutCount: 4, // Director + 2 Area + Pro
  },
  [Tier.Good]: {
    director: { min: 82, max: 88 },
    area: { min: 76, max: 82 },
    pro: { min: 78, max: 84 },
    national: { min: 74, max: 80 },
    scoutCount: 3, // Director + Area + Pro
  },
  [Tier.Average]: {
    director: { min: 76, max: 82 },
    area: { min: 72, max: 78 },
    pro: { min: 74, max: 80 },
    national: { min: 70, max: 76 },
    scoutCount: 2, // Director + Area
  },
  [Tier.BelowAverage]: {
    director: { min: 70, max: 78 },
    area: { min: 68, max: 74 },
    pro: { min: 70, max: 76 },
    national: { min: 66, max: 72 },
    scoutCount: 1, // Director only
  },
  [Tier.Rebuilding]: {
    director: { min: 65, max: 74 },
    area: { min: 63, max: 70 },
    pro: { min: 65, max: 72 },
    national: { min: 62, max: 68 },
    scoutCount: 1, // Director only
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateId(): string {
  return `scout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// AGE GENERATION
// ============================================================================

function generateAge(ovr: number): number {
  if (ovr >= 90) return randomInRange(48, 65);
  if (ovr >= 85) return randomInRange(42, 60);
  if (ovr >= 80) return randomInRange(38, 55);
  if (ovr >= 75) return randomInRange(32, 50);
  if (ovr >= 70) return randomInRange(28, 45);
  return randomInRange(25, 40);
}

function generateExperience(age: number): number {
  if (age >= 61) return randomInRange(33, 40);
  if (age >= 51) return randomInRange(23, 32);
  if (age >= 41) return randomInRange(13, 22);
  if (age >= 31) return randomInRange(5, 12);
  return randomInRange(1, 4);
}

function calculateRetirementRisk(age: number): number {
  if (age < 63) return 0;
  if (age <= 68) return 15;
  if (age <= 72) return 30;
  return 50;
}

function calculateWeeklyPoints(workEthic: number): number {
  return 100 + workEthic * 2;
}

// ============================================================================
// ATTRIBUTE GENERATION
// ============================================================================

function generateAttributes(targetOvr: number): ScoutAttributes {
  const variance = 6;
  return {
    talentEvaluation: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    potentialAssessment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    traitRecognition: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    bustDetection: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    sleeperDiscovery: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    workEthic: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
  };
}

// ============================================================================
// EXPERTISE GENERATION
// ============================================================================

const POSITION_EXPERTISES: PositionExpertise[] = ['offensive', 'defensive', 'special_teams', 'generalist'];
const REGIONAL_EXPERTISES: RegionalExpertise[] = ['east_coast', 'west_coast', 'midwest', 'south', 'national'];

function pickPositionExpertise(): PositionExpertise {
  // Generalist is most common, ST is rare
  const weights = [35, 35, 5, 25]; // offensive, defensive, ST, generalist
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) return POSITION_EXPERTISES[i];
  }
  return 'generalist';
}

function pickRegionalExpertise(role: ScoutRole): RegionalExpertise {
  // Directors and Pro scouts tend to be National
  if (role === 'director' || role === 'pro') {
    return Math.random() < 0.6 ? 'national' : pickRandom(REGIONAL_EXPERTISES);
  }
  // Area scouts have regional focus
  if (role === 'area') {
    return pickRandom(['east_coast', 'west_coast', 'midwest', 'south'] as RegionalExpertise[]);
  }
  return 'national';
}

// ============================================================================
// PERK GENERATION
// ============================================================================

function getTotalPerkTiers(ovr: number): number {
  if (ovr >= 95) return randomInRange(5, 7);
  if (ovr >= 90) return randomInRange(4, 5);
  if (ovr >= 85) return randomInRange(3, 4);
  if (ovr >= 80) return randomInRange(2, 3);
  if (ovr >= 75) return randomInRange(1, 2);
  if (ovr >= 70) return Math.random() < 0.5 ? 1 : 0;
  return 0;
}

function generatePerks(ovr: number): Perk[] {
  const totalTiers = getTotalPerkTiers(ovr);
  if (totalTiers === 0) return [];

  const perks: Perk[] = [];
  const tier1Perks = ['sharp_eye', 'data_analyst', 'trait_hunter', 'red_flag_detector', 'diamond_finder'];
  const tier2Perks = ['elite_evaluator', 'future_sight', 'mind_reader', 'bust_buster', 'hidden_gem_expert'];
  const tier3Perks = ['perfect_scout', 'oracle', 'psychologist', 'bust_proof', 'treasure_hunter'];
  const uniquePerks = ['college_connections', 'raw_talent_spotter', 'cerebral_scout', 'speed_scout'];

  let remainingTiers = totalTiers;

  // Determine tier distribution
  let tier3Count = ovr >= 95 ? (Math.random() < 0.5 ? 1 : 0) : 0;
  let tier2Count = ovr >= 85 ? randomInRange(1, 2) : ovr >= 80 ? 1 : 0;

  // Add tier 3 perks first
  if (tier3Count > 0 && remainingTiers >= 3) {
    const perkId = pickRandom(tier3Perks);
    const perkDef = SCOUT_PERKS[perkId];
    perks.push({
      id: perkId,
      name: perkDef.name,
      tier: 3,
      effect: perkDef.effect,
    });
    remainingTiers -= 3;
  }

  // Add tier 2 perks
  const shuffledT2 = [...tier2Perks].sort(() => Math.random() - 0.5);
  for (const perkId of shuffledT2) {
    if (tier2Count <= 0 || remainingTiers < 2) break;
    const perkDef = SCOUT_PERKS[perkId];
    perks.push({
      id: perkId,
      name: perkDef.name,
      tier: 2,
      effect: perkDef.effect,
    });
    remainingTiers -= 2;
    tier2Count--;
  }

  // Fill rest with tier 1
  const allT1 = [...tier1Perks, ...uniquePerks];
  const shuffledT1 = allT1.sort(() => Math.random() - 0.5);
  for (const perkId of shuffledT1) {
    if (remainingTiers < 1) break;
    if (perks.some((p) => p.id === perkId)) continue;
    const perkDef = SCOUT_PERKS[perkId];
    if (!perkDef) continue;
    perks.push({
      id: perkId,
      name: perkDef.name,
      tier: 1,
      effect: perkDef.effect,
    });
    remainingTiers -= 1;
  }

  return perks;
}

// ============================================================================
// SALARY GENERATION
// ============================================================================

function generateSalary(role: ScoutRole, ovr: number): number {
  let ranges: Record<string, [number, number]>;

  if (role === 'director') {
    ranges = {
      '95-99': [1.8, 2.2],
      '90-94': [1.4, 1.8],
      '85-89': [1.0, 1.4],
      '80-84': [0.7, 1.0],
      '75-79': [0.5, 0.7],
      '70-74': [0.35, 0.5],
      '60-69': [0.2, 0.35],
    };
  } else if (role === 'pro') {
    ranges = {
      '90-99': [1.0, 1.5],
      '85-89': [0.7, 1.0],
      '80-84': [0.5, 0.7],
      '75-79': [0.35, 0.5],
      '70-74': [0.25, 0.35],
      '60-69': [0.175, 0.25],
    };
  } else {
    // Area and National scouts
    ranges = {
      '90-99': [0.8, 1.2],
      '85-89': [0.6, 0.8],
      '80-84': [0.45, 0.6],
      '75-79': [0.3, 0.45],
      '70-74': [0.2, 0.3],
      '60-69': [0.15, 0.2],
    };
  }

  let range: [number, number] = [0.15, 0.2];
  if (ovr >= 95) range = ranges['95-99'] || ranges['90-99'];
  else if (ovr >= 90) range = ranges['90-94'] || ranges['90-99'];
  else if (ovr >= 85) range = ranges['85-89'];
  else if (ovr >= 80) range = ranges['80-84'];
  else if (ovr >= 75) range = ranges['75-79'];
  else if (ovr >= 70) range = ranges['70-74'];
  else range = ranges['60-69'];

  return randomFloat(range[0], range[1]);
}

function generateContract(role: ScoutRole, ovr: number): ScoutContract {
  const salary = generateSalary(role, ovr);
  const yearsTotal = role === 'director' ? randomInRange(2, 3) : randomInRange(1, 2);
  const yearsRemaining = randomInRange(1, yearsTotal);

  return {
    salary,
    yearsTotal,
    yearsRemaining,
  };
}

// ============================================================================
// SCOUT GENERATION
// ============================================================================

function generateScout(role: ScoutRole, targetOvr: number): Scout {
  const ovr = clamp(targetOvr + randomInRange(-2, 2), 60, 99);
  const age = generateAge(ovr);
  const experience = generateExperience(age);
  const attributes = generateAttributes(ovr);
  const contract = generateContract(role, ovr);
  const perks = generatePerks(ovr);

  return {
    id: generateId(),
    firstName: pickRandom(FIRST_NAMES),
    lastName: pickRandom(LAST_NAMES),
    role,
    age,
    experience,
    ovr,
    attributes,
    positionExpertise: pickPositionExpertise(),
    regionalExpertise: pickRegionalExpertise(role),
    perks,
    contract,
    xp: 0,
    weeklyPoints: calculateWeeklyPoints(attributes.workEthic),
    retirementRisk: calculateRetirementRisk(age),
  };
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export function generateScouting(teamTiers: Map<string, Tier>): LeagueScouting {
  const teams: Record<string, ScoutingDepartment> = {};

  for (const team of LEAGUE_TEAMS) {
    const tier = teamTiers.get(team.id) || Tier.Average;
    const ranges = TIER_SCOUT_RANGES[tier];

    // Always generate a director
    const directorOvr = randomInRange(ranges.director.min, ranges.director.max);
    const director = generateScout('director', directorOvr);

    // Generate area scouts based on tier
    const areaScouts: Scout[] = [];
    if (ranges.scoutCount >= 2) {
      const area1Ovr = randomInRange(ranges.area.min, ranges.area.max);
      areaScouts.push(generateScout('area', area1Ovr));
    }
    if (ranges.scoutCount >= 4) {
      const area2Ovr = randomInRange(ranges.area.min, ranges.area.max);
      areaScouts.push(generateScout('area', area2Ovr));
    }

    // Generate pro scout for good+ teams
    let proScout: Scout | null = null;
    if (ranges.scoutCount >= 3) {
      const proOvr = randomInRange(ranges.pro.min, ranges.pro.max);
      proScout = generateScout('pro', proOvr);
    }

    // National scout for elite teams (optional)
    let nationalScout: Scout | null = null;
    if (tier === Tier.Elite && Math.random() < 0.5) {
      const nationalOvr = randomInRange(ranges.national.min, ranges.national.max);
      nationalScout = generateScout('national', nationalOvr);
    }

    // Calculate totals
    const allScouts = [director, ...areaScouts, proScout, nationalScout].filter(Boolean) as Scout[];
    const totalBudget = allScouts.reduce((sum, s) => sum + s.contract.salary, 0);
    const weeklyPoints = allScouts.reduce((sum, s) => sum + s.weeklyPoints, 0);
    const avgOvr = Math.round(allScouts.reduce((sum, s) => sum + s.ovr, 0) / allScouts.length);

    teams[team.id] = {
      teamId: team.id,
      director,
      areaScouts,
      proScout,
      nationalScout,
      totalBudget: Math.round(totalBudget * 100) / 100,
      weeklyPoints,
      scoutCount: allScouts.length,
      avgOvr,
    };
  }

  return {
    teams,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

export function getScoutingStats(scouting: LeagueScouting): ScoutingStats {
  const deptList = Object.values(scouting.teams);

  let totalDirectorOvr = 0;
  let totalScoutOvr = 0;
  let totalScouts = 0;
  let totalSalaries = 0;
  let totalWeeklyPoints = 0;
  let eliteCount = 0;
  let greatCount = 0;
  let goodCount = 0;
  let averageCount = 0;
  let belowAvgCount = 0;
  let poorCount = 0;

  const positionDist: Record<PositionExpertise, number> = {
    offensive: 0,
    defensive: 0,
    special_teams: 0,
    generalist: 0,
  };

  const regionalDist: Record<RegionalExpertise, number> = {
    east_coast: 0,
    west_coast: 0,
    midwest: 0,
    south: 0,
    national: 0,
  };

  for (const dept of deptList) {
    const allScouts = [dept.director, ...dept.areaScouts, dept.proScout, dept.nationalScout].filter(Boolean) as Scout[];

    totalDirectorOvr += dept.director.ovr;
    totalSalaries += dept.totalBudget;
    totalWeeklyPoints += dept.weeklyPoints;

    for (const scout of allScouts) {
      totalScoutOvr += scout.ovr;
      totalScouts++;

      if (scout.ovr >= 90) eliteCount++;
      else if (scout.ovr >= 85) greatCount++;
      else if (scout.ovr >= 80) goodCount++;
      else if (scout.ovr >= 75) averageCount++;
      else if (scout.ovr >= 70) belowAvgCount++;
      else poorCount++;

      positionDist[scout.positionExpertise]++;
      regionalDist[scout.regionalExpertise]++;
    }
  }

  const count = deptList.length;
  const sortedByOvr = [...deptList].sort((a, b) => b.avgOvr - a.avgOvr);

  return {
    avgDirectorRating: Math.round((totalDirectorOvr / count) * 10) / 10,
    avgScoutRating: Math.round((totalScoutOvr / totalScouts) * 10) / 10,
    totalScouts,
    eliteScouts: eliteCount,
    greatScouts: greatCount,
    goodScouts: goodCount,
    averageScouts: averageCount,
    belowAverageScouts: belowAvgCount,
    poorScouts: poorCount,
    totalSalaries: Math.round(totalSalaries * 100) / 100,
    avgDepartmentBudget: Math.round((totalSalaries / count) * 100) / 100,
    avgWeeklyPoints: Math.round(totalWeeklyPoints / count),
    positionExpertiseDistribution: positionDist,
    regionalExpertiseDistribution: regionalDist,
    topDepartments: sortedByOvr.slice(0, 5).map((d) => ({
      teamId: d.teamId,
      avgOvr: d.avgOvr,
      weeklyPoints: d.weeklyPoints,
    })),
    bottomDepartments: sortedByOvr.slice(-5).reverse().map((d) => ({
      teamId: d.teamId,
      avgOvr: d.avgOvr,
      weeklyPoints: d.weeklyPoints,
    })),
  };
}

// ============================================================================
// SCOUT POOL GENERATION (Part 8)
// ============================================================================

export function generateScoutPool(): ScoutPool {
  const directors: Scout[] = [];
  const areaScouts: Scout[] = [];
  const proScouts: Scout[] = [];
  const nationalScouts: Scout[] = [];

  // Generate directors (10-15)
  const directorCount = randomInRange(SCOUT_POOL_SIZES.directors.min, SCOUT_POOL_SIZES.directors.max);
  // Distribution: 2 Elite, 3 Great, 5 Good, rest Average
  for (let i = 0; i < directorCount; i++) {
    let targetOvr: number;
    if (i < 2) targetOvr = randomInRange(90, 95); // Elite
    else if (i < 5) targetOvr = randomInRange(85, 89); // Great
    else if (i < 10) targetOvr = randomInRange(80, 84); // Good
    else targetOvr = randomInRange(75, 79); // Average
    directors.push(generateScout('director', targetOvr));
  }

  // Generate area scouts (20-30)
  const areaCount = randomInRange(SCOUT_POOL_SIZES.areaScouts.min, SCOUT_POOL_SIZES.areaScouts.max);
  // Distribution: 3 Elite, 6 Great, 10 Good, rest below
  for (let i = 0; i < areaCount; i++) {
    let targetOvr: number;
    if (i < 3) targetOvr = randomInRange(90, 95);
    else if (i < 9) targetOvr = randomInRange(85, 89);
    else if (i < 19) targetOvr = randomInRange(80, 84);
    else targetOvr = randomInRange(70, 79);
    areaScouts.push(generateScout('area', targetOvr));
  }

  // Generate pro scouts (8-12)
  const proCount = randomInRange(SCOUT_POOL_SIZES.proScouts.min, SCOUT_POOL_SIZES.proScouts.max);
  // Distribution: 2 Elite, 3 Great, 4 Good, rest below
  for (let i = 0; i < proCount; i++) {
    let targetOvr: number;
    if (i < 2) targetOvr = randomInRange(90, 95);
    else if (i < 5) targetOvr = randomInRange(85, 89);
    else if (i < 9) targetOvr = randomInRange(80, 84);
    else targetOvr = randomInRange(70, 79);
    proScouts.push(generateScout('pro', targetOvr));
  }

  // Generate national scouts (10-15)
  const nationalCount = randomInRange(SCOUT_POOL_SIZES.nationalScouts.min, SCOUT_POOL_SIZES.nationalScouts.max);
  // Distribution: 2 Great, 4 Good, rest Average
  for (let i = 0; i < nationalCount; i++) {
    let targetOvr: number;
    if (i < 2) targetOvr = randomInRange(85, 89);
    else if (i < 6) targetOvr = randomInRange(80, 84);
    else targetOvr = randomInRange(75, 79);
    nationalScouts.push(generateScout('national', targetOvr));
  }

  return {
    directors,
    areaScouts,
    proScouts,
    nationalScouts,
    lastRefresh: Date.now(),
  };
}

// Re-export for convenience
export { LEAGUE_TEAMS };
