/**
 * Combine Analysis
 *
 * Analyzes combine measurables to identify risers and fallers.
 * Compares prospects' measurables against position averages.
 *
 * WO-SCOUTING-HUB-001
 */

import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { CombineMovement, CombineMovementDirection } from './types';
import { Position } from '@/lib/types';

// ============================================================================
// POSITION AVERAGE MEASURABLES
// ============================================================================

interface PositionBenchmarks {
  fortyTime: { elite: number; good: number; avg: number; poor: number };
  vertical: { elite: number; good: number; avg: number; poor: number };
  bench: { elite: number; good: number; avg: number; poor: number };
}

const POSITION_BENCHMARKS: Partial<Record<Position, PositionBenchmarks>> = {
  [Position.QB]: {
    fortyTime: { elite: 4.5, good: 4.7, avg: 4.85, poor: 5.0 },
    vertical: { elite: 34, good: 32, avg: 30, poor: 28 },
    bench: { elite: 20, good: 16, avg: 14, poor: 10 },
  },
  [Position.RB]: {
    fortyTime: { elite: 4.4, good: 4.5, avg: 4.55, poor: 4.65 },
    vertical: { elite: 38, good: 36, avg: 34, poor: 32 },
    bench: { elite: 22, good: 18, avg: 16, poor: 12 },
  },
  [Position.WR]: {
    fortyTime: { elite: 4.35, good: 4.45, avg: 4.55, poor: 4.65 },
    vertical: { elite: 40, good: 37, avg: 35, poor: 32 },
    bench: { elite: 16, good: 13, avg: 11, poor: 8 },
  },
  [Position.TE]: {
    fortyTime: { elite: 4.55, good: 4.65, avg: 4.75, poor: 4.9 },
    vertical: { elite: 36, good: 34, avg: 32, poor: 29 },
    bench: { elite: 24, good: 20, avg: 18, poor: 14 },
  },
  [Position.LT]: {
    fortyTime: { elite: 4.9, good: 5.1, avg: 5.25, poor: 5.4 },
    vertical: { elite: 32, good: 28, avg: 26, poor: 23 },
    bench: { elite: 30, good: 26, avg: 23, poor: 18 },
  },
  [Position.DE]: {
    fortyTime: { elite: 4.6, good: 4.75, avg: 4.85, poor: 5.0 },
    vertical: { elite: 36, good: 34, avg: 32, poor: 29 },
    bench: { elite: 28, good: 24, avg: 21, poor: 17 },
  },
  [Position.DT]: {
    fortyTime: { elite: 4.85, good: 5.0, avg: 5.15, poor: 5.3 },
    vertical: { elite: 32, good: 29, avg: 27, poor: 24 },
    bench: { elite: 32, good: 28, avg: 24, poor: 20 },
  },
  [Position.MLB]: {
    fortyTime: { elite: 4.5, good: 4.65, avg: 4.75, poor: 4.9 },
    vertical: { elite: 38, good: 35, avg: 33, poor: 30 },
    bench: { elite: 26, good: 22, avg: 19, poor: 15 },
  },
  [Position.OLB]: {
    fortyTime: { elite: 4.55, good: 4.65, avg: 4.75, poor: 4.9 },
    vertical: { elite: 37, good: 35, avg: 33, poor: 30 },
    bench: { elite: 24, good: 21, avg: 18, poor: 14 },
  },
  [Position.CB]: {
    fortyTime: { elite: 4.35, good: 4.45, avg: 4.5, poor: 4.6 },
    vertical: { elite: 40, good: 38, avg: 35, poor: 32 },
    bench: { elite: 16, good: 13, avg: 11, poor: 8 },
  },
  [Position.FS]: {
    fortyTime: { elite: 4.4, good: 4.5, avg: 4.55, poor: 4.65 },
    vertical: { elite: 40, good: 37, avg: 35, poor: 32 },
    bench: { elite: 18, good: 15, avg: 12, poor: 9 },
  },
  [Position.SS]: {
    fortyTime: { elite: 4.45, good: 4.55, avg: 4.6, poor: 4.7 },
    vertical: { elite: 38, good: 36, avg: 34, poor: 31 },
    bench: { elite: 20, good: 17, avg: 14, poor: 11 },
  },
};

// Use RB benchmarks as default for missing positions
const DEFAULT_BENCHMARK: PositionBenchmarks = POSITION_BENCHMARKS[Position.RB]!;

// ============================================================================
// COMBINE ANALYSIS
// ============================================================================

/**
 * Grade a measurable relative to position benchmark
 */
function gradeMeasurable(
  value: number,
  benchmark: { elite: number; good: number; avg: number; poor: number },
  lowerIsBetter: boolean = false
): 'elite' | 'good' | 'average' | 'poor' | 'concern' {
  if (lowerIsBetter) {
    if (value <= benchmark.elite) return 'elite';
    if (value <= benchmark.good) return 'good';
    if (value <= benchmark.avg) return 'average';
    if (value <= benchmark.poor) return 'poor';
    return 'concern';
  } else {
    if (value >= benchmark.elite) return 'elite';
    if (value >= benchmark.good) return 'good';
    if (value >= benchmark.avg) return 'average';
    if (value >= benchmark.poor) return 'poor';
    return 'concern';
  }
}

/**
 * Calculate stock movement based on combine performance
 */
