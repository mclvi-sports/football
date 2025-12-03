import type {
  GMBackground,
  GMArchetype,
  GMBonuses,
  BackgroundDefinition,
  ArchetypeDefinition,
  SynergyDefinition,
} from './types';

// ============================================================================
// DEFAULT BONUSES
// ============================================================================

export const DEFAULT_BONUSES: GMBonuses = {
  scoutingAccuracy: 0,
  contractDemands: 0,
  tradeAcceptance: 0,
  playerDevelopment: 0,
  freeAgentAppeal: 0,
  teamMorale: 0,
  capSpace: 0,
  ownerPatience: 0,
  coachAppeal: 0,
  fanLoyalty: 0,
  sleepersPerDraft: 0,
};

// ============================================================================
// BACKGROUNDS
// ============================================================================

export const GM_BACKGROUNDS: Record<GMBackground, BackgroundDefinition> = {
  scout: {
    id: 'scout',
    name: 'Scout',
    description: 'Former scouting director with an eye for talent',
    bonuses: {
      scoutingAccuracy: 10,
      sleepersPerDraft: 1,
    },
    synergyArchetype: 'talent_scout',
  },
  cap_analyst: {
    id: 'cap_analyst',
    name: 'Cap Analyst',
    description: 'Salary cap expert who maximizes roster value',
    bonuses: {
      capSpace: 5,
      contractDemands: -5,
    },
    synergyArchetype: 'economist',
  },
  coach: {
    id: 'coach',
    name: 'Coach',
    description: 'Former coordinator or head coach',
    bonuses: {
      playerDevelopment: 10,
      coachAppeal: 5,
    },
    synergyArchetype: 'builder',
  },
  agent: {
    id: 'agent',
    name: 'Agent',
    description: 'Former player agent with negotiation skills',
    bonuses: {
      contractDemands: -10,
      freeAgentAppeal: 10,
    },
    synergyArchetype: 'closer',
  },
  analytics: {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data-driven executive using advanced metrics',
    bonuses: {
      scoutingAccuracy: 5,
    },
    synergyArchetype: 'innovator',
  },
  legacy: {
    id: 'legacy',
    name: 'Legacy',
    description: 'Family football dynasty with deep roots',
    bonuses: {
      fanLoyalty: 15,
      ownerPatience: 10,
    },
    synergyArchetype: 'culture_builder',
  },
};

// ============================================================================
// ARCHETYPES
// ============================================================================

export const GM_ARCHETYPES: Record<GMArchetype, ArchetypeDefinition> = {
  builder: {
    id: 'builder',
    name: 'The Builder',
    philosophy: 'Draft and develop young talent',
    startingSkill: 'Training Boost (Bronze)',
    bonuses: {
      playerDevelopment: 25, // +25% XP for players under 25
    },
    synergyBackground: 'coach',
  },
  closer: {
    id: 'closer',
    name: 'The Closer',
    philosophy: 'Win now with big moves',
    startingSkill: 'Trade Master (Bronze)',
    bonuses: {
      tradeAcceptance: 15,
    },
    synergyBackground: 'agent',
  },
  economist: {
    id: 'economist',
    name: 'The Economist',
    philosophy: 'Cap efficiency and value deals',
    startingSkill: 'Salary Cap Wizard (Bronze)',
    bonuses: {
      capSpace: 3,
    },
    synergyBackground: 'cap_analyst',
  },
  talent_scout: {
    id: 'talent_scout',
    name: 'The Talent Scout',
    philosophy: 'Find hidden gems others miss',
    startingSkill: 'Hidden Gem (Bronze)',
    bonuses: {
      sleepersPerDraft: 2,
    },
    synergyBackground: 'scout',
  },
  culture_builder: {
    id: 'culture_builder',
    name: 'The Culture Builder',
    philosophy: 'Team chemistry and morale',
    startingSkill: 'Morale Master (Bronze)',
    bonuses: {
      teamMorale: 15,
    },
    synergyBackground: 'legacy',
  },
  innovator: {
    id: 'innovator',
    name: 'The Innovator',
    philosophy: 'Analytics-driven edge',
    startingSkill: 'Inside Sources (Bronze)',
    bonuses: {
      scoutingAccuracy: 10,
    },
    synergyBackground: 'analytics',
  },
};

