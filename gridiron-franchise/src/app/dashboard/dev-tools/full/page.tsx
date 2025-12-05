"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  getFullGameData,
  TeamRosterData,
} from "@/lib/dev-player-store";
import { getTeamCoachingById } from "@/lib/coaching/coaching-store";
import { getTeamFacilitiesById } from "@/lib/facilities/facilities-store";
import { getSchedule } from "@/lib/schedule/schedule-store";
import { adaptTeamRoster } from "@/lib/sim/team-adapter";
import { SimTeam } from "@/lib/sim/types";
import { SeasonSimulator, SeasonTeam } from "@/lib/season";
import { SeasonState } from "@/lib/season/types";
import { generateSchedule } from "@/lib/schedule/schedule-generator";
import { WeekSchedule } from "@/lib/schedule/types";
import { GameSetupDashboard } from "@/components/franchise/game-setup-dashboard";
import { GameplayLoop } from "@/components/franchise/gameplay-loop";
import { GameSimulatorTab } from "@/components/sim/game-simulator-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Gamepad2 } from "lucide-react";

// Division assignments for teams
const DIVISION_MAP: Record<number, { division: string; conference: 'Atlantic' | 'Pacific' }> = {
  0: { division: 'Atlantic East', conference: 'Atlantic' },
  1: { division: 'Atlantic East', conference: 'Atlantic' },
  2: { division: 'Atlantic East', conference: 'Atlantic' },
  3: { division: 'Atlantic East', conference: 'Atlantic' },
  4: { division: 'Atlantic North', conference: 'Atlantic' },
  5: { division: 'Atlantic North', conference: 'Atlantic' },
  6: { division: 'Atlantic North', conference: 'Atlantic' },
  7: { division: 'Atlantic North', conference: 'Atlantic' },
  8: { division: 'Atlantic South', conference: 'Atlantic' },
  9: { division: 'Atlantic South', conference: 'Atlantic' },
  10: { division: 'Atlantic South', conference: 'Atlantic' },
  11: { division: 'Atlantic South', conference: 'Atlantic' },
  12: { division: 'Atlantic West', conference: 'Atlantic' },
  13: { division: 'Atlantic West', conference: 'Atlantic' },
  14: { division: 'Atlantic West', conference: 'Atlantic' },
  15: { division: 'Atlantic West', conference: 'Atlantic' },
  16: { division: 'Pacific East', conference: 'Pacific' },
  17: { division: 'Pacific East', conference: 'Pacific' },
  18: { division: 'Pacific East', conference: 'Pacific' },
  19: { division: 'Pacific East', conference: 'Pacific' },
  20: { division: 'Pacific North', conference: 'Pacific' },
  21: { division: 'Pacific North', conference: 'Pacific' },
  22: { division: 'Pacific North', conference: 'Pacific' },
  23: { division: 'Pacific North', conference: 'Pacific' },
  24: { division: 'Pacific South', conference: 'Pacific' },
  25: { division: 'Pacific South', conference: 'Pacific' },
  26: { division: 'Pacific South', conference: 'Pacific' },
  27: { division: 'Pacific South', conference: 'Pacific' },
  28: { division: 'Pacific West', conference: 'Pacific' },
  29: { division: 'Pacific West', conference: 'Pacific' },
  30: { division: 'Pacific West', conference: 'Pacific' },
  31: { division: 'Pacific West', conference: 'Pacific' },
};

// Helper to convert SimTeam to SeasonTeam
function toSeasonTeam(team: SimTeam, division: string, conference: 'Atlantic' | 'Pacific', byeWeek: number): SeasonTeam {
  return {
    ...team,
    division,
    conference,
    byeWeek,
    seasonStats: {
      gamesPlayed: 0,
      totalYards: 0,
      totalPassYards: 0,
      totalRushYards: 0,
      totalPointsScored: 0,
      totalPointsAllowed: 0,
      turnoversCommitted: 0,
      turnoversTaken: 0,
      sacks: 0,
      sacksAllowed: 0,
    },
  };
}

type ViewTab = "setup" | "gameplay" | "simulator" | "dashboard";

