import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TeamInfo } from "@/lib/data/teams";

/**
 * Career Store - Owner Model
 *
 * User is the Owner, not the GM. They pick a team after league generation
 * and inherit the pre-assigned GM.
 */
interface CareerCreationState {
  // Hydration state
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Team selection (Owner picks team, inherits GM)
  selectedTeam: TeamInfo | null;
  playerTeamId: string | null;

  // Actions
  setTeam: (team: TeamInfo) => void;
  reset: () => void;

  // Computed helpers
  hasTeam: () => boolean;
  isComplete: () => boolean;
}

export const useCareerStore = create<CareerCreationState>()(
  persist(
    (set, get) => ({
      // Hydration state
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

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
    }),
    {
      name: "career-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
