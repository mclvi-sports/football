/**
 * Mock Draft Simulator
 *
 * UI for running mock draft simulations and viewing projections.
 * Shows prospect projections with pick range visualization.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import {
  Play,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Target,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useDraftStore } from "@/stores/draft-store";
import { useCareerStore } from "@/stores/career-store";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import { LEAGUE_TEAMS } from "@/lib/data/teams";
import {
  runMockDraftSimulations,
  calculateProjections,
  type ProspectProjection,
} from "@/lib/scouting-hub/mock-draft-engine";
import type { MockDraftSettings } from "@/lib/scouting-hub/types";
import { Position } from "@/lib/types";

// ============================================================================
// COMPONENT
// ============================================================================

export function MockDraftSimulator() {
  const { draftClass, allPicks, userTeamId: draftUserTeamId } = useDraftStore();
  const { playerTeamId } = useCareerStore();
  const {
    mockProjections,
    mockSettings,
    isSimulating,
    simulationProgress,
    setMockProjections,
    setMockSettings,
    setIsSimulating,
    setSimulationProgress,
    setMockDraftResults,
    clearMockResults,
  } = useScoutingHubStore();

  const [showSettings, setShowSettings] = useState(false);
  const [positionFilter, setPositionFilter] = useState<Position | "all">("all");
  const [isPending, startTransition] = useTransition();

  // Get user team ID from either draft store or career store
  const userTeamId = draftUserTeamId || playerTeamId || "BOS";

  // Get user's pick numbers
  const userPicks = useMemo(() => {
    if (allPicks.length === 0) {
      // Generate default picks if draft hasn't been initialized
      const picks: number[] = [];
      for (let round = 1; round <= 7; round++) {
        // Assume user picks somewhere in middle of each round
        picks.push((round - 1) * 32 + 16);
      }
      return picks;
    }
    return allPicks
      .filter((p) => p.teamId === userTeamId)
      .map((p) => p.overall);
  }, [allPicks, userTeamId]);

  // Run simulation
  const runSimulation = useCallback(() => {
    if (draftClass.length === 0) return;

    setIsSimulating(true);
    setSimulationProgress(0);

    // Use requestAnimationFrame for smoother progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 100 / mockSettings.simulationCount;
      setSimulationProgress(Math.min(progress, 95));
    }, 50);

    // Run simulations in next tick to allow UI to update
    startTransition(() => {
      const teams = LEAGUE_TEAMS.map((t) => ({
        id: t.id,
        name: t.name,
        abbreviation: t.id,
      }));

      const results = runMockDraftSimulations({
        draftClass,
        teams,
        userTeamId,
        settings: mockSettings,
        seed: Date.now(),
      });

      const projections = calculateProjections(results, draftClass, userPicks);

      clearInterval(progressInterval);
      setMockDraftResults(results);
      setMockProjections(projections);
      setSimulationProgress(100);

      // Reset simulating state after a brief delay
      setTimeout(() => {
        setIsSimulating(false);
        setSimulationProgress(0);
      }, 500);
    });
  }, [
    draftClass,
    mockSettings,
    userTeamId,
    userPicks,
    setIsSimulating,
    setSimulationProgress,
    setMockDraftResults,
    setMockProjections,
  ]);

  // Filter projections
  const filteredProjections = useMemo(() => {
    if (positionFilter === "all") return mockProjections;
    return mockProjections.filter((p) => p.position === positionFilter);
  }, [mockProjections, positionFilter]);

  // Get projections likely available at user picks
  const availableAtUserPicks = useMemo(() => {
    return mockProjections.filter((p) => p.likelyAvailableAtPicks.length > 0);
  }, [mockProjections]);

  const hasResults = mockProjections.length > 0;

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Mock Draft Simulator</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-1" />
            Settings
            {showSettings ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            settings={mockSettings}
            onUpdate={setMockSettings}
          />
        )}

        {/* Run Button */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={runSimulation}
            disabled={isSimulating || draftClass.length === 0}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : hasResults ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Again ({mockSettings.simulationCount} sims)
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run {mockSettings.simulationCount} Simulations
              </>
            )}
          </Button>
          {hasResults && (
            <Button variant="outline" onClick={clearMockResults}>
              Clear
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {isSimulating && (
          <div className="space-y-1">
            <Progress value={simulationProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Running simulations... {Math.round(simulationProgress)}%
            </p>
          </div>
        )}
      </div>

      {/* No Draft Class Warning */}
      {draftClass.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No draft class available</p>
          <p className="text-xs mt-1">Generate a draft class first</p>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="space-y-4">
          {/* Available at Your Picks Section */}
          {availableAtUserPicks.length > 0 && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2 bg-primary/10 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="font-medium text-sm">Likely Available at Your Picks</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {availableAtUserPicks.length} prospects with 50%+ availability
                </p>
              </div>
              <div className="divide-y divide-border/30 max-h-64 overflow-y-auto">
                {availableAtUserPicks.slice(0, 10).map((projection) => (
                  <AvailabilityRow
                    key={projection.prospectId}
                    projection={projection}
                    userPicks={userPicks}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Projections */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-2 bg-secondary/50 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">All Projections</h3>
                <p className="text-xs text-muted-foreground">
                  {filteredProjections.length} prospects
                </p>
              </div>
              <Select
                value={positionFilter}
                onValueChange={(v) => setPositionFilter(v as Position | "all")}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(Position).map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="divide-y divide-border/30 max-h-96 overflow-y-auto">
              {filteredProjections.slice(0, 50).map((projection, index) => (
                <ProjectionRow
                  key={projection.prospectId}
                  projection={projection}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SETTINGS PANEL
// ============================================================================

interface SettingsPanelProps {
  settings: MockDraftSettings;
  onUpdate: (settings: Partial<MockDraftSettings>) => void;
}

function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  return (
    <div className="p-3 rounded-lg border border-border bg-secondary/20 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Simulation Count */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Simulations
          </label>
          <Select
            value={String(settings.simulationCount)}
            onValueChange={(v) =>
              onUpdate({ simulationCount: Number(v) as 10 | 25 | 50 })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 (Quick)</SelectItem>
              <SelectItem value="25">25 (Standard)</SelectItem>
              <SelectItem value="50">50 (Accurate)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rounds */}
        <div>
          <label className="text-xs text-muted-foreground block mb-1">
            Rounds
          </label>
          <Select
            value={String(settings.roundsToSimulate)}
            onValueChange={(v) =>
              onUpdate({ roundsToSimulate: Number(v) as 1 | 3 | 7 })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Round 1 Only</SelectItem>
              <SelectItem value="3">Rounds 1-3</SelectItem>
              <SelectItem value="7">Full Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground">
        More simulations = more accurate projections but slower
      </p>
    </div>
  );
}

// ============================================================================
// PROJECTION ROW
// ============================================================================

interface ProjectionRowProps {
  projection: ProspectProjection;
  rank: number;
}

function ProjectionRow({ projection, rank }: ProjectionRowProps) {
  const { consensus, minPick, maxPick, avgPick } = projection;
  const spread = maxPick - minPick;

  return (
    <div className="px-4 py-3 hover:bg-secondary/30 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground w-5 shrink-0">
            #{rank}
          </span>
          <Badge variant="outline" className="shrink-0">
            {projection.position}
          </Badge>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {projection.prospectName}
            </p>
            <p className="text-xs text-muted-foreground">
              {projection.scoutedOvr} OVR
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="font-bold text-lg">Rd {projection.roundProjection}</p>
          <p className="text-xs text-muted-foreground">Pick ~{avgPick}</p>
        </div>
      </div>

      {/* Range Visualization */}
      <div className="space-y-1">
        <PickRangeBar
          min={minPick}
          max={maxPick}
          floor={consensus.floor}
          ceiling={consensus.ceiling}
          mostLikely={consensus.mostLikely}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Ceiling: {consensus.ceiling}</span>
          <span className="font-medium">Most Likely: {consensus.mostLikely}</span>
          <span>Floor: {consensus.floor}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AVAILABILITY ROW
// ============================================================================

interface AvailabilityRowProps {
  projection: ProspectProjection;
  userPicks: number[];
}

function AvailabilityRow({ projection, userPicks }: AvailabilityRowProps) {
  // Get probability at first available user pick
  const bestUserPick = projection.likelyAvailableAtPicks[0];
  const probability = projection.availabilityProbability[bestUserPick] || 0;

  return (
    <div className="px-4 py-2 hover:bg-secondary/30 transition-colors flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <Badge variant="outline" className="shrink-0">
          {projection.position}
        </Badge>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">
            {projection.prospectName}
          </p>
          <p className="text-xs text-muted-foreground">
            Projected Rd {projection.roundProjection} (Pick ~{projection.avgPick})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">At Pick #{bestUserPick}</p>
          <p
            className={cn(
              "font-bold",
              probability >= 70
                ? "text-green-400"
                : probability >= 50
                ? "text-yellow-400"
                : "text-orange-400"
            )}
          >
            {probability}%
          </p>
        </div>
        {probability >= 70 && <Check className="w-4 h-4 text-green-400" />}
      </div>
    </div>
  );
}

// ============================================================================
// PICK RANGE BAR
// ============================================================================

interface PickRangeBarProps {
  min: number;
  max: number;
  floor: number;
  ceiling: number;
  mostLikely: number;
}

function PickRangeBar({
  min,
  max,
  floor,
  ceiling,
  mostLikely,
}: PickRangeBarProps) {
  // Normalize to 224 picks (7 rounds)
  const totalPicks = 224;
  const rangeStart = ((min - 1) / totalPicks) * 100;
  const rangeEnd = ((max - 1) / totalPicks) * 100;
  const floorPos = ((floor - 1) / totalPicks) * 100;
  const ceilingPos = ((ceiling - 1) / totalPicks) * 100;
  const likelyPos = ((mostLikely - 1) / totalPicks) * 100;

  return (
    <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
      {/* Full range (light) */}
      <div
        className="absolute h-full bg-muted-foreground/20"
        style={{
          left: `${rangeStart}%`,
          width: `${rangeEnd - rangeStart}%`,
        }}
      />
      {/* Consensus range (medium) */}
      <div
        className="absolute h-full bg-primary/30"
        style={{
          left: `${ceilingPos}%`,
          width: `${floorPos - ceilingPos}%`,
        }}
      />
      {/* Most likely position (marker) */}
      <div
        className="absolute h-full w-1 bg-primary"
        style={{
          left: `${likelyPos}%`,
        }}
      />
      {/* Round markers */}
      {[1, 2, 3, 4, 5, 6].map((round) => (
        <div
          key={round}
          className="absolute h-full w-px bg-border/50"
          style={{ left: `${(round * 32 / totalPicks) * 100}%` }}
        />
      ))}
    </div>
  );
}
