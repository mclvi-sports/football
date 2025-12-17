/**
 * Draft Class Generator
 *
 * Generates draft classes of ~275 rookie prospects per FINALS spec.
 * Includes 224 draftable prospects (7 rounds × 32 teams) + 40-60 UDFAs.
 *
 * Source: FINAL-draft-class-system.md
 */

import { Player, Position, CombineMeasurables, CollegeCareer } from '../types';
import { generatePlayer } from './player-generator';
import { generateCombineMeasurables } from '../data/combine-measurables';
import { selectRandomCollege, type College } from '../data/colleges';
import { generateCollegeCareer } from './college-stats-generator';

/**
 * Potential label for draft prospects (per FINALS)
 */
export type PotentialLabel = 'Star' | 'Starter' | 'Limited';

/**
 * Extended draft prospect type
 */
export interface DraftProspect extends Player {
  round: number | 'UDFA';
  pick: number | null;
  potentialLabel: PotentialLabel;
  potentialGap: number;
  scoutedOvr: number; // What scouts think (may differ from true OVR)
  combineMeasurables: CombineMeasurables; // Full combine data
  collegeData: College; // Detailed college info with tier
  collegeCareer: CollegeCareer; // College stats and accolades
}

interface DraftClassConfig {
  size?: number; // Default: ~275 (224 + random 40-60 UDFA)
}

/**
 * OVR ranges by round (per FINALS)
 * | Round | OVR Range | Average |
 * |-------|-----------|---------|
 * | 1 | 72-86 | 78 |
 * | 2 | 68-80 | 74 |
 * | 3 | 65-76 | 70 |
 * | 4 | 62-73 | 67 |
 * | 5 | 58-70 | 64 |
 * | 6 | 55-67 | 61 |
 * | 7 | 52-64 | 58 |
 * | UDFA | 50-62 | 55 |
 */
const ROUND_OVR_RANGES: Record<number | 'UDFA', { min: number; max: number; avg: number }> = {
  1: { min: 72, max: 86, avg: 78 },
  2: { min: 68, max: 80, avg: 74 },
  3: { min: 65, max: 76, avg: 70 },
  4: { min: 62, max: 73, avg: 67 },
  5: { min: 58, max: 70, avg: 64 },
  6: { min: 55, max: 67, avg: 61 },
  7: { min: 52, max: 64, avg: 58 },
  UDFA: { min: 50, max: 62, avg: 55 },
};

/**
 * Pick position modifiers within round (per FINALS)
 */
function getPickPositionModifier(pickInRound: number): number {
  if (pickInRound <= 5) return Math.floor(Math.random() * 3) + 3; // +3 to +5
  if (pickInRound <= 15) return Math.floor(Math.random() * 3) + 1; // +1 to +3
  if (pickInRound <= 25) return 0;
  return -(Math.floor(Math.random() * 2) + 1); // -1 to -2
}

/**
 * Potential gap ranges by round (per FINALS)
 */
const ROUND_POTENTIAL_GAPS: Record<number | 'UDFA', { min: number; max: number }> = {
  1: { min: 8, max: 18 },
  2: { min: 6, max: 15 },
  3: { min: 5, max: 12 },
  4: { min: 4, max: 10 },
  5: { min: 3, max: 8 },
  6: { min: 2, max: 7 },
  7: { min: 1, max: 6 },
  UDFA: { min: 0, max: 5 },
};

/**
 * Potential label distribution by round (per FINALS)
 */
const ROUND_POTENTIAL_LABELS: Record<number | 'UDFA', { star: number; starter: number; limited: number }> = {
  1: { star: 0.40, starter: 0.40, limited: 0.20 },
  2: { star: 0.25, starter: 0.50, limited: 0.25 },
  3: { star: 0.15, starter: 0.50, limited: 0.35 },
  4: { star: 0.10, starter: 0.45, limited: 0.45 },
  5: { star: 0.05, starter: 0.40, limited: 0.55 },
  6: { star: 0.05, starter: 0.30, limited: 0.65 },
  7: { star: 0.02, starter: 0.25, limited: 0.73 },
  UDFA: { star: 0.01, starter: 0.20, limited: 0.79 },
};

/**
 * Position distribution for draft (per FINALS percentages, counts for 275 class)
 */
