"use client";

import type { GMBackground, GMSynergy } from "@/types/gm-persona";
import { cn } from "@/lib/utils";
import { SynergyBadge } from "./synergy-badge";

interface BackgroundCardProps {
  background: GMBackground;
  isSelected: boolean;
  synergy: GMSynergy | null;
  onSelect: (background: GMBackground) => void;
}

export function BackgroundCard({
  background,
  isSelected,
  synergy,
  onSelect,
}: BackgroundCardProps) {
  const hasSynergy = synergy !== null;

  return (
    <button
      onClick={() => onSelect(background)}
      className={cn(
        "w-full text-left rounded-2xl border p-4 transition-all",
        "bg-secondary/50 hover:bg-secondary/80",
        hasSynergy && !isSelected && "border-amber-500/50",
        hasSynergy && isSelected && "border-amber-500 bg-amber-500/10",
        !hasSynergy && isSelected && "border-primary bg-primary/10 ring-1 ring-primary",
        !hasSynergy && !isSelected && "border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Icon */}
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            "text-sm font-bold",
            hasSynergy
              ? "bg-amber-500/20 text-amber-500"
              : isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background text-primary"
          )}
        >
          {background.icon}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base">{background.name}</h3>
        </div>

        {/* Synergy Badge */}
        {hasSynergy && <SynergyBadge />}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {background.description}
      </p>

      {/* Bonuses */}
      <div className="space-y-1.5 mb-3">
        {background.bonuses.map((bonus, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-green-500 mt-0.5">•</span>
            <span>{bonus}</span>
          </div>
        ))}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="text-red-500 mt-0.5">•</span>
          <span>{background.weakness}</span>
        </div>
      </div>

      {/* Synergy Preview */}
      {hasSynergy && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-1">
            Synergy Bonus
          </p>
          <p className="text-sm font-semibold mb-0.5">"{synergy.name}"</p>
          <p className="text-xs text-muted-foreground">{synergy.bonus}</p>
        </div>
      )}
    </button>
  );
}
