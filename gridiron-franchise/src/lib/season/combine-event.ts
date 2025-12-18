/**
 * NFL Combine Event Simulation
 *
 * Week 19 (post-Championship) combine simulation that:
 * - Reveals all measurables for prospects
 * - Generates risers (exceeded expectations)
 * - Generates fallers (disappointed)
 * - Creates combine storylines
 *
 * Based on DRAFT-SYSTEM-ENHANCED.md specification
 */

import { Position } from '../types';
import { DraftProspect } from '../generators/draft-generator';
import {
  COMBINE_MEASURABLES_BY_POSITION,
  type CombineMeasurablesRanges,
  type MeasurableRange
} from '../data/combine-measurables';

// ============================================================================
// TYPES
// ============================================================================

export type CombineStockChange = 'riser' | 'faller' | 'stable';

export interface CombinePerformance {
  prospectId: string;
  stockChange: CombineStockChange;
  draftStockDelta: number; // positive = rising, negative = falling
  eliteTests: string[];    // tests where prospect hit elite threshold
  concernTests: string[];  // tests that raised concerns
  storyline: CombineStoryline | null;
}

export type CombineStorylineType =
  | 'workout_warrior'      // Significantly better athlete than expected
  | 'medical_red_flag'     // Failed physical or has concerning injury
  | 'interview_star'       // Impressed with character/intelligence
  | 'interview_concern'    // Poor interview raised questions
  | 'underwhelming'        // Good prospect but tested poorly
  | 'surprise_athlete'     // Late round prospect with elite testing
  | 'position_flexibility' // Tested well enough to play multiple positions
  | 'weight_concern';      // Came in significantly over/under expected weight

export interface CombineStoryline {
  type: CombineStorylineType;
  headline: string;
  description: string;
}

export interface CombineResults {
  week: number;
  year: number;
  prospects: DraftProspect[];
  performances: CombinePerformance[];
  risers: DraftProspect[];
  fallers: DraftProspect[];
  topPerformers: DraftProspect[]; // Best 10 overall athletes
  storylines: Array<{ prospect: DraftProspect; storyline: CombineStoryline }>;
}

// Offensive line positions
const OL_POSITIONS = [Position.LT, Position.LG, Position.C, Position.RG, Position.RT];
// Defensive line positions
const DL_POSITIONS = [Position.DE, Position.DT];
// Linebacker positions
const LB_POSITIONS = [Position.MLB, Position.OLB];
// Safety positions
const S_POSITIONS = [Position.FS, Position.SS];

// Day-by-day schedule (like NFL Combine)
export const COMBINE_SCHEDULE: Record<number, Position[]> = {
  1: [Position.QB, Position.WR, Position.TE],                           // Day 1: Skill positions
  2: [Position.RB, ...OL_POSITIONS],                                     // Day 2: Offense
  3: [...DL_POSITIONS, ...LB_POSITIONS],                                // Day 3: Front seven
  4: [Position.CB, ...S_POSITIONS, Position.K, Position.P],             // Day 4: Secondary + Specialists
};

// ============================================================================
// CONFIGURATION
// ============================================================================

const RISER_COUNT = { min: 10, max: 15 };   // Prospects who rise significantly
const FALLER_COUNT = { min: 8, max: 12 };   // Prospects who fall significantly
const RISER_STOCK_DELTA = { min: 5, max: 15 };  // Draft spots gained
const FALLER_STOCK_DELTA = { min: -15, max: -5 }; // Draft spots lost
const STORYLINE_CHANCE = 0.15; // 15% chance for a prospect to have a storyline

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
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
// MEASURABLE EVALUATION
// ============================================================================

type MeasurableKey = keyof CombineMeasurablesRanges;

/**
 * Check if a measurable value hits the elite threshold
 * For time-based tests (lower is better), elite means below threshold
 */
function isEliteMeasurable(
  value: number,
  range: MeasurableRange,
  isTimeBased: boolean = false
): boolean {
  if (!range.elite) return false;
  return isTimeBased ? value <= range.elite : value >= range.elite;
}

/**
 * Check if a measurable is concerning (bottom 20% of range)
 */
