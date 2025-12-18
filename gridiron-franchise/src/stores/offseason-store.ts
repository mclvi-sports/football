/**
 * Offseason Store
 *
 * Tracks progress through offseason phases (week-based per draft-experience design):
 * 1. Scouting (Weeks 1-18) - Evaluate prospects, build draft board
 * 2. Combine (Week 19) - NFL Combine with measurables and performances
 * 3. Pro Days (Week 20) - School visits, private workouts
 * 4. Free Agency (Week 20-21) - Sign free agents
 * 5. Draft (Week 21) - 7-round draft
 * 6. Rookie Camp (Week 22) - Reveal true OVR for rookies
 *
 * Uses Zustand with sessionStorage persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type OffseasonPhase = 'scouting' | 'combine' | 'pro-days' | 'free-agency' | 'draft' | 'rookie-camp';

export type PhaseStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface PhaseProgress {
  phase: OffseasonPhase;
  status: PhaseStatus;
  completedAt?: string;
  /** Phase-specific progress data */
  data?: Record<string, unknown>;
}

export interface OffseasonState {
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Season tracking
  currentSeason: number;
  offseasonStarted: boolean;
  offseasonComplete: boolean;

  // Phase progress
  phases: PhaseProgress[];
  currentPhase: OffseasonPhase | null;

  // Actions
  startOffseason: (season: number) => void;
  setPhaseStatus: (phase: OffseasonPhase, status: PhaseStatus) => void;
  completePhase: (phase: OffseasonPhase) => void;
  setCurrentPhase: (phase: OffseasonPhase | null) => void;
  completeOffseason: () => void;
  resetOffseason: () => void;

