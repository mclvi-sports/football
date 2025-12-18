/**
 * Draft Store - Zustand State Management
 *
 * Central state management for the 7-round NFL Draft experience.
 * Tracks draft board, picks, trades, and AI team decisions.
 *
 * WO-DRAFT-EXPERIENCE-001 - Phase 4
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DraftProspect } from '@/lib/generators/draft-generator';
import type { TeamInfo } from '@/lib/data/teams';
import { Position } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DraftPick {
  round: number;
  pick: number; // Pick number within round (1-32)
  overall: number; // Overall pick number (1-224)
  teamId: string;
  originalTeamId: string; // Team that originally owned the pick
  isCompensatory: boolean;
}

export interface DraftSelection {
  pick: DraftPick;
  prospect: DraftProspect;
  teamId: string;
  timestamp: number;
}

export interface TradePackage {
  picksOffered: DraftPick[];
  picksRequested: DraftPick[];
  playersOffered?: string[]; // Player IDs
  playersRequested?: string[];
  futurePicksOffered?: FuturePick[];
  futurePicksRequested?: FuturePick[];
}

export interface FuturePick {
  year: number;
  round: number;
  teamId: string;
  originalTeamId: string;
}

export interface Trade {
  id: string;
  timestamp: number;
  team1Id: string;
  team2Id: string;
  team1Package: TradePackage;
  team2Package: TradePackage;
  pickNumber: number; // When the trade occurred
}

export interface TeamNeeds {
  teamId: string;
  positions: {
    position: Position;
    priority: 'critical' | 'high' | 'medium' | 'low';
    currentDepth: number;
    targetDepth: number;
  }[];
}

export type DraftSpeed = 'realtime' | 'fast' | 'instant';

export interface DraftSettings {
  speed: DraftSpeed;
  pickTimerSeconds: number; // 120 for real, 10 for fast, 0 for instant
  autoAdvance: boolean;
  showAIPicks: boolean;
}

export interface UserBoard {
  rankings: string[]; // Prospect IDs in order of preference
  tags: Record<string, string[]>; // prospectId -> tags (e.g., "sleeper", "reach", "value")
  notes: Record<string, string>; // prospectId -> note
  positionTiers: Record<Position, string[][]>; // Position -> tiers of prospect IDs
}

// ─────────────────────────────────────────────────────────────────────────────
// Draft State Interface
// ─────────────────────────────────────────────────────────────────────────────

interface DraftState {
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Draft Configuration
  year: number;
  isActive: boolean;
  isComplete: boolean;
  userTeamId: string | null;
  settings: DraftSettings;

  // Draft Class
  draftClass: DraftProspect[];
  availableProspects: string[]; // IDs of undrafted prospects

  // Picks
  allPicks: DraftPick[];
  currentPick: DraftPick | null;
  currentPickIndex: number;
  selections: DraftSelection[];

  // User Board
  userBoard: UserBoard;

  // AI Data
  teamNeeds: Record<string, TeamNeeds>;
  aiBoards: Record<string, string[]>; // teamId -> ranked prospect IDs

  // Trades
  trades: Trade[];
  pendingTrade: Trade | null;

  // Timer
  pickTimeRemaining: number;
  isPaused: boolean;

  // Actions - Setup
  initializeDraft: (
    draftClass: DraftProspect[],
    teams: TeamInfo[],
    userTeamId: string,
    year?: number
  ) => void;
  setSettings: (settings: Partial<DraftSettings>) => void;

  // Actions - Draft Flow
  startDraft: () => void;
  pauseDraft: () => void;
  resumeDraft: () => void;
  advanceToNextPick: () => void;
  makePick: (prospectId: string, teamId?: string) => void;
  simulateAIPick: () => DraftSelection | null;
  autoPickForUser: () => void;

  // Actions - User Board
  updateUserRankings: (rankings: string[]) => void;
  addProspectTag: (prospectId: string, tag: string) => void;
  removeProspectTag: (prospectId: string, tag: string) => void;
  setProspectNote: (prospectId: string, note: string) => void;

  // Actions - Trades
  proposeTrade: (trade: Trade) => void;
  acceptTrade: () => void;
  rejectTrade: () => void;
  executeTrade: (trade: Trade) => void;

  // Actions - Timer
  tickTimer: () => void;
  resetTimer: () => void;

  // Queries
  getProspectById: (id: string) => DraftProspect | undefined;
  getTeamPicks: (teamId: string) => DraftPick[];
  getTeamSelections: (teamId: string) => DraftSelection[];
  isUserOnClock: () => boolean;
  getCurrentRound: () => number;
  getBestAvailable: (count?: number, position?: Position) => DraftProspect[];
  getTeamDraftGrade: (teamId: string) => { grade: string; picks: DraftSelection[] };

  // Reset
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: DraftSettings = {
  speed: 'fast',
  pickTimerSeconds: 10,
  autoAdvance: true,
  showAIPicks: true,
};

const INITIAL_USER_BOARD: UserBoard = {
  rankings: [],
  tags: {},
  notes: {},
  positionTiers: {} as Record<Position, string[][]>,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

function generateDraftOrder(teams: TeamInfo[]): DraftPick[] {
  const picks: DraftPick[] = [];
  const teamIds = teams.map((t) => t.id);

  // Standard 7-round draft, 32 picks per round
  for (let round = 1; round <= 7; round++) {
    // Serpentine order: odd rounds 1-32, even rounds 32-1
    const order = round % 2 === 1 ? teamIds : [...teamIds].reverse();

    order.forEach((teamId, idx) => {
      picks.push({
        round,
        pick: idx + 1,
        overall: (round - 1) * 32 + idx + 1,
        teamId,
        originalTeamId: teamId,
        isCompensatory: false,
      });
    });
  }

  return picks;
}

function generateTeamNeeds(teamId: string): TeamNeeds {
  // Generate realistic needs - in a real app, this would analyze roster
  const positions = Object.values(Position);
  const priorities: ('critical' | 'high' | 'medium' | 'low')[] = [
    'critical',
    'high',
    'medium',
    'low',
  ];

  return {
    teamId,
    positions: positions.map((pos) => ({
      position: pos,
      priority: priorities[Math.floor(Math.random() * 4)],
      currentDepth: Math.floor(Math.random() * 3) + 1,
      targetDepth: Math.floor(Math.random() * 2) + 2,
    })),
  };
}

function generateAIBoard(draftClass: DraftProspect[], teamNeeds: TeamNeeds): string[] {
  // AI board weights prospects by:
  // 1. Overall rating
  // 2. Position need priority
  // 3. Some randomization for personality

  const needsPriority: Record<string, number> = {
    critical: 20,
    high: 10,
    medium: 5,
    low: 0,
  };

  return [...draftClass]
    .map((p) => {
      const need = teamNeeds.positions.find((n) => n.position === p.position);
      const needBonus = need ? needsPriority[need.priority] : 0;
      const randomFactor = (Math.random() - 0.5) * 10; // -5 to +5

      return {
        id: p.id,
        score: p.overall + needBonus + randomFactor,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((p) => p.id);
}

function calculateDraftGrade(selections: DraftSelection[]): string {
  if (selections.length === 0) return 'N/A';

  // Compare pick value to prospect value
  let totalValue = 0;

  selections.forEach((sel) => {
    const expectedOvr = getExpectedOvrForPick(sel.pick.overall);
    const actualOvr = sel.prospect.overall;
    const diff = actualOvr - expectedOvr;

    if (diff >= 10) totalValue += 3; // Great value
    else if (diff >= 5) totalValue += 2; // Good value
    else if (diff >= 0) totalValue += 1; // Fair value
    else if (diff >= -5) totalValue += 0; // Slight reach
    else totalValue -= 1; // Big reach
  });

  const avgValue = totalValue / selections.length;

  if (avgValue >= 2.5) return 'A+';
  if (avgValue >= 2) return 'A';
  if (avgValue >= 1.5) return 'A-';
  if (avgValue >= 1) return 'B+';
  if (avgValue >= 0.5) return 'B';
  if (avgValue >= 0) return 'B-';
  if (avgValue >= -0.5) return 'C+';
  if (avgValue >= -1) return 'C';
  return 'D';
}

function getExpectedOvrForPick(overall: number): number {
  // Map pick number to expected OVR
  if (overall <= 10) return 80;
  if (overall <= 32) return 76;
  if (overall <= 64) return 72;
  if (overall <= 96) return 68;
  if (overall <= 128) return 65;
  if (overall <= 160) return 62;
  if (overall <= 192) return 59;
  return 56;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Initial state
      year: new Date().getFullYear(),
      isActive: false,
      isComplete: false,
      userTeamId: null,
      settings: DEFAULT_SETTINGS,

      draftClass: [],
      availableProspects: [],

      allPicks: [],
      currentPick: null,
      currentPickIndex: 0,
      selections: [],

      userBoard: INITIAL_USER_BOARD,

      teamNeeds: {},
      aiBoards: {},

      trades: [],
      pendingTrade: null,

      pickTimeRemaining: DEFAULT_SETTINGS.pickTimerSeconds,
      isPaused: true,

      // ─────────────────────────────────────────────────────────────────────
      // Setup Actions
      // ─────────────────────────────────────────────────────────────────────

      initializeDraft: (draftClass, teams, userTeamId, year = new Date().getFullYear()) => {
        const allPicks = generateDraftOrder(teams);

        // Generate team needs and AI boards
        const teamNeeds: Record<string, TeamNeeds> = {};
        const aiBoards: Record<string, string[]> = {};

        teams.forEach((team) => {
          teamNeeds[team.id] = generateTeamNeeds(team.id);
          aiBoards[team.id] = generateAIBoard(draftClass, teamNeeds[team.id]);
        });

        // Initialize user board with default rankings (by overall)
        const sortedProspects = [...draftClass].sort((a, b) => b.overall - a.overall);

        set({
          year,
          draftClass,
          availableProspects: draftClass.map((p) => p.id),
          allPicks,
          currentPick: allPicks[0],
          currentPickIndex: 0,
          selections: [],
          userTeamId,
          teamNeeds,
          aiBoards,
          userBoard: {
            rankings: sortedProspects.map((p) => p.id),
            tags: {},
            notes: {},
            positionTiers: {} as Record<Position, string[][]>,
          },
          isActive: false,
          isComplete: false,
          isPaused: true,
          pickTimeRemaining: get().settings.pickTimerSeconds,
        });
      },

      setSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
          pickTimeRemaining: newSettings.pickTimerSeconds ?? state.settings.pickTimerSeconds,
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // Draft Flow Actions
      // ─────────────────────────────────────────────────────────────────────

      startDraft: () => {
        set({ isActive: true, isPaused: false });
      },

      pauseDraft: () => {
        set({ isPaused: true });
      },

      resumeDraft: () => {
        set({ isPaused: false });
      },

      advanceToNextPick: () => {
        const { allPicks, currentPickIndex, settings } = get();
        const nextIndex = currentPickIndex + 1;

        if (nextIndex >= allPicks.length) {
          // Draft is complete
          set({ isComplete: true, isActive: false, currentPick: null });
          return;
        }

        set({
          currentPickIndex: nextIndex,
          currentPick: allPicks[nextIndex],
          pickTimeRemaining: settings.pickTimerSeconds,
        });
      },

      makePick: (prospectId, teamId) => {
        const { currentPick, draftClass, availableProspects, selections, userTeamId } = get();

        if (!currentPick) return;

        const pickingTeam = teamId || currentPick.teamId;
        const prospect = draftClass.find((p) => p.id === prospectId);

        if (!prospect || !availableProspects.includes(prospectId)) return;

        const selection: DraftSelection = {
          pick: currentPick,
          prospect,
          teamId: pickingTeam,
          timestamp: Date.now(),
        };

        set({
          selections: [...selections, selection],
          availableProspects: availableProspects.filter((id) => id !== prospectId),
        });

        // Auto-advance if enabled
        if (get().settings.autoAdvance) {
          get().advanceToNextPick();
        }
      },

      simulateAIPick: () => {
        const { currentPick, aiBoards, availableProspects, draftClass } = get();

        if (!currentPick) return null;

        const teamBoard = aiBoards[currentPick.teamId];
        if (!teamBoard) return null;

        // Find highest-ranked available prospect on team's board
        const prospectId = teamBoard.find((id) => availableProspects.includes(id));
        if (!prospectId) return null;

        get().makePick(prospectId, currentPick.teamId);

        // Return the selection for display
        const prospect = draftClass.find((p) => p.id === prospectId);
        if (!prospect) return null;

        return {
          pick: currentPick,
          prospect,
          teamId: currentPick.teamId,
          timestamp: Date.now(),
        };
      },

      autoPickForUser: () => {
        const { userBoard, availableProspects } = get();

        // Pick the highest-ranked available prospect on user's board
        const prospectId = userBoard.rankings.find((id) => availableProspects.includes(id));
        if (prospectId) {
          get().makePick(prospectId);
        }
      },

      // ─────────────────────────────────────────────────────────────────────
      // User Board Actions
      // ─────────────────────────────────────────────────────────────────────

      updateUserRankings: (rankings) => {
        set((state) => ({
          userBoard: { ...state.userBoard, rankings },
        }));
      },

      addProspectTag: (prospectId, tag) => {
        set((state) => {
          const currentTags = state.userBoard.tags[prospectId] || [];
          if (currentTags.includes(tag)) return state;

          return {
            userBoard: {
              ...state.userBoard,
              tags: {
                ...state.userBoard.tags,
                [prospectId]: [...currentTags, tag],
              },
            },
          };
        });
      },

      removeProspectTag: (prospectId, tag) => {
        set((state) => {
          const currentTags = state.userBoard.tags[prospectId] || [];
          return {
            userBoard: {
              ...state.userBoard,
              tags: {
                ...state.userBoard.tags,
                [prospectId]: currentTags.filter((t) => t !== tag),
              },
            },
          };
        });
      },

      setProspectNote: (prospectId, note) => {
        set((state) => ({
          userBoard: {
            ...state.userBoard,
            notes: {
              ...state.userBoard.notes,
              [prospectId]: note,
            },
          },
        }));
      },

      // ─────────────────────────────────────────────────────────────────────
      // Trade Actions
      // ─────────────────────────────────────────────────────────────────────

      proposeTrade: (trade) => {
        set({ pendingTrade: trade });
      },

      acceptTrade: () => {
        const { pendingTrade } = get();
        if (pendingTrade) {
          get().executeTrade(pendingTrade);
          set({ pendingTrade: null });
        }
      },

      rejectTrade: () => {
        set({ pendingTrade: null });
      },

      executeTrade: (trade) => {
        const { allPicks, trades } = get();

        // Swap picks between teams
        const updatedPicks = allPicks.map((pick) => {
          // Check if this pick is being traded from team1 to team2
          const team1Pick = trade.team1Package.picksOffered.find(
            (p) => p.overall === pick.overall && p.teamId === trade.team1Id
          );
          if (team1Pick) {
            return { ...pick, teamId: trade.team2Id };
          }

          // Check if this pick is being traded from team2 to team1
          const team2Pick = trade.team2Package.picksOffered.find(
            (p) => p.overall === pick.overall && p.teamId === trade.team2Id
          );
          if (team2Pick) {
            return { ...pick, teamId: trade.team1Id };
          }

          return pick;
        });

        set({
          allPicks: updatedPicks,
          trades: [...trades, trade],
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // Timer Actions
      // ─────────────────────────────────────────────────────────────────────

      tickTimer: () => {
        const { pickTimeRemaining, isPaused, isActive } = get();

        if (isPaused || !isActive) return;

        if (pickTimeRemaining <= 0) {
          // Auto-pick if timer expires
          if (get().isUserOnClock()) {
            get().autoPickForUser();
          } else {
            get().simulateAIPick();
          }
          return;
        }

        set({ pickTimeRemaining: pickTimeRemaining - 1 });
      },

      resetTimer: () => {
        set({ pickTimeRemaining: get().settings.pickTimerSeconds });
      },

      // ─────────────────────────────────────────────────────────────────────
      // Queries
      // ─────────────────────────────────────────────────────────────────────

      getProspectById: (id) => {
        return get().draftClass.find((p) => p.id === id);
      },

      getTeamPicks: (teamId) => {
        return get().allPicks.filter((pick) => pick.teamId === teamId);
      },

      getTeamSelections: (teamId) => {
        return get().selections.filter((sel) => sel.teamId === teamId);
      },

      isUserOnClock: () => {
        const { currentPick, userTeamId } = get();
        return currentPick?.teamId === userTeamId;
      },

      getCurrentRound: () => {
        return get().currentPick?.round ?? 0;
      },

      getBestAvailable: (count = 10, position) => {
        const { userBoard, availableProspects, draftClass } = get();

        let prospects = userBoard.rankings
          .filter((id) => availableProspects.includes(id))
          .map((id) => draftClass.find((p) => p.id === id))
          .filter((p): p is DraftProspect => p !== undefined);

        if (position) {
          prospects = prospects.filter((p) => p.position === position);
        }

        return prospects.slice(0, count);
      },

      getTeamDraftGrade: (teamId) => {
        const selections = get().getTeamSelections(teamId);
        const grade = calculateDraftGrade(selections);
        return { grade, picks: selections };
      },

      // ─────────────────────────────────────────────────────────────────────
      // Reset
      // ─────────────────────────────────────────────────────────────────────

      reset: () => {
        set({
          year: new Date().getFullYear(),
          isActive: false,
          isComplete: false,
          userTeamId: null,
          settings: DEFAULT_SETTINGS,
          draftClass: [],
          availableProspects: [],
          allPicks: [],
          currentPick: null,
          currentPickIndex: 0,
          selections: [],
          userBoard: INITIAL_USER_BOARD,
          teamNeeds: {},
          aiBoards: {},
          trades: [],
          pendingTrade: null,
          pickTimeRemaining: DEFAULT_SETTINGS.pickTimerSeconds,
          isPaused: true,
        });
      },
    }),
    {
      name: 'draft-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selectors (for performance optimization)
// ─────────────────────────────────────────────────────────────────────────────

export const selectCurrentPick = (state: DraftState) => state.currentPick;
export const selectIsUserOnClock = (state: DraftState) =>
  state.currentPick?.teamId === state.userTeamId;
export const selectAvailableCount = (state: DraftState) => state.availableProspects.length;
export const selectCurrentRound = (state: DraftState) => state.currentPick?.round ?? 0;
export const selectDraftProgress = (state: DraftState) => ({
  current: state.currentPickIndex + 1,
  total: state.allPicks.length,
  percentage: ((state.currentPickIndex + 1) / state.allPicks.length) * 100,
});
