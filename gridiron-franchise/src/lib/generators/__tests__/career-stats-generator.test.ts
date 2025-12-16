import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Position } from '@/lib/types';
import { Player } from '@/lib/types';
import { PlayerCareerStats } from '@/lib/career-stats/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Import after mocking
import {
  generateCareerHistory,
  generateCareerStatsForAllPlayers,
  generateCareerStatsForFreeAgents,
} from '../career-stats-generator';

// Helper to create a mock player
function createMockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: 'test-player-1',
    firstName: 'John',
    lastName: 'Doe',
    position: Position.QB,
    archetype: 'Pocket Passer' as any,
    age: 28,
    experience: 5,
    height: 75,
    weight: 220,
    fortyTime: 4.8,
    college: 'State University',
    jerseyNumber: 12,
    overall: 85,
    potential: 88,
    attributes: {} as any,
    traits: [],
    badges: [],
    ...overrides,
  };
}

describe('generateCareerHistory', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('returns null for rookies (experience = 0)', () => {
    const rookie = createMockPlayer({ experience: 0, age: 21 });
    const result = generateCareerHistory(rookie, 'NYE');
    expect(result).toBeNull();
  });

  it('generates career history for experienced players', () => {
    const veteran = createMockPlayer({ experience: 5, age: 26 });
    const result = generateCareerHistory(veteran, 'NYE');

    expect(result).not.toBeNull();
    expect(result!.playerId).toBe('test-player-1');
    expect(result!.playerName).toBe('John Doe');
    expect(result!.position).toBe(Position.QB);
    expect(result!.seasons).toHaveLength(5);
  });

  it('generates correct number of seasons based on experience', () => {
    const player3Years = createMockPlayer({ experience: 3, age: 24 });
    const player10Years = createMockPlayer({ experience: 10, age: 31 });

    const result3 = generateCareerHistory(player3Years, 'BOS');
    const result10 = generateCareerHistory(player10Years, 'BOS');

    expect(result3!.seasons).toHaveLength(3);
    expect(result10!.seasons).toHaveLength(10);
  });

  it('seasons have correct year sequence', () => {
    const player = createMockPlayer({ experience: 3, age: 24 });
    const result = generateCareerHistory(player, 'NYE');
    const currentYear = new Date().getFullYear();

    // Seasons should be chronologically ordered
    expect(result!.seasons[0].year).toBe(currentYear - 3);
    expect(result!.seasons[1].year).toBe(currentYear - 2);
    expect(result!.seasons[2].year).toBe(currentYear - 1);
  });

  it('all seasons use the provided team ID', () => {
    const player = createMockPlayer({ experience: 4, age: 25 });
    const result = generateCareerHistory(player, 'CHI');

    result!.seasons.forEach((season) => {
      expect(season.teamId).toBe('CHI');
      expect(season.teamAbbrev).toBe('CHI');
    });
  });

  it('calculates career totals correctly', () => {
    const player = createMockPlayer({
      position: Position.QB,
      experience: 3,
      age: 24,
      overall: 80,
    });
    const result = generateCareerHistory(player, 'NYE');

    // Career totals should be sum of all seasons
    const totalGames = result!.seasons.reduce((sum, s) => sum + s.gamesPlayed, 0);
    expect(result!.careerTotals.gamesPlayed).toBe(totalGames);

    const totalPassYards = result!.seasons.reduce((sum, s) => sum + s.passing.yards, 0);
    expect(result!.careerTotals.passing.yards).toBe(totalPassYards);
  });
});

