'use client';

import { ScheduledGame } from '@/lib/schedule/types';
import { GameResult } from '@/lib/season/types';
import { getTeamById } from '@/lib/data/teams';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: ScheduledGame;
  result?: GameResult;
  userTeamId?: string;
  onGameClick: (game: ScheduledGame, result?: GameResult) => void;
}

/**
 * Team circle with primary color
 */
function TeamCircle({ teamId, size = 32 }: { teamId: string; size?: number }) {
  const team = getTeamById(teamId);
  const color = team?.colors?.primary || '#6b7280';

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold text-xs"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
      title={team ? `${team.city} ${team.name}` : teamId}
    >
      {teamId.slice(0, 2)}
    </div>
  );
}

/**
 * Prime time badge
 */
function PrimeTimeBadge({ timeSlot }: { timeSlot: string }) {
  const labels: Record<string, { label: string; color: string }> = {
    thursday_night: { label: 'TNF', color: 'bg-amber-600' },
    sunday_night: { label: 'SNF', color: 'bg-blue-600' },
    monday_night: { label: 'MNF', color: 'bg-green-600' },
  };

  const badge = labels[timeSlot];
  if (!badge) return null;

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 rounded text-[10px] font-bold text-white',
        badge.color
      )}
    >
      {badge.label}
    </span>
  );
}

/**
 * Format time slot to readable string
 */
function formatTimeSlot(timeSlot: string, dayOfWeek: string): string {
  const times: Record<string, string> = {
    early: '1:00 PM',
    late: '4:25 PM',
    sunday_night: '8:20 PM',
    monday_night: '8:15 PM',
    thursday_night: '8:15 PM',
  };

  const days: Record<string, string> = {
    sunday: 'Sun',
    monday: 'Mon',
    thursday: 'Thu',
  };

  return `${days[dayOfWeek] || dayOfWeek}, ${times[timeSlot] || timeSlot}`;
}

export function GameCard({
  game,
  result,
  userTeamId,
  onGameClick,
}: GameCardProps) {
  const awayTeam = getTeamById(game.awayTeamId);
  const homeTeam = getTeamById(game.homeTeamId);

  const isUserGame =
    userTeamId &&
    (game.awayTeamId === userTeamId || game.homeTeamId === userTeamId);

  const isFinished = !!result;
  const isPrimeTime = game.isPrimeTime;

  return (
    <button
      onClick={() => onGameClick(game, result)}
      className={cn(
        'w-full rounded-2xl bg-secondary/50 border p-4 transition-all hover:bg-secondary/70',
        isUserGame ? 'border-primary border-2' : 'border-border',
        isPrimeTime && 'border-l-4',
        game.timeSlot === 'thursday_night' && 'border-l-amber-600',
        game.timeSlot === 'sunday_night' && 'border-l-blue-600',
        game.timeSlot === 'monday_night' && 'border-l-green-600'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1">
          <TeamCircle teamId={game.awayTeamId} />
          <span className="font-bold text-sm">{game.awayTeamId}</span>
          {isFinished && (
            <span className="text-lg font-bold ml-auto">{result.awayScore}</span>
          )}
        </div>

        {/* Center Info */}
        <div className="flex flex-col items-center px-2 min-w-[80px]">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Week {game.week}
          </span>
          {isPrimeTime && <PrimeTimeBadge timeSlot={game.timeSlot} />}
          <span className="text-xs text-muted-foreground mt-1">
            {isFinished ? 'FINAL' : formatTimeSlot(game.timeSlot, game.dayOfWeek)}
          </span>
        </div>

        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {isFinished && (
            <span className="text-lg font-bold mr-auto">{result.homeScore}</span>
          )}
          <span className="font-bold text-sm">{game.homeTeamId}</span>
          <TeamCircle teamId={game.homeTeamId} />
        </div>
      </div>
    </button>
  );
}
