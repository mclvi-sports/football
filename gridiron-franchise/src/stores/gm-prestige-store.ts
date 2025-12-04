import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GMPrestigeState, PrestigeTierId, CustomSkillCreation } from '@/types/gm-prestige';
import {
  determinePrestigeTier,
  getPrestigeProgress,
  getPrestigeMaxSlots,
  hasPlatinumAccess,
  hasDiamondAccess,
  hasCustomSkillAccess,
  getPrestigeTier,
} from '@/lib/data/gm-prestige';

interface GMPrestigeStoreState {
  // State
  prestige: GMPrestigeState;

  // Actions
  initializePrestige: () => void;
  addChampionship: () => void;
  addDynasty: () => void;
  createCustomSkill: (skill: CustomSkillCreation) => boolean;
  checkAndUpdateTier: () => PrestigeTierId;

  // Queries
  getCurrentTier: () => PrestigeTierId;
  getChampionships: () => number;
  getDynasties: () => number;
  getProgress: () => ReturnType<typeof getPrestigeProgress>;
  getMaxSlots: () => number;
  canAccessPlatinum: () => boolean;
  canAccessDiamond: () => boolean;
  canCreateCustomSkill: () => boolean;
  hasCreatedCustomSkill: () => boolean;
  getCustomSkillId: () => string | undefined;

  // Reset
  reset: () => void;
}

const createInitialState = (): GMPrestigeState => ({
  currentTier: 'none',
  championships: 0,
  dynasties: 0,
  customSkillCreated: false,
});

export const useGMPrestigeStore = create<GMPrestigeStoreState>()(
  persist(
    (set, get) => ({
      prestige: createInitialState(),

      // Initialize prestige
      initializePrestige: () => {
        set({ prestige: createInitialState() });
      },

      // Add a championship
      addChampionship: () => {
        const { prestige } = get();
        const newChampionships = prestige.championships + 1;

        // Check if this unlocks a new tier
        const newTier = determinePrestigeTier(newChampionships, prestige.dynasties);
        const tierChanged = newTier !== prestige.currentTier;

        set({
          prestige: {
            ...prestige,
            championships: newChampionships,
            currentTier: newTier,
            unlockedAt: tierChanged ? Date.now() : prestige.unlockedAt,
          },
        });
      },

      // Add a dynasty
      addDynasty: () => {
        const { prestige } = get();
        const newDynasties = prestige.dynasties + 1;

        // Check if this unlocks GOAT tier (2 dynasties)
        const newTier = determinePrestigeTier(prestige.championships, newDynasties);
        const tierChanged = newTier !== prestige.currentTier;

        set({
          prestige: {
            ...prestige,
            dynasties: newDynasties,
            currentTier: newTier,
            unlockedAt: tierChanged ? Date.now() : prestige.unlockedAt,
          },
        });
      },

      // Create custom skill (GOAT tier only)
      createCustomSkill: (skill: CustomSkillCreation) => {
        const { prestige } = get();

        // Must be GOAT tier and not already created
        if (prestige.currentTier !== 'goat' || prestige.customSkillCreated) {
          return false;
        }

        const customSkillId = `custom_${Date.now()}`;

        set({
          prestige: {
            ...prestige,
            customSkillCreated: true,
            customSkillId,
          },
        });

        // Note: The actual skill definition would be stored separately
        // This just tracks that the player has used their custom skill creation

        return true;
      },

      // Check and update tier based on current stats
      checkAndUpdateTier: () => {
        const { prestige } = get();
        const newTier = determinePrestigeTier(prestige.championships, prestige.dynasties);

        if (newTier !== prestige.currentTier) {
          set({
            prestige: {
              ...prestige,
              currentTier: newTier,
              unlockedAt: Date.now(),
            },
          });
        }

        return newTier;
      },

      // Query: Get current tier
      getCurrentTier: () => get().prestige.currentTier,

      // Query: Get championships
      getChampionships: () => get().prestige.championships,

      // Query: Get dynasties
      getDynasties: () => get().prestige.dynasties,

      // Query: Get progress toward next tier
      getProgress: () => {
        const { prestige } = get();
        return getPrestigeProgress(prestige.championships, prestige.dynasties);
      },

      // Query: Get max equipment slots for current tier
      getMaxSlots: () => getPrestigeMaxSlots(get().prestige.currentTier),

      // Query: Can access platinum skills
      canAccessPlatinum: () => hasPlatinumAccess(get().prestige.currentTier),

      // Query: Can access diamond skills
      canAccessDiamond: () => hasDiamondAccess(get().prestige.currentTier),

      // Query: Can create custom skill
      canCreateCustomSkill: () => {
        const { prestige } = get();
        return hasCustomSkillAccess(prestige.currentTier) && !prestige.customSkillCreated;
      },

      // Query: Has created custom skill
      hasCreatedCustomSkill: () => get().prestige.customSkillCreated,

      // Query: Get custom skill ID
      getCustomSkillId: () => get().prestige.customSkillId,

      // Reset store
      reset: () => set({ prestige: createInitialState() }),
    }),
    {
      name: 'gm-prestige-storage',
      version: 1,
    }
  )
);
