import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Scout,
  ScoutRole,
  ScoutingDepartment,
  ScoutPool,
  ScoutingAssignment,
  ScoutingReport,
  ScoutRecommendation,
  DraftPickAccuracy,
  XPRecord,
  SeasonPeriod,
  ProspectTier,
  PerkTier,
} from '@/lib/scouting/types';
import {
  SCOUTING_POINT_COSTS,
  PERIOD_MODIFIERS,
  SEASON_PERIODS,
  XP_SPEND_COSTS,
  PERK_XP_COSTS,
} from '@/lib/scouting/types';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface ScoutingStoreState {
  // Core state
  department: ScoutingDepartment | null;
  scoutPool: ScoutPool | null;
  teamId: string | null;

  // Scouting points state
  currentWeek: number;
  currentPeriod: SeasonPeriod;
  weeklyPointsAvailable: number;
  weeklyPointsSpent: number;
  assignments: ScoutingAssignment[];

  // Reports state
  reports: Record<string, ScoutingReport>; // prospectId -> report
  recommendations: ScoutRecommendation[];

  // Draft accuracy tracking
  draftAccuracy: DraftPickAccuracy[];
  currentSeason: number;

  // Actions - Initialization
  initializeDepartment: (department: ScoutingDepartment, teamId: string) => void;
  initializeScoutPool: (pool: ScoutPool) => void;

  // Actions - Scout Management
  hireScout: (scoutId: string, role: ScoutRole, salary: number, years: number) => boolean;
  fireScout: (scoutId: string) => void;
  renewContract: (scoutId: string, salary: number, years: number) => boolean;

  // Actions - Scout Progression
  awardXP: (scoutId: string, amount: number, reason: string, draftPickId?: string) => void;
  upgradeAttribute: (scoutId: string, attribute: keyof Scout['attributes']) => boolean;
  purchasePerk: (scoutId: string, perkId: string, tier: PerkTier) => boolean;

  // Actions - Scouting Points
  advanceWeek: () => void;
  assignScout: (scoutId: string, prospectId: string, tier: ProspectTier) => boolean;
  generateReport: (assignmentId: string, report: ScoutingReport) => void;

  // Actions - Season Management
  startNewSeason: (season: number) => void;
  processEndOfSeason: () => void;
  processRetirement: () => Scout[]; // Returns retired scouts

  // Actions - Draft
  recordDraftPick: (accuracy: DraftPickAccuracy) => void;
  revealTrueOvr: (prospectId: string) => void;

  // Queries
  getScoutById: (scoutId: string) => Scout | null;
  getAllScouts: () => Scout[];
  getDepartmentBudget: () => number;
  getWeeklyPointsTotal: () => number;
  getAvailablePoints: () => number;
  getScoutingCoverage: () => number; // % of draft class covered
  getReportForProspect: (prospectId: string) => ScoutingReport | null;
  getScoutAccuracy: (scoutId: string) => { avgError: number; correctGrades: number };

  // Reset
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  department: null as ScoutingDepartment | null,
  scoutPool: null as ScoutPool | null,
  teamId: null as string | null,
  currentWeek: 1,
  currentPeriod: 'pre_season' as SeasonPeriod,
  weeklyPointsAvailable: 0,
  weeklyPointsSpent: 0,
  assignments: [] as ScoutingAssignment[],
  reports: {} as Record<string, ScoutingReport>,
  recommendations: [] as ScoutRecommendation[],
  draftAccuracy: [] as DraftPickAccuracy[],
  currentSeason: 2025,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateWeeklyPoints(department: ScoutingDepartment): number {
  const allScouts = [
    department.director,
    ...department.areaScouts,
    department.proScout,
    department.nationalScout,
  ].filter((s): s is Scout => s !== null);

  return allScouts.reduce((total, scout) => {
    return total + 100 + scout.attributes.workEthic * 2;
  }, 0);
}

function getCurrentPeriod(week: number): SeasonPeriod {
  for (const [period, [start, end]] of Object.entries(SEASON_PERIODS)) {
    if (week >= start && week <= end) {
      return period as SeasonPeriod;
    }
  }
  return 'mid_season';
}

function calculateScoutingCost(tier: ProspectTier, period: SeasonPeriod): number {
  const baseCost = SCOUTING_POINT_COSTS[tier];
  const modifier = PERIOD_MODIFIERS[period];
  return Math.round(baseCost * modifier);
}

function updateScoutInDepartment(
  department: ScoutingDepartment,
  scoutId: string,
  updater: (scout: Scout) => Scout
): ScoutingDepartment {
  const updated = { ...department };

  if (updated.director.id === scoutId) {
    updated.director = updater(updated.director);
  }

  updated.areaScouts = updated.areaScouts.map((s) =>
    s.id === scoutId ? updater(s) : s
  );

  if (updated.proScout?.id === scoutId) {
    updated.proScout = updater(updated.proScout);
  }

  if (updated.nationalScout?.id === scoutId) {
    updated.nationalScout = updater(updated.nationalScout);
  }

  return updated;
}

function removeScoutFromDepartment(
  department: ScoutingDepartment,
  scoutId: string
): ScoutingDepartment {
  const updated = { ...department };

  // Cannot remove director - must hire replacement first
  if (updated.director.id === scoutId) {
    return updated;
  }

  updated.areaScouts = updated.areaScouts.filter((s) => s.id !== scoutId);

  if (updated.proScout?.id === scoutId) {
    updated.proScout = null;
  }

  if (updated.nationalScout?.id === scoutId) {
    updated.nationalScout = null;
  }

  // Recalculate department stats
  const allScouts = [
    updated.director,
    ...updated.areaScouts,
    updated.proScout,
    updated.nationalScout,
  ].filter((s): s is Scout => s !== null);

  updated.scoutCount = allScouts.length;
  updated.avgOvr = allScouts.reduce((sum, s) => sum + s.ovr, 0) / allScouts.length;
  updated.totalBudget = allScouts.reduce((sum, s) => sum + s.contract.salary, 0);
  updated.weeklyPoints = calculateWeeklyPoints(updated);

  return updated;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useScoutingStore = create<ScoutingStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // INITIALIZATION
      // ========================================

      initializeDepartment: (department, teamId) => {
        const weeklyPoints = calculateWeeklyPoints(department);
        set({
          department,
          teamId,
          weeklyPointsAvailable: weeklyPoints,
          weeklyPointsSpent: 0,
        });
      },

      initializeScoutPool: (pool) => {
        set({ scoutPool: pool });
      },

      // ========================================
      // SCOUT MANAGEMENT
      // ========================================

      hireScout: (scoutId, role, salary, years) => {
        const { department, scoutPool } = get();
        if (!department || !scoutPool) return false;

        // Find scout in pool
        const allPoolScouts = [
          ...scoutPool.directors,
          ...scoutPool.areaScouts,
          ...scoutPool.proScouts,
          ...scoutPool.nationalScouts,
        ];
        const scout = allPoolScouts.find((s) => s.id === scoutId);
        if (!scout) return false;

        // Check role capacity
        if (role === 'director' && department.director) {
          // Must fire current director first
          return false;
        }
        if (role === 'area' && department.areaScouts.length >= 2) {
          return false;
        }
        if (role === 'pro' && department.proScout) {
          return false;
        }
        if (role === 'national' && department.nationalScout) {
          return false;
        }

        // Update scout with new contract
        const hiredScout: Scout = {
          ...scout,
          role,
          contract: { salary, yearsTotal: years, yearsRemaining: years },
        };

        // Add to department
        const updated = { ...department };
        if (role === 'director') {
          updated.director = hiredScout;
        } else if (role === 'area') {
          updated.areaScouts = [...updated.areaScouts, hiredScout];
        } else if (role === 'pro') {
          updated.proScout = hiredScout;
        } else if (role === 'national') {
          updated.nationalScout = hiredScout;
        }

        // Recalculate stats
        const allScouts = [
          updated.director,
          ...updated.areaScouts,
          updated.proScout,
          updated.nationalScout,
        ].filter((s): s is Scout => s !== null);

        updated.scoutCount = allScouts.length;
        updated.avgOvr = allScouts.reduce((sum, s) => sum + s.ovr, 0) / allScouts.length;
        updated.totalBudget = allScouts.reduce((sum, s) => sum + s.contract.salary, 0);
        updated.weeklyPoints = calculateWeeklyPoints(updated);

        // Remove from pool
        const updatedPool: ScoutPool = {
          ...scoutPool,
          directors: scoutPool.directors.filter((s) => s.id !== scoutId),
          areaScouts: scoutPool.areaScouts.filter((s) => s.id !== scoutId),
          proScouts: scoutPool.proScouts.filter((s) => s.id !== scoutId),
          nationalScouts: scoutPool.nationalScouts.filter((s) => s.id !== scoutId),
        };

        set({
          department: updated,
          scoutPool: updatedPool,
          weeklyPointsAvailable: calculateWeeklyPoints(updated),
        });

        return true;
      },

      fireScout: (scoutId) => {
        const { department } = get();
        if (!department) return;

        // Cannot fire director without replacement
        if (department.director.id === scoutId) {
          console.warn('Cannot fire director without hiring replacement first');
          return;
        }

        const updated = removeScoutFromDepartment(department, scoutId);
        set({
          department: updated,
          weeklyPointsAvailable: calculateWeeklyPoints(updated),
        });
      },

      renewContract: (scoutId, salary, years) => {
        const { department } = get();
        if (!department) return false;

        const updated = updateScoutInDepartment(department, scoutId, (scout) => ({
          ...scout,
          contract: { salary, yearsTotal: years, yearsRemaining: years },
        }));

        // Recalculate budget
        const allScouts = [
          updated.director,
          ...updated.areaScouts,
          updated.proScout,
          updated.nationalScout,
        ].filter((s): s is Scout => s !== null);
        updated.totalBudget = allScouts.reduce((sum, s) => sum + s.contract.salary, 0);

        set({ department: updated });
        return true;
      },

      // ========================================
      // SCOUT PROGRESSION
      // ========================================

      awardXP: (scoutId, amount, reason, draftPickId) => {
        const { department, currentSeason } = get();
        if (!department) return;

        const xpRecord: XPRecord = {
          amount,
          reason,
          season: currentSeason,
          draftPickId,
          timestamp: Date.now(),
        };

        const updated = updateScoutInDepartment(department, scoutId, (scout) => ({
          ...scout,
          xp: scout.xp + amount,
        }));

        set({ department: updated });
      },

      upgradeAttribute: (scoutId, attribute) => {
        const { department } = get();
        if (!department) return false;

        const scout = get().getScoutById(scoutId);
        if (!scout) return false;

        // Check XP cost
        if (scout.xp < XP_SPEND_COSTS.ATTRIBUTE_POINT) {
          return false;
        }

        // Check attribute cap
        if (scout.attributes[attribute] >= 99) {
          return false;
        }

        const updated = updateScoutInDepartment(department, scoutId, (s) => ({
          ...s,
          xp: s.xp - XP_SPEND_COSTS.ATTRIBUTE_POINT,
          attributes: {
            ...s.attributes,
            [attribute]: Math.min(99, s.attributes[attribute] + 1),
          },
          // Recalculate OVR
          ovr: Math.round(
            (Object.values({
              ...s.attributes,
              [attribute]: Math.min(99, s.attributes[attribute] + 1),
            }).reduce((a, b) => a + b, 0) / 6)
          ),
        }));

        set({ department: updated });
        return true;
      },

      purchasePerk: (scoutId, perkId, tier) => {
        const { department } = get();
        if (!department) return false;

        const scout = get().getScoutById(scoutId);
        if (!scout) return false;

        const cost = PERK_XP_COSTS[tier];
        if (scout.xp < cost) {
          return false;
        }

        // Check if already has perk
        if (scout.perks.some((p) => p.id === perkId)) {
          return false;
        }

        const updated = updateScoutInDepartment(department, scoutId, (s) => ({
          ...s,
          xp: s.xp - cost,
          perks: [...s.perks, { id: perkId, name: perkId, tier, effect: '' }],
        }));

        set({ department: updated });
        return true;
      },

      // ========================================
      // SCOUTING POINTS
      // ========================================

      advanceWeek: () => {
        const { currentWeek, department } = get();
        const newWeek = currentWeek + 1;
        const newPeriod = getCurrentPeriod(newWeek);

        // Reset weekly points
        const weeklyPoints = department ? calculateWeeklyPoints(department) : 0;

        set({
          currentWeek: newWeek,
          currentPeriod: newPeriod,
          weeklyPointsAvailable: weeklyPoints,
          weeklyPointsSpent: 0,
        });
      },

      assignScout: (scoutId, prospectId, tier) => {
        const { weeklyPointsAvailable, currentWeek, currentPeriod, assignments } = get();

        const cost = calculateScoutingCost(tier, currentPeriod);

        if (weeklyPointsAvailable < cost) {
          return false;
        }

        const assignment: ScoutingAssignment = {
          id: `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          scoutId,
          prospectId,
          pointsSpent: cost,
          week: currentWeek,
          period: currentPeriod,
          reportGenerated: false,
        };

        set({
          weeklyPointsAvailable: weeklyPointsAvailable - cost,
          weeklyPointsSpent: get().weeklyPointsSpent + cost,
          assignments: [...assignments, assignment],
        });

        return true;
      },

      generateReport: (assignmentId, report) => {
        const { assignments, reports } = get();

        // Mark assignment as complete
        const updatedAssignments = assignments.map((a) =>
          a.id === assignmentId ? { ...a, reportGenerated: true, reportId: report.id } : a
        );

        set({
          assignments: updatedAssignments,
          reports: { ...reports, [report.prospectId]: report },
        });
      },

      // ========================================
      // SEASON MANAGEMENT
      // ========================================

      startNewSeason: (season) => {
        const { department } = get();

        set({
          currentSeason: season,
          currentWeek: 1,
          currentPeriod: 'pre_season',
          assignments: [],
          reports: {},
          recommendations: [],
          weeklyPointsAvailable: department ? calculateWeeklyPoints(department) : 0,
          weeklyPointsSpent: 0,
        });
      },

      processEndOfSeason: () => {
        const { department } = get();
        if (!department) return;

        // Decrement contract years
        const updated = updateScoutInDepartment(department, department.director.id, (s) => ({
          ...s,
          age: s.age + 1,
          experience: s.experience + 1,
          contract: {
            ...s.contract,
            yearsRemaining: Math.max(0, s.contract.yearsRemaining - 1),
          },
        }));

        // Update all scouts
        const allScoutIds = [
          department.director.id,
          ...department.areaScouts.map((s) => s.id),
          department.proScout?.id,
          department.nationalScout?.id,
        ].filter((id): id is string => id !== undefined);

        let finalDepartment = department;
        for (const scoutId of allScoutIds) {
          finalDepartment = updateScoutInDepartment(finalDepartment, scoutId, (s) => ({
            ...s,
            age: s.age + 1,
            experience: s.experience + 1,
            contract: {
              ...s.contract,
              yearsRemaining: Math.max(0, s.contract.yearsRemaining - 1),
            },
          }));
        }

        set({ department: finalDepartment });
      },

      processRetirement: () => {
        const { department } = get();
        if (!department) return [];

        const retiredScouts: Scout[] = [];

        const allScouts = [
          department.director,
          ...department.areaScouts,
          department.proScout,
          department.nationalScout,
        ].filter((s): s is Scout => s !== null);

        for (const scout of allScouts) {
          let retirementRisk = 0;
          if (scout.age >= 73) retirementRisk = 0.5;
          else if (scout.age >= 69) retirementRisk = 0.3;
          else if (scout.age >= 63) retirementRisk = 0.15;

          if (Math.random() < retirementRisk) {
            retiredScouts.push(scout);
          }
        }

        // Remove retired scouts (except director - would need replacement)
        let updated = department;
        for (const retired of retiredScouts) {
          if (retired.id !== department.director.id) {
            updated = removeScoutFromDepartment(updated, retired.id);
          }
        }

        set({ department: updated });
        return retiredScouts;
      },

      // ========================================
      // DRAFT
      // ========================================

      recordDraftPick: (accuracy) => {
        const { draftAccuracy } = get();
        set({ draftAccuracy: [...draftAccuracy, accuracy] });
      },

      revealTrueOvr: (prospectId) => {
        const { draftAccuracy } = get();
        const updated = draftAccuracy.map((a) =>
          a.prospectId === prospectId ? { ...a, revealed: true } : a
        );
        set({ draftAccuracy: updated });
      },

      // ========================================
      // QUERIES
      // ========================================

      getScoutById: (scoutId) => {
        const { department } = get();
        if (!department) return null;

        const allScouts = [
          department.director,
          ...department.areaScouts,
          department.proScout,
          department.nationalScout,
        ].filter((s): s is Scout => s !== null);

        return allScouts.find((s) => s.id === scoutId) || null;
      },

      getAllScouts: () => {
        const { department } = get();
        if (!department) return [];

        return [
          department.director,
          ...department.areaScouts,
          department.proScout,
          department.nationalScout,
        ].filter((s): s is Scout => s !== null);
      },

      getDepartmentBudget: () => {
        const { department } = get();
        return department?.totalBudget || 0;
      },

      getWeeklyPointsTotal: () => {
        const { department } = get();
        return department ? calculateWeeklyPoints(department) : 0;
      },

      getAvailablePoints: () => {
        return get().weeklyPointsAvailable;
      },

      getScoutingCoverage: () => {
        const { reports } = get();
        const reportCount = Object.keys(reports).length;
        // Assuming ~275 prospects in draft class
        return Math.round((reportCount / 275) * 100);
      },

      getReportForProspect: (prospectId) => {
        return get().reports[prospectId] || null;
      },

      getScoutAccuracy: (scoutId) => {
        const { draftAccuracy } = get();
        const scoutPicks = draftAccuracy.filter(
          (a) => a.scoutId === scoutId && a.revealed
        );

        if (scoutPicks.length === 0) {
          return { avgError: 0, correctGrades: 0 };
        }

        const avgError =
          scoutPicks.reduce((sum, a) => sum + Math.abs(a.error), 0) / scoutPicks.length;
        const correctGrades = scoutPicks.filter((a) => Math.abs(a.error) <= 2).length;

        return { avgError, correctGrades };
      },

      // ========================================
      // RESET
      // ========================================

      reset: () => set(initialState),
    }),
    {
      name: 'scouting-storage',
      version: 1,
    }
  )
);
