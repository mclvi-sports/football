// GM Equipment Slots System Types
// Aligned with FINAL-gm-skills-perks-system.md Part 3

import type { SkillTierId, PositionGroup } from './gm-skills';

// Equipment slot state
export interface EquipmentSlot {
  slotIndex: number; // 1-7
  isUnlocked: boolean;
  equippedSkillId: string | null;
  equippedTier: SkillTierId | null;
  positionGroup?: PositionGroup; // For stackable position-based skills
}

// Slot unlock conditions from FINAL spec
export interface SlotUnlockCondition {
  slotIndex: number;
  requirements: SlotRequirement[];
  description: string;
}

// Individual requirement (OR conditions - only one needs to be met)
export interface SlotRequirement {
  type: 'playoff_win' | 'seasons' | 'championship' | 'total_wins' | 'seasons_10_wins' | 'dynasty';
  value: number;
}

// Career milestones for tracking unlock progress
export interface CareerMilestones {
  playoffWins: number;
  seasonsCompleted: number;
  championships: number;
  totalWins: number;
  seasonsWith10Wins: number;
  dynastiesAchieved: number; // 3 titles in 5 years
}

// Complete equipment state
export interface GMEquipmentState {
  slots: EquipmentSlot[];
  milestones: CareerMilestones;
  maxSlots: number; // 5 base, up to 7 with prestige
}

// Equip/unequip actions
export interface EquipAction {
  slotIndex: number;
  skillId: string;
  tier: SkillTierId;
  positionGroup?: PositionGroup;
}

export interface UnequipAction {
  slotIndex: number;
}

// Equipment change restrictions
export interface EquipmentChangeWindow {
  canChange: boolean;
  reason?: string;
  nextChangeOpportunity?: string;
}

// Default slots from FINAL spec
export const DEFAULT_SLOT_COUNT = 5;
export const MAX_SLOT_COUNT = 7; // With prestige bonuses

// Slot unlock conditions from FINAL spec
export const SLOT_UNLOCK_CONDITIONS: SlotUnlockCondition[] = [
  {
    slotIndex: 1,
    requirements: [], // Default unlocked
    description: 'Default (start of game)',
  },
  {
    slotIndex: 2,
    requirements: [
      { type: 'playoff_win', value: 1 },
      { type: 'seasons', value: 3 },
    ],
    description: 'Win 1 playoff game OR complete 3 seasons',
  },
  {
    slotIndex: 3,
    requirements: [
      { type: 'championship', value: 1 },
      { type: 'total_wins', value: 50 },
    ],
    description: 'Win 1 championship OR reach 50 total wins',
  },
  {
    slotIndex: 4,
    requirements: [
      { type: 'championship', value: 2 },
      { type: 'seasons_10_wins', value: 5 },
    ],
    description: 'Win 2 championships OR 5 seasons with 10+ wins',
  },
  {
    slotIndex: 5,
    requirements: [
      { type: 'championship', value: 3 },
      { type: 'dynasty', value: 1 },
    ],
    description: 'Win 3 championships OR dynasty (3 in 5 years)',
  },
  // Prestige slots
  {
    slotIndex: 6,
    requirements: [{ type: 'championship', value: 3 }], // Prestige Tier 1
    description: 'Prestige Tier 1: Hall of Fame GM (3 championships)',
  },
  {
    slotIndex: 7,
    requirements: [{ type: 'championship', value: 5 }], // Prestige Tier 2
    description: 'Prestige Tier 2: Legend (5 championships)',
  },
];
