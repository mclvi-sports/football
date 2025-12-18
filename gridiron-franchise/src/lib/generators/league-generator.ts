/**
 * League Generator
 *
 * Unified league data generation function used by both:
 * - /career/new/generate (new game flow)
 * - GameSetupDashboard (dev tools)
 *
 * Single source of truth for generating all league data modules.
 */

import {
  storeFullGameData,
  storeDevPlayers,
  storeFreeAgents,
  clearFullGameData,
  clearDevPlayers,
  clearFreeAgents,
  clearDraftClass,
  FullGameData,
  TeamRosterData,
} from '@/lib/dev-player-store';
import { storeCoaching, clearCoaching } from '@/lib/coaching/coaching-store';
import { storeFacilities, clearFacilities } from '@/lib/facilities/facilities-store';
import { storeSchedule, clearSchedule } from '@/lib/schedule/schedule-store';
import { storeOwnerModeGMs, clearGMs } from '@/lib/gm';
import { storeScouting, clearScouting } from '@/lib/scouting/scouting-store';
import { clearCareerStatsStore } from '@/lib/career-stats/career-stats-store';
import { Tier } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

export type GenerationStep =
  | 'rosters'
  | 'freeagents'
  | 'gms'
  | 'coaching'
  | 'facilities'
  | 'scouting'
  | 'schedule';

export type StepStatus = 'pending' | 'loading' | 'complete' | 'error';

export interface GenerationCallbacks {
  onStepChange?: (step: GenerationStep, status: StepStatus) => void;
  onError?: (step: GenerationStep, error: Error) => void;
  onComplete?: () => void;
}

// Draft is generated on-demand when visiting scouting/draft pages
// to avoid sessionStorage quota issues during initial game creation
export const GENERATION_STEPS: GenerationStep[] = [
  'rosters',
  'freeagents',
  'gms',
  'coaching',
  'facilities',
  'scouting',
  'schedule',
];

// ============================================================================
// HELPERS
// ============================================================================

function updateStep(
  step: GenerationStep,
  status: StepStatus,
  callbacks?: GenerationCallbacks
): void {
  callbacks?.onStepChange?.(step, status);
}

