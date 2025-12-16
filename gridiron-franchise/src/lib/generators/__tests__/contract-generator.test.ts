import { describe, it, expect } from 'vitest';
import { Position, Player } from '@/lib/types';
import {
  VETERAN_MINIMUM,
  getMinimumSalary,
  calculateSalary,
  calculateContractLength,
  generateContract,
  calculateGuaranteedPortion,
  calculateDeadCapByYear,
  calculateDeadCap,
  Contract,
} from '../contract-generator';

describe('VETERAN_MINIMUM', () => {
  it('has correct values for all experience levels', () => {
    expect(VETERAN_MINIMUM[0]).toBe(0.75);
    expect(VETERAN_MINIMUM[1]).toBe(0.87);
    expect(VETERAN_MINIMUM[2]).toBe(0.95);
    expect(VETERAN_MINIMUM[3]).toBe(1.02);
    expect(VETERAN_MINIMUM[4]).toBe(1.10);
    expect(VETERAN_MINIMUM[5]).toBe(1.17);
    expect(VETERAN_MINIMUM[6]).toBe(1.24);
    expect(VETERAN_MINIMUM[7]).toBe(1.30);
  });
});

describe('getMinimumSalary', () => {
  it('returns correct minimum for each experience level', () => {
    expect(getMinimumSalary(0)).toBe(0.75);
    expect(getMinimumSalary(1)).toBe(0.87);
    expect(getMinimumSalary(2)).toBe(0.95);
    expect(getMinimumSalary(3)).toBe(1.02);
    expect(getMinimumSalary(4)).toBe(1.10);
    expect(getMinimumSalary(5)).toBe(1.17);
    expect(getMinimumSalary(6)).toBe(1.24);
    expect(getMinimumSalary(7)).toBe(1.30);
  });

  it('caps at 7+ years experience', () => {
    expect(getMinimumSalary(8)).toBe(1.30);
    expect(getMinimumSalary(10)).toBe(1.30);
    expect(getMinimumSalary(15)).toBe(1.30);
  });
});

describe('calculateSalary', () => {
  it('returns minimum salary for low OVR players', () => {
    const salary = calculateSalary(60, Position.WR, 0);
    expect(salary).toBe(0.75); // Rookie minimum
  });

  it('returns minimum salary for sub-65 OVR', () => {
    const salary = calculateSalary(64, Position.RB, 3);
    expect(salary).toBe(1.02); // 3-year vet minimum
  });

  it('returns salary within expected range for high OVR', () => {
    // 95+ OVR range: 30-55M base, with variance
    const salaries: number[] = [];
    for (let i = 0; i < 20; i++) {
      salaries.push(calculateSalary(95, Position.WR, 5));
    }

    // All should be above minimum
    salaries.forEach(s => expect(s).toBeGreaterThan(20));
    // Should have some variance
    const uniqueSalaries = new Set(salaries);
    expect(uniqueSalaries.size).toBeGreaterThan(1);
  });

  it('gives QBs higher salaries (position premium)', () => {
    const qbSalaries: number[] = [];
    const wrSalaries: number[] = [];

    for (let i = 0; i < 50; i++) {
      qbSalaries.push(calculateSalary(90, Position.QB, 5));
      wrSalaries.push(calculateSalary(90, Position.WR, 5));
    }

    const avgQB = qbSalaries.reduce((a, b) => a + b, 0) / qbSalaries.length;
    const avgWR = wrSalaries.reduce((a, b) => a + b, 0) / wrSalaries.length;

    // QBs (0.8 modifier) should average higher than WRs (0.6 modifier)
    expect(avgQB).toBeGreaterThan(avgWR);
  });

  it('respects OVR salary tiers', () => {
    // Higher OVR should mean higher salary on average
    const tier90Salaries: number[] = [];
    const tier75Salaries: number[] = [];

    for (let i = 0; i < 30; i++) {
      tier90Salaries.push(calculateSalary(90, Position.MLB, 3));
      tier75Salaries.push(calculateSalary(75, Position.MLB, 3));
    }

    const avg90 = tier90Salaries.reduce((a, b) => a + b, 0) / tier90Salaries.length;
    const avg75 = tier75Salaries.reduce((a, b) => a + b, 0) / tier75Salaries.length;

    expect(avg90).toBeGreaterThan(avg75);
  });

  it('never returns below veteran minimum', () => {
    for (let i = 0; i < 50; i++) {
      const salary = calculateSalary(70, Position.P, 5);
      expect(salary).toBeGreaterThanOrEqual(getMinimumSalary(5));
    }
  });
});

