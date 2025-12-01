import type {
  GMArchetype,
  GMBackground,
  GMSynergy,
  SynergyKey,
} from "@/types/gm-persona";

// All 6 GM Archetypes
export const archetypes: GMArchetype[] = [
  {
    id: "scout_guru",
    name: "Scout Guru",
    icon: "SG",
    philosophy: '"The draft is where championships are built."',
    description:
      "You believe in building through the draft. Finding diamonds in the rough and developing homegrown talent is your specialty.",
    bonuses: [
      "+2 scouting points per prospect",
      "15% discount: Scouting & Draft skills",
      "+1 extra 5th round pick in Year 1",
    ],
    skill: {
      name: "Hidden Gem",
      tier: "Bronze",
      description: "Reveal true potential of 1 late-round prospect per draft",
    },
    skillDiscountCategory: "scouting_draft",
    recommendedFor: "Patient players who enjoy long-term team building",
  },
  {
    id: "cap_wizard",
    name: "Cap Wizard",
    icon: "CW",
    philosophy: '"Every dollar matters. Cap space is a resource."',
    description:
      "You're a master of the salary cap. You structure deals, find bargains, and always have cap flexibility when you need it.",
    bonuses: [
      "+$5M cap space in Year 1",
      "15% discount: Contracts & Money skills",
      "See cap implications before confirming",
    ],
    skill: {
      name: "Salary Cap Wizard",
      tier: "Bronze",
      description: "+$3M extra cap space each season",
    },
    skillDiscountCategory: "contracts_money",
    recommendedFor: "Players who enjoy roster construction puzzles",
  },
  {
    id: "trade_shark",
    name: "Trade Shark",
    icon: "TS",
    philosophy: '"The phone is always ringing. Every player has a price."',
    description:
      "You're always looking for the next deal. You believe in acquiring value through trades and aren't afraid to make bold moves.",
    bonuses: [
      "+1 trade offer per week from other teams",
      "15% discount: Trades skills",
      "See trade interest for roster players",
    ],
    skill: {
      name: "Trade Master",
      tier: "Bronze",
      description: "CPU teams 10% more willing to accept fair trades",
    },
    skillDiscountCategory: "trades",
    recommendedFor: "Active players who enjoy wheeling and dealing",
  },
  {
    id: "player_developer",
    name: "Player Developer",
    icon: "PD",
    philosophy: '"Give me potential. I\'ll unlock greatness."',
    description:
      "You have a gift for developing talent. Raw prospects become stars under your guidance. Veterans extend their careers.",
    bonuses: [
      "+20% XP gain for all players in Year 1",
      "15% discount: Player Development skills",
      "Free development focus slot",
    ],
    skill: {
      name: "Training Boost",
      tier: "Bronze",
      description: "All players under 25 gain +1 to development speed",
    },
    skillDiscountCategory: "player_development",
    recommendedFor: "Players who enjoy watching players grow",
  },
  {
    id: "win_now_executive",
    name: "Win-Now Executive",
    icon: "WN",
    philosophy: '"Championships are the only thing that matters."',
    description:
      "You're aggressive. You trade picks for proven talent, sign big free agents, and push all your chips to the middle.",
    bonuses: [
      "+15% chance to sign top free agents",
      "15% discount: Team Management skills",
      "+20 starting team morale",
    ],
    skill: {
      name: "Free Agent Magnet",
      tier: "Bronze",
      description: "Your team gets +5 appeal rating for free agents",
    },
    skillDiscountCategory: "team_management",
    recommendedFor: "Players who want to compete immediately",
  },
  {
    id: "motivator",
    name: "Motivator",
    icon: "MO",
    philosophy: '"Culture beats talent. Belief beats ability."',
    description:
      "You're a leader of men. Players play harder for you. Locker rooms are united. Teams exceed the sum of their parts.",
    bonuses: [
      "+25% team chemistry in Year 1",
      "15% discount: Team Management skills",
      "Players less likely to hold out",
    ],
    skill: {
      name: "Morale Master",
      tier: "Bronze",
      description: "Team morale minimum is 60% (never drops below)",
    },
    skillDiscountCategory: "team_management",
    recommendedFor: "Players who enjoy team chemistry management",
  },
];

