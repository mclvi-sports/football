/**
 * Draft Class Generator
 *
 * Generates draft classes of rookie prospects with configurable depth and talent.
 * Draft prospects are young players (21-23) with 0 experience and higher potential.
 */

import { Player, Position } from '../types';
import { generatePlayer } from './player-generator';

export type DraftDepth = 'shallow' | 'normal' | 'deep';
export type DraftTalent = 'strong' | 'average' | 'weak';

interface DraftClassConfig {
  depth: DraftDepth;
  talent: DraftTalent;
}

// Standard draft class sizes
const DRAFT_CLASS_SIZES: Record<DraftDepth, number> = {
  shallow: 180, // 5-6 rounds worth
  normal: 224,  // 7 rounds (typical NFL draft)
  deep: 280,    // 8-9 rounds worth
};

// Position distribution for draft (reflects typical draft patterns)
const DRAFT_POSITION_WEIGHTS: { position: Position; weight: number }[] = [
  { position: Position.QB, weight: 4 },
  { position: Position.RB, weight: 8 },
  { position: Position.WR, weight: 14 },
  { position: Position.TE, weight: 6 },
  { position: Position.LT, weight: 6 },
  { position: Position.LG, weight: 5 },
  { position: Position.C, weight: 4 },
  { position: Position.RG, weight: 5 },
  { position: Position.RT, weight: 5 },
  { position: Position.DE, weight: 10 },
  { position: Position.DT, weight: 7 },
  { position: Position.MLB, weight: 5 },
  { position: Position.OLB, weight: 7 },
  { position: Position.CB, weight: 12 },
  { position: Position.FS, weight: 5 },
  { position: Position.SS, weight: 5 },
  { position: Position.K, weight: 1 },
  { position: Position.P, weight: 1 },
];

// OVR distribution by draft round (talent affects the curve)
const ROUND_OVR_RANGES: Record<number, { base: number; variance: number }> = {
  1: { base: 72, variance: 6 },  // 66-78 (1st round picks)
  2: { base: 68, variance: 5 },  // 63-73
  3: { base: 64, variance: 5 },  // 59-69
  4: { base: 60, variance: 5 },  // 55-65
  5: { base: 56, variance: 5 },  // 51-61
  6: { base: 52, variance: 5 },  // 47-57
  7: { base: 48, variance: 5 },  // 43-53
  8: { base: 45, variance: 4 },  // 41-49 (UDFA tier)
};

// Talent modifier affects OVR curve
const TALENT_MODIFIERS: Record<DraftTalent, number> = {
  strong: 4,   // +4 to all OVRs
  average: 0,  // No modifier
  weak: -4,    // -4 to all OVRs
};

// Potential boost ranges for rookies (higher than veterans)
const ROOKIE_POTENTIAL_RANGES: Record<number, { min: number; max: number }> = {
  1: { min: 12, max: 20 }, // 1st rounders have high ceilings
  2: { min: 10, max: 18 },
  3: { min: 8, max: 16 },
  4: { min: 6, max: 14 },
  5: { min: 5, max: 12 },
  6: { min: 4, max: 10 },
  7: { min: 3, max: 8 },
  8: { min: 2, max: 6 },
};

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

function getRoundForPick(pick: number, totalPicks: number): number {
  const picksPerRound = Math.ceil(totalPicks / 8);
  return Math.min(Math.ceil(pick / picksPerRound), 8);
}

function getOvrForRound(round: number, talentModifier: number): number {
  const range = ROUND_OVR_RANGES[round] || ROUND_OVR_RANGES[8];
  const base = range.base + talentModifier;
  const variance = (Math.random() * 2 - 1) * range.variance;
  return Math.round(Math.max(40, Math.min(82, base + variance)));
}

function getRookiePotential(ovr: number, round: number): number {
  const range = ROOKIE_POTENTIAL_RANGES[round] || ROOKIE_POTENTIAL_RANGES[8];
  const boost = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  return Math.min(99, ovr + boost);
}

function getRookieAge(): number {
  // Most rookies are 21-23, with occasional 24-year-olds
  const roll = Math.random();
  if (roll < 0.25) return 21;
  if (roll < 0.65) return 22;
  if (roll < 0.90) return 23;
  return 24;
}

/**
 * Generate a draft class
 */
export function generateDraftClass(config: DraftClassConfig): Player[] {
  const players: Player[] = [];
  const totalPicks = DRAFT_CLASS_SIZES[config.depth];
  const talentModifier = TALENT_MODIFIERS[config.talent];

  for (let pick = 1; pick <= totalPicks; pick++) {
    const position = getRandomPosition();
    const round = getRoundForPick(pick, totalPicks);
    const targetOvr = getOvrForRound(round, talentModifier);

    // Generate base player
    const player = generatePlayer(position, targetOvr);

    // Override rookie-specific attributes
    player.age = getRookieAge();
    player.experience = 0;
    player.potential = getRookiePotential(player.overall, round);

    // Rookies typically don't have contracts yet (will be assigned at draft)
    delete player.contract;

    // Add draft metadata (stored in ID for now, could be separate field)
    player.id = `draft-r${round}-p${pick}-${player.id}`;

    players.push(player);
  }

  // Sort by overall descending (simulates big board)
  players.sort((a, b) => b.overall - a.overall);

  return players;
}

/**
 * Get draft class statistics
 */
export function getDraftClassStats(players: Player[]): {
  totalPlayers: number;
  avgOvr: number;
  avgPotential: number;
  positionCounts: Record<Position, number>;
  roundBreakdown: { round: number; count: number; avgOvr: number }[];
  topProspects: { name: string; position: Position; ovr: number; potential: number }[];
} {
  const positionCounts: Record<Position, number> = {} as Record<Position, number>;
  const roundData: Record<number, { count: number; totalOvr: number }> = {};
  let totalOvr = 0;
  let totalPotential = 0;

  for (const player of players) {
    totalOvr += player.overall;
    totalPotential += player.potential;
    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;

    // Extract round from ID
    const roundMatch = player.id.match(/draft-r(\d+)/);
    const round = roundMatch ? parseInt(roundMatch[1]) : 7;

    if (!roundData[round]) {
      roundData[round] = { count: 0, totalOvr: 0 };
    }
    roundData[round].count++;
    roundData[round].totalOvr += player.overall;
  }

  const roundBreakdown = Object.entries(roundData)
    .map(([round, data]) => ({
      round: parseInt(round),
      count: data.count,
      avgOvr: Math.round(data.totalOvr / data.count),
    }))
    .sort((a, b) => a.round - b.round);

  // Get top 10 prospects
  const topProspects = players
    .slice(0, 10)
    .map(p => ({
      name: `${p.firstName} ${p.lastName}`,
      position: p.position,
      ovr: p.overall,
      potential: p.potential,
    }));

  return {
    totalPlayers: players.length,
    avgOvr: Math.round(totalOvr / players.length),
    avgPotential: Math.round(totalPotential / players.length),
    positionCounts,
    roundBreakdown,
    topProspects,
  };
}
