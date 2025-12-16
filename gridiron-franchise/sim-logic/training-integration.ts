/**
 * Training Integration Module
 * WO-TRAINING-SYSTEM-001 | INT-001, INT-002, INT-003
 *
 * Orchestrates training system with season simulator and player generator
 */

import { Player, Position, Team } from '../types';
import { GameResult, WeekSummary } from '../season/types';
import { PlayerGameStats } from '../sim/types';
import {
  // XP Calculator
  calculateGameXP,
  calculatePracticeXP,
  calculateByeWeekXP,
  calculateTrainingCampXP,
  calculateTotalTrainingCampXP,
  calculateOffseasonProgramXP,
  getExpectedParticipation,
  calculateAwardXP,
  // Progression
  calculateDevelopmentModifiers,
  calculateAgeProgression,
  calculateAIPlayerDevelopment,
  // Store
  getTrainingStore,
  initializeTeamTrainingState,
  saveTeamTrainingState,
  addPlayerXP,
  getTeamTrainingState,
  initializeAllTeams,
  advanceWeek,
  advanceAllTeamsWeek,
  startNewSeason,
  getPracticeFocus,
  createEmptyTrainingProgress,
  // Types
  PracticeFocusType,
  PracticeIntensity,
  DevelopmentModifiers,
  AwardType,
} from './index';

// =============================================================================
// TYPES
// =============================================================================

export interface GameXPAwardResult {
  playerId: string;
  playerName: string;
  xpEarned: number;
  breakdown: { source: string; amount: number }[];
}

export interface WeekXPSummary {
  week: number;
  season: number;
  teamId: string;
  gameXP: GameXPAwardResult[];
  practiceXP: { playerId: string; xpEarned: number }[];
  totalXPAwarded: number;
}

export interface TrainingCampSummary {
  teamId: string;
  season: number;
  players: { playerId: string; xpEarned: number; isRookie: boolean }[];
  totalXP: number;
}

// =============================================================================
// GAME XP INTEGRATION (INT-001)
// =============================================================================

/**
 * Award XP to players after a game
 */
export function awardGameXP(
  teamId: string,
  gameResult: GameResult,
  players: Player[],
  modifiers: DevelopmentModifiers,
  week: number,
  season: number
): GameXPAwardResult[] {
  const results: GameXPAwardResult[] = [];

  // Determine if team won
  const isHome = gameResult.homeTeamId === teamId;
  const won = isHome
    ? gameResult.homeScore > gameResult.awayScore
    : gameResult.awayScore > gameResult.homeScore;

  // Get player stats for this game
  const teamSide = isHome ? 'home' : 'away';
  const playerStats = gameResult.playerStats.filter(
    (ps) => ps.teamId === teamSide
  );

  for (const player of players) {
    // Find player's stats
    const stats = playerStats.find((ps) => ps.playerId === player.id);
    if (!stats) continue;

    // Calculate performance grade (0-100 based on stats)
    const performanceGrade = calculatePerformanceGrade(player, stats);

    // Calculate XP
    const xpResult = calculateGameXP(player, won, performanceGrade, modifiers);

    // Award XP
    if (xpResult.totalXP > 0) {
      addPlayerXP(
        teamId,
        player.id,
        xpResult.totalXP,
        'game',
        week,
        season,
        `Game vs ${isHome ? gameResult.awayTeamId : gameResult.homeTeamId} - ${won ? 'Win' : 'Loss'}`
      );

      results.push({
        playerId: player.id,
        playerName: `${player.firstName} ${player.lastName}`,
        xpEarned: xpResult.totalXP,
        breakdown: xpResult.breakdown,
      });
    }
  }

  return results;
}

/**
 * Calculate performance grade from game stats
 */
