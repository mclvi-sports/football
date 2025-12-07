'use client';

import { cn } from '@/lib/utils';
import { Zap, Shield, Star } from 'lucide-react';
import { TriggeredEffect } from '@/lib/sim/types';

interface ActiveEffectsProps {
  effects: TriggeredEffect[];
  maxDisplay?: number;
}

export function ActiveEffects({ effects, maxDisplay = 5 }: ActiveEffectsProps) {
  if (effects.length === 0) {
    return null;
  }

  const displayEffects = effects.slice(0, maxDisplay);
  const remaining = effects.length - maxDisplay;

  const getEffectIcon = (effect: TriggeredEffect) => {
    if (effect.type === 'badge') {
      return <Star className="h-3 w-3" />;
    }
    return effect.modifier > 0 ? <Zap className="h-3 w-3" /> : <Shield className="h-3 w-3" />;
  };

  const getTierColor = (tier?: string): string => {
    switch (tier) {
      case 'hof':
        return 'bg-purple-600 text-white';
      case 'gold':
        return 'bg-yellow-500 text-zinc-900';
      case 'silver':
        return 'bg-zinc-400 text-zinc-900';
      case 'bronze':
        return 'bg-amber-700 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const getModifierColor = (modifier: number): string => {
    if (modifier > 0) return 'text-green-400';
    if (modifier < 0) return 'text-red-400';
    return 'text-zinc-400';
  };

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Zap className="h-4 w-4 text-yellow-400" />
        <span className="text-xs font-semibold tracking-wider text-yellow-400">ACTIVE EFFECTS</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayEffects.map((effect, index) => (
          <div
            key={`${effect.name}-${effect.playerName}-${index}`}
            className={cn(
              'flex items-center gap-1.5 rounded px-2 py-1 text-xs',
              effect.type === 'badge' ? getTierColor(effect.tier) : 'bg-zinc-800 text-zinc-300'
            )}
          >
            {getEffectIcon(effect)}
            <span className="font-medium">{effect.name}</span>
            <span className="text-[10px] opacity-75">({effect.playerName})</span>
            {effect.modifier !== 0 && (
              <span className={cn('font-mono font-bold', getModifierColor(effect.modifier))}>
                {effect.modifier > 0 ? '+' : ''}{effect.modifier}
              </span>
            )}
          </div>
        ))}
        {remaining > 0 && (
          <span className="flex items-center px-2 text-xs text-zinc-500">
            +{remaining} more
          </span>
        )}
      </div>
    </div>
  );
}
