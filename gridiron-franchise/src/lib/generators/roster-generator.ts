/**
 * Roster Generator
 *
 * Generates complete 53-man rosters using position-specific OVR tables
 * and tier-based team quality modifiers.
 *
 * Source: FINAL-roster-generation-system.md, FINAL-salarycap.md
 */

import { Team, Roster, Tier, Position, Player } from '../types';
import { ROSTER_TEMPLATE } from '../constants';
import { generatePlayer } from './player-generator';
import { calculateTargetOvr } from '../data/slot-ovr-tables';

/**
 * Veteran minimum salary by experience (per FINALS)
 */
const VETERAN_MINIMUM: Record<number, number> = {
  0: 0.75,
  1: 0.87,
  2: 0.95,
  3: 1.02,
  4: 1.10,
  5: 1.17,
  6: 1.24,
  7: 1.30,
};

/**
 * Get minimum salary based on experience (per FINALS)
 */
function getMinimumSalary(experience: number): number {
  return VETERAN_MINIMUM[Math.min(experience, 7)] ?? 1.30;
}

/**
 * Calculate salary based on OVR and position (per FINALS salary by OVR)
 */
function calculateSalary(ovr: number, position: Position, experience: number): number {
  const minimum = getMinimumSalary(experience);

  // OVR-based salary ranges from FINALS
  let minSalary: number;
  let maxSalary: number;

  if (ovr >= 95) {
    minSalary = 30; maxSalary = 55;
  } else if (ovr >= 90) {
    minSalary = 20; maxSalary = 35;
  } else if (ovr >= 85) {
    minSalary = 12; maxSalary = 22;
  } else if (ovr >= 80) {
    minSalary = 6; maxSalary = 14;
  } else if (ovr >= 75) {
    minSalary = 3; maxSalary = 8;
  } else if (ovr >= 70) {
    minSalary = 2; maxSalary = 4;
  } else if (ovr >= 65) {
    minSalary = 1; maxSalary = 2;
  } else {
    return minimum;
  }

  // Position-based premium (QBs get top of range)
  let positionModifier = 0.5; // Default to middle
  if (position === Position.QB) {
    positionModifier = 0.8;
  } else if ([Position.DE, Position.WR].includes(position)) {
    positionModifier = 0.6;
  } else if ([Position.LT, Position.CB].includes(position)) {
    positionModifier = 0.55;
  }

  const salary = minSalary + (maxSalary - minSalary) * positionModifier;

  // Add some variance (±15%)
  const variance = 0.85 + Math.random() * 0.30;
  return Math.max(minimum, Math.round(salary * variance * 100) / 100);
}

/**
 * Calculate contract length based on age and OVR (per FINALS)
 */
function calculateContractLength(ovr: number, age: number, slot: number): number {
  // Younger, higher OVR players get longer contracts
  if (ovr >= 90 && age <= 28) {
    return Math.random() < 0.6 ? 5 : 4; // Franchise cornerstone
  } else if (ovr >= 85 && age <= 30) {
    return Math.random() < 0.5 ? 4 : 3; // Core player
  } else if (ovr >= 80 && age <= 32) {
    return Math.random() < 0.5 ? 3 : 2; // Standard deal
  } else if (ovr >= 75) {
    return Math.random() < 0.6 ? 2 : 1; // Bridge contract
  } else if (slot >= 3 || age >= 32) {
    return 1; // Prove-it / veteran depth
  } else {
    return Math.random() < 0.5 ? 2 : 1;
  }
}

/**
 * Generate contract for a roster player (per FINALS salary cap)
 */
function generateContract(
  player: Player,
  slot: number
): { years: number; salary: number } {
  const years = calculateContractLength(player.overall, player.age, slot);
  const salary = calculateSalary(player.overall, player.position, player.experience);

  return { years, salary };
}

/**
 * Generate a complete 53-man roster for a team
 */
export function generateTeamRoster(teamId: string, tier: Tier): Roster {
    const players: Player[] = [];
    const depthChart: Record<Position, string[]> = {} as Record<Position, string[]>;

    for (const entry of ROSTER_TEMPLATE) {
        depthChart[entry.position] = [];

        for (let slot = 1; slot <= entry.count; slot++) {
            const targetOvr = calculateTargetOvr(entry.position, slot, tier);

            const player = generatePlayer({ position: entry.position, targetOvr, slot });

            // Generate contract for roster players (per FINALS)
            player.contract = generateContract(player, slot);

            players.push(player);
            depthChart[entry.position].push(player.id);
        }
    }

    return { players, depthChart };
}

/**
 * Generate rosters for multiple teams
 */
export function generateLeagueRosters(teams: Team[]): Map<string, Roster> {
    const rosters = new Map<string, Roster>();

    for (const team of teams) {
        const roster = generateTeamRoster(team.id, team.tier);
        rosters.set(team.id, roster);
    }

    return rosters;
}

/**
 * Get roster statistics for debugging/analysis
 */
export function getRosterStats(roster: Roster): {
    totalPlayers: number;
    avgOvr: number;
    avgAge: number;
    positionBreakdown: Record<Position, { count: number; avgOvr: number }>;
} {
    const positionBreakdown: Record<Position, { count: number; avgOvr: number; totalOvr: number }> =
        {} as Record<Position, { count: number; avgOvr: number; totalOvr: number }>;

    let totalOvr = 0;
    let totalAge = 0;

    for (const player of roster.players) {
        totalOvr += player.overall;
        totalAge += player.age;

        if (!positionBreakdown[player.position]) {
            positionBreakdown[player.position] = { count: 0, avgOvr: 0, totalOvr: 0 };
        }
        positionBreakdown[player.position].count++;
        positionBreakdown[player.position].totalOvr += player.overall;
    }

    // Calculate averages
    const result: Record<Position, { count: number; avgOvr: number }> =
        {} as Record<Position, { count: number; avgOvr: number }>;

    for (const pos of Object.keys(positionBreakdown) as Position[]) {
        const data = positionBreakdown[pos];
        result[pos] = {
            count: data.count,
            avgOvr: Math.round(data.totalOvr / data.count)
        };
    }

    return {
        totalPlayers: roster.players.length,
        avgOvr: Math.round(totalOvr / roster.players.length),
        avgAge: Math.round(totalAge / roster.players.length * 10) / 10,
        positionBreakdown: result
    };
}
