import { NextRequest, NextResponse } from "next/server";
import { generateDraftClass, getDraftClassStats } from "@/lib/generators/draft-generator";

export async function POST(request: NextRequest) {
  try {
    // Handle missing/empty body gracefully
    let size: number | undefined;
    try {
      const body = await request.json();
      size = body.size ? Number(body.size) : undefined;
    } catch {
      // No body sent - use defaults
      size = undefined;
    }

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
