import type {
  GMArchetype,
  GMBackground,
  GMSynergy,
  SynergyKey,
} from '@/types/gm-persona';

// All 6 GM Backgrounds (from FINAL-gm-skills-perks-system.md Part 1)
export const backgrounds: GMBackground[] = [
  {
    id: 'scout',
    name: 'Scout',
    icon: 'SC',
    description: 'Former scouting director with an eye for talent.',
    passiveBonus: '+10% scouting accuracy, +1 sleeper/draft',
    bestArchetype: 'the_talent_scout',
  },
  {
    id: 'cap_analyst',
    name: 'Cap Analyst',
    icon: 'CA',
    description: 'Salary cap expert who maximizes every dollar.',
    passiveBonus: '+$5M cap space, -5% contract demands',
    bestArchetype: 'the_economist',
  },
  {
    id: 'coach',
    name: 'Coach',
    icon: 'CO',
    description: 'Former coordinator/HC who understands player development.',
    passiveBonus: '+10% player development, +5 coach appeal',
    bestArchetype: 'the_builder',
  },
  {
    id: 'agent',
    name: 'Agent',
    icon: 'AG',
    description: 'Former player agent who knows contract negotiations.',
    passiveBonus: '-10% contract demands, +10% FA appeal',
    bestArchetype: 'the_closer',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: 'AN',
    description: 'Data-driven executive who sees the game through numbers.',
    passiveBonus: '+5% all evaluation accuracy, advanced stats',
    bestArchetype: 'the_innovator',
  },
  {
    id: 'legacy',
    name: 'Legacy',
    icon: 'LE',
    description: 'Family football dynasty with deep connections.',
    passiveBonus: '+15% fan loyalty, +10% owner patience',
    bestArchetype: 'the_culture_builder',
  },
];

// All 6 GM Archetypes (from FINAL-gm-skills-perks-system.md Part 1)
export const archetypes: GMArchetype[] = [
  {
    id: 'the_builder',
    name: 'The Builder',
    icon: 'TB',
    philosophy: '"Draft and develop - build from within."',
    description:
      'You believe in building through the draft and developing homegrown talent. Patience and player growth are your strengths.',
    startingSkill: {
      id: 'training_boost',
      name: 'Training Boost',
      tier: 'Bronze',
      description: 'All players under 25 gain +1 dev speed',
      category: 'player_development',
    },
    synergyBonus: '+25% XP for players under 25',
    skillDiscountCategory: 'player_development',
    recommendedFor: 'Patient players who enjoy long-term team building',
  },
  {
    id: 'the_closer',
    name: 'The Closer',
    icon: 'TC',
    philosophy: '"Win now - make the big moves."',
    description:
      'You are aggressive and ready to win. Trade picks for proven talent, sign big free agents, and push all chips to the middle.',
    startingSkill: {
      id: 'trade_master',
      name: 'Trade Master',
      tier: 'Bronze',
      description: 'CPU teams 10% more willing to accept trades',
      category: 'trades',
    },
    synergyBonus: '+15% trade acceptance',
    skillDiscountCategory: 'trades',
    recommendedFor: 'Players who want to compete immediately',
  },
  {
    id: 'the_economist',
    name: 'The Economist',
    icon: 'TE',
    philosophy: '"Cap efficiency - every dollar matters."',
    description:
      'You are a master of the salary cap. Structure deals, find bargains, and always have cap flexibility when you need it.',
    startingSkill: {
      id: 'salary_cap_wizard',
      name: 'Salary Cap Wizard',
      tier: 'Bronze',
      description: '+$3M extra cap space each season',
      category: 'contracts_money',
    },
    synergyBonus: '+$3M cap space',
    skillDiscountCategory: 'contracts_money',
    recommendedFor: 'Players who enjoy roster construction puzzles',
  },
  {
    id: 'the_talent_scout',
    name: 'The Talent Scout',
    icon: 'TS',
    philosophy: '"Find hidden gems - see what others miss."',
    description:
      'You have an eye for talent that others overlook. Finding diamonds in the rough and late-round steals is your specialty.',
    startingSkill: {
      id: 'hidden_gem',
      name: 'Hidden Gem',
      tier: 'Bronze',
      description: 'Reveal true potential of 1 late-round (R5-7) prospect',
      category: 'scouting_draft',
    },
    synergyBonus: '+2 sleepers/draft',
    skillDiscountCategory: 'scouting_draft',
    recommendedFor: 'Players who love the draft and finding value',
  },
  {
    id: 'the_culture_builder',
    name: 'The Culture Builder',
    icon: 'CB',
    philosophy: '"Culture beats talent - belief beats ability."',
    description:
      'You are a leader of men. Players play harder for you. Locker rooms are united. Teams exceed the sum of their parts.',
    startingSkill: {
      id: 'morale_master',
      name: 'Morale Master',
      tier: 'Bronze',
      description: 'Team morale minimum 60%',
      category: 'team_management',
    },
    synergyBonus: '+15% morale floor',
    skillDiscountCategory: 'team_management',
    recommendedFor: 'Players who enjoy team chemistry management',
  },
  {
    id: 'the_innovator',
    name: 'The Innovator',
    icon: 'TI',
    philosophy: '"Analytics edge - data drives decisions."',
    description:
      'You leverage data and advanced metrics to gain an edge. You see patterns and opportunities others miss.',
    startingSkill: {
      id: 'inside_sources',
      name: 'Inside Sources',
      tier: 'Bronze',
      description: "See other teams' biggest needs",
      category: 'meta_qol',
    },
    synergyBonus: 'Opponent tendencies revealed',
    skillDiscountCategory: 'meta_qol',
    recommendedFor: 'Players who enjoy data-driven decisions',
  },
];

