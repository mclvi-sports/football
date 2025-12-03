import type { Achievement, AchievementCategory } from '@/types/gm-points';

// ============================================================================
// SEASON ACHIEVEMENTS
// ============================================================================

export const seasonAchievements: Achievement[] = [
  {
    id: 'perfect_season',
    name: 'Perfect Season',
    description: 'Complete a 17-0 regular season',
    category: 'season',
    points: 1000,
    condition: '17-0 regular season record',
  },
  {
    id: 'championship_win',
    name: 'Championship Win',
    description: 'Win the Super Bowl',
    category: 'season',
    points: 500,
    condition: 'Win Super Bowl',
  },
  {
    id: 'conference_championship',
    name: 'Conference Championship',
    description: 'Win the conference championship',
    category: 'season',
    points: 250,
    condition: 'Win AFC/NFC Championship',
  },
  {
    id: 'division_title',
    name: 'Division Title',
    description: 'Win your division',
    category: 'season',
    points: 50,
    condition: 'Best record in division',
  },
  {
    id: 'playoff_appearance',
    name: 'Playoff Appearance',
    description: 'Make the playoffs',
    category: 'season',
    points: 100,
    condition: 'Qualify for playoffs',
  },
  {
    id: 'ten_win_season',
    name: '10+ Win Season',
    description: 'Win 10 or more regular season games',
    category: 'season',
    points: 50,
    condition: '10+ wins in regular season',
  },
];

// ============================================================================
// PLAYER DEVELOPMENT ACHIEVEMENTS
// ============================================================================

export const developmentAchievements: Achievement[] = [
  {
    id: 'draft_roy',
    name: 'Draft ROY Winner',
    description: 'Have a drafted player win Offensive or Defensive Rookie of the Year',
    category: 'development',
    points: 200,
    condition: 'Drafted player wins OROY or DROY',
  },
  {
    id: 'develop_70_to_90',
    name: 'Star Maker',
    description: 'Develop a player from 70 OVR to 90 OVR',
    category: 'development',
    points: 300,
    condition: 'Player grows from 70 to 90+ OVR',
  },
  {
    id: 'three_all_pro',
    name: 'All-Pro Factory',
    description: 'Have 3 players make All-Pro in the same season',
    category: 'development',
    points: 150,
    condition: '3 All-Pro players in one season',
  },
  {
    id: 'udfa_starter',
    name: 'Diamond in the Rough',
    description: 'Have an undrafted free agent become a starter',
    category: 'development',
    points: 150,
    condition: 'UDFA becomes starter',
  },
  {
    id: 'draft_pick_pro_bowl',
    name: 'Rising Star',
    description: 'Have a draft pick make Pro Bowl within first 3 years',
    category: 'development',
    points: 100,
    condition: 'Draft pick makes Pro Bowl (Years 1-3)',
  },
];

// ============================================================================
// MANAGEMENT ACHIEVEMENTS
// ============================================================================

export const managementAchievements: Achievement[] = [
  {
    id: 'under_cap_all_season',
    name: 'Cap Compliant',
    description: 'Stay under the salary cap all season without issues',
    category: 'management',
    points: 50,
    condition: 'No cap violations all season',
  },
  {
    id: 'win_trade',
    name: 'Trade Winner',
    description: 'Complete a trade where you get better value',
    category: 'management',
    points: 25,
    repeatable: true,
    condition: 'Trade value in your favor',
  },
  {
    id: 'sign_major_fa',
    name: 'Big Fish',
    description: 'Sign a top-tier free agent (85+ OVR)',
    category: 'management',
    points: 100,
    condition: 'Sign FA rated 85+ OVR',
  },
  {
    id: 'roster_overhaul',
    name: 'New Era',
    description: 'Replace 15 or more starters in a single offseason',
    category: 'management',
    points: 200,
    condition: '15+ new starters in one offseason',
  },
];

// ============================================================================
// SPECIAL ACHIEVEMENTS
// ============================================================================

export const specialAchievements: Achievement[] = [
  {
    id: 'first_championship',
    name: 'First Ring',
    description: 'Win your first championship',
    category: 'special',
    points: 500,
    oneTime: true,
    condition: 'First Super Bowl win ever',
  },
  {
    id: 'beat_rival_three_times',
    name: 'Rivalry Domination',
    description: 'Beat your division rival 3 times in one season',
    category: 'special',
    points: 100,
    condition: 'Beat rival 3 times (including playoffs)',
  },
  {
    id: 'perfect_draft',
    name: 'Perfect Draft',
    description: 'All draft picks become starters',
    category: 'special',
    points: 500,
    condition: 'Every draft pick becomes a starter',
  },
  {
    id: 'dynasty',
    name: 'Dynasty',
    description: 'Win 3 championships within 5 years',
    category: 'special',
    points: 1000,
    condition: '3 Super Bowls in 5-year span',
  },
  {
    id: 'executive_of_year',
    name: 'Executive of the Year',
    description: 'Be named NFL Executive of the Year',
    category: 'special',
    points: 300,
    condition: 'Win Executive of the Year award',
  },
];

// ============================================================================
// ALL ACHIEVEMENTS COMBINED
// ============================================================================

export const allAchievements: Achievement[] = [
  ...seasonAchievements,
  ...developmentAchievements,
  ...managementAchievements,
  ...specialAchievements,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getAchievementById(id: string): Achievement | undefined {
  return allAchievements.find((a) => a.id === id);
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return allAchievements.filter((a) => a.category === category);
}

export function getOneTimeAchievements(): Achievement[] {
  return allAchievements.filter((a) => a.oneTime);
}

export function getRepeatableAchievements(): Achievement[] {
  return allAchievements.filter((a) => a.repeatable);
}

export function getTotalPossiblePoints(): number {
  return allAchievements.reduce((sum, a) => sum + a.points, 0);
}

export function getAchievementPointsByCategory(): Record<AchievementCategory, number> {
  return {
    season: seasonAchievements.reduce((sum, a) => sum + a.points, 0),
    development: developmentAchievements.reduce((sum, a) => sum + a.points, 0),
    management: managementAchievements.reduce((sum, a) => sum + a.points, 0),
    special: specialAchievements.reduce((sum, a) => sum + a.points, 0),
  };
}
