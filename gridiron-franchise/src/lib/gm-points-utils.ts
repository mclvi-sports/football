import type {
  Achievement,
  AchievementRecord,
  GMPointsState,
  GPTransaction,
  SeasonPointsSummary,
} from '@/types/gm-points';
import { getAchievementById, allAchievements } from '@/data/gm-achievements';
import type { SkillTierId } from '@/types/gm-skills';
import { SKILL_TIER_COSTS } from '@/types/gm-skills';

// ============================================================================
// POINTS STATE MANAGEMENT
// ============================================================================

/**
 * Create initial GM Points state
 */
export function createInitialPointsState(startingPoints: number = 0): GMPointsState {
  return {
    totalEarned: startingPoints,
    spent: 0,
    available: startingPoints,
    achievementHistory: [],
    seasonPoints: [],
  };
}

/**
 * Calculate available points
 */
export function calculateAvailable(state: GMPointsState): number {
  return state.totalEarned - state.spent;
}

// ============================================================================
// EARNING POINTS
// ============================================================================

/**
 * Earn an achievement and add points
 */
export function earnAchievement(
  state: GMPointsState,
  achievementId: string,
  season: number,
  details?: string
): { newState: GMPointsState; transaction: GPTransaction } | null {
  const achievement = getAchievementById(achievementId);
  if (!achievement) {
    console.warn(`Achievement not found: ${achievementId}`);
    return null;
  }

  // Check if one-time achievement already earned
  if (achievement.oneTime) {
    const alreadyEarned = state.achievementHistory.some(
      (r) => r.achievementId === achievementId
    );
    if (alreadyEarned) {
      console.warn(`One-time achievement already earned: ${achievementId}`);
      return null;
    }
  }

  // Check if non-repeatable achievement earned this season
  if (!achievement.repeatable && !achievement.oneTime) {
    const earnedThisSeason = state.achievementHistory.some(
      (r) => r.achievementId === achievementId && r.season === season
    );
    if (earnedThisSeason) {
      console.warn(`Achievement already earned this season: ${achievementId}`);
      return null;
    }
  }

  const record: AchievementRecord = {
    achievementId,
    earnedAt: Date.now(),
    season,
    details,
  };

  const transaction: GPTransaction = {
    id: `earn_${achievementId}_${Date.now()}`,
    type: 'earn',
    amount: achievement.points,
    timestamp: Date.now(),
    reason: achievement.name,
    achievementId,
  };

  // Update season summary
  const seasonIndex = state.seasonPoints.findIndex((s) => s.season === season);
  let seasonPoints: SeasonPointsSummary[];

  if (seasonIndex >= 0) {
    seasonPoints = [...state.seasonPoints];
    seasonPoints[seasonIndex] = {
      ...seasonPoints[seasonIndex],
      pointsEarned: seasonPoints[seasonIndex].pointsEarned + achievement.points,
      achievements: [...seasonPoints[seasonIndex].achievements, achievementId],
    };
  } else {
    seasonPoints = [
      ...state.seasonPoints,
      {
        season,
        pointsEarned: achievement.points,
        achievements: [achievementId],
      },
    ];
  }

  const newState: GMPointsState = {
    totalEarned: state.totalEarned + achievement.points,
    spent: state.spent,
    available: state.available + achievement.points,
    achievementHistory: [...state.achievementHistory, record],
    seasonPoints,
  };

  return { newState, transaction };
}

/**
 * Add bonus points (e.g., from rebuilding team bonus)
 */
export function addBonusPoints(
  state: GMPointsState,
  amount: number,
  reason: string,
  season: number
): { newState: GMPointsState; transaction: GPTransaction } {
  const transaction: GPTransaction = {
    id: `bonus_${Date.now()}`,
    type: 'earn',
    amount,
    timestamp: Date.now(),
    reason,
  };

  const seasonIndex = state.seasonPoints.findIndex((s) => s.season === season);
  let seasonPoints: SeasonPointsSummary[];

  if (seasonIndex >= 0) {
    seasonPoints = [...state.seasonPoints];
    seasonPoints[seasonIndex] = {
      ...seasonPoints[seasonIndex],
      pointsEarned: seasonPoints[seasonIndex].pointsEarned + amount,
    };
  } else {
    seasonPoints = [
      ...state.seasonPoints,
      {
        season,
        pointsEarned: amount,
        achievements: [],
      },
    ];
  }

  const newState: GMPointsState = {
    totalEarned: state.totalEarned + amount,
    spent: state.spent,
    available: state.available + amount,
    achievementHistory: state.achievementHistory,
    seasonPoints,
  };

  return { newState, transaction };
}

