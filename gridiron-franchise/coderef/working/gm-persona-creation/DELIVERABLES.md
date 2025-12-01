# GM Persona Creation - Deliverables

**Workorder ID:** WO-GM-PERSONA-CREATION-001
**Status:** Not Started
**Created:** 2025-11-30

---

## Phase 1: Foundation

**Description:** Set up dependencies, types, data, and state management

### Tasks
- [ ] SETUP-001: Install Zustand dependency
- [ ] DATA-001: Create TypeScript interfaces for GM persona types
- [ ] DATA-002: Create GM persona data file with all archetypes, backgrounds, synergies
- [ ] DATA-003: Create utility functions for synergy detection and bonus calculation
- [ ] STATE-001: Create Zustand store for career creation state

### Deliverables
- [ ] Zustand installed
- [ ] TypeScript interfaces defined
- [ ] All GM persona data defined
- [ ] Utility functions for synergy detection
- [ ] Career store with persona state

### Metrics
| Metric | Value |
|--------|-------|
| LOC Added | TBD |
| Files Created | TBD |
| Time Elapsed | TBD |

---

## Phase 2: UI Components

**Description:** Build reusable UI components for persona selection
**Dependencies:** Phase 1

### Tasks
- [ ] UI-001: Create ArchetypeCard component
- [ ] UI-002: Create ArchetypeList component
- [ ] UI-003: Create SynergyBadge component
- [ ] UI-004: Create BackgroundCard component with synergy indicator
- [ ] UI-005: Create BackgroundList component
- [ ] UI-006: Create PersonaSummary component

### Deliverables
- [ ] ArchetypeCard component
- [ ] ArchetypeList component
- [ ] SynergyBadge component
- [ ] BackgroundCard component with synergy
- [ ] BackgroundList component
- [ ] PersonaSummary component

### Metrics
| Metric | Value |
|--------|-------|
| LOC Added | TBD |
| Files Created | TBD |
| Time Elapsed | TBD |

---

## Phase 3: Pages & Integration

**Description:** Create pages and integrate with existing flow
**Dependencies:** Phase 2

### Tasks
- [ ] PAGE-001: Create archetype selection page (Step 1)
- [ ] PAGE-002: Create background selection page (Step 2)
- [ ] PAGE-003: Create persona confirmation page (Step 3)
- [ ] INTEGRATE-001: Update career/new/page.tsx to redirect to archetype selection
- [ ] INTEGRATE-002: Update team confirmation page to show persona info

### Deliverables
- [ ] Archetype selection page (/career/new/archetype)
- [ ] Background selection page (/career/new/background)
- [ ] Persona confirmation page (/career/new/persona)
- [ ] Updated career/new redirect
- [ ] Updated team confirm page with persona

### Metrics
| Metric | Value |
|--------|-------|
| LOC Added | TBD |
| Files Created | TBD |
| Time Elapsed | TBD |

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Foundation | 5 | Not Started |
| Phase 2: UI Components | 6 | Not Started |
| Phase 3: Pages & Integration | 5 | Not Started |
| **Total** | **16** | **Not Started** |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/types/gm-persona.ts` | TypeScript interfaces |
| `src/data/gm-personas.ts` | Data definitions |
| `src/lib/gm-persona-utils.ts` | Utility functions |
| `src/stores/career-store.ts` | Zustand store |
| `src/components/career/persona/archetype-card.tsx` | Archetype card |
| `src/components/career/persona/archetype-list.tsx` | Archetype list |
| `src/components/career/persona/synergy-badge.tsx` | Synergy badge |
| `src/components/career/persona/background-card.tsx` | Background card |
| `src/components/career/persona/background-list.tsx` | Background list |
| `src/components/career/persona/persona-summary.tsx` | Persona summary |
| `src/app/career/new/archetype/page.tsx` | Step 1 page |
| `src/app/career/new/background/page.tsx` | Step 2 page |
| `src/app/career/new/persona/page.tsx` | Step 3 page |

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add zustand |
| `src/app/career/new/page.tsx` | Redirect to archetype |
| `src/app/career/new/confirm/page.tsx` | Show persona info |
