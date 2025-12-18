/**
 * Compensatory Pick Calculations
 *
 * NFL-style compensatory pick system based on free agent losses vs gains.
 * Teams that lose more valuable free agents than they sign receive comp picks.
 *
 * WO-DRAFT-EXPERIENCE-001 - Phase 4
 */

import type { Player } from '@/lib/types';
import type { DraftPick } from '@/stores/draft-store';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FreeAgentContract {
  playerId: string;
  playerName: string;
  fromTeamId: string;
  toTeamId: string;
  salary: number; // Annual salary in millions
  years: number;
  overall: number;
  position: string;
  isQualifying: boolean; // Did player receive qualifying offer from original team?
}

export interface CompensatoryPickResult {
  teamId: string;
  picks: CompensatoryPick[];
  netLoss: number; // Total value lost minus gained
  qualifyingLosses: FreeAgentContract[];
}

export interface CompensatoryPick {
  round: 3 | 4 | 5 | 6 | 7;
  pickInRound: number; // Position within comp picks for that round
  value: number; // Estimated pick value
  compensatingFor: string; // Player name this pick compensates for
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// Maximum comp picks per team per year
const MAX_COMP_PICKS_PER_TEAM = 4;

// Salary thresholds for comp pick rounds (in millions)
const COMP_PICK_THRESHOLDS = {
  round3: 15, // $15M+ AAV = Round 3 comp
  round4: 10, // $10-15M AAV = Round 4 comp
  round5: 6, // $6-10M AAV = Round 5 comp
  round6: 3, // $3-6M AAV = Round 6 comp
  round7: 1, // $1-3M AAV = Round 7 comp
};

// Free agent value calculation weights
const VALUE_WEIGHTS = {
  salary: 0.5, // Salary is primary factor
  overall: 0.3, // Player quality matters
  playtime: 0.2, // Playing time/snaps (simplified to overall-based)
};

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the compensatory value of a free agent signing
 */
export function calculateFreeAgentValue(contract: FreeAgentContract): number {
  // Normalize salary to 0-100 scale (assuming max salary ~$25M)
  const normalizedSalary = Math.min((contract.salary / 25) * 100, 100);

  // Overall is already 0-100
  const normalizedOverall = contract.overall;

  // Playtime estimate based on overall (starters play more)
  const normalizedPlaytime = contract.overall >= 75 ? 100 : contract.overall >= 65 ? 75 : 50;

  const value =
    normalizedSalary * VALUE_WEIGHTS.salary +
    normalizedOverall * VALUE_WEIGHTS.overall +
    normalizedPlaytime * VALUE_WEIGHTS.playtime;

  return value;
}

/**
 * Determine comp pick round based on contract value
 */
export function getCompPickRound(salary: number): 3 | 4 | 5 | 6 | 7 | null {
  if (salary >= COMP_PICK_THRESHOLDS.round3) return 3;
  if (salary >= COMP_PICK_THRESHOLDS.round4) return 4;
  if (salary >= COMP_PICK_THRESHOLDS.round5) return 5;
  if (salary >= COMP_PICK_THRESHOLDS.round6) return 6;
  if (salary >= COMP_PICK_THRESHOLDS.round7) return 7;
  return null; // Too low value for comp pick
}

/**
 * Calculate compensatory picks for all teams
 */
export function calculateCompensatoryPicks(
  freeAgentSignings: FreeAgentContract[],
  teamIds: string[]
): Map<string, CompensatoryPickResult> {
  const results = new Map<string, CompensatoryPickResult>();

  // Group signings by team
  const teamLosses: Record<string, FreeAgentContract[]> = {};
  const teamGains: Record<string, FreeAgentContract[]> = {};

  for (const teamId of teamIds) {
    teamLosses[teamId] = [];
    teamGains[teamId] = [];
  }

  for (const signing of freeAgentSignings) {
    if (signing.fromTeamId && signing.isQualifying) {
      teamLosses[signing.fromTeamId]?.push(signing);
    }
    if (signing.toTeamId) {
      teamGains[signing.toTeamId]?.push(signing);
    }
  }

  // Calculate comp picks for each team
  for (const teamId of teamIds) {
    const losses = teamLosses[teamId] || [];
    const gains = teamGains[teamId] || [];

    // Sort by value (highest first)
    const sortedLosses = [...losses]
      .map((l) => ({ ...l, value: calculateFreeAgentValue(l) }))
      .sort((a, b) => b.value - a.value);

    const sortedGains = [...gains]
      .map((g) => ({ ...g, value: calculateFreeAgentValue(g) }))
      .sort((a, b) => b.value - a.value);

    // Cancel out losses with gains
    const unconpensatedLosses: (FreeAgentContract & { value: number })[] = [];
    let gainIndex = 0;

    for (const loss of sortedLosses) {
      // Find a gain that cancels this loss
      let cancelled = false;
      while (gainIndex < sortedGains.length) {
        const gain = sortedGains[gainIndex];
        if (gain.value >= loss.value * 0.8) {
          // Gain cancels loss
          gainIndex++;
          cancelled = true;
          break;
        }
        gainIndex++;
      }

      if (!cancelled) {
        unconpensatedLosses.push(loss);
      }
    }

    // Convert uncompensated losses to comp picks
    const picks: CompensatoryPick[] = [];
    const qualifyingLosses: FreeAgentContract[] = [];

    for (const loss of unconpensatedLosses.slice(0, MAX_COMP_PICKS_PER_TEAM)) {
      const round = getCompPickRound(loss.salary);
      if (round) {
        picks.push({
          round,
          pickInRound: picks.filter((p) => p.round === round).length + 1,
          value: loss.value,
          compensatingFor: loss.playerName,
        });
        qualifyingLosses.push(loss);
      }
    }

    // Sort picks by round
    picks.sort((a, b) => a.round - b.round);

    const totalLossValue = sortedLosses.reduce((sum, l) => sum + l.value, 0);
    const totalGainValue = sortedGains.reduce((sum, g) => sum + g.value, 0);

    results.set(teamId, {
      teamId,
      picks,
      netLoss: totalLossValue - totalGainValue,
      qualifyingLosses,
    });
  }

  return results;
}

/**
 * Convert compensatory pick results to DraftPick format
 */
export function compPicksToDraftPicks(
  compResults: Map<string, CompensatoryPickResult>,
  basePickNumber: number = 225 // Start after pick 224
): DraftPick[] {
  const picks: DraftPick[] = [];
  let pickNumber = basePickNumber;

  // Group by round
  const picksByRound: Record<number, { teamId: string; pick: CompensatoryPick }[]> = {
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  };

  for (const [teamId, result] of compResults) {
    for (const pick of result.picks) {
      picksByRound[pick.round].push({ teamId, pick });
    }
  }

  // Sort each round by value (highest first)
  for (const round of [3, 4, 5, 6, 7]) {
    const roundPicks = picksByRound[round].sort((a, b) => b.pick.value - a.pick.value);

    for (const { teamId } of roundPicks) {
      picks.push({
        round,
        pick: 33 + picks.filter((p) => p.round === round).length, // After regular picks
        overall: pickNumber++,
        teamId,
        originalTeamId: teamId,
        isCompensatory: true,
      });
    }
  }

  return picks;
}

/**
 * Generate mock free agent data for testing
 */
export function generateMockFreeAgentSignings(
  teamIds: string[],
  count: number = 50
): FreeAgentContract[] {
  const signings: FreeAgentContract[] = [];

  const firstNames = ['John', 'Mike', 'Chris', 'James', 'David', 'Marcus', 'Ryan', 'Brandon', 'Tyler', 'Justin'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const positions = ['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'DE', 'DT', 'MLB', 'OLB', 'CB', 'FS', 'SS'];

  for (let i = 0; i < count; i++) {
    const fromTeam = teamIds[Math.floor(Math.random() * teamIds.length)];
    let toTeam = teamIds[Math.floor(Math.random() * teamIds.length)];
    while (toTeam === fromTeam) {
      toTeam = teamIds[Math.floor(Math.random() * teamIds.length)];
    }

    const overall = Math.floor(Math.random() * 25) + 65; // 65-90
    const salary = Math.floor(Math.random() * 20) + 2; // $2-22M

    signings.push({
      playerId: `fa-${i}`,
      playerName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      fromTeamId: fromTeam,
      toTeamId: toTeam,
      salary,
      years: Math.floor(Math.random() * 4) + 1,
      overall,
      position: positions[Math.floor(Math.random() * positions.length)],
      isQualifying: Math.random() > 0.3, // 70% receive qualifying offer
    });
  }

  return signings;
}

/**
 * Get summary of comp picks for display
 */
export function getCompPickSummary(
  results: Map<string, CompensatoryPickResult>
): { teamId: string; round3: number; round4: number; round5: number; round6: number; round7: number; total: number }[] {
  const summary: { teamId: string; round3: number; round4: number; round5: number; round6: number; round7: number; total: number }[] = [];

  for (const [teamId, result] of results) {
    if (result.picks.length > 0) {
      summary.push({
        teamId,
        round3: result.picks.filter((p) => p.round === 3).length,
        round4: result.picks.filter((p) => p.round === 4).length,
        round5: result.picks.filter((p) => p.round === 5).length,
        round6: result.picks.filter((p) => p.round === 6).length,
        round7: result.picks.filter((p) => p.round === 7).length,
        total: result.picks.length,
      });
    }
  }

  return summary.sort((a, b) => b.total - a.total);
}
