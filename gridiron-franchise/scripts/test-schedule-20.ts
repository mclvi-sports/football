/**
 * Quick 20-iteration stress test
 */
import { generateSchedule, getScheduleStats } from '../src/lib/schedule/schedule-generator';

const ITERATIONS = 20;
let retries = 0;
let successes = 0;
const times: number[] = [];

console.log(`Running ${ITERATIONS} iterations...`);

for (let i = 0; i < ITERATIONS; i++) {
  const start = Date.now();
  const schedule = generateSchedule({ season: 2025 });
  const elapsed = Date.now() - start;
  times.push(elapsed);

  const stats = getScheduleStats(schedule);
  if (stats.totalGames === 272) {
    successes++;
    process.stdout.write('.');
  } else {
    process.stdout.write('X');
    retries++;
  }
}

console.log('\n');
console.log(`Success: ${successes}/${ITERATIONS}`);
console.log(`Avg time: ${Math.round(times.reduce((a, b) => a + b, 0) / times.length)}ms`);
console.log(`Min: ${Math.min(...times)}ms, Max: ${Math.max(...times)}ms`);
