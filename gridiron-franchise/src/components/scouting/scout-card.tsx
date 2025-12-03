'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Scout, ScoutRole, PositionExpertise, RegionalExpertise } from '@/lib/scouting/types';
import { SCOUT_ROLES, POSITION_EXPERTISE, REGIONAL_EXPERTISE } from '@/lib/scouting/types';
import { cn } from '@/lib/utils';
import { User, Briefcase, MapPin, Award, Star, TrendingUp } from 'lucide-react';

// ============================================================================
// OVR TIER HELPERS
// ============================================================================

function getOvrTier(ovr: number): { label: string; color: string } {
  if (ovr >= 95) return { label: 'Elite', color: 'text-purple-400' };
  if (ovr >= 90) return { label: 'Excellent', color: 'text-blue-400' };
  if (ovr >= 85) return { label: 'Great', color: 'text-green-400' };
  if (ovr >= 80) return { label: 'Good', color: 'text-emerald-400' };
  if (ovr >= 75) return { label: 'Average', color: 'text-yellow-400' };
  if (ovr >= 70) return { label: 'Below Avg', color: 'text-orange-400' };
  return { label: 'Poor', color: 'text-red-400' };
}

function getRoleBadgeColor(role: ScoutRole): string {
  switch (role) {
    case 'director':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'area':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'pro':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'national':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    default:
      return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
  }
}

// ============================================================================
// SCOUT CARD - FULL
// ============================================================================

interface ScoutCardProps {
  scout: Scout;
  showActions?: boolean;
  onUpgrade?: (attribute: keyof Scout['attributes']) => void;
  onViewDetails?: () => void;
  className?: string;
}

export function ScoutCard({
  scout,
  showActions = false,
  onUpgrade,
  onViewDetails,
  className,
}: ScoutCardProps) {
  const tier = getOvrTier(scout.ovr);
  const roleInfo = SCOUT_ROLES[scout.role];
  const positionInfo = POSITION_EXPERTISE[scout.positionExpertise];
  const regionInfo = REGIONAL_EXPERTISE[scout.regionalExpertise];

  return (
    <Card className={cn('bg-zinc-900/50 border-zinc-800', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {scout.firstName} {scout.lastName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={getRoleBadgeColor(scout.role)}>
                {roleInfo.name}
              </Badge>
              <span className="text-sm text-zinc-400">Age {scout.age}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-2xl font-bold', tier.color)}>{scout.ovr}</div>
            <div className="text-xs text-zinc-500">{tier.label}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Expertise */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{positionInfo.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{regionInfo.name}</span>
          </div>
        </div>

        {/* Attributes */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Attributes</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(scout.attributes).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-zinc-300">{value}</span>
                </div>
                <Progress value={value} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Perks */}
        {scout.perks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Perks</h4>
            <div className="flex flex-wrap gap-1.5">
              {scout.perks.map((perk) => (
                <Badge
                  key={perk.id}
                  variant="outline"
                  className="text-xs bg-zinc-800/50"
                  title={perk.effect}
                >
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {perk.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contract & XP */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
          <div className="text-sm">
            <span className="text-zinc-400">Contract:</span>{' '}
            <span className="text-zinc-200">
              ${scout.contract.salary.toFixed(2)}M / {scout.contract.yearsRemaining}yr
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-200">{scout.xp} XP</span>
          </div>
        </div>

        {/* Weekly Points */}
        <div className="text-sm text-zinc-400">
          Weekly Points: <span className="text-zinc-200">{scout.weeklyPoints}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SCOUT CARD - COMPACT
// ============================================================================

interface ScoutCardCompactProps {
  scout: Scout;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function ScoutCardCompact({
  scout,
  onClick,
  selected = false,
  className,
}: ScoutCardCompactProps) {
  const tier = getOvrTier(scout.ovr);
  const roleInfo = SCOUT_ROLES[scout.role];

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer',
        selected
          ? 'bg-blue-500/10 border-blue-500/40'
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
          <User className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
          <div className="font-medium text-zinc-100">
            {scout.firstName} {scout.lastName}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className={cn('text-xs py-0', getRoleBadgeColor(scout.role))}>
              {roleInfo.name}
            </Badge>
            <span className="text-zinc-500">Age {scout.age}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className={cn('text-xl font-bold', tier.color)}>{scout.ovr}</div>
        <div className="text-xs text-zinc-500">{scout.weeklyPoints} pts/wk</div>
      </div>
    </div>
  );
}
