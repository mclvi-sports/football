/**
 * Player Generator - Creates fully-formed players based on archetypes
 *
 * Uses the archetype-driven generation system from FINAL-player-generation-system.md
 * - 70 archetypes across 18 positions
 * - Attribute distribution based on Primary/Secondary/Tertiary tiers
 * - Full trait generation with affinity and conflict rules
 * - Badge generation based on OVR and experience
 */

import { Position, Archetype, Player, PlayerAttributes, PlayerBadge, BadgeTier } from '../types';
import { ARCHETYPE_TEMPLATES, POSITION_ARCHETYPES, ARCHETYPE_RARITY } from '../data/archetype-templates';
import { generatePhysicals as generatePhysicalMeasurables } from '../data/physical-ranges';
import { TRAITS, TRAITS_BY_RARITY, POSITIVE_TRAITS, NEGATIVE_TRAITS, traitsConflict } from '../data/traits';
import { BADGES, getBadgesForPosition, getBadgeCount, BADGE_TIER_WEIGHTS, UNIVERSAL_BADGES } from '../data/badges';
import * as fs from 'fs';
import * as path from 'path';

// --- Types ---

interface NameEntry {
  type: 'first' | 'last';
  name: string;
  rarity: 'common' | 'uncommon';
}

// --- Data Loading ---

let firstNames: NameEntry[] = [];
let lastNames: NameEntry[] = [];

export function loadNameDatabase() {
  if (firstNames.length > 0) return; // Already loaded

  try {
    const csvPath = path.join(process.cwd(), 'context', 'players-and-roster', 'name-pools.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').slice(1); // Skip header

    for (const line of lines) {
      const [type, name, rarity] = line.trim().split(',');
      if (!name) continue;

      const entry: NameEntry = {
        type: type as 'first' | 'last',
        name,
        rarity: rarity as 'common' | 'uncommon',
      };

      if (type === 'first') {
        firstNames.push(entry);
      } else {
        lastNames.push(entry);
      }
    }
  } catch (error) {
    console.warn('Failed to load name database, using fallbacks.', error);
    firstNames = [{ type: 'first', name: 'John', rarity: 'common' }];
    lastNames = [{ type: 'last', name: 'Doe', rarity: 'common' }];
  }
}

// --- Utility Functions ---

function getRandomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('getRandomItem: Cannot select from empty array');
  }
  return items[Math.floor(Math.random() * items.length)];
}

function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  if (items.length === 0) {
    throw new Error('weightedRandom: Cannot select from empty array');
  }
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { item, weight } of items) {
    random -= weight;
    if (random <= 0) return item;
  }
  return items[0].item;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Pick a name weighted by rarity (common names are more likely)
 */
function pickNameByRarity(names: NameEntry[]): string {
  if (names.length === 0) {
    throw new Error('pickNameByRarity: Cannot select from empty array');
  }
  // Weight common names 5x more likely than uncommon
  const weighted = names.map(n => ({
    item: n.name,
    weight: n.rarity === 'common' ? 10 : 2,
  }));
  return weightedRandom(weighted);
}

// --- Identity Generation ---

function generateIdentity(position: Position): {
  firstName: string;
  lastName: string;
  college: string;
  jerseyNumber: number;
} {
  loadNameDatabase();

  // Use rarity-weighted name selection (common names more frequent)
  const firstName = pickNameByRarity(firstNames);
  const lastName = pickNameByRarity(lastNames);

  // College list (can be expanded)
  const colleges = [
    'Alabama', 'Ohio State', 'Georgia', 'Clemson', 'Michigan',
    'LSU', 'Florida', 'Texas', 'USC', 'Oklahoma',
    'Notre Dame', 'Penn State', 'Oregon', 'Auburn', 'Texas A&M',
    'Wisconsin', 'Miami', 'Florida State', 'Tennessee', 'Nebraska',
  ];
  const college = getRandomItem(colleges);

  // Jersey number based on position (NFL rules)
  const jerseyNumber = generateJerseyNumber(position);

  return { firstName, lastName, college, jerseyNumber };
}

