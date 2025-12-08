/**
 * Test that depth chart changes are reflected in game simulation
 *
 * Uses generateFullGame() to create real game data, then:
 * 1. Picks two teams from the generated data
 * 2. Records original RB1
 * 3. Swaps RB1 and RB2 in depth chart
 * 4. Runs simulation
 * 5. Verifies the new RB1 gets more carries
 */

import { Position } from '../src/lib/types';
import { generateFullGame, TeamRosterData } from '../src/lib/generators/full-game-generator';
import { getStarter, adaptTeamRoster } from '../src/lib/sim/team-adapter';
import { Simulator } from '../src/lib/sim/simulator';

console.log('=== Depth Chart Simulation Test ===\n');

// Generate full game data (like the dev tools route does)
console.log('Generating full game data...');
const fullGameData = generateFullGame();
console.log(`Generated ${fullGameData.teams.length} teams, ${fullGameData.totalPlayers} total players\n`);

// Pick two teams for test (use valid team IDs)
const homeTeamData = fullGameData.teams.find(t => t.team.id === 'DAL')!;
const awayTeamData = fullGameData.teams.find(t => t.team.id === 'CHI')!;

console.log(`Home: ${homeTeamData.team.city} ${homeTeamData.team.name} (${homeTeamData.tier})`);
console.log(`Away: ${awayTeamData.team.city} ${awayTeamData.team.name} (${awayTeamData.tier})\n`);

// Get original RB depth chart
const originalRB1Id = homeTeamData.roster.depthChart[Position.RB][0];
const originalRB2Id = homeTeamData.roster.depthChart[Position.RB][1];

const originalRB1 = homeTeamData.roster.players.find(p => p.id === originalRB1Id)!;
const originalRB2 = homeTeamData.roster.players.find(p => p.id === originalRB2Id)!;

console.log('BEFORE SWAP:');
console.log(`  RB1: ${originalRB1.firstName} ${originalRB1.lastName} (OVR: ${originalRB1.overall})`);
console.log(`  RB2: ${originalRB2.firstName} ${originalRB2.lastName} (OVR: ${originalRB2.overall})`);

// Verify getStarter returns RB1
const starterBefore = getStarter(
  homeTeamData.roster.players,
  homeTeamData.roster.depthChart,
  Position.RB,
  0
);
console.log(`  getStarter(RB, 0) returns: ${starterBefore?.firstName} ${starterBefore?.lastName}`);

// SWAP: Move RB2 to RB1 position
console.log('\n--- SWAPPING RB1 AND RB2 ---\n');

// Keep remaining RBs in order
const remainingRBs = homeTeamData.roster.depthChart[Position.RB].slice(2);
homeTeamData.roster.depthChart[Position.RB] = [originalRB2Id, originalRB1Id, ...remainingRBs];

// Verify swap worked
const starterAfter = getStarter(
  homeTeamData.roster.players,
  homeTeamData.roster.depthChart,
  Position.RB,
  0
);
console.log('AFTER SWAP:');
console.log(`  New RB1: ${originalRB2.firstName} ${originalRB2.lastName} (was RB2)`);
console.log(`  New RB2: ${originalRB1.firstName} ${originalRB1.lastName} (was RB1)`);
console.log(`  getStarter(RB, 0) returns: ${starterAfter?.firstName} ${starterAfter?.lastName}`);

// Convert to SimTeam using proper adapter (extracts traits/badges)
console.log('\n--- CONVERTING TO SIM TEAMS ---\n');

// Need to cast because full-game-generator has its own TeamRosterData type
const homeSimTeam = adaptTeamRoster(homeTeamData as unknown as import('../src/lib/dev-player-store').TeamRosterData);
const awaySimTeam = adaptTeamRoster(awayTeamData as unknown as import('../src/lib/dev-player-store').TeamRosterData);

console.log(`Home team traits: ${homeSimTeam.traits.length}`);
console.log(`Home team badges: ${homeSimTeam.badges.length}`);

