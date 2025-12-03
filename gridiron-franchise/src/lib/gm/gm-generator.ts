/**
 * GM Generator
 *
 * Generates GMs for all 32 teams.
 * Player creates their own GM, CPU teams get randomly generated GMs.
 */

import { Tier } from '../types';
import { LEAGUE_TEAMS } from '../data/teams';
import type { GM, GMBackground, GMArchetype, GMContract, LeagueGMs } from './types';
import {
  GM_BACKGROUNDS,
  GM_ARCHETYPES,
  hasSynergy,
  calculateBonuses,
} from './gm-data';

// ============================================================================
// NAME DATA
// ============================================================================

const FIRST_NAMES = [
  'Mike', 'John', 'Bill', 'Andy', 'Sean', 'Kyle', 'Matt', 'Dan', 'Pete', 'Ron',
  'Brian', 'Kevin', 'Doug', 'Steve', 'Tom', 'Jim', 'Joe', 'Dave', 'Pat', 'Frank',
  'Gary', 'Tony', 'Bruce', 'Rick', 'Mark', 'Chris', 'Jeff', 'Robert', 'Dennis', 'Eric',
  'Todd', 'Greg', 'James', 'Anthony', 'Scott', 'Nick', 'Adam', 'Paul', 'Ken', 'Ray',
  'Howie', 'Les', 'Terry', 'Ozzie', 'Jerry', 'George', 'Ted', 'Bob', 'Reggie', 'Mickey',
];

const LAST_NAMES = [
  'Roseman', 'Snead', 'Veach', 'Beane', 'Ballard', 'Douglas', 'Schoen', 'Poles',
  'Newsome', 'Colbert', 'DeCosta', 'Fontenot', 'Holmes', 'Dodds', 'Carthon', 'Adofo-Mensah',
  'Williams', 'Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
  'Garcia', 'Martinez', 'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateId(): string {
  return `gm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// AGE & EXPERIENCE GENERATION
// ============================================================================

/**
 * Generate age based on background and random factors
 * GMs typically range from 35-65
 */
function generateAge(): number {
  // Most GMs are 40-55
  const base = randomInRange(40, 55);
  const variance = randomInRange(-5, 10);
  return Math.max(35, Math.min(68, base + variance));
}

/**
 * Generate experience based on age
 * Younger GMs have less experience
 */
function generateExperience(age: number): number {
  // First GM job is typically 35-45
  const minStartAge = 35;
  const yearsAsGM = Math.max(1, age - randomInRange(minStartAge, 45));
  return Math.min(yearsAsGM, 25); // Cap at 25 years
}

/**
 * Generate contract based on tier
 */
function generateContract(tier: Tier): GMContract {
  // Better teams = longer contracts, higher salary
  switch (tier) {
    case Tier.Elite:
      return { years: randomInRange(4, 6), salary: randomInRange(4, 6) };
    case Tier.Good:
      return { years: randomInRange(3, 5), salary: randomInRange(3, 5) };
    case Tier.Average:
      return { years: randomInRange(3, 4), salary: randomInRange(2, 4) };
    case Tier.BelowAverage:
      return { years: randomInRange(2, 4), salary: randomInRange(2, 3) };
    case Tier.Rebuilding:
      return { years: randomInRange(2, 3), salary: randomInRange(1, 3) };
    default:
      return { years: 3, salary: 3 };
  }
}

// ============================================================================
// GM GENERATION
// ============================================================================

/**
 * Generate a random CPU GM for a team
 */
export function generateCPUGM(teamId: string, tier: Tier): GM {
  const backgrounds = Object.keys(GM_BACKGROUNDS) as GMBackground[];
  const archetypes = Object.keys(GM_ARCHETYPES) as GMArchetype[];

  const background = pickRandom(backgrounds);
  const archetype = pickRandom(archetypes);
  const age = generateAge();

  return {
    id: generateId(),
    teamId,
    firstName: pickRandom(FIRST_NAMES),
    lastName: pickRandom(LAST_NAMES),
    background,
    archetype,
    hasSynergy: hasSynergy(background, archetype),
    bonuses: calculateBonuses(background, archetype),
    age,
    experience: generateExperience(age),
    contract: generateContract(tier),
    isPlayer: false,
  };
}

/**
 * Create the player's GM with chosen background and archetype
 */
export function createPlayerGM(
  teamId: string,
  background: GMBackground,
  archetype: GMArchetype,
  firstName?: string,
  lastName?: string
): GM {
  const age = randomInRange(38, 50); // Player GMs are typically younger

  return {
    id: generateId(),
    teamId,
    firstName: firstName || 'Your',
    lastName: lastName || 'GM',
    background,
    archetype,
    hasSynergy: hasSynergy(background, archetype),
    bonuses: calculateBonuses(background, archetype),
    age,
    experience: generateExperience(age),
    contract: { years: 5, salary: 4 }, // Standard new GM contract
    isPlayer: true,
  };
}

/**
 * Generate all GMs for the league
 * Player picks their team and creates their GM
 * All other teams get randomly generated GMs
 */
export function generateLeagueGMs(
  playerTeamId: string,
  playerBackground: GMBackground,
  playerArchetype: GMArchetype,
  teamTiers: Map<string, Tier>,
  playerFirstName?: string,
  playerLastName?: string
): LeagueGMs {
  const playerGM = createPlayerGM(
    playerTeamId,
    playerBackground,
    playerArchetype,
    playerFirstName,
    playerLastName
  );

  const cpuGMs: Record<string, GM> = {};

  for (const team of LEAGUE_TEAMS) {
    if (team.id === playerTeamId) continue; // Skip player's team

    const tier = teamTiers.get(team.id) || Tier.Average;
    cpuGMs[team.id] = generateCPUGM(team.id, tier);
  }

  return {
    playerTeamId,
    playerGM,
    cpuGMs,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get a specific team's GM from LeagueGMs
 */
export function getTeamGM(gms: LeagueGMs, teamId: string): GM | null {
  if (teamId === gms.playerTeamId) {
    return gms.playerGM;
  }
  return gms.cpuGMs[teamId] || null;
}
