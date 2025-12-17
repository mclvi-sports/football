/**
 * College Accolades System
 * Awards, honors, and recognition for draft prospects based on college career
 *
 * Award tiers determine rarity and correlation with NFL success
 */

import { Position } from '../types';

export type AccoladeTier = 'elite' | 'major' | 'notable' | 'honorable';

export interface CollegeAccolade {
  id: string;
  name: string;
  abbreviation: string;
  tier: AccoladeTier;
  description: string;
  positions?: Position[]; // If undefined, applies to all positions
  multipleAllowed: boolean; // Can win multiple times (e.g., All-American)
}

// Elite Tier - Extremely rare, top prospects only
export const ELITE_ACCOLADES: CollegeAccolade[] = [
  {
    id: 'heisman_winner',
    name: 'Heisman Trophy Winner',
    abbreviation: 'HTW',
    tier: 'elite',
    description: 'Won the Heisman Trophy as the most outstanding player',
    multipleAllowed: false,
  },
  {
    id: 'national_champion',
    name: 'National Champion',
    abbreviation: 'NC',
    tier: 'elite',
    description: 'Won the College Football National Championship',
    multipleAllowed: true,
  },
  {
    id: 'consensus_all_american_1st',
    name: 'Consensus All-American (1st Team)',
    abbreviation: 'AA1',
    tier: 'elite',
    description: 'Named to the Consensus All-American First Team',
    multipleAllowed: true,
  },
];

// Major Tier - Rare, top 10-20% of prospects
export const MAJOR_ACCOLADES: CollegeAccolade[] = [
  {
    id: 'heisman_finalist',
    name: 'Heisman Trophy Finalist',
    abbreviation: 'HTF',
    tier: 'major',
    description: 'Invited to the Heisman Trophy ceremony as a finalist',
    multipleAllowed: true,
  },
  {
    id: 'all_american_2nd',
    name: 'All-American (2nd Team)',
    abbreviation: 'AA2',
    tier: 'major',
    description: 'Named to the All-American Second Team',
    multipleAllowed: true,
  },
  {
    id: 'conference_poy',
    name: 'Conference Player of the Year',
    abbreviation: 'CPOY',
    tier: 'major',
    description: 'Named the best player in their conference',
    multipleAllowed: true,
  },
  {
    id: 'biletnikoff',
    name: 'Biletnikoff Award',
    abbreviation: 'BIL',
    tier: 'major',
    description: 'Best receiver in college football',
    positions: [Position.WR],
    multipleAllowed: false,
  },
  {
    id: 'doak_walker',
    name: 'Doak Walker Award',
    abbreviation: 'DWA',
    tier: 'major',
    description: 'Best running back in college football',
    positions: [Position.RB],
    multipleAllowed: false,
  },
  {
    id: 'davey_obrien',
    name: 'Davey O\'Brien Award',
    abbreviation: 'DOB',
    tier: 'major',
    description: 'Best quarterback in college football',
    positions: [Position.QB],
    multipleAllowed: false,
  },
  {
    id: 'outland',
    name: 'Outland Trophy',
    abbreviation: 'OUT',
    tier: 'major',
    description: 'Best interior lineman in college football',
    positions: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT, Position.DT],
    multipleAllowed: false,
  },
  {
    id: 'lombardi',
    name: 'Lombardi Award',
    abbreviation: 'LOM',
    tier: 'major',
    description: 'Best lineman or linebacker in college football',
    positions: [Position.LT, Position.LG, Position.C, Position.RG, Position.RT, Position.DE, Position.DT, Position.MLB, Position.OLB],
    multipleAllowed: false,
  },
  {
    id: 'thorpe',
    name: 'Jim Thorpe Award',
    abbreviation: 'JTA',
    tier: 'major',
    description: 'Best defensive back in college football',
    positions: [Position.CB, Position.FS, Position.SS],
    multipleAllowed: false,
  },
  {
    id: 'butkus',
    name: 'Butkus Award',
    abbreviation: 'BUK',
    tier: 'major',
    description: 'Best linebacker in college football',
    positions: [Position.MLB, Position.OLB],
    multipleAllowed: false,
  },
  {
    id: 'nagurski',
    name: 'Nagurski Trophy',
    abbreviation: 'NAG',
    tier: 'major',
    description: 'Best defensive player in college football',
    positions: [Position.DE, Position.DT, Position.MLB, Position.OLB, Position.CB, Position.FS, Position.SS],
    multipleAllowed: false,
  },
  {
    id: 'mackey',
    name: 'John Mackey Award',
    abbreviation: 'MAC',
    tier: 'major',
    description: 'Best tight end in college football',
    positions: [Position.TE],
    multipleAllowed: false,
  },
  {
    id: 'rimington',
    name: 'Rimington Trophy',
    abbreviation: 'RIM',
    tier: 'major',
    description: 'Best center in college football',
    positions: [Position.C],
    multipleAllowed: false,
  },
  {
    id: 'bednarik',
    name: 'Bednarik Award',
    abbreviation: 'BED',
    tier: 'major',
    description: 'College Defensive Player of the Year',
    positions: [Position.DE, Position.DT, Position.MLB, Position.OLB, Position.CB, Position.FS, Position.SS],
    multipleAllowed: false,
  },
  {
    id: 'bowl_mvp',
    name: 'Bowl Game MVP',
    abbreviation: 'BMVP',
    tier: 'major',
    description: 'Most Valuable Player in a bowl game',
    multipleAllowed: true,
  },
];