function handleError(
  step: GenerationStep,
  error: Error,
  callbacks?: GenerationCallbacks
): void {
  updateStep(step, 'error', callbacks);
  callbacks?.onError?.(step, error);
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate all league data modules.
 *
 * @param callbacks - Optional callbacks for progress reporting
 * @param clearExisting - Whether to clear existing data before generating (default: true)
 * @returns true on success, false on failure
 */
export async function generateLeagueData(
  callbacks?: GenerationCallbacks,
  clearExisting: boolean = true
): Promise<boolean> {
  // Clear existing data if requested
  if (clearExisting) {
    clearFullGameData();
    clearDevPlayers();
    clearFreeAgents();
    clearDraftClass();
    clearGMs();
    clearCoaching();
    clearFacilities();
    clearScouting();
    clearSchedule();
    clearCareerStatsStore();
  }

  let rosterPlayers: TeamRosterData['roster']['players'] = [];
  let faPlayers: typeof rosterPlayers = [];
  let teamTiers: Record<string, Tier> = {};

  try {
    // ========================================
    // Step 1: Generate Rosters
    // ========================================
    updateStep('rosters', 'loading', callbacks);
    const rostersRes = await fetch('/api/dev/generate-rosters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const rostersData = await rostersRes.json();

    if (!rostersData.success) {
      throw new Error('Failed to generate rosters');
    }

    const fullGameData: FullGameData = {
      teams: rostersData.teams,
      generatedAt: rostersData.generatedAt,
      totalPlayers: rostersData.stats.totalPlayers,
      tierDistribution: rostersData.stats.tierDistribution,
    };
    storeFullGameData(fullGameData);

    // Career stats generation skipped during initial load to avoid quota issues.
    // Stats are generated on-demand when viewing player profiles.

    rosterPlayers = rostersData.teams.flatMap(
      (t: TeamRosterData) => t.roster.players
    );
    storeDevPlayers(rosterPlayers);

    // Extract team tiers for dependent generators
    for (const team of rostersData.teams) {
      teamTiers[team.team.id] = team.tier;
    }

    updateStep('rosters', 'complete', callbacks);

    // ========================================
    // Step 2: Generate Free Agents
    // ========================================
    updateStep('freeagents', 'loading', callbacks);
    const faRes = await fetch('/api/dev/generate-fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const faData = await faRes.json();

    if (!faData.success) {
      throw new Error('Failed to generate free agents');
    }

    faPlayers = faData.players;
    storeFreeAgents(faPlayers);

    // Career stats for FAs also skipped - generated on-demand.

    // Update dev players with roster + FA for profile viewing
    // (Draft class is generated on-demand when visiting scouting/draft pages)
    storeDevPlayers([...rosterPlayers, ...faPlayers]);
    updateStep('freeagents', 'complete', callbacks);

    // ========================================
    // Steps 3-6: Generate in parallel (all depend on rosters/tiers)
    // ========================================
    updateStep('gms', 'loading', callbacks);
    updateStep('coaching', 'loading', callbacks);
    updateStep('facilities', 'loading', callbacks);
    updateStep('scouting', 'loading', callbacks);

    const [gmsRes, coachingRes, facilitiesRes, scoutingRes] = await Promise.all([
      fetch('/api/dev/generate-gm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers }), // No player params = Owner mode
      }),
      fetch('/api/dev/generate-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers }),
      }),
      fetch('/api/dev/generate-facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers }),
      }),
      fetch('/api/dev/generate-scouting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers }),
      }),
    ]);

    const [gmsData, coachingData, facilitiesData, scoutingData] =
      await Promise.all([
        gmsRes.json(),
        coachingRes.json(),
        facilitiesRes.json(),
        scoutingRes.json(),
      ]);

    // Handle GMs
    if (!gmsData.success) {
      handleError('gms', new Error('Failed to generate GMs'), callbacks);
    } else {
      storeOwnerModeGMs(gmsData.gms);
      updateStep('gms', 'complete', callbacks);
    }

    // Handle Coaching
    if (!coachingData.success) {
      handleError('coaching', new Error('Failed to generate coaching'), callbacks);
    } else {
      storeCoaching(coachingData.coaching);
      updateStep('coaching', 'complete', callbacks);
    }

    // Handle Facilities
    if (!facilitiesData.success) {
      handleError('facilities', new Error('Failed to generate facilities'), callbacks);
    } else {
      storeFacilities(facilitiesData.facilities);
      updateStep('facilities', 'complete', callbacks);
    }

    // Handle Scouting
    if (!scoutingData.success) {
      handleError('scouting', new Error('Failed to generate scouting'), callbacks);
    } else {
      storeScouting(scoutingData.scouting);
      updateStep('scouting', 'complete', callbacks);
    }

    // ========================================
    // Step 8: Generate Schedule
    // ========================================
    updateStep('schedule', 'loading', callbacks);
    const scheduleRes = await fetch('/api/dev/generate-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        season: new Date().getFullYear(),
        randomizeStandings: true,
      }),
    });
    const scheduleData = await scheduleRes.json();

    if (!scheduleData.success) {
      // Schedule generation can fail due to constraint complexity - retry once
      console.warn('Schedule generation failed, retrying...');
      const retryRes = await fetch('/api/dev/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season: new Date().getFullYear(),
          randomizeStandings: true,
        }),
      });
      const retryData = await retryRes.json();

      if (!retryData.success) {
        throw new Error(retryData.error || 'Failed to generate schedule after retry');
      }

      // Use retry data
      if (retryData.validation && !retryData.validation.valid) {
        throw new Error(`Schedule validation failed: ${retryData.validation.errors?.join(', ')}`);
      }

      storeSchedule(retryData.schedule);
      updateStep('schedule', 'complete', callbacks);
      callbacks?.onComplete?.();
      return true;
    }

    // Double-check validation passed
    if (scheduleData.validation && !scheduleData.validation.valid) {
      throw new Error(`Schedule validation failed: ${scheduleData.validation.errors?.join(', ')}`);
    }

    storeSchedule(scheduleData.schedule);
    updateStep('schedule', 'complete', callbacks);

    // All done
    callbacks?.onComplete?.();
    return true;
  } catch (error) {
    console.error('League generation error:', error);
    return false;
  }
}
