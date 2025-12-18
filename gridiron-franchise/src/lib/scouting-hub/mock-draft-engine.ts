/**
 * Mock Draft Engine
 *
 * Simulates mock drafts to project where prospects might land.
 * Uses existing draft-ai.ts logic for team evaluation.
 *
 * WO-SCOUTING-HUB-001
 */

import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { TeamNeeds } from '@/stores/draft-store';
import type { MockDraftPick, MockDraftResult, MockDraftSettings } from './types';
import { Position } from '@/lib/types';
import {
  generateTeamProfile,
  evaluateProspect,
  type AITeamProfile,
} from '@/lib/draft/draft-ai';

// ============================================================================
// TYPES
// ============================================================================

interface TeamInfo {
  id: string;
  name: string;
  abbreviation: string;
}

interface SimulationOptions {
  draftClass: DraftProspect[];
  teams: TeamInfo[];
  userTeamId: string;
  settings: MockDraftSettings;
  seed?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PICKS_PER_ROUND = 32;

// ============================================================================
// SEEDED RANDOM
// ============================================================================

function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ============================================================================
// TEAM NEEDS GENERATION
// ============================================================================

const PRIORITIES: ('critical' | 'high' | 'medium' | 'low')[] = [
  'critical',
  'high',
  'medium',
  'low',
];

/**
 * Generate random team needs for simulation
 * Returns the correct TeamNeeds structure from draft-store
 */
function generateTeamNeeds(teamId: string, random: () => number): TeamNeeds {
  const allPositions = Object.values(Position);

  return {
    teamId,
    positions: allPositions.map((position) => ({
      position,
      priority: PRIORITIES[Math.floor(random() * 4)],
      currentDepth: Math.floor(random() * 3) + 1,
      targetDepth: Math.floor(random() * 2) + 2,
    })),
  };
}

/**
 * Update needs after a pick (reduce priority for filled position)
 */
function updateTeamNeeds(needs: TeamNeeds, draftedPosition: Position): TeamNeeds {
  return {
    ...needs,
    positions: needs.positions.map((n) => {
      if (n.position === draftedPosition && n.priority !== 'low') {
        // Downgrade priority after filling
        const currentIndex = PRIORITIES.indexOf(n.priority);
        return {
          ...n,
          priority: PRIORITIES[Math.min(currentIndex + 1, PRIORITIES.length - 1)],
          currentDepth: n.currentDepth + 1,
        };
      }
      return n;
    }),
  };
}

// ============================================================================
// MOCK DRAFT SIMULATION
// ============================================================================

/**
 * Run a single mock draft simulation
 */
export function runMockDraftSimulation(
  draftClass: DraftProspect[],
  teams: TeamInfo[],
  userTeamId: string,
  roundsToSimulate: number,
  seed: number
): MockDraftResult {
  const random = createSeededRandom(seed);
  const picks: MockDraftPick[] = [];
  const availableProspects = new Set(draftClass.map((p) => p.id));

  // Generate team profiles and needs
  const teamProfiles = new Map<string, AITeamProfile>();
  const teamNeeds = new Map<string, TeamNeeds>();

  for (const team of teams) {
    teamProfiles.set(team.id, generateTeamProfile(team.id, seed + team.id.charCodeAt(0)));
    teamNeeds.set(team.id, generateTeamNeeds(team.id, random));
  }

  // Create draft order (simple snake for now)
  const draftOrder: { teamId: string; round: number; pickInRound: number }[] = [];
  for (let round = 1; round <= roundsToSimulate; round++) {
    for (let pick = 1; pick <= PICKS_PER_ROUND; pick++) {
      const teamIndex = (pick - 1) % teams.length;
      draftOrder.push({
        teamId: teams[teamIndex]?.id || teams[0].id,
        round,
        pickInRound: pick,
      });
    }
  }

  // Simulate each pick
  for (let i = 0; i < draftOrder.length; i++) {
    const { teamId, round, pickInRound } = draftOrder[i];
    const overall = i + 1;

    // Get available prospects
    const available = draftClass.filter((p) => availableProspects.has(p.id));
    if (available.length === 0) break;

    // Get team info
    const profile = teamProfiles.get(teamId)!;
    const needs = teamNeeds.get(teamId)!;

    // Evaluate prospects
    const evaluations = available.map((prospect) => ({
      prospect,
      evaluation: evaluateProspect(prospect, needs, profile, overall),
    }));

    // Add randomness to simulate variance
    const randomizedEvaluations = evaluations.map((e) => ({
      ...e,
      score: e.evaluation.finalScore + (random() - 0.5) * 10,
    }));

    // Sort by score and pick best
    randomizedEvaluations.sort((a, b) => b.score - a.score);
    const selectedProspect = randomizedEvaluations[0].prospect;

    // Record pick
    picks.push({
      overall,
      round,
      pickInRound,
      teamId,
      prospectId: selectedProspect.id,
      prospectName: `${selectedProspect.firstName} ${selectedProspect.lastName}`,
      position: selectedProspect.position,
      isUserPick: teamId === userTeamId,
    });

    // Remove from available
    availableProspects.delete(selectedProspect.id);

    // Update team needs
    teamNeeds.set(teamId, updateTeamNeeds(needs, selectedProspect.position));
  }

  return {
    simulationId: `sim_${seed}`,
    seed,
    timestamp: Date.now(),
    picks,
    userTeamPicks: picks.filter((p) => p.isUserPick),
  };
}

/**
 * Run multiple mock draft simulations
 */
export function runMockDraftSimulations(options: SimulationOptions): MockDraftResult[] {
  const { draftClass, teams, userTeamId, settings, seed = Date.now() } = options;
  const results: MockDraftResult[] = [];

  for (let i = 0; i < settings.simulationCount; i++) {
    const simulationSeed = seed + i * 1000;
    const result = runMockDraftSimulation(
      draftClass,
      teams,
      userTeamId,
      settings.roundsToSimulate,
      simulationSeed
    );
    results.push(result);
  }

  return results;
}

// ============================================================================
// PROJECTIONS
// ============================================================================

export interface ProspectProjection {
  prospectId: string;
  prospectName: string;
  position: Position;
  scoutedOvr: number;
  pickHistory: number[];
  avgPick: number;
  minPick: number;
  maxPick: number;
  consensus: {
    floor: number;
    ceiling: number;
    mostLikely: number;
  };
  roundProjection: number;
  likelyAvailableAtPicks: number[];
  availabilityProbability: Record<number, number>;
}

/**
 * Calculate projections from simulation results
 */
export function calculateProjections(
  results: MockDraftResult[],
  draftClass: DraftProspect[],
  userTeamPicks: number[]
): ProspectProjection[] {
  const prospectMap = new Map(draftClass.map((p) => [p.id, p]));
  const prospectPicks = new Map<string, number[]>();

  // Collect all picks for each prospect
  for (const result of results) {
    for (const pick of result.picks) {
      const existing = prospectPicks.get(pick.prospectId) || [];
      existing.push(pick.overall);
      prospectPicks.set(pick.prospectId, existing);
    }
  }

  // Calculate projections
  const projections: ProspectProjection[] = [];

  for (const [prospectId, picks] of prospectPicks) {
    const prospect = prospectMap.get(prospectId);
    if (!prospect) continue;

    picks.sort((a, b) => a - b);

    const avgPick = Math.round(picks.reduce((a, b) => a + b, 0) / picks.length);
    const minPick = picks[0];
    const maxPick = picks[picks.length - 1];

    // Calculate percentiles
    const floor = picks[Math.floor(picks.length * 0.75)] || maxPick;
    const ceiling = picks[Math.floor(picks.length * 0.25)] || minPick;

    // Find mode (most common pick range)
    const pickCounts = new Map<number, number>();
    for (const pick of picks) {
      const roundedPick = Math.round(pick / 5) * 5; // Group by 5s
      pickCounts.set(roundedPick, (pickCounts.get(roundedPick) || 0) + 1);
    }
    let mostLikely = avgPick;
    let maxCount = 0;
    for (const [pick, count] of pickCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostLikely = pick;
      }
    }

    // Calculate availability at each user pick
    const availabilityProbability: Record<number, number> = {};
    const likelyAvailableAtPicks: number[] = [];

    for (const userPick of userTeamPicks) {
      const availableCount = picks.filter((p) => p >= userPick).length;
      const probability = Math.round((availableCount / picks.length) * 100);
      availabilityProbability[userPick] = probability;

      if (probability >= 50) {
        likelyAvailableAtPicks.push(userPick);
      }
    }

    projections.push({
      prospectId,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position,
      scoutedOvr: prospect.scoutedOvr,
      pickHistory: picks,
      avgPick,
      minPick,
      maxPick,
      consensus: { floor, ceiling, mostLikely },
      roundProjection: Math.ceil(avgPick / 32),
      likelyAvailableAtPicks,
      availabilityProbability,
    });
  }

  // Sort by average pick
  projections.sort((a, b) => a.avgPick - b.avgPick);

  return projections;
}
