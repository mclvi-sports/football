"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";
import { getFullGameData, TeamRosterData } from "@/lib/dev-player-store";
import { getOwnerModeGMs, setOwnerTeam, GM } from "@/lib/gm";
import { cn } from "@/lib/utils";
import { Tier } from "@/lib/types";
import { teams as staticTeams, Team } from "@/data/teams";

// Tier display config
const TIER_CONFIG: Record<Tier, { label: string; color: string }> = {
  [Tier.Elite]: { label: "Elite", color: "text-amber-500" },
  [Tier.Good]: { label: "Good", color: "text-green-500" },
  [Tier.Average]: { label: "Average", color: "text-blue-500" },
  [Tier.BelowAverage]: { label: "Below Avg", color: "text-orange-500" },
  [Tier.Rebuilding]: { label: "Rebuilding", color: "text-red-500" },
};

// Build lookup map for static team data (abbreviation, colors)
const teamLookup = new Map<string, Team>();
for (const t of staticTeams) {
  teamLookup.set(t.id.toUpperCase(), t);
  teamLookup.set(t.id.toLowerCase(), t);
}

interface TeamWithData {
  teamInfo: TeamRosterData["team"];
  staticTeam: Team | null;
  tier: Tier;
  gm: GM | null;
  avgOvr: number;
}

export default function TeamSelectionPage() {
  const router = useRouter();
  const { selectedTeam, setTeam } = useCareerStore();
  const [teamsData, setTeamsData] = useState<TeamWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load generated data on mount
  useEffect(() => {
    const gameData = getFullGameData();
    const ownerGMs = getOwnerModeGMs();

    if (!gameData || !ownerGMs) {
      // No generated data - redirect to generate
      router.replace("/career/new/generate");
      return;
    }

    // Build team data with GM info
    const teams: TeamWithData[] = gameData.teams.map((teamData) => ({
      teamInfo: teamData.team,
      staticTeam: teamLookup.get(teamData.team.id) || null,
      tier: teamData.tier,
      gm: ownerGMs.allGMs[teamData.team.id] || null,
      avgOvr: teamData.stats.avgOvr,
    }));

    // Sort by tier (Elite first) then by name
    teams.sort((a, b) => {
      const tierOrder = [Tier.Elite, Tier.Good, Tier.Average, Tier.BelowAverage, Tier.Rebuilding];
      const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      if (tierDiff !== 0) return tierDiff;
      return a.teamInfo.name.localeCompare(b.teamInfo.name);
    });

    setTeamsData(teams);
    setIsLoading(false);
  }, [router]);

  function handleSelectTeam(teamData: TeamWithData) {
    if (!teamData.staticTeam) return;
    // Store full Team object from static data
    setTeam(teamData.staticTeam);
    setOwnerTeam(teamData.teamInfo.id);
  }

  function handleNext() {
    if (selectedTeam) {
      router.push("/career/new/confirm");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-40px)]">
        <p className="text-muted-foreground">Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <div>
          <h1 className="text-xl font-bold">Pick Your Team</h1>
          <p className="text-xs text-muted-foreground">
            As owner, you'll inherit the team's GM
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="grid grid-cols-1 gap-2">
          {teamsData.map((teamData) => {
            const isSelected = selectedTeam?.id === teamData.staticTeam?.id;
            const tierConfig = TIER_CONFIG[teamData.tier];
            const colors = teamData.staticTeam?.colors || { primary: "#333", secondary: "#fff" };
            const abbrev = teamData.staticTeam?.abbreviation || teamData.teamInfo.id.substring(0, 3);

            return (
              <button
                key={teamData.teamInfo.id}
                onClick={() => handleSelectTeam(teamData)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-background border-border hover:bg-secondary/50"
                )}
              >
                {/* Team Logo */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.secondary,
                  }}
                >
                  {abbrev}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">
                      {teamData.teamInfo.city} {teamData.teamInfo.name}
                    </span>
                    <span className={cn("text-xs font-medium", tierConfig.color)}>
                      {tierConfig.label}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {teamData.teamInfo.division} • OVR {teamData.avgOvr}
                  </div>
                </div>

                {/* GM Preview */}
                {teamData.gm && (
                  <div className="text-right shrink-0">
                    <div className="text-xs font-medium">
                      {teamData.gm.firstName} {teamData.gm.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      GM
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-[400px] mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selectedTeam}
            className="w-full"
            size="lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
