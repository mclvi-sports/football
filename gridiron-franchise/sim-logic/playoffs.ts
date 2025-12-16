/**
 * Playoff Bracket System
 *
 * Manages playoff seeding, bracket generation, and advancement.
 * Playoff format: 7 teams per conference, #1 seed gets bye.
 */

import {
  TeamStanding,
  PlayoffBracket,
  PlayoffMatchup,
  PlayoffRound,
  GameResult,
  SeasonTeam,
} from './types';

// ============================================================================
// BRACKET GENERATION
// ============================================================================

/**
 * Generate initial playoff bracket from final standings
 */
export function generatePlayoffBracket(standings: TeamStanding[]): PlayoffBracket {
  // Get playoff teams by conference
  const atlanticTeams = standings
    .filter((s) => s.conference === 'Atlantic' && s.playoffSeed !== null)
    .sort((a, b) => (a.playoffSeed || 0) - (b.playoffSeed || 0));

  const pacificTeams = standings
    .filter((s) => s.conference === 'Pacific' && s.playoffSeed !== null)
    .sort((a, b) => (a.playoffSeed || 0) - (b.playoffSeed || 0));

  // Generate Wild Card matchups
  // #1 seed gets bye
  // #2 vs #7, #3 vs #6, #4 vs #5
  const atlanticWildCard = generateWildCardMatchups(atlanticTeams, 'Atlantic');
  const pacificWildCard = generateWildCardMatchups(pacificTeams, 'Pacific');

  return {
    atlanticWildCard,
    pacificWildCard,
    atlanticDivisional: [],
    pacificDivisional: [],
    atlanticChampionship: null,
    pacificChampionship: null,
    championship: null,
    champion: null,
  };
}

/**
 * Generate Wild Card round matchups
 * Higher seed hosts, #1 seed has bye
 */
function generateWildCardMatchups(
  teams: TeamStanding[],
  conference: 'Atlantic' | 'Pacific'
): PlayoffMatchup[] {
  if (teams.length < 7) {
    console.warn(`Not enough teams for ${conference} playoffs: ${teams.length}`);
    return [];
  }

  // #2 vs #7
  const matchup1: PlayoffMatchup = {
    round: 'wild_card',
    conference,
    higherSeed: { teamId: teams[1].teamId, seed: 2 },
    lowerSeed: { teamId: teams[6].teamId, seed: 7 },
    winnerId: null,
    gameResult: null,
  };

  // #3 vs #6
  const matchup2: PlayoffMatchup = {
    round: 'wild_card',
    conference,
    higherSeed: { teamId: teams[2].teamId, seed: 3 },
    lowerSeed: { teamId: teams[5].teamId, seed: 6 },
    winnerId: null,
    gameResult: null,
  };

  // #4 vs #5
  const matchup3: PlayoffMatchup = {
    round: 'wild_card',
    conference,
    higherSeed: { teamId: teams[3].teamId, seed: 4 },
    lowerSeed: { teamId: teams[4].teamId, seed: 5 },
    winnerId: null,
    gameResult: null,
  };

  return [matchup1, matchup2, matchup3];
}

// ============================================================================
// BRACKET ADVANCEMENT
// ============================================================================

/**
 * Record a playoff game result and advance winner
 */
export function recordPlayoffResult(
  bracket: PlayoffBracket,
  round: PlayoffRound,
  conference: 'Atlantic' | 'Pacific' | null,
  gameIndex: number,
  result: GameResult
): PlayoffBracket {
  const newBracket = { ...bracket };

  // Find and update the matchup
  const matchup = getMatchup(newBracket, round, conference, gameIndex);
  if (!matchup) {
    console.error('Matchup not found:', round, conference, gameIndex);
    return bracket;
  }

  // Determine winner
  const winnerId =
    result.awayScore > result.homeScore ? result.awayTeamId : result.homeTeamId;

  matchup.winnerId = winnerId;
  matchup.gameResult = result;

  // Advance to next round if applicable
  advanceWinner(newBracket, round, conference, matchup);

  return newBracket;
}

/**
 * Get a specific matchup from the bracket
 */