function calculateStockMovement(
  prospect: DraftProspect,
  benchmarks: PositionBenchmarks
): { delta: number; standout?: string; concern?: string } {
  let delta = 0;
  let standout: string | undefined;
  let concern: string | undefined;

  // 40-yard dash (lower is better)
  if (prospect.fortyTime) {
    const grade = gradeMeasurable(prospect.fortyTime, benchmarks.fortyTime, true);
    if (grade === 'elite') {
      delta -= 0.5; // Move up half a round
      standout = `${prospect.fortyTime.toFixed(2)} forty`;
    } else if (grade === 'concern') {
      delta += 0.5;
      concern = `${prospect.fortyTime.toFixed(2)} forty (slow)`;
    }
  }

  // Vertical jump (higher is better)
  const vertical = prospect.combineMeasurables?.verticalJump;
  if (vertical) {
    const grade = gradeMeasurable(vertical, benchmarks.vertical);
    if (grade === 'elite') {
      delta -= 0.3;
      if (!standout) standout = `${vertical}" vertical`;
    } else if (grade === 'concern') {
      delta += 0.3;
      if (!concern) concern = `${vertical}" vertical (low)`;
    }
  }

  // Bench press (higher is better)
  const bench = prospect.combineMeasurables?.benchPress;
  if (bench) {
    const grade = gradeMeasurable(bench, benchmarks.bench);
    if (grade === 'elite') {
      delta -= 0.2;
      if (!standout) standout = `${bench} bench reps`;
    } else if (grade === 'concern') {
      delta += 0.2;
      if (!concern) concern = `${bench} bench reps (weak)`;
    }
  }

  return { delta, standout, concern };
}

/**
 * Analyze a prospect's combine performance
 */
export function analyzeProspectCombine(prospect: DraftProspect): CombineMovement | null {
  const benchmarks = POSITION_BENCHMARKS[prospect.position] || DEFAULT_BENCHMARK;
  const { delta, standout, concern } = calculateStockMovement(prospect, benchmarks);

  // Only report if significant movement
  if (Math.abs(delta) < 0.3) return null;

  const previousRound = typeof prospect.round === 'number' ? prospect.round : 7;
  const newProjection = Math.max(1, Math.min(7, previousRound + delta));

  const direction: CombineMovementDirection = delta < 0 ? 'riser' : 'faller';
  const reason = direction === 'riser'
    ? `Elite combine performance${standout ? ` (${standout})` : ''}`
    : `Concerning measurables${concern ? ` (${concern})` : ''}`;

  return {
    prospectId: prospect.id,
    prospectName: `${prospect.firstName} ${prospect.lastName}`,
    position: prospect.position,
    direction,
    delta: Math.abs(delta),
    previousProjection: previousRound,
    newProjection: Math.round(newProjection),
    reason,
    standoutMeasurable: standout,
    concernMeasurable: concern,
  };
}

/**
 * Analyze combine performance for entire draft class
 */
export function analyzeDraftClassCombine(
  prospects: DraftProspect[]
): { risers: CombineMovement[]; fallers: CombineMovement[] } {
  const risers: CombineMovement[] = [];
  const fallers: CombineMovement[] = [];

  for (const prospect of prospects) {
    const movement = analyzeProspectCombine(prospect);
    if (!movement) continue;

    if (movement.direction === 'riser') {
      risers.push(movement);
    } else {
      fallers.push(movement);
    }
  }

  // Sort by delta (biggest movers first)
  risers.sort((a, b) => b.delta - a.delta);
  fallers.sort((a, b) => b.delta - a.delta);

  return { risers, fallers };
}

/**
 * Get top combine risers
 */
export function getTopRisers(
  prospects: DraftProspect[],
  count: number = 10
): CombineMovement[] {
  const { risers } = analyzeDraftClassCombine(prospects);
  return risers.slice(0, count);
}

/**
 * Get top combine fallers
 */
export function getTopFallers(
  prospects: DraftProspect[],
  count: number = 10
): CombineMovement[] {
  const { fallers } = analyzeDraftClassCombine(prospects);
  return fallers.slice(0, count);
}

/**
 * Get combine stats summary for a prospect
 */
export function getProspectCombineSummary(prospect: DraftProspect): {
  fortyTime: { value: number | null; grade: string };
  vertical: { value: number | null; grade: string };
  bench: { value: number | null; grade: string };
  overall: 'elite' | 'good' | 'average' | 'poor';
} {
  const benchmarks = POSITION_BENCHMARKS[prospect.position] || DEFAULT_BENCHMARK;

  const fortyGrade = prospect.fortyTime
    ? gradeMeasurable(prospect.fortyTime, benchmarks.fortyTime, true)
    : 'average';

  const verticalGrade = prospect.combineMeasurables?.verticalJump
    ? gradeMeasurable(prospect.combineMeasurables.verticalJump, benchmarks.vertical)
    : 'average';

  const benchGrade = prospect.combineMeasurables?.benchPress
    ? gradeMeasurable(prospect.combineMeasurables.benchPress, benchmarks.bench)
    : 'average';

  // Calculate overall
  const gradeValues = { elite: 4, good: 3, average: 2, poor: 1, concern: 0 };
  const avg = (
    gradeValues[fortyGrade] +
    gradeValues[verticalGrade] +
    gradeValues[benchGrade]
  ) / 3;

  let overall: 'elite' | 'good' | 'average' | 'poor';
  if (avg >= 3.5) overall = 'elite';
  else if (avg >= 2.5) overall = 'good';
  else if (avg >= 1.5) overall = 'average';
  else overall = 'poor';

  return {
    fortyTime: {
      value: prospect.fortyTime || null,
      grade: fortyGrade,
    },
    vertical: {
      value: prospect.combineMeasurables?.verticalJump || null,
      grade: verticalGrade,
    },
    bench: {
      value: prospect.combineMeasurables?.benchPress || null,
      grade: benchGrade,
    },
    overall,
  };
}
