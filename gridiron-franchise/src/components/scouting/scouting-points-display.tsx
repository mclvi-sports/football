'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { SeasonPeriod, ProspectTier } from '@/lib/scouting/types';
import { SCOUTING_POINT_COSTS, PERIOD_MODIFIERS, SEASON_PERIODS } from '@/lib/scouting/types';
import { cn } from '@/lib/utils';
import { Zap, Calendar, TrendingDown, TrendingUp, Minus } from 'lucide-react';

// ============================================================================
// PERIOD HELPERS
// ============================================================================

function getPeriodLabel(period: SeasonPeriod): string {
  switch (period) {
    case 'pre_season':
      return 'Pre-Season';
    case 'mid_season':
      return 'Mid-Season';
    case 'late_season':
      return 'Late-Season';
    case 'combine':
      return 'NFL Combine';
    case 'pro_days':
      return 'Pro Days';
    case 'draft':
      return 'Draft Week';
    default:
      return period;
  }
}

function getPeriodModifierIcon(modifier: number) {
  if (modifier < 1) return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
  if (modifier > 1) return <TrendingUp className="w-3.5 h-3.5 text-red-400" />;
  if (modifier === 0) return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
  return <Minus className="w-3.5 h-3.5 text-zinc-400" />;
}

function getPeriodModifierText(modifier: number): string {
  if (modifier === 0) return 'FREE';
  if (modifier < 1) return `-${Math.round((1 - modifier) * 100)}%`;
  if (modifier > 1) return `+${Math.round((modifier - 1) * 100)}%`;
  return 'Normal';
}

// ============================================================================
// SCOUTING POINTS DISPLAY - FULL
// ============================================================================

interface ScoutingPointsDisplayProps {
  available: number;
  spent: number;
  total: number;
  currentWeek: number;
  currentPeriod: SeasonPeriod;
  assignmentCount?: number;
  className?: string;
}

export function ScoutingPointsDisplay({
  available,
  spent,
  total,
  currentWeek,
  currentPeriod,
  assignmentCount = 0,
  className,
}: ScoutingPointsDisplayProps) {
  const modifier = PERIOD_MODIFIERS[currentPeriod];
  const usagePercent = total > 0 ? Math.round((spent / total) * 100) : 0;

  return (
    <Card className={cn('bg-zinc-900/50 border-zinc-800', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Scouting Points
          </CardTitle>
          <Badge variant="outline" className="bg-zinc-800/50">
            <Calendar className="w-3 h-3 mr-1" />
            Week {currentWeek}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Points Display */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold text-yellow-400">{available}</div>
            <div className="text-sm text-zinc-400">Available Points</div>
          </div>
          <div className="text-right">
            <div className="text-lg text-zinc-300">
              {spent} / {total}
            </div>
            <div className="text-xs text-zinc-500">Spent This Week</div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-1.5">
          <Progress value={usagePercent} className="h-2" />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{usagePercent}% used</span>
            <span>{assignmentCount} assignments</span>
          </div>
        </div>

        {/* Current Period */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
          <div>
            <div className="text-sm font-medium text-zinc-200">
              {getPeriodLabel(currentPeriod)}
            </div>
            <div className="text-xs text-zinc-500">
              Weeks {SEASON_PERIODS[currentPeriod][0]}-{SEASON_PERIODS[currentPeriod][1]}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {getPeriodModifierIcon(modifier)}
            <span
              className={cn(
                'text-sm font-medium',
                modifier < 1 && 'text-green-400',
                modifier > 1 && 'text-red-400',
                modifier === 0 && 'text-yellow-400',
                modifier === 1 && 'text-zinc-400'
              )}
            >
              {getPeriodModifierText(modifier)}
            </span>
          </div>
        </div>

        {/* Cost Reference */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Scouting Costs
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {(['top', 'mid', 'late'] as ProspectTier[]).map((tier) => {
              const baseCost = SCOUTING_POINT_COSTS[tier];
              const adjustedCost = Math.round(baseCost * modifier);
              return (
                <div key={tier} className="text-center p-2 rounded bg-zinc-800/30">
                  <div className="text-zinc-400 capitalize">{tier}</div>
                  <div className="font-medium text-zinc-200">
                    {modifier === 0 ? 'FREE' : `${adjustedCost} pts`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SCOUTING POINTS - COMPACT
// ============================================================================

interface ScoutingPointsCompactProps {
  available: number;
  total: number;
  currentPeriod: SeasonPeriod;
  className?: string;
}

export function ScoutingPointsCompact({
  available,
  total,
  currentPeriod,
  className,
}: ScoutingPointsCompactProps) {
  const modifier = PERIOD_MODIFIERS[currentPeriod];
  const usagePercent = total > 0 ? Math.round(((total - available) / total) * 100) : 0;

  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        <div>
          <div className="text-lg font-bold text-yellow-400">{available}</div>
          <div className="text-xs text-zinc-500">pts left</div>
        </div>
      </div>

      <div className="flex-1">
        <Progress value={usagePercent} className="h-1.5" />
      </div>

      <div className="flex items-center gap-1 text-xs">
        {getPeriodModifierIcon(modifier)}
        <span
          className={cn(
            modifier < 1 && 'text-green-400',
            modifier > 1 && 'text-red-400',
            modifier === 0 && 'text-yellow-400',
            modifier === 1 && 'text-zinc-400'
          )}
        >
          {getPeriodModifierText(modifier)}
        </span>
      </div>
    </div>
  );
}
