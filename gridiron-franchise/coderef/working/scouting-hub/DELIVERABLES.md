# DELIVERABLES: scouting-hub

**Project**: gridiron-franchise
**Feature**: scouting-hub
**Workorder**: WO-SCOUTING-HUB-001
**Status**: 🚧 Not Started
**Generated**: 2025-12-18

---

## Executive Summary

**Goal**: Make scouting more engaging by leveraging existing scout staff, coaching, GM, and draft systems to provide actionable insights and interactive features

**Description**: Transform the basic scouting page into a comprehensive Scouting Hub with staff-driven insights, coaching integration, visual big boards, mock drafts, and sleeper tracking

---

## Implementation Phases

### Phase 1: Foundation

**Description**: Set up types, store, and page structure

**Estimated Duration**: TBD

**Deliverables**:
- Types file
- Hub store
- Tabbed page shell

### Phase 2: Staff Insights

**Description**: Scout recommendations and perk activations

**Estimated Duration**: TBD

**Deliverables**:
- Recommendation engine
- Staff insights tab complete

### Phase 3: Big Board

**Description**: Tiered board, rankings, and comparison

**Estimated Duration**: TBD

**Deliverables**:
- Drag-drop board
- Position rankings
- Comparison tool

### Phase 4: Mock Draft

**Description**: Simulation engine and projections UI

**Estimated Duration**: TBD

**Deliverables**:
- Simulation engine
- Consensus calculator
- Mock draft tab complete

### Phase 5: Coaching Integration

**Description**: Scheme fits and coach wishlists

**Estimated Duration**: TBD

**Deliverables**:
- Scheme fit calculator
- Wishlist generator
- Coaching tab complete

### Phase 6: Sleepers & Alerts

**Description**: Hidden gems and combine movement

**Estimated Duration**: TBD

**Deliverables**:
- Sleeper detector
- Combine analysis
- Sleepers tab complete


---

## Metrics

### Code Changes
- **Lines of Code Added**: TBD
- **Lines of Code Deleted**: TBD
- **Net LOC**: TBD
- **Files Modified**: TBD

### Commit Activity
- **Total Commits**: TBD
- **First Commit**: TBD
- **Last Commit**: TBD
- **Contributors**: TBD

### Time Investment
- **Days Elapsed**: TBD
- **Hours Spent (Wall Clock)**: TBD

---

## Task Completion Checklist

- [ ] [SETUP-001] Create scouting-hub types file with all interfaces
- [ ] [SETUP-002] Create scouting-hub-store with Zustand
- [ ] [SETUP-003] Create tabbed hub page structure
- [ ] [STAFF-001] Create scout recommendation engine
- [ ] [STAFF-002] Create scout recommendations panel component
- [ ] [STAFF-003] Create director big board component
- [ ] [STAFF-004] Create perk activation feed component
- [ ] [BOARD-001] Create tiered big board with drag-drop
- [ ] [BOARD-002] Create position rankings tab
- [ ] [BOARD-003] Create prospect comparison tool
- [ ] [MOCK-001] Create mock draft simulation engine
- [ ] [MOCK-002] Create mock draft consensus calculator
- [ ] [MOCK-003] Create mock draft simulator UI
- [ ] [COACH-001] Create scheme fit calculator
- [ ] [COACH-002] Create coach wishlist generator
- [ ] [COACH-003] Create scheme fit grid component
- [ ] [COACH-004] Create position coach wishlist component
- [ ] [COACH-005] Create coaching meeting notes component
- [ ] [SLEEP-001] Create sleeper detector logic
- [ ] [SLEEP-002] Create combine analysis logic
- [ ] [SLEEP-003] Create hidden gem tracker component
- [ ] [SLEEP-004] Create combine risers/fallers component

---

## Files Created/Modified

- **src/stores/scouting-hub-store.ts** - Central state management for hub
- **src/lib/scouting-hub/types.ts** - Type definitions for hub features
- **src/lib/scouting-hub/scout-recommendation-engine.ts** - Generate scout recommendations
- **src/lib/scouting-hub/scheme-fit-calculator.ts** - Calculate scheme fit grades
- **src/lib/scouting-hub/coach-wishlist-generator.ts** - Generate coach wishlists
- **src/lib/scouting-hub/mock-draft-engine.ts** - Run mock draft simulations
- **src/lib/scouting-hub/mock-draft-consensus.ts** - Aggregate simulation results
- **src/lib/scouting-hub/combine-analysis.ts** - Calculate risers/fallers
- **src/lib/scouting-hub/sleeper-detector.ts** - Identify hidden gems
- **src/components/scouting-hub/scout-recommendations-panel.tsx** - Display scout recommendations
- **src/components/scouting-hub/director-big-board.tsx** - Staff consensus board
- **src/components/scouting-hub/perk-activation-feed.tsx** - Perk trigger callouts
- **src/components/scouting-hub/tiered-big-board.tsx** - Drag-drop tier board
- **src/components/scouting-hub/position-rankings-tab.tsx** - Position-based rankings
- **src/components/scouting-hub/prospect-comparison-tool.tsx** - Side-by-side comparison
- **src/components/scouting-hub/mock-draft-simulator.tsx** - Mock draft UI
- **src/components/scouting-hub/scheme-fit-grid.tsx** - Scheme fit display
- **src/components/scouting-hub/position-coach-wishlist.tsx** - Coach wishlist display
- **src/components/scouting-hub/coaching-meeting-notes.tsx** - Flavor text notes
- **src/components/scouting-hub/hidden-gem-tracker.tsx** - Sleeper display
- **src/components/scouting-hub/combine-risers-fallers.tsx** - Stock movement display
- **src/app/dashboard/offseason/scouting/page.tsx** - TBD

---

## Success Criteria

- All 5 tabs render and function correctly
- Scout recommendations update based on scout expertise and perks
- Mock draft simulations produce realistic projections
- Scheme fit grades match existing archetype affinity system

---

## Notes

*This deliverables report was automatically generated from plan.json.*
*Use `/update-deliverables` to populate metrics from git history after implementation.*

**Last Updated**: 2025-12-18
