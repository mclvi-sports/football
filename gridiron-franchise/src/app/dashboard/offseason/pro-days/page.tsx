"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Eye, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCareerStore } from "@/stores/career-store";
import { useDraftStore } from "@/stores/draft-store";
import { useOffseasonStore } from "@/stores/offseason-store";
import type { DraftProspect } from "@/lib/generators/draft-generator";

// College tiers for filtering
const COLLEGE_TIERS = [
  { value: "all", label: "All Schools" },
  { value: "blue-blood", label: "Blue Blood" },
  { value: "elite", label: "Elite" },
  { value: "power-5", label: "Power 5" },
  { value: "group-5", label: "Group of 5" },
  { value: "fcs", label: "FCS" },
];

// Max private workouts allowed
const MAX_PRIVATE_WORKOUTS = 30;

export default function ProDaysPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();
  const {
    draftClass,
    userBoard,
    _hasHydrated: draftHydrated,
    initializeDraft,
    addProspectTag,
  } = useDraftStore();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState("all");
  const [visitedSchools, setVisitedSchools] = useState<Set<string>>(new Set());
  const [privateWorkouts, setPrivateWorkouts] = useState<Set<string>>(new Set());
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  // Mark phase as in-progress
  useEffect(() => {
    if (!isPhaseCompleted("pro-days")) {
      setPhaseStatus("pro-days", "in-progress");
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  // Load draft class
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftHydrated) return;

      if (draftClass.length > 0) {
        setIsLoading(false);
        return;
      }

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

  // Group prospects by school
  const schoolGroups = useMemo(() => {
    const groups: Record<string, DraftProspect[]> = {};

    draftClass.forEach((prospect) => {
      const school = prospect.collegeData?.name || prospect.college || "Unknown";
      if (!groups[school]) {
        groups[school] = [];
      }
      groups[school].push(prospect);
    });

    // Sort schools by number of prospects (descending)
    return Object.entries(groups)
      .map(([school, prospects]) => ({
        school,
        prospects: prospects.sort((a, b) => b.overall - a.overall),
        tier: prospects[0]?.collegeData?.tier || "unknown",
        topProspect: prospects[0],
      }))
      .filter((g) => {
        if (tierFilter === "all") return true;
        return g.tier === tierFilter;
      })
      .sort((a, b) => b.prospects.length - a.prospects.length);
  }, [draftClass, tierFilter]);

  // Get prospects for selected school
  const schoolProspects = useMemo(() => {
    if (!selectedSchool) return [];
    return schoolGroups.find((g) => g.school === selectedSchool)?.prospects || [];
  }, [selectedSchool, schoolGroups]);

  // Handle school visit
  const handleVisitSchool = (school: string) => {
    setVisitedSchools((prev) => new Set([...prev, school]));
    setSelectedSchool(school);
  };

  // Handle private workout
  const handlePrivateWorkout = (prospectId: string) => {
    if (privateWorkouts.size >= MAX_PRIVATE_WORKOUTS) return;

    setPrivateWorkouts((prev) => new Set([...prev, prospectId]));
    // Add "Workout" tag to prospect
    addProspectTag(prospectId, "Workout");
  };

  // Handle complete
  const handleComplete = () => {
    completePhase("pro-days");
    router.push("/dashboard/offseason");
  };

  // Wait for hydration
  if (!_hasHydrated || !draftHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Pro Days...</p>
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
            <h1 className="text-lg font-bold">Pro Days</h1>
            <p className="text-xs text-muted-foreground">
              Week 20 • {visitedSchools.size} schools visited • {privateWorkouts.size}/{MAX_PRIVATE_WORKOUTS} workouts
            </p>
          </div>
          <Button onClick={handleComplete}>Done</Button>
        </div>

        {/* Filter */}
        <div className="px-5 pb-3">
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="School Tier" />
            </SelectTrigger>
            <SelectContent>
              {COLLEGE_TIERS.map((tier) => (
                <SelectItem key={tier.value} value={tier.value}>
                  {tier.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="px-5 pt-4 space-y-6">
        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Visit Schools & Conduct Workouts</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Visit schools to see their prospects. Conduct up to {MAX_PRIVATE_WORKOUTS} private
                  workouts to get detailed evaluations on prospects you're interested in.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-column layout on larger screens */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* School List */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Schools ({schoolGroups.length})
            </h2>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {schoolGroups.map(({ school, prospects, tier, topProspect }) => {
                const isVisited = visitedSchools.has(school);
                const isSelected = selectedSchool === school;

                return (
                  <button
                    key={school}
                    onClick={() => handleVisitSchool(school)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all",
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : isVisited
                        ? "bg-green-500/5 border-green-500/30"
                        : "bg-secondary/30 border-border hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          isVisited ? "bg-green-500/20 text-green-500" : "bg-secondary"
                        )}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{school}</p>
                          {isVisited && (
                            <Badge variant="outline" className="text-green-500 border-green-500/30 text-xs">
                              Visited
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {prospects.length} prospect{prospects.length !== 1 ? "s" : ""} •
                          Top: {topProspect.position} {topProspect.lastName} ({topProspect.overall})
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* School Detail / Prospects */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {selectedSchool ? `${selectedSchool} Prospects` : "Select a School"}
            </h2>

            {selectedSchool ? (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {schoolProspects.map((prospect) => {
                  const hasWorkout = privateWorkouts.has(prospect.id);
                  const tags = userBoard.tags[prospect.id] || [];

                  return (
                    <div
                      key={prospect.id}
                      className={cn(
                        "p-3 rounded-xl border",
                        hasWorkout
                          ? "bg-primary/5 border-primary/30"
                          : "bg-secondary/30 border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-12 justify-center shrink-0">
                          {prospect.position}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {prospect.firstName} {prospect.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Rd {prospect.round} • {prospect.potentialLabel}
                          </p>
                        </div>
                        <div className="text-right shrink-0 mr-2">
                          <p className="font-bold">{prospect.scoutedOvr}</p>
                          <p className="text-xs text-muted-foreground">OVR</p>
                        </div>
                        {hasWorkout ? (
                          <Badge className="bg-primary/20 text-primary shrink-0">
                            <Eye className="w-3 h-3 mr-1" />
                            Workout
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={privateWorkouts.size >= MAX_PRIVATE_WORKOUTS}
                            onClick={() => handlePrivateWorkout(prospect.id)}
                            className="shrink-0"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Workout
                          </Button>
                        )}
                      </div>

                      {/* Show extra detail if workout conducted */}
                      {hasWorkout && (
                        <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-4 gap-2 text-center">
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-sm font-bold">{prospect.overall}</p>
                            <p className="text-[10px] text-muted-foreground">True OVR</p>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-sm font-bold">{prospect.potential}</p>
                            <p className="text-[10px] text-muted-foreground">Potential</p>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-sm font-bold">{prospect.fortyTime?.toFixed(2)}</p>
                            <p className="text-[10px] text-muted-foreground">40 Time</p>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-sm font-bold">{prospect.age}</p>
                            <p className="text-[10px] text-muted-foreground">Age</p>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Card className="flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground">
                  Select a school to view prospects
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
