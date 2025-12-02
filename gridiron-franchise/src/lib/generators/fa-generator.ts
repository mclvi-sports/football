/**
 * Free Agent Pool Generator
 *
 * Generates pools of unsigned free agents with FINALS-compliant distributions.
 * Free agents are typically veterans or mid-career players not on rosters.
 *
 * Source: FINAL-free-agent-pool-system.md
 */

import { Player, Position } from '../types';
import { generatePlayer } from './player-generator';

/**
 * Availability reasons for free agents (per FINALS)
 */
export type AvailabilityReason =
  | 'age_decline'      // 30% - 30+ years old, past prime
  | 'injury_history'   // 20% - Injury Prone trait, medical concerns
  | 'cap_casualty'     // 15% - Good player, team needed cap space
  | 'character_concerns' // 10% - Negative traits (Diva, Hot Head)
  | 'young_unproven'   // 15% - Low OVR, undrafted or cut rookie
  | 'market_timing';   // 10% - Seeking better contract, holdout

interface FAPoolConfig {
  size?: number; // Default: random 150-200 per FINALS
}

// Position distribution for FA pool (per FINALS percentages)
// Using midpoint counts for a 175-player pool
const FA_POSITION_WEIGHTS: { position: Position; weight: number }[] = [
  // QB: 5-7% → ~6% = 10.5/175
  { position: Position.QB, weight: 6 },
  // RB: 9-11% → ~10% = 17.5/175
  { position: Position.RB, weight: 10 },
  // WR: 12-15% → ~13.5% = 23.6/175
  { position: Position.WR, weight: 14 },
  // TE: 6-8% → ~7% = 12.25/175
  { position: Position.TE, weight: 7 },
  // OT: 7-9% → ~8% = 14/175 (split LT/RT)
  { position: Position.LT, weight: 4 },
  { position: Position.RT, weight: 4 },
  // IOL: 8-10% → ~9% = 15.75/175 (split LG/C/RG)
  { position: Position.LG, weight: 3 },
  { position: Position.C, weight: 3 },
  { position: Position.RG, weight: 3 },
  // DE: 8-10% → ~9% = 15.75/175
  { position: Position.DE, weight: 9 },
  // DT: 6-8% → ~7% = 12.25/175
  { position: Position.DT, weight: 7 },
  // LB: 10-12% → ~11% = 19.25/175 (split MLB/OLB)
  { position: Position.MLB, weight: 5 },
  { position: Position.OLB, weight: 6 },
  // CB: 8-10% → ~9% = 15.75/175
  { position: Position.CB, weight: 9 },
  // S: 7-9% → ~8% = 14/175 (split FS/SS)
  { position: Position.FS, weight: 4 },
  { position: Position.SS, weight: 4 },
  // K: 2-3% → ~2.5% = 4.4/175
  { position: Position.K, weight: 2 },
  // P: 2-3% → ~2.5% = 4.4/175
  { position: Position.P, weight: 2 },
];

/**
 * OVR distribution tiers per FINALS
 * | OVR Range | Percentage |
 * |-----------|------------|
 * | 80+       | 3%         |
 * | 75-79     | 10%        |
 * | 70-74     | 25%        |
 * | 65-69     | 35%        |
 * | 60-64     | 20%        |
 * | <60       | 7%         |
 */
const OVR_DISTRIBUTION = [
  { min: 80, max: 86, cumulative: 0.03 },  // 3%
  { min: 75, max: 79, cumulative: 0.13 },  // 10% (3+10)
  { min: 70, max: 74, cumulative: 0.38 },  // 25% (13+25)
  { min: 65, max: 69, cumulative: 0.73 },  // 35% (38+35)
  { min: 60, max: 64, cumulative: 0.93 },  // 20% (73+20)
  { min: 55, max: 59, cumulative: 1.0 },   // 7% (93+7)
];

/**
 * Availability reason distribution per FINALS
 */