function calculatePerformanceGrade(player: Player, stats: PlayerGameStats): number {
  let grade = 60; // Base grade

  switch (player.position) {
    case Position.QB:
      // QB grading: completion %, yards, TDs, INTs
      if (stats.passing.attempts > 0) {
        const compPct = stats.passing.completions / stats.passing.attempts;
        grade += (compPct - 0.6) * 50; // +/- based on 60% baseline
        grade += stats.passing.touchdowns * 5;
        grade -= stats.passing.interceptions * 8;
        grade += stats.passing.yards / 50;
      }
      break;

    case Position.RB:
      // RB grading: YPC, yards, TDs
      if (stats.rushing.carries > 0) {
        const ypc = stats.rushing.yards / stats.rushing.carries;
        grade += (ypc - 4) * 8; // +/- based on 4 YPC baseline
        grade += stats.rushing.touchdowns * 8;
        grade += stats.rushing.yards / 25;
      }
      if (stats.receiving.catches > 0) {
        grade += stats.receiving.catches * 2;
        grade += stats.receiving.touchdowns * 5;
      }
      break;

    case Position.WR:
    case Position.TE:
      // WR/TE grading: catches, yards, TDs
      if (stats.receiving.targets > 0) {
        const catchRate = stats.receiving.catches / stats.receiving.targets;
        grade += (catchRate - 0.6) * 30;
        grade += stats.receiving.yards / 15;
        grade += stats.receiving.touchdowns * 8;
      }
      break;

    case Position.LT:
    case Position.LG:
    case Position.C:
    case Position.RG:
    case Position.RT:
      // OL grading: based on team rushing success, sacks allowed (estimated)
      grade = 70; // Base OL grade, would need more detailed stats
      break;

    case Position.DE:
    case Position.DT:
      // DL grading: sacks, tackles
      grade += stats.defense.sacks * 10;
      grade += stats.defense.tackles * 2;
      break;

    case Position.MLB:
    case Position.OLB:
      // LB grading: tackles, sacks, INTs
      grade += stats.defense.tackles * 1.5;
      grade += stats.defense.sacks * 8;
      grade += stats.defense.interceptions * 10;
      grade += stats.defense.passDeflections * 3;
      break;

    case Position.CB:
    case Position.FS:
    case Position.SS:
      // DB grading: INTs, pass deflections, tackles
      grade += stats.defense.interceptions * 12;
      grade += stats.defense.passDeflections * 4;
      grade += stats.defense.tackles * 1;
      break;

    case Position.K:
      // Kicker grading: FG%, extra points
      if (stats.kicking.fgAttempts > 0) {
        const fgPct = stats.kicking.fgMade / stats.kicking.fgAttempts;
        grade += (fgPct - 0.8) * 50;
      }
      break;

    case Position.P:
      // Punter grading: average, inside 20
      if (stats.kicking.punts > 0) {
        const avgPunt = stats.kicking.puntYards / stats.kicking.punts;
        grade += (avgPunt - 42) * 2;
      }
      break;
  }

  return Math.max(0, Math.min(100, Math.round(grade)));
}

// =============================================================================
// PRACTICE XP INTEGRATION (INT-001)
// =============================================================================

/**
 * Award weekly practice XP to all players on a team
 */
export function awardPracticeXP(
  teamId: string,
  players: Player[],
  facilities: { trainingRoom: number; weightRoom: number; practiceFacility: number },
  staff: { positionCoachOVR: number; coordinatorOVR: number },
  gmPerkBonus: number,
  week: number,
  season: number,
  isByeWeek: boolean = false
): { playerId: string; xpEarned: number }[] {
  const results: { playerId: string; xpEarned: number }[] = [];

  // Get team's current practice focus
  const practiceFocus = getPracticeFocus(teamId);
  const focus: PracticeFocusType = practiceFocus?.focus || 'conditioning';
  const intensity: PracticeIntensity = practiceFocus?.intensity || 'normal';

  // Calculate facility/staff bonuses
  const facilityBonus =
    (facilities.trainingRoom * 0.05) +
    (facilities.practiceFacility * 0.05);
  const staffBonus = staff.positionCoachOVR >= 80 ? 0.1 : staff.positionCoachOVR >= 70 ? 0.05 : 0;

  for (const player of players) {
    let xpResult;

    if (isByeWeek) {
      xpResult = calculateByeWeekXP(
        player,
        focus,
        intensity,
        facilityBonus,
        staffBonus,
        gmPerkBonus
      );
    } else {
      xpResult = calculatePracticeXP(
        player,
        focus,
        intensity,
        facilityBonus,
        staffBonus,
        gmPerkBonus
      );
    }

    if (xpResult.totalXP > 0) {
      addPlayerXP(
        teamId,
        player.id,
        xpResult.totalXP,
        isByeWeek ? 'bye_week' : 'practice',
        week,
        season,
        `${isByeWeek ? 'Bye Week' : 'Practice'} - ${focus} (${intensity})`
      );

      results.push({
        playerId: player.id,
        xpEarned: xpResult.totalXP,
      });
    }
  }

  return results;
}

