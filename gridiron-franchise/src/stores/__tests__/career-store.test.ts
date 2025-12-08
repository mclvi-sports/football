import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCareerStore } from '../career-store';
import type { TeamInfo } from '@/lib/data/teams';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Sample team for testing
const mockTeam: TeamInfo = {
  id: 'BOS',
  city: 'Boston',
  name: 'Rebels',
  conference: 'Atlantic',
  division: 'Atlantic North',
  colors: {
    primary: '#0A2240',
    secondary: '#A8A9AD',
  },
};

const mockTeam2: TeamInfo = {
  id: 'MIA',
  city: 'Miami',
  name: 'Sharks',
  conference: 'Atlantic',
  division: 'Atlantic South',
  colors: {
    primary: '#008E97',
    secondary: '#FF6F61',
  },
};

describe('useCareerStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    const store = useCareerStore.getState();
    store.reset();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with null selectedTeam', () => {
      const { selectedTeam } = useCareerStore.getState();
      expect(selectedTeam).toBeNull();
    });

    it('starts with null playerTeamId', () => {
      const { playerTeamId } = useCareerStore.getState();
      expect(playerTeamId).toBeNull();
    });

    it('hasTeam returns false initially', () => {
      const { hasTeam } = useCareerStore.getState();
      expect(hasTeam()).toBe(false);
    });

    it('isComplete returns false initially', () => {
      const { isComplete } = useCareerStore.getState();
      expect(isComplete()).toBe(false);
    });
  });

  describe('setTeam', () => {
    it('sets selectedTeam correctly', () => {
      const { setTeam } = useCareerStore.getState();
      setTeam(mockTeam);

      const { selectedTeam } = useCareerStore.getState();
      expect(selectedTeam).toEqual(mockTeam);
    });

    it('sets playerTeamId to team id', () => {
      const { setTeam } = useCareerStore.getState();
      setTeam(mockTeam);

      const { playerTeamId } = useCareerStore.getState();
      expect(playerTeamId).toBe('BOS');
    });

    it('hasTeam returns true after setting team', () => {
      const { setTeam, hasTeam } = useCareerStore.getState();
      setTeam(mockTeam);
      expect(hasTeam()).toBe(true);
    });

    it('isComplete returns true after setting team', () => {
      const { setTeam, isComplete } = useCareerStore.getState();
      setTeam(mockTeam);
      expect(isComplete()).toBe(true);
    });

    it('can change team to a different one', () => {
      const { setTeam } = useCareerStore.getState();
      setTeam(mockTeam);
      setTeam(mockTeam2);

      const { selectedTeam, playerTeamId } = useCareerStore.getState();
      expect(selectedTeam?.id).toBe('MIA');
      expect(playerTeamId).toBe('MIA');
    });
  });

  describe('reset', () => {
    it('clears selectedTeam', () => {
      const { setTeam, reset } = useCareerStore.getState();
      setTeam(mockTeam);
      reset();

      const { selectedTeam } = useCareerStore.getState();
      expect(selectedTeam).toBeNull();
    });

    it('clears playerTeamId', () => {
      const { setTeam, reset } = useCareerStore.getState();
      setTeam(mockTeam);
      reset();

      const { playerTeamId } = useCareerStore.getState();
      expect(playerTeamId).toBeNull();
    });

    it('hasTeam returns false after reset', () => {
      const { setTeam, reset, hasTeam } = useCareerStore.getState();
      setTeam(mockTeam);
      reset();
      expect(hasTeam()).toBe(false);
    });

    it('isComplete returns false after reset', () => {
      const { setTeam, reset, isComplete } = useCareerStore.getState();
      setTeam(mockTeam);
      reset();
      expect(isComplete()).toBe(false);
    });
  });

  describe('computed helpers', () => {
    it('hasTeam is reactive to state changes', () => {
      const store = useCareerStore.getState();

      expect(store.hasTeam()).toBe(false);
      store.setTeam(mockTeam);
      expect(store.hasTeam()).toBe(true);
      store.reset();
      expect(store.hasTeam()).toBe(false);
    });

    it('isComplete is reactive to state changes', () => {
      const store = useCareerStore.getState();

      expect(store.isComplete()).toBe(false);
      store.setTeam(mockTeam);
      expect(store.isComplete()).toBe(true);
      store.reset();
      expect(store.isComplete()).toBe(false);
    });
  });
});
