/**
 * Simple in-memory store for dev-generated players and teams
 * Uses sessionStorage to persist across page navigations
 */

import { Player, Position, Tier } from "./types";

const STORAGE_KEY = "dev-generated-players";
const TEAM_ROSTER_KEY = "dev-selected-team-roster";
const FULL_GAME_KEY = "dev-full-game-data";
const FREE_AGENTS_KEY = "dev-free-agents";
const DRAFT_CLASS_KEY = "dev-draft-class";

// Team roster data structure
export interface TeamRosterData {
  team: {
    id: string;
    city: string;
    name: string;
    conference: string;
    division: string;
  };
  tier: Tier;
  roster: {
    players: Player[];
    depthChart: Record<Position, string[]>;
  };
  stats: {
    totalPlayers: number;
    avgOvr: number;
    avgAge: number;
  };
}

export function storeDevPlayers(players: Player[]): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }
}

export function getDevPlayers(): Player[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getDevPlayerById(id: string): Player | null {
  // First check dev players store
  const players = getDevPlayers();
  const found = players.find((p) => p.id === id);
  if (found) return found;

  // Fallback: search full game data
  const fullGame = getFullGameData();
  if (fullGame) {
    for (const team of fullGame.teams) {
      const player = team.roster.players.find((p) => p.id === id);
      if (player) return player;
    }
  }

  // Fallback: search free agents
  const freeAgents = getFreeAgents();
  const fa = freeAgents.find((p) => p.id === id);
  if (fa) return fa;

  // Fallback: search draft class
  const draftClass = getDraftClass();
  const prospect = draftClass.find((p) => p.id === id);
  if (prospect) return prospect;

  return null;
}

export function clearDevPlayers(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

// Team roster functions
export function storeTeamRoster(teamData: TeamRosterData): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TEAM_ROSTER_KEY, JSON.stringify(teamData));
    // Also store the team's players so they can be viewed individually
    storeDevPlayers(teamData.roster.players);
  }
}

export function getTeamRoster(): TeamRosterData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(TEAM_ROSTER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearTeamRoster(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TEAM_ROSTER_KEY);
  }
}

// Full game data (all 32 teams with rosters)
export interface FullGameData {
  teams: TeamRosterData[];
  generatedAt: string;
  totalPlayers: number;
  tierDistribution: Record<string, number>;
}

export function storeFullGameData(data: FullGameData): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(FULL_GAME_KEY, JSON.stringify(data));
    // Also store all players so they can be looked up by ID
    const allPlayers = data.teams.flatMap((t) => t.roster.players);
    storeDevPlayers(allPlayers);
  }
}

export function getFullGameData(): FullGameData | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(FULL_GAME_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearFullGameData(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(FULL_GAME_KEY);
  }
}

export function getTeamById(teamId: string): TeamRosterData | null {
  const fullGame = getFullGameData();
  if (!fullGame) return null;
  return fullGame.teams.find((t) => t.team.id === teamId) || null;
}

// Free Agents storage
export function storeFreeAgents(players: Player[]): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(FREE_AGENTS_KEY, JSON.stringify(players));
  }
}

export function getFreeAgents(): Player[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(FREE_AGENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearFreeAgents(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(FREE_AGENTS_KEY);
  }
}

// Draft Class storage
export function storeDraftClass(players: Player[]): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(DRAFT_CLASS_KEY, JSON.stringify(players));
  }
}

export function getDraftClass(): Player[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(DRAFT_CLASS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearDraftClass(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(DRAFT_CLASS_KEY);
  }
}
