"use client";

import { Player } from "@/lib/types";
import { heightToString, weightToString } from "@/lib/data/physical-ranges";
import { TRAITS } from "@/lib/data/traits";
import { BADGES } from "@/lib/data/badges";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
}

function getTraitName(traitId: string): string {
  const trait = TRAITS.find((t) => t.id === traitId);
  return trait?.name || traitId;
}

function getBadgeName(badgeId: string): string {
  const badge = BADGES.find((b) => b.id === badgeId);
  return badge?.name || badgeId;
}

function getBadgeTierColor(tier: string): string {
  switch (tier) {
    case "bronze":
      return "bg-amber-700/20 text-amber-600";
    case "silver":
      return "bg-slate-400/20 text-slate-400";
    case "gold":
      return "bg-yellow-500/20 text-yellow-500";
    case "hof":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getOvrColor(ovr: number): string {
  if (ovr >= 90) return "text-purple-400";
  if (ovr >= 80) return "text-green-400";
  if (ovr >= 70) return "text-yellow-400";
  if (ovr >= 60) return "text-orange-400";
  return "text-red-400";
}

export function PlayerCard({ player, compact = false }: PlayerCardProps) {
  if (compact) {
    return (
      <div className="bg-secondary/50 border border-border rounded-xl p-3 flex items-center gap-3">
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg",
              getOvrColor(player.overall),
              "bg-secondary"
            )}
          >
            {player.overall}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">
              {player.firstName} {player.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {player.position}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {player.archetype} · Age {player.age}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">
            {player.firstName} {player.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {player.position} · {player.archetype}
          </p>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "text-2xl font-bold",
              getOvrColor(player.overall)
            )}
          >
            {player.overall}
          </div>
          <div className="text-xs text-muted-foreground">
            POT {player.potential}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Age</div>
          <div className="font-semibold">{player.age}</div>
        </div>
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Exp</div>
          <div className="font-semibold">{player.experience}yr</div>
        </div>
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Ht</div>
          <div className="font-semibold text-sm">{heightToString(player.height)}</div>
        </div>
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Wt</div>
          <div className="font-semibold text-sm">{player.weight}</div>
        </div>
      </div>

      {/* 40 Time */}
      <div className="text-xs text-muted-foreground text-center">
        40-yard: {player.fortyTime.toFixed(2)}s
      </div>

      {/* Traits */}
      {player.traits.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">Traits</div>
          <div className="flex flex-wrap gap-1">
            {player.traits.map((traitId, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
              >
                {getTraitName(traitId)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {player.badges.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground font-medium">Badges</div>
          <div className="flex flex-wrap gap-1">
            {player.badges.map((badge, i) => (
              <span
                key={i}
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  getBadgeTierColor(badge.tier)
                )}
              >
                {getBadgeName(badge.id)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
