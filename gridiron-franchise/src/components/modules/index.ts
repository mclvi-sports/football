/**
 * Module Components
 * WO-MODULE-ARCHITECTURE-001
 *
 * Reusable modules shared between Dev Tools and Full Game.
 * Each module accepts a 'mode' prop: 'standalone' | 'embedded'
 *
 * - standalone: Full page with header, team selector (Dev Tools)
 * - embedded: Compact, scrollable, no header (Full Game tabs)
 */

// Views - Read-only data display
export { RosterView, ScheduleView, StandingsView, StatsView } from './views';

// Loops - Interactive gameplay
export { ScoutingLoop, TrainingLoop } from './loops';