// =============================================================================
// TRAINING CAMP INTEGRATION (INT-001)
// =============================================================================

/**
 * Run training camp for a team (offseason weeks 13-15)
 */
export function runTrainingCamp(
  teamId: string,
  players: Player[],
  rookieIds: string[],
  firstTimeStarterIds: string[],
  modifiers: DevelopmentModifiers,
  season: number
): TrainingCampSummary {
  const results: { playerId: string; xpEarned: number; isRookie: boolean }[] = [];

  for (const player of players) {
    const isRookie = rookieIds.includes(player.id);
    const isFirstTimeStarter = firstTimeStarterIds.includes(player.id);

    const totalXP = calculateTotalTrainingCampXP(
      player,
      modifiers,
      isRookie,
      isFirstTimeStarter
    );

    // Award XP for each training camp week
    for (const week of [13, 14, 15] as const) {
      const weekXP = calculateTrainingCampXP(
        player,
        week,
        modifiers,
        isRookie,
        isFirstTimeStarter
      );

      addPlayerXP(
        teamId,
        player.id,
        weekXP,
        'training_camp',
        week,
        season,
        `Training Camp Week ${week - 12}${isRookie ? ' (Rookie)' : ''}`
      );
    }

    results.push({
      playerId: player.id,
      xpEarned: totalXP,
      isRookie,
    });
  }

  return {
    teamId,
    season,
    players: results,
    totalXP: results.reduce((sum, r) => sum + r.xpEarned, 0),
  };
}

// =============================================================================
// OFFSEASON INTEGRATION (INT-002)
// =============================================================================

/**
 * Process offseason training program participation
 */
export function runOffseasonProgram(
  teamId: string,
  players: Player[],
  modifiers: DevelopmentModifiers,
  programWeeks: number,
  season: number
): { playerId: string; participation: string; xpEarned: number }[] {
  const results: { playerId: string; participation: string; xpEarned: number }[] = [];

  for (const player of players) {
    const participation = getExpectedParticipation(player);
    const xp = calculateOffseasonProgramXP(player, participation, programWeeks, modifiers);

    if (xp > 0) {
      addPlayerXP(
        teamId,
        player.id,
        xp,
        'offseason_program',
        0, // Offseason week
        season,
        `Offseason Program (${participation} participation)`
      );
    }

    results.push({
      playerId: player.id,
      participation,
      xpEarned: xp,
    });
  }

  return results;
}

/**
 * Award XP for end-of-season awards
 */
export function awardSeasonAwards(
  teamId: string,
  awards: { playerId: string; awardType: AwardType }[],
  week: number,
  season: number
): { playerId: string; awardType: string; xpEarned: number }[] {
  const results: { playerId: string; awardType: string; xpEarned: number }[] = [];

  for (const award of awards) {
    const xp = calculateAwardXP(award.awardType);

    addPlayerXP(
      teamId,
      award.playerId,
      xp,
      'award',
      week,
      season,
      `Award: ${award.awardType}`
    );

    results.push({
      playerId: award.playerId,
      awardType: award.awardType,
      xpEarned: xp,
    });
  }

  return results;
}

/**
 * Apply age-based progression to all players at end of season
 */
export function applyAgeProgression(
  teamId: string,
  players: Player[]
): { playerId: string; ovrChange: number }[] {
  const results: { playerId: string; ovrChange: number }[] = [];

  for (const player of players) {
    const progression = calculateAgeProgression(player);
    results.push({
      playerId: player.id,
      ovrChange: progression.ovrChange,
    });
  }

  return results;
}

