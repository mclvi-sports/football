/**
 * Scout Recommendation Engine
 *
 * Generates scout recommendations based on:
 * - Scout role, expertise, and attributes
 * - Scout perks (diamond_finder, bust_buster, etc.)
 * - Prospect data (position, OVR, potential, traits)
 *
 * WO-SCOUTING-HUB-001
 */

import type { Scout, ScoutPerkId, RecommendationType } from '@/lib/scouting/types';
import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { ScoutRecommendation, PerkActivation, HiddenGem } from './types';
import { Position } from '@/lib/types';

// ============================================================================
// POSITION MAPPING
// ============================================================================

const OFFENSIVE_POSITIONS = [
  Position.QB,
  Position.RB,
  Position.WR,
  Position.TE,
  Position.LT,
  Position.LG,
  Position.C,
  Position.RG,
  Position.RT,
];

const DEFENSIVE_POSITIONS = [
  Position.DE,
  Position.DT,
  Position.MLB,
  Position.OLB,
  Position.CB,
  Position.FS,
  Position.SS,
];

const SPECIAL_TEAMS_POSITIONS = [Position.K, Position.P];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isPositionMatch(
  position: Position,
  expertise: Scout['positionExpertise']
): boolean {
  switch (expertise) {
    case 'offensive':
      return OFFENSIVE_POSITIONS.includes(position);
    case 'defensive':
      return DEFENSIVE_POSITIONS.includes(position);
    case 'special_teams':
      return SPECIAL_TEAMS_POSITIONS.includes(position);
    case 'generalist':
      return true;
  }
}

function getExpertiseBonus(
  position: Position,
  expertise: Scout['positionExpertise']
): number {
  if (expertise === 'generalist') return 0;
  if (isPositionMatch(position, expertise)) return 10;
  return -5; // Penalty for non-expertise
}

function hasPerk(scout: Scout, perkId: ScoutPerkId): boolean {
  return scout.perks.some((p) => p.id === perkId);
}

function calculateConfidence(
  baseScore: number,
  scoutOvr: number,
  hasExpertise: boolean
): number {
  let confidence = baseScore + (scoutOvr - 75) * 0.5;
  if (hasExpertise) confidence += 10;
  return Math.min(100, Math.max(20, Math.round(confidence)));
}

// ============================================================================
// RECOMMENDATION GENERATORS
// ============================================================================

/**
 * Generate top prospect recommendations
 * Scouts flag their highest-rated prospects in their expertise area
 */
function generateTopProspectRecommendations(
  scout: Scout,
  prospects: DraftProspect[],
  maxRecommendations: number = 3
): ScoutRecommendation[] {
  const recommendations: ScoutRecommendation[] = [];

  // Filter to expertise area and sort by scouted OVR
  const relevantProspects = prospects
    .filter((p) => isPositionMatch(p.position, scout.positionExpertise))
    .sort((a, b) => b.scoutedOvr - a.scoutedOvr)
    .slice(0, maxRecommendations);

  for (const prospect of relevantProspects) {
    const hasExpertise = isPositionMatch(prospect.position, scout.positionExpertise);
    const confidence = calculateConfidence(70, scout.ovr, hasExpertise);

    recommendations.push({
      id: generateId(),
      scoutId: scout.id,
      scoutName: `${scout.firstName} ${scout.lastName}`,
      scoutRole: scout.role,
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position,
      type: 'top_prospect',
      confidence,
      reason: generateTopProspectReason(scout, prospect),
      timestamp: Date.now(),
    });
  }

  return recommendations;
}

/**
 * Generate sleeper recommendations
 * Triggered by diamond_finder, hidden_gem_expert, treasure_hunter perks
 */
