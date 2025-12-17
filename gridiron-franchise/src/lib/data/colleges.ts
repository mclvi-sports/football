/**
 * College Database for Draft Prospects
 * 130+ schools across 5 tiers with weighted selection based on NFL draft history
 *
 * Tier distribution for draft picks mirrors real NFL data:
 * - Blue Blood: ~25% of picks
 * - Elite: ~25% of picks
 * - Power 5: ~30% of picks
 * - Group of 5: ~12% of picks
 * - FCS: ~8% of picks
 */

export type CollegeTier = 'blue_blood' | 'elite' | 'power5' | 'group5' | 'fcs';

export interface College {
  name: string;
  mascot: string;
  conference: string;
  tier: CollegeTier;
}

// Tier 1: Blue Blood Programs (8) - Historically dominant, produce most elite talent
export const BLUE_BLOOD_COLLEGES: College[] = [
  { name: 'Alabama', mascot: 'Crimson Tide', conference: 'SEC', tier: 'blue_blood' },
  { name: 'Ohio State', mascot: 'Buckeyes', conference: 'Big Ten', tier: 'blue_blood' },
  { name: 'Georgia', mascot: 'Bulldogs', conference: 'SEC', tier: 'blue_blood' },
  { name: 'Clemson', mascot: 'Tigers', conference: 'ACC', tier: 'blue_blood' },
  { name: 'Michigan', mascot: 'Wolverines', conference: 'Big Ten', tier: 'blue_blood' },
  { name: 'LSU', mascot: 'Tigers', conference: 'SEC', tier: 'blue_blood' },
  { name: 'USC', mascot: 'Trojans', conference: 'Big Ten', tier: 'blue_blood' },
  { name: 'Oklahoma', mascot: 'Sooners', conference: 'SEC', tier: 'blue_blood' },
];

// Tier 2: Elite Programs (16) - Consistent top-tier production
export const ELITE_COLLEGES: College[] = [
  { name: 'Texas', mascot: 'Longhorns', conference: 'SEC', tier: 'elite' },
  { name: 'Florida', mascot: 'Gators', conference: 'SEC', tier: 'elite' },
  { name: 'Penn State', mascot: 'Nittany Lions', conference: 'Big Ten', tier: 'elite' },
  { name: 'Oregon', mascot: 'Ducks', conference: 'Big Ten', tier: 'elite' },
  { name: 'Notre Dame', mascot: 'Fighting Irish', conference: 'Independent', tier: 'elite' },
  { name: 'Auburn', mascot: 'Tigers', conference: 'SEC', tier: 'elite' },
  { name: 'Texas A&M', mascot: 'Aggies', conference: 'SEC', tier: 'elite' },
  { name: 'Florida State', mascot: 'Seminoles', conference: 'ACC', tier: 'elite' },
  { name: 'Miami', mascot: 'Hurricanes', conference: 'ACC', tier: 'elite' },
  { name: 'Wisconsin', mascot: 'Badgers', conference: 'Big Ten', tier: 'elite' },
  { name: 'Tennessee', mascot: 'Volunteers', conference: 'SEC', tier: 'elite' },
  { name: 'UCLA', mascot: 'Bruins', conference: 'Big Ten', tier: 'elite' },
  { name: 'Washington', mascot: 'Huskies', conference: 'Big Ten', tier: 'elite' },
  { name: 'Iowa', mascot: 'Hawkeyes', conference: 'Big Ten', tier: 'elite' },
  { name: 'South Carolina', mascot: 'Gamecocks', conference: 'SEC', tier: 'elite' },
  { name: 'Ole Miss', mascot: 'Rebels', conference: 'SEC', tier: 'elite' },
];