// Notable Tier - Common among drafted players
export const NOTABLE_ACCOLADES: CollegeAccolade[] = [
  {
    id: 'all_american_3rd',
    name: 'All-American (3rd Team)',
    abbreviation: 'AA3',
    tier: 'notable',
    description: 'Named to the All-American Third Team',
    multipleAllowed: true,
  },
  {
    id: 'all_conference_1st',
    name: 'All-Conference (1st Team)',
    abbreviation: 'AC1',
    tier: 'notable',
    description: 'Named to the All-Conference First Team',
    multipleAllowed: true,
  },
  {
    id: 'conference_freshman_poy',
    name: 'Conference Freshman of the Year',
    abbreviation: 'CFOY',
    tier: 'notable',
    description: 'Best freshman in their conference',
    multipleAllowed: false,
  },
  {
    id: 'freshman_all_american',
    name: 'Freshman All-American',
    abbreviation: 'FAA',
    tier: 'notable',
    description: 'Named to the Freshman All-American Team',
    multipleAllowed: false,
  },
  {
    id: 'senior_bowl',
    name: 'Senior Bowl Invitee',
    abbreviation: 'SB',
    tier: 'notable',
    description: 'Invited to play in the Senior Bowl',
    multipleAllowed: false,
  },
  {
    id: 'combine_invite',
    name: 'NFL Combine Invitee',
    abbreviation: 'CI',
    tier: 'notable',
    description: 'Invited to the NFL Scouting Combine',
    multipleAllowed: false,
  },
];

// Honorable Tier - Common, filler for depth
export const HONORABLE_ACCOLADES: CollegeAccolade[] = [
  {
    id: 'all_conference_2nd',
    name: 'All-Conference (2nd Team)',
    abbreviation: 'AC2',
    tier: 'honorable',
    description: 'Named to the All-Conference Second Team',
    multipleAllowed: true,
  },
  {
    id: 'all_conference_3rd',
    name: 'All-Conference (3rd Team)',
    abbreviation: 'AC3',
    tier: 'honorable',
    description: 'Named to the All-Conference Third Team',
    multipleAllowed: true,
  },
  {
    id: 'academic_all_american',
    name: 'Academic All-American',
    abbreviation: 'AAC',
    tier: 'honorable',
    description: 'Recognized for academic and athletic excellence',
    multipleAllowed: true,
  },
  {
    id: 'team_captain',
    name: 'Team Captain',
    abbreviation: 'CAP',
    tier: 'honorable',
    description: 'Named team captain',
    multipleAllowed: true,
  },
  {
    id: 'conference_weekly',
    name: 'Conference Player of the Week',
    abbreviation: 'CPW',
    tier: 'honorable',
    description: 'Named conference player of the week',
    multipleAllowed: true,
  },
];

