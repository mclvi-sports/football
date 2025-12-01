import { NextRequest, NextResponse } from "next/server";
import { generateDraftClass, getDraftClassStats, DraftDepth, DraftTalent } from "@/lib/generators/draft-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const depth = (body.depth as DraftDepth) || "normal";
    const talent = (body.talent as DraftTalent) || "average";

    const players = generateDraftClass({ depth, talent });
    const stats = getDraftClassStats(players);

    return NextResponse.json({
      success: true,
      players,
      stats,
    });
  } catch (error) {
    console.error("Draft generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate draft class" },
      { status: 500 }
    );
  }
}
