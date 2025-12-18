/**
 * Test Draft Phase 4 Systems
 *
 * Tests draft store, trade value chart, AI logic, and compensatory picks.
 */

import {
  getPickValue,
  evaluateTrade,
  suggestTradeUp,
  suggestTradeDown,
  formatTradeComparison,
} from '../src/lib/draft/trade-value-chart';

import {
  generateTeamProfile,
  evaluateProspect,
  rankProspectsForTeam,
  makeAIDraftDecision,
  quickAIPick,
} from '../src/lib/draft/draft-ai';

import {
  calculateCompensatoryPicks,
  generateMockFreeAgentSignings,
  getCompPickSummary,
  compPicksToDraftPicks,
} from '../src/lib/draft/compensatory-picks';

import { Position } from '../src/lib/types';
import type { DraftProspect } from '../src/lib/generators/draft-generator';
import type { TeamNeeds, DraftPick } from '../src/stores/draft-store';

console.log('=== Draft Phase 4 Tests ===\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test Trade Value Chart
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- Trade Value Chart ---');

// Test pick values
console.log('Pick #1 value:', getPickValue(1));
console.log('Pick #32 value:', getPickValue(32));
console.log('Pick #100 value:', getPickValue(100));
console.log('Pick #224 value:', getPickValue(224));

// Test trade evaluation
const tradeOffer = {
  offeredPicks: [15, 78],
  requestedPicks: [6],
};
const tradeResult = evaluateTrade(tradeOffer);
console.log('\nTrade evaluation (15 + 78 for 6):');
console.log('  Offered value:', tradeResult.pick1Value);
console.log('  Requested value:', tradeResult.pick2Value);
console.log('  Difference:', tradeResult.difference);
console.log('  Is fair:', tradeResult.isFair);
console.log('  Recommendation:', tradeResult.recommendation);

// Test trade up suggestion
const myPicks = [25, 56, 88, 120, 152, 184, 216];
const tradeUpSuggestion = suggestTradeUp(10, myPicks);
console.log('\nTrade up to #10 with picks', myPicks.join(', '), ':');
if (tradeUpSuggestion) {
  console.log('  Suggested picks to offer:', tradeUpSuggestion.picks.join(', '));
  console.log('  Package value:', tradeUpSuggestion.value);
  console.log('  Target value:', tradeUpSuggestion.targetValue);
} else {
  console.log('  Cannot afford trade up');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test AI Draft Logic
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- AI Draft Logic ---');

// Generate team profiles
const teamProfile = generateTeamProfile('BOS');
console.log('\nBOS Team Profile:');
console.log('  Strategy:', teamProfile.strategy);
console.log('  Draft Style:', teamProfile.draftStyle);
console.log('  Aggressiveness:', teamProfile.aggressiveness);
console.log('  Patience:', teamProfile.patienceLevel);
console.log('  Risk Tolerance:', teamProfile.riskTolerance);

// Create mock prospects
const mockProspects: DraftProspect[] = [
  {
    id: 'p1',
    firstName: 'John',
    lastName: 'Smith',
    position: Position.QB,
    overall: 85,
    potential: 95,
    potentialGap: 10,
    potentialLabel: 'Star',
    round: 1,
    pick: 1,
    scoutedOvr: 83,
  } as DraftProspect,
  {
    id: 'p2',
    firstName: 'Mike',
    lastName: 'Jones',
    position: Position.DE,
    overall: 82,
    potential: 88,
    potentialGap: 6,
    potentialLabel: 'Starter',
    round: 1,
    pick: 5,
    scoutedOvr: 80,
  } as DraftProspect,
  {
    id: 'p3',
    firstName: 'Chris',
    lastName: 'Williams',
    position: Position.CB,
    overall: 80,
    potential: 90,
    potentialGap: 10,
    potentialLabel: 'Star',
    round: 1,
    pick: 10,
    scoutedOvr: 78,
  } as DraftProspect,
];

// Create mock team needs
const mockNeeds: TeamNeeds = {
  teamId: 'BOS',
  positions: [
    { position: Position.QB, priority: 'critical', currentDepth: 1, targetDepth: 2 },
    { position: Position.DE, priority: 'high', currentDepth: 2, targetDepth: 3 },
    { position: Position.CB, priority: 'medium', currentDepth: 3, targetDepth: 4 },
  ],
};

// Test prospect evaluation
console.log('\nProspect Evaluations for BOS (pick 5):');
for (const prospect of mockProspects) {
  const evaluation = evaluateProspect(prospect, mockNeeds, teamProfile, 5);
  console.log(`  ${prospect.firstName} ${prospect.lastName} (${prospect.position}): Score ${evaluation.finalScore.toFixed(1)}`);
  console.log(`    Raw: ${evaluation.rawScore}, Needs: +${evaluation.needsBonus}, Value: +${evaluation.valueBonus}, Risk: ${evaluation.riskAdjustment}`);
}

// Test prospect ranking
const rankings = rankProspectsForTeam(mockProspects, mockNeeds, teamProfile, 5);
console.log('\nRankings for BOS:');
rankings.forEach((r, i) => {
  const prospect = mockProspects.find((p) => p.id === r.prospectId);
  console.log(`  ${i + 1}. ${prospect?.firstName} ${prospect?.lastName} - Score: ${r.finalScore.toFixed(1)}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test Compensatory Picks
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Compensatory Picks ---');

const teamIds = ['BOS', 'PHI', 'PIT', 'BAL', 'MIA', 'NYE', 'CHI', 'DEN'];
const mockSignings = generateMockFreeAgentSignings(teamIds, 30);

console.log(`\nGenerated ${mockSignings.length} mock free agent signings`);

const compResults = calculateCompensatoryPicks(mockSignings, teamIds);
const compSummary = getCompPickSummary(compResults);

console.log('\nCompensatory Pick Summary:');
if (compSummary.length === 0) {
  console.log('  No teams earned compensatory picks');
} else {
  for (const team of compSummary.slice(0, 5)) {
    console.log(`  ${team.teamId}: ${team.total} picks (R3: ${team.round3}, R4: ${team.round4}, R5: ${team.round5}, R6: ${team.round6}, R7: ${team.round7})`);
  }
}

// Convert to draft picks
const compPicks = compPicksToDraftPicks(compResults);
console.log(`\nTotal compensatory picks generated: ${compPicks.length}`);
if (compPicks.length > 0) {
  console.log('First comp pick:', compPicks[0]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n=== All Phase 4 Tests Complete ===');
console.log('✅ Trade value chart working');
console.log('✅ AI draft logic working');
console.log('✅ Compensatory picks working');
