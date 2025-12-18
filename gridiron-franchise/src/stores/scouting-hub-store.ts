/**
 * Scouting Hub Store
 *
 * Central state management for the enhanced scouting hub features.
 * Reads from scouting-store and draft-store, writes only to this store.
 *
 * WO-SCOUTING-HUB-001
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ScoutRecommendation,
  PerkActivation,
  TieredBoard,
  BoardTier,
  MockDraftResult,
  ProspectProjection,
  MockDraftSettings,
  ProspectSchemeFit,
  CoachWishlistEntry,
  CoachingMeetingNote,
  HiddenGem,
  CombineMovement,
  StealAlert,
} from '@/lib/scouting-hub/types';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface ScoutingHubState {
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Active tab
  activeTab: 'prospects' | 'staff' | 'board' | 'mock' | 'sleepers';
  setActiveTab: (tab: ScoutingHubState['activeTab']) => void;

  // Scout Recommendations
  scoutRecommendations: ScoutRecommendation[];
  directorBigBoard: string[]; // Prospect IDs in staff consensus order
  perkActivations: PerkActivation[];
  setScoutRecommendations: (recommendations: ScoutRecommendation[]) => void;
  setDirectorBigBoard: (board: string[]) => void;
  addPerkActivation: (activation: PerkActivation) => void;
  clearPerkActivations: () => void;

  // Tiered Board
  tieredBoard: TieredBoard;
  setTieredBoard: (board: TieredBoard) => void;
  moveProspectToTier: (prospectId: string, tier: BoardTier) => void;
  removeProspectFromBoard: (prospectId: string) => void;
  reorderTier: (tier: BoardTier, prospectIds: string[]) => void;

  // Mock Draft
  mockDraftResults: MockDraftResult[];
  mockProjections: ProspectProjection[];
  mockSettings: MockDraftSettings;
  isSimulating: boolean;
  simulationProgress: number;
  setMockDraftResults: (results: MockDraftResult[]) => void;
  setMockProjections: (projections: ProspectProjection[]) => void;
  setMockSettings: (settings: Partial<MockDraftSettings>) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSimulationProgress: (progress: number) => void;
  clearMockResults: () => void;

  // Scheme Fit
  schemeFitCache: Record<string, ProspectSchemeFit>;
  setSchemeFitCache: (cache: Record<string, ProspectSchemeFit>) => void;
  updateSchemeFit: (prospectId: string, fit: ProspectSchemeFit) => void;

  // Coach Wishlist
  coachWishlist: CoachWishlistEntry[];
  meetingNotes: CoachingMeetingNote[];
  setCoachWishlist: (wishlist: CoachWishlistEntry[]) => void;
  setMeetingNotes: (notes: CoachingMeetingNote[]) => void;
  addMeetingNote: (note: CoachingMeetingNote) => void;

  // Sleepers & Alerts
  hiddenGems: HiddenGem[];
  combineMovement: CombineMovement[];
  stealAlerts: StealAlert[];
  setHiddenGems: (gems: HiddenGem[]) => void;
  setCombineMovement: (movement: CombineMovement[]) => void;
  addStealAlert: (alert: StealAlert) => void;
  clearStealAlerts: () => void;

  // Comparison
  comparisonProspects: string[]; // Up to 3 prospect IDs
  addToComparison: (prospectId: string) => void;
  removeFromComparison: (prospectId: string) => void;
  clearComparison: () => void;

  // Reset
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialTieredBoard: TieredBoard = {
  elite: [],
  starters: [],
  contributors: [],
  depth: [],
  do_not_draft: [],
};

const initialMockSettings: MockDraftSettings = {
  simulationCount: 10,
  includeTradeUps: false,
  roundsToSimulate: 7,
};

const initialState = {
  _hasHydrated: false,
  activeTab: 'prospects' as const,
  scoutRecommendations: [] as ScoutRecommendation[],
  directorBigBoard: [] as string[],
  perkActivations: [] as PerkActivation[],
  tieredBoard: initialTieredBoard,
  mockDraftResults: [] as MockDraftResult[],
  mockProjections: [] as ProspectProjection[],
  mockSettings: initialMockSettings,
  isSimulating: false,
  simulationProgress: 0,
  schemeFitCache: {} as Record<string, ProspectSchemeFit>,
  coachWishlist: [] as CoachWishlistEntry[],
  meetingNotes: [] as CoachingMeetingNote[],
  hiddenGems: [] as HiddenGem[],
  combineMovement: [] as CombineMovement[],
  stealAlerts: [] as StealAlert[],
  comparisonProspects: [] as string[],
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useScoutingHubStore = create<ScoutingHubState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // HYDRATION
      // ========================================

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // ========================================
      // ACTIVE TAB
      // ========================================

      setActiveTab: (tab) => set({ activeTab: tab }),

      // ========================================
      // SCOUT RECOMMENDATIONS
      // ========================================

      setScoutRecommendations: (recommendations) => set({ scoutRecommendations: recommendations }),

      setDirectorBigBoard: (board) => set({ directorBigBoard: board }),

      addPerkActivation: (activation) =>
        set((state) => ({
          perkActivations: [activation, ...state.perkActivations].slice(0, 50), // Keep last 50
        })),

      clearPerkActivations: () => set({ perkActivations: [] }),

      // ========================================
      // TIERED BOARD
      // ========================================

      setTieredBoard: (board) => set({ tieredBoard: board }),

      moveProspectToTier: (prospectId, tier) =>
        set((state) => {
          const newBoard = { ...state.tieredBoard };

          // Remove from all tiers first
          for (const t of Object.keys(newBoard) as BoardTier[]) {
            newBoard[t] = newBoard[t].filter((id) => id !== prospectId);
          }

          // Add to new tier
          newBoard[tier] = [...newBoard[tier], prospectId];

          return { tieredBoard: newBoard };
        }),

      removeProspectFromBoard: (prospectId) =>
        set((state) => {
          const newBoard = { ...state.tieredBoard };

          for (const t of Object.keys(newBoard) as BoardTier[]) {
            newBoard[t] = newBoard[t].filter((id) => id !== prospectId);
          }

          return { tieredBoard: newBoard };
        }),

      reorderTier: (tier, prospectIds) =>
        set((state) => ({
          tieredBoard: {
            ...state.tieredBoard,
            [tier]: prospectIds,
          },
        })),

      // ========================================
      // MOCK DRAFT
      // ========================================

      setMockDraftResults: (results) => set({ mockDraftResults: results }),

      setMockProjections: (projections) => set({ mockProjections: projections }),

      setMockSettings: (settings) =>
        set((state) => ({
          mockSettings: { ...state.mockSettings, ...settings },
        })),

      setIsSimulating: (isSimulating) => set({ isSimulating }),

      setSimulationProgress: (progress) => set({ simulationProgress: progress }),

      clearMockResults: () =>
        set({
          mockDraftResults: [],
          mockProjections: [],
          simulationProgress: 0,
        }),

      // ========================================
      // SCHEME FIT
      // ========================================

      setSchemeFitCache: (cache) => set({ schemeFitCache: cache }),

      updateSchemeFit: (prospectId, fit) =>
        set((state) => ({
          schemeFitCache: {
            ...state.schemeFitCache,
            [prospectId]: fit,
          },
        })),

      // ========================================
      // COACH WISHLIST
      // ========================================

      setCoachWishlist: (wishlist) => set({ coachWishlist: wishlist }),

      setMeetingNotes: (notes) => set({ meetingNotes: notes }),

      addMeetingNote: (note) =>
        set((state) => ({
          meetingNotes: [note, ...state.meetingNotes].slice(0, 20), // Keep last 20
        })),

      // ========================================
      // SLEEPERS & ALERTS
      // ========================================

      setHiddenGems: (gems) => set({ hiddenGems: gems }),

      setCombineMovement: (movement) => set({ combineMovement: movement }),

      addStealAlert: (alert) =>
        set((state) => ({
          stealAlerts: [alert, ...state.stealAlerts].slice(0, 20), // Keep last 20
        })),

      clearStealAlerts: () => set({ stealAlerts: [] }),

      // ========================================
      // COMPARISON
      // ========================================

      addToComparison: (prospectId) =>
        set((state) => {
          if (state.comparisonProspects.includes(prospectId)) return state;
          if (state.comparisonProspects.length >= 3) return state;
          return {
            comparisonProspects: [...state.comparisonProspects, prospectId],
          };
        }),

      removeFromComparison: (prospectId) =>
        set((state) => ({
          comparisonProspects: state.comparisonProspects.filter((id) => id !== prospectId),
        })),

      clearComparison: () => set({ comparisonProspects: [] }),

      // ========================================
      // RESET
      // ========================================

      reset: () => set({ ...initialState, _hasHydrated: true }),
    }),
    {
      name: 'scouting-hub-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        // Persist these across sessions
        activeTab: state.activeTab,
        tieredBoard: state.tieredBoard,
        mockSettings: state.mockSettings,
        comparisonProspects: state.comparisonProspects,
        // Don't persist generated data - regenerate on load
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectActiveTab = (state: ScoutingHubState) => state.activeTab;
export const selectTieredBoard = (state: ScoutingHubState) => state.tieredBoard;
export const selectMockProjections = (state: ScoutingHubState) => state.mockProjections;
export const selectComparisonProspects = (state: ScoutingHubState) => state.comparisonProspects;
export const selectHiddenGems = (state: ScoutingHubState) => state.hiddenGems;
export const selectStealAlerts = (state: ScoutingHubState) => state.stealAlerts;

// Get prospect's tier (or null if not on board)
export const selectProspectTier = (state: ScoutingHubState, prospectId: string): BoardTier | null => {
  const { tieredBoard } = state;
  for (const tier of Object.keys(tieredBoard) as BoardTier[]) {
    if (tieredBoard[tier].includes(prospectId)) {
      return tier;
    }
  }
  return null;
};

// Get all prospects on board as flat array
export const selectAllBoardProspects = (state: ScoutingHubState): string[] => {
  const { tieredBoard } = state;
  return [
    ...tieredBoard.elite,
    ...tieredBoard.starters,
    ...tieredBoard.contributors,
    ...tieredBoard.depth,
    ...tieredBoard.do_not_draft,
  ];
};

// Get projection for a specific prospect
export const selectProspectProjection = (
  state: ScoutingHubState,
  prospectId: string
): ProspectProjection | undefined => {
  return state.mockProjections.find((p) => p.prospectId === prospectId);
};