const AVAILABILITY_REASON_WEIGHTS: { reason: AvailabilityReason; weight: number }[] = [
  { reason: 'age_decline', weight: 30 },
  { reason: 'injury_history', weight: 20 },
  { reason: 'cap_casualty', weight: 15 },
  { reason: 'character_concerns', weight: 10 },
  { reason: 'young_unproven', weight: 15 },
  { reason: 'market_timing', weight: 10 },
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

/**
 * Generate OVR using FINALS distribution
 */
function generateFreeAgentOVR(): number {
  const roll = Math.random();

  for (const tier of OVR_DISTRIBUTION) {
    if (roll < tier.cumulative) {
      return Math.floor(Math.random() * (tier.max - tier.min + 1)) + tier.min;
    }
  }
  // Fallback to lowest tier
  return Math.floor(Math.random() * 5) + 55;
}

/**
 * Generate age based on OVR (per FINALS correlation)
 * Higher OVR = older (why else unsigned?)
 */
function generateFreeAgentAge(ovr: number): number {
  let baseAge: number;

  if (ovr >= 80) {
    baseAge = 31; // FINALS: avg 31 for 80+
  } else if (ovr >= 75) {
    baseAge = 30; // FINALS: avg 30 for 75-79
  } else if (ovr >= 70) {
    baseAge = 29; // FINALS: avg 29 for 70-74
  } else if (ovr >= 65) {
    baseAge = 27; // FINALS: avg 27 for 65-69
  } else {
    baseAge = 25; // FINALS: avg 25 for <65
  }

  // Add variance: -2 to +4 per FINALS algorithm
  const variance = Math.floor(Math.random() * 7) - 2;
  const age = baseAge + variance;

  // Clamp to valid range (22-38 per FINALS)
  return Math.max(22, Math.min(38, age));
}

/**
 * Select availability reason based on OVR and age (per FINALS)
 */
function selectAvailabilityReason(ovr: number, age: number): AvailabilityReason {
  // Adjust weights based on player profile
  const adjustedWeights = AVAILABILITY_REASON_WEIGHTS.map((item) => {
    let weight = item.weight;

    // Age/Decline more likely for older players
    if (item.reason === 'age_decline') {
      if (age >= 32) weight *= 2;
      else if (age >= 30) weight *= 1.5;
      else if (age < 28) weight *= 0.3;
    }

    // Young & Unproven more likely for young, low OVR
    if (item.reason === 'young_unproven') {
      if (age <= 25 && ovr < 70) weight *= 2;
      else if (age > 27) weight *= 0.2;
    }

    // Cap casualty more likely for higher OVR
    if (item.reason === 'cap_casualty') {
      if (ovr >= 75) weight *= 1.5;
      else if (ovr < 70) weight *= 0.5;
    }

    return { reason: item.reason, weight };
  });

  return weightedRandom(adjustedWeights, (item) => (item as typeof AVAILABILITY_REASON_WEIGHTS[0]).reason);
}

/**
 * Extended player type with FA-specific fields
 */
export interface FreeAgent extends Player {
  availabilityReason: AvailabilityReason;
  weeksUnsigned: number;
}

/**
 * Generate a free agent pool per FINALS spec
 * Pool size: 150-200 players (default random in range)
 */
export function generateFAPool(config: FAPoolConfig = {}): FreeAgent[] {
  // Default size: random between 150-200 per FINALS
  const size = config.size ?? Math.floor(Math.random() * 51) + 150;
  const players: FreeAgent[] = [];

  for (let i = 0; i < size; i++) {
    const position = getRandomPosition();
    const targetOvr = generateFreeAgentOVR();
    const age = generateFreeAgentAge(targetOvr);
    const availabilityReason = selectAvailabilityReason(targetOvr, age);

    // Generate base player with age override
    const basePlayer = generatePlayer({ position, targetOvr, age });

    // Calculate experience from age (per FINALS: age - random(21, 23))
    const draftAge = Math.floor(Math.random() * 3) + 21;
    const experience = Math.max(0, age - draftAge);

    // Create free agent with extended fields
    const freeAgent: FreeAgent = {
      ...basePlayer,
      age,
      experience,
      availabilityReason,
      weeksUnsigned: 0,
    };

    // Free agents have no contract
    delete freeAgent.contract;

    players.push(freeAgent);
  }

  // Sort by overall descending
  players.sort((a, b) => b.overall - a.overall);

  return players;
}

/**
 * Get FA pool statistics (updated for FINALS compliance)
 */
export function getFAPoolStats(players: FreeAgent[]): {
  totalPlayers: number;
  avgOvr: number;
  avgAge: number;
  positionCounts: Record<Position, number>;
  ovrDistribution: { range: string; count: number; percentage: string }[];
  availabilityReasons: Record<AvailabilityReason, number>;
} {
  const positionCounts: Record<Position, number> = {} as Record<Position, number>;
  const availabilityReasons: Record<AvailabilityReason, number> = {
    age_decline: 0,
    injury_history: 0,
    cap_casualty: 0,
    character_concerns: 0,
    young_unproven: 0,
    market_timing: 0,
  };
  let totalOvr = 0;
  let totalAge = 0;

  // Updated OVR buckets to match FINALS distribution
  const ovrBuckets = {
    '80+': 0,
    '75-79': 0,
    '70-74': 0,
    '65-69': 0,
    '60-64': 0,
    'Below 60': 0,
  };

  for (const player of players) {
    totalOvr += player.overall;
    totalAge += player.age;

    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;

    // Count availability reasons
    if (player.availabilityReason) {
      availabilityReasons[player.availabilityReason]++;
    }

    // Updated OVR distribution to match FINALS
    if (player.overall >= 80) ovrBuckets['80+']++;
    else if (player.overall >= 75) ovrBuckets['75-79']++;
    else if (player.overall >= 70) ovrBuckets['70-74']++;
    else if (player.overall >= 65) ovrBuckets['65-69']++;
    else if (player.overall >= 60) ovrBuckets['60-64']++;
    else ovrBuckets['Below 60']++;
  }

  const total = players.length;

  return {
    totalPlayers: total,
    avgOvr: Math.round(totalOvr / total),
    avgAge: Math.round((totalAge / total) * 10) / 10,
    positionCounts,
    ovrDistribution: [
      { range: '80+', count: ovrBuckets['80+'], percentage: `${Math.round((ovrBuckets['80+'] / total) * 100)}%` },
      { range: '75-79', count: ovrBuckets['75-79'], percentage: `${Math.round((ovrBuckets['75-79'] / total) * 100)}%` },
      { range: '70-74', count: ovrBuckets['70-74'], percentage: `${Math.round((ovrBuckets['70-74'] / total) * 100)}%` },
      { range: '65-69', count: ovrBuckets['65-69'], percentage: `${Math.round((ovrBuckets['65-69'] / total) * 100)}%` },
      { range: '60-64', count: ovrBuckets['60-64'], percentage: `${Math.round((ovrBuckets['60-64'] / total) * 100)}%` },
      { range: 'Below 60', count: ovrBuckets['Below 60'], percentage: `${Math.round((ovrBuckets['Below 60'] / total) * 100)}%` },
    ],
    availabilityReasons,
  };
}
