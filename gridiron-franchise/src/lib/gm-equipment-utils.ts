import type {
  EquipmentSlot,
  CareerMilestones,
  GMEquipmentState,
  SlotUnlockCondition,
  SlotRequirement,
  EquipAction,
  EquipmentChangeWindow,
} from '@/types/gm-equipment';
import {
  DEFAULT_SLOT_COUNT,
  MAX_SLOT_COUNT,
  SLOT_UNLOCK_CONDITIONS,
} from '@/types/gm-equipment';
import type { SkillTierId, PositionGroup, GMSkillDefinition } from '@/types/gm-skills';
import { getSkillById } from '@/data/gm-skills';

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Create initial equipment state
 */
export function createInitialEquipmentState(
  initialSlots: number = 1
): GMEquipmentState {
  const slots: EquipmentSlot[] = [];

  for (let i = 1; i <= MAX_SLOT_COUNT; i++) {
    slots.push({
      slotIndex: i,
      isUnlocked: i <= initialSlots,
      equippedSkillId: null,
      equippedTier: null,
    });
  }

  return {
    slots,
    milestones: createInitialMilestones(),
    maxSlots: DEFAULT_SLOT_COUNT,
  };
}

/**
 * Create initial milestones
 */
export function createInitialMilestones(): CareerMilestones {
  return {
    playoffWins: 0,
    seasonsCompleted: 0,
    championships: 0,
    totalWins: 0,
    seasonsWith10Wins: 0,
    dynastiesAchieved: 0,
  };
}

// ============================================================================
// SLOT UNLOCKING
// ============================================================================

/**
 * Check if a requirement is met
 */
function isRequirementMet(
  requirement: SlotRequirement,
  milestones: CareerMilestones
): boolean {
  switch (requirement.type) {
    case 'playoff_win':
      return milestones.playoffWins >= requirement.value;
    case 'seasons':
      return milestones.seasonsCompleted >= requirement.value;
    case 'championship':
      return milestones.championships >= requirement.value;
    case 'total_wins':
      return milestones.totalWins >= requirement.value;
    case 'seasons_10_wins':
      return milestones.seasonsWith10Wins >= requirement.value;
    case 'dynasty':
      return milestones.dynastiesAchieved >= requirement.value;
    default:
      return false;
  }
}

/**
 * Check if a slot should be unlocked (any requirement met = unlock)
 */
export function isSlotUnlockable(
  slotIndex: number,
  milestones: CareerMilestones
): boolean {
  const condition = SLOT_UNLOCK_CONDITIONS.find((c) => c.slotIndex === slotIndex);
  if (!condition) return false;

  // Slot 1 is always unlocked
  if (condition.requirements.length === 0) return true;

  // Any requirement met = unlocked (OR logic)
  return condition.requirements.some((req) => isRequirementMet(req, milestones));
}

/**
 * Get unlock progress for a slot
 */
export function getSlotUnlockProgress(
  slotIndex: number,
  milestones: CareerMilestones
): { requirement: SlotRequirement; current: number; target: number; met: boolean }[] {
  const condition = SLOT_UNLOCK_CONDITIONS.find((c) => c.slotIndex === slotIndex);
  if (!condition) return [];

  return condition.requirements.map((req) => {
    let current = 0;
    switch (req.type) {
      case 'playoff_win':
        current = milestones.playoffWins;
        break;
      case 'seasons':
        current = milestones.seasonsCompleted;
        break;
      case 'championship':
        current = milestones.championships;
        break;
      case 'total_wins':
        current = milestones.totalWins;
        break;
      case 'seasons_10_wins':
        current = milestones.seasonsWith10Wins;
        break;
      case 'dynasty':
        current = milestones.dynastiesAchieved;
        break;
    }

    return {
      requirement: req,
      current,
      target: req.value,
      met: current >= req.value,
    };
  });
}

/**
 * Update equipment state based on milestones
 */
export function updateSlotUnlocks(state: GMEquipmentState): GMEquipmentState {
  const newSlots = state.slots.map((slot) => {
    if (slot.isUnlocked) return slot;

    // Check if within max slots and unlockable
    if (slot.slotIndex <= state.maxSlots && isSlotUnlockable(slot.slotIndex, state.milestones)) {
      return { ...slot, isUnlocked: true };
    }

    return slot;
  });

  return { ...state, slots: newSlots };
}

// ============================================================================
// EQUIPPING SKILLS
// ============================================================================

/**
 * Check if skill can be equipped in slot
 */
