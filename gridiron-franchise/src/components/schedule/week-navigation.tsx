'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeekNavigationProps {
  currentWeek: number;
  totalWeeks: number;
  season: number;
  onWeekChange: (week: number) => void;
}

/**
 * Get approximate date range for a given week
 * Week 1 starts first Thursday of September
 */
function getWeekDateRange(week: number, season: number): string {
  // NFL season starts first Thursday of September
  // Week 1 is typically early September
  const seasonStart = new Date(season, 8, 1); // September 1

  // Find first Thursday
  const dayOfWeek = seasonStart.getDay();
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
  const firstThursday = new Date(seasonStart);
  firstThursday.setDate(seasonStart.getDate() + daysUntilThursday);

  // Calculate week start (Thursday) and end (Monday)
  const weekStart = new Date(firstThursday);
  weekStart.setDate(firstThursday.getDate() + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4); // Monday

  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`;
  };

  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
}

export function WeekNavigation({
  currentWeek,
  totalWeeks,
  season,
  onWeekChange,
}: WeekNavigationProps) {
  const canGoPrev = currentWeek > 1;
  const canGoNext = currentWeek < totalWeeks;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Season Badge */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Season:</span>
        <span className="px-2 py-0.5 rounded bg-secondary border border-border font-medium">
          {season}
        </span>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onWeekChange(currentWeek - 1)}
          disabled={!canGoPrev}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center min-w-[140px]">
          <span className="text-lg font-bold">Week {currentWeek}</span>
          <span className="text-xs text-muted-foreground">
            {getWeekDateRange(currentWeek, season)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onWeekChange(currentWeek + 1)}
          disabled={!canGoNext}
          className="h-8 w-8"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
