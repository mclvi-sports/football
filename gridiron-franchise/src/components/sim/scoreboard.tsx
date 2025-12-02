'use client';

import { SimState, SimTeam } from '@/lib/sim/types';
import { cn } from '@/lib/utils';

interface ScoreboardProps {
  state: SimState;
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
  isStarted: boolean;
}

export function Scoreboard({ state, awayTeam, homeTeam, isStarted }: ScoreboardProps) {
  const formatTime = (seconds: number): string => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const ordinal = (n: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const quarterDisplay = ['1ST', '2ND', '3RD', '4TH', 'OT'][Math.min(state.quarter - 1, 4)];

  return (
    <div className="relative rounded-lg border-2 border-red-600 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
      {/* Game Status Badge */}
      <div
        className={cn(
          'absolute right-3 top-2 rounded px-2 py-0.5 text-xs font-semibold tracking-wider',
          state.isOver
            ? 'bg-yellow-400 text-zinc-900'
            : isStarted
              ? 'animate-pulse bg-red-600 text-white'
              : 'bg-zinc-700 text-zinc-300'
        )}
      >
        {state.isOver ? 'FINAL' : isStarted ? 'LIVE' : 'PREGAME'}
      </div>

      {/* Teams and Scores */}
      <div className="mb-4 flex items-center justify-between">
        {/* Away Team */}
        <div className="flex-1 text-center">
          <div className="text-lg font-bold tracking-wide">
            {awayTeam?.abbrev || 'AWAY'}
          </div>
          <div className="text-xs text-zinc-500">
            {awayTeam ? `${awayTeam.ovr} OVR` : '--'}
          </div>
          <div className="font-mono text-4xl font-bold">{state.awayScore}</div>
        </div>

        {/* VS */}
        <div className="px-4 text-zinc-500">@</div>

        {/* Home Team */}
        <div className="flex-1 text-center">
          <div className="text-lg font-bold tracking-wide">
            {homeTeam?.abbrev || 'HOME'}
          </div>
          <div className="text-xs text-zinc-500">
            {homeTeam ? `${homeTeam.ovr} OVR` : '--'}
          </div>
          <div className="font-mono text-4xl font-bold">{state.homeScore}</div>
        </div>
      </div>

      {/* Game Info */}
      <div className="grid grid-cols-4 gap-2 border-t border-zinc-800 pt-3 text-center">
        <div>
          <div className="text-[10px] tracking-wider text-zinc-500">QTR</div>
          <div className="font-mono text-lg">{quarterDisplay}</div>
        </div>
        <div>
          <div className="text-[10px] tracking-wider text-zinc-500">TIME</div>
          <div className="font-mono text-lg">{formatTime(state.clock)}</div>
        </div>
        <div>
          <div className="text-[10px] tracking-wider text-zinc-500">DOWN</div>
          <div className="font-mono text-lg">
            {state.down}
            {ordinal(state.down)} & {state.yardsToGo}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-wider text-zinc-500">BALL</div>
          <div className="font-mono text-lg">
            {state.possession
              ? state.possession === 'away'
                ? awayTeam?.abbrev || 'AWAY'
                : homeTeam?.abbrev || 'HOME'
              : '--'}
          </div>
        </div>
      </div>
    </div>
  );
}
