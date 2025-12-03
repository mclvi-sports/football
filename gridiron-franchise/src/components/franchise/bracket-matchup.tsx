'use client';

import { PlayoffMatchup, GameResult } from '@/lib/season/types';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

interface BracketMatchupProps {
  matchup: PlayoffMatchup;
  teams: Map<string, Team>;
  onClick?: (gameResult: GameResult) => void;
  size?: 'sm' | 'md' | 'lg';
  showConference?: boolean;
}

export function BracketMatchup({
  matchup,
  teams,
  onClick,
  size = 'md',
  showConference = false,
}: BracketMatchupProps) {
  const higherTeam = teams.get(matchup.higherSeed.teamId);
  const lowerTeam = teams.get(matchup.lowerSeed.teamId);
  const isComplete = matchup.winnerId !== null;
  const higherWon = matchup.winnerId === matchup.higherSeed.teamId;
  const lowerWon = matchup.winnerId === matchup.lowerSeed.teamId;

  const handleClick = () => {
    if (isComplete && matchup.gameResult && onClick) {
      onClick(matchup.gameResult);
    }
  };

  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4',
  };

  const seedSizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  return (
    <div
      className={cn(
        'rounded-lg border transition-all',
        isComplete
          ? 'border-zinc-700 bg-zinc-800/50'
          : 'border-zinc-600 border-dashed bg-zinc-900/50',
        isComplete && onClick && 'cursor-pointer hover:bg-zinc-700/50 hover:border-zinc-600'
      )}
      onClick={handleClick}
    >
      {/* Conference Label */}
      {showConference && matchup.conference && (
        <div className="text-[10px] text-zinc-500 text-center py-1 border-b border-zinc-700">
          {matchup.conference}
        </div>
      )}

      {/* Higher Seed */}
      <div
        className={cn(
          'flex items-center justify-between border-b border-zinc-700/50',
          sizeClasses[size],
          higherWon && 'bg-green-500/10'
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center justify-center rounded bg-zinc-700 font-bold',
              seedSizeClasses[size]
            )}
          >
            {matchup.higherSeed.seed}
          </span>
          <span className={cn('font-medium', higherWon && 'text-green-400')}>
            {higherTeam?.abbrev || matchup.higherSeed.teamId}
          </span>
          {higherWon && <Trophy className="h-3 w-3 text-green-400" />}
        </div>
        {isComplete && matchup.gameResult && (
          <span
            className={cn(
              'font-bold',
              higherWon ? 'text-white' : 'text-zinc-500'
            )}
          >
            {matchup.gameResult.awayTeamId === matchup.higherSeed.teamId
              ? matchup.gameResult.awayScore
              : matchup.gameResult.homeScore}
          </span>
        )}
      </div>

      {/* Lower Seed */}
      <div
        className={cn(
          'flex items-center justify-between',
          sizeClasses[size],
          lowerWon && 'bg-green-500/10'
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center justify-center rounded bg-zinc-700 font-bold',
              seedSizeClasses[size]
            )}
          >
            {matchup.lowerSeed.seed}
          </span>
          <span className={cn('font-medium', lowerWon && 'text-green-400')}>
            {lowerTeam?.abbrev || matchup.lowerSeed.teamId}
          </span>
          {lowerWon && <Trophy className="h-3 w-3 text-green-400" />}
        </div>
        {isComplete && matchup.gameResult && (
          <span
            className={cn(
              'font-bold',
              lowerWon ? 'text-white' : 'text-zinc-500'
            )}
          >
            {matchup.gameResult.awayTeamId === matchup.lowerSeed.teamId
              ? matchup.gameResult.awayScore
              : matchup.gameResult.homeScore}
          </span>
        )}
      </div>
    </div>
  );
}