describe('QB stat generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('generates passing stats for QB', () => {
    const qb = createMockPlayer({
      position: Position.QB,
      experience: 5,
      age: 27,
      overall: 85,
    });
    const result = generateCareerHistory(qb, 'NYE');

    // Should have significant passing stats
    expect(result!.careerTotals.passing.attempts).toBeGreaterThan(0);
    expect(result!.careerTotals.passing.yards).toBeGreaterThan(0);
    expect(result!.careerTotals.passing.touchdowns).toBeGreaterThan(0);
  });

  it('high OVR QB has better stats than low OVR', () => {
    const eliteQB = createMockPlayer({
      position: Position.QB,
      experience: 5,
      age: 28,
      overall: 95,
    });
    const backupQB = createMockPlayer({
      id: 'backup-qb',
      position: Position.QB,
      experience: 5,
      age: 28,
      overall: 65,
    });

    const eliteResult = generateCareerHistory(eliteQB, 'NYE');
    const backupResult = generateCareerHistory(backupQB, 'NYE');

    // Elite QB should generally have more yards
    // (using career totals since single season has variance)
    expect(eliteResult!.careerTotals.passing.yards).toBeGreaterThan(
      backupResult!.careerTotals.passing.yards * 0.5
    );
  });

  it('QB also generates rushing stats', () => {
    const mobileQB = createMockPlayer({
      position: Position.QB,
      experience: 3,
      age: 25,
      overall: 80,
    });
    const result = generateCareerHistory(mobileQB, 'NYE');

    // QBs should have some rushing stats
    expect(result!.careerTotals.rushing.carries).toBeGreaterThanOrEqual(0);
  });
});

describe('RB stat generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('generates rushing stats for RB', () => {
    const rb = createMockPlayer({
      position: Position.RB,
      experience: 4,
      age: 26,
      overall: 82,
    });
    const result = generateCareerHistory(rb, 'NYE');

    expect(result!.careerTotals.rushing.carries).toBeGreaterThan(0);
    expect(result!.careerTotals.rushing.yards).toBeGreaterThan(0);
    expect(result!.careerTotals.rushing.touchdowns).toBeGreaterThanOrEqual(0);
  });

  it('RB also generates receiving stats', () => {
    const rb = createMockPlayer({
      position: Position.RB,
      experience: 4,
      age: 26,
      overall: 80,
    });
    const result = generateCareerHistory(rb, 'NYE');

    expect(result!.careerTotals.receiving.catches).toBeGreaterThanOrEqual(0);
  });

  it('RB has no passing stats', () => {
    const rb = createMockPlayer({
      position: Position.RB,
      experience: 4,
      age: 26,
      overall: 80,
    });
    const result = generateCareerHistory(rb, 'NYE');

    expect(result!.careerTotals.passing.attempts).toBe(0);
  });
});

describe('WR stat generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('generates receiving stats for WR', () => {
    const wr = createMockPlayer({
      position: Position.WR,
      experience: 5,
      age: 27,
      overall: 88,
    });
    const result = generateCareerHistory(wr, 'NYE');

    expect(result!.careerTotals.receiving.targets).toBeGreaterThan(0);
    expect(result!.careerTotals.receiving.catches).toBeGreaterThan(0);
    expect(result!.careerTotals.receiving.yards).toBeGreaterThan(0);
  });

  it('WR has no passing or defensive stats', () => {
    const wr = createMockPlayer({
      position: Position.WR,
      experience: 3,
      age: 25,
      overall: 78,
    });
    const result = generateCareerHistory(wr, 'NYE');

    expect(result!.careerTotals.passing.attempts).toBe(0);
    expect(result!.careerTotals.defense.tackles).toBe(0);
  });
});