// ============================================================================
// SYNERGIES
// ============================================================================

export const GM_SYNERGIES: SynergyDefinition[] = [
  {
    background: 'scout',
    archetype: 'talent_scout',
    name: 'The Eye',
    description: 'Unmatched ability to find hidden talent',
    bonuses: {
      sleepersPerDraft: 3,
      scoutingAccuracy: 15, // Exact OVR for Round 1 picks
    },
  },
  {
    background: 'cap_analyst',
    archetype: 'economist',
    name: 'Cap Wizard',
    description: 'Master of the salary cap',
    bonuses: {
      capSpace: 8,
      contractDemands: -10,
    },
  },
  {
    background: 'coach',
    archetype: 'builder',
    name: 'Player Whisperer',
    description: 'Exceptional at developing young players',
    bonuses: {
      playerDevelopment: 40,
    },
  },
  {
    background: 'agent',
    archetype: 'closer',
    name: 'The Dealmaker',
    description: 'Closes every deal on favorable terms',
    bonuses: {
      contractDemands: -15,
      tradeAcceptance: 25,
    },
  },
  {
    background: 'analytics',
    archetype: 'innovator',
    name: 'The Oracle',
    description: 'Sees what others cannot',
    bonuses: {
      scoutingAccuracy: 20,
    },
  },
  {
    background: 'legacy',
    archetype: 'culture_builder',
    name: 'The Dynasty',
    description: 'Creates a winning culture',
    bonuses: {
      teamMorale: 25,
      fanLoyalty: 20,
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if background and archetype create a synergy
 */
export function hasSynergy(background: GMBackground, archetype: GMArchetype): boolean {
  return GM_SYNERGIES.some(
    (s) => s.background === background && s.archetype === archetype
  );
}

/**
 * Get synergy definition if one exists
 */
export function getSynergy(
  background: GMBackground,
  archetype: GMArchetype
): SynergyDefinition | null {
  return (
    GM_SYNERGIES.find(
      (s) => s.background === background && s.archetype === archetype
    ) || null
  );
}

/**
 * Calculate total bonuses from background + archetype + synergy
 */
export function calculateBonuses(
  background: GMBackground,
  archetype: GMArchetype
): GMBonuses {
  const bonuses = { ...DEFAULT_BONUSES };

  // Add background bonuses
  const bgDef = GM_BACKGROUNDS[background];
  if (bgDef.bonuses) {
    Object.entries(bgDef.bonuses).forEach(([key, value]) => {
      bonuses[key as keyof GMBonuses] += value as number;
    });
  }

  // Add archetype bonuses
  const archDef = GM_ARCHETYPES[archetype];
  if (archDef.bonuses) {
    Object.entries(archDef.bonuses).forEach(([key, value]) => {
      bonuses[key as keyof GMBonuses] += value as number;
    });
  }

  // Add synergy bonuses if applicable
  const synergy = getSynergy(background, archetype);
  if (synergy?.bonuses) {
    Object.entries(synergy.bonuses).forEach(([key, value]) => {
      bonuses[key as keyof GMBonuses] += value as number;
    });
  }

  return bonuses;
}

/**
 * Get all backgrounds as array for UI
 */
export function getBackgroundsList(): BackgroundDefinition[] {
  return Object.values(GM_BACKGROUNDS);
}

/**
 * Get all archetypes as array for UI
 */
export function getArchetypesList(): ArchetypeDefinition[] {
  return Object.values(GM_ARCHETYPES);
}
