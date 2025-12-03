import { NextRequest, NextResponse } from 'next/server';
import { Tier } from '@/lib/types';
import { GMBackground, GMArchetype, generateLeagueGMs, generateAllCPUGMs } from '@/lib/gm';

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

    // Convert team tiers to Map
    const tiersMap = new Map<string, Tier>();
    if (teamTiers && typeof teamTiers === 'object') {
      Object.entries(teamTiers).forEach(([teamId, tier]) => {
        tiersMap.set(teamId, tier as Tier);
      });
    }

    // Owner mode: If no player params, generate all 32 as CPU GMs
    if (!playerTeamId && !playerBackground && !playerArchetype) {
      const allGMs = generateAllCPUGMs(tiersMap);
      return NextResponse.json({
        success: true,
        mode: 'owner',
        gms: allGMs,
        generatedAt: new Date().toISOString(),
      });
    }

    // Player GM mode: Validate required fields
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

    // Generate all GMs with player GM
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
      mode: 'player',
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
