/**
 * Schedule Generator
 *
 * Generates NFL-style 18-week regular season schedules for all 32 teams.
 * Follows rules from FINAL-season-calendar-system.md
 */

import { LEAGUE_TEAMS, TeamInfo } from '../data/teams';
import {
  LeagueSchedule,
  ScheduledGame,
  TeamSchedule,
  WeekSchedule,
  Matchup,
  GameType,
  TimeSlot,
  DivisionInfo,
  TeamStanding,
  ScheduleGeneratorConfig,
  ScheduleStats,
  ScheduleValidation,
} from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const TOTAL_WEEKS = 18;
const GAMES_PER_TEAM = 17;
const BYE_WEEK_START = 5;
const BYE_WEEK_END = 14;

// Market size rankings (affects prime time selection)
const MARKET_SIZE: Record<string, number> = {
  NYE: 100,
  LAL: 98,
  CHI: 95,
  DAL: 95,
  HOU: 90,
  PHI: 88,
  SFO: 87,
  MIA: 85,
  ATL: 85,
  BOS: 85,
  WAS: 82,
  DEN: 80,
  SEA: 80,
  PHX: 78,
  DET: 76,
  BKN: 75,
  OAK: 74,
  LVA: 73,
  SAN: 72,
  PIT: 70,
  BAL: 68,
  CLE: 67,
  IND: 66,
  AUS: 65,
  ORL: 64,
  CLT: 62,
  POR: 60,
  SAC: 58,
  NWK: 55,
  VAN: 52,
  SDS: 50,
  HON: 45,
};

// Inter-conference rotation (Atlantic division -> Pacific division)
const INTER_CONFERENCE_ROTATION: Record<string, string> = {
  'Atlantic North': 'Pacific North',
  'Atlantic South': 'Pacific South',
  'Atlantic East': 'Pacific East',
  'Atlantic West': 'Pacific West',
  'Pacific North': 'Atlantic North',
  'Pacific South': 'Atlantic South',
  'Pacific East': 'Atlantic East',
  'Pacific West': 'Atlantic West',
};

