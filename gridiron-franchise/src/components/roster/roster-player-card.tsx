"use client";

import { Player } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RosterPlayerCardProps {
  player: Player;
  onClick?: () => void;
}

export function RosterPlayerCard({ player, onClick }: RosterPlayerCardProps) {
  const isLowOvr = player.overall < 80;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4",
        "bg-secondary rounded-xl p-4",
        "text-left transition-colors",
        "hover:bg-secondary/80 active:scale-[0.99]"
      )}
    >
      {/* Jersey Number Circle */}
      <div
        className={cn(
          "flex-shrink-0 w-12 h-12",
          "flex items-center justify-center",
          "rounded-full",
          "bg-primary/10 text-primary",
          "text-lg font-bold"
        )}
      >
        {player.jerseyNumber}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-medium text-foreground truncate">
          {player.firstName} {player.lastName}
        </div>
        <div className="text-sm text-muted-foreground">{player.position}</div>
      </div>

      {/* OVR */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">OVR</span>
        <span
          className={cn(
            "text-lg font-semibold",
            isLowOvr ? "text-red-500" : "text-foreground"
          )}
        >
          {player.overall}
        </span>
      </div>
    </button>
  );
}
