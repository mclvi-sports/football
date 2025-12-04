# Components Inventory

> Central reference for all UI components in the application.

## Quick Import

```typescript
// Import from central barrel
import { BoxScore, GameplayLoop, RosterView } from '@/components';

// Or from specific modules
import { BoxScore } from '@/components/sim';
import { GameplayLoop } from '@/components/franchise';
import { RosterView } from '@/components/modules';
```

---

## Directory Structure

```
src/components/
├── auth/           # Authentication forms
├── career/         # Career mode setup (persona, team selection)
├── dashboard/      # Dashboard navigation & layout
├── dev-tools/      # Development/testing utilities
├── franchise/      # Franchise mode gameplay
├── gm/             # GM progression system
├── menu/           # Main menu components
├── modules/        # Reusable view & loop modules
├── scouting/       # Scouting system UI
├── sim/            # Game simulation display
├── training/       # Player training system
└── ui/             # shadcn/ui primitives
```

---

## Auth Components

Authentication and user account management.

| Component | File | Description |
|-----------|------|-------------|
| `PasswordStrength` | `password-strength.tsx` | Password strength indicator with visual feedback |
| `SignInForm` | `sign-in-form.tsx` | User login form with validation |
| `SignUpForm` | `sign-up-form.tsx` | User registration form with validation |

---

## Career Components

Career mode setup flow - persona creation and team selection.

### Persona (`career/persona/`)

| Component | File | Description |
|-----------|------|-------------|
| `ArchetypeCard` | `archetype-card.tsx` | Display card for GM archetype (Scout Master, Cap Wizard, etc.) |
| `ArchetypeList` | `archetype-list.tsx` | Scrollable list of available archetypes |
| `BackgroundCard` | `background-card.tsx` | Display card for GM background (Former Player, Analytics, etc.) |
| `BackgroundList` | `background-list.tsx` | Scrollable list of available backgrounds |
| `PersonaSummary` | `persona-summary.tsx` | Summary view of selected persona traits |
| `SynergyBadge` | `synergy-badge.tsx` | Badge showing archetype/background synergy bonus |

### Team Selection (`career/`)

| Component | File | Description |
|-----------|------|-------------|
| `TeamCard` | `team-card.tsx` | Team selection card with logo, record, tier |
| `TeamList` | `team-list.tsx` | Grid of teams available for selection |

---

## Dashboard Components

Main dashboard layout and navigation.

| Component | File | Description |
|-----------|------|-------------|
| `BottomTabBar` | `bottom-tab-bar.tsx` | Mobile-style bottom navigation tabs |
| `NavCard` | `nav-card.tsx` | Navigation card for dashboard sections |
| `TeamCard` | `team-card.tsx` | Team info display card for dashboard |

---

## Dev Tools Components

Development and testing utilities.

| Component | File | Description |
|-----------|------|-------------|
| `PlayerCard` | `player-card.tsx` | Player display card with attributes, ratings |
| `RosterPlayerCard` | `roster-player-card.tsx` | Compact player card for roster lists |

---

## Franchise Components

Core franchise mode gameplay components.

| Component | File | Description |
|-----------|------|-------------|
| `BoxScoreModal` | `box-score-modal.tsx` | Modal displaying full game box score |
| `BracketMatchup` | `bracket-matchup.tsx` | Single playoff matchup display |
| `ChampionBanner` | `champion-banner.tsx` | Championship celebration banner |
| `GameCard` | `game-card.tsx` | Compact game result/schedule card |
| `GameSetupDashboard` | `game-setup-dashboard.tsx` | Pre-game data generation dashboard |
| `GameplayLoop` | `gameplay-loop.tsx` | Main franchise gameplay interface |
| `ModuleCard` | `module-card.tsx` | Card for data generation modules |
| `PlayoffBracket` | `playoff-bracket.tsx` | Full playoff bracket visualization |
| `ReadyIndicator` | `ready-indicator.tsx` | Ready/not-ready status indicator |
| `SchedulePreviewModal` | `schedule-preview-modal.tsx` | Modal showing full season schedule |
| `SeasonHub` | `season-hub.tsx` | Season overview and navigation hub |
| `TeamSelectionModal` | `team-selection-modal.tsx` | Modal for selecting a team |

---

## GM Components

GM progression, skills, and achievements system.

| Component | File | Description |
|-----------|------|-------------|
| `GMPointsDisplay` | `gm-points-display.tsx` | Display current GP with breakdown |
| `GMPointsCompact` | `gm-points-display.tsx` | Compact GP counter |
| `SkillTierBadge` | `skill-tier-badge.tsx` | Tier indicator badge (Bronze/Silver/Gold) |
| `SkillCard` | `skill-card.tsx` | Full skill card with unlock/upgrade |
| `SkillCardMini` | `skill-card.tsx` | Compact skill display |
| `EquipmentSlots` | `equipment-slots.tsx` | Equipment slot management grid |
| `EquipmentSlotsCompact` | `equipment-slots.tsx` | Compact equipment display |
| `SkillsMenu` | `skills-menu.tsx` | Full skills browser with categories |
| `SkillsMenuCompact` | `skills-menu.tsx` | Compact skills overview |
| `AchievementList` | `achievement-list.tsx` | List of all achievements |
| `AchievementProgress` | `achievement-list.tsx` | Achievement completion progress |
| `RecentAchievements` | `achievement-list.tsx` | Recently earned achievements |
| `PrestigeDisplay` | `prestige-display.tsx` | Current prestige level display |
| `PrestigeBadge` | `prestige-display.tsx` | Compact prestige badge |
| `PrestigeRoadmap` | `prestige-display.tsx` | Prestige progression roadmap |

