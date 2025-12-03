"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Store imports
import {
  storeFullGameData,
  storeDevPlayers,
  storeFreeAgents,
  storeDraftClass,
  clearFullGameData,
  clearDevPlayers,
  clearFreeAgents,
  clearDraftClass,
  FullGameData,
  TeamRosterData,
} from "@/lib/dev-player-store";
import { storeCoaching, clearCoaching } from "@/lib/coaching/coaching-store";
import { storeFacilities, clearFacilities } from "@/lib/facilities/facilities-store";
import { storeSchedule, clearSchedule } from "@/lib/schedule/schedule-store";
import { storeOwnerModeGMs, clearGMs } from "@/lib/gm";
import { storeScouting, clearScouting } from "@/lib/scouting/scouting-store";
import { Tier } from "@/lib/types";

type GenerationStep = {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete" | "error";
};

const INITIAL_STEPS: GenerationStep[] = [
  { id: "rosters", label: "Team Rosters", status: "pending" },
  { id: "freeagents", label: "Free Agents", status: "pending" },
  { id: "draft", label: "Draft Class", status: "pending" },
  { id: "gms", label: "General Managers", status: "pending" },
  { id: "coaching", label: "Coaching Staffs", status: "pending" },
  { id: "facilities", label: "Team Facilities", status: "pending" },
  { id: "scouting", label: "Scouting Departments", status: "pending" },
  { id: "schedule", label: "Season Schedule", status: "pending" },
];

export default function GenerateLeaguePage() {
  const router = useRouter();
  const [steps, setSteps] = useState<GenerationStep[]>(INITIAL_STEPS);
  const [error, setError] = useState<string | null>(null);
  const [teamTiers, setTeamTiers] = useState<Record<string, Tier>>({});

  const updateStep = useCallback(
    (stepId: string, status: GenerationStep["status"]) => {
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status } : s))
      );
    },
    []
  );

  const generateAll = useCallback(async () => {
    // Clear any existing data
    clearFullGameData();
    clearDevPlayers();
    clearFreeAgents();
    clearDraftClass();
    clearGMs();
    clearCoaching();
    clearFacilities();
    clearScouting();
    clearSchedule();

    try {
      // Step 1: Generate Rosters
      updateStep("rosters", "loading");
      const rostersRes = await fetch("/api/dev/generate-rosters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const rostersData = await rostersRes.json();
      if (!rostersData.success) throw new Error("Failed to generate rosters");

      const fullGameData: FullGameData = {
        teams: rostersData.teams,
        generatedAt: rostersData.generatedAt,
        totalPlayers: rostersData.stats.totalPlayers,
        tierDistribution: rostersData.stats.tierDistribution,
      };
      storeFullGameData(fullGameData);
      const rosterPlayers = rostersData.teams.flatMap(
        (t: TeamRosterData) => t.roster.players
      );
      storeDevPlayers(rosterPlayers);

      // Extract team tiers for dependent generators
      const tiers: Record<string, Tier> = {};
      for (const team of rostersData.teams) {
        tiers[team.team.id] = team.tier;
      }
      setTeamTiers(tiers);
      updateStep("rosters", "complete");

      // Step 2: Generate Free Agents
      updateStep("freeagents", "loading");
      const faRes = await fetch("/api/dev/generate-fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const faData = await faRes.json();
      if (!faData.success) throw new Error("Failed to generate free agents");
      storeFreeAgents(faData.players);
      updateStep("freeagents", "complete");

      // Step 3: Generate Draft Class
      updateStep("draft", "loading");
      const draftRes = await fetch("/api/dev/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const draftData = await draftRes.json();
      if (!draftData.success) throw new Error("Failed to generate draft class");
      storeDraftClass(draftData.players);
      // Update dev players with all players
      storeDevPlayers([...rosterPlayers, ...faData.players, ...draftData.players]);
      updateStep("draft", "complete");

      // Steps 4-7: Generate in parallel (they all depend on rosters/tiers)
      updateStep("gms", "loading");
      updateStep("coaching", "loading");
      updateStep("facilities", "loading");
      updateStep("scouting", "loading");

      const [gmsRes, coachingRes, facilitiesRes, scoutingRes] = await Promise.all([
        fetch("/api/dev/generate-gm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamTiers: tiers }), // No player params = Owner mode
        }),
        fetch("/api/dev/generate-coaching", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamTiers: tiers }),
        }),
        fetch("/api/dev/generate-facilities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamTiers: tiers }),
        }),
        fetch("/api/dev/generate-scouting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamTiers: tiers }),
        }),
      ]);

      const [gmsData, coachingData, facilitiesData, scoutingData] = await Promise.all([
        gmsRes.json(),
        coachingRes.json(),
        facilitiesRes.json(),
        scoutingRes.json(),
      ]);

      if (!gmsData.success) throw new Error("Failed to generate GMs");
      storeOwnerModeGMs(gmsData.gms);
      updateStep("gms", "complete");

      if (!coachingData.success) throw new Error("Failed to generate coaching");
      storeCoaching(coachingData.coaching);
      updateStep("coaching", "complete");

      if (!facilitiesData.success) throw new Error("Failed to generate facilities");
      storeFacilities(facilitiesData.facilities);
      updateStep("facilities", "complete");

      if (!scoutingData.success) throw new Error("Failed to generate scouting");
      storeScouting(scoutingData.scouting);
      updateStep("scouting", "complete");

      // Step 8: Generate Schedule
      updateStep("schedule", "loading");
      const scheduleRes = await fetch("/api/dev/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: new Date().getFullYear(),
          randomizeStandings: true,
        }),
      });
      const scheduleData = await scheduleRes.json();
      if (!scheduleData.success) throw new Error("Failed to generate schedule");
      storeSchedule(scheduleData.schedule);
      updateStep("schedule", "complete");

      // All done - redirect to team selection
      setTimeout(() => {
        router.push("/career/new/team");
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    }
  }, [router, updateStep]);

  useEffect(() => {
    generateAll();
  }, [generateAll]);

  const completedCount = steps.filter((s) => s.status === "complete").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-40px)] px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Creating Your League</h1>
          <p className="text-muted-foreground text-sm">
            Generating teams, players, and staff...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {completedCount} of {steps.length} complete
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                step.status === "complete" && "bg-secondary/50 border-primary/30",
                step.status === "loading" && "bg-secondary/30 border-primary/50",
                step.status === "error" && "bg-destructive/10 border-destructive/50",
                step.status === "pending" && "bg-background border-border"
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {step.status === "loading" && (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                )}
                {step.status === "complete" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
                {step.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                {step.status === "pending" && (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  step.status === "complete" && "text-foreground",
                  step.status === "loading" && "text-foreground font-medium",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-center">
            <p className="text-destructive text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setSteps(INITIAL_STEPS);
                generateAll();
              }}
              className="mt-2 text-xs underline text-muted-foreground hover:text-foreground"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
