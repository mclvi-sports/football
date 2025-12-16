/**
 * Scouting System Utilities
 *
 * Utility functions for scouting reports, hiring, and gameplay mechanics.
 * Following FINAL-scout-system.md specification.
 */

import type {
  Scout,
  ScoutingReport,
  ScoutRecommendation,
  HiringOffer,
  PotentialVisibility,
  DraftGrade,
  ProspectTier,
  SeasonPeriod,
  RecommendationType,
} from './types';
import {
  REPORT_QUALITY_TIERS,
  HIRING_WEIGHTS,
  SCOUTING_POINT_COSTS,
  PERIOD_MODIFIERS,
  SEASON_PERIODS,
  XP_GAIN_VALUES,
} from './types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// SCOUTING POINTS UTILITIES
// ============================================================================

export function getCurrentPeriod(week: number): SeasonPeriod {
  for (const [period, [start, end]] of Object.entries(SEASON_PERIODS)) {
    if (week >= start && week <= end) {
      return period as SeasonPeriod;
    }
  }
  return 'mid_season';
}

export function calculateScoutingCost(tier: ProspectTier, period: SeasonPeriod): number {
  const baseCost = SCOUTING_POINT_COSTS[tier];
  const modifier = PERIOD_MODIFIERS[period];
  return Math.round(baseCost * modifier);
}

export function calculateWeeklyPoints(workEthic: number): number {
  return 100 + workEthic * 2;
}

export function calculateDepartmentWeeklyPoints(scouts: Scout[]): number {
  return scouts.reduce((total, scout) => {
    return total + calculateWeeklyPoints(scout.attributes.workEthic);
  }, 0);
}

// ============================================================================
// REPORT GENERATION UTILITIES (Part 11)
// ============================================================================

export function getReportQualityTier(scoutOvr: number): keyof typeof REPORT_QUALITY_TIERS {
  if (scoutOvr >= 95) return 'ELITE';
  if (scoutOvr >= 85) return 'GREAT';
  if (scoutOvr >= 75) return 'GOOD';
  if (scoutOvr >= 65) return 'AVERAGE';
  return 'POOR';
}

export function calculateOvrError(scoutTalentEval: number): number {
  // Higher talent evaluation = lower error
  if (scoutTalentEval >= 95) return 1;
  if (scoutTalentEval >= 85) return 2;
  if (scoutTalentEval >= 75) return 4;
  if (scoutTalentEval >= 65) return 6;
  return 8;
}

export function calculateScoutedOvr(trueOvr: number, scoutTalentEval: number): number {
  const maxError = calculateOvrError(scoutTalentEval);
  const error = randomInRange(-maxError, maxError);
  return clamp(trueOvr + error, 40, 99);
}

export function getPotentialVisibility(scoutOvr: number): PotentialVisibility {
  if (scoutOvr >= 95) return 'exact';
  if (scoutOvr >= 85) return 'range';
  if (scoutOvr >= 75) return 'tier';
  if (scoutOvr >= 65) return 'vague';
  return 'hidden';
}

export function calculatePotentialValue(
  truePotential: number,
  visibility: PotentialVisibility
): number | [number, number] | string | undefined {
  switch (visibility) {
    case 'exact':
      return truePotential;
    case 'range':
      return [Math.max(40, truePotential - 5), Math.min(99, truePotential + 5)];
    case 'tier':
      if (truePotential >= 85) return 'Star';
      if (truePotential >= 75) return 'Starter';
      if (truePotential >= 65) return 'Backup';
      return 'Limited';
    case 'vague':
      if (truePotential >= 80) return 'High';
      if (truePotential >= 70) return 'Medium';
      return 'Low';
    case 'hidden':
    default:
      return undefined;
  }
}

export function getTraitsToReveal(
  scoutTraitRecognition: number,
  totalTraits: number
): number {
  if (scoutTraitRecognition >= 95) return totalTraits; // All traits
  if (scoutTraitRecognition >= 85) return Math.min(4, totalTraits);
  if (scoutTraitRecognition >= 75) return Math.min(3, totalTraits);
  if (scoutTraitRecognition >= 65) return Math.min(2, totalTraits);
  return Math.min(1, totalTraits);
}

