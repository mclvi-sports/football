/**
 * Physical Measurables - Position and archetype-specific height, weight, and 40-time ranges
 *
 * Physical attributes define player body types and athletic measurables.
 * These ranges create realistic player profiles based on position and archetype.
 *
 * Source: FINAL-player-generation-system.md
 */

import { Position, Archetype } from '../types';

export interface PhysicalRange {
  height: { min: number; max: number }; // in inches
  weight: { min: number; max: number }; // in lbs
  fortyTime?: { min: number; max: number }; // in seconds
}

/**
 * Helper to convert feet-inches string to inches
 * e.g., "6'2\"" -> 74
 */
function feetInchesToInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

/**
 * Position-specific physical ranges (used as fallback when archetype not specified)
 */
export const POSITION_PHYSICAL_RANGES: Record<Position, PhysicalRange> = {
  [Position.QB]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 6) },
    weight: { min: 195, max: 245 },
    fortyTime: { min: 4.35, max: 5.10 },
  },
  [Position.RB]: {
    height: { min: feetInchesToInches(5, 8), max: feetInchesToInches(6, 2) },
    weight: { min: 185, max: 250 },
    fortyTime: { min: 4.30, max: 4.75 },
  },
  [Position.WR]: {
    height: { min: feetInchesToInches(5, 8), max: feetInchesToInches(6, 5) },
    weight: { min: 175, max: 235 },
    fortyTime: { min: 4.28, max: 4.65 },
  },
  [Position.TE]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 7) },
    weight: { min: 235, max: 275 },
    fortyTime: { min: 4.50, max: 4.95 },
  },
  [Position.LT]: {
    height: { min: feetInchesToInches(6, 4), max: feetInchesToInches(6, 8) },
    weight: { min: 305, max: 330 },
    fortyTime: { min: 5.00, max: 5.30 },
  },
  [Position.LG]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 6) },
    weight: { min: 305, max: 335 },
    fortyTime: { min: 5.10, max: 5.40 },
  },
  [Position.C]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 5) },
    weight: { min: 295, max: 320 },
    fortyTime: { min: 5.05, max: 5.35 },
  },
  [Position.RG]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 6) },
    weight: { min: 305, max: 335 },
    fortyTime: { min: 5.10, max: 5.40 },
  },
  [Position.RT]: {
    height: { min: feetInchesToInches(6, 4), max: feetInchesToInches(6, 8) },
    weight: { min: 310, max: 340 },
    fortyTime: { min: 5.05, max: 5.35 },
  },
  [Position.DE]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 6) },
    weight: { min: 250, max: 300 },
    fortyTime: { min: 4.50, max: 5.00 },
  },
  [Position.DT]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 5) },
    weight: { min: 280, max: 350 },
    fortyTime: { min: 4.75, max: 5.45 },
  },
  [Position.MLB]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 235, max: 255 },
    fortyTime: { min: 4.60, max: 4.80 },
  },
  [Position.OLB]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 230, max: 255 },
    fortyTime: { min: 4.50, max: 4.75 },
  },
  [Position.CB]: {
    height: { min: feetInchesToInches(5, 9), max: feetInchesToInches(6, 3) },
    weight: { min: 175, max: 215 },
    fortyTime: { min: 4.35, max: 4.60 },
  },
  [Position.FS]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 2) },
    weight: { min: 195, max: 215 },
    fortyTime: { min: 4.40, max: 4.55 },
  },
  [Position.SS]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 205, max: 225 },
    fortyTime: { min: 4.45, max: 4.60 },
  },
  [Position.K]: {
    height: { min: feetInchesToInches(5, 9), max: feetInchesToInches(6, 4) },
    weight: { min: 175, max: 225 },
  },
  [Position.P]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 5) },
    weight: { min: 190, max: 235 },
  },
};

/**
 * Archetype-specific physical ranges (more precise than position ranges)
 */
