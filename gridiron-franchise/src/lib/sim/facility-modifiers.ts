/**
 * Facility Modifiers
 *
 * Applies facility effects to game simulation.
 * Based on the facilities system.
 */

import {
  TeamFacilities,
  Stadium,
  PracticeFacility,
  TrainingRoom,
  WeightRoom,
} from '../facilities/types';

// ============================================================================
// STADIUM EFFECTS
// ============================================================================

/**
 * Calculate stadium home advantage bonus
 * Rating 1-10 maps to 0-5 OVR bonus
 */
export function calculateHomeAdvantageBonus(stadium: Stadium): number {
  // Base bonus from rating (0-3)
  const ratingBonus = (stadium.rating / 10) * 3;

  // Noise level adds additional bonus (0-2)
  const noiseBonus = (stadium.noiseLevel / 10) * 2;

  // Dome bonus (climate controlled = consistent conditions)
  const domeBonus = stadium.type === 'dome' ? 0.5 : 0;

  return Math.round((ratingBonus + noiseBonus + domeBonus) * 10) / 10;
}

/**
 * Calculate weather protection from stadium type
 */
export function getWeatherProtection(stadium: Stadium): boolean {
  return stadium.type === 'dome' || stadium.type === 'retractable';
}

/**
 * Calculate surface injury modifier
 * Turf has slightly higher injury risk
 */
export function getSurfaceInjuryModifier(stadium: Stadium): number {
  return stadium.surface === 'turf' ? 0.02 : 0; // 2% higher injury chance on turf
}

/**
 * Calculate attendance-based morale bonus
 */
export function getAttendanceMoraleBonus(stadium: Stadium): number {
  // Full attendance (95%+) gives morale boost
  if (stadium.attendance >= 95) return 0.05;
  if (stadium.attendance >= 85) return 0.02;
  if (stadium.attendance < 70) return -0.02;
  return 0;
}

// ============================================================================
// PRACTICE FACILITY EFFECTS
// ============================================================================

/**
 * Calculate XP gain bonus from practice facility
 * Rating 1-10 maps to 0-20% bonus
 */
export function calculatePracticeXpBonus(practice: PracticeFacility): number {
  return practice.xpGainBonus || (practice.rating / 10) * 0.20;
}

/**
 * Calculate scheme installation speed
 * Better facilities = faster scheme learning
 */
export function getSchemeInstallWeeks(practice: PracticeFacility): number {
  return practice.schemeInstallWeeks || Math.max(1, 5 - Math.floor(practice.rating / 2));
}

/**
 * Calculate injury prevention from practice facility
 */
export function getPracticeInjuryPrevention(practice: PracticeFacility): number {
  return practice.injuryPrevention || (practice.rating / 10) * 0.10;
}

// ============================================================================
// TRAINING ROOM EFFECTS
// ============================================================================

/**
 * Calculate injury rate reduction from training room
 * Rating 1-10 maps to 0-15% reduction
 */
export function calculateInjuryRateReduction(training: TrainingRoom): number {
  let reduction = training.injuryRateReduction || (training.rating / 10) * 0.15;

  // Therapy pool adds extra recovery
  if (training.hasTherapyPool) reduction += 0.03;

  // Sports lab adds injury prevention
  if (training.hasSportsLab) reduction += 0.02;

  return reduction;
}

/**
 * Calculate recovery speed bonus
 * Rating 1-10 maps to 0-30% faster recovery
 */
export function calculateRecoverySpeedBonus(training: TrainingRoom): number {
  return training.recoverySpeedBonus || (training.rating / 10) * 0.30;
}

/**
 * Calculate injury severity reduction chance
 */
export function getInjurySeverityReduction(training: TrainingRoom): number {
  return training.severityReduction || (training.rating / 10) * 0.20;
}

/**
 * Calculate longevity bonus (years added to career)
 */
export function getLongevityBonus(training: TrainingRoom): number {
  return training.longevityBonus || Math.floor(training.rating / 4);
}

// ============================================================================
// WEIGHT ROOM EFFECTS
// ============================================================================

/**
 * Calculate physical attribute XP bonus
 * Rating 1-10 maps to 0-15% bonus for physical attributes
 */
export function calculatePhysicalXpBonus(weight: WeightRoom): number {
  return weight.physicalXpBonus || (weight.rating / 10) * 0.15;
}

/**
 * Calculate strength per season bonus
 * Rating 1-10 maps to 0-2 strength points per season
 */
export function getStrengthPerSeason(weight: WeightRoom): number {
  return weight.strengthPerSeason ?? Math.floor(weight.rating / 5);
}

/**
 * Calculate speed per season bonus
 * Rating 1-10 maps to 0-1 speed points per season
 */
export function getSpeedPerSeason(weight: WeightRoom): number {
  return weight.speedPerSeason ?? Math.floor(weight.rating / 7);
}

/**
 * Calculate age decline reduction
 * Better weight room = slower physical decline with age
 */
