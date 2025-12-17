/**
 * NFL Combine Measurables - Position-specific ranges for all athletic tests
 *
 * Complete combine testing data including:
 * - Physical measurements: arm length, hand size, wingspan
 * - Athletic tests: vertical jump, broad jump, 3-cone, 20-yard shuttle, bench press
 *
 * Source: NFL Combine official data, DRAFT-SYSTEM-ENHANCED.md
 */

import { Position } from '../types';

/**
 * Range interface for numeric measurements
 */
export interface MeasurableRange {
  min: number;
  max: number;
  elite?: number; // Elite threshold (top ~10%)
}

/**
 * Complete combine measurables ranges by position
 */
export interface CombineMeasurablesRanges {
  // Physical measurements
  armLength: MeasurableRange;      // inches (30-36")
  handSize: MeasurableRange;       // inches (8.5-11")
  wingspan: MeasurableRange;       // inches (72-86")
  // Athletic tests
  verticalJump: MeasurableRange;   // inches
  broadJump: MeasurableRange;      // inches
  threeCone: MeasurableRange;      // seconds (lower is better)
  twentyShuttle: MeasurableRange;  // seconds (lower is better)
  benchPress: MeasurableRange;     // reps at 225 lbs
}

/**
 * Position-specific combine measurable ranges
 * Based on NFL Combine historical data
 */
