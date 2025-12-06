"use client";

import { ChevronDown, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TabType } from "./roster-tabs";

export type PositionFilter =
  | "ALL"
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "T"
  | "G"
  | "C"
  | "DE"
  | "DT"
  | "MLB"
  | "OLB"
  | "CB"
  | "FS"
  | "SS"
  | "K"
  | "P";

const TAB_POSITIONS: Record<TabType, PositionFilter[]> = {
  all: ["ALL", "QB", "RB", "WR", "TE", "T", "G", "C", "DE", "DT", "MLB", "OLB", "CB", "FS", "SS", "K", "P"],
  offense: ["ALL", "QB", "RB", "WR", "TE", "T", "G", "C"],
  defense: ["ALL", "DE", "DT", "MLB", "OLB", "CB", "FS", "SS"],
  special: ["ALL", "K", "P"],
};

const POSITION_LABELS: Record<PositionFilter, string> = {
  ALL: "All Positions",
  QB: "Quarterback",
  RB: "Running Back",
  WR: "Wide Receiver",
  TE: "Tight End",
  T: "Tackle",
  G: "Guard",
  C: "Center",
  DE: "Defensive End",
  DT: "Defensive Tackle",
  MLB: "Middle Linebacker",
  OLB: "Outside Linebacker",
  CB: "Cornerback",
  FS: "Free Safety",
  SS: "Strong Safety",
  K: "Kicker",
  P: "Punter",
};

interface RosterFiltersProps {
  activeTab: TabType;
  positionFilter: PositionFilter;
  onPositionChange: (position: PositionFilter) => void;
  onSortClick: () => void;
}

export function RosterFilters({
  activeTab,
  positionFilter,
  onPositionChange,
  onSortClick,
}: RosterFiltersProps) {
  const positions = TAB_POSITIONS[activeTab];

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {/* Position Dropdown */}
      <div className="relative flex-1">
        <select
          value={positionFilter}
          onChange={(e) => onPositionChange(e.target.value as PositionFilter)}
          className={cn(
            "w-full appearance-none",
            "bg-secondary border border-border rounded-lg",
            "px-4 py-2.5 pr-10",
            "text-sm text-foreground",
            "focus:outline-none focus:ring-1 focus:ring-primary"
          )}
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {POSITION_LABELS[pos]}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>

      {/* Filter Button (placeholder) */}
      <button
        className={cn(
          "p-2.5 rounded-lg",
          "bg-secondary border border-border",
          "text-primary",
          "hover:bg-secondary/80 transition-colors"
        )}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      {/* Sort Button */}
      <button
        onClick={onSortClick}
        className={cn(
          "p-2.5 rounded-lg",
          "bg-secondary border border-border",
          "text-primary",
          "hover:bg-secondary/80 transition-colors"
        )}
      >
        <ArrowUpDown className="w-5 h-5" />
      </button>
    </div>
  );
}
