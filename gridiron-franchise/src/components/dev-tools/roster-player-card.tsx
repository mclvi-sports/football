"use client";

import { Player } from "@/lib/types";
import { BADGES } from "@/lib/data/badges";
import { cn } from "@/lib/utils";

interface RosterPlayerCardProps {
  player: Player;
  onClick?: () => void;
}

function getBadgeName(badgeId: string): string {
  const badge = BADGES.find((b) => b.id === badgeId);
  return badge?.name || badgeId;
}

function getOvrTier(ovr: number): "elite" | "star" | "starter" | "backup" {
  if (ovr >= 85) return "elite";
  if (ovr >= 80) return "star";
  if (ovr >= 75) return "starter";
  return "backup";
}

function formatName(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}. ${lastName.toUpperCase()}`;
}

function formatExperience(exp: number): string {
  if (exp === 0) return "R";
  return `${exp}yr`;
}

export function RosterPlayerCard({ player, onClick }: RosterPlayerCardProps) {
  const ovrTier = getOvrTier(player.overall);

  // Get top 2 badges for display
  const displayBadges = player.badges.slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-gradient-to-br from-secondary/90 to-background/90",
        "backdrop-blur-xl border border-border/50 rounded-xl",
        "p-4 flex items-center gap-3",
        "cursor-pointer transition-all duration-200",
        "active:scale-[0.98] hover:border-border hover:shadow-lg hover:shadow-white/5"
      )}
    >
      {/* Player Avatar - Jersey Number */}
      <div
        className={cn(
          "w-14 h-14 rounded-lg flex items-center justify-center",
          "text-xl font-black text-white flex-shrink-0",
          "bg-gradient-to-br from-primary to-green-600"
        )}
      >
        {player.jerseyNumber || "--"}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        {/* Header Row */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground font-bold">
            #{player.jerseyNumber || "--"}
          </span>
          <span className="font-bold text-sm truncate">
            {formatName(player.firstName, player.lastName)}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold",
              "bg-primary/30 border border-primary/50 text-primary"
            )}
          >
            {player.position}
          </span>
        </div>

        {/* Meta Row */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>Age: {player.age}</span>
          <span>Exp: {formatExperience(player.experience)}</span>
          <span>${((player.contract?.salary || 1) * 1).toFixed(1)}M</span>
        </div>

        {/* Badges Row */}
        {displayBadges.length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {displayBadges.map((badge, i) => (
              <span
                key={i}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                  badge.tier === "gold" || badge.tier === "hof"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                    : "bg-slate-400/20 text-slate-400 border border-slate-400/40"
                )}
              >
                {getBadgeName(badge.id)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* OVR Display */}
      <div
        className={cn(
          "text-3xl font-black",
          ovrTier === "elite" &&
            "bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent",
          ovrTier === "star" && "text-green-400",
          ovrTier === "starter" && "text-blue-400",
          ovrTier === "backup" && "text-muted-foreground"
        )}
        style={
          ovrTier === "elite"
            ? { textShadow: "0 0 10px rgba(251, 191, 36, 0.3)" }
            : undefined
        }
      >
        {player.overall}
      </div>
    </div>
  );
}
