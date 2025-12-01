/**
 * Roster Generator
 *
 * Generates complete 53-man rosters using position-specific OVR tables
 * and tier-based team quality modifiers.
 */

import { Team, Roster, Tier, Position, Player } from '../types';
import { ROSTER_TEMPLATE } from '../constants';
import { generatePlayer } from './player-generator';
import { calculateTargetOvr } from '../data/slot-ovr-tables';

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

            const player = generatePlayer(entry.position, targetOvr);
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
