/**
 * Badge Effects
 *
 * Calculate badge-based bonuses during simulation.
 * Implements badge effects from FINAL-badge-system.md.
 */

import { GameSituation, SimBadge, BADGE_TIER_VALUES } from './types';

// ============================================================================
// BADGE DEFINITIONS
// ============================================================================

interface BadgeEffect {
  id: string;
  name: string;
  condition: (situation: GameSituation) => boolean;
  tierBonuses: {
    bronze: number;
    silver: number;
    gold: number;
    hof: number;
  };
  description: string;
  category: 'universal' | 'qb' | 'rb' | 'wr' | 'te' | 'ol' | 'dl' | 'lb' | 'db' | 'st';
}

export const BADGE_EFFECTS: BadgeEffect[] = [
  // Universal Badges
  {
    id: 'clutch',
    name: 'Clutch',
    condition: (s) => s.isClutch,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Bonus in clutch situations',
    category: 'universal',
  },
  {
    id: 'prime_time',
    name: 'Prime Time',
    condition: (s) => s.isPrimeTime,
    tierBonuses: { bronze: 2, silver: 3, gold: 5, hof: 7 },
    description: 'Bonus in prime time games',
    category: 'universal',
  },
  {
    id: 'playoff_performer',
    name: 'Playoff Performer',
    condition: (s) => s.isPlayoffs,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 10 },
    description: 'Bonus in playoff games',
    category: 'universal',
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    condition: (s) => s.isTrailing && s.quarter === 4,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Bonus when trailing in Q4',
    category: 'universal',
  },
  {
    id: 'fourth_quarter_closer',
    name: '4th Quarter Closer',
    condition: (s) => s.isLeading && s.quarter === 4,
    tierBonuses: { bronze: 3, silver: 5, gold: 7, hof: 10 },
    description: 'Bonus when leading in Q4',
    category: 'universal',
  },

  // QB Badges
  {
    id: 'red_zone_qb',
    name: 'Red Zone QB',
    condition: (s) => s.inRedZone,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Passing bonus in red zone',
    category: 'qb',
  },
  {
    id: 'deep_ball_threat',
    name: 'Deep Ball Threat',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Deep accuracy bonus',
    category: 'qb',
  },
  {
    id: 'pocket_presence',
    name: 'Pocket Presence',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Throw under pressure bonus',
    category: 'qb',
  },
  {
    id: 'no_huddle_specialist',
    name: 'No Huddle Specialist',
    condition: (s) => s.clock <= 120 && s.quarter >= 3,
    tierBonuses: { bronze: 2, silver: 4, gold: 6, hof: 8 },
    description: 'Hurry-up offense bonus',
    category: 'qb',
  },

  // RB Badges
  {
    id: 'red_zone_back',
    name: 'Red Zone Back',
    condition: (s) => s.inRedZone,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Rushing bonus in red zone',
    category: 'rb',
  },
  {
    id: 'goal_line_back',
    name: 'Goal Line Back',
    condition: (s) => s.inGoalLine,
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Trucking bonus at goal line',
    category: 'rb',
  },
  {
    id: 'open_field_runner',
    name: 'Open Field Runner',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Speed bonus in open field',
    category: 'rb',
  },
  {
    id: 'third_down_back',
    name: 'Third Down Back',
    condition: (s) => s.down === 3,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Catching bonus on third down',
    category: 'rb',
  },

  // WR Badges
  {
    id: 'deep_threat',
    name: 'Deep Threat',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Speed bonus on deep routes',
    category: 'wr',
  },
  {
    id: 'possession_receiver',
    name: 'Possession Receiver',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Catch in traffic bonus',
    category: 'wr',
  },
  {
    id: 'red_zone_threat',
    name: 'Red Zone Threat',
    condition: (s) => s.inRedZone,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Catching bonus in red zone',
    category: 'wr',
  },

  // Defense Badges
  {
    id: 'pass_rusher',
    name: 'Pass Rusher',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Pass rush bonus',
    category: 'dl',
  },
  {
    id: 'shutdown_corner',
    name: 'Shutdown Corner',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Man coverage bonus',
    category: 'db',
  },
  {
    id: 'ball_hawk_badge',
    name: 'Ball Hawk',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'INT chance bonus',
    category: 'db',
  },
  {
    id: 'run_stuffer',
    name: 'Run Stuffer',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Run defense bonus',
    category: 'lb',
  },

  // Special Teams Badges
  {
    id: 'clutch_kicker',
    name: 'Clutch Kicker',
    condition: (s) => s.isClutch,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'FG accuracy in clutch',
    category: 'st',
  },

  // === MISSING BADGES FROM badges.ts ===

  // Universal - Home/Away/Weather
  {
    id: 'home_field_hero',
    name: 'Home Field Hero',
    condition: (s) => s.isHome,
    tierBonuses: { bronze: 2, silver: 3, gold: 5, hof: 7 },
    description: 'Bonus in home games',
    category: 'universal',
  },
  {
    id: 'road_warrior',
    name: 'Road Warrior',
    condition: (s) => !s.isHome,
    tierBonuses: { bronze: 0, silver: 1, gold: 3, hof: 5 },
    description: 'Negates away penalty / bonus in away games',
    category: 'universal',
  },
  {
    id: 'weather_proof',
    name: 'Weather Proof',
    condition: (s) => s.weather !== 'clear',
    tierBonuses: { bronze: 0, silver: 0, gold: 2, hof: 5 },
    description: 'Reduces/negates weather penalty',
    category: 'universal',
  },

  // Universal - Situational
  {
    id: 'division_rival_killer',
    name: 'Division Rival Killer',
    condition: (s) => s.isDivisionGame,
    tierBonuses: { bronze: 2, silver: 4, gold: 6, hof: 8 },
    description: 'Bonus vs division rivals',
    category: 'universal',
  },
  {
    id: 'big_game_player',
    name: 'Big Game Player',
    condition: (s) => s.isPlayoffs,
    tierBonuses: { bronze: 3, silver: 5, gold: 7, hof: 10 },
    description: 'Bonus in playoff-implication games',
    category: 'universal',
  },
  {
    id: 'underdog_mentality',
    name: 'Underdog Mentality',
    condition: (s) => s.opponentOvr > 80, // Team is underdog vs higher OVR opponent
    tierBonuses: { bronze: 2, silver: 4, gold: 6, hof: 8 },
    description: 'Bonus when team is underdog',
    category: 'universal',
  },
  {
    id: 'giant_slayer',
    name: 'Giant Slayer',
    condition: (s) => s.opponentOvr >= 85,
    tierBonuses: { bronze: 3, silver: 5, gold: 7, hof: 10 },
    description: 'Bonus vs 85+ OVR opponents',
    category: 'universal',
  },

  // WR Additional
  {
    id: 'slot_specialist',
    name: 'Slot Specialist',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Route running bonus in slot',
    category: 'wr',
  },

  // TE Badges
  {
    id: 'red_zone_weapon',
    name: 'Red Zone Weapon',
    condition: (s) => s.inRedZone,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'TE catching bonus in red zone',
    category: 'te',
  },
  {
    id: 'seam_router',
    name: 'Seam Router',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Medium route running bonus',
    category: 'te',
  },
  {
    id: 'run_blocking_te',
    name: 'Run Blocking TE',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Run blocking bonus',
    category: 'te',
  },

  // OL Badges
  {
    id: 'pass_protector',
    name: 'Pass Protector',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Pass blocking bonus',
    category: 'ol',
  },
  {
    id: 'road_grader',
    name: 'Road Grader',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Run blocking bonus',
    category: 'ol',
  },
  {
    id: 'pulling_guard',
    name: 'Pulling Guard',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Lead blocking bonus on pulls',
    category: 'ol',
  },
  {
    id: 'short_yardage_specialist',
    name: 'Short Yardage Specialist',
    condition: (s) => (s.down === 3 || s.down === 4) && s.yardsToGo <= 2,
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Run blocking bonus in short yardage',
    category: 'ol',
  },

  // DL Additional
  {
    id: 'pass_rush_elite',
    name: 'Pass Rush Elite',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Pass rush move bonus',
    category: 'dl',
  },
  {
    id: 'third_down_rusher',
    name: 'Third Down Rusher',
    condition: (s) => s.down === 3,
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Pass rush bonus on 3rd down',
    category: 'dl',
  },

  // LB Additional
  {
    id: 'coverage_lb',
    name: 'Coverage Linebacker',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Coverage bonus',
    category: 'lb',
  },
  {
    id: 'blitz_specialist',
    name: 'Blitz Specialist',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Pass rush bonus when blitzing',
    category: 'lb',
  },
  {
    id: 'run_stopper_lb',
    name: 'Run Stopper',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Tackling/block shed bonus',
    category: 'lb',
  },

  // DB Additional
  {
    id: 'lockdown_corner',
    name: 'Lockdown Corner',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Man coverage bonus',
    category: 'db',
  },
  {
    id: 'zone_defender',
    name: 'Zone Defender',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Zone coverage bonus',
    category: 'db',
  },
  {
    id: 'run_support',
    name: 'Run Support',
    condition: () => true,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Tackling bonus in run defense',
    category: 'db',
  },

  // Kicker/Punter Additional
  {
    id: 'ice_in_veins_k',
    name: 'Ice in Veins',
    condition: (s) => s.isClutch,
    tierBonuses: { bronze: 3, silver: 5, gold: 8, hof: 12 },
    description: 'Accuracy in clutch kicks',
    category: 'st',
  },
  {
    id: 'long_range_sniper',
    name: 'Long Range Sniper',
    condition: () => true, // 50+ yard FGs
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Kick power for 50+ yard FGs',
    category: 'st',
  },
  {
    id: 'short_range_specialist',
    name: 'Short Range Specialist',
    condition: () => true, // Inside 40 yard FGs
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Accuracy for inside 40 FGs',
    category: 'st',
  },
  {
    id: 'coffin_corner',
    name: 'Coffin Corner',
    condition: () => true,
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Punt accuracy inside 20',
    category: 'st',
  },
  {
    id: 'big_leg',
    name: 'Big Leg',
    condition: () => true,
    tierBonuses: { bronze: 5, silver: 8, gold: 12, hof: 15 },
    description: 'Punt power bonus',
    category: 'st',
  },
];

