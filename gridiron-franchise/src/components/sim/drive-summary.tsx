'use client';

import { cn } from '@/lib/utils';

interface DriveStats {
  plays: number;
  yards: number;
  timeElapsed: number; // seconds
  startPosition: number; // 0-100
  possession: 'away' | 'home' | null;
}

interface DriveSummaryProps {
  drive: DriveStats;
  awayAbbrev?: string;
  homeAbbrev?: string;
}

export function DriveSummary({ drive, awayAbbrev = 'AWAY', homeAbbrev = 'HOME' }: DriveSummaryProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStartYardLine = (pos: number, possession: 'away' | 'home' | null): string => {
    if (!possession) return '--';
    // pos is 0-100 where 0 = away endzone, 100 = home endzone
    if (possession === 'away') {
      // Away team goes towards 100
      if (pos <= 50) return `OWN ${pos}`;
      return `OPP ${100 - pos}`;
    } else {
      // Home team goes towards 0
      if (pos >= 50) return `OWN ${100 - pos}`;
      return `OPP ${pos}`;
    }
  };

  const teamAbbrev = drive.possession === 'away' ? awayAbbrev : drive.possession === 'home' ? homeAbbrev : '--';

  if (!drive.possession || drive.plays === 0) {
    return (
      <div className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm">
        <span className="text-zinc-500">No active drive</span>
      </div>
    );
  }

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Team indicator */}
          <span
            className={cn(
              'rounded px-2 py-0.5 text-xs font-bold tracking-wider',
              drive.possession === 'away' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            )}
          >
            {teamAbbrev}
          </span>
          <span className="text-xs text-zinc-400">DRIVE</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-[10px] text-zinc-500">PLAYS</div>
            <div className="font-mono font-semibold">{drive.plays}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-500">YARDS</div>
            <div className={cn('font-mono font-semibold', drive.yards > 0 ? 'text-green-400' : drive.yards < 0 ? 'text-red-400' : '')}>
              {drive.yards > 0 ? '+' : ''}{drive.yards}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-500">TIME</div>
            <div className="font-mono font-semibold">{formatTime(drive.timeElapsed)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-500">START</div>
            <div className="font-mono text-xs text-zinc-400">{getStartYardLine(drive.startPosition, drive.possession)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
