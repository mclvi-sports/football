/**
 * Test Full Season Simulation
 *
 * Simulates an entire 18-week season to identify problematic games.
 * Run with: npx tsx scripts/test-full-season-sim.ts
 */

import { generateAllTeamRosters } from '../src/lib/generators/full-game-generator';
import { TeamRosterData } from '../src/lib/dev-player-store';
import { generateSchedule } from '../src/lib/schedule';
import { simulateGameWithRosters } from '../src/lib/sim/game-runner';

interface GameResult {
  week: number;
  awayTeamId: string;
  homeTeamId: string;
  awayScore: number;
  homeScore: number;
  elapsed: number;
  plays: number;
}

interface FailedGame {
  week: number;
  awayTeamId: string;
  homeTeamId: string;
  error: string;
}

async function testFullSeasonSim() {
  console.log('='.repeat(60));
  console.log('FULL SEASON SIMULATION TEST');
  console.log('='.repeat(60));
  console.log('');

  // Step 1: Generate league data
  console.log('Step 1: Generating league data...');
  const startGen = Date.now();
  const { teams: allTeams } = generateAllTeamRosters();

  if (!allTeams || allTeams.length === 0) {
    console.error('ERROR: Failed to generate league data');
    process.exit(1);
  }

  // Create a map for quick lookup
  const teamMap = new Map<string, TeamRosterData>();
  for (const team of allTeams) {
    teamMap.set(team.team.id, team);
  }

  console.log(`  Generated ${allTeams.length} teams in ${Date.now() - startGen}ms`);
  console.log('');

  // Step 2: Generate schedule
  console.log('Step 2: Generating schedule...');
  const startSched = Date.now();
  const schedule = generateSchedule({ season: 2025, randomizeStandings: true });

  if (!schedule || !schedule.weeks || schedule.weeks.length === 0) {
    console.error('ERROR: Failed to generate schedule');
    process.exit(1);
  }
  console.log(`  Generated ${schedule.weeks.length} weeks in ${Date.now() - startSched}ms`);
  console.log('');

  // Step 3: Simulate each week
  const results: GameResult[] = [];
  const failedGames: FailedGame[] = [];
  const slowGames: GameResult[] = [];
  let totalGames = 0;
  let totalTime = 0;

  console.log('Step 3: Simulating season...');
  console.log('-'.repeat(60));

  for (let weekNum = 1; weekNum <= schedule.weeks.length; weekNum++) {
    const week = schedule.weeks[weekNum - 1];
    if (!week || !week.games) {
      console.warn(`  Week ${weekNum}: No games found, skipping`);
      continue;
    }

    const weekStart = Date.now();
    let weekGames = 0;
    let weekFailed = 0;

    console.log(`\nWeek ${weekNum} (${week.games.length} games):`);

    for (const game of week.games) {
      const awayTeam = teamMap.get(game.awayTeamId);
      const homeTeam = teamMap.get(game.homeTeamId);

      if (!awayTeam || !homeTeam) {
        failedGames.push({
          week: weekNum,
          awayTeamId: game.awayTeamId,
          homeTeamId: game.homeTeamId,
          error: `Missing team: ${!awayTeam ? game.awayTeamId : ''} ${!homeTeam ? game.homeTeamId : ''}`,
        });
        weekFailed++;
        continue;
      }

      try {
        const gameStart = Date.now();
        const result = simulateGameWithRosters(awayTeam, homeTeam, {
          gameType: game.isPrimeTime ? 'primetime' : 'regular',
        });
        const elapsed = Date.now() - gameStart;

        const gameResult: GameResult = {
          week: weekNum,
          awayTeamId: game.awayTeamId,
          homeTeamId: game.homeTeamId,
          awayScore: result.awayScore,
          homeScore: result.homeScore,
          elapsed,
          plays: result.totalPlays,
        };

        results.push(gameResult);
        totalGames++;
        totalTime += elapsed;

        // Track slow games (>500ms)
        if (elapsed > 500) {
          slowGames.push(gameResult);
          console.log(`  ⚠️  ${game.awayTeamId} @ ${game.homeTeamId}: ${result.awayScore}-${result.homeScore} (${elapsed}ms, ${result.totalPlays} plays) SLOW`);
        } else if (elapsed > 200) {
          console.log(`  ⏱️  ${game.awayTeamId} @ ${game.homeTeamId}: ${result.awayScore}-${result.homeScore} (${elapsed}ms, ${result.totalPlays} plays)`);
        }

        weekGames++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        failedGames.push({
          week: weekNum,
          awayTeamId: game.awayTeamId,
          homeTeamId: game.homeTeamId,
          error: errorMsg,
        });
        console.log(`  ❌ ${game.awayTeamId} @ ${game.homeTeamId}: FAILED - ${errorMsg}`);
        weekFailed++;
      }
    }

    const weekTime = Date.now() - weekStart;
    console.log(`  Week ${weekNum} complete: ${weekGames} games, ${weekFailed} failed, ${weekTime}ms total`);
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total games simulated: ${totalGames}`);
  console.log(`Total time: ${totalTime}ms (avg ${Math.round(totalTime / totalGames)}ms/game)`);
  console.log(`Failed games: ${failedGames.length}`);
  console.log(`Slow games (>500ms): ${slowGames.length}`);

  if (failedGames.length > 0) {
    console.log('');
    console.log('FAILED GAMES:');
    for (const fg of failedGames) {
      console.log(`  Week ${fg.week}: ${fg.awayTeamId} @ ${fg.homeTeamId} - ${fg.error}`);
    }
  }

  if (slowGames.length > 0) {
    console.log('');
    console.log('SLOW GAMES (>500ms):');
    for (const sg of slowGames) {
      console.log(`  Week ${sg.week}: ${sg.awayTeamId} @ ${sg.homeTeamId} - ${sg.elapsed}ms, ${sg.plays} plays`);
    }
  }

  // Check for high play counts (potential overtime/long games)
  const highPlayGames = results.filter(r => r.plays > 200);
  if (highPlayGames.length > 0) {
    console.log('');
    console.log('HIGH PLAY COUNT GAMES (>200 plays):');
    for (const hpg of highPlayGames) {
      console.log(`  Week ${hpg.week}: ${hpg.awayTeamId} @ ${hpg.homeTeamId} - ${hpg.plays} plays, ${hpg.awayScore}-${hpg.homeScore}`);
    }
  }

  // Stats distribution
  const playsCounts = results.map(r => r.plays);
  const minPlays = Math.min(...playsCounts);
  const maxPlays = Math.max(...playsCounts);
  const avgPlays = Math.round(playsCounts.reduce((a, b) => a + b, 0) / playsCounts.length);

  console.log('');
  console.log('PLAY COUNT STATS:');
  console.log(`  Min: ${minPlays}, Max: ${maxPlays}, Avg: ${avgPlays}`);

  // Week-by-week timing
  console.log('');
  console.log('WEEK TIMING:');
  for (let w = 1; w <= 18; w++) {
    const weekResults = results.filter(r => r.week === w);
    if (weekResults.length > 0) {
      const weekTotal = weekResults.reduce((a, r) => a + r.elapsed, 0);
      const weekFails = failedGames.filter(f => f.week === w).length;
      console.log(`  Week ${w.toString().padStart(2)}: ${weekResults.length} games, ${weekTotal}ms total${weekFails > 0 ? `, ${weekFails} failed` : ''}`);
    }
  }

  console.log('');
  console.log('Test complete!');

  // Exit with error code if there were failures
  if (failedGames.length > 0) {
    process.exit(1);
  }
}

testFullSeasonSim().catch((error) => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
