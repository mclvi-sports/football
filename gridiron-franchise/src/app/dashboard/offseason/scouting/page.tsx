/**
 * Scouting Hub Page
 *
 * Comprehensive scouting experience with 5 tabs:
 * - Prospects: Search, filter, tag, and evaluate draft prospects
 * - Staff Insights: Scout recommendations and perk activations
 * - Big Board: Tiered board, position rankings, and comparisons
 * - Mock Draft: Run simulations to project where prospects land
 * - Sleepers: Hidden gems, risers/fallers, and steal alerts
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, UserCheck, LayoutList, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCareerStore } from "@/stores/career-store";
import { useDraftStore } from "@/stores/draft-store";
import { useOffseasonStore } from "@/stores/offseason-store";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import {
  ProspectsTab,
  StaffInsightsTab,
  BigBoardTab,
  MockDraftTab,
  SleepersTab,
} from "@/components/scouting-hub";

export default function ScoutingHubPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();
  const {
    draftClass,
    userBoard,
    _hasHydrated: draftHydrated,
    initializeDraft,
  } = useDraftStore();
  const {
    activeTab,
    setActiveTab,
    _hasHydrated: hubHydrated,
  } = useScoutingHubStore();

  const [isLoading, setIsLoading] = useState(true);

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

  // Handle complete scouting
  const handleCompleteScouting = () => {
    completePhase("scouting");
    router.push("/dashboard/offseason");
  };

  // Wait for hydration
  if (!_hasHydrated || !draftHydrated || !hubHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Scouting Hub...</p>
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
            <h1 className="text-lg font-bold">Scouting Hub</h1>
            <p className="text-xs text-muted-foreground">
              {draftClass.length} prospects • {taggedCount} tagged
            </p>
          </div>
          <Button onClick={handleCompleteScouting}>Done</Button>
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="w-full justify-start gap-0 h-auto p-0 bg-transparent rounded-none border-b border-border overflow-x-auto">
            <TabsTrigger
              value="prospects"
              className="flex-1 min-w-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-2 gap-1 text-xs"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Prospects</span>
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="flex-1 min-w-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-2 gap-1 text-xs"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="flex-1 min-w-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-2 gap-1 text-xs"
            >
              <LayoutList className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Board</span>
            </TabsTrigger>
            <TabsTrigger
              value="mock"
              className="flex-1 min-w-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-2 gap-1 text-xs"
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Mock</span>
            </TabsTrigger>
            <TabsTrigger
              value="sleepers"
              className="flex-1 min-w-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-2 px-2 gap-1 text-xs"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Sleepers</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Tab Content */}
      <main className="px-5 pt-4">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="prospects" className="mt-0">
            <ProspectsTab />
          </TabsContent>
          <TabsContent value="staff" className="mt-0">
            <StaffInsightsTab />
          </TabsContent>
          <TabsContent value="board" className="mt-0">
            <BigBoardTab />
          </TabsContent>
          <TabsContent value="mock" className="mt-0">
            <MockDraftTab />
          </TabsContent>
          <TabsContent value="sleepers" className="mt-0">
            <SleepersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
