/**
 * Standings System
 *
 * Manages W-L records, division/conference rankings, and playoff seeding.
 */

import {
  TeamStanding,
  TeamRecord,
  GameResult,
  SeasonTeam,
  PLAYOFF_TEAMS_PER_CONFERENCE,
  BYE_TEAMS_PER_CONFERENCE,
} from './types';

// ============================================================================
// STANDINGS INITIALIZATION
// ============================================================================

/**
 * Create initial standings for all teams
 */
export function createInitialStandings(teams: SeasonTeam[]): TeamStanding[] {
  return teams.map((team) => ({
    teamId: team.id,
    teamName: team.name,
    teamAbbrev: team.abbrev,
    division: team.division,
    conference: team.conference,
    record: createEmptyRecord(),
    divisionRank: 0,
    conferenceRank: 0,
    playoffSeed: null,
    clinched: null,
    eliminated: false,
  }));
}

/**
 * Create an empty team record
 */
export function createEmptyRecord(): TeamRecord {
  return {
    wins: 0,
    losses: 0,
    ties: 0,
    divisionWins: 0,
    divisionLosses: 0,
    conferenceWins: 0,
    conferenceLosses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    streak: 0,
    lastFiveGames: [],
  };
}

// ============================================================================
// STANDINGS UPDATE
// ============================================================================

/**
 * Update standings after a game result
 */
export function updateStandingsWithGame(
  standings: TeamStanding[],
  teams: SeasonTeam[],
  game: GameResult
): TeamStanding[] {
  const newStandings = [...standings];

  const awayStanding = newStandings.find((s) => s.teamId === game.awayTeamId);
  const homeStanding = newStandings.find((s) => s.teamId === game.homeTeamId);
  const awayTeam = teams.find((t) => t.id === game.awayTeamId);
  const homeTeam = teams.find((t) => t.id === game.homeTeamId);

  if (!awayStanding || !homeStanding || !awayTeam || !homeTeam) {
    return standings;
  }

  // Determine game context
  const sameDivision = awayTeam.division === homeTeam.division;
  const sameConference = awayTeam.conference === homeTeam.conference;

  // Update scores
  awayStanding.record.pointsFor += game.awayScore;
  awayStanding.record.pointsAgainst += game.homeScore;
  homeStanding.record.pointsFor += game.homeScore;
  homeStanding.record.pointsAgainst += game.awayScore;

  // Determine winner/loser
  if (game.awayScore > game.homeScore) {
    // Away team wins
    updateWin(awayStanding, sameDivision, sameConference);
    updateLoss(homeStanding, sameDivision, sameConference);
  } else if (game.homeScore > game.awayScore) {
    // Home team wins
    updateWin(homeStanding, sameDivision, sameConference);
    updateLoss(awayStanding, sameDivision, sameConference);
  } else {
    // Tie
    updateTie(awayStanding);
    updateTie(homeStanding);
  }

  // Recalculate rankings
  return calculateRankings(newStandings);
}

function updateWin(standing: TeamStanding, sameDivision: boolean, sameConference: boolean): void {
  standing.record.wins++;
  if (sameDivision) standing.record.divisionWins++;
  if (sameConference) standing.record.conferenceWins++;

  // Update streak
  if (standing.record.streak > 0) {
    standing.record.streak++;
  } else {
    standing.record.streak = 1;
  }

  // Update last five
  standing.record.lastFiveGames.push('W');
  if (standing.record.lastFiveGames.length > 5) {
    standing.record.lastFiveGames.shift();
  }
}

function updateLoss(standing: TeamStanding, sameDivision: boolean, sameConference: boolean): void {
  standing.record.losses++;
  if (sameDivision) standing.record.divisionLosses++;
  if (sameConference) standing.record.conferenceLosses++;

  // Update streak
  if (standing.record.streak < 0) {
    standing.record.streak--;
  } else {
    standing.record.streak = -1;
  }

  // Update last five
  standing.record.lastFiveGames.push('L');
  if (standing.record.lastFiveGames.length > 5) {
    standing.record.lastFiveGames.shift();
  }
}

function updateTie(standing: TeamStanding): void {
  standing.record.ties++;
  standing.record.streak = 0;

  standing.record.lastFiveGames.push('T');
  if (standing.record.lastFiveGames.length > 5) {
    standing.record.lastFiveGames.shift();
  }
}

