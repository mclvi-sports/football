/**
 * Facilities System Types
 *
 * Types for team facilities following FINAL-facilities-system.md
 */

// ============================================================================
// FACILITY TYPES
// ============================================================================

export type FacilityType = 'stadium' | 'practice' | 'training' | 'weight';

export type OwnerTier = 'wealthy' | 'solid' | 'moderate' | 'budget' | 'cheap';

export type SurfaceType = 'grass' | 'turf';

export type StadiumType = 'dome' | 'retractable' | 'open';

export type Climate = 'cold' | 'hot' | 'neutral';

// ============================================================================
// STADIUM
// ============================================================================

export interface Stadium {
  rating: number; // 1-10
  capacity: number; // 55,000 - 85,000
  surface: SurfaceType;
  type: StadiumType;
  climate: Climate;
  noiseLevel: number; // 1-10
  luxurySuites: number; // 50-150+
  yearBuilt: number;
  // Computed effects
  homeAdvantage: number; // OVR bonus
  attendance: number; // percentage
  revenue: number; // millions per season
  moraleBonus: number; // percentage
}

// ============================================================================
// PRACTICE FACILITY
// ============================================================================

export interface PracticeFacility {
  rating: number; // 1-10
  practiceFields: number; // 2-6
  filmRoomTech: number; // 1-10
  meetingRooms: number; // 5-15
  hasIndoor: boolean;
  // Computed effects
  xpGainBonus: number; // percentage
  injuryPrevention: number; // percentage reduction
  schemeInstallWeeks: number; // games to install new scheme
}

// ============================================================================
// TRAINING ROOM (Medical)
// ============================================================================

export interface TrainingRoom {
  rating: number; // 1-10
  treatmentRooms: number; // 5-20
  hasTherapyPool: boolean;
  hasSportsLab: boolean;
  // Computed effects
  recoverySpeedBonus: number; // percentage faster
  injuryRateReduction: number; // percentage
  severityReduction: number; // percentage chance to reduce severity
  longevityBonus: number; // years added to career
}

// ============================================================================
// WEIGHT ROOM
// ============================================================================

export interface WeightRoom {
  rating: number; // 1-10
  equipmentQuality: number; // 1-10
  spaceSqFt: number; // 5,000 - 20,000
  cardioMachines: number; // 20-50
  speedAgilityYards: number; // 30-100
  hasRecoveryEquipment: boolean;
  // Computed effects
  physicalXpBonus: number; // percentage
  strengthPerSeason: number;
  speedPerSeason: number;
  injuryPrevention: number; // percentage
  ageDeclineReduction: number; // percentage
}

// ============================================================================
// TEAM FACILITIES
// ============================================================================

export interface TeamFacilities {
  teamId: string;
  ownerTier: OwnerTier;
  annualBudget: number; // millions
  upgradeFund: number; // millions
  stadium: Stadium;
  practice: PracticeFacility;
  training: TrainingRoom;
  weight: WeightRoom;
  // Computed
  averageRating: number;
  faAppealBonus: number; // percentage
  leagueRank: number; // 1-32
  totalMaintenanceCost: number; // millions per year
}

// ============================================================================
// LEAGUE FACILITIES
// ============================================================================

export interface LeagueFacilities {
  teams: Record<string, TeamFacilities>;
  generatedAt: string;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface FacilitiesStats {
  avgStadiumRating: number;
  avgPracticeRating: number;
  avgTrainingRating: number;
  avgWeightRating: number;
  avgOverallRating: number;
  eliteFacilities: number; // 9-10 rating
  goodFacilities: number; // 7-8 rating
  averageFacilities: number; // 5-6 rating
  poorFacilities: number; // 1-4 rating
  ownerTierDistribution: Record<OwnerTier, number>;
  totalLeagueRevenue: number;
  topTeams: { teamId: string; rating: number }[];
  bottomTeams: { teamId: string; rating: number }[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface FacilitiesGeneratorConfig {
  // Future: could add options for variance, etc.
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const OWNER_TIER_CONFIG: Record<OwnerTier, { budget: number; upgradeFund: [number, number] }> = {
  wealthy: { budget: 150, upgradeFund: [500, 700] },
  solid: { budget: 120, upgradeFund: [250, 400] },
  moderate: { budget: 90, upgradeFund: [100, 200] },
  budget: { budget: 70, upgradeFund: [50, 100] },
  cheap: { budget: 50, upgradeFund: [25, 50] },
};

export const OWNER_TIER_DISTRIBUTION: { tier: OwnerTier; count: number }[] = [
  { tier: 'wealthy', count: 4 },
  { tier: 'solid', count: 8 },
  { tier: 'moderate', count: 12 },
  { tier: 'budget', count: 6 },
  { tier: 'cheap', count: 2 },
];

export const MAINTENANCE_COSTS: Record<number, number> = {
  10: 5,
  9: 4,
  8: 3,
  7: 2.5,
  6: 2,
  5: 1.5,
  4: 1,
  3: 0.75,
  2: 0.5,
  1: 0.25,
};
