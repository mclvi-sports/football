/**
 * Test Schedule Generation
 */

import { generateSchedule, validateSchedule, getScheduleStats } from "../src/lib/schedule/schedule-generator";

console.log("=== Testing Schedule Generation ===\n");

const startTime = Date.now();

try {
  const schedule = generateSchedule({
    season: 2025,
    randomizeStandings: true,
  });

  const elapsed = Date.now() - startTime;
  console.log("Schedule generated in " + elapsed + "ms");

  const stats = getScheduleStats(schedule);
  const validation = validateSchedule(schedule);

  console.log("\nTotal games: " + stats.totalGames);
  console.log("Games per team: " + stats.gamesPerTeam);
  console.log("Prime time games: " + stats.primeTimeGames.total);
  console.log("\nValidation: " + (validation.valid ? "PASSED" : "FAILED"));

  if (!validation.valid) {
    console.log("Errors:", validation.errors);
  }

  if (validation.warnings.length > 0) {
    console.log("Warnings: " + validation.warnings.length);
  }

  console.log("\n=== Schedule Generation Test Complete ===");
} catch (error) {
  console.error("Schedule generation failed:", error);
  process.exit(1);
}
