/**
 * Contract Generator
 *
 * Standalone module for generating player contracts.
 * Used by roster generation, free agency, extensions, trades, and rookie signing.
 *
 * Source: FINAL-salarycap.md
 */

import { Position, Player } from '../types';

/**
 * Veteran minimum salary by experience (per FINALS)
 */
export const VETERAN_MINIMUM: Record<number, number> = {
  0: 0.75,
  1: 0.87,
  2: 0.95,
  3: 1.02,
  4: 1.10,
  5: 1.17,
  6: 1.24,
  7: 1.30,
};

/**
 * Get minimum salary based on experience (per FINALS)
 */
export function getMinimumSalary(experience: number): number {
  return VETERAN_MINIMUM[Math.min(experience, 7)] ?? 1.30;
}

/**
 * Calculate salary based on OVR and position (per FINALS salary by OVR)
 */
export function calculateSalary(ovr: number, position: Position, experience: number): number {
  const minimum = getMinimumSalary(experience);

  // OVR-based salary ranges from FINALS
  let minSalary: number;
  let maxSalary: number;

  if (ovr >= 95) {
    minSalary = 30; maxSalary = 55;
  } else if (ovr >= 90) {
    minSalary = 20; maxSalary = 35;
  } else if (ovr >= 85) {
    minSalary = 12; maxSalary = 22;
  } else if (ovr >= 80) {
    minSalary = 6; maxSalary = 14;
  } else if (ovr >= 75) {
    minSalary = 3; maxSalary = 8;
  } else if (ovr >= 70) {
    minSalary = 2; maxSalary = 4;
  } else if (ovr >= 65) {
    minSalary = 1; maxSalary = 2;
  } else {
    return minimum;
  }

  // Position-based premium (QBs get top of range)
  let positionModifier = 0.5; // Default to middle
  if (position === Position.QB) {
    positionModifier = 0.8;
  } else if ([Position.DE, Position.WR].includes(position)) {
    positionModifier = 0.6;
  } else if ([Position.LT, Position.CB].includes(position)) {
    positionModifier = 0.55;
  }

  const salary = minSalary + (maxSalary - minSalary) * positionModifier;

  // Add some variance (±15%)
  const variance = 0.85 + Math.random() * 0.30;
  return Math.max(minimum, Math.round(salary * variance * 100) / 100);
}

/**
 * Calculate contract length based on age and OVR (per FINALS)
 */
export function calculateContractLength(ovr: number, age: number, slot: number = 1): number {
  // Younger, higher OVR players get longer contracts
  if (ovr >= 90 && age <= 28) {
    return Math.random() < 0.6 ? 5 : 4; // Franchise cornerstone
  } else if (ovr >= 85 && age <= 30) {
    return Math.random() < 0.5 ? 4 : 3; // Core player
  } else if (ovr >= 80 && age <= 32) {
    return Math.random() < 0.5 ? 3 : 2; // Standard deal
  } else if (ovr >= 75) {
    return Math.random() < 0.6 ? 2 : 1; // Bridge contract
  } else if (slot >= 3 || age >= 32) {
    return 1; // Prove-it / veteran depth
  } else {
    return Math.random() < 0.5 ? 2 : 1;
  }
}

/**
 * Generate contract for a player
 */
export function generateContract(
  player: Player,
  slot: number = 1
): { years: number; salary: number } {
  const years = calculateContractLength(player.overall, player.age, slot);
  const salary = calculateSalary(player.overall, player.position, player.experience);

  return { years, salary };
}
