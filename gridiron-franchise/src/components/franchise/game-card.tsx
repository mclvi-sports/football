'use client';

import { cn } from '@/lib/utils';
import { GameResult } from '@/lib/season/types';
import { Star } from 'lucide-react';

interface GameCardProps {
  game: GameResult;
  awayTeam: { abbrev: string; name: string } | null;
  homeTeam: { abbrev: string; name: string } | null;
  onClick?: () => void;
}

export function GameCard({ game, awayTeam, homeTeam, onClick }: GameCardProps) {
  const awayWon = game.awayScore > game.homeScore;
  const homeWon = game.homeScore > game.awayScore;

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between rounded-lg bg-zinc-800/50 p-3 transition-all',
        onClick && 'cursor-pointer hover:bg-zinc-700/50 active:scale-[0.99]',
        game.isPlayoff && 'border border-yellow-500/30 bg-yellow-500/5'
      )}
    >
      {/* Away Team */}
      <div className="flex items-center gap-3 flex-1">
        <div
          className={cn(
            'w-12 text-right text-2xl font-bold',
            awayWon ? 'text-white' : 'text-zinc-500'
          )}
        >
          {game.awayScore}
        </div>
        <div className={cn('flex-1', awayWon ? 'font-semibold' : 'text-zinc-400')}>
          <span className="text-sm">{awayTeam?.abbrev || game.awayTeamId}</span>
          {awayWon && <span className="ml-2 text-xs text-green-400">W</span>}
        </div>
      </div>

      {/* VS / Game Info */}
      <div className="flex flex-col items-center px-4">
        <span className="text-xs text-zinc-500">FINAL</span>
        <div className="flex items-center gap-1 mt-1">
          {game.isPrimetime && (
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          )}
          {game.isPlayoff && (
            <span className="text-[10px] font-bold text-yellow-400 uppercase">
              {game.playoffRound?.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Home Team */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className={cn('flex-1 text-right', homeWon ? 'font-semibold' : 'text-zinc-400')}>
          {homeWon && <span className="mr-2 text-xs text-green-400">W</span>}
          <span className="text-sm">{homeTeam?.abbrev || game.homeTeamId}</span>
        </div>
        <div
          className={cn(
            'w-12 text-left text-2xl font-bold',
            homeWon ? 'text-white' : 'text-zinc-500'
          )}
        >
          {game.homeScore}
        </div>
      </div>
    </div>
  );
}