// ============================================================================
// RANKING CALCULATIONS
// ============================================================================

/**
 * Calculate win percentage for sorting
 */
export function getWinPercentage(record: TeamRecord): number {
  const totalGames = record.wins + record.losses + record.ties;
  if (totalGames === 0) return 0;
  return (record.wins + record.ties * 0.5) / totalGames;
}

/**
 * Calculate point differential
 */
export function getPointDifferential(record: TeamRecord): number {
  return record.pointsFor - record.pointsAgainst;
}

/**
 * Compare two teams for ranking (returns negative if a ranks higher)
 */
function compareTeams(a: TeamStanding, b: TeamStanding): number {
  const aWinPct = getWinPercentage(a.record);
  const bWinPct = getWinPercentage(b.record);

  // 1. Win percentage
  if (aWinPct !== bWinPct) {
    return bWinPct - aWinPct;
  }

  // 2. Division record (for same division)
  if (a.division === b.division) {
    const aDivWinPct =
      a.record.divisionWins / (a.record.divisionWins + a.record.divisionLosses || 1);
    const bDivWinPct =
      b.record.divisionWins / (b.record.divisionWins + b.record.divisionLosses || 1);
    if (aDivWinPct !== bDivWinPct) {
      return bDivWinPct - aDivWinPct;
    }
  }

  // 3. Conference record
  const aConfWinPct =
    a.record.conferenceWins / (a.record.conferenceWins + a.record.conferenceLosses || 1);
  const bConfWinPct =
    b.record.conferenceWins / (b.record.conferenceWins + b.record.conferenceLosses || 1);
  if (aConfWinPct !== bConfWinPct) {
    return bConfWinPct - aConfWinPct;
  }

  // 4. Point differential
  const aDiff = getPointDifferential(a.record);
  const bDiff = getPointDifferential(b.record);
  if (aDiff !== bDiff) {
    return bDiff - aDiff;
  }

  // 5. Points scored
  return b.record.pointsFor - a.record.pointsFor;
}

/**
 * Calculate division and conference rankings
 */
export function calculateRankings(standings: TeamStanding[]): TeamStanding[] {
  const newStandings = [...standings];

  // Get unique divisions
  const divisions = Array.from(new Set(newStandings.map((s) => s.division)));

  // Rank within each division
  for (const division of divisions) {
    const divisionTeams = newStandings
      .filter((s) => s.division === division)
      .sort(compareTeams);

    divisionTeams.forEach((team, index) => {
      const standing = newStandings.find((s) => s.teamId === team.teamId);
      if (standing) {
        standing.divisionRank = index + 1;
      }
    });
  }

  // Rank within each conference
  const conferences = ['Atlantic', 'Pacific'];
  for (const conference of conferences) {
    const conferenceTeams = newStandings
      .filter((s) => s.conference === conference)
      .sort(compareTeams);

    conferenceTeams.forEach((team, index) => {
      const standing = newStandings.find((s) => s.teamId === team.teamId);
      if (standing) {
        standing.conferenceRank = index + 1;
      }
    });
  }

  // Calculate playoff seeds
  return calculatePlayoffSeeds(newStandings);
}

/**
 * Calculate playoff seeding (7 teams per conference)
 * Seeds 1-4: Division winners (best record gets 1st seed and bye)
 * Seeds 5-7: Wild card teams
 */
