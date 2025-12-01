"use client";

import type { GMArchetype } from "@/types/gm-persona";
import { cn } from "@/lib/utils";

interface ArchetypeCardProps {
  archetype: GMArchetype;
  isSelected: boolean;
  onSelect: (archetype: GMArchetype) => void;
}

export function ArchetypeCard({
  archetype,
  isSelected,
  onSelect,
}: ArchetypeCardProps) {
  return (
    <button
      onClick={() => onSelect(archetype)}
      className={cn(
        "w-full text-left rounded-2xl border p-4 transition-all",
        "bg-secondary/50 hover:bg-secondary/80",
        isSelected
          ? "border-primary bg-primary/10 ring-1 ring-primary"
          : "border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Icon */}
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            "text-sm font-bold",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background text-primary"
          )}
        >
          {archetype.icon}
        </div>

        {/* Title & Philosophy */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base">{archetype.name}</h3>
          <p className="text-xs text-muted-foreground italic truncate">
            {archetype.philosophy}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {archetype.description}
      </p>

      {/* Starting Skill Badge */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
          Starting Skill
        </p>
        <p className="text-sm font-medium">
          {archetype.skill.name}{" "}
          <span className="text-muted-foreground">({archetype.skill.tier})</span>
        </p>
      </div>
    </button>
  );
}
