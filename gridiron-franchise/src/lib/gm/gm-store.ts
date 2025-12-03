/**
 * GM Store
 *
 * SessionStorage-based persistence for generated GMs.
 * Supports both Player GM mode and Owner mode.
 */

import type { LeagueGMs, OwnerModeGMs, GM } from './types';

const GM_KEY = 'dev-generated-gms';
const OWNER_GM_KEY = 'owner-mode-gms';

// ============================================================================
// LEGACY PLAYER GM MODE (for dev tools backward compatibility)
// ============================================================================

/**
 * Store all league GMs to session storage (Player GM mode)
 */
export function storeGMs(gms: LeagueGMs): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(GM_KEY, JSON.stringify(gms));
  }
}

/**
 * Get all league GMs from session storage (Player GM mode)
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
    sessionStorage.removeItem(OWNER_GM_KEY);
  }
}

// ============================================================================
// OWNER MODE (new career flow)
// ============================================================================

/**
 * Store Owner mode GMs (all 32 CPU-generated)
 */
export function storeOwnerModeGMs(gms: Record<string, GM>): void {
  if (typeof window !== 'undefined') {
    const ownerData: OwnerModeGMs = {
      mode: 'owner',
      allGMs: gms,
      playerTeamId: null,
      generatedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(OWNER_GM_KEY, JSON.stringify(ownerData));
  }
}

/**
 * Get Owner mode GMs
 */
export function getOwnerModeGMs(): OwnerModeGMs | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(OWNER_GM_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Set player's team in Owner mode
 */
export function setOwnerTeam(teamId: string): void {
  const ownerGMs = getOwnerModeGMs();
  if (ownerGMs && typeof window !== 'undefined') {
    ownerGMs.playerTeamId = teamId;
    sessionStorage.setItem(OWNER_GM_KEY, JSON.stringify(ownerGMs));
  }
}

/**
 * Check if in Owner mode
 */
export function isOwnerMode(): boolean {
  return getOwnerModeGMs() !== null;
}

// ============================================================================
// UNIFIED ACCESSORS (work with both modes)
// ============================================================================

/**
 * Get the player's GM (works with both modes)
 */
export function getPlayerGM(): GM | null {
  // Check Owner mode first
  const ownerGMs = getOwnerModeGMs();
  if (ownerGMs && ownerGMs.playerTeamId) {
    return ownerGMs.allGMs[ownerGMs.playerTeamId] || null;
  }

  // Fall back to Player GM mode
  const gms = getGMs();
  return gms?.playerGM || null;
}

/**
 * Get the player's team ID (works with both modes)
 */
export function getPlayerTeamId(): string | null {
  // Check Owner mode first
  const ownerGMs = getOwnerModeGMs();
  if (ownerGMs) {
    return ownerGMs.playerTeamId;
  }

  // Fall back to Player GM mode
  const gms = getGMs();
  return gms?.playerTeamId || null;
}

/**
 * Get a specific team's GM (works with both modes)
 */
export function getTeamGM(teamId: string): GM | null {
  // Check Owner mode first
  const ownerGMs = getOwnerModeGMs();
  if (ownerGMs) {
    return ownerGMs.allGMs[teamId] || null;
  }

  // Fall back to Player GM mode
  const gms = getGMs();
  if (!gms) return null;

  if (teamId === gms.playerTeamId) {
    return gms.playerGM;
  }
  return gms.cpuGMs[teamId] || null;
}

/**
 * Get all GMs as an array (works with both modes)
 */
export function getAllGMsList(): GM[] {
  // Check Owner mode first
  const ownerGMs = getOwnerModeGMs();
  if (ownerGMs) {
    return Object.values(ownerGMs.allGMs);
  }

  // Fall back to Player GM mode
  const gms = getGMs();
  if (!gms) return [];

  return [gms.playerGM, ...Object.values(gms.cpuGMs)];
}

/**
 * Check if GMs have been generated (either mode)
 */
export function hasGMs(): boolean {
  return getGMs() !== null || getOwnerModeGMs() !== null;
}