// All 6 Synergies (1:1 mapping from FINAL-gm-skills-perks-system.md)
export const synergies: GMSynergy[] = [
  {
    id: 'scout_talent_scout',
    name: 'The Draft Whisperer',
    backgroundId: 'scout',
    archetypeId: 'the_talent_scout',
    bonus: '+3 sleepers/draft, exact OVR Round 1',
  },
  {
    id: 'cap_analyst_economist',
    name: 'The Moneyball',
    backgroundId: 'cap_analyst',
    archetypeId: 'the_economist',
    bonus: '+$8M total cap, -10% demands',
  },
  {
    id: 'coach_builder',
    name: 'The Academy',
    backgroundId: 'coach',
    archetypeId: 'the_builder',
    bonus: '+40% young player development',
  },
  {
    id: 'agent_closer',
    name: 'The Dealmaker',
    backgroundId: 'agent',
    archetypeId: 'the_closer',
    bonus: '-15% demands, +25% trade acceptance',
  },
  {
    id: 'analytics_innovator',
    name: 'The Optimizer',
    backgroundId: 'analytics',
    archetypeId: 'the_innovator',
    bonus: 'Full opponent scouting, advanced projections',
  },
  {
    id: 'legacy_culture_builder',
    name: 'The Dynasty',
    backgroundId: 'legacy',
    archetypeId: 'the_culture_builder',
    bonus: '+25% morale, +20% fan loyalty',
  },
];

// Synergy lookup map for quick access
export const synergyMap: Record<SynergyKey, GMSynergy> = synergies.reduce(
  (acc, synergy) => {
    const key: SynergyKey = `${synergy.backgroundId}_${synergy.archetypeId}`;
    acc[key] = synergy;
    return acc;
  },
  {} as Record<SynergyKey, GMSynergy>
);

// Helper to get archetype by ID
export function getArchetypeById(id: string): GMArchetype | undefined {
  return archetypes.find((a) => a.id === id);
}

// Helper to get background by ID
export function getBackgroundById(id: string): GMBackground | undefined {
  return backgrounds.find((b) => b.id === id);
}

// Helper to get synergy by ID
export function getSynergyById(id: string): GMSynergy | undefined {
  return synergies.find((s) => s.id === id);
}

// Helper to check if a background-archetype combo has synergy
export function hasSynergy(backgroundId: string, archetypeId: string): boolean {
  const background = getBackgroundById(backgroundId);
  return background?.bestArchetype === archetypeId;
}

// Helper to get synergy for a background-archetype combo
export function getSynergyForCombo(
  backgroundId: string,
  archetypeId: string
): GMSynergy | null {
  const key = `${backgroundId}_${archetypeId}` as SynergyKey;
  return synergyMap[key] || null;
}