  // Selectors
  getPhaseProgress: (phase: OffseasonPhase) => PhaseProgress | undefined;
  isPhaseAvailable: (phase: OffseasonPhase) => boolean;
  isPhaseCompleted: (phase: OffseasonPhase) => boolean;
  getCompletedCount: () => number;
  getProgressPercentage: () => number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ORDER: OffseasonPhase[] = ['scouting', 'combine', 'pro-days', 'free-agency', 'draft', 'rookie-camp'];

/** Week ranges for each phase */
export const PHASE_WEEKS: Record<OffseasonPhase, { start: number; end: number }> = {
  'scouting': { start: 1, end: 18 },
  'combine': { start: 19, end: 19 },
  'pro-days': { start: 20, end: 20 },
  'free-agency': { start: 20, end: 21 },
  'draft': { start: 21, end: 21 },
  'rookie-camp': { start: 22, end: 22 },
};

const createInitialPhases = (): PhaseProgress[] => [
  { phase: 'scouting', status: 'available' },
  { phase: 'combine', status: 'locked' },      // Unlocked after scouting
  { phase: 'pro-days', status: 'locked' },     // Unlocked after combine
  { phase: 'free-agency', status: 'locked' },  // Unlocked after pro-days
  { phase: 'draft', status: 'locked' },        // Unlocked after free-agency
  { phase: 'rookie-camp', status: 'locked' },  // Unlocked after draft
];

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useOffseasonStore = create<OffseasonState>()(
  persist(
    (set, get) => ({
      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Initial state
      currentSeason: new Date().getFullYear(),
      offseasonStarted: false,
      offseasonComplete: false,
      phases: createInitialPhases(),
      currentPhase: null,

      // Actions
      startOffseason: (season) => {
        set({
          currentSeason: season,
          offseasonStarted: true,
          offseasonComplete: false,
          phases: createInitialPhases(),
          currentPhase: 'scouting',
        });
      },

      setPhaseStatus: (phase, status) => {
        set((state) => ({
          phases: state.phases.map((p) =>
            p.phase === phase ? { ...p, status } : p
          ),
        }));
      },

      completePhase: (phase) => {
        const now = new Date().toISOString();
        set((state) => {
          const updatedPhases = state.phases.map((p) =>
            p.phase === phase ? { ...p, status: 'completed' as PhaseStatus, completedAt: now } : p
          );

          // Unlock the next phase in sequence
          const currentIndex = PHASE_ORDER.indexOf(phase);
          if (currentIndex >= 0 && currentIndex < PHASE_ORDER.length - 1) {
            const nextPhase = PHASE_ORDER[currentIndex + 1];
            const nextIdx = updatedPhases.findIndex((p) => p.phase === nextPhase);
            if (nextIdx >= 0 && updatedPhases[nextIdx].status === 'locked') {
              updatedPhases[nextIdx] = { ...updatedPhases[nextIdx], status: 'available' };
            }
          }

          return { phases: updatedPhases };
        });
      },

      setCurrentPhase: (phase) => set({ currentPhase: phase }),

      completeOffseason: () => {
        set({
          offseasonComplete: true,
          currentPhase: null,
        });
      },

      resetOffseason: () => {
        set({
          offseasonStarted: false,
          offseasonComplete: false,
          phases: createInitialPhases(),
          currentPhase: null,
        });
      },

      // Selectors
      getPhaseProgress: (phase) => {
        return get().phases.find((p) => p.phase === phase);
      },

      isPhaseAvailable: (phase) => {
        const phaseData = get().phases.find((p) => p.phase === phase);
        return phaseData?.status === 'available' || phaseData?.status === 'in-progress';
      },

      isPhaseCompleted: (phase) => {
        const phaseData = get().phases.find((p) => p.phase === phase);
        return phaseData?.status === 'completed';
      },

      getCompletedCount: () => {
        return get().phases.filter((p) => p.status === 'completed').length;
      },

      getProgressPercentage: () => {
        const completed = get().getCompletedCount();
        return Math.round((completed / PHASE_ORDER.length) * 100);
      },
    }),
    {
      name: 'offseason-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selectors (for performance optimization)
// ─────────────────────────────────────────────────────────────────────────────

export const selectCurrentPhase = (state: OffseasonState) => state.currentPhase;
export const selectPhases = (state: OffseasonState) => state.phases;
export const selectOffseasonComplete = (state: OffseasonState) => state.offseasonComplete;
export const selectProgressPercentage = (state: OffseasonState) => state.getProgressPercentage();

// ─────────────────────────────────────────────────────────────────────────────
// Phase Metadata (for UI)
// ─────────────────────────────────────────────────────────────────────────────

export const PHASE_METADATA: Record<OffseasonPhase, {
  label: string;
  description: string;
  week: string;
  icon: string;
  href: string;
}> = {
  'scouting': {
    label: 'Scouting',
    description: 'Evaluate draft prospects and build your board',
    week: 'Weeks 1-18',
    icon: 'Search',
    href: '/dashboard/offseason/scouting',
  },
  'combine': {
    label: 'NFL Combine',
    description: 'Watch prospects perform athletic tests',
    week: 'Week 19',
    icon: 'Timer',
    href: '/dashboard/offseason/combine',
  },
  'pro-days': {
    label: 'Pro Days',
    description: 'Visit schools and conduct private workouts',
    week: 'Week 20',
    icon: 'MapPin',
    href: '/dashboard/offseason/pro-days',
  },
  'free-agency': {
    label: 'Free Agency',
    description: 'Sign free agents to fill roster needs',
    week: 'Weeks 20-21',
    icon: 'UserPlus',
    href: '/dashboard/offseason/free-agency',
  },
  'draft': {
    label: 'NFL Draft',
    description: 'Select rookies in the 7-round draft',
    week: 'Week 21',
    icon: 'GraduationCap',
    href: '/dashboard/offseason/draft',
  },
  'rookie-camp': {
    label: 'Rookie Camp',
    description: 'Reveal true ratings for your rookies',
    week: 'Week 22',
    icon: 'Tent',
    href: '/dashboard/offseason/rookie-camp',
  },
};
