/**
 * Schedule Store
 *
 * SessionStorage-based persistence for generated schedules.
 */

import { LeagueSchedule, TeamSchedule, WeekSchedule } from './types';

const SCHEDULE_KEY = 'dev-generated-schedule';

export function storeSchedule(schedule: LeagueSchedule): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  }
}

export function getSchedule(): LeagueSchedule | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(SCHEDULE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearSchedule(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SCHEDULE_KEY);
  }
}

export function getTeamScheduleById(teamId: string): TeamSchedule | null {
  const schedule = getSchedule();
  if (!schedule) return null;
  return schedule.teamSchedules[teamId] || null;
}

export function getWeekScheduleByNumber(week: number): WeekSchedule | null {
  const schedule = getSchedule();
  if (!schedule || week < 1 || week > 18) return null;
  return schedule.weeks[week - 1] || null;
}
