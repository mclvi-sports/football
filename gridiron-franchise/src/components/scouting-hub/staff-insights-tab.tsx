/**
 * Staff Insights Tab
 *
 * Shows scout recommendations, director big board, and perk activations.
 * Integrates with scouting store for scout data and generates recommendations.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/stores/draft-store";
import { useScoutingStore } from "@/stores/scouting-store";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import { generateScoutRecommendations } from "@/lib/scouting-hub/scout-recommendation-engine";
import { ScoutRecommendationsPanel } from "./scout-recommendations-panel";
import { MiniBigBoard } from "./director-big-board";
import { PerkActivationFeed } from "./perk-activation-feed";

export function StaffInsightsTab() {
  const { draftClass } = useDraftStore();
  const { department, getAllScouts } = useScoutingStore();
  const {
    scoutRecommendations,
    directorBigBoard,
    perkActivations,
    hiddenGems,
    setScoutRecommendations,
    setDirectorBigBoard,
    addPerkActivation,
    setHiddenGems,
  } = useScoutingHubStore();

  const [isGenerating, setIsGenerating] = useState(false);

  const scouts = useMemo(() => getAllScouts(), [getAllScouts]);

  // Generate recommendations on first load if none exist
  useEffect(() => {
    if (
      scouts.length > 0 &&
      draftClass.length > 0 &&
      scoutRecommendations.length === 0
    ) {
      generateRecommendations();
    }
  }, [scouts.length, draftClass.length, scoutRecommendations.length]);

  const generateRecommendations = () => {
    if (scouts.length === 0 || draftClass.length === 0) return;

    setIsGenerating(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = generateScoutRecommendations(scouts, draftClass);

      setScoutRecommendations(result.recommendations);
      setDirectorBigBoard(result.directorBigBoard);
      setHiddenGems(result.hiddenGems);

      // Add perk activations
      for (const activation of result.perkActivations) {
        addPerkActivation(activation);
      }

      setIsGenerating(false);
    }, 100);
  };

  // No department yet
  if (!department) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-secondary/50 mb-4">
          <UserCheck className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">Scouting Department Not Set Up</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Visit the staff page to set up your scouting department before viewing
          staff insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Staff Insights</h2>
          <p className="text-xs text-muted-foreground">
            {scouts.length} scouts • {scoutRecommendations.length} recommendations
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={generateRecommendations}
          disabled={isGenerating || scouts.length === 0}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
          />
          {isGenerating ? "Generating..." : "Refresh"}
        </Button>
      </div>

      {/* Mini Big Board & Perk Feed - Side by side on larger screens */}
      <div className="grid gap-4 md:grid-cols-2">
        <MiniBigBoard
          directorRankings={directorBigBoard}
          prospects={draftClass}
        />
        <PerkActivationFeed activations={perkActivations} compact maxDisplay={5} />
      </div>

      {/* Scout Recommendations */}
      <div>
        <h3 className="font-medium mb-3">Scout Picks</h3>
        <ScoutRecommendationsPanel recommendations={scoutRecommendations} />
      </div>
    </div>
  );
}