// Same-conference rotating division matchups
const ROTATING_DIVISION: Record<string, string> = {
  'Atlantic North': 'Atlantic South',
  'Atlantic South': 'Atlantic East',
  'Atlantic East': 'Atlantic West',
  'Atlantic West': 'Atlantic North',
  'Pacific North': 'Pacific South',
  'Pacific South': 'Pacific East',
  'Pacific East': 'Pacific West',
  'Pacific West': 'Pacific North',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateGameId(week: number, awayId: string, homeId: string): string {
  return `WK${week}-${awayId}-${homeId}`;
}

// ============================================================================
// BUILD DIVISION STRUCTURE
// ============================================================================

function buildDivisions(): DivisionInfo[] {
  const divisionMap = new Map<string, string[]>();

  for (const team of LEAGUE_TEAMS) {
    const key = team.division;
    if (!divisionMap.has(key)) {
      divisionMap.set(key, []);
    }
    divisionMap.get(key)!.push(team.id);
  }

  return Array.from(divisionMap.entries()).map(([division, teams]) => ({
    conference: division.startsWith('Atlantic') ? 'Atlantic' : 'Pacific',
    division,
    teams,
  }));
}

// ============================================================================
// GENERATE RANDOM STANDINGS
// ============================================================================

function generateRandomStandings(divisions: DivisionInfo[]): TeamStanding[] {
  const standings: TeamStanding[] = [];

  for (const div of divisions) {
    const shuffledTeams = shuffleArray(div.teams);
    shuffledTeams.forEach((teamId, idx) => {
      const team = LEAGUE_TEAMS.find((t) => t.id === teamId)!;
      standings.push({
        teamId,
        divisionPlace: (idx + 1) as 1 | 2 | 3 | 4,
        conference: team.conference,
        division: team.division,
      });
    });
  }

  return standings;
}

// ============================================================================
// FIND SAME-PLACE FINISHER
// ============================================================================

function findSamePlaceFinisher(
  divisionTeams: string[],
  place: 1 | 2 | 3 | 4,
  standings: TeamStanding[]
): string | null {
  for (const teamId of divisionTeams) {
    const standing = standings.find((s) => s.teamId === teamId);
    if (standing && standing.divisionPlace === place) {
      return teamId;
    }
  }
  return null;
}

// ============================================================================
// GET ROTATING OPPONENTS (3 teams from rotating division)
// ============================================================================

function getRotatingOpponents(
  divisionTeams: string[],
  place: 1 | 2 | 3 | 4,
  standings: TeamStanding[]
): string[] {
  const opponents: string[] = [];

  // Get same-place finisher
  const samePlaceTeam = findSamePlaceFinisher(divisionTeams, place, standings);
  if (samePlaceTeam) opponents.push(samePlaceTeam);

  // Get adjacent place finishers (for the 17th game formula)
  const places: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
  const adjacentPlaces = places.filter((p) => p !== place);

  for (const adjPlace of adjacentPlaces.slice(0, 2)) {
    const adjTeam = findSamePlaceFinisher(divisionTeams, adjPlace, standings);
    if (adjTeam && !opponents.includes(adjTeam)) {
      opponents.push(adjTeam);
    }
  }

  return opponents.slice(0, 3);
}

// ============================================================================
// GENERATE TEAM MATCHUPS
// ============================================================================

function generateTeamMatchups(
  teamId: string,
  standings: TeamStanding[],
  divisions: DivisionInfo[]
): Matchup[] {
  const matchups: Matchup[] = [];
  const team = LEAGUE_TEAMS.find((t) => t.id === teamId)!;
  const teamStanding = standings.find((s) => s.teamId === teamId)!;
  const teamDivision = divisions.find((d) => d.teams.includes(teamId))!;

  // 1. DIVISION GAMES (6): 2 vs each division opponent
  const divisionOpponents = teamDivision.teams.filter((t) => t !== teamId);
  for (const opponent of divisionOpponents) {
    matchups.push({ opponentId: opponent, gameType: 'division', isHome: true });
    matchups.push({ opponentId: opponent, gameType: 'division', isHome: false });
  }

  // 2. CONFERENCE GAMES (4): Same-place finishers from other conf divisions
  const sameConferenceDivisions = divisions.filter(
    (d) => d.conference === teamDivision.conference && d.division !== teamDivision.division
  );
  for (const otherDiv of sameConferenceDivisions) {
    const samePlaceTeam = findSamePlaceFinisher(otherDiv.teams, teamStanding.divisionPlace, standings);
    if (samePlaceTeam) {
      const isHome = teamId.localeCompare(samePlaceTeam) < 0;
      matchups.push({
        opponentId: samePlaceTeam,
        gameType: 'conference',
        isHome,
      });
    }
  }

  // 3. INTER-CONFERENCE GAMES (4): Full opposing conference division
  const interConfDivision = INTER_CONFERENCE_ROTATION[team.division];
  const interConfDiv = divisions.find((d) => d.division === interConfDivision);
  if (interConfDiv) {
    interConfDiv.teams.forEach((opponent, idx) => {
      matchups.push({
        opponentId: opponent,
        gameType: 'inter_conference',
        isHome: idx < 2,
      });
    });
  }

  // 4. ROTATING DIVISION GAMES (3): Same-conference based on standings
  const rotatingDivision = ROTATING_DIVISION[team.division];
  const rotatingDiv = divisions.find((d) => d.division === rotatingDivision);
  if (rotatingDiv) {
    const rotatingOpponents = getRotatingOpponents(rotatingDiv.teams, teamStanding.divisionPlace, standings);
    rotatingOpponents.forEach((opponent, idx) => {
      matchups.push({
        opponentId: opponent,
        gameType: 'rotating',
        isHome: idx % 2 === 0,
      });
    });
  }

  return matchups;
}

// ============================================================================
// CREATE GAMES FROM MATCHUPS (DEDUPLICATE)
// ============================================================================

function createGamesFromMatchups(allMatchups: Map<string, Matchup[]>): ScheduledGame[] {
  const games: ScheduledGame[] = [];
  const gameSet = new Set<string>();

  for (const [teamId, matchups] of allMatchups) {
    for (const matchup of matchups) {
      const awayId = matchup.isHome ? matchup.opponentId : teamId;
      const homeId = matchup.isHome ? teamId : matchup.opponentId;
      const gameKey = `${awayId}-${homeId}`;

      if (!gameSet.has(gameKey)) {
        gameSet.add(gameKey);
        games.push({
          id: '', // Will be set when assigned to week
          week: 0, // Will be assigned later
          awayTeamId: awayId,
          homeTeamId: homeId,
          timeSlot: 'early',
          gameType: matchup.gameType,
          isPrimeTime: false,
          dayOfWeek: 'sunday',
        });
      }
    }
  }

  return games;
}

// ============================================================================
// ASSIGN BYE WEEKS
// ============================================================================

function assignByeWeeks(teamIds: string[]): Map<string, number> {
  const byeWeeks = new Map<string, number>();
  const shuffledTeams = shuffleArray(teamIds);

  const byeWeekRange = BYE_WEEK_END - BYE_WEEK_START + 1; // 10 weeks
  const teamsPerWeek = Math.ceil(32 / byeWeekRange); // ~3-4 teams per week

  let weekIndex = 0;
  shuffledTeams.forEach((teamId, idx) => {
    const week = BYE_WEEK_START + (idx % byeWeekRange);
    byeWeeks.set(teamId, week);
  });

  return byeWeeks;
}

// ============================================================================
// DISTRIBUTE GAMES TO WEEKS
// ============================================================================

function distributeGamesToWeeks(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): WeekSchedule[] {
  const weeks: WeekSchedule[] = [];

  // Initialize week schedules
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const byeTeams = Array.from(byeWeeks.entries())
      .filter(([_, byeWeek]) => byeWeek === w)
      .map(([teamId]) => teamId);

    weeks.push({
      week: w,
      games: [],
      byeTeams,
      thursdayGame: null,
      sundayNightGame: null,
      mondayNightGame: null,
      earlyGames: [],
      lateGames: [],
    });
  }

  // Track games per team per week
  const teamWeekGames = new Map<string, Set<number>>();
  for (const team of LEAGUE_TEAMS) {
    teamWeekGames.set(team.id, new Set());
  }

  // Shuffle games to randomize distribution
  const shuffledGames = shuffleArray(allGames);

  // Assign games to weeks
  for (const game of shuffledGames) {
    let assigned = false;

    // Try each week
    for (let attempt = 0; attempt < TOTAL_WEEKS * 2 && !assigned; attempt++) {
      const weekIdx = attempt % TOTAL_WEEKS;
      const week = weeks[weekIdx];

      // Check if teams are on bye this week
      if (week.byeTeams.includes(game.awayTeamId) || week.byeTeams.includes(game.homeTeamId)) {
        continue;
      }

      // Check if teams already have a game this week
      const awayWeeks = teamWeekGames.get(game.awayTeamId)!;
      const homeWeeks = teamWeekGames.get(game.homeTeamId)!;

      if (awayWeeks.has(week.week) || homeWeeks.has(week.week)) {
        continue;
      }

      // Assign game to this week
      const assignedGame: ScheduledGame = {
        ...game,
        week: week.week,
        id: generateGameId(week.week, game.awayTeamId, game.homeTeamId),
      };

      week.games.push(assignedGame);
      awayWeeks.add(week.week);
      homeWeeks.add(week.week);
      assigned = true;
    }

    if (!assigned) {
      console.warn(`Could not assign game: ${game.awayTeamId} @ ${game.homeTeamId}`);
    }
  }

  return weeks;
}

