/**
 * Facilities Generator
 *
 * Generates team facilities for all 32 teams based on team tier.
 * Follows rules from FINAL-facilities-system.md
 */

import { Tier } from '../types';
import { LEAGUE_TEAMS } from '../data/teams';
import {
  TeamFacilities,
  LeagueFacilities,
  Stadium,
  PracticeFacility,
  TrainingRoom,
  WeightRoom,
  OwnerTier,
  SurfaceType,
  StadiumType,
  Climate,
  FacilitiesStats,
  OWNER_TIER_CONFIG,
  OWNER_TIER_DISTRIBUTION,
  MAINTENANCE_COSTS,
} from './types';

// ============================================================================
// FACILITY RANGES BY TEAM TIER
// ============================================================================

interface FacilityRange {
  min: number;
  max: number;
}

interface TierFacilityRanges {
  stadium: FacilityRange;
  practice: FacilityRange;
  training: FacilityRange;
  weight: FacilityRange;
}

const FACILITY_RANGES: Record<Tier, TierFacilityRanges> = {
  [Tier.Elite]: {
    stadium: { min: 9, max: 10 },
    practice: { min: 8, max: 9 },
    training: { min: 8, max: 10 },
    weight: { min: 8, max: 9 },
  },
  [Tier.Good]: {
    stadium: { min: 7, max: 9 },
    practice: { min: 7, max: 8 },
    training: { min: 7, max: 8 },
    weight: { min: 7, max: 8 },
  },
  [Tier.Average]: {
    stadium: { min: 5, max: 7 },
    practice: { min: 5, max: 7 },
    training: { min: 5, max: 7 },
    weight: { min: 5, max: 7 },
  },
  [Tier.BelowAverage]: {
    stadium: { min: 4, max: 6 },
    practice: { min: 4, max: 5 },
    training: { min: 4, max: 6 },
    weight: { min: 4, max: 5 },
  },
  [Tier.Rebuilding]: {
    stadium: { min: 3, max: 5 },
    practice: { min: 3, max: 4 },
    training: { min: 3, max: 5 },
    weight: { min: 3, max: 4 },
  },
};

// ============================================================================
// CLIMATE BY TEAM LOCATION
// ============================================================================

