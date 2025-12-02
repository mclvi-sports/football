/**
 * Team Adapter
 *
 * Transforms TeamRosterData from the roster generator into SimTeam format
 * for the simulation engine.
 */

import { Player, Position, Tier } from '../types';
import { TeamRosterData } from '../dev-player-store';
import {
  SimTeam,
  SimBadge,
  SimTrait,
  OffensiveScheme,
  OFFENSIVE_WEIGHTS,
  DEFENSIVE_WEIGHTS,
} from './types';

// Position mapping from roster generator to sim engine
const POSITION_GROUP_MAP: Record<string, Position[]> = {
  qb: [Position.QB],
  rb: [Position.RB],
  wr: [Position.WR],
  te: [Position.TE],
  ol: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT],
  dl: [Position.DE, Position.DT],
  lb: [Position.MLB, Position.OLB],
  db: [Position.CB, Position.FS, Position.SS],
  k: [Position.K],
  p: [Position.P],
};

// Offensive schemes based on team tendencies
const SCHEME_BY_TIER: Record<Tier, OffensiveScheme[]> = {
  [Tier.Elite]: ['West Coast', 'Air Raid', 'Spread'],
  [Tier.Good]: ['West Coast', 'Pro Style', 'Power Run'],
  [Tier.Average]: ['Pro Style', 'Power Run', 'West Coast'],
  [Tier.BelowAverage]: ['Power Run', 'Pro Style', 'Run Heavy'],
  [Tier.Rebuilding]: ['Run Heavy', 'Pro Style', 'Power Run'],
};

/**
 * Get starter at a position from the depth chart
 */
export function getStarter(
  roster: Player[],
  depthChart: Record<Position, string[]>,
  position: Position,
  depth: number = 0
): Player | undefined {
  const playerIds = depthChart[position];
  if (!playerIds || playerIds.length <= depth) return undefined;
  return roster.find((p) => p.id === playerIds[depth]);
}

/**
 * Calculate average OVR for a position group
 */
function getPositionGroupOvr(
  roster: Player[],
  depthChart: Record<Position, string[]>,
  positions: Position[],
  startersOnly: boolean = true
): number {
  let totalOvr = 0;
  let count = 0;

  for (const position of positions) {
    const playerIds = depthChart[position] || [];
    const limit = startersOnly ? 1 : playerIds.length;

    for (let i = 0; i < Math.min(limit, playerIds.length); i++) {
      const player = roster.find((p) => p.id === playerIds[i]);
      if (player) {
        totalOvr += player.overall;
        count++;
      }
    }
  }

  return count > 0 ? Math.round(totalOvr / count) : 70;
}

/**
 * Calculate weighted offensive OVR from starters
 */
function calculateOffenseOvr(
  roster: Player[],
  depthChart: Record<Position, string[]>
): number {
  let weightedTotal = 0;
  let totalWeight = 0;

  // QB
  const qb = getStarter(roster, depthChart, Position.QB);
  if (qb) {
    weightedTotal += qb.overall * OFFENSIVE_WEIGHTS.QB;
    totalWeight += OFFENSIVE_WEIGHTS.QB;
  }

  // RB
  const rb = getStarter(roster, depthChart, Position.RB);
  if (rb) {
    weightedTotal += rb.overall * OFFENSIVE_WEIGHTS.RB;
    totalWeight += OFFENSIVE_WEIGHTS.RB;
  }

  // WRs
  const wr1 = getStarter(roster, depthChart, Position.WR, 0);
  const wr2 = getStarter(roster, depthChart, Position.WR, 1);
  const wr3 = getStarter(roster, depthChart, Position.WR, 2);
  if (wr1) {
    weightedTotal += wr1.overall * OFFENSIVE_WEIGHTS.WR1;
    totalWeight += OFFENSIVE_WEIGHTS.WR1;
  }
  if (wr2) {
    weightedTotal += wr2.overall * OFFENSIVE_WEIGHTS.WR2;
    totalWeight += OFFENSIVE_WEIGHTS.WR2;
  }
  if (wr3) {
    weightedTotal += wr3.overall * OFFENSIVE_WEIGHTS.WR3;
    totalWeight += OFFENSIVE_WEIGHTS.WR3;
  }

  // TE
  const te = getStarter(roster, depthChart, Position.TE);
  if (te) {
    weightedTotal += te.overall * OFFENSIVE_WEIGHTS.TE;
    totalWeight += OFFENSIVE_WEIGHTS.TE;
  }

  // OL
  const lt = getStarter(roster, depthChart, Position.LT);
  const lg = getStarter(roster, depthChart, Position.LG);
  const c = getStarter(roster, depthChart, Position.C);
  const rg = getStarter(roster, depthChart, Position.RG);
  const rt = getStarter(roster, depthChart, Position.RT);

  if (lt) {
    weightedTotal += lt.overall * OFFENSIVE_WEIGHTS.LT;
    totalWeight += OFFENSIVE_WEIGHTS.LT;
  }
  if (lg) {
    weightedTotal += lg.overall * OFFENSIVE_WEIGHTS.LG;
    totalWeight += OFFENSIVE_WEIGHTS.LG;
  }
  if (c) {
    weightedTotal += c.overall * OFFENSIVE_WEIGHTS.C;
    totalWeight += OFFENSIVE_WEIGHTS.C;
  }
  if (rg) {
    weightedTotal += rg.overall * OFFENSIVE_WEIGHTS.RG;
    totalWeight += OFFENSIVE_WEIGHTS.RG;
  }
  if (rt) {
    weightedTotal += rt.overall * OFFENSIVE_WEIGHTS.RT;
    totalWeight += OFFENSIVE_WEIGHTS.RT;
  }

  return totalWeight > 0 ? Math.round(weightedTotal / totalWeight) : 70;
}

