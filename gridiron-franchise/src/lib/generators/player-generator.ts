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
import { randomUUID } from 'crypto';

// --- Types ---

interface NameEntry {
  type: 'first' | 'last';
  name: string;
  rarity: 'common' | 'uncommon';
}

// --- Data Loading ---

let firstNames: NameEntry[] = [];
let lastNames: NameEntry[] = [];

/**
 * Reset the name database (for testing purposes).
 * Clears cached names so loadNameDatabase() will reload from CSV.
 */
export function resetNameDatabase(): void {
  firstNames = [];
  lastNames = [];
}

export function loadNameDatabase() {
  if (firstNames.length > 0) return; // Already loaded

  try {
    const csvPath = path.join(process.cwd(), 'context', 'players-and-roster', 'name-pools.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = fileContent.split('\n').slice(1); // Skip header

    const validTypes = ['first', 'last'];
    const validRarities = ['common', 'uncommon'];

    for (const line of lines) {
      const [type, name, rarity] = line.trim().split(',');
      if (!name) continue;

      // Validate type and rarity before casting
      if (!validTypes.includes(type) || !validRarities.includes(rarity)) {
        console.warn(`Skipping invalid name entry: ${line.trim()}`);
        continue;
      }

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

// --- Constants ---

/**
 * College programs for player generation (expandable)
 */
const COLLEGES = [
  'Alabama', 'Ohio State', 'Georgia', 'Clemson', 'Michigan',
  'LSU', 'Florida', 'Texas', 'USC', 'Oklahoma',
  'Notre Dame', 'Penn State', 'Oregon', 'Auburn', 'Texas A&M',
  'Wisconsin', 'Miami', 'Florida State', 'Tennessee', 'Nebraska',
];

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

  const college = getRandomItem(COLLEGES);

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

/**
 * Position career length categories
 * Based on real NFL career patterns
 */
const POSITION_CAREER_CONFIG: Record<Position, {
  peakStart: number;    // When prime begins
  peakEnd: number;      // When prime ends
  maxAge: number;       // Realistic max age
  elderWeight: number;  // Multiplier for 34+ bracket
  rookieWeight: number; // Multiplier for 21-22 bracket
}> = {
  // QBs: Long careers, peak 27-35, can play to 45
  [Position.QB]: { peakStart: 27, peakEnd: 35, maxAge: 45, elderWeight: 2.5, rookieWeight: 0.6 },
  // RBs: Short careers, peak 23-27, rare past 32
  [Position.RB]: { peakStart: 23, peakEnd: 27, maxAge: 32, elderWeight: 0.2, rookieWeight: 1.4 },
  // WRs: Medium careers, peak 25-30
  [Position.WR]: { peakStart: 25, peakEnd: 30, maxAge: 36, elderWeight: 0.5, rookieWeight: 1.2 },
  // TEs: Longer careers, peak 26-31
  [Position.TE]: { peakStart: 26, peakEnd: 31, maxAge: 37, elderWeight: 0.8, rookieWeight: 0.9 },
  // OL: Long careers, peak 26-32
  [Position.LT]: { peakStart: 26, peakEnd: 32, maxAge: 38, elderWeight: 1.2, rookieWeight: 0.7 },
  [Position.LG]: { peakStart: 26, peakEnd: 32, maxAge: 38, elderWeight: 1.2, rookieWeight: 0.7 },
  [Position.C]: { peakStart: 26, peakEnd: 33, maxAge: 39, elderWeight: 1.3, rookieWeight: 0.6 },
  [Position.RG]: { peakStart: 26, peakEnd: 32, maxAge: 38, elderWeight: 1.2, rookieWeight: 0.7 },
  [Position.RT]: { peakStart: 26, peakEnd: 32, maxAge: 38, elderWeight: 1.2, rookieWeight: 0.7 },
  // DL: Medium-long careers
  [Position.DE]: { peakStart: 25, peakEnd: 30, maxAge: 36, elderWeight: 0.7, rookieWeight: 1.0 },
  [Position.DT]: { peakStart: 26, peakEnd: 31, maxAge: 36, elderWeight: 0.8, rookieWeight: 0.9 },
  // LBs: Medium careers
  [Position.MLB]: { peakStart: 25, peakEnd: 30, maxAge: 35, elderWeight: 0.6, rookieWeight: 1.1 },
  [Position.OLB]: { peakStart: 25, peakEnd: 30, maxAge: 35, elderWeight: 0.6, rookieWeight: 1.1 },
  // DBs: CBs decline earlier, Safeties last longer
  [Position.CB]: { peakStart: 24, peakEnd: 29, maxAge: 34, elderWeight: 0.4, rookieWeight: 1.3 },
  [Position.FS]: { peakStart: 25, peakEnd: 31, maxAge: 36, elderWeight: 0.7, rookieWeight: 1.0 },
  [Position.SS]: { peakStart: 25, peakEnd: 31, maxAge: 36, elderWeight: 0.7, rookieWeight: 1.0 },
  // Specialists: Very long careers
  [Position.K]: { peakStart: 26, peakEnd: 38, maxAge: 48, elderWeight: 3.0, rookieWeight: 0.4 },
  [Position.P]: { peakStart: 26, peakEnd: 38, maxAge: 45, elderWeight: 2.5, rookieWeight: 0.5 },
};

/**
 * Age brackets representing NFL roster distribution
 * Weights are base percentages that get modified by position/slot/OVR
 */
const AGE_BRACKETS = [
  { min: 21, max: 22, label: 'rookie', baseWeight: 12 },
  { min: 23, max: 25, label: 'young', baseWeight: 28 },
  { min: 26, max: 29, label: 'prime', baseWeight: 32 },
  { min: 30, max: 33, label: 'veteran', baseWeight: 20 },
  { min: 34, max: 40, label: 'elder', baseWeight: 8 },
];

/**
 * Generate realistic age based on position, slot, and OVR
 *
 * Factors:
 * - Position: QBs/K/P play longer, RBs/CBs decline early
 * - Slot: Starters more likely to be prime, depth can be young OR veteran
 * - OVR: Higher OVR = more likely prime age (but can be young star or aging vet)
 */
function generateAge(slot: number = 1, position: Position = Position.QB, targetOvr: number = 75): number {
  const config = POSITION_CAREER_CONFIG[position];

  // Calculate bracket weights adjusted for position
  const adjustedBrackets = AGE_BRACKETS.map(bracket => {
    let weight = bracket.baseWeight;

    // Position adjustments
    if (bracket.label === 'elder') {
      weight *= config.elderWeight;
    } else if (bracket.label === 'rookie') {
      weight *= config.rookieWeight;
    }

    // Slot adjustments
    if (slot === 1) {
      // Starters: Boost prime/veteran, reduce rookie
      if (bracket.label === 'prime') weight *= 1.4;
      if (bracket.label === 'veteran') weight *= 1.3;
      if (bracket.label === 'rookie') weight *= 0.6;
    } else if (slot === 2) {
      // Backups: Mix of young (developing) and veteran (experienced depth)
      if (bracket.label === 'young') weight *= 1.2;
      if (bracket.label === 'veteran') weight *= 1.1;
    } else {
      // Depth (slot 3+): Mostly young, some vet minimum guys
      if (bracket.label === 'rookie') weight *= 1.5;
      if (bracket.label === 'young') weight *= 1.3;
      if (bracket.label === 'elder') weight *= 0.8; // Vet minimum journeymen
    }

    // OVR adjustments
    if (targetOvr >= 85) {
      // Elite players: More likely prime or veteran (proven)
      if (bracket.label === 'prime') weight *= 1.3;
      if (bracket.label === 'veteran') weight *= 1.2;
      if (bracket.label === 'rookie') weight *= 0.7; // Rare elite rookies
    } else if (targetOvr >= 75) {
      // Good players: Balanced, slight prime boost
      if (bracket.label === 'prime') weight *= 1.1;
    } else if (targetOvr < 65) {
      // Low OVR: Either young (developing) or old (declining)
      if (bracket.label === 'rookie') weight *= 1.3;
      if (bracket.label === 'young') weight *= 1.2;
      if (bracket.label === 'elder') weight *= 1.4; // Aging vets hanging on
      if (bracket.label === 'prime') weight *= 0.7;
    }

    return { ...bracket, weight: Math.max(1, weight) };
  });

  // Select bracket using weighted random
  const bracketOptions = adjustedBrackets.map(b => ({ item: b, weight: b.weight }));
  const selectedBracket = weightedRandom(bracketOptions);

  // Generate age within bracket, respecting position max age
  let minAge = selectedBracket.min;
  let maxAge = Math.min(selectedBracket.max, config.maxAge);

  // If bracket max exceeds position max, clamp it
  if (minAge > config.maxAge) {
    // This bracket is invalid for this position, use previous bracket
    minAge = Math.max(21, config.maxAge - 3);
    maxAge = config.maxAge;
  }

  // Generate within range with slight bias toward middle of bracket
  const range = maxAge - minAge;
  const age = minAge + Math.floor(Math.random() * (range + 1));

  return clamp(age, 21, config.maxAge);
}

function calculateExperience(age: number): number {
  // Experience = years since entering league at ~21
  return clamp(age - 21, 0, 15);
}

// --- Potential System ---

/**
 * Calculate potential rating based on OVR and age.
 *
 * Design assumptions:
 * - Young players (≤22): High upside, 8-15 points above OVR
 * - Prime players (23-29): Moderate upside, gradually decreasing
 * - Veterans (30-32): Minimal upside, potential can equal or slightly exceed OVR
 * - Older veterans (33+): Declining potential, can be BELOW current OVR
 *   (reflects physical decline trajectory)
 *
 * @param ovr - Current overall rating
 * @param age - Player age
 * @returns Potential rating (40-99), may be below OVR for older players
 */
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
 * Build badge tier weights adjusted by OVR/experience bonus.
 * Hoisted for efficiency - computed once per generateBadges call.
 */
function buildTierWeights(ovr: number, experience: number): { item: BadgeTier; weight: number }[] {
  // Higher OVR and experience = better chance at higher tiers
  const tierBonus = Math.max(0, (ovr - 75) / 5 + experience / 3); // 0-10 bonus
  return [
    { item: 'bronze', weight: Math.max(10, BADGE_TIER_WEIGHTS.bronze - tierBonus * 4) },
    { item: 'silver', weight: BADGE_TIER_WEIGHTS.silver + tierBonus },
    { item: 'gold', weight: BADGE_TIER_WEIGHTS.gold + tierBonus * 0.5 },
    { item: 'hof', weight: BADGE_TIER_WEIGHTS.hof + tierBonus * 0.3 },
  ];
}

/**
 * Generate badges for a player based on position, OVR, and experience
 *
 * Algorithm from FINAL spec:
 * 1. Rookies (experience = 0): No badges - badges are earned through play, not drafted with
 * 2. Veterans: Badge count based on OVR + experience
 * 3. Tier distribution: 70% Bronze, 30% Silver for 1 badge; scales up
 * 4. 70% position-specific badges, 30% universal
 */
function generateBadges(position: Position, ovr: number, experience: number): PlayerBadge[] {
  const badges: PlayerBadge[] = [];

  // Rookies have no badges - they earn them through gameplay
  if (experience === 0) return badges;

  const badgeCount = getBadgeCount(ovr, experience);
  if (badgeCount === 0) return badges;

  // Get position-specific badges (excludes universal)
  const positionBadges = getBadgesForPosition(position).filter(b => b.type === 'position');
  // Universal badges available to all positions
  const universalBadges = UNIVERSAL_BADGES;

  // Select badges with 70/30 split (position-specific vs universal)
  const selectedBadgeIds = new Set<string>();

  // Compute tier weights once (not per badge)
  const tierWeights = buildTierWeights(ovr, experience);

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

    // Determine tier using pre-computed weights
    const tier = weightedRandom(tierWeights);

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

  // 3. Generate Age (now considers position and OVR for realistic distribution)
  const playerAge = age ?? generateAge(slot, position, targetOvr);

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
    id: randomUUID(),
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
