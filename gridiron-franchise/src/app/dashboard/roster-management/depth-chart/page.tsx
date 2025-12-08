"use client";

/**
 * Depth Chart Page - Manage team depth chart with drag and drop
 *
 * Same UI as roster page, but organized by position with drag-drop reordering.
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { RosterTabs, TabType } from "@/components/roster/roster-tabs";
import { RosterPlayerCard } from "@/components/roster/roster-player-card";
import { PlayerDetailModal } from "@/components/player/player-detail-modal";
import { useCareerStore } from "@/stores/career-store";
import { getTeamById, updateTeamDepthChart, TeamRosterData } from "@/lib/dev-player-store";
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

// Sortable player card wrapper
function SortablePlayerCard({
  player,
  onClick,
  teamColors,
}: {
  player: Player;
  onClick: () => void;
  teamColors?: { primary: string; secondary: string };
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {/* Player card */}
      <div className="flex-1" onClick={onClick}>
        <RosterPlayerCard player={player} teamColors={teamColors} />
      </div>
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-6 h-full text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
}

// Position group component
function PositionGroup({
  position,
  players,
  depthChart,
  teamId,
  teamColors,
  onPlayerClick,
  onReorder,
}: {
  position: Position;
  players: Player[];
  depthChart: Record<Position, string[]>;
  teamId: string;
  teamColors?: { primary: string; secondary: string };
  onPlayerClick: (playerId: string) => void;
  onReorder: (position: Position, playerIds: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get players in depth chart order
  const orderedPlayerIds = depthChart[position] || [];
  const orderedPlayers = orderedPlayerIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => p !== undefined);

  // Add any players not in depth chart (shouldn't happen, but safety)
  const positionPlayers = players.filter((p) => p.position === position);
  const missingPlayers = positionPlayers.filter(
    (p) => !orderedPlayerIds.includes(p.id)
  );
  const allPlayers = [...orderedPlayers, ...missingPlayers];

  if (allPlayers.length === 0) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = allPlayers.findIndex((p) => p.id === active.id);
      const newIndex = allPlayers.findIndex((p) => p.id === over.id);

      const newOrder = arrayMove(allPlayers, oldIndex, newIndex);
      const newPlayerIds = newOrder.map((p) => p.id);

      // Update local state and persist
      onReorder(position, newPlayerIds);
      updateTeamDepthChart(teamId, position, newPlayerIds);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
        {position} ({allPlayers.length})
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allPlayers.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {allPlayers.map((player) => (
              <SortablePlayerCard
                key={player.id}
                player={player}
                onClick={() => onPlayerClick(player.id)}
                teamColors={teamColors}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default function DepthChartPage() {
  const router = useRouter();
  const { playerTeamId, selectedTeam, _hasHydrated } = useCareerStore();

  // Data state
  const [teamData, setTeamData] = useState<TeamRosterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [depthChart, setDepthChart] = useState<Record<Position, string[]>>(
    {} as Record<Position, string[]>
  );

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>("offense");
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

    const data = getTeamById(selectedTeamId);
    setTeamData(data);
    if (data) {
      setDepthChart({ ...data.roster.depthChart });
    }
    setLoading(false);
  }, [selectedTeamId, _hasHydrated]);

  // Get viewed team info for colors
  const viewedTeam = useMemo(() => {
    return LEAGUE_TEAMS.find((t) => t.id === selectedTeamId);
  }, [selectedTeamId]);

  const players = teamData?.roster.players || [];

  // Get positions for active tab
  const activePositions = useMemo(() => {
    switch (activeTab) {
      case "offense":
        return OFFENSE_POSITIONS;
      case "defense":
        return DEFENSE_POSITIONS;
      case "special":
        return SPECIAL_POSITIONS;
      default:
        return [...OFFENSE_POSITIONS, ...DEFENSE_POSITIONS, ...SPECIAL_POSITIONS];
    }
  }, [activeTab]);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  const handleReorder = (position: Position, playerIds: string[]) => {
    setDepthChart((prev) => ({
      ...prev,
      [position]: playerIds,
    }));
  };

  if (!_hasHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading depth chart...</p>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-5 text-center">
        <div className="text-5xl mb-4 opacity-30">📋</div>
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

      {/* Tabs */}
      <RosterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Depth Chart by Position */}
      <div className="px-4 pt-4">
        {activePositions.map((position) => (
          <PositionGroup
            key={position}
            position={position}
            players={players}
            depthChart={depthChart}
            teamId={selectedTeamId}
            teamColors={viewedTeam?.colors}
            onPlayerClick={handlePlayerClick}
            onReorder={handleReorder}
          />
        ))}
      </div>

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
