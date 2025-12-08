/**
 * Save Game Service
 *
 * Functions to save/load game state to/from Supabase.
 * Collects state from all Zustand stores and localStorage.
 */

import { createClient } from "./client";
import type {
  SaveGameRow,
  SaveGameInsert,
  SaveSlot,
  SaveSlotMetadata,
  GameStateData,
} from "./types";

// Import stores for state collection and hydration
import { useGMPointsStore } from "@/stores/gm-points-store";
import { useGMEquipmentStore } from "@/stores/gm-equipment-store";
import { useGMPrestigeStore } from "@/stores/gm-prestige-store";
import { useScoutingStore } from "@/stores/scouting-store";
import { useCareerStore } from "@/stores/career-store";
import {
  CAREER_STATS_STORAGE_KEY,
  getCareerStatsStore,
} from "@/lib/career-stats";

// ============================================================================
// COLLECT GAME STATE
// ============================================================================

/**
 * Collect all game state from stores and localStorage
 */
export function collectGameState(): GameStateData {
  // Get Zustand store states
  const gmPointsState = useGMPointsStore.getState();
  const gmEquipmentState = useGMEquipmentStore.getState();
  const gmPrestigeState = useGMPrestigeStore.getState();
  const scoutingState = useScoutingStore.getState();
  const careerState = useCareerStore.getState();

  // Get localStorage data
  const careerStats = getCareerStatsStore();

  return {
    version: "1.0.0",
    savedAt: new Date().toISOString(),

    // Zustand store states (extract data, not functions)
    gmPoints: {
      points: gmPointsState.points,
      transactions: gmPointsState.transactions,
    },
    gmEquipment: {
      equipment: gmEquipmentState.equipment,
      isOffseason: gmEquipmentState.isOffseason,
      currentPhase: gmEquipmentState.currentPhase,
    },
    gmPrestige: {
      prestige: gmPrestigeState.prestige,
    },
    scouting: {
      department: scoutingState.department,
      scoutPool: scoutingState.scoutPool,
      teamId: scoutingState.teamId,
      currentWeek: scoutingState.currentWeek,
      currentPeriod: scoutingState.currentPeriod,
      weeklyPointsAvailable: scoutingState.weeklyPointsAvailable,
      weeklyPointsSpent: scoutingState.weeklyPointsSpent,
      assignments: scoutingState.assignments,
      reports: scoutingState.reports,
      recommendations: scoutingState.recommendations,
      draftAccuracy: scoutingState.draftAccuracy,
      currentSeason: scoutingState.currentSeason,
    },
    career: {
      selectedTeam: careerState.selectedTeam,
      playerTeamId: careerState.playerTeamId,
    },

    // localStorage data
    careerStats,
  };
}

// ============================================================================
// HYDRATE STORES
// ============================================================================

/**
 * Restore all store state from saved game data
 */
export function hydrateStores(gameData: GameStateData): void {
  // Hydrate GM Points store
  if (gameData.gmPoints) {
    const data = gameData.gmPoints as {
      points: unknown;
      transactions: unknown;
    };
    useGMPointsStore.setState({
      points: data.points as ReturnType<typeof useGMPointsStore.getState>["points"],
      transactions: data.transactions as ReturnType<typeof useGMPointsStore.getState>["transactions"],
    });
  }

  // Hydrate GM Equipment store
  if (gameData.gmEquipment) {
    const data = gameData.gmEquipment as {
      equipment: unknown;
      isOffseason: boolean;
      currentPhase: string;
    };
    useGMEquipmentStore.setState({
      equipment: data.equipment as ReturnType<typeof useGMEquipmentStore.getState>["equipment"],
      isOffseason: data.isOffseason,
      currentPhase: data.currentPhase as "preseason" | "regular" | "playoffs" | "offseason",
    });
  }

  // Hydrate GM Prestige store
  if (gameData.gmPrestige) {
    const data = gameData.gmPrestige as { prestige: unknown };
    useGMPrestigeStore.setState({
      prestige: data.prestige as ReturnType<typeof useGMPrestigeStore.getState>["prestige"],
    });
  }

  // Hydrate Scouting store
  if (gameData.scouting) {
    const data = gameData.scouting as Record<string, unknown>;
    useScoutingStore.setState({
      department: data.department as ReturnType<typeof useScoutingStore.getState>["department"],
      scoutPool: data.scoutPool as ReturnType<typeof useScoutingStore.getState>["scoutPool"],
      teamId: data.teamId as string | null,
      currentWeek: data.currentWeek as number,
      currentPeriod: data.currentPeriod as ReturnType<typeof useScoutingStore.getState>["currentPeriod"],
      weeklyPointsAvailable: data.weeklyPointsAvailable as number,
      weeklyPointsSpent: data.weeklyPointsSpent as number,
      assignments: data.assignments as ReturnType<typeof useScoutingStore.getState>["assignments"],
      reports: data.reports as ReturnType<typeof useScoutingStore.getState>["reports"],
      recommendations: data.recommendations as ReturnType<typeof useScoutingStore.getState>["recommendations"],
      draftAccuracy: data.draftAccuracy as ReturnType<typeof useScoutingStore.getState>["draftAccuracy"],
      currentSeason: data.currentSeason as number,
    });
  }

  // Hydrate Career store
  if (gameData.career) {
    const data = gameData.career as {
      selectedTeam: unknown;
      playerTeamId: string | null;
    };
    useCareerStore.setState({
      selectedTeam: data.selectedTeam as ReturnType<typeof useCareerStore.getState>["selectedTeam"],
      playerTeamId: data.playerTeamId,
    });
  }

  // Hydrate localStorage career stats
  if (gameData.careerStats) {
    localStorage.setItem(
      CAREER_STATS_STORAGE_KEY,
      JSON.stringify(gameData.careerStats)
    );
  }
}

