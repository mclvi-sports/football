/**
 * Coaching Staff Generator
 *
 * Generates coaching staff for all 32 teams based on team tier.
 * Follows rules from FINAL-coaching-staff-system.md
 */

import { Tier } from '../types';
import { LEAGUE_TEAMS } from '../data/teams';
import {
  Coach,
  CoachPosition,
  CoachingStaff,
  LeagueCoaching,
  CoachingStats,
  CoachPhilosophy,
  Perk,
  PerkTier,
  HCAttributes,
  OCAttributes,
  DCAttributes,
  STCAttributes,
  CoachContract,
  HCPerkId,
  OCPerkId,
  DCPerkId,
  STPerkId,
  HC_PERKS,
  OC_PERKS,
  DC_PERKS,
  STC_PERKS,
  OffensiveScheme,
  DefensiveScheme,
  STPhilosophy,
} from './types';
import {
  ALL_OFFENSIVE_SCHEMES,
  ALL_DEFENSIVE_SCHEMES,
  ALL_ST_PHILOSOPHIES,
} from '../schemes/scheme-data';

// ============================================================================
// FIRST NAMES & LAST NAMES
// ============================================================================

const FIRST_NAMES = [
  'Mike', 'John', 'Bill', 'Andy', 'Sean', 'Kyle', 'Matt', 'Dan', 'Pete', 'Ron',
  'Brian', 'Kevin', 'Doug', 'Steve', 'Tom', 'Jim', 'Joe', 'Dave', 'Pat', 'Frank',
  'Gary', 'Tony', 'Bruce', 'Rick', 'Mark', 'Chris', 'Jeff', 'Robert', 'Dennis', 'Eric',
  'Todd', 'Greg', 'James', 'Anthony', 'Scott', 'Nick', 'Adam', 'Paul', 'Ken', 'Ray',
];

const LAST_NAMES = [
  'Williams', 'Smith', 'Johnson', 'Reid', 'Shanahan', 'McVay', 'Tomlin', 'Belichick',
  'Payton', 'Carroll', 'Harbaugh', 'Rivera', 'McCarthy', 'Taylor', 'Campbell', 'Staley',
  'Sirianni', 'LaFleur', 'Pederson', 'Vrabel', 'Allen', 'Brown', 'Davis', 'Wilson',
  'Miller', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
  'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker',
];

// ============================================================================
// OVR RANGES BY TEAM TIER
// ============================================================================

interface TierCoachRanges {
  HC: { min: number; max: number };
  OC: { min: number; max: number };
  DC: { min: number; max: number };
  STC: { min: number; max: number };
}

