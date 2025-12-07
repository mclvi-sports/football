'use client';

import { Button } from '@/components/ui/button';
import { Play, FastForward, SkipForward, RotateCcw, Bug } from 'lucide-react';

interface GameControlsProps {
  isStarted: boolean;
  isGameOver: boolean;
  canStart: boolean;
  showDebugToggle?: boolean;
  showDebug: boolean;
  onStartGame: () => void;
  onSimPlay: () => void;
  onSimDrive: () => void;
  onSimQuarter: () => void;
  onSimGame: () => void;
  onResetGame: () => void;
  onToggleDebug: (show: boolean) => void;
}

export function GameControls({
  isStarted,
  isGameOver,
  canStart,
  showDebugToggle = true,
  showDebug,
  onStartGame,
  onSimPlay,
  onSimDrive,
  onSimQuarter,
  onSimGame,
  onResetGame,
  onToggleDebug,
}: GameControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {!isStarted ? (
        <Button
          className="bg-red-600 hover:bg-red-700 h-9"
          onClick={onStartGame}
          disabled={!canStart}
        >
          Start Game
        </Button>
      ) : (
        <>
          <Button variant="secondary" size="sm" onClick={onSimPlay} disabled={isGameOver}>
            <Play className="mr-1 h-3 w-3" />
            Play
          </Button>
          <Button variant="secondary" size="sm" onClick={onSimDrive} disabled={isGameOver}>
            <FastForward className="mr-1 h-3 w-3" />
            Drive
          </Button>
          <Button variant="secondary" size="sm" onClick={onSimQuarter} disabled={isGameOver}>
            <SkipForward className="mr-1 h-3 w-3" />
            Qtr
          </Button>
          <Button variant="secondary" size="sm" onClick={onSimGame} disabled={isGameOver}>
            <SkipForward className="mr-1 h-3 w-3" />
            Game
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
        onClick={onResetGame}
      >
        <RotateCcw className="mr-1 h-3 w-3" />
        Reset
      </Button>

      {showDebugToggle && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => onToggleDebug(!showDebug)}
        >
          <Bug className="mr-1 h-3 w-3" />
          {showDebug ? 'ON' : 'OFF'}
        </Button>
      )}
    </div>
  );
}