function generateSleeperRecommendations(
  scout: Scout,
  prospects: DraftProspect[]
): { recommendations: ScoutRecommendation[]; activations: PerkActivation[] } {
  const recommendations: ScoutRecommendation[] = [];
  const activations: PerkActivation[] = [];

  // Check for sleeper-finding perks
  const hasDiamondFinder = hasPerk(scout, 'diamond_finder');
  const hasHiddenGemExpert = hasPerk(scout, 'hidden_gem_expert');
  const hasTreasureHunter = hasPerk(scout, 'treasure_hunter');

  if (!hasDiamondFinder && !hasHiddenGemExpert && !hasTreasureHunter) {
    return { recommendations, activations };
  }

  // Determine sleeper count based on perks
  let sleeperCount = 1;
  let activePerk: ScoutPerkId = 'diamond_finder';
  if (hasTreasureHunter) {
    sleeperCount = 5;
    activePerk = 'treasure_hunter';
  } else if (hasHiddenGemExpert) {
    sleeperCount = 3;
    activePerk = 'hidden_gem_expert';
  }

  // Add sleeper discovery bonus from scout attribute
  const sleeperBonus = Math.floor(scout.attributes.sleeperDiscovery / 20);
  sleeperCount += sleeperBonus;

  // Find sleepers: high potential relative to OVR, later round projections
  const sleepers = prospects
    .filter((p) => {
      const potentialGap = p.potential - p.scoutedOvr;
      const isLateRound = typeof p.round === 'number' && p.round >= 4;
      return potentialGap >= 8 && (isLateRound || p.round === 'UDFA');
    })
    .sort((a, b) => (b.potential - b.scoutedOvr) - (a.potential - a.scoutedOvr))
    .slice(0, sleeperCount);

  for (const prospect of sleepers) {
    const hasExpertise = isPositionMatch(prospect.position, scout.positionExpertise);
    const confidence = calculateConfidence(60, scout.ovr, hasExpertise);

    recommendations.push({
      id: generateId(),
      scoutId: scout.id,
      scoutName: `${scout.firstName} ${scout.lastName}`,
      scoutRole: scout.role,
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position,
      type: 'sleeper',
      confidence,
      reason: generateSleeperReason(scout, prospect),
      perkTriggered: activePerk,
      timestamp: Date.now(),
    });

    // Create perk activation
    activations.push({
      id: generateId(),
      perkId: activePerk,
      perkName: getPerkName(activePerk),
      scoutId: scout.id,
      scoutName: `${scout.firstName} ${scout.lastName}`,
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      effect: `Identified as hidden gem with ${prospect.potential - prospect.scoutedOvr}+ potential gap`,
      activationType: 'sleeper_found',
      timestamp: Date.now(),
    });
  }

  return { recommendations, activations };
}

/**
 * Generate bust warning recommendations
 * Triggered by red_flag_detector, bust_buster, bust_proof perks
 */
function generateBustWarnings(
  scout: Scout,
  prospects: DraftProspect[]
): { recommendations: ScoutRecommendation[]; activations: PerkActivation[] } {
  const recommendations: ScoutRecommendation[] = [];
  const activations: PerkActivation[] = [];

  // Check for bust-detecting perks
  const hasRedFlagDetector = hasPerk(scout, 'red_flag_detector');
  const hasBustBuster = hasPerk(scout, 'bust_buster');
  const hasBustProof = hasPerk(scout, 'bust_proof');

  if (!hasRedFlagDetector && !hasBustBuster && !hasBustProof) {
    return { recommendations, activations };
  }

  // Determine detection accuracy
  let accuracy = 0.5;
  let activePerk: ScoutPerkId = 'red_flag_detector';
  if (hasBustProof) {
    accuracy = 0.9;
    activePerk = 'bust_proof';
  } else if (hasBustBuster) {
    accuracy = 0.75;
    activePerk = 'bust_buster';
  }

  // Scout attribute bonus
  accuracy += (scout.attributes.bustDetection - 70) * 0.005;

  // Find potential busts: high OVR but lower potential, or negative traits
  const bustCandidates = prospects
    .filter((p) => {
      const potentialGap = p.potential - p.scoutedOvr;
      const isHighlyRated = p.scoutedOvr >= 70;
      const hasNegativePotential = potentialGap <= -5;
      // Random factor based on accuracy
      const detected = Math.random() < accuracy;
      return isHighlyRated && hasNegativePotential && detected;
    })
    .slice(0, 3);

  for (const prospect of bustCandidates) {
    const hasExpertise = isPositionMatch(prospect.position, scout.positionExpertise);
    const confidence = calculateConfidence(55, scout.ovr, hasExpertise);

    recommendations.push({
      id: generateId(),
      scoutId: scout.id,
      scoutName: `${scout.firstName} ${scout.lastName}`,
      scoutRole: scout.role,
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position,
      type: 'bust_warning',
      confidence,
      reason: generateBustReason(scout, prospect),
      perkTriggered: activePerk,
      timestamp: Date.now(),
    });

    activations.push({
      id: generateId(),
      perkId: activePerk,
      perkName: getPerkName(activePerk),
      scoutId: scout.id,
      scoutName: `${scout.firstName} ${scout.lastName}`,
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      effect: `Flagged as potential bust risk`,
      activationType: 'bust_flagged',
      timestamp: Date.now(),
    });
  }

  return { recommendations, activations };
}

