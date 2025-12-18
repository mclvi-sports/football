'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Position } from '@/lib/types';
import type { TeamNeeds, DraftSelection } from '@/stores/draft-store';

interface TeamNeedsPanelProps {
  needs: TeamNeeds;
  selections: DraftSelection[];
  teamId: string;
}

const PRIORITY_COLORS = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'] as const;

export function TeamNeedsPanel({ needs, selections, teamId }: TeamNeedsPanelProps) {
  // Get positions drafted by this team
  const draftedPositions = useMemo(() => {
    return selections
      .filter((s) => s.teamId === teamId)
      .map((s) => s.prospect.position);
  }, [selections, teamId]);

  // Sort needs by priority
  const sortedNeeds = useMemo(() => {
    return [...needs.positions]
      .filter((n) => n.priority !== 'low')
      .sort((a, b) => {
        const aIdx = PRIORITY_ORDER.indexOf(a.priority);
        const bIdx = PRIORITY_ORDER.indexOf(b.priority);
        return aIdx - bIdx;
      });
  }, [needs.positions]);

  // Calculate if position has been addressed
  const getPositionStatus = (position: Position) => {
    const draftedCount = draftedPositions.filter((p) => p === position).length;
    const need = needs.positions.find((n) => n.position === position);
    if (!need) return { addressed: false, count: draftedCount };

    const neededCount = need.targetDepth - need.currentDepth;
    return {
      addressed: draftedCount >= neededCount,
      count: draftedCount,
      needed: neededCount,
    };
  };

  // Group by priority
  const needsByPriority = useMemo(() => {
    const grouped: Record<string, typeof sortedNeeds> = {
      critical: [],
      high: [],
      medium: [],
    };

    sortedNeeds.forEach((need) => {
      if (grouped[need.priority]) {
        grouped[need.priority].push(need);
      }
    });

    return grouped;
  }, [sortedNeeds]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Team Needs</CardTitle>
          <Badge variant="outline">
            {selections.filter((s) => s.teamId === teamId).length} drafted
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Critical Needs */}
        {needsByPriority.critical.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-red-400 uppercase tracking-wide">
              Critical Needs
            </p>
            <div className="flex flex-wrap gap-2">
              {needsByPriority.critical.map((need) => {
                const status = getPositionStatus(need.position);
                return (
                  <Badge
                    key={need.position}
                    variant="outline"
                    className={cn(
                      PRIORITY_COLORS.critical,
                      status.addressed && 'opacity-50 line-through'
                    )}
                  >
                    {need.position}
                    {status.count > 0 && ` (${status.count})`}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* High Needs */}
        {needsByPriority.high.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-orange-400 uppercase tracking-wide">
              High Priority
            </p>
            <div className="flex flex-wrap gap-2">
              {needsByPriority.high.map((need) => {
                const status = getPositionStatus(need.position);
                return (
                  <Badge
                    key={need.position}
                    variant="outline"
                    className={cn(
                      PRIORITY_COLORS.high,
                      status.addressed && 'opacity-50 line-through'
                    )}
                  >
                    {need.position}
                    {status.count > 0 && ` (${status.count})`}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Medium Needs */}
        {needsByPriority.medium.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-yellow-400 uppercase tracking-wide">
              Medium Priority
            </p>
            <div className="flex flex-wrap gap-2">
              {needsByPriority.medium.map((need) => {
                const status = getPositionStatus(need.position);
                return (
                  <Badge
                    key={need.position}
                    variant="outline"
                    className={cn(
                      PRIORITY_COLORS.medium,
                      status.addressed && 'opacity-50 line-through'
                    )}
                  >
                    {need.position}
                    {status.count > 0 && ` (${status.count})`}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Draft Summary */}
        <div className="pt-2 border-t">
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Draft Progress
          </p>
          <div className="space-y-2">
            {Object.entries(
              draftedPositions.reduce(
                (acc, pos) => {
                  acc[pos] = (acc[pos] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              )
            ).map(([pos, count]) => (
              <div key={pos} className="flex items-center justify-between text-sm">
                <span>{pos}</span>
                <Badge variant="secondary" className="text-xs">
                  {count} drafted
                </Badge>
              </div>
            ))}
            {draftedPositions.length === 0 && (
              <p className="text-sm text-muted-foreground">No players drafted yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamNeedsPanel;
