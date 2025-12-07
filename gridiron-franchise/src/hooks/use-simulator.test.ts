import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSimulator } from './use-simulator';
import { SimTeam } from '@/lib/sim/types';
import { generateTeamRoster } from '@/lib/generators/roster-generator';
import { adaptTeamRoster } from '@/lib/sim/team-adapter';
import { Tier, Position } from '@/lib/types';
import { TeamRosterData } from '@/lib/dev-player-store';

// Create test teams with real rosters and depth charts
const createTestTeam = (id: string, name: string): SimTeam => {
  const roster = generateTeamRoster(id, Tier.Average);
  const teamRosterData: TeamRosterData = {
    team: {
      id,
      city: 'Test City',
      name,
      conference: 'AFC',
      division: 'North',
    },
    tier: Tier.Average,
    roster: {
      players: roster.players,
      depthChart: roster.depthChart as Record<Position, string[]>,
    },
    stats: {
      totalPlayers: roster.players.length,
      avgOvr: Math.round(roster.players.reduce((sum, p) => sum + p.overall, 0) / roster.players.length),
      avgAge: Math.round(roster.players.reduce((sum, p) => sum + p.age, 0) / roster.players.length),
    },
  };
  return adaptTeamRoster(teamRosterData);
};

const awayTeam = createTestTeam('team-1', 'Away Team');
const homeTeam = createTestTeam('team-2', 'Home Team');