export default function FullGameGeneratorPage() {
  const simulatorRef = useRef<SeasonSimulator | null>(null);

  const [activeTab, setActiveTab] = useState<ViewTab>("setup");

  // Season state
  const [seasonState, setSeasonState] = useState<SeasonState | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ViewTab);
  };

  // Start a new season
  const handleStartSeason = useCallback(() => {
    const fullGameData = getFullGameData();
    if (!fullGameData || fullGameData.teams.length < 32) {
      alert(`Need 32 teams for a full season. Currently have ${fullGameData?.teams.length || 0} teams.`);
      return;
    }

    // Convert to SimTeams with coaching and facilities
    const simTeams = fullGameData.teams.map((teamData: TeamRosterData) => {
      const simTeam = adaptTeamRoster(teamData);
      const coaching = getTeamCoachingById(simTeam.id);
      if (coaching) simTeam.coachingStaff = coaching;
      const facilities = getTeamFacilitiesById(simTeam.id);
      if (facilities) simTeam.facilities = facilities;
      return simTeam;
    });

    // Convert SimTeams to SeasonTeams with division assignments
    const seasonTeams: SeasonTeam[] = simTeams.slice(0, 32).map((team, index) => {
      const divInfo = DIVISION_MAP[index] || { division: 'Atlantic East', conference: 'Atlantic' as const };
      const byeWeek = 5 + (index % 14);
      return toSeasonTeam(team, divInfo.division, divInfo.conference, byeWeek);
    });

    // Get schedule
    let scheduleWeeks: WeekSchedule[];
    const storedSchedule = getSchedule();

    if (storedSchedule && storedSchedule.weeks && storedSchedule.weeks.length === 18) {
      scheduleWeeks = storedSchedule.weeks;
    } else {
      const schedule = generateSchedule({
        season: 2025,
        randomizeStandings: true,
      });
      scheduleWeeks = schedule.weeks;
    }

    // Create simulator
    simulatorRef.current = new SeasonSimulator({
      year: 2025,
      teams: seasonTeams,
      schedule: scheduleWeeks,
      simulateInjuries: true,
      injuryRate: 0.03,
      enableProgression: false,
      verboseLogging: false,
    });

    // Update state and switch to gameplay tab (gameplay loop before sim each week)
    setSeasonState(simulatorRef.current.getState());
    setActiveTab("gameplay");
  }, []);

  // Simulate one week
  const handleSimulateWeek = useCallback(() => {
    if (!simulatorRef.current) return;
    setIsSimulating(true);

    try {
      simulatorRef.current.simulateWeek();
      setSeasonState(simulatorRef.current.getState());
    } catch (error) {
      console.error('Simulation error:', error);
    }

    setIsSimulating(false);
  }, []);

  // Simulate to playoffs
  const handleSimulateSeason = useCallback(async () => {
    if (!simulatorRef.current) return;
    setIsSimulating(true);

    const simulateNextWeek = () => {
      const state = simulatorRef.current!.getState();
      if (state.phase === 'regular') {
        simulatorRef.current!.simulateWeek();
        setSeasonState(simulatorRef.current!.getState());
        setTimeout(simulateNextWeek, 50);
      } else {
        setIsSimulating(false);
      }
    };

    simulateNextWeek();
  }, []);

  // Simulate playoffs
  const handleSimulatePlayoffs = useCallback(async () => {
    if (!simulatorRef.current) return;
    setIsSimulating(true);

    const simulateNextRound = () => {
      const state = simulatorRef.current!.getState();
      if (state.phase === 'playoffs') {
        simulatorRef.current!.simulateWeek();
        setSeasonState(simulatorRef.current!.getState());
        setTimeout(simulateNextRound, 100);
      } else {
        setIsSimulating(false);
      }
    };

    simulateNextRound();
  }, []);

  // Reset season
  const handleReset = useCallback(() => {
    simulatorRef.current = null;
    setSeasonState(null);
    setActiveTab("setup");
  }, []);

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Franchise Mode</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate league data and simulate a full season
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="simulator">
              <Gamepad2 className="mr-1 h-4 w-4" />
              Simulator
            </TabsTrigger>
            <TabsTrigger value="gameplay" disabled={!seasonState}>
              Gameplay
            </TabsTrigger>
            <TabsTrigger value="dashboard" disabled={!seasonState}>
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab - Game Setup Dashboard */}
          <TabsContent value="setup" className="mt-6">
            <GameSetupDashboard onStartSeason={handleStartSeason} />
          </TabsContent>

          {/* Simulator Tab - Single game simulator */}
          <TabsContent value="simulator" className="mt-6">
            <GameSimulatorTab />
          </TabsContent>

          {/* Gameplay Tab - Weekly gameplay loop with season info */}
          <TabsContent value="gameplay" className="mt-6">
            <GameplayLoop
              seasonState={seasonState}
              isSimulating={isSimulating}
              onSimulateWeek={handleSimulateWeek}
              onSimulateSeason={handleSimulateSeason}
              onSimulatePlayoffs={handleSimulatePlayoffs}
              onReset={handleReset}
            />
          </TabsContent>

          {/* Dashboard Tab - Coming Soon */}
          <TabsContent value="dashboard" className="mt-6">
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <LayoutDashboard className="h-16 w-16 mx-auto text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-zinc-400 mb-2">Dashboard</h3>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                  Team overview, financial summaries, and franchise analytics coming soon.
                </p>
                <div className="mt-6 text-xs text-zinc-600 uppercase tracking-wide">
                  Coming Soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
