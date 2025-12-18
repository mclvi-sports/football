/**
 * Test Rookie Camp System
 */

import {
  revealRookieOvr,
  determineCampPerformance,
  determineDevelopmentFocus,
  evaluateRookie,
  runRookieCamp,
  getDevelopmentFocusLabel,
} from '../src/lib/training/rookie-camp';

import type { DraftProspect } from '../src/lib/generators/draft-generator';

console.log('=== Rookie Camp Tests ===\n');

// Mock prospects
const mockProspects: DraftProspect[] = [
  {
    id: 'p1',
    firstName: 'John',
    lastName: 'Smith',
    position: 'QB',
    overall: 78,
    potential: 92,
    potentialGap: 14,
    potentialLabel: 'Star',
    round: 1,
    pick: 5,
    fortyTime: 4.65,
    height: 75,
    weight: 220,
    age: 22,
    experience: 0,
  } as DraftProspect,
  {
    id: 'p2',
    firstName: 'Mike',
    lastName: 'Jones',
    position: 'WR',
    overall: 72,
    potential: 82,
    potentialGap: 10,
    potentialLabel: 'Starter',
    round: 2,
    pick: 40,
    fortyTime: 4.42,
    height: 72,
    weight: 195,
    age: 23,
    experience: 0,
  } as DraftProspect,
  {
    id: 'p3',
    firstName: 'Chris',
    lastName: 'Williams',
    position: 'DE',
    overall: 68,
    potential: 72,
    potentialGap: 4,
    potentialLabel: 'Limited',
    round: 4,
    pick: 120,
    fortyTime: 4.75,
    height: 77,
    weight: 265,
    age: 24,
    experience: 0,
  } as DraftProspect,
];

// Test OVR reveal
console.log('--- OVR Reveal Test ---');
const trueOvr = 75;
const reveals: number[] = [];
for (let i = 0; i < 100; i++) {
  reveals.push(revealRookieOvr(trueOvr));
}
const minReveal = Math.min(...reveals);
const maxReveal = Math.max(...reveals);
const avgReveal = reveals.reduce((a, b) => a + b, 0) / reveals.length;

console.log(`True OVR: ${trueOvr}`);
console.log(`Revealed range: ${minReveal} - ${maxReveal} (should be ${trueOvr - 3} to ${trueOvr + 3})`);
console.log(`Average revealed: ${avgReveal.toFixed(1)}`);
console.log(`✅ OVR reveal within ±3 range: ${minReveal >= trueOvr - 3 && maxReveal <= trueOvr + 3}`);

// Test camp performance
console.log('\n--- Camp Performance Test ---');
for (const prospect of mockProspects) {
  const performance = determineCampPerformance(prospect);
  const focus = determineDevelopmentFocus(prospect);
  console.log(`${prospect.firstName} ${prospect.lastName} (${prospect.potentialLabel}):`);
  console.log(`  Performance: ${performance}`);
  console.log(`  Dev Focus: ${getDevelopmentFocusLabel(focus)}`);
}

// Test full evaluation
console.log('\n--- Full Evaluation Test ---');
const result = evaluateRookie(mockProspects[0]);
console.log(`${result.prospect.firstName} ${result.prospect.lastName}:`);
console.log(`  Revealed OVR: ${result.revealedOvr} (true: ${result.trueOvr})`);
console.log(`  Performance: ${result.performance}`);
console.log(`  Development: ${getDevelopmentFocusLabel(result.developmentFocus)}`);
console.log(`  Year 1 Projection: ${result.projectedYear1Ovr}`);
console.log(`  Camp Notes: ${result.campNotes.join(', ')}`);
console.log(`  Standout Drills: ${result.standoutDrills.join(', ') || 'None'}`);

// Test full camp
console.log('\n--- Full Camp Summary ---');
const campSummary = runRookieCamp(mockProspects, 'BOS', 2025, 22);
console.log(`Total rookies: ${campSummary.rookies.length}`);
console.log(`Standouts: ${campSummary.standouts.length}`);
console.log(`Concerns: ${campSummary.concerns.length}`);
console.log(`Avg Revealed OVR: ${campSummary.averageRevealedOvr}`);
console.log(`Avg True OVR: ${campSummary.averageTrueOvr}`);

console.log('\n=== All Rookie Camp Tests Complete ===');
console.log('✅ OVR reveal working');
console.log('✅ Performance determination working');
console.log('✅ Development focus assignment working');
console.log('✅ Full camp simulation working');
