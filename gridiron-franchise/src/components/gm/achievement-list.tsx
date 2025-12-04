'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGMPointsStore } from '@/stores/gm-points-store';
import {
  allAchievements,
  getAchievementsByCategory,
} from '@/lib/data/gm-achievements';
import { getCareerStats } from '@/lib/gm-points-utils';
import type { Achievement, AchievementCategory } from '@/types/gm-points';
import { Trophy, Star, Users, Sparkles, Check } from 'lucide-react';

const categoryIcons: Record<AchievementCategory, React.ReactNode> = {
  season: <Trophy className="h-4 w-4" />,
  development: <Star className="h-4 w-4" />,
  management: <Users className="h-4 w-4" />,
  special: <Sparkles className="h-4 w-4" />,
};

const categoryLabels: Record<AchievementCategory, string> = {
  season: 'Season',
  development: 'Development',
  management: 'Management',
  special: 'Special',
};

interface AchievementListProps {
  className?: string;
  filter?: AchievementCategory;
  showEarnedOnly?: boolean;
}

export function AchievementList({
  className,
  filter,
  showEarnedOnly = false,
}: AchievementListProps) {
  const hasEarned = useGMPointsStore((s) => s.hasEarnedAchievement);

  const achievements = filter
    ? getAchievementsByCategory(filter)
    : allAchievements;

  const filteredAchievements = showEarnedOnly
    ? achievements.filter((a) => hasEarned(a.id))
    : achievements;

  // Group by category
  const grouped = filteredAchievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    },
    {} as Record<AchievementCategory, Achievement[]>
  );

  return (
    <ScrollArea className={cn('h-[400px]', className)}>
      <div className="space-y-6 p-1">
        {Object.entries(grouped).map(([category, achievements]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              {categoryIcons[category as AchievementCategory]}
              <h3 className="font-semibold text-sm">
                {categoryLabels[category as AchievementCategory]}
              </h3>
            </div>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isEarned={hasEarned(achievement.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  isEarned: boolean;
}

function AchievementCard({ achievement, isEarned }: AchievementCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-colors',
        isEarned
          ? 'bg-primary/5 border-primary/30'
          : 'bg-secondary/30 border-border opacity-60'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isEarned ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
        )}
      >
        {isEarned ? (
          <Check className="h-4 w-4" />
        ) : (
          categoryIcons[achievement.category]
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{achievement.name}</p>
          <Badge variant={isEarned ? 'default' : 'secondary'} className="text-xs">
            {achievement.points} GP
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {achievement.description}
        </p>
        {achievement.oneTime && (
          <span className="text-xs text-amber-500">One-time only</span>
        )}
      </div>
    </div>
  );
}

interface AchievementProgressProps {
  className?: string;
}

export function AchievementProgress({ className }: AchievementProgressProps) {
  // Access raw state to avoid infinite loop from getStats returning new objects
  const points = useGMPointsStore((s) => s.points);

  // Derive stats from raw state
  const stats = useMemo(() => getCareerStats(points), [points]);
  const totalAchievements = allAchievements.length;
  const progressPercent = (stats.uniqueAchievements / totalAchievements) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Achievements Unlocked</span>
        <span className="font-medium">
          {stats.uniqueAchievements}/{totalAchievements}
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Total Earned: {stats.totalAchievements}</span>
        <span>Avg GP/Season: {stats.averagePointsPerSeason}</span>
      </div>
    </div>
  );
}

interface RecentAchievementsProps {
  limit?: number;
  className?: string;
}

export function RecentAchievements({
  limit = 5,
  className,
}: RecentAchievementsProps) {
  const history = useGMPointsStore((s) => s.points.achievementHistory);

  const recent = [...history]
    .sort((a, b) => b.earnedAt - a.earnedAt)
    .slice(0, limit);

  if (recent.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        No achievements earned yet
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {recent.map((record, i) => {
        const achievement = allAchievements.find(
          (a) => a.id === record.achievementId
        );
        if (!achievement) return null;

        return (
          <div
            key={`${record.achievementId}-${record.earnedAt}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20"
          >
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm flex-1">{achievement.name}</span>
            <Badge variant="outline" className="text-xs">
              +{achievement.points} GP
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
