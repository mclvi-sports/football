"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tier } from "@/lib/types";
import {
  storeTeamRoster,
  getFullGameData,
  TeamRosterData,
  FullGameData,
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
import { cn } from "@/lib/utils";
import { GameSetupDashboard } from "@/components/franchise/game-setup-dashboard";
import { SeasonHub } from "@/components/franchise/season-hub";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TIER_COLORS: Record<Tier, string> = {
  [Tier.Elite]: "text-yellow-400",
  [Tier.Good]: "text-green-400",
  [Tier.Average]: "text-blue-400",
  [Tier.BelowAverage]: "text-orange-400",
  [Tier.Rebuilding]: "text-red-400",
};

const TIER_BG: Record<Tier, string> = {
  [Tier.Elite]: "bg-yellow-500/20 border-yellow-500/40",
  [Tier.Good]: "bg-green-500/20 border-green-500/40",
  [Tier.Average]: "bg-blue-500/20 border-blue-500/40",
  [Tier.BelowAverage]: "bg-orange-500/20 border-orange-500/40",
  [Tier.Rebuilding]: "bg-red-500/20 border-red-500/40",
};

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

type ViewTab = "setup" | "teams" | "overview" | "season";

export default function FullGameGeneratorPage() {
  const router = useRouter();
  const simulatorRef = useRef<SeasonSimulator | null>(null);

  const [gameData, setGameData] = useState<FullGameData | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>("setup");
  const [selectedConference, setSelectedConference] = useState<string>("all");

  // Season state
  const [seasonState, setSeasonState] = useState<SeasonState | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Load existing data on mount
  useEffect(() => {
    const data = getFullGameData();
    setGameData(data);
  }, []);

  // Refresh data when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ViewTab);
    const data = getFullGameData();
    setGameData(data);
  };

  const getFilteredTeams = () => {
    if (!gameData) return [];
    if (selectedConference === "all") return gameData.teams;
    return gameData.teams.filter((t) => t.team.conference === selectedConference);
  };

  const filteredTeams = getFilteredTeams();

  // Group teams by division
  const teamsByDivision = filteredTeams.reduce((acc, team) => {
    if (!acc[team.team.division]) {
      acc[team.team.division] = [];
    }
    acc[team.team.division].push(team);
    return acc;
  }, {} as Record<string, TeamRosterData[]>);

  // Sort teams within division by OVR
  Object.keys(teamsByDivision).forEach((div) => {
    teamsByDivision[div].sort((a, b) => b.stats.avgOvr - a.stats.avgOvr);
  });

  // Handle team click - store team and navigate to roster view
  const handleTeamClick = (teamData: TeamRosterData) => {
    storeTeamRoster(teamData);
    router.push("/dashboard/dev-tools/team-roster");
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

    // Update state and switch to season tab
    setSeasonState(simulatorRef.current.getState());
    setActiveTab("season");
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
            <TabsTrigger value="teams" disabled={!gameData}>
              Teams
            </TabsTrigger>
            <TabsTrigger value="overview" disabled={!gameData}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="season" disabled={!seasonState}>
              Season
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab - Game Setup Dashboard */}
          <TabsContent value="setup" className="mt-6">
            <GameSetupDashboard onStartSeason={handleStartSeason} />
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-6 space-y-4">
            {gameData && (
              <>
                {/* Conference Filter */}
                <div className="flex gap-2">
                  {["all", "Atlantic", "Pacific"].map((conf) => (
                    <button
                      key={conf}
                      onClick={() => setSelectedConference(conf)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        selectedConference === conf
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {conf === "all" ? "All Teams" : conf}
                    </button>
                  ))}
                </div>

                {/* Teams by Division */}
                {Object.entries(teamsByDivision)
                  .sort()
                  .map(([division, teams]) => (
                    <div key={division} className="space-y-2">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {division}
                      </h3>
                      <div className="space-y-2">
                        {teams.map((teamData) => (
                          <div
                            key={teamData.team.id}
                            onClick={() => handleTeamClick(teamData)}
                            className="bg-secondary/50 border border-border rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-secondary/80 hover:border-primary/50 transition-all active:scale-[0.99]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm">
                                {teamData.team.id}
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {teamData.team.city} {teamData.team.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {teamData.stats.totalPlayers} players · Avg Age{" "}
                                  {teamData.stats.avgAge}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div
                                  className={cn(
                                    "text-xl font-bold",
                                    teamData.stats.avgOvr >= 80
                                      ? "text-green-400"
                                      : teamData.stats.avgOvr >= 75
                                      ? "text-blue-400"
                                      : teamData.stats.avgOvr >= 70
                                      ? "text-yellow-400"
                                      : "text-orange-400"
                                  )}
                                >
                                  {teamData.stats.avgOvr}
                                </div>
                                <div
                                  className={cn(
                                    "text-[10px] uppercase font-bold",
                                    TIER_COLORS[teamData.tier]
                                  )}
                                >
                                  {teamData.tier}
                                </div>
                              </div>
                              <div className="text-muted-foreground">→</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-4">
            {gameData && (
              <>
                {/* Tier Distribution */}
                <div className="bg-secondary/50 border border-border rounded-xl p-4">
                  <h3 className="text-sm font-bold mb-3">Team Tier Distribution</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(gameData.tierDistribution).map(([tier, count]) => (
                      <div
                        key={tier}
                        className={cn(
                          "rounded-lg p-2 text-center border",
                          TIER_BG[tier as Tier]
                        )}
                      >
                        <div className={cn("text-xl font-bold", TIER_COLORS[tier as Tier])}>
                          {count}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{tier}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Stats */}
                <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
                  <div className="text-4xl font-black">{gameData.totalPlayers}</div>
                  <div className="text-sm text-muted-foreground">Total Players Generated</div>
                </div>

                {/* Generation Time */}
                <div className="text-center text-xs text-muted-foreground">
                  Generated at: {new Date(gameData.generatedAt).toLocaleString()}
                </div>
              </>
            )}
          </TabsContent>

          {/* Season Tab */}
          <TabsContent value="season" className="mt-6">
            <SeasonHub
              seasonState={seasonState}
              isSimulating={isSimulating}
              onSimulateWeek={handleSimulateWeek}
              onSimulateSeason={handleSimulateSeason}
              onSimulatePlayoffs={handleSimulatePlayoffs}
              onReset={handleReset}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
