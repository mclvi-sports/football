'use client';

import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';

interface SimSpeedControlProps {
  speed: number; // 0.5, 1, 2, or 4
  isAutoPlay: boolean;
  onSpeedChange: (speed: number) => void;
  onAutoPlayChange: (autoPlay: boolean) => void;
  disabled?: boolean;
}

const SPEEDS = [0.5, 1, 2, 4] as const;

export function SimSpeedControl({
  speed,
  isAutoPlay,
  onSpeedChange,
  onAutoPlayChange,
  disabled = false,
}: SimSpeedControlProps) {
  return (
    <div className="flex items-center gap-4 rounded border border-zinc-800 bg-zinc-900/50 px-4 py-2">
      {/* Auto-play toggle */}
      <button
        onClick={() => onAutoPlayChange(!isAutoPlay)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors',
          isAutoPlay
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {isAutoPlay ? (
          <>
            <Pause className="h-3 w-3" />
            STOP
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            AUTO
          </>
        )}
      </button>

      {/* Divider */}
      <div className="h-6 w-px bg-zinc-700" />

      {/* Speed buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">SPEED</span>
        <div className="flex rounded border border-zinc-700">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              disabled={disabled}
              className={cn(
                'px-2 py-1 text-xs font-mono transition-colors first:rounded-l last:rounded-r',
                speed === s
                  ? 'bg-yellow-400 text-zinc-900 font-bold'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
