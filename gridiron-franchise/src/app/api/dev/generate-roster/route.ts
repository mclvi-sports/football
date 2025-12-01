import { NextRequest, NextResponse } from "next/server";
import { generateTeamRoster, getRosterStats } from "@/lib/generators/roster-generator";
import { Tier } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tier = (body.tier as Tier) || Tier.Average;
    const teamId = body.teamId || "dev-test-team";

    const roster = generateTeamRoster(teamId, tier);
    const stats = getRosterStats(roster);

    return NextResponse.json({
      success: true,
      roster,
      stats,
    });
  } catch (error) {
    console.error("Roster generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate roster" },
      { status: 500 }
    );
  }
}
