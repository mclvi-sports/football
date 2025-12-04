/**
 * Slot OVR Tables - Position-specific OVR ranges by depth chart slot
 *
 * Each position has defined OVR ranges for each slot in the depth chart.
 * Slot 1 = best player at position, higher slots = depth.
 *
 * Source: FINAL-roster-generation-system.md
 */

import { Position, Tier } from '../types';

export interface SlotOvrRange {
  slot: number;
  role: string;
  min: number;
  max: number;
}

/**
 * Position-specific OVR ranges by slot number
 */
export const SLOT_OVR_TABLES: Record<Position, SlotOvrRange[]> = {
  // Quarterbacks (3)
  [Position.QB]: [
    { slot: 1, role: 'Starter', min: 78, max: 95 },
    { slot: 2, role: 'Backup', min: 68, max: 78 },
    { slot: 3, role: '3rd String', min: 58, max: 70 },
  ],

  // Running Backs (5)
  [Position.RB]: [
    { slot: 1, role: 'Feature Back', min: 80, max: 94 },
    { slot: 2, role: 'Complementary', min: 74, max: 84 },
    { slot: 3, role: '3rd Down/Backup', min: 68, max: 78 },
    { slot: 4, role: 'Depth', min: 60, max: 72 },
    { slot: 5, role: 'FB/Special Teams', min: 58, max: 68 },
  ],

  // Wide Receivers (6)
  [Position.WR]: [
    { slot: 1, role: 'Primary Target', min: 82, max: 96 },
    { slot: 2, role: 'Secondary Target', min: 78, max: 88 },
    { slot: 3, role: 'Slot/3rd Starter', min: 74, max: 84 },
    { slot: 4, role: 'Rotational', min: 68, max: 78 },
    { slot: 5, role: 'Depth', min: 62, max: 72 },
    { slot: 6, role: 'Bottom Roster', min: 58, max: 68 },
  ],

  // Tight Ends (3)
  [Position.TE]: [
    { slot: 1, role: 'Starter', min: 78, max: 92 },
    { slot: 2, role: 'Backup/TE2 Sets', min: 70, max: 80 },
    { slot: 3, role: 'Blocking/Depth', min: 62, max: 74 },
  ],

  // Left Tackle (2)
  [Position.LT]: [
    { slot: 1, role: 'Starting Left Tackle', min: 80, max: 95 },
    { slot: 2, role: 'Swing Tackle', min: 68, max: 78 },
  ],

  // Left Guard (2)
  [Position.LG]: [
    { slot: 1, role: 'Starting Left Guard', min: 78, max: 92 },
    { slot: 2, role: 'Backup Guard', min: 66, max: 76 },
  ],

  // Center (2)
  [Position.C]: [
    { slot: 1, role: 'Starting Center', min: 78, max: 92 },
    { slot: 2, role: 'Backup Center', min: 66, max: 76 },
  ],

  // Right Guard (2)
  [Position.RG]: [
    { slot: 1, role: 'Starting Right Guard', min: 78, max: 92 },
    { slot: 2, role: 'Backup Guard', min: 66, max: 76 },
  ],

  // Right Tackle (2)
  [Position.RT]: [
    { slot: 1, role: 'Starting Right Tackle', min: 78, max: 92 },
    { slot: 2, role: 'Swing Tackle', min: 66, max: 76 },
  ],

  // Defensive Ends (4)
  [Position.DE]: [
    { slot: 1, role: 'Starting Edge', min: 80, max: 95 },
    { slot: 2, role: 'Starting Edge', min: 78, max: 90 },
    { slot: 3, role: 'Rotational', min: 70, max: 80 },
    { slot: 4, role: 'Depth', min: 64, max: 74 },
  ],

  // Defensive Tackles (4)
  [Position.DT]: [
    { slot: 1, role: 'Starting NT/3-Tech', min: 80, max: 94 },
    { slot: 2, role: 'Starting DT', min: 76, max: 88 },
    { slot: 3, role: 'Rotational', min: 70, max: 80 },
    { slot: 4, role: 'Depth', min: 64, max: 74 },
  ],

  // Middle Linebackers (2)
  [Position.MLB]: [
    { slot: 1, role: 'Starting Mike', min: 80, max: 94 },
    { slot: 2, role: 'Backup Mike', min: 68, max: 78 },
  ],

  // Outside Linebackers (4)
  [Position.OLB]: [
    { slot: 1, role: 'Starting Will', min: 78, max: 92 },
    { slot: 2, role: 'Starting Sam', min: 76, max: 90 },
    { slot: 3, role: 'Rotational', min: 68, max: 78 },
    { slot: 4, role: 'Depth', min: 62, max: 72 },
  ],

  // Cornerbacks (6)
  [Position.CB]: [
    { slot: 1, role: 'CB1 Outside', min: 82, max: 96 },
    { slot: 2, role: 'CB2 Outside', min: 78, max: 88 },
    { slot: 3, role: 'Slot Corner', min: 74, max: 84 },
    { slot: 4, role: 'Rotational', min: 68, max: 78 },
    { slot: 5, role: 'Depth', min: 62, max: 72 },
    { slot: 6, role: 'Bottom Roster', min: 58, max: 68 },
  ],

  // Free Safeties (2)
  [Position.FS]: [
    { slot: 1, role: 'Starting Free Safety', min: 80, max: 94 },
    { slot: 2, role: 'Backup FS', min: 68, max: 78 },
  ],

  // Strong Safeties (2)
  [Position.SS]: [
    { slot: 1, role: 'Starting Strong Safety', min: 78, max: 92 },
    { slot: 2, role: 'Backup SS', min: 66, max: 76 },
  ],

  // Kicker (1)
  [Position.K]: [
    { slot: 1, role: 'Kicker', min: 72, max: 92 },
  ],

  // Punter (1)
  [Position.P]: [
    { slot: 1, role: 'Punter', min: 70, max: 90 },
  ],
};

