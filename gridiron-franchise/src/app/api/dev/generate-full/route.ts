import { NextRequest, NextResponse } from "next/server";
import { generateFullGame, getFullGameStats } from "@/lib/generators/full-game-generator";

export async function POST(request: NextRequest) {
  try {
    const gameData = generateFullGame();
    const stats = getFullGameStats(gameData);

    return NextResponse.json({
      success: true,
      data: gameData,
      stats,
    });
  } catch (error) {
    console.error("Full game generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate full game data" },
      { status: 500 }
    );
  }
}
