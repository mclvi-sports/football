'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SeasonState } from '@/lib/season/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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
// SCHEDULE SECTION COMPONENT
// ============================================================================

interface ScheduleSectionProps {
  seasonState: SeasonState;
  teamsMap: Map<string, Team>;
}

export function ScheduleSection({ seasonState, teamsMap }: ScheduleSectionProps) {
  const [selectedWeek, setSelectedWeek] = useState(seasonState.week);

  const weekSchedule = seasonState.schedule?.find(w => w.week === selectedWeek);
  const completedGames = seasonState.completedGames?.filter(g => g.week === selectedWeek) || [];
  const hasCompletedGames = completedGames.length > 0;

  return (
    <div className="space-y-4">
      {/* Week Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek(w => Math.max(1, w - 1))}
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
              onClick={() => setSelectedWeek(w => Math.min(18, w + 1))}
              disabled={selectedWeek >= 18}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Games for Selected Week */}
      {hasCompletedGames ? (
        /* Completed Games with Scores */
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-zinc-400 mb-3">Results</h3>
            <div className="space-y-2">
              {completedGames.map((game) => {
                const away = teamsMap.get(game.awayTeamId);
                const home = teamsMap.get(game.homeTeamId);
                const awayWon = game.awayScore > game.homeScore;
                return (
                  <div
                    key={game.gameId}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50"
                  >
                    <div className="flex-1">
                      <div className={cn(
                        "flex items-center justify-between",
                        awayWon ? "font-bold" : "text-zinc-400"
                      )}>
                        <span>{away?.city || game.awayTeamId}</span>
                        <span className="text-lg">{game.awayScore}</span>
                      </div>
                      <div className={cn(
                        "flex items-center justify-between",
                        !awayWon ? "font-bold" : "text-zinc-400"
                      )}>
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
              {weekSchedule.games.map((game) => {
                const away = teamsMap.get(game.awayTeamId);
                const home = teamsMap.get(game.homeTeamId);
                return (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-2 rounded bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{away?.city || game.awayTeamId}</span>
                      <span className="text-zinc-500">@</span>
                      <span className="font-medium">{home?.city || game.homeTeamId}</span>
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
                Bye: {weekSchedule.byeTeams.map(id => teamsMap.get(id)?.city || id).join(', ')}
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
              {completedGames.reduce((sum, g) => sum + g.awayScore + g.homeScore, 0)}
            </div>
            <div className="text-xs text-zinc-400">Total Points</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xl font-bold">
              {Math.round(
                completedGames.reduce((sum, g) => sum + g.awayScore + g.homeScore, 0) /
                  (completedGames.length * 2)
              )}
            </div>
            <div className="text-xs text-zinc-400">Avg PPG</div>
          </div>
        </div>
      )}
    </div>
  );
}
