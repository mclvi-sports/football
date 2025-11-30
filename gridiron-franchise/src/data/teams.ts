export interface Team {
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  division: string;
  conference: "Atlantic" | "Pacific";
  colors: {
    primary: string;
    secondary: string;
  };
}

export const teams: Team[] = [
  // Atlantic North
  {
    id: "bos",
    city: "Boston",
    name: "Rebels",
    abbreviation: "B",
    division: "Atlantic North",
    conference: "Atlantic",
    colors: { primary: "#0A2240", secondary: "#A8A9AD" },
  },
  {
    id: "phi",
    city: "Philadelphia",
    name: "Ironworks",
    abbreviation: "P",
    division: "Atlantic North",
    conference: "Atlantic",
    colors: { primary: "#5A5A5A", secondary: "#B7410E" },
  },
  {
    id: "pit",
    city: "Pittsburgh",
    name: "Riverhawks",
    abbreviation: "P",
    division: "Atlantic North",
    conference: "Atlantic",
    colors: { primary: "#101820", secondary: "#FFB612" },
  },
  {
    id: "bal",
    city: "Baltimore",
    name: "Knights",
    abbreviation: "B",
    division: "Atlantic North",
    conference: "Atlantic",
    colors: { primary: "#4B0082", secondary: "#CFB53B" },
  },

  // Atlantic South
  {
    id: "mia",
    city: "Miami",
    name: "Sharks",
    abbreviation: "M",
    division: "Atlantic South",
    conference: "Atlantic",
    colors: { primary: "#008E97", secondary: "#FF6F61" },
  },
  {
    id: "orl",
    city: "Orlando",
    name: "Thunder",
    abbreviation: "O",
    division: "Atlantic South",
    conference: "Atlantic",
    colors: { primary: "#0057B8", secondary: "#FFFFFF" },
  },
  {
    id: "atl",
    city: "Atlanta",
    name: "Firebirds",
    abbreviation: "A",
    division: "Atlantic South",
    conference: "Atlantic",
    colors: { primary: "#CE1141", secondary: "#FDBB30" },
  },
  {
    id: "cha",
    city: "Charlotte",
    name: "Crowns",
    abbreviation: "C",
    division: "Atlantic South",
    conference: "Atlantic",
    colors: { primary: "#5C2D91", secondary: "#C0C0C0" },
  },

  // Atlantic East
  {
    id: "nyc",
    city: "New York",
    name: "Empire",
    abbreviation: "N",
    division: "Atlantic East",
    conference: "Atlantic",
    colors: { primary: "#0C2340", secondary: "#FF5F00" },
  },
  {
    id: "bkn",
    city: "Brooklyn",
    name: "Bolts",
    abbreviation: "B",
    division: "Atlantic East",
    conference: "Atlantic",
    colors: { primary: "#FFD100", secondary: "#1A1A1A" },
  },
  {
    id: "nwk",
    city: "Newark",
    name: "Sentinels",
    abbreviation: "N",
    division: "Atlantic East",
    conference: "Atlantic",
    colors: { primary: "#154734", secondary: "#A8A9AD" },
  },
  {
    id: "was",
    city: "Washington",
    name: "Monuments",
    abbreviation: "W",
    division: "Atlantic East",
    conference: "Atlantic",
    colors: { primary: "#F5F5F5", secondary: "#002244" },
  },

  // Atlantic West
  {
    id: "chi",
    city: "Chicago",
    name: "Blaze",
    abbreviation: "C",
    division: "Atlantic West",
    conference: "Atlantic",
    colors: { primary: "#FF6720", secondary: "#1A1A1A" },
  },
  {
    id: "det",
    city: "Detroit",
    name: "Engines",
    abbreviation: "D",
    division: "Atlantic West",
    conference: "Atlantic",
    colors: { primary: "#0076B6", secondary: "#B0B7BC" },
  },
  {
    id: "cle",
    city: "Cleveland",
    name: "Forge",
    abbreviation: "C",
    division: "Atlantic West",
    conference: "Atlantic",
    colors: { primary: "#EB3300", secondary: "#4C2600" },
  },
  {
    id: "ind",
    city: "Indianapolis",
    name: "Stampede",
    abbreviation: "I",
    division: "Atlantic West",
    conference: "Atlantic",
    colors: { primary: "#003DA5", secondary: "#FFFFFF" },
  },

  // Pacific North
  {
    id: "sea",
    city: "Seattle",
    name: "Storm",
    abbreviation: "S",
    division: "Pacific North",
    conference: "Pacific",
    colors: { primary: "#006B77", secondary: "#69FF47" },
  },
  {
    id: "por",
    city: "Portland",
    name: "Timbers",
    abbreviation: "P",
    division: "Pacific North",
    conference: "Pacific",
    colors: { primary: "#00482B", secondary: "#EBE5D5" },
  },
  {
    id: "van",
    city: "Vancouver",
    name: "Grizzlies",
    abbreviation: "V",
    division: "Pacific North",
    conference: "Pacific",
    colors: { primary: "#3D291A", secondary: "#A5D8E6" },
  },
  {
    id: "den",
    city: "Denver",
    name: "Summit",
    abbreviation: "D",
    division: "Pacific North",
    conference: "Pacific",
    colors: { primary: "#5DADE2", secondary: "#FFFFFF" },
  },

  // Pacific South
  {
    id: "lax",
    city: "Los Angeles",
    name: "Legends",
    abbreviation: "L",
    division: "Pacific South",
    conference: "Pacific",
    colors: { primary: "#FFC72C", secondary: "#1A1A1A" },
  },
  {
    id: "sdg",
    city: "San Diego",
    name: "Surf",
    abbreviation: "S",
    division: "Pacific South",
    conference: "Pacific",
    colors: { primary: "#0077BE", secondary: "#C9B037" },
  },
  {
    id: "lvg",
    city: "Las Vegas",
    name: "Aces",
    abbreviation: "L",
    division: "Pacific South",
    conference: "Pacific",
    colors: { primary: "#1A1A1A", secondary: "#C5B358" },
  },
  {
    id: "phx",
    city: "Phoenix",
    name: "Scorpions",
    abbreviation: "P",
    division: "Pacific South",
    conference: "Pacific",
    colors: { primary: "#C41E3A", secondary: "#C2B280" },
  },

  // Pacific East
  {
    id: "aus",
    city: "Austin",
    name: "Outlaws",
    abbreviation: "A",
    division: "Pacific East",
    conference: "Pacific",
    colors: { primary: "#1A1A1A", secondary: "#BF5700" },
  },
  {
    id: "hou",
    city: "Houston",
    name: "Marshals",
    abbreviation: "H",
    division: "Pacific East",
    conference: "Pacific",
    colors: { primary: "#002D62", secondary: "#CC0000" },
  },
  {
    id: "dal",
    city: "Dallas",
    name: "Lone Stars",
    abbreviation: "D",
    division: "Pacific East",
    conference: "Pacific",
    colors: { primary: "#8A8D8F", secondary: "#002B5C" },
  },
  {
    id: "sat",
    city: "San Antonio",
    name: "Bandits",
    abbreviation: "S",
    division: "Pacific East",
    conference: "Pacific",
    colors: { primary: "#1A1A1A", secondary: "#E31C79" },
  },

  // Pacific West
  {
    id: "sfo",
    city: "San Francisco",
    name: "Gold Rush",
    abbreviation: "S",
    division: "Pacific West",
    conference: "Pacific",
    colors: { primary: "#FFB81C", secondary: "#B3002D" },
  },
  {
    id: "oak",
    city: "Oakland",
    name: "Raiders",
    abbreviation: "O",
    division: "Pacific West",
    conference: "Pacific",
    colors: { primary: "#A5ACAF", secondary: "#1A1A1A" },
  },
  {
    id: "sac",
    city: "Sacramento",
    name: "Kings",
    abbreviation: "S",
    division: "Pacific West",
    conference: "Pacific",
    colors: { primary: "#5A2D82", secondary: "#8E9093" },
  },
  {
    id: "hnl",
    city: "Honolulu",
    name: "Volcanoes",
    abbreviation: "H",
    division: "Pacific West",
    conference: "Pacific",
    colors: { primary: "#CF1020", secondary: "#1A1A1A" },
  },
];

export const divisions = [
  "Atlantic North",
  "Atlantic South",
  "Atlantic East",
  "Atlantic West",
  "Pacific North",
  "Pacific South",
  "Pacific East",
  "Pacific West",
] as const;

export type Division = (typeof divisions)[number];

export function getTeamsByDivision(division: Division): Team[] {
  return teams.filter((team) => team.division === division);
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id);
}
