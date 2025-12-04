# Context Folder Index

Documentation and specifications for Gridiron Franchise.

**Last Updated:** December 3, 2025

---

## Folder Structure

```
context/
├── FINALS/              # Master design documents (source of truth)
├── data/                # Data files used by generators
├── mocks/               # UI mockups (reference)
├── ui/                  # Theme and UX specs
└── INDEX.md
```

---

## FINALS/ — Master Documents

The authoritative source for all game systems. These specs were used to implement the generators.

| File | Implementation | Status |
|------|----------------|--------|
| `FINAL-player-generation-system.md` | `lib/generators/player-generator.ts` | Implemented |
| `FINAL-roster-generation-system.md` | `lib/generators/roster-generator.ts` | Implemented |
| `FINAL-draft-class-system.md` | `lib/generators/draft-generator.ts` | Implemented |
| `FINAL-free-agent-pool-system.md` | `lib/generators/fa-generator.ts` | Implemented |
| `FINAL-traits-system.md` | `lib/data/traits.ts` | Implemented |
| `FINAL-badge-system.md` | `lib/data/badges.ts` | Implemented |
| `FINAL-coaching-staff-system.md` | `lib/coaching/coaching-generator.ts` | Implemented |
| `FINAL-scout-system.md` | `lib/scouting/scouting-generator.ts` | Implemented |
| `FINAL-facilities-system.md` | `lib/facilities/facilities-generator.ts` | Implemented |
| `FINAL-gm-skills-perks-system.md` | `lib/gm/gm-generator.ts` | Implemented |
| `FINAL-season-calendar-system.md` | `lib/schedule/schedule-generator.ts` | Implemented |
| `FINAL-training-system.md` | `lib/training/` | Implemented |
| `FINAL-salarycap.md` | — | Not implemented |
| `FINAL-schemes-system.md` | — | Not implemented |
| `sim-engine-v2.html` | — | Reference prototype |

---

## Data Files (Used by Code)

| File | Used By | Purpose |
|------|---------|---------|
| `data/name-pools.csv` | `player-generator.ts` | First/last names for player generation |
| `data/football-teams.csv` | Reference | 32 team definitions (also in `lib/data/teams.ts`) |

---

## UI Reference

### `/mocks` — HTML Mockups
Visual references for UI components.

| File | Status |
|------|--------|
| `auth-screen-mockup.html` | Reference |
| `gm-persona-mockup.html` | Implemented |
| `new-career-mockup.html` | Implemented |
| `roster-page-mockup.html` | Implemented |
| `player-profile-mockup.html` | Reference |
| `coach-profile-mockup.html` | Reference |
| `game-menu-mockup.html` | Reference |
| `football-simulator.html` | Prototype |

### `/ui` — Design Specs

| File | Purpose |
|------|---------|
| `football-game-theme-spec.md` | "Sunday Lights Premium" theme spec |
| `ui-ux-design-specification.md` | Mobile-first UI/UX guidelines |

---

## Cleanup Notes

The following files/folders were **removed** as duplicates or obsolete:

| Removed | Reason |
|---------|--------|
| `players-and-roster/FINAL-*.md` | Duplicates of FINALS/ |
| `players-and-roster/badges-system.md` | Superseded by FINALS |
| `players-and-roster/traits-system.md` | Superseded by FINALS |
| `players-and-roster/positions-attributes-system.md` | Superseded by FINALS |
| `coaching-staff/` | Superseded by FINALS |
| `facilities/` | Superseded by FINALS |
| `gm/` | Superseded by FINALS |
| `support-staff/` | Superseded by FINALS |
| `teams/team-identities-outline.md` | Obsolete (CSV is complete) |
| `architecture-plan.md` | Outdated |
| `implementation-plan.md` | Outdated |
| `game-elements-specification.md` | Superseded by FINALS |
| `player-generation-system-guide.md` | Superseded by FINALS |
| `sim-logic/` | Moved sim-engine to FINALS, removed upgrade plan |
| `sql/` | Not using Supabase, teams hardcoded |
| `SIMULATOR-IMPROVEMENTS.md` | Outdated notes |
| `FINALS/FINAL-coaching-staff-system (1).md` | Duplicate with typo |

---

## Quick Reference

**Need to generate players?** → `FINALS/FINAL-player-generation-system.md`

**Need roster structure?** → `FINALS/FINAL-roster-generation-system.md`

**Need trait/badge info?** → `FINALS/FINAL-traits-system.md`, `FINALS/FINAL-badge-system.md`

**Need UI guidance?** → `ui/football-game-theme-spec.md`, `mocks/`

---

*This index reflects the cleaned-up context folder structure.*
