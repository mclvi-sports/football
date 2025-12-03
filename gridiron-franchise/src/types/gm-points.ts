// GM Points System Types
// Aligned with FINAL-gm-skills-perks-system.md Part 2

// Achievement categories
export type AchievementCategory = 'season' | 'development' | 'management' | 'special';

// Achievement definition
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  points: number;
  oneTime?: boolean; // Can only be earned once ever (e.g., First Championship)
  repeatable?: boolean; // Can be earned multiple times per season
  condition?: string; // Human-readable condition
}

// Record of an earned achievement
export interface AchievementRecord {
  achievementId: string;
  earnedAt: number; // timestamp
  season: number;
  details?: string; // Optional details (e.g., player name for development achievements)
}

// GM Points state for a career
export interface GMPointsState {
  totalEarned: number;
  spent: number;
  available: number; // totalEarned - spent
  achievementHistory: AchievementRecord[];
  seasonPoints: SeasonPointsSummary[];
}

// Summary of points earned in a season
export interface SeasonPointsSummary {
  season: number;
  pointsEarned: number;
  achievements: string[]; // achievement IDs
}

// Expected points per season by performance level
export interface PerformancePointsRange {
  level: string;
  minPoints: number;
  maxPoints: number;
}

export const PERFORMANCE_POINTS: PerformancePointsRange[] = [
  { level: 'Championship Run', minPoints: 700, maxPoints: 1200 },
  { level: 'Playoff Loss', minPoints: 300, maxPoints: 500 },
  { level: 'Winning Season (No Playoffs)', minPoints: 150, maxPoints: 250 },
  { level: 'Losing Season', minPoints: 50, maxPoints: 100 },
  { level: 'Rebuilding Year', minPoints: 100, maxPoints: 200 },
];

// Transaction record for spending points
export interface GPTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  timestamp: number;
  reason: string; // Achievement name or skill name
  achievementId?: string;
  skillId?: string;
  skillTier?: string;
}

// Complete GM economy state
export interface GMEconomyState {
  points: GMPointsState;
  transactions: GPTransaction[];
}
