/**
 * Position Rankings
 *
 * Shows top prospects at each position.
 * Allows filtering by position and quick-compare.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useState, useMemo } from "react";
import { ChevronRight, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDraftStore } from "@/stores/draft-store";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import type { DraftProspect } from "@/lib/generators/draft-generator";
import { Position } from "@/lib/types";

// ============================================================================
// TYPES
// ============================================================================

interface PositionRankingsProps {
  onProspectClick?: (prospectId: string) => void;
  onCompare?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const POSITION_GROUPS = {
  offense: {
    label: "Offense",
    positions: [
      Position.QB,
      Position.RB,
      Position.WR,
      Position.TE,
      Position.LT,
      Position.LG,
      Position.C,
      Position.RG,
      Position.RT,
    ],
  },
  defense: {
    label: "Defense",
    positions: [
      Position.DE,
      Position.DT,
      Position.MLB,
      Position.OLB,
      Position.CB,
      Position.FS,
      Position.SS,
    ],
  },
  special: {
    label: "Special Teams",
    positions: [Position.K, Position.P],
  },
};

const ALL_POSITIONS = [
  ...POSITION_GROUPS.offense.positions,
  ...POSITION_GROUPS.defense.positions,
  ...POSITION_GROUPS.special.positions,
];

// ============================================================================
// COMPONENT
// ============================================================================

export function PositionRankings({
  onProspectClick,
  onCompare,
}: PositionRankingsProps) {
  const { draftClass } = useDraftStore();
  const { comparisonProspects, addToComparison, removeFromComparison } =
    useScoutingHubStore();

  const [selectedPosition, setSelectedPosition] = useState<Position>(Position.QB);

  // Filter and sort prospects by position
  const rankedProspects = useMemo(() => {
    return draftClass
      .filter((p) => p.position === selectedPosition)
      .sort((a, b) => b.scoutedOvr - a.scoutedOvr)
      .slice(0, 20);
  }, [draftClass, selectedPosition]);

  const handleCompareToggle = (prospectId: string) => {
    if (comparisonProspects.includes(prospectId)) {
      removeFromComparison(prospectId);
    } else {
      addToComparison(prospectId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Position Selector */}
      <div className="flex items-center gap-3">
        <Select
          value={selectedPosition}
          onValueChange={(v) => setSelectedPosition(v as Position)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POSITION_GROUPS).map(([key, group]) => (
              <div key={key}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {group.label}
                </div>
                {group.positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {comparisonProspects.length > 0 && (
          <Badge
            variant="outline"
            className="cursor-pointer"
            onClick={onCompare}
          >
            Compare ({comparisonProspects.length}/3)
          </Badge>
        )}
      </div>

      {/* Rankings */}
      <div className="rounded-xl border border-border overflow-hidden bg-secondary/20">
        <div className="px-4 py-2 bg-secondary/50 border-b border-border/50">
          <h3 className="font-medium text-sm">Top {selectedPosition}s</h3>
          <p className="text-xs text-muted-foreground">
            {rankedProspects.length} prospects
          </p>
        </div>

        <div className="divide-y divide-border/30">
          {rankedProspects.map((prospect, index) => (
            <ProspectRankRow
              key={prospect.id}
              prospect={prospect}
              rank={index + 1}
              isInComparison={comparisonProspects.includes(prospect.id)}
              onToggleCompare={() => handleCompareToggle(prospect.id)}
              onClick={() => onProspectClick?.(prospect.id)}
            />
          ))}
        </div>
      </div>

      {rankedProspects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No {selectedPosition}s in this draft class
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PROSPECT ROW
// ============================================================================

interface ProspectRankRowProps {
  prospect: DraftProspect;
  rank: number;
  isInComparison: boolean;
  onToggleCompare: () => void;
  onClick?: () => void;
}

function ProspectRankRow({
  prospect,
  rank,
  isInComparison,
  onToggleCompare,
  onClick,
}: ProspectRankRowProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 hover:bg-secondary/30 transition-colors">
      {/* Compare Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleCompare();
        }}
        className={cn(
          "w-6 h-6 rounded flex items-center justify-center shrink-0 transition-colors",
          isInComparison
            ? "bg-primary text-primary-foreground"
            : "bg-secondary/50 hover:bg-secondary"
        )}
      >
        {isInComparison ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
      </button>

      {/* Rank */}
      <span
        className={cn(
          "w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0",
          rank === 1
            ? "bg-yellow-500/20 text-yellow-400"
            : rank === 2
            ? "bg-gray-400/20 text-gray-400"
            : rank === 3
            ? "bg-orange-500/20 text-orange-400"
            : "bg-secondary/50 text-muted-foreground"
        )}
      >
        {rank}
      </span>

      {/* Info - Clickable */}
      <button onClick={onClick} className="flex-1 min-w-0 text-left">
        <p className="font-medium truncate">
          {prospect.firstName} {prospect.lastName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {prospect.collegeData?.name} • Rd {prospect.round}
        </p>
      </button>

      {/* Stats */}
      <div className="text-right shrink-0">
        <p className="font-bold">{prospect.scoutedOvr}</p>
        <p className="text-[10px] text-muted-foreground">{prospect.potentialLabel}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </div>
  );
}

// ============================================================================
// COMPACT POSITION OVERVIEW
// ============================================================================

interface PositionOverviewProps {
  onPositionSelect: (position: Position) => void;
}

export function PositionOverview({ onPositionSelect }: PositionOverviewProps) {
  const { draftClass } = useDraftStore();

  // Get top prospect for each position
  const topByPosition = useMemo(() => {
    const result: Record<Position, DraftProspect | undefined> = {} as Record<
      Position,
      DraftProspect | undefined
    >;

    for (const pos of ALL_POSITIONS) {
      const top = draftClass
        .filter((p) => p.position === pos)
        .sort((a, b) => b.scoutedOvr - a.scoutedOvr)[0];
      result[pos] = top;
    }

    return result;
  }, [draftClass]);

  return (
    <div className="space-y-4">
      {Object.entries(POSITION_GROUPS).map(([key, group]) => (
        <div key={key}>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">
            {group.label}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {group.positions.map((pos) => {
              const top = topByPosition[pos];
              return (
                <button
                  key={pos}
                  onClick={() => onPositionSelect(pos)}
                  className="p-2 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors text-left"
                >
                  <Badge variant="outline" className="mb-1">
                    {pos}
                  </Badge>
                  {top ? (
                    <>
                      <p className="text-xs font-medium truncate">
                        {top.lastName}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {top.scoutedOvr} OVR
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">None</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
