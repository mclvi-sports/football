/**
 * Rookie Camp System
 *
 * Post-draft rookie evaluation and development assignment.
 * Reveals OVR within ±3 accuracy and assigns development focus.
 *
 * WO-DRAFT-EXPERIENCE-001 - Phase 6
 */

import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { Position } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type CampPerformance = 'standout' | 'solid' | 'average' | 'struggling' | 'concern';
export type DevelopmentFocus = 'speed' | 'strength' | 'technique' | 'football_iq' | 'balanced';

export interface RookieCampResult {
  prospectId: string;
  prospect: DraftProspect;
  revealedOvr: number; // OVR revealed at camp (±3 from true)
  trueOvr: number; // Actual OVR
  ovrAccuracy: number; // How close revealed is to true
  performance: CampPerformance;
  developmentFocus: DevelopmentFocus;
  campNotes: string[];
  mentorId?: string; // Veteran mentor if assigned
  projectedYear1Ovr: number; // Expected OVR after Year 1
  standoutDrills: string[];
  areasToImprove: string[];
}

export interface RookieCampSummary {
  year: number;
  week: number;
  teamId: string;
  rookies: RookieCampResult[];
  standouts: RookieCampResult[];
  concerns: RookieCampResult[];
  averageRevealedOvr: number;
  averageTrueOvr: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const OVR_REVEAL_VARIANCE = 3; // ±3 from true OVR

const DRILL_NAMES: Record<string, string[]> = {
  QB: ['7-on-7 passing', 'Red zone reads', 'Two-minute drill', 'Film study'],
  RB: ['Zone running', 'Pass protection', 'Route running', 'Ball security'],
  WR: ['Route precision', 'Contested catches', 'RAC ability', 'Release technique'],
  TE: ['Blocking technique', 'Seam routes', 'Red zone targets', 'Inline vs motion'],
  OL: ['Pass sets', 'Double teams', 'Pull technique', 'Communication'],
  DL: ['Pass rush moves', 'Gap control', 'Motor', 'Hand technique'],
  LB: ['Zone drops', 'Blitz timing', 'Tackle form', 'Sideline to sideline'],
  DB: ['Man coverage', 'Zone recognition', 'Ball skills', 'Tackling'],
  K: ['Accuracy drills', 'Distance kicks', 'Pressure situations', 'Consistency'],
  P: ['Hang time', 'Directional punting', 'Coverage timing', 'Consistency'],
};

const POSITION_TO_GROUP: Record<string, string> = {
  QB: 'QB',
  RB: 'RB',
  WR: 'WR',
  TE: 'TE',
  LT: 'OL',
  LG: 'OL',
  C: 'OL',
  RG: 'OL',
  RT: 'OL',
  DE: 'DL',
  DT: 'DL',
  MLB: 'LB',
  OLB: 'LB',
  CB: 'DB',
  FS: 'DB',
  SS: 'DB',
  K: 'K',
  P: 'P',
};

const PERFORMANCE_NOTES: Record<CampPerformance, string[]> = {
  standout: [
    'Impressed coaches from day one',
    'Already looks like a starter',
    'Picked up the playbook quickly',
    'Elite work ethic on display',
    'Could push for playing time immediately',
  ],
  solid: [
    'Meeting expectations',
    'Steady improvement each day',
    'Good attitude and coachability',
    'On track for development plan',
  ],
  average: [
    'Typical rookie adjustment period',
    'Still learning the pro game',
    'Flashes of potential mixed with mistakes',
  ],
  struggling: [
    'Having trouble with the transition',
    'Needs extra coaching attention',
    'Physical tools are there, mental game needs work',
  ],
  concern: [
    'Significant adjustment issues',
    'Not picking up the system',
    'May need extended development time',
    'Work ethic questions emerging',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reveal OVR with Year 1 accuracy (±3)
 */
export function revealRookieOvr(trueOvr: number): number {
  const variance = Math.floor(Math.random() * (OVR_REVEAL_VARIANCE * 2 + 1)) - OVR_REVEAL_VARIANCE;
  return Math.max(40, Math.min(99, trueOvr + variance));
}

/**
 * Determine camp performance based on potential and randomness
 */
export function determineCampPerformance(prospect: DraftProspect): CampPerformance {
  const potentialGap = prospect.potentialGap || 0;
  const roll = Math.random() * 100;

  // Higher potential = more likely to stand out
  if (prospect.potentialLabel === 'Star') {
    if (roll < 30) return 'standout';
    if (roll < 70) return 'solid';
    if (roll < 90) return 'average';
    return 'struggling';
  } else if (prospect.potentialLabel === 'Starter') {
    if (roll < 15) return 'standout';
    if (roll < 50) return 'solid';
    if (roll < 80) return 'average';
    if (roll < 95) return 'struggling';
    return 'concern';
  } else {
    // Limited potential
    if (roll < 5) return 'standout';
    if (roll < 25) return 'solid';
    if (roll < 60) return 'average';
    if (roll < 85) return 'struggling';
    return 'concern';
  }
}

/**
 * Determine development focus based on prospect attributes
 */
export function determineDevelopmentFocus(prospect: DraftProspect): DevelopmentFocus {
  const position = prospect.position;
  const fortyTime = prospect.fortyTime;

  // Speed positions with slow 40
  if (['WR', 'CB', 'RB', 'FS', 'SS'].includes(position) && fortyTime > 4.55) {
    return 'speed';
  }

  // Power positions
  if (['DE', 'DT', 'LT', 'LG', 'C', 'RG', 'RT', 'TE'].includes(position)) {
    if (Math.random() > 0.5) return 'strength';
    return 'technique';
  }

  // Mental game positions
  if (['QB', 'MLB', 'C'].includes(position)) {
    if (Math.random() > 0.6) return 'football_iq';
    return 'technique';
  }

  // Default distribution
  const roll = Math.random();
  if (roll < 0.2) return 'speed';
  if (roll < 0.4) return 'strength';
  if (roll < 0.6) return 'technique';
  if (roll < 0.8) return 'football_iq';
  return 'balanced';
}

/**
 * Get standout drills based on performance
 */
export function getStandoutDrills(
  prospect: DraftProspect,
  performance: CampPerformance
): string[] {
  const group = POSITION_TO_GROUP[prospect.position] || 'OL';
  const drills = DRILL_NAMES[group] || DRILL_NAMES.OL;

  if (performance === 'standout') {
    // Return 2-3 drills
    return drills.slice(0, 2 + Math.floor(Math.random() * 2));
  } else if (performance === 'solid') {
    // Return 1-2 drills
    return drills.slice(0, 1 + Math.floor(Math.random() * 2));
  } else if (performance === 'average') {
    // Return 0-1 drill
    return Math.random() > 0.5 ? [drills[Math.floor(Math.random() * drills.length)]] : [];
  }

  return [];
}

/**
 * Get areas needing improvement
 */
export function getAreasToImprove(
  prospect: DraftProspect,
  performance: CampPerformance
): string[] {
  const group = POSITION_TO_GROUP[prospect.position] || 'OL';
  const drills = DRILL_NAMES[group] || DRILL_NAMES.OL;

  if (performance === 'concern') {
    return drills.slice(0, 3);
  } else if (performance === 'struggling') {
    return drills.slice(0, 2);
  } else if (performance === 'average') {
    return drills.slice(0, 1);
  }

  return [];
}

/**
 * Generate camp notes based on performance
 */
export function generateCampNotes(performance: CampPerformance): string[] {
  const notes = PERFORMANCE_NOTES[performance];
  const count = performance === 'standout' ? 2 : 1;

  const shuffled = [...notes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Calculate projected Year 1 OVR
 */
export function projectYear1Ovr(
  trueOvr: number,
  performance: CampPerformance,
  potentialLabel: string
): number {
  let baseGrowth = 0;

  // Base growth by performance
  switch (performance) {
    case 'standout':
      baseGrowth = 3;
      break;
    case 'solid':
      baseGrowth = 2;
      break;
    case 'average':
      baseGrowth = 1;
      break;
    case 'struggling':
      baseGrowth = 0;
      break;
    case 'concern':
      baseGrowth = -1;
      break;
  }

  // Potential modifier
  if (potentialLabel === 'Star') {
    baseGrowth += 1;
  } else if (potentialLabel === 'Limited') {
    baseGrowth -= 1;
  }

  return Math.max(40, Math.min(99, trueOvr + baseGrowth));
}

/**
 * Evaluate a single rookie at camp
 */
export function evaluateRookie(prospect: DraftProspect): RookieCampResult {
  const trueOvr = prospect.overall;
  const revealedOvr = revealRookieOvr(trueOvr);
  const performance = determineCampPerformance(prospect);
  const developmentFocus = determineDevelopmentFocus(prospect);

  return {
    prospectId: prospect.id,
    prospect,
    revealedOvr,
    trueOvr,
    ovrAccuracy: Math.abs(trueOvr - revealedOvr),
    performance,
    developmentFocus,
    campNotes: generateCampNotes(performance),
    standoutDrills: getStandoutDrills(prospect, performance),
    areasToImprove: getAreasToImprove(prospect, performance),
    projectedYear1Ovr: projectYear1Ovr(trueOvr, performance, prospect.potentialLabel),
  };
}

/**
 * Run full rookie camp for a team's draft picks
 */
export function runRookieCamp(
  rookies: DraftProspect[],
  teamId: string,
  year: number = 2025,
  week: number = 22
): RookieCampSummary {
  const results = rookies.map((r) => evaluateRookie(r));

  const standouts = results.filter((r) => r.performance === 'standout');
  const concerns = results.filter((r) => r.performance === 'concern');

  const avgRevealed =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.revealedOvr, 0) / results.length
      : 0;

  const avgTrue =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.trueOvr, 0) / results.length
      : 0;

  return {
    year,
    week,
    teamId,
    rookies: results,
    standouts,
    concerns,
    averageRevealedOvr: Math.round(avgRevealed * 10) / 10,
    averageTrueOvr: Math.round(avgTrue * 10) / 10,
  };
}

/**
 * Get development focus display name
 */
export function getDevelopmentFocusLabel(focus: DevelopmentFocus): string {
  switch (focus) {
    case 'speed':
      return 'Speed & Agility';
    case 'strength':
      return 'Strength & Power';
    case 'technique':
      return 'Technique & Fundamentals';
    case 'football_iq':
      return 'Football IQ & Film Study';
    case 'balanced':
      return 'Balanced Development';
  }
}

/**
 * Get performance color for UI
 */
export function getPerformanceColor(performance: CampPerformance): string {
  switch (performance) {
    case 'standout':
      return 'text-green-400';
    case 'solid':
      return 'text-blue-400';
    case 'average':
      return 'text-gray-400';
    case 'struggling':
      return 'text-yellow-400';
    case 'concern':
      return 'text-red-400';
  }
}

/**
 * Get performance badge color for UI
 */
export function getPerformanceBadgeClass(performance: CampPerformance): string {
  switch (performance) {
    case 'standout':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'solid':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'average':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'struggling':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'concern':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}
