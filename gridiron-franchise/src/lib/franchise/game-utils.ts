/**
 * Game Utilities
 *
 * Helper functions for formatting stats, scores, records, and game data.
 */

import { SimStats, PlayerGameStats } from '../sim/types';
import { GameResult, TeamStanding } from '../season/types';

// ============================================================================
// RECORD FORMATTING
// ============================================================================

export function formatRecord(wins: number, losses: number, ties: number = 0): string {
  if (ties > 0) {
    return `${wins}-${losses}-${ties}`;
  }
  return `${wins}-${losses}`;
}

export function formatWinPct(wins: number, losses: number, ties: number = 0): string {
  const total = wins + losses + ties;
  if (total === 0) return '.000';
  const pct = (wins + ties * 0.5) / total;
  return pct.toFixed(3).replace(/^0/, '');
}

export function formatStreak(streak: { type: 'W' | 'L' | 'T'; count: number } | null): string {
  if (!streak || streak.count === 0) return '-';
  return `${streak.type}${streak.count}`;
}

// ============================================================================
// SCORE FORMATTING
// ============================================================================

export function formatScore(awayScore: number, homeScore: number): string {
  return `${awayScore} - ${homeScore}`;
}

export function formatFinalScore(game: GameResult, awayAbbrev: string, homeAbbrev: string): string {
  return `${awayAbbrev} ${game.awayScore}, ${homeAbbrev} ${game.homeScore}`;
}

export function getWinner(game: GameResult): 'away' | 'home' | 'tie' {
  if (game.awayScore > game.homeScore) return 'away';
  if (game.homeScore > game.awayScore) return 'home';
  return 'tie';
}

// ============================================================================
// STAT FORMATTING
// ============================================================================

export function formatYards(yards: number): string {
  return yards.toLocaleString();
}

export function formatCompletionPct(completions: number, attempts: number): string {
  if (attempts === 0) return '0.0%';
  return ((completions / attempts) * 100).toFixed(1) + '%';
}

export function formatYardsPerAttempt(yards: number, attempts: number): string {
  if (attempts === 0) return '0.0';
  return (yards / attempts).toFixed(1);
}

export function formatYardsPerCarry(yards: number, carries: number): string {
  if (carries === 0) return '0.0';
  return (yards / carries).toFixed(1);
}

export function formatPasserRating(
  completions: number,
  attempts: number,
  yards: number,
  touchdowns: number,
  interceptions: number
): string {
  if (attempts === 0) return '0.0';

  // NFL Passer Rating formula
  const a = Math.min(Math.max(((completions / attempts) - 0.3) * 5, 0), 2.375);
  const b = Math.min(Math.max(((yards / attempts) - 3) * 0.25, 0), 2.375);
  const c = Math.min(Math.max((touchdowns / attempts) * 20, 0), 2.375);
  const d = Math.min(Math.max(2.375 - ((interceptions / attempts) * 25), 0), 2.375);

  const rating = ((a + b + c + d) / 6) * 100;
  return rating.toFixed(1);
}

// ============================================================================
// TIME FORMATTING
// ============================================================================

