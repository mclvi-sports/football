/**
 * Schedule Generator
 *
 * Generates NFL-style 18-week regular season schedules for all 32 teams.
 * Follows rules from FINAL-season-calendar-system.md
 *
 * ⚠️  WARNING: DO NOT MODIFY THE SCHEDULING LOGIC IN THIS FILE  ⚠️
 *
 * The algorithms here (hybrid greedy placement, bye week assignment, matchup
 * generation, constraint checking) have been carefully tuned and tested.
 * They correctly handle the complex NFL scheduling constraints:
 * - 17 games per team across 18 weeks
 * - Division games (6), rotating intra-conference (4), same-place conference (2)
 * - Inter-conference (4), 17th game (1)
 * - Bye weeks, home/away balance, prime time slots
 *
 * If generation fails, adjust ONLY the retry/timeout parameters:
 * - MAX_ATTEMPTS, TIME_LIMIT_MS, MAX_RETRIES
 *
 * Do not refactor or "optimize" the core logic without extensive testing.
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
import { ScheduleCSPSolver, assignmentsToWeekSchedules } from './csp-solver';

// ============================================================================
// CONSTANTS
// ============================================================================

const TOTAL_WEEKS = 18;
const GAMES_PER_TEAM = 17;
const TOTAL_GAMES = 272; // (32 teams × 17 games) / 2
const BYE_WEEK_START = 5;
const BYE_WEEK_END = 17; // 13 bye weeks (5-17) for maximum scheduling flexibility

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

// Same-conference rotating division matchups (SYMMETRIC - both divisions play each other)
// This rotates yearly in the real NFL, but for now we use a fixed mapping
const ROTATING_DIVISION: Record<string, string> = {
  'Atlantic North': 'Atlantic South',
  'Atlantic South': 'Atlantic North', // Symmetric!
  'Atlantic East': 'Atlantic West',
  'Atlantic West': 'Atlantic East', // Symmetric!
  'Pacific North': 'Pacific South',
  'Pacific South': 'Pacific North', // Symmetric!
  'Pacific East': 'Pacific West',
  'Pacific West': 'Pacific East', // Symmetric!
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
// GET 17TH GAME OPPONENT DIVISION
// The 17th game is vs a same-place finisher from a non-rotating inter-conference division
// ============================================================================

const SEVENTEENTH_GAME_DIVISION: Record<string, string> = {
  'Atlantic North': 'Pacific South',
  'Atlantic South': 'Pacific East',
  'Atlantic East': 'Pacific West',
  'Atlantic West': 'Pacific North',
  'Pacific North': 'Atlantic West',
  'Pacific South': 'Atlantic North',
  'Pacific East': 'Atlantic South',
  'Pacific West': 'Atlantic East',
};

// ============================================================================
// GENERATE TEAM MATCHUPS (NFL 17-Game Formula)
// ============================================================================
//
// NFL 17-game schedule breakdown:
// 1. DIVISION (6): 2 games vs each of 3 division rivals (home + away)
// 2. ROTATING INTRA-CONFERENCE (4): 1 game vs all 4 teams in rotating same-conf division
// 3. SAME-PLACE INTRA-CONFERENCE (2): 1 game vs same-place finisher from other 2 divisions
// 4. INTER-CONFERENCE (4): 1 game vs all 4 teams in rotating opposite-conf division
// 5. 17TH GAME (1): 1 game vs same-place finisher from another opposite-conf division
//
// Total: 6 + 4 + 2 + 4 + 1 = 17 games
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

  // 1. DIVISION GAMES (6): 2 vs each division opponent (home + away)
  const divisionOpponents = teamDivision.teams.filter((t) => t !== teamId);
  for (const opponent of divisionOpponents) {
    matchups.push({ opponentId: opponent, gameType: 'division', isHome: true });
    matchups.push({ opponentId: opponent, gameType: 'division', isHome: false });
  }

  // 2. ROTATING INTRA-CONFERENCE (4): All 4 teams from rotating same-conference division
  // Use deterministic home/away based on team ID to avoid duplicates
  const rotatingDivision = ROTATING_DIVISION[team.division];
  const rotatingDiv = divisions.find((d) => d.division === rotatingDivision);
  if (rotatingDiv) {
    rotatingDiv.teams.forEach((opponent) => {
      // Deterministic: alphabetically first team is home for half
      const isHome = teamId.localeCompare(opponent) < 0;
      matchups.push({
        opponentId: opponent,
        gameType: 'rotating',
        isHome,
      });
    });
  }

  // 3. SAME-PLACE INTRA-CONFERENCE (2): From the OTHER 2 same-conference divisions
  // (not our division, not the rotating division)
  const otherSameConfDivisions = divisions.filter(
    (d) =>
      d.conference === teamDivision.conference &&
      d.division !== teamDivision.division &&
      d.division !== rotatingDivision
  );
  for (const otherDiv of otherSameConfDivisions) {
    const samePlaceTeam = findSamePlaceFinisher(otherDiv.teams, teamStanding.divisionPlace, standings);
    if (samePlaceTeam) {
      // Deterministic home/away based on team ID comparison
      const isHome = teamId.localeCompare(samePlaceTeam) < 0;
      matchups.push({
        opponentId: samePlaceTeam,
        gameType: 'conference',
        isHome,
      });
    }
  }

  // 4. INTER-CONFERENCE (4): All 4 teams from rotating opposite-conference division
  // Use deterministic home/away based on team ID to avoid duplicates
  const interConfDivision = INTER_CONFERENCE_ROTATION[team.division];
  const interConfDiv = divisions.find((d) => d.division === interConfDivision);
  if (interConfDiv) {
    interConfDiv.teams.forEach((opponent) => {
      // Deterministic: alphabetically first team is home
      const isHome = teamId.localeCompare(opponent) < 0;
      matchups.push({
        opponentId: opponent,
        gameType: 'inter_conference',
        isHome,
      });
    });
  }

  // 5. 17TH GAME (1): Same-place finisher from another inter-conference division
  // Use deterministic home/away based on team ID to avoid duplicates
  const seventeenthGameDivision = SEVENTEENTH_GAME_DIVISION[team.division];
  const seventeenthDiv = divisions.find((d) => d.division === seventeenthGameDivision);
  if (seventeenthDiv) {
    const samePlaceTeam = findSamePlaceFinisher(seventeenthDiv.teams, teamStanding.divisionPlace, standings);
    if (samePlaceTeam) {
      // Deterministic: alphabetically first team is home
      const isHome = teamId.localeCompare(samePlaceTeam) < 0;
      matchups.push({
        opponentId: samePlaceTeam,
        gameType: 'inter_conference',
        isHome,
      });
    }
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
// Key insight: Division rivals should NOT share bye weeks (gives more flexibility)
// 32 teams = 8 divisions × 4 teams
// 13 bye weeks (5-17) with mostly 2 teams each, some weeks have 4

function assignByeWeeks(teamIds: string[]): Map<string, number> {
  const byeWeeks = new Map<string, number>();

  // Group teams by division
  const divisionTeams = new Map<string, string[]>();
  for (const team of LEAGUE_TEAMS) {
    if (!divisionTeams.has(team.division)) {
      divisionTeams.set(team.division, []);
    }
    divisionTeams.get(team.division)!.push(team.id);
  }

  // Available bye weeks with target counts
  // Pattern: 13 weeks (5-17), with 2,2,2,2,2,2,2,4,4,4,2,2,2 = 32
  const byeSlots = [
    5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
    12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14,
    15, 15, 16, 16, 17, 17,
  ];

  // Shuffle bye slots
  const shuffledSlots = shuffleArray(byeSlots);

  // Assign each division's teams to DIFFERENT bye weeks
  // This ensures division rivals never share a bye week
  let slotIndex = 0;
  const divisions = Array.from(divisionTeams.entries());

  // Shuffle divisions for randomness
  for (let i = divisions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [divisions[i], divisions[j]] = [divisions[j], divisions[i]];
  }

  for (const [_, teams] of divisions) {
    // Shuffle teams within division
    const shuffledDivTeams = shuffleArray(teams);

    // Assign each team in division to a different bye week
    for (const teamId of shuffledDivTeams) {
      if (slotIndex < shuffledSlots.length) {
        byeWeeks.set(teamId, shuffledSlots[slotIndex]);
        slotIndex++;
      }
    }
  }

  return byeWeeks;
}

// Helper: Count games in nearby weeks (for load balancing)
function countNearbyGames(teamGames: Set<number>, week: number): number {
  let count = 0;
  // Check 2 weeks before and after
  for (let w = week - 2; w <= week + 2; w++) {
    if (w !== week && teamGames.has(w)) {
      count++;
    }
  }
  return count;
}

// ============================================================================
// DISTRIBUTE GAMES TO WEEKS (CSP Solver with Greedy Fallback)
// ============================================================================
// Uses a constraint satisfaction solver (backtracking with MRV/LCV heuristics)
// to guarantee 100% valid schedules. Falls back to greedy if CSP times out.

interface DistributionResult {
  weeks: WeekSchedule[];
  byeWeeks: Map<string, number>;
  placed: number;
}

function distributeGamesToWeeks(
  allGames: ScheduledGame[],
  initialByeWeeks: Map<string, number>
): DistributionResult {
  console.log(`Attempting hybrid greedy + targeted repair for ${allGames.length} games...`);

  // ⚠️ TUNABLE PARAMETERS - Safe to adjust if generation fails
  // Increase these values to improve success rate (at cost of speed)
  const MAX_ATTEMPTS = 10000;  // Number of placement attempts per retry
  const TIME_LIMIT_MS = 8000;  // Max time (ms) before giving up on current attempt
  const startTime = Date.now();
  let bestWeeks: WeekSchedule[] = [];
  let bestByeWeeks: Map<string, number> = initialByeWeeks;
  let bestPlaced = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (Date.now() - startTime > TIME_LIMIT_MS) break;

    // Fresh bye weeks each attempt
    const attemptByeWeeks = assignByeWeeks(LEAGUE_TEAMS.map((t) => t.id));

    // Greedy placement with targeted ordering
    const result = hybridPlacement(allGames, attemptByeWeeks);

    if (result.placed > bestPlaced) {
      bestPlaced = result.placed;
      bestWeeks = result.weeks;
      bestByeWeeks = attemptByeWeeks;
      if (result.placed === allGames.length) {
        console.log(`Hybrid succeeded: ${result.placed}/${allGames.length} in ${attempt + 1} attempts (${Date.now() - startTime}ms)`);
        return { weeks: result.weeks, byeWeeks: attemptByeWeeks, placed: result.placed };
      }
    }
  }

  console.warn(`Hybrid: Best ${bestPlaced}/${allGames.length} (${Date.now() - startTime}ms)`);
  return { weeks: bestWeeks, byeWeeks: bestByeWeeks, placed: bestPlaced };
}

// ============================================================================
// HYBRID PLACEMENT (MRV ordering + greedy)
// ============================================================================
// Uses Most Constrained Variable (MRV) heuristic: place games with fewest
// valid weeks first. This reduces the chance of getting stuck.

function hybridPlacement(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): PlacementResult {
  // Initialize weeks
  const weeks: WeekSchedule[] = [];
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

  // Track team availability
  const teamWeekGames = new Map<string, Set<number>>();
  for (const team of LEAGUE_TEAMS) {
    teamWeekGames.set(team.id, new Set());
  }

  // Calculate initial valid weeks for each game
  const gameValidWeeks = new Map<ScheduledGame, number[]>();
  for (const game of allGames) {
    const validWeeks: number[] = [];
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      const awayBye = byeWeeks.get(game.awayTeamId);
      const homeBye = byeWeeks.get(game.homeTeamId);
      if (awayBye !== w && homeBye !== w) {
        validWeeks.push(w);
      }
    }
    gameValidWeeks.set(game, validWeeks);
  }

  // Create a list of unplaced games with dynamic MRV scoring
  const unplaced = new Set(allGames);
  let placed = 0;

  while (unplaced.size > 0) {
    // Find game with fewest available weeks (MRV)
    let bestGame: ScheduledGame | null = null;
    let bestAvailable: number[] = [];
    let minOptions = Infinity;

    for (const game of unplaced) {
      const validWeeks = gameValidWeeks.get(game)!;
      const available = validWeeks.filter((w) => {
        return (
          !teamWeekGames.get(game.awayTeamId)!.has(w) &&
          !teamWeekGames.get(game.homeTeamId)!.has(w)
        );
      });

      if (available.length === 0) {
        // No valid slot - this configuration is stuck
        unplaced.delete(game);
        continue;
      }

      // Prefer division games when tied, then by fewest options
      const score = available.length * 10 + (game.gameType === 'division' ? 0 : 1);
      if (available.length < minOptions || (available.length === minOptions && game.gameType === 'division')) {
        minOptions = available.length;
        bestGame = game;
        bestAvailable = available;
      }
    }

    if (!bestGame) break; // No more games can be placed

    // Place in least-loaded available week
    const weekScores = bestAvailable.map((w) => ({
      week: w,
      load: weeks[w - 1].games.length + Math.random() * 0.3,
    }));
    weekScores.sort((a, b) => a.load - b.load);

    const weekNum = weekScores[0].week;
    const assignedGame: ScheduledGame = {
      ...bestGame,
      week: weekNum,
      id: generateGameId(weekNum, bestGame.awayTeamId, bestGame.homeTeamId),
    };
    weeks[weekNum - 1].games.push(assignedGame);
    teamWeekGames.get(bestGame.awayTeamId)!.add(weekNum);
    teamWeekGames.get(bestGame.homeTeamId)!.add(weekNum);

    unplaced.delete(bestGame);
    placed++;
  }

  return { weeks, placed };
}

// ============================================================================
// DISTRIBUTE GAMES TO WEEKS (Pure Greedy with Random Restarts)
// ============================================================================
// Simple approach: try many random orderings until we find one that works.
// No cascade repair - just pure greedy placement with different starting conditions.

function distributeGamesToWeeksPureGreedy(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): WeekSchedule[] {
  const MAX_ATTEMPTS = 10000; // More attempts since no repair
  const TIME_LIMIT_MS = 4500;
  const startTime = Date.now();
  let bestWeeks: WeekSchedule[] = [];
  let bestPlaced = 0;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (Date.now() - startTime > TIME_LIMIT_MS) break;

    // Fresh bye weeks each attempt
    const attemptByeWeeks = assignByeWeeks(LEAGUE_TEAMS.map((t) => t.id));

    // Try pure greedy placement
    const result = pureGreedyPlacement(allGames, attemptByeWeeks);

    if (result.placed > bestPlaced) {
      bestPlaced = result.placed;
      bestWeeks = result.weeks;
      if (result.placed === allGames.length) {
        console.log(`Pure greedy succeeded: ${result.placed}/${allGames.length} in ${attempt + 1} attempts (${Date.now() - startTime}ms)`);
        return result.weeks;
      }
    }
  }

  console.warn(`Pure greedy: Best ${bestPlaced}/${allGames.length} (${Date.now() - startTime}ms)`);
  return bestWeeks;
}

interface PlacementResult {
  weeks: WeekSchedule[];
  placed: number;
}

function pureGreedyPlacement(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): PlacementResult {
  // Initialize weeks
  const weeks: WeekSchedule[] = [];
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

  // Track team availability per week
  const teamWeekGames = new Map<string, Set<number>>();
  for (const team of LEAGUE_TEAMS) {
    teamWeekGames.set(team.id, new Set());
  }

  // Calculate valid weeks for each game (not during either team's bye)
  const gameValidWeeks = new Map<ScheduledGame, number[]>();
  for (const game of allGames) {
    const validWeeks: number[] = [];
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      const awayBye = byeWeeks.get(game.awayTeamId);
      const homeBye = byeWeeks.get(game.homeTeamId);
      if (awayBye !== w && homeBye !== w) {
        validWeeks.push(w);
      }
    }
    gameValidWeeks.set(game, validWeeks);
  }

  // Shuffle games, but keep division games first (most constrained)
  const divisionGames = shuffleArray(allGames.filter((g) => g.gameType === 'division'));
  const otherGames = shuffleArray(allGames.filter((g) => g.gameType !== 'division'));

  const orderedGames = [...divisionGames, ...otherGames];

  let placed = 0;

  for (const game of orderedGames) {
    const validWeeks = gameValidWeeks.get(game)!;

    // Find valid weeks where both teams are free, prefer least-loaded weeks
    const availableWeeks = validWeeks
      .filter((w) => {
        return (
          !teamWeekGames.get(game.awayTeamId)!.has(w) &&
          !teamWeekGames.get(game.homeTeamId)!.has(w)
        );
      })
      .map((w) => ({
        week: w,
        load: weeks[w - 1].games.length + Math.random() * 0.5,
      }))
      .sort((a, b) => a.load - b.load);

    if (availableWeeks.length > 0) {
      const weekNum = availableWeeks[0].week;
      const assignedGame: ScheduledGame = {
        ...game,
        week: weekNum,
        id: generateGameId(weekNum, game.awayTeamId, game.homeTeamId),
      };
      weeks[weekNum - 1].games.push(assignedGame);
      teamWeekGames.get(game.awayTeamId)!.add(weekNum);
      teamWeekGames.get(game.homeTeamId)!.add(weekNum);
      placed++;
    }
  }

  return { weeks, placed };
}

// Old attemptFullPlacement function - kept for reference but not used
function attemptFullPlacement(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): PlacementResult {
  // Initialize weeks
  const weeks: WeekSchedule[] = [];
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

  // Track team availability
  const teamWeekGames = new Map<string, Set<number>>();
  for (const team of LEAGUE_TEAMS) {
    teamWeekGames.set(team.id, new Set());
  }

  // Calculate valid weeks for each game
  const gameValidWeeks = new Map<ScheduledGame, Set<number>>();
  for (const game of allGames) {
    const validWeeks = new Set<number>();
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      if (!byeWeeks.get(game.awayTeamId) || byeWeeks.get(game.awayTeamId) !== w) {
        if (!byeWeeks.get(game.homeTeamId) || byeWeeks.get(game.homeTeamId) !== w) {
          validWeeks.add(w);
        }
      }
    }
    gameValidWeeks.set(game, validWeeks);
  }

  // Sort games: division first, then by constraint level (fewest valid weeks)
  const sortedGames = [...allGames].sort((a, b) => {
    // Division games first
    if (a.gameType === 'division' && b.gameType !== 'division') return -1;
    if (b.gameType === 'division' && a.gameType !== 'division') return 1;
    // Then by constraint level
    const aValid = gameValidWeeks.get(a)!.size;
    const bValid = gameValidWeeks.get(b)!.size;
    if (aValid !== bValid) return aValid - bValid;
    return Math.random() - 0.5;
  });

  const placedGames = new Set<ScheduledGame>();
  const unplacedGames: ScheduledGame[] = [];

  // Phase 1: Greedy placement
  for (const game of sortedGames) {
    const validWeeks = gameValidWeeks.get(game)!;
    let placed = false;

    // Find best week (fewest games so far, both teams free)
    const weekScores = Array.from(validWeeks)
      .filter((w) => {
        const awayWeeks = teamWeekGames.get(game.awayTeamId)!;
        const homeWeeks = teamWeekGames.get(game.homeTeamId)!;
        return !awayWeeks.has(w) && !homeWeeks.has(w);
      })
      .map((w) => ({
        week: w,
        score: weeks[w - 1].games.length + Math.random() * 0.5,
      }))
      .sort((a, b) => a.score - b.score);

    if (weekScores.length > 0) {
      const weekNum = weekScores[0].week;
      placeGame(game, weekNum, weeks, teamWeekGames);
      placedGames.add(game);
      placed = true;
    }

    if (!placed) {
      unplacedGames.push(game);
    }
  }

  // Phase 2: Multi-pass repair for unplaced games
  // Try multiple repair passes with increasing cascade depth
  const REPAIR_PASSES = 5;
  const CASCADE_DEPTHS = [2, 3, 3, 4, 4]; // Increase depth on later passes

  for (let repairPass = 0; repairPass < REPAIR_PASSES && unplacedGames.some((g) => !placedGames.has(g)); repairPass++) {
    const cascadeDepth = CASCADE_DEPTHS[repairPass] || 3;

    for (const game of [...unplacedGames]) {
      if (placedGames.has(game)) continue;

      const validWeeks = gameValidWeeks.get(game)!;
      const shuffledWeeks = [...validWeeks].sort(() => Math.random() - 0.5);

      for (const targetWeek of shuffledWeeks) {
        // Try to make room in targetWeek
        const awayBusy = teamWeekGames.get(game.awayTeamId)!.has(targetWeek);
        const homeBusy = teamWeekGames.get(game.homeTeamId)!.has(targetWeek);

        if (!awayBusy && !homeBusy) {
          // Both free - place it
          placeGame(game, targetWeek, weeks, teamWeekGames);
          placedGames.add(game);
          break;
        }

        // Try to move blocking games with recursive cascade
        const result = tryPlaceWithCascade(
          game,
          targetWeek,
          weeks,
          teamWeekGames,
          allGames,
          gameValidWeeks,
          cascadeDepth
        );

        if (result.success) {
          placedGames.add(game);
          break;
        }
      }
    }
  }

  return {
    weeks,
    placed: placedGames.size,
  };
}

interface CascadeResult {
  success: boolean;
}

interface CascadeMoveRecord {
  game: ScheduledGame;
  fromWeek: number;
  toWeek: number;
}

function tryPlaceWithCascade(
  game: ScheduledGame,
  targetWeek: number,
  weeks: WeekSchedule[],
  teamWeekGames: Map<string, Set<number>>,
  allGames: ScheduledGame[],
  gameValidWeeks: Map<ScheduledGame, Set<number>>,
  maxDepth: number,
  movedSet: Set<string> = new Set(), // Track moved games to avoid cycles
  allMoves: CascadeMoveRecord[] = [] // Track ALL moves for proper rollback
): CascadeResult {
  const awayBusy = teamWeekGames.get(game.awayTeamId)!.has(targetWeek);
  const homeBusy = teamWeekGames.get(game.homeTeamId)!.has(targetWeek);

  if (!awayBusy && !homeBusy) {
    // Can place directly
    placeGame(game, targetWeek, weeks, teamWeekGames);
    return { success: true };
  }

  if (maxDepth <= 0) {
    return { success: false };
  }

  // Identify blocking games
  const blockingTeams: string[] = [];
  if (awayBusy) blockingTeams.push(game.awayTeamId);
  if (homeBusy) blockingTeams.push(game.homeTeamId);

  // Track moves made at THIS level for rollback
  const movesAtThisLevel: CascadeMoveRecord[] = [];

  for (const blockingTeam of blockingTeams) {
    const blockingGame = weeks[targetWeek - 1].games.find(
      (bg) => bg.awayTeamId === blockingTeam || bg.homeTeamId === blockingTeam
    );

    if (!blockingGame) continue;

    // Avoid cycles - don't move a game we've already moved
    const blockingKey = `${blockingGame.awayTeamId}-${blockingGame.homeTeamId}`;
    if (movedSet.has(blockingKey)) {
      // Rollback moves at this level and fail
      rollbackMoves(movesAtThisLevel, weeks, teamWeekGames);
      return { success: false };
    }

    const originalBlockingGame = allGames.find(
      (og) => og.awayTeamId === blockingGame.awayTeamId && og.homeTeamId === blockingGame.homeTeamId
    );

    if (!originalBlockingGame) {
      rollbackMoves(movesAtThisLevel, weeks, teamWeekGames);
      return { success: false };
    }

    const blockingValidWeeks = gameValidWeeks.get(originalBlockingGame);
    if (!blockingValidWeeks) {
      rollbackMoves(movesAtThisLevel, weeks, teamWeekGames);
      return { success: false };
    }

    // Find alternative week for blocking game - try direct placement first
    const altWeeks = [...blockingValidWeeks]
      .filter((w) => w !== targetWeek)
      .sort(() => Math.random() - 0.5);
    let moved = false;

    // First pass: try direct placement (no cascade)
    for (const altWeek of altWeeks) {
      const bAwayFree = !teamWeekGames.get(blockingGame.awayTeamId)!.has(altWeek);
      const bHomeFree = !teamWeekGames.get(blockingGame.homeTeamId)!.has(altWeek);

      if (bAwayFree && bHomeFree) {
        unplaceGame(blockingGame, targetWeek, weeks, teamWeekGames);
        placeGame(blockingGame, altWeek, weeks, teamWeekGames);
        const moveRecord = { game: blockingGame, fromWeek: targetWeek, toWeek: altWeek };
        movesAtThisLevel.push(moveRecord);
        allMoves.push(moveRecord);
        moved = true;
        break;
      }
    }

    // Second pass: try recursive cascade if direct failed and depth allows
    if (!moved && maxDepth > 1) {
      const newMovedSet = new Set(movedSet);
      newMovedSet.add(blockingKey);

      for (const altWeek of altWeeks) {
        // Temporarily remove blocking game
        unplaceGame(blockingGame, targetWeek, weeks, teamWeekGames);

        // Track this removal in case we need to restore
        const movesBeforeCascade = allMoves.length;

        // Try to place it via cascade (passing shared allMoves array)
        const cascadeResult = tryPlaceWithCascade(
          blockingGame,
          altWeek,
          weeks,
          teamWeekGames,
          allGames,
          gameValidWeeks,
          maxDepth - 1,
          newMovedSet,
          allMoves // Pass shared array
        );

        if (cascadeResult.success) {
          const moveRecord = { game: blockingGame, fromWeek: targetWeek, toWeek: altWeek };
          movesAtThisLevel.push(moveRecord);
          allMoves.push(moveRecord);
          moved = true;
          break;
        } else {
          // Cascade failed - rollback any moves it made
          while (allMoves.length > movesBeforeCascade) {
            const m = allMoves.pop()!;
            unplaceGame(m.game, m.toWeek, weeks, teamWeekGames);
            placeGame(m.game, m.fromWeek, weeks, teamWeekGames);
          }
          // Restore blocking game to original position
          placeGame(blockingGame, targetWeek, weeks, teamWeekGames);
        }
      }
    }

    if (!moved) {
      // Couldn't move this blocking game - rollback moves at this level and fail
      rollbackMoves(movesAtThisLevel, weeks, teamWeekGames);
      return { success: false };
    }
  }

  // All blocking games moved - try to place original
  const nowAwayFree = !teamWeekGames.get(game.awayTeamId)!.has(targetWeek);
  const nowHomeFree = !teamWeekGames.get(game.homeTeamId)!.has(targetWeek);

  if (nowAwayFree && nowHomeFree) {
    placeGame(game, targetWeek, weeks, teamWeekGames);
    return { success: true };
  }

  // Still couldn't place - rollback moves at this level
  rollbackMoves(movesAtThisLevel, weeks, teamWeekGames);
  return { success: false };
}

function rollbackMoves(
  moves: CascadeMoveRecord[],
  weeks: WeekSchedule[],
  teamWeekGames: Map<string, Set<number>>
): void {
  // Rollback in reverse order
  for (let i = moves.length - 1; i >= 0; i--) {
    const m = moves[i];
    unplaceGame(m.game, m.toWeek, weeks, teamWeekGames);
    placeGame(m.game, m.fromWeek, weeks, teamWeekGames);
  }
}

function placeGame(
  game: ScheduledGame,
  weekNum: number,
  weeks: WeekSchedule[],
  teamWeekGames: Map<string, Set<number>>
): void {
  // Safety check: don't add if game already exists in this week
  const existingGame = weeks[weekNum - 1].games.find(
    (g) => g.awayTeamId === game.awayTeamId && g.homeTeamId === game.homeTeamId
  );
  if (existingGame) {
    console.warn(`Warning: Tried to place duplicate game ${game.awayTeamId}@${game.homeTeamId} in week ${weekNum}`);
    return;
  }

  // Safety check: don't place if either team already plays this week
  if (teamWeekGames.get(game.awayTeamId)!.has(weekNum)) {
    console.warn(`Warning: ${game.awayTeamId} already plays in week ${weekNum}, skipping ${game.awayTeamId}@${game.homeTeamId}`);
    return;
  }
  if (teamWeekGames.get(game.homeTeamId)!.has(weekNum)) {
    console.warn(`Warning: ${game.homeTeamId} already plays in week ${weekNum}, skipping ${game.awayTeamId}@${game.homeTeamId}`);
    return;
  }

  const assignedGame: ScheduledGame = {
    ...game,
    week: weekNum,
    id: generateGameId(weekNum, game.awayTeamId, game.homeTeamId),
  };
  weeks[weekNum - 1].games.push(assignedGame);
  teamWeekGames.get(game.awayTeamId)!.add(weekNum);
  teamWeekGames.get(game.homeTeamId)!.add(weekNum);
}

function unplaceGame(
  game: ScheduledGame,
  weekNum: number,
  weeks: WeekSchedule[],
  teamWeekGames: Map<string, Set<number>>
): void {
  weeks[weekNum - 1].games = weeks[weekNum - 1].games.filter(
    (g) => !(g.awayTeamId === game.awayTeamId && g.homeTeamId === game.homeTeamId)
  );
  teamWeekGames.get(game.awayTeamId)!.delete(weekNum);
  teamWeekGames.get(game.homeTeamId)!.delete(weekNum);
}

// ============================================================================
// DISTRIBUTE GAMES TO WEEKS (CSP Solver - Currently Disabled)
// ============================================================================
// Uses constraint satisfaction with backtracking to guarantee all games placed

interface CSPDistributionResult {
  success: boolean;
  weeks: WeekSchedule[];
  gamesPlaced: number;
  timeMs: number;
  iterations: number;
}

function distributeGamesToWeeksCSP(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): CSPDistributionResult {
  // Create solver with timeout
  const solver = new ScheduleCSPSolver({
    timeoutMs: 4000, // 4 second timeout (leave 1s buffer for rest of generation)
    maxIterations: 1_000_000,
  });

  // Initialize variables (games with valid week domains)
  // The solver handles constraints internally for performance
  solver.initializeVariables(allGames, byeWeeks, TOTAL_WEEKS);

  // Solve
  const result = solver.solve();

  if (!result.success) {
    // Return empty result on failure
    return {
      success: false,
      weeks: [],
      gamesPlaced: result.assignments.size,
      timeMs: result.timeMs,
      iterations: result.iterations,
    };
  }

  // Convert result to WeekSchedule array
  const weeks = assignmentsToWeekSchedules(result, solver.getVariables(), byeWeeks, TOTAL_WEEKS);

  return {
    success: true,
    weeks,
    gamesPlaced: result.assignments.size,
    timeMs: result.timeMs,
    iterations: result.iterations,
  };
}

// ============================================================================
// DISTRIBUTE GAMES TO WEEKS (Greedy Fallback)
// ============================================================================
// Uses a simpler, more reliable approach:
// 1. Sort games by constraint level (most constrained first)
// 2. Assign each game to the week with fewest games where both teams are free
// 3. Multiple passes with different orderings to maximize placement

function distributeGamesToWeeksGreedy(
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

  // Track which weeks each team plays
  const teamWeekGames = new Map<string, Set<number>>();
  for (const team of LEAGUE_TEAMS) {
    teamWeekGames.set(team.id, new Set());
  }

  // Try multiple random orderings with different bye week configurations
  let bestWeeks: WeekSchedule[] = weeks;
  let bestPlaced = 0;
  const MAX_ATTEMPTS = 1000;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Regenerate bye weeks with new random shuffle each attempt
    const attemptByeWeeks = assignByeWeeks(LEAGUE_TEAMS.map((t) => t.id));

    // Rebuild weeks with new bye assignments
    const attemptWeeks: WeekSchedule[] = [];
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      const byeTeams = Array.from(attemptByeWeeks.entries())
        .filter(([_, byeWeek]) => byeWeek === w)
        .map(([teamId]) => teamId);

      attemptWeeks.push({
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

    // Recalculate valid weeks for this bye configuration
    const attemptGameValidWeeks = new Map<ScheduledGame, Set<number>>();
    for (const game of allGames) {
      const validWeeks = new Set<number>();
      for (let w = 1; w <= TOTAL_WEEKS; w++) {
        const week = attemptWeeks[w - 1];
        if (!week.byeTeams.includes(game.awayTeamId) && !week.byeTeams.includes(game.homeTeamId)) {
          validWeeks.add(w);
        }
      }
      attemptGameValidWeeks.set(game, validWeeks);
    }

    const attemptTeamWeekGames = new Map<string, Set<number>>();
    for (const team of LEAGUE_TEAMS) {
      attemptTeamWeekGames.set(team.id, new Set());
    }

    // Place division games first (they're the most constrained structurally)
    // Then sort remaining by constraint level
    const divisionGames = allGames.filter((g) => g.gameType === 'division');
    const otherGames = allGames.filter((g) => g.gameType !== 'division');

    // Shuffle division games randomly
    for (let i = divisionGames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [divisionGames[i], divisionGames[j]] = [divisionGames[j], divisionGames[i]];
    }

    // Sort other games by constraint level (most constrained first)
    otherGames.sort((a, b) => {
      const aValid = attemptGameValidWeeks.get(a)!.size;
      const bValid = attemptGameValidWeeks.get(b)!.size;
      if (aValid !== bValid) return aValid - bValid;
      return Math.random() - 0.5;
    });

    // Combine: division games first, then others
    const shuffledGames = [...divisionGames, ...otherGames];

    let placed = 0;

    // Greedy assignment
    for (const game of shuffledGames) {
      const validWeekNums: number[] = [];
      for (let w = 1; w <= TOTAL_WEEKS; w++) {
        const awayWeeks = attemptTeamWeekGames.get(game.awayTeamId)!;
        const homeWeeks = attemptTeamWeekGames.get(game.homeTeamId)!;
        const validWeeks = attemptGameValidWeeks.get(game)!;
        if (validWeeks.has(w) && !awayWeeks.has(w) && !homeWeeks.has(w)) {
          validWeekNums.push(w);
        }
      }

      if (validWeekNums.length > 0) {
        // Calculate week scores - prefer weeks that balance load
        const weekScores = validWeekNums.map((w) => {
          const week = attemptWeeks[w - 1];
          const byeCount = week.byeTeams.length;
          const maxGames = (32 - byeCount) / 2; // max games possible this week
          const currentGames = week.games.length;
          const utilization = currentGames / maxGames;

          // Also consider how many games each team already has in nearby weeks
          const awayGamesNearby = countNearbyGames(attemptTeamWeekGames.get(game.awayTeamId)!, w);
          const homeGamesNearby = countNearbyGames(attemptTeamWeekGames.get(game.homeTeamId)!, w);

          // Lower score = better (less utilized, fewer nearby games)
          return {
            week: w,
            score: utilization + (awayGamesNearby + homeGamesNearby) * 0.1 + Math.random() * 0.2,
          };
        });

        // Sort by score and pick best
        weekScores.sort((a, b) => a.score - b.score);
        const weekNum = weekScores[0].week;
        const week = attemptWeeks[weekNum - 1];
        const assignedGame: ScheduledGame = {
          ...game,
          week: weekNum,
          id: generateGameId(weekNum, game.awayTeamId, game.homeTeamId),
        };
        week.games.push(assignedGame);
        attemptTeamWeekGames.get(game.awayTeamId)!.add(weekNum);
        attemptTeamWeekGames.get(game.homeTeamId)!.add(weekNum);
        placed++;
      }
    }

    // Repair phase: try to place remaining games by moving existing ones
    if (placed < allGames.length) {
      // Track placed games to avoid duplicates
      const placedGameKeys = new Set<string>();
      for (const week of attemptWeeks) {
        for (const g of week.games) {
          placedGameKeys.add(`${g.awayTeamId}-${g.homeTeamId}`);
        }
      }

      const unplacedGames = shuffledGames.filter((g) => {
        return !placedGameKeys.has(`${g.awayTeamId}-${g.homeTeamId}`);
      });

      // Try to repair each unplaced game
      for (const game of unplacedGames) {
        // Skip if already placed during this repair phase
        if (placedGameKeys.has(`${game.awayTeamId}-${game.homeTeamId}`)) continue;
        const validWeeks = attemptGameValidWeeks.get(game)!;

        // For each valid week, try to free up space
        for (const targetWeek of validWeeks) {
          const awayBusy = attemptTeamWeekGames.get(game.awayTeamId)!.has(targetWeek);
          const homeBusy = attemptTeamWeekGames.get(game.homeTeamId)!.has(targetWeek);

          if (!awayBusy && !homeBusy) {
            // Both free - place it
            const week = attemptWeeks[targetWeek - 1];
            const assignedGame: ScheduledGame = {
              ...game,
              week: targetWeek,
              id: generateGameId(targetWeek, game.awayTeamId, game.homeTeamId),
            };
            week.games.push(assignedGame);
            attemptTeamWeekGames.get(game.awayTeamId)!.add(targetWeek);
            attemptTeamWeekGames.get(game.homeTeamId)!.add(targetWeek);
            placedGameKeys.add(`${game.awayTeamId}-${game.homeTeamId}`);
            placed++;
            break;
          }

          // Try to move a blocking game
          const blockingTeam = awayBusy ? game.awayTeamId : game.homeTeamId;
          const blockingGame = attemptWeeks[targetWeek - 1].games.find(
            (g) => g.awayTeamId === blockingTeam || g.homeTeamId === blockingTeam
          );

          if (blockingGame) {
            const blockingValidWeeks = attemptGameValidWeeks.get(
              allGames.find(
                (g) =>
                  g.awayTeamId === blockingGame.awayTeamId &&
                  g.homeTeamId === blockingGame.homeTeamId
              )!
            )!;

            // Find alternative week for blocking game
            for (const altWeek of blockingValidWeeks) {
              if (altWeek === targetWeek) continue;
              const bAwayFree = !attemptTeamWeekGames.get(blockingGame.awayTeamId)!.has(altWeek);
              const bHomeFree = !attemptTeamWeekGames.get(blockingGame.homeTeamId)!.has(altWeek);

              if (bAwayFree && bHomeFree) {
                // Move blocking game
                const oldWeek = attemptWeeks[targetWeek - 1];
                oldWeek.games = oldWeek.games.filter(
                  (g) =>
                    !(g.awayTeamId === blockingGame.awayTeamId && g.homeTeamId === blockingGame.homeTeamId)
                );
                attemptTeamWeekGames.get(blockingGame.awayTeamId)!.delete(targetWeek);
                attemptTeamWeekGames.get(blockingGame.homeTeamId)!.delete(targetWeek);

                const newWeek = attemptWeeks[altWeek - 1];
                const movedGame: ScheduledGame = {
                  ...blockingGame,
                  week: altWeek,
                  id: generateGameId(altWeek, blockingGame.awayTeamId, blockingGame.homeTeamId),
                };
                newWeek.games.push(movedGame);
                attemptTeamWeekGames.get(blockingGame.awayTeamId)!.add(altWeek);
                attemptTeamWeekGames.get(blockingGame.homeTeamId)!.add(altWeek);

                // Now place the original game if possible
                const stillAwayBusy = attemptTeamWeekGames.get(game.awayTeamId)!.has(targetWeek);
                const stillHomeBusy = attemptTeamWeekGames.get(game.homeTeamId)!.has(targetWeek);

                if (!stillAwayBusy && !stillHomeBusy) {
                  const assignedGame: ScheduledGame = {
                    ...game,
                    week: targetWeek,
                    id: generateGameId(targetWeek, game.awayTeamId, game.homeTeamId),
                  };
                  oldWeek.games.push(assignedGame);
                  attemptTeamWeekGames.get(game.awayTeamId)!.add(targetWeek);
                  attemptTeamWeekGames.get(game.homeTeamId)!.add(targetWeek);
                  placedGameKeys.add(`${game.awayTeamId}-${game.homeTeamId}`);
                  placed++;
                  break;
                }
              }
            }
          }
          // Check if game was placed during this iteration
          if (placedGameKeys.has(`${game.awayTeamId}-${game.homeTeamId}`)) {
            break; // Game was placed
          }
        }
      }
    }

    if (placed > bestPlaced) {
      bestPlaced = placed;
      bestWeeks = attemptWeeks;
    }

    // Early exit if perfect solution found
    if (placed === allGames.length) {
      break;
    }
  }

  // Log results
  const unassignedCount = allGames.length - bestPlaced;
  if (unassignedCount > 0) {
    console.warn(`Could not assign ${unassignedCount} games after ${MAX_ATTEMPTS} attempts`);
  }

  return bestWeeks;
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
  let totalMatchups = 0;
  for (const team of LEAGUE_TEAMS) {
    const matchups = generateTeamMatchups(team.id, standings, divisions);
    allMatchups.set(team.id, matchups);
    totalMatchups += matchups.length;
  }
  console.log(`Total matchups generated: ${totalMatchups} (expected: 544 = 32 teams × 17 games)`);

  // Verify each team has exactly 17 matchups
  for (const [teamId, matchups] of allMatchups) {
    if (matchups.length !== 17) {
      console.error(`ERROR: ${teamId} has ${matchups.length} matchups, expected 17`);
      throw new Error(`Matchup generation failed: ${teamId} has ${matchups.length} matchups, expected 17`);
    }
  }

  // 4. Create games from matchups (deduplicate home/away)
  const allGames = createGamesFromMatchups(allMatchups);
  console.log(`Generated ${allGames.length} unique games from matchups`);

  // 5. Distribute games to weeks with retry until we get all 272
  // ⚠️ TUNABLE PARAMETER - Safe to adjust if generation fails
  const MAX_RETRIES = 20;  // Number of full retry attempts with fresh bye weeks
  let weekSchedules: WeekSchedule[] = [];
  let byeWeeks: Map<string, number> = new Map();

  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    // Assign initial bye weeks for this retry
    const initialByeWeeks = assignByeWeeks(LEAGUE_TEAMS.map((t) => t.id));

    // Distribute games to weeks (returns the bye weeks actually used)
    const result = distributeGamesToWeeks(allGames, initialByeWeeks);
    weekSchedules = result.weeks;
    byeWeeks = result.byeWeeks;

    if (result.placed === TOTAL_GAMES) {
      console.log(`Schedule generation succeeded on retry ${retry + 1}`);
      break; // Success!
    }

    console.log(`Retry ${retry + 1}: Only placed ${result.placed}/${TOTAL_GAMES} games, trying again...`);
  }

  // Verify all games were placed
  const finalGameCount = weekSchedules.reduce((sum, w) => sum + w.games.length, 0);
  if (finalGameCount !== TOTAL_GAMES) {
    throw new Error(`Schedule generation failed: Only placed ${finalGameCount}/${TOTAL_GAMES} games after ${MAX_RETRIES} retries`);
  }

  // 6. Assign prime time slots
  const finalWeeks = assignPrimeTimeSlots(weekSchedules);

  // 7. Build team schedules
  const teamSchedules = buildTeamSchedules(finalWeeks, byeWeeks);

  // Final validation: every team must have exactly 17 games
  for (const [teamId, teamSchedule] of Object.entries(teamSchedules)) {
    if (teamSchedule.games.length !== GAMES_PER_TEAM) {
      console.error(`FINAL CHECK FAILED: ${teamId} has ${teamSchedule.games.length} games, expected ${GAMES_PER_TEAM}`);
      throw new Error(`Schedule build failed: ${teamId} has ${teamSchedule.games.length} games, expected ${GAMES_PER_TEAM}`);
    }
  }
  console.log(`Schedule validation passed: all 32 teams have ${GAMES_PER_TEAM} games`);

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
    // Check total games
    if (ts.games.length !== GAMES_PER_TEAM) {
      errors.push(`${teamId}: Has ${ts.games.length} games, expected ${GAMES_PER_TEAM}`);
    }

    // Check division games (should be 6)
    if (ts.divisionGames !== 6) {
      warnings.push(`${teamId}: Has ${ts.divisionGames} division games, expected 6`);
    }

    // Check rotating games (should be 4)
    if (ts.rotatingGames !== 4) {
      warnings.push(`${teamId}: Has ${ts.rotatingGames} rotating games, expected 4`);
    }

    // Check conference games (should be 2)
    if (ts.conferenceGames !== 2) {
      warnings.push(`${teamId}: Has ${ts.conferenceGames} conference games, expected 2`);
    }

    // Check inter-conference games (should be 5: 4 rotating + 1 17th game)
    if (ts.interConferenceGames !== 5) {
      warnings.push(`${teamId}: Has ${ts.interConferenceGames} inter-conference games, expected 5`);
    }

    // Check bye week range
    if (ts.byeWeek < BYE_WEEK_START || ts.byeWeek > BYE_WEEK_END) {
      errors.push(`${teamId}: Bye week ${ts.byeWeek} outside allowed range`);
    }

    // Check home/away balance (should be 8-9 or 9-8)
    if (ts.homeGames < 8 || ts.homeGames > 9) {
      warnings.push(`${teamId}: Unbalanced home/away (${ts.homeGames}H/${ts.awayGames}A), expected 8-9`);
    }
  });

  // Check total games
  const totalGames = schedule.weeks.reduce((sum, w) => sum + w.games.length, 0);
  const expectedGames = (32 * 17) / 2; // 272
  if (totalGames !== expectedGames) {
    errors.push(`Total games: ${totalGames}, expected ${expectedGames}`);
  }

  // CRITICAL: Check no team plays twice in same week
  for (const week of schedule.weeks) {
    const teamsThisWeek = new Set<string>();
    for (const game of week.games) {
      if (teamsThisWeek.has(game.awayTeamId)) {
        errors.push(`Week ${week.week}: ${game.awayTeamId} plays multiple games (away in ${game.awayTeamId}@${game.homeTeamId})`);
      }
      if (teamsThisWeek.has(game.homeTeamId)) {
        errors.push(`Week ${week.week}: ${game.homeTeamId} plays multiple games (home in ${game.awayTeamId}@${game.homeTeamId})`);
      }
      teamsThisWeek.add(game.awayTeamId);
      teamsThisWeek.add(game.homeTeamId);
    }

    // Also check bye teams don't play
    for (const game of week.games) {
      if (week.byeTeams.includes(game.awayTeamId)) {
        errors.push(`Week ${week.week}: ${game.awayTeamId} plays but is on bye`);
      }
      if (week.byeTeams.includes(game.homeTeamId)) {
        errors.push(`Week ${week.week}: ${game.homeTeamId} plays but is on bye`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

