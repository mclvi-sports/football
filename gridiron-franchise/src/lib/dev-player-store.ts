/**
 * Simple in-memory store for dev-generated players
 * Uses sessionStorage to persist across page navigations
 */

import { Player } from "./types";

const STORAGE_KEY = "dev-generated-players";

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
  const players = getDevPlayers();
  return players.find((p) => p.id === id) || null;
}

export function clearDevPlayers(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