// =============================================================================
// AI TEAM DEVELOPMENT (INT-002)
// =============================================================================

/**
 * Simulate AI team development for offseason
 */
export function simulateAITeamDevelopment(
  teamId: string,
  players: Player[],
  starterIds: string[],
  practiceSquadIds: string[],
  facilityModifier: number = 1.0
): { playerId: string; ovrChange: number }[] {
  const results: { playerId: string; ovrChange: number }[] = [];

  for (const player of players) {
    // Determine player role
    let role: 'starter' | 'backup' | 'practice_squad';
    if (practiceSquadIds.includes(player.id)) {
      role = 'practice_squad';
    } else if (starterIds.includes(player.id)) {
      role = 'starter';
    } else {
      role = 'backup';
    }

    const ovrChange = calculateAIPlayerDevelopment(player, role, facilityModifier);
    results.push({
      playerId: player.id,
      ovrChange,
    });
  }

  return results;
}

// =============================================================================
// WEEK PROCESSING (INT-001)
// =============================================================================

/**
 * Process a full week of training for the user's team
 */
export function processWeekTraining(
  teamId: string,
  players: Player[],
  gameResult: GameResult | null,
  modifiers: DevelopmentModifiers,
  facilities: { trainingRoom: number; weightRoom: number; practiceFacility: number },
  staff: { positionCoachOVR: number; coordinatorOVR: number },
  gmPerkBonus: number,
  week: number,
  season: number,
  isByeWeek: boolean = false
): WeekXPSummary {
  // Award game XP if there was a game
  let gameXP: GameXPAwardResult[] = [];
  if (gameResult) {
    gameXP = awardGameXP(teamId, gameResult, players, modifiers, week, season);
  }

  // Award practice XP
  const practiceXP = awardPracticeXP(
    teamId,
    players,
    facilities,
    staff,
    gmPerkBonus,
    week,
    season,
    isByeWeek
  );

  // Advance week in store
  advanceWeek(teamId);

  const totalXP =
    gameXP.reduce((sum, g) => sum + g.xpEarned, 0) +
    practiceXP.reduce((sum, p) => sum + p.xpEarned, 0);

  return {
    week,
    season,
    teamId,
    gameXP,
    practiceXP,
    totalXPAwarded: totalXP,
  };
}

// =============================================================================
// INITIALIZATION (INT-003)
// =============================================================================

/**
 * Initialize training for a new franchise
 */
export function initializeTrainingForFranchise(
  teams: { teamId: string; roster: Player[] }[],
  season: number = 1,
  week: number = 1
): void {
  const teamData = teams.map((t) => ({
    teamId: t.teamId,
    playerIds: t.roster.map((p) => p.id),
  }));

  initializeAllTeams(teamData, season, week);
}

/**
 * Initialize training for a single team (when user starts franchise)
 */
export function initializeTeamTraining(
  teamId: string,
  roster: Player[],
  season: number = 1,
  week: number = 1
): void {
  const playerIds = roster.map((p) => p.id);
  const state = initializeTeamTrainingState(teamId, playerIds, season, week);
  saveTeamTrainingState(state);
}

/**
 * Add a new player to training system (draft, free agency, trade)
 */
export function addPlayerToTraining(
  teamId: string,
  player: Player
): void {
  const teamState = getTeamTrainingState(teamId);
  if (!teamState) {
    console.error(`Team ${teamId} not found in training store`);
    return;
  }

  // Add empty training progress for the new player
  teamState.playerProgress[player.id] = createEmptyTrainingProgress(player.id);
  saveTeamTrainingState(teamState);
}

/**
 * Remove a player from training system (cut, trade)
 */
export function removePlayerFromTraining(
  teamId: string,
  playerId: string
): void {
  const teamState = getTeamTrainingState(teamId);
  if (!teamState) return;

  delete teamState.playerProgress[playerId];
  saveTeamTrainingState(teamState);
}
