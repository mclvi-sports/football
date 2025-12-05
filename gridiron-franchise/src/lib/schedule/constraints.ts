/**
 * NFL Schedule Constraints for CSP Solver
 *
 * Defines constraint functions that enforce NFL scheduling rules:
 * - Each team plays at most once per week
 * - Teams don't play during their bye week
 * - Week capacity limits (based on bye teams)
 * - Each team plays exactly 17 games
 *
 * Workorder: WO-SCHEDULE-SOLVER-001
 */

import type { ConstraintFn, CSPVariable } from './csp-solver';

// ============================================================================
// CONSTRAINT: Team plays at most once per week
// ============================================================================

/**
 * Ensures no team plays more than once in the same week.
 * Checks both the away and home team of the proposed game.
 */
export const teamPlaysOncePerWeek: ConstraintFn = (
  assignments,
  variable,
  proposedWeek,
  allVariables
) => {
  const { awayTeamId, homeTeamId } = variable.game;

  // Check all existing assignments for conflicts
  for (const [gameIndex, assignedWeek] of assignments) {
    if (assignedWeek !== proposedWeek) continue;

    const otherGame = allVariables[gameIndex].game;

    // Check if either team in our game is already playing this week
    if (
      otherGame.awayTeamId === awayTeamId ||
      otherGame.homeTeamId === awayTeamId ||
      otherGame.awayTeamId === homeTeamId ||
      otherGame.homeTeamId === homeTeamId
    ) {
      return false;
    }
  }

  return true;
};

// ============================================================================
// CONSTRAINT: No game during bye week
// ============================================================================

/**
 * Creates a constraint that ensures teams don't play during their bye week.
 * This is a factory function that captures the bye week map.
 */
export function createByeWeekConstraint(
  byeWeeks: Map<string, number>
): ConstraintFn {
  return (assignments, variable, proposedWeek) => {
    const { awayTeamId, homeTeamId } = variable.game;

    // Check if either team is on bye this week
    const awayBye = byeWeeks.get(awayTeamId);
    const homeBye = byeWeeks.get(homeTeamId);

    if (awayBye === proposedWeek || homeBye === proposedWeek) {
      return false;
    }

    return true;
  };
}

// ============================================================================
// CONSTRAINT: Week capacity
// ============================================================================

/**
 * Creates a constraint that limits the number of games per week.
 * Capacity = (32 - bye_teams_count) / 2
 */
export function createWeekCapacityConstraint(
  byeWeeks: Map<string, number>,
  totalTeams: number = 32
): ConstraintFn {
  // Pre-calculate capacity for each week
  const weekCapacity = new Map<number, number>();

  // Count bye teams per week
  const byeCountPerWeek = new Map<number, number>();
  for (const [_, week] of byeWeeks) {
    byeCountPerWeek.set(week, (byeCountPerWeek.get(week) || 0) + 1);
  }

  // Calculate max games per week
  for (let week = 1; week <= 18; week++) {
    const byeCount = byeCountPerWeek.get(week) || 0;
    const teamsPlaying = totalTeams - byeCount;
    const maxGames = Math.floor(teamsPlaying / 2);
    weekCapacity.set(week, maxGames);
  }

  return (assignments, variable, proposedWeek, allVariables) => {
    // Count games already assigned to this week
    let gamesInWeek = 0;
    for (const [_, assignedWeek] of assignments) {
      if (assignedWeek === proposedWeek) {
        gamesInWeek++;
      }
    }

    // Check if adding this game would exceed capacity
    const capacity = weekCapacity.get(proposedWeek) || 16;
    return gamesInWeek < capacity;
  };
}

// ============================================================================
// CONSTRAINT: Team total games (for final validation)
// ============================================================================

/**
 * This constraint is checked during final validation, not during search.
 * Ensures each team has exactly 17 games total.
 *
 * Note: During backtracking, we can't enforce exact counts since
 * not all games are assigned yet. This is used for result validation.
 */
export function validateTeamGameCounts(
  assignments: Map<number, number>,
  variables: CSPVariable[],
  expectedGames: number = 17
): { valid: boolean; errors: string[] } {
  const teamGameCounts = new Map<string, number>();

  for (const [gameIndex] of assignments) {
    const game = variables[gameIndex].game;
    teamGameCounts.set(game.awayTeamId, (teamGameCounts.get(game.awayTeamId) || 0) + 1);
    teamGameCounts.set(game.homeTeamId, (teamGameCounts.get(game.homeTeamId) || 0) + 1);
  }

  const errors: string[] = [];
  for (const [teamId, count] of teamGameCounts) {
    if (count !== expectedGames) {
      errors.push(`${teamId}: Has ${count} games, expected ${expectedGames}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// CONSTRAINT: No duplicate matchups (max 2 games between teams)
// ============================================================================

/**
 * Ensures no two teams play each other more than twice.
 * This should already be enforced by matchup generation, but we validate here.
 */
export function validateNoExcessiveMatchups(
  assignments: Map<number, number>,
  variables: CSPVariable[],
  maxMatchups: number = 2
): { valid: boolean; errors: string[] } {
  const matchupCounts = new Map<string, number>();

  for (const [gameIndex] of assignments) {
    const game = variables[gameIndex].game;
    const key = [game.awayTeamId, game.homeTeamId].sort().join('-');
    matchupCounts.set(key, (matchupCounts.get(key) || 0) + 1);
  }

  const errors: string[] = [];
  for (const [matchup, count] of matchupCounts) {
    if (count > maxMatchups) {
      errors.push(`${matchup}: ${count} games (max ${maxMatchups})`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// COMBINED CONSTRAINT FACTORY
// ============================================================================

/**
 * Creates all standard NFL schedule constraints.
 * Returns an array of constraint functions to add to the solver.
 */
export function createNFLConstraints(
  byeWeeks: Map<string, number>,
  totalTeams: number = 32
): ConstraintFn[] {
  return [
    teamPlaysOncePerWeek,
    createByeWeekConstraint(byeWeeks),
    createWeekCapacityConstraint(byeWeeks, totalTeams),
  ];
}