// ============================================================================
// CALCULATE PRIME TIME SCORE
// ============================================================================

function calculatePrimeTimeScore(game: ScheduledGame): number {
  const awayMarket = MARKET_SIZE[game.awayTeamId] || 50;
  const homeMarket = MARKET_SIZE[game.homeTeamId] || 50;

  // Market size (30%)
  const marketScore = ((awayMarket + homeMarket) / 2) * 0.3;

  // Division rivalry bonus (15%)
  const rivalryScore = game.gameType === 'division' ? 15 : 0;

  // Random factor (to add variety)
  const randomFactor = Math.random() * 10;

  return marketScore + rivalryScore + randomFactor;
}

// ============================================================================
// ASSIGN PRIME TIME SLOTS
// ============================================================================

function assignPrimeTimeSlots(weeks: WeekSchedule[]): WeekSchedule[] {
  return weeks.map((week) => {
    const weekNum = week.week;

    // Sort games by prime time desirability
    const rankedGames = week.games
      .map((game) => ({
        game,
        score: calculatePrimeTimeScore(game),
      }))
      .sort((a, b) => b.score - a.score);

    let thursdayGame: ScheduledGame | null = null;
    let sundayNightGame: ScheduledGame | null = null;
    let mondayNightGame: ScheduledGame | null = null;

    const remainingGames: ScheduledGame[] = [];
    let primeTimeCount = 0;

    for (const rg of rankedGames) {
      // Thursday Night: Weeks 2-17
      if (!thursdayGame && weekNum >= 2 && weekNum <= 17 && primeTimeCount < rankedGames.length - 2) {
        thursdayGame = {
          ...rg.game,
          timeSlot: 'thursday_night',
          isPrimeTime: true,
          dayOfWeek: 'thursday',
        };
        primeTimeCount++;
        continue;
      }

      // Sunday Night: All weeks
      if (!sundayNightGame && primeTimeCount < rankedGames.length - 1) {
        sundayNightGame = {
          ...rg.game,
          timeSlot: 'sunday_night',
          isPrimeTime: true,
          dayOfWeek: 'sunday',
        };
        primeTimeCount++;
        continue;
      }

      // Monday Night: Weeks 1-17
      if (!mondayNightGame && weekNum <= 17 && primeTimeCount < rankedGames.length) {
        mondayNightGame = {
          ...rg.game,
          timeSlot: 'monday_night',
          isPrimeTime: true,
          dayOfWeek: 'monday',
        };
        primeTimeCount++;
        continue;
      }

      remainingGames.push(rg.game);
    }

    // Distribute remaining games to early/late slots
    const earlyGames: ScheduledGame[] = [];
    const lateGames: ScheduledGame[] = [];

    remainingGames.forEach((game, i) => {
      if (i % 3 === 0) {
        lateGames.push({ ...game, timeSlot: 'late', dayOfWeek: 'sunday' });
      } else {
        earlyGames.push({ ...game, timeSlot: 'early', dayOfWeek: 'sunday' });
      }
    });

    // Combine all games
    const allGames: ScheduledGame[] = [
      ...(thursdayGame ? [thursdayGame] : []),
      ...earlyGames,
      ...lateGames,
      ...(sundayNightGame ? [sundayNightGame] : []),
      ...(mondayNightGame ? [mondayNightGame] : []),
    ];

    return {
      ...week,
      games: allGames,
      thursdayGame,
      sundayNightGame,
      mondayNightGame,
      earlyGames,
      lateGames,
    };
  });
}

