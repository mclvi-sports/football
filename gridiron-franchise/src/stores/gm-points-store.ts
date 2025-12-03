import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GMPointsState,
  GPTransaction,
  AchievementRecord,
} from '@/types/gm-points';
import type { SkillTierId } from '@/types/gm-skills';
import {
  createInitialPointsState,
  earnAchievement,
  addBonusPoints,
  spendOnSkill,
  canAfford,
  getSeasonAchievements,
  getSeasonPointsTotal,
  isAchievementEarned,
  getCareerStats,
} from '@/lib/gm-points-utils';

interface GMPointsStoreState {
  // Points state
  points: GMPointsState;
  transactions: GPTransaction[];

  // Actions
  initializePoints: (startingPoints: number) => void;
  earnAchievementPoints: (
    achievementId: string,
    season: number,
    details?: string
  ) => boolean;
  addBonus: (amount: number, reason: string, season: number) => void;
  purchaseSkill: (
    skillId: string,
    skillName: string,
    tier: SkillTierId,
    cost: number
  ) => boolean;

  // Queries
  getAvailablePoints: () => number;
  getTotalEarned: () => number;
  getTotalSpent: () => number;
  canAffordCost: (cost: number) => boolean;
  hasEarnedAchievement: (achievementId: string) => boolean;
  getSeasonAchievementList: (season: number) => AchievementRecord[];
  getSeasonPoints: (season: number) => number;
  getStats: () => ReturnType<typeof getCareerStats>;
  getTransactionHistory: () => GPTransaction[];

  // Reset
  reset: () => void;
}

const initialState = {
  points: createInitialPointsState(0),
  transactions: [] as GPTransaction[],
};

export const useGMPointsStore = create<GMPointsStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Initialize with starting points (based on team tier)
      initializePoints: (startingPoints: number) => {
        set({
          points: createInitialPointsState(startingPoints),
          transactions: [],
        });
      },

      // Earn achievement points
      earnAchievementPoints: (achievementId, season, details) => {
        const { points, transactions } = get();
        const result = earnAchievement(points, achievementId, season, details);

        if (!result) {
          return false;
        }

        set({
          points: result.newState,
          transactions: [...transactions, result.transaction],
        });
        return true;
      },

      // Add bonus points
      addBonus: (amount, reason, season) => {
        const { points, transactions } = get();
        const result = addBonusPoints(points, amount, reason, season);

        set({
          points: result.newState,
          transactions: [...transactions, result.transaction],
        });
      },

      // Purchase a skill
      purchaseSkill: (skillId, skillName, tier, cost) => {
        const { points, transactions } = get();
        const result = spendOnSkill(points, skillId, skillName, tier, cost);

        if (!result) {
          return false;
        }

        set({
          points: result.newState,
          transactions: [...transactions, result.transaction],
        });
        return true;
      },

      // Query: Available points
      getAvailablePoints: () => get().points.available,

      // Query: Total earned
      getTotalEarned: () => get().points.totalEarned,

      // Query: Total spent
      getTotalSpent: () => get().points.spent,

      // Query: Can afford
      canAffordCost: (cost) => canAfford(get().points, cost),

      // Query: Has earned achievement
      hasEarnedAchievement: (achievementId) =>
        isAchievementEarned(get().points, achievementId),

      // Query: Season achievements
      getSeasonAchievementList: (season) =>
        getSeasonAchievements(get().points, season),

      // Query: Season points
      getSeasonPoints: (season) => getSeasonPointsTotal(get().points, season),

      // Query: Career stats
      getStats: () => getCareerStats(get().points),

      // Query: Transaction history
      getTransactionHistory: () => get().transactions,

      // Reset store
      reset: () => set(initialState),
    }),
    {
      name: 'gm-points-storage',
      version: 1,
    }
  )
);