function isConcerningMeasurable(
  value: number,
  range: MeasurableRange,
  isTimeBased: boolean = false
): boolean {
  const rangeSize = range.max - range.min;
  const threshold = isTimeBased
    ? range.max - rangeSize * 0.2  // For time: concerning if in top 20% of times (slower)
    : range.min + rangeSize * 0.2; // For others: concerning if in bottom 20%

  return isTimeBased ? value >= threshold : value <= threshold;
}

const TIME_BASED_TESTS: MeasurableKey[] = ['threeCone', 'twentyShuttle'];

/**
 * Evaluate a prospect's combine performance
 */
function evaluateCombinePerformance(
  prospect: DraftProspect
): { eliteTests: string[]; concernTests: string[]; athleticScore: number } {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[prospect.position as Position];
  if (!ranges) {
    return { eliteTests: [], concernTests: [], athleticScore: 50 };
  }

  const eliteTests: string[] = [];
  const concernTests: string[] = [];
  let athleticScore = 50; // Base score

  const measurables = prospect.combineMeasurables;

  // Check each measurable
  const checks: Array<{ key: MeasurableKey; value: number; label: string }> = [
    { key: 'armLength', value: measurables.armLength, label: 'Arm Length' },
    { key: 'handSize', value: measurables.handSize, label: 'Hand Size' },
    { key: 'wingspan', value: measurables.wingspan, label: 'Wingspan' },
    { key: 'verticalJump', value: measurables.verticalJump, label: 'Vertical Jump' },
    { key: 'broadJump', value: measurables.broadJump, label: 'Broad Jump' },
    { key: 'threeCone', value: measurables.threeCone, label: '3-Cone Drill' },
    { key: 'twentyShuttle', value: measurables.twentyShuttle, label: '20-Yard Shuttle' },
    { key: 'benchPress', value: measurables.benchPress, label: 'Bench Press' },
  ];

  for (const { key, value, label } of checks) {
    const range = ranges[key];
    const isTimeBased = TIME_BASED_TESTS.includes(key);

    if (isEliteMeasurable(value, range, isTimeBased)) {
      eliteTests.push(label);
      athleticScore += 8;
    } else if (isConcerningMeasurable(value, range, isTimeBased)) {
      concernTests.push(label);
      athleticScore -= 6;
    }
  }

  // Also factor in 40-yard dash from Player's physical attributes
  const fortyTime = prospect.fortyTime;
  const speedPositions = [Position.WR, Position.CB, Position.FS, Position.SS, Position.RB];
  if (fortyTime <= 4.40 && speedPositions.includes(prospect.position as Position)) {
    eliteTests.push('40-Yard Dash');
    athleticScore += 10;
  } else if (fortyTime >= 4.70 && [Position.WR, Position.CB, Position.RB].includes(prospect.position as Position)) {
    concernTests.push('40-Yard Dash');
    athleticScore -= 8;
  }

  return { eliteTests, concernTests, athleticScore: Math.max(0, Math.min(100, athleticScore)) };
}

// ============================================================================
// STORYLINE GENERATION
// ============================================================================

