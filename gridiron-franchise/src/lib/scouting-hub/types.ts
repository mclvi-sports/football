/**
 * Scouting Hub Types
 *
 * Type definitions for the enhanced scouting hub features:
 * - Scout recommendations and staff insights
 * - Tiered big board
 * - Mock draft simulations
 * - Scheme fit calculations
 * - Coach wishlists
 * - Sleeper detection and combine analysis
 *
 * WO-SCOUTING-HUB-001
 */

import type { Position } from '@/lib/types';
import type { ScoutPerkId, RecommendationType } from '@/lib/scouting/types';

// ============================================================================
// SCOUT RECOMMENDATIONS
// ============================================================================

export interface ScoutRecommendation {
  id: string;
  scoutId: string;
  scoutName: string;
  scoutRole: 'director' | 'area' | 'pro' | 'national';
  prospectId: string;
  prospectName: string;
  position: Position;
  type: RecommendationType;
  confidence: number; // 0-100
  reason: string;
  perkTriggered?: ScoutPerkId;
  timestamp: number;
}

export interface PerkActivation {
  id: string;
  perkId: ScoutPerkId;
  perkName: string;
  scoutId: string;
  scoutName: string;
  prospectId: string;
  prospectName: string;
  effect: string;
  activationType: 'sleeper_found' | 'bust_flagged' | 'trait_revealed' | 'high_potential';
  timestamp: number;
}

export interface ScoutConfidence {
  prospectId: string;
  confidence: number; // 0-100
  scoutCount: number; // How many scouts evaluated
  highestScoutOvr: number;
  hasDirectorReport: boolean;
}

// ============================================================================
// TIERED BIG BOARD
// ============================================================================

export type BoardTier = 'elite' | 'starters' | 'contributors' | 'depth' | 'do_not_draft';

export const BOARD_TIER_INFO: Record<BoardTier, { label: string; color: string; description: string }> = {
  elite: {
    label: 'Elite',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    description: 'Must draft if available',
  },
  starters: {
    label: 'Starters',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    description: 'Day 1 starters',
  },
  contributors: {
    label: 'Contributors',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Rotational players',
  },
  depth: {
    label: 'Depth',
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    description: 'Practice squad / depth',
  },
  do_not_draft: {
    label: 'Do Not Draft',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Avoid',
  },
};

export interface TieredBoard {
  elite: string[]; // prospect IDs
  starters: string[];
  contributors: string[];
  depth: string[];
  do_not_draft: string[];
}

// ============================================================================
// MOCK DRAFT
// ============================================================================

export interface MockDraftPick {
  overall: number;
  round: number;
  pickInRound: number;
  teamId: string;
  prospectId: string;
  prospectName: string;
  position: Position;
  isUserPick: boolean;
}

export interface MockDraftResult {
  simulationId: string;
  seed: number;
  timestamp: number;
  picks: MockDraftPick[];
  userTeamPicks: MockDraftPick[];
}

export interface ProspectProjection {
  prospectId: string;
  prospectName: string;
  position: Position;
  scoutedOvr: number;
  pickHistory: number[]; // All picks across simulations
  avgPick: number;
  minPick: number;
  maxPick: number;
  consensus: ConsensusRange;
  roundProjection: number;
  likelyAvailableAtPicks: number[]; // User pick numbers where likely available
  availabilityProbability: Record<number, number>; // pickNumber -> % chance available
}

export interface ConsensusRange {
  floor: number; // 25th percentile
  ceiling: number; // 75th percentile
  mostLikely: number; // Mode
}

export interface MockDraftSettings {
  simulationCount: 10 | 25 | 50;
  includeTradeUps: boolean;
  roundsToSimulate: 1 | 3 | 7;
}

// ============================================================================
// SCHEME FIT
// ============================================================================

export type SchemeFitGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export const SCHEME_FIT_COLORS: Record<SchemeFitGrade, string> = {
  A: 'bg-green-500/20 text-green-400 border-green-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  D: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  F: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export interface ProspectSchemeFit {
  prospectId: string;
  offensiveGrade?: SchemeFitGrade;
  defensiveGrade?: SchemeFitGrade;
  primaryGrade: SchemeFitGrade;
  reasons: string[];
  archetype?: string;
}

// ============================================================================
// COACH WISHLIST
// ============================================================================

export type CoachPosition = 'HC' | 'OC' | 'DC' | 'STC';

export interface CoachWishlistEntry {
  prospectId: string;
  prospectName: string;
  position: Position;
  coachPosition: CoachPosition;
  coachName: string;
  perkId?: string;
  reason: string;
  developmentBonus: number; // Expected XP bonus from coach perk
  projectedYear1Ovr: number;
}

export interface CoachingMeetingNote {
  id: string;
  week: number;
  coachPosition: CoachPosition;
  coachName: string;
  content: string;
  prospectMentions: string[]; // prospect IDs mentioned
  sentiment: 'positive' | 'neutral' | 'cautious';
  timestamp: number;
}

// ============================================================================
// SLEEPERS & ALERTS
// ============================================================================

export interface HiddenGem {
  prospectId: string;
  prospectName: string;
  position: Position;
  scoutedOvr: number;
  potential: number;
  potentialGap: number; // potential - scoutedOvr
  discoveredBy: string; // scout name
  discoveryPerk?: ScoutPerkId;
  draftValueGap: number; // Expected pick - actual value
  confidence: number;
}

export type CombineMovementDirection = 'riser' | 'faller';

export interface CombineMovement {
  prospectId: string;
  prospectName: string;
  position: Position;
  direction: CombineMovementDirection;
  delta: number; // Change in projected round (+ for faller, - for riser)
  previousProjection: number; // Round before combine
  newProjection: number; // Round after combine
  reason: string;
  standoutMeasurable?: string; // e.g., "4.32 forty"
  concernMeasurable?: string; // e.g., "24 bench reps (low)"
}

export type StealAlertLevel = 'watch' | 'value' | 'steal';

export interface StealAlert {
  id: string;
  prospectId: string;
  prospectName: string;
  position: Position;
  expectedPick: number;
  currentPick: number;
  picksDrop: number;
  alertLevel: StealAlertLevel;
  scoutedOvr: number;
  timestamp: number;
}

export const STEAL_ALERT_THRESHOLDS = {
  watch: 5, // 5+ picks past expected
  value: 10, // 10+ picks past expected
  steal: 20, // 20+ picks past expected (full round drop)
} as const;

// ============================================================================
// HUB STATE
// ============================================================================

export interface ScoutingHubTab {
  id: 'prospects' | 'staff' | 'board' | 'mock' | 'sleepers';
  label: string;
  icon: string;
}

export const SCOUTING_HUB_TABS: ScoutingHubTab[] = [
  { id: 'prospects', label: 'Prospects', icon: 'Users' },
  { id: 'staff', label: 'Staff Insights', icon: 'UserCheck' },
  { id: 'board', label: 'Big Board', icon: 'LayoutList' },
  { id: 'mock', label: 'Mock Draft', icon: 'TrendingUp' },
  { id: 'sleepers', label: 'Sleepers', icon: 'Sparkles' },
];
