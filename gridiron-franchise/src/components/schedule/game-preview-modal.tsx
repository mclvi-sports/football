'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScheduledGame } from '@/lib/schedule/types';
import { getTeamById } from '@/lib/data/teams';

interface GamePreviewModalProps {
  game: ScheduledGame | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Team display with circle and name
 */
function TeamDisplay({ teamId }: { teamId: string }) {
  const team = getTeamById(teamId);
  const color = team?.colors?.primary || '#6b7280';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-full flex items-center justify-center text-white font-bold text-lg w-16 h-16"
        style={{ backgroundColor: color }}
      >
        {teamId}
      </div>
      <span className="text-sm font-medium">
        {team ? `${team.city} ${team.name}` : teamId}
      </span>
    </div>
  );
}

export function GamePreviewModal({
  game,
  open,
  onOpenChange,
}: GamePreviewModalProps) {
  if (!game) return null;

  const formatTimeSlot = (slot: string): string => {
    const times: Record<string, string> = {
      early: '1:00 PM ET',
      late: '4:25 PM ET',
      sunday_night: '8:20 PM ET',
      monday_night: '8:15 PM ET',
      thursday_night: '8:15 PM ET',
    };
    return times[slot] || slot;
  };

  const formatDay = (day: string): string => {
    const days: Record<string, string> = {
      sunday: 'Sunday',
      monday: 'Monday',
      thursday: 'Thursday',
    };
    return days[day] || day;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md border-zinc-800 p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-center">Game Preview</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Matchup */}
          <div className="flex items-center justify-center gap-6">
            <TeamDisplay teamId={game.awayTeamId} />
            <span className="text-2xl font-bold text-muted-foreground">@</span>
            <TeamDisplay teamId={game.homeTeamId} />
          </div>

          {/* Game Info */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              Week {game.week} &middot; {formatDay(game.dayOfWeek)}
            </p>
            <p className="text-sm font-medium">{formatTimeSlot(game.timeSlot)}</p>
            {game.isPrimeTime && (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary">
                Prime Time
              </span>
            )}
          </div>

          {/* Placeholder */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              Game preview details coming soon
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Team records, recent results, and matchup history
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