const TIER_COACH_RANGES: Record<Tier, TierCoachRanges> = {
  [Tier.Elite]: {
    HC: { min: 88, max: 95 },
    OC: { min: 85, max: 92 },
    DC: { min: 85, max: 92 },
    STC: { min: 78, max: 85 },
  },
  [Tier.Good]: {
    HC: { min: 82, max: 89 },
    OC: { min: 80, max: 87 },
    DC: { min: 80, max: 87 },
    STC: { min: 75, max: 82 },
  },
  [Tier.Average]: {
    HC: { min: 76, max: 83 },
    OC: { min: 74, max: 81 },
    DC: { min: 74, max: 81 },
    STC: { min: 70, max: 77 },
  },
  [Tier.BelowAverage]: {
    HC: { min: 70, max: 78 },
    OC: { min: 68, max: 76 },
    DC: { min: 68, max: 76 },
    STC: { min: 65, max: 73 },
  },
  [Tier.Rebuilding]: {
    HC: { min: 65, max: 75 },
    OC: { min: 63, max: 73 },
    DC: { min: 63, max: 73 },
    STC: { min: 62, max: 70 },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateId(): string {
  return `coach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// AGE GENERATION
// ============================================================================

function generateAge(ovr: number): number {
  // Higher OVR coaches tend to be older (more experienced)
  if (ovr >= 90) return randomInRange(50, 68);
  if (ovr >= 85) return randomInRange(45, 65);
  if (ovr >= 80) return randomInRange(40, 60);
  if (ovr >= 75) return randomInRange(35, 58);
  if (ovr >= 70) return randomInRange(32, 55);
  return randomInRange(30, 50);
}

function generateExperience(age: number): number {
  // Experience based on age
  if (age >= 66) return randomInRange(30, 40);
  if (age >= 56) return randomInRange(21, 30);
  if (age >= 46) return randomInRange(13, 20);
  if (age >= 36) return randomInRange(6, 12);
  return randomInRange(2, 5);
}

function calculateRetirementRisk(age: number): number {
  if (age < 61) return 0;
  if (age <= 65) return 5;
  if (age <= 70) return 15;
  if (age <= 75) return 30;
  return 50;
}

// ============================================================================
// ATTRIBUTE GENERATION
// ============================================================================

function generateHCAttributes(targetOvr: number): HCAttributes {
  const variance = 8;
  return {
    schemeMastery: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    playerDevelopment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    motivation: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    gamePlanning: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    adaptability: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    leadership: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    clockManagement: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    challengeSuccess: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    discipline: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    mediaHandling: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
  };
}

function generateOCAttributes(targetOvr: number): OCAttributes {
  const variance = 8;
  return {
    schemeMastery: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    playerDevelopment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    motivation: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    gamePlanning: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    adaptability: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    playCalling: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    redZoneOffense: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    qbDevelopment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    tempoControl: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    creativity: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
  };
}

function generateDCAttributes(targetOvr: number): DCAttributes {
  const variance = 8;
  return {
    schemeMastery: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    playerDevelopment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    motivation: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    gamePlanning: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    adaptability: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    playCalling: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    redZoneDefense: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    turnoverCreation: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    blitzDesign: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    coverageDisguise: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
  };
}

function generateSTCAttributes(targetOvr: number): STCAttributes {
  const variance = 8;
  return {
    schemeMastery: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    playerDevelopment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    motivation: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    gamePlanning: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    adaptability: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    kickingGame: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    returnGame: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    coverageUnits: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    situational: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
    gunnerDevelopment: clamp(targetOvr + randomInRange(-variance, variance), 60, 99),
  };
}

// ============================================================================
// PERK GENERATION
// ============================================================================

function getTotalPerkTiers(ovr: number): number {
  if (ovr >= 95) return randomInRange(7, 9);
  if (ovr >= 90) return randomInRange(5, 7);
  if (ovr >= 85) return randomInRange(4, 5);
  if (ovr >= 80) return randomInRange(3, 4);
  if (ovr >= 75) return randomInRange(2, 3);
  if (ovr >= 70) return randomInRange(1, 2);
  return Math.random() < 0.5 ? 1 : 0;
}

function generateHCPerks(ovr: number): Perk[] {
  const totalTiers = getTotalPerkTiers(ovr);
  if (totalTiers === 0) return [];

  const perks: Perk[] = [];
  const availablePerks: HCPerkId[] = Object.keys(HC_PERKS) as HCPerkId[];
  let remainingTiers = totalTiers;

  // Determine distribution
  let tier3Count = 0;
  let tier2Count = 0;

  if (ovr >= 95) {
    tier3Count = randomInRange(1, 2);
    tier2Count = randomInRange(2, 3);
  } else if (ovr >= 90) {
    tier3Count = 1;
    tier2Count = 2;
  } else if (ovr >= 85) {
    tier3Count = Math.random() < 0.5 ? 1 : 0;
    tier2Count = randomInRange(1, 2);
  } else if (ovr >= 80) {
    tier2Count = 1;
  }

  // Add perks
  const shuffledPerks = [...availablePerks].sort(() => Math.random() - 0.5);

  for (const perkId of shuffledPerks) {
    if (remainingTiers <= 0) break;

    let tier: PerkTier = 1;
    if (tier3Count > 0 && remainingTiers >= 3) {
      tier = 3;
      tier3Count--;
      remainingTiers -= 3;
    } else if (tier2Count > 0 && remainingTiers >= 2) {
      tier = 2;
      tier2Count--;
      remainingTiers -= 2;
    } else {
      tier = 1;
      remainingTiers -= 1;
    }

    perks.push({
      id: perkId,
      name: HC_PERKS[perkId].name,
      tier,
      effect: HC_PERKS[perkId].effects[tier],
    });
  }

  return perks;
}

function generateOCPerks(ovr: number): Perk[] {
  const totalTiers = getTotalPerkTiers(ovr);
  if (totalTiers === 0) return [];

  const perks: Perk[] = [];
  const availablePerks: OCPerkId[] = Object.keys(OC_PERKS) as OCPerkId[];
  let remainingTiers = totalTiers;

  let tier3Count = ovr >= 90 ? 1 : 0;
  let tier2Count = ovr >= 85 ? randomInRange(1, 2) : ovr >= 80 ? 1 : 0;

  const shuffledPerks = [...availablePerks].sort(() => Math.random() - 0.5);

  for (const perkId of shuffledPerks) {
    if (remainingTiers <= 0) break;

    let tier: PerkTier = 1;
    if (tier3Count > 0 && remainingTiers >= 3) {
      tier = 3;
      tier3Count--;
      remainingTiers -= 3;
    } else if (tier2Count > 0 && remainingTiers >= 2) {
      tier = 2;
      tier2Count--;
      remainingTiers -= 2;
    } else {
      tier = 1;
      remainingTiers -= 1;
    }

    perks.push({
      id: perkId,
      name: OC_PERKS[perkId].name,
      tier,
      effect: OC_PERKS[perkId].effects[tier],
    });
  }

  return perks;
}

function generateDCPerks(ovr: number): Perk[] {
  const totalTiers = getTotalPerkTiers(ovr);
  if (totalTiers === 0) return [];

  const perks: Perk[] = [];
  const availablePerks: DCPerkId[] = Object.keys(DC_PERKS) as DCPerkId[];
  let remainingTiers = totalTiers;

  let tier3Count = ovr >= 90 ? 1 : 0;
  let tier2Count = ovr >= 85 ? randomInRange(1, 2) : ovr >= 80 ? 1 : 0;

  const shuffledPerks = [...availablePerks].sort(() => Math.random() - 0.5);

  for (const perkId of shuffledPerks) {
    if (remainingTiers <= 0) break;

    let tier: PerkTier = 1;
    if (tier3Count > 0 && remainingTiers >= 3) {
      tier = 3;
      tier3Count--;
      remainingTiers -= 3;
    } else if (tier2Count > 0 && remainingTiers >= 2) {
      tier = 2;
      tier2Count--;
      remainingTiers -= 2;
    } else {
      tier = 1;
      remainingTiers -= 1;
    }

    perks.push({
      id: perkId,
      name: DC_PERKS[perkId].name,
      tier,
      effect: DC_PERKS[perkId].effects[tier],
    });
  }

  return perks;
}

function generateSTCPerks(ovr: number): Perk[] {
  const totalTiers = Math.min(getTotalPerkTiers(ovr), 4); // STC has fewer perks
  if (totalTiers === 0) return [];

  const perks: Perk[] = [];
  const availablePerks: STPerkId[] = Object.keys(STC_PERKS) as STPerkId[];
  let remainingTiers = totalTiers;

  let tier3Count = ovr >= 92 ? 1 : 0;
  let tier2Count = ovr >= 85 ? 1 : 0;

  const shuffledPerks = [...availablePerks].sort(() => Math.random() - 0.5);

  for (const perkId of shuffledPerks) {
    if (remainingTiers <= 0) break;

    let tier: PerkTier = 1;
    if (tier3Count > 0 && remainingTiers >= 3) {
      tier = 3;
      tier3Count--;
      remainingTiers -= 3;
    } else if (tier2Count > 0 && remainingTiers >= 2) {
      tier = 2;
      tier2Count--;
      remainingTiers -= 2;
    } else {
      tier = 1;
      remainingTiers -= 1;
    }

    perks.push({
      id: perkId,
      name: STC_PERKS[perkId].name,
      tier,
      effect: STC_PERKS[perkId].effects[tier],
    });
  }

  return perks;
}

// ============================================================================
// SALARY & CONTRACT GENERATION
// ============================================================================

function generateHCSalary(ovr: number): number {
  if (ovr >= 95) return randomFloat(12, 15);
  if (ovr >= 90) return randomFloat(9, 12);
  if (ovr >= 85) return randomFloat(6, 9);
  if (ovr >= 80) return randomFloat(4, 6);
  if (ovr >= 75) return randomFloat(2, 4);
  if (ovr >= 70) return randomFloat(1, 2);
  return randomFloat(0.5, 1);
}

function generateCoordinatorSalary(position: 'OC' | 'DC' | 'STC', ovr: number): number {
  if (position === 'STC') {
    if (ovr >= 90) return randomFloat(2, 3);
    if (ovr >= 85) return randomFloat(1.5, 2);
    if (ovr >= 80) return randomFloat(1, 1.5);
    if (ovr >= 75) return randomFloat(0.8, 1);
    if (ovr >= 70) return randomFloat(0.5, 0.8);
    return randomFloat(0.3, 0.5);
  }

  // OC and DC have same salary ranges
  if (ovr >= 90) return randomFloat(6, 8);
  if (ovr >= 85) return randomFloat(4, 6);
  if (ovr >= 80) return randomFloat(2.5, 4);
  if (ovr >= 75) return randomFloat(1.5, 2.5);
  if (ovr >= 70) return randomFloat(0.8, 1.5);
  return randomFloat(0.5, 0.8);
}

function generateContractYears(ovr: number, age: number): number {
  // Higher OVR and younger coaches get longer contracts
  let baseYears = 2;
  if (ovr >= 90) baseYears = 4;
  else if (ovr >= 85) baseYears = 3;
  else if (ovr >= 80) baseYears = 3;
  else if (ovr >= 75) baseYears = 2;

  // Older coaches get shorter contracts
  if (age >= 65) baseYears = Math.min(baseYears, 2);
  if (age >= 60) baseYears = Math.min(baseYears, 3);

  return randomInRange(baseYears, baseYears + 1);
}

function generateContract(position: CoachPosition, ovr: number, age: number): CoachContract {
  let salary: number;
  if (position === 'HC') {
    salary = generateHCSalary(ovr);
  } else {
    salary = generateCoordinatorSalary(position, ovr);
  }

  const yearsTotal = generateContractYears(ovr, age);
  const yearsRemaining = randomInRange(1, yearsTotal);
  const guaranteedRemaining = Math.round(salary * yearsRemaining * 0.6 * 10) / 10;

  return {
    salary,
    yearsTotal,
    yearsRemaining,
    guaranteedRemaining,
  };
}

// ============================================================================
// COACH GENERATION
// ============================================================================

function generateCoach(position: CoachPosition, targetOvr: number): Coach {
  // Add some variance to target OVR
  const ovr = clamp(targetOvr + randomInRange(-2, 2), 60, 99);
  const age = generateAge(ovr);
  const experience = generateExperience(age);

  let attributes;
  let perks: Perk[];

  switch (position) {
    case 'HC':
      attributes = generateHCAttributes(ovr);
      perks = generateHCPerks(ovr);
      break;
    case 'OC':
      attributes = generateOCAttributes(ovr);
      perks = generateOCPerks(ovr);
      break;
    case 'DC':
      attributes = generateDCAttributes(ovr);
      perks = generateDCPerks(ovr);
      break;
    case 'STC':
      attributes = generateSTCAttributes(ovr);
      perks = generateSTCPerks(ovr);
      break;
  }

  const philosophy: CoachPhilosophy = pickRandom(['aggressive', 'balanced', 'conservative', 'innovative']);
  const contract = generateContract(position, ovr, age);

  // Build base coach object
  const coach: Coach = {
    id: generateId(),
    firstName: pickRandom(FIRST_NAMES),
    lastName: pickRandom(LAST_NAMES),
    position,
    age,
    experience,
    ovr,
    attributes,
    philosophy,
    perks,
    contract,
    xp: 0,
    retirementRisk: calculateRetirementRisk(age),
  };

  // Assign schemes based on position
  switch (position) {
    case 'HC':
      // HC has both offensive and defensive scheme preferences
      coach.offensiveScheme = pickRandom(ALL_OFFENSIVE_SCHEMES);
      coach.defensiveScheme = pickRandom(ALL_DEFENSIVE_SCHEMES);
      break;
    case 'OC':
      // OC has only offensive scheme
      coach.offensiveScheme = pickRandom(ALL_OFFENSIVE_SCHEMES);
      break;
    case 'DC':
      // DC has only defensive scheme
      coach.defensiveScheme = pickRandom(ALL_DEFENSIVE_SCHEMES);
      break;
    case 'STC':
      // STC has only ST philosophy
      coach.stPhilosophy = pickRandom(ALL_ST_PHILOSOPHIES);
      break;
  }

  return coach;
}

// ============================================================================
// STAFF CHEMISTRY
// ============================================================================

function calculateStaffChemistry(staff: CoachingStaff): number {
  let chemistry = 70; // Base chemistry

  // Same philosophy bonus
  const philosophies = [
    staff.headCoach.philosophy,
    staff.offensiveCoordinator.philosophy,
    staff.defensiveCoordinator.philosophy,
    staff.specialTeamsCoordinator.philosophy,
  ];

  const allSame = philosophies.every((p) => p === philosophies[0]);
  const allDifferent = new Set(philosophies).size === philosophies.length;

  if (allSame) {
    chemistry += 15;
  } else if (allDifferent) {
    chemistry -= 10;
  }

  // Scheme alignment bonuses
  // HC's offensive scheme matching OC's scheme
  if (staff.headCoach.offensiveScheme === staff.offensiveCoordinator.offensiveScheme) {
    chemistry += 5;
  }
  // HC's defensive scheme matching DC's scheme
  if (staff.headCoach.defensiveScheme === staff.defensiveCoordinator.defensiveScheme) {
    chemistry += 5;
  }

  // Veteran staff bonus
  const avgAge =
    (staff.headCoach.age +
      staff.offensiveCoordinator.age +
      staff.defensiveCoordinator.age +
      staff.specialTeamsCoordinator.age) /
    4;

  if (avgAge >= 55) {
    chemistry += 5;
  } else if (avgAge <= 45) {
    chemistry += 8; // Young staff bonus
  }

  return clamp(chemistry, 0, 100);
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export function generateCoaching(teamTiers: Map<string, Tier>): LeagueCoaching {
  const teams: Record<string, CoachingStaff> = {};

  for (const team of LEAGUE_TEAMS) {
    const tier = teamTiers.get(team.id) || Tier.Average;
    const ranges = TIER_COACH_RANGES[tier];

    const hcOvr = randomInRange(ranges.HC.min, ranges.HC.max);
    const ocOvr = randomInRange(ranges.OC.min, ranges.OC.max);
    const dcOvr = randomInRange(ranges.DC.min, ranges.DC.max);
    const stcOvr = randomInRange(ranges.STC.min, ranges.STC.max);

    const headCoach = generateCoach('HC', hcOvr);
    const offensiveCoordinator = generateCoach('OC', ocOvr);
    const defensiveCoordinator = generateCoach('DC', dcOvr);
    const specialTeamsCoordinator = generateCoach('STC', stcOvr);

    const totalSalary =
      headCoach.contract.salary +
      offensiveCoordinator.contract.salary +
      defensiveCoordinator.contract.salary +
      specialTeamsCoordinator.contract.salary;

    const avgOvr = Math.round((headCoach.ovr + offensiveCoordinator.ovr + defensiveCoordinator.ovr + specialTeamsCoordinator.ovr) / 4);

    const staff: CoachingStaff = {
      teamId: team.id,
      headCoach,
      offensiveCoordinator,
      defensiveCoordinator,
      specialTeamsCoordinator,
      totalSalary: Math.round(totalSalary * 10) / 10,
      staffChemistry: 70, // Will be calculated
      avgOvr,
    };

    staff.staffChemistry = calculateStaffChemistry(staff);
    teams[team.id] = staff;
  }

  return {
    teams,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

export function getCoachingStats(coaching: LeagueCoaching): CoachingStats {
  const staffList = Object.values(coaching.teams);

  let totalHC = 0;
  let totalOC = 0;
  let totalDC = 0;
  let totalSTC = 0;
  let totalSalaries = 0;
  let eliteCount = 0;
  let greatCount = 0;
  let goodCount = 0;
  let averageCount = 0;
  let belowAvgCount = 0;
  let poorCount = 0;

  const offSchemes: Record<OffensiveScheme, number> = {
    west_coast: 0, spread: 0, pro_style: 0, air_raid: 0, power_run: 0, zone_run: 0,
  };
  const defSchemes: Record<DefensiveScheme, number> = {
    '4-3': 0, '3-4': 0, cover_2: 0, cover_3: 0, man_blitz: 0, zone_blitz: 0,
  };
  const stPhilosophies: Record<STPhilosophy, number> = {
    aggressive: 0, conservative: 0, coverage_specialist: 0,
  };

  for (const staff of staffList) {
    totalHC += staff.headCoach.ovr;
    totalOC += staff.offensiveCoordinator.ovr;
    totalDC += staff.defensiveCoordinator.ovr;
    totalSTC += staff.specialTeamsCoordinator.ovr;
    totalSalaries += staff.totalSalary;

    // Count all coaches by tier
    const allCoaches = [
      staff.headCoach,
      staff.offensiveCoordinator,
      staff.defensiveCoordinator,
      staff.specialTeamsCoordinator,
    ];

    for (const coach of allCoaches) {
      if (coach.ovr >= 90) eliteCount++;
      else if (coach.ovr >= 85) greatCount++;
      else if (coach.ovr >= 80) goodCount++;
      else if (coach.ovr >= 75) averageCount++;
      else if (coach.ovr >= 70) belowAvgCount++;
      else poorCount++;
    }

    // Count offensive schemes (from OC, as that's the primary offensive scheme)
    const ocScheme = staff.offensiveCoordinator.offensiveScheme;
    if (ocScheme && ocScheme in offSchemes) {
      offSchemes[ocScheme]++;
    }

    // Count defensive schemes (from DC, as that's the primary defensive scheme)
    const dcScheme = staff.defensiveCoordinator.defensiveScheme;
    if (dcScheme && dcScheme in defSchemes) {
      defSchemes[dcScheme]++;
    }

    // Count ST philosophies
    const stcPhilosophy = staff.specialTeamsCoordinator.stPhilosophy;
    if (stcPhilosophy && stcPhilosophy in stPhilosophies) {
      stPhilosophies[stcPhilosophy]++;
    }
  }

  const count = staffList.length;
  const sortedByHC = [...staffList].sort((a, b) => b.headCoach.ovr - a.headCoach.ovr);

  return {
    avgHCRating: Math.round((totalHC / count) * 10) / 10,
    avgOCRating: Math.round((totalOC / count) * 10) / 10,
    avgDCRating: Math.round((totalDC / count) * 10) / 10,
    avgSTCRating: Math.round((totalSTC / count) * 10) / 10,
    avgOverallRating: Math.round(((totalHC + totalOC + totalDC + totalSTC) / (count * 4)) * 10) / 10,
    eliteCoaches: eliteCount,
    greatCoaches: greatCount,
    goodCoaches: goodCount,
    averageCoaches: averageCount,
    belowAverageCoaches: belowAvgCount,
    poorCoaches: poorCount,
    totalSalaries: Math.round(totalSalaries * 10) / 10,
    avgTeamSalary: Math.round((totalSalaries / count) * 10) / 10,
    schemeDistribution: {
      offensive: offSchemes,
      defensive: defSchemes,
      specialTeams: stPhilosophies,
    },
    topHCs: sortedByHC.slice(0, 5).map((s) => ({
      teamId: s.teamId,
      name: `${s.headCoach.firstName} ${s.headCoach.lastName}`,
      ovr: s.headCoach.ovr,
    })),
    bottomHCs: sortedByHC.slice(-5).reverse().map((s) => ({
      teamId: s.teamId,
      name: `${s.headCoach.firstName} ${s.headCoach.lastName}`,
      ovr: s.headCoach.ovr,
    })),
  };
}

// Re-export for convenience
export { LEAGUE_TEAMS };
