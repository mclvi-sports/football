/**
 * Badges System - Situational bonuses that activate under specific conditions
 *
 * Badges provide temporary attribute boosts when their conditions are met.
 * Players can earn badges through XP investment or performance milestones.
 *
 * Source: badges-system.md
 */

import { Position, BadgeTier } from '../types';

export interface BadgeTierEffect {
  boost: number;
  description: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  type: 'universal' | 'position';
  positions?: Position[]; // Which positions can have this badge (empty = universal)
  condition: string; // When the badge activates
  tiers: Record<BadgeTier, BadgeTierEffect>;
}

/**
 * Badge tier boost ranges
 */
export const BADGE_TIER_RANGES: Record<BadgeTier, { min: number; max: number }> = {
  bronze: { min: 2, max: 3 },
  silver: { min: 4, max: 5 },
  gold: { min: 6, max: 8 },
  hof: { min: 9, max: 12 },
};

/**
 * All badge definitions
 */
export const BADGES: BadgeDefinition[] = [
  // ==========================================
  // UNIVERSAL BADGES (All Positions)
  // ==========================================
  {
    id: 'clutch',
    name: 'Clutch',
    type: 'universal',
    condition: 'Final 2 minutes of half/game OR overtime',
    tiers: {
      bronze: { boost: 3, description: '+3 to all attributes' },
      silver: { boost: 5, description: '+5 to all attributes' },
      gold: { boost: 8, description: '+8 to all attributes' },
      hof: { boost: 12, description: '+12 to all attributes' },
    },
  },
  {
    id: 'prime_time',
    name: 'Prime Time',
    type: 'universal',
    condition: 'Nationally televised games (prime time slots)',
    tiers: {
      bronze: { boost: 2, description: '+2 OVR' },
      silver: { boost: 3, description: '+3 OVR' },
      gold: { boost: 5, description: '+5 OVR' },
      hof: { boost: 7, description: '+7 OVR' },
    },
  },
  {
    id: 'playoff_performer',
    name: 'Playoff Performer',
    type: 'universal',
    condition: 'Playoff games only',
    tiers: {
      bronze: { boost: 3, description: '+3 OVR' },
      silver: { boost: 5, description: '+5 OVR' },
      gold: { boost: 8, description: '+8 OVR' },
      hof: { boost: 10, description: '+10 OVR' },
    },
  },
  {
    id: 'home_field_hero',
    name: 'Home Field Hero',
    type: 'universal',
    condition: 'Home games only',
    tiers: {
      bronze: { boost: 2, description: '+2 OVR' },
      silver: { boost: 3, description: '+3 OVR' },
      gold: { boost: 5, description: '+5 OVR' },
      hof: { boost: 7, description: '+7 OVR' },
    },
  },
  {
    id: 'road_warrior',
    name: 'Road Warrior',
    type: 'universal',
    condition: 'Away games only',
    tiers: {
      bronze: { boost: 0, description: 'Negates away game penalty' },
      silver: { boost: 1, description: '+1 OVR in away games' },
      gold: { boost: 3, description: '+3 OVR in away games' },
      hof: { boost: 5, description: '+5 OVR in away games' },
    },
  },
  {
    id: 'weather_proof',
    name: 'Weather Proof',
    type: 'universal',
    condition: 'Bad weather games (rain, snow, wind)',
    tiers: {
      bronze: { boost: 0, description: '-50% weather penalty' },
      silver: { boost: 0, description: 'No weather penalty' },
      gold: { boost: 2, description: '+2 OVR in bad weather' },
      hof: { boost: 5, description: '+5 OVR in bad weather' },
    },
  },
  {
    id: 'fourth_quarter_closer',
    name: '4th Quarter Closer',
    type: 'universal',
    condition: '4th quarter when team is winning',
    tiers: {
      bronze: { boost: 3, description: '+3 to all attributes' },
      silver: { boost: 5, description: '+5 to all attributes' },
      gold: { boost: 7, description: '+7 to all attributes' },
      hof: { boost: 10, description: '+10 to all attributes' },
    },
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    type: 'universal',
    condition: '4th quarter when team is losing',
    tiers: {
      bronze: { boost: 3, description: '+3 to all attributes' },
      silver: { boost: 5, description: '+5 to all attributes' },
      gold: { boost: 8, description: '+8 to all attributes' },
      hof: { boost: 12, description: '+12 to all attributes' },
    },
  },
  {
    id: 'division_rival_killer',
    name: 'Division Rival Killer',
    type: 'universal',
    condition: 'Games against division rivals',
    tiers: {
      bronze: { boost: 2, description: '+2 OVR' },
      silver: { boost: 4, description: '+4 OVR' },
      gold: { boost: 6, description: '+6 OVR' },
      hof: { boost: 8, description: '+8 OVR' },
    },
  },
  {
    id: 'big_game_player',
    name: 'Big Game Player',
    type: 'universal',
    condition: 'Games with playoff implications',
    tiers: {
      bronze: { boost: 3, description: '+3 OVR' },
      silver: { boost: 5, description: '+5 OVR' },
      gold: { boost: 7, description: '+7 OVR' },
      hof: { boost: 10, description: '+10 OVR' },
    },
  },
  {
    id: 'underdog_mentality',
    name: 'Underdog Mentality',
    type: 'universal',
    condition: 'Team is underdog (lower OVR than opponent)',
    tiers: {
      bronze: { boost: 2, description: '+2 OVR' },
      silver: { boost: 4, description: '+4 OVR' },
      gold: { boost: 6, description: '+6 OVR' },
      hof: { boost: 8, description: '+8 OVR' },
    },
  },
  {
    id: 'giant_slayer',
    name: 'Giant Slayer',
    type: 'universal',
    condition: 'Opponent is 85+ team OVR',
    tiers: {
      bronze: { boost: 3, description: '+3 OVR' },
      silver: { boost: 5, description: '+5 OVR' },
      gold: { boost: 7, description: '+7 OVR' },
      hof: { boost: 10, description: '+10 OVR' },
    },
  },

  // ==========================================
  // QB-SPECIFIC BADGES
  // ==========================================
  {
    id: 'red_zone_qb',
    name: 'Red Zone QB',
    type: 'position',
    positions: [Position.QB],
    condition: 'Offense inside opponent\'s 20-yard line',
    tiers: {
      bronze: { boost: 3, description: '+3 to all passing attributes' },
      silver: { boost: 5, description: '+5 to all passing attributes' },
      gold: { boost: 8, description: '+8 to all passing attributes' },
      hof: { boost: 12, description: '+12 to all passing attributes' },
    },
  },
  {
    id: 'deep_ball_threat_qb',
    name: 'Deep Ball Threat',
    type: 'position',
    positions: [Position.QB],
    condition: 'Passes 30+ yards downfield',
    tiers: {
      bronze: { boost: 3, description: '+3 Deep Accuracy' },
      silver: { boost: 5, description: '+5 Deep Accuracy' },
      gold: { boost: 8, description: '+8 Deep Accuracy' },
      hof: { boost: 12, description: '+12 Deep Accuracy' },
    },
  },
  {
    id: 'no_huddle_specialist',
    name: 'No Huddle Specialist',
    type: 'position',
    positions: [Position.QB],
    condition: 'Up-tempo/no-huddle offense',
    tiers: {
      bronze: { boost: 2, description: '+2 to all attributes' },
      silver: { boost: 4, description: '+4 to all attributes' },
      gold: { boost: 6, description: '+6 to all attributes' },
      hof: { boost: 8, description: '+8 to all attributes' },
    },
  },
  {
    id: 'pocket_presence',
    name: 'Pocket Presence',
    type: 'position',
    positions: [Position.QB],
    condition: 'Under pressure (3+ pass rushers)',
    tiers: {
      bronze: { boost: 3, description: '+3 Throw Under Pressure' },
      silver: { boost: 5, description: '+5 Throw Under Pressure' },
      gold: { boost: 8, description: '+8 Throw Under Pressure' },
      hof: { boost: 12, description: '+12 Throw Under Pressure' },
    },
  },

  // ==========================================
  // RB-SPECIFIC BADGES
  // ==========================================
  {
    id: 'red_zone_back',
    name: 'Red Zone Back',
    type: 'position',
    positions: [Position.RB],
    condition: 'Inside opponent\'s 20-yard line',
    tiers: {
      bronze: { boost: 3, description: '+3 to all rushing attributes' },
      silver: { boost: 5, description: '+5 to all rushing attributes' },
      gold: { boost: 8, description: '+8 to all rushing attributes' },
      hof: { boost: 12, description: '+12 to all rushing attributes' },
    },
  },
  {
    id: 'goal_line_back',
    name: 'Goal Line Back',
    type: 'position',
    positions: [Position.RB],
    condition: 'Inside opponent\'s 5-yard line',
    tiers: {
      bronze: { boost: 5, description: '+5 Trucking, +3 Strength' },
      silver: { boost: 8, description: '+8 Trucking, +5 Strength' },
      gold: { boost: 12, description: '+12 Trucking, +8 Strength' },
      hof: { boost: 15, description: '+15 Trucking, +10 Strength' },
    },
  },
  {
    id: 'open_field_runner',
    name: 'Open Field Runner',
    type: 'position',
    positions: [Position.RB],
    condition: 'Clear running lane',
    tiers: {
      bronze: { boost: 3, description: '+3 Speed, +2 Acceleration' },
      silver: { boost: 5, description: '+5 Speed, +4 Acceleration' },
      gold: { boost: 8, description: '+8 Speed, +6 Acceleration' },
      hof: { boost: 12, description: '+12 Speed, +8 Acceleration' },
    },
  },
  {
    id: 'third_down_back',
    name: 'Third Down Back',
    type: 'position',
    positions: [Position.RB],
    condition: '3rd down plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Catching, +2 Route Running' },
      silver: { boost: 5, description: '+5 Catching, +4 Route Running' },
      gold: { boost: 8, description: '+8 Catching, +6 Route Running' },
      hof: { boost: 12, description: '+12 Catching, +8 Route Running' },
    },
  },

  // ==========================================
  // WR-SPECIFIC BADGES
  // ==========================================
  {
    id: 'red_zone_threat_wr',
    name: 'Red Zone Threat',
    type: 'position',
    positions: [Position.WR],
    condition: 'Inside opponent\'s 20-yard line',
    tiers: {
      bronze: { boost: 3, description: '+3 Catching, +2 CIT' },
      silver: { boost: 5, description: '+5 Catching, +4 CIT' },
      gold: { boost: 8, description: '+8 Catching, +6 CIT' },
      hof: { boost: 12, description: '+12 Catching, +8 CIT' },
    },
  },
  {
    id: 'deep_threat_wr',
    name: 'Deep Threat',
    type: 'position',
    positions: [Position.WR],
    condition: 'Routes 30+ yards downfield',
    tiers: {
      bronze: { boost: 3, description: '+3 Speed, +2 Deep Route Running' },
      silver: { boost: 5, description: '+5 Speed, +4 Deep Route Running' },
      gold: { boost: 8, description: '+8 Speed, +6 Deep Route Running' },
      hof: { boost: 12, description: '+12 Speed, +8 Deep Route Running' },
    },
  },
  {
    id: 'possession_receiver',
    name: 'Possession Receiver',
    type: 'position',
    positions: [Position.WR],
    condition: 'Contested catches',
    tiers: {
      bronze: { boost: 3, description: '+3 CIT, +2 Spectacular Catch' },
      silver: { boost: 5, description: '+5 CIT, +4 Spectacular Catch' },
      gold: { boost: 8, description: '+8 CIT, +6 Spectacular Catch' },
      hof: { boost: 12, description: '+12 CIT, +8 Spectacular Catch' },
    },
  },
  {
    id: 'slot_specialist_badge',
    name: 'Slot Specialist',
    type: 'position',
    positions: [Position.WR],
    condition: 'Lined up in slot position',
    tiers: {
      bronze: { boost: 3, description: '+3 Short Route Running, +2 Agility' },
      silver: { boost: 5, description: '+5 Short Route Running, +4 Agility' },
      gold: { boost: 8, description: '+8 Short Route Running, +6 Agility' },
      hof: { boost: 12, description: '+12 Short Route Running, +8 Agility' },
    },
  },

  // ==========================================
  // TE-SPECIFIC BADGES
  // ==========================================
  {
    id: 'red_zone_weapon',
    name: 'Red Zone Weapon',
    type: 'position',
    positions: [Position.TE],
    condition: 'Inside opponent\'s 20-yard line',
    tiers: {
      bronze: { boost: 3, description: '+3 Catching, +2 CIT' },
      silver: { boost: 5, description: '+5 Catching, +4 CIT' },
      gold: { boost: 8, description: '+8 Catching, +6 CIT' },
      hof: { boost: 12, description: '+12 Catching, +8 CIT' },
    },
  },
  {
    id: 'seam_router',
    name: 'Seam Router',
    type: 'position',
    positions: [Position.TE],
    condition: 'Routes 15-25 yards (seam routes)',
    tiers: {
      bronze: { boost: 3, description: '+3 Medium Route Running' },
      silver: { boost: 5, description: '+5 Medium Route Running' },
      gold: { boost: 8, description: '+8 Medium Route Running' },
      hof: { boost: 12, description: '+12 Medium Route Running' },
    },
  },
  {
    id: 'run_blocking_te',
    name: 'Run Blocking TE',
    type: 'position',
    positions: [Position.TE],
    condition: 'Run plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Run Blocking' },
      silver: { boost: 5, description: '+5 Run Blocking' },
      gold: { boost: 8, description: '+8 Run Blocking' },
      hof: { boost: 12, description: '+12 Run Blocking' },
    },
  },

  // ==========================================
  // OL-SPECIFIC BADGES
  // ==========================================
  {
    id: 'pass_protector_badge',
    name: 'Pass Protector',
    type: 'position',
    positions: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT],
    condition: 'Pass plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Pass Blocking' },
      silver: { boost: 5, description: '+5 Pass Blocking' },
      gold: { boost: 8, description: '+8 Pass Blocking' },
      hof: { boost: 12, description: '+12 Pass Blocking' },
    },
  },
  {
    id: 'road_grader_badge',
    name: 'Road Grader',
    type: 'position',
    positions: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT],
    condition: 'Run plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Run Blocking' },
      silver: { boost: 5, description: '+5 Run Blocking' },
      gold: { boost: 8, description: '+8 Run Blocking' },
      hof: { boost: 12, description: '+12 Run Blocking' },
    },
  },
  {
    id: 'pulling_guard',
    name: 'Pulling Guard',
    type: 'position',
    positions: [Position.LG, Position.RG],
    condition: 'Pulling on run plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Lead Block, +2 Speed' },
      silver: { boost: 5, description: '+5 Lead Block, +4 Speed' },
      gold: { boost: 8, description: '+8 Lead Block, +6 Speed' },
      hof: { boost: 12, description: '+12 Lead Block, +8 Speed' },
    },
  },

  // ==========================================
  // DEFENSIVE LINE BADGES
  // ==========================================
  {
    id: 'pass_rush_elite',
    name: 'Pass Rush Elite',
    type: 'position',
    positions: [Position.DE, Position.DT],
    condition: 'Pass plays (rushing the passer)',
    tiers: {
      bronze: { boost: 3, description: '+3 Power/Finesse Moves' },
      silver: { boost: 5, description: '+5 Power/Finesse Moves' },
      gold: { boost: 8, description: '+8 Power/Finesse Moves' },
      hof: { boost: 12, description: '+12 Power/Finesse Moves' },
    },
  },
  {
    id: 'run_stuffer_badge',
    name: 'Run Stuffer',
    type: 'position',
    positions: [Position.DE, Position.DT],
    condition: 'Run plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Block Shedding, +2 Tackling' },
      silver: { boost: 5, description: '+5 Block Shedding, +4 Tackling' },
      gold: { boost: 8, description: '+8 Block Shedding, +6 Tackling' },
      hof: { boost: 12, description: '+12 Block Shedding, +8 Tackling' },
    },
  },

  // ==========================================
  // LINEBACKER BADGES
  // ==========================================
  {
    id: 'coverage_lb_badge',
    name: 'Coverage Linebacker',
    type: 'position',
    positions: [Position.MLB, Position.OLB],
    condition: 'Pass coverage',
    tiers: {
      bronze: { boost: 3, description: '+3 Zone/Man Coverage' },
      silver: { boost: 5, description: '+5 Zone/Man Coverage' },
      gold: { boost: 8, description: '+8 Zone/Man Coverage' },
      hof: { boost: 12, description: '+12 Zone/Man Coverage' },
    },
  },
  {
    id: 'blitz_specialist',
    name: 'Blitz Specialist',
    type: 'position',
    positions: [Position.MLB, Position.OLB],
    condition: 'Blitzing plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Power/Finesse Moves' },
      silver: { boost: 5, description: '+5 Power/Finesse Moves' },
      gold: { boost: 8, description: '+8 Power/Finesse Moves' },
      hof: { boost: 12, description: '+12 Power/Finesse Moves' },
    },
  },
  {
    id: 'enforcer_badge',
    name: 'Enforcer',
    type: 'position',
    positions: [Position.MLB, Position.OLB, Position.SS],
    condition: 'Contact plays',
    tiers: {
      bronze: { boost: 3, description: '+3 Hit Power, +2 Tackling' },
      silver: { boost: 5, description: '+5 Hit Power, +4 Tackling' },
      gold: { boost: 8, description: '+8 Hit Power, +6 Tackling' },
      hof: { boost: 12, description: '+12 Hit Power, +8 Tackling' },
    },
  },

  // ==========================================
  // DEFENSIVE BACK BADGES
  // ==========================================
  {
    id: 'lockdown_corner',
    name: 'Lockdown Corner',
    type: 'position',
    positions: [Position.CB],
    condition: 'Man coverage',
    tiers: {
      bronze: { boost: 3, description: '+3 Man Coverage, +2 Press' },
      silver: { boost: 5, description: '+5 Man Coverage, +4 Press' },
      gold: { boost: 8, description: '+8 Man Coverage, +6 Press' },
      hof: { boost: 12, description: '+12 Man Coverage, +8 Press' },
    },
  },
  {
    id: 'ball_hawk_badge',
    name: 'Ball Hawk',
    type: 'position',
    positions: [Position.CB, Position.FS, Position.SS],
    condition: 'Ball in air',
    tiers: {
      bronze: { boost: 3, description: '+3 Catching, +2 Play Recognition' },
      silver: { boost: 5, description: '+5 Catching, +4 Play Recognition' },
      gold: { boost: 8, description: '+8 Catching, +6 Play Recognition' },
      hof: { boost: 12, description: '+12 Catching, +8 Play Recognition' },
    },
  },
  {
    id: 'deep_cover_safety',
    name: 'Deep Cover Safety',
    type: 'position',
    positions: [Position.FS, Position.SS],
    condition: 'Deep zone coverage',
    tiers: {
      bronze: { boost: 3, description: '+3 Zone Coverage, +2 Speed' },
      silver: { boost: 5, description: '+5 Zone Coverage, +4 Speed' },
      gold: { boost: 8, description: '+8 Zone Coverage, +6 Speed' },
      hof: { boost: 12, description: '+12 Zone Coverage, +8 Speed' },
    },
  },

  // ==========================================
  // SPECIAL TEAMS BADGES
  // ==========================================
  {
    id: 'ice_in_veins_k',
    name: 'Ice in Veins',
    type: 'position',
    positions: [Position.K],
    condition: 'Game-winning/tying kicks',
    tiers: {
      bronze: { boost: 3, description: '+3 Accuracy in clutch' },
      silver: { boost: 5, description: '+5 Accuracy in clutch' },
      gold: { boost: 8, description: '+8 Accuracy in clutch' },
      hof: { boost: 12, description: '+12 Accuracy in clutch' },
    },
  },
  {
    id: 'long_range_sniper',
    name: 'Long Range Sniper',
    type: 'position',
    positions: [Position.K],
    condition: '50+ yard field goals',
    tiers: {
      bronze: { boost: 3, description: '+3 Kick Power, +2 Accuracy' },
      silver: { boost: 5, description: '+5 Kick Power, +4 Accuracy' },
      gold: { boost: 8, description: '+8 Kick Power, +6 Accuracy' },
      hof: { boost: 12, description: '+12 Kick Power, +8 Accuracy' },
    },
  },
  {
    id: 'coffin_corner',
    name: 'Coffin Corner',
    type: 'position',
    positions: [Position.P],
    condition: 'Punts inside the 20',
    tiers: {
      bronze: { boost: 3, description: '+3 Punt Accuracy' },
      silver: { boost: 5, description: '+5 Punt Accuracy' },
      gold: { boost: 8, description: '+8 Punt Accuracy' },
      hof: { boost: 12, description: '+12 Punt Accuracy' },
    },
  },
];

