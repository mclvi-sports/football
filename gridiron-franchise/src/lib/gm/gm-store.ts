/**
 * GM Store
 *
 * SessionStorage-based persistence for generated GMs.
 */

import type { LeagueGMs, GM } from './types';

const GM_KEY = 'dev-generated-gms';

/**
 * Store all league GMs to session storage
 */
export function storeGMs(gms: LeagueGMs): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(GM_KEY, JSON.stringify(gms));
  }
}

/**
 * Get all league GMs from session storage
 */
export function getGMs(): LeagueGMs | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(GM_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Clear all league GMs from session storage
 */
export function clearGMs(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(GM_KEY);
  }
}

/**
 * Get the player's GM
 */
export function getPlayerGM(): GM | null {
  const gms = getGMs();
  return gms?.playerGM || null;
}

/**
 * Get the player's team ID
 */
export function getPlayerTeamId(): string | null {
  const gms = getGMs();
  return gms?.playerTeamId || null;
}

/**
 * Get a specific team's GM
 */
export function getTeamGM(teamId: string): GM | null {
  const gms = getGMs();
  if (!gms) return null;

  if (teamId === gms.playerTeamId) {
    return gms.playerGM;
  }
  return gms.cpuGMs[teamId] || null;
}

/**
 * Get all GMs as an array (including player)
 */
export function getAllGMsList(): GM[] {
  const gms = getGMs();
  if (!gms) return [];

  return [gms.playerGM, ...Object.values(gms.cpuGMs)];
}

/**
 * Check if GMs have been generated
 */
export function hasGMs(): boolean {
  return getGMs() !== null;
}
