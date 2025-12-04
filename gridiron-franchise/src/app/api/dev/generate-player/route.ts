import { NextRequest, NextResponse } from "next/server";
import { generatePlayer, GeneratePlayerOptions } from "@/lib/generators/player-generator";
import { Position } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Position is required - pick random if not provided
    const positions = Object.values(Position);
    const position = body.position || positions[Math.floor(Math.random() * positions.length)];

    // OVR defaults to 70-85 range (typical starter)
    const targetOvr = body.targetOvr ?? Math.floor(Math.random() * 16) + 70;

    const options: GeneratePlayerOptions = {
      position,
      targetOvr,
      archetype: body.archetype,
      slot: body.slot,
      age: body.age,
    };

    const player = generatePlayer(options);

    return NextResponse.json({
      success: true,
      player,
    });
  } catch (error) {
    console.error("Player generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate player" },
      { status: 500 }
    );
  }
}
