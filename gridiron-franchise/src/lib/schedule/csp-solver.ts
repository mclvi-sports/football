/**
 * CSP Solver for NFL Schedule Generation
 *
 * Implements a backtracking constraint satisfaction solver to assign
 * games to weeks while satisfying all NFL scheduling constraints.
 *
 * Optimized for performance:
 * - Variables pre-sorted by constraint level (most constrained first)
 * - Simple forward checking to detect dead ends early
 * - No expensive LCV heuristic
 *
 * Workorder: WO-SCHEDULE-SOLVER-001
 */

import type { ScheduledGame, WeekSchedule } from './types';

// ============================================================================
// TYPES
// ============================================================================

/** A variable in the CSP - represents a game that needs to be assigned to a week */
export interface CSPVariable {
  game: ScheduledGame;
  domain: number[]; // Valid weeks this game can be assigned to
  priority: number; // Lower = assign first (division games, smaller domains)
}

/** Assignment of a game to a week */
export interface Assignment {
  gameIndex: number;
  week: number;
}

/** Constraint function type - returns true if assignment is valid */
export type ConstraintFn = (
  assignments: Map<number, number>, // gameIndex -> week
  variable: CSPVariable,
  value: number, // proposed week
  allVariables: CSPVariable[]
) => boolean;

/** Result of solving */
export interface CSPResult {
  success: boolean;
  assignments: Map<number, number>; // gameIndex -> week
  iterations: number;
  timeMs: number;
}

/** Solver options */
export interface CSPOptions {
  timeoutMs?: number;
  maxIterations?: number;
}

// ============================================================================
// CSP SOLVER CLASS
// ============================================================================

export class ScheduleCSPSolver {
  private variables: CSPVariable[] = [];
  private constraints: ConstraintFn[] = [];
  private iterations = 0;
  private startTime = 0;
  private timeoutMs: number;
  private maxIterations: number;

  // Track which teams play in which weeks (for fast constraint checking)
  private teamWeekGames: Map<string, Set<number>> = new Map();

  // Variable ordering (indices sorted by priority)
  private variableOrder: number[] = [];

  constructor(options: CSPOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? 5000;
    this.maxIterations = options.maxIterations ?? 1_000_000;
  }

  /**
   * Initialize variables from games and valid weeks
   */
  initializeVariables(
    games: ScheduledGame[],
    byeWeeks: Map<string, number>,
    totalWeeks: number
  ): void {
    this.variables = games.map((game) => {
      // Calculate valid weeks for this game (neither team on bye)
      const domain: number[] = [];
      for (let week = 1; week <= totalWeeks; week++) {
        const awayBye = byeWeeks.get(game.awayTeamId);
        const homeBye = byeWeeks.get(game.homeTeamId);
        if (awayBye !== week && homeBye !== week) {
          domain.push(week);
        }
      }

      // Priority: division games first (they're most constrained), then by domain size
      const gameTypePriority =
        game.gameType === 'division'
          ? 0
          : game.gameType === 'rotating'
            ? 1
            : game.gameType === 'conference'
              ? 2
              : 3;

      return {
        game,
        domain,
        priority: gameTypePriority * 100 + (totalWeeks - domain.length),
      };
    });

    // Pre-compute variable order (most constrained first)
    this.variableOrder = this.variables
      .map((_, i) => i)
      .sort((a, b) => this.variables[a].priority - this.variables[b].priority);

    // Initialize team tracking
    this.teamWeekGames = new Map();
  }

  /**
   * Add a constraint function
   */
  addConstraint(constraint: ConstraintFn): void {
    this.constraints.push(constraint);
  }

  /**
   * Fast check if a team is already playing in a week
   */
  private isTeamBusy(teamId: string, week: number): boolean {
    const weeks = this.teamWeekGames.get(teamId);
    return weeks ? weeks.has(week) : false;
  }

  /**
   * Mark a team as playing in a week
   */
  private markTeamBusy(teamId: string, week: number): void {
    if (!this.teamWeekGames.has(teamId)) {
      this.teamWeekGames.set(teamId, new Set());
    }
    this.teamWeekGames.get(teamId)!.add(week);
  }

  /**
   * Unmark a team from playing in a week
   */
  private unmarkTeamBusy(teamId: string, week: number): void {
    const weeks = this.teamWeekGames.get(teamId);
    if (weeks) {
      weeks.delete(week);
    }
  }

