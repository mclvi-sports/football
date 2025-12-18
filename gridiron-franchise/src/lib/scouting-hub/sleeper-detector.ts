/**
 * Sleeper Detector
 *
 * Identifies hidden gem prospects with high potential-to-OVR gap.
 * Integrates with scout perks for better detection.
 *
 * WO-SCOUTING-HUB-001
 */

import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { HiddenGem, StealAlert, StealAlertLevel } from './types';
import { STEAL_ALERT_THRESHOLDS } from './types';
import type { Scout } from '@/lib/scouting/types';
import { Position } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface SleeperConfig {
  minPotentialGap?: number; // Minimum potential - scoutedOvr gap (default: 10)
  maxRound?: number; // Max round to consider (default: 7)
  scouts?: Scout[]; // Available scouts (for perk bonuses)
  gmSleeperBonus?: number; // GM's sleepersPerDraft bonus
}

// ============================================================================
// SLEEPER DETECTION
// ============================================================================

/**
 * Detect hidden gems in a draft class
 * Hidden gems = prospects with high potential relative to scouted OVR
 */
export function detectHiddenGems(
  prospects: DraftProspect[],
  config: SleeperConfig = {}
): HiddenGem[] {
  const {
    minPotentialGap = 10,
    maxRound = 7,
    scouts = [],
    gmSleeperBonus = 0,
  } = config;

  const gems: HiddenGem[] = [];

  // Find scouts with diamond_finder perk (perks are Perk objects with .id)
  const diamondFinders = scouts.filter((s) =>
    s.perks.some((p) => p.id === 'diamond_finder')
  );

  for (const prospect of prospects) {
    // Skip drafted prospects above maxRound
    if (typeof prospect.round === 'number' && prospect.round > maxRound) continue;

    // Calculate potential gap
    const potentialGap = prospect.potential - prospect.scoutedOvr;

    if (potentialGap < minPotentialGap) continue;

    // Calculate draft value gap (expected pick vs actual value)
    const expectedRound = estimateExpectedRound(prospect.scoutedOvr);
    const actualRound = typeof prospect.round === 'number' ? prospect.round : 8;
    const draftValueGap = (expectedRound - actualRound) * 32; // Approximate picks difference

    // Determine confidence and discovery source
    let confidence = 50 + Math.min(potentialGap * 2, 40); // Base 50-90%
    let discoveredBy = 'Staff Evaluation';
    let discoveryPerk: string | undefined;

    // Check if any diamond finder would find this
    for (const scout of diamondFinders) {
      // Diamond finders have higher chance of finding hidden gems (use sleeperDiscovery)
      const scoutBonus = scout.attributes.sleeperDiscovery * 0.3;
      if (confidence + scoutBonus > 70) {
        discoveredBy = `${scout.firstName} ${scout.lastName}`;
        discoveryPerk = 'diamond_finder';
        confidence = Math.min(95, confidence + scoutBonus);
        break;
      }
    }

    // GM bonus for extra sleeper reveals
    if (gmSleeperBonus > 0) {
      confidence = Math.min(98, confidence + gmSleeperBonus * 5);
    }

    gems.push({
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position,
      scoutedOvr: prospect.scoutedOvr,
      potential: prospect.potential,
      potentialGap,
      discoveredBy,
      discoveryPerk: discoveryPerk as HiddenGem['discoveryPerk'],
      draftValueGap,
      confidence: Math.round(confidence),
    });
  }

  // Sort by potential gap (highest first)
  gems.sort((a, b) => b.potentialGap - a.potentialGap);

  return gems;
}

/**
 * Estimate which round a prospect should go based on OVR
 */
function estimateExpectedRound(scoutedOvr: number): number {
  if (scoutedOvr >= 80) return 1;
  if (scoutedOvr >= 76) return 2;
  if (scoutedOvr >= 72) return 3;
  if (scoutedOvr >= 68) return 4;
  if (scoutedOvr >= 64) return 5;
  if (scoutedOvr >= 60) return 6;
  if (scoutedOvr >= 56) return 7;
  return 8; // UDFA
}

// ============================================================================
// STEAL ALERTS
// ============================================================================

/**
 * Check if a prospect falling to a pick constitutes a steal alert
 */
