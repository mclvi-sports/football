"use client";

import { TeamInfo } from "@/lib/data/teams";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  team: TeamInfo;
  selected?: boolean;
  onSelect?: (team: TeamInfo) => void;
}

export function TeamCard({ team, selected, onSelect }: TeamCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(team)}
      className={cn(
        "w-full p-4 bg-card border rounded-2xl flex items-center gap-4 text-left transition-all",
        selected
          ? "border-blue-500 bg-blue-500/10"
          : "border-border hover:bg-accent hover:-translate-y-0.5"
      )}
    >
      {/* Team Logo Placeholder */}
      <div
        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[22px] font-bold flex-shrink-0 shadow-md"
        style={{
          backgroundColor: team.colors.primary,
          color: team.colors.secondary,
        }}
      >
        {team.id}
      </div>

      {/* Team Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-muted-foreground font-medium">
          {team.city}
        </p>
        <p className="text-lg font-bold text-foreground truncate">
          {team.name}
        </p>
        <span className="inline-block text-[11px] text-muted-foreground/70 uppercase tracking-wide bg-muted/50 px-1.5 py-0.5 rounded mt-1">
          {team.division}
        </span>
      </div>
    </button>
  );
}
