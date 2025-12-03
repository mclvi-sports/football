/**
 * Training Store Module
 * WO-TRAINING-SYSTEM-001 | STORE-001, STORE-002
 *
 * Session storage for training progress with CRUD operations
 */

import {
  TrainingStoreState,
  TeamTrainingState,
  TrainingProgress,
  PracticeFocus,
  PracticeFocusType,
  PracticeIntensity,
  TrainingHistory,
  TRAINING_STORAGE_KEY,
  XPSourceType,
  BadgeProgress,
  DevelopmentModifier,
} from './types';

// =============================================================================
// STORAGE HELPERS
// =============================================================================

/**
 * Get the training store state from session storage
 */
export function getTrainingStore(): TrainingStoreState {
  if (typeof window === 'undefined') {
    return createEmptyStore();
  }

  try {
    const stored = sessionStorage.getItem(TRAINING_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading training store:', error);
  }

  return createEmptyStore();
}

/**
 * Save the training store state to session storage
 */
export function saveTrainingStore(state: TrainingStoreState): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving training store:', error);
  }
}

/**
 * Create an empty store state
 */
export function createEmptyStore(): TrainingStoreState {
  return {
    initialized: false,
    teams: {},
    globalSeason: 1,
    globalWeek: 1,
  };
}

/**
 * Clear the training store
 */
export function clearTrainingStore(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TRAINING_STORAGE_KEY);
}

// =============================================================================
// TEAM TRAINING STATE (STORE-001)
// =============================================================================

/**
 * Initialize training state for a team
 */
export function initializeTeamTrainingState(
  teamId: string,
  playerIds: string[],
  season: number = 1,
  week: number = 1
): TeamTrainingState {
  const playerProgress: Record<string, TrainingProgress> = {};

  for (const playerId of playerIds) {
    playerProgress[playerId] = createEmptyTrainingProgress(playerId);
  }

  return {
    teamId,
    season,
    currentWeek: week,
    practiceFocus: {
      teamId,
      week,
      season,
      focus: 'conditioning',
      intensity: 'normal',
    },
    playerProgress,
    coachsFavorites: [],
  };
}

/**
 * Create empty training progress for a player
 */
export function createEmptyTrainingProgress(playerId: string): TrainingProgress {
  return {
    playerId,
    currentXP: 0,
    totalXPEarned: 0,
    seasonXP: 0,
    lastUpdated: new Date().toISOString(),
    attributeXP: {},
    badgeProgress: [],
    activeModifiers: [],
    history: [],
  };
}

/**
 * Get team training state
 */
export function getTeamTrainingState(teamId: string): TeamTrainingState | null {
  const store = getTrainingStore();
  return store.teams[teamId] || null;
}

/**
 * Save team training state
 */
export function saveTeamTrainingState(state: TeamTrainingState): void {
  const store = getTrainingStore();
  store.teams[state.teamId] = state;
  store.initialized = true;
  saveTrainingStore(store);
}

/**
 * Initialize training for all teams
 */
export function initializeAllTeams(
  teams: { teamId: string; playerIds: string[] }[],
  season: number = 1,
  week: number = 1
): void {
  const store = createEmptyStore();
  store.globalSeason = season;
  store.globalWeek = week;
  store.initialized = true;

  for (const team of teams) {
    store.teams[team.teamId] = initializeTeamTrainingState(
      team.teamId,
      team.playerIds,
      season,
      week
    );
  }

  saveTrainingStore(store);
}

// =============================================================================
// PLAYER PROGRESS CRUD (STORE-001)
// =============================================================================

/**
 * Get player training progress
 */
export function getPlayerProgress(teamId: string, playerId: string): TrainingProgress | null {
  const teamState = getTeamTrainingState(teamId);
  if (!teamState) return null;
  return teamState.playerProgress[playerId] || null;
}

/**
 * Update player training progress
 */
