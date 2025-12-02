# Scheme Separation - Deliverables

**Workorder ID:** WO-SCHEME-SEPARATION-001
**Status:** 🚧 Not Started
**Created:** 2025-12-02

---

## Phase 1: Create Schemes Module

### Tasks
- [ ] SETUP-001: Create src/lib/schemes/ directory structure
- [ ] TYPES-001: Create schemes/types.ts with OffensiveScheme, DefensiveScheme, STPhilosophy types
- [ ] TYPES-002: Add SchemeFit type and SCHEME_FIT_MODIFIERS constant
- [ ] TYPES-003: Add SchemeDefinition, AttributeModifier, PlayTendencies, PositionRequirement interfaces
- [ ] DATA-001: Create schemes/scheme-data.ts with West Coast scheme definition
- [ ] DATA-002: Add Spread scheme definition
- [ ] DATA-003: Add Pro Style scheme definition
- [ ] DATA-004: Add Air Raid scheme definition
- [ ] DATA-005: Add Power Run scheme definition
- [ ] DATA-006: Add Zone Run scheme definition
- [ ] DATA-007: Add 4-3 Base defensive scheme definition
- [ ] DATA-008: Add 3-4 Base defensive scheme definition
- [ ] DATA-009: Add Cover 2 defensive scheme definition
- [ ] DATA-010: Add Cover 3 defensive scheme definition
- [ ] DATA-011: Add Man Blitz defensive scheme definition
- [ ] DATA-012: Add Zone Blitz defensive scheme definition
- [ ] DATA-013: Add 3 ST philosophies (Aggressive Returns, Conservative, Coverage Specialist)
- [ ] DATA-014: Add scheme matchup data (strong against, weak against)

### Deliverables
- `src/lib/schemes/types.ts` - All type definitions
- `src/lib/schemes/scheme-data.ts` - 6 offensive, 6 defensive, 3 ST schemes

### Metrics
- LOC Added: TBD
- Commits: TBD
- Time Elapsed: TBD

---

## Phase 2: Player Fit System & Coaching Refactor

### Tasks
- [ ] FIT-001: Create schemes/scheme-fit.ts with archetype affinity mappings
- [ ] FIT-002: Add calculateSchemeFit function for attribute-based fit calculation
- [ ] FIT-003: Add scheme adjustment period logic (4 weeks transition)
- [ ] FIT-004: Add scheme families constant for faster adjustments
- [ ] COACH-001: Remove scheme definitions from coaching/types.ts
- [ ] COACH-002: Add imports from schemes module to coaching/types.ts
- [ ] COACH-003: Update Coach interface: add offensiveScheme?, defensiveScheme?, stPhilosophy?
- [ ] COACH-004: Rename CoachPosition ST to STC
- [ ] COACH-005: Add Players Coach perk to HC_PERKS
- [ ] COACH-006: Update CoachingStats schemeDistribution for new structure

### Deliverables
- `src/lib/schemes/scheme-fit.ts` - Fit calculation functions
- Updated `src/lib/coaching/types.ts` - Imports from schemes module

### Metrics
- LOC Changed: TBD
- Commits: TBD
- Time Elapsed: TBD

---

## Phase 3: Generator & UI Updates

### Tasks
- [ ] GEN-001: Update coaching-generator.ts imports from schemes module
- [ ] GEN-002: Update generateCoach to assign HC both offensive and defensive schemes
- [ ] GEN-003: Update getSchemeForPosition to return correct scheme types by role
- [ ] GEN-004: Update getCoachingStats to track schemes correctly
- [ ] GEN-005: Update ST position references to STC throughout generator
- [ ] UI-001: Update coaching page imports for new scheme types
- [ ] UI-002: Update Schemes tab to show offensive and defensive schemes separately
- [ ] UI-003: Update By Team tab to display HC with both schemes
- [ ] UI-004: Update coach position labels from ST to STC

### Deliverables
- Updated `src/lib/coaching/coaching-generator.ts`
- Updated `src/app/dashboard/dev-tools/coaching/page.tsx`

### Metrics
- LOC Changed: TBD
- Commits: TBD
- Time Elapsed: TBD

---

## Phase 4: Testing & Verification

### Tasks
- [ ] TEST-001: Run TypeScript compiler to verify no type errors
- [ ] TEST-002: Test coaching generator produces valid data
- [ ] TEST-003: Test dev tools UI displays correctly

### Success Criteria
- [ ] Schemes module exists at src/lib/schemes/
- [ ] All 6 offensive schemes defined
- [ ] All 6 defensive schemes defined
- [ ] All 3 ST philosophies defined
- [ ] Player scheme fit calculation works
- [ ] Coaching types imports from schemes
- [ ] HC has both offensiveScheme and defensiveScheme
- [ ] ST renamed to STC throughout
- [ ] Players Coach perk added
- [ ] TypeScript compilation passes
- [ ] Dev tools UI displays correctly

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 42 |
| Estimated Time | ~10 hours |
| Files to Create | 3 |
| Files to Modify | 5 |
