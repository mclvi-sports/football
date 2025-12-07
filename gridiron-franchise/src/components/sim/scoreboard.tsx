'use client';

import { SimState, SimTeam } from '@/lib/sim/types';
import { cn } from '@/lib/utils';

interface QuarterScores {
  away: number[];
  home: number[];
}

interface ScoreboardProps {
  state: SimState;
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
  isStarted: boolean;
  quarterScores?: QuarterScores;
}

export function Scoreboard({ state, awayTeam, homeTeam, isStarted, quarterScores }: ScoreboardProps) {
  const formatTime = (seconds: number): string => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const ordinal = (n: number): string => {
    if (n >= 11 && n <= 13) return 'th';
    const lastDigit = n % 10;
    if (lastDigit === 1) return 'st';
    if (lastDigit === 2) return 'nd';
    if (lastDigit === 3) return 'rd';
    return 'th';
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

      {/* Quarter Scores */}
      {quarterScores && isStarted && (
        <div className="mb-3 border-t border-zinc-800 pt-3">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="text-zinc-500">
                <th className="w-16 text-left font-normal">TEAM</th>
                {[1, 2, 3, 4].map((q) => (
                  <th key={q} className="w-8 font-normal">{q}</th>
                ))}
                {state.isOvertime && <th className="w-8 font-normal">OT</th>}
                <th className="w-10 font-semibold text-yellow-400">T</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="text-red-400">
                <td className="text-left">{awayTeam?.abbrev || 'AWAY'}</td>
                {[0, 1, 2, 3].map((i) => (
                  <td key={i} className={cn(
                    state.quarter - 1 === i && !state.isOver ? 'text-white' : 'text-zinc-400'
                  )}>
                    {quarterScores.away[i] ?? '-'}
                  </td>
                ))}
                {state.isOvertime && (
                  <td className="text-white">{quarterScores.away[4] ?? '-'}</td>
                )}
                <td className="font-bold text-white">{state.awayScore}</td>
              </tr>
              <tr className="text-blue-400">
                <td className="text-left">{homeTeam?.abbrev || 'HOME'}</td>
                {[0, 1, 2, 3].map((i) => (
                  <td key={i} className={cn(
                    state.quarter - 1 === i && !state.isOver ? 'text-white' : 'text-zinc-400'
                  )}>
                    {quarterScores.home[i] ?? '-'}
                  </td>
                ))}
                {state.isOvertime && (
                  <td className="text-white">{quarterScores.home[4] ?? '-'}</td>
                )}
                <td className="font-bold text-white">{state.homeScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

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
            {state.down}{ordinal(state.down)} & {state.yardsToGo}
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