const TEAM_CLIMATE: Record<string, Climate> = {
  // Cold weather
  BOS: 'cold', PIT: 'cold', BAL: 'cold', PHI: 'cold',
  NYE: 'cold', BKN: 'cold', NWK: 'cold',
  CHI: 'cold', DET: 'cold', CLE: 'cold', IND: 'cold',
  SEA: 'cold', POR: 'cold', VAN: 'cold', DEN: 'cold',
  // Hot weather
  MIA: 'hot', ORL: 'hot', ATL: 'hot', CLT: 'hot',
  PHX: 'hot', LVA: 'hot', AUS: 'hot', HOU: 'hot', DAL: 'hot', SAN: 'hot',
  HON: 'hot',
  // Neutral
  WAS: 'neutral', LAL: 'neutral', SDS: 'neutral', SFO: 'neutral',
  OAK: 'neutral', SAC: 'neutral',
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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// STADIUM GENERATION
// ============================================================================

function generateStadium(teamId: string, tier: Tier): Stadium {
  const range = FACILITY_RANGES[tier].stadium;
  let rating = randomInRange(range.min, range.max);

  // Variance: some teams have standout or weak facilities
  if (Math.random() < 0.3) rating = clamp(rating + 1, 1, 10);
  if (Math.random() < 0.25) rating = clamp(rating - 1, 1, 10);

  const capacity = randomInRange(55000, 85000);
  const surface: SurfaceType = Math.random() < 0.6 ? 'turf' : 'grass';
  const climate = TEAM_CLIMATE[teamId] || 'neutral';

  // Domes more common in extreme climates
  let type: StadiumType = 'open';
  if (climate === 'cold' && Math.random() < 0.4) type = 'dome';
  if (climate === 'hot' && Math.random() < 0.5) type = Math.random() < 0.5 ? 'dome' : 'retractable';
  if (rating >= 9 && Math.random() < 0.6) type = 'retractable';

  const noiseLevel = clamp(rating + randomInRange(-1, 1), 1, 10);
  const luxurySuites = Math.round(50 + (rating / 10) * 100 + randomInRange(-10, 20));
  const yearBuilt = rating >= 9 ? randomInRange(2018, 2024) : randomInRange(1995, 2020);

  // Computed effects based on rating
  const homeAdvantage = rating >= 10 ? 6 : rating >= 8 ? 5 : rating >= 6 ? 4 : rating >= 4 ? 3 : 2;
  const attendance = rating >= 10 ? 100 : rating >= 8 ? 95 : rating >= 6 ? 85 : rating >= 4 ? 75 : 60;
  const revenue = rating >= 10 ? 50 : rating >= 8 ? 35 : rating >= 6 ? 25 : rating >= 4 ? 18 : 12;
  const moraleBonus = rating >= 10 ? 5 : rating >= 8 ? 3 : rating >= 6 ? 1 : rating >= 4 ? 0 : -5;

  return {
    rating,
    capacity,
    surface,
    type,
    climate,
    noiseLevel,
    luxurySuites,
    yearBuilt,
    homeAdvantage,
    attendance,
    revenue,
    moraleBonus,
  };
}

// ============================================================================
// PRACTICE FACILITY GENERATION
// ============================================================================

function generatePracticeFacility(tier: Tier): PracticeFacility {
  const range = FACILITY_RANGES[tier].practice;
  let rating = randomInRange(range.min, range.max);

  if (Math.random() < 0.3) rating = clamp(rating + 1, 1, 10);
  if (Math.random() < 0.25) rating = clamp(rating - 1, 1, 10);

  const practiceFields = clamp(Math.round(2 + (rating / 10) * 4), 2, 6);
  const filmRoomTech = clamp(rating + randomInRange(-1, 1), 1, 10);
  const meetingRooms = clamp(Math.round(5 + (rating / 10) * 10), 5, 15);
  const hasIndoor = rating >= 7 || Math.random() < 0.3;

  // Computed effects
  const xpGainBonus = rating >= 10 ? 30 : rating >= 8 ? 20 : rating >= 6 ? 12 : rating >= 4 ? 5 : 0;
  const injuryPrevention = rating >= 10 ? 20 : rating >= 8 ? 15 : rating >= 6 ? 10 : rating >= 4 ? 5 : 0;
  const schemeInstallWeeks = rating >= 10 ? 2 : rating >= 8 ? 3 : rating >= 6 ? 4 : rating >= 4 ? 5 : 6;

  return {
    rating,
    practiceFields,
    filmRoomTech,
    meetingRooms,
    hasIndoor,
    xpGainBonus,
    injuryPrevention,
    schemeInstallWeeks,
  };
}

// ============================================================================
// TRAINING ROOM GENERATION
// ============================================================================

function generateTrainingRoom(tier: Tier): TrainingRoom {
  const range = FACILITY_RANGES[tier].training;
  let rating = randomInRange(range.min, range.max);

  if (Math.random() < 0.3) rating = clamp(rating + 1, 1, 10);
  if (Math.random() < 0.25) rating = clamp(rating - 1, 1, 10);

  const treatmentRooms = clamp(Math.round(5 + (rating / 10) * 15), 5, 20);
  const hasTherapyPool = rating >= 6 || Math.random() < 0.2;
  const hasSportsLab = rating >= 8 || Math.random() < 0.15;

  // Computed effects
  const recoverySpeedBonus = rating >= 10 ? 40 : rating >= 8 ? 30 : rating >= 6 ? 20 : rating >= 4 ? 10 : 0;
  const injuryRateReduction = rating >= 10 ? 25 : rating >= 8 ? 18 : rating >= 6 ? 12 : rating >= 4 ? 6 : 0;
  const severityReduction = rating >= 10 ? 100 : rating >= 8 ? 50 : rating >= 6 ? 25 : rating >= 4 ? 10 : 0;
  const longevityBonus = rating >= 10 ? 2 : rating >= 8 ? 1.5 : rating >= 6 ? 1 : rating >= 4 ? 0.5 : 0;

  return {
    rating,
    treatmentRooms,
    hasTherapyPool,
    hasSportsLab,
    recoverySpeedBonus,
    injuryRateReduction,
    severityReduction,
    longevityBonus,
  };
}

// ============================================================================
// WEIGHT ROOM GENERATION
// ============================================================================

function generateWeightRoom(tier: Tier): WeightRoom {
  const range = FACILITY_RANGES[tier].weight;
  let rating = randomInRange(range.min, range.max);

  if (Math.random() < 0.3) rating = clamp(rating + 1, 1, 10);
  if (Math.random() < 0.25) rating = clamp(rating - 1, 1, 10);

  const equipmentQuality = clamp(rating + randomInRange(-1, 1), 1, 10);
  const spaceSqFt = Math.round(5000 + (rating / 10) * 15000);
  const cardioMachines = clamp(Math.round(20 + (rating / 10) * 30), 20, 50);
  const speedAgilityYards = clamp(Math.round(30 + (rating / 10) * 70), 30, 100);
  const hasRecoveryEquipment = rating >= 7 || Math.random() < 0.25;

  // Computed effects
  const physicalXpBonus = rating >= 10 ? 40 : rating >= 8 ? 30 : rating >= 6 ? 20 : rating >= 4 ? 10 : 0;
  const strengthPerSeason = rating >= 10 ? 2.0 : rating >= 8 ? 1.5 : rating >= 6 ? 1.0 : rating >= 4 ? 0.5 : 0.2;
  const speedPerSeason = rating >= 10 ? 1.5 : rating >= 8 ? 1.0 : rating >= 6 ? 0.7 : rating >= 4 ? 0.4 : 0.2;
  const injuryPrevention = rating >= 10 ? 15 : rating >= 8 ? 10 : rating >= 6 ? 7 : rating >= 4 ? 4 : 0;
  const ageDeclineReduction = rating >= 10 ? 30 : rating >= 8 ? 20 : rating >= 6 ? 12 : rating >= 4 ? 6 : 0;

  return {
    rating,
    equipmentQuality,
    spaceSqFt,
    cardioMachines,
    speedAgilityYards,
    hasRecoveryEquipment,
    physicalXpBonus,
    strengthPerSeason,
    speedPerSeason,
    injuryPrevention,
    ageDeclineReduction,
  };
}

// ============================================================================
// ASSIGN OWNER TIERS
// ============================================================================

function assignOwnerTiers(): Map<string, OwnerTier> {
  const ownerTiers = new Map<string, OwnerTier>();
  const shuffledTeams = shuffleArray(LEAGUE_TEAMS.map((t) => t.id));

  let teamIndex = 0;
  for (const { tier, count } of OWNER_TIER_DISTRIBUTION) {
    for (let i = 0; i < count && teamIndex < shuffledTeams.length; i++) {
      ownerTiers.set(shuffledTeams[teamIndex], tier);
      teamIndex++;
    }
  }

  return ownerTiers;
}

// ============================================================================
// CALCULATE FA APPEAL
// ============================================================================

function calculateFaAppeal(avgRating: number): number {
  if (avgRating >= 9.5) return 20;
  if (avgRating >= 9) return 15;
  if (avgRating >= 8) return 10;
  if (avgRating >= 7) return 5;
  if (avgRating >= 6) return 0;
  if (avgRating >= 5) return -5;
  return -12;
}

// ============================================================================
// CALCULATE MAINTENANCE COST
// ============================================================================

function calculateMaintenanceCost(rating: number): number {
  const roundedRating = Math.round(rating);
  return MAINTENANCE_COSTS[roundedRating] || 1;
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export function generateFacilities(teamTiers: Map<string, Tier>): LeagueFacilities {
  const ownerTiers = assignOwnerTiers();
  const teams: Record<string, TeamFacilities> = {};
  const allRatings: { teamId: string; rating: number }[] = [];

  for (const team of LEAGUE_TEAMS) {
    const tier = teamTiers.get(team.id) || Tier.Average;
    const ownerTier = ownerTiers.get(team.id) || 'moderate';
    const ownerConfig = OWNER_TIER_CONFIG[ownerTier];

    const stadium = generateStadium(team.id, tier);
    const practice = generatePracticeFacility(tier);
    const training = generateTrainingRoom(tier);
    const weight = generateWeightRoom(tier);

    const averageRating =
      Math.round(((stadium.rating + practice.rating + training.rating + weight.rating) / 4) * 10) / 10;

    const totalMaintenanceCost =
      calculateMaintenanceCost(stadium.rating) +
      calculateMaintenanceCost(practice.rating) +
      calculateMaintenanceCost(training.rating) +
      calculateMaintenanceCost(weight.rating);

    const faAppealBonus = calculateFaAppeal(averageRating);

    teams[team.id] = {
      teamId: team.id,
      ownerTier,
      annualBudget: ownerConfig.budget,
      upgradeFund: randomInRange(ownerConfig.upgradeFund[0], ownerConfig.upgradeFund[1]),
      stadium,
      practice,
      training,
      weight,
      averageRating,
      faAppealBonus,
      leagueRank: 0, // Will be set after sorting
      totalMaintenanceCost,
    };

    allRatings.push({ teamId: team.id, rating: averageRating });
  }

  // Calculate league rankings
  allRatings.sort((a, b) => b.rating - a.rating);
  allRatings.forEach((item, index) => {
    teams[item.teamId].leagueRank = index + 1;
  });

  return {
    teams,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

export function getFacilitiesStats(facilities: LeagueFacilities): FacilitiesStats {
  const teamList = Object.values(facilities.teams);

  let totalStadium = 0;
  let totalPractice = 0;
  let totalTraining = 0;
  let totalWeight = 0;
  let totalRevenue = 0;
  let eliteCount = 0;
  let goodCount = 0;
  let averageCount = 0;
  let poorCount = 0;

  const ownerTierCounts: Record<OwnerTier, number> = {
    wealthy: 0,
    solid: 0,
    moderate: 0,
    budget: 0,
    cheap: 0,
  };

  for (const team of teamList) {
    totalStadium += team.stadium.rating;
    totalPractice += team.practice.rating;
    totalTraining += team.training.rating;
    totalWeight += team.weight.rating;
    totalRevenue += team.stadium.revenue;
    ownerTierCounts[team.ownerTier]++;

    // Count facilities by quality (counting all 4 per team)
    const ratings = [team.stadium.rating, team.practice.rating, team.training.rating, team.weight.rating];
    for (const r of ratings) {
      if (r >= 9) eliteCount++;
      else if (r >= 7) goodCount++;
      else if (r >= 5) averageCount++;
      else poorCount++;
    }
  }

  const count = teamList.length;
  const sortedByRating = [...teamList].sort((a, b) => b.averageRating - a.averageRating);

  return {
    avgStadiumRating: Math.round((totalStadium / count) * 10) / 10,
    avgPracticeRating: Math.round((totalPractice / count) * 10) / 10,
    avgTrainingRating: Math.round((totalTraining / count) * 10) / 10,
    avgWeightRating: Math.round((totalWeight / count) * 10) / 10,
    avgOverallRating: Math.round(((totalStadium + totalPractice + totalTraining + totalWeight) / (count * 4)) * 10) / 10,
    eliteFacilities: eliteCount,
    goodFacilities: goodCount,
    averageFacilities: averageCount,
    poorFacilities: poorCount,
    ownerTierDistribution: ownerTierCounts,
    totalLeagueRevenue: totalRevenue,
    topTeams: sortedByRating.slice(0, 5).map((t) => ({ teamId: t.teamId, rating: t.averageRating })),
    bottomTeams: sortedByRating.slice(-5).reverse().map((t) => ({ teamId: t.teamId, rating: t.averageRating })),
  };
}

// Re-export for convenience
export { LEAGUE_TEAMS };
