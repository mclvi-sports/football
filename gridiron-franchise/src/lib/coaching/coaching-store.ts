/**
 * Coaching Store
 *
 * SessionStorage-based persistence for generated coaching staff.
 */

import { LeagueCoaching, CoachingStaff, CoachingStats } from './types';
import { getCoachingStats } from './coaching-generator';

const COACHING_KEY = 'dev-generated-coaching';

export function storeCoaching(coaching: LeagueCoaching): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(COACHING_KEY, JSON.stringify(coaching));
  }
}

export function getCoaching(): LeagueCoaching | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(COACHING_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearCoaching(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(COACHING_KEY);
  }
}

export function getTeamCoachingById(teamId: string): CoachingStaff | null {
  const coaching = getCoaching();
  if (!coaching) return null;
  return coaching.teams[teamId] || null;
}

export function getCachedStats(): CoachingStats | null {
  const coaching = getCoaching();
  if (!coaching) return null;
  return getCoachingStats(coaching);
}

export function getTopCoachingStaffs(count: number = 5): CoachingStaff[] {
  const coaching = getCoaching();
  if (!coaching) return [];
  return Object.values(coaching.teams)
    .sort((a, b) => b.avgOvr - a.avgOvr)
    .slice(0, count);
}

export function getBottomCoachingStaffs(count: number = 5): CoachingStaff[] {
  const coaching = getCoaching();
  if (!coaching) return [];
  return Object.values(coaching.teams)
    .sort((a, b) => a.avgOvr - b.avgOvr)
    .slice(0, count);
}