/**
 * Calculate weighted defensive OVR from starters
 */
function calculateDefenseOvr(
  roster: Player[],
  depthChart: Record<Position, string[]>
): number {
  let weightedTotal = 0;
  let totalWeight = 0;

  // DEs (EDGE)
  const de1 = getStarter(roster, depthChart, Position.DE, 0);
  const de2 = getStarter(roster, depthChart, Position.DE, 1);
  if (de1) {
    weightedTotal += de1.overall * DEFENSIVE_WEIGHTS.EDGE1;
    totalWeight += DEFENSIVE_WEIGHTS.EDGE1;
  }
  if (de2) {
    weightedTotal += de2.overall * DEFENSIVE_WEIGHTS.EDGE2;
    totalWeight += DEFENSIVE_WEIGHTS.EDGE2;
  }

  // DTs
  const dt1 = getStarter(roster, depthChart, Position.DT, 0);
  const dt2 = getStarter(roster, depthChart, Position.DT, 1);
  if (dt1) {
    weightedTotal += dt1.overall * DEFENSIVE_WEIGHTS.DT1;
    totalWeight += DEFENSIVE_WEIGHTS.DT1;
  }
  if (dt2) {
    weightedTotal += dt2.overall * DEFENSIVE_WEIGHTS.DT2;
    totalWeight += DEFENSIVE_WEIGHTS.DT2;
  }

  // LBs
  const mlb = getStarter(roster, depthChart, Position.MLB, 0);
  const olb1 = getStarter(roster, depthChart, Position.OLB, 0);
  const olb2 = getStarter(roster, depthChart, Position.OLB, 1);
  if (mlb) {
    weightedTotal += mlb.overall * DEFENSIVE_WEIGHTS.LB1;
    totalWeight += DEFENSIVE_WEIGHTS.LB1;
  }
  if (olb1) {
    weightedTotal += olb1.overall * DEFENSIVE_WEIGHTS.LB2;
    totalWeight += DEFENSIVE_WEIGHTS.LB2;
  }
  if (olb2) {
    weightedTotal += olb2.overall * DEFENSIVE_WEIGHTS.LB3;
    totalWeight += DEFENSIVE_WEIGHTS.LB3;
  }

  // CBs
  const cb1 = getStarter(roster, depthChart, Position.CB, 0);
  const cb2 = getStarter(roster, depthChart, Position.CB, 1);
  if (cb1) {
    weightedTotal += cb1.overall * DEFENSIVE_WEIGHTS.CB1;
    totalWeight += DEFENSIVE_WEIGHTS.CB1;
  }
  if (cb2) {
    weightedTotal += cb2.overall * DEFENSIVE_WEIGHTS.CB2;
    totalWeight += DEFENSIVE_WEIGHTS.CB2;
  }

  // Safeties
  const fs = getStarter(roster, depthChart, Position.FS);
  const ss = getStarter(roster, depthChart, Position.SS);
  if (fs) {
    weightedTotal += fs.overall * DEFENSIVE_WEIGHTS.S1;
    totalWeight += DEFENSIVE_WEIGHTS.S1;
  }
  if (ss) {
    weightedTotal += ss.overall * DEFENSIVE_WEIGHTS.S2;
    totalWeight += DEFENSIVE_WEIGHTS.S2;
  }

  return totalWeight > 0 ? Math.round(weightedTotal / totalWeight) : 70;
}

