'use client';

import { cn } from '@/lib/utils';
import { useGMPointsStore } from '@/stores/gm-points-store';

interface GMPointsDisplayProps {
  className?: string;
  showBreakdown?: boolean;
}

export function GMPointsDisplay({
  className,
  showBreakdown = false,
}: GMPointsDisplayProps) {
  const available = useGMPointsStore((s) => s.getAvailablePoints());
  const totalEarned = useGMPointsStore((s) => s.getTotalEarned());
  const totalSpent = useGMPointsStore((s) => s.getTotalSpent());

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Main GP display */}
      <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5">
        <span className="text-amber-500 font-bold text-lg">{available}</span>
        <span className="text-amber-500/70 text-sm font-medium">GP</span>
      </div>

      {/* Optional breakdown */}
      {showBreakdown && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Earned: <span className="text-green-500">{totalEarned}</span>
          </span>
          <span>
            Spent: <span className="text-red-400">{totalSpent}</span>
          </span>
        </div>
      )}
    </div>
  );
}

interface GMPointsCompactProps {
  className?: string;
}

export function GMPointsCompact({ className }: GMPointsCompactProps) {
  const available = useGMPointsStore((s) => s.getAvailablePoints());

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 text-amber-500 font-semibold',
        className
      )}
    >
      <span>{available}</span>
      <span className="text-xs opacity-70">GP</span>
    </div>
  );
}
