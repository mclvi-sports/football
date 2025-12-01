import { NextRequest, NextResponse } from "next/server";
import { generateFAPool, getFAPoolStats, FAQuality } from "@/lib/generators/fa-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const size = body.size || 100;
    const quality = (body.quality as FAQuality) || "mixed";

    const players = generateFAPool({ size, quality });
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