/**
 * Extract all badges from roster players
 */
function extractBadges(roster: Player[]): SimBadge[] {
  const badges: SimBadge[] = [];

  for (const player of roster) {
    if (player.badges && player.badges.length > 0) {
      for (const badge of player.badges) {
        badges.push({
          name: badge.id,
          tier: badge.tier as 'bronze' | 'silver' | 'gold' | 'hof',
          playerId: player.id,
        });
      }
    }
  }

  return badges;
}

/**
 * Extract all traits from roster players
 */
function extractTraits(roster: Player[]): SimTrait[] {
  const traits: SimTrait[] = [];
  const negativeTrait = [
    'Chokes Under Pressure',
    'Injury Prone',
    'Hot Head',
    'Slow Starter',
    'Frontrunner',
  ];

  for (const player of roster) {
    if (player.traits && player.traits.length > 0) {
      for (const trait of player.traits) {
        traits.push({
          name: trait,
          playerId: player.id,
          isNegative: negativeTrait.includes(trait),
        });
      }
    }
  }

  return traits;
}

/**
 * Determine offensive scheme based on roster strengths
 */
function determineScheme(
  roster: Player[],
  depthChart: Record<Position, string[]>,
  tier: Tier
): OffensiveScheme {
  const qb = getStarter(roster, depthChart, Position.QB);
  const rb = getStarter(roster, depthChart, Position.RB);
  const wr1 = getStarter(roster, depthChart, Position.WR, 0);

  // If QB is elite, lean toward passing schemes
  if (qb && qb.overall >= 85) {
    if (wr1 && wr1.overall >= 85) return 'Air Raid';
    return 'West Coast';
  }

  // If RB is the strength, lean toward running
  if (rb && rb.overall >= 85) {
    return 'Power Run';
  }

  // Fall back to tier-based defaults
  const schemes = SCHEME_BY_TIER[tier];
  return schemes[Math.floor(Math.random() * schemes.length)];
}

/**
 * Transform TeamRosterData to SimTeam format
 */
export function adaptTeamRoster(teamData: TeamRosterData): SimTeam {
  const { team, tier, roster, stats } = teamData;
  const players = roster.players;
  const depthChart = roster.depthChart as Record<Position, string[]>;

  // Calculate position group OVRs
  const qbOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.qb);
  const rbOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.rb);
  const wrOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.wr);
  const teOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.te);
  const olOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.ol);
  const dlOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.dl);
  const lbOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.lb);
  const dbOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.db);
  const kOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.k);
  const pOvr = getPositionGroupOvr(players, depthChart, POSITION_GROUP_MAP.p);

  // Calculate overall ratings
  const offOvr = calculateOffenseOvr(players, depthChart);
  const defOvr = calculateDefenseOvr(players, depthChart);
  const teamOvr = Math.round((offOvr + defOvr) / 2);

  return {
    id: team.id,
    city: team.city,
    name: team.name,
    abbrev: team.id,
    tier,
    ovr: teamOvr,
    offense: {
      qb: qbOvr,
      rb: rbOvr,
      wr: wrOvr,
      te: teOvr,
      ol: olOvr,
    },
    defense: {
      dl: dlOvr,
      lb: lbOvr,
      db: dbOvr,
    },
    specialTeams: {
      k: kOvr,
      p: pOvr,
    },
    scheme: determineScheme(players, depthChart, tier),
    badges: extractBadges(players),
    traits: extractTraits(players),
    roster: players,
    depthChart: depthChart as Record<string, string[]>,
  };
}

/**
 * Get player by ID from a SimTeam
 */
export function getPlayerById(team: SimTeam, playerId: string): Player | undefined {
  return team.roster.find((p) => p.id === playerId);
}

/**
 * Format player name for display
 */
export function formatPlayerName(player: Player, style: 'short' | 'full' = 'short'): string {
  if (style === 'full') {
    return `${player.firstName} ${player.lastName}`;
  }
  return `${player.firstName.charAt(0)}. ${player.lastName}`;
}
