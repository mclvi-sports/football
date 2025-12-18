/**
 * Scheme Fit Calculator
 *
 * Evaluates draft prospects' scheme fit with the user's team.
 * Uses existing scheme-fit.ts logic for archetype-based grading.
 *
 * WO-SCOUTING-HUB-001
 */

import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { ProspectSchemeFit, SchemeFitGrade } from './types';
import { Position, Archetype } from '@/lib/types';
import type { OffensiveScheme, DefensiveScheme, SchemeFit } from '@/lib/schemes/types';
import { getArchetypeSchemeFit } from '@/lib/schemes/scheme-fit';

// ============================================================================
// TYPES
// ============================================================================

interface TeamSchemes {
  offense: OffensiveScheme;
  defense: DefensiveScheme;
}

// ============================================================================
// POSITION GROUP MAPPING
// ============================================================================

const OFFENSIVE_POSITIONS: Position[] = [
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

const DEFENSIVE_POSITIONS: Position[] = [
  Position.DE,
  Position.DT,
  Position.MLB,
  Position.OLB,
  Position.CB,
  Position.FS,
  Position.SS,
];

function getPositionGroup(position: Position): 'QB' | 'RB' | 'WR' | 'DEF' | 'OTHER' {
  if (position === Position.QB) return 'QB';
  if (position === Position.RB) return 'RB';
  if ([Position.WR, Position.TE].includes(position)) return 'WR';
  if (DEFENSIVE_POSITIONS.includes(position)) return 'DEF';
  return 'OTHER';
}

// ============================================================================
// ARCHETYPE TO FIT STRING MAPPING
// ============================================================================

/**
 * Map archetype enum to string keys used in scheme-fit.ts
 * The scheme-fit.ts uses snake_case keys internally
 */
function archetypeToFitKey(archetype: Archetype): string {
  const mapping: Partial<Record<Archetype, string>> = {
    // QB
    [Archetype.FieldGeneral]: 'field_general',
    [Archetype.Scrambler]: 'scrambler',
    [Archetype.DualThreat]: 'dual_threat',
    [Archetype.Gunslinger]: 'gunslinger',
    [Archetype.PocketPasser]: 'pocket_passer',
    [Archetype.GameManager]: 'game_manager',
    // RB
    [Archetype.PowerBack]: 'power_back',
    [Archetype.SpeedBack]: 'speed_back',
    [Archetype.ReceivingBack]: 'receiving_back',
    [Archetype.AllPurpose]: 'all_purpose',
    [Archetype.Bruiser]: 'bruiser',
    [Archetype.ElusiveBack]: 'speed_back', // Map to similar
    // WR
    [Archetype.DeepThreat]: 'deep_threat',
    [Archetype.Possession]: 'possession',
    [Archetype.Playmaker]: 'playmaker',
    [Archetype.SlotSpecialist]: 'slot',
    [Archetype.RedZoneThreat]: 'red_zone',
    [Archetype.RouteTechnician]: 'possession', // Map to similar
    // TE
    [Archetype.BlockingTE]: 'blocking_wr',
    [Archetype.ReceivingTE]: 'possession',
    [Archetype.HybridTE]: 'all_purpose',
    [Archetype.SeamStretcher]: 'deep_threat',
    [Archetype.MoveTE]: 'playmaker',
    [Archetype.HBack]: 'all_purpose',
    // DL
    [Archetype.SpeedRusher]: 'speed_rusher',
    [Archetype.PowerRusher]: 'power_rusher',
    [Archetype.RunStuffer]: 'run_stuffer',
    [Archetype.NoseTackle]: 'nose_tackle',
    [Archetype.Complete]: 'speed_rusher', // Map to similar
    [Archetype.HybridDE]: 'speed_rusher',
    [Archetype.RawAthlete]: 'speed_rusher',
    [Archetype.InteriorRusher]: 'power_rusher',
    [Archetype.RunPlugger]: 'run_stuffer',
    [Archetype.ThreeTech]: 'power_rusher',
    [Archetype.HybridDT]: 'power_rusher',
    [Archetype.AthleticDT]: 'speed_rusher',
    // LB
    [Archetype.RunStopper]: 'run_stopper_lb',
    [Archetype.CoverageLB]: 'coverage_lb',
    [Archetype.PassRusherLB]: 'edge_rusher',
    [Archetype.HybridLB]: 'hybrid_lb',
    [Archetype.FieldGeneralLB]: 'coverage_lb',
    [Archetype.AthleticLB]: 'hybrid_lb',
    // CB
    [Archetype.ManCover]: 'shutdown_corner',
    [Archetype.ZoneCover]: 'zone_corner',
    [Archetype.BallHawkCB]: 'ball_hawk',
    [Archetype.Physical]: 'shutdown_corner',
    [Archetype.SlotCorner]: 'zone_corner',
    [Archetype.HybridCB]: 'zone_corner',
    // S
    [Archetype.FreeSafety]: 'deep_safety',
    [Archetype.StrongSafety]: 'box_safety',
    [Archetype.HybridS]: 'hybrid_safety',
    [Archetype.BallHawkS]: 'deep_safety',
    [Archetype.Enforcer]: 'box_safety',
    [Archetype.CoverageS]: 'deep_safety',
  };

  return mapping[archetype] || 'balanced';
}

// ============================================================================
// GRADE CONVERSION
// ============================================================================

/**
 * Convert SchemeFit level to letter grade
 */
function schemeFitToGrade(fit: SchemeFit): SchemeFitGrade {
  const gradeMap: Record<SchemeFit, SchemeFitGrade> = {
    perfect: 'A',
    good: 'B',
    neutral: 'C',
    poor: 'D',
    terrible: 'F',
  };
  return gradeMap[fit];
}

/**
 * Get reason text for scheme fit
 */
function getFitReason(
  fit: SchemeFit,
  archetype: string,
  scheme: string,
  isOffense: boolean
): string {
  const archetypeDisplay = archetype
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const schemeDisplay = scheme
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  switch (fit) {
    case 'perfect':
      return `${archetypeDisplay} is an ideal fit for ${schemeDisplay} ${isOffense ? 'offense' : 'defense'}`;
    case 'good':
      return `${archetypeDisplay} works well in ${schemeDisplay} ${isOffense ? 'offense' : 'defense'}`;
    case 'neutral':
      return `${archetypeDisplay} can adapt to ${schemeDisplay} ${isOffense ? 'offense' : 'defense'}`;
    case 'poor':
      return `${archetypeDisplay} may struggle in ${schemeDisplay} ${isOffense ? 'offense' : 'defense'}`;
    case 'terrible':
      return `${archetypeDisplay} is a poor fit for ${schemeDisplay} ${isOffense ? 'offense' : 'defense'}`;
  }
}

// ============================================================================
// MAIN CALCULATOR
// ============================================================================

/**
 * Calculate scheme fit for a single prospect
 */
export function calculateProspectSchemeFit(
  prospect: DraftProspect,
  teamSchemes: TeamSchemes
): ProspectSchemeFit {
  const positionGroup = getPositionGroup(prospect.position);
  const archetypeKey = archetypeToFitKey(prospect.archetype);
  const reasons: string[] = [];

  let offensiveGrade: SchemeFitGrade | undefined;
  let defensiveGrade: SchemeFitGrade | undefined;
  let primaryGrade: SchemeFitGrade;

  // Determine relevant scheme based on position
  if (OFFENSIVE_POSITIONS.includes(prospect.position)) {
    // Offensive player - check against offensive scheme
    if (positionGroup !== 'OTHER') {
      const fit = getArchetypeSchemeFit(
        archetypeKey,
        teamSchemes.offense,
        positionGroup
      );
      offensiveGrade = schemeFitToGrade(fit);
      primaryGrade = offensiveGrade;
      reasons.push(getFitReason(fit, archetypeKey, teamSchemes.offense, true));
    } else {
      // OL positions - use position-specific logic
      primaryGrade = calculateOLSchemeFit(prospect.archetype, teamSchemes.offense);
      reasons.push(`${prospect.archetype} in ${teamSchemes.offense} offense`);
    }
  } else if (DEFENSIVE_POSITIONS.includes(prospect.position)) {
    // Defensive player - check against defensive scheme
    const fit = getArchetypeSchemeFit(
      archetypeKey,
      teamSchemes.defense,
      'DEF'
    );
    defensiveGrade = schemeFitToGrade(fit);
    primaryGrade = defensiveGrade;
    reasons.push(getFitReason(fit, archetypeKey, teamSchemes.defense, false));
  } else {
    // K/P - no scheme fit
    primaryGrade = 'C';
    reasons.push('Specialists have neutral scheme fit');
  }

  return {
    prospectId: prospect.id,
    offensiveGrade,
    defensiveGrade,
    primaryGrade,
    reasons,
    archetype: prospect.archetype,
  };
}

/**
 * Calculate OL-specific scheme fit
 */
function calculateOLSchemeFit(
  archetype: Archetype,
  scheme: OffensiveScheme
): SchemeFitGrade {
  // OL scheme fit based on run vs pass focus
  const runHeavySchemes: OffensiveScheme[] = ['power_run', 'zone_run'];
  const passHeavySchemes: OffensiveScheme[] = ['air_raid', 'spread', 'west_coast'];

  const runBlockers: Archetype[] = [Archetype.RoadGrader, Archetype.Mauler];
  const passProtectors: Archetype[] = [Archetype.PassProtector, Archetype.AthleticOL];

  if (runHeavySchemes.includes(scheme)) {
    if (runBlockers.includes(archetype)) return 'A';
    if (passProtectors.includes(archetype)) return 'D';
    return 'B';
  }

  if (passHeavySchemes.includes(scheme)) {
    if (passProtectors.includes(archetype)) return 'A';
    if (runBlockers.includes(archetype)) return 'D';
    return 'B';
  }

  // Balanced schemes like everyone
  if (archetype === Archetype.BalancedOL || archetype === Archetype.Technician) return 'A';
  return 'B';
}

/**
 * Calculate scheme fit for all prospects
 */
export function calculateAllSchemeFits(
  prospects: DraftProspect[],
  teamSchemes: TeamSchemes
): Record<string, ProspectSchemeFit> {
  const cache: Record<string, ProspectSchemeFit> = {};

  for (const prospect of prospects) {
    cache[prospect.id] = calculateProspectSchemeFit(prospect, teamSchemes);
  }

  return cache;
}

/**
 * Get prospects sorted by scheme fit (best fits first)
 */
export function getProspectsBySchemeFit(
  prospects: DraftProspect[],
  teamSchemes: TeamSchemes,
  filterPosition?: Position
): { prospect: DraftProspect; schemeFit: ProspectSchemeFit }[] {
  const gradeOrder: SchemeFitGrade[] = ['A', 'B', 'C', 'D', 'F'];

  let filtered = prospects;
  if (filterPosition) {
    filtered = prospects.filter((p) => p.position === filterPosition);
  }

  return filtered
    .map((prospect) => ({
      prospect,
      schemeFit: calculateProspectSchemeFit(prospect, teamSchemes),
    }))
    .sort((a, b) => {
      // Sort by grade first, then by scouted OVR
      const gradeCompare =
        gradeOrder.indexOf(a.schemeFit.primaryGrade) -
        gradeOrder.indexOf(b.schemeFit.primaryGrade);
      if (gradeCompare !== 0) return gradeCompare;
      return b.prospect.scoutedOvr - a.prospect.scoutedOvr;
    });
}

/**
 * Get scheme fit summary stats for a draft class
 */
export function getSchemeFitStats(
  prospects: DraftProspect[],
  teamSchemes: TeamSchemes
): {
  gradeDistribution: Record<SchemeFitGrade, number>;
  bestFits: { prospect: DraftProspect; grade: SchemeFitGrade }[];
  worstFits: { prospect: DraftProspect; grade: SchemeFitGrade }[];
} {
  const distribution: Record<SchemeFitGrade, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  };

  const fits = prospects.map((prospect) => ({
    prospect,
    grade: calculateProspectSchemeFit(prospect, teamSchemes).primaryGrade,
  }));

  for (const { grade } of fits) {
    distribution[grade]++;
  }

  // Get top 5 best and worst fits
  const sorted = [...fits].sort((a, b) => {
    const gradeOrder = ['A', 'B', 'C', 'D', 'F'];
    return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
  });

  return {
    gradeDistribution: distribution,
    bestFits: sorted.slice(0, 5),
    worstFits: sorted.slice(-5).reverse(),
  };
}