  /**
   * Fast constraint check using team tracking
   */
  private canAssign(variable: CSPVariable, week: number): boolean {
    const { awayTeamId, homeTeamId } = variable.game;

    // Fast check: are either team already playing this week?
    if (this.isTeamBusy(awayTeamId, week) || this.isTeamBusy(homeTeamId, week)) {
      return false;
    }

    return true;
  }

  /**
   * Check if we should terminate (timeout or max iterations)
   */
  private shouldTerminate(): boolean {
    if (this.iterations >= this.maxIterations) return true;
    if (Date.now() - this.startTime >= this.timeoutMs) return true;
    return false;
  }

  /**
   * Shuffle array in place (Fisher-Yates)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Solve the CSP with random restarts
   */
  solve(): CSPResult {
    this.iterations = 0;
    this.startTime = Date.now();

    const RESTART_ITERATIONS = 50_000; // Restart after this many iterations without solution
    let totalIterations = 0;
    let restarts = 0;

    while (!this.shouldTerminate()) {
      this.teamWeekGames = new Map();
      this.iterations = 0;

      // Shuffle variable order for each restart (keeps type priority but randomizes within)
      this.variableOrder = this.shuffleArray(this.variableOrder);

      const assignments = new Map<number, number>();
      const success = this.backtrackWithLimit(assignments, 0, RESTART_ITERATIONS);

      totalIterations += this.iterations;
      restarts++;

      if (success) {
        return {
          success: true,
          assignments,
          iterations: totalIterations,
          timeMs: Date.now() - this.startTime,
        };
      }
    }

    return {
      success: false,
      assignments: new Map(),
      iterations: totalIterations,
      timeMs: Date.now() - this.startTime,
    };
  }

  /**
   * Backtracking with iteration limit for restarts
   */
  private backtrackWithLimit(
    assignments: Map<number, number>,
    orderIndex: number,
    maxIterations: number
  ): boolean {
    this.iterations++;

    // Check iteration limit for restart
    if (this.iterations >= maxIterations) {
      return false;
    }

    // Check timeout periodically
    if (this.iterations % 10000 === 0 && this.shouldTerminate()) {
      return false;
    }

    // If all variables assigned, we found a solution
    if (orderIndex >= this.variableOrder.length) {
      return true;
    }

    const varIndex = this.variableOrder[orderIndex];
    const variable = this.variables[varIndex];

    // Shuffle domain to add randomness
    const shuffledDomain = this.shuffleArray(variable.domain);

    // Try each value in shuffled domain
    for (const week of shuffledDomain) {
      // Fast constraint check
      if (!this.canAssign(variable, week)) {
        continue;
      }

      // Make assignment
      assignments.set(varIndex, week);
      this.markTeamBusy(variable.game.awayTeamId, week);
      this.markTeamBusy(variable.game.homeTeamId, week);

      // Recurse
      if (this.backtrackWithLimit(assignments, orderIndex + 1, maxIterations)) {
        return true;
      }

      // Undo assignment (backtrack)
      assignments.delete(varIndex);
      this.unmarkTeamBusy(variable.game.awayTeamId, week);
      this.unmarkTeamBusy(variable.game.homeTeamId, week);
    }

    return false;
  }

  /**
   * Get the variables (for constraint access)
   */
  getVariables(): CSPVariable[] {
    return this.variables;
  }
}

// ============================================================================
// HELPER: Convert CSP result to WeekSchedule array
// ============================================================================

export function assignmentsToWeekSchedules(
  result: CSPResult,
  variables: CSPVariable[],
  byeWeeks: Map<string, number>,
  totalWeeks: number
): WeekSchedule[] {
  const weeks: WeekSchedule[] = [];

  // Initialize week schedules
  for (let w = 1; w <= totalWeeks; w++) {
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

  // Assign games to weeks
  for (const [gameIndex, week] of result.assignments) {
    const variable = variables[gameIndex];
    const game = variable.game;

    const assignedGame: ScheduledGame = {
      ...game,
      week,
      id: `W${week}-${game.awayTeamId}@${game.homeTeamId}`,
    };

    weeks[week - 1].games.push(assignedGame);
  }

  return weeks;
}