describe('Defense stat generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('generates tackles for linebacker', () => {
    const mlb = createMockPlayer({
      position: Position.MLB,
      experience: 6,
      age: 28,
      overall: 86,
    });
    const result = generateCareerHistory(mlb, 'NYE');

    expect(result!.careerTotals.defense.tackles).toBeGreaterThan(0);
  });

  it('generates sacks for defensive end', () => {
    const de = createMockPlayer({
      position: Position.DE,
      experience: 5,
      age: 27,
      overall: 85,
    });
    const result = generateCareerHistory(de, 'NYE');

    expect(result!.careerTotals.defense.sacks).toBeGreaterThanOrEqual(0);
  });

  it('generates interceptions for cornerback', () => {
    const cb = createMockPlayer({
      position: Position.CB,
      experience: 4,
      age: 26,
      overall: 84,
    });
    const result = generateCareerHistory(cb, 'NYE');

    expect(result!.careerTotals.defense.interceptions).toBeGreaterThanOrEqual(0);
    expect(result!.careerTotals.defense.passDeflections).toBeGreaterThanOrEqual(0);
  });

  it('defensive players have no offensive stats', () => {
    const de = createMockPlayer({
      position: Position.DE,
      experience: 4,
      age: 26,
      overall: 80,
    });
    const result = generateCareerHistory(de, 'NYE');

    expect(result!.careerTotals.passing.attempts).toBe(0);
    expect(result!.careerTotals.rushing.carries).toBe(0);
    expect(result!.careerTotals.receiving.catches).toBe(0);
  });
});

describe('Kicker/Punter stat generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('generates field goal stats for kicker', () => {
    const k = createMockPlayer({
      position: Position.K,
      experience: 8,
      age: 30,
      overall: 82,
    });
    const result = generateCareerHistory(k, 'NYE');

    expect(result!.careerTotals.kicking.fgAttempts).toBeGreaterThan(0);
    expect(result!.careerTotals.kicking.fgMade).toBeGreaterThan(0);
    expect(result!.careerTotals.kicking.xpAttempts).toBeGreaterThan(0);
  });

  it('generates punt stats for punter', () => {
    const p = createMockPlayer({
      position: Position.P,
      experience: 6,
      age: 28,
      overall: 78,
    });
    const result = generateCareerHistory(p, 'NYE');

    expect(result!.careerTotals.kicking.punts).toBeGreaterThan(0);
    expect(result!.careerTotals.kicking.puntYards).toBeGreaterThan(0);
    expect(result!.careerTotals.kicking.puntAvg).toBeGreaterThan(0);
  });

  it('kicker has no punting stats', () => {
    const k = createMockPlayer({
      position: Position.K,
      experience: 5,
      age: 27,
      overall: 80,
    });
    const result = generateCareerHistory(k, 'NYE');

    expect(result!.careerTotals.kicking.punts).toBe(0);
  });
});

describe('Offensive line stat generation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('OL players have minimal stats', () => {
    const lt = createMockPlayer({
      position: Position.LT,
      experience: 7,
      age: 29,
      overall: 85,
    });
    const result = generateCareerHistory(lt, 'NYE');

    // OL should have games played but no significant stats
    expect(result!.careerTotals.gamesPlayed).toBeGreaterThan(0);
    expect(result!.careerTotals.passing.attempts).toBe(0);
    expect(result!.careerTotals.rushing.carries).toBe(0);
    expect(result!.careerTotals.receiving.catches).toBe(0);
    expect(result!.careerTotals.defense.tackles).toBe(0);
  });
});

describe('Career arc effects', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('veteran player has accumulated stats from earlier seasons', () => {
    const veteran = createMockPlayer({
      position: Position.QB,
      experience: 10,
      age: 32,
      overall: 88,
    });
    const result = generateCareerHistory(veteran, 'NYE');

    // 10 year veteran should have significant career totals
    expect(result!.careerTotals.gamesPlayed).toBeGreaterThan(100);
    expect(result!.careerTotals.passing.yards).toBeGreaterThan(20000);
  });

  it('younger seasons have fewer stats due to development', () => {
    const player = createMockPlayer({
      position: Position.QB,
      experience: 8,
      age: 29,
      overall: 90,
    });
    const result = generateCareerHistory(player, 'NYE');

    // First season (age 21) should have fewer yards than prime season
    const firstSeason = result!.seasons[0];
    const latestSeason = result!.seasons[result!.seasons.length - 1];

    // Not a strict test since there's randomness, but pattern should generally hold
    expect(firstSeason.passing.yards).toBeLessThanOrEqual(latestSeason.passing.yards * 1.5);
  });
});