// ============================================================================
// SPENDING POINTS
// ============================================================================

/**
 * Spend points on a skill
 */
export function spendOnSkill(
  state: GMPointsState,
  skillId: string,
  skillName: string,
  tier: SkillTierId,
  cost: number
): { newState: GMPointsState; transaction: GPTransaction } | null {
  if (state.available < cost) {
    console.warn(`Not enough points. Need ${cost}, have ${state.available}`);
    return null;
  }

  const transaction: GPTransaction = {
    id: `spend_${skillId}_${tier}_${Date.now()}`,
    type: 'spend',
    amount: cost,
    timestamp: Date.now(),
    reason: `${skillName} (${tier})`,
    skillId,
    skillTier: tier,
  };

  const newState: GMPointsState = {
    ...state,
    spent: state.spent + cost,
    available: state.available - cost,
  };

  return { newState, transaction };
}

/**
 * Check if can afford a skill tier
 */
export function canAfford(state: GMPointsState, cost: number): boolean {
  return state.available >= cost;
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all achievements earned in a season
 */
export function getSeasonAchievements(
  state: GMPointsState,
  season: number
): AchievementRecord[] {
  return state.achievementHistory.filter((r) => r.season === season);
}

/**
 * Get total points earned in a season
 */
export function getSeasonPointsTotal(state: GMPointsState, season: number): number {
  const summary = state.seasonPoints.find((s) => s.season === season);
  return summary?.pointsEarned || 0;
}

/**
 * Check if achievement is already earned (for one-time)
 */
export function isAchievementEarned(
  state: GMPointsState,
  achievementId: string
): boolean {
  return state.achievementHistory.some((r) => r.achievementId === achievementId);
}

/**
 * Get count of times an achievement has been earned
 */
export function getAchievementCount(
  state: GMPointsState,
  achievementId: string
): number {
  return state.achievementHistory.filter((r) => r.achievementId === achievementId).length;
}

/**
 * Get career statistics
 */
export function getCareerStats(state: GMPointsState): {
  totalSeasons: number;
  totalAchievements: number;
  uniqueAchievements: number;
  averagePointsPerSeason: number;
  bestSeason: { season: number; points: number } | null;
} {
  const totalSeasons = state.seasonPoints.length;
  const totalAchievements = state.achievementHistory.length;
  const uniqueAchievements = new Set(
    state.achievementHistory.map((r) => r.achievementId)
  ).size;
  const averagePointsPerSeason =
    totalSeasons > 0 ? state.totalEarned / totalSeasons : 0;

  let bestSeason: { season: number; points: number } | null = null;
  for (const summary of state.seasonPoints) {
    if (!bestSeason || summary.pointsEarned > bestSeason.points) {
      bestSeason = { season: summary.season, points: summary.pointsEarned };
    }
  }

  return {
    totalSeasons,
    totalAchievements,
    uniqueAchievements,
    averagePointsPerSeason: Math.round(averagePointsPerSeason),
    bestSeason,
  };
}

/**
 * Get achievements by category with earned status
 */
export function getAchievementProgress(
  state: GMPointsState
): Map<string, { achievement: Achievement; earnedCount: number; totalPoints: number }> {
  const progress = new Map<
    string,
    { achievement: Achievement; earnedCount: number; totalPoints: number }
  >();

  for (const achievement of allAchievements) {
    const count = getAchievementCount(state, achievement.id);
    progress.set(achievement.id, {
      achievement,
      earnedCount: count,
      totalPoints: count * achievement.points,
    });
  }

  return progress;
}
