'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGMPrestigeStore } from '@/stores/gm-prestige-store';
import { getPrestigeTier, prestigeTiers, getPrestigeProgress } from '@/data/gm-prestige';
import { Crown, Trophy, Star, Sparkles } from 'lucide-react';
import type { PrestigeTierId } from '@/types/gm-prestige';

const tierIcons: Record<PrestigeTierId, React.ReactNode> = {
  none: null,
  hall_of_fame: <Trophy className="h-5 w-5" />,
  legend: <Crown className="h-5 w-5" />,
  goat: <Sparkles className="h-5 w-5" />,
};

const tierColors: Record<PrestigeTierId, string> = {
  none: 'text-muted-foreground',
  hall_of_fame: 'text-amber-500',
  legend: 'text-cyan-400',
  goat: 'text-purple-400',
};

const tierBgColors: Record<PrestigeTierId, string> = {
  none: 'bg-secondary',
  hall_of_fame: 'bg-amber-500/10 border-amber-500/30',
  legend: 'bg-cyan-500/10 border-cyan-500/30',
  goat: 'bg-purple-500/10 border-purple-500/30',
};

interface PrestigeDisplayProps {
  className?: string;
  showProgress?: boolean;
}

export function PrestigeDisplay({
  className,
  showProgress = true,
}: PrestigeDisplayProps) {
  // Access raw state to avoid infinite loop from getProgress returning new objects
  const currentTier = useGMPrestigeStore((s) => s.prestige.currentTier);
  const championships = useGMPrestigeStore((s) => s.prestige.championships);
  const dynasties = useGMPrestigeStore((s) => s.prestige.dynasties);

  // Derive progress from raw state
  const progress = useMemo(
    () => getPrestigeProgress(championships, dynasties),
    [championships, dynasties]
  );
  const tierData = getPrestigeTier(currentTier);

  if (currentTier === 'none' && !showProgress) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        tierBgColors[currentTier],
        className
      )}
    >
      {/* Current tier */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            currentTier === 'none' ? 'bg-secondary' : tierBgColors[currentTier]
          )}
        >
          {tierIcons[currentTier] || <Star className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div>
          <p className={cn('font-bold', tierColors[currentTier])}>
            {tierData?.name || 'No Prestige'}
          </p>
          <p className="text-xs text-muted-foreground">
            {tierData?.title || 'Build your legacy'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span>
            {championships} {championships === 1 ? 'Championship' : 'Championships'}
          </span>
        </div>
        {dynasties > 0 && (
          <div className="flex items-center gap-1">
            <Crown className="h-4 w-4 text-purple-400" />
            <span>
              {dynasties} {dynasties === 1 ? 'Dynasty' : 'Dynasties'}
            </span>
          </div>
        )}
      </div>

      {/* Progress to next tier */}
      {showProgress && progress.nextTier && progress.requirement && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Next: {getPrestigeTier(progress.nextTier)?.name}
            </span>
            <span>
              {progress.requirement.current}/{progress.requirement.target}
            </span>
          </div>
          <Progress value={progress.progressPercent} className="h-2" />
        </div>
      )}

      {/* Unlocks */}
      {tierData && tierData.unlocks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Unlocked:</p>
          <div className="flex flex-wrap gap-1">
            {tierData.unlocks.map((unlock, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {unlock.description}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PrestigeBadgeProps {
  className?: string;
}

export function PrestigeBadge({ className }: PrestigeBadgeProps) {
  // Access raw state to avoid potential issues
  const currentTier = useGMPrestigeStore((s) => s.prestige.currentTier);

  if (currentTier === 'none') {
    return null;
  }

  const tierData = getPrestigeTier(currentTier);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium',
        tierBgColors[currentTier],
        tierColors[currentTier],
        className
      )}
    >
      {tierIcons[currentTier]}
      <span>{tierData?.title}</span>
    </div>
  );
}

interface PrestigeRoadmapProps {
  className?: string;
}

export function PrestigeRoadmap({ className }: PrestigeRoadmapProps) {
  // Access raw state to avoid potential issues
  const currentTier = useGMPrestigeStore((s) => s.prestige.currentTier);
  const championships = useGMPrestigeStore((s) => s.prestige.championships);

  const tiers = prestigeTiers.filter((t) => t.id !== 'none');
  const currentIndex = tiers.findIndex((t) => t.id === currentTier);

  return (
    <div className={cn('space-y-3', className)}>
      {tiers.map((tier, index) => {
        const isUnlocked = index <= currentIndex && currentTier !== 'none';
        const isCurrent = tier.id === currentTier;
        const requirement = tier.requirements[0];

        return (
          <div
            key={tier.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border',
              isUnlocked && tierBgColors[tier.id],
              !isUnlocked && 'bg-secondary/30 opacity-60'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                isUnlocked ? tierBgColors[tier.id] : 'bg-secondary'
              )}
            >
              {tierIcons[tier.id] || <Star className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={cn('font-medium', isUnlocked && tierColors[tier.id])}>
                  {tier.name}
                </p>
                {isCurrent && (
                  <Badge variant="outline" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{tier.description}</p>
              {requirement && (
                <p className="text-xs mt-1">
                  <span className="text-muted-foreground">Requires: </span>
                  {requirement.value} {requirement.type}
                  {!isUnlocked && (
                    <span className="text-muted-foreground">
                      {' '}
                      ({championships}/{requirement.value})
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
