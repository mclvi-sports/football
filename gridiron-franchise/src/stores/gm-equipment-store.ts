import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GMEquipmentState,
  EquipmentSlot,
  CareerMilestones,
  EquipAction,
  EquipmentChangeWindow,
} from '@/types/gm-equipment';
import type { SkillTierId, PositionGroup } from '@/types/gm-skills';
import {
  createInitialEquipmentState,
  updateSlotUnlocks,
  equipSkill,
  unequipSkill,
  canEquipSkill,
  getUnlockedSlots,
  getUnlockedSlotCount,
  getEquippedSkills,
  getEmptySlots,
  isSkillEquipped,
  getEquippedSlot,
  getNextLockedSlot,
  canChangeEquipment,
  updateMilestones,
  getSlotUnlockProgress,
} from '@/lib/gm-equipment-utils';

interface GMEquipmentStoreState {
  // State
  equipment: GMEquipmentState;
  isOffseason: boolean;
  currentPhase: 'preseason' | 'regular' | 'playoffs' | 'offseason';

  // Actions
  initializeEquipment: (startingSlots: number) => void;
  equip: (action: EquipAction) => boolean;
  unequip: (slotIndex: number) => void;
  updateAfterSeason: (seasonResult: {
    wins: number;
    playoffWins: number;
    wonChampionship: boolean;
  }) => void;
  setPhase: (phase: 'preseason' | 'regular' | 'playoffs' | 'offseason') => void;
  updateMaxSlots: (maxSlots: number) => void; // For prestige bonuses

  // Queries
  getUnlocked: () => EquipmentSlot[];
  getUnlockedCount: () => number;
  getEquipped: () => EquipmentSlot[];
  getEmpty: () => EquipmentSlot[];
  isEquipped: (skillId: string) => boolean;
  findEquippedSlot: (skillId: string) => EquipmentSlot | undefined;
  getNextLocked: () => ReturnType<typeof getNextLockedSlot>;
  canEquip: (action: EquipAction) => { canEquip: boolean; reason?: string };
  getChangeWindow: () => EquipmentChangeWindow;
  getUnlockProgress: (
    slotIndex: number
  ) => ReturnType<typeof getSlotUnlockProgress>;
  getMilestones: () => CareerMilestones;

  // Reset
  reset: () => void;
}

const initialState = {
  equipment: createInitialEquipmentState(1),
  isOffseason: true,
  currentPhase: 'offseason' as const,
};

export const useGMEquipmentStore = create<GMEquipmentStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Initialize with starting slots (based on team tier)
      initializeEquipment: (startingSlots: number) => {
        set({
          equipment: createInitialEquipmentState(startingSlots),
          isOffseason: true,
          currentPhase: 'offseason',
        });
      },

      // Equip a skill
      equip: (action: EquipAction) => {
        const { equipment, currentPhase, isOffseason } = get();

        // Check if can change equipment
        const changeWindow = canChangeEquipment(isOffseason, currentPhase);
        if (!changeWindow.canChange) {
          console.warn(changeWindow.reason);
          return false;
        }

        const newEquipment = equipSkill(equipment, action);
        if (!newEquipment) {
          return false;
        }

        set({ equipment: newEquipment });
        return true;
      },

      // Unequip a skill
      unequip: (slotIndex: number) => {
        const { equipment, currentPhase, isOffseason } = get();

        // Check if can change equipment
        const changeWindow = canChangeEquipment(isOffseason, currentPhase);
        if (!changeWindow.canChange) {
          console.warn(changeWindow.reason);
          return;
        }

        set({ equipment: unequipSkill(equipment, slotIndex) });
      },

      // Update after season ends
      updateAfterSeason: (seasonResult) => {
        const { equipment } = get();

        // Update milestones
        const newMilestones = updateMilestones(equipment.milestones, seasonResult);

        // Check for new slot unlocks
        const updatedEquipment = updateSlotUnlocks({
          ...equipment,
          milestones: newMilestones,
        });

        set({
          equipment: updatedEquipment,
          isOffseason: true,
          currentPhase: 'offseason',
        });
      },

      // Set game phase
      setPhase: (phase) => {
        set({
          currentPhase: phase,
          isOffseason: phase === 'offseason',
        });
      },

      // Update max slots (for prestige)
      updateMaxSlots: (maxSlots: number) => {
        const { equipment } = get();
        const updatedEquipment = updateSlotUnlocks({
          ...equipment,
          maxSlots,
        });
        set({ equipment: updatedEquipment });
      },

      // Query: Get unlocked slots
      getUnlocked: () => getUnlockedSlots(get().equipment),

      // Query: Get unlocked count
      getUnlockedCount: () => getUnlockedSlotCount(get().equipment),

      // Query: Get equipped skills
      getEquipped: () => getEquippedSkills(get().equipment),

      // Query: Get empty slots
      getEmpty: () => getEmptySlots(get().equipment),

      // Query: Is skill equipped
      isEquipped: (skillId) => isSkillEquipped(get().equipment, skillId),

      // Query: Find equipped slot
      findEquippedSlot: (skillId) => getEquippedSlot(get().equipment, skillId),

      // Query: Get next locked slot
      getNextLocked: () => getNextLockedSlot(get().equipment),

      // Query: Can equip check
      canEquip: (action) => canEquipSkill(get().equipment, action),

      // Query: Get change window
      getChangeWindow: () => {
        const { isOffseason, currentPhase } = get();
        return canChangeEquipment(isOffseason, currentPhase);
      },

      // Query: Get unlock progress
      getUnlockProgress: (slotIndex) =>
        getSlotUnlockProgress(slotIndex, get().equipment.milestones),

      // Query: Get milestones
      getMilestones: () => get().equipment.milestones,

      // Reset store
      reset: () => set(initialState),
    }),
    {
      name: 'gm-equipment-storage',
      version: 1,
    }
  )
);