// ============================================================================
// BADGE BONUS CALCULATION
// ============================================================================

/**
 * Get the bonus value for a badge tier
 */
export function getBadgeTierValue(tier: string): number {
  return BADGE_TIER_VALUES[tier.toLowerCase()] || 0;
}

/**
 * Get bonus from a specific badge given the situation
 */
export function getBadgeBonus(
  badgeName: string,
  tier: 'bronze' | 'silver' | 'gold' | 'hof',
  situation: GameSituation
): number {
  const badgeDef = BADGE_EFFECTS.find(
    (b) => b.id === badgeName || b.name.toLowerCase() === badgeName.toLowerCase()
  );

  if (!badgeDef) return 0;
  if (!badgeDef.condition(situation)) return 0;

  return badgeDef.tierBonuses[tier];
}

/**
 * Get total badge bonus for a player given the situation
 */
export function getPlayerBadgeBonus(
  badges: SimBadge[],
  playerId: string,
  situation: GameSituation
): number {
  let totalBonus = 0;

  const playerBadges = badges.filter((b) => b.playerId === playerId);

  for (const badge of playerBadges) {
    const bonus = getBadgeBonus(badge.name, badge.tier, situation);
    totalBonus += bonus;
  }

  return totalBonus;
}

/**
 * Get total badge bonus for a team (scaled for team-wide effect)
 */