function generateJerseyNumber(position: Position): number {
  // Position-specific jersey number ranges
  const ranges: Record<Position, { primary: [number, number]; secondary?: [number, number] }> = {
    [Position.QB]: { primary: [1, 19] },
    [Position.RB]: { primary: [20, 49], secondary: [1, 9] },
    [Position.WR]: { primary: [10, 19], secondary: [80, 89] },
    [Position.TE]: { primary: [80, 89], secondary: [40, 49] },
    [Position.LT]: { primary: [70, 79], secondary: [60, 69] },
    [Position.LG]: { primary: [60, 69], secondary: [70, 79] },
    [Position.C]: { primary: [50, 59], secondary: [60, 69] },
    [Position.RG]: { primary: [60, 69], secondary: [70, 79] },
    [Position.RT]: { primary: [70, 79], secondary: [60, 69] },
    [Position.DE]: { primary: [90, 99], secondary: [50, 59] },
    [Position.DT]: { primary: [90, 99], secondary: [70, 79] },
    [Position.MLB]: { primary: [50, 59], secondary: [40, 49] },
    [Position.OLB]: { primary: [40, 59], secondary: [90, 99] },
    [Position.CB]: { primary: [20, 39], secondary: [1, 9] },
    [Position.FS]: { primary: [20, 39], secondary: [40, 49] },
    [Position.SS]: { primary: [20, 39], secondary: [40, 49] },
    [Position.K]: { primary: [1, 19] },
    [Position.P]: { primary: [1, 19] },
  };

  const positionRanges = ranges[position];
  // 80% chance to use primary range
  const useSecondary = positionRanges.secondary && Math.random() < 0.2;
  const range = useSecondary ? positionRanges.secondary! : positionRanges.primary;

  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

// --- Archetype Selection ---

export function selectArchetype(position: Position): Archetype {
  const archetypes = POSITION_ARCHETYPES[position];
  if (!archetypes || archetypes.length === 0) {
    throw new Error(`No archetypes defined for position: ${position}`);
  }

  // Build weighted options from archetype rarity
  const options = archetypes.map(arch => ({
    item: arch,
    weight: ARCHETYPE_RARITY[arch] || 10,
  }));

  return weightedRandom(options);
}

// --- Attribute Generation ---

/**
 * All player attribute keys
 */
const ALL_ATTRIBUTE_KEYS: (keyof PlayerAttributes)[] = [
  // Physical
  'SPD', 'ACC', 'AGI', 'STR', 'JMP', 'STA', 'INJ',
  // Mental
  'AWR', 'PRC',
  // Passing
  'THP', 'SAC', 'MAC', 'DAC', 'TUP', 'TOR', 'PAC', 'BSK',
  // Rushing
  'CAR', 'BTK', 'TRK', 'ELU', 'SPM', 'JKM', 'SFA', 'VIS',
  // Receiving
  'CTH', 'CIT', 'SPC', 'RTE', 'REL', 'RAC', 'SRR', 'MRR', 'DRR',
  // Blocking
  'PBK', 'RBK', 'IBL', 'PBP', 'PBF', 'RBP', 'RBF', 'LBK',
  // Defense
  'TAK', 'POW', 'PMV', 'FMV', 'BSH', 'PUR', 'MCV', 'ZCV', 'PRS',
  // Special Teams
  'KPW', 'KAC', 'KOP', 'PPW', 'PUA', 'CLU', 'CON', 'RET',
];

/**
 * OVR to base points mapping
 */
function getBasePoints(ovr: number): number {
  if (ovr >= 95) return 1050 + (ovr - 95) * 10;
  if (ovr >= 90) return 950 + (ovr - 90) * 20;
  if (ovr >= 85) return 875 + (ovr - 85) * 15;
  if (ovr >= 80) return 800 + (ovr - 80) * 15;
  if (ovr >= 75) return 725 + (ovr - 75) * 15;
  if (ovr >= 70) return 650 + (ovr - 70) * 15;
  if (ovr >= 65) return 575 + (ovr - 65) * 15;
  return 500 + (ovr - 60) * 15;
}

function generateAttributes(archetype: Archetype, targetOvr: number): PlayerAttributes {
  const template = ARCHETYPE_TEMPLATES[archetype];
  if (!template) {
    throw new Error(`No template found for archetype: ${archetype}`);
  }

  const attributes = {} as PlayerAttributes;
  const basePoints = getBasePoints(targetOvr);

  // Calculate points per tier (50/35/15 split)
  const primaryPoints = basePoints * 0.50;
  const secondaryPoints = basePoints * 0.35;
  const tertiaryPoints = basePoints * 0.15;

  // Calculate points per attribute in each tier
  const primaryCount = Math.max(template.primary.length, 1);
  const secondaryCount = Math.max(template.secondary.length, 1);
  const tertiaryCount = Math.max(template.tertiary.length, 1);

  const primaryValue = Math.round(primaryPoints / primaryCount);
  const secondaryValue = Math.round(secondaryPoints / secondaryCount);
  const tertiaryValue = Math.round(tertiaryPoints / tertiaryCount);

  // Convert point values to tier boosts (higher points = bigger boost)
  // Scale: 20 points = +5 boost, 80 points = +25 boost (linear scaling)
  const pointsToBoost = (points: number): number => {
    return Math.round(5 + (points - 20) * (20 / 60)); // Maps 20-80 points to 5-25 boost
  };

  const primaryBoost = clamp(pointsToBoost(primaryValue), 18, 30);
  const secondaryBoost = clamp(pointsToBoost(secondaryValue), 10, 20);
  const tertiaryBoost = clamp(pointsToBoost(tertiaryValue), 2, 12);

  // Base rating scales with OVR (not fixed at 55)
  // OVR 60 -> base 35, OVR 80 -> base 50, OVR 99 -> base 65
  const baseRating = clamp(
    Math.round((targetOvr - 25) + (Math.random() * 10 - 5)),
    40,
    75
  );

  // Initialize all attributes to base rating
  ALL_ATTRIBUTE_KEYS.forEach(key => {
    attributes[key] = baseRating;
  });

  // Apply tier-specific boosts on top of base
  // Primary: base + primaryBoost (highest ratings)
  template.primary.forEach(key => {
    if (ALL_ATTRIBUTE_KEYS.includes(key)) {
      const rating = baseRating + primaryBoost + Math.floor(Math.random() * 6 - 3);
      attributes[key] = clamp(rating, 40, 99);
    }
  });

  // Secondary: base + secondaryBoost (medium ratings)
  template.secondary.forEach(key => {
    if (ALL_ATTRIBUTE_KEYS.includes(key)) {
      const rating = baseRating + secondaryBoost + Math.floor(Math.random() * 6 - 3);
      attributes[key] = clamp(rating, 40, 99);
    }
  });

  // Tertiary: base + tertiaryBoost (lower ratings, but still above base)
  template.tertiary.forEach(key => {
    if (ALL_ATTRIBUTE_KEYS.includes(key)) {
      const rating = baseRating + tertiaryBoost + Math.floor(Math.random() * 4 - 2);
      attributes[key] = clamp(rating, 40, 99);
    }
  });

  return attributes;
}

// --- Age and Experience ---

function generateAge(slot: number = 1): number {
  // Slot affects age distribution
  // Slot 1 = starters (more experienced, older)
  // Higher slots = more depth players (younger or older)

  const baseAge = 21;
  let ageRange: number;

  if (slot === 1) {
    // Starters: 24-30 typically
    ageRange = Math.floor(Math.random() * 7) + 3; // 24-30
  } else if (slot === 2) {
    // Backups: 22-28
    ageRange = Math.floor(Math.random() * 7) + 1; // 22-28
  } else {
    // Depth: 21-26 (younger developing players)
    ageRange = Math.floor(Math.random() * 6); // 21-26
  }

  return baseAge + ageRange;
}

function calculateExperience(age: number): number {
  // Experience = years since entering league at ~21
  return clamp(age - 21, 0, 15);
}

// --- Potential System ---

function calculatePotential(ovr: number, age: number): number {
  // Potential gap by age
  let minGap: number, maxGap: number;

  if (age <= 22) {
    minGap = 8; maxGap = 15;
  } else if (age <= 24) {
    minGap = 5; maxGap = 12;
  } else if (age <= 26) {
    minGap = 3; maxGap = 8;
  } else if (age <= 29) {
    minGap = 0; maxGap = 4;
  } else if (age <= 32) {
    minGap = -3; maxGap = 1; // Veterans start declining
  } else {
    minGap = -8; maxGap = -2; // Older veterans have declining potential
  }

  const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
  // Allow potential to be below OVR for older players (not clamped to ovr)
  return clamp(ovr + gap, 40, 99);
}

// --- Trait Generation ---

/**
 * Generate traits for a player based on OVR and archetype
 *
 * Algorithm from FINALS spec:
 * - Trait count depends on OVR tier
 * - Negative trait ratio depends on OVR tier
 * - Validate no conflicts
 */
function generateTraits(archetype: Archetype, position: Position, ovr: number): string[] {
  const traits: string[] = [];

  // Trait count by OVR tier (per FINALS)
  // Elite (90+): 3-5, Good (80-89): 2-4, Average (70-79): 2-3
  // Below Average (60-69): 1-3, Poor (<60): 1-2
  let minTraits: number;
  let maxTraits: number;

  if (ovr >= 90) {
    minTraits = 3; maxTraits = 5;
  } else if (ovr >= 80) {
    minTraits = 2; maxTraits = 4;
  } else if (ovr >= 70) {
    minTraits = 2; maxTraits = 3;
  } else if (ovr >= 60) {
    minTraits = 1; maxTraits = 3;
  } else {
    minTraits = 1; maxTraits = 2;
  }

  const traitCount = minTraits + Math.floor(Math.random() * (maxTraits - minTraits + 1));

  // Build trait pool using TRAITS_BY_RARITY for OVR-based access
  // Higher OVR players have better chance at rare positive traits
  // Use TRAITS_BY_RARITY to check available rarity tiers
  const rareTraitsAvailable = TRAITS_BY_RARITY['rare']?.length > 0;
  const veryRareTraitsAvailable = TRAITS_BY_RARITY['very_rare']?.length > 0;

  const getRarityMultiplier = (rarity: string): number => {
    // Elite players get boosted rare trait odds, lower OVR get boosted common odds
    if (ovr >= 90 && rareTraitsAvailable) {
      return rarity === 'rare' || (rarity === 'very_rare' && veryRareTraitsAvailable) ? 2.0 : 1.0;
    } else if (ovr >= 80 && rareTraitsAvailable) {
      return rarity === 'rare' ? 1.5 : 1.0;
    } else if (ovr < 70) {
      return rarity === 'common' ? 1.5 : 0.7;
    }
    return 1.0;
  };

  // Get available positive traits with rarity-adjusted weights
  const availablePositive = TRAITS.filter(t => POSITIVE_TRAITS.includes(t.id));

  // Build weighted trait pool using TRAITS_BY_RARITY structure for rarity awareness
  const buildTraitPool = () => {
    return availablePositive.map(t => ({
      item: t.id,
      weight: t.rarityWeight * getRarityMultiplier(t.rarity),
    }));
  };

  // Select traits without conflicts
  for (let i = 0; i < traitCount; i++) {
    const pool = buildTraitPool().filter(t => {
      // Exclude already selected traits
      if (traits.includes(t.item)) return false;
      // Exclude conflicting traits
      for (const existing of traits) {
        if (traitsConflict(t.item, existing)) return false;
      }
      return true;
    });

    if (pool.length === 0) break;

    const selectedTrait = weightedRandom(pool);
    traits.push(selectedTrait);
  }

  // Negative trait ratio by OVR tier (per FINALS)
  // Elite (90+): 20%, Good (80-89): 30%, Average (70-79): 40%
  // Below Average (60-69): 50%, Poor (<60): 60%
  let negativeRatio: number;
  if (ovr >= 90) negativeRatio = 0.20;
  else if (ovr >= 80) negativeRatio = 0.30;
  else if (ovr >= 70) negativeRatio = 0.40;
  else if (ovr >= 60) negativeRatio = 0.50;
  else negativeRatio = 0.60;

  // Calculate how many negative traits based on total count and ratio
  const targetNegative = Math.round(traits.length * negativeRatio);

  // Add negative traits to reach target
  for (let i = 0; i < targetNegative; i++) {
    const availableNegative = TRAITS.filter(t => {
      if (!NEGATIVE_TRAITS.includes(t.id)) return false;
      if (traits.includes(t.id)) return false;
      for (const existing of traits) {
        if (traitsConflict(t.id, existing)) return false;
      }
      return true;
    });

    if (availableNegative.length > 0) {
      const negativePool = availableNegative.map(t => ({
        item: t.id,
        weight: t.rarityWeight,
      }));
      traits.push(weightedRandom(negativePool));
    }
  }

  return traits;
}

// --- Badge Generation ---

/**
 * Generate badges for a player based on position, OVR, and experience
 *
 * Algorithm from FINAL spec:
 * 1. Rookies (experience = 0): No badges
 * 2. Veterans: Badge count based on OVR + experience
 * 3. Tier distribution: 70% Bronze, 30% Silver for 1 badge; scales up
 * 4. 70% position-specific badges, 30% universal
 */
function generateBadges(position: Position, ovr: number, experience: number): PlayerBadge[] {
  const badges: PlayerBadge[] = [];

  // Rookies have no badges
  if (experience === 0) return badges;

  const badgeCount = getBadgeCount(ovr, experience);
  if (badgeCount === 0) return badges;

  // Get position-specific badges (excludes universal)
  const positionBadges = getBadgesForPosition(position).filter(b => b.type === 'position');
  // Universal badges available to all positions
  const universalBadges = UNIVERSAL_BADGES;

  // Select badges with 70/30 split (position-specific vs universal)
  const selectedBadgeIds = new Set<string>();

  // Build tier weight pool with OVR/experience bonus
  // Higher OVR and experience = better chance at higher tiers
  const tierBonus = Math.max(0, (ovr - 75) / 5 + experience / 3); // 0-10 bonus
  const getTierWeights = (): { item: BadgeTier; weight: number }[] => {
    return [
      { item: 'bronze', weight: Math.max(10, BADGE_TIER_WEIGHTS.bronze - tierBonus * 4) },
      { item: 'silver', weight: BADGE_TIER_WEIGHTS.silver + tierBonus },
      { item: 'gold', weight: BADGE_TIER_WEIGHTS.gold + tierBonus * 0.5 },
      { item: 'hof', weight: BADGE_TIER_WEIGHTS.hof + tierBonus * 0.3 },
    ];
  };

  for (let i = 0; i < badgeCount; i++) {
    // 70% chance for position-specific, 30% for universal
    const usePositionSpecific = Math.random() < 0.70;

    // Select pool based on 70/30 split
    let pool = usePositionSpecific ? positionBadges : universalBadges;

    // Filter out already selected badges
    let remaining = pool.filter(b => !selectedBadgeIds.has(b.id));

    // Fallback: if preferred pool is empty, try the other pool
    if (remaining.length === 0) {
      pool = usePositionSpecific ? universalBadges : positionBadges;
      remaining = pool.filter(b => !selectedBadgeIds.has(b.id));
    }

    if (remaining.length === 0) break;

    const badge = getRandomItem(remaining);
    selectedBadgeIds.add(badge.id);

    // Determine tier using BADGE_TIER_WEIGHTS via weightedRandom
    const tier = weightedRandom(getTierWeights());

    badges.push({ id: badge.id, tier });
  }

  return badges;
}

// --- Main Generator ---

export interface GeneratePlayerOptions {
  position: Position;
  targetOvr: number;
  archetype?: Archetype;
  slot?: number; // Depth chart slot (1 = starter)
  age?: number;
}

export function generatePlayer(options: GeneratePlayerOptions): Player;
export function generatePlayer(position: Position, targetOvr: number): Player;
export function generatePlayer(
  positionOrOptions: Position | GeneratePlayerOptions,
  targetOvrParam?: number
): Player {
  // Handle overloads
  let position: Position;
  let targetOvr: number;
  let archetype: Archetype | undefined;
  let slot: number;
  let age: number | undefined;

  if (typeof positionOrOptions === 'object') {
    position = positionOrOptions.position;
    targetOvr = positionOrOptions.targetOvr;
    archetype = positionOrOptions.archetype;
    slot = positionOrOptions.slot || 1;
    age = positionOrOptions.age;
  } else {
    position = positionOrOptions;
    targetOvr = targetOvrParam!;
    slot = 1;
  }

  // Validate OVR range
  if (targetOvr < 40 || targetOvr > 99) {
    throw new Error(`generatePlayer: targetOvr must be between 40-99, got ${targetOvr}`);
  }

  // 1. Select Archetype (if not provided)
  if (!archetype) {
    archetype = selectArchetype(position);
  }

  // 2. Generate Identity
  const identity = generateIdentity(position);

  // 3. Generate Age
  const playerAge = age ?? generateAge(slot);

  // 4. Calculate Experience
  const experience = calculateExperience(playerAge);

  // 5. Generate Attributes
  const attributes = generateAttributes(archetype, targetOvr);

  // 6. Generate Physical Measurements
  const physicals = generatePhysicalMeasurables(position, archetype);

  // 7. Calculate Potential
  const potential = calculatePotential(targetOvr, playerAge);

  // 8. Generate Traits
  const traits = generateTraits(archetype, position, targetOvr);

  // 9. Generate Badges
  const badges = generateBadges(position, targetOvr, experience);

  return {
    id: crypto.randomUUID(),
    ...identity,
    position,
    archetype,
    age: playerAge,
    experience,
    height: physicals.height,
    weight: physicals.weight,
    fortyTime: physicals.fortyTime,
    overall: targetOvr,
    potential,
    attributes,
    traits,
    badges,
  };
}
