import type {
  GMSkillDefinition,
  SkillCategory,
  SkillCategoryId,
  SkillSetBonus,
  StackingRule,
  SKILL_TIER_COSTS,
} from '@/types/gm-skills';

// ============================================================================
// SKILL CATEGORIES
// ============================================================================

export const skillCategories: SkillCategory[] = [
  {
    id: 'scouting_draft',
    name: 'Scouting & Draft',
    icon: '🔍',
    description: 'Improve prospect evaluation and draft day decisions',
  },
  {
    id: 'contracts_money',
    name: 'Contracts & Money',
    icon: '💰',
    description: 'Master salary cap and contract negotiations',
  },
  {
    id: 'trades',
    name: 'Trades',
    icon: '🔄',
    description: 'Improve trade acceptance and find better deals',
  },
  {
    id: 'player_development',
    name: 'Player Development',
    icon: '⭐',
    description: 'Accelerate player growth and manage aging',
  },
  {
    id: 'team_management',
    name: 'Team Management',
    icon: '🏆',
    description: 'Improve team chemistry, morale, and appeal',
  },
  {
    id: 'coaching_staff',
    name: 'Coaching & Staff',
    icon: '🎓',
    description: 'Hire better coaches and develop staff',
  },
  {
    id: 'facilities_operations',
    name: 'Facilities & Operations',
    icon: '🏟️',
    description: 'Reduce costs and improve facilities',
  },
  {
    id: 'meta_qol',
    name: 'Meta & Quality of Life',
    icon: '⚡',
    description: 'Simulation speed and insider information',
  },
];

// ============================================================================
// CATEGORY 1: SCOUTING & DRAFT
// ============================================================================

