'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import { Play, FastForward, SkipForward, RotateCcw, Bug, Users, Building2 } from 'lucide-react';

export function GameSimulatorTab() {
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
    setIsStarted(true);
    setPlays([
      {
        type: 'kickoff',
        result: 'normal',
        description: `${sim.settings[sim.state.possession]!.name} wins the toss and receives.`,
        yards: 0,
        time: 0,
        possession: sim.state.possession,
      },
    ]);
    forceUpdate({});
  }, [awayTeam, homeTeam, gameType, weather, homeAdvantage]);

  const simPlay = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const result = sim.play();
    if (result) {
      setPlays((prev) => [result, ...prev]);
    }
    forceUpdate({});
  }, []);

  const simDrive = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const results = sim.simulateDrive();
    setPlays((prev) => [...results.reverse(), ...prev]);
    forceUpdate({});
  }, []);

  const simQuarter = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const results = sim.simulateQuarter();
    setPlays((prev) => [...results.reverse(), ...prev]);
    forceUpdate({});
  }, []);

  const simGame = useCallback(() => {
    const sim = getSimulator();
    if (sim.state.isOver) return;

    const results = sim.simulateGame();
    setPlays((prev) => [...results.reverse(), ...prev]);
    forceUpdate({});
  }, []);

  const resetGame = useCallback(() => {
    const sim = getSimulator();
    sim.reset();
    setIsStarted(false);
    setPlays([]);
    forceUpdate({});
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-zinc-500">Loading teams...</div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-zinc-500">No teams found. Generate rosters first using the Setup tab.</p>
        </CardContent>
      </Card>
    );
  }

  const sim = getSimulator();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-wider">GAME SIMULATOR</h2>
        <p className="text-xs tracking-widest text-zinc-500">
          TEAM OVR | BADGES | TRAITS | WEATHER | HOME FIELD
        </p>
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

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        {/* Left Column - Game View */}
        <div className="space-y-4">
          <Scoreboard
            state={sim.state}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
            isStarted={isStarted}
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

          <FieldView state={sim.state} />

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

        {/* Right Column - Stats Stacked Vertically */}
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
