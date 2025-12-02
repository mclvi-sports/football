"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RosterPlayerCard } from "@/components/dev-tools/roster-player-card";
import { Player, Position, Tier } from "@/lib/types";
import { getTeamRoster, TeamRosterData } from "@/lib/dev-player-store";
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

const TAB_FILTERS: Record<TabType, PositionFilter[]> = {
  all: ["ALL", "QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"],
  offense: ["ALL", "QB", "RB", "WR", "TE", "OL"],
  defense: ["ALL", "DL", "LB", "DB"],
  special: ["ALL", "K", "P"],
};

const TIER_COLORS: Record<Tier, string> = {
  [Tier.Elite]: "text-yellow-400",
  [Tier.Good]: "text-green-400",
  [Tier.Average]: "text-blue-400",
  [Tier.BelowAverage]: "text-orange-400",
  [Tier.Rebuilding]: "text-red-400",
};

export default function TeamRosterPage() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamRosterData | null>(null);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("ovr");
  const [searchQuery, setSearchQuery] = useState("");

  // Load team data from session storage
  useEffect(() => {
    const stored = getTeamRoster();
    if (stored) {
      setTeamData(stored);
    }
    setLoading(false);
  }, []);

  // Reset position filter when tab changes
  useEffect(() => {
    setPositionFilter("ALL");
  }, [activeTab]);

  const players = teamData?.roster.players || [];

  // Calculate stats
  const stats = useMemo(() => {
    if (players.length === 0) {
      return { totalPlayers: 0, avgOvr: 0, avgAge: 0, salaryCap: 0 };
    }

    const totalOvr = players.reduce((sum, p) => sum + p.overall, 0);
    const totalAge = players.reduce((sum, p) => sum + p.age, 0);
    const totalSalary = players.reduce(
      (sum, p) => sum + (p.contract?.salary || 0),
      0
    );

    return {
      totalPlayers: players.length,
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

  const remainingSalaryCap = 225 - stats.salaryCap;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="min-h-screen pb-8">
        <header className="px-5 pt-12 pb-4">
          <Link
            href="/dashboard/dev-tools/full"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Back to Full Game
          </Link>
          <h1 className="text-2xl font-bold mt-2">Team Roster</h1>
        </header>
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-30">🏈</div>
          <p className="text-muted-foreground text-sm mb-4">
            No team selected. Generate a full game first.
          </p>
          <Link
            href="/dashboard/dev-tools/full"
            className="text-primary hover:underline"
          >
            Go to Full Game Generator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 pt-4 pb-3">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <Link
                href="/dashboard/dev-tools/full"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Full Game
              </Link>
              <h1 className="text-2xl font-black uppercase tracking-wide">
                {teamData.team.city} {teamData.team.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {teamData.team.division}
                </span>
                <span className={cn("text-xs font-bold", TIER_COLORS[teamData.tier])}>
                  {teamData.tier}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-green-400">
                {teamData.stats.avgOvr}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">
                Team OVR
              </div>
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
                {stats.totalPlayers}/53
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
                {tab === "special" ? "ST" : tab}
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
