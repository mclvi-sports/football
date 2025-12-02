"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RosterPlayerCard } from "@/components/dev-tools/roster-player-card";
import { Player, Position, Tier } from "@/lib/types";
import { storeDevPlayers } from "@/lib/dev-player-store";
import { cn } from "@/lib/utils";

type TabType = "all" | "offense" | "defense" | "special";
type SortOption = "ovr" | "position" | "age" | "salary" | "number";
type PositionFilter =
  | "ALL"
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "OL"
  | "DL"
  | "LB"
  | "DB"
  | "K"
  | "P";

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

// Position filter mappings
const POSITION_FILTER_MAP: Record<PositionFilter, Position[]> = {
  ALL: [...OFFENSE_POSITIONS, ...DEFENSE_POSITIONS, ...SPECIAL_POSITIONS],
  QB: [Position.QB],
  RB: [Position.RB],
  WR: [Position.WR],
  TE: [Position.TE],
  OL: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT],
  DL: [Position.DE, Position.DT],
  LB: [Position.MLB, Position.OLB],
  DB: [Position.CB, Position.FS, Position.SS],
  K: [Position.K],
  P: [Position.P],
};

// Tab-specific position filters
const TAB_FILTERS: Record<TabType, PositionFilter[]> = {
  all: ["ALL", "QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"],
  offense: ["ALL", "QB", "RB", "WR", "TE", "OL"],
  defense: ["ALL", "DL", "LB", "DB"],
  special: ["ALL", "K", "P"],
};

interface RosterStats {
  totalPlayers: number;
  rosterSize: number;
  avgOvr: number;
  avgAge: number;
  salaryCap: number;
}

