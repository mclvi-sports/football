/**
 * Script to analyze the age distribution of generated players
 * Run with: npx tsx scripts/analyze-age-distribution.ts
 */

import { generatePlayer } from '../src/lib/generators/player-generator';
import { Position } from '../src/lib/types';

const SAMPLE_SIZE = 1000;

// Test age distribution for different slots
function analyzeAgeDistribution() {
  const results: Record<string, { ages: number[]; experiences: number[] }> = {
    'slot1': { ages: [], experiences: [] },
    'slot2': { ages: [], experiences: [] },
    'slot3': { ages: [], experiences: [] },
  };

  // Generate players for each slot type
  for (let i = 0; i < SAMPLE_SIZE; i++) {
    // Slot 1 (starter) - OVR 80
    const p1 = generatePlayer({ position: Position.QB, targetOvr: 80, slot: 1 });
    results.slot1.ages.push(p1.age);
    results.slot1.experiences.push(p1.experience);

    // Slot 2 (backup) - OVR 70
    const p2 = generatePlayer({ position: Position.QB, targetOvr: 70, slot: 2 });
    results.slot2.ages.push(p2.age);
    results.slot2.experiences.push(p2.experience);

    // Slot 3 (depth) - OVR 60
    const p3 = generatePlayer({ position: Position.QB, targetOvr: 60, slot: 3 });
    results.slot3.ages.push(p3.age);
    results.slot3.experiences.push(p3.experience);
  }

  // Analyze results
  console.log('\n=== AGE DISTRIBUTION ANALYSIS ===\n');

  for (const [slot, data] of Object.entries(results)) {
    const avgAge = data.ages.reduce((a, b) => a + b, 0) / data.ages.length;
    const avgExp = data.experiences.reduce((a, b) => a + b, 0) / data.experiences.length;
    const rookieCount = data.experiences.filter(e => e === 0).length;
    const experiencedCount = data.experiences.filter(e => e > 0).length;

    // Age bracket distribution
    const ageBrackets = {
      '21': data.ages.filter(a => a === 21).length,
      '22': data.ages.filter(a => a === 22).length,
      '23-25': data.ages.filter(a => a >= 23 && a <= 25).length,
      '26-29': data.ages.filter(a => a >= 26 && a <= 29).length,
      '30-33': data.ages.filter(a => a >= 30 && a <= 33).length,
      '34+': data.ages.filter(a => a >= 34).length,
    };

    console.log(`${slot.toUpperCase()}:`);
    console.log(`  Avg Age: ${avgAge.toFixed(1)}, Avg Experience: ${avgExp.toFixed(1)}`);
    console.log(`  Rookies (exp=0): ${rookieCount} (${(rookieCount/SAMPLE_SIZE*100).toFixed(1)}%)`);
    console.log(`  Experienced (exp>0): ${experiencedCount} (${(experiencedCount/SAMPLE_SIZE*100).toFixed(1)}%)`);
    console.log(`  Age Distribution:`);
    for (const [bracket, count] of Object.entries(ageBrackets)) {
      console.log(`    ${bracket}: ${count} (${(count/SAMPLE_SIZE*100).toFixed(1)}%)`);
    }
    console.log('');
  }

  // Simulate actual roster distribution (53 players per team)
  console.log('=== SIMULATED ROSTER (like actual generation) ===\n');

  const rosterAges: number[] = [];
  const rosterExperiences: number[] = [];

  // Generate 32 teams worth of players
  for (let team = 0; team < 32; team++) {
    // QB: 3 (slots 1, 2, 3)
    for (let slot = 1; slot <= 3; slot++) {
      const ovr = slot === 1 ? 80 : slot === 2 ? 70 : 60;
      const p = generatePlayer({ position: Position.QB, targetOvr: ovr, slot });
      rosterAges.push(p.age);
      rosterExperiences.push(p.experience);
    }
    // RB: 5 (slots 1-5)
    for (let slot = 1; slot <= 5; slot++) {
      const ovr = slot === 1 ? 78 : slot === 2 ? 68 : 58;
      const p = generatePlayer({ position: Position.RB, targetOvr: ovr, slot });
      rosterAges.push(p.age);
      rosterExperiences.push(p.experience);
    }
    // WR: 6
    for (let slot = 1; slot <= 6; slot++) {
      const ovr = slot <= 2 ? 78 : slot <= 4 ? 68 : 58;
      const p = generatePlayer({ position: Position.WR, targetOvr: ovr, slot });
      rosterAges.push(p.age);
      rosterExperiences.push(p.experience);
    }
    // Add more positions to get realistic count...
    // MLB: 2
    for (let slot = 1; slot <= 2; slot++) {
      const ovr = slot === 1 ? 78 : 68;
      const p = generatePlayer({ position: Position.MLB, targetOvr: ovr, slot });
      rosterAges.push(p.age);
      rosterExperiences.push(p.experience);
    }
    // CB: 6
    for (let slot = 1; slot <= 6; slot++) {
      const ovr = slot <= 2 ? 78 : slot <= 4 ? 68 : 58;
      const p = generatePlayer({ position: Position.CB, targetOvr: ovr, slot });
      rosterAges.push(p.age);
      rosterExperiences.push(p.experience);
    }
  }

  const totalPlayers = rosterAges.length;
  const rookies = rosterExperiences.filter(e => e === 0).length;
  const experienced = rosterExperiences.filter(e => e > 0).length;
  const avgAge = rosterAges.reduce((a, b) => a + b, 0) / totalPlayers;

  console.log(`Total Players Generated: ${totalPlayers}`);
  console.log(`Average Age: ${avgAge.toFixed(1)}`);
  console.log(`Rookies (age 21, exp=0): ${rookies} (${(rookies/totalPlayers*100).toFixed(1)}%)`);
  console.log(`Experienced (age 22+, exp>0): ${experienced} (${(experienced/totalPlayers*100).toFixed(1)}%)`);

  // Age breakdown
  const age21 = rosterAges.filter(a => a === 21).length;
  const age22 = rosterAges.filter(a => a === 22).length;
  console.log(`\nAge 21 count: ${age21} (${(age21/totalPlayers*100).toFixed(1)}%)`);
  console.log(`Age 22 count: ${age22} (${(age22/totalPlayers*100).toFixed(1)}%)`);
}

analyzeAgeDistribution();