export const COMBINE_MEASURABLES_BY_POSITION: Record<Position, CombineMeasurablesRanges> = {
  // ============================================================================
  // QUARTERBACKS
  // ============================================================================
  [Position.QB]: {
    armLength: { min: 31.0, max: 34.5, elite: 33.5 },
    handSize: { min: 9.0, max: 10.5, elite: 10.0 },
    wingspan: { min: 74, max: 82, elite: 80 },
    verticalJump: { min: 26, max: 38, elite: 35 },
    broadJump: { min: 100, max: 124, elite: 118 },
    threeCone: { min: 6.70, max: 7.40, elite: 6.90 },
    twentyShuttle: { min: 4.10, max: 4.50, elite: 4.20 },
    benchPress: { min: 10, max: 22, elite: 20 },
  },

  // ============================================================================
  // RUNNING BACKS
  // ============================================================================
  [Position.RB]: {
    armLength: { min: 30.0, max: 33.5, elite: 32.5 },
    handSize: { min: 8.5, max: 10.5, elite: 10.0 },
    wingspan: { min: 72, max: 80, elite: 78 },
    verticalJump: { min: 32, max: 42, elite: 40 },
    broadJump: { min: 112, max: 132, elite: 128 },
    threeCone: { min: 6.60, max: 7.30, elite: 6.80 },
    twentyShuttle: { min: 4.00, max: 4.40, elite: 4.10 },
    benchPress: { min: 14, max: 28, elite: 24 },
  },

  // ============================================================================
  // WIDE RECEIVERS
  // ============================================================================
  [Position.WR]: {
    armLength: { min: 30.5, max: 34.5, elite: 33.5 },
    handSize: { min: 8.5, max: 10.5, elite: 10.0 },
    wingspan: { min: 73, max: 84, elite: 81 },
    verticalJump: { min: 32, max: 44, elite: 41 },
    broadJump: { min: 116, max: 136, elite: 132 },
    threeCone: { min: 6.50, max: 7.20, elite: 6.70 },
    twentyShuttle: { min: 3.95, max: 4.35, elite: 4.05 },
    benchPress: { min: 8, max: 22, elite: 18 },
  },

  // ============================================================================
  // TIGHT ENDS
  // ============================================================================
  [Position.TE]: {
    armLength: { min: 32.0, max: 35.5, elite: 34.5 },
    handSize: { min: 9.0, max: 11.0, elite: 10.5 },
    wingspan: { min: 77, max: 86, elite: 83 },
    verticalJump: { min: 30, max: 40, elite: 37 },
    broadJump: { min: 108, max: 128, elite: 122 },
    threeCone: { min: 6.80, max: 7.50, elite: 7.00 },
    twentyShuttle: { min: 4.15, max: 4.55, elite: 4.25 },
    benchPress: { min: 16, max: 30, elite: 26 },
  },

  // ============================================================================
  // OFFENSIVE TACKLES
  // ============================================================================
  [Position.LT]: {
    armLength: { min: 33.0, max: 36.0, elite: 35.0 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 80, max: 88, elite: 85 },
    verticalJump: { min: 24, max: 34, elite: 32 },
    broadJump: { min: 96, max: 116, elite: 110 },
    threeCone: { min: 7.30, max: 8.10, elite: 7.50 },
    twentyShuttle: { min: 4.50, max: 5.00, elite: 4.60 },
    benchPress: { min: 20, max: 36, elite: 32 },
  },
  [Position.RT]: {
    armLength: { min: 33.0, max: 36.0, elite: 35.0 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 80, max: 88, elite: 85 },
    verticalJump: { min: 24, max: 34, elite: 32 },
    broadJump: { min: 96, max: 116, elite: 110 },
    threeCone: { min: 7.30, max: 8.10, elite: 7.50 },
    twentyShuttle: { min: 4.50, max: 5.00, elite: 4.60 },
    benchPress: { min: 20, max: 36, elite: 32 },
  },

  // ============================================================================
  // INTERIOR OFFENSIVE LINE
  // ============================================================================
  [Position.LG]: {
    armLength: { min: 32.0, max: 35.0, elite: 34.0 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 78, max: 86, elite: 83 },
    verticalJump: { min: 24, max: 32, elite: 30 },
    broadJump: { min: 94, max: 112, elite: 106 },
    threeCone: { min: 7.40, max: 8.20, elite: 7.60 },
    twentyShuttle: { min: 4.55, max: 5.10, elite: 4.70 },
    benchPress: { min: 22, max: 40, elite: 35 },
  },
  [Position.C]: {
    armLength: { min: 31.5, max: 34.5, elite: 33.5 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 77, max: 84, elite: 81 },
    verticalJump: { min: 24, max: 32, elite: 30 },
    broadJump: { min: 94, max: 112, elite: 106 },
    threeCone: { min: 7.35, max: 8.15, elite: 7.55 },
    twentyShuttle: { min: 4.50, max: 5.05, elite: 4.65 },
    benchPress: { min: 22, max: 38, elite: 33 },
  },
  [Position.RG]: {
    armLength: { min: 32.0, max: 35.0, elite: 34.0 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 78, max: 86, elite: 83 },
    verticalJump: { min: 24, max: 32, elite: 30 },
    broadJump: { min: 94, max: 112, elite: 106 },
    threeCone: { min: 7.40, max: 8.20, elite: 7.60 },
    twentyShuttle: { min: 4.55, max: 5.10, elite: 4.70 },
    benchPress: { min: 22, max: 40, elite: 35 },
  },

  // ============================================================================
  // DEFENSIVE ENDS
  // ============================================================================
  [Position.DE]: {
    armLength: { min: 32.5, max: 35.5, elite: 34.5 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 79, max: 86, elite: 84 },
    verticalJump: { min: 30, max: 40, elite: 38 },
    broadJump: { min: 108, max: 128, elite: 122 },
    threeCone: { min: 6.90, max: 7.60, elite: 7.10 },
    twentyShuttle: { min: 4.20, max: 4.60, elite: 4.30 },
    benchPress: { min: 20, max: 35, elite: 30 },
  },

  // ============================================================================
  // DEFENSIVE TACKLES
  // ============================================================================
  [Position.DT]: {
    armLength: { min: 32.5, max: 35.5, elite: 34.5 },
    handSize: { min: 9.5, max: 11.0, elite: 10.5 },
    wingspan: { min: 79, max: 86, elite: 84 },
    verticalJump: { min: 26, max: 36, elite: 33 },
    broadJump: { min: 100, max: 118, elite: 112 },
    threeCone: { min: 7.20, max: 8.00, elite: 7.40 },
    twentyShuttle: { min: 4.40, max: 4.90, elite: 4.55 },
    benchPress: { min: 24, max: 44, elite: 38 },
  },

  // ============================================================================
  // LINEBACKERS
  // ============================================================================
  [Position.MLB]: {
    armLength: { min: 31.5, max: 34.5, elite: 33.5 },
    handSize: { min: 9.0, max: 10.5, elite: 10.0 },
    wingspan: { min: 76, max: 83, elite: 80 },
    verticalJump: { min: 32, max: 42, elite: 39 },
    broadJump: { min: 112, max: 130, elite: 124 },
    threeCone: { min: 6.80, max: 7.50, elite: 7.00 },
    twentyShuttle: { min: 4.15, max: 4.50, elite: 4.25 },
    benchPress: { min: 18, max: 32, elite: 28 },
  },
  [Position.OLB]: {
    armLength: { min: 32.0, max: 35.0, elite: 34.0 },
    handSize: { min: 9.0, max: 10.5, elite: 10.0 },
    wingspan: { min: 77, max: 84, elite: 81 },
    verticalJump: { min: 32, max: 42, elite: 39 },
    broadJump: { min: 114, max: 132, elite: 126 },
    threeCone: { min: 6.75, max: 7.45, elite: 6.95 },
    twentyShuttle: { min: 4.10, max: 4.45, elite: 4.20 },
    benchPress: { min: 18, max: 32, elite: 28 },
  },

  // ============================================================================
  // CORNERBACKS
  // ============================================================================
  [Position.CB]: {
    armLength: { min: 30.5, max: 34.0, elite: 33.0 },
    handSize: { min: 8.5, max: 10.0, elite: 9.5 },
    wingspan: { min: 73, max: 81, elite: 79 },
    verticalJump: { min: 34, max: 44, elite: 42 },
    broadJump: { min: 120, max: 140, elite: 134 },
    threeCone: { min: 6.60, max: 7.20, elite: 6.80 },
    twentyShuttle: { min: 3.95, max: 4.30, elite: 4.05 },
    benchPress: { min: 8, max: 20, elite: 17 },
  },

  // ============================================================================
  // SAFETIES
  // ============================================================================
  [Position.FS]: {
    armLength: { min: 31.0, max: 34.0, elite: 33.0 },
    handSize: { min: 8.5, max: 10.0, elite: 9.5 },
    wingspan: { min: 74, max: 82, elite: 79 },
    verticalJump: { min: 34, max: 44, elite: 41 },
    broadJump: { min: 118, max: 136, elite: 130 },
    threeCone: { min: 6.70, max: 7.30, elite: 6.90 },
    twentyShuttle: { min: 4.00, max: 4.35, elite: 4.10 },
    benchPress: { min: 10, max: 22, elite: 18 },
  },
  [Position.SS]: {
    armLength: { min: 31.0, max: 34.0, elite: 33.0 },
    handSize: { min: 9.0, max: 10.5, elite: 10.0 },
    wingspan: { min: 75, max: 82, elite: 80 },
    verticalJump: { min: 32, max: 42, elite: 39 },
    broadJump: { min: 116, max: 132, elite: 126 },
    threeCone: { min: 6.75, max: 7.35, elite: 6.95 },
    twentyShuttle: { min: 4.05, max: 4.40, elite: 4.15 },
    benchPress: { min: 12, max: 24, elite: 20 },
  },

  // ============================================================================
  // SPECIAL TEAMS (Kickers & Punters - limited athletic testing)
  // ============================================================================
  [Position.K]: {
    armLength: { min: 30.0, max: 33.0, elite: 32.0 },
    handSize: { min: 8.5, max: 10.0, elite: 9.5 },
    wingspan: { min: 72, max: 78, elite: 76 },
    verticalJump: { min: 24, max: 34, elite: 31 },
    broadJump: { min: 96, max: 116, elite: 110 },
    threeCone: { min: 7.00, max: 7.80, elite: 7.30 },
    twentyShuttle: { min: 4.30, max: 4.80, elite: 4.50 },
    benchPress: { min: 6, max: 16, elite: 14 },
  },
  [Position.P]: {
    armLength: { min: 30.5, max: 34.0, elite: 32.5 },
    handSize: { min: 8.5, max: 10.0, elite: 9.5 },
    wingspan: { min: 73, max: 80, elite: 77 },
    verticalJump: { min: 26, max: 36, elite: 33 },
    broadJump: { min: 100, max: 120, elite: 114 },
    threeCone: { min: 6.90, max: 7.70, elite: 7.20 },
    twentyShuttle: { min: 4.25, max: 4.75, elite: 4.45 },
    benchPress: { min: 8, max: 18, elite: 15 },
  },
};