---

## Menu Components

Main menu and navigation buttons.

| Component | File | Description |
|-----------|------|-------------|
| `MenuButtonPrimary` | `menu-button-primary.tsx` | Primary action menu button |
| `MenuButtonSecondary` | `menu-button-secondary.tsx` | Secondary action menu button |
| `MenuFooter` | `menu-footer.tsx` | Footer with version and links |

---

## Module Components

Reusable view and gameplay loop modules with `mode` prop for standalone/embedded contexts.

### Views (`modules/views/`)

Read-only data display components.

| Component | File | Description |
|-----------|------|-------------|
| `CoachingView` | `coaching-view.tsx` | Coaching staff with ratings, schemes, tabs |
| `DraftView` | `draft-view.tsx` | Draft class with prospects, round breakdown |
| `FacilitiesView` | `facilities-view.tsx` | Stadium, practice, training facility ratings |
| `FAView` | `fa-view.tsx` | Free agent pool with position filters |
| `GMSkillsView` | `gm-skills-view.tsx` | GM points, skills, equipment tester |
| `RosterView` | `roster-view.tsx` | Team roster with player cards |
| `ScheduleView` | `schedule-view.tsx` | Season schedule with game cards |
| `SchemesView` | `schemes-view.tsx` | Offensive, defensive, ST schemes explorer |
| `ScoutingDeptView` | `scouting-dept-view.tsx` | Scouting department staff |
| `StandingsView` | `standings-view.tsx` | League standings by division |
| `StatsView` | `stats-view.tsx` | League/team statistics |

### Loops (`modules/loops/`)

Interactive gameplay loops.

| Component | File | Description |
|-----------|------|-------------|
| `ScoutingLoop` | `scouting-loop.tsx` | Weekly scouting point allocation |
| `TrainingLoop` | `training-loop.tsx` | Weekly training focus selection |

---

## Scouting Components

Scouting system UI components.

| Component | File | Description |
|-----------|------|-------------|
| `ScoutCard` | `scout-card.tsx` | Full scout display with attributes |
| `ScoutCardCompact` | `scout-card.tsx` | Compact scout display |
| `ScoutingPointsDisplay` | `scouting-points-display.tsx` | Current scouting points |
| `ScoutingPointsCompact` | `scouting-points-display.tsx` | Compact points counter |
| `ScoutingReportCard` | `scouting-report-card.tsx` | Player scouting report |
| `ScoutingReportCompact` | `scouting-report-card.tsx` | Compact report display |
| `ScoutPoolList` | `scout-pool-list.tsx` | List of available scouts |

---

## Simulation Components

Game simulation display and controls.

| Component | File | Description |
|-----------|------|-------------|
| `BoxScore` | `box-score.tsx` | In-game box score display |
| `FieldView` | `field-view.tsx` | Visual football field with ball position |
| `GameSimulatorTab` | `game-simulator-tab.tsx` | Full game simulation interface |
| `PlayLog` | `play-log.tsx` | Scrolling play-by-play log |
| `Scoreboard` | `scoreboard.tsx` | Live game scoreboard |
| `TeamStatsCard` | `stats-panel.tsx` | Team statistics panel |
| `PlayerStatsCard` | `stats-panel.tsx` | Player statistics panel |
| `TeamSelect` | `team-select.tsx` | Team selector for simulation |

---

## Training Components

Player development and training system.

| Component | File | Description |
|-----------|------|-------------|
| `PlayerDevelopmentCard` | `player-development-card.tsx` | Player training progress card |
| `PracticeFocusSelector` | `practice-focus-selector.tsx` | Weekly practice focus picker |
| `TrainingDashboard` | `training-dashboard.tsx` | Full training management interface |

---

## UI Components (shadcn/ui)

Base UI primitives from shadcn/ui.

| Component | File | Description |
|-----------|------|-------------|
| `Badge` | `badge.tsx` | Status/label badge |
| `Button` | `button.tsx` | Button with variants |
| `Card` | `card.tsx` | Card container with header/content/footer |
| `Dialog` | `dialog.tsx` | Modal dialog |
| `DropdownMenu` | `dropdown-menu.tsx` | Dropdown menu with items |
| `Input` | `input.tsx` | Text input field |
| `Label` | `label.tsx` | Form label |
| `Progress` | `progress.tsx` | Progress bar |
| `ScrollArea` | `scroll-area.tsx` | Custom scrollable area |
| `Select` | `select.tsx` | Dropdown select |
| `Separator` | `separator.tsx` | Visual separator line |
| `Sheet` | `sheet.tsx` | Slide-out panel |
| `Sonner` | `sonner.tsx` | Toast notifications |
| `Tabs` | `tabs.tsx` | Tab navigation |

---

## Theme Components

Theming and appearance.

| Component | File | Description |
|-----------|------|-------------|
| `ThemeProvider` | `theme-provider.tsx` | Next-themes provider wrapper |
| `ThemeToggle` | `theme-toggle.tsx` | Light/dark mode toggle button |

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Auth | 3 |
| Career | 8 |
| Dashboard | 3 |
| Dev Tools | 2 |
| Franchise | 12 |
| GM | 15 |
| Menu | 3 |
| Modules (Views) | 11 |
| Modules (Loops) | 2 |
| Scouting | 7 |
| Simulation | 8 |
| Training | 3 |
| UI (shadcn) | 14 |
| Theme | 2 |
| **Total** | **93** |
