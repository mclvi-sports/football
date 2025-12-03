import { create } from "zustand";
import type { Team } from "@/data/teams";

/**
 * Career Store - Owner Model
 *
 * User is the Owner, not the GM. They pick a team after league generation
 * and inherit the pre-assigned GM.
 */
interface CareerCreationState {
  // Team selection (Owner picks team, inherits GM)
  selectedTeam: Team | null;
  playerTeamId: string | null;

  // Actions
  setTeam: (team: Team) => void;
  reset: () => void;

  // Computed helpers
  hasTeam: () => boolean;
  isComplete: () => boolean;
}

export const useCareerStore = create<CareerCreationState>((set, get) => ({
  // Initial state
  selectedTeam: null,
  playerTeamId: null,

  // Set team (Owner model - user picks team, inherits GM)
  setTeam: (team) => {
    set({ selectedTeam: team, playerTeamId: team.id });
  },

  // Reset all state
  reset: () => {
    set({
      selectedTeam: null,
      playerTeamId: null,
    });
  },

  // Computed helpers
  hasTeam: () => get().selectedTeam !== null,
  isComplete: () => get().selectedTeam !== null,
}));
