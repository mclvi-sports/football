"use client";

import { Player } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCareerStore } from "@/stores/career-store";

function getOvrColor(ovr: number): string {
  if (ovr >= 90) return "text-yellow-400";
  if (ovr >= 80) return "text-green-400";
  if (ovr >= 70) return "text-blue-400";
  return "text-muted-foreground";
}

interface RosterPlayerCardProps {
  player: Player;
  onClick?: () => void;
}

export function RosterPlayerCard({ player, onClick }: RosterPlayerCardProps) {
  const { selectedTeam } = useCareerStore();

  // Team colors for jersey number gradient (matches hero section)
  const primaryColor = selectedTeam?.colors.primary || "#2563eb";
  const secondaryColor = selectedTeam?.colors.secondary || "#16a34a";

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
      {/* Jersey Number - Team gradient, rounded square */}
      <div
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-lg font-bold shadow-md"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          color: "#fff",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {player.jerseyNumber}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-medium text-foreground truncate">
          {player.firstName} {player.lastName}
        </div>
        <div className="text-sm text-muted-foreground">
          {player.position} · {player.archetype}
        </div>
      </div>

      {/* OVR */}
      <div className="flex flex-col items-end">
        <span
          className={cn(
            "text-lg font-bold",
            getOvrColor(player.overall)
          )}
        >
          {player.overall}
        </span>
        <span className="text-xs text-muted-foreground">OVR</span>
      </div>
    </button>
  );
}
