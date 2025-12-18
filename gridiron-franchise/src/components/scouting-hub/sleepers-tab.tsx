/**
 * Sleepers Tab
 *
 * Hidden gems, combine risers/fallers, and steal alerts.
 * Shows prospects with high potential gaps and combine standouts.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useMemo, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Diamond,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDraftStore } from "@/stores/draft-store";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import { useScoutingStore } from "@/stores/scouting-store";
import { detectHiddenGems } from "@/lib/scouting-hub/sleeper-detector";
import { analyzeDraftClassCombine, getTopRisers, getTopFallers } from "@/lib/scouting-hub/combine-analysis";
import type { HiddenGem, CombineMovement } from "@/lib/scouting-hub/types";

// ============================================================================
// COMPONENT
// ============================================================================

export function SleepersTab() {
  const { draftClass } = useDraftStore();
  const { hiddenGems, combineMovement, setHiddenGems, setCombineMovement } =
    useScoutingHubStore();
  const getAllScouts = useScoutingStore((state) => state.getAllScouts);

  // Get scouts for hidden gem detection
  const scouts = getAllScouts();

  // Generate analysis on mount if not cached
  useEffect(() => {
    if (draftClass.length === 0) return;

    // Only regenerate if empty
    if (hiddenGems.length === 0) {
      const gems = detectHiddenGems(draftClass, {
        minPotentialGap: 8,
        scouts: scouts,
      });
      setHiddenGems(gems);
    }

    if (combineMovement.length === 0) {
      const { risers, fallers } = analyzeDraftClassCombine(draftClass);
      setCombineMovement([...risers, ...fallers]);
    }
  }, [
    draftClass,
    hiddenGems.length,
    combineMovement.length,
    scouts,
    setHiddenGems,
    setCombineMovement,
  ]);

  // Split combine movement
  const risers = useMemo(
    () => combineMovement.filter((m) => m.direction === "riser"),
    [combineMovement]
  );
  const fallers = useMemo(
    () => combineMovement.filter((m) => m.direction === "faller"),
    [combineMovement]
  );

  if (draftClass.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-secondary/50 mb-4">
          <Sparkles className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">No Draft Class</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Generate a draft class to find hidden gems and combine standouts.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="gems" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="gems" className="gap-1 text-xs">
          <Diamond className="w-4 h-4" />
          <span className="hidden sm:inline">Hidden Gems</span>
          <span className="sm:hidden">Gems</span>
          {hiddenGems.length > 0 && (
            <span className="ml-1 text-[10px] text-muted-foreground">
              ({hiddenGems.length})
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="risers" className="gap-1 text-xs">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Risers</span>
          {risers.length > 0 && (
            <span className="ml-1 text-[10px] text-muted-foreground">
              ({risers.length})
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="fallers" className="gap-1 text-xs">
          <TrendingDown className="w-4 h-4" />
          <span className="hidden sm:inline">Fallers</span>
          {fallers.length > 0 && (
            <span className="ml-1 text-[10px] text-muted-foreground">
              ({fallers.length})
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="gems" className="mt-4">
        <HiddenGemsPanel gems={hiddenGems} />
      </TabsContent>

      <TabsContent value="risers" className="mt-4">
        <CombineMoversPanel movers={risers} direction="riser" />
      </TabsContent>

      <TabsContent value="fallers" className="mt-4">
        <CombineMoversPanel movers={fallers} direction="faller" />
      </TabsContent>
    </Tabs>
  );
}

// ============================================================================
// HIDDEN GEMS PANEL
// ============================================================================

interface HiddenGemsPanelProps {
  gems: HiddenGem[];
}

function HiddenGemsPanel({ gems }: HiddenGemsPanelProps) {
  if (gems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Diamond className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hidden gems found</p>
        <p className="text-xs mt-1">
          Hidden gems have potential 10+ points above scouted OVR
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">Hidden Gems</h3>
        <span className="text-xs text-muted-foreground">
          High potential sleepers
        </span>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border/30">
          {gems.slice(0, 15).map((gem, index) => (
            <HiddenGemRow key={gem.prospectId} gem={gem} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface HiddenGemRowProps {
  gem: HiddenGem;
  rank: number;
}

function HiddenGemRow({ gem, rank }: HiddenGemRowProps) {
  return (
    <div className="px-4 py-3 hover:bg-secondary/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={cn(
              "w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0",
              rank <= 3
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-secondary/50 text-muted-foreground"
            )}
          >
            {rank}
          </span>
          <Badge variant="outline" className="shrink-0">
            {gem.position}
          </Badge>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{gem.prospectName}</p>
            <p className="text-xs text-muted-foreground">
              {gem.scoutedOvr} OVR / {gem.potential} POT
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <Diamond className="w-3 h-3 text-yellow-400" />
            <span className="font-bold text-yellow-400">+{gem.potentialGap}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {gem.confidence}% confidence
          </p>
        </div>
      </div>

      {gem.discoveryPerk && (
        <div className="mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-primary">
            Discovered by {gem.discoveredBy}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMBINE MOVERS PANEL
// ============================================================================

interface CombineMoversPanelProps {
  movers: CombineMovement[];
  direction: "riser" | "faller";
}

function CombineMoversPanel({ movers, direction }: CombineMoversPanelProps) {
  const isRiser = direction === "riser";
  const Icon = isRiser ? TrendingUp : TrendingDown;
  const colorClass = isRiser ? "text-green-400" : "text-red-400";
  const bgClass = isRiser ? "bg-green-500/20" : "bg-red-500/20";

  if (movers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          No combine {isRiser ? "risers" : "fallers"} found
        </p>
        <p className="text-xs mt-1">
          {isRiser
            ? "Prospects who improved their stock at the combine"
            : "Prospects who hurt their stock at the combine"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">
          Combine {isRiser ? "Risers" : "Fallers"}
        </h3>
        <span className="text-xs text-muted-foreground">
          {movers.length} prospects
        </span>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border/30">
          {movers.slice(0, 15).map((mover) => (
            <div
              key={mover.prospectId}
              className="px-4 py-3 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center shrink-0",
                      bgClass
                    )}
                  >
                    <Icon className={cn("w-3 h-3", colorClass)} />
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {mover.position}
                  </Badge>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {mover.prospectName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rd {mover.previousProjection} → Rd {mover.newProjection}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={cn("font-bold text-sm", colorClass)}>
                    {isRiser ? "↑" : "↓"} {Math.round(mover.delta * 32)} picks
                  </span>
                </div>
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground pl-8">
                {mover.reason}
              </p>

              {(mover.standoutMeasurable || mover.concernMeasurable) && (
                <div className="mt-1 pl-8">
                  <Badge
                    variant="secondary"
                    className={cn("text-[10px]", isRiser ? "bg-green-500/10" : "bg-red-500/10")}
                  >
                    {mover.standoutMeasurable || mover.concernMeasurable}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
