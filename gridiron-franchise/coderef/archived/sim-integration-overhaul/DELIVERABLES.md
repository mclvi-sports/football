# DELIVERABLES: sim-integration-overhaul

**Project**: gridiron-franchise
**Feature**: sim-integration-overhaul
**Workorder**: WO-SIM-INTEGRATION-OVERHAUL-001
**Status**: 🚧 Not Started
**Generated**: 2025-12-16

---

## Executive Summary

**Goal**: TBD

**Description**: TBD

---

## Implementation Phases

### Phase 1: Badge Integration

**Description**: Wire badge effects to all positions - highest impact fix

**Estimated Duration**: TBD

**Deliverables**:
- All 7 playTypes called in simulator (pass, run, receive, block, rush, cover, kick)
- Team badge and trait bonuses applied
- Meaningful multipliers (0.3x-1.0x)

### Phase 2: Scheme Integration

**Description**: Apply scheme bonuses and defensive effects

**Estimated Duration**: TBD

**Deliverables**:
- offensiveScheme/defensiveScheme assigned to SimTeam
- calculateSchemeGameModifiers() called per game
- Defensive schemes affect play outcomes

### Phase 3: Progression Integration

**Description**: Connect coaching and facility XP bonuses to player development

**Estimated Duration**: TBD

**Deliverables**:
- Coaching perks affect XP gain
- Facility bonuses affect training
- Age decline reduction working

### Phase 4: Contract and Age Systems

**Description**: Add contract depth and age-based decline

**Estimated Duration**: TBD

**Deliverables**:
- Contracts have guaranteed money and dead cap
- Players decline with age based on position
- Facilities slow veteran decline


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

- [ ] [BADGE-001] Add WR/TE badge calls with playType='receive' after pass completion
- [ ] [BADGE-002] Add OL badge calls with playType='block' for run/pass plays
- [ ] [BADGE-003] Add DL badge calls with playType='rush' for tackles/sacks
- [ ] [BADGE-004] Increase badge multipliers from 0.01x to meaningful values
- [ ] [BADGE-005] Call getTeamBadgeBonus() and getTeamTraitModifier() in OVR calculation
- [ ] [SCHEME-001] Assign offensiveScheme and defensiveScheme to SimTeam in team-adapter
- [ ] [SCHEME-002] Call calculateSchemeGameModifiers() in initializeGameModifiers()
- [ ] [SCHEME-003] Apply scheme attribute bonuses in getEffectiveOvr()
- [ ] [SCHEME-004] Apply defensive scheme effects to play outcomes
- [ ] [COACH-001] Import calculateCoachingXpBonuses into progression engine
- [ ] [COACH-002] Apply position-specific XP bonuses in calculateDevelopmentModifiers()
- [ ] [COACH-003] Replace hardcoded thresholds in training-integration with perk system
- [ ] [FACIL-001] Import calculateFacilitySeasonalEffects into progression engine
- [ ] [FACIL-002] Apply baseXpBonus and physicalXpBonus to XP calculations
- [ ] [FACIL-003] Apply ageDeclineReduction to attribute regression
- [ ] [CONTRACT-001] Add guaranteedMoney, signingBonus, deadCapByYear to contract interface
- [ ] [CONTRACT-002] Calculate guaranteed portion based on position and tier
- [ ] [CONTRACT-003] Add dead cap calculation for player cuts
- [ ] [AGE-001] Create age-decline.ts with position-specific decline curves
- [ ] [AGE-002] Apply age decline in processSeasonEndProgression()
- [ ] [AGE-003] Integrate facility ageDeclineReduction with decline system

---

## Files Created/Modified

- **src/lib/sim/age-decline.ts** - Age-based attribute decline curves by position
- **src/lib/sim/simulator.ts** - Add badge calls for all playTypes, add scheme modifier initialization, apply scheme bonuses to OVR
- **src/lib/sim/team-adapter.ts** - Assign offensiveScheme and defensiveScheme to SimTeam interface
- **src/lib/training/progression-engine.ts** - Import and apply coaching XP bonuses and facility seasonal effects
- **src/lib/training/training-integration.ts** - Replace hardcoded bonus thresholds with coaching perk system
- **src/lib/generators/contract-generator.ts** - Add guaranteed money, signing bonus, dead cap calculation

---

## Success Criteria

- All 7 badge playTypes called during simulation
- calculateSchemeGameModifiers() invoked per game
- Coaching XP bonuses reflected in progression
- Facility seasonal effects applied to training
- Contracts include guaranteed money and dead cap
- Veterans show position-appropriate decline

---

## Notes

*This deliverables report was automatically generated from plan.json.*
*Use `/update-deliverables` to populate metrics from git history after implementation.*

**Last Updated**: 2025-12-16
