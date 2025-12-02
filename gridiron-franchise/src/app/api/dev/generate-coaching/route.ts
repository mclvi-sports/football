import { NextRequest, NextResponse } from 'next/server';
import { Tier } from '@/lib/types';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import {
  generateCoaching,
  getCoachingStats,
} from '@/lib/coaching/coaching-generator';

// Tier distribution per FINALS spec
const TIER_DISTRIBUTION: { tier: Tier; count: number }[] = [
  { tier: Tier.Elite, count: 3 },
  { tier: Tier.Good, count: 8 },
  { tier: Tier.Average, count: 12 },
  { tier: Tier.BelowAverage, count: 6 },
  { tier: Tier.Rebuilding, count: 3 },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function assignTiers(): Map<string, Tier> {
  const tiers = new Map<string, Tier>();
  const shuffledTeams = shuffleArray(LEAGUE_TEAMS);

  let teamIndex = 0;
  for (const { tier, count } of TIER_DISTRIBUTION) {
    for (let i = 0; i < count && teamIndex < shuffledTeams.length; i++) {
      tiers.set(shuffledTeams[teamIndex].id, tier);
      teamIndex++;
    }
  }

  return tiers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    // Generate tier assignments for teams (or use provided ones)
    let teamTiers: Map<string, Tier>;

    if (body.teamTiers && typeof body.teamTiers === 'object') {
      // Use provided tier assignments
      teamTiers = new Map(Object.entries(body.teamTiers) as [string, Tier][]);
    } else {
      // Generate random tier assignments
      teamTiers = assignTiers();
    }

    const coaching = generateCoaching(teamTiers);
    const stats = getCoachingStats(coaching);

    // Convert tier map to object for JSON response
    const tierAssignments: Record<string, Tier> = {};
    teamTiers.forEach((tier, teamId) => {
      tierAssignments[teamId] = tier;
    });

    return NextResponse.json({
      success: true,
      coaching,
      stats,
      tierAssignments,
    });
  } catch (error) {
    console.error('Coaching generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate coaching staff' },
      { status: 500 }
    );
  }
}
