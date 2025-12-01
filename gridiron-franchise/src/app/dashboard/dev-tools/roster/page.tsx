"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayerCard } from "@/components/dev-tools/player-card";
import { Tier, Player, Position } from "@/lib/types";
import { storeDevPlayers } from "@/lib/dev-player-store";
import { cn } from "@/lib/utils";

type PositionGroup = "offense" | "defense" | "special";

const POSITION_GROUPS: Record<PositionGroup, Position[]> = {
  offense: [
    Position.QB,
    Position.RB,
    Position.WR,
    Position.TE,
    Position.LT,
    Position.LG,
    Position.C,
    Position.RG,
    Position.RT,
  ],
  defense: [
    Position.DE,
    Position.DT,
    Position.MLB,
    Position.OLB,
    Position.CB,
    Position.FS,
    Position.SS,
  ],
  special: [Position.K, Position.P],
};

interface RosterStats {
  totalPlayers: number;
  avgOvr: number;
  avgAge: number;
  positionBreakdown: Record<Position, { count: number; avgOvr: number }>;
}

export default function RosterGeneratorPage() {
  const router = useRouter();
  const [tier, setTier] = useState<Tier>(Tier.Average);
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<RosterStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<PositionGroup>("offense");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("compact");

  // Store players in sessionStorage whenever they change
  useEffect(() => {
    if (players.length > 0) {
      storeDevPlayers(players);
    }
  }, [players]);

  const generateRoster = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dev/generate-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await response.json();
      if (data.success) {
        setPlayers(data.roster.players);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to generate roster:", error);
    }
    setLoading(false);
  };

  const handlePlayerClick = (playerId: string) => {
    router.push(`/dashboard/dev-tools/player/${playerId}`);
  };

  const filteredPlayers = players.filter((p) =>
    POSITION_GROUPS[activeGroup].includes(p.position)
  );

  // Group players by position
  const playersByPosition = filteredPlayers.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = [];
    acc[player.position].push(player);
    return acc;
  }, {} as Record<Position, Player[]>);

  // Sort each position group by OVR
  Object.keys(playersByPosition).forEach((pos) => {
    playersByPosition[pos as Position].sort((a, b) => b.overall - a.overall);
  });

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Roster Generator</h1>
      </header>

      <main className="px-5 space-y-6">
        {/* Controls */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                Team Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value={Tier.Elite}>Elite</option>
                <option value={Tier.Good}>Good</option>
                <option value={Tier.Average}>Average</option>
                <option value={Tier.BelowAverage}>Below Average</option>
                <option value={Tier.Rebuilding}>Rebuilding</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={generateRoster}
                disabled={loading}
                className={cn(
                  "px-6 py-2 rounded-lg font-semibold text-sm transition-all",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <div className="text-xs text-muted-foreground">Players</div>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.avgOvr}</div>
              <div className="text-xs text-muted-foreground">Avg OVR</div>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.avgAge}</div>
              <div className="text-xs text-muted-foreground">Avg Age</div>
            </div>
          </div>
        )}

        {/* Position Group Tabs */}
        {players.length > 0 && (
          <>
            <div className="flex gap-2">
              {(["offense", "defense", "special"] as PositionGroup[]).map(
                (group) => (
                  <button
                    key={group}
                    onClick={() => setActiveGroup(group)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                      activeGroup === group
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* View Toggle */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewMode("compact")}
                className={cn(
                  "px-3 py-1 rounded text-xs",
                  viewMode === "compact"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                Compact
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={cn(
                  "px-3 py-1 rounded text-xs",
                  viewMode === "cards"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                Cards
              </button>
            </div>

            {/* Players List */}
            <div className="space-y-6">
              {POSITION_GROUPS[activeGroup].map((position) => {
                const posPlayers = playersByPosition[position];
                if (!posPlayers || posPlayers.length === 0) return null;

                return (
                  <div key={position} className="space-y-2">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                      {position} ({posPlayers.length})
                    </h3>
                    <div
                      className={cn(
                        viewMode === "cards"
                          ? "grid grid-cols-1 gap-3"
                          : "space-y-2"
                      )}
                    >
                      {posPlayers.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => handlePlayerClick(player.id)}
                          className="cursor-pointer hover:scale-[1.01] transition-transform"
                        >
                          <PlayerCard
                            player={player}
                            compact={viewMode === "compact"}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {players.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-2">🏈</div>
            <p>Select a tier and click Generate to create a roster</p>
          </div>
        )}
      </main>
    </div>
  );
}
