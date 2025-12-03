'use client';

import { cn } from '@/lib/utils';
import type { SkillTierId } from '@/types/gm-skills';

interface SkillTierBadgeProps {
  tier: SkillTierId;
  className?: string;
  showCost?: boolean;
}

const tierConfig: Record<
  SkillTierId,
  { label: string; color: string; bgColor: string; borderColor: string; cost: number }
> = {
  bronze: {
    label: 'Bronze',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    cost: 100,
  },
  silver: {
    label: 'Silver',
    color: 'text-slate-300',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/30',
    cost: 250,
  },
  gold: {
    label: 'Gold',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    cost: 500,
  },
  platinum: {
    label: 'Platinum',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    cost: 1000,
  },
  diamond: {
    label: 'Diamond',
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    cost: 2000,
  },
};

export function SkillTierBadge({ tier, className, showCost }: SkillTierBadgeProps) {
  const config = tierConfig[tier];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
        config.bgColor,
        config.borderColor,
        config.color,
        className
      )}
    >
      {config.label}
      {showCost && <span className="opacity-70">({config.cost} GP)</span>}
    </span>
  );
}

export function getTierColor(tier: SkillTierId): string {
  return tierConfig[tier].color;
}

export function getTierBgColor(tier: SkillTierId): string {
  return tierConfig[tier].bgColor;
}
