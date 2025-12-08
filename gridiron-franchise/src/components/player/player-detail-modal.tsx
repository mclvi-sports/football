"use client";

/**
 * PlayerDetailModal - Full-screen modal wrapper for roster flow
 *
 * Used by:
 * - roster/page.tsx (renders this when player selected from roster)
 *
 * Uses:
 * - player-detail-content.tsx (shared player detail UI)
 * - @/lib/dev-player-store (getDevPlayerById)
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Player } from "@/lib/types";
import { getDevPlayerById } from "@/lib/dev-player-store";
import { PlayerDetailContent } from "@/components/player/player-detail-content";
import { cn } from "@/lib/utils";

interface PlayerDetailModalProps {
  playerId: string;
  onClose: () => void;
  teamColors?: { primary: string; secondary: string };
}

export function PlayerDetailModal({ playerId, onClose, teamColors }: PlayerDetailModalProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load player data
    const playerData = getDevPlayerById(playerId);
    setPlayer(playerData);
    setLoading(false);
  }, [playerId]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-40 bg-background"
      style={{ top: 'calc(3.5rem + env(safe-area-inset-top))' }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-50",
          "w-10 h-10 rounded-full",
          "bg-secondary/80 backdrop-blur-sm border border-border",
          "flex items-center justify-center",
          "hover:bg-secondary transition-colors"
        )}
        aria-label="Close player details"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="h-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading player...</div>
          </div>
        ) : !player ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">Player not found</div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <PlayerDetailContent player={player} teamColors={teamColors} />
        )}
      </div>
    </div>
  );
}