export const ARCHETYPE_PHYSICAL_RANGES: Partial<Record<Archetype, PhysicalRange>> = {
  // QB Archetypes
  [Archetype.PocketPasser]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 6) },
    weight: { min: 215, max: 240 },
    fortyTime: { min: 4.85, max: 5.10 },
  },
  [Archetype.DualThreat]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 4) },
    weight: { min: 210, max: 230 },
    fortyTime: { min: 4.50, max: 4.75 },
  },
  [Archetype.Gunslinger]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 5) },
    weight: { min: 220, max: 245 },
    fortyTime: { min: 4.80, max: 5.05 },
  },
  [Archetype.FieldGeneral]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 5) },
    weight: { min: 210, max: 235 },
    fortyTime: { min: 4.75, max: 5.00 },
  },
  [Archetype.Scrambler]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 2) },
    weight: { min: 195, max: 215 },
    fortyTime: { min: 4.35, max: 4.55 },
  },
  [Archetype.GameManager]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 4) },
    weight: { min: 205, max: 225 },
    fortyTime: { min: 4.80, max: 5.05 },
  },

  // RB Archetypes
  [Archetype.PowerBack]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 2) },
    weight: { min: 220, max: 240 },
    fortyTime: { min: 4.50, max: 4.65 },
  },
  [Archetype.SpeedBack]: {
    height: { min: feetInchesToInches(5, 8), max: feetInchesToInches(5, 11) },
    weight: { min: 185, max: 205 },
    fortyTime: { min: 4.30, max: 4.45 },
  },
  [Archetype.ElusiveBack]: {
    height: { min: feetInchesToInches(5, 8), max: feetInchesToInches(5, 11) },
    weight: { min: 190, max: 210 },
    fortyTime: { min: 4.40, max: 4.55 },
  },
  [Archetype.AllPurpose]: {
    height: { min: feetInchesToInches(5, 9), max: feetInchesToInches(6, 0) },
    weight: { min: 200, max: 220 },
    fortyTime: { min: 4.45, max: 4.60 },
  },
  [Archetype.ReceivingBack]: {
    height: { min: feetInchesToInches(5, 8), max: feetInchesToInches(6, 0) },
    weight: { min: 190, max: 210 },
    fortyTime: { min: 4.40, max: 4.55 },
  },
  [Archetype.Bruiser]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 1) },
    weight: { min: 230, max: 250 },
    fortyTime: { min: 4.55, max: 4.75 },
  },

  // WR Archetypes
  [Archetype.DeepThreat]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 2) },
    weight: { min: 175, max: 195 },
    fortyTime: { min: 4.28, max: 4.42 },
  },
  [Archetype.Possession]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 200, max: 220 },
    fortyTime: { min: 4.48, max: 4.60 },
  },
  [Archetype.RouteTechnician]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 2) },
    weight: { min: 190, max: 210 },
    fortyTime: { min: 4.45, max: 4.58 },
  },
  [Archetype.Playmaker]: {
    height: { min: feetInchesToInches(5, 9), max: feetInchesToInches(6, 1) },
    weight: { min: 185, max: 205 },
    fortyTime: { min: 4.35, max: 4.50 },
  },
  [Archetype.RedZoneThreat]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 5) },
    weight: { min: 215, max: 235 },
    fortyTime: { min: 4.50, max: 4.65 },
  },
  [Archetype.SlotSpecialist]: {
    height: { min: feetInchesToInches(5, 8), max: feetInchesToInches(5, 11) },
    weight: { min: 175, max: 195 },
    fortyTime: { min: 4.40, max: 4.55 },
  },

  // TE Archetypes
  [Archetype.ReceivingTE]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 6) },
    weight: { min: 240, max: 260 },
    fortyTime: { min: 4.55, max: 4.70 },
  },
  [Archetype.BlockingTE]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 6) },
    weight: { min: 255, max: 275 },
    fortyTime: { min: 4.75, max: 4.95 },
  },
  [Archetype.HybridTE]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 5) },
    weight: { min: 245, max: 265 },
    fortyTime: { min: 4.60, max: 4.80 },
  },
  [Archetype.SeamStretcher]: {
    height: { min: feetInchesToInches(6, 4), max: feetInchesToInches(6, 7) },
    weight: { min: 240, max: 260 },
    fortyTime: { min: 4.50, max: 4.65 },
  },
  [Archetype.MoveTE]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 5) },
    weight: { min: 235, max: 255 },
    fortyTime: { min: 4.55, max: 4.70 },
  },
  [Archetype.HBack]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 250, max: 270 },
    fortyTime: { min: 4.65, max: 4.85 },
  },

  // DE Archetypes
  [Archetype.SpeedRusher]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 5) },
    weight: { min: 250, max: 270 },
    fortyTime: { min: 4.55, max: 4.75 },
  },
  [Archetype.PowerRusher]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 6) },
    weight: { min: 270, max: 295 },
    fortyTime: { min: 4.70, max: 4.90 },
  },
  [Archetype.Complete]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 5) },
    weight: { min: 260, max: 280 },
    fortyTime: { min: 4.65, max: 4.85 },
  },
  [Archetype.RunStuffer]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 6) },
    weight: { min: 275, max: 300 },
    fortyTime: { min: 4.80, max: 5.00 },
  },
  [Archetype.HybridDE]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 4) },
    weight: { min: 255, max: 275 },
    fortyTime: { min: 4.60, max: 4.80 },
  },
  [Archetype.RawAthlete]: {
    height: { min: feetInchesToInches(6, 3), max: feetInchesToInches(6, 6) },
    weight: { min: 255, max: 280 },
    fortyTime: { min: 4.50, max: 4.70 },
  },

  // DT Archetypes
  [Archetype.NoseTackle]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 4) },
    weight: { min: 320, max: 350 },
    fortyTime: { min: 5.15, max: 5.45 },
  },
  [Archetype.InteriorRusher]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 285, max: 310 },
    fortyTime: { min: 4.85, max: 5.10 },
  },
  [Archetype.RunPlugger]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 305, max: 335 },
    fortyTime: { min: 5.05, max: 5.30 },
  },
  [Archetype.ThreeTech]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 5) },
    weight: { min: 280, max: 305 },
    fortyTime: { min: 4.80, max: 5.05 },
  },
  [Archetype.HybridDT]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 290, max: 315 },
    fortyTime: { min: 4.95, max: 5.20 },
  },
  [Archetype.AthleticDT]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 5) },
    weight: { min: 285, max: 310 },
    fortyTime: { min: 4.75, max: 4.95 },
  },

  // LB Archetypes
  [Archetype.RunStopper]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 240, max: 260 },
    fortyTime: { min: 4.65, max: 4.85 },
  },
  [Archetype.CoverageLB]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 2) },
    weight: { min: 225, max: 245 },
    fortyTime: { min: 4.45, max: 4.65 },
  },
  [Archetype.PassRusherLB]: {
    height: { min: feetInchesToInches(6, 2), max: feetInchesToInches(6, 5) },
    weight: { min: 240, max: 260 },
    fortyTime: { min: 4.50, max: 4.70 },
  },
  [Archetype.FieldGeneralLB]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 235, max: 255 },
    fortyTime: { min: 4.60, max: 4.80 },
  },
  [Archetype.HybridLB]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 230, max: 250 },
    fortyTime: { min: 4.55, max: 4.75 },
  },
  [Archetype.AthleticLB]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 225, max: 250 },
    fortyTime: { min: 4.40, max: 4.60 },
  },

  // CB Archetypes
  [Archetype.ManCover]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 2) },
    weight: { min: 185, max: 205 },
    fortyTime: { min: 4.35, max: 4.50 },
  },
  [Archetype.ZoneCover]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 1) },
    weight: { min: 185, max: 205 },
    fortyTime: { min: 4.40, max: 4.55 },
  },
  [Archetype.BallHawkCB]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 1) },
    weight: { min: 180, max: 200 },
    fortyTime: { min: 4.35, max: 4.50 },
  },
  [Archetype.Physical]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 195, max: 215 },
    fortyTime: { min: 4.45, max: 4.60 },
  },
  [Archetype.SlotCorner]: {
    height: { min: feetInchesToInches(5, 9), max: feetInchesToInches(5, 11) },
    weight: { min: 180, max: 195 },
    fortyTime: { min: 4.38, max: 4.52 },
  },
  [Archetype.HybridCB]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 1) },
    weight: { min: 185, max: 205 },
    fortyTime: { min: 4.40, max: 4.55 },
  },

  // S Archetypes
  [Archetype.FreeSafety]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 2) },
    weight: { min: 195, max: 210 },
    fortyTime: { min: 4.38, max: 4.52 },
  },
  [Archetype.StrongSafety]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 210, max: 225 },
    fortyTime: { min: 4.48, max: 4.62 },
  },
  [Archetype.HybridS]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 2) },
    weight: { min: 200, max: 220 },
    fortyTime: { min: 4.43, max: 4.58 },
  },
  [Archetype.BallHawkS]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 2) },
    weight: { min: 195, max: 215 },
    fortyTime: { min: 4.40, max: 4.55 },
  },
  [Archetype.Enforcer]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 210, max: 230 },
    fortyTime: { min: 4.50, max: 4.65 },
  },
  [Archetype.CoverageS]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 1) },
    weight: { min: 190, max: 210 },
    fortyTime: { min: 4.35, max: 4.50 },
  },

  // K Archetypes
  [Archetype.AccurateK]: {
    height: { min: feetInchesToInches(5, 9), max: feetInchesToInches(6, 1) },
    weight: { min: 175, max: 200 },
  },
  [Archetype.PowerK]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 4) },
    weight: { min: 200, max: 225 },
  },
  [Archetype.ClutchK]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 2) },
    weight: { min: 180, max: 210 },
  },
  [Archetype.BalancedK]: {
    height: { min: feetInchesToInches(5, 10), max: feetInchesToInches(6, 2) },
    weight: { min: 185, max: 210 },
  },
  [Archetype.KickoffSpecialist]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 195, max: 220 },
  },

  // P Archetypes
  [Archetype.AccurateP]: {
    height: { min: feetInchesToInches(5, 11), max: feetInchesToInches(6, 2) },
    weight: { min: 190, max: 215 },
  },
  [Archetype.PowerP]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 5) },
    weight: { min: 210, max: 235 },
  },
  [Archetype.Directional]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 200, max: 225 },
  },
  [Archetype.BalancedP]: {
    height: { min: feetInchesToInches(6, 0), max: feetInchesToInches(6, 3) },
    weight: { min: 200, max: 220 },
  },
  [Archetype.Hangtime]: {
    height: { min: feetInchesToInches(6, 1), max: feetInchesToInches(6, 4) },
    weight: { min: 205, max: 230 },
  },
};

