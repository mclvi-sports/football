/**
 * Test script for game-runner.ts
 *
 * Run with: npx ts-node --esm scripts/test-game-runner.ts
 * Or: npx tsx scripts/test-game-runner.ts
 */

import { Tier, Position } from '../src/lib/types';
import { TeamRosterData } from '../src/lib/dev-player-store';
import { generateTeamRoster } from '../src/lib/generators/roster-generator';
import { LEAGUE_TEAMS } from '../src/lib/data/teams';
import { simulateGameWithRosters, getGameLeaders } from '../src/lib/sim';

/**
 * Build TeamRosterData from generated roster
 */
function buildTeamRosterData(teamId: string, tier: Tier): TeamRosterData {
  const teamInfo = LEAGUE_TEAMS.find((t) => t.id === teamId);
  if (!teamInfo) {
    throw new Error(`Team ${teamId} not found`);
  }

  const roster = generateTeamRoster(teamId, tier);

  // Calculate stats
  const avgOvr =
    roster.players.reduce((sum, p) => sum + p.overall, 0) / roster.players.length;
  const avgAge =
    roster.players.reduce((sum, p) => sum + p.age, 0) / roster.players.length;

  return {
    team: {
      id: teamInfo.id,
      city: teamInfo.city,
      name: teamInfo.name,
      conference: teamInfo.conference,
      division: teamInfo.division,
    },
    tier,
    roster,
    stats: {
      totalPlayers: roster.players.length,
      avgOvr: Math.round(avgOvr * 10) / 10,
      avgAge: Math.round(avgAge * 10) / 10,
    },
  };
}

// Run test
console.log('='.repeat(60));
console.log('GAME RUNNER TEST');
console.log('='.repeat(60));

// Create two teams
console.log('\nGenerating teams...');
const awayTeam = buildTeamRosterData('BOS', Tier.Good);
const homeTeam = buildTeamRosterData('NYE', Tier.Elite);

console.log(`Away: ${awayTeam.team.city} ${awayTeam.team.name} (${awayTeam.tier})`);
console.log(`  Players: ${awayTeam.stats.totalPlayers}, Avg OVR: ${awayTeam.stats.avgOvr}`);
console.log(`Home: ${homeTeam.team.city} ${homeTeam.team.name} (${homeTeam.tier})`);
console.log(`  Players: ${homeTeam.stats.totalPlayers}, Avg OVR: ${homeTeam.stats.avgOvr}`);

// Run simulation
console.log('\nSimulating game...');
const result = simulateGameWithRosters(awayTeam, homeTeam, {
  gameType: 'regular',
  weather: 'clear',
  homeAdvantage: 'normal',
});

// Print results
console.log('\n' + '='.repeat(60));
console.log('FINAL SCORE');
console.log('='.repeat(60));
console.log(
  `${result.awayTeam.abbrev} ${result.awayScore} - ${result.homeTeam.abbrev} ${result.homeScore}`
);

console.log('\n--- TEAM STATS ---');
console.log(`\n${result.awayTeam.abbrev}:`);
console.log(`  Total Yards: ${result.teamStats.away.yards}`);
console.log(`  Pass Yards: ${result.teamStats.away.passYards}`);
console.log(`  Rush Yards: ${result.teamStats.away.rushYards}`);
console.log(`  Pass: ${result.teamStats.away.completions}/${result.teamStats.away.attempts}`);
console.log(`  First Downs: ${result.teamStats.away.firstDowns}`);

console.log(`\n${result.homeTeam.abbrev}:`);
console.log(`  Total Yards: ${result.teamStats.home.yards}`);
console.log(`  Pass Yards: ${result.teamStats.home.passYards}`);
console.log(`  Rush Yards: ${result.teamStats.home.rushYards}`);
console.log(`  Pass: ${result.teamStats.home.completions}/${result.teamStats.home.attempts}`);
console.log(`  First Downs: ${result.teamStats.home.firstDowns}`);

// Game leaders
console.log('\n--- GAME LEADERS ---');
const leaders = getGameLeaders(result);

if (leaders.passing) {
  console.log(
    `Passing: ${leaders.passing.playerName} - ${leaders.passing.passing.completions}/${leaders.passing.passing.attempts}, ${leaders.passing.passing.yards} yds, ${leaders.passing.passing.touchdowns} TD`
  );
}
if (leaders.rushing) {
  console.log(
    `Rushing: ${leaders.rushing.playerName} - ${leaders.rushing.rushing.carries} car, ${leaders.rushing.rushing.yards} yds, ${leaders.rushing.rushing.touchdowns} TD`
  );
}
if (leaders.receiving) {
  console.log(
    `Receiving: ${leaders.receiving.playerName} - ${leaders.receiving.receiving.catches} rec, ${leaders.receiving.receiving.yards} yds, ${leaders.receiving.receiving.touchdowns} TD`
  );
}
if (leaders.tackles) {
  console.log(
    `Tackles: ${leaders.tackles.playerName} - ${leaders.tackles.defense.tackles} tackles`
  );
}

console.log(`\nTotal Plays: ${result.totalPlays}`);
console.log(`Player Stats Tracked: ${result.playerStats.length}`);

console.log('\n' + '='.repeat(60));
console.log('TEST COMPLETE');
console.log('='.repeat(60));