/**
 * Elite threshold descriptors for UI display
 */
export const ELITE_THRESHOLDS = {
  fortyYard: {
    skill: 4.40,     // WR, RB, CB, S
    bigSkill: 4.55,  // TE, LB
    lineman: 4.90,   // OL, DL
  },
  verticalJump: 36,    // inches - elite across positions
  broadJump: 120,      // inches (10 feet)
  threeCone: 7.00,     // seconds - elite across positions
  twentyShuttle: 4.20, // seconds - elite across positions
  benchPress: 25,      // reps - varies significantly by position
};

/**
 * Test descriptions for UI display
 */
export const COMBINE_TEST_INFO: Record<string, { name: string; unit: string; description: string; lowerIsBetter: boolean }> = {
  armLength: {
    name: 'Arm Length',
    unit: '"',
    description: 'Measured from shoulder to fingertip',
    lowerIsBetter: false,
  },
  handSize: {
    name: 'Hand Size',
    unit: '"',
    description: 'Thumb to pinky spread',
    lowerIsBetter: false,
  },
  wingspan: {
    name: 'Wingspan',
    unit: '"',
    description: 'Fingertip to fingertip with arms extended',
    lowerIsBetter: false,
  },
  verticalJump: {
    name: 'Vertical Jump',
    unit: '"',
    description: 'Standing vertical leap',
    lowerIsBetter: false,
  },
  broadJump: {
    name: 'Broad Jump',
    unit: '"',
    description: 'Standing horizontal jump',
    lowerIsBetter: false,
  },
  threeCone: {
    name: '3-Cone Drill',
    unit: 's',
    description: 'L-shaped agility drill measuring change of direction',
    lowerIsBetter: true,
  },
  twentyShuttle: {
    name: '20-Yard Shuttle',
    unit: 's',
    description: 'Short shuttle measuring lateral quickness',
    lowerIsBetter: true,
  },
  benchPress: {
    name: 'Bench Press',
    unit: ' reps',
    description: 'Repetitions at 225 lbs',
    lowerIsBetter: false,
  },
};