// Run simulation
console.log('\n--- RUNNING SIMULATION ---\n');

const sim = new Simulator();
sim.settings.home = homeSimTeam;
sim.settings.away = awaySimTeam;

sim.initializeGameModifiers();
const plays = sim.simulateGame();

// Debug: look at raw play structure (PlayResult has: type, result, yards, playerId)
console.log('SAMPLE PLAYS (first 5):');
plays.slice(0, 5).forEach((p, i) => {
  console.log(`  ${i+1}. ${p.type}: ${p.yards}yds - ${p.description?.slice(0, 50) || 'no desc'}`);
});

// Count rushing attempts by playerId
// PlayResult: { type: PlayType, result: PlayResultType, yards: number, playerId?: string }
const rushingStats: Record<string, { name: string; attempts: number; yards: number }> = {};

// Get all players from both teams for lookup
const allPlayers = [...homeTeamData.roster.players, ...awayTeamData.roster.players];

for (const play of plays) {
  if (play.type === 'run' && play.playerId) {
    const player = allPlayers.find(p => p.id === play.playerId);
    if (player) {
      if (!rushingStats[play.playerId]) {
        rushingStats[play.playerId] = {
          name: `${player.firstName} ${player.lastName}`,
          attempts: 0,
          yards: 0,
        };
      }
      rushingStats[play.playerId].attempts++;
      rushingStats[play.playerId].yards += play.yards;
    }
  }
}

// Count plays by type
const runPlays = plays.filter(p => p.type === 'run').length;
const passPlays = plays.filter(p => p.type === 'pass').length;
console.log(`\nPLAY DISTRIBUTION: ${runPlays} runs, ${passPlays} passes`);

// Show rushing stats
console.log('\nALL RUSHING STATS:');
Object.entries(rushingStats)
  .sort((a, b) => b[1].attempts - a[1].attempts)
  .slice(0, 6)
  .forEach(([id, stats]) => {
    const isNewRB1 = id === originalRB2Id;
    const isNewRB2 = id === originalRB1Id;
    const tag = isNewRB1 ? ' (NEW RB1 - DAL)' : isNewRB2 ? ' (NEW RB2 - DAL)' : '';
    console.log(`  ${stats.name}${tag}: ${stats.attempts} carries, ${stats.yards} yards`);
  });

// Verify RB1 got more carries than RB2
const newRB1Stats = rushingStats[originalRB2Id];
const newRB2Stats = rushingStats[originalRB1Id];

const newRB1Carries = newRB1Stats?.attempts || 0;
const newRB2Carries = newRB2Stats?.attempts || 0;

console.log('\n--- VERIFICATION ---');
console.log(`New RB1 (${originalRB2.firstName}) carries: ${newRB1Carries}`);
console.log(`New RB2 (${originalRB1.firstName}) carries: ${newRB2Carries}`);

if (newRB1Carries > newRB2Carries) {
  console.log('\n✅ SUCCESS: New RB1 got more carries than new RB2!');
  console.log('   Depth chart swap was correctly reflected in simulation.');
} else if (newRB1Carries === newRB2Carries && newRB1Carries > 0) {
  console.log('\n⚠️  INCONCLUSIVE: Both RBs got equal carries.');
  console.log('   This can happen with small sample size. Run again to verify.');
} else if (newRB1Carries === 0 && newRB2Carries === 0) {
  console.log('\n⚠️  NO DATA: Cowboys had no rushing plays.');
  console.log('   This is unusual - check simulation logic.');
} else {
  console.log('\n❌ FAILURE: New RB2 got more carries than new RB1!');
  console.log('   Depth chart may not be properly used in simulation.');
}

// Show final score for context
console.log(`\nFinal Score: ${homeTeamData.team.id} ${sim.state.homeScore} - ${awayTeamData.team.id} ${sim.state.awayScore}`);
console.log(`Total plays: ${plays.length}`);