describe('useSimulator', () => {
  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useSimulator());

      expect(result.current.isStarted).toBe(false);
      expect(result.current.isGameOver).toBe(false);
      expect(result.current.plays).toEqual([]);
      expect(result.current.simSpeed).toBe(1);
      expect(result.current.isAutoPlay).toBe(false);
      expect(result.current.showDebug).toBe(false);
    });

    it('should accept initial teams via options', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      expect(result.current.gameSettings.awayTeam).toEqual(awayTeam);
      expect(result.current.gameSettings.homeTeam).toEqual(homeTeam);
    });

    it('should accept initial game settings', () => {
      const { result } = renderHook(() =>
        useSimulator({
          gameType: 'playoff',
          weather: 'snow',
          homeAdvantage: 'loud',
        })
      );

      expect(result.current.gameSettings.gameType).toBe('playoff');
      expect(result.current.gameSettings.weather).toBe('snow');
      expect(result.current.gameSettings.homeAdvantage).toBe('loud');
    });
  });

  describe('game settings actions', () => {
    it('should update away team', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setAwayTeam(awayTeam);
      });

      expect(result.current.gameSettings.awayTeam).toEqual(awayTeam);
    });

    it('should update home team', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setHomeTeam(homeTeam);
      });

      expect(result.current.gameSettings.homeTeam).toEqual(homeTeam);
    });

    it('should update game type', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setGameType('championship');
      });

      expect(result.current.gameSettings.gameType).toBe('championship');
    });

    it('should update weather', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setWeather('rain');
      });

      expect(result.current.gameSettings.weather).toBe('rain');
    });

    it('should update home advantage', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setHomeAdvantage('dome');
      });

      expect(result.current.gameSettings.homeAdvantage).toBe('dome');
    });
  });

  describe('playback controls', () => {
    it('should update sim speed', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setSimSpeed(2);
      });

      expect(result.current.simSpeed).toBe(2);
    });

    it('should toggle auto play', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setAutoPlay(true);
      });

      expect(result.current.isAutoPlay).toBe(true);

      act(() => {
        result.current.actions.setAutoPlay(false);
      });

      expect(result.current.isAutoPlay).toBe(false);
    });

    it('should toggle debug mode', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.setShowDebug(true);
      });

      expect(result.current.showDebug).toBe(true);
    });
  });

  describe('game actions', () => {
    it('should not start game without teams', () => {
      const { result } = renderHook(() => useSimulator());

      act(() => {
        result.current.actions.startGame();
      });

      expect(result.current.isStarted).toBe(false);
    });

    it('should start game with both teams', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      expect(result.current.isStarted).toBe(true);
      expect(result.current.plays.length).toBeGreaterThan(0);
      expect(result.current.plays[0].type).toBe('kickoff');
    });

    it('should simulate a play', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      const initialPlayCount = result.current.plays.length;

      act(() => {
        result.current.actions.simPlay();
      });

      expect(result.current.plays.length).toBeGreaterThan(initialPlayCount);
    });

    it('should simulate a drive', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      const initialPlayCount = result.current.plays.length;

      act(() => {
        result.current.actions.simDrive();
      });

      // A drive should add at least one play
      expect(result.current.plays.length).toBeGreaterThan(initialPlayCount);
    });

    it('should simulate a quarter', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      const initialQuarter = result.current.state.quarter;

      act(() => {
        result.current.actions.simQuarter();
      });

      // Quarter should advance or game should end
      expect(
        result.current.state.quarter > initialQuarter || result.current.isGameOver
      ).toBe(true);
    });

    it('should simulate entire game', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      act(() => {
        result.current.actions.simGame();
      });

      expect(result.current.isGameOver).toBe(true);
      expect(result.current.plays.length).toBeGreaterThan(10);
    });

    it('should reset game', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
        result.current.actions.simPlay();
      });

      expect(result.current.isStarted).toBe(true);
      expect(result.current.plays.length).toBeGreaterThan(0);

      act(() => {
        result.current.actions.resetGame();
      });

      expect(result.current.isStarted).toBe(false);
      expect(result.current.plays).toEqual([]);
      expect(result.current.quarterScores).toEqual({
        away: [0, 0, 0, 0],
        home: [0, 0, 0, 0],
      });
    });
  });

  describe('callbacks', () => {
    it('should call onPlayComplete after each play', () => {
      const onPlayComplete = vi.fn();

      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
          onPlayComplete,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      act(() => {
        result.current.actions.simPlay();
      });

      expect(onPlayComplete).toHaveBeenCalled();
    });

    it('should call onGameEnd when game finishes', () => {
      const onGameEnd = vi.fn();

      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
          onGameEnd,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      act(() => {
        result.current.actions.simGame();
      });

      expect(onGameEnd).toHaveBeenCalled();
      expect(onGameEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          winner: expect.any(String),
          awayScore: expect.any(Number),
          homeScore: expect.any(Number),
        })
      );
    });
  });

  describe('helpers', () => {
    it('should return flash class for touchdown', () => {
      const { result } = renderHook(() => useSimulator());

      // Flash type is internal, but getFlashClass should return empty by default
      expect(result.current.getFlashClass()).toBe('');
    });

    it('should check clutch status', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      // isClutch should return a boolean
      expect(typeof result.current.isClutch()).toBe('boolean');
    });
  });

  describe('drive tracking', () => {
    it('should track drive stats', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      act(() => {
        result.current.actions.simPlay();
      });

      expect(result.current.driveStats).toEqual(
        expect.objectContaining({
          plays: expect.any(Number),
          yards: expect.any(Number),
          timeElapsed: expect.any(Number),
          startPosition: expect.any(Number),
          possession: expect.any(String),
        })
      );
    });
  });

  describe('quarter scores', () => {
    it('should initialize quarter scores to zeros', () => {
      const { result } = renderHook(() => useSimulator());

      expect(result.current.quarterScores).toEqual({
        away: [0, 0, 0, 0],
        home: [0, 0, 0, 0],
      });
    });

    it('should reset quarter scores on game reset', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      act(() => {
        result.current.actions.resetGame();
      });

      expect(result.current.quarterScores).toEqual({
        away: [0, 0, 0, 0],
        home: [0, 0, 0, 0],
      });
    });

    it('should track quarter scores during game', () => {
      const { result } = renderHook(() =>
        useSimulator({
          awayTeam,
          homeTeam,
        })
      );

      act(() => {
        result.current.actions.startGame();
      });

      act(() => {
        result.current.actions.simGame();
      });

      // Quarter scores should sum to total scores after a full game
      const totalAway = result.current.quarterScores.away.reduce((a, b) => a + b, 0);
      const totalHome = result.current.quarterScores.home.reduce((a, b) => a + b, 0);

      expect(totalAway).toBe(result.current.state.awayScore);
      expect(totalHome).toBe(result.current.state.homeScore);
    });
  });
});
