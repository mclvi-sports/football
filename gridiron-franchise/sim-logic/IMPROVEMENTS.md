# Simulation Improvements Needed

## Critical: Systems That Don't Actually Work

| System | Problem |
|--------|---------|
| **Badges** | Only 15% functional - 85% of badges are dead code. Only QB gets badge bonuses. RB/WR/Defense badges never trigger. |
| **Scheme Attribute Bonuses** | Calculated but NEVER applied. Air Raid +4 deep accuracy? Never happens. |
| **Defensive Schemes** | Completely cosmetic. Cover 2 vs Man Blitz makes zero difference in play outcomes. |
| **Coaching Perks** | 80% never trigger. Red Zone Specialist, Run Game Architect, Turnover Machine - all dead code. |
| **Facility XP Bonuses** | Calculated but never applied to progression. Training facility upgrades do nothing. |

---

## Medium: Partially Working But Incomplete

| System | Status |
|--------|--------|
| **Traits** | 60% functional - injury/penalty reduction works, but situational bonuses (clutch, red zone) rarely trigger |
| **Simulator** | 85% complete - missing two-minute drill, proper injury sim, advanced analytics |
| **Standings** | 80% complete - missing full NFL tiebreakers, head-to-head, strength of schedule |
| **Contracts** | Missing guaranteed money, dead cap, signing bonuses - just annual salary |

---

## Working Well (But Could Be Better)

| System | Notes |
|--------|-------|
| **Player Generator** | Strong attribute/trait generation, but attributes don't degrade with age |
| **Draft Generator** | Good OVR ranges and scouting noise, missing positional runs |
| **Season Simulator** | Functional loop, missing bye weeks and fatigue system |
| **Playoffs** | Works but hardcoded to 7 teams, no neutral site support |

---

## Top 10 Priority Fixes

| # | Fix | Impact |
|---|-----|--------|
| 1 | **Wire badge effects to all positions** (not just QB) | Huge - makes badges matter |
| 2 | **Apply scheme attribute bonuses** before each game | Huge - schemes actually work |
| 3 | **Integrate defensive scheme effects** into play outcomes | Huge - defense becomes strategic |
| 4 | **Connect coaching perks** to play-level calculations | High - coaching matters |
| 5 | **Apply facility XP bonuses** in progression engine | High - facilities matter |
| 6 | **Add guaranteed money/dead cap** to contracts | Medium - cap management |
| 7 | **Implement age-based attribute decline** | Medium - realism |
| 8 | **Add salary cap validation** to roster generator | Medium - prevents unrealistic rosters |
| 9 | **Full NFL tiebreaker cascade** in standings | Low - edge case |
| 10 | **Two-minute drill logic** in simulator | Low - polish |

---

## The Core Problem

**Systems are well-designed but poorly connected.**

```
CURRENT FLOW:
Badges/Traits/Schemes/Coaching/Facilities → Calculate Bonuses → ❌ Never Applied

SHOULD BE:
Badges/Traits/Schemes/Coaching/Facilities → Calculate Bonuses → ✅ Apply to Play Resolution
```

The simulator only applies bonuses to **team OVR** and **QB specifically**. Everything else (RB rushing, WR catching, defense tackling) runs on base calculations that ignore all modifier systems.

---

## Detailed Findings by Category

### Badges (badges.ts + badge-effects.ts)
- 65+ badges defined with proper tiering
- `getPlayerBadgeBonus()` and `getPlayBonuses()` exist
- **Problem**: Only QB badges applied (line 343 in simulator at 0.2x multiplier)
- RB, WR, TE, DL, LB, DB badges are defined but NEVER called
- Conditions like `s.inRedZone`, `s.isClutch` depend on `GameSituation` not being populated

### Traits (traits.ts + trait-effects.ts)
- 46 traits across 7 categories
- Injury modifiers work: `getInjuryChanceModifier()`
- Penalty modifiers work: `getPenaltyChanceModifier()`
- **Problem**: Only QB traits affect team OVR (line 342)
- `getTeamTraitModifier()` exists but never called
- Most situational bonuses don't trigger

### Schemes (scheme-data.ts + scheme-modifiers.ts)
- 6 offensive, 6 defensive schemes with detailed matchup data
- Play calling IS scheme-aware (`shouldPass()`, `determinePassDepth()`)
- **Problem**: `getSchemeAttributeBonuses()` NEVER called
- Defensive schemes have zero play-level impact
- Coverage types defined but never determine outcomes

### Coaching (coaching-modifiers.ts)
- 20 perks (5 HC, 5 OC, 6 DC, 4 STC) with 3 tiers each
- `calculateCoachingGameModifiers()` called in simulator
- Penalty reduction and game planning work
- **Problem**: Most perks never trigger in play resolution
- XP bonuses calculated but not verified in progression engine

### Facilities (facility-modifiers.ts)
- Home advantage bonus works
- Stadium effects properly boost home team OVR
- **Problem**: Seasonal effects calculated but not applied
- `calculateFacilitySeasonalEffects()` returns XP bonuses never used
- Practice facility effects completely orphaned

---

## Generator Issues

### Player Generator
- Missing: Injury susceptibility correlation with position
- Missing: Athletic profile validation
- Missing: Age-based attribute degradation
- Missing: Scheme preference data

### Roster Generator
- Missing: Salary cap validation
- Missing: Practice squad (46 active + 7 PS)
- Missing: Team scheme integration for archetype weighting

### Draft Generator
- Missing: Positional run modeling
- Missing: Team-specific scouting bias
- Missing: Combine data integration

### FA Generator
- Missing: Weeks unsigned tracking
- Missing: Market dynamics
- Too many 80+ OVR FAs (unrealistic)

### Contract Generator
- Missing: Guaranteed money / dead cap
- Missing: Signing bonus vs salary split
- Missing: Position-specific longevity (QBs get longer deals)

---

## Simulator Gaps

### Missing Features
- Two-minute drill logic
- Injury simulation during plays
- Advanced analytics (EPA, success rate)
- Defensive play-calling (cover 2, blitz packages)
- Formation data (I-form, shotgun, pistol)

### Code Quality
- Magic numbers throughout (should be constants)
- No error handling for null simulator settings
- Debug logging doesn't distinguish levels

### Season Simulator
- No bye week handling
- No fatigue system
- Fixed 5% injury rate (doesn't vary by position)
- Weather always 'clear'

### Standings
- Head-to-head tiebreaker is last step (should be first)
- No strength of schedule calculation
- Simplified clinching logic

### Playoffs
- Hardcoded 7 teams per conference
- No neutral site support
- No playoff stats tracking
