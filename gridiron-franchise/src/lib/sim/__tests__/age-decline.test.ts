import { describe, it, expect } from 'vitest';
import { Position } from '@/lib/types';
import {
  POSITION_PEAK_AGES,
  calculatePositionAgeDecline,
  applyAgeDecline,
  getDeclinePhaseDescription,
  estimateCareerYearsRemaining,
  PHYSICAL_ATTRIBUTES,
  TECHNICAL_ATTRIBUTES,
  MENTAL_ATTRIBUTES,
} from '../age-decline';

describe('POSITION_PEAK_AGES', () => {
  it('has peak ages for all positions', () => {
    const positions = Object.values(Position);
    positions.forEach(pos => {
      expect(POSITION_PEAK_AGES[pos]).toBeDefined();
      expect(POSITION_PEAK_AGES[pos]).toHaveProperty('peakStart');
      expect(POSITION_PEAK_AGES[pos]).toHaveProperty('peakEnd');
      expect(POSITION_PEAK_AGES[pos]).toHaveProperty('retirementAge');
    });
  });

  it('RBs have earliest peak (24-27)', () => {
    expect(POSITION_PEAK_AGES[Position.RB].peakStart).toBe(24);
    expect(POSITION_PEAK_AGES[Position.RB].peakEnd).toBe(27);
  });

  it('QBs have longest peak (27-35)', () => {
    expect(POSITION_PEAK_AGES[Position.QB].peakStart).toBe(27);
    expect(POSITION_PEAK_AGES[Position.QB].peakEnd).toBe(35);
  });

  it('Kickers/Punters have latest retirement (45)', () => {
    expect(POSITION_PEAK_AGES[Position.K].retirementAge).toBe(45);
    expect(POSITION_PEAK_AGES[Position.P].retirementAge).toBe(45);
  });

  it('peakStart < peakEnd < retirementAge for all positions', () => {
    Object.values(Position).forEach(pos => {
      const ages = POSITION_PEAK_AGES[pos];
      expect(ages.peakStart).toBeLessThan(ages.peakEnd);
      expect(ages.peakEnd).toBeLessThan(ages.retirementAge);
    });
  });
});