const STORYLINE_TEMPLATES: Record<CombineStorylineType, (prospect: DraftProspect) => CombineStoryline> = {
  workout_warrior: (p) => ({
    type: 'workout_warrior',
    headline: `${p.firstName} ${p.lastName} Lights Up Combine`,
    description: `The ${p.collegeData.name} ${p.position} tested off the charts, dramatically boosting his draft stock with elite athleticism.`,
  }),
  medical_red_flag: (p) => ({
    type: 'medical_red_flag',
    headline: `Medical Concerns Surface for ${p.lastName}`,
    description: `${p.firstName} ${p.lastName}'s medical evaluation raised concerns among team doctors, potentially impacting his draft position.`,
  }),
  interview_star: (p) => ({
    type: 'interview_star',
    headline: `${p.lastName} Impresses in Combine Interviews`,
    description: `Teams came away highly impressed with ${p.firstName} ${p.lastName}'s intelligence, work ethic, and leadership qualities.`,
  }),
  interview_concern: (p) => ({
    type: 'interview_concern',
    headline: `Red Flags Emerge in ${p.lastName} Interviews`,
    description: `${p.firstName} ${p.lastName}'s combine interviews raised questions about maturity and commitment, according to team sources.`,
  }),
  underwhelming: (p) => ({
    type: 'underwhelming',
    headline: `${p.lastName} Fails to Live Up to Hype`,
    description: `Despite high expectations, ${p.firstName} ${p.lastName} put up underwhelming numbers in athletic testing, sliding on draft boards.`,
  }),
  surprise_athlete: (p) => ({
    type: 'surprise_athlete',
    headline: `Day 3 Prospect ${p.lastName} Steals the Show`,
    description: `${p.firstName} ${p.lastName} from ${p.collegeData.name} turned heads with elite athleticism, jumping into Day 2 conversation.`,
  }),
  position_flexibility: (p) => ({
    type: 'position_flexibility',
    headline: `${p.lastName} Shows Multi-Position Potential`,
    description: `${p.firstName} ${p.lastName}'s versatile skill set has teams considering him at multiple positions, increasing his value.`,
  }),
  weight_concern: (p) => ({
    type: 'weight_concern',
    headline: `${p.lastName} Weighs In ${p.weight > 250 ? 'Heavy' : 'Light'}`,
    description: `${p.firstName} ${p.lastName} came in at a ${p.weight > 250 ? 'heavier' : 'lighter'} weight than expected, raising conditioning questions.`,
  }),
};

function generateStoryline(
  prospect: DraftProspect,
  performance: { eliteTests: string[]; concernTests: string[] }
): CombineStoryline | null {
  // Determine most likely storyline based on performance
  const isLateRound = typeof prospect.round === 'number' && prospect.round >= 5;
  const hasEliteTests = performance.eliteTests.length >= 3;
  const hasConcerns = performance.concernTests.length >= 2;

  // Weighted selection based on circumstances
  const options: CombineStorylineType[] = [];

  if (hasEliteTests && isLateRound) {
    options.push('surprise_athlete', 'surprise_athlete'); // Double weight
  }
  if (hasEliteTests) {
    options.push('workout_warrior', 'position_flexibility');
  }
  if (hasConcerns) {
    options.push('underwhelming', 'weight_concern');
  }
  // Random chance for interview/medical storylines
  options.push('interview_star', 'interview_concern', 'medical_red_flag');

  if (options.length === 0) return null;

  const selectedType = options[Math.floor(Math.random() * options.length)];
  return STORYLINE_TEMPLATES[selectedType](prospect);
}

// ============================================================================
// MAIN COMBINE SIMULATION
// ============================================================================

/**
 * Simulate the NFL Combine for a draft class
 */
