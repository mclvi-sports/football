"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Star, X } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCareerStore } from "@/stores/career-store";
import { useDraftStore } from "@/stores/draft-store";
import { useOffseasonStore } from "@/stores/offseason-store";
import type { DraftProspect } from "@/lib/generators/draft-generator";
import { Position } from "@/lib/types";

// Draft tags
const DRAFT_TAGS = ["Sleeper", "Value", "Reach", "Target", "Avoid"] as const;
type DraftTag = typeof DRAFT_TAGS[number];

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

export default function ScoutingPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();
  const {
    draftClass,
    userBoard,
    _hasHydrated: draftHydrated,
    initializeDraft,
    addProspectTag,
    removeProspectTag,
    setProspectNote,
    updateUserRankings,
  } = useDraftStore();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [roundFilter, setRoundFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<DraftTag | "all">("all");
  const [selectedProspect, setSelectedProspect] = useState<DraftProspect | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Mark phase as in-progress
  useEffect(() => {
    if (!isPhaseCompleted("scouting")) {
      setPhaseStatus("scouting", "in-progress");
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  // Load draft class
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftHydrated) return;

      // If draft already initialized, use existing data
      if (draftClass.length > 0) {
        setIsLoading(false);
        return;
      }

      // Fetch draft class from API
      try {
        const response = await fetch("/api/draft/generate?size=275&year=2025&combine=true");
        const data = await response.json();

        if (data.success) {
          const teamId = selectedTeam?.id || "BOS";
          const teams = await import("@/lib/data/teams").then((m) => m.LEAGUE_TEAMS);
          initializeDraft(data.draftClass, teams, teamId, 2025);
        }
      } catch (error) {
        console.error("Error loading draft class:", error);
      }

      setIsLoading(false);
    };

    loadDraft();
  }, [draftHydrated, draftClass.length, selectedTeam?.id, initializeDraft]);

  // Filter prospects
  const filteredProspects = useMemo(() => {
    let prospects = [...draftClass];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      prospects = prospects.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.collegeData?.name.toLowerCase().includes(query)
      );
    }

    // Position filter
    if (positionFilter !== "all") {
      const group = POSITION_GROUPS[positionFilter as keyof typeof POSITION_GROUPS];
      if (group?.positions.length > 0) {
        prospects = prospects.filter((p) => group.positions.includes(p.position));
      }
    }

    // Round filter
    if (roundFilter !== "all") {
      if (roundFilter === "UDFA") {
        prospects = prospects.filter((p) => p.round === "UDFA");
      } else {
        prospects = prospects.filter((p) => p.round === parseInt(roundFilter));
      }
    }

    // Tag filter
    if (tagFilter !== "all") {
      prospects = prospects.filter((p) => userBoard.tags[p.id]?.includes(tagFilter));
    }

    // Sort by user board ranking
    prospects.sort((a, b) => {
      const aIdx = userBoard.rankings.indexOf(a.id);
      const bIdx = userBoard.rankings.indexOf(b.id);
      return aIdx - bIdx;
    });

    return prospects;
  }, [draftClass, searchQuery, positionFilter, roundFilter, tagFilter, userBoard]);

  // Handle tag toggle
  const handleTagToggle = (prospectId: string, tag: DraftTag) => {
    const currentTags = userBoard.tags[prospectId] || [];
    if (currentTags.includes(tag)) {
      removeProspectTag(prospectId, tag);
    } else {
      addProspectTag(prospectId, tag);
    }
  };

  // Handle note save
  const handleNoteSave = (prospectId: string) => {
    setProspectNote(prospectId, noteInput);
    setNoteInput("");
  };

  // Handle complete scouting
  const handleCompleteScouting = () => {
    completePhase("scouting");
    router.push("/dashboard/offseason");
  };

  // Wait for hydration
  if (!_hasHydrated || !draftHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Prospects...</p>
        </div>
      </div>
    );
  }

  const taggedCount = Object.keys(userBoard.tags).filter(
    (id) => userBoard.tags[id]?.length > 0
  ).length;

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
            <h1 className="text-lg font-bold">Scouting</h1>
            <p className="text-xs text-muted-foreground">
              {draftClass.length} prospects • {taggedCount} tagged
            </p>
          </div>
          <Button onClick={handleCompleteScouting}>Done</Button>
        </div>

        {/* Search & Filters */}
        <div className="px-5 pb-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prospects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[120px] shrink-0">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="offense">Offense</SelectItem>
                <SelectItem value="defense">Defense</SelectItem>
                <SelectItem value="special">Special Teams</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roundFilter} onValueChange={setRoundFilter}>
              <SelectTrigger className="w-[100px] shrink-0">
                <SelectValue placeholder="Round" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rounds</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7].map((r) => (
                  <SelectItem key={r} value={r.toString()}>
                    Round {r}
                  </SelectItem>
                ))}
                <SelectItem value="UDFA">UDFA</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={(v) => setTagFilter(v as DraftTag | "all")}>
              <SelectTrigger className="w-[100px] shrink-0">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {DRAFT_TAGS.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Prospect List */}
      <main className="px-5 pt-4">
        <div className="space-y-2">
          {filteredProspects.map((prospect, index) => {
            const tags = userBoard.tags[prospect.id] || [];
            const note = userBoard.notes[prospect.id];
            const isSelected = selectedProspect?.id === prospect.id;

            return (
              <div
                key={prospect.id}
                className={cn(
                  "rounded-xl border p-3 transition-all",
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/30 border-border"
                )}
              >
                {/* Main Row */}
                <button
                  onClick={() => setSelectedProspect(isSelected ? null : prospect)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <span className="text-xs text-muted-foreground w-6 text-right">
                      #{index + 1}
                    </span>

                    {/* Position Badge */}
                    <Badge variant="outline" className="w-12 justify-center shrink-0">
                      {prospect.position}
                    </Badge>

                    {/* Name & College */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {prospect.firstName} {prospect.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {prospect.collegeData?.name} • Rd {prospect.round}
                      </p>
                    </div>

                    {/* OVR & Potential */}
                    <div className="text-right shrink-0">
                      <p className="font-bold">{prospect.scoutedOvr}</p>
                      <p className="text-xs text-muted-foreground">
                        {prospect.potentialLabel}
                      </p>
                    </div>

                    {/* Tag indicators */}
                    {tags.length > 0 && (
                      <div className="shrink-0">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{prospect.overall}</p>
                        <p className="text-[10px] text-muted-foreground">True OVR</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{prospect.potential}</p>
                        <p className="text-[10px] text-muted-foreground">Potential</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{prospect.age}</p>
                        <p className="text-[10px] text-muted-foreground">Age</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-2">
                        <p className="text-lg font-bold">
                          {prospect.fortyTime?.toFixed(2) || "-"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">40 Time</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {DRAFT_TAGS.map((tag) => {
                          const isActive = tags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => handleTagToggle(prospect.id, tag)}
                              className={cn(
                                "px-2 py-0.5 rounded-full text-xs transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                              )}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Note */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      {note ? (
                        <div className="flex items-start gap-2">
                          <p className="flex-1 text-sm bg-background/50 rounded-lg p-2">
                            {note}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8"
                            onClick={() => setProspectNote(prospect.id, "")}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a note..."
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            disabled={!noteInput.trim()}
                            onClick={() => handleNoteSave(prospect.id)}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Traits */}
                    {prospect.traits && prospect.traits.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Traits</p>
                        <div className="flex flex-wrap gap-1">
                          {prospect.traits.map((trait) => (
                            <Badge key={trait} variant="secondary" className="text-xs">
                              {trait.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No prospects match your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
