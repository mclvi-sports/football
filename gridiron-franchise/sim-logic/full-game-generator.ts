/**
 * Full Game Generator
 *
 * Generates complete game data: all 32 team rosters, free agent pool, and draft class.
 * Used to bootstrap a new game/league.
 */

import { Player, Roster, Tier } from '../types';
import { generateTeamRoster, getRosterStats } from './roster-generator';
import { generateFAPool, getFAPoolStats, FreeAgent } from './fa-generator';
import { generateDraftClass, getDraftClassStats, DraftProspect } from './draft-generator';
import { LEAGUE_TEAMS, TeamInfo } from '../data/teams';

// Re-export for backward compatibility
export { LEAGUE_TEAMS };
export type { TeamInfo };

export interface TeamRosterData {
  team: TeamInfo;
  tier: Tier;
  roster: Roster;
  stats: {
    totalPlayers: number;
    avgOvr: number;
    avgAge: number;
  };
}

export interface FullGameData {
  teams: TeamRosterData[];
  freeAgents: FreeAgent[];
  draftClass: DraftProspect[];
  totalPlayers: number;
  generatedAt: string;
}

export interface FullGameStats {
  teamCount: number;
  totalRosterPlayers: number;
  avgTeamOvr: number;
  freeAgentCount: number;
  freeAgentAvgOvr: number;
  draftClassCount: number;
  draftClassAvgOvr: number;
  totalPlayers: number;
  tierDistribution: Record<Tier, number>;
}

// Tier distribution per FINALS spec
const TIER_DISTRIBUTION: { tier: Tier; count: number }[] = [
  { tier: Tier.Elite, count: 3 },        // Super Bowl contenders
  { tier: Tier.Good, count: 8 },         // Playoff caliber
  { tier: Tier.Average, count: 12 },     // Middle of the pack
  { tier: Tier.BelowAverage, count: 6 }, // Struggling
  { tier: Tier.Rebuilding, count: 3 },   // Bottom of the league
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function assignTiers(): Map<string, Tier> {
  const tiers = new Map<string, Tier>();
  const shuffledTeams = shuffleArray(LEAGUE_TEAMS);

  let teamIndex = 0;
  for (const { tier, count } of TIER_DISTRIBUTION) {
    for (let i = 0; i < count && teamIndex < shuffledTeams.length; i++) {
      tiers.set(shuffledTeams[teamIndex].id, tier);
      teamIndex++;
    }
  }

  return tiers;
}

/**
 * Generate all 32 team rosters with tier distribution
 * Can be used independently or as part of full game generation
 */
export function generateAllTeamRosters(): { teams: TeamRosterData[]; tierAssignments: Map<string, Tier> } {
  const tierAssignments = assignTiers();
  const teams: TeamRosterData[] = [];

  for (const teamInfo of LEAGUE_TEAMS) {
    const tier = tierAssignments.get(teamInfo.id) || Tier.Average;
    const roster = generateTeamRoster(teamInfo.id, tier);
    const rosterStats = getRosterStats(roster);

    teams.push({
      team: teamInfo,
      tier,
      roster,
      stats: {
        totalPlayers: rosterStats.totalPlayers,
        avgOvr: rosterStats.avgOvr,
        avgAge: rosterStats.avgAge,
      },
    });
  }

  return { teams, tierAssignments };
}

/**
 * Generate complete game data (rosters + FA + draft)
 */
export function generateFullGame(): FullGameData {
  // Generate all team rosters
  const { teams } = generateAllTeamRosters();

  // Generate free agent pool (150-200 players per FINALS)
  const freeAgents = generateFAPool({ size: 175 });

  // Generate draft class (~275 prospects per FINALS)
  const draftClass = generateDraftClass();

  const totalRosterPlayers = teams.reduce((sum, t) => sum + t.stats.totalPlayers, 0);

  return {
    teams,
    freeAgents,
    draftClass,
    totalPlayers: totalRosterPlayers + freeAgents.length + draftClass.length,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get full game statistics
 */
export function getFullGameStats(data: FullGameData): FullGameStats {
  const tierDistribution: Record<Tier, number> = {
    [Tier.Elite]: 0,
    [Tier.Good]: 0,
    [Tier.Average]: 0,
    [Tier.BelowAverage]: 0,
    [Tier.Rebuilding]: 0,
  };

  let totalTeamOvr = 0;
  let totalRosterPlayers = 0;

  for (const teamData of data.teams) {
    tierDistribution[teamData.tier]++;
    totalTeamOvr += teamData.stats.avgOvr;
    totalRosterPlayers += teamData.stats.totalPlayers;
  }

  const faStats = getFAPoolStats(data.freeAgents);
  const draftStats = getDraftClassStats(data.draftClass);

  return {
    teamCount: data.teams.length,
    totalRosterPlayers,
    avgTeamOvr: Math.round(totalTeamOvr / data.teams.length),
    freeAgentCount: data.freeAgents.length,
    freeAgentAvgOvr: faStats.avgOvr,
    draftClassCount: data.draftClass.length,
    draftClassAvgOvr: draftStats.avgOvr,
    totalPlayers: data.totalPlayers,
    tierDistribution,
  };
}
