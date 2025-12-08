"use client";

/**
 * Free Agency Page - Browse available free agents
 *
 * Uses:
 * - player-detail-modal.tsx (opens when player card clicked)
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RosterTabs, TabType } from "@/components/roster/roster-tabs";
import { RosterFilters, PositionFilter } from "@/components/roster/roster-filters";
import { RosterSortSheet, SortOption } from "@/components/roster/roster-sort-sheet";
import { FAPlayerCard } from "@/components/roster/fa-player-card";
import { PlayerDetailModal } from "@/components/player/player-detail-modal";
import { useCareerStore } from "@/stores/career-store";
import { getFreeAgents } from "@/lib/dev-player-store";
import { Player, Position } from "@/lib/types";

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
  T: [Position.LT, Position.RT],
  G: [Position.LG, Position.RG],
  C: [Position.C],
  DE: [Position.DE],
  DT: [Position.DT],
  MLB: [Position.MLB],
  OLB: [Position.OLB],
  CB: [Position.CB],
  FS: [Position.FS],
  SS: [Position.SS],
  K: [Position.K],
  P: [Position.P],
};

export default function FreeAgencyPage() {
  const router = useRouter();
  const { _hasHydrated } = useCareerStore();

  // Data state
  const [freeAgents, setFreeAgents] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("ovr-desc");
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Load free agents - wait for hydration
  useEffect(() => {
    if (!_hasHydrated) return;

    const players = getFreeAgents();
    setFreeAgents(players);
    setLoading(false);
  }, [_hasHydrated]);

  // Reset position filter when tab changes
  useEffect(() => {
    setPositionFilter("ALL");
  }, [activeTab]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = [...freeAgents];

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

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "ovr-desc":
          return b.overall - a.overall;
        case "ovr-asc":
          return a.overall - b.overall;
        case "name":
          return `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`
          );
        case "position":
          return a.position.localeCompare(b.position);
        case "age":
          return a.age - b.age;
        case "age-desc":
          return b.age - a.age;
        default:
          return 0;
      }
    });

    return result;
  }, [freeAgents, activeTab, positionFilter, sortBy]);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  if (!_hasHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading free agents...</p>
      </div>
    );
  }

  if (freeAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 text-center">
        <div className="text-5xl mb-4 opacity-30">FA</div>
        <p className="text-muted-foreground mb-4">
          No free agents available. Generate a league first.
        </p>
        <button
          onClick={() => router.push("/dashboard/dev-tools/full")}
          className="text-primary hover:underline"
        >
          Go to League Generator
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Tabs */}
      <RosterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <RosterFilters
        activeTab={activeTab}
        positionFilter={positionFilter}
        onPositionChange={setPositionFilter}
        onSortClick={() => setSortSheetOpen(true)}
      />

      {/* Player Count */}
      <div className="px-4 pb-2">
        <p className="text-sm text-muted-foreground">
          {filteredPlayers.length} free agent{filteredPlayers.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Player List */}
      <div className="px-4 space-y-3">
        {filteredPlayers.map((player) => (
          <FAPlayerCard
            key={player.id}
            player={player}
            onClick={() => handlePlayerClick(player.id)}
          />
        ))}
      </div>

      {/* No Results */}
      {freeAgents.length > 0 && filteredPlayers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">
            No players match your filters
          </p>
        </div>
      )}

      {/* Sort Sheet */}
      <RosterSortSheet
        open={sortSheetOpen}
        onOpenChange={setSortSheetOpen}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Player Detail Modal - neutral colors for FA */}
      <PlayerDetailModal
        playerId={selectedPlayerId}
        open={!!selectedPlayerId}
        onOpenChange={(open) => !open && setSelectedPlayerId(null)}
        teamColors={{ primary: "#6b7280", secondary: "#4b5563" }}
      />
    </div>
  );
}