/**
 * Get physical range for a specific archetype, falling back to position range
 */
export function getPhysicalRange(position: Position, archetype: Archetype): PhysicalRange {
  const archetypeRange = ARCHETYPE_PHYSICAL_RANGES[archetype];
  if (archetypeRange) {
    return archetypeRange;
  }
  return POSITION_PHYSICAL_RANGES[position];
}

/**
 * Generate random physical measurements within the given range
 */
export function generatePhysicals(
  position: Position,
  archetype: Archetype,
  randomFn: () => number = Math.random
): { height: number; weight: number; fortyTime: number } {
  const range = getPhysicalRange(position, archetype);

  const height = Math.round(
    range.height.min + randomFn() * (range.height.max - range.height.min)
  );

  const weight = Math.round(
    range.weight.min + randomFn() * (range.weight.max - range.weight.min)
  );

  // Generate fortyTime, using defaults if not defined for position
  const fortyRange = range.fortyTime || { min: 4.60, max: 5.20 };
  const fortyTime = Math.round(
    (fortyRange.min + randomFn() * (fortyRange.max - fortyRange.min)) * 100
  ) / 100;

  return { height, weight, fortyTime };
}

/**
 * Convert height in inches to display string (e.g., "6'2\"")
 */
export function heightToString(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
}

/**
 * Convert weight to display string (e.g., "215 lbs")
 */
export function weightToString(lbs: number): string {
  return `${lbs} lbs`;
}
