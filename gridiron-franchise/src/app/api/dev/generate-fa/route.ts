import { NextRequest, NextResponse } from "next/server";
import { generateFAPool, getFAPoolStats } from "@/lib/generators/fa-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Size defaults to random 150-200 per FINALS if not specified
    const size = body.size ? Number(body.size) : undefined;

    const players = generateFAPool({ size });
    const stats = getFAPoolStats(players);

    return NextResponse.json({
      success: true,
      players,
      stats,
    });
  } catch (error) {
    console.error("FA generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate free agent pool" },
      { status: 500 }
    );
  }
}