export function simulateCombine(
  prospects: DraftProspect[],
  year: number,
  week: number = 19
): CombineResults {
  const performances: CombinePerformance[] = [];
  const allStorylines: Array<{ prospect: DraftProspect; storyline: CombineStoryline }> = [];

  // Evaluate all prospects
  const evaluations = prospects.map(prospect => ({
    prospect,
    ...evaluateCombinePerformance(prospect),
  }));

  // Sort by athletic score to find top performers
  const sortedByAthletic = [...evaluations].sort((a, b) => b.athleticScore - a.athleticScore);
  const topPerformers = sortedByAthletic.slice(0, 10).map(e => e.prospect);

  // Determine risers (best performers relative to draft position)
  const riserCount = randomInRange(RISER_COUNT.min, RISER_COUNT.max);
  const fallerCount = randomInRange(FALLER_COUNT.min, FALLER_COUNT.max);

  // Find riser candidates: high athletic score but lower round
  const riserCandidates = evaluations
    .filter(e => {
      const round = typeof e.prospect.round === 'number' ? e.prospect.round : 8;
      return e.athleticScore >= 60 && round >= 3 && e.eliteTests.length >= 2;
    })
    .sort((a, b) => b.athleticScore - a.athleticScore);

  // Find faller candidates: low athletic score but higher round
  const fallerCandidates = evaluations
    .filter(e => {
      const round = typeof e.prospect.round === 'number' ? e.prospect.round : 8;
      return e.athleticScore <= 45 && round <= 4 && e.concernTests.length >= 2;
    })
    .sort((a, b) => a.athleticScore - b.athleticScore);

  const risers = new Set(shuffleArray(riserCandidates).slice(0, riserCount).map(e => e.prospect.id));
  const fallers = new Set(shuffleArray(fallerCandidates).slice(0, fallerCount).map(e => e.prospect.id));

  // Generate performances for all prospects
  for (const evaluation of evaluations) {
    const { prospect, eliteTests, concernTests } = evaluation;

    let stockChange: CombineStockChange = 'stable';
    let draftStockDelta = 0;

    if (risers.has(prospect.id)) {
      stockChange = 'riser';
      draftStockDelta = randomInRange(RISER_STOCK_DELTA.min, RISER_STOCK_DELTA.max);
    } else if (fallers.has(prospect.id)) {
      stockChange = 'faller';
      draftStockDelta = randomInRange(FALLER_STOCK_DELTA.min, FALLER_STOCK_DELTA.max);
    }

    // Chance for a storyline
    let storyline: CombineStoryline | null = null;
    if (Math.random() < STORYLINE_CHANCE || stockChange !== 'stable') {
      storyline = generateStoryline(prospect, { eliteTests, concernTests });
      if (storyline) {
        allStorylines.push({ prospect, storyline });
      }
    }

    performances.push({
      prospectId: prospect.id,
      stockChange,
      draftStockDelta,
      eliteTests,
      concernTests,
      storyline,
    });
  }

  return {
    week,
    year,
    prospects,
    performances,
    risers: prospects.filter(p => risers.has(p.id)),
    fallers: prospects.filter(p => fallers.has(p.id)),
    topPerformers,
    storylines: allStorylines.slice(0, 10), // Top 10 storylines
  };
}

/**
 * Get prospects testing on a specific combine day
 */
export function getProspectsForDay(
  prospects: DraftProspect[],
  day: number
): DraftProspect[] {
  const positions = COMBINE_SCHEDULE[day];
  if (!positions) return [];
  return prospects.filter(p => positions.includes(p.position as Position));
}

/**
 * Get the combine day for a specific position
 */
export function getCombineDayForPosition(position: Position): number {
  for (const [day, positions] of Object.entries(COMBINE_SCHEDULE)) {
    if (positions.includes(position)) {
      return parseInt(day);
    }
  }
  return 1; // Default to day 1
}

/**
 * Format combine measurables for display
 */
export function formatMeasurable(
  key: string,
  value: number,
  position: Position
): { value: string; isElite: boolean; isConcern: boolean } {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[position];
  if (!ranges) {
    return { value: value.toString(), isElite: false, isConcern: false };
  }

  const measurableKey = key as MeasurableKey;
  const range = ranges[measurableKey];
  if (!range) {
    return { value: value.toString(), isElite: false, isConcern: false };
  }

  const isTimeBased = TIME_BASED_TESTS.includes(measurableKey);

  // Format value based on type
  let formattedValue: string;
  switch (key) {
    case 'fortyYard':
    case 'threeCone':
    case 'twentyShuttle':
      formattedValue = value.toFixed(2) + 's';
      break;
    case 'armLength':
    case 'handSize':
    case 'wingspan':
    case 'verticalJump':
    case 'broadJump':
      formattedValue = value.toFixed(1) + '"';
      break;
    case 'benchPress':
      formattedValue = value + ' reps';
      break;
    default:
      formattedValue = value.toString();
  }

  return {
    value: formattedValue,
    isElite: isEliteMeasurable(value, range, isTimeBased),
    isConcern: isConcerningMeasurable(value, range, isTimeBased),
  };
}

/**
 * Get position average for a measurable
 */
export function getPositionAverage(
  key: string,
  position: Position
): number | null {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[position];
  if (!ranges) return null;

  const measurableKey = key as MeasurableKey;
  const range = ranges[measurableKey];
  if (!range) return null;

  return (range.min + range.max) / 2;
}