export function calculatePlayoffSeeds(standings: TeamStanding[]): TeamStanding[] {
  const newStandings = [...standings];

  for (const conference of ['Atlantic', 'Pacific'] as const) {
    const conferenceTeams = newStandings.filter((s) => s.conference === conference);

    // Get division winners (rank 1 in their division)
    const divisionWinners = conferenceTeams
      .filter((s) => s.divisionRank === 1)
      .sort(compareTeams);

    // Get non-division winners sorted by record
    const nonWinners = conferenceTeams
      .filter((s) => s.divisionRank !== 1)
      .sort(compareTeams);

    // Assign seeds
    // Seeds 1-4: Division winners
    divisionWinners.forEach((team, index) => {
      const standing = newStandings.find((s) => s.teamId === team.teamId);
      if (standing) {
        standing.playoffSeed = index + 1;
      }
    });

    // Seeds 5-7: Top 3 non-division winners (wild cards)
    const wildCardCount = PLAYOFF_TEAMS_PER_CONFERENCE - 4;
    nonWinners.slice(0, wildCardCount).forEach((team, index) => {
      const standing = newStandings.find((s) => s.teamId === team.teamId);
      if (standing) {
        standing.playoffSeed = 5 + index;
      }
    });

    // Clear seeds for non-playoff teams
    nonWinners.slice(wildCardCount).forEach((team) => {
      const standing = newStandings.find((s) => s.teamId === team.teamId);
      if (standing) {
        standing.playoffSeed = null;
      }
    });
  }

  return newStandings;
}

// ============================================================================
// CLINCHING/ELIMINATION
// ============================================================================

/**
 * Check if a team has clinched playoff position
 * This is a simplified check - real clinching calculations are more complex
 */
export function checkClinching(
  standings: TeamStanding[],
  remainingWeeks: number
): TeamStanding[] {
  const newStandings = [...standings];

  for (const standing of newStandings) {
    const maxPossibleWins = standing.record.wins + remainingWeeks;
    const maxPossibleLosses = standing.record.losses + remainingWeeks;

    // Check division clinch
    const divisionRivals = newStandings.filter(
      (s) => s.division === standing.division && s.teamId !== standing.teamId
    );

    const canLoseDivision = divisionRivals.some((rival) => {
      const rivalMaxWins = rival.record.wins + remainingWeeks;
      return rivalMaxWins >= standing.record.wins;
    });

    if (!canLoseDivision && standing.divisionRank === 1 && remainingWeeks <= 3) {
      standing.clinched = 'division';
    }

    // Check if eliminated from playoffs
    const conferenceTeams = newStandings.filter(
      (s) => s.conference === standing.conference && s.teamId !== standing.teamId
    );

    // Count teams that definitely beat this team
    const teamsAhead = conferenceTeams.filter((rival) => {
      return rival.record.wins > maxPossibleWins;
    }).length;

    if (teamsAhead >= PLAYOFF_TEAMS_PER_CONFERENCE) {
      standing.eliminated = true;
      standing.playoffSeed = null;
    }
  }

  return newStandings;
}

// ============================================================================
// STANDINGS DISPLAY HELPERS
// ============================================================================

/**
 * Get standings for a specific division
 */
export function getDivisionStandings(
  standings: TeamStanding[],
  division: string
): TeamStanding[] {
  return standings
    .filter((s) => s.division === division)
    .sort((a, b) => a.divisionRank - b.divisionRank);
}

/**
 * Get standings for a specific conference
 */
export function getConferenceStandings(
  standings: TeamStanding[],
  conference: 'Atlantic' | 'Pacific'
): TeamStanding[] {
  return standings
    .filter((s) => s.conference === conference)
    .sort((a, b) => a.conferenceRank - b.conferenceRank);
}

/**
 * Get playoff picture for a conference
 */
export function getPlayoffPicture(
  standings: TeamStanding[],
  conference: 'Atlantic' | 'Pacific'
): {
  inPlayoffs: TeamStanding[];
  inHunt: TeamStanding[];
  eliminated: TeamStanding[];
} {
  const conferenceTeams = standings.filter((s) => s.conference === conference);

  return {
    inPlayoffs: conferenceTeams
      .filter((s) => s.playoffSeed !== null)
      .sort((a, b) => (a.playoffSeed || 0) - (b.playoffSeed || 0)),
    inHunt: conferenceTeams.filter((s) => s.playoffSeed === null && !s.eliminated),
    eliminated: conferenceTeams.filter((s) => s.eliminated),
  };
}

/**
 * Format record as string
 */
export function formatRecord(record: TeamRecord): string {
  if (record.ties > 0) {
    return `${record.wins}-${record.losses}-${record.ties}`;
  }
  return `${record.wins}-${record.losses}`;
}

/**
 * Format streak as string
 */
export function formatStreak(streak: number): string {
  if (streak > 0) return `W${streak}`;
  if (streak < 0) return `L${Math.abs(streak)}`;
  return '-';
}