const DRAFT_POSITION_WEIGHTS: { position: Position; weight: number }[] = [
  // QB: 3-4% → ~3.5% = 9.6/275
  { position: Position.QB, weight: 4 },
  // RB: 6-7% → ~6.5% = 17.9/275
  { position: Position.RB, weight: 7 },
  // WR: 12-14% → ~13% = 35.8/275
  { position: Position.WR, weight: 13 },
  // TE: 4-5% → ~4.5% = 12.4/275
  { position: Position.TE, weight: 5 },
  // OT: 7-9% → ~8% = 22/275 (split LT/RT)
  { position: Position.LT, weight: 4 },
  { position: Position.RT, weight: 4 },
  // IOL: 8-10% → ~9% = 24.8/275 (split LG/C/RG)
  { position: Position.LG, weight: 3 },
  { position: Position.C, weight: 3 },
  { position: Position.RG, weight: 3 },
  // DE: 8-10% → ~9% = 24.8/275
  { position: Position.DE, weight: 9 },
  // DT: 5-7% → ~6% = 16.5/275
  { position: Position.DT, weight: 6 },
  // LB: 9-11% → ~10% = 27.5/275 (split MLB/OLB)
  { position: Position.MLB, weight: 4 },
  { position: Position.OLB, weight: 6 },
  // CB: 10-12% → ~11% = 30.3/275
  { position: Position.CB, weight: 11 },
  // S: 6-8% → ~7% = 19.3/275 (split FS/SS)
  { position: Position.FS, weight: 4 },
  { position: Position.SS, weight: 4 },
  // K: 1% → ~2.8/275
  { position: Position.K, weight: 1 },
  // P: 1% → ~2.8/275
  { position: Position.P, weight: 1 },
];

/**
 * Age distribution for prospects (per FINALS)
 */
const PROSPECT_AGE_DISTRIBUTION = [
  { age: 21, cumulative: 0.30 }, // 30%
  { age: 22, cumulative: 0.75 }, // 45% (30+45)
  { age: 23, cumulative: 0.95 }, // 20% (75+20)
  { age: 24, cumulative: 1.0 },  // 5%
];

function weightedRandom<T>(items: { weight: number }[], getValue: (item: { weight: number }) => T): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return getValue(item);
  }
  return getValue(items[0]);
}

function getRandomPosition(): Position {
  return weightedRandom(DRAFT_POSITION_WEIGHTS, (item) => (item as typeof DRAFT_POSITION_WEIGHTS[0]).position);
}

/**
 * Generate OVR for a specific round and pick (per FINALS)
 */
function generateDraftOVR(round: number | 'UDFA', pickInRound: number): number {
  const range = ROUND_OVR_RANGES[round] ?? ROUND_OVR_RANGES.UDFA;
  const baseOvr = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  // Apply pick position modifier (only for drafted picks)
  const modifier = round === 'UDFA' ? 0 : getPickPositionModifier(pickInRound);

  return Math.max(range.min, Math.min(range.max + 5, baseOvr + modifier));
}

/**
 * Calculate potential label and gap (per FINALS)
 */
function calculatePotential(round: number | 'UDFA'): { label: PotentialLabel; gap: number } {
  const gapRange = ROUND_POTENTIAL_GAPS[round] ?? ROUND_POTENTIAL_GAPS.UDFA;
  const gap = Math.floor(Math.random() * (gapRange.max - gapRange.min + 1)) + gapRange.min;

  const dist = ROUND_POTENTIAL_LABELS[round] ?? ROUND_POTENTIAL_LABELS.UDFA;
  const roll = Math.random();

  let label: PotentialLabel;
  if (roll < dist.star) {
    label = 'Star';
  } else if (roll < dist.star + dist.starter) {
    label = 'Starter';
  } else {
    label = 'Limited';
  }

  return { label, gap };
}

/**
 * Generate prospect age (per FINALS)
 */
function getProspectAge(): number {
  const roll = Math.random();
  for (const { age, cumulative } of PROSPECT_AGE_DISTRIBUTION) {
    if (roll < cumulative) return age;
  }
  return 22;
}

/**
 * Add scouting noise to OVR (scouts don't see true OVR)
 * Per FINALS: ±2-4 for average scouts
 */
function addScoutingNoise(trueOvr: number): number {
  const variance = Math.floor(Math.random() * 7) - 3; // -3 to +3
  return Math.max(45, Math.min(95, trueOvr + variance));
}

/**
 * Generate a draft class per FINALS spec
 * Default: 224 drafted + 40-60 UDFA = ~275 total
 */
