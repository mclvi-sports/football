/**
 * Simulation Engine Types
 *
 * Types for the game simulation engine that integrates with roster data.
 * Integrates with schemes, coaching, and facilities modules.
 */

import { Player, Position, Tier } from '../types';
import {
  OffensiveScheme as SchemeOffensiveScheme,
  DefensiveScheme as SchemeDefensiveScheme,
} from '../schemes/types';
import { CoachingStaff } from '../coaching/types';
import { TeamFacilities } from '../facilities/types';

// ============================================================================
// GAME STATE
// ============================================================================

export interface SimState {
  quarter: number;
  clock: number; // seconds remaining in quarter
  possession: 'away' | 'home' | null;
  ball: number; // 0-100 yard line (0 = away endzone, 100 = home endzone)
  down: number;
  yardsToGo: number;
  awayScore: number;
  homeScore: number;
  isOver: boolean;
  isKickoff: boolean;
  isOvertime: boolean;
}

export interface SimStats {
  yards: number;
  passYards: number;
  rushYards: number;
  firstDowns: number;
  completions: number;
  attempts: number;
  passTDs: number;
  interceptions: number;
  carries: number;
  rushTDs: number;
  fumbles: number;
  sacks: number;
  penalties: number;
  timeOfPossession: number; // seconds
}

export interface PlayerGameStats {
  playerId: string;
  playerName: string;
  position: Position;
  teamId: string; // 'away' or 'home' - identifies which team the player belongs to
  passing: {
    attempts: number;
    completions: number;
    yards: number;
    touchdowns: number;
    interceptions: number;
    sacked: number;
  };
  rushing: {
    carries: number;
    yards: number;
    touchdowns: number;
    fumbles: number;
    long: number;
  };
  receiving: {
    targets: number;
    catches: number;
    yards: number;
    touchdowns: number;
    long: number;
  };
  defense: {
    tackles: number;
    sacks: number;
    interceptions: number;
    passDeflections: number;
    fumbleRecoveries: number;
  };
  kicking: {
    fgAttempts: number;
    fgMade: number;
    xpAttempts: number;
    xpMade: number;
    punts: number;
    puntYards: number;
  };
}

// ============================================================================
// PLAY RESULTS
// ============================================================================

export type PlayType = 'run' | 'pass' | 'punt' | 'fg' | 'kickoff' | 'td' | 'turnover' | 'penalty' | 'sack';

export type PlayResultType =
  | 'normal'
  | 'first_down'
  | 'touchdown'
  | 'turnover_downs'
  | 'incomplete'
  | 'interception'
  | 'fumble'
  | 'sack'
  | 'fg_made'
  | 'fg_missed'
  | 'touchback'
  | 'penalty';

export interface PlayResult {
  type: PlayType;
  result: PlayResultType;
  description: string;
  yards: number;
  time: number; // seconds elapsed
  playerId?: string; // primary player involved
  defenderId?: string; // defender involved (for sacks, INTs, etc.)
  debug?: string[];
}

// ============================================================================
// TEAM & GAME SETTINGS
// ============================================================================

export interface SimTeam {
  id: string;
  city: string;
  name: string;
  abbrev: string;
  tier: Tier;
  ovr: number;
  offense: {
    qb: number;
    rb: number;
    wr: number;
    te: number;
    ol: number;
  };
  defense: {
    dl: number;
    lb: number;
    db: number;
  };
  specialTeams: {
    k: number;
    p: number;
  };
  // Legacy scheme field (display name format)
  scheme: OffensiveScheme;
  // New scheme fields using schemes module types
  offensiveScheme?: SchemeOffensiveScheme;
  defensiveScheme?: SchemeDefensiveScheme;
  // Coaching and facilities integration
  coachingStaff?: CoachingStaff;
  facilities?: TeamFacilities;
  badges: SimBadge[];
  traits: SimTrait[];
  roster: Player[];
  depthChart: Record<string, string[]>; // position -> player IDs
}

export interface SimBadge {
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'hof';
  playerId: string;
}

export interface SimTrait {
  name: string;
  playerId: string;
  isNegative: boolean;
}

export type OffensiveScheme =
  | 'West Coast'
  | 'Air Raid'
  | 'Power Run'
  | 'Spread'
  | 'Pro Style'
  | 'Run Heavy';

export type DefensiveScheme = '4-3' | '3-4' | '4-2-5' | 'Cover 2' | 'Cover 3';

export type GameType = 'regular' | 'primetime' | 'playoff' | 'championship';
export type Weather = 'clear' | 'rain' | 'snow' | 'wind';
export type HomeAdvantage = 'normal' | 'loud' | 'dome' | 'neutral';

export interface GameSettings {
  gameType: GameType;
  weather: Weather;
  homeAdvantage: HomeAdvantage;
}

// ============================================================================
// SITUATION CONTEXT (for trait/badge checks)
// ============================================================================

export interface GameSituation {
  quarter: number;
  clock: number;
  down: number;
  yardsToGo: number;
  ballPosition: number; // 0-100
  teamScore: number;
  opponentScore: number;
  isClutch: boolean;
  isPlayoffs: boolean;
  isPrimeTime: boolean;
  isTrailing: boolean;
  isLeading: boolean;
  inRedZone: boolean;
  inGoalLine: boolean;
  possession: 'away' | 'home';
}

// ============================================================================
// MODIFIERS
// ============================================================================

export interface WeatherModifiers {
  passAccuracy: number;
  fumbleChance: number;
  fieldGoalAccuracy: number;
}

export const WEATHER_MODIFIERS: Record<Weather, WeatherModifiers> = {
  clear: { passAccuracy: 0, fumbleChance: 0, fieldGoalAccuracy: 0 },
  rain: { passAccuracy: -0.08, fumbleChance: 0.01, fieldGoalAccuracy: -0.10 },
  snow: { passAccuracy: -0.12, fumbleChance: 0.015, fieldGoalAccuracy: -0.15 },
  wind: { passAccuracy: -0.05, fumbleChance: 0, fieldGoalAccuracy: -0.20 },
};

export const HOME_ADVANTAGE_VALUES: Record<HomeAdvantage, number> = {
  normal: 3,
  loud: 5,
  dome: 2,
  neutral: 0,
};

export const BADGE_TIER_VALUES: Record<string, number> = {
  bronze: 2,
  silver: 4,
  gold: 6,
  hof: 10,
};

// ============================================================================
// POSITION WEIGHTS FOR OVR CALCULATION
// ============================================================================

export const OFFENSIVE_WEIGHTS: Record<string, number> = {
  QB: 0.20,
  RB: 0.08,
  WR1: 0.10,
  WR2: 0.06,
  WR3: 0.03,
  TE: 0.05,
  LT: 0.10,
  LG: 0.05,
  C: 0.05,
  RG: 0.05,
  RT: 0.08,
};

export const DEFENSIVE_WEIGHTS: Record<string, number> = {
  EDGE1: 0.12,
  EDGE2: 0.08,
  DT1: 0.08,
  DT2: 0.05,
  LB1: 0.10,
  LB2: 0.08,
  LB3: 0.05,
  CB1: 0.15,
  CB2: 0.10,
  S1: 0.10,
  S2: 0.08,
};
