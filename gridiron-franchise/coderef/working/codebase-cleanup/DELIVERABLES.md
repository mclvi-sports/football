# DELIVERABLES: Codebase Cleanup

**Workorder:** WO-CODEBASE-CLEANUP-001
**Status:** 🚧 Not Started
**Started:** TBD
**Completed:** TBD

---

## Phase 1: Merge Teams Data

- [ ] TEAMS-001: Add colors field to TeamInfo interface
- [ ] TEAMS-002: Add primary/secondary colors to all 32 teams

## Phase 2: Move GM Data Files

- [ ] MOVE-001: Move gm-achievements.ts to src/lib/data/
- [ ] MOVE-002: Move gm-personas.ts to src/lib/data/
- [ ] MOVE-003: Move gm-prestige.ts to src/lib/data/
- [ ] MOVE-004: Move gm-skills.ts to src/lib/data/
- [ ] MOVE-005: Move gm-team-tiers.ts to src/lib/data/

## Phase 3: Update Imports

- [ ] IMPORT-001: Update imports in gm-skills page
- [ ] IMPORT-002: Update imports in gm components
- [ ] IMPORT-003: Update imports in gm utilities
- [ ] IMPORT-004: Update imports in gm stores

## Phase 4: Cleanup and Verify

- [ ] DELETE-001: Delete src/data/teams.ts (unused)
- [ ] DELETE-002: Delete src/data/ folder
- [ ] VERIFY-001: Run TypeScript compilation

---

## Metrics

| Metric | Value |
|--------|-------|
| LOC Added | TBD |
| LOC Removed | TBD |
| Files Changed | TBD |
| Commits | TBD |

---

## Notes

- Keep uppercase team IDs (BOS, PHI, etc.)
- Colors from unused teams.ts merged into active file
- No functional changes, just organization