export function calculateBustRisk(
  scoutBustDetection: number,
  isBust: boolean
): number {
  // Higher bust detection = more accurate bust prediction
  const baseAccuracy = scoutBustDetection >= 95 ? 0.90 :
    scoutBustDetection >= 85 ? 0.75 :
    scoutBustDetection >= 75 ? 0.60 :
    scoutBustDetection >= 65 ? 0.40 : 0.25;

  if (isBust) {
    // If actually a bust, return high risk with some error
    return Math.round((baseAccuracy + (1 - baseAccuracy) * Math.random() * 0.5) * 100);
  } else {
    // If not a bust, return low risk with some error
    return Math.round((1 - baseAccuracy) * Math.random() * 100);
  }
}

export function calculateSleeperFlag(
  scoutSleeperDiscovery: number,
  isSleeper: boolean
): boolean {
  const discoveryChance = scoutSleeperDiscovery >= 95 ? 0.95 :
    scoutSleeperDiscovery >= 85 ? 0.80 :
    scoutSleeperDiscovery >= 75 ? 0.65 :
    scoutSleeperDiscovery >= 65 ? 0.50 : 0.30;

  if (isSleeper) {
    return Math.random() < discoveryChance;
  }
  // False positive rate
  return Math.random() < (1 - discoveryChance) * 0.1;
}

export function calculateConfidence(scoutOvr: number, pointsSpent: number): number {
  // Base confidence from scout quality
  const tier = getReportQualityTier(scoutOvr);
  const baseConfidence = REPORT_QUALITY_TIERS[tier].confidence;

  // Bonus from points spent (diminishing returns)
  const pointsBonus = Math.min(10, Math.floor(pointsSpent / 10));

  return Math.min(99, baseConfidence + pointsBonus);
}

export function calculateDraftGrade(scoutedOvr: number): DraftGrade {
  if (scoutedOvr >= 90) return 'A+';
  if (scoutedOvr >= 87) return 'A';
  if (scoutedOvr >= 84) return 'A-';
  if (scoutedOvr >= 81) return 'B+';
  if (scoutedOvr >= 78) return 'B';
  if (scoutedOvr >= 75) return 'B-';
  if (scoutedOvr >= 72) return 'C+';
  if (scoutedOvr >= 69) return 'C';
  if (scoutedOvr >= 66) return 'C-';
  if (scoutedOvr >= 60) return 'D';
  return 'F';
}

export function calculateRoundProjection(scoutedOvr: number): number {
  if (scoutedOvr >= 85) return 1;
  if (scoutedOvr >= 80) return 2;
  if (scoutedOvr >= 75) return 3;
  if (scoutedOvr >= 70) return 4;
  if (scoutedOvr >= 65) return 5;
  if (scoutedOvr >= 60) return 6;
  return 7;
}

export interface ProspectData {
  id: string;
  trueOvr: number;
  truePotential: number;
  traits: string[];
  attributes: Record<string, number>;
  isBust: boolean;
  isSleeper: boolean;
  position: string;
}