function getMatchup(
  bracket: PlayoffBracket,
  round: PlayoffRound,
  conference: 'Atlantic' | 'Pacific' | null,
  index: number
): PlayoffMatchup | null {
  switch (round) {
    case 'wild_card':
      if (conference === 'Atlantic') return bracket.atlanticWildCard[index];
      if (conference === 'Pacific') return bracket.pacificWildCard[index];
      break;
    case 'divisional':
      if (conference === 'Atlantic') return bracket.atlanticDivisional[index];
      if (conference === 'Pacific') return bracket.pacificDivisional[index];
      break;
    case 'conference_championship':
      if (conference === 'Atlantic') return bracket.atlanticChampionship;
      if (conference === 'Pacific') return bracket.pacificChampionship;
      break;
    case 'championship':
      return bracket.championship;
  }
  return null;
}

/**
 * Advance winner to next round
 */
function advanceWinner(
  bracket: PlayoffBracket,
  round: PlayoffRound,
  conference: 'Atlantic' | 'Pacific' | null,
  matchup: PlayoffMatchup
): void {
  if (!matchup.winnerId) return;

  const winnerSeed =
    matchup.winnerId === matchup.higherSeed.teamId
      ? matchup.higherSeed.seed
      : matchup.lowerSeed.seed;

  switch (round) {
    case 'wild_card':
      // Check if all Wild Card games are complete for this conference
      const wcGames = conference === 'Atlantic' ? bracket.atlanticWildCard : bracket.pacificWildCard;
      if (wcGames.every((g) => g.winnerId !== null)) {
        generateDivisionalRound(bracket, conference!);
      }
      break;

    case 'divisional':
      // Check if both Divisional games are complete for this conference
      const divGames = conference === 'Atlantic' ? bracket.atlanticDivisional : bracket.pacificDivisional;
      if (divGames.every((g) => g.winnerId !== null)) {
        generateConferenceChampionship(bracket, conference!);
      }
      break;

    case 'conference_championship':
      // Check if both Conference Championships are complete
      if (bracket.atlanticChampionship?.winnerId && bracket.pacificChampionship?.winnerId) {
        generateChampionship(bracket);
      }
      break;

    case 'championship':
      // Set champion
      if (matchup.winnerId) {
        bracket.champion = {
          teamId: matchup.winnerId,
          teamName: '', // Will be filled in by caller
        };
      }
      break;
  }
}

/**
 * Generate Divisional Round matchups after Wild Card
 * #1 seed plays lowest remaining seed
 * Remaining higher seed plays remaining lower seed
 */
function generateDivisionalRound(bracket: PlayoffBracket, conference: 'Atlantic' | 'Pacific'): void {
  const wcGames = conference === 'Atlantic' ? bracket.atlanticWildCard : bracket.pacificWildCard;

  // Get #1 seed (bye team) - needs to be found from the bracket context
  // For now, we'll get winners and their seeds
  const winners = wcGames.map((g) => ({
    teamId: g.winnerId!,
    seed:
      g.winnerId === g.higherSeed.teamId ? g.higherSeed.seed : g.lowerSeed.seed,
  }));

  // Sort by seed
  winners.sort((a, b) => a.seed - b.seed);

  // #1 seed plays lowest remaining seed (highest number)
  const divMatchup1: PlayoffMatchup = {
    round: 'divisional',
    conference,
    higherSeed: { teamId: '', seed: 1 }, // Will be filled with #1 seed
    lowerSeed: winners[winners.length - 1], // Lowest seed winner
    winnerId: null,
    gameResult: null,
  };

  // Remaining two winners play each other
  const divMatchup2: PlayoffMatchup = {
    round: 'divisional',
    conference,
    higherSeed: winners[0], // Highest remaining seed
    lowerSeed: winners[1], // Second highest remaining seed
    winnerId: null,
    gameResult: null,
  };

  if (conference === 'Atlantic') {
    bracket.atlanticDivisional = [divMatchup1, divMatchup2];
  } else {
    bracket.pacificDivisional = [divMatchup1, divMatchup2];
  }
}

/**
 * Generate Conference Championship matchup
 */
function generateConferenceChampionship(bracket: PlayoffBracket, conference: 'Atlantic' | 'Pacific'): void {
  const divGames = conference === 'Atlantic' ? bracket.atlanticDivisional : bracket.pacificDivisional;

  const winners = divGames.map((g) => ({
    teamId: g.winnerId!,
    seed:
      g.winnerId === g.higherSeed.teamId ? g.higherSeed.seed : g.lowerSeed.seed,
  }));

  winners.sort((a, b) => a.seed - b.seed);

  const ccMatchup: PlayoffMatchup = {
    round: 'conference_championship',
    conference,
    higherSeed: winners[0],
    lowerSeed: winners[1],
    winnerId: null,
    gameResult: null,
  };

  if (conference === 'Atlantic') {
    bracket.atlanticChampionship = ccMatchup;
  } else {
    bracket.pacificChampionship = ccMatchup;
  }
}

