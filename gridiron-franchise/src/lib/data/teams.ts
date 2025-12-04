/**
 * League Teams Data
 *
 * All 32 teams with their conference, division, and brand colors.
 * Separated from generators to allow client-side imports.
 */

export interface TeamInfo {
  id: string;
  city: string;
  name: string;
  conference: string;
  division: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const LEAGUE_TEAMS: TeamInfo[] = [
  // Atlantic North
  { id: 'BOS', city: 'Boston', name: 'Rebels', conference: 'Atlantic', division: 'Atlantic North', colors: { primary: '#0A2240', secondary: '#A8A9AD' } },
  { id: 'PHI', city: 'Philadelphia', name: 'Ironworks', conference: 'Atlantic', division: 'Atlantic North', colors: { primary: '#5A5A5A', secondary: '#B7410E' } },
  { id: 'PIT', city: 'Pittsburgh', name: 'Riverhawks', conference: 'Atlantic', division: 'Atlantic North', colors: { primary: '#101820', secondary: '#FFB612' } },
  { id: 'BAL', city: 'Baltimore', name: 'Knights', conference: 'Atlantic', division: 'Atlantic North', colors: { primary: '#4B0082', secondary: '#CFB53B' } },
  // Atlantic South
  { id: 'MIA', city: 'Miami', name: 'Sharks', conference: 'Atlantic', division: 'Atlantic South', colors: { primary: '#008E97', secondary: '#FF6F61' } },
  { id: 'ORL', city: 'Orlando', name: 'Thunder', conference: 'Atlantic', division: 'Atlantic South', colors: { primary: '#0057B8', secondary: '#FFFFFF' } },
  { id: 'ATL', city: 'Atlanta', name: 'Firebirds', conference: 'Atlantic', division: 'Atlantic South', colors: { primary: '#CE1141', secondary: '#FDBB30' } },
  { id: 'CLT', city: 'Charlotte', name: 'Crowns', conference: 'Atlantic', division: 'Atlantic South', colors: { primary: '#5C2D91', secondary: '#C0C0C0' } },
  // Atlantic East
  { id: 'NYE', city: 'New York', name: 'Empire', conference: 'Atlantic', division: 'Atlantic East', colors: { primary: '#0C2340', secondary: '#FF5F00' } },
  { id: 'BKN', city: 'Brooklyn', name: 'Bolts', conference: 'Atlantic', division: 'Atlantic East', colors: { primary: '#FFD100', secondary: '#1A1A1A' } },
  { id: 'NWK', city: 'Newark', name: 'Sentinels', conference: 'Atlantic', division: 'Atlantic East', colors: { primary: '#154734', secondary: '#A8A9AD' } },
  { id: 'WAS', city: 'Washington', name: 'Monuments', conference: 'Atlantic', division: 'Atlantic East', colors: { primary: '#F5F5F5', secondary: '#002244' } },
  // Atlantic West
  { id: 'CHI', city: 'Chicago', name: 'Blaze', conference: 'Atlantic', division: 'Atlantic West', colors: { primary: '#FF6720', secondary: '#1A1A1A' } },
  { id: 'DET', city: 'Detroit', name: 'Engines', conference: 'Atlantic', division: 'Atlantic West', colors: { primary: '#0076B6', secondary: '#B0B7BC' } },
  { id: 'CLE', city: 'Cleveland', name: 'Forge', conference: 'Atlantic', division: 'Atlantic West', colors: { primary: '#EB3300', secondary: '#4C2600' } },
  { id: 'IND', city: 'Indianapolis', name: 'Stampede', conference: 'Atlantic', division: 'Atlantic West', colors: { primary: '#003DA5', secondary: '#FFFFFF' } },
  // Pacific North
  { id: 'SEA', city: 'Seattle', name: 'Storm', conference: 'Pacific', division: 'Pacific North', colors: { primary: '#006B77', secondary: '#69FF47' } },
  { id: 'POR', city: 'Portland', name: 'Timbers', conference: 'Pacific', division: 'Pacific North', colors: { primary: '#00482B', secondary: '#EBE5D5' } },
  { id: 'VAN', city: 'Vancouver', name: 'Grizzlies', conference: 'Pacific', division: 'Pacific North', colors: { primary: '#3D291A', secondary: '#A5D8E6' } },
  { id: 'DEN', city: 'Denver', name: 'Summit', conference: 'Pacific', division: 'Pacific North', colors: { primary: '#5DADE2', secondary: '#FFFFFF' } },
  // Pacific South
  { id: 'LAL', city: 'Los Angeles', name: 'Legends', conference: 'Pacific', division: 'Pacific South', colors: { primary: '#FFC72C', secondary: '#1A1A1A' } },
  { id: 'SDS', city: 'San Diego', name: 'Surf', conference: 'Pacific', division: 'Pacific South', colors: { primary: '#0077BE', secondary: '#C9B037' } },
  { id: 'LVA', city: 'Las Vegas', name: 'Aces', conference: 'Pacific', division: 'Pacific South', colors: { primary: '#1A1A1A', secondary: '#C5B358' } },
  { id: 'PHX', city: 'Phoenix', name: 'Scorpions', conference: 'Pacific', division: 'Pacific South', colors: { primary: '#C41E3A', secondary: '#C2B280' } },
  // Pacific East
  { id: 'AUS', city: 'Austin', name: 'Outlaws', conference: 'Pacific', division: 'Pacific East', colors: { primary: '#1A1A1A', secondary: '#BF5700' } },
  { id: 'HOU', city: 'Houston', name: 'Marshals', conference: 'Pacific', division: 'Pacific East', colors: { primary: '#002D62', secondary: '#CC0000' } },
  { id: 'DAL', city: 'Dallas', name: 'Lone Stars', conference: 'Pacific', division: 'Pacific East', colors: { primary: '#8A8D8F', secondary: '#002B5C' } },
  { id: 'SAN', city: 'San Antonio', name: 'Bandits', conference: 'Pacific', division: 'Pacific East', colors: { primary: '#1A1A1A', secondary: '#E31C79' } },
  // Pacific West
  { id: 'SFO', city: 'San Francisco', name: 'Gold Rush', conference: 'Pacific', division: 'Pacific West', colors: { primary: '#FFB81C', secondary: '#B3002D' } },
  { id: 'OAK', city: 'Oakland', name: 'Raiders', conference: 'Pacific', division: 'Pacific West', colors: { primary: '#A5ACAF', secondary: '#1A1A1A' } },
  { id: 'SAC', city: 'Sacramento', name: 'Kings', conference: 'Pacific', division: 'Pacific West', colors: { primary: '#5A2D82', secondary: '#8E9093' } },
  { id: 'HON', city: 'Honolulu', name: 'Volcanoes', conference: 'Pacific', division: 'Pacific West', colors: { primary: '#CF1020', secondary: '#1A1A1A' } },
];

// Helper functions
export function getTeamById(id: string): TeamInfo | undefined {
  return LEAGUE_TEAMS.find((team) => team.id === id);
}

export function getTeamsByDivision(division: string): TeamInfo[] {
  return LEAGUE_TEAMS.filter((team) => team.division === division);
}

export function getTeamsByConference(conference: string): TeamInfo[] {
  return LEAGUE_TEAMS.filter((team) => team.conference === conference);
}