export function generateScoutingReport(
  scout: Scout,
  prospect: ProspectData,
  week: number
): ScoutingReport {
  const scoutedOvr = calculateScoutedOvr(prospect.trueOvr, scout.attributes.talentEvaluation);
  const potentialVisibility = getPotentialVisibility(scout.ovr);
  const traitsToReveal = getTraitsToReveal(scout.attributes.traitRecognition, prospect.traits.length);

  // Randomly select which traits to reveal
  const shuffledTraits = [...prospect.traits].sort(() => Math.random() - 0.5);
  const traitsRevealed = shuffledTraits.slice(0, traitsToReveal);

  // Determine which attributes to reveal based on scout OVR
  const allAttributes = Object.keys(prospect.attributes);
  const attrsToReveal = scout.ovr >= 90 ? allAttributes.length :
    scout.ovr >= 80 ? Math.ceil(allAttributes.length * 0.6) :
    scout.ovr >= 70 ? Math.ceil(allAttributes.length * 0.4) :
    Math.ceil(allAttributes.length * 0.2);
  const shuffledAttrs = [...allAttributes].sort(() => Math.random() - 0.5);
  const attributesRevealed = shuffledAttrs.slice(0, attrsToReveal);

  return {
    id: `report_${generateId()}`,
    prospectId: prospect.id,
    scoutId: scout.id,
    generatedAt: Date.now(),
    week,
    scoutedOvr,
    ovrConfidence: calculateConfidence(scout.ovr, 0),
    potentialVisibility,
    potentialValue: calculatePotentialValue(prospect.truePotential, potentialVisibility),
    traitsRevealed,
    traitsHidden: prospect.traits.length - traitsRevealed.length,
    attributesRevealed,
    bustRisk: calculateBustRisk(scout.attributes.bustDetection, prospect.isBust),
    sleeperFlag: calculateSleeperFlag(scout.attributes.sleeperDiscovery, prospect.isSleeper),
    draftGrade: calculateDraftGrade(scoutedOvr),
    roundProjection: calculateRoundProjection(scoutedOvr),
    textSummary: generateReportText(scout, prospect, scoutedOvr),
  };
}

function generateReportText(
  scout: Scout,
  prospect: ProspectData,
  scoutedOvr: number
): string {
  const grade = calculateDraftGrade(scoutedOvr);
  const round = calculateRoundProjection(scoutedOvr);

  const qualityDescriptors: Record<string, string> = {
    'A+': 'elite prospect with exceptional upside',
    'A': 'high-quality player who should start immediately',
    'A-': 'very good prospect with starter potential',
    'B+': 'solid prospect who projects as a starter',
    'B': 'good player with starting potential',
    'B-': 'decent prospect who could develop into a starter',
    'C+': 'average prospect with backup potential',
    'C': 'developmental player who needs work',
    'C-': 'raw prospect with limited upside',
    'D': 'below average prospect',
    'F': 'not recommended for draft consideration',
  };

  return `${prospect.position} prospect projects as a Round ${round} pick. ` +
    `${qualityDescriptors[grade] || 'Standard prospect'}. ` +
    `Scout ${scout.firstName} ${scout.lastName} rates this player a ${grade}.`;
}

// ============================================================================
// HIRING UTILITIES (Part 8)
// ============================================================================

export interface TeamContext {
  teamId: string;
  teamSuccess: number; // 0-100 (based on wins, playoffs)
  facilitiesRating: number; // 0-100
  jobSecurity: number; // 0-100 (owner patience)
  locationRating: number; // 0-100 (market size, city appeal)
}

export function calculateHiringScore(
  offer: HiringOffer,
  scout: Scout,
  context: TeamContext
): number {
  // Normalize salary offer to 0-100 scale
  const maxSalary = scout.role === 'director' ? 2.5 : 1.5;
  const salaryScore = Math.min(100, (offer.salaryOffer / maxSalary) * 100);

  // Calculate weighted score
  const score =
    salaryScore * HIRING_WEIGHTS.salary +
    context.teamSuccess * HIRING_WEIGHTS.teamSuccess +
    context.facilitiesRating * HIRING_WEIGHTS.facilities +
    context.jobSecurity * HIRING_WEIGHTS.jobSecurity +
    context.locationRating * HIRING_WEIGHTS.location;

  return Math.round(score);
}

export function resolveHiringCompetition(
  scout: Scout,
  offers: HiringOffer[],
  teamContexts: Map<string, TeamContext>
): string | null {
  if (offers.length === 0) return null;

  let bestScore = -1;
  let winningTeamId: string | null = null;

  for (const offer of offers) {
    const context = teamContexts.get(offer.teamId);
    if (!context) continue;

    const score = calculateHiringScore(offer, scout, context);

    // Add some randomness (±10%)
    const randomizedScore = score * (0.9 + Math.random() * 0.2);

    if (randomizedScore > bestScore) {
      bestScore = randomizedScore;
      winningTeamId = offer.teamId;
    }
  }

  return winningTeamId;
}

// ============================================================================
// XP & PROGRESSION UTILITIES (Part 9)
// ============================================================================