export function updatePlayerProgress(
  teamId: string,
  playerId: string,
  updates: Partial<TrainingProgress>
): void {
  const store = getTrainingStore();
  const teamState = store.teams[teamId];

  if (!teamState) {
    console.error(`Team ${teamId} not found in training store`);
    return;
  }

  const existingProgress = teamState.playerProgress[playerId] || createEmptyTrainingProgress(playerId);

  teamState.playerProgress[playerId] = {
    ...existingProgress,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  saveTrainingStore(store);
}

/**
 * Add XP to a player
 */
export function addPlayerXP(
  teamId: string,
  playerId: string,
  amount: number,
  source: XPSourceType,
  week: number,
  season: number,
  details?: string
): void {
  const store = getTrainingStore();
  const teamState = store.teams[teamId];

  if (!teamState) return;

  const progress = teamState.playerProgress[playerId] || createEmptyTrainingProgress(playerId);

  // Update XP totals
  progress.currentXP += amount;
  progress.totalXPEarned += amount;
  progress.seasonXP += amount;
  progress.lastUpdated = new Date().toISOString();

  // Add to history (keep last 50 entries)
  const historyEntry: TrainingHistory = {
    week,
    season,
    xpEarned: amount,
    source,
    details,
  };

  progress.history = [historyEntry, ...progress.history].slice(0, 50);

  teamState.playerProgress[playerId] = progress;
  saveTrainingStore(store);
}

/**
 * Spend player XP (for upgrades)
 */
export function spendPlayerXP(
  teamId: string,
  playerId: string,
  amount: number
): boolean {
  const store = getTrainingStore();
  const teamState = store.teams[teamId];

  if (!teamState) return false;

  const progress = teamState.playerProgress[playerId];
  if (!progress || progress.currentXP < amount) return false;

  progress.currentXP -= amount;
  progress.lastUpdated = new Date().toISOString();

  saveTrainingStore(store);
  return true;
}

/**
 * Add badge progress to a player
 */
export function updatePlayerBadgeProgress(
  teamId: string,
  playerId: string,
  badgeProgress: BadgeProgress[]
): void {
  updatePlayerProgress(teamId, playerId, { badgeProgress });
}

/**
 * Set active modifiers for a player
 */
export function setPlayerModifiers(
  teamId: string,
  playerId: string,
  modifiers: DevelopmentModifier[]
): void {
  updatePlayerProgress(teamId, playerId, { activeModifiers: modifiers });
}

// =============================================================================
// PRACTICE FOCUS (STORE-002)
// =============================================================================

/**
 * Get current practice focus for a team
 */
export function getPracticeFocus(teamId: string): PracticeFocus | null {
  const teamState = getTeamTrainingState(teamId);
  return teamState?.practiceFocus || null;
}

/**
 * Set practice focus for a team
 */
export function setPracticeFocus(
  teamId: string,
  focus: PracticeFocusType,
  intensity: PracticeIntensity = 'normal'
): void {
  const store = getTrainingStore();
  const teamState = store.teams[teamId];

  if (!teamState) return;

  teamState.practiceFocus = {
    teamId,
    week: teamState.currentWeek,
    season: teamState.season,
    focus,
    intensity,
  };

  saveTrainingStore(store);
}

/**
 * Advance to next week and reset practice focus
 */
export function advanceWeek(teamId: string): void {
  const store = getTrainingStore();
  const teamState = store.teams[teamId];

  if (!teamState) return;

  teamState.currentWeek += 1;

  // Reset to default practice focus
  teamState.practiceFocus = {
    teamId,
    week: teamState.currentWeek,
    season: teamState.season,
    focus: 'conditioning',
    intensity: 'normal',
  };

  saveTrainingStore(store);
}

/**
 * Advance all teams to next week
 */
export function advanceAllTeamsWeek(): void {
  const store = getTrainingStore();

  store.globalWeek += 1;

  for (const teamId of Object.keys(store.teams)) {
    const teamState = store.teams[teamId];
    teamState.currentWeek = store.globalWeek;
    teamState.practiceFocus = {
      teamId,
      week: store.globalWeek,
      season: store.globalSeason,
      focus: 'conditioning',
      intensity: 'normal',
    };
  }

  saveTrainingStore(store);
}

/**
 * Start new season (reset season XP, advance season counter)
 */
export function startNewSeason(): void {
  const store = getTrainingStore();

  store.globalSeason += 1;
  store.globalWeek = 1;

  for (const teamId of Object.keys(store.teams)) {
    const teamState = store.teams[teamId];
    teamState.season = store.globalSeason;
    teamState.currentWeek = 1;

    // Reset season XP for all players
    for (const playerId of Object.keys(teamState.playerProgress)) {
      teamState.playerProgress[playerId].seasonXP = 0;
    }

    // Reset practice focus
    teamState.practiceFocus = {
      teamId,
      week: 1,
      season: store.globalSeason,
      focus: 'conditioning',
      intensity: 'normal',
    };
  }

  saveTrainingStore(store);
}

// =============================================================================
// COACH'S FAVORITES (STORE-002)
// =============================================================================

/**
 * Get coach's favorite players for a team
 */
export function getCoachsFavorites(teamId: string): string[] {
  const teamState = getTeamTrainingState(teamId);
  return teamState?.coachsFavorites || [];
}

/**
 * Set coach's favorite players
 */
export function setCoachsFavorites(teamId: string, playerIds: string[]): void {
  const store = getTrainingStore();
  const teamState = store.teams[teamId];

  if (!teamState) return;

  teamState.coachsFavorites = playerIds;
  saveTrainingStore(store);
}

/**
 * Check if a player is a coach's favorite
 */
export function isCoachsFavorite(teamId: string, playerId: string): boolean {
  const favorites = getCoachsFavorites(teamId);
  return favorites.includes(playerId);
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Get all player progress for a team
 */
export function getAllPlayerProgress(teamId: string): Record<string, TrainingProgress> {
  const teamState = getTeamTrainingState(teamId);
  return teamState?.playerProgress || {};
}

/**
 * Get players sorted by XP
 */
export function getPlayersSortedByXP(
  teamId: string,
  order: 'asc' | 'desc' = 'desc'
): { playerId: string; progress: TrainingProgress }[] {
  const progressMap = getAllPlayerProgress(teamId);

  const entries = Object.entries(progressMap).map(([playerId, progress]) => ({
    playerId,
    progress,
  }));

  entries.sort((a, b) => {
    const diff = a.progress.currentXP - b.progress.currentXP;
    return order === 'desc' ? -diff : diff;
  });

  return entries;
}

/**
 * Get total team XP
 */
export function getTeamTotalXP(teamId: string): number {
  const progressMap = getAllPlayerProgress(teamId);
  return Object.values(progressMap).reduce((sum, p) => sum + p.totalXPEarned, 0);
}

/**
 * Get average player XP for a team
 */
export function getTeamAverageXP(teamId: string): number {
  const progressMap = getAllPlayerProgress(teamId);
  const players = Object.values(progressMap);
  if (players.length === 0) return 0;
  return Math.round(players.reduce((sum, p) => sum + p.currentXP, 0) / players.length);
}

// =============================================================================
// EXPORT STORE STATE FOR DEBUG
// =============================================================================

/**
 * Export full store state (for debugging)
 */
export function exportTrainingStore(): TrainingStoreState {
  return getTrainingStore();
}

/**
 * Import store state (for debugging/testing)
 */
export function importTrainingStore(state: TrainingStoreState): void {
  saveTrainingStore(state);
}
