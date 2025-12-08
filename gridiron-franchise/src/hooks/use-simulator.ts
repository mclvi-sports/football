'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Simulator } from '@/lib/sim/simulator';
import {
  SimTeam,
  SimState,
  SimStats,
  PlayResult,
  GameType,
  Weather,
  HomeAdvantage,
  PlayerGameStats,
  TriggeredEffect,
} from '@/lib/sim/types';

// ============================================================================
// TYPES
// ============================================================================

export interface DriveStats {
  plays: number;
  yards: number;
  timeElapsed: number;
  startPosition: number;
  possession: 'away' | 'home' | null;
}

export interface QuarterScores {
  away: number[];
  home: number[];
}

export interface GameSettingsState {
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
  gameType: GameType;
  weather: Weather;
  homeAdvantage: HomeAdvantage;
}

export type FlashType = 'touchdown' | 'turnover' | 'big_play' | null;

export interface UseSimulatorOptions {
  /** Pre-selected away team */
  awayTeam?: SimTeam | null;
  /** Pre-selected home team */
  homeTeam?: SimTeam | null;
  /** Initial game type */
  gameType?: GameType;
  /** Initial weather */
  weather?: Weather;
  /** Initial home advantage */
  homeAdvantage?: HomeAdvantage;
  /** Callback when game ends */
  onGameEnd?: (result: GameResult) => void;
  /** Callback on each play */
  onPlayComplete?: (play: PlayResult) => void;
}

export interface GameResult {
  winner: 'away' | 'home' | 'tie';
  awayScore: number;
  homeScore: number;
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
  plays: PlayResult[];
  playerStats: PlayerGameStats[];
}

export interface UseSimulatorReturn {
  // Simulator access
  simulator: Simulator;

  // Game state
  state: SimState;
  stats: { away: SimStats; home: SimStats };
  plays: PlayResult[];
  playerStats: PlayerGameStats[];
  isStarted: boolean;
  isGameOver: boolean;

  // Tracking
  driveStats: DriveStats;
  quarterScores: QuarterScores;

  // Visual feedback
  activeEffects: TriggeredEffect[];
  flashType: FlashType;

  // Playback
  simSpeed: number;
  isAutoPlay: boolean;
  showDebug: boolean;

  // Settings (mutable before game starts)
  gameSettings: GameSettingsState;

  // Actions
  actions: {
    startGame: () => void;
    simPlay: () => void;
    simDrive: () => void;
    simQuarter: () => void;
    simGame: () => void;
    resetGame: () => void;
    setSimSpeed: (speed: number) => void;
    setAutoPlay: (enabled: boolean) => void;
    setShowDebug: (show: boolean) => void;
    setAwayTeam: (team: SimTeam | null) => void;
    setHomeTeam: (team: SimTeam | null) => void;
    setGameType: (type: GameType) => void;
    setWeather: (weather: Weather) => void;
    setHomeAdvantage: (advantage: HomeAdvantage) => void;
  };

