"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCareerStore } from "@/stores/career-store";
import { useOffseasonStore } from "@/stores/offseason-store";
import { getFreeAgents, getTeamById, getFullGameData, storeFullGameData, storeFreeAgents } from "@/lib/dev-player-store";
import { Player, Position } from "@/lib/types";

// Position groups for filtering
const POSITION_GROUPS = {
  all: { label: "All Positions", positions: [] as Position[] },
  offense: {
    label: "Offense",
    positions: [Position.QB, Position.RB, Position.WR, Position.TE, Position.LT, Position.LG, Position.C, Position.RG, Position.RT],
  },
  defense: {
    label: "Defense",
    positions: [Position.DE, Position.DT, Position.MLB, Position.OLB, Position.CB, Position.FS, Position.SS],
  },
  special: {
    label: "Special Teams",
    positions: [Position.K, Position.P],
  },
};

export default function FreeAgencyPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();

  // Data state
  const [freeAgents, setFreeAgentsLocal] = useState<Player[]>([]);
  const [signedPlayers, setSignedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("ovr");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showSignDialog, setShowSignDialog] = useState(false);

  // Mark phase as in-progress
  useEffect(() => {
    if (!isPhaseCompleted("free-agency")) {
      setPhaseStatus("free-agency", "in-progress");
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  // Load free agents
  useEffect(() => {
    if (!_hasHydrated) return;

    const players = getFreeAgents();
    setFreeAgentsLocal(players);
    setLoading(false);
  }, [_hasHydrated]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = [...freeAgents];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query)
      );
    }

    // Position filter
    if (positionFilter !== "all") {
      const group = POSITION_GROUPS[positionFilter as keyof typeof POSITION_GROUPS];
      if (group?.positions.length > 0) {
        result = result.filter((p) => group.positions.includes(p.position));
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "ovr":
          return b.overall - a.overall;
        case "age":
          return a.age - b.age;
        case "name":
          return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
        default:
          return 0;
      }
    });

    return result;
  }, [freeAgents, searchQuery, positionFilter, sortBy]);

  // Handle sign player
  const handleSignPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setShowSignDialog(true);
  };

  const confirmSignPlayer = () => {
    if (!selectedPlayer || !selectedTeam) return;

    // Get current game data
    const gameData = getFullGameData();
    if (!gameData) return;

    // Find and update the team
    const updatedTeams = gameData.teams.map((teamData) => {
      if (teamData.team.id === selectedTeam.id) {
        return {
          ...teamData,
          roster: {
            ...teamData.roster,
            players: [...teamData.roster.players, selectedPlayer],
          },
        };
      }
      return teamData;
    });

    // Update the full game data
    storeFullGameData({
      ...gameData,
      teams: updatedTeams,
    });

    // Remove from free agents
    const updatedFreeAgents = freeAgents.filter((p) => p.id !== selectedPlayer.id);
    storeFreeAgents(updatedFreeAgents);
    setFreeAgentsLocal(updatedFreeAgents);

    // Track signed players
    setSignedPlayers((prev) => [...prev, selectedPlayer]);

    // Close dialog
    setShowSignDialog(false);
    setSelectedPlayer(null);
  };

  // Handle complete free agency
  const handleCompleteFreeAgency = () => {
    completePhase("free-agency");
    router.push("/dashboard/offseason");
  };

  // Wait for hydration
  if (!_hasHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Free Agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/offseason")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Free Agency</h1>
            <p className="text-xs text-muted-foreground">
              {freeAgents.length} available • {signedPlayers.length} signed
            </p>
          </div>
          <Button onClick={handleCompleteFreeAgency}>Done</Button>
        </div>

        {/* Search & Filters */}
        <div className="px-5 pb-3 space-y-2">
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-2">
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="offense">Offense</SelectItem>
                <SelectItem value="defense">Defense</SelectItem>
                <SelectItem value="special">Special Teams</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ovr">OVR</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Signed Players Summary */}
      {signedPlayers.length > 0 && (
        <div className="px-5 py-3 bg-green-500/10 border-b border-green-500/20">
          <p className="text-sm font-medium text-green-600 mb-2">
            Signed This Session ({signedPlayers.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {signedPlayers.map((player) => (
              <Badge key={player.id} variant="secondary" className="bg-green-500/20 text-green-600">
                {player.position} {player.firstName[0]}. {player.lastName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Free Agent List */}
      <main className="px-5 pt-4">
        <div className="space-y-2">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3"
            >
              {/* Position Badge */}
              <Badge variant="outline" className="w-12 justify-center shrink-0">
                {player.position}
              </Badge>

              {/* Name & Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {player.firstName} {player.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Age {player.age} • {player.experience} yrs exp
                </p>
              </div>

              {/* OVR */}
              <div className="text-right shrink-0 mr-2">
                <p className="font-bold">{player.overall}</p>
                <p className="text-xs text-muted-foreground">OVR</p>
              </div>

              {/* Sign Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSignPlayer(player)}
                className="shrink-0"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Sign
              </Button>
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {freeAgents.length === 0
                ? "No free agents available"
                : "No players match your filters"}
            </p>
          </div>
        )}
      </main>

      {/* Sign Confirmation Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Free Agent</DialogTitle>
            <DialogDescription>
              Add {selectedPlayer?.firstName} {selectedPlayer?.lastName} to your roster?
            </DialogDescription>
          </DialogHeader>

          {selectedPlayer && (
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedPlayer.overall}</p>
                <p className="text-xs text-muted-foreground">OVR</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedPlayer.potential}</p>
                <p className="text-xs text-muted-foreground">POT</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedPlayer.age}</p>
                <p className="text-xs text-muted-foreground">Age</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSignPlayer}>
              <Check className="w-4 h-4 mr-1" />
              Sign Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
