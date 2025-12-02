/**
 * League Teams Data
 *
 * All 32 teams with their conference and division info.
 * Separated from generators to allow client-side imports.
 */

export interface TeamInfo {
  id: string;
  city: string;
  name: string;
  conference: string;
  division: string;
}

export const LEAGUE_TEAMS: TeamInfo[] = [
  // Atlantic Conference
  { id: 'BOS', city: 'Boston', name: 'Rebels', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'PHI', city: 'Philadelphia', name: 'Ironworks', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'PIT', city: 'Pittsburgh', name: 'Riverhawks', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'BAL', city: 'Baltimore', name: 'Knights', conference: 'Atlantic', division: 'Atlantic North' },
  { id: 'MIA', city: 'Miami', name: 'Sharks', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'ORL', city: 'Orlando', name: 'Thunder', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'ATL', city: 'Atlanta', name: 'Firebirds', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'CLT', city: 'Charlotte', name: 'Crowns', conference: 'Atlantic', division: 'Atlantic South' },
  { id: 'NYE', city: 'New York', name: 'Empire', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'BKN', city: 'Brooklyn', name: 'Bolts', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'NWK', city: 'Newark', name: 'Sentinels', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'WAS', city: 'Washington', name: 'Monuments', conference: 'Atlantic', division: 'Atlantic East' },
  { id: 'CHI', city: 'Chicago', name: 'Blaze', conference: 'Atlantic', division: 'Atlantic West' },
  { id: 'DET', city: 'Detroit', name: 'Engines', conference: 'Atlantic', division: 'Atlantic West' },
  { id: 'CLE', city: 'Cleveland', name: 'Forge', conference: 'Atlantic', division: 'Atlantic West' },
  { id: 'IND', city: 'Indianapolis', name: 'Stampede', conference: 'Atlantic', division: 'Atlantic West' },
  // Pacific Conference
  { id: 'SEA', city: 'Seattle', name: 'Storm', conference: 'Pacific', division: 'Pacific North' },
  { id: 'POR', city: 'Portland', name: 'Timbers', conference: 'Pacific', division: 'Pacific North' },
  { id: 'VAN', city: 'Vancouver', name: 'Grizzlies', conference: 'Pacific', division: 'Pacific North' },
  { id: 'DEN', city: 'Denver', name: 'Summit', conference: 'Pacific', division: 'Pacific North' },
  { id: 'LAL', city: 'Los Angeles', name: 'Legends', conference: 'Pacific', division: 'Pacific South' },
  { id: 'SDS', city: 'San Diego', name: 'Surf', conference: 'Pacific', division: 'Pacific South' },
  { id: 'LVA', city: 'Las Vegas', name: 'Aces', conference: 'Pacific', division: 'Pacific South' },
  { id: 'PHX', city: 'Phoenix', name: 'Scorpions', conference: 'Pacific', division: 'Pacific South' },
  { id: 'AUS', city: 'Austin', name: 'Outlaws', conference: 'Pacific', division: 'Pacific East' },
  { id: 'HOU', city: 'Houston', name: 'Marshals', conference: 'Pacific', division: 'Pacific East' },
  { id: 'DAL', city: 'Dallas', name: 'Lone Stars', conference: 'Pacific', division: 'Pacific East' },
  { id: 'SAN', city: 'San Antonio', name: 'Bandits', conference: 'Pacific', division: 'Pacific East' },
  { id: 'SFO', city: 'San Francisco', name: 'Gold Rush', conference: 'Pacific', division: 'Pacific West' },
  { id: 'OAK', city: 'Oakland', name: 'Raiders', conference: 'Pacific', division: 'Pacific West' },
  { id: 'SAC', city: 'Sacramento', name: 'Kings', conference: 'Pacific', division: 'Pacific West' },
  { id: 'HON', city: 'Honolulu', name: 'Volcanoes', conference: 'Pacific', division: 'Pacific West' },
];
