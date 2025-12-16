/**
 * Age Decline Module
 * WO-SIM-INTEGRATION-OVERHAUL-001 | AGE-001, AGE-002, AGE-003
 *
 * Position-specific age decline curves for player attribute regression.
 * Integrates with facility ageDeclineReduction bonus.
 */

import { Position } from '../types';

// =============================================================================
// POSITION-SPECIFIC PEAK AGES (AGE-001)
// =============================================================================

/**
 * Position peak ages - when physical decline begins
 * Based on NFL career duration data
 */
export const POSITION_PEAK_AGES: Record<Position, { peakStart: number; peakEnd: number; retirementAge: number }> = {
  [Position.QB]: { peakStart: 27, peakEnd: 35, retirementAge: 40 },
  [Position.RB]: { peakStart: 24, peakEnd: 27, retirementAge: 32 },
  [Position.WR]: { peakStart: 25, peakEnd: 30, retirementAge: 35 },
  [Position.TE]: { peakStart: 26, peakEnd: 31, retirementAge: 36 },
  [Position.LT]: { peakStart: 26, peakEnd: 32, retirementAge: 37 },
  [Position.LG]: { peakStart: 26, peakEnd: 32, retirementAge: 37 },
  [Position.C]: { peakStart: 26, peakEnd: 33, retirementAge: 38 },
  [Position.RG]: { peakStart: 26, peakEnd: 32, retirementAge: 37 },
  [Position.RT]: { peakStart: 26, peakEnd: 32, retirementAge: 37 },
  [Position.DE]: { peakStart: 25, peakEnd: 29, retirementAge: 34 },
  [Position.DT]: { peakStart: 26, peakEnd: 30, retirementAge: 35 },
  [Position.MLB]: { peakStart: 26, peakEnd: 30, retirementAge: 34 },
  [Position.OLB]: { peakStart: 25, peakEnd: 29, retirementAge: 33 },
  [Position.CB]: { peakStart: 25, peakEnd: 29, retirementAge: 33 },
  [Position.FS]: { peakStart: 26, peakEnd: 30, retirementAge: 34 },
  [Position.SS]: { peakStart: 26, peakEnd: 30, retirementAge: 34 },
  [Position.K]: { peakStart: 28, peakEnd: 38, retirementAge: 45 },
  [Position.P]: { peakStart: 28, peakEnd: 38, retirementAge: 45 },
};

// =============================================================================
// AGE-001: DECLINE CURVES
// =============================================================================

export interface AgeDeclineResult {
  physicalDecline: number;    // Negative points per year for physical attrs
  technicalDecline: number;   // Decline for technical attrs (slower)
  mentalChange: number;       // Can be positive (experience gains)
  isInPrimeYears: boolean;    // True if player is in peak performance window
  yearsUntilDecline: number;  // Years until decline starts
  declinePhase: 'growth' | 'prime' | 'early_decline' | 'steep_decline' | 'twilight';
}

/**
 * AGE-001: Calculate position-specific age decline
 */
export function calculatePositionAgeDecline(
  position: Position,
  age: number,
  facilityAgeReduction: number = 0 // AGE-003: 0-0.30 reduction from facilities
): AgeDeclineResult {
  const curve = POSITION_PEAK_AGES[position];
  const { peakStart, peakEnd, retirementAge } = curve;

  // Determine which phase the player is in
  let declinePhase: AgeDeclineResult['declinePhase'];
  let physicalDecline = 0;
  let technicalDecline = 0;
  let mentalChange = 0;

  if (age < peakStart) {
    // Growth phase - still improving
    declinePhase = 'growth';
    physicalDecline = 0;
    technicalDecline = 0;
    mentalChange = 1; // Mental attributes improve with experience
  } else if (age <= peakEnd) {
    // Prime years - minimal decline
    declinePhase = 'prime';
    physicalDecline = 0;
    technicalDecline = 0;
    mentalChange = 0.5; // Still gaining experience
  } else if (age <= peakEnd + 3) {
    // Early decline - gradual drop
    declinePhase = 'early_decline';
    physicalDecline = -1;
    technicalDecline = 0;
    mentalChange = 0;
  } else if (age <= retirementAge - 2) {
    // Steep decline - significant drop
    declinePhase = 'steep_decline';
    const yearsIntoDeline = age - (peakEnd + 3);
    physicalDecline = -2 - Math.floor(yearsIntoDeline / 2); // Gets worse over time
    technicalDecline = -1;
    mentalChange = 0;
  } else {
    // Twilight - career ending
    declinePhase = 'twilight';
    physicalDecline = -3;
    technicalDecline = -2;
    mentalChange = -1; // Even mental starts declining
  }

  // AGE-003: Apply facility age decline reduction (reduces negative decline)
  if (physicalDecline < 0 && facilityAgeReduction > 0) {
    physicalDecline = Math.round(physicalDecline * (1 - facilityAgeReduction));
  }
  if (technicalDecline < 0 && facilityAgeReduction > 0) {
    technicalDecline = Math.round(technicalDecline * (1 - facilityAgeReduction));
  }

  return {
    physicalDecline,
    technicalDecline,
    mentalChange,
    isInPrimeYears: declinePhase === 'prime' || declinePhase === 'growth',
    yearsUntilDecline: Math.max(0, peakEnd - age),
    declinePhase,
  };
}