export function getTeamBadgeBonus(
  badges: SimBadge[],
  situation: GameSituation
): number {
  let totalBonus = 0;
  const processedPlayers = new Set<string>();

  for (const badge of badges) {
    // Only count each player's best active badge
    if (processedPlayers.has(badge.playerId)) continue;

    const bonus = getBadgeBonus(badge.name, badge.tier, situation);
    if (bonus > 0) {
      totalBonus += bonus * 0.15; // Scaled for team effect
      processedPlayers.add(badge.playerId);
    }
  }

  return Math.round(totalBonus);
}

/**
 * Check if a player has a specific badge
 */
export function hasBadge(
  badges: SimBadge[],
  playerId: string,
  badgeName: string
): SimBadge | undefined {
  return badges.find(
    (b) =>
      b.playerId === playerId &&
      (b.name === badgeName || b.name.toLowerCase() === badgeName.toLowerCase())
  );
}

/**
 * Get active badges for UI display
 */
export function getActiveBadges(
  badges: SimBadge[],
  situation: GameSituation
): { playerId: string; badgeName: string; tier: string; bonus: number }[] {
  const active: { playerId: string; badgeName: string; tier: string; bonus: number }[] = [];

  for (const badge of badges) {
    const bonus = getBadgeBonus(badge.name, badge.tier, situation);
    if (bonus > 0) {
      active.push({
        playerId: badge.playerId,
        badgeName: badge.name,
        tier: badge.tier,
        bonus,
      });
    }
  }

  return active;
}

/**
 * Get situational bonuses for play calculation
 */
export function getPlayBonuses(
  badges: SimBadge[],
  playerId: string,
  situation: GameSituation,
  playType: 'pass' | 'run' | 'receive' | 'block' | 'rush' | 'cover' | 'kick'
): number {
  let bonus = 0;
  const playerBadges = badges.filter((b) => b.playerId === playerId);

  for (const badge of playerBadges) {
    const badgeDef = BADGE_EFFECTS.find(
      (b) => b.id === badge.name || b.name.toLowerCase() === badge.name.toLowerCase()
    );

    if (!badgeDef) continue;
    if (!badgeDef.condition(situation)) continue;

    // Check if badge applies to this play type
    const categoryMatch =
      badgeDef.category === 'universal' ||
      (playType === 'pass' && badgeDef.category === 'qb') ||
      (playType === 'run' && badgeDef.category === 'rb') ||
      (playType === 'receive' && (badgeDef.category === 'wr' || badgeDef.category === 'te')) ||
      (playType === 'block' && badgeDef.category === 'ol') ||
      (playType === 'rush' && badgeDef.category === 'dl') ||
      (playType === 'cover' && (badgeDef.category === 'db' || badgeDef.category === 'lb')) ||
      (playType === 'kick' && badgeDef.category === 'st');

    if (categoryMatch) {
      bonus += badgeDef.tierBonuses[badge.tier];
    }
  }

  return bonus;
}
