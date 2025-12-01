"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayerCard } from "@/components/dev-tools/player-card";
import { Player, Position } from "@/lib/types";
import { storeDevPlayers } from "@/lib/dev-player-store";
import { cn } from "@/lib/utils";

type FAQuality = "high" | "medium" | "low" | "mixed";
type PositionFilter = "all" | "offense" | "defense" | "special";

const OFFENSE_POSITIONS = [
  Position.QB,
  Position.RB,
  Position.WR,
  Position.TE,
  Position.LT,
  Position.LG,
  Position.C,
  Position.RG,
  Position.RT,
];

const DEFENSE_POSITIONS = [
  Position.DE,
  Position.DT,
  Position.MLB,
  Position.OLB,
  Position.CB,
  Position.FS,
  Position.SS,
];

const SPECIAL_POSITIONS = [Position.K, Position.P];

interface FAStats {
  totalPlayers: number;
  avgOvr: number;
  avgAge: number;
  positionCounts: Record<Position, number>;
  ovrDistribution: { range: string; count: number }[];
}

export default function FAGeneratorPage() {
  const router = useRouter();
  const [size, setSize] = useState<number>(100);
  const [quality, setQuality] = useState<FAQuality>("mixed");
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<FAStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("compact");

  useEffect(() => {
    if (players.length > 0) {
      storeDevPlayers(players);
    }
  }, [players]);

  const generateFA = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dev/generate-fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, quality }),
      });
      const data = await response.json();
      if (data.success) {
        setPlayers(data.players);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to generate FA pool:", error);
    }
    setLoading(false);
  };

  const handlePlayerClick = (playerId: string) => {
    router.push(`/dashboard/dev-tools/player/${playerId}`);
  };

  const getFilteredPlayers = () => {
    if (positionFilter === "all") return players;
    if (positionFilter === "offense") {
      return players.filter((p) => OFFENSE_POSITIONS.includes(p.position));
    }
    if (positionFilter === "defense") {
      return players.filter((p) => DEFENSE_POSITIONS.includes(p.position));
    }
    return players.filter((p) => SPECIAL_POSITIONS.includes(p.position));
  };

  const filteredPlayers = getFilteredPlayers();

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Free Agent Generator</h1>
      </header>

      <main className="px-5 space-y-6">
        {/* Controls */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Pool Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value={50}>50 Players</option>
                <option value={100}>100 Players</option>
                <option value={150}>150 Players</option>
                <option value={200}>200 Players</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as FAQuality)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="high">High (72-85 OVR)</option>
                <option value="medium">Medium (65-76 OVR)</option>
                <option value="low">Low (55-68 OVR)</option>
                <option value="mixed">Mixed (55-82 OVR)</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateFA}
            disabled={loading}
            className={cn(
              "w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Generating..." : "Generate Free Agents"}
          </button>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="space-y-3">
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

            {/* OVR Distribution */}
            <div className="bg-secondary/50 border border-border rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-2">OVR Distribution</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {stats.ovrDistribution.map((d) => (
                  <div key={d.range} className="bg-secondary rounded-lg p-2">
                    <div className="font-bold">{d.count}</div>
                    <div className="text-[10px] text-muted-foreground">{d.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Position Filter & View Toggle */}
        {players.length > 0 && (
          <>
            <div className="flex gap-2">
              {(["all", "offense", "defense", "special"] as PositionFilter[]).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setPositionFilter(filter)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                      positionFilter === filter
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                )
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Showing {filteredPlayers.length} players
              </span>
              <div className="flex gap-2">
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
            </div>

            {/* Players List */}
            <div
              className={cn(
                viewMode === "cards" ? "grid grid-cols-1 gap-3" : "space-y-2"
              )}
            >
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player.id)}
                  className="cursor-pointer hover:scale-[1.01] transition-transform"
                >
                  <PlayerCard player={player} compact={viewMode === "compact"} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {players.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-2">🏷️</div>
            <p>Configure options and click Generate to create a free agent pool</p>
          </div>
        )}
      </main>
    </div>
  );
}