/**
 * Team tier modifiers for OVR calculation
 */
export const TIER_MODIFIERS: Record<Tier, { min: number; max: number }> = {
  [Tier.Elite]: { min: 5, max: 8 },
  [Tier.Good]: { min: 3, max: 5 },
  [Tier.Average]: { min: 0, max: 0 },
  [Tier.BelowAverage]: { min: -5, max: -3 },
  [Tier.Rebuilding]: { min: -8, max: -5 },
};

/**
 * Expected star player counts (90+ OVR) by tier
 */
export const STAR_PLAYER_EXPECTATIONS: Record<Tier, { min: number; max: number }> = {
  [Tier.Elite]: { min: 4, max: 6 },
  [Tier.Good]: { min: 2, max: 4 },
  [Tier.Average]: { min: 1, max: 2 },
  [Tier.BelowAverage]: { min: 0, max: 1 },
  [Tier.Rebuilding]: { min: 0, max: 0 },
};

/**
 * Roster slot counts by position
 */
export const ROSTER_SLOT_COUNTS: Record<Position, number> = {
  [Position.QB]: 3,
  [Position.RB]: 5,  // +1 (includes FB types)
  [Position.WR]: 6,
  [Position.TE]: 3,
  [Position.LT]: 2,
  [Position.LG]: 2,
  [Position.C]: 2,
  [Position.RG]: 2,
  [Position.RT]: 2,
  [Position.DE]: 4,
  [Position.DT]: 4,
  [Position.MLB]: 2,
  [Position.OLB]: 4,
  [Position.CB]: 6,  // +1 (nickel/depth)
  [Position.FS]: 2,
  [Position.SS]: 2,
  [Position.K]: 1,
  [Position.P]: 1,
};

/**
 * Team OVR expectations by tier
 */
export const TEAM_OVR_RANGES: Record<Tier, { min: number; max: number }> = {
  [Tier.Elite]: { min: 86, max: 92 },
  [Tier.Good]: { min: 82, max: 86 },
  [Tier.Average]: { min: 78, max: 82 },
  [Tier.BelowAverage]: { min: 74, max: 78 },
  [Tier.Rebuilding]: { min: 70, max: 74 },
};

/**
 * Helper function to get OVR range for a specific position and slot
 */
export function getSlotOvrRange(position: Position, slot: number): SlotOvrRange | undefined {
  const slots = SLOT_OVR_TABLES[position];
  return slots.find((s) => s.slot === slot);
}

/**
 * Helper function to calculate target OVR for a slot with tier modifier
 */
export function calculateTargetOvr(
  position: Position,
  slot: number,
  tier: Tier,
  randomFn: () => number = Math.random
): number {
  const slotRange = getSlotOvrRange(position, slot);
  if (!slotRange) {
    throw new Error(`Invalid slot ${slot} for position ${position}`);
  }

  const tierMod = TIER_MODIFIERS[tier];
  const tierModifier = tierMod.min + randomFn() * (tierMod.max - tierMod.min);
  const baseOvr = slotRange.min + randomFn() * (slotRange.max - slotRange.min);
  const variance = (randomFn() - 0.5) * 4; // -2 to +2

  const targetOvr = Math.round(baseOvr + tierModifier + variance);
  return Math.max(55, Math.min(99, targetOvr));
}
