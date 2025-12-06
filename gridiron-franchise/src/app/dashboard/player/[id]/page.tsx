"use client";

/**
 * Player Detail Page - Page route for direct access
 *
 * Used by:
 * - Search results → player link
 * - Notifications → "Player X injured" link
 * - Trades → "View Player" button
 * - Leaderboards → stat leader link
 * - Direct URL / bookmarks
 *
 * Uses:
 * - player-detail-content.tsx (shared player detail UI)
 * - @/lib/dev-player-store (getDevPlayerById)
 *
 * NOTE: Roster page uses PlayerDetailModal instead (not this page)
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Player } from "@/lib/types";
import { getDevPlayerById } from "@/lib/dev-player-store";
import { PlayerDetailContent } from "@/components/player/player-detail-content";

export default function PlayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playerId = params.id as string;
    const foundPlayer = getDevPlayerById(playerId);
    setPlayer(foundPlayer);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-muted-foreground">Player not found</div>
        <Link href="/dashboard/roster" className="text-primary hover:underline">
          Back to Roster
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button Bar */}
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Shared Player Detail Content */}
      <PlayerDetailContent player={player} />
    </div>
  );
}
