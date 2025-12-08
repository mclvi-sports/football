"use client";

/**
 * Roster Page - Team roster with player cards
 *
 * Uses:
 * - player-detail-modal.tsx (opens when player card clicked)
 *
 * NOTE: Player cards open modal, NOT navigate to /dashboard/player/[id]
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RosterTabs, TabType } from "@/components/roster/roster-tabs";
import { RosterFilters, PositionFilter } from "@/components/roster/roster-filters";
import { RosterSortSheet, SortOption } from "@/components/roster/roster-sort-sheet";
import { RosterPlayerCard } from "@/components/roster/roster-player-card";
import { PlayerDetailModal } from "@/components/player/player-detail-modal";
import { useCareerStore } from "@/stores/career-store";
import { getTeamById, getFullGameData, TeamRosterData } from "@/lib/dev-player-store";
import { LEAGUE_TEAMS } from "@/lib/data/teams";
import { Player, Position } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function RosterPage() {
  const router = useRouter();
  const { playerTeamId, selectedTeam, _hasHydrated } = useCareerStore();

  // Data state
  const [teamData, setTeamData] = useState<TeamRosterData | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerTeamMap, setPlayerTeamMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("ovr-desc");
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Initialize selectedTeamId from career store
  useEffect(() => {
    if (_hasHydrated && playerTeamId && !selectedTeamId) {
      setSelectedTeamId(playerTeamId);
    }
  }, [_hasHydrated, playerTeamId, selectedTeamId]);

  // Load team data based on selected team
  useEffect(() => {
    if (!_hasHydrated || !selectedTeamId) return;

    if (selectedTeamId === "all") {
      // Load all players from all teams with team mapping
      const fullGame = getFullGameData();
      if (fullGame?.teams) {
        const all: Player[] = [];
        const teamMap = new Map<string, string>();

        for (const team of fullGame.teams) {
          for (const player of team.roster.players) {
            all.push(player);
            teamMap.set(player.id, team.team.id);
          }
        }

        setAllPlayers(all);
        setPlayerTeamMap(teamMap);
        setTeamData(null);
      }
    } else {
      const data = getTeamById(selectedTeamId);
      setTeamData(data);
      setAllPlayers([]);
    }
    setLoading(false);
  }, [selectedTeamId, _hasHydrated]);

  // Get viewed team info for colors
  const viewedTeam = useMemo(() => {
    return LEAGUE_TEAMS.find(t => t.id === selectedTeamId);
  }, [selectedTeamId]);

  // Reset position filter when tab changes
  useEffect(() => {
    setPositionFilter("ALL");
  }, [activeTab]);

  const players = selectedTeamId === "all" ? allPlayers : (teamData?.roster.players || []);

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
  }, [players, activeTab, positionFilter, sortBy]);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  if (!_hasHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading roster...</p>
      </div>
    );
  }

  if (!teamData && allPlayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 text-center">
        <div className="text-5xl mb-4 opacity-30">🏈</div>
        <p className="text-muted-foreground mb-4">
          No roster data available. Generate a league first.
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
      {/* Team Dropdown */}
      <div className="px-4 py-3">
        <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {/* All Teams option */}
            <SelectItem value="all">All Teams</SelectItem>
            {/* User's team */}
            {selectedTeam && (
              <SelectItem value={selectedTeam.id}>My Team</SelectItem>
            )}
            {/* Other teams A-Z */}
            {LEAGUE_TEAMS
              .filter((team) => team.id !== selectedTeam?.id)
              .sort((a, b) => `${a.city} ${a.name}`.localeCompare(`${b.city} ${b.name}`))
              .map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.city} {team.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <RosterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <RosterFilters
        activeTab={activeTab}
        positionFilter={positionFilter}
        onPositionChange={setPositionFilter}
        onSortClick={() => setSortSheetOpen(true)}
      />

      {/* Player List */}
      <div className="px-4 space-y-3">
        {filteredPlayers.map((player) => {
          // Get team colors - use viewedTeam for single team, or look up from map for "all"
          const playerTeamId = selectedTeamId === "all" ? playerTeamMap.get(player.id) : selectedTeamId;
          const playerTeam = playerTeamId ? LEAGUE_TEAMS.find(t => t.id === playerTeamId) : null;

          return (
            <RosterPlayerCard
              key={player.id}
              player={player}
              onClick={() => handlePlayerClick(player.id)}
              teamColors={playerTeam?.colors || viewedTeam?.colors}
            />
          );
        })}
      </div>

      {/* No Results */}
      {players.length > 0 && filteredPlayers.length === 0 && (
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

      {/* Player Detail Modal */}
      {selectedPlayerId && (
        <PlayerDetailModal
          playerId={selectedPlayerId}
          onClose={() => setSelectedPlayerId(null)}
          teamColors={viewedTeam?.colors}
        />
      )}
    </div>
  );
}
