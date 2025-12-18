'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DraftPick } from '@/stores/draft-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';

interface DraftClockProps {
  currentPick: DraftPick | null;
  timeRemaining: number;
  isUserOnClock: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onTick: () => void;
}

export function DraftClock({
  currentPick,
  timeRemaining,
  isUserOnClock,
  isPaused,
  onPause,
  onResume,
  onTick,
}: DraftClockProps) {
  // Timer effect
  useEffect(() => {
    if (isPaused || !currentPick) return;

    const interval = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, currentPick, onTick]);

  if (!currentPick) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">Draft Complete</p>
        </CardContent>
      </Card>
    );
  }

  const team = LEAGUE_TEAMS.find((t) => t.id === currentPick.teamId);
  const isUrgent = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  // Format time
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Card
      className={cn(
        'transition-all',
        isUserOnClock && 'border-primary',
        isUrgent && !isPaused && 'animate-pulse',
        isCritical && !isPaused && 'border-red-500'
      )}
      style={{
        borderColor: !isUserOnClock ? team?.colors.primary : undefined,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Pick Info */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              style={{
                backgroundColor: team?.colors.primary + '30',
                color: team?.colors.primary,
              }}
            >
              {currentPick.overall}
            </div>
            <div>
              <p className="font-semibold">{team?.city} {team?.name}</p>
              <p className="text-sm text-muted-foreground">
                Round {currentPick.round}, Pick {currentPick.pick}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            {isUserOnClock && (
              <Badge className="bg-primary/20 text-primary">Your Pick</Badge>
            )}

            <div
              className={cn(
                'text-3xl font-mono font-bold tabular-nums',
                isCritical && !isPaused && 'text-red-500',
                isUrgent && !isCritical && !isPaused && 'text-yellow-500'
              )}
            >
              {timeDisplay}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={isPaused ? onResume : onPause}
            >
              {isPaused ? '▶' : '⏸'}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              isCritical ? 'bg-red-500' : isUrgent ? 'bg-yellow-500' : 'bg-primary'
            )}
            style={{
              width: `${(timeRemaining / 120) * 100}%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default DraftClock;
