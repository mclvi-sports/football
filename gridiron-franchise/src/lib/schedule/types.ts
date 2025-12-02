/**
 * Schedule System Types
 *
 * Types for NFL-style schedule generation following FINAL-season-calendar-system.md
 */

// ============================================================================
// TIME & GAME SLOTS
// ============================================================================

export type TimeSlot = 'early' | 'late' | 'sunday_night' | 'monday_night' | 'thursday_night';
export type GameType = 'division' | 'conference' | 'inter_conference' | 'rotating';
export type GameDay = 'thursday' | 'sunday' | 'monday';

// ============================================================================
// SCHEDULED GAME
// ============================================================================

export interface ScheduledGame {
  id: string; // e.g., "WK1-BOS-PHI"
  week: number; // 1-18
  awayTeamId: string;
  homeTeamId: string;
  timeSlot: TimeSlot;
  gameType: GameType;
  isPrimeTime: boolean;
  dayOfWeek: GameDay;
}

// ============================================================================
// TEAM SCHEDULE
// ============================================================================

export interface TeamSchedule {
  teamId: string;
  games: ScheduledGame[];
  byeWeek: number;
  homeGames: number;
  awayGames: number;
  primeTimeGames: number;
  divisionGames: number;
  conferenceGames: number;
  interConferenceGames: number;
  rotatingGames: number;
}

// ============================================================================
// WEEK SCHEDULE
// ============================================================================

export interface WeekSchedule {
  week: number;
  games: ScheduledGame[];
  byeTeams: string[];
  thursdayGame: ScheduledGame | null;
  sundayNightGame: ScheduledGame | null;
  mondayNightGame: ScheduledGame | null;
  earlyGames: ScheduledGame[];
  lateGames: ScheduledGame[];
}

// ============================================================================
// LEAGUE SCHEDULE
// ============================================================================

export interface LeagueSchedule {
  season: number;
  weeks: WeekSchedule[];
  teamSchedules: Record<string, TeamSchedule>;
  generatedAt: string;
}

// ============================================================================
// STANDINGS (for schedule generation input)
// ============================================================================

export interface TeamStanding {
  teamId: string;
  divisionPlace: 1 | 2 | 3 | 4;
  conference: string;
  division: string;
}

// ============================================================================
// MATCHUP
// ============================================================================

export interface Matchup {
  opponentId: string;
  gameType: GameType;
  isHome: boolean;
}

// ============================================================================
// DIVISION INFO
// ============================================================================

export interface DivisionInfo {
  conference: 'Atlantic' | 'Pacific';
  division: string;
  teams: string[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface ScheduleGeneratorConfig {
  season: number;
  randomizeStandings: boolean;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface ScheduleStats {
  totalGames: number;
  gamesPerTeam: number;
  primeTimeGames: {
    thursday: number;
    sundayNight: number;
    mondayNight: number;
    total: number;
  };
  byeWeekDistribution: Record<number, number>;
  homeAwayBalance: {
    balanced: number;
    avgHomeGames: number;
    avgAwayGames: number;
  };
  gameTypeBreakdown: {
    division: number;
    conference: number;
    interConference: number;
    rotating: number;
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ScheduleValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
