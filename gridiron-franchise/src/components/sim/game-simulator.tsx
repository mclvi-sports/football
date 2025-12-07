'use client';

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
import { DriveSummary } from '@/components/sim/drive-summary';
import { SimSpeedControl } from '@/components/sim/sim-speed-control';
import { ActiveEffects } from '@/components/sim/active-effects';
import { GameControls } from '@/components/sim/game-controls';
import { GameContextBadges } from '@/components/sim/game-context-badges';
import { useSimulator, GameResult } from '@/hooks/use-simulator';
import { SimTeam, PlayResult, GameType, Weather, HomeAdvantage, GameSimulatorConfig } from '@/lib/sim/types';

// ============================================================================
// TYPES
// ============================================================================

export interface GameSimulatorProps {
  /** Pre-selected away team (skip team selection) */
  awayTeam?: SimTeam;
  /** Pre-selected home team (skip team selection) */
  homeTeam?: SimTeam;
  /** Available teams for selection */
  teams?: SimTeam[];
  /** Component configuration */
  config?: GameSimulatorConfig;
  /** Callback when game ends */
  onGameEnd?: (result: GameResult) => void;
  /** Callback on each play */
  onPlayComplete?: (play: PlayResult) => void;
  /** Initial game settings */
  initialSettings?: {
    gameType?: GameType;
    weather?: Weather;
    homeAdvantage?: HomeAdvantage;
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function GameSimulator({
  awayTeam: presetAwayTeam,
  homeTeam: presetHomeTeam,
  teams = [],
  config = {},
  onGameEnd,
  onPlayComplete,
  initialSettings,
}: GameSimulatorProps) {
  // Merge config with defaults based on layout
  const {
    layout = 'full',
    showControls = true,
    showDebug: showDebugOption = layout === 'full',
    showSpeedControl = layout !== 'minimal',
    showDriveSummary = layout === 'full',
    showActiveEffects = layout === 'full',
    showTeamSelection = !presetAwayTeam && !presetHomeTeam,
    showGameSettings = layout !== 'minimal',
    showQuarterScores = layout === 'full',
    showContextBadges = layout !== 'minimal',
    header,
    hideHeader = layout === 'minimal',
  } = config;

  // Use the simulator hook
  const sim = useSimulator({
    awayTeam: presetAwayTeam,
    homeTeam: presetHomeTeam,
    gameType: initialSettings?.gameType,
    weather: initialSettings?.weather,
    homeAdvantage: initialSettings?.homeAdvantage,
    onGameEnd,
    onPlayComplete,
  });

  const {
    state,
    stats,
    plays,
    playerStats,
    isStarted,
    isGameOver,
    driveStats,
    quarterScores,
    activeEffects,
    simSpeed,
    isAutoPlay,
    showDebug,
    gameSettings,
    actions,
    isClutch,
    getFlashClass,
  } = sim;

  const { awayTeam, homeTeam, gameType, weather, homeAdvantage } = gameSettings;

  // Determine if we can start
  const canStart = !!awayTeam && !!homeTeam && awayTeam.id !== homeTeam.id;

  return (
    <div className={`space-y-4 transition-all duration-300 rounded-lg ${getFlashClass()}`}>
      {/* Header */}
      {!hideHeader && header && (
        <div className="flex items-center justify-center">
          {header}
        </div>
      )}

      {/* Game Setup Bar */}
      {(showTeamSelection || showGameSettings || showControls) && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              {/* Team Selection */}
              {showTeamSelection && teams.length > 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <TeamSelect
                      teams={teams}
                      selectedTeamId={awayTeam?.id || null}
                      onSelect={(id) => {
                        const team = teams.find((t) => t.id === id) || null;
                        actions.setAwayTeam(team);
                      }}
                      disabled={isStarted}
                      compact
                    />
                    <span className="text-lg font-bold text-zinc-500">@</span>
                    <TeamSelect
                      teams={teams}
                      selectedTeamId={homeTeam?.id || null}
                      onSelect={(id) => {
                        const team = teams.find((t) => t.id === id) || null;
                        actions.setHomeTeam(team);
                      }}
                      disabled={isStarted}
                      compact
                    />
                  </div>
                  <div className="hidden h-8 w-px bg-zinc-800 lg:block" />
                </>
              )}

              {/* Game Settings */}
              {showGameSettings && (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <Select
                      value={gameType}
                      onValueChange={(v) => actions.setGameType(v as GameType)}
                      disabled={isStarted}
                    >
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

                    <Select
                      value={weather}
                      onValueChange={(v) => actions.setWeather(v as Weather)}
                      disabled={isStarted}
                    >
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
                      onValueChange={(v) => actions.setHomeAdvantage(v as HomeAdvantage)}
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
                  <div className="hidden h-8 w-px bg-zinc-800 lg:block" />
                </>
              )}

              {/* Control Buttons */}
              {showControls && (
                <GameControls
                  isStarted={isStarted}
                  isGameOver={isGameOver}
                  canStart={canStart}
                  showDebugToggle={showDebugOption}
                  showDebug={showDebug}
                  onStartGame={actions.startGame}
                  onSimPlay={actions.simPlay}
                  onSimDrive={actions.simDrive}
                  onSimQuarter={actions.simQuarter}
                  onSimGame={actions.simGame}
                  onResetGame={actions.resetGame}
                  onToggleDebug={actions.setShowDebug}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Game View */}
        <div className="space-y-4">
          <Scoreboard
            state={state}
            awayTeam={awayTeam}
            homeTeam={homeTeam}
            isStarted={isStarted}
            quarterScores={showQuarterScores ? quarterScores : undefined}
          />

          {/* Context Badges */}
          {showContextBadges && (
            <GameContextBadges
              gameType={gameType}
              weather={weather}
              isClutch={isClutch()}
              hasCoaching={!!(awayTeam?.coachingStaff || homeTeam?.coachingStaff)}
              hasFacilities={!!(awayTeam?.facilities || homeTeam?.facilities)}
            />
          )}

          {/* Speed Control */}
          {showSpeedControl && isStarted && (
            <SimSpeedControl
              speed={simSpeed}
              isAutoPlay={isAutoPlay}
              onSpeedChange={actions.setSimSpeed}
              onAutoPlayChange={actions.setAutoPlay}
              disabled={isGameOver}
            />
          )}

          {/* Drive Summary */}
          {showDriveSummary && isStarted && (
            <DriveSummary
              drive={driveStats}
              awayAbbrev={awayTeam?.abbrev}
              homeAbbrev={homeTeam?.abbrev}
            />
          )}

          <FieldView
            state={state}
            awayAbbrev={awayTeam?.abbrev}
            homeAbbrev={homeTeam?.abbrev}
          />

          {/* Active Effects */}
          {showActiveEffects && isStarted && activeEffects.length > 0 && (
            <ActiveEffects effects={activeEffects} />
          )}

          {/* Play Log */}
          {layout !== 'minimal' && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm tracking-wider">PLAY-BY-PLAY</CardTitle>
                  <span className="text-xs text-zinc-500">{sim.simulator.plays} plays</span>
                </div>
              </CardHeader>
              <CardContent>
                <PlayLog plays={plays} showDebug={showDebug} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats */}
        {layout === 'full' && (
          <div className="space-y-4">
            <TeamStatsCard
              awayStats={stats.away}
              homeStats={stats.home}
              awayTeam={awayTeam}
              homeTeam={homeTeam}
            />
            <PlayerStatsCard
              playerStats={playerStats}
              awayTeam={awayTeam}
              homeTeam={homeTeam}
            />
          </div>
        )}
      </div>
    </div>
  );
}