// All 6 GM Backgrounds
export const backgrounds: GMBackground[] = [
  {
    id: "former_player",
    name: "Former Player",
    icon: "FP",
    description:
      "You played in the league before transitioning to the front office. You understand the game from a player's perspective.",
    bonuses: ["+15% player trust", "+10% locker room morale"],
    weakness: "-10% owner patience",
    bestPairedWith: ["Player Developer", "Motivator"],
  },
  {
    id: "analytics_expert",
    name: "Analytics Expert",
    icon: "AE",
    description:
      "You rose through the ranks using data, statistics, and advanced metrics. You see the game through numbers.",
    bonuses: ["+20% hidden attribute scouting", "Access to advanced stats"],
    weakness: "-10% player trust",
    bestPairedWith: ["Scout Guru", "Cap Wizard"],
  },
  {
    id: "college_scout",
    name: "College Scout",
    icon: "CS",
    description:
      "You spent years evaluating college talent before getting your shot. You know prospects better than anyone.",
    bonuses: ["+25% prospect scouting accuracy", "+15% sleeper identification"],
    weakness: "-10% free agent evaluation",
    bestPairedWith: ["Scout Guru", "Trade Shark"],
  },
  {
    id: "coaching_tree",
    name: "Coaching Tree",
    icon: "CT",
    description:
      "You worked your way up through coaching staffs before moving to the front office. You understand schemes and player development.",
    bonuses: ["+15% player development speed", "Coaches are 15% cheaper"],
    weakness: "-10% contract negotiation",
    bestPairedWith: ["Player Developer", "Motivator"],
  },
  {
    id: "agent_specialist",
    name: "Agent / Contract Specialist",
    icon: "AS",
    description:
      "You represented players before switching sides. You know every trick in the negotiation playbook.",
    bonuses: ["+20% contract negotiation", "See exact salary demands"],
    weakness: "-10% scouting accuracy",
    bestPairedWith: ["Cap Wizard", "Trade Shark"],
  },
  {
    id: "media_insider",
    name: "Media / Front Office Insider",
    icon: "MI",
    description:
      "You covered the league or worked in league operations before becoming a GM. You know how the business works.",
    bonuses: ["+15% trade acceptance rate", "See other teams' needs"],
    weakness: "-15% player evaluation",
    bestPairedWith: ["Trade Shark", "Cap Wizard"],
  },
];

// All 8 Synergies
export const synergies: GMSynergy[] = [
  {
    id: "the_mentor",
    name: "The Mentor",
    backgroundId: "former_player",
    archetypeId: "player_developer",
    bonus: "+25% mentor XP, can mentor 2 players per season",
  },
  {
    id: "the_moneyball",
    name: "The Moneyball",
    backgroundId: "analytics_expert",
    archetypeId: "scout_guru",
    bonus: "See 3-year statistical projections for all prospects",
  },
  {
    id: "the_draft_whisperer",
    name: "The Draft Whisperer",
    backgroundId: "college_scout",
    archetypeId: "scout_guru",
    bonus: "+35% prospect scouting accuracy, see other teams' top 3 targets",
  },
  {
    id: "the_dealmaker",
    name: "The Dealmaker",
    backgroundId: "agent_specialist",
    archetypeId: "cap_wizard",
    bonus: "All contracts have 10% lower cap hit, players never hold out",
  },
  {
    id: "the_academy",
    name: "The Academy",
    backgroundId: "coaching_tree",
    archetypeId: "player_developer",
    bonus: "+40% development speed, rookies adjust to NFL faster",
  },
  {
    id: "the_insider",
    name: "The Insider",
    backgroundId: "media_insider",
    archetypeId: "trade_shark",
    bonus: "See exact trade values, advance notice when players available",
  },
  {
    id: "the_closer",
    name: "The Closer",
    backgroundId: "former_player",
    archetypeId: "win_now_executive",
    bonus: "Top free agents seek you out, veterans take discounts",
  },
  {
    id: "the_optimizer",
    name: "The Optimizer",
    backgroundId: "analytics_expert",
    archetypeId: "cap_wizard",
    bonus: "See projected cap hits for 3 seasons, identify declining value",
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
