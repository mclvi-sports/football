/**
 * Free Agent Pool Generator
 *
 * Generates pools of unsigned free agents with configurable size and quality.
 * Free agents are typically veterans or mid-career players not on rosters.
 */

import { Player, Position } from '../types';
import { generatePlayer } from './player-generator';

export type FAQuality = 'high' | 'medium' | 'low' | 'mixed';

interface FAPoolConfig {
  size: number;
  quality: FAQuality;
}

// Position distribution for FA pool (reflects typical availability)
const FA_POSITION_WEIGHTS: { position: Position; weight: number }[] = [
  { position: Position.QB, weight: 3 },
  { position: Position.RB, weight: 8 },
  { position: Position.WR, weight: 12 },
  { position: Position.TE, weight: 5 },
  { position: Position.LT, weight: 4 },
  { position: Position.LG, weight: 4 },
  { position: Position.C, weight: 3 },
  { position: Position.RG, weight: 4 },
  { position: Position.RT, weight: 4 },
  { position: Position.DE, weight: 8 },
  { position: Position.DT, weight: 6 },
  { position: Position.MLB, weight: 5 },
  { position: Position.OLB, weight: 6 },
  { position: Position.CB, weight: 10 },
  { position: Position.FS, weight: 4 },
  { position: Position.SS, weight: 4 },
  { position: Position.K, weight: 2 },
  { position: Position.P, weight: 2 },
];

// OVR ranges by quality tier
const OVR_RANGES: Record<FAQuality, { min: number; max: number; avgTarget: number }> = {
  high: { min: 72, max: 85, avgTarget: 78 },
  medium: { min: 65, max: 76, avgTarget: 70 },
  low: { min: 55, max: 68, avgTarget: 62 },
  mixed: { min: 55, max: 82, avgTarget: 68 },
};

// Age distribution for free agents (skews older)
const FA_AGE_WEIGHTS = [
  { age: 24, weight: 5 },
  { age: 25, weight: 8 },
  { age: 26, weight: 12 },
  { age: 27, weight: 15 },
  { age: 28, weight: 18 },
  { age: 29, weight: 15 },
  { age: 30, weight: 12 },
  { age: 31, weight: 8 },
  { age: 32, weight: 5 },
  { age: 33, weight: 2 },
];

function weightedRandom<T>(items: { weight: number }[], getValue: (item: { weight: number }, index: number) => T): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= items[i].weight;
    if (random <= 0) return getValue(items[i], i);
  }
  return getValue(items[0], 0);
}

function getRandomPosition(): Position {
  return weightedRandom(FA_POSITION_WEIGHTS, (item) => (item as typeof FA_POSITION_WEIGHTS[0]).position);
}

function getRandomOvr(quality: FAQuality): number {
  const range = OVR_RANGES[quality];

  if (quality === 'mixed') {
    // Mixed quality uses bell curve distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const stdDev = (range.max - range.min) / 4;
    const ovr = Math.round(range.avgTarget + normal * stdDev);
    return Math.max(range.min, Math.min(range.max, ovr));
  }

  // Other tiers use uniform distribution within range
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Generate a free agent pool
 */
export function generateFAPool(config: FAPoolConfig): Player[] {
  const players: Player[] = [];

  for (let i = 0; i < config.size; i++) {
    const position = getRandomPosition();
    const targetOvr = getRandomOvr(config.quality);

    const player = generatePlayer(position, targetOvr);

    // Free agents have no contract
    delete player.contract;

    players.push(player);
  }

  // Sort by overall descending
  players.sort((a, b) => b.overall - a.overall);

  return players;
}

/**
 * Get FA pool statistics
 */
export function getFAPoolStats(players: Player[]): {
  totalPlayers: number;
  avgOvr: number;
  avgAge: number;
  positionCounts: Record<Position, number>;
  ovrDistribution: { range: string; count: number }[];
} {
  const positionCounts: Record<Position, number> = {} as Record<Position, number>;
  let totalOvr = 0;
  let totalAge = 0;

  const ovrBuckets = {
    '80+': 0,
    '70-79': 0,
    '60-69': 0,
    'Below 60': 0,
  };

  for (const player of players) {
    totalOvr += player.overall;
    totalAge += player.age;

    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;

    if (player.overall >= 80) ovrBuckets['80+']++;
    else if (player.overall >= 70) ovrBuckets['70-79']++;
    else if (player.overall >= 60) ovrBuckets['60-69']++;
    else ovrBuckets['Below 60']++;
  }

  return {
    totalPlayers: players.length,
    avgOvr: Math.round(totalOvr / players.length),
    avgAge: Math.round(totalAge / players.length * 10) / 10,
    positionCounts,
    ovrDistribution: [
      { range: '80+', count: ovrBuckets['80+'] },
      { range: '70-79', count: ovrBuckets['70-79'] },
      { range: '60-69', count: ovrBuckets['60-69'] },
      { range: 'Below 60', count: ovrBuckets['Below 60'] },
    ],
  };
}
