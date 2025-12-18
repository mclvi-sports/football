/**
 * Schedule Store
 *
 * SessionStorage-based persistence for generated schedules.
 *
 * OPTIMIZATION: To avoid exceeding sessionStorage quota, we store only the
 * minimal data (games array + metadata) and rebuild the full LeagueSchedule
 * on read. This reduces storage by ~80% since we don't store redundant
 * teamSchedules, thursdayGame, sundayNightGame, mondayNightGame, earlyGames,
 * lateGames views - they're all derived from the games array.
 */

import { LeagueSchedule, TeamSchedule, WeekSchedule, ScheduledGame } from './types';

const SCHEDULE_KEY = 'dev-generated-schedule';

/**
 * Minimal storage format - just games + metadata
 */
interface MinimalSchedule {
  season: number;
  generatedAt: string;
  games: ScheduledGame[];
  byeWeeks: Record<string, number>; // teamId -> byeWeek
}

/**
 * Convert full schedule to minimal storage format
 */
function toMinimal(schedule: LeagueSchedule): MinimalSchedule {
  // Extract all games from weeks (they're authoritative)
  const games: ScheduledGame[] = [];
  for (const week of schedule.weeks) {
    games.push(...week.games);
  }

  // Extract bye weeks from teamSchedules
  const byeWeeks: Record<string, number> = {};
  for (const [teamId, teamSched] of Object.entries(schedule.teamSchedules)) {
    byeWeeks[teamId] = teamSched.byeWeek;
  }

  return {
    season: schedule.season,
    generatedAt: schedule.generatedAt,
    games,
    byeWeeks,
  };
}

/**
 * Rebuild full schedule from minimal storage format
 */
function fromMinimal(minimal: MinimalSchedule): LeagueSchedule {
  // Group games by week
  const gamesByWeek: Map<number, ScheduledGame[]> = new Map();
  for (let w = 1; w <= 18; w++) {
    gamesByWeek.set(w, []);
  }
  for (const game of minimal.games) {
    const weekGames = gamesByWeek.get(game.week);
    if (weekGames) {
      weekGames.push(game);
    }
  }

  // Build WeekSchedule array
  const weeks: WeekSchedule[] = [];
  for (let w = 1; w <= 18; w++) {
    const weekGames = gamesByWeek.get(w) || [];
    const byeTeams = Object.entries(minimal.byeWeeks)
      .filter(([_, bye]) => bye === w)
      .map(([teamId]) => teamId);

    // Find prime time games
    const thursdayGame = weekGames.find(g => g.dayOfWeek === 'thursday') || null;
    const sundayNightGame = weekGames.find(g => g.timeSlot === 'sunday_night') || null;
    const mondayNightGame = weekGames.find(g => g.dayOfWeek === 'monday') || null;

    // Categorize Sunday games
    const earlyGames = weekGames.filter(g => g.timeSlot === 'early');
    const lateGames = weekGames.filter(g => g.timeSlot === 'late');

    weeks.push({
      week: w,
      games: weekGames,
      byeTeams,
      thursdayGame,
      sundayNightGame,
      mondayNightGame,
      earlyGames,
      lateGames,
    });
  }

  // Build TeamSchedule map
  const teamSchedules: Record<string, TeamSchedule> = {};

  // Get all unique team IDs from games
  const teamIds = new Set<string>();
  for (const game of minimal.games) {
    teamIds.add(game.homeTeamId);
    teamIds.add(game.awayTeamId);
  }

  for (const teamId of teamIds) {
    const teamGames = minimal.games.filter(
      g => g.homeTeamId === teamId || g.awayTeamId === teamId
    );

    let homeGames = 0;
    let awayGames = 0;
    let primeTimeGames = 0;
    let divisionGames = 0;
    let conferenceGames = 0;
    let interConferenceGames = 0;
    let rotatingGames = 0;

    for (const game of teamGames) {
      if (game.homeTeamId === teamId) {
        homeGames++;
      } else {
        awayGames++;
      }
      if (game.isPrimeTime) primeTimeGames++;

      switch (game.gameType) {
        case 'division': divisionGames++; break;
        case 'conference': conferenceGames++; break;
        case 'inter_conference': interConferenceGames++; break;
        case 'rotating': rotatingGames++; break;
      }
    }

    teamSchedules[teamId] = {
      teamId,
      games: teamGames,
      byeWeek: minimal.byeWeeks[teamId] || 0,
      homeGames,
      awayGames,
      primeTimeGames,
      divisionGames,
      conferenceGames,
      interConferenceGames,
      rotatingGames,
    };
  }

  return {
    season: minimal.season,
    weeks,
    teamSchedules,
    generatedAt: minimal.generatedAt,
  };
}

export function storeSchedule(schedule: LeagueSchedule): void {
  if (typeof window !== 'undefined') {
    // Store only minimal data to avoid quota issues
    const minimal = toMinimal(schedule);
    sessionStorage.setItem(SCHEDULE_KEY, JSON.stringify(minimal));
  }
}

export function getSchedule(): LeagueSchedule | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(SCHEDULE_KEY);
  if (!stored) return null;

  const parsed = JSON.parse(stored);

  // Check if it's the old format (has 'weeks' array) or new minimal format (has 'games' array)
  if ('games' in parsed && !('weeks' in parsed)) {
    // New minimal format - rebuild full schedule
    return fromMinimal(parsed as MinimalSchedule);
  }

  // Old format - return as-is (backward compatibility)
  return parsed as LeagueSchedule;
}

export function clearSchedule(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SCHEDULE_KEY);
  }
}

export function getTeamScheduleById(teamId: string): TeamSchedule | null {
  const schedule = getSchedule();
  if (!schedule) return null;
  return schedule.teamSchedules[teamId] || null;
}

export function getWeekScheduleByNumber(week: number): WeekSchedule | null {
  const schedule = getSchedule();
  if (!schedule || week < 1 || week > 18) return null;
  return schedule.weeks[week - 1] || null;
}
