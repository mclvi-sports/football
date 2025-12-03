'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LeagueSchedule, ScheduledGame, WeekSchedule } from '@/lib/schedule/types';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SchedulePreviewModalProps {
  schedule: LeagueSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GAME_TYPE_COLORS: Record<string, string> = {
  division: 'bg-red-500/20 text-red-400 border-red-500/40',
  conference: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  inter_conference: 'bg-green-500/20 text-green-400 border-green-500/40',
  rotating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

const TIME_SLOT_LABELS: Record<string, string> = {
  thursday_night: 'TNF',
  early: 'Early',
  late: 'Late',
  sunday_night: 'SNF',
  monday_night: 'MNF',
};

const TIME_SLOT_COLORS: Record<string, string> = {
  thursday_night: 'bg-purple-500/20 text-purple-400',
  early: 'bg-zinc-500/20 text-zinc-400',
  late: 'bg-zinc-500/20 text-zinc-400',
  sunday_night: 'bg-yellow-500/20 text-yellow-400',
  monday_night: 'bg-orange-500/20 text-orange-400',
};

export function SchedulePreviewModal({
  schedule,
  open,
  onOpenChange,
}: SchedulePreviewModalProps) {
  const [selectedWeek, setSelectedWeek] = useState(1);

  if (!schedule) return null;

  const weekSchedule: WeekSchedule | null = schedule.weeks[selectedWeek - 1] || null;
  const totalGames = schedule.weeks.reduce((sum, w) => sum + w.games.length, 0);

  const GameCard = ({ game }: { game: ScheduledGame }) => (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold w-10">{game.awayTeamId}</span>
        <span className="text-zinc-500">@</span>
        <span className="font-bold w-10">{game.homeTeamId}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={cn('text-[10px] px-1 py-0.5 rounded border', GAME_TYPE_COLORS[game.gameType])}>
          {game.gameType.replace('_', ' ').slice(0, 3).toUpperCase()}
        </span>
        {game.isPrimeTime && (
          <span className={cn('text-[10px] px-1 py-0.5 rounded', TIME_SLOT_COLORS[game.timeSlot])}>
            {TIME_SLOT_LABELS[game.timeSlot]}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{schedule.season} Season Schedule</span>
            <span className="text-sm font-normal text-zinc-400">{totalGames} games</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Week Selector */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              disabled={selectedWeek <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Week {selectedWeek}</span>
              <span className="text-sm text-zinc-400">of 18</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedWeek(Math.min(18, selectedWeek + 1))}
              disabled={selectedWeek >= 18}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Week Pills */}
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={cn(
                  'w-8 h-8 rounded text-xs font-medium transition-all',
                  selectedWeek === week
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                )}
              >
                {week}
              </button>
            ))}
          </div>

          {weekSchedule && (
            <div className="space-y-3">
              {/* Bye Teams */}
              {weekSchedule.byeTeams.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="text-xs font-bold text-green-400 mb-2">Bye Week</div>
                  <div className="flex gap-2 flex-wrap">
                    {weekSchedule.byeTeams.map((teamId) => (
                      <span
                        key={teamId}
                        className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium"
                      >
                        {teamId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Thursday Night */}
              {weekSchedule.thursdayGame && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-400">Thursday Night</div>
                  <GameCard game={weekSchedule.thursdayGame} />
                </div>
              )}

              {/* Early Games */}
              {weekSchedule.earlyGames.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-zinc-400">
                    Early Games ({weekSchedule.earlyGames.length})
                  </div>
                  <div className="space-y-1">
                    {weekSchedule.earlyGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              )}

              {/* Late Games */}
              {weekSchedule.lateGames.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-zinc-400">
                    Late Games ({weekSchedule.lateGames.length})
                  </div>
                  <div className="space-y-1">
                    {weekSchedule.lateGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sunday Night */}
              {weekSchedule.sundayNightGame && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-yellow-400">Sunday Night</div>
                  <GameCard game={weekSchedule.sundayNightGame} />
                </div>
              )}

              {/* Monday Night */}
              {weekSchedule.mondayNightGame && (
                <div className="space-y-1">
                  <div className="text-xs font-bold text-orange-400">Monday Night</div>
                  <GameCard game={weekSchedule.mondayNightGame} />
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
