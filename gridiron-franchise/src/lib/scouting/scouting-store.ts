/**
 * Scouting Store
 *
 * SessionStorage-based persistence for generated scouting departments.
 */

import { LeagueScouting, ScoutingDepartment, ScoutingStats } from './types';
import { getScoutingStats } from './scouting-generator';

const SCOUTING_KEY = 'dev-generated-scouting';

export function storeScouting(scouting: LeagueScouting): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SCOUTING_KEY, JSON.stringify(scouting));
  }
}

export function getScouting(): LeagueScouting | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(SCOUTING_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearScouting(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SCOUTING_KEY);
  }
}

export function getTeamScoutingById(teamId: string): ScoutingDepartment | null {
  const scouting = getScouting();
  if (!scouting) return null;
  return scouting.teams[teamId] || null;
}

export function getCachedStats(): ScoutingStats | null {
  const scouting = getScouting();
  if (!scouting) return null;
  return getScoutingStats(scouting);
}

export function getTopDepartments(count: number = 5): ScoutingDepartment[] {
  const scouting = getScouting();
  if (!scouting) return [];
  return Object.values(scouting.teams)
    .sort((a, b) => b.avgOvr - a.avgOvr)
    .slice(0, count);
}

export function getBottomDepartments(count: number = 5): ScoutingDepartment[] {
  const scouting = getScouting();
  if (!scouting) return [];
  return Object.values(scouting.teams)
    .sort((a, b) => a.avgOvr - b.avgOvr)
    .slice(0, count);
}
