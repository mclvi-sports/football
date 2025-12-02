"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Player, Tier } from "@/lib/types";
import { storeDevPlayers, storeTeamRoster, storeFullGameData, TeamRosterData, FullGameData as StoredFullGameData } from "@/lib/dev-player-store";
import { cn } from "@/lib/utils";

interface TeamInfo {
  id: string;
  city: string;
  name: string;
  conference: string;
  division: string;
}

interface FullGameData {
  teams: TeamRosterData[];
  freeAgents: Player[];
  draftClass: Player[];
  totalPlayers: number;
  generatedAt: string;
}

interface FullGameStats {
  teamCount: number;
  totalRosterPlayers: number;
  avgTeamOvr: number;
  freeAgentCount: number;
  freeAgentAvgOvr: number;
  draftClassCount: number;
  draftClassAvgOvr: number;
  totalPlayers: number;
  tierDistribution: Record<Tier, number>;
}

type ViewTab = "overview" | "teams" | "freeagents" | "draft";

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

export default function FullGameGeneratorPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<FullGameData | null>(null);
  const [stats, setStats] = useState<FullGameStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  const [selectedConference, setSelectedConference] = useState<string>("all");

  // Store all players for profile viewing and full game data for simulator
  useEffect(() => {
    if (gameData && stats) {
      const allPlayers: Player[] = [
        ...gameData.teams.flatMap((t) => t.roster.players),
        ...gameData.freeAgents,
        ...gameData.draftClass,
      ];
      storeDevPlayers(allPlayers);

      // Store full game data for simulator
      const fullGameData: StoredFullGameData = {
        teams: gameData.teams,
        generatedAt: gameData.generatedAt,
        totalPlayers: stats.totalPlayers,
        tierDistribution: Object.entries(stats.tierDistribution).reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {} as Record<string, number>),
      };
      storeFullGameData(fullGameData);
    }
  }, [gameData, stats]);

  const generateFullGame = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dev/generate-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setGameData(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to generate full game:", error);
    }
    setLoading(false);
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

  const tabs: { id: ViewTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "teams", label: "Teams" },
    { id: "freeagents", label: "Free Agents" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Full New Game Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate all 32 team rosters, free agents, and draft class
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Generate Button */}
        {!gameData && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">🌐</div>
            <p className="text-muted-foreground mb-4">
              Generate complete league data including 32 teams, 150+ free agents, and 224 draft
              prospects.
            </p>
            <button
              onClick={generateFullGame}
              disabled={loading}
              className={cn(
                "px-8 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-r from-blue-600 to-green-600 text-white",
                "hover:opacity-90 shadow-lg shadow-blue-500/25",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Generating (~10s)..." : "Generate Full Game"}
            </button>
          </div>
        )}

        {/* Regenerate Button */}
        {gameData && (
          <div className="flex justify-end">
            <button
              onClick={generateFullGame}
              disabled={loading}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                "bg-secondary border border-border hover:bg-secondary/80",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Regenerating..." : "Regenerate"}
            </button>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.teamCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Teams</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.totalRosterPlayers}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Rostered</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.freeAgentCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Free Agents</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.draftClassCount}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Prospects</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-secondary/80 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all",
                      activeTab === tab.id
                        ? "text-foreground bg-white/5 border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  {/* Tier Distribution */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Team Tier Distribution</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(stats.tierDistribution).map(([tier, count]) => (
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

                  {/* Averages */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400">{stats.avgTeamOvr}</div>
                      <div className="text-xs text-muted-foreground">Avg Team OVR</div>
                    </div>
                    <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {stats.freeAgentAvgOvr}
                      </div>
                      <div className="text-xs text-muted-foreground">FA Avg OVR</div>
                    </div>
                    <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-400">
                        {stats.draftClassAvgOvr}
                      </div>
                      <div className="text-xs text-muted-foreground">Draft Avg OVR</div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
                    <div className="text-4xl font-black">{stats.totalPlayers}</div>
                    <div className="text-sm text-muted-foreground">Total Players Generated</div>
                  </div>
                </>
              )}

              {/* Teams Tab */}
              {activeTab === "teams" && gameData && (
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

              {/* Free Agents Tab */}
              {activeTab === "freeagents" && gameData && (
                <div className="space-y-4">
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold">Free Agent Pool</h3>
                      <span className="text-xs text-muted-foreground">
                        {gameData.freeAgents.length} players
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Top 20 available free agents by overall rating
                    </p>
                    <div className="space-y-2">
                      {gameData.freeAgents.slice(0, 20).map((player, i) => (
                        <div
                          key={player.id}
                          onClick={() => router.push(`/dashboard/dev-tools/player/${player.id}`)}
                          className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground w-5 text-right text-xs">
                              {i + 1}.
                            </span>
                            <span className="font-medium">
                              {player.firstName} {player.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{player.position}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Age {player.age}</span>
                            <span
                              className={cn(
                                "font-bold",
                                player.overall >= 80
                                  ? "text-green-400"
                                  : player.overall >= 70
                                  ? "text-blue-400"
                                  : "text-muted-foreground"
                              )}
                            >
                              {player.overall}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Draft Tab */}
              {activeTab === "draft" && gameData && (
                <div className="space-y-4">
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold">Draft Class</h3>
                      <span className="text-xs text-muted-foreground">
                        {gameData.draftClass.length} prospects
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Top 20 prospects (Big Board)
                    </p>
                    <div className="space-y-2">
                      {gameData.draftClass.slice(0, 20).map((player, i) => (
                        <div
                          key={player.id}
                          onClick={() => router.push(`/dashboard/dev-tools/player/${player.id}`)}
                          className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground w-5 text-right text-xs">
                              {i + 1}.
                            </span>
                            <span className="font-medium">
                              {player.firstName} {player.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{player.position}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "font-bold",
                                player.overall >= 75
                                  ? "text-yellow-400"
                                  : player.overall >= 65
                                  ? "text-blue-400"
                                  : "text-muted-foreground"
                              )}
                            >
                              {player.overall}
                            </span>
                            <span className="text-xs text-green-400">POT {player.potential}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
