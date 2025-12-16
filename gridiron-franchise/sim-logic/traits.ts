/**
 * Traits System - Complete trait definitions with categories, effects, conflicts, and rarity
 *
 * Traits represent player personality, character, and intangibles.
 * They affect gameplay, development, team chemistry, contracts, and create unique player stories.
 *
 * Source: traits-system.md
 */

import { TraitCategory, TraitRarity, TraitEffect } from '../types';

export interface TraitDefinition {
  id: string;
  name: string;
  category: TraitCategory;
  rarity: TraitRarity;
  rarityWeight: number; // Percentage chance (higher = more common)
  description: string;
  conflicts: string[]; // Trait IDs that conflict
  effects: TraitEffect[];
  requirements?: string; // Optional requirements to have this trait
}

/**
 * All trait definitions organized by category
 * Total: 46 traits across 7 categories
 */
export const TRAITS: TraitDefinition[] = [
  // ==========================================
  // CATEGORY 1: LEADERSHIP & LOCKER ROOM (6 traits)
  // ==========================================
  {
    id: 'vocal_leader',
    name: 'Vocal Leader',
    category: TraitCategory.Leadership,
    rarity: 'uncommon',
    rarityWeight: 15,
    description: 'Natural leader who rallies teammates and mentors young players',
    conflicts: ['quiet', 'diva'],
    effects: [
      { type: 'team_morale', value: 15, description: '+15% team morale' },
      { type: 'team_chemistry', value: 10, description: '+10% chemistry' },
      { type: 'rookie_xp', value: 5, description: '+5% XP to rookies' },
    ],
  },
  {
    id: 'veteran_mentor',
    name: 'Veteran Mentor',
    category: TraitCategory.Leadership,
    rarity: 'rare',
    rarityWeight: 8,
    description: 'Experienced player who develops young talent',
    conflicts: ['selfish', 'diva'],
    requirements: '6+ years experience',
    effects: [
      { type: 'young_player_dev', value: 1, description: '+1 development tier to 2 young players' },
      { type: 'young_player_morale', value: 10, description: '+10% morale for players under 25' },
    ],
  },
  {
    id: 'team_first',
    name: 'Team First',
    category: TraitCategory.Leadership,
    rarity: 'uncommon',
    rarityWeight: 12,
    description: 'Puts team success above individual glory',
    conflicts: ['diva', 'selfish', 'money_motivated'],
    effects: [
      { type: 'team_chemistry', value: 20, description: '+20% team chemistry' },
      { type: 'contract_demand', value: -5, description: '-5% contract demands' },
    ],
  },
  {
    id: 'diva',
    name: 'Diva',
    category: TraitCategory.Leadership,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'High-maintenance star who demands attention',
    conflicts: ['team_first', 'vocal_leader'],
    effects: [
      { type: 'team_chemistry', value: -15, description: '-15% chemistry if not featured' },
      { type: 'contract_demand', value: 20, description: '+20% contract demands' },
      { type: 'attributes_when_featured', value: 3, description: '+3 all attributes when getting 10+ touches' },
    ],
  },
  {
    id: 'quiet',
    name: 'Quiet/Reserved',
    category: TraitCategory.Leadership,
    rarity: 'common',
    rarityWeight: 25,
    description: 'Keeps to themselves, neutral locker room presence',
    conflicts: ['vocal_leader', 'diva'],
    effects: [
      { type: 'team_morale', value: 0, description: 'Neutral morale impact' },
    ],
  },
  {
    id: 'locker_room_cancer',
    name: 'Locker Room Cancer',
    category: TraitCategory.Leadership,
    rarity: 'very_rare',
    rarityWeight: 2,
    description: 'Toxic presence that destroys team chemistry',
    conflicts: ['vocal_leader', 'veteran_mentor', 'team_first'],
    effects: [
      { type: 'team_morale', value: -25, description: '-25% team morale' },
      { type: 'team_chemistry', value: -20, description: '-20% chemistry' },
    ],
  },

  // ==========================================
  // CATEGORY 2: WORK ETHIC & DEVELOPMENT (7 traits)
  // ==========================================
  {
    id: 'gym_rat',
    name: 'Gym Rat',
    category: TraitCategory.WorkEthic,
    rarity: 'uncommon',
    rarityWeight: 15,
    description: 'Lives in the weight room, constantly improving',
    conflicts: ['lazy'],
    effects: [
      { type: 'practice_xp', value: 50, description: '+50% XP from practice' },
      { type: 'physical_growth', value: 1, description: '+1 to physical attributes per season' },
      { type: 'regression_rate', value: -25, description: 'Slower regression (age 30+)' },
    ],
  },
  {
    id: 'film_junkie',
    name: 'Film Junkie',
    category: TraitCategory.WorkEthic,
    rarity: 'uncommon',
    rarityWeight: 12,
    description: 'Studies film obsessively, masters mental game',
    conflicts: ['lazy'],
    effects: [
      { type: 'mental_xp', value: 50, description: '+50% XP to Awareness, Play Recognition' },
      { type: 'playbook_learning', value: 100, description: 'Learns playbook 2x faster' },
    ],
  },
  {
    id: 'focused',
    name: 'Focused/Driven',
    category: TraitCategory.WorkEthic,
    rarity: 'uncommon',
    rarityWeight: 15,
    description: 'Intensely focused on improving',
    conflicts: ['distracted', 'lazy'],
    effects: [
      { type: 'overall_xp', value: 25, description: '+25% overall XP gain' },
    ],
  },
  {
    id: 'lazy',
    name: 'Lazy',
    category: TraitCategory.WorkEthic,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'Coasts on natural talent, minimal effort',
    conflicts: ['gym_rat', 'film_junkie', 'focused'],
    effects: [
      { type: 'overall_xp', value: -50, description: '-50% XP gain' },
      { type: 'regression_rate', value: 25, description: 'Faster regression (age 28+)' },
    ],
  },
  {
    id: 'early_bloomer',
    name: 'Early Bloomer',
    category: TraitCategory.WorkEthic,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Develops quickly, peaks early',
    conflicts: ['late_bloomer'],
    effects: [
      { type: 'young_dev_rate', value: 25, description: '+25% development ages 21-24' },
      { type: 'starting_ovr', value: 2, description: '+2 to starting OVR' },
      { type: 'peak_age', value: -2, description: 'Peaks at 25 instead of 27' },
    ],
  },
  {
    id: 'late_bloomer',
    name: 'Late Bloomer',
    category: TraitCategory.WorkEthic,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Takes time to develop, maintains longer',
    conflicts: ['early_bloomer'],
    effects: [
      { type: 'young_dev_rate', value: -25, description: '-25% development when young' },
      { type: 'starting_ovr', value: -2, description: '-2 to starting OVR' },
      { type: 'peak_age', value: 2, description: 'Peaks at 29 instead of 27' },
    ],
  },
  {
    id: 'winners_mentality',
    name: "Winner's Mentality",
    category: TraitCategory.WorkEthic,
    rarity: 'uncommon',
    rarityWeight: 12,
    description: 'Thrives when team is winning',
    conflicts: ['selfish'],
    effects: [
      { type: 'winning_team_xp', value: 10, description: '+10% XP when team is winning' },
      { type: 'winning_team_attributes', value: 5, description: '+5 all attributes on winning teams' },
    ],
  },

  // ==========================================
  // CATEGORY 3: ON-FIELD MENTALITY (7 traits)
  // ==========================================
  {
    id: 'hot_head',
    name: 'Hot Head',
    category: TraitCategory.OnField,
    rarity: 'rare',
    rarityWeight: 8,
    description: 'Plays with emotion, sometimes too much',
    conflicts: ['cool_under_pressure', 'disciplined'],
    effects: [
      { type: 'penalty_chance', value: 50, description: '+50% penalty chance' },
      { type: 'hit_power', value: 2, description: '+2 Hit Power, Strength' },
      { type: 'awareness_pressure', value: -5, description: '-5 Awareness in pressure' },
    ],
  },
  {
    id: 'cool_under_pressure',
    name: 'Cool Under Pressure',
    category: TraitCategory.OnField,
    rarity: 'rare',
    rarityWeight: 8,
    description: 'Stays calm in pressure situations',
    conflicts: ['hot_head', 'chokes_under_pressure'],
    effects: [
      { type: 'clutch_attributes', value: 5, description: '+5 all attributes in clutch moments' },
    ],
  },
  {
    id: 'showboat',
    name: 'Showboat/Celebrate',
    category: TraitCategory.OnField,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Loves to celebrate and perform',
    conflicts: ['business_like'],
    effects: [
      { type: 'penalty_chance', value: 10, description: '+10% taunting penalty chance' },
      { type: 'team_morale_winning', value: 5, description: '+5% morale when winning' },
      { type: 'team_morale_losing', value: -5, description: '-5% morale when losing' },
    ],
  },
  {
    id: 'business_like',
    name: 'Business-Like/Professional',
    category: TraitCategory.OnField,
    rarity: 'common',
    rarityWeight: 20,
    description: 'All business, no drama',
    conflicts: ['showboat', 'diva'],
    effects: [
      { type: 'penalty_chance', value: -25, description: 'Low penalty chance' },
      { type: 'consistency', value: 10, description: '+10% performance consistency' },
    ],
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    category: TraitCategory.OnField,
    rarity: 'common',
    rarityWeight: 15,
    description: 'Takes risks for big plays',
    conflicts: ['conservative'],
    effects: [
      { type: 'big_play_chance', value: 10, description: '+10% big play chance' },
      { type: 'turnover_chance', value: 10, description: '+10% turnover chance' },
    ],
  },
  {
    id: 'conservative',
    name: 'Conservative',
    category: TraitCategory.OnField,
    rarity: 'common',
    rarityWeight: 15,
    description: 'Plays it safe and smart',
    conflicts: ['aggressive'],
    effects: [
      { type: 'big_play_chance', value: -10, description: '-10% big play chance' },
      { type: 'turnover_chance', value: -10, description: '-10% turnover chance' },
    ],
  },
  {
    id: 'trash_talker',
    name: 'Trash Talker',
    category: TraitCategory.OnField,
    rarity: 'uncommon',
    rarityWeight: 8,
    description: 'Gets in opponents heads',
    conflicts: ['business_like', 'quiet'],
    effects: [
      { type: 'penalty_chance', value: 20, description: '+20% personal foul chance' },
      { type: 'opponent_penalty_draw', value: 15, description: '+15% chance to draw opponent penalties' },
    ],
  },

  // ==========================================
  // CATEGORY 4: DURABILITY & HEALTH (7 traits)
  // ==========================================
  {
    id: 'iron_man',
    name: 'Iron Man',
    category: TraitCategory.Durability,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'Almost never gets injured',
    conflicts: ['injury_prone', 'fragile'],
    effects: [
      { type: 'injury_chance', value: -75, description: '-75% injury chance' },
      { type: 'recovery_speed', value: 50, description: '+50% faster recovery' },
    ],
  },
  {
    id: 'injury_prone',
    name: 'Injury Prone',
    category: TraitCategory.Durability,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Frequently misses time with injuries',
    conflicts: ['iron_man', 'durable'],
    effects: [
      { type: 'injury_chance', value: 75, description: '+75% injury chance' },
      { type: 'recovery_speed', value: -30, description: '-30% recovery speed' },
    ],
  },
  {
    id: 'slow_healer',
    name: 'Slow Healer',
    category: TraitCategory.Durability,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Takes longer to recover from injuries',
    conflicts: ['fast_healer'],
    effects: [
      { type: 'recovery_speed', value: -50, description: '-50% recovery speed' },
    ],
  },
  {
    id: 'fast_healer',
    name: 'Fast Healer',
    category: TraitCategory.Durability,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Recovers quickly from injuries',
    conflicts: ['slow_healer'],
    effects: [
      { type: 'recovery_speed', value: 50, description: '+50% recovery speed' },
    ],
  },
  {
    id: 'plays_through_pain',
    name: 'Plays Through Pain',
    category: TraitCategory.Durability,
    rarity: 'uncommon',
    rarityWeight: 8,
    description: 'Guts it out when injured',
    conflicts: [],
    effects: [
      { type: 'injured_performance', value: -5, description: '-5 OVR when playing injured' },
      { type: 'team_morale', value: 10, description: '+10% team morale (toughness)' },
    ],
  },
  {
    id: 'durable',
    name: 'Durable',
    category: TraitCategory.Durability,
    rarity: 'common',
    rarityWeight: 15,
    description: 'Built tough, resists injury',
    conflicts: ['fragile', 'injury_prone'],
    effects: [
      { type: 'injury_chance', value: -40, description: '-40% injury chance' },
    ],
  },
  {
    id: 'fragile',
    name: 'Fragile',
    category: TraitCategory.Durability,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Susceptible to injuries',
    conflicts: ['durable', 'iron_man'],
    effects: [
      { type: 'injury_chance', value: 40, description: '+40% injury chance' },
    ],
  },

  // ==========================================
  // CATEGORY 5: CONTRACT & LOYALTY (6 traits)
  // ==========================================
  {
    id: 'money_motivated',
    name: 'Money Motivated',
    category: TraitCategory.Contract,
    rarity: 'common',
    rarityWeight: 20,
    description: 'Chases the biggest contract',
    conflicts: ['team_first', 'loyal', 'ring_chaser'],
    effects: [
      { type: 'contract_demand', value: 30, description: '+30% contract demands' },
    ],
  },
  {
    id: 'ring_chaser',
    name: 'Ring Chaser',
    category: TraitCategory.Contract,
    rarity: 'uncommon',
    rarityWeight: 8,
    description: 'Will take less money for a chance at a championship',
    conflicts: ['money_motivated'],
    requirements: 'Usually veteran (30+ years old)',
    effects: [
      { type: 'contract_demand_contender', value: -30, description: '-20-40% pay cut to join contender' },
      { type: 'team_morale_winning', value: 15, description: '+15% morale on winning teams' },
    ],
  },
  {
    id: 'loyal',
    name: 'Hometown Hero/Loyal',
    category: TraitCategory.Contract,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Stays with their team through thick and thin',
    conflicts: ['mercenary', 'money_motivated'],
    effects: [
      { type: 'contract_demand_current', value: -20, description: '-20% contract demands with current team' },
      { type: 'fan_appeal', value: 20, description: '+20% fan appeal in home city' },
    ],
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    category: TraitCategory.Contract,
    rarity: 'common',
    rarityWeight: 15,
    description: 'No loyalty, always looking for the next deal',
    conflicts: ['loyal'],
    effects: [
      { type: 'contract_demand', value: 10, description: '+10% contract demands' },
      { type: 'trade_ease', value: 25, description: 'Easy to trade' },
    ],
  },
  {
    id: 'team_player_contract',
    name: 'Team Player (Contract)',
    category: TraitCategory.Contract,
    rarity: 'uncommon',
    rarityWeight: 12,
    description: 'Willing to restructure for the team',
    conflicts: ['money_motivated', 'holdout_risk'],
    effects: [
      { type: 'contract_demand', value: -15, description: '-15% contract demands' },
      { type: 'restructure_willingness', value: 50, description: '+50% chance to accept restructure' },
    ],
  },
  {
    id: 'holdout_risk',
    name: 'Holdout Risk',
    category: TraitCategory.Contract,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'May refuse to play without a new contract',
    conflicts: ['team_player_contract'],
    effects: [
      { type: 'contract_demand', value: 20, description: '+20% contract demands' },
      { type: 'team_chemistry_holdout', value: -20, description: '-20% chemistry during holdout' },
    ],
  },

  // ==========================================
  // CATEGORY 6: CLUTCH & PRESSURE (6 traits)
  // ==========================================
  {
    id: 'ice_in_veins',
    name: 'Ice in Veins',
    category: TraitCategory.Clutch,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'Legendary clutch performer',
    conflicts: ['chokes_under_pressure'],
    effects: [
      { type: 'final_minutes_attributes', value: 10, description: '+10 all attributes in final 2 minutes' },
      { type: 'playoff_attributes', value: 15, description: '+15 all attributes in playoff games' },
    ],
  },
  {
    id: 'chokes_under_pressure',
    name: 'Chokes Under Pressure',
    category: TraitCategory.Clutch,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'Struggles in pressure situations',
    conflicts: ['ice_in_veins', 'cool_under_pressure'],
    effects: [
      { type: 'final_minutes_attributes', value: -10, description: '-10 all attributes in final 2 minutes' },
      { type: 'playoff_attributes', value: -15, description: '-15 all attributes in playoff games' },
    ],
  },
  {
    id: 'prime_time_player',
    name: 'Prime Time Player',
    category: TraitCategory.Clutch,
    rarity: 'uncommon',
    rarityWeight: 8,
    description: 'Raises game for big moments',
    conflicts: ['stage_fright'],
    effects: [
      { type: 'primetime_ovr', value: 5, description: '+5 OVR in nationally televised games' },
    ],
  },
  {
    id: 'stage_fright',
    name: 'Stage Fright',
    category: TraitCategory.Clutch,
    rarity: 'rare',
    rarityWeight: 4,
    description: 'Uncomfortable with spotlight',
    conflicts: ['prime_time_player', 'ice_in_veins'],
    effects: [
      { type: 'primetime_ovr', value: -5, description: '-5 OVR in nationally televised games' },
      { type: 'playoff_attributes', value: -5, description: '-5 OVR in playoff games' },
    ],
  },
  {
    id: 'comeback_artist',
    name: 'Comeback Artist',
    category: TraitCategory.Clutch,
    rarity: 'rare',
    rarityWeight: 6,
    description: 'Thrives when team is behind',
    conflicts: [],
    effects: [
      { type: 'trailing_4q_attributes', value: 8, description: '+8 all attributes when trailing in 4th quarter' },
    ],
  },
  {
    id: 'closer',
    name: 'Closer',
    category: TraitCategory.Clutch,
    rarity: 'uncommon',
    rarityWeight: 8,
    description: 'Protects the lead in crunch time',
    conflicts: [],
    effects: [
      { type: 'protecting_lead_attributes', value: 5, description: '+5 all attributes when protecting lead in 4th quarter' },
      { type: 'turnover_chance_ahead', value: -20, description: '-20% turnover chance when ahead' },
    ],
  },

  // ==========================================
  // CATEGORY 7: CHARACTER & DISCIPLINE (7 traits)
  // ==========================================
  {
    id: 'high_character',
    name: 'High Character',
    category: TraitCategory.Character,
    rarity: 'common',
    rarityWeight: 20,
    description: 'Model citizen, great person',
    conflicts: ['character_concerns'],
    effects: [
      { type: 'team_morale', value: 10, description: '+10% team morale' },
      { type: 'fan_appeal', value: 10, description: '+10% fan appeal' },
      { type: 'suspension_risk', value: 0, description: '0% suspension risk' },
    ],
  },
  {
    id: 'character_concerns',
    name: 'Character Concerns',
    category: TraitCategory.Character,
    rarity: 'rare',
    rarityWeight: 5,
    description: 'Red flags off the field',
    conflicts: ['high_character'],
    effects: [
      { type: 'team_morale', value: -10, description: '-10% team morale' },
      { type: 'fan_appeal', value: -15, description: '-15% fan appeal' },
      { type: 'suspension_risk', value: 20, description: '20% suspension chance per season' },
    ],
  },
  {
    id: 'disciplined',
    name: 'Disciplined',
    category: TraitCategory.Character,
    rarity: 'common',
    rarityWeight: 15,
    description: 'Follows the rules, avoids mistakes',
    conflicts: ['undisciplined', 'hot_head'],
    effects: [
      { type: 'penalty_chance', value: -75, description: '-75% penalty chance' },
      { type: 'mental_errors', value: -50, description: '-50% mental errors' },
    ],
  },
  {
    id: 'undisciplined',
    name: 'Undisciplined',
    category: TraitCategory.Character,
    rarity: 'uncommon',
    rarityWeight: 10,
    description: 'Plays loose, sometimes too loose',
    conflicts: ['disciplined'],
    effects: [
      { type: 'penalty_chance', value: 75, description: '+75% penalty chance' },
      { type: 'mental_errors', value: 50, description: '+50% mental errors' },
    ],
  },
  {
    id: 'high_football_iq',
    name: 'High Football IQ',
    category: TraitCategory.Character,
    rarity: 'uncommon',
    rarityWeight: 12,
    description: 'Genius-level football mind',
    conflicts: ['low_football_iq'],
    effects: [
      { type: 'mental_xp', value: 10, description: '+10% XP to mental attributes' },
      { type: 'awareness_bonus', value: 3, description: '+3 Awareness, Play Recognition' },
    ],
  },
  {
    id: 'low_football_iq',
    name: 'Low Football IQ',
    category: TraitCategory.Character,
    rarity: 'rare',
    rarityWeight: 8,
    description: 'Struggles with mental side of game',
    conflicts: ['high_football_iq'],
    effects: [
      { type: 'mental_xp', value: -10, description: '-10% XP to mental attributes' },
      { type: 'awareness_penalty', value: -3, description: '-3 Awareness, Play Recognition' },
    ],
  },
  {
    id: 'football_genius',
    name: 'Football Genius',
    category: TraitCategory.Character,
    rarity: 'very_rare',
    rarityWeight: 2,
    description: 'Elite mental abilities, sees the game differently',
    conflicts: ['low_football_iq'],
    requirements: '90+ Awareness + Film Junkie trait',
    effects: [
      { type: 'mental_xp', value: 20, description: '+20% XP to mental attributes' },
      { type: 'scheme_read', value: 25, description: '+25% scheme recognition' },
    ],
  },
];

