/**
 * Draft AI - AI Team Draft Logic
 *
 * Handles AI team decision making for draft picks and trades.
 * Each team has a personality that affects their strategy.
 *
 * WO-DRAFT-EXPERIENCE-001 - Phase 4
 */

import { Position } from '@/lib/types';
import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { DraftPick, TeamNeeds, Trade, TradePackage } from '@/stores/draft-store';
import {
  getPickValue,
  evaluateTrade,
  suggestTradeUp,
  suggestTradeDown,
  type TradeOffer,
} from './trade-value-chart';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TeamStrategy = 'rebuild' | 'contend' | 'balanced';
export type DraftStyle = 'bpa' | 'needs' | 'balanced' | 'value';

export interface AITeamProfile {
  teamId: string;
  strategy: TeamStrategy;
  draftStyle: DraftStyle;
  aggressiveness: number; // 0-100, willingness to trade up
  patienceLevel: number; // 0-100, willingness to trade down
  riskTolerance: number; // 0-100, willingness to draft boom/bust prospects
}

export interface DraftDecision {
  action: 'pick' | 'trade_up' | 'trade_down';
  prospectId?: string;
  tradeOffer?: Trade;
  reasoning: string;
}

export interface ProspectEvaluation {
  prospectId: string;
  rawScore: number;
  needsBonus: number;
  valueBonus: number;
  riskAdjustment: number;
  finalScore: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Team Profile Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate AI personality profile for a team
 */
export function generateTeamProfile(teamId: string, seed?: number): AITeamProfile {
  // Use team ID to create consistent but varied personalities
  const hash = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (offset: number) => ((hash + offset) * 9301 + 49297) % 233280 / 233280;

  const strategyRoll = random(1);
  let strategy: TeamStrategy;
  if (strategyRoll < 0.3) strategy = 'rebuild';
  else if (strategyRoll < 0.6) strategy = 'contend';
  else strategy = 'balanced';

  const styleRoll = random(2);
  let draftStyle: DraftStyle;
  if (styleRoll < 0.25) draftStyle = 'bpa';
  else if (styleRoll < 0.5) draftStyle = 'needs';
  else if (styleRoll < 0.75) draftStyle = 'balanced';
  else draftStyle = 'value';

  return {
    teamId,
    strategy,
    draftStyle,
    aggressiveness: Math.floor(random(3) * 100),
    patienceLevel: Math.floor(random(4) * 100),
    riskTolerance: Math.floor(random(5) * 100),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Prospect Evaluation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a prospect for a specific team
 */
export function evaluateProspect(
  prospect: DraftProspect,
  needs: TeamNeeds,
  profile: AITeamProfile,
  currentPick: number
): ProspectEvaluation {
  // Base score from overall rating
  const rawScore = prospect.overall;

  // Needs bonus based on position need
  const positionNeed = needs.positions.find((n) => n.position === prospect.position);
  let needsBonus = 0;
  if (positionNeed) {
    const needsMultiplier = {
      critical: 15,
      high: 10,
      medium: 5,
      low: 0,
    };
    needsBonus = needsMultiplier[positionNeed.priority];

    // Needs-focused teams get extra bonus
    if (profile.draftStyle === 'needs') {
      needsBonus *= 1.5;
    }
  }

  // Value bonus based on expected pick position vs current pick
  const expectedPick = getExpectedPickForRating(prospect.overall);
  const pickDifference = expectedPick - currentPick;
  let valueBonus = 0;

  if (profile.draftStyle === 'value' || profile.draftStyle === 'bpa') {
    // Value-focused teams love getting players who should go higher
    if (pickDifference > 20) valueBonus = 10;
    else if (pickDifference > 10) valueBonus = 5;
    else if (pickDifference > 0) valueBonus = 2;
    else if (pickDifference < -20) valueBonus = -10; // Penalty for reaches
    else if (pickDifference < -10) valueBonus = -5;
  }

  // Risk adjustment based on potential variance
  const potentialGap = prospect.potentialGap || 0;
  let riskAdjustment = 0;

  if (profile.riskTolerance > 70) {
    // High risk tolerance teams like boom/bust players
    riskAdjustment = Math.floor(potentialGap * 0.3);
  } else if (profile.riskTolerance < 30) {
    // Low risk tolerance teams penalize high variance
    riskAdjustment = -Math.floor(potentialGap * 0.2);
  }

  const finalScore = rawScore + needsBonus + valueBonus + riskAdjustment;

  return {
    prospectId: prospect.id,
    rawScore,
    needsBonus,
    valueBonus,
    riskAdjustment,
    finalScore,
  };
}

/**
 * Get expected pick position for a given rating
 */
function getExpectedPickForRating(overall: number): number {
  if (overall >= 85) return 5;
  if (overall >= 82) return 15;
  if (overall >= 78) return 32;
  if (overall >= 74) return 50;
  if (overall >= 70) return 80;
  if (overall >= 66) return 120;
  if (overall >= 62) return 160;
  if (overall >= 58) return 200;
  return 224;
}

/**
 * Rank all available prospects for a team
 */
export function rankProspectsForTeam(
  availableProspects: DraftProspect[],
  needs: TeamNeeds,
  profile: AITeamProfile,
  currentPick: number
): ProspectEvaluation[] {
  return availableProspects
    .map((p) => evaluateProspect(p, needs, profile, currentPick))
    .sort((a, b) => b.finalScore - a.finalScore);
}

// ─────────────────────────────────────────────────────────────────────────────
// Trade Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine if AI should try to trade up
 */
export function shouldTradeUp(
  profile: AITeamProfile,
  topProspect: ProspectEvaluation,
  currentPick: number,
  targetPick: number
): boolean {
  // Need sufficient aggressiveness
  if (profile.aggressiveness < 50) return false;

  // Contending teams are more likely to trade up
  if (profile.strategy !== 'contend') {
    if (profile.aggressiveness < 70) return false;
  }

  // Check if the prospect is worth trading up for
  const valueGain = topProspect.finalScore - 70; // 70 is baseline "starter"
  const pickCost = currentPick - targetPick;

  // Rough heuristic: is the value gain worth the pick cost?
  const worthIt = valueGain > pickCost * 0.5;

  return worthIt && Math.random() * 100 < profile.aggressiveness;
}

/**
 * Determine if AI should try to trade down
 */
export function shouldTradeDown(
  profile: AITeamProfile,
  rankings: ProspectEvaluation[],
  currentPick: number
): boolean {
  // Need sufficient patience
  if (profile.patienceLevel < 40) return false;

  // Rebuilding teams love to trade down
  if (profile.strategy === 'rebuild' && profile.patienceLevel >= 60) {
    return Math.random() * 100 < profile.patienceLevel;
  }

  // Check if top prospects are closely rated (no clear standout)
  if (rankings.length >= 3) {
    const topThreeSpread = rankings[0].finalScore - rankings[2].finalScore;
    if (topThreeSpread < 3) {
      // Close rankings = good time to trade down
      return Math.random() * 100 < profile.patienceLevel;
    }
  }

  return false;
}

/**
 * Generate a trade offer from AI
 */
export function generateTradeOffer(
  fromTeamId: string,
  toTeamId: string,
  fromPicks: DraftPick[],
  toPicks: DraftPick[],
  targetPick: number,
  isTradeUp: boolean
): Trade | null {
  if (isTradeUp) {
    // Trading up: offer multiple picks for one better pick
    const suggestion = suggestTradeUp(
      targetPick,
      fromPicks.map((p) => p.overall)
    );

    if (!suggestion) return null;

    const trade: Trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
      team1Id: fromTeamId,
      team2Id: toTeamId,
      pickNumber: targetPick,
      team1Package: {
        picksOffered: fromPicks.filter((p) => suggestion.picks.includes(p.overall)),
        picksRequested: toPicks.filter((p) => p.overall === targetPick),
      },
      team2Package: {
        picksOffered: toPicks.filter((p) => p.overall === targetPick),
        picksRequested: fromPicks.filter((p) => suggestion.picks.includes(p.overall)),
      },
    };

    return trade;
  } else {
    // Trading down: want to receive multiple picks
    const suggestion = suggestTradeDown(
      targetPick,
      toPicks.map((p) => p.overall)
    );

    if (!suggestion) return null;

    const trade: Trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
      team1Id: fromTeamId,
      team2Id: toTeamId,
      pickNumber: targetPick,
      team1Package: {
        picksOffered: fromPicks.filter((p) => p.overall === targetPick),
        picksRequested: toPicks.filter((p) => suggestion.receive.includes(p.overall)),
      },
      team2Package: {
        picksOffered: toPicks.filter((p) => suggestion.receive.includes(p.overall)),
        picksRequested: fromPicks.filter((p) => p.overall === targetPick),
      },
    };

    return trade;
  }
}

/**
 * Evaluate an incoming trade offer
 */
export function evaluateTradeOffer(
  trade: Trade,
  evaluatingTeamId: string,
  profile: AITeamProfile
): { accept: boolean; reasoning: string } {
  // Determine which package we're receiving
  const receiving =
    trade.team1Id === evaluatingTeamId ? trade.team2Package : trade.team1Package;
  const giving =
    trade.team1Id === evaluatingTeamId ? trade.team1Package : trade.team2Package;

  const offer: TradeOffer = {
    offeredPicks: receiving.picksOffered.map((p) => p.overall),
    requestedPicks: giving.picksOffered.map((p) => p.overall),
  };

  const evaluation = evaluateTrade(offer);

  // Adjust acceptance based on team profile
  let acceptanceThreshold = 0; // 0 means needs to be exactly fair

  if (profile.strategy === 'rebuild') {
    // Rebuilding teams want extra value to move down, accept less to move up
    const movingUp = Math.min(...offer.requestedPicks) < Math.min(...offer.offeredPicks);
    acceptanceThreshold = movingUp ? -10 : 5; // More willing to trade down
  } else if (profile.strategy === 'contend') {
    // Contending teams are more willing to overpay to move up
    const movingUp = Math.min(...offer.requestedPicks) < Math.min(...offer.offeredPicks);
    acceptanceThreshold = movingUp ? -15 : 0; // More willing to trade up
  }

  const accept = evaluation.percentageDiff >= acceptanceThreshold;

  let reasoning = '';
  if (accept) {
    reasoning = `Trade accepted: ${evaluation.percentageDiff.toFixed(1)}% value ${
      evaluation.percentageDiff >= 0 ? 'gain' : 'loss'
    }`;
  } else {
    reasoning = `Trade rejected: ${evaluation.percentageDiff.toFixed(1)}% value is below threshold of ${acceptanceThreshold}%`;
  }

  return { accept, reasoning };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Decision Making
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Make a draft decision for an AI team
 */
export function makeAIDraftDecision(
  teamId: string,
  currentPick: DraftPick,
  availableProspects: DraftProspect[],
  teamPicks: DraftPick[],
  otherTeamPicks: Record<string, DraftPick[]>,
  needs: TeamNeeds,
  profile: AITeamProfile
): DraftDecision {
  // Rank available prospects
  const rankings = rankProspectsForTeam(
    availableProspects,
    needs,
    profile,
    currentPick.overall
  );

  if (rankings.length === 0) {
    return {
      action: 'pick',
      prospectId: availableProspects[0]?.id,
      reasoning: 'No prospects to evaluate, picking first available',
    };
  }

  const topProspect = rankings[0];

  // Consider trading up (only if not already at a top pick)
  if (currentPick.overall > 10 && shouldTradeUp(profile, topProspect, currentPick.overall, 1)) {
    // Find a team to trade with
    for (const [otherId, otherPicks] of Object.entries(otherTeamPicks)) {
      const higherPick = otherPicks.find(
        (p) => p.overall < currentPick.overall && p.overall >= currentPick.overall - 15
      );

      if (higherPick) {
        const tradeOffer = generateTradeOffer(
          teamId,
          otherId,
          teamPicks,
          otherPicks,
          higherPick.overall,
          true
        );

        if (tradeOffer) {
          return {
            action: 'trade_up',
            tradeOffer,
            reasoning: `Attempting to trade up for pick #${higherPick.overall} to get ${topProspect.prospectId}`,
          };
        }
      }
    }
  }

  // Consider trading down
  if (shouldTradeDown(profile, rankings, currentPick.overall)) {
    // Find a team to trade with
    for (const [otherId, otherPicks] of Object.entries(otherTeamPicks)) {
      const tradeOffer = generateTradeOffer(
        teamId,
        otherId,
        teamPicks,
        otherPicks,
        currentPick.overall,
        false
      );

      if (tradeOffer) {
        return {
          action: 'trade_down',
          tradeOffer,
          reasoning: `Trading down from #${currentPick.overall} to accumulate picks`,
        };
      }
    }
  }

  // Default: make the pick
  return {
    action: 'pick',
    prospectId: topProspect.prospectId,
    reasoning: `Selecting top-rated prospect (score: ${topProspect.finalScore.toFixed(1)})`,
  };
}

/**
 * Simulate an AI pick quickly (for instant mode)
 */
export function quickAIPick(
  availableProspects: DraftProspect[],
  needs: TeamNeeds,
  profile: AITeamProfile,
  currentPick: number
): string | null {
  const rankings = rankProspectsForTeam(availableProspects, needs, profile, currentPick);
  return rankings[0]?.prospectId ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Position Priority Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Premium positions that teams value more highly in early rounds
 */
const PREMIUM_POSITIONS: Position[] = [
  Position.QB,
  Position.LT,
  Position.DE,
  Position.CB,
];

/**
 * Get position value modifier for a pick
 */
export function getPositionValueModifier(
  position: Position,
  round: number
): number {
  const isPremium = PREMIUM_POSITIONS.includes(position);

  if (round === 1) {
    return isPremium ? 5 : -2;
  } else if (round <= 3) {
    return isPremium ? 3 : 0;
  }

  return 0;
}

/**
 * Check if a position is considered premium
 */
export function isPremiumPosition(position: Position): boolean {
  return PREMIUM_POSITIONS.includes(position);
}
