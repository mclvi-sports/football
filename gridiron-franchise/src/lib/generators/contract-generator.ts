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

// CONTRACT-001: Extended contract interface with guaranteed money and dead cap
export interface Contract {
  years: number;
  salary: number;
  // CONTRACT-001: New fields
  guaranteedMoney: number;
  signingBonus: number;
  deadCapByYear: number[]; // Dead cap for each remaining year
  totalValue: number;
  averageAnnualValue: number;
}

/**
 * CONTRACT-002: Calculate guaranteed portion based on position tier and OVR
 * Elite players (90+) get 50-70% guaranteed
 * Good players (80-89) get 30-50% guaranteed
 * Average players (70-79) get 10-30% guaranteed
 * Below average players get 0-10% guaranteed
 */
export function calculateGuaranteedPortion(ovr: number, position: Position): number {
  // Premium positions get higher guarantees
  const isPremium = [Position.QB, Position.DE, Position.WR, Position.LT, Position.CB].includes(position);
  const positionBonus = isPremium ? 0.10 : 0;

  if (ovr >= 90) {
    return 0.50 + Math.random() * 0.20 + positionBonus; // 50-70% (or 60-80% for premium)
  } else if (ovr >= 80) {
    return 0.30 + Math.random() * 0.20 + positionBonus; // 30-50%
  } else if (ovr >= 70) {
    return 0.10 + Math.random() * 0.20 + positionBonus; // 10-30%
  } else {
    return Math.random() * 0.10; // 0-10%
  }
}

/**
 * CONTRACT-003: Calculate dead cap by year
 * Dead cap = remaining guaranteed money + prorated signing bonus
 * Year 1 = full guaranteed + full signing bonus prorate
 * Each subsequent year, signing bonus prorate reduces
 */
export function calculateDeadCapByYear(
  years: number,
  salary: number,
  guaranteedMoney: number,
  signingBonus: number
): number[] {
  const deadCap: number[] = [];
  const yearlySigningBonusProrate = signingBonus / years;

  for (let year = 0; year < years; year++) {
    const remainingYears = years - year;

    // Guaranteed money accelerates in early years (typically years 1-2 are fully guaranteed)
    const guaranteedRemaining = year < Math.ceil(years / 2)
      ? guaranteedMoney * (remainingYears / years)
      : 0;

    // Signing bonus prorate for remaining years
    const signingBonusRemaining = yearlySigningBonusProrate * remainingYears;

    deadCap.push(Math.round((guaranteedRemaining + signingBonusRemaining) * 100) / 100);
  }

  return deadCap;
}

/**
 * Generate contract for a player
 * CONTRACT-001: Now includes guaranteed money, signing bonus, and dead cap
 */
export function generateContract(
  player: Player,
  slot: number = 1
): Contract {
  const years = calculateContractLength(player.overall, player.age, slot);
  const salary = calculateSalary(player.overall, player.position, player.experience);
  const totalValue = salary * years;

  // CONTRACT-002: Calculate guaranteed portion
  const guaranteedPortion = calculateGuaranteedPortion(player.overall, player.position);
  const guaranteedMoney = Math.round(totalValue * guaranteedPortion * 100) / 100;

  // Signing bonus is typically 20-40% of guaranteed money
  const signingBonusPortion = 0.20 + Math.random() * 0.20;
  const signingBonus = Math.round(guaranteedMoney * signingBonusPortion * 100) / 100;

  // CONTRACT-003: Calculate dead cap by year
  const deadCapByYear = calculateDeadCapByYear(years, salary, guaranteedMoney, signingBonus);

  return {
    years,
    salary,
    guaranteedMoney,
    signingBonus,
    deadCapByYear,
    totalValue,
    averageAnnualValue: salary,
  };
}

/**
 * CONTRACT-003: Calculate dead cap for cutting a player
 * Returns the dead cap amount if cut before contract ends
 */
export function calculateDeadCap(contract: Contract, yearsRemaining: number): number {
  if (yearsRemaining <= 0 || yearsRemaining > contract.years) return 0;
  const yearIndex = contract.years - yearsRemaining;
  return contract.deadCapByYear[yearIndex] || 0;
}