export const scoutingSkills: GMSkillDefinition[] = [
  {
    id: 'hidden_gem',
    name: 'Hidden Gem',
    category: 'scouting_draft',
    tiers: [
      { tier: 'bronze', effect: 'Reveal true potential of 1 late-round (R5-7) prospect', cost: 100 },
      { tier: 'silver', effect: 'Reveal true potential of 3 late-round prospects', cost: 250 },
      { tier: 'gold', effect: 'Reveal true potential of 5 prospects from ANY round', cost: 500 },
    ],
  },
  {
    id: 'draft_day_genius',
    name: 'Draft Day Genius',
    category: 'scouting_draft',
    tiers: [
      { tier: 'bronze', effect: 'See exact OVR for Top 10 prospects', cost: 100 },
      { tier: 'silver', effect: 'See exact OVR for Top 30 prospects', cost: 250 },
      { tier: 'gold', effect: 'See exact OVR for ALL prospects', cost: 500 },
    ],
  },
  {
    id: 'position_guru',
    name: 'Position Guru',
    category: 'scouting_draft',
    stackable: true,
    note: 'Can equip multiple for different positions',
    tiers: [
      { tier: 'bronze', effect: '+5 OVR scouting accuracy for ONE position group', cost: 100 },
      { tier: 'silver', effect: '+5 OVR scouting accuracy for TWO position groups', cost: 250 },
      { tier: 'gold', effect: '+3 OVR scouting accuracy for ALL positions', cost: 500 },
    ],
  },
  {
    id: 'combine_expert',
    name: 'Combine Expert',
    category: 'scouting_draft',
    tiers: [
      { tier: 'bronze', effect: 'See exact physical attributes at Combine', cost: 100 },
      { tier: 'silver', effect: 'See physical + 2 key position attributes', cost: 250 },
      { tier: 'gold', effect: 'See all attributes before draft', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 2: CONTRACTS & MONEY
// ============================================================================

export const contractsSkills: GMSkillDefinition[] = [
  {
    id: 'salary_cap_wizard',
    name: 'Salary Cap Wizard',
    category: 'contracts_money',
    tiers: [
      { tier: 'bronze', effect: '+$3M extra cap space each season', cost: 100 },
      { tier: 'silver', effect: '+$5M extra cap space each season', cost: 250 },
      { tier: 'gold', effect: '+$8M extra cap space each season', cost: 500 },
    ],
  },
  {
    id: 'smooth_talker',
    name: 'Smooth Talker',
    category: 'contracts_money',
    tiers: [
      { tier: 'bronze', effect: 'Players accept 5% less salary', cost: 100 },
      { tier: 'silver', effect: 'Players accept 10% less salary', cost: 250 },
      { tier: 'gold', effect: 'Players accept 15% less salary', cost: 500 },
    ],
  },
  {
    id: 'creative_contracts',
    name: 'Creative Contracts',
    category: 'contracts_money',
    tiers: [
      { tier: 'bronze', effect: 'Unlock incentives that reduce cap hit 10%', cost: 100 },
      { tier: 'silver', effect: 'Unlock signing bonus restructures', cost: 250 },
      { tier: 'gold', effect: 'Unlock "team-friendly" contracts with 20% reduced cap', cost: 500 },
    ],
  },
  {
    id: 'cap_architect',
    name: 'Cap Architect',
    category: 'contracts_money',
    tiers: [
      { tier: 'bronze', effect: 'See 2-year cap projections', cost: 100 },
      { tier: 'silver', effect: 'See 4-year cap projections', cost: 250 },
      { tier: 'gold', effect: 'See full contract impact + dead money warnings', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 3: TRADES
// ============================================================================

export const tradesSkills: GMSkillDefinition[] = [
  {
    id: 'trade_master',
    name: 'Trade Master',
    category: 'trades',
    tiers: [
      { tier: 'bronze', effect: 'CPU teams 10% more willing to accept trades', cost: 100 },
      { tier: 'silver', effect: 'CPU teams 20% more willing to accept trades', cost: 250 },
      { tier: 'gold', effect: 'CPU teams 30% more willing to accept trades', cost: 500 },
    ],
  },
  {
    id: 'value_finder',
    name: 'Value Finder',
    category: 'trades',
    tiers: [
      { tier: 'bronze', effect: 'See AI trade value as "Fair/Unfair/Very Unfair"', cost: 100 },
      { tier: 'silver', effect: "See AI's exact trade value score", cost: 250 },
      { tier: 'gold', effect: 'See which players/picks AI wants most', cost: 500 },
    ],
  },
  {
    id: 'blockbuster',
    name: 'Blockbuster',
    category: 'trades',
    goldOnly: true,
    tiers: [
      { tier: 'gold', effect: 'Once per season, force any trade through', cost: 500 },
    ],
  },
  {
    id: 'trade_deadline_hero',
    name: 'Trade Deadline Hero',
    category: 'trades',
    tiers: [
      { tier: 'bronze', effect: '+10% trade acceptance during deadline week', cost: 100 },
      { tier: 'silver', effect: '+20% acceptance, see desperate sellers', cost: 250 },
      { tier: 'gold', effect: '+30% acceptance, exclusive "fire sale" access', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 4: PLAYER DEVELOPMENT
// ============================================================================

export const developmentSkills: GMSkillDefinition[] = [
  {
    id: 'coachs_favorite',
    name: "Coach's Favorite",
    category: 'player_development',
    tiers: [
      { tier: 'bronze', effect: 'Pick 2 players/season for +25% XP', cost: 100 },
      { tier: 'silver', effect: 'Pick 3 players/season for +50% XP', cost: 250 },
      { tier: 'gold', effect: 'Pick 5 players/season for +100% XP', cost: 500 },
    ],
  },
  {
    id: 'training_boost',
    name: 'Training Boost',
    category: 'player_development',
    tiers: [
      { tier: 'bronze', effect: 'All players under 25 gain +1 dev speed', cost: 100 },
      { tier: 'silver', effect: 'All players under 25 gain +2 dev speed', cost: 250 },
      { tier: 'gold', effect: 'All players under 27 gain +3 dev speed', cost: 500 },
    ],
  },
  {
    id: 'veteran_mentor',
    name: 'Veteran Mentor',
    category: 'player_development',
    tiers: [
      { tier: 'bronze', effect: 'Players 30+ decline 25% slower', cost: 100 },
      { tier: 'silver', effect: 'Players 30+ decline 50% slower', cost: 250 },
      { tier: 'gold', effect: "Players 30+ don't decline until age 33", cost: 500 },
    ],
  },
  {
    id: 'position_coach',
    name: 'Position Coach',
    category: 'player_development',
    stackable: true,
    note: 'Can equip multiple for different positions',
    tiers: [
      { tier: 'bronze', effect: '+15% XP for one position group', cost: 100 },
      { tier: 'silver', effect: '+25% XP for one position group', cost: 250 },
      { tier: 'gold', effect: '+40% XP for one position group', cost: 500 },
    ],
  },
  {
    id: 'scheme_fit_master',
    name: 'Scheme Fit Master',
    category: 'player_development',
    tiers: [
      { tier: 'bronze', effect: 'Players adapt to new schemes 25% faster', cost: 100 },
      { tier: 'silver', effect: 'Players adapt 50% faster', cost: 250 },
      { tier: 'gold', effect: 'Instant adaptation, +2 OVR when scheme fits', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 5: TEAM MANAGEMENT
// ============================================================================

export const teamManagementSkills: GMSkillDefinition[] = [
  {
    id: 'free_agent_magnet',
    name: 'Free Agent Magnet',
    category: 'team_management',
    tiers: [
      { tier: 'bronze', effect: '+5 team appeal for free agents', cost: 100 },
      { tier: 'silver', effect: '+10 team appeal', cost: 250 },
      { tier: 'gold', effect: 'Always top 3 preferred destination', cost: 500 },
    ],
  },
  {
    id: 'morale_master',
    name: 'Morale Master',
    category: 'team_management',
    tiers: [
      { tier: 'bronze', effect: 'Team morale minimum 60%', cost: 100 },
      { tier: 'silver', effect: 'Team morale minimum 75%', cost: 250 },
      { tier: 'gold', effect: 'Team morale always 90%+', cost: 500 },
    ],
  },
  {
    id: 'medical_staff',
    name: 'Medical Staff',
    category: 'team_management',
    tiers: [
      { tier: 'bronze', effect: 'Injuries recover 15% faster', cost: 100 },
      { tier: 'silver', effect: 'Injuries recover 25% faster', cost: 250 },
      { tier: 'gold', effect: '50% faster + reduced injury chance', cost: 500 },
    ],
  },
  {
    id: 'locker_room_leader',
    name: 'Locker Room Leader',
    category: 'team_management',
    tiers: [
      { tier: 'bronze', effect: '-25% chance of locker room issues', cost: 100 },
      { tier: 'silver', effect: '-50% chance, faster chemistry', cost: 250 },
      { tier: 'gold', effect: 'No issues, instant chemistry', cost: 500 },
    ],
  },
  {
    id: 'discipline',
    name: 'Discipline',
    category: 'team_management',
    tiers: [
      { tier: 'bronze', effect: '-15% team penalties', cost: 100 },
      { tier: 'silver', effect: '-30% team penalties', cost: 250 },
      { tier: 'gold', effect: '-50% penalties, no suspensions', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 6: COACHING & STAFF
// ============================================================================

export const coachingStaffSkills: GMSkillDefinition[] = [
  {
    id: 'coach_whisperer',
    name: 'Coach Whisperer',
    category: 'coaching_staff',
    tiers: [
      { tier: 'bronze', effect: '+5 coach hiring appeal', cost: 100 },
      { tier: 'silver', effect: '+10 coach hiring appeal', cost: 250 },
      { tier: 'gold', effect: 'Top choice for any available coach', cost: 500 },
    ],
  },
  {
    id: 'staff_developer',
    name: 'Staff Developer',
    category: 'coaching_staff',
    tiers: [
      { tier: 'bronze', effect: 'Coaches gain +25% XP', cost: 100 },
      { tier: 'silver', effect: 'Coaches gain +50% XP', cost: 250 },
      { tier: 'gold', effect: 'Coaches gain +100% XP', cost: 500 },
    ],
  },
  {
    id: 'coordinator_shield',
    name: 'Coordinator Shield',
    category: 'coaching_staff',
    tiers: [
      { tier: 'bronze', effect: '-25% chance coordinators get poached', cost: 100 },
      { tier: 'silver', effect: '-50% chance coordinators get poached', cost: 250 },
      { tier: 'gold', effect: 'Coordinators never leave', cost: 500 },
    ],
  },
  {
    id: 'scout_network',
    name: 'Scout Network',
    category: 'coaching_staff',
    tiers: [
      { tier: 'bronze', effect: '+10% scouting department effectiveness', cost: 100 },
      { tier: 'silver', effect: '+20% effectiveness, +1 scout capacity', cost: 250 },
      { tier: 'gold', effect: '+30% effectiveness, +2 scout capacity', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 7: FACILITIES & OPERATIONS
// ============================================================================

export const facilitiesSkills: GMSkillDefinition[] = [
  {
    id: 'construction_manager',
    name: 'Construction Manager',
    category: 'facilities_operations',
    tiers: [
      { tier: 'bronze', effect: '-10% facility upgrade costs', cost: 100 },
      { tier: 'silver', effect: '-20% facility upgrade costs', cost: 250 },
      { tier: 'gold', effect: '-30% costs, -25% construction time', cost: 500 },
    ],
  },
  {
    id: 'maintenance_expert',
    name: 'Maintenance Expert',
    category: 'facilities_operations',
    tiers: [
      { tier: 'bronze', effect: '-25% annual maintenance costs', cost: 100 },
      { tier: 'silver', effect: '-50% maintenance costs', cost: 250 },
      { tier: 'gold', effect: "Facilities don't degrade", cost: 500 },
    ],
  },
  {
    id: 'revenue_optimizer',
    name: 'Revenue Optimizer',
    category: 'facilities_operations',
    tiers: [
      { tier: 'bronze', effect: '+10% stadium revenue', cost: 100 },
      { tier: 'silver', effect: '+20% stadium revenue', cost: 250 },
      { tier: 'gold', effect: '+30% revenue, +$5M owner budget', cost: 500 },
    ],
  },
  {
    id: 'owner_relations',
    name: 'Owner Relations',
    category: 'facilities_operations',
    tiers: [
      { tier: 'bronze', effect: '+1 year patience before hot seat', cost: 100 },
      { tier: 'silver', effect: '+2 years patience, +10% budget', cost: 250 },
      { tier: 'gold', effect: 'Unlimited patience, +20% budget', cost: 500 },
    ],
  },
];

// ============================================================================
// CATEGORY 8: META & QUALITY OF LIFE
// ============================================================================

export const metaSkills: GMSkillDefinition[] = [
  {
    id: 'quick_sim',
    name: 'Quick Sim',
    category: 'meta_qol',
    tiers: [
      { tier: 'bronze', effect: 'Simulate games 1.5x faster', cost: 100 },
      { tier: 'silver', effect: 'Simulate games 2x faster', cost: 250 },
      { tier: 'gold', effect: '3x faster + instant sim option', cost: 500 },
    ],
  },
  {
    id: 'inside_sources',
    name: 'Inside Sources',
    category: 'meta_qol',
    tiers: [
      { tier: 'bronze', effect: "See other teams' biggest needs", cost: 100 },
      { tier: 'silver', effect: "See other teams' trade block", cost: 250 },
      { tier: 'gold', effect: 'See draft targets and cap situations', cost: 500 },
    ],
  },
  {
    id: 'league_influence',
    name: 'League Influence',
    category: 'meta_qol',
    goldOnly: true,
    tiers: [
      { tier: 'gold', effect: 'Vote on rule changes and policies', cost: 500 },
    ],
  },
  {
    id: 'time_manager',
    name: 'Time Manager',
    category: 'meta_qol',
    tiers: [
      { tier: 'bronze', effect: 'Extra week before trade deadline', cost: 100 },
      { tier: 'silver', effect: 'Pause and review during draft', cost: 250 },
      { tier: 'gold', effect: 'Undo last major decision once/season', cost: 500 },
    ],
  },
];

// ============================================================================
// PRESTIGE SKILLS (Platinum - 1,000 GP)
// ============================================================================

export const platinumSkills: GMSkillDefinition[] = [
  {
    id: 'dynasty_builder',
    name: 'Dynasty Builder',
    category: 'team_management',
    tiers: [
      { tier: 'platinum', effect: 'Championship teams stay together 2 extra years', cost: 1000 },
    ],
  },
  {
    id: 'talent_magnet',
    name: 'Talent Magnet',
    category: 'team_management',
    tiers: [
      { tier: 'platinum', effect: 'Top 3 FAs always consider your team', cost: 1000 },
    ],
  },
  {
    id: 'draft_oracle',
    name: 'Draft Oracle',
    category: 'scouting_draft',
    tiers: [
      { tier: 'platinum', effect: 'See bust/steal outcome before drafting', cost: 1000 },
    ],
  },
  {
    id: 'cap_genius',
    name: 'Cap Genius',
    category: 'contracts_money',
    tiers: [
      { tier: 'platinum', effect: '+$15M cap, no dead money on cuts', cost: 1000 },
    ],
  },
  {
    id: 'player_whisperer',
    name: 'Player Whisperer',
    category: 'contracts_money',
    tiers: [
      { tier: 'platinum', effect: 'Any player will restructure', cost: 1000 },
    ],
  },
];

// ============================================================================
// PRESTIGE SKILLS (Diamond - 2,000 GP)
// ============================================================================

export const diamondSkills: GMSkillDefinition[] = [
  {
    id: 'perfect_evaluation',
    name: 'Perfect Evaluation',
    category: 'scouting_draft',
    tiers: [
      { tier: 'diamond', effect: 'See true OVR of all players, all teams', cost: 2000 },
    ],
  },
  {
    id: 'trade_emperor',
    name: 'Trade Emperor',
    category: 'trades',
    tiers: [
      { tier: 'diamond', effect: 'Force 2 trades per season', cost: 2000 },
    ],
  },
  {
    id: 'development_god',
    name: 'Development God',
    category: 'player_development',
    tiers: [
      { tier: 'diamond', effect: 'All under 28 gain +5 OVR/season', cost: 2000 },
    ],
  },
  {
    id: 'financial_wizard',
    name: 'Financial Wizard',
    category: 'contracts_money',
    tiers: [
      { tier: 'diamond', effect: '+$25M cap, -25% all salaries', cost: 2000 },
    ],
  },
  {
    id: 'legacy',
    name: 'Legacy',
    category: 'meta_qol',
    tiers: [
      { tier: 'diamond', effect: 'Retire jerseys, Hall of Fame ceremonies', cost: 2000 },
    ],
  },
];

// ============================================================================
// ALL SKILLS COMBINED
// ============================================================================

export const allSkills: GMSkillDefinition[] = [
  ...scoutingSkills,
  ...contractsSkills,
  ...tradesSkills,
  ...developmentSkills,
  ...teamManagementSkills,
  ...coachingStaffSkills,
  ...facilitiesSkills,
  ...metaSkills,
  ...platinumSkills,
  ...diamondSkills,
];

// ============================================================================
// SKILL SET BONUSES
// ============================================================================

export const skillSetBonuses: SkillSetBonus[] = [
  {
    id: 'the_scout',
    name: 'The Scout',
    requirement: '3 Scouting skills',
    requiredSkillCount: 3,
    requiredCategories: ['scouting_draft'],
    bonus: '+1 compensatory pick (Round 4-6)',
  },
  {
    id: 'the_builder',
    name: 'The Builder',
    requirement: '3 Development skills',
    requiredSkillCount: 3,
    requiredCategories: ['player_development'],
    bonus: '+10% team-wide XP, faster chemistry',
  },
  {
    id: 'the_dealmaker',
    name: 'The Dealmaker',
    requirement: '3 Contract/Trade skills',
    requiredSkillCount: 3,
    requiredCategories: ['contracts_money', 'trades'],
    bonus: 'One FA signs at -20% salary',
  },
  {
    id: 'the_executive',
    name: 'The Executive',
    requirement: '1 skill from 5+ categories',
    requiredSkillCount: 5,
    bonus: '+50 GP bonus per season',
  },
  {
    id: 'the_specialist',
    name: 'The Specialist',
    requirement: '3 Gold skills, one category',
    requiredSkillCount: 3,
    bonus: 'Category mastery: all effects +25%',
  },
];

// ============================================================================
// STACKING RULES
// ============================================================================

export const stackingRules: StackingRule[] = [
  {
    id: 'position_guru_stacking',
    description: 'Position Guru stacks for different position groups',
    allowed: true,
    condition: 'Different position groups',
  },
  {
    id: 'position_coach_stacking',
    description: 'Position Coach stacks for different position groups',
    allowed: true,
    condition: 'Different position groups',
  },
  {
    id: 'cap_bonuses_stacking',
    description: 'All cap bonuses stack',
    allowed: true,
    diminishingReturns: {
      threshold: 3,
      effectiveness: 50,
    },
  },
  {
    id: 'development_stacking',
    description: 'All development % bonuses stack',
    allowed: true,
    diminishingReturns: {
      threshold: 3,
      effectiveness: 75,
    },
  },
  {
    id: 'same_skill_twice',
    description: 'Cannot equip same skill twice',
    allowed: false,
    condition: 'Only one of each skill',
  },
  {
    id: 'gold_only_limit',
    description: 'Gold-only skills have usage limits',
    allowed: true,
    condition: 'One Blockbuster per season',
  },
  {
    id: 'scouting_diminishing',
    description: 'Scouting bonuses have diminishing returns',
    allowed: true,
    diminishingReturns: {
      threshold: 4,
      effectiveness: 50,
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getSkillById(id: string): GMSkillDefinition | undefined {
  return allSkills.find((s) => s.id === id);
}

export function getSkillsByCategory(categoryId: SkillCategoryId): GMSkillDefinition[] {
  return allSkills.filter((s) => s.category === categoryId);
}

export function getCategoryById(id: SkillCategoryId): SkillCategory | undefined {
  return skillCategories.find((c) => c.id === id);
}

export function getStandardSkills(): GMSkillDefinition[] {
  return allSkills.filter((s) => {
    const hasPlatinum = s.tiers.some((t) => t.tier === 'platinum');
    const hasDiamond = s.tiers.some((t) => t.tier === 'diamond');
    return !hasPlatinum && !hasDiamond;
  });
}

export function getPrestigeSkills(): GMSkillDefinition[] {
  return [...platinumSkills, ...diamondSkills];
}

export function calculateSkillTotalCost(skill: GMSkillDefinition): number {
  return skill.tiers.reduce((sum, tier) => sum + tier.cost, 0);
}

export function calculateCategoryTotalCost(categoryId: SkillCategoryId): number {
  const skills = getSkillsByCategory(categoryId);
  return skills.reduce((sum, skill) => sum + calculateSkillTotalCost(skill), 0);
}
