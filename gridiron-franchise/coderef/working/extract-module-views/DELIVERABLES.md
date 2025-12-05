# DELIVERABLES: extract-module-views

**Project**: gridiron-franchise
**Feature**: extract-module-views
**Workorder**: WO-EXTRACT-MODULE-VIEWS-001
**Status**: 🚧 Not Started
**Generated**: 2025-12-04

---

## Executive Summary

**Goal**: Create 8 reusable view components from inline page code, enabling consistent UI across Dev Tools and Full Game modes

**Description**: Extract inline UI from dev-tools page files into reusable module components following the existing mode pattern (standalone/embedded). This enables these views to be used in both Dev Tools pages and the Full Game gameplay loop.

---

## Implementation Phases

### Phase 1: Core Team Views

**Description**: Extract team-specific views (coaching, facilities, scouting dept)

**Estimated Duration**: TBD

**Deliverables**:
- CoachingView
- FacilitiesView
- ScoutingDeptView

### Phase 2: Player Pool Views

**Description**: Extract player pool views (free agents, draft class)

**Estimated Duration**: TBD

**Deliverables**:
- FAView
- DraftView

### Phase 3: Strategy Views

**Description**: Extract strategy views (schemes, GM skills)

**Estimated Duration**: TBD

**Deliverables**:
- SchemesView
- GMSkillsView

### Phase 4: Integration

**Description**: Update exports and verify all components work

**Estimated Duration**: TBD

**Deliverables**:
- Updated module index
- All views importable from @/components/modules


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

- [ ] [EXTRACT-001] Create CoachingView component from coaching/page.tsx
- [ ] [EXTRACT-002] Create FacilitiesView component from facilities/page.tsx
- [ ] [EXTRACT-003] Create ScoutingDeptView component from scouting/page.tsx
- [ ] [EXTRACT-004] Create FAView component from fa/page.tsx
- [ ] [EXTRACT-005] Create DraftView component from draft/page.tsx
- [ ] [EXTRACT-006] Create SchemesView component from schemes/page.tsx
- [ ] [EXTRACT-007] Create GMSkillsView component from gm-skills/page.tsx
- [ ] [EXTRACT-008] Update module index exports for all new views

---

## Files Created/Modified

- **src/components/modules/views/coaching-view.tsx** - Reusable coaching staff view component
- **src/components/modules/views/facilities-view.tsx** - Reusable facilities view component
- **src/components/modules/views/scouting-dept-view.tsx** - Reusable scouting department view component
- **src/components/modules/views/fa-view.tsx** - Reusable free agents view component
- **src/components/modules/views/draft-view.tsx** - Reusable draft class view component
- **src/components/modules/views/schemes-view.tsx** - Reusable schemes view component
- **src/components/modules/views/gm-skills-view.tsx** - Reusable GM skills view component
- **src/app/dashboard/dev-tools/coaching/page.tsx** - Replace inline UI with CoachingView component
- **src/app/dashboard/dev-tools/facilities/page.tsx** - Replace inline UI with FacilitiesView component
- **src/app/dashboard/dev-tools/scouting/page.tsx** - Replace inline UI with ScoutingDeptView component
- **src/app/dashboard/dev-tools/fa/page.tsx** - Replace inline UI with FAView component
- **src/app/dashboard/dev-tools/draft/page.tsx** - Replace inline UI with DraftView component
- **src/app/dashboard/dev-tools/schemes/page.tsx** - Replace inline UI with SchemesView component
- **src/app/dashboard/dev-tools/gm-skills/page.tsx** - Replace inline UI with GMSkillsView component
- **src/components/modules/views/index.ts** - Add exports for new view components
- **src/components/modules/index.ts** - Re-export new views

---

## Success Criteria

- No success criteria defined

---

## Notes

*This deliverables report was automatically generated from plan.json.*
*Use `/update-deliverables` to populate metrics from git history after implementation.*

**Last Updated**: 2025-12-04