/**
 * Generate Championship matchup
 */
function generateChampionship(bracket: PlayoffBracket): void {
  if (!bracket.atlanticChampionship?.winnerId || !bracket.pacificChampionship?.winnerId) {
    return;
  }

  // Determine higher seed (alternating home field, but for sim purposes use seed)
  const atlanticWinnerSeed =
    bracket.atlanticChampionship.winnerId === bracket.atlanticChampionship.higherSeed.teamId
      ? bracket.atlanticChampionship.higherSeed.seed
      : bracket.atlanticChampionship.lowerSeed.seed;

  const pacificWinnerSeed =
    bracket.pacificChampionship.winnerId === bracket.pacificChampionship.higherSeed.teamId
      ? bracket.pacificChampionship.higherSeed.seed
      : bracket.pacificChampionship.lowerSeed.seed;

  bracket.championship = {
    round: 'championship',
    conference: null,
    higherSeed: {
      teamId:
        atlanticWinnerSeed <= pacificWinnerSeed
          ? bracket.atlanticChampionship.winnerId
          : bracket.pacificChampionship.winnerId,
      seed: Math.min(atlanticWinnerSeed, pacificWinnerSeed),
    },
    lowerSeed: {
      teamId:
        atlanticWinnerSeed <= pacificWinnerSeed
          ? bracket.pacificChampionship.winnerId
          : bracket.atlanticChampionship.winnerId,
      seed: Math.max(atlanticWinnerSeed, pacificWinnerSeed),
    },
    winnerId: null,
    gameResult: null,
  };
}

// ============================================================================
// BRACKET QUERIES
// ============================================================================

/**
 * Get all matchups for a specific round
 */
export function getMatchupsForRound(
  bracket: PlayoffBracket,
  round: PlayoffRound
): PlayoffMatchup[] {
  switch (round) {
    case 'wild_card':
      return [...bracket.atlanticWildCard, ...bracket.pacificWildCard];
    case 'divisional':
      return [...bracket.atlanticDivisional, ...bracket.pacificDivisional];
    case 'conference_championship':
      return [
        bracket.atlanticChampionship,
        bracket.pacificChampionship,
      ].filter((m) => m !== null) as PlayoffMatchup[];
    case 'championship':
      return bracket.championship ? [bracket.championship] : [];
    default:
      return [];
  }
}

/**
 * Check if a round is complete
 */
export function isRoundComplete(bracket: PlayoffBracket, round: PlayoffRound): boolean {
  const matchups = getMatchupsForRound(bracket, round);
  if (matchups.length === 0) return false;
  return matchups.every((m) => m.winnerId !== null);
}

/**
 * Get current playoff round
 */
export function getCurrentRound(bracket: PlayoffBracket): PlayoffRound | 'complete' | null {
  if (bracket.champion !== null) return 'complete';
  if (bracket.championship?.winnerId === null && bracket.championship) return 'championship';
  if (!isRoundComplete(bracket, 'conference_championship') &&
      (bracket.atlanticChampionship || bracket.pacificChampionship)) {
    return 'conference_championship';
  }
  if (!isRoundComplete(bracket, 'divisional') &&
      (bracket.atlanticDivisional.length > 0 || bracket.pacificDivisional.length > 0)) {
    return 'divisional';
  }
  if (!isRoundComplete(bracket, 'wild_card')) return 'wild_card';
  return null;
}

/**
 * Get remaining matchups to play in current round
 */
export function getRemainingMatchups(bracket: PlayoffBracket): PlayoffMatchup[] {
  const currentRound = getCurrentRound(bracket);
  if (!currentRound || currentRound === 'complete') return [];

  return getMatchupsForRound(bracket, currentRound).filter((m) => m.winnerId === null);
}

/**
 * Set the #1 seed for divisional round after Wild Card
 */
export function setByeTeam(
  bracket: PlayoffBracket,
  conference: 'Atlantic' | 'Pacific',
  teamId: string
): PlayoffBracket {
  const newBracket = { ...bracket };

  if (conference === 'Atlantic' && newBracket.atlanticDivisional.length > 0) {
    newBracket.atlanticDivisional[0].higherSeed = { teamId, seed: 1 };
  } else if (conference === 'Pacific' && newBracket.pacificDivisional.length > 0) {
    newBracket.pacificDivisional[0].higherSeed = { teamId, seed: 1 };
  }

  return newBracket;
}