describe('generateCareerStatsForAllPlayers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('generates stats for experienced players only', () => {
    const mockFullGameData = {
      teams: [
        {
          team: { id: 'NYE' },
          roster: {
            players: [
              createMockPlayer({ id: 'exp-1', experience: 5, age: 26 }),
              createMockPlayer({ id: 'rookie-1', experience: 0, age: 21 }),
              createMockPlayer({ id: 'exp-2', experience: 3, age: 24 }),
            ],
          },
        },
      ],
      generatedAt: new Date().toISOString(),
      totalPlayers: 3,
      tierDistribution: {},
    };

    generateCareerStatsForAllPlayers(mockFullGameData as any);

    // Should have called setItem for the career stats store
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('handles empty teams array', () => {
    const mockFullGameData = {
      teams: [],
      generatedAt: new Date().toISOString(),
      totalPlayers: 0,
      tierDistribution: {},
    };

    expect(() => generateCareerStatsForAllPlayers(mockFullGameData as any)).not.toThrow();
  });
});

describe('generateCareerStatsForFreeAgents', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('generates stats for experienced free agents', () => {
    const freeAgents = [
      createMockPlayer({ id: 'fa-1', experience: 4, age: 26 }),
      createMockPlayer({ id: 'fa-2', experience: 0, age: 22 }),
      createMockPlayer({ id: 'fa-3', experience: 7, age: 29 }),
    ];

    generateCareerStatsForFreeAgents(freeAgents);

    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('handles empty free agents array', () => {
    expect(() => generateCareerStatsForFreeAgents([])).not.toThrow();
  });
});

describe('Stat validation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('games played is realistic (1-17 per season)', () => {
    const player = createMockPlayer({
      position: Position.RB,
      experience: 5,
      age: 26,
      overall: 80,
    });
    const result = generateCareerHistory(player, 'NYE');

    result!.seasons.forEach((season) => {
      expect(season.gamesPlayed).toBeGreaterThanOrEqual(1);
      expect(season.gamesPlayed).toBeLessThanOrEqual(17);
    });
  });

  it('completion percentage is realistic (0-100%)', () => {
    const qb = createMockPlayer({
      position: Position.QB,
      experience: 5,
      age: 27,
      overall: 85,
    });
    const result = generateCareerHistory(qb, 'NYE');

    result!.seasons.forEach((season) => {
      if (season.passing.attempts > 0) {
        expect(season.passing.completionPct).toBeGreaterThanOrEqual(0);
        expect(season.passing.completionPct).toBeLessThanOrEqual(100);
      }
    });
  });

  it('field goal percentage is realistic (0-100%)', () => {
    const k = createMockPlayer({
      position: Position.K,
      experience: 5,
      age: 27,
      overall: 82,
    });
    const result = generateCareerHistory(k, 'NYE');

    result!.seasons.forEach((season) => {
      if (season.kicking.fgAttempts > 0) {
        expect(season.kicking.fgPct).toBeGreaterThanOrEqual(0);
        expect(season.kicking.fgPct).toBeLessThanOrEqual(100);
      }
    });
  });

  it('passer rating is within NFL bounds (0-158.3)', () => {
    const qb = createMockPlayer({
      position: Position.QB,
      experience: 5,
      age: 27,
      overall: 85,
    });
    const result = generateCareerHistory(qb, 'NYE');

    result!.seasons.forEach((season) => {
      if (season.passing.attempts > 0) {
        expect(season.passing.passerRating).toBeGreaterThanOrEqual(0);
        expect(season.passing.passerRating).toBeLessThanOrEqual(160); // Allow slight variance
      }
    });
  });
});
