import { create } from "zustand";
import type { GMArchetype, GMBackground, GMPersona } from "@/types/gm-persona";
import type { Team } from "@/data/teams";
import { createGMPersona, getSynergy } from "@/lib/gm-persona-utils";

interface CareerCreationState {
  // GM Persona selection
  selectedArchetype: GMArchetype | null;
  selectedBackground: GMBackground | null;
  persona: GMPersona | null;

  // Team selection
  selectedTeam: Team | null;

  // Actions
  setArchetype: (archetype: GMArchetype) => void;
  setBackground: (background: GMBackground) => void;
  setTeam: (team: Team) => void;
  buildPersona: () => void;
  reset: () => void;

  // Computed helpers
  hasArchetype: () => boolean;
  hasBackground: () => boolean;
  hasPersona: () => boolean;
  hasTeam: () => boolean;
  isComplete: () => boolean;
}

export const useCareerStore = create<CareerCreationState>((set, get) => ({
  // Initial state
  selectedArchetype: null,
  selectedBackground: null,
  persona: null,
  selectedTeam: null,

  // Set archetype
  setArchetype: (archetype) => {
    set({ selectedArchetype: archetype });
    // Auto-build persona if background is already selected
    const { selectedBackground } = get();
    if (selectedBackground) {
      const synergy = getSynergy(selectedBackground.id, archetype.id);
      const persona = createGMPersona(selectedBackground, archetype);
      set({ persona });
    }
  },

  // Set background
  setBackground: (background) => {
    set({ selectedBackground: background });
    // Auto-build persona if archetype is already selected
    const { selectedArchetype } = get();
    if (selectedArchetype) {
      const persona = createGMPersona(background, selectedArchetype);
      set({ persona });
    }
  },

  // Set team
  setTeam: (team) => {
    set({ selectedTeam: team });
  },

  // Build persona from current selections
  buildPersona: () => {
    const { selectedArchetype, selectedBackground } = get();
    if (selectedArchetype && selectedBackground) {
      const persona = createGMPersona(selectedBackground, selectedArchetype);
      set({ persona });
    }
  },

  // Reset all state
  reset: () => {
    set({
      selectedArchetype: null,
      selectedBackground: null,
      persona: null,
      selectedTeam: null,
    });
  },

  // Computed helpers
  hasArchetype: () => get().selectedArchetype !== null,
  hasBackground: () => get().selectedBackground !== null,
  hasPersona: () => get().persona !== null,
  hasTeam: () => get().selectedTeam !== null,
  isComplete: () => {
    const state = get();
    return state.persona !== null && state.selectedTeam !== null;
  },
}));
