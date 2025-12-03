import { NextRequest, NextResponse } from 'next/server';
import { Tier } from '@/lib/types';
import { GMBackground, GMArchetype, generateLeagueGMs } from '@/lib/gm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      playerTeamId,
      playerBackground,
      playerArchetype,
      teamTiers,
      playerFirstName,
      playerLastName,
    } = body;

    // Validate required fields
    if (!playerTeamId || !playerBackground || !playerArchetype) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: playerTeamId, playerBackground, playerArchetype',
        },
        { status: 400 }
      );
    }

    // Validate background
    const validBackgrounds: GMBackground[] = [
      'scout', 'cap_analyst', 'coach', 'agent', 'analytics', 'legacy',
    ];
    if (!validBackgrounds.includes(playerBackground)) {
      return NextResponse.json(
        { success: false, error: 'Invalid background' },
        { status: 400 }
      );
    }

    // Validate archetype
    const validArchetypes: GMArchetype[] = [
      'builder', 'closer', 'economist', 'talent_scout', 'culture_builder', 'innovator',
    ];
    if (!validArchetypes.includes(playerArchetype)) {
      return NextResponse.json(
        { success: false, error: 'Invalid archetype' },
        { status: 400 }
      );
    }

    // Convert team tiers to Map
    const tiersMap = new Map<string, Tier>();
    if (teamTiers && typeof teamTiers === 'object') {
      Object.entries(teamTiers).forEach(([teamId, tier]) => {
        tiersMap.set(teamId, tier as Tier);
      });
    }

    // Generate all GMs
    const gms = generateLeagueGMs(
      playerTeamId,
      playerBackground as GMBackground,
      playerArchetype as GMArchetype,
      tiersMap,
      playerFirstName,
      playerLastName
    );

    return NextResponse.json({
      success: true,
      gms,
    });
  } catch (error) {
    console.error('GM generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate GMs' },
      { status: 500 }
    );
  }
}