describe('calculateContractLength', () => {
  it('gives franchise cornerstone deals to young elite players', () => {
    const lengths: number[] = [];
    for (let i = 0; i < 50; i++) {
      lengths.push(calculateContractLength(92, 25, 1));
    }

    // Should all be 4 or 5 years
    lengths.forEach(l => expect(l).toBeGreaterThanOrEqual(4));
    lengths.forEach(l => expect(l).toBeLessThanOrEqual(5));
  });

  it('gives shorter deals to older players', () => {
    const youngLengths: number[] = [];
    const oldLengths: number[] = [];

    for (let i = 0; i < 30; i++) {
      youngLengths.push(calculateContractLength(85, 26, 1));
      oldLengths.push(calculateContractLength(85, 33, 1));
    }

    const avgYoung = youngLengths.reduce((a, b) => a + b, 0) / youngLengths.length;
    const avgOld = oldLengths.reduce((a, b) => a + b, 0) / oldLengths.length;

    expect(avgYoung).toBeGreaterThan(avgOld);
  });

  it('gives 1-year deals to depth players (slot >= 3)', () => {
    for (let i = 0; i < 20; i++) {
      const length = calculateContractLength(72, 28, 3);
      expect(length).toBe(1);
    }
  });

  it('gives 1-year deals to veterans 32+', () => {
    for (let i = 0; i < 20; i++) {
      const length = calculateContractLength(72, 34, 1);
      expect(length).toBe(1);
    }
  });

  it('returns 1-2 years for low OVR starters', () => {
    const lengths: number[] = [];
    for (let i = 0; i < 30; i++) {
      lengths.push(calculateContractLength(72, 27, 1));
    }

    lengths.forEach(l => {
      expect(l).toBeGreaterThanOrEqual(1);
      expect(l).toBeLessThanOrEqual(2);
    });
  });
});

describe('generateContract', () => {
  const mockPlayer = (overrides: Partial<Player> = {}): Player => ({
    id: 'test-player',
    firstName: 'Test',
    lastName: 'Player',
    position: Position.WR,
    archetype: 'DeepThreat' as Player['archetype'],
    overall: 80,
    potential: 85,
    age: 26,
    experience: 3,
    height: 72,
    weight: 200,
    fortyTime: 4.45,
    jerseyNumber: 88,
    college: 'Test U',
    attributes: {} as Player['attributes'],
    traits: [],
    badges: [],
    ...overrides,
  });

  it('returns contract with years and salary', () => {
    const player = mockPlayer({ overall: 85, age: 27, experience: 4 });
    const contract = generateContract(player, 1);

    expect(contract).toHaveProperty('years');
    expect(contract).toHaveProperty('salary');
    expect(contract.years).toBeGreaterThanOrEqual(1);
    expect(contract.salary).toBeGreaterThan(0);
  });

  it('elite young players get long expensive contracts', () => {
    const elitePlayer = mockPlayer({
      overall: 95,
      age: 25,
      experience: 3,
      position: Position.QB,
    });

    const contracts: { years: number; salary: number }[] = [];
    for (let i = 0; i < 20; i++) {
      contracts.push(generateContract(elitePlayer, 1));
    }

    const avgYears = contracts.reduce((a, c) => a + c.years, 0) / contracts.length;
    const avgSalary = contracts.reduce((a, c) => a + c.salary, 0) / contracts.length;

    expect(avgYears).toBeGreaterThanOrEqual(4);
    expect(avgSalary).toBeGreaterThan(30); // Elite QB should be 30M+
  });

  it('backup players get short cheap contracts', () => {
    const backupPlayer = mockPlayer({
      overall: 68,
      age: 29,
      experience: 6,
      position: Position.RB,
    });

    const contract = generateContract(backupPlayer, 3);

    expect(contract.years).toBe(1);
    expect(contract.salary).toBeLessThan(5);
  });

  it('uses slot parameter for contract length', () => {
    const player = mockPlayer({ overall: 72, age: 28, experience: 5 });

    // Slot 3 should always give 1-year deal
    for (let i = 0; i < 10; i++) {
      const contract = generateContract(player, 3);
      expect(contract.years).toBe(1);
    }
  });

  it('includes guaranteedMoney field', () => {
    const player = mockPlayer({ overall: 90, age: 27 });
    const contract = generateContract(player, 1);

    expect(contract).toHaveProperty('guaranteedMoney');
    expect(contract.guaranteedMoney).toBeGreaterThan(0);
    expect(contract.guaranteedMoney).toBeLessThanOrEqual(contract.totalValue);
  });

  it('includes signingBonus field', () => {
    const player = mockPlayer({ overall: 90, age: 27 });
    const contract = generateContract(player, 1);

    expect(contract).toHaveProperty('signingBonus');
    expect(contract.signingBonus).toBeGreaterThanOrEqual(0);
    expect(contract.signingBonus).toBeLessThanOrEqual(contract.guaranteedMoney);
  });

  it('includes deadCapByYear array', () => {
    const player = mockPlayer({ overall: 90, age: 27 });
    const contract = generateContract(player, 1);

    expect(contract).toHaveProperty('deadCapByYear');
    expect(Array.isArray(contract.deadCapByYear)).toBe(true);
    expect(contract.deadCapByYear.length).toBe(contract.years);
  });

  it('includes totalValue and averageAnnualValue', () => {
    const player = mockPlayer({ overall: 85, age: 28 });
    const contract = generateContract(player, 1);

    expect(contract).toHaveProperty('totalValue');
    expect(contract).toHaveProperty('averageAnnualValue');
    expect(contract.totalValue).toBe(contract.salary * contract.years);
    expect(contract.averageAnnualValue).toBe(contract.salary);
  });
});

