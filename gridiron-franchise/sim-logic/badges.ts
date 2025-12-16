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
 * Badge tier boost ranges (per FINAL-badge-system.md)
 */
export const BADGE_TIER_RANGES: Record<BadgeTier, { min: number; max: number }> = {
  bronze: { min: 2, max: 5 },
  silver: { min: 4, max: 8 },
  gold: { min: 6, max: 12 },
  hof: { min: 9, max: 15 },
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
  {
    id: 'short_yardage_specialist',
    name: 'Short Yardage Specialist',
    type: 'position',
    positions: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT],
    condition: '3rd/4th down, 2 or fewer yards to go',
    tiers: {
      bronze: { boost: 5, description: '+5 Run Blocking, +3 Strength' },
      silver: { boost: 8, description: '+8 Run Blocking, +5 Strength' },
      gold: { boost: 12, description: '+12 Run Blocking, +8 Strength' },
      hof: { boost: 15, description: '+15 Run Blocking, +10 Strength' },
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
  {
    id: 'third_down_rusher',
    name: 'Third Down Rusher',
    type: 'position',
    positions: [Position.DE, Position.DT],
    condition: '3rd down pass rush',
    tiers: {
      bronze: { boost: 5, description: '+5 all pass rush attributes' },
      silver: { boost: 8, description: '+8 all pass rush attributes' },
      gold: { boost: 12, description: '+12 all pass rush attributes' },
      hof: { boost: 15, description: '+15 all pass rush attributes' },
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
    id: 'run_stopper_badge',
    name: 'Run Stopper',
    type: 'position',
    positions: [Position.MLB, Position.OLB],
    condition: 'Run defense',
    tiers: {
      bronze: { boost: 3, description: '+3 Tackling, +2 Block Shedding' },
      silver: { boost: 5, description: '+5 Tackling, +4 Block Shedding' },
      gold: { boost: 8, description: '+8 Tackling, +6 Block Shedding' },
      hof: { boost: 12, description: '+12 Tackling, +8 Block Shedding' },
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
    id: 'zone_defender',
    name: 'Zone Defender',
    type: 'position',
    positions: [Position.CB, Position.FS, Position.SS],
    condition: 'Zone coverage',
    tiers: {
      bronze: { boost: 3, description: '+3 Zone Coverage, +2 Play Recognition' },
      silver: { boost: 5, description: '+5 Zone Coverage, +4 Play Recognition' },
      gold: { boost: 8, description: '+8 Zone Coverage, +6 Play Recognition' },
      hof: { boost: 12, description: '+12 Zone Coverage, +8 Play Recognition' },
    },
  },
  {
    id: 'run_support',
    name: 'Run Support',
    type: 'position',
    positions: [Position.CB, Position.FS, Position.SS],
    condition: 'Run defense',
    tiers: {
      bronze: { boost: 3, description: '+3 Tackling, +2 Pursuit' },
      silver: { boost: 5, description: '+5 Tackling, +4 Pursuit' },
      gold: { boost: 8, description: '+8 Tackling, +6 Pursuit' },
      hof: { boost: 12, description: '+12 Tackling, +8 Pursuit' },
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
      bronze: { boost: 5, description: '+5 Kick Power' },
      silver: { boost: 8, description: '+8 Kick Power' },
      gold: { boost: 12, description: '+12 Kick Power' },
      hof: { boost: 15, description: '+15 Kick Power' },
    },
  },
  {
    id: 'short_range_specialist',
    name: 'Short Range Specialist',
    type: 'position',
    positions: [Position.K],
    condition: 'Field goals inside 40 yards',
    tiers: {
      bronze: { boost: 5, description: '+5 Kick Accuracy' },
      silver: { boost: 8, description: '+8 Kick Accuracy' },
      gold: { boost: 12, description: '+12 Kick Accuracy' },
      hof: { boost: 15, description: '+15 Kick Accuracy' },
    },
  },
  {
    id: 'coffin_corner',
    name: 'Coffin Corner',
    type: 'position',
    positions: [Position.P],
    condition: 'Punts inside the 20',
    tiers: {
      bronze: { boost: 5, description: '+5 Punt Accuracy' },
      silver: { boost: 8, description: '+8 Punt Accuracy' },
      gold: { boost: 12, description: '+12 Punt Accuracy' },
      hof: { boost: 15, description: '+15 Punt Accuracy' },
    },
  },
  {
    id: 'big_leg',
    name: 'Big Leg',
    type: 'position',
    positions: [Position.P],
    condition: 'All punts',
    tiers: {
      bronze: { boost: 5, description: '+5 Punt Power' },
      silver: { boost: 8, description: '+8 Punt Power' },
      gold: { boost: 12, description: '+12 Punt Power' },
      hof: { boost: 15, description: '+15 Punt Power' },
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

  // Badge count by OVR tier (per FINALS)
  // 95-99: 5-6, 90-94: 4-5, 85-89: 3-4, 80-84: 2-3, 75-79: 1-2, 70-74: 0-1, <70: 0
  let minBadges: number;
  let maxBadges: number;

  if (ovr >= 95) {
    minBadges = 5; maxBadges = 6;
  } else if (ovr >= 90) {
    minBadges = 4; maxBadges = 5;
  } else if (ovr >= 85) {
    minBadges = 3; maxBadges = 4;
  } else if (ovr >= 80) {
    minBadges = 2; maxBadges = 3;
  } else if (ovr >= 75) {
    minBadges = 1; maxBadges = 2;
  } else if (ovr >= 70) {
    minBadges = 0; maxBadges = 1;
  } else {
    return 0; // <70 OVR: no badges
  }

  // Experience bonus (veterans more likely to hit max)
  let experienceBonus = 0;
  if (experience >= 10) experienceBonus = 0.4;  // 40% more likely to hit max
  else if (experience >= 6) experienceBonus = 0.2;

  // Random within range, biased by experience
  const roll = Math.random() + experienceBonus;
  const count = roll < 0.5 ? minBadges : maxBadges;

  // Cap at 6 badges max per FINALS
  return Math.min(count, 6);
}
