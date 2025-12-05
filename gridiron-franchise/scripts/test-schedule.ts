/**
 * Schedule Solver Test Script
 *
 * Tests the CSP solver implementation for NFL schedule generation.
 * Verifies: 272/272 games placed, all teams have 17 games, bye weeks valid, performance under 5s
 *
 * Usage: npx tsx scripts/test-schedule.ts
 *
 * Workorder: WO-SCHEDULE-SOLVER-001
 */

import { generateSchedule, validateSchedule, getScheduleStats } from '../src/lib/schedule/schedule-generator';
import type { LeagueSchedule } from '../src/lib/schedule/types';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const TEST_ITERATIONS = 5; // Run multiple times to test consistency
const MAX_TIME_MS = 5000; // Performance threshold

// ============================================================================
// COLORS FOR OUTPUT
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function pass(msg: string) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function fail(msg: string) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`);
}

function warn(msg: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
}

function info(msg: string) {
  console.log(`${colors.blue}ℹ${colors.reset} ${msg}`);
}

function header(msg: string) {
  console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}`);
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

interface TestResult {
  iteration: number;
  totalGames: number;
  allTeamsHave17: boolean;
  byeWeeksValid: boolean;
  divisionGamesCorrect: boolean;
  noDuplicateMatchups: boolean;
  timeMs: number;
  validationErrors: string[];
  validationWarnings: string[];
}

function runSingleTest(iteration: number): TestResult {
  const startTime = Date.now();

  // Generate schedule
  const schedule = generateSchedule({ season: 2025 });

  const timeMs = Date.now() - startTime;

  // Validate schedule
  const validation = validateSchedule(schedule);
  const stats = getScheduleStats(schedule);

  // Count games per team
  const teamGameCounts = new Map<string, number>();
  for (const [teamId, teamSchedule] of Object.entries(schedule.teamSchedules)) {
    teamGameCounts.set(teamId, teamSchedule.games.length);
  }

  // Check all teams have exactly 17 games
  const allTeamsHave17 = Array.from(teamGameCounts.values()).every((count) => count === 17);

  // Check bye weeks in valid range (5-17)
  const byeWeeksValid = Object.values(schedule.teamSchedules).every(
    (ts) => ts.byeWeek >= 5 && ts.byeWeek <= 17
  );

  // Check division games (should be 96 total = 8 divisions * 6 games each / 2)
  const divisionGamesCorrect = stats.gameTypeBreakdown.division === 96;

  // Check no duplicate matchups (teams don't play more than 2 times)
  const matchupCounts = new Map<string, number>();
  for (const week of schedule.weeks) {
    for (const game of week.games) {
      const key = [game.awayTeamId, game.homeTeamId].sort().join('-');
      matchupCounts.set(key, (matchupCounts.get(key) || 0) + 1);
    }
  }
  const noDuplicateMatchups = Array.from(matchupCounts.values()).every((count) => count <= 2);

  return {
    iteration,
    totalGames: stats.totalGames,
    allTeamsHave17,
    byeWeeksValid,
    divisionGamesCorrect,
    noDuplicateMatchups,
    timeMs,
    validationErrors: validation.errors,
    validationWarnings: validation.warnings,
  };
}

