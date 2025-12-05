/**
 * Components Index
 * Central export for all UI components
 *
 * Usage:
 *   import { BoxScore, GameplayLoop, RosterView } from '@/components';
 *
 * Or import from specific modules:
 *   import { BoxScore } from '@/components/sim';
 *   import { GameplayLoop } from '@/components/franchise';
 */

// Auth
export * from './auth';

// Career (renamed to avoid conflict with dashboard)
export {
  ArchetypeCard,
  ArchetypeList,
  BackgroundCard,
  BackgroundList,
  PersonaSummary,
  SynergyBadge,
  TeamCard as CareerTeamCard,
  TeamList
} from './career';

// Dashboard (renamed to avoid conflict with career)
export {
  BottomTabBar,
  NavCard,
  TeamCard as DashboardTeamCard
} from './dashboard';

// Dev Tools
export * from './dev-tools';

// Franchise
export * from './franchise';

// GM
export * from './gm';

// Menu
export * from './menu';

// Modules (Views & Loops)
export * from './modules';

// Scouting
export * from './scouting';

// Simulation
export * from './sim';

// Training
export * from './training';

// Theme
export { ThemeProvider } from './theme-provider';
export { ThemeToggle } from './theme-toggle';