export function canEquipSkill(
  state: GMEquipmentState,
  action: EquipAction
): { canEquip: boolean; reason?: string } {
  const slot = state.slots.find((s) => s.slotIndex === action.slotIndex);

  if (!slot) {
    return { canEquip: false, reason: 'Invalid slot index' };
  }

  if (!slot.isUnlocked) {
    return { canEquip: false, reason: 'Slot is not unlocked' };
  }

  const skill = getSkillById(action.skillId);
  if (!skill) {
    return { canEquip: false, reason: 'Skill not found' };
  }

  // Check if skill is already equipped in another slot (unless stackable)
  if (!skill.stackable) {
    const alreadyEquipped = state.slots.find(
      (s) => s.equippedSkillId === action.skillId && s.slotIndex !== action.slotIndex
    );
    if (alreadyEquipped) {
      return { canEquip: false, reason: 'Skill is already equipped in another slot' };
    }
  }

  // For stackable skills, check position group conflicts
  if (skill.stackable && action.positionGroup) {
    const samePositionEquipped = state.slots.find(
      (s) =>
        s.equippedSkillId === action.skillId &&
        s.positionGroup === action.positionGroup &&
        s.slotIndex !== action.slotIndex
    );
    if (samePositionEquipped) {
      return {
        canEquip: false,
        reason: `${skill.name} for ${action.positionGroup} is already equipped`,
      };
    }
  }

  return { canEquip: true };
}

/**
 * Equip a skill to a slot
 */
export function equipSkill(
  state: GMEquipmentState,
  action: EquipAction
): GMEquipmentState | null {
  const { canEquip, reason } = canEquipSkill(state, action);
  if (!canEquip) {
    console.warn(`Cannot equip skill: ${reason}`);
    return null;
  }

  const newSlots = state.slots.map((slot) => {
    if (slot.slotIndex === action.slotIndex) {
      return {
        ...slot,
        equippedSkillId: action.skillId,
        equippedTier: action.tier,
        positionGroup: action.positionGroup,
      };
    }
    return slot;
  });

  return { ...state, slots: newSlots };
}

/**
 * Unequip a skill from a slot
 */
export function unequipSkill(
  state: GMEquipmentState,
  slotIndex: number
): GMEquipmentState {
  const newSlots = state.slots.map((slot) => {
    if (slot.slotIndex === slotIndex) {
      return {
        ...slot,
        equippedSkillId: null,
        equippedTier: null,
        positionGroup: undefined,
      };
    }
    return slot;
  });

  return { ...state, slots: newSlots };
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all unlocked slots
 */
export function getUnlockedSlots(state: GMEquipmentState): EquipmentSlot[] {
  return state.slots.filter((s) => s.isUnlocked);
}

/**
 * Get count of unlocked slots
 */
export function getUnlockedSlotCount(state: GMEquipmentState): number {
  return state.slots.filter((s) => s.isUnlocked).length;
}

/**
 * Get equipped skills
 */
export function getEquippedSkills(state: GMEquipmentState): EquipmentSlot[] {
  return state.slots.filter((s) => s.isUnlocked && s.equippedSkillId !== null);
}

/**
 * Get empty (unlocked but unequipped) slots
 */
export function getEmptySlots(state: GMEquipmentState): EquipmentSlot[] {
  return state.slots.filter((s) => s.isUnlocked && s.equippedSkillId === null);
}

/**
 * Check if skill is currently equipped
 */
export function isSkillEquipped(state: GMEquipmentState, skillId: string): boolean {
  return state.slots.some((s) => s.equippedSkillId === skillId);
}

/**
 * Get slot where skill is equipped
 */
export function getEquippedSlot(
  state: GMEquipmentState,
  skillId: string
): EquipmentSlot | undefined {
  return state.slots.find((s) => s.equippedSkillId === skillId);
}

/**
 * Get next locked slot
 */
export function getNextLockedSlot(
  state: GMEquipmentState
): { slot: EquipmentSlot; condition: SlotUnlockCondition } | undefined {
  const lockedSlot = state.slots.find(
    (s) => !s.isUnlocked && s.slotIndex <= state.maxSlots
  );
  if (!lockedSlot) return undefined;

  const condition = SLOT_UNLOCK_CONDITIONS.find(
    (c) => c.slotIndex === lockedSlot.slotIndex
  );
  if (!condition) return undefined;

  return { slot: lockedSlot, condition };
}

// ============================================================================
// EQUIPMENT CHANGE WINDOW
// ============================================================================

/**
 * Check if equipment can be changed (only between seasons)
 */
export function canChangeEquipment(
  isOffseason: boolean,
  phase: 'preseason' | 'regular' | 'playoffs' | 'offseason'
): EquipmentChangeWindow {
  if (phase === 'offseason' || isOffseason) {
    return { canChange: true };
  }

  return {
    canChange: false,
    reason: 'Skills can only be changed during the offseason',
    nextChangeOpportunity: 'End of current season',
  };
}

// ============================================================================
// MILESTONE UPDATES
// ============================================================================

/**
 * Update milestones after season
 */
export function updateMilestones(
  milestones: CareerMilestones,
  seasonResult: {
    wins: number;
    playoffWins: number;
    wonChampionship: boolean;
  }
): CareerMilestones {
  return {
    ...milestones,
    seasonsCompleted: milestones.seasonsCompleted + 1,
    totalWins: milestones.totalWins + seasonResult.wins,
    playoffWins: milestones.playoffWins + seasonResult.playoffWins,
    championships: milestones.championships + (seasonResult.wonChampionship ? 1 : 0),
    seasonsWith10Wins:
      milestones.seasonsWith10Wins + (seasonResult.wins >= 10 ? 1 : 0),
    // Dynasty check would require tracking last 5 seasons separately
    dynastiesAchieved: milestones.dynastiesAchieved, // Updated elsewhere
  };
}
