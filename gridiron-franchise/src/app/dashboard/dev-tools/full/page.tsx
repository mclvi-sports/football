"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Player, Tier } from "@/lib/types";
import {
  storeDevPlayers,
  storeTeamRoster,
  getFullGameData,
  TeamRosterData,
  FullGameData,
} from "@/lib/dev-player-store";
import { cn } from "@/lib/utils";
import { GameSetupDashboard } from "@/components/franchise/game-setup-dashboard";
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

type ViewTab = "setup" | "teams" | "overview";

export default function FullGameGeneratorPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<FullGameData | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>("setup");
  const [selectedConference, setSelectedConference] = useState<string>("all");

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

  const handleStartSeason = () => {
    router.push("/dashboard/dev-tools/season");
  };

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="teams" disabled={!gameData}>
              Teams
            </TabsTrigger>
            <TabsTrigger value="overview" disabled={!gameData}>
              Overview
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
        </Tabs>
      </main>
    </div>
  );
}