/**
 * Index of traits by ID for quick lookup
 */
export const TRAITS_BY_ID: Record<string, TraitDefinition> = TRAITS.reduce(
  (acc, trait) => {
    acc[trait.id] = trait;
    return acc;
  },
  {} as Record<string, TraitDefinition>
);

/**
 * Traits grouped by category
 */
export const TRAITS_BY_CATEGORY: Record<TraitCategory, TraitDefinition[]> = TRAITS.reduce(
  (acc, trait) => {
    if (!acc[trait.category]) {
      acc[trait.category] = [];
    }
    acc[trait.category].push(trait);
    return acc;
  },
  {} as Record<TraitCategory, TraitDefinition[]>
);

/**
 * Traits grouped by rarity
 */
export const TRAITS_BY_RARITY: Record<TraitRarity, TraitDefinition[]> = TRAITS.reduce(
  (acc, trait) => {
    if (!acc[trait.rarity]) {
      acc[trait.rarity] = [];
    }
    acc[trait.rarity].push(trait);
    return acc;
  },
  {} as Record<TraitRarity, TraitDefinition[]>
);

/**
 * Positive traits (generally beneficial)
 */
export const POSITIVE_TRAITS: string[] = [
  'vocal_leader',
  'veteran_mentor',
  'team_first',
  'gym_rat',
  'film_junkie',
  'focused',
  'winners_mentality',
  'cool_under_pressure',
  'business_like',
  'iron_man',
  'fast_healer',
  'plays_through_pain',
  'durable',
  'loyal',
  'team_player_contract',
  'ice_in_veins',
  'prime_time_player',
  'comeback_artist',
  'closer',
  'high_character',
  'disciplined',
  'high_football_iq',
  'football_genius',
];