export default function RosterViewPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<Tier>(Tier.Good);

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("ovr");
  const [searchQuery, setSearchQuery] = useState("");

  // Store players whenever they change
  useEffect(() => {
    if (players.length > 0) {
      storeDevPlayers(players);
    }
  }, [players]);

  // Reset position filter when tab changes
  useEffect(() => {
    setPositionFilter("ALL");
  }, [activeTab]);

  // Generate roster
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
        // Assign jersey numbers and contracts if missing
        const playersWithExtras = data.roster.players.map(
          (p: Player, i: number) => ({
            ...p,
            jerseyNumber: p.jerseyNumber || getJerseyNumber(p.position, i),
            contract: p.contract || {
              years: Math.floor(Math.random() * 4) + 1,
              salary: generateSalary(p.overall),
            },
          })
        );
        setPlayers(playersWithExtras);
      }
    } catch (error) {
      console.error("Failed to generate roster:", error);
    }
    setLoading(false);
  };

  // Calculate stats
  const stats: RosterStats = useMemo(() => {
    if (players.length === 0) {
      return {
        totalPlayers: 0,
        rosterSize: 53,
        avgOvr: 0,
        avgAge: 0,
        salaryCap: 0,
      };
    }

    const totalOvr = players.reduce((sum, p) => sum + p.overall, 0);
    const totalAge = players.reduce((sum, p) => sum + p.age, 0);
    const totalSalary = players.reduce(
      (sum, p) => sum + (p.contract?.salary || 0),
      0
    );

    return {
      totalPlayers: players.length,
      rosterSize: 53,
      avgOvr: Math.round(totalOvr / players.length),
      avgAge: Math.round((totalAge / players.length) * 10) / 10,
      salaryCap: totalSalary,
    };
  }, [players]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = [...players];

    // Filter by tab
    if (activeTab === "offense") {
      result = result.filter((p) => OFFENSE_POSITIONS.includes(p.position));
    } else if (activeTab === "defense") {
      result = result.filter((p) => DEFENSE_POSITIONS.includes(p.position));
    } else if (activeTab === "special") {
      result = result.filter((p) => SPECIAL_POSITIONS.includes(p.position));
    }

    // Filter by position
    if (positionFilter !== "ALL") {
      const positions = POSITION_FILTER_MAP[positionFilter];
      result = result.filter((p) => positions.includes(p.position));
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "ovr":
          return b.overall - a.overall;
        case "age":
          return a.age - b.age;
        case "salary":
          return (b.contract?.salary || 0) - (a.contract?.salary || 0);
        case "number":
          return (a.jerseyNumber || 99) - (b.jerseyNumber || 99);
        case "position":
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });

    return result;
  }, [players, activeTab, positionFilter, sortBy, searchQuery]);

  const handlePlayerClick = (playerId: string) => {
    router.push(`/dashboard/dev-tools/player/${playerId}`);
  };

  // Salary cap is $225M, contract.salary is in millions
  const remainingSalaryCap = 225 - stats.salaryCap;

  return (
    <div className="min-h-screen pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <Link
                href="/dashboard/dev-tools"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Dev Tools
              </Link>
              <h1 className="text-2xl font-black uppercase tracking-wide">
                Roster
              </h1>
            </div>
            <div className="flex gap-2">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
                className="bg-background/50 border border-border/50 rounded-lg px-2 py-1.5 text-xs"
              >
                <option value={Tier.Elite}>Elite</option>
                <option value={Tier.Good}>Good</option>
                <option value={Tier.Average}>Average</option>
                <option value={Tier.BelowAverage}>Below Avg</option>
                <option value={Tier.Rebuilding}>Rebuilding</option>
              </select>
              <button
                onClick={generateRoster}
                disabled={loading}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold",
                  "bg-primary text-primary-foreground",
                  "disabled:opacity-50"
                )}
              >
                {loading ? "..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className={cn(
                "w-full px-4 py-2.5 pr-10",
                "bg-background/50 border border-border/50 rounded-lg",
                "text-sm placeholder:text-muted-foreground/60",
                "focus:outline-none focus:border-primary/50"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
              🔍
            </span>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            <div className="flex-shrink-0 bg-background/50 border border-border/50 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Roster
              </div>
              <div className="text-sm font-bold">
                {stats.totalPlayers}/{stats.rosterSize}
              </div>
            </div>
            <div className="flex-shrink-0 bg-background/50 border border-border/50 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Salary Cap
              </div>
              <div
                className={cn(
                  "text-sm font-bold",
                  remainingSalaryCap > 0 ? "text-green-400" : "text-red-400"
                )}
              >
                ${remainingSalaryCap.toFixed(1)}M
              </div>
            </div>
            <div className="flex-shrink-0 bg-background/50 border border-border/50 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Avg Age
              </div>
              <div className="text-sm font-bold">{stats.avgAge || "--"}</div>
            </div>
            <div className="flex-shrink-0 bg-background/50 border border-border/50 rounded-lg px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Team OVR
              </div>
              <div className="text-sm font-bold">{stats.avgOvr || "--"}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border/30">
          {(["all", "offense", "defense", "special"] as TabType[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-all",
                  activeTab === tab
                    ? "text-foreground border-b-2 border-primary bg-background/30"
                    : "text-muted-foreground border-b-2 border-transparent"
                )}
              >
                {tab === "special" ? "Special Teams" : tab}
              </button>
            )
          )}
        </div>
      </header>

      {/* Position Filters */}
      {players.length > 0 && (
        <div className="sticky top-[220px] z-40 bg-background/80 backdrop-blur-lg border-b border-border/30">
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
            {TAB_FILTERS[activeTab].map((filter) => (
              <button
                key={filter}
                onClick={() => setPositionFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
                  positionFilter === filter
                    ? "bg-gradient-to-r from-primary to-green-600 text-white shadow-lg shadow-primary/30"
                    : "bg-background/50 border border-border/50 text-muted-foreground"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Bar */}
      {players.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-b border-border/20">
          <span className="text-xs text-muted-foreground uppercase">
            {filteredPlayers.length} Players
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-background/50 border border-border/50 rounded px-2 py-1 text-xs font-bold"
            >
              <option value="ovr">Overall Rating</option>
              <option value="position">Position</option>
              <option value="age">Age</option>
              <option value="salary">Salary</option>
              <option value="number">Jersey Number</option>
            </select>
          </div>
        </div>
      )}

      {/* Player List */}
      <div className="px-4 py-4 space-y-3">
        {filteredPlayers.map((player) => (
          <RosterPlayerCard
            key={player.id}
            player={player}
            onClick={() => handlePlayerClick(player.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {players.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">🏈</div>
          <p className="text-muted-foreground text-sm">
            Select a tier and click Generate to create a roster
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="text-muted-foreground text-sm">
            Generating roster...
          </div>
        </div>
      )}

      {/* No Results */}
      {players.length > 0 && filteredPlayers.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">🔍</div>
          <p className="text-muted-foreground text-sm">
            No players match your filters
          </p>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getJerseyNumber(position: Position, index: number): number {
  const positionRanges: Record<string, [number, number]> = {
    [Position.QB]: [1, 19],
    [Position.RB]: [20, 49],
    [Position.WR]: [10, 19],
    [Position.TE]: [80, 89],
    [Position.LT]: [70, 79],
    [Position.LG]: [60, 69],
    [Position.C]: [50, 59],
    [Position.RG]: [60, 69],
    [Position.RT]: [70, 79],
    [Position.DE]: [90, 99],
    [Position.DT]: [90, 99],
    [Position.MLB]: [50, 59],
    [Position.OLB]: [50, 59],
    [Position.CB]: [20, 39],
    [Position.FS]: [20, 39],
    [Position.SS]: [20, 39],
    [Position.K]: [1, 9],
    [Position.P]: [1, 9],
  };

  const range = positionRanges[position] || [1, 99];
  return range[0] + (index % (range[1] - range[0] + 1));
}

function generateSalary(ovr: number): number {
  // Returns salary in millions
  // Base salary increases exponentially with OVR
  const baseSalary = 0.8; // $800K = 0.8M
  const multiplier = Math.pow(1.12, ovr - 60);
  const salary = baseSalary * multiplier;

  // Add some randomness (+/- 20%)
  const variance = 0.8 + Math.random() * 0.4;

  // Round to 1 decimal place
  return Math.round(salary * variance * 10) / 10;
}
