'use client';

import { Users, Building2 } from 'lucide-react';
import { GameType, Weather } from '@/lib/sim/types';

interface GameContextBadgesProps {
  gameType: GameType;
  weather: Weather;
  isClutch: boolean;
  hasCoaching: boolean;
  hasFacilities: boolean;
}

export function GameContextBadges({
  gameType,
  weather,
  isClutch,
  hasCoaching,
  hasFacilities,
}: GameContextBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`rounded px-2 py-1 text-xs font-semibold tracking-wider ${
          gameType === 'primetime'
            ? 'bg-yellow-400 text-zinc-900'
            : gameType === 'playoff' || gameType === 'championship'
              ? 'bg-red-600 text-white'
              : 'bg-blue-700 text-white'
        }`}
      >
        {gameType.toUpperCase()}
      </span>

      {weather !== 'clear' && (
        <span className="rounded bg-zinc-600 px-2 py-1 text-xs font-semibold tracking-wider">
          {weather.toUpperCase()}
        </span>
      )}

      {isClutch && (
        <span className="rounded bg-purple-600 px-2 py-1 text-xs font-semibold tracking-wider">
          CLUTCH
        </span>
      )}

      {hasCoaching && (
        <span className="flex items-center gap-1 rounded bg-green-700 px-2 py-1 text-xs font-semibold tracking-wider">
          <Users className="h-3 w-3" />
          COACHING
        </span>
      )}

      {hasFacilities && (
        <span className="flex items-center gap-1 rounded bg-amber-700 px-2 py-1 text-xs font-semibold tracking-wider">
          <Building2 className="h-3 w-3" />
          FACILITIES
        </span>
      )}
    </div>
  );
}