/**
 * Generate best available recommendations
 * Director's view of overall best prospects regardless of position
 */
function generateBestAvailableRecommendations(
  scout: Scout,
  prospects: DraftProspect[],
  count: number = 10
): ScoutRecommendation[] {
  if (scout.role !== 'director') return [];

  const recommendations: ScoutRecommendation[] = [];

  // Director ranks overall best prospects
  const bestProspects = [...prospects]
    .sort((a, b) => {
      // Weight: OVR (60%) + Potential (40%)
      const aScore = a.scoutedOvr * 0.6 + a.potential * 0.4;
      const bScore = b.scoutedOvr * 0.6 + b.potential * 0.4;
      return bScore - aScore;
    })
    .slice(0, count);

  for (let i = 0; i < bestProspects.length; i++) {
    const prospect = bestProspects[i];
    const confidence = calculateConfidence(80, scout.ovr, true);

    recommendations.push({
      id: generateId(),
      scoutId: scout.id,
      scoutName: `${scout.firstName} ${scout.lastName}`,
      scoutRole: 'director',
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position,
      type: 'best_available',
      confidence: Math.max(50, confidence - i * 3), // Decreasing confidence down the board
      reason: `Ranked #${i + 1} on director's big board`,
      timestamp: Date.now(),
    });
  }

  return recommendations;
}

// ============================================================================
// REASON GENERATORS
// ============================================================================

function generateTopProspectReason(scout: Scout, prospect: DraftProspect): string {
  const expertiseMatch = isPositionMatch(prospect.position, scout.positionExpertise);
  const reasons = [];

  if (expertiseMatch) {
    reasons.push(`fits ${scout.positionExpertise} expertise`);
  }

  if (prospect.scoutedOvr >= 80) {
    reasons.push('elite talent');
  } else if (prospect.scoutedOvr >= 75) {
    reasons.push('strong starter potential');
  }

  if (prospect.potential >= 90) {
    reasons.push('exceptional ceiling');
  } else if (prospect.potential >= 85) {
    reasons.push('high ceiling');
  }

  return reasons.length > 0
    ? `Top prospect: ${reasons.join(', ')}`
    : 'Top prospect in position group';
}

function generateSleeperReason(scout: Scout, prospect: DraftProspect): string {
  const potentialGap = prospect.potential - prospect.scoutedOvr;
  const reasons = [];

  if (potentialGap >= 15) {
    reasons.push('exceptional development potential');
  } else if (potentialGap >= 10) {
    reasons.push('significant upside');
  }

  if (prospect.round === 'UDFA') {
    reasons.push('could be draft day steal');
  } else if (typeof prospect.round === 'number' && prospect.round >= 5) {
    reasons.push('late round value');
  }

  return `Hidden gem: ${reasons.join(', ')}`;
}

function generateBustReason(scout: Scout, prospect: DraftProspect): string {
  const potentialGap = prospect.potential - prospect.scoutedOvr;
  const reasons = [];

  if (potentialGap <= -10) {
    reasons.push('limited ceiling');
  } else if (potentialGap <= -5) {
    reasons.push('concerning development projection');
  }

  if (prospect.scoutedOvr >= 75) {
    reasons.push('may not live up to draft position');
  }

  return `Bust risk: ${reasons.join(', ')}`;
}

function getPerkName(perkId: ScoutPerkId): string {
  const names: Record<ScoutPerkId, string> = {
    sharp_eye: 'Sharp Eye',
    data_analyst: 'Data Analyst',
    trait_hunter: 'Trait Hunter',
    red_flag_detector: 'Red Flag Detector',
    diamond_finder: 'Diamond Finder',
    elite_evaluator: 'Elite Evaluator',
    future_sight: 'Future Sight',
    mind_reader: 'Mind Reader',
    bust_buster: 'Bust Buster',
    hidden_gem_expert: 'Hidden Gem Expert',
    perfect_scout: 'Perfect Scout',
    oracle: 'Oracle',
    psychologist: 'Psychologist',
    bust_proof: 'Bust Proof',
    treasure_hunter: 'Treasure Hunter',
    college_connections: 'College Connections',
    pro_scout_expert: 'Pro Scout Expert',
    raw_talent_spotter: 'Raw Talent Spotter',
    cerebral_scout: 'Cerebral Scout',
    speed_scout: 'Speed Scout',
    durability_expert: 'Durability Expert',
  };
  return names[perkId] || perkId;
}

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