/**
 * Negative traits (generally detrimental)
 */
export const NEGATIVE_TRAITS: string[] = [
  'diva',
  'locker_room_cancer',
  'lazy',
  'hot_head',
  'injury_prone',
  'slow_healer',
  'fragile',
  'holdout_risk',
  'chokes_under_pressure',
  'stage_fright',
  'character_concerns',
  'undisciplined',
  'low_football_iq',
];

/**
 * Neutral traits (situational value)
 */
export const NEUTRAL_TRAITS: string[] = [
  'quiet',
  'early_bloomer',
  'late_bloomer',
  'showboat',
  'aggressive',
  'conservative',
  'trash_talker',
  'money_motivated',
  'ring_chaser',
  'mercenary',
];

/**
 * Check if two traits conflict with each other
 */
export function traitsConflict(traitId1: string, traitId2: string): boolean {
  const trait1 = TRAITS_BY_ID[traitId1];
  const trait2 = TRAITS_BY_ID[traitId2];

  if (!trait1 || !trait2) return false;

  return trait1.conflicts.includes(traitId2) || trait2.conflicts.includes(traitId1);
}

/**
 * Get all traits that conflict with a given trait
 */
export function getConflictingTraits(traitId: string): string[] {
  const trait = TRAITS_BY_ID[traitId];
  if (!trait) return [];
  return trait.conflicts;
}

/**
 * Validate a set of traits has no conflicts
 */
export function validateTraitSet(traitIds: string[]): { valid: boolean; conflicts: [string, string][] } {
  const conflicts: [string, string][] = [];

  for (let i = 0; i < traitIds.length; i++) {
    for (let j = i + 1; j < traitIds.length; j++) {
      if (traitsConflict(traitIds[i], traitIds[j])) {
        conflicts.push([traitIds[i], traitIds[j]]);
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}