  // Helpers
  isClutch: () => boolean;
  getFlashClass: () => string;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useSimulator(options: UseSimulatorOptions = {}): UseSimulatorReturn {
  const {
    awayTeam: initialAwayTeam = null,
    homeTeam: initialHomeTeam = null,
    gameType: initialGameType = 'regular',
    weather: initialWeather = 'clear',
    homeAdvantage: initialHomeAdvantage = 'normal',
    onGameEnd,
    onPlayComplete,
  } = options;

  // ============================================================================
  // REFS
  // ============================================================================

  const simulatorRef = useRef<Simulator>(new Simulator());
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevScoresRef = useRef<{ away: number; home: number }>({ away: 0, home: 0 });
  const driveRef = useRef<{
    startClock: number;
    startPosition: number;
    startPossession: 'away' | 'home' | null;
    yards: number;
    plays: number;
  }>({ startClock: 900, startPosition: 0, startPossession: null, yards: 0, plays: 0 });

  // ============================================================================
  // STATE
  // ============================================================================

  // Game settings
  const [awayTeam, setAwayTeam] = useState<SimTeam | null>(initialAwayTeam);
  const [homeTeam, setHomeTeam] = useState<SimTeam | null>(initialHomeTeam);
  const [gameType, setGameType] = useState<GameType>(initialGameType);
  const [weather, setWeather] = useState<Weather>(initialWeather);
  const [homeAdvantage, setHomeAdvantage] = useState<HomeAdvantage>(initialHomeAdvantage);

  // Game state
  const [isStarted, setIsStarted] = useState(false);
  const [plays, setPlays] = useState<PlayResult[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [quarterScores, setQuarterScores] = useState<QuarterScores>({
    away: [0, 0, 0, 0],
    home: [0, 0, 0, 0],
  });

  // Drive tracking
  const [driveStats, setDriveStats] = useState<DriveStats>({
    plays: 0,
    yards: 0,
    timeElapsed: 0,
    startPosition: 0,
    possession: null,
  });

  // Playback
  const [simSpeed, setSimSpeed] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Effects
  const [activeEffects, setActiveEffects] = useState<TriggeredEffect[]>([]);
  const [flashType, setFlashType] = useState<FlashType>(null);

  // Force re-render
  const [, forceUpdate] = useState({});

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const sim = simulatorRef.current;

  // ============================================================================
  // CALLBACKS
  // ============================================================================

  const checkForBigPlay = useCallback((result: PlayResult) => {
    if (result.result === 'touchdown') {
      setFlashType('touchdown');
      setTimeout(() => setFlashType(null), 1500);
    } else if (result.result === 'interception' || result.result === 'fumble') {
      setFlashType('turnover');
      setTimeout(() => setFlashType(null), 1500);
    } else if (result.yards >= 20 && (result.type === 'pass' || result.type === 'run')) {
      setFlashType('big_play');
      setTimeout(() => setFlashType(null), 1000);
    }
  }, []);

  const updateQuarterScores = useCallback(() => {
    const currentQuarter = Math.min(sim.state.quarter - 1, 4);

    const awayDiff = sim.state.awayScore - prevScoresRef.current.away;
    const homeDiff = sim.state.homeScore - prevScoresRef.current.home;

    if (awayDiff > 0 || homeDiff > 0) {
      setQuarterScores((prev) => {
        const newScores = {
          away: [...prev.away],
          home: [...prev.home],
        };
        while (newScores.away.length <= currentQuarter) {
          newScores.away.push(0);
          newScores.home.push(0);
        }
        newScores.away[currentQuarter] += awayDiff;
        newScores.home[currentQuarter] += homeDiff;
        return newScores;
      });
    }

    prevScoresRef.current = { away: sim.state.awayScore, home: sim.state.homeScore };
  }, [sim]);

  const updateDriveStats = useCallback(
    (playResult?: PlayResult) => {
      if (sim.state.possession !== driveRef.current.startPossession) {
        driveRef.current = {
          startClock: sim.state.clock,
          startPosition: sim.state.ball,
          startPossession: sim.state.possession,
          yards: 0,
          plays: 0,
        };
      }

      if (playResult && playResult.type !== 'kickoff') {
        driveRef.current.plays += 1;
        driveRef.current.yards += playResult.yards;
      }

      const timeElapsed = driveRef.current.startClock - sim.state.clock;

      setDriveStats({
        plays: driveRef.current.plays,
        yards: driveRef.current.yards,
        timeElapsed: timeElapsed > 0 ? timeElapsed : 0,
        startPosition: driveRef.current.startPosition,
        possession: sim.state.possession,
      });
    },
    [sim]
  );

  const startGame = useCallback(() => {
    if (!awayTeam || !homeTeam) return;

    sim.reset();
    sim.settings.away = awayTeam;
    sim.settings.home = homeTeam;
    sim.settings.gameType = gameType;
    sim.settings.weather = weather;
    sim.settings.homeAdvantage = homeAdvantage;

    sim.initializeGameModifiers();

    // Coin toss
    sim.state.possession = Math.random() < 0.5 ? 'away' : 'home';

    // Initialize drive tracking
    driveRef.current = {
      startClock: sim.state.clock,
      startPosition: sim.state.ball,
      startPossession: sim.state.possession,
      yards: 0,
      plays: 0,
    };

    setIsStarted(true);
    setPlays([
      {
        type: 'kickoff',
        result: 'normal',
        description: `${sim.settings[sim.state.possession]!.name} wins the toss and receives.`,
        yards: 0,
        time: 0,
        possession: sim.state.possession as 'away' | 'home',
      },
    ]);
    updateDriveStats();
    forceUpdate({});
  }, [awayTeam, homeTeam, gameType, weather, homeAdvantage, sim, updateDriveStats]);

  const simPlay = useCallback(() => {
    if (sim.state.isOver) return;

    const result = sim.play();
    if (result) {
      setPlays((prev) => [result, ...prev]);
      updateDriveStats(result);
      checkForBigPlay(result);

      if (result.triggeredEffects && result.triggeredEffects.length > 0) {
        setActiveEffects(result.triggeredEffects);
      }

      onPlayComplete?.(result);
    }
    updateQuarterScores();
    forceUpdate({});

    // Check if game ended
    if (sim.state.isOver && onGameEnd) {
      onGameEnd({
        winner: sim.getWinner(),
        awayScore: sim.state.awayScore,
        homeScore: sim.state.homeScore,
        awayTeam,
        homeTeam,
        plays,
        playerStats: sim.getPlayerGameStats(),
      });
    }
  }, [
    sim,
    updateQuarterScores,
    updateDriveStats,
    checkForBigPlay,
    onPlayComplete,
    onGameEnd,
    awayTeam,
    homeTeam,
    plays,
  ]);

  const simDrive = useCallback(() => {
    if (sim.state.isOver) return;

    const results = sim.simulateDrive();
    setPlays((prev) => [...results.reverse(), ...prev]);
    updateQuarterScores();
    updateDriveStats();
    forceUpdate({});
  }, [sim, updateQuarterScores, updateDriveStats]);

  const simQuarter = useCallback(() => {
    if (sim.state.isOver) return;

    const results = sim.simulateQuarter();
    setPlays((prev) => [...results.reverse(), ...prev]);
    updateQuarterScores();
    updateDriveStats();
    forceUpdate({});
  }, [sim, updateQuarterScores, updateDriveStats]);

  const simGame = useCallback(() => {
    if (sim.state.isOver) return;

    const results = sim.simulateGame();
    setPlays((prev) => [...results.reverse(), ...prev]);
    updateQuarterScores();
    updateDriveStats();
    forceUpdate({});

    if (onGameEnd) {
      onGameEnd({
        winner: sim.getWinner(),
        awayScore: sim.state.awayScore,
        homeScore: sim.state.homeScore,
        awayTeam,
        homeTeam,
        plays: [...results.reverse(), ...plays],
        playerStats: sim.getPlayerGameStats(),
      });
    }
  }, [sim, updateQuarterScores, updateDriveStats, onGameEnd, awayTeam, homeTeam, plays]);

  const resetGame = useCallback(() => {
    sim.reset();
    setIsStarted(false);
    setIsAutoPlay(false);
    setPlays([]);
    setQuarterScores({ away: [0, 0, 0, 0], home: [0, 0, 0, 0] });
    prevScoresRef.current = { away: 0, home: 0 };
    setDriveStats({ plays: 0, yards: 0, timeElapsed: 0, startPosition: 0, possession: null });
    driveRef.current = { startClock: 900, startPosition: 0, startPossession: null, yards: 0, plays: 0 };
    setActiveEffects([]);
    forceUpdate({});
  }, [sim]);

  const isClutch = useCallback(() => {
    return sim.isClutch();
  }, [sim]);

  const getFlashClass = useCallback(() => {
    switch (flashType) {
      case 'touchdown':
        return 'ring-4 ring-green-500 ring-opacity-75 animate-pulse';
      case 'turnover':
        return 'ring-4 ring-red-500 ring-opacity-75 animate-pulse';
      case 'big_play':
        return 'ring-2 ring-yellow-400 ring-opacity-50';
      default:
        return '';
    }
  }, [flashType]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlay && isStarted) {
      if (sim.state.isOver) {
        setIsAutoPlay(false);
        return;
      }

      const interval = Math.max(100, 1000 / simSpeed);

      autoPlayIntervalRef.current = setInterval(() => {
        if (sim.state.isOver) {
          setIsAutoPlay(false);
          if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
            autoPlayIntervalRef.current = null;
          }
          return;
        }

        const result = sim.play();
        if (result) {
          setPlays((prev) => [result, ...prev]);
          updateDriveStats(result);
          onPlayComplete?.(result);
        }
        updateQuarterScores();
        forceUpdate({});
      }, interval);

      return () => {
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current);
          autoPlayIntervalRef.current = null;
        }
      };
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }
  }, [isAutoPlay, isStarted, simSpeed, sim, updateQuarterScores, updateDriveStats, onPlayComplete]);

  // Sync initial teams if provided
  useEffect(() => {
    if (initialAwayTeam) setAwayTeam(initialAwayTeam);
    if (initialHomeTeam) setHomeTeam(initialHomeTeam);
  }, [initialAwayTeam, initialHomeTeam]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    simulator: sim,
    state: sim.state,
    stats: sim.stats,
    plays,
    playerStats: sim.getPlayerGameStats(),
    isStarted,
    isGameOver: sim.state.isOver,
    driveStats,
    quarterScores,
    activeEffects,
    flashType,
    simSpeed,
    isAutoPlay,
    showDebug,
    gameSettings: {
      awayTeam,
      homeTeam,
      gameType,
      weather,
      homeAdvantage,
    },
    actions: {
      startGame,
      simPlay,
      simDrive,
      simQuarter,
      simGame,
      resetGame,
      setSimSpeed,
      setAutoPlay: setIsAutoPlay,
      setShowDebug,
      setAwayTeam,
      setHomeTeam,
      setGameType,
      setWeather,
      setHomeAdvantage,
    },
    isClutch,
    getFlashClass,
  };
}
