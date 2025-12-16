/**
 * Verify career stats generation flow
 * Run with: npx tsx scripts/verify-career-stats-flow.ts
 */

import { generateAllTeamRosters } from '../src/lib/generators/full-game-generator';
import { generateCareerHistory } from '../src/lib/generators/career-stats-generator';

function verifyCareerStatsFlow() {
  console.log('\n=== CAREER STATS FLOW VERIFICATION ===\n');

  // Generate all team rosters
  console.log('Generating rosters...');
  const { teams } = generateAllTeamRosters();

  // Collect all players
  const allPlayers = teams.flatMap(t => t.roster.players);
  console.log(`Total players generated: ${allPlayers.length}`);

  // Count experience distribution
  const experienceDistribution: Record<number, number> = {};
  for (const player of allPlayers) {
    experienceDistribution[player.experience] = (experienceDistribution[player.experience] || 0) + 1;
  }

  console.log('\nExperience Distribution:');
  const sortedExp = Object.entries(experienceDistribution).sort((a, b) => Number(a[0]) - Number(b[0]));
  for (const [exp, count] of sortedExp) {
    console.log(`  ${exp} years: ${count} players (${(count/allPlayers.length*100).toFixed(1)}%)`);
  }

  // Count experienced players
  const experiencedPlayers = allPlayers.filter(p => p.experience > 0);
  console.log(`\nPlayers with experience > 0: ${experiencedPlayers.length} (${(experiencedPlayers.length/allPlayers.length*100).toFixed(1)}%)`);

  // Test career stats generation for a few players
  console.log('\n=== TESTING CAREER STATS GENERATION ===\n');

  // Pick 5 experienced players at random
  const samplePlayers = experiencedPlayers
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  for (const player of samplePlayers) {
    const teamData = teams.find(t => t.roster.players.some(p => p.id === player.id));
    const teamId = teamData?.team.id || 'UNKNOWN';

    const careerStats = generateCareerHistory(player, teamId);

    console.log(`Player: ${player.firstName} ${player.lastName} (${player.position})`);
    console.log(`  ID: ${player.id}`);
    console.log(`  Age: ${player.age}, Experience: ${player.experience}, OVR: ${player.overall}`);
    console.log(`  Team: ${teamId}`);

    if (careerStats) {
      console.log(`  Career Stats: ${careerStats.seasons.length} seasons`);
      // Show sample season stats
      const lastSeason = careerStats.seasons[careerStats.seasons.length - 1];
      if (lastSeason) {
        console.log(`    Last Season (${lastSeason.year}): ${lastSeason.gamesPlayed} games`);
        if (lastSeason.passing.attempts > 0) {
          console.log(`      Passing: ${lastSeason.passing.yards} yds, ${lastSeason.passing.touchdowns} TD`);
        }
        if (lastSeason.rushing.carries > 0) {
          console.log(`      Rushing: ${lastSeason.rushing.yards} yds, ${lastSeason.rushing.touchdowns} TD`);
        }
        if (lastSeason.receiving.targets > 0) {
          console.log(`      Receiving: ${lastSeason.receiving.yards} yds, ${lastSeason.receiving.touchdowns} TD`);
        }
        if (lastSeason.defense.tackles > 0) {
          console.log(`      Defense: ${lastSeason.defense.tackles} tkl, ${lastSeason.defense.sacks} sacks`);
        }
      }
    } else {
      console.log(`  Career Stats: NONE GENERATED`);
    }
    console.log('');
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Total players: ${allPlayers.length}`);
  console.log(`Experienced players (should get career stats): ${experiencedPlayers.length}`);
  console.log(`Rookie players (no career stats): ${allPlayers.length - experiencedPlayers.length}`);
}

verifyCareerStatsFlow();