// =============================================================================
// AGE-002: APPLY TO PLAYER ATTRIBUTES
// =============================================================================

/**
 * Physical attributes that decline with age
 */
export const PHYSICAL_ATTRIBUTES = [
  'speed', 'acceleration', 'agility', 'strength', 'jumping',
  'stamina', 'injury', 'toughness',
];

/**
 * Technical attributes (decline slower)
 */
export const TECHNICAL_ATTRIBUTES = [
  'throwPower', 'throwAccuracyShort', 'throwAccuracyMid', 'throwAccuracyDeep',
  'throwOnRun', 'playAction', 'carrying', 'breakTackle', 'stiffArm',
  'catchInTraffic', 'spectacularCatch', 'release', 'routeRunning',
  'runBlocking', 'passBlocking', 'impact', 'tackle', 'hitPower',
  'blockShedding', 'pursuit', 'manCoverage', 'zoneCoverage', 'press',
  'kickPower', 'kickAccuracy',
];

/**
 * Mental attributes (can improve with age)
 */
export const MENTAL_ATTRIBUTES = [
  'awareness', 'playRecognition', 'bcVision', 'leadBlock',
];

export interface AttributeDecline {
  attribute: string;
  oldValue: number;
  newValue: number;
  changeAmount: number;
}

/**
 * AGE-002: Apply age decline to player attributes
 * Returns list of attribute changes
 */
export function applyAgeDecline(
  position: Position,
  age: number,
  attributes: Record<string, number>,
  facilityAgeReduction: number = 0
): AttributeDecline[] {
  const decline = calculatePositionAgeDecline(position, age, facilityAgeReduction);
  const changes: AttributeDecline[] = [];

  // Apply physical decline
  if (decline.physicalDecline !== 0) {
    for (const attr of PHYSICAL_ATTRIBUTES) {
      if (attributes[attr] !== undefined) {
        const oldValue = attributes[attr];
        const newValue = Math.max(40, Math.min(99, oldValue + decline.physicalDecline));
        if (newValue !== oldValue) {
          changes.push({
            attribute: attr,
            oldValue,
            newValue,
            changeAmount: decline.physicalDecline,
          });
        }
      }
    }
  }

  // Apply technical decline
  if (decline.technicalDecline !== 0) {
    for (const attr of TECHNICAL_ATTRIBUTES) {
      if (attributes[attr] !== undefined) {
        const oldValue = attributes[attr];
        const newValue = Math.max(40, Math.min(99, oldValue + decline.technicalDecline));
        if (newValue !== oldValue) {
          changes.push({
            attribute: attr,
            oldValue,
            newValue,
            changeAmount: decline.technicalDecline,
          });
        }
      }
    }
  }

  // Apply mental change (can be positive)
  if (decline.mentalChange !== 0) {
    for (const attr of MENTAL_ATTRIBUTES) {
      if (attributes[attr] !== undefined) {
        const oldValue = attributes[attr];
        const change = Math.round(decline.mentalChange);
        const newValue = Math.max(40, Math.min(99, oldValue + change));
        if (newValue !== oldValue) {
          changes.push({
            attribute: attr,
            oldValue,
            newValue,
            changeAmount: change,
          });
        }
      }
    }
  }

  return changes;
}

/**
 * Get descriptive string for decline phase
 */
export function getDeclinePhaseDescription(phase: AgeDeclineResult['declinePhase']): string {
  switch (phase) {
    case 'growth': return 'Still developing';
    case 'prime': return 'Prime years';
    case 'early_decline': return 'Early decline';
    case 'steep_decline': return 'Significant decline';
    case 'twilight': return 'Career twilight';
  }
}

/**
 * Estimate career years remaining based on position and age
 */
export function estimateCareerYearsRemaining(position: Position, age: number): number {
  const { retirementAge } = POSITION_PEAK_AGES[position];
  return Math.max(0, retirementAge - age);
}
