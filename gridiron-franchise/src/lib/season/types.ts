/**
 * Season Simulation Types
 *
 * Types for the 18-week season simulation engine that integrates
 * all game modules (schemes, coaching, facilities, scouting).
 */

import { SimTeam, SimStats, PlayerGameStats } from '../sim/types';
import { WeekSchedule, ScheduledGame } from '../schedule/types';

// ============================================================================
// TEAM STANDINGS
// ============================================================================

export interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
  divisionWins: number;
  divisionLosses: number;
  conferenceWins: number;
  conferenceLosses: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: number; // positive = win streak, negative = loss streak
  lastFiveGames: ('W' | 'L' | 'T')[];
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamAbbrev: string;
  division: string;
  conference: string;
  record: TeamRecord;
  divisionRank: number;
  conferenceRank: number;
  playoffSeed: number | null; // null if not in playoffs
  clinched: 'division' | 'wildcard' | 'bye' | null;
  eliminated: boolean;
}

// ============================================================================
// SEASON STATE
// ============================================================================

export type SeasonPhase = 'preseason' | 'regular' | 'playoffs' | 'offseason';

export interface SeasonState {
  year: number;
  week: number;
  phase: SeasonPhase;
  schedule: WeekSchedule[];
  standings: TeamStanding[];
  completedGames: GameResult[];
  injuries: PlayerInjury[];
  playoffBracket: PlayoffBracket | null;
}

export interface GameResult {
  gameId: string;
  week: number;
  awayTeamId: string;
  homeTeamId: string;
  awayScore: number;
  homeScore: number;
  awayStats: SimStats;
  homeStats: SimStats;
  playerStats: PlayerGameStats[];
  isPrimetime: boolean;
  isPlayoff: boolean;
  playoffRound?: PlayoffRound;
}

// ============================================================================
// INJURIES
// ============================================================================

export type InjuryType = 'minor' | 'moderate' | 'severe' | 'season_ending';

export interface PlayerInjury {
  playerId: string;
  playerName: string;
  teamId: string;
  position: string;
  injuryType: InjuryType;
  weeksRemaining: number;
  injuredWeek: number;
  description: string;
}

export const INJURY_DURATION: Record<InjuryType, { min: number; max: number }> = {
  minor: { min: 1, max: 2 },
  moderate: { min: 3, max: 5 },
  severe: { min: 6, max: 10 },
  season_ending: { min: 18, max: 18 },
};

// ============================================================================
// PLAYOFFS
// ============================================================================

export type PlayoffRound =
  | 'wild_card'
  | 'divisional'
  | 'conference_championship'
  | 'championship';

export interface PlayoffMatchup {
  round: PlayoffRound;
  conference: 'Atlantic' | 'Pacific' | null; // null for Championship
  higherSeed: {
    teamId: string;
    seed: number;
  };
  lowerSeed: {
    teamId: string;
    seed: number;
  };
  winnerId: string | null;
  gameResult: GameResult | null;
}

export interface PlayoffBracket {
  atlanticWildCard: PlayoffMatchup[];
  pacificWildCard: PlayoffMatchup[];
  atlanticDivisional: PlayoffMatchup[];
  pacificDivisional: PlayoffMatchup[];
  atlanticChampionship: PlayoffMatchup | null;
  pacificChampionship: PlayoffMatchup | null;
  championship: PlayoffMatchup | null;
  champion: {
    teamId: string;
    teamName: string;
  } | null;
}

// ============================================================================
// SEASON TEAM (EXTENDS SIMTEAM WITH SEASON DATA)
// ============================================================================

export interface SeasonTeam extends SimTeam {
  division: string;
  conference: 'Atlantic' | 'Pacific';
  byeWeek: number;
  seasonStats: SeasonTeamStats;
}

export interface SeasonTeamStats {
  gamesPlayed: number;
  totalYards: number;
  totalPassYards: number;
  totalRushYards: number;
  totalPointsScored: number;
  totalPointsAllowed: number;
  turnoversCommitted: number;
  turnoversTaken: number;
  sacks: number;
  sacksAllowed: number;
}

// ============================================================================
// WEEKLY SUMMARY
// ============================================================================

export interface WeekSummary {
  week: number;
  games: GameResult[];
  injuries: PlayerInjury[];
  recoveries: string[]; // player IDs who recovered this week
  standingsSnapshot: TeamStanding[];
}

// ============================================================================
// SEASON SIMULATION OPTIONS
// ============================================================================

export interface SeasonSimOptions {
  year: number;
  teams: SeasonTeam[];
  schedule: WeekSchedule[];
  simulateInjuries: boolean;
  injuryRate: number; // 0.0 - 1.0 (default 0.05)
  enableProgression: boolean;
  verboseLogging: boolean;
}

// ============================================================================
// DIVISION & CONFERENCE STRUCTURE
// ============================================================================

export const LEAGUE_DIVISIONS = {
  Atlantic: ['Atlantic North', 'Atlantic South', 'Atlantic East', 'Atlantic West'],
  Pacific: ['Pacific North', 'Pacific South', 'Pacific East', 'Pacific West'],
};

export const TEAMS_PER_DIVISION = 4;
export const PLAYOFF_TEAMS_PER_CONFERENCE = 7;
export const BYE_TEAMS_PER_CONFERENCE = 1;
