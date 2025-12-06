/**
 * Supabase Database Types
 *
 * TypeScript definitions for Supabase tables.
 * Keep in sync with migrations.
 */

// ============================================================================
// SAVE GAMES TABLE
// ============================================================================

export interface SaveGameRow {
  id: string;
  user_id: string;
  slot_number: number;
  name: string;
  team_id: string | null;
  team_name: string | null;
  season: number;
  week: number;
  game_data: GameStateData;
  created_at: string;
  updated_at: string;
}

export interface SaveGameInsert {
  id?: string;
  user_id: string;
  slot_number: number;
  name?: string;
  team_id?: string | null;
  team_name?: string | null;
  season?: number;
  week?: number;
  game_data: GameStateData;
}

export interface SaveGameUpdate {
  name?: string;
  team_id?: string | null;
  team_name?: string | null;
  season?: number;
  week?: number;
  game_data?: GameStateData;
}

// ============================================================================
// GAME STATE DATA (stored in game_data JSONB)
// ============================================================================

export interface GameStateData {
  version: string;
  savedAt: string;

  // Zustand store states
  gmPoints?: unknown;
  gmEquipment?: unknown;
  gmPrestige?: unknown;
  scouting?: unknown;
  career?: unknown;

  // localStorage data
  careerStats?: unknown;
  training?: unknown;
}

// ============================================================================
// SAVE SLOT METADATA (for UI display)
// ============================================================================

export interface SaveSlotMetadata {
  id: string;
  slotNumber: number;
  name: string;
  teamId: string | null;
  teamName: string | null;
  season: number;
  week: number;
  createdAt: Date;
  updatedAt: Date;
  isEmpty: false;
}

export interface EmptySaveSlot {
  slotNumber: number;
  isEmpty: true;
}

export type SaveSlot = SaveSlotMetadata | EmptySaveSlot;
