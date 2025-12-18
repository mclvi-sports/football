/**
 * Director Big Board
 *
 * Shows the scouting director's top-ranked prospects.
 * This is the staff consensus view showing the director's recommended draft order.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useMemo } from "react";
import { Award, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DraftProspect } from "@/lib/generators/draft-generator";

// ============================================================================
// TYPES
// ============================================================================

interface DirectorBigBoardProps {
  directorRankings: string[];
  prospects: DraftProspect[];
  onProspectClick?: (prospectId: string) => void;
  maxDisplay?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function DirectorBigBoard({
  directorRankings,
  prospects,
  onProspectClick,
  maxDisplay = 25,
}: DirectorBigBoardProps) {
  // Map prospect IDs to full prospect data
  const rankedProspects = useMemo(() => {
    const prospectMap = new Map(prospects.map((p) => [p.id, p]));
    return directorRankings
      .slice(0, maxDisplay)
      .map((id, index) => ({
        rank: index + 1,
        prospect: prospectMap.get(id),
      }))
      .filter((item): item is { rank: number; prospect: DraftProspect } =>
        item.prospect !== undefined
      );
  }, [directorRankings, prospects, maxDisplay]);

  if (rankedProspects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Award className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          Director's big board is being compiled.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Check back after scout reports are generated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Director's Big Board</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          Top {rankedProspects.length}
        </Badge>
      </div>

      {/* Board */}
      <div className="rounded-xl border border-border overflow-hidden bg-secondary/20">
        <div className="divide-y divide-border/30">
          {rankedProspects.map(({ rank, prospect }) => (
            <BigBoardRow
              key={prospect.id}
              rank={rank}
              prospect={prospect}
              onClick={() => onProspectClick?.(prospect.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BIG BOARD ROW
// ============================================================================

interface BigBoardRowProps {
  rank: number;
  prospect: DraftProspect;
  onClick?: () => void;
}

function BigBoardRow({ rank, prospect, onClick }: BigBoardRowProps) {
  // Calculate value indicator (comparing director rank vs projected round)
  const projectedPick = typeof prospect.round === 'number'
    ? (prospect.round - 1) * 32 + 16 // Estimate mid-round pick
    : 250; // UDFA

  const valueDiff = projectedPick - rank;
  const valueIndicator = getValueIndicator(valueDiff);

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
    >
      {/* Rank */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm",
          rank <= 10
            ? "bg-yellow-500/20 text-yellow-400"
            : rank <= 32
            ? "bg-blue-500/20 text-blue-400"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {rank}
      </div>

      {/* Position */}
      <Badge variant="outline" className="w-12 justify-center shrink-0">
        {prospect.position}
      </Badge>

      {/* Name & College */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {prospect.firstName} {prospect.lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {prospect.collegeData?.name}
        </p>
      </div>

      {/* OVR */}
      <div className="text-right shrink-0">
        <p className="font-bold">{prospect.scoutedOvr}</p>
        <p className="text-[10px] text-muted-foreground">{prospect.potentialLabel}</p>
      </div>

      {/* Value Indicator */}
      <ValueIndicator {...valueIndicator} />

      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// ============================================================================
// VALUE INDICATOR
// ============================================================================

interface ValueIndicatorProps {
  type: "value" | "reach" | "fair";
  label: string;
}

function ValueIndicator({ type, label }: ValueIndicatorProps) {
  const Icon = type === "value" ? TrendingUp : type === "reach" ? TrendingDown : Minus;
  const colorClass =
    type === "value"
      ? "text-green-400"
      : type === "reach"
      ? "text-red-400"
      : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-1 shrink-0", colorClass)}>
      <Icon className="w-3 h-3" />
      <span className="text-[10px]">{label}</span>
    </div>
  );
}

function getValueIndicator(valueDiff: number): ValueIndicatorProps {
  if (valueDiff > 30) {
    return { type: "value", label: "Great Value" };
  }
  if (valueDiff > 10) {
    return { type: "value", label: "Value" };
  }
  if (valueDiff < -30) {
    return { type: "reach", label: "Reach" };
  }
  if (valueDiff < -10) {
    return { type: "reach", label: "Slight Reach" };
  }
  return { type: "fair", label: "Fair" };
}

// ============================================================================
// MINI BIG BOARD (for embedding in Staff Insights tab)
// ============================================================================

interface MiniBigBoardProps {
  directorRankings: string[];
  prospects: DraftProspect[];
  onViewFull?: () => void;
  onProspectClick?: (prospectId: string) => void;
}

export function MiniBigBoard({
  directorRankings,
  prospects,
  onViewFull,
  onProspectClick,
}: MiniBigBoardProps) {
  const top5 = useMemo(() => {
    const prospectMap = new Map(prospects.map((p) => [p.id, p]));
    return directorRankings
      .slice(0, 5)
      .map((id, index) => ({
        rank: index + 1,
        prospect: prospectMap.get(id),
      }))
      .filter((item): item is { rank: number; prospect: DraftProspect } =>
        item.prospect !== undefined
      );
  }, [directorRankings, prospects]);

  if (top5.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/20 overflow-hidden">
      <div className="px-4 py-2 bg-secondary/50 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Director's Top 5</span>
        </div>
        {onViewFull && (
          <button
            onClick={onViewFull}
            className="text-xs text-primary hover:underline"
          >
            View All
          </button>
        )}
      </div>

      <div className="divide-y divide-border/30">
        {top5.map(({ rank, prospect }) => (
          <button
            key={prospect.id}
            onClick={() => onProspectClick?.(prospect.id)}
            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
          >
            <span
              className={cn(
                "w-5 h-5 rounded text-xs flex items-center justify-center font-bold",
                rank === 1
                  ? "bg-yellow-500/30 text-yellow-400"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {rank}
            </span>
            <Badge variant="outline" className="text-[10px]">
              {prospect.position}
            </Badge>
            <span className="flex-1 truncate text-sm">
              {prospect.firstName} {prospect.lastName}
            </span>
            <span className="text-sm font-bold">{prospect.scoutedOvr}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