// Combined list of all accolades
export const ALL_ACCOLADES: CollegeAccolade[] = [
  ...ELITE_ACCOLADES,
  ...MAJOR_ACCOLADES,
  ...NOTABLE_ACCOLADES,
  ...HONORABLE_ACCOLADES,
];

// Get accolades by tier
export function getAccoladesByTier(tier: AccoladeTier): CollegeAccolade[] {
  return ALL_ACCOLADES.filter(a => a.tier === tier);
}

// Get accolades eligible for a position
export function getAccoladesForPosition(position: Position): CollegeAccolade[] {
  return ALL_ACCOLADES.filter(a => !a.positions || a.positions.includes(position));
}

// Accolade probability by round and tier
// Higher draft picks more likely to have elite accolades
export const ACCOLADE_PROBABILITY_BY_ROUND: Record<number | 'UDFA', Record<AccoladeTier, number>> = {
  1: { elite: 0.15, major: 0.40, notable: 0.70, honorable: 0.90 },
  2: { elite: 0.05, major: 0.25, notable: 0.55, honorable: 0.85 },
  3: { elite: 0.02, major: 0.15, notable: 0.45, honorable: 0.80 },
  4: { elite: 0.01, major: 0.10, notable: 0.35, honorable: 0.75 },
  5: { elite: 0.00, major: 0.05, notable: 0.25, honorable: 0.65 },
  6: { elite: 0.00, major: 0.02, notable: 0.15, honorable: 0.55 },
  7: { elite: 0.00, major: 0.01, notable: 0.10, honorable: 0.45 },
  UDFA: { elite: 0.00, major: 0.00, notable: 0.05, honorable: 0.30 },
};

// Maximum accolades by round
export const MAX_ACCOLADES_BY_ROUND: Record<number | 'UDFA', number> = {
  1: 6,
  2: 5,
  3: 4,
  4: 3,
  5: 2,
  6: 2,
  7: 1,
  UDFA: 1,
};

/**
 * Generate accolades for a prospect based on draft position and round
 */
export function generateAccolades(
  position: Position,
  round: number | 'UDFA',
  randomFn: () => number = Math.random
): string[] {
  const accolades: string[] = [];
  const eligibleAccolades = getAccoladesForPosition(position);
  const probabilities = ACCOLADE_PROBABILITY_BY_ROUND[round] ?? ACCOLADE_PROBABILITY_BY_ROUND.UDFA;
  const maxAccolades = MAX_ACCOLADES_BY_ROUND[round] ?? 1;

  // Try to add accolades from each tier
  const tiers: AccoladeTier[] = ['elite', 'major', 'notable', 'honorable'];

  for (const tier of tiers) {
    if (accolades.length >= maxAccolades) break;

    const probability = probabilities[tier];
    if (randomFn() < probability) {
      const tierAccolades = eligibleAccolades.filter(a => a.tier === tier);
      if (tierAccolades.length > 0) {
        // Pick a random accolade from this tier
        const accolade = tierAccolades[Math.floor(randomFn() * tierAccolades.length)];
        if (!accolades.includes(accolade.id)) {
          accolades.push(accolade.id);
        }
      }
    }
  }

  return accolades;
}

/**
 * Get accolade by ID
 */
export function getAccoladeById(id: string): CollegeAccolade | undefined {
  return ALL_ACCOLADES.find(a => a.id === id);
}

/**
 * Format accolades for display
 */
export function formatAccolades(accoladeIds: string[]): string {
  return accoladeIds
    .map(id => getAccoladeById(id))
    .filter((a): a is CollegeAccolade => a !== undefined)
    .map(a => a.abbreviation)
    .join(', ');
}