// Tier 3: Power 5 Programs (40) - Solid NFL pipeline
export const POWER5_COLLEGES: College[] = [
  // SEC
  { name: 'Kentucky', mascot: 'Wildcats', conference: 'SEC', tier: 'power5' },
  { name: 'Missouri', mascot: 'Tigers', conference: 'SEC', tier: 'power5' },
  { name: 'Arkansas', mascot: 'Razorbacks', conference: 'SEC', tier: 'power5' },
  { name: 'Mississippi State', mascot: 'Bulldogs', conference: 'SEC', tier: 'power5' },
  { name: 'Vanderbilt', mascot: 'Commodores', conference: 'SEC', tier: 'power5' },
  // Big Ten
  { name: 'Minnesota', mascot: 'Golden Gophers', conference: 'Big Ten', tier: 'power5' },
  { name: 'Michigan State', mascot: 'Spartans', conference: 'Big Ten', tier: 'power5' },
  { name: 'Nebraska', mascot: 'Cornhuskers', conference: 'Big Ten', tier: 'power5' },
  { name: 'Northwestern', mascot: 'Wildcats', conference: 'Big Ten', tier: 'power5' },
  { name: 'Purdue', mascot: 'Boilermakers', conference: 'Big Ten', tier: 'power5' },
  { name: 'Illinois', mascot: 'Fighting Illini', conference: 'Big Ten', tier: 'power5' },
  { name: 'Indiana', mascot: 'Hoosiers', conference: 'Big Ten', tier: 'power5' },
  { name: 'Maryland', mascot: 'Terrapins', conference: 'Big Ten', tier: 'power5' },
  { name: 'Rutgers', mascot: 'Scarlet Knights', conference: 'Big Ten', tier: 'power5' },
  // ACC
  { name: 'North Carolina', mascot: 'Tar Heels', conference: 'ACC', tier: 'power5' },
  { name: 'NC State', mascot: 'Wolfpack', conference: 'ACC', tier: 'power5' },
  { name: 'Virginia Tech', mascot: 'Hokies', conference: 'ACC', tier: 'power5' },
  { name: 'Pittsburgh', mascot: 'Panthers', conference: 'ACC', tier: 'power5' },
  { name: 'Louisville', mascot: 'Cardinals', conference: 'ACC', tier: 'power5' },
  { name: 'Syracuse', mascot: 'Orange', conference: 'ACC', tier: 'power5' },
  { name: 'Duke', mascot: 'Blue Devils', conference: 'ACC', tier: 'power5' },
  { name: 'Virginia', mascot: 'Cavaliers', conference: 'ACC', tier: 'power5' },
  { name: 'Wake Forest', mascot: 'Demon Deacons', conference: 'ACC', tier: 'power5' },
  { name: 'Boston College', mascot: 'Eagles', conference: 'ACC', tier: 'power5' },
  { name: 'Georgia Tech', mascot: 'Yellow Jackets', conference: 'ACC', tier: 'power5' },
  { name: 'SMU', mascot: 'Mustangs', conference: 'ACC', tier: 'power5' },
  { name: 'Stanford', mascot: 'Cardinal', conference: 'ACC', tier: 'power5' },
  { name: 'California', mascot: 'Golden Bears', conference: 'ACC', tier: 'power5' },
  // Big 12
  { name: 'Oklahoma State', mascot: 'Cowboys', conference: 'Big 12', tier: 'power5' },
  { name: 'Texas Tech', mascot: 'Red Raiders', conference: 'Big 12', tier: 'power5' },
  { name: 'TCU', mascot: 'Horned Frogs', conference: 'Big 12', tier: 'power5' },
  { name: 'Baylor', mascot: 'Bears', conference: 'Big 12', tier: 'power5' },
  { name: 'Kansas State', mascot: 'Wildcats', conference: 'Big 12', tier: 'power5' },
  { name: 'West Virginia', mascot: 'Mountaineers', conference: 'Big 12', tier: 'power5' },
  { name: 'Iowa State', mascot: 'Cyclones', conference: 'Big 12', tier: 'power5' },
  { name: 'Kansas', mascot: 'Jayhawks', conference: 'Big 12', tier: 'power5' },
  { name: 'BYU', mascot: 'Cougars', conference: 'Big 12', tier: 'power5' },
  { name: 'UCF', mascot: 'Knights', conference: 'Big 12', tier: 'power5' },
  { name: 'Cincinnati', mascot: 'Bearcats', conference: 'Big 12', tier: 'power5' },
  { name: 'Houston', mascot: 'Cougars', conference: 'Big 12', tier: 'power5' },
];