export function getAgeDeclineReduction(weight: WeightRoom): number {
  return weight.ageDeclineReduction || (weight.rating / 10) * 0.20;
}

/**
 * Calculate weight room injury prevention
 */
export function getWeightRoomInjuryPrevention(weight: WeightRoom): number {
  return weight.injuryPrevention || (weight.rating / 10) * 0.05;
}

// ============================================================================
// COMBINED GAME MODIFIERS
// ============================================================================

export interface FacilityGameModifiers {
  // Stadium effects
  homeAdvantageBonus: number;
  weatherProtected: boolean;
  surfaceInjuryModifier: number;
  attendanceMoraleBonus: number;

  // Injury effects (combined)
  totalInjuryReduction: number;
  recoverSpeedBonus: number;
  severityReduction: number;

  // Player morale
  moraleBonus: number;
}

/**
 * Calculate all facility-related modifiers for a game
 */
export function calculateFacilityGameModifiers(
  facilities: TeamFacilities,
  isHomeGame: boolean
): FacilityGameModifiers {
  const modifiers: FacilityGameModifiers = {
    homeAdvantageBonus: 0,
    weatherProtected: false,
    surfaceInjuryModifier: 0,
    attendanceMoraleBonus: 0,
    totalInjuryReduction: 0,
    recoverSpeedBonus: 0,
    severityReduction: 0,
    moraleBonus: 0,
  };

  // Stadium effects only apply for home games
  if (isHomeGame) {
    modifiers.homeAdvantageBonus = calculateHomeAdvantageBonus(facilities.stadium);
    modifiers.weatherProtected = getWeatherProtection(facilities.stadium);
    modifiers.surfaceInjuryModifier = getSurfaceInjuryModifier(facilities.stadium);
    modifiers.attendanceMoraleBonus = getAttendanceMoraleBonus(facilities.stadium);
    modifiers.moraleBonus += facilities.stadium.moraleBonus || 0;
  }

  // Training room effects always apply
  modifiers.totalInjuryReduction = calculateInjuryRateReduction(facilities.training);
  modifiers.recoverSpeedBonus = calculateRecoverySpeedBonus(facilities.training);
  modifiers.severityReduction = getInjurySeverityReduction(facilities.training);

  // Weight room injury prevention stacks
  modifiers.totalInjuryReduction += getWeightRoomInjuryPrevention(facilities.weight);

  // Practice facility injury prevention stacks
  modifiers.totalInjuryReduction += getPracticeInjuryPrevention(facilities.practice);

  return modifiers;
}

// ============================================================================
// SEASONAL EFFECTS
// ============================================================================

export interface FacilitySeasonalEffects {
  // XP bonuses
  baseXpBonus: number;
  physicalXpBonus: number;

  // Attribute growth
  strengthPerSeason: number;
  speedPerSeason: number;

  // Longevity
  longevityBonus: number;
  ageDeclineReduction: number;

  // Scheme
  schemeInstallWeeks: number;

  // FA appeal
  faAppealBonus: number;
}

/**
 * Calculate seasonal effects from facilities
 * These apply over the course of a season, not per game
 */
export function calculateFacilitySeasonalEffects(
  facilities: TeamFacilities
): FacilitySeasonalEffects {
  return {
    // XP bonuses
    baseXpBonus: calculatePracticeXpBonus(facilities.practice),
    physicalXpBonus: calculatePhysicalXpBonus(facilities.weight),

    // Attribute growth
    strengthPerSeason: getStrengthPerSeason(facilities.weight),
    speedPerSeason: getSpeedPerSeason(facilities.weight),

    // Longevity
    longevityBonus: getLongevityBonus(facilities.training),
    ageDeclineReduction: getAgeDeclineReduction(facilities.weight),

    // Scheme
    schemeInstallWeeks: getSchemeInstallWeeks(facilities.practice),

    // FA appeal
    faAppealBonus: facilities.faAppealBonus || (facilities.averageRating / 10) * 0.15,
  };
}

// ============================================================================
// REVENUE CALCULATION
// ============================================================================

/**
 * Calculate game day revenue
 */
export function calculateGameDayRevenue(stadium: Stadium): number {
  // Base revenue from attendance
  const attendanceRevenue = (stadium.attendance / 100) * (stadium.capacity / 1000) * 0.1;

  // Luxury suite revenue
  const suiteRevenue = stadium.luxurySuites * 0.02;

  return attendanceRevenue + suiteRevenue;
}

/**
 * Calculate season revenue from facilities
 */
export function calculateSeasonRevenue(facilities: TeamFacilities): number {
  // 8-9 home games per season
  const homeGames = 8.5;
  const gameRevenue = calculateGameDayRevenue(facilities.stadium) * homeGames;

  // Additional revenue from facility rating
  const facilityRevenue = facilities.averageRating * 2;

  return gameRevenue + facilityRevenue;
}