// ============================================================================
// SAVE GAME
// ============================================================================

export interface SaveGameResult {
  success: boolean;
  error?: string;
  saveId?: string;
}

/**
 * Save current game state to a slot
 */
export async function saveGame(
  slotNumber: number,
  name: string
): Promise<SaveGameResult> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // Validate slot number
  if (slotNumber < 1 || slotNumber > 5) {
    return { success: false, error: "Invalid slot number (must be 1-5)" };
  }

  // Collect game state
  const gameData = collectGameState();
  const careerState = useCareerStore.getState();

  const saveData: SaveGameInsert = {
    user_id: user.id,
    slot_number: slotNumber,
    name,
    team_id: careerState.playerTeamId,
    team_name: careerState.selectedTeam?.name || null,
    season: 1, // TODO: Get from game state when season tracking exists
    week: 1, // TODO: Get from game state when week tracking exists
    game_data: gameData,
  };

  // Upsert (insert or update if exists)
  const { data, error } = await supabase
    .from("save_games")
    .upsert(saveData, {
      onConflict: "user_id,slot_number",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Save game error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, saveId: data?.id };
}

// ============================================================================
// LIST SAVES
// ============================================================================

/**
 * Get all save slots for current user (5 slots, some may be empty)
 */
export async function listSaves(): Promise<SaveSlot[]> {
  const supabase = createClient();
  if (!supabase) {
    // Return 5 empty slots if Supabase not configured
    return Array.from({ length: 5 }, (_, i) => ({
      slotNumber: i + 1,
      isEmpty: true as const,
    }));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return 5 empty slots if not authenticated
    return Array.from({ length: 5 }, (_, i) => ({
      slotNumber: i + 1,
      isEmpty: true as const,
    }));
  }

  const { data: saves, error } = await supabase
    .from("save_games")
    .select("*")
    .eq("user_id", user.id)
    .order("slot_number");

  if (error) {
    console.error("List saves error:", error);
    return Array.from({ length: 5 }, (_, i) => ({
      slotNumber: i + 1,
      isEmpty: true as const,
    }));
  }

  // Build 5-slot array
  const slots: SaveSlot[] = [];
  for (let i = 1; i <= 5; i++) {
    const save = saves?.find((s) => s.slot_number === i) as SaveGameRow | undefined;
    if (save) {
      slots.push({
        id: save.id,
        slotNumber: save.slot_number,
        name: save.name,
        teamId: save.team_id,
        teamName: save.team_name,
        season: save.season,
        week: save.week,
        createdAt: new Date(save.created_at),
        updatedAt: new Date(save.updated_at),
        isEmpty: false as const,
      });
    } else {
      slots.push({
        slotNumber: i,
        isEmpty: true as const,
      });
    }
  }

  return slots;
}

// ============================================================================
// LOAD GAME
// ============================================================================

export interface LoadGameResult {
  success: boolean;
  error?: string;
}

/**
 * Load game from a save slot and hydrate all stores
 */
export async function loadGame(saveId: string): Promise<LoadGameResult> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: save, error } = await supabase
    .from("save_games")
    .select("*")
    .eq("id", saveId)
    .eq("user_id", user.id)
    .single();

  if (error || !save) {
    return { success: false, error: error?.message || "Save not found" };
  }

  try {
    hydrateStores(save.game_data as GameStateData);
    return { success: true };
  } catch (err) {
    console.error("Hydrate stores error:", err);
    return { success: false, error: "Failed to restore game state" };
  }
}

// ============================================================================
// DELETE SAVE
// ============================================================================

export interface DeleteSaveResult {
  success: boolean;
  error?: string;
}

/**
 * Delete a save slot
 */
export async function deleteSave(saveId: string): Promise<DeleteSaveResult> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: "Supabase not configured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("save_games")
    .delete()
    .eq("id", saveId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