export interface GenerateRecommendationsResult {
  recommendations: ScoutRecommendation[];
  perkActivations: PerkActivation[];
  directorBigBoard: string[]; // Prospect IDs in director's ranking order
  hiddenGems: HiddenGem[];
}

/**
 * Generate all scout recommendations for the current draft class
 */
export function generateScoutRecommendations(
  scouts: Scout[],
  prospects: DraftProspect[]
): GenerateRecommendationsResult {
  const allRecommendations: ScoutRecommendation[] = [];
  const allActivations: PerkActivation[] = [];
  const hiddenGems: HiddenGem[] = [];
  let directorBigBoard: string[] = [];

  for (const scout of scouts) {
    // Base recommendations based on work ethic
    const recommendationCount = Math.max(2, Math.floor(scout.attributes.workEthic / 25));

    // Top prospect recommendations
    const topProspects = generateTopProspectRecommendations(
      scout,
      prospects,
      recommendationCount
    );
    allRecommendations.push(...topProspects);

    // Sleeper recommendations (perk-dependent)
    const { recommendations: sleepers, activations: sleeperActivations } =
      generateSleeperRecommendations(scout, prospects);
    allRecommendations.push(...sleepers);
    allActivations.push(...sleeperActivations);

    // Convert sleepers to hidden gems
    for (const sleeper of sleepers) {
      const prospect = prospects.find((p) => p.id === sleeper.prospectId);
      if (prospect) {
        hiddenGems.push({
          prospectId: prospect.id,
          prospectName: `${prospect.firstName} ${prospect.lastName}`,
          position: prospect.position,
          scoutedOvr: prospect.scoutedOvr,
          potential: prospect.potential,
          potentialGap: prospect.potential - prospect.scoutedOvr,
          discoveredBy: sleeper.scoutName,
          discoveryPerk: sleeper.perkTriggered,
          draftValueGap: calculateDraftValueGap(prospect),
          confidence: sleeper.confidence,
        });
      }
    }

    // Bust warnings (perk-dependent)
    const { recommendations: bustWarnings, activations: bustActivations } =
      generateBustWarnings(scout, prospects);
    allRecommendations.push(...bustWarnings);
    allActivations.push(...bustActivations);

    // Director's big board
    if (scout.role === 'director') {
      const directorRecs = generateBestAvailableRecommendations(scout, prospects, 25);
      allRecommendations.push(...directorRecs);
      directorBigBoard = directorRecs.map((r) => r.prospectId);
    }
  }

  return {
    recommendations: allRecommendations,
    perkActivations: allActivations,
    directorBigBoard,
    hiddenGems,
  };
}

function calculateDraftValueGap(prospect: DraftProspect): number {
  // Calculate how much later a prospect should be drafted based on true potential
  const expectedRound = prospect.potential >= 85 ? 1 : prospect.potential >= 75 ? 2 : 3;
  const actualRound = prospect.round === 'UDFA' ? 8 : (prospect.round as number);
  return (actualRound - expectedRound) * 32; // Approximate picks difference
}

// ============================================================================
// STAFF CONSENSUS GENERATOR
// ============================================================================

/**
 * Generate staff consensus ranking by aggregating all scout recommendations
 */
export function generateStaffConsensus(
  recommendations: ScoutRecommendation[]
): Map<string, number> {
  const scores = new Map<string, number>();

  for (const rec of recommendations) {
    const prospectId = rec.prospectId;
    const currentScore = scores.get(prospectId) || 0;

    // Weight by recommendation type and confidence
    let weight = rec.confidence / 100;
    if (rec.type === 'top_prospect') weight *= 1.5;
    if (rec.type === 'best_available') weight *= 1.2;
    if (rec.type === 'sleeper') weight *= 1.0;
    if (rec.type === 'bust_warning') weight *= -1.5; // Negative weight for busts

    // Weight by scout role
    if (rec.scoutRole === 'director') weight *= 1.5;
    if (rec.scoutRole === 'national') weight *= 1.2;

    scores.set(prospectId, currentScore + weight);
  }

  return scores;
}

/**
 * Get sorted prospect IDs by staff consensus score
 */
export function getStaffConsensusBoardOrder(
  recommendations: ScoutRecommendation[]
): string[] {
  const scores = generateStaffConsensus(recommendations);
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}