// ============================================================================
// BUILD TEAM SCHEDULES
// ============================================================================

function buildTeamSchedules(
  weeks: WeekSchedule[],
  byeWeeks: Map<string, number>
): Record<string, TeamSchedule> {
  const teamSchedules: Record<string, TeamSchedule> = {};

  for (const team of LEAGUE_TEAMS) {
    const teamGames: ScheduledGame[] = [];

    for (const week of weeks) {
      for (const game of week.games) {
        if (game.awayTeamId === team.id || game.homeTeamId === team.id) {
          teamGames.push(game);
        }
      }
    }

    const homeGames = teamGames.filter((g) => g.homeTeamId === team.id).length;
    const awayGames = teamGames.filter((g) => g.awayTeamId === team.id).length;
    const primeTimeGames = teamGames.filter((g) => g.isPrimeTime).length;

    teamSchedules[team.id] = {
      teamId: team.id,
      games: teamGames.sort((a, b) => a.week - b.week),
      byeWeek: byeWeeks.get(team.id) || 0,
      homeGames,
      awayGames,
      primeTimeGames,
      divisionGames: teamGames.filter((g) => g.gameType === 'division').length,
      conferenceGames: teamGames.filter((g) => g.gameType === 'conference').length,
      interConferenceGames: teamGames.filter((g) => g.gameType === 'inter_conference').length,
      rotatingGames: teamGames.filter((g) => g.gameType === 'rotating').length,
    };
  }

  return teamSchedules;
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export function generateSchedule(config: ScheduleGeneratorConfig): LeagueSchedule {
  // 1. Build division structure
  const divisions = buildDivisions();

  // 2. Generate random standings
  const standings = generateRandomStandings(divisions);

  // 3. Generate all matchups for each team
  const allMatchups = new Map<string, Matchup[]>();
  for (const team of LEAGUE_TEAMS) {
    const matchups = generateTeamMatchups(team.id, standings, divisions);
    allMatchups.set(team.id, matchups);
  }

  // 4. Create games from matchups (deduplicate home/away)
  const allGames = createGamesFromMatchups(allMatchups);

  // 5. Assign bye weeks
  const byeWeeks = assignByeWeeks(LEAGUE_TEAMS.map((t) => t.id));

  // 6. Distribute games to weeks
  const weekSchedules = distributeGamesToWeeks(allGames, byeWeeks);

  // 7. Assign prime time slots
  const finalWeeks = assignPrimeTimeSlots(weekSchedules);

  // 8. Build team schedules
  const teamSchedules = buildTeamSchedules(finalWeeks, byeWeeks);

  return {
    season: config.season,
    weeks: finalWeeks,
    teamSchedules,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

export function getScheduleStats(schedule: LeagueSchedule): ScheduleStats {
  const byeDistribution: Record<number, number> = {};
  for (let week = BYE_WEEK_START; week <= BYE_WEEK_END; week++) {
    byeDistribution[week] = 0;
  }

  let totalHomeGames = 0;
  let totalAwayGames = 0;
  let balancedTeams = 0;

  Object.values(schedule.teamSchedules).forEach((ts) => {
    if (byeDistribution[ts.byeWeek] !== undefined) {
      byeDistribution[ts.byeWeek]++;
    }
    totalHomeGames += ts.homeGames;
    totalAwayGames += ts.awayGames;
    if (ts.homeGames >= 8 && ts.homeGames <= 9) balancedTeams++;
  });

  let thursdayCount = 0;
  let sundayNightCount = 0;
  let mondayNightCount = 0;
  let divisionCount = 0;
  let conferenceCount = 0;
  let interConfCount = 0;
  let rotatingCount = 0;

  schedule.weeks.forEach((week) => {
    if (week.thursdayGame) thursdayCount++;
    if (week.sundayNightGame) sundayNightCount++;
    if (week.mondayNightGame) mondayNightCount++;

    week.games.forEach((g) => {
      switch (g.gameType) {
        case 'division':
          divisionCount++;
          break;
        case 'conference':
          conferenceCount++;
          break;
        case 'inter_conference':
          interConfCount++;
          break;
        case 'rotating':
          rotatingCount++;
          break;
      }
    });
  });

  const totalGames = schedule.weeks.reduce((sum, w) => sum + w.games.length, 0);

  return {
    totalGames,
    gamesPerTeam: GAMES_PER_TEAM,
    primeTimeGames: {
      thursday: thursdayCount,
      sundayNight: sundayNightCount,
      mondayNight: mondayNightCount,
      total: thursdayCount + sundayNightCount + mondayNightCount,
    },
    byeWeekDistribution: byeDistribution,
    homeAwayBalance: {
      balanced: balancedTeams,
      avgHomeGames: Math.round((totalHomeGames / 32) * 10) / 10,
      avgAwayGames: Math.round((totalAwayGames / 32) * 10) / 10,
    },
    gameTypeBreakdown: {
      division: divisionCount,
      conference: conferenceCount,
      interConference: interConfCount,
      rotating: rotatingCount,
    },
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

export function validateSchedule(schedule: LeagueSchedule): ScheduleValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(schedule.teamSchedules).forEach(([teamId, ts]) => {
    if (ts.games.length !== GAMES_PER_TEAM) {
      errors.push(`${teamId}: Has ${ts.games.length} games, expected ${GAMES_PER_TEAM}`);
    }

    if (ts.divisionGames !== 6) {
      warnings.push(`${teamId}: Has ${ts.divisionGames} division games, expected 6`);
    }

    if (ts.byeWeek < BYE_WEEK_START || ts.byeWeek > BYE_WEEK_END) {
      errors.push(`${teamId}: Bye week ${ts.byeWeek} outside allowed range`);
    }

    if (ts.homeGames < 7 || ts.homeGames > 10) {
      warnings.push(`${teamId}: Unbalanced home/away (${ts.homeGames}H/${ts.awayGames}A)`);
    }
  });

  const totalGames = schedule.weeks.reduce((sum, w) => sum + w.games.length, 0);
  const expectedGames = (32 * 17) / 2; // 272
  if (totalGames !== expectedGames) {
    errors.push(`Total games: ${totalGames}, expected ${expectedGames}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