describe('calculateGuaranteedPortion (CONTRACT-002)', () => {
  it('elite players (90+) get 50-80% guaranteed', () => {
    const portions: number[] = [];
    for (let i = 0; i < 50; i++) {
      portions.push(calculateGuaranteedPortion(95, Position.QB));
    }

    portions.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0.50);
      expect(p).toBeLessThanOrEqual(0.90); // With premium position bonus
    });
  });

  it('good players (80-89) get 30-60% guaranteed', () => {
    const portions: number[] = [];
    for (let i = 0; i < 50; i++) {
      portions.push(calculateGuaranteedPortion(85, Position.MLB));
    }

    portions.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0.30);
      expect(p).toBeLessThanOrEqual(0.60);
    });
  });

  it('average players (70-79) get 10-40% guaranteed', () => {
    const portions: number[] = [];
    for (let i = 0; i < 50; i++) {
      portions.push(calculateGuaranteedPortion(75, Position.RB));
    }

    portions.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0.10);
      expect(p).toBeLessThanOrEqual(0.40);
    });
  });

  it('low OVR players (<70) get 0-10% guaranteed', () => {
    const portions: number[] = [];
    for (let i = 0; i < 50; i++) {
      portions.push(calculateGuaranteedPortion(65, Position.TE));
    }

    portions.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(0.10);
    });
  });

  it('premium positions get higher guaranteed portions', () => {
    const premiumPortions: number[] = [];
    const nonPremiumPortions: number[] = [];

    for (let i = 0; i < 100; i++) {
      premiumPortions.push(calculateGuaranteedPortion(85, Position.QB));
      nonPremiumPortions.push(calculateGuaranteedPortion(85, Position.RB));
    }

    const avgPremium = premiumPortions.reduce((a, b) => a + b) / premiumPortions.length;
    const avgNonPremium = nonPremiumPortions.reduce((a, b) => a + b) / nonPremiumPortions.length;

    expect(avgPremium).toBeGreaterThan(avgNonPremium);
  });
});

describe('calculateDeadCapByYear (CONTRACT-003)', () => {
  it('returns array with correct length', () => {
    const deadCap = calculateDeadCapByYear(4, 20, 40, 10);
    expect(deadCap.length).toBe(4);
  });

  it('year 1 has highest dead cap', () => {
    const deadCap = calculateDeadCapByYear(4, 20, 40, 10);
    expect(deadCap[0]).toBeGreaterThan(deadCap[1]);
    expect(deadCap[0]).toBeGreaterThan(deadCap[2]);
    expect(deadCap[0]).toBeGreaterThan(deadCap[3]);
  });

  it('dead cap decreases over years', () => {
    const deadCap = calculateDeadCapByYear(5, 25, 50, 15);

    for (let i = 0; i < deadCap.length - 1; i++) {
      expect(deadCap[i]).toBeGreaterThanOrEqual(deadCap[i + 1]);
    }
  });

  it('handles 1-year contracts', () => {
    const deadCap = calculateDeadCapByYear(1, 5, 3, 1);
    expect(deadCap.length).toBe(1);
    expect(deadCap[0]).toBeGreaterThan(0);
  });

  it('includes signing bonus proration', () => {
    const withBonus = calculateDeadCapByYear(4, 20, 40, 20);
    const withoutBonus = calculateDeadCapByYear(4, 20, 40, 0);

    // With signing bonus should have higher dead cap
    expect(withBonus[0]).toBeGreaterThan(withoutBonus[0]);
  });
});

describe('calculateDeadCap (CONTRACT-003)', () => {
  const mockContract: Contract = {
    years: 4,
    salary: 20,
    guaranteedMoney: 40,
    signingBonus: 10,
    deadCapByYear: [35, 25, 15, 5],
    totalValue: 80,
    averageAnnualValue: 20,
  };

  it('returns correct dead cap for each year remaining', () => {
    expect(calculateDeadCap(mockContract, 4)).toBe(35); // Year 1
    expect(calculateDeadCap(mockContract, 3)).toBe(25); // Year 2
    expect(calculateDeadCap(mockContract, 2)).toBe(15); // Year 3
    expect(calculateDeadCap(mockContract, 1)).toBe(5);  // Year 4
  });

  it('returns 0 for expired contracts', () => {
    expect(calculateDeadCap(mockContract, 0)).toBe(0);
    expect(calculateDeadCap(mockContract, -1)).toBe(0);
  });

  it('returns 0 for invalid years remaining', () => {
    expect(calculateDeadCap(mockContract, 5)).toBe(0);
    expect(calculateDeadCap(mockContract, 10)).toBe(0);
  });
});