export function checkStealAlert(
  prospect: DraftProspect,
  currentPick: number,
  expectedPick: number
): StealAlert | null {
  const picksDrop = currentPick - expectedPick;

  if (picksDrop < STEAL_ALERT_THRESHOLDS.watch) {
    return null; // Not a steal
  }

  let alertLevel: StealAlertLevel;
  if (picksDrop >= STEAL_ALERT_THRESHOLDS.steal) {
    alertLevel = 'steal';
  } else if (picksDrop >= STEAL_ALERT_THRESHOLDS.value) {
    alertLevel = 'value';
  } else {
    alertLevel = 'watch';
  }

  return {
    id: `steal_${prospect.id}_${currentPick}`,
    prospectId: prospect.id,
    prospectName: `${prospect.firstName} ${prospect.lastName}`,
    position: prospect.position,
    expectedPick,
    currentPick,
    picksDrop,
    alertLevel,
    scoutedOvr: prospect.scoutedOvr,
    timestamp: Date.now(),
  };
}

/**
 * Generate steal alerts for all available prospects at a given pick
 */
export function generateStealAlerts(
  availableProspects: DraftProspect[],
  currentPick: number,
  projections: Map<string, number> // prospectId -> expected pick
): StealAlert[] {
  const alerts: StealAlert[] = [];

  for (const prospect of availableProspects) {
    const expectedPick = projections.get(prospect.id);
    if (!expectedPick) continue;

    const alert = checkStealAlert(prospect, currentPick, expectedPick);
    if (alert) {
      alerts.push(alert);
    }
  }

  // Sort by alert level (steal > value > watch) and then by picks drop
  const levelOrder: StealAlertLevel[] = ['steal', 'value', 'watch'];
  alerts.sort((a, b) => {
    const levelCompare = levelOrder.indexOf(a.alertLevel) - levelOrder.indexOf(b.alertLevel);
    if (levelCompare !== 0) return levelCompare;
    return b.picksDrop - a.picksDrop;
  });

  return alerts;
}

// ============================================================================
// SLEEPER CANDIDATES BY POSITION
// ============================================================================

/**
 * Get sleeper candidates grouped by position
 */
export function getSleepersByPosition(
  prospects: DraftProspect[],
  config: SleeperConfig = {}
): Record<Position, HiddenGem[]> {
  const allGems = detectHiddenGems(prospects, config);
  const byPosition = {} as Record<Position, HiddenGem[]>;

  // Initialize all positions
  for (const pos of Object.values(Position)) {
    byPosition[pos] = [];
  }

  // Group by position
  for (const gem of allGems) {
    byPosition[gem.position].push(gem);
  }

  return byPosition;
}

/**
 * Get top sleepers overall (limited count)
 */
export function getTopSleepers(
  prospects: DraftProspect[],
  count: number = 10,
  config: SleeperConfig = {}
): HiddenGem[] {
  const allGems = detectHiddenGems(prospects, config);
  return allGems.slice(0, count);
}

// ============================================================================
// SLEEPER STATS
// ============================================================================

/**
 * Get sleeper statistics for a draft class
 */
export function getSleeperStats(
  prospects: DraftProspect[],
  config: SleeperConfig = {}
): {
  totalSleepers: number;
  byRound: Record<number | 'UDFA', number>;
  byPosition: Record<Position, number>;
  avgPotentialGap: number;
  topSleeper: HiddenGem | null;
} {
  const gems = detectHiddenGems(prospects, config);

  const byRound: Record<number | 'UDFA', number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, UDFA: 0,
  };

  const byPosition = {} as Record<Position, number>;
  for (const pos of Object.values(Position)) {
    byPosition[pos] = 0;
  }

  let totalGap = 0;

  for (const gem of gems) {
    // Find original prospect to get round
    const prospect = prospects.find((p) => p.id === gem.prospectId);
    if (prospect) {
      const round = typeof prospect.round === 'number' ? prospect.round : 'UDFA';
      byRound[round]++;
    }

    byPosition[gem.position]++;
    totalGap += gem.potentialGap;
  }

  return {
    totalSleepers: gems.length,
    byRound,
    byPosition,
    avgPotentialGap: gems.length > 0 ? Math.round(totalGap / gems.length) : 0,
    topSleeper: gems[0] || null,
  };
}
