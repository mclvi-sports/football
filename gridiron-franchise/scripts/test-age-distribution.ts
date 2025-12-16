import { generateTeamRoster } from '../src/lib/generators/roster-generator';
import { Tier } from '../src/lib/types';

const tiers = [Tier.Elite, Tier.Good, Tier.Average, Tier.BelowAverage, Tier.Rebuilding];
const teams = ['DAL', 'NYG', 'PHI', 'WAS', 'CHI', 'DET', 'GB', 'MIN'];

console.log('=== New Age Distribution Test ===\n');

const allAges: number[] = [];
const teamStats: { team: string; avgAge: number; min: number; max: number }[] = [];

teams.forEach((teamId, i) => {
  const tier = tiers[i % tiers.length];
  const roster = generateTeamRoster(teamId, tier);

  const ages = roster.players.map(p => p.age);
  const avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);

  allAges.push(...ages);
  teamStats.push({ team: teamId, avgAge: Math.round(avgAge * 10) / 10, min: minAge, max: maxAge });
});

console.log('Team-by-Team Results:');
console.log('─'.repeat(40));
teamStats.forEach(t => {
  console.log(`${t.team}: Avg ${t.avgAge} (range: ${t.min}-${t.max})`);
});

console.log('\n' + '─'.repeat(40));
console.log(`League Averages (${teams.length} teams, ${allAges.length} players):`);

const leagueAvg = allAges.reduce((a, b) => a + b, 0) / allAges.length;
console.log(`  Average Age: ${Math.round(leagueAvg * 10) / 10}`);
console.log(`  Min Age: ${Math.min(...allAges)}`);
console.log(`  Max Age: ${Math.max(...allAges)}`);

// Age bracket breakdown
const brackets = {
  '21-22 (Rookie)': allAges.filter(a => a >= 21 && a <= 22).length,
  '23-25 (Young)': allAges.filter(a => a >= 23 && a <= 25).length,
  '26-29 (Prime)': allAges.filter(a => a >= 26 && a <= 29).length,
  '30-33 (Veteran)': allAges.filter(a => a >= 30 && a <= 33).length,
  '34+ (Elder)': allAges.filter(a => a >= 34).length,
};

console.log('\nAge Bracket Distribution:');
Object.entries(brackets).forEach(([bracket, count]) => {
  const pct = Math.round(count / allAges.length * 100);
  console.log(`  ${bracket}: ${count} (${pct}%)`);
});
