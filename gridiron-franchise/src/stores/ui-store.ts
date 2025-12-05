import { create } from "zustand";

/**
 * UI Store
 *
 * Manages UI state like header titles that need to be shared
 * across components. No persistence needed.
 */
interface UIStoreState {
  // Header title override (null = use route default)
  headerTitle: string | null;

  // Actions
  setHeaderTitle: (title: string | null) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  // Initial state
  headerTitle: null,

  // Set header title (pass null to reset to route default)
  setHeaderTitle: (title) => {
    set({ headerTitle: title });
  },
}));
