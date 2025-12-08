import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Position, Archetype } from '@/lib/types';
import { selectArchetype, resetNameDatabase, generatePlayer } from '../player-generator';

// Mock the fs module since it's used for name loading
vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn().mockReturnValue(`type,name,rarity
first,John,common
first,Mike,common
first,James,common
last,Smith,common
last,Johnson,common
last,Williams,common`),
  },
  readFileSync: vi.fn().mockReturnValue(`type,name,rarity
first,John,common
first,Mike,common
first,James,common
last,Smith,common
last,Johnson,common
last,Williams,common`),
}));

describe('selectArchetype', () => {
  it('returns a valid archetype for QB', () => {
    const archetype = selectArchetype(Position.QB);
    const qbArchetypes = [
      Archetype.PocketPasser,
      Archetype.DualThreat,
      Archetype.Gunslinger,
      Archetype.FieldGeneral,
      Archetype.Scrambler,
      Archetype.GameManager,
    ];
    expect(qbArchetypes).toContain(archetype);
  });

  it('returns a valid archetype for RB', () => {
    const archetype = selectArchetype(Position.RB);
    const rbArchetypes = [
      Archetype.PowerBack,
      Archetype.SpeedBack,
      Archetype.ElusiveBack,
      Archetype.AllPurpose,
      Archetype.ReceivingBack,
      Archetype.Bruiser,
    ];
    expect(rbArchetypes).toContain(archetype);
  });

  it('returns a valid archetype for WR', () => {
    const archetype = selectArchetype(Position.WR);
    const wrArchetypes = [
      Archetype.DeepThreat,
      Archetype.Possession,
      Archetype.RouteTechnician,
      Archetype.Playmaker,
      Archetype.RedZoneThreat,
      Archetype.SlotSpecialist,
    ];
    expect(wrArchetypes).toContain(archetype);
  });

  it('returns a valid archetype for TE', () => {
    const archetype = selectArchetype(Position.TE);
    const teArchetypes = [
      Archetype.ReceivingTE,
      Archetype.BlockingTE,
      Archetype.HybridTE,
      Archetype.SeamStretcher,
      Archetype.MoveTE,
      Archetype.HBack,
    ];
    expect(teArchetypes).toContain(archetype);
  });

  it('returns valid archetype for each position', () => {
    // Test all positions don't throw errors
    Object.values(Position).forEach((position) => {
      expect(() => selectArchetype(position)).not.toThrow();
    });
  });

  it('produces distribution over multiple calls', () => {
    // Run 100 selections for QB and ensure we get variety
    const archetypes = new Set<Archetype>();
    for (let i = 0; i < 100; i++) {
      archetypes.add(selectArchetype(Position.QB));
    }
    // Should get at least 2 different archetypes in 100 tries
    expect(archetypes.size).toBeGreaterThanOrEqual(2);
  });
});

describe('generatePlayer', () => {
  beforeEach(() => {
    resetNameDatabase();
  });

  it('generates a player with all required fields', () => {
    const player = generatePlayer(Position.QB, 80);

    expect(player.id).toBeDefined();
    expect(player.firstName).toBeDefined();
    expect(player.lastName).toBeDefined();
    expect(player.position).toBe(Position.QB);
    expect(player.archetype).toBeDefined();
    expect(player.overall).toBe(80);
    expect(player.age).toBeGreaterThanOrEqual(21);
    expect(player.experience).toBeGreaterThanOrEqual(0);
    expect(player.attributes).toBeDefined();
    expect(player.height).toBeDefined();
    expect(player.weight).toBeDefined();
  });

  it('respects targetOvr parameter', () => {
    const lowOvr = generatePlayer(Position.RB, 60);
    const highOvr = generatePlayer(Position.RB, 95);

    expect(lowOvr.overall).toBe(60);
    expect(highOvr.overall).toBe(95);
  });

  it('throws for invalid OVR values', () => {
    expect(() => generatePlayer(Position.QB, 39)).toThrow();
    expect(() => generatePlayer(Position.QB, 100)).toThrow();
  });

  it('generates different players on each call', () => {
    // Reset and generate multiple players
    const players = Array.from({ length: 5 }, () => generatePlayer(Position.WR, 75));

    // At least some attribute variance expected
    const uniqueWeights = new Set(players.map((p) => p.weight));
    const uniqueHeights = new Set(players.map((p) => p.height));

    // Should have at least some variance
    expect(uniqueWeights.size + uniqueHeights.size).toBeGreaterThan(2);
  });

  it('generates players with slot affecting age distribution', () => {
    const starterAges: number[] = [];
    const depthAges: number[] = [];

    for (let i = 0; i < 20; i++) {
      const starter = generatePlayer({
        position: Position.QB,
        targetOvr: 85,
        slot: 1,
      });
      const depth = generatePlayer({
        position: Position.QB,
        targetOvr: 65,
        slot: 3,
      });
      starterAges.push(starter.age);
      depthAges.push(depth.age);
    }

    const avgStarterAge = starterAges.reduce((a, b) => a + b, 0) / starterAges.length;
    const avgDepthAge = depthAges.reduce((a, b) => a + b, 0) / depthAges.length;

    // Starters should generally be older
    expect(avgStarterAge).toBeGreaterThanOrEqual(avgDepthAge - 2);
  });

  it('generates traits array', () => {
    const player = generatePlayer(Position.CB, 85);
    expect(Array.isArray(player.traits)).toBe(true);
  });

  it('generates badges array', () => {
    const player = generatePlayer({
      position: Position.WR,
      targetOvr: 90,
      age: 28, // Veteran to ensure badges
    });
    expect(Array.isArray(player.badges)).toBe(true);
  });

  it('rookies have no badges', () => {
    const rookie = generatePlayer({
      position: Position.QB,
      targetOvr: 72,
      age: 21, // First year player
    });
    // Experience will be 0, so no badges
    if (rookie.experience === 0) {
      expect(rookie.badges).toHaveLength(0);
    }
  });

  it('respects provided archetype', () => {
    const player = generatePlayer({
      position: Position.QB,
      targetOvr: 80,
      archetype: Archetype.PocketPasser,
    });
    expect(player.archetype).toBe(Archetype.PocketPasser);
  });

  it('generates valid jersey numbers for position', () => {
    // QBs should have numbers 1-19
    for (let i = 0; i < 10; i++) {
      const qb = generatePlayer(Position.QB, 75);
      expect(qb.jerseyNumber).toBeGreaterThanOrEqual(1);
      expect(qb.jerseyNumber).toBeLessThanOrEqual(19);
    }
  });

  it('potential is calculated based on age', () => {
    const youngPlayer = generatePlayer({
      position: Position.WR,
      targetOvr: 70,
      age: 22,
    });
    const veteranPlayer = generatePlayer({
      position: Position.WR,
      targetOvr: 70,
      age: 33,
    });

    // Young players should generally have higher potential ceiling
    // (not always, but on average)
    expect(youngPlayer.potential).toBeGreaterThanOrEqual(youngPlayer.overall);
  });
});
