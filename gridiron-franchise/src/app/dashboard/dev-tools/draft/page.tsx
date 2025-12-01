"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayerCard } from "@/components/dev-tools/player-card";
import { Player, Position } from "@/lib/types";
import { storeDevPlayers } from "@/lib/dev-player-store";
import { cn } from "@/lib/utils";

type DraftDepth = "shallow" | "normal" | "deep";
type DraftTalent = "strong" | "average" | "weak";
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

interface DraftStats {
  totalPlayers: number;
  avgOvr: number;
  avgPotential: number;
  positionCounts: Record<Position, number>;
  roundBreakdown: { round: number; count: number; avgOvr: number }[];
  topProspects: { name: string; position: Position; ovr: number; potential: number }[];
}

export default function DraftGeneratorPage() {
  const router = useRouter();
  const [depth, setDepth] = useState<DraftDepth>("normal");
  const [talent, setTalent] = useState<DraftTalent>("average");
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<DraftStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("compact");

  useEffect(() => {
    if (players.length > 0) {
      storeDevPlayers(players);
    }
  }, [players]);

  const generateDraft = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dev/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depth, talent }),
      });
      const data = await response.json();
      if (data.success) {
        setPlayers(data.players);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to generate draft class:", error);
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
        <h1 className="text-2xl font-bold mt-2">Draft Class Generator</h1>
      </header>

      <main className="px-5 space-y-6">
        {/* Controls */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Class Depth
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value as DraftDepth)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="shallow">Shallow (180)</option>
                <option value="normal">Normal (224)</option>
                <option value="deep">Deep (280)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Talent Level
              </label>
              <select
                value={talent}
                onChange={(e) => setTalent(e.target.value as DraftTalent)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="strong">Strong (+4 OVR)</option>
                <option value="average">Average</option>
                <option value="weak">Weak (-4 OVR)</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateDraft}
            disabled={loading}
            className={cn(
              "w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Generating..." : "Generate Draft Class"}
          </button>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.totalPlayers}</div>
                <div className="text-xs text-muted-foreground">Prospects</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.avgOvr}</div>
                <div className="text-xs text-muted-foreground">Avg OVR</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.avgPotential}</div>
                <div className="text-xs text-muted-foreground">Avg POT</div>
              </div>
            </div>

            {/* Top Prospects */}
            <div className="bg-secondary/50 border border-border rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-2">Top 10 Prospects</div>
              <div className="space-y-1">
                {stats.topProspects.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-4">{i + 1}.</span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.position}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-400 font-bold">{p.ovr}</span>
                      <span className="text-green-400 text-xs">
                        POT {p.potential}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round Breakdown */}
            <div className="bg-secondary/50 border border-border rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-2">By Round</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {stats.roundBreakdown.slice(0, 8).map((r) => (
                  <div key={r.round} className="bg-secondary rounded-lg p-2">
                    <div className="font-bold">{r.avgOvr}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Rd {r.round} ({r.count})
                    </div>
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
                Showing {filteredPlayers.length} prospects
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
            <div className="text-4xl mb-2">🎓</div>
            <p>Configure options and click Generate to create a draft class</p>
          </div>
        )}
      </main>
    </div>
  );
}
