'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Scoreboard } from '@/components/sim/scoreboard';
import { FieldView } from '@/components/sim/field-view';
import { PlayLog } from '@/components/sim/play-log';
import { TeamStatsCard, PlayerStatsCard } from '@/components/sim/stats-panel';
import { TeamSelect } from '@/components/sim/team-select';
import { Simulator } from '@/lib/sim/simulator';
import { adaptTeamRoster } from '@/lib/sim/team-adapter';
import { getFullGameData, TeamRosterData } from '@/lib/dev-player-store';
import { getTeamCoachingById } from '@/lib/coaching/coaching-store';
import { getTeamFacilitiesById } from '@/lib/facilities/facilities-store';
import { SimTeam, PlayResult, GameType, Weather, HomeAdvantage } from '@/lib/sim/types';
import { ArrowLeft, Play, FastForward, SkipForward, RotateCcw, Bug, Users, Building2 } from 'lucide-react';
import { DriveSummary } from '@/components/sim/drive-summary';
import { SimSpeedControl } from '@/components/sim/sim-speed-control';
import { ActiveEffects } from '@/components/sim/active-effects';
import { TriggeredEffect } from '@/lib/sim/types';

export default function SimulatorPage() {
  const router = useRouter();
  const simulatorRef = useRef<Simulator | null>(null);

  // Teams data
  const [teams, setTeams] = useState<SimTeam[]>([]);
  const [loading, setLoading] = useState(true);

  // Game settings
  const [awayTeamId, setAwayTeamId] = useState<string | null>(null);
  const [homeTeamId, setHomeTeamId] = useState<string | null>(null);
  const [gameType, setGameType] = useState<GameType>('regular');
  const [weather, setWeather] = useState<Weather>('clear');
  const [homeAdvantage, setHomeAdvantage] = useState<HomeAdvantage>('normal');

  // Game state
  const [isStarted, setIsStarted] = useState(false);
  const [plays, setPlays] = useState<PlayResult[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [quarterScores, setQuarterScores] = useState<{ away: number[]; home: number[] }>({
    away: [0, 0, 0, 0],
    home: [0, 0, 0, 0],
  });
  const prevScoresRef = useRef<{ away: number; home: number }>({ away: 0, home: 0 });

  // Drive tracking
  const [driveStats, setDriveStats] = useState<{
    plays: number;
    yards: number;
    timeElapsed: number;
    startPosition: number;
    possession: 'away' | 'home' | null;
  }>({
    plays: 0,
    yards: 0,
    timeElapsed: 0,
    startPosition: 0,
    possession: null,
  });
  const driveRef = useRef<{
    startClock: number;
    startPosition: number;
    startPossession: 'away' | 'home' | null;
    yards: number;
    plays: number;
  }>({ startClock: 900, startPosition: 0, startPossession: null, yards: 0, plays: 0 });

  // Simulation speed control
  const [simSpeed, setSimSpeed] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active effects from last play
  const [activeEffects, setActiveEffects] = useState<TriggeredEffect[]>([]);

  // Visual feedback for big plays
  const [flashType, setFlashType] = useState<'touchdown' | 'turnover' | 'big_play' | null>(null);

  // Force re-render for simulator state
  const [, forceUpdate] = useState({});

  // Load teams from full game data with coaching and facilities
  useEffect(() => {
    const fullGameData = getFullGameData();
    if (fullGameData && fullGameData.teams.length > 0) {
      const simTeams = fullGameData.teams.map((teamData: TeamRosterData) => {
        const simTeam = adaptTeamRoster(teamData);

        // Attach coaching staff if available
        const coaching = getTeamCoachingById(simTeam.id);
        if (coaching) {
          simTeam.coachingStaff = coaching;
        }

        // Attach facilities if available
        const facilities = getTeamFacilitiesById(simTeam.id);
        if (facilities) {
          simTeam.facilities = facilities;
        }

        return simTeam;
      });
      setTeams(simTeams);

      // Default selections
      if (simTeams.length >= 2) {
        setAwayTeamId(simTeams[0].id);
        setHomeTeamId(simTeams[1].id);
      }
    }
    setLoading(false);
  }, []);

  // Initialize simulator
  useEffect(() => {
    simulatorRef.current = new Simulator();
  }, []);

  const getSimulator = () => simulatorRef.current!;

  const awayTeam = teams.find((t) => t.id === awayTeamId) || null;
  const homeTeam = teams.find((t) => t.id === homeTeamId) || null;

  // Check for big plays and trigger visual feedback
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

  // Update quarter scores based on score changes
  const updateQuarterScores = useCallback(() => {
    const sim = getSimulator();
    const currentQuarter = Math.min(sim.state.quarter - 1, 4); // 0-indexed, cap at OT (4)

    const awayDiff = sim.state.awayScore - prevScoresRef.current.away;
    const homeDiff = sim.state.homeScore - prevScoresRef.current.home;

    if (awayDiff > 0 || homeDiff > 0) {
      setQuarterScores((prev) => {
        const newScores = {
          away: [...prev.away],
          home: [...prev.home],
        };
        // Ensure we have space for OT
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
  }, []);

  // Update drive stats after each play
  const updateDriveStats = useCallback((playResult?: PlayResult) => {
    const sim = getSimulator();

    // Check if possession changed (new drive)
    if (sim.state.possession !== driveRef.current.startPossession) {
      // Reset drive tracking
      driveRef.current = {
        startClock: sim.state.clock,
        startPosition: sim.state.ball,
        startPossession: sim.state.possession,
        yards: 0,
        plays: 0,
      };
    }

    // Update current drive stats
    if (playResult && playResult.type !== 'kickoff') {
      driveRef.current.plays += 1;
      driveRef.current.yards += playResult.yards;
    }

    // Calculate time elapsed in drive
    const timeElapsed = driveRef.current.startClock - sim.state.clock;

    setDriveStats({
      plays: driveRef.current.plays,
      yards: driveRef.current.yards,
      timeElapsed: timeElapsed > 0 ? timeElapsed : 0,
      startPosition: driveRef.current.startPosition,
      possession: sim.state.possession,
    });
  }, []);

  const startGame = useCallback(() => {
    if (!awayTeam || !homeTeam) return;

    const sim = getSimulator();
    sim.reset();
    sim.settings.away = awayTeam;
    sim.settings.home = homeTeam;
    sim.settings.gameType = gameType;
    sim.settings.weather = weather;
    sim.settings.homeAdvantage = homeAdvantage;

    // Initialize modifiers from coaching/facilities data
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
      },
    ]);
    updateDriveStats();
    forceUpdate({});
  }, [awayTeam, homeTeam, gameType, weather, homeAdvantage, updateDriveStats]);

  const simPlay = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const result = sim.play();
    if (result) {
      setPlays((prev) => [result, ...prev]);
      updateDriveStats(result);
      checkForBigPlay(result);
      // Update active effects from play result
      if (result.triggeredEffects && result.triggeredEffects.length > 0) {
        setActiveEffects(result.triggeredEffects);
      }
    }
    updateQuarterScores();
    forceUpdate({});
  }, [updateQuarterScores, updateDriveStats, checkForBigPlay]);

  const simDrive = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const results = sim.simulateDrive();
    setPlays((prev) => [...results.reverse(), ...prev]);
    updateQuarterScores();
    updateDriveStats();
    forceUpdate({});
  }, [updateQuarterScores, updateDriveStats]);

  const simQuarter = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const results = sim.simulateQuarter();
    setPlays((prev) => [...results.reverse(), ...prev]);
    updateQuarterScores();
    updateDriveStats();
    forceUpdate({});
  }, [updateQuarterScores, updateDriveStats]);

  const simGame = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const results = sim.simulateGame();
    setPlays((prev) => [...results.reverse(), ...prev]);
    updateQuarterScores();
    updateDriveStats();
    forceUpdate({});
  }, [updateQuarterScores, updateDriveStats]);

  const resetGame = useCallback(() => {
    const sim = getSimulator();
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
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlay && isStarted) {
      const sim = getSimulator();
      if (sim.state.isOver) {
        setIsAutoPlay(false);
        return;
      }

      // Calculate interval based on speed (base is 1000ms at 1x)
      const interval = Math.max(100, 1000 / simSpeed);

      autoPlayIntervalRef.current = setInterval(() => {
        const s = getSimulator();
        if (s.state.isOver) {
          setIsAutoPlay(false);
          if (autoPlayIntervalRef.current) {
            clearInterval(autoPlayIntervalRef.current);
            autoPlayIntervalRef.current = null;
          }
          return;
        }

        const result = s.play();
        if (result) {
          setPlays((prev) => [result, ...prev]);
          updateDriveStats(result);
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
  }, [isAutoPlay, isStarted, simSpeed, updateQuarterScores, updateDriveStats]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-zinc-500">Loading teams...</div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/dev-tools')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dev Tools
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">No teams found. Generate a full game first.</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/dev-tools/full')}>
              Go to Full Game Generator
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sim = getSimulator();

  // Flash animation classes
  const getFlashClass = () => {
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
  };

  return (
    <div className={`space-y-4 transition-all duration-300 rounded-lg ${getFlashClass()}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/dashboard/dev-tools')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wider">GRIDIRON ENGINE</h1>
          <p className="text-xs tracking-widest text-zinc-500">
            TEAM OVR | BADGES | TRAITS | WEATHER | HOME FIELD
          </p>
        </div>
        <div className="w-16" />
      </div>

      {/* Horizontal Game Setup Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4 lg:gap-6">
            {/* Team Selection */}
            <div className="flex items-center gap-3">
              <TeamSelect
                teams={teams}
                selectedTeamId={awayTeamId}
                onSelect={setAwayTeamId}
                disabled={isStarted}
                compact
              />
              <span className="text-lg font-bold text-zinc-500">@</span>
              <TeamSelect
                teams={teams}
                selectedTeamId={homeTeamId}
                onSelect={setHomeTeamId}
                disabled={isStarted}
                compact
              />
            </div>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-zinc-800 lg:block" />

            {/* Game Settings */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={gameType} onValueChange={(v) => setGameType(v as GameType)} disabled={isStarted}>
                <SelectTrigger className="w-28 border-zinc-700 bg-zinc-900 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-900">
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="primetime">Prime Time</SelectItem>
                  <SelectItem value="playoff">Playoff</SelectItem>
                  <SelectItem value="championship">Championship</SelectItem>
                </SelectContent>
              </Select>

              <Select value={weather} onValueChange={(v) => setWeather(v as Weather)} disabled={isStarted}>
                <SelectTrigger className="w-24 border-zinc-700 bg-zinc-900 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-900">
                  <SelectItem value="clear">Clear</SelectItem>
                  <SelectItem value="rain">Rain</SelectItem>
                  <SelectItem value="snow">Snow</SelectItem>
                  <SelectItem value="wind">Wind</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={homeAdvantage}
                onValueChange={(v) => setHomeAdvantage(v as HomeAdvantage)}
                disabled={isStarted}
              >
                <SelectTrigger className="w-28 border-zinc-700 bg-zinc-900 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-900">
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="loud">Loud</SelectItem>
                  <SelectItem value="dome">Dome</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-zinc-800 lg:block" />

            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              {!isStarted ? (
                <Button
                  className="bg-red-600 hover:bg-red-700 h-9"
                  onClick={startGame}
                  disabled={!awayTeam || !homeTeam || awayTeamId === homeTeamId}
                >
                  Start Game
                </Button>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={simPlay} disabled={sim.state.isOver}>
                    <Play className="mr-1 h-3 w-3" />
                    Play
                  </Button>
                  <Button variant="secondary" size="sm" onClick={simDrive} disabled={sim.state.isOver}>
                    <FastForward className="mr-1 h-3 w-3" />
                    Drive
                  </Button>
                  <Button variant="secondary" size="sm" onClick={simQuarter} disabled={sim.state.isOver}>
                    <SkipForward className="mr-1 h-3 w-3" />
                    Qtr
                  </Button>
                  <Button variant="secondary" size="sm" onClick={simGame} disabled={sim.state.isOver}>
                    <SkipForward className="mr-1 h-3 w-3" />
                    Game
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                onClick={resetGame}
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowDebug(!showDebug)}
              >
                <Bug className="mr-1 h-3 w-3" />
                {showDebug ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Stacked Layout */}
      <div className="space-y-6">
        {/* Game View */}
        <div className="space-y-4">
          <Scoreboard
            state={sim.state}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
            isStarted={isStarted}
            quarterScores={quarterScores}
          />

          {/* Context Badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded px-2 py-1 text-xs font-semibold tracking-wider ${
                gameType === 'primetime'
                  ? 'bg-yellow-400 text-zinc-900'
                  : gameType === 'playoff' || gameType === 'championship'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-700 text-white'
              }`}
            >
              {gameType.toUpperCase()}
            </span>
            {weather !== 'clear' && (
              <span className="rounded bg-zinc-600 px-2 py-1 text-xs font-semibold tracking-wider">
                {weather.toUpperCase()}
              </span>
            )}
            {sim.isClutch() && (
              <span className="rounded bg-purple-600 px-2 py-1 text-xs font-semibold tracking-wider">
                CLUTCH
              </span>
            )}
            {/* Module integration indicators */}
            {(awayTeam?.coachingStaff || homeTeam?.coachingStaff) && (
              <span className="flex items-center gap-1 rounded bg-green-700 px-2 py-1 text-xs font-semibold tracking-wider">
                <Users className="h-3 w-3" />
                COACHING
              </span>
            )}
            {(awayTeam?.facilities || homeTeam?.facilities) && (
              <span className="flex items-center gap-1 rounded bg-amber-700 px-2 py-1 text-xs font-semibold tracking-wider">
                <Building2 className="h-3 w-3" />
                FACILITIES
              </span>
            )}
          </div>

          {/* Speed Control */}
          {isStarted && (
            <SimSpeedControl
              speed={simSpeed}
              isAutoPlay={isAutoPlay}
              onSpeedChange={setSimSpeed}
              onAutoPlayChange={setIsAutoPlay}
              disabled={sim.state.isOver}
            />
          )}

          {/* Drive Summary */}
          {isStarted && (
            <DriveSummary
              drive={driveStats}
              awayAbbrev={awayTeam?.abbrev}
              homeAbbrev={homeTeam?.abbrev}
            />
          )}

          <FieldView
            state={sim.state}
            awayAbbrev={awayTeam?.abbrev}
            homeAbbrev={homeTeam?.abbrev}
          />

          {/* Active Effects */}
          {isStarted && activeEffects.length > 0 && (
            <ActiveEffects effects={activeEffects} />
          )}

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm tracking-wider">PLAY-BY-PLAY</CardTitle>
                <span className="text-xs text-zinc-500">{sim.plays} plays</span>
              </div>
            </CardHeader>
            <CardContent>
              <PlayLog plays={plays} showDebug={showDebug} />
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <TeamStatsCard
            awayStats={sim.stats.away}
            homeStats={sim.stats.home}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
          />
          <PlayerStatsCard
            playerStats={sim.getPlayerGameStats()}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
          />
        </div>
      </div>
    </div>
  );
}