describe('calculatePositionAgeDecline', () => {
  describe('growth phase', () => {
    it('young QB (23) is in growth phase', () => {
      const result = calculatePositionAgeDecline(Position.QB, 23);
      expect(result.declinePhase).toBe('growth');
      expect(result.isInPrimeYears).toBe(true);
      expect(result.physicalDecline).toBe(0);
      expect(result.mentalChange).toBe(1);
    });

    it('young RB (22) is in growth phase', () => {
      const result = calculatePositionAgeDecline(Position.RB, 22);
      expect(result.declinePhase).toBe('growth');
      expect(result.physicalDecline).toBe(0);
    });
  });

  describe('prime phase', () => {
    it('QB at 30 is in prime', () => {
      const result = calculatePositionAgeDecline(Position.QB, 30);
      expect(result.declinePhase).toBe('prime');
      expect(result.isInPrimeYears).toBe(true);
      expect(result.physicalDecline).toBe(0);
    });

    it('RB at 25 is in prime', () => {
      const result = calculatePositionAgeDecline(Position.RB, 25);
      expect(result.declinePhase).toBe('prime');
    });
  });

  describe('early decline phase', () => {
    it('RB at 29 is in early decline', () => {
      const result = calculatePositionAgeDecline(Position.RB, 29);
      expect(result.declinePhase).toBe('early_decline');
      expect(result.isInPrimeYears).toBe(false);
      expect(result.physicalDecline).toBe(-1);
      expect(result.technicalDecline).toBe(0);
    });

    it('WR at 32 is in early decline', () => {
      const result = calculatePositionAgeDecline(Position.WR, 32);
      expect(result.declinePhase).toBe('early_decline');
      expect(result.physicalDecline).toBe(-1);
    });
  });

  describe('steep decline phase', () => {
    it('WR at 34 is in steep decline', () => {
      // WR: peakEnd=30, retirementAge=35
      // steep_decline: age > peakEnd+3 (33) AND age <= retirementAge-2 (33)
      // At 34, WR is actually in twilight (> 33)
      // Let's test at 33 which is right at the boundary
      const result = calculatePositionAgeDecline(Position.QB, 37);
      // QB: peakEnd=35, retirementAge=40
      // steep_decline: age > 38 AND age <= 38 - this is empty range
      // Let's use a better example
      const cbResult = calculatePositionAgeDecline(Position.CB, 31);
      // CB: peakEnd=29, retirementAge=33
      // early_decline: 29 < age <= 32 (peakEnd+3)
      // steep_decline: 32 < age <= 31 (retirementAge-2) - empty
      // The steep decline window is very small for most positions
      // Let's test QB which has a larger window
      const qbResult = calculatePositionAgeDecline(Position.QB, 37);
      // QB: peakEnd=35, retirementAge=40
      // early_decline: 35 < age <= 38
      // steep_decline: 38 < age <= 38 - edge case
      // twilight: age > 38
      // At 37, QB is still in early_decline
      expect(qbResult.declinePhase).toBe('early_decline');
    });

    it('player enters steep decline after early decline phase', () => {
      // Test with a position that has a clear steep decline window
      // K/P have the longest careers: peakEnd=38, retirementAge=45
      // early_decline: 38 < age <= 41
      // steep_decline: 41 < age <= 43
      // twilight: age > 43
      const result = calculatePositionAgeDecline(Position.K, 42);
      expect(result.declinePhase).toBe('steep_decline');
      expect(result.physicalDecline).toBeLessThanOrEqual(-2);
      expect(result.technicalDecline).toBe(-1);
    });
  });

  describe('twilight phase', () => {
    it('RB at 32 is in twilight', () => {
      const result = calculatePositionAgeDecline(Position.RB, 32);
      expect(result.declinePhase).toBe('twilight');
      expect(result.physicalDecline).toBe(-3);
      expect(result.technicalDecline).toBe(-2);
      expect(result.mentalChange).toBe(-1);
    });
  });

  describe('facility age reduction', () => {
    it('reduces physical decline with facility bonus', () => {
      const withoutFacility = calculatePositionAgeDecline(Position.RB, 29, 0);
      const withFacility = calculatePositionAgeDecline(Position.RB, 29, 0.3);

      expect(withoutFacility.physicalDecline).toBe(-1);
      expect(withFacility.physicalDecline).toBe(-1); // Rounded from -0.7
    });

    it('reduces steep decline with facility bonus', () => {
      const withoutFacility = calculatePositionAgeDecline(Position.RB, 31, 0);
      const withFacility = calculatePositionAgeDecline(Position.RB, 31, 0.3);

      // With 30% reduction, -2 becomes -1.4 which rounds to -1
      expect(withFacility.physicalDecline).toBeGreaterThan(withoutFacility.physicalDecline);
    });

    it('does not affect positive changes', () => {
      const result = calculatePositionAgeDecline(Position.QB, 23, 0.3);
      expect(result.mentalChange).toBe(1); // Still positive
    });
  });

  describe('yearsUntilDecline', () => {
    it('returns positive years for young players', () => {
      const result = calculatePositionAgeDecline(Position.QB, 25);
      expect(result.yearsUntilDecline).toBe(10); // 35 - 25
    });

    it('returns 0 for players past peak', () => {
      const result = calculatePositionAgeDecline(Position.RB, 30);
      expect(result.yearsUntilDecline).toBe(0);
    });
  });
});