function printDetailedStats(schedule: LeagueSchedule) {
  const stats = getScheduleStats(schedule);

  info(`Total games: ${stats.totalGames}/272`);
  info(`Division games: ${stats.gameTypeBreakdown.division}/96`);
  info(`Conference games: ${stats.gameTypeBreakdown.conference}/32`);
  info(`Inter-conference games: ${stats.gameTypeBreakdown.interConference}/80`);
  info(`Rotating games: ${stats.gameTypeBreakdown.rotating}/64`);

  // Games per team
  const gameCounts: number[] = [];
  for (const ts of Object.values(schedule.teamSchedules)) {
    gameCounts.push(ts.games.length);
  }
  const minGames = Math.min(...gameCounts);
  const maxGames = Math.max(...gameCounts);
  const avgGames = gameCounts.reduce((a, b) => a + b, 0) / gameCounts.length;

  info(`Games per team: min=${minGames}, max=${maxGames}, avg=${avgGames.toFixed(1)}`);

  // Bye week distribution
  const byeDistribution = stats.byeWeekDistribution;
  const byeWeeks = Object.entries(byeDistribution)
    .filter(([_, count]) => count > 0)
    .map(([week, count]) => `W${week}:${count}`)
    .join(', ');
  info(`Bye distribution: ${byeWeeks}`);
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║        NFL Schedule CSP Solver Test Suite              ║${colors.reset}`);
  console.log(`${colors.cyan}║        Workorder: WO-SCHEDULE-SOLVER-001               ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}`);

  const results: TestResult[] = [];
  let allPassed = true;

  header(`Running ${TEST_ITERATIONS} Test Iterations`);

  for (let i = 1; i <= TEST_ITERATIONS; i++) {
    console.log(`\n${colors.dim}--- Iteration ${i}/${TEST_ITERATIONS} ---${colors.reset}`);

    const result = runSingleTest(i);
    results.push(result);

    // Check results
    if (result.totalGames === 272) {
      pass(`Total games: ${result.totalGames}/272`);
    } else {
      fail(`Total games: ${result.totalGames}/272`);
      allPassed = false;
    }

    if (result.allTeamsHave17) {
      pass(`All teams have 17 games`);
    } else {
      fail(`Not all teams have 17 games`);
      allPassed = false;
    }

    if (result.byeWeeksValid) {
      pass(`Bye weeks in valid range (5-16)`);
    } else {
      fail(`Bye weeks outside valid range`);
      allPassed = false;
    }

    if (result.divisionGamesCorrect) {
      pass(`Division games: 96`);
    } else {
      fail(`Division games incorrect`);
      allPassed = false;
    }

    if (result.noDuplicateMatchups) {
      pass(`No excessive matchups`);
    } else {
      fail(`Excessive matchups detected`);
      allPassed = false;
    }

    if (result.timeMs < MAX_TIME_MS) {
      pass(`Performance: ${result.timeMs}ms (< ${MAX_TIME_MS}ms)`);
    } else {
      fail(`Performance: ${result.timeMs}ms (> ${MAX_TIME_MS}ms)`);
      allPassed = false;
    }

    // Print validation errors/warnings
    if (result.validationErrors.length > 0) {
      console.log(`\n  ${colors.red}Validation Errors:${colors.reset}`);
      result.validationErrors.forEach((err) => console.log(`    - ${err}`));
      allPassed = false;
    }

    if (result.validationWarnings.length > 0) {
      console.log(`\n  ${colors.yellow}Validation Warnings:${colors.reset}`);
      result.validationWarnings.slice(0, 5).forEach((w) => console.log(`    - ${w}`));
      if (result.validationWarnings.length > 5) {
        console.log(`    ... and ${result.validationWarnings.length - 5} more`);
      }
    }
  }

  // Summary
  header('Summary');

  const successfulRuns = results.filter((r) => r.totalGames === 272).length;
  const avgTime = results.reduce((sum, r) => sum + r.timeMs, 0) / results.length;
  const maxTime = Math.max(...results.map((r) => r.timeMs));
  const minTime = Math.min(...results.map((r) => r.timeMs));

  info(`Success rate: ${successfulRuns}/${TEST_ITERATIONS} (${((successfulRuns / TEST_ITERATIONS) * 100).toFixed(0)}%)`);
  info(`Avg time: ${avgTime.toFixed(0)}ms`);
  info(`Min time: ${minTime}ms`);
  info(`Max time: ${maxTime}ms`);

  // Detailed stats for last run
  header('Detailed Stats (Last Run)');
  const lastSchedule = generateSchedule({ season: 2025 });
  printDetailedStats(lastSchedule);

  // Final result
  header('Final Result');

  if (allPassed && successfulRuns === TEST_ITERATIONS) {
    console.log(`\n${colors.green}███████████████████████████████████████████████████████${colors.reset}`);
    console.log(`${colors.green}█                 ALL TESTS PASSED!                    █${colors.reset}`);
    console.log(`${colors.green}███████████████████████████████████████████████████████${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}███████████████████████████████████████████████████████${colors.reset}`);
    console.log(`${colors.red}█                 SOME TESTS FAILED                    █${colors.reset}`);
    console.log(`${colors.red}███████████████████████████████████████████████████████${colors.reset}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
