/**
 * Facilities Store
 *
 * SessionStorage-based persistence for generated facilities.
 */

import { LeagueFacilities, TeamFacilities, FacilitiesStats } from './types';
import { getFacilitiesStats } from './facilities-generator';

const FACILITIES_KEY = 'dev-generated-facilities';

export function storeFacilities(facilities: LeagueFacilities): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(FACILITIES_KEY, JSON.stringify(facilities));
  }
}

export function getFacilities(): LeagueFacilities | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(FACILITIES_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearFacilities(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(FACILITIES_KEY);
  }
}

export function getTeamFacilitiesById(teamId: string): TeamFacilities | null {
  const facilities = getFacilities();
  if (!facilities) return null;
  return facilities.teams[teamId] || null;
}

export function getCachedStats(): FacilitiesStats | null {
  const facilities = getFacilities();
  if (!facilities) return null;
  return getFacilitiesStats(facilities);
}

export function getTeamsByOwnerTier(tier: string): TeamFacilities[] {
  const facilities = getFacilities();
  if (!facilities) return [];
  return Object.values(facilities.teams).filter((t) => t.ownerTier === tier);
}

export function getTopTeams(count: number = 5): TeamFacilities[] {
  const facilities = getFacilities();
  if (!facilities) return [];
  return Object.values(facilities.teams)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, count);
}

export function getBottomTeams(count: number = 5): TeamFacilities[] {
  const facilities = getFacilities();
  if (!facilities) return [];
  return Object.values(facilities.teams)
    .sort((a, b) => a.averageRating - b.averageRating)
    .slice(0, count);
}