// Tier 4: Group of 5 Programs (30) - Occasional NFL contributors
export const GROUP5_COLLEGES: College[] = [
  // AAC
  { name: 'Memphis', mascot: 'Tigers', conference: 'AAC', tier: 'group5' },
  { name: 'Tulane', mascot: 'Green Wave', conference: 'AAC', tier: 'group5' },
  { name: 'SMU', mascot: 'Mustangs', conference: 'AAC', tier: 'group5' },
  { name: 'USF', mascot: 'Bulls', conference: 'AAC', tier: 'group5' },
  { name: 'Temple', mascot: 'Owls', conference: 'AAC', tier: 'group5' },
  { name: 'Navy', mascot: 'Midshipmen', conference: 'AAC', tier: 'group5' },
  { name: 'Army', mascot: 'Black Knights', conference: 'AAC', tier: 'group5' },
  { name: 'East Carolina', mascot: 'Pirates', conference: 'AAC', tier: 'group5' },
  { name: 'UAB', mascot: 'Blazers', conference: 'AAC', tier: 'group5' },
  { name: 'Tulsa', mascot: 'Golden Hurricane', conference: 'AAC', tier: 'group5' },
  // Mountain West
  { name: 'Boise State', mascot: 'Broncos', conference: 'Mountain West', tier: 'group5' },
  { name: 'San Diego State', mascot: 'Aztecs', conference: 'Mountain West', tier: 'group5' },
  { name: 'Fresno State', mascot: 'Bulldogs', conference: 'Mountain West', tier: 'group5' },
  { name: 'Air Force', mascot: 'Falcons', conference: 'Mountain West', tier: 'group5' },
  { name: 'Colorado State', mascot: 'Rams', conference: 'Mountain West', tier: 'group5' },
  { name: 'Wyoming', mascot: 'Cowboys', conference: 'Mountain West', tier: 'group5' },
  { name: 'Utah State', mascot: 'Aggies', conference: 'Mountain West', tier: 'group5' },
  { name: 'UNLV', mascot: 'Rebels', conference: 'Mountain West', tier: 'group5' },
  { name: 'Nevada', mascot: 'Wolf Pack', conference: 'Mountain West', tier: 'group5' },
  { name: 'New Mexico', mascot: 'Lobos', conference: 'Mountain West', tier: 'group5' },
  { name: 'San Jose State', mascot: 'Spartans', conference: 'Mountain West', tier: 'group5' },
  { name: 'Hawaii', mascot: 'Rainbow Warriors', conference: 'Mountain West', tier: 'group5' },
  // Sun Belt
  { name: 'Appalachian State', mascot: 'Mountaineers', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Coastal Carolina', mascot: 'Chanticleers', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Louisiana', mascot: 'Ragin Cajuns', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Troy', mascot: 'Trojans', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Arkansas State', mascot: 'Red Wolves', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Georgia State', mascot: 'Panthers', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Georgia Southern', mascot: 'Eagles', conference: 'Sun Belt', tier: 'group5' },
  { name: 'Marshall', mascot: 'Thundering Herd', conference: 'Sun Belt', tier: 'group5' },
];