export function calculateXPForDraftAccuracy(
  scoutedOvr: number,
  trueOvr: number,
  round: number,
  isSleeper: boolean,
  wasMarkedAsBust: boolean,
  actuallyBusted: boolean
): number {
  let xp = 0;
  const error = Math.abs(scoutedOvr - trueOvr);

  // Correct grade bonus
  if (error <= 2) {
    xp += XP_GAIN_VALUES.CORRECT_GRADE;
  }

  // Hidden gem bonus (late round pick that becomes star)
  if (isSleeper && round >= 4 && trueOvr >= 80) {
    xp += XP_GAIN_VALUES.HIDDEN_GEM;
  }

  // Bust avoided (marked as bust and player busted elsewhere)
  if (wasMarkedAsBust && actuallyBusted) {
    xp += XP_GAIN_VALUES.BUST_AVOIDED;
  }

  // Draft hit bonus
  if (trueOvr >= 75) {
    if (round <= 3) {
      xp += XP_GAIN_VALUES.DRAFT_HIT_EARLY;
    } else {
      xp += XP_GAIN_VALUES.DRAFT_HIT_LATE;
    }
  }

  return xp;
}

export function calculateRetirementRisk(age: number): number {
  if (age < 63) return 0;
  if (age <= 68) return 0.15;
  if (age <= 72) return 0.30;
  return 0.50;
}

export function shouldScoutRetire(age: number): boolean {
  const risk = calculateRetirementRisk(age);
  return Math.random() < risk;
}

// ============================================================================
// RECOMMENDATIONS UTILITIES (Part 12)
// ============================================================================

export function generateRecommendations(
  reports: ScoutingReport[],
  scouts: Scout[],
  teamNeeds: string[]
): ScoutRecommendation[] {
  const recommendations: ScoutRecommendation[] = [];

  // Sort reports by scouted OVR
  const sortedReports = [...reports].sort((a, b) => b.scoutedOvr - a.scoutedOvr);

  // Top prospects (top 5 overall)
  for (const report of sortedReports.slice(0, 5)) {
    const scout = scouts.find((s) => s.id === report.scoutId);
    if (!scout) continue;

    recommendations.push({
      id: `rec_${generateId()}`,
      type: 'top_prospect',
      prospectId: report.prospectId,
      scoutId: report.scoutId,
      confidence: report.ovrConfidence,
      reason: `Top-rated prospect with grade ${report.draftGrade}`,
      position: '', // Would come from prospect data
      timestamp: Date.now(),
    });
  }

  // Sleeper alerts
  const sleepers = reports.filter((r) => r.sleeperFlag && r.roundProjection >= 4);
  for (const report of sleepers.slice(0, 5)) {
    const scout = scouts.find((s) => s.id === report.scoutId);
    if (!scout) continue;

    recommendations.push({
      id: `rec_${generateId()}`,
      type: 'sleeper',
      prospectId: report.prospectId,
      scoutId: report.scoutId,
      confidence: scout.attributes.sleeperDiscovery,
      reason: `Hidden gem identified - could outperform draft position`,
      position: '',
      timestamp: Date.now(),
    });
  }

  // Bust warnings
  const bustRisks = reports.filter((r) => r.bustRisk >= 60);
  for (const report of bustRisks.slice(0, 5)) {
    const scout = scouts.find((s) => s.id === report.scoutId);
    if (!scout) continue;

    recommendations.push({
      id: `rec_${generateId()}`,
      type: 'bust_warning',
      prospectId: report.prospectId,
      scoutId: report.scoutId,
      confidence: scout.attributes.bustDetection,
      reason: `High bust risk (${report.bustRisk}%) - proceed with caution`,
      position: '',
      timestamp: Date.now(),
    });
  }

  return recommendations;
}

export function getBestAvailable(
  reports: ScoutingReport[],
  draftedProspectIds: Set<string>,
  position?: string
): ScoutingReport | null {
  const available = reports.filter((r) => !draftedProspectIds.has(r.prospectId));

  if (available.length === 0) return null;

  // Sort by scouted OVR
  available.sort((a, b) => b.scoutedOvr - a.scoutedOvr);

  return available[0];
}
