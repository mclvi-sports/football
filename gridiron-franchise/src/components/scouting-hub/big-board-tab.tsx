/**
 * Big Board Tab
 *
 * Tiered drag-drop board, position rankings, and prospect comparison.
 * Integrates TieredBigBoard, PositionRankings, and ProspectComparison.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useState } from "react";
import { LayoutList, ListOrdered, GitCompare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import { TieredBigBoard } from "./tiered-big-board";
import { PositionRankings } from "./position-rankings";
import { ProspectComparison, ComparisonSheet } from "./prospect-comparison";

// ============================================================================
// COMPONENT
// ============================================================================

export function BigBoardTab() {
  const { comparisonProspects } = useScoutingHubStore();
  const [activeView, setActiveView] = useState<"board" | "rankings" | "compare">("board");
  const [compareSheetOpen, setCompareSheetOpen] = useState(false);

  const handleCompare = () => {
    if (comparisonProspects.length >= 2) {
      setCompareSheetOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board" className="gap-1 text-xs">
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">My Board</span>
          </TabsTrigger>
          <TabsTrigger value="rankings" className="gap-1 text-xs">
            <ListOrdered className="w-4 h-4" />
            <span className="hidden sm:inline">Rankings</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-1 text-xs relative">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            {comparisonProspects.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {comparisonProspects.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          <TieredBigBoard />
        </TabsContent>

        <TabsContent value="rankings" className="mt-4">
          <PositionRankings onCompare={handleCompare} />
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          <ProspectComparison />
        </TabsContent>
      </Tabs>

      {/* Comparison Sheet (for mobile quick access) */}
      <ComparisonSheet open={compareSheetOpen} onOpenChange={setCompareSheetOpen} />
    </div>
  );
}