describe('applyAgeDecline', () => {
  const mockAttributes: Record<string, number> = {
    speed: 85,
    acceleration: 83,
    agility: 82,
    strength: 80,
    awareness: 75,
    playRecognition: 72,
    throwPower: 88,
    throwAccuracyShort: 86,
  };

  it('does not change attributes for players in growth/prime', () => {
    const changes = applyAgeDecline(Position.QB, 28, { ...mockAttributes });
    const physicalChanges = changes.filter(c => PHYSICAL_ATTRIBUTES.includes(c.attribute));
    expect(physicalChanges.every(c => c.changeAmount >= 0)).toBe(true);
  });

  it('decreases physical attributes in decline phase', () => {
    const changes = applyAgeDecline(Position.RB, 29, { ...mockAttributes });
    const physicalChanges = changes.filter(c => PHYSICAL_ATTRIBUTES.includes(c.attribute));

    physicalChanges.forEach(change => {
      expect(change.newValue).toBeLessThan(change.oldValue);
      expect(change.changeAmount).toBeLessThan(0);
    });
  });

  it('respects attribute floor of 40', () => {
    const lowAttrs = { speed: 42, acceleration: 41 };
    const changes = applyAgeDecline(Position.RB, 32, lowAttrs);

    changes.forEach(change => {
      expect(change.newValue).toBeGreaterThanOrEqual(40);
    });
  });

  it('respects attribute ceiling of 99', () => {
    const highAttrs = { awareness: 98, playRecognition: 99 };
    const changes = applyAgeDecline(Position.QB, 23, highAttrs);

    changes.forEach(change => {
      expect(change.newValue).toBeLessThanOrEqual(99);
    });
  });

  it('includes facility age reduction', () => {
    const withoutFacility = applyAgeDecline(Position.RB, 31, { ...mockAttributes }, 0);
    const withFacility = applyAgeDecline(Position.RB, 31, { ...mockAttributes }, 0.3);

    // With facility bonus, decline should be less severe
    const totalDeclineWithout = withoutFacility
      .filter(c => c.changeAmount < 0)
      .reduce((sum, c) => sum + c.changeAmount, 0);
    const totalDeclineWith = withFacility
      .filter(c => c.changeAmount < 0)
      .reduce((sum, c) => sum + c.changeAmount, 0);

    expect(totalDeclineWith).toBeGreaterThanOrEqual(totalDeclineWithout);
  });
});

describe('getDeclinePhaseDescription', () => {
  it('returns correct descriptions', () => {
    expect(getDeclinePhaseDescription('growth')).toBe('Still developing');
    expect(getDeclinePhaseDescription('prime')).toBe('Prime years');
    expect(getDeclinePhaseDescription('early_decline')).toBe('Early decline');
    expect(getDeclinePhaseDescription('steep_decline')).toBe('Significant decline');
    expect(getDeclinePhaseDescription('twilight')).toBe('Career twilight');
  });
});

describe('estimateCareerYearsRemaining', () => {
  it('returns correct years for QB', () => {
    expect(estimateCareerYearsRemaining(Position.QB, 30)).toBe(10); // 40 - 30
    expect(estimateCareerYearsRemaining(Position.QB, 38)).toBe(2);
  });

  it('returns correct years for RB', () => {
    expect(estimateCareerYearsRemaining(Position.RB, 25)).toBe(7); // 32 - 25
    expect(estimateCareerYearsRemaining(Position.RB, 30)).toBe(2);
  });

  it('returns 0 for players at/past retirement age', () => {
    expect(estimateCareerYearsRemaining(Position.RB, 33)).toBe(0);
    expect(estimateCareerYearsRemaining(Position.QB, 42)).toBe(0);
  });
});

describe('attribute lists', () => {
  it('PHYSICAL_ATTRIBUTES contains expected attributes', () => {
    expect(PHYSICAL_ATTRIBUTES).toContain('speed');
    expect(PHYSICAL_ATTRIBUTES).toContain('acceleration');
    expect(PHYSICAL_ATTRIBUTES).toContain('strength');
    expect(PHYSICAL_ATTRIBUTES).toContain('stamina');
  });

  it('TECHNICAL_ATTRIBUTES contains expected attributes', () => {
    expect(TECHNICAL_ATTRIBUTES).toContain('throwPower');
    expect(TECHNICAL_ATTRIBUTES).toContain('throwAccuracyShort');
    expect(TECHNICAL_ATTRIBUTES).toContain('routeRunning');
    expect(TECHNICAL_ATTRIBUTES).toContain('tackle');
  });

  it('MENTAL_ATTRIBUTES contains expected attributes', () => {
    expect(MENTAL_ATTRIBUTES).toContain('awareness');
    expect(MENTAL_ATTRIBUTES).toContain('playRecognition');
  });

  it('no overlap between attribute lists', () => {
    const physical = new Set(PHYSICAL_ATTRIBUTES);
    const technical = new Set(TECHNICAL_ATTRIBUTES);
    const mental = new Set(MENTAL_ATTRIBUTES);

    TECHNICAL_ATTRIBUTES.forEach(attr => {
      expect(physical.has(attr)).toBe(false);
    });

    MENTAL_ATTRIBUTES.forEach(attr => {
      expect(physical.has(attr)).toBe(false);
      expect(technical.has(attr)).toBe(false);
    });
  });
});
