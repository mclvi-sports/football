import { NextRequest, NextResponse } from "next/server";
import { generateAllTeamRosters, TeamRosterData } from "@/lib/generators/full-game-generator";
import { Tier } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { teams, tierAssignments } = generateAllTeamRosters();

    // Build tier distribution stats
    const tierDistribution: Record<Tier, number> = {
      [Tier.Elite]: 0,
      [Tier.Good]: 0,
      [Tier.Average]: 0,
      [Tier.BelowAverage]: 0,
      [Tier.Rebuilding]: 0,
    };

    let totalPlayers = 0;
    let totalOvr = 0;

    for (const teamData of teams) {
      tierDistribution[teamData.tier]++;
      totalPlayers += teamData.stats.totalPlayers;
      totalOvr += teamData.stats.avgOvr;
    }

    return NextResponse.json({
      success: true,
      teams,
      stats: {
        teamCount: teams.length,
        totalPlayers,
        avgTeamOvr: Math.round(totalOvr / teams.length),
        tierDistribution,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Rosters generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate team rosters" },
      { status: 500 }
    );
  }
}