export function formatGameClock(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeOfPossession(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================================================
// WEEK/ROUND FORMATTING
// ============================================================================

export function formatWeek(week: number, isPlayoff: boolean, playoffRound?: string): string {
  if (isPlayoff && playoffRound) {
    switch (playoffRound) {
      case 'wild_card': return 'Wild Card';
      case 'divisional': return 'Divisional';
      case 'conference_championship': return 'Conf. Championship';
      case 'championship': return 'Championship';
      default: return `Playoff Week ${week - 18}`;
    }
  }
  return `Week ${week}`;
}

export function getWeekLabel(week: number): string {
  if (week <= 18) return `Week ${week}`;
  if (week === 19) return 'Wild Card';
  if (week === 20) return 'Divisional';
  if (week === 21) return 'Conference';
  if (week === 22) return 'Championship';
  return `Week ${week}`;
}

// ============================================================================
// PLAYER STAT HELPERS
// ============================================================================

export function getTopPassers(playerStats: PlayerGameStats[], limit: number = 2): PlayerGameStats[] {
  return [...playerStats]
    .filter(p => p.passing.attempts > 0)
    .sort((a, b) => b.passing.yards - a.passing.yards)
    .slice(0, limit);
}

export function getTopRushers(playerStats: PlayerGameStats[], limit: number = 3): PlayerGameStats[] {
  return [...playerStats]
    .filter(p => p.rushing.carries > 0)
    .sort((a, b) => b.rushing.yards - a.rushing.yards)
    .slice(0, limit);
}

export function getTopReceivers(playerStats: PlayerGameStats[], limit: number = 3): PlayerGameStats[] {
  return [...playerStats]
    .filter(p => p.receiving.catches > 0)
    .sort((a, b) => b.receiving.yards - a.receiving.yards)
    .slice(0, limit);
}

export function getTopDefenders(playerStats: PlayerGameStats[], limit: number = 3): PlayerGameStats[] {
  return [...playerStats]
    .filter(p => p.defense.tackles > 0 || p.defense.sacks > 0 || p.defense.interceptions > 0)
    .sort((a, b) => {
      // Weight: tackles + sacks*2 + ints*3
      const aScore = a.defense.tackles + a.defense.sacks * 2 + a.defense.interceptions * 3;
      const bScore = b.defense.tackles + b.defense.sacks * 2 + b.defense.interceptions * 3;
      return bScore - aScore;
    })
    .slice(0, limit);
}

// ============================================================================
// TEAM STAT COMPARISON
// ============================================================================

export interface TeamStatComparison {
  label: string;
  away: string | number;
  home: string | number;
  awayBetter?: boolean;
  homeBetter?: boolean;
}

export function buildTeamStatsComparison(
  awayStats: SimStats,
  homeStats: SimStats
): TeamStatComparison[] {
  // Calculate turnovers (interceptions + fumbles)
  const awayTurnovers = awayStats.interceptions + awayStats.fumbles;
  const homeTurnovers = homeStats.interceptions + homeStats.fumbles;

  return [
    {
      label: 'Total Yards',
      away: awayStats.yards,
      home: homeStats.yards,
      awayBetter: awayStats.yards > homeStats.yards,
      homeBetter: homeStats.yards > awayStats.yards,
    },
    {
      label: 'Passing Yards',
      away: awayStats.passYards,
      home: homeStats.passYards,
      awayBetter: awayStats.passYards > homeStats.passYards,
      homeBetter: homeStats.passYards > awayStats.passYards,
    },
    {
      label: 'Rushing Yards',
      away: awayStats.rushYards,
      home: homeStats.rushYards,
      awayBetter: awayStats.rushYards > homeStats.rushYards,
      homeBetter: homeStats.rushYards > awayStats.rushYards,
    },
    {
      label: 'First Downs',
      away: awayStats.firstDowns,
      home: homeStats.firstDowns,
      awayBetter: awayStats.firstDowns > homeStats.firstDowns,
      homeBetter: homeStats.firstDowns > awayStats.firstDowns,
    },
    {
      label: 'Turnovers',
      away: awayTurnovers,
      home: homeTurnovers,
      awayBetter: awayTurnovers < homeTurnovers,
      homeBetter: homeTurnovers < awayTurnovers,
    },
    {
      label: 'Sacks',
      away: awayStats.sacks,
      home: homeStats.sacks,
      awayBetter: awayStats.sacks > homeStats.sacks,
      homeBetter: homeStats.sacks > awayStats.sacks,
    },
    {
      label: 'Penalties',
      away: awayStats.penalties,
      home: homeStats.penalties,
      awayBetter: awayStats.penalties < homeStats.penalties,
      homeBetter: homeStats.penalties < awayStats.penalties,
    },
    {
      label: 'Time of Possession',
      away: formatTimeOfPossession(awayStats.timeOfPossession),
      home: formatTimeOfPossession(homeStats.timeOfPossession),
      awayBetter: awayStats.timeOfPossession > homeStats.timeOfPossession,
      homeBetter: homeStats.timeOfPossession > awayStats.timeOfPossession,
    },
  ];
}

// ============================================================================
// POINT DIFFERENTIAL
// ============================================================================

export function formatPointDiff(pointsFor: number, pointsAgainst: number): string {
  const diff = pointsFor - pointsAgainst;
  if (diff > 0) return `+${diff}`;
  return diff.toString();
}

// ============================================================================
// PLAYOFF SEED
// ============================================================================

export function formatPlayoffSeed(seed: number | null): string {
  if (seed === null) return '-';
  return `#${seed}`;
}

export function getPlayoffStatus(standing: TeamStanding): string | null {
  if (standing.playoffSeed === 1) return 'z'; // Clinched bye
  if (standing.divisionRank === 1 && standing.playoffSeed !== null) return 'y'; // Clinched division
  if (standing.playoffSeed !== null) return 'x'; // Clinched playoff
  return null;
}
