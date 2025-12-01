/**
 * Full Game Generator
 *
 * Generates complete game data: all 32 team rosters, free agent pool, and draft class.
 * Used to bootstrap a new game/league.
 */

import { Player, Roster, Tier } from '../types';
import { generateTeamRoster, getRosterStats } from './roster-generator';
import { generateFAPool, getFAPoolStats } from './fa-generator';
import { generateDraftClass, getDraftClassStats } from './draft-generator';

// All 32 teams with their info
export const NFL_TEAMS: TeamInfo[] = [
  // Atlantic Conference
  { id: 'BOS', city: 'Boston', name: 'Rebels', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'PHI', city: 'Philadelphia', name: 'Ironworks', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'PIT', city: 'Pittsburgh', name: 'Riverhawks', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'BAL', city: 'Baltimore', name: 'Knights', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'MIA', city: 'Miami', name: 'Sharks', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'ORL', city: 'Orlando', name: 'Thunder', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'ATL', city: 'Atlanta', name: 'Firebirds', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'CLT', city: 'Charlotte', name: 'Crowns', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'NYE', city: 'New York', name: 'Empire', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'BKN', city: 'Brooklyn', name: 'Bolts', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'NWK', city: 'Newark', name: 'Sentinels', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'WAS', city: 'Washington', name: 'Monuments', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'CHI', city: 'Chicago', name: 'Blaze', conference: 'Atlantic', division: 'Atlantic West' },
  { id: 'DET', city: 'Detroit', name: 'Engines', conference: 'Atlantic', division: 'Atlantic West' },
  { id: 'CLE', city: 'Cleveland', name: 'Forge', conference: 'Atlantic', division: 'Atlantic West' },
  { id: 'IND', city: 'Indianapolis', name: 'Stampede', conference: 'Atlantic', division: 'Atlantic West' },
  // Pacific Conference
  { id: 'SEA', city: 'Seattle', name: 'Storm', conference: 'Pacific', division: 'Pacific North' },
  { id: 'POR', city: 'Portland', name: 'Timbers', conference: 'Pacific', division: 'Pacific North' },
  { id: 'VAN', city: 'Vancouver', name: 'Grizzlies', conference: 'Pacific', division: 'Pacific North' },
  { id: 'DEN', city: 'Denver', name: 'Summit', conference: 'Pacific', division: 'Pacific North' },
  { id: 'LAL', city: 'Los Angeles', name: 'Legends', conference: 'Pacific', division: 'Pacific South' },
  { id: 'SDS', city: 'San Diego', name: 'Surf', conference: 'Pacific', division: 'Pacific South' },
  { id: 'LVA', city: 'Las Vegas', name: 'Aces', conference: 'Pacific', division: 'Pacific South' },
  { id: 'PHX', city: 'Phoenix', name: 'Scorpions', conference: 'Pacific', division: 'Pacific South' },
  { id: 'AUS', city: 'Austin', name: 'Outlaws', conference: 'Pacific', division: 'Pacific East' },
  { id: 'HOU', city: 'Houston', name: 'Marshals', conference: 'Pacific', division: 'Pacific East' },
  { id: 'DAL', city: 'Dallas', name: 'Lone Stars', conference: 'Pacific', division: 'Pacific East' },
  { id: 'SAN', city: 'San Antonio', name: 'Bandits', conference: 'Pacific', division: 'Pacific East' },
  { id: 'SFO', city: 'San Francisco', name: 'Gold Rush', conference: 'Pacific', division: 'Pacific West' },
  { id: 'OAK', city: 'Oakland', name: 'Raiders', conference: 'Pacific', division: 'Pacific West' },
  { id: 'SAC', city: 'Sacramento', name: 'Kings', conference: 'Pacific', division: 'Pacific West' },
  { id: 'HON', city: 'Honolulu', name: 'Volcanoes', conference: 'Pacific', division: 'Pacific West' },
];

export interface TeamInfo {
  id: string;
  city: string;
  name: string;
  conference: string;
  division: string;
}

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
  freeAgents: Player[];
  draftClass: Player[];
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

// Tier distribution for realistic league parity
const TIER_DISTRIBUTION: { tier: Tier; count: number }[] = [
  { tier: Tier.Elite, count: 4 },        // ~12.5% - Top teams
  { tier: Tier.Good, count: 8 },         // ~25% - Playoff contenders
  { tier: Tier.Average, count: 10 },     // ~31% - Middle of the pack
  { tier: Tier.BelowAverage, count: 6 }, // ~19% - Struggling teams
  { tier: Tier.Rebuilding, count: 4 },   // ~12.5% - Rebuilding teams
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
  const shuffledTeams = shuffleArray(NFL_TEAMS);

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
 * Generate complete game data
 */
export function generateFullGame(): FullGameData {
  const tierAssignments = assignTiers();
  const teams: TeamRosterData[] = [];

  // Generate all 32 team rosters
  for (const teamInfo of NFL_TEAMS) {
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

  // Generate free agent pool (150 players, mixed quality)
  const freeAgents = generateFAPool({ size: 150, quality: 'mixed' });

  // Generate draft class (normal depth, average talent)
  const draftClass = generateDraftClass({ depth: 'normal', talent: 'average' });

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
