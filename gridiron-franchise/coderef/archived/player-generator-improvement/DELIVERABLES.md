# DELIVERABLES: player-generator-improvement

**Project**: gridiron-franchise
**Feature**: player-generator-improvement
**Workorder**: WO-PLAYER-GENERATOR-IMPROVEMENT-001
**Status**: 🚧 Not Started
**Generated**: 2025-12-06

---

## Executive Summary

**Goal**: Make archetypes meaningfully affect player attributes so a 'Power Rusher DE' and 'Speed Rusher DE' have distinct stat profiles

**Description**: Fix critical issues in player-generator.ts identified by multi-AI review (ChatGPT, Gemini, DeepSeek, Le Chat, Grok). Primary fix: attribute tier system calculates points but never uses them, making archetypes feel same-y. Secondary fixes: empty array guards, position-aware traits, badge split implementation.

---

## Implementation Phases

### Phase 1: Safety Guards

**Description**: Add defensive programming guards and remove dead code

**Estimated Duration**: TBD

**Deliverables**:
- Empty array guards
- OVR validation
- Clean imports

### Phase 2: Core Attribute Fix

**Description**: Fix the main issue: make archetypes affect attributes meaningfully

**Estimated Duration**: TBD

**Deliverables**:
- Tier-based attribute boosts
- Scaled base ratings

### Phase 3: Trait & Badge Alignment

**Description**: Align trait and badge logic with documented behavior

**Estimated Duration**: TBD

**Deliverables**:
- Position-aware traits
- 70/30 badge split

### Phase 4: Polish

**Description**: Minor enhancements for realism

**Estimated Duration**: TBD

**Deliverables**:
- Name rarity weighting
- Potential decline for veterans


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

- [ ] [PGEN-001] Add empty array guard to getRandomItem
- [ ] [PGEN-002] Add empty array guard to weightedRandom
- [ ] [PGEN-003] Add OVR range validation in generatePlayer
- [ ] [PGEN-004] Remove unused imports
- [ ] [PGEN-005] Rewrite generateAttributes with tier-based boosts
- [ ] [PGEN-006] Scale base rating floor with OVR
- [ ] [PGEN-007] Add position filtering to generateTraits
- [ ] [PGEN-008] Implement 70/30 badge split
- [ ] [PGEN-009] Use name rarity for weighted selection
- [ ] [PGEN-010] Allow potential decline for older players

---

## Files Created/Modified

- **src/lib/generators/player-generator.ts** - TBD

---

## Success Criteria

- No success criteria defined

---

## Notes

*This deliverables report was automatically generated from plan.json.*
*Use `/update-deliverables` to populate metrics from git history after implementation.*

**Last Updated**: 2025-12-06