/**
 * Index of badges by ID for quick lookup
 */
export const BADGES_BY_ID: Record<string, BadgeDefinition> = BADGES.reduce(
  (acc, badge) => {
    acc[badge.id] = badge;
    return acc;
  },
  {} as Record<string, BadgeDefinition>
);

/**
 * Universal badges (available to all positions)
 */
export const UNIVERSAL_BADGES: BadgeDefinition[] = BADGES.filter(
  (badge) => badge.type === 'universal'
);

/**
 * Get badges available for a specific position
 */
export function getBadgesForPosition(position: Position): BadgeDefinition[] {
  return BADGES.filter(
    (badge) =>
      badge.type === 'universal' ||
      (badge.positions && badge.positions.includes(position))
  );
}

/**
 * Badge tier weights for generation (how likely each tier is)
 */
export const BADGE_TIER_WEIGHTS: Record<BadgeTier, number> = {
  bronze: 60, // 60% chance
  silver: 25, // 25% chance
  gold: 12, // 12% chance
  hof: 3, // 3% chance
};

/**
 * Badge count expectations by OVR and experience
 */
export function getBadgeCount(ovr: number, experience: number): number {
  // Rookies (experience = 0) have no badges
  if (experience === 0) return 0;

  // Base count on OVR
  let count = 0;
  if (ovr >= 90) count = 3;
  else if (ovr >= 85) count = 2;
  else if (ovr >= 80) count = 1;
  else if (ovr >= 75) count = Math.random() < 0.5 ? 1 : 0;
  else count = 0;

  // Experience bonus (veterans get more badges)
  if (experience >= 10) count += 2;
  else if (experience >= 6) count += 1;

  // Cap at 6 badges max
  return Math.min(count, 6);
}
