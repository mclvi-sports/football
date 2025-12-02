'use client';

import { PlayResult } from '@/lib/sim/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PlayLogProps {
  plays: PlayResult[];
  showDebug?: boolean;
}

export function PlayLog({ plays, showDebug = false }: PlayLogProps) {
  const getPlayClass = (play: PlayResult) => {
    if (play.result === 'touchdown') return 'border-l-green-500 bg-green-500/10';
    if (play.result === 'interception' || play.result === 'fumble') return 'border-l-red-500 bg-red-500/10';
    if (play.result === 'fg_made') return 'border-l-yellow-400 bg-yellow-400/10';
    if (play.result === 'first_down') return 'border-l-blue-500 bg-blue-500/10';
    return 'border-l-zinc-700';
  };

  if (plays.length === 0) {
    return (
      <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="text-center text-sm text-zinc-500">
          Configure teams and settings, then press START GAME
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded border border-zinc-800 bg-zinc-900/50">
      <div className="p-2">
        {plays.map((play, index) => (
          <div
            key={index}
            className={cn(
              'mb-2 border-l-2 p-2 text-sm',
              getPlayClass(play)
            )}
          >
            <div className="text-xs text-zinc-500">{play.type.toUpperCase()}</div>
            <div className="text-zinc-200">{play.description}</div>
            {play.result === 'first_down' && (
              <span className="mt-1 inline-block rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold">
                FIRST DOWN
              </span>
            )}
            {showDebug && play.debug && play.debug.length > 0 && (
              <div className="mt-2 border-l-2 border-yellow-400 bg-zinc-950 p-2 text-xs text-zinc-400">
                {play.debug.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