export function generateDraftClass(config: DraftClassConfig = {}): DraftProspect[] {
  const prospects: DraftProspect[] = [];

  // 7 rounds × 32 picks = 224 drafted picks
  const draftedCount = 224;
  // Random 40-60 UDFAs per FINALS
  const udfaCount = config.size
    ? Math.max(0, config.size - draftedCount)
    : Math.floor(Math.random() * 21) + 40;

  let pickNumber = 1;

  // Generate drafted prospects (Rounds 1-7)
  for (let round = 1; round <= 7; round++) {
    for (let pickInRound = 1; pickInRound <= 32; pickInRound++) {
      const position = getRandomPosition();
      const trueOvr = generateDraftOVR(round, pickInRound);
      const age = getProspectAge();
      const { label: potentialLabel, gap: potentialGap } = calculatePotential(round);

      // Select college based on round (early rounds favor better programs)
      const collegeData = selectRandomCollege(round);

      // Generate base player with selected college
      const basePlayer = generatePlayer({ position, targetOvr: trueOvr, age, college: collegeData.name });

      // Generate combine measurables for this position
      const combineMeasurables = generateCombineMeasurables(position);

      // Generate college career with stats and accolades
      const collegeCareer = generateCollegeCareer(position, round, collegeData.tier);

      // Create prospect with extended fields
      const prospect: DraftProspect = {
        ...basePlayer,
        age,
        experience: 0, // All prospects are rookies
        overall: trueOvr,
        potential: Math.min(99, trueOvr + potentialGap),
        round,
        pick: pickNumber,
        potentialLabel,
        potentialGap,
        scoutedOvr: addScoutingNoise(trueOvr),
        badges: [], // Prospects start with 0 badges per FINALS
        combineMeasurables,
        collegeData,
        collegeCareer,
      };

      // Remove contract (assigned at draft)
      delete prospect.contract;

      prospects.push(prospect);
      pickNumber++;
    }
  }

  // Generate UDFAs
  for (let i = 0; i < udfaCount; i++) {
    const position = getRandomPosition();
    const trueOvr = generateDraftOVR('UDFA', 0);
    const age = getProspectAge();
    const { label: potentialLabel, gap: potentialGap } = calculatePotential('UDFA');

    // UDFAs typically from lower-tier programs (round 7+ weighting)
    const collegeData = selectRandomCollege(7);
    const basePlayer = generatePlayer({ position, targetOvr: trueOvr, age, college: collegeData.name });
    const combineMeasurables = generateCombineMeasurables(position);
    const collegeCareer = generateCollegeCareer(position, 'UDFA', collegeData.tier);

    const prospect: DraftProspect = {
      ...basePlayer,
      age,
      experience: 0,
      overall: trueOvr,
      potential: Math.min(99, trueOvr + potentialGap),
      round: 'UDFA',
      pick: null,
      potentialLabel,
      potentialGap,
      scoutedOvr: addScoutingNoise(trueOvr),
      badges: [],
      combineMeasurables,
      collegeData,
      collegeCareer,
    };

    delete prospect.contract;
    prospects.push(prospect);
  }

  // Sort by scouted OVR descending (simulates big board)
  prospects.sort((a, b) => b.scoutedOvr - a.scoutedOvr);

  return prospects;
}

/**
 * Get draft class statistics (updated for FINALS compliance)
 */
export function getDraftClassStats(players: DraftProspect[]): {
  totalPlayers: number;
  avgOvr: number;
  avgPotential: number;
  avgScoutedOvr: number;
  positionCounts: Record<Position, number>;
  roundBreakdown: { round: number | 'UDFA'; count: number; avgOvr: number; avgPotential: number }[];
  potentialLabelCounts: Record<PotentialLabel, number>;
  topProspects: { name: string; position: Position; scoutedOvr: number; trueOvr: number; potential: number; potentialLabel: PotentialLabel }[];
} {
  const positionCounts: Record<Position, number> = {} as Record<Position, number>;
  const roundData: Partial<Record<number | 'UDFA', { count: number; totalOvr: number; totalPotential: number }>> = {};
  const potentialLabelCounts: Record<PotentialLabel, number> = { Star: 0, Starter: 0, Limited: 0 };

  let totalOvr = 0;
  let totalPotential = 0;
  let totalScoutedOvr = 0;

  for (const player of players) {
    totalOvr += player.overall;
    totalPotential += player.potential;
    totalScoutedOvr += player.scoutedOvr;
    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
    potentialLabelCounts[player.potentialLabel]++;

    const round = player.round;
    if (!roundData[round]) {
      roundData[round] = { count: 0, totalOvr: 0, totalPotential: 0 };
    }
    roundData[round].count++;
    roundData[round].totalOvr += player.overall;
    roundData[round].totalPotential += player.potential;
  }

  const roundBreakdown = Object.entries(roundData)
    .filter((entry): entry is [string, { count: number; totalOvr: number; totalPotential: number }] => entry[1] !== undefined)
    .map(([roundStr, data]) => {
      const round = roundStr === 'UDFA' ? 'UDFA' as const : parseInt(roundStr);
      return {
        round,
        count: data.count,
        avgOvr: Math.round(data.totalOvr / data.count),
        avgPotential: Math.round(data.totalPotential / data.count),
      };
    })
    .sort((a, b) => {
      if (a.round === 'UDFA') return 1;
      if (b.round === 'UDFA') return -1;
      return (a.round as number) - (b.round as number);
    });

  // Get top 10 prospects (by scouted OVR)
  const topProspects = players
    .slice(0, 10)
    .map((p) => ({
      name: `${p.firstName} ${p.lastName}`,
      position: p.position,
      scoutedOvr: p.scoutedOvr,
      trueOvr: p.overall,
      potential: p.potential,
      potentialLabel: p.potentialLabel,
    }));

  return {
    totalPlayers: players.length,
    avgOvr: Math.round(totalOvr / players.length),
    avgPotential: Math.round(totalPotential / players.length),
    avgScoutedOvr: Math.round(totalScoutedOvr / players.length),
    positionCounts,
    roundBreakdown,
    potentialLabelCounts,
    topProspects,
  };
}
