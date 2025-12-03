'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScheduleView } from './schedule-view';
import { StandingsView } from './standings-view';
import { StatsView } from './stats-view';
import { PlayoffBracket } from './playoff-bracket';
import { SeasonState, TeamStanding, GameResult, PlayoffBracket as PlayoffBracketType } from '@/lib/season/types';
import { LEAGUE_TEAMS, TeamInfo } from '@/lib/data/teams';
import {
  Play,
  Pause,
  FastForward,
  SkipForward,
  Calendar,
  Trophy,
  BarChart3,
  ListOrdered,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRecord } from '@/lib/franchise/game-utils';

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

interface SeasonHubProps {
  seasonState: SeasonState | null;
  isSimulating: boolean;
  onSimulateWeek: () => void;
  onSimulateSeason: () => void;
  onSimulatePlayoffs?: () => void;
  onReset?: () => void;
}

export function SeasonHub({
  seasonState,
  isSimulating,
  onSimulateWeek,
  onSimulateSeason,
  onSimulatePlayoffs,
  onReset,
}: SeasonHubProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'standings' | 'stats' | 'playoffs'>(
    'schedule'
  );

  // Build teams map from LEAGUE_TEAMS
  const teamsMap = useMemo(() => {
    const map = new Map<string, Team>();
    LEAGUE_TEAMS.forEach((team: TeamInfo) => {
      map.set(team.id, {
        id: team.id,
        abbrev: team.id,
        name: team.name,
        city: team.city,
      });
    });
    return map;
  }, []);

  if (!seasonState) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-zinc-400">No Season Data</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Generate game data and start a season to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  const isRegularSeason = seasonState.phase === 'regular';
  const isPlayoffs = seasonState.phase === 'playoffs';
  const isComplete = seasonState.phase === 'offseason';
  const currentWeek = seasonState.week;
  const totalWeeks = 22; // 18 regular + 4 playoff weeks

  // Get summary stats
  const gamesPlayed = seasonState.completedGames.length;
  const totalPoints = seasonState.completedGames.reduce(
    (sum, g) => sum + g.awayScore + g.homeScore,
    0
  );

  return (
    <div className="space-y-4">
      {/* Season Header */}
      <Card className={cn(
        'border transition-colors',
        isComplete ? 'border-yellow-500/50 bg-yellow-500/5' :
        isPlayoffs ? 'border-purple-500/50 bg-purple-500/5' :
        'border-blue-500/50 bg-blue-500/5'
      )}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Season Info */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{seasonState.year} Season</h2>
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full uppercase',
                    isComplete
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : isPlayoffs
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                  )}
                >
                  {isComplete ? 'Complete' : isPlayoffs ? 'Playoffs' : `Week ${currentWeek}`}
                </span>
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                {gamesPlayed} games played · {totalPoints.toLocaleString()} total points
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2">
              {!isComplete && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onSimulateWeek}
                    disabled={isSimulating}
                  >
                    {isSimulating ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="mr-1 h-4 w-4" />
                    )}
                    Sim Week
                  </Button>

                  {isRegularSeason && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onSimulateSeason}
                      disabled={isSimulating}
                    >
                      <FastForward className="mr-1 h-4 w-4" />
                      Sim to Playoffs
                    </Button>
                  )}

                  {isPlayoffs && onSimulatePlayoffs && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onSimulatePlayoffs}
                      disabled={isSimulating}
                    >
                      <SkipForward className="mr-1 h-4 w-4" />
                      Sim Playoffs
                    </Button>
                  )}
                </>
              )}

              {isComplete && onReset && (
                <Button size="sm" variant="outline" onClick={onReset}>
                  Start New Season
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{currentWeek}</div>
          <div className="text-xs text-zinc-400">
            {isPlayoffs ? 'Playoff Week' : 'Week'}
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{gamesPlayed}</div>
          <div className="text-xs text-zinc-400">Games</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">
            {gamesPlayed > 0 ? (totalPoints / gamesPlayed).toFixed(1) : '0'}
          </div>
          <div className="text-xs text-zinc-400">Avg Total</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">
            {seasonState.injuries?.length || 0}
          </div>
          <div className="text-xs text-zinc-400">Injuries</div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="standings" className="flex items-center gap-1">
            <ListOrdered className="h-4 w-4" />
            <span className="hidden sm:inline">Standings</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="playoffs" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Playoffs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-4">
          <ScheduleView
            games={seasonState.completedGames}
            teams={teamsMap}
            currentWeek={Math.min(currentWeek, 18)}
            totalWeeks={18}
          />
        </TabsContent>

        <TabsContent value="standings" className="mt-4">
          <StandingsView standings={seasonState.standings} />
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <StatsView
            games={seasonState.completedGames}
            standings={seasonState.standings}
          />
        </TabsContent>

        <TabsContent value="playoffs" className="mt-4">
          <PlayoffBracket bracket={seasonState.playoffBracket} teams={teamsMap} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