/**
 * Generate random combine measurables for a position
 */
export function generateCombineMeasurables(
  position: Position,
  randomFn: () => number = Math.random
): {
  armLength: number;
  handSize: number;
  wingspan: number;
  verticalJump: number;
  broadJump: number;
  threeCone: number;
  twentyShuttle: number;
  benchPress: number;
} {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[position];

  // Helper to generate within range with optional skew toward elite
  const generate = (range: MeasurableRange, decimals: number = 1): number => {
    const value = range.min + randomFn() * (range.max - range.min);
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  };

  return {
    armLength: generate(ranges.armLength, 1),
    handSize: generate(ranges.handSize, 2),
    wingspan: Math.round(ranges.wingspan.min + randomFn() * (ranges.wingspan.max - ranges.wingspan.min)),
    verticalJump: Math.round(ranges.verticalJump.min + randomFn() * (ranges.verticalJump.max - ranges.verticalJump.min)),
    broadJump: Math.round(ranges.broadJump.min + randomFn() * (ranges.broadJump.max - ranges.broadJump.min)),
    threeCone: generate(ranges.threeCone, 2),
    twentyShuttle: generate(ranges.twentyShuttle, 2),
    benchPress: Math.round(ranges.benchPress.min + randomFn() * (ranges.benchPress.max - ranges.benchPress.min)),
  };
}

/**
 * Check if a measurable is elite for the position
 */
export function isEliteMeasurable(
  position: Position,
  measurable: keyof CombineMeasurablesRanges,
  value: number
): boolean {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[position];
  const range = ranges[measurable];

  if (!range.elite) return false;

  // For timed drills, lower is better
  const lowerIsBetter = measurable === 'threeCone' || measurable === 'twentyShuttle';

  if (lowerIsBetter) {
    return value <= range.elite;
  }
  return value >= range.elite;
}

/**
 * Calculate a percentile for a measurable value (0-100)
 */
export function getMeasurablePercentile(
  position: Position,
  measurable: keyof CombineMeasurablesRanges,
  value: number
): number {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[position];
  const range = ranges[measurable];

  // For timed drills, lower is better (invert the percentile)
  const lowerIsBetter = measurable === 'threeCone' || measurable === 'twentyShuttle';

  let percentile: number;
  if (lowerIsBetter) {
    percentile = 100 - ((value - range.min) / (range.max - range.min)) * 100;
  } else {
    percentile = ((value - range.min) / (range.max - range.min)) * 100;
  }

  return Math.max(0, Math.min(100, Math.round(percentile)));
}

/**
 * Format measurable for display
 */
export function formatMeasurable(
  measurable: keyof CombineMeasurablesRanges | 'fortyYard',
  value: number
): string {
  const info = COMBINE_TEST_INFO[measurable];
  if (info) {
    return `${value}${info.unit}`;
  }
  // Default formatting
  if (measurable === 'fortyYard') {
    return `${value.toFixed(2)}s`;
  }
  return String(value);
}

/**
 * Get grade for a measurable (A+ to F)
 */
export function getMeasurableGrade(
  position: Position,
  measurable: keyof CombineMeasurablesRanges,
  value: number
): string {
  const percentile = getMeasurablePercentile(position, measurable, value);

  if (percentile >= 95) return 'A+';
  if (percentile >= 90) return 'A';
  if (percentile >= 85) return 'A-';
  if (percentile >= 80) return 'B+';
  if (percentile >= 70) return 'B';
  if (percentile >= 60) return 'B-';
  if (percentile >= 50) return 'C+';
  if (percentile >= 40) return 'C';
  if (percentile >= 30) return 'C-';
  if (percentile >= 20) return 'D+';
  if (percentile >= 10) return 'D';
  return 'F';
}
