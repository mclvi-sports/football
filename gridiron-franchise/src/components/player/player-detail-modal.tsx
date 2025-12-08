"use client";

/**
 * PlayerDetailModal - Dialog modal wrapper for player details
 *
 * Used by:
 * - roster/page.tsx (renders this when player selected from roster)
 *
 * Uses:
 * - player-detail-content.tsx (shared player detail UI)
 * - @/lib/dev-player-store (getDevPlayerById)
 */

import { useEffect, useState } from "react";
import { Player } from "@/lib/types";
import { getDevPlayerById } from "@/lib/dev-player-store";
import { PlayerDetailContent } from "@/components/player/player-detail-content";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface PlayerDetailModalProps {
  playerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamColors?: { primary: string; secondary: string };
}

export function PlayerDetailModal({
  playerId,
  open,
  onOpenChange,
  teamColors
}: PlayerDetailModalProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId && open) {
      setLoading(true);
      const playerData = getDevPlayerById(playerId);
      setPlayer(playerData);
      setLoading(false);
    }
  }, [playerId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-hidden p-0 border-zinc-800 bg-background">
        <div className="h-full max-h-[90vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading player...</div>
            </div>
          ) : !player ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-muted-foreground mb-4">Player not found</div>
                <button
                  onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  );
}