// Tier 5: FCS Programs (36) - Diamond in the rough prospects
export const FCS_COLLEGES: College[] = [
  { name: 'North Dakota State', mascot: 'Bison', conference: 'MVFC', tier: 'fcs' },
  { name: 'James Madison', mascot: 'Dukes', conference: 'Sun Belt', tier: 'fcs' },
  { name: 'Montana', mascot: 'Grizzlies', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Montana State', mascot: 'Bobcats', conference: 'Big Sky', tier: 'fcs' },
  { name: 'South Dakota State', mascot: 'Jackrabbits', conference: 'MVFC', tier: 'fcs' },
  { name: 'Sacramento State', mascot: 'Hornets', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Villanova', mascot: 'Wildcats', conference: 'CAA', tier: 'fcs' },
  { name: 'Delaware', mascot: 'Blue Hens', conference: 'CAA', tier: 'fcs' },
  { name: 'William & Mary', mascot: 'Tribe', conference: 'CAA', tier: 'fcs' },
  { name: 'Richmond', mascot: 'Spiders', conference: 'CAA', tier: 'fcs' },
  { name: 'New Hampshire', mascot: 'Wildcats', conference: 'CAA', tier: 'fcs' },
  { name: 'Maine', mascot: 'Black Bears', conference: 'CAA', tier: 'fcs' },
  { name: 'Towson', mascot: 'Tigers', conference: 'CAA', tier: 'fcs' },
  { name: 'Eastern Washington', mascot: 'Eagles', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Weber State', mascot: 'Wildcats', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Northern Iowa', mascot: 'Panthers', conference: 'MVFC', tier: 'fcs' },
  { name: 'Illinois State', mascot: 'Redbirds', conference: 'MVFC', tier: 'fcs' },
  { name: 'Youngstown State', mascot: 'Penguins', conference: 'MVFC', tier: 'fcs' },
  { name: 'North Dakota', mascot: 'Fighting Hawks', conference: 'MVFC', tier: 'fcs' },
  { name: 'South Dakota', mascot: 'Coyotes', conference: 'MVFC', tier: 'fcs' },
  { name: 'Indiana State', mascot: 'Sycamores', conference: 'MVFC', tier: 'fcs' },
  { name: 'Missouri State', mascot: 'Bears', conference: 'MVFC', tier: 'fcs' },
  { name: 'Southeastern Louisiana', mascot: 'Lions', conference: 'Southland', tier: 'fcs' },
  { name: 'Sam Houston', mascot: 'Bearkats', conference: 'C-USA', tier: 'fcs' },
  { name: 'Jacksonville State', mascot: 'Gamecocks', conference: 'C-USA', tier: 'fcs' },
  { name: 'Chattanooga', mascot: 'Mocs', conference: 'SoCon', tier: 'fcs' },
  { name: 'Wofford', mascot: 'Terriers', conference: 'SoCon', tier: 'fcs' },
  { name: 'Furman', mascot: 'Paladins', conference: 'SoCon', tier: 'fcs' },
  { name: 'The Citadel', mascot: 'Bulldogs', conference: 'SoCon', tier: 'fcs' },
  { name: 'Eastern Kentucky', mascot: 'Colonels', conference: 'ASUN', tier: 'fcs' },
  { name: 'UC Davis', mascot: 'Aggies', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Idaho', mascot: 'Vandals', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Portland State', mascot: 'Vikings', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Cal Poly', mascot: 'Mustangs', conference: 'Big Sky', tier: 'fcs' },
  { name: 'Harvard', mascot: 'Crimson', conference: 'Ivy League', tier: 'fcs' },
  { name: 'Yale', mascot: 'Bulldogs', conference: 'Ivy League', tier: 'fcs' },
];

// Combined list of all colleges
export const ALL_COLLEGES: College[] = [
  ...BLUE_BLOOD_COLLEGES,
  ...ELITE_COLLEGES,
  ...POWER5_COLLEGES,
  ...GROUP5_COLLEGES,
  ...FCS_COLLEGES,
];

// Tier weights for random selection (matches NFL draft distribution)
export const TIER_WEIGHTS: Record<CollegeTier, number> = {
  blue_blood: 0.25,  // 25% of picks
  elite: 0.25,       // 25% of picks
  power5: 0.30,      // 30% of picks
  group5: 0.12,      // 12% of picks
  fcs: 0.08,         // 8% of picks
};

// Early round bonus (top prospects more likely from top programs)
export const EARLY_ROUND_TIER_WEIGHTS: Record<CollegeTier, number> = {
  blue_blood: 0.40,  // 40% of R1-2 picks
  elite: 0.30,       // 30% of R1-2 picks
  power5: 0.22,      // 22% of R1-2 picks
  group5: 0.06,      // 6% of R1-2 picks
  fcs: 0.02,         // 2% of R1-2 picks
};

/**
 * Get colleges by tier
 */
export function getCollegesByTier(tier: CollegeTier): College[] {
  switch (tier) {
    case 'blue_blood':
      return BLUE_BLOOD_COLLEGES;
    case 'elite':
      return ELITE_COLLEGES;
    case 'power5':
      return POWER5_COLLEGES;
    case 'group5':
      return GROUP5_COLLEGES;
    case 'fcs':
      return FCS_COLLEGES;
    default:
      return POWER5_COLLEGES;
  }
}

/**
 * Select a random college tier based on weights
 */
export function selectRandomTier(
  weights: Record<CollegeTier, number> = TIER_WEIGHTS,
  randomFn: () => number = Math.random
): CollegeTier {
  const roll = randomFn();
  let cumulative = 0;

  for (const [tier, weight] of Object.entries(weights) as [CollegeTier, number][]) {
    cumulative += weight;
    if (roll < cumulative) {
      return tier;
    }
  }

  return 'power5'; // Fallback
}

/**
 * Select a random college with proper weighting by tier
 * @param round - Draft round (1-7), affects tier weighting
 * @param randomFn - Optional random function for testing
 */
export function selectRandomCollege(
  round: number = 4,
  randomFn: () => number = Math.random
): College {
  // Use early round weights for rounds 1-2
  const weights = round <= 2 ? EARLY_ROUND_TIER_WEIGHTS : TIER_WEIGHTS;
  const tier = selectRandomTier(weights, randomFn);
  const colleges = getCollegesByTier(tier);

  const index = Math.floor(randomFn() * colleges.length);
  return colleges[index];
}

/**
 * Get college by name
 */
export function getCollegeByName(name: string): College | undefined {
  return ALL_COLLEGES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get total college count
 */
export function getTotalCollegeCount(): number {
  return ALL_COLLEGES.length;
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: CollegeTier): string {
  switch (tier) {
    case 'blue_blood':
      return 'Blue Blood';
    case 'elite':
      return 'Elite';
    case 'power5':
      return 'Power 5';
    case 'group5':
      return 'Group of 5';
    case 'fcs':
      return 'FCS';
    default:
      return tier;
  }
}
