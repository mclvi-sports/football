'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SeasonState, GameResult } from '@/lib/season/types';
import { WeekSchedule, ScheduledGame } from '@/lib/schedule/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { LEAGUE_TEAMS } from '@/lib/data/teams';

// ============================================================================
// TYPES
// ============================================================================

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

// ============================================================================
// PROPS
// ============================================================================

interface ScheduleViewProps {
  // Mode controls layout
  mode: 'standalone' | 'embedded';

  // Data - required for schedule
  seasonState?: SeasonState;
  teamsMap?: Map<string, Team>;

  // Standalone mode options
  showWeekSelector?: boolean;

  // Embedded mode options
  maxHeight?: string;

  // Callbacks
  onGameClick?: (gameId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ScheduleView({
  mode,
  seasonState,
  teamsMap: providedTeamsMap,
  showWeekSelector = true,
  maxHeight = mode === 'embedded' ? '500px' : undefined,
  onGameClick,
}: ScheduleViewProps) {
  // Build teams map if not provided
  const teamsMap = providedTeamsMap || (() => {
    const map = new Map<string, Team>();
    LEAGUE_TEAMS.forEach((team) => {
      map.set(team.id, {
        id: team.id,
        abbrev: team.id,
        name: team.name,
        city: team.city,
      });
    });
    return map;
  })();

  const [selectedWeek, setSelectedWeek] = useState(seasonState?.week || 1);

  const weekSchedule: WeekSchedule | undefined = seasonState?.schedule?.find(
    (w: WeekSchedule) => w.week === selectedWeek
  );
  const completedGames: GameResult[] =
    seasonState?.completedGames?.filter((g: GameResult) => g.week === selectedWeek) || [];
  const hasCompletedGames = completedGames.length > 0;

  // Empty state
  if (!seasonState || !seasonState.schedule) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">
            {mode === 'standalone'
              ? 'Generate a season from the Full Game page first'
              : 'No schedule data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header - Standalone only */}
      {mode === 'standalone' && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Season Schedule</h3>
            <p className="text-sm text-zinc-400">
              Week {seasonState.week} of 18 | Season {seasonState.year}
            </p>
          </div>
        </div>
      )}

      {/* Week Selector */}
      {showWeekSelector && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedWeek((w: number) => Math.max(1, w - 1))}
                disabled={selectedWeek <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3">
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                >
                  {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>

                {selectedWeek === seasonState.week && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
                {selectedWeek < seasonState.week && (
                  <span className="text-xs bg-zinc-500/20 text-zinc-400 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedWeek((w: number) => Math.min(18, w + 1))}
                disabled={selectedWeek >= 18}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Games List Container */}
      <div
        className="space-y-4"
        style={{ maxHeight: maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
      >
        {/* Games for Selected Week */}
        {hasCompletedGames ? (
          /* Completed Games with Scores */
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Results
              </h3>
              <div className="space-y-2">
                {completedGames.map((game: GameResult) => {
                  const away = teamsMap.get(game.awayTeamId);
                  const home = teamsMap.get(game.homeTeamId);
                  const awayWon = game.awayScore > game.homeScore;
                  return (
                    <div
                      key={game.gameId}
                      onClick={() => onGameClick?.(game.gameId)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg bg-zinc-800/50',
                        onGameClick && 'cursor-pointer hover:bg-zinc-700/50'
                      )}
                    >
                      <div className="flex-1">
                        <div
                          className={cn(
                            'flex items-center justify-between',
                            awayWon ? 'font-bold' : 'text-zinc-400'
                          )}
                        >
                          <span>{away?.city || game.awayTeamId}</span>
                          <span className="text-lg">{game.awayScore}</span>
                        </div>
                        <div
                          className={cn(
                            'flex items-center justify-between',
                            !awayWon ? 'font-bold' : 'text-zinc-400'
                          )}
                        >
                          <span>{home?.city || game.homeTeamId}</span>
                          <span className="text-lg">{game.homeScore}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : weekSchedule ? (
          /* Upcoming Games */
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming Matchups
              </h3>
              <div className="space-y-2">
                {weekSchedule.games.map((game: ScheduledGame) => {
                  const away = teamsMap.get(game.awayTeamId);
                  const home = teamsMap.get(game.homeTeamId);
                  return (
                    <div
                      key={game.id}
                      onClick={() => onGameClick?.(game.id)}
                      className={cn(
                        'flex items-center justify-between p-2 rounded bg-zinc-800/50',
                        onGameClick && 'cursor-pointer hover:bg-zinc-700/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {away?.city || game.awayTeamId}
                        </span>
                        <span className="text-zinc-500">@</span>
                        <span className="font-medium">
                          {home?.city || game.homeTeamId}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 capitalize">
                        {game.timeSlot.replace(/_/g, ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
              {weekSchedule.byeTeams.length > 0 && (
                <div className="mt-3 text-xs text-zinc-500">
                  Bye: {weekSchedule.byeTeams.map((id: string) => teamsMap.get(id)?.city || id).join(', ')}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-zinc-400">No games scheduled for this week</p>
            </CardContent>
          </Card>
        )}

        {/* Week Summary Stats */}
        {hasCompletedGames && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xl font-bold">{completedGames.length}</div>
              <div className="text-xs text-zinc-400">Games</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xl font-bold">
                {completedGames.reduce((sum: number, g: GameResult) => sum + g.awayScore + g.homeScore, 0)}
              </div>
              <div className="text-xs text-zinc-400">Total Points</div>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-xl font-bold">
                {Math.round(
                  completedGames.reduce((sum: number, g: GameResult) => sum + g.awayScore + g.homeScore, 0) /
                    (completedGames.length * 2)
                )}
              </div>
              <div className="text-xs text-zinc-400">Avg PPG</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
