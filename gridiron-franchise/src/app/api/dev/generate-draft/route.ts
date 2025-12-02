import { NextRequest, NextResponse } from "next/server";
import { generateDraftClass, getDraftClassStats } from "@/lib/generators/draft-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Size defaults to ~275 (224 drafted + 40-60 UDFA) per FINALS if not specified
    const size = body.size ? Number(body.size) : undefined;

    const players = generateDraftClass({ size });
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
