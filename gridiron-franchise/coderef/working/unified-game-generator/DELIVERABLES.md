# DELIVERABLES: Franchise Mode UI

**Workorder ID:** WO-UNIFIED-GAME-GENERATOR-001
**Feature:** unified-game-generator (v2.0)
**Status:** Not Started
**Created:** 2025-12-02

**Description:** Complete Franchise Mode UI prototype - game setup, season simulation, box scores, playoffs, and championship.

---

## Phase 1: Foundation & Utilities

**Status:** Not Started

### Tasks
- [ ] UTIL-001: Create game-utils.ts with helper functions for formatting stats, scores, records
- [ ] SETUP-001: Create ModuleCard component for individual module status
- [ ] SETUP-002: Create ReadyIndicator component showing simulation readiness
- [ ] SCHED-001: Create GameCard component for individual game result row

### Deliverables
- [ ] `src/lib/franchise/game-utils.ts`
- [ ] `src/components/franchise/module-card.tsx`
- [ ] `src/components/franchise/ready-indicator.tsx`
- [ ] `src/components/franchise/game-card.tsx`

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| LOC Added | ~260 | TBD |
| Files Created | 4 | TBD |

---

## Phase 2: Game Setup Dashboard

**Status:** Not Started

### Tasks
- [ ] SETUP-003: Create GameSetupDashboard with all module cards and generate controls
- [ ] SETUP-004: Integrate GameSetupDashboard into full/page.tsx

### Deliverables
- [ ] `src/components/franchise/game-setup-dashboard.tsx`
- [ ] 6 module cards (Rosters, FA, Draft, Coaching, Facilities, Schedule)
- [ ] Generate All button with progress
- [ ] Ready to Play indicator
- [ ] Start Season button

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| LOC Added | ~250 | TBD |
| Files Created/Modified | 2 | TBD |

---

## Phase 3: Box Score Modal

**Status:** Not Started

### Tasks
- [ ] BOX-001: Create BoxScoreModal component with team stats section
- [ ] BOX-002: Add player stats sections (passing, rushing, receiving, defense)
- [ ] BOX-003: Add scoring summary (by quarter)

### Deliverables
- [ ] `src/components/franchise/box-score-modal.tsx`
- [ ] Header with teams, score, game info
- [ ] Team stats comparison table
- [ ] Player stats by category
- [ ] Scoring by quarter

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| LOC Added | ~330 | TBD |
| Files Created | 1 | TBD |

---

## Phase 4: Season Views

**Status:** Not Started

### Tasks
- [ ] SCHED-002: Create ScheduleView with week selector and game list
- [ ] STAND-001: Create StandingsView with division tables
- [ ] STATS-001: Create StatsView with category tabs and leaderboards

### Deliverables
- [ ] `src/components/franchise/schedule-view.tsx`
- [ ] `src/components/franchise/standings-view.tsx`
- [ ] `src/components/franchise/stats-view.tsx`
- [ ] Week selector dropdown
- [ ] Division standings tables
- [ ] Team & player leaderboards

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| LOC Added | ~470 | TBD |
| Files Created | 3 | TBD |

---

## Phase 5: Playoff Bracket

**Status:** Not Started

### Tasks
- [ ] PLAY-001: Create BracketMatchup component for single playoff game
- [ ] PLAY-002: Create PlayoffBracket component with full bracket layout
- [ ] PLAY-003: Create ChampionBanner celebration component

### Deliverables
- [ ] `src/components/franchise/bracket-matchup.tsx`
- [ ] `src/components/franchise/playoff-bracket.tsx`
- [ ] `src/components/franchise/champion-banner.tsx`
- [ ] Visual bracket with all rounds
- [ ] Clickable matchups opening box scores
- [ ] Champion celebration display

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| LOC Added | ~300 | TBD |
| Files Created | 3 | TBD |

---

## Phase 6: Integration & Polish

**Status:** Not Started

### Tasks
- [ ] HUB-001: Create SeasonHub component integrating all views
- [ ] HUB-002: Refactor season/page.tsx to use new SeasonHub component
- [ ] TEST-001: End-to-end testing

### Deliverables
- [ ] `src/components/franchise/season-hub.tsx`
- [ ] Refactored season page
- [ ] Full end-to-end flow tested

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| LOC Added/Modified | ~250 | TBD |
| Files Created/Modified | 2 | TBD |

---

## Features Summary

| ID | Feature | Components |
|----|---------|------------|
| F1 | Game Setup Dashboard | ModuleCard, ReadyIndicator, GameSetupDashboard |
| F2 | Season Hub | SeasonHub (integrates all views) |
| F3 | Schedule View | GameCard, ScheduleView |
| F4 | Box Score Modal | BoxScoreModal |
| F5 | Standings View | StandingsView |
| F6 | Stats View | StatsView |
| F7 | Playoff Bracket | BracketMatchup, PlayoffBracket, ChampionBanner |

---

## Success Criteria

- [ ] AC1: Game Setup shows 6 modules with accurate status
- [ ] AC2: Generate All creates all data without errors
- [ ] AC3: Every game in schedule is clickable
- [ ] AC4: Box score shows complete team and player stats
- [ ] AC5: Can navigate to any week's games
- [ ] AC6: Standings update correctly each week
- [ ] AC7: Playoff bracket shows all rounds and results
- [ ] AC8: Champion celebration displays at season end

---

## Files to Create

```
src/
├── lib/
│   └── franchise/
│       └── game-utils.ts
└── components/
    └── franchise/
        ├── module-card.tsx
        ├── ready-indicator.tsx
        ├── game-setup-dashboard.tsx
        ├── game-card.tsx
        ├── schedule-view.tsx
        ├── box-score-modal.tsx
        ├── standings-view.tsx
        ├── stats-view.tsx
        ├── bracket-matchup.tsx
        ├── playoff-bracket.tsx
        ├── champion-banner.tsx
        └── season-hub.tsx
```

**Total: 12 new files + 2 modified pages**

---

## Summary

| Phase | Tasks | Est. LOC | Status |
|-------|-------|----------|--------|
| P1: Foundation | 4 | ~260 | Not Started |
| P2: Game Setup | 2 | ~250 | Not Started |
| P3: Box Score | 3 | ~330 | Not Started |
| P4: Season Views | 3 | ~470 | Not Started |
| P5: Playoff Bracket | 3 | ~300 | Not Started |
| P6: Integration | 3 | ~250 | Not Started |
| **Total** | **18** | **~1,860** | **0% Complete** |

---

## Notes

*Add implementation notes, decisions, and blockers here as work progresses.*
