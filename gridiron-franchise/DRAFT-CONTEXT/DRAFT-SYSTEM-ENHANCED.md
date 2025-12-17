# Elite Draft Experience - Comprehensive Plan

## Current State Analysis

### What We Have
- **Draft Generator**: 275 prospects (224 draftable + UDFAs), OVR ranges by round
- **Scouting System**: Scouts with attributes, XP, perks, weekly points, report quality tiers
- **Physical Data**: Height, weight, 40-time only (archetype-specific ranges)
- **Colleges**: 20 hardcoded (Alabama, Ohio State, Georgia, etc.)
- **Traits**: 46 traits across 7 categories
- **Draft UI**: Stub page ("Coming Soon")

### What's Missing
- Full NFL Combine measurables (vertical, broad jump, 3-cone, shuttle, bench press, arm length, hand size, wingspan)
- Extended college database (130+ schools)
- College career stats/accolades
- Pre-draft interview system
- Combine/Pro Day event simulation
- Draft day experience UI
- Rookie camp integration
- Medical evaluation system

---

## NFL Combine Measurables (Complete List)

### Physical Measurements
| Measurable | Description | Position Relevance |
|------------|-------------|-------------------|
| Height | Inches | All |
| Weight | Pounds | All |
| Arm Length | Inches (30-36") | OL, DL, CB, WR |
| Hand Size | Inches (8.5-11") | QB, RB, WR, TE |
| Wingspan | Inches (72-86") | OL, DL, DB, WR |

### Athletic Tests
| Test | Description | Elite Threshold | Key Positions |
|------|-------------|-----------------|---------------|
| 40-Yard Dash | Straight-line speed | <4.40s (skill) | WR, RB, CB, S |
| Vertical Jump | Lower-body explosiveness | 36"+ | WR, TE, CB, DE |
| Broad Jump | Horizontal explosiveness | 10'+ (120") | OL, RB, LB |
| 3-Cone Drill | Agility/bend | <7.0s | Edge, DB, RB |
| 20-Yard Shuttle | Change of direction | <4.2s | LB, DB, WR |
| Bench Press | Upper body strength (225 lb reps) | 25+ reps | OL, DL, LB |

---

## Implementation Phases

### Phase 1: Combine Measurables System
**Files to modify/create:**
- `src/lib/data/combine-measurables.ts` - Position-specific ranges for all 6 athletic tests
- `src/lib/types.ts` - Add CombineMeasurables interface
- `src/lib/generators/draft-generator.ts` - Generate full combine data for prospects

**Data Structure:**
```typescript
interface CombineMeasurables {
  height: number;           // inches
  weight: number;           // lbs
  armLength: number;        // inches
  handSize: number;         // inches
  wingspan: number;         // inches
  fortyYard: number;        // seconds
  verticalJump: number;     // inches
  broadJump: number;        // inches
  threeCone: number;        // seconds
  twentyShuttle: number;    // seconds
  benchPress: number;       // reps at 225 lbs
}
```

### Phase 2: Expanded College Database
**Files to create:**
- `src/lib/data/colleges.ts` - 130+ colleges with metadata

**College Tiers:**
1. **Blue Blood (8)**: Alabama, Ohio State, Georgia, Clemson, Michigan, LSU, USC, Oklahoma
2. **Elite (16)**: Texas, Florida, Penn State, Oregon, Notre Dame, Auburn, Texas A&M, Miami, Tennessee, Florida State, Wisconsin, UCLA, Washington, Nebraska, Arkansas, Ole Miss
3. **Power 5 (40)**: Remaining P5 schools
4. **Group of 5 (30)**: Boise State, UCF, Cincinnati, Memphis, etc.
5. **FCS/Small School (36)**: NDSU, JMU, Montana, etc.

**College Data:**
```typescript
interface College {
  id: string;
  name: string;
  mascot: string;
  conference: string;
  tier: 'blue_blood' | 'elite' | 'power5' | 'group5' | 'fcs';
  colors: { primary: string; secondary: string };
  strengthPositions: Position[]; // Positions this school develops well
}
```

### Phase 3: College Career & Accolades
**Files to modify:**
- `src/lib/generators/draft-generator.ts` - Add college stats/awards

**College Accolades:**
- Heisman Trophy Winner/Finalist
- All-American (1st, 2nd, 3rd team)
- Conference Player of the Year
- Position Awards (Biletnikoff, Doak Walker, etc.)
- Bowl Game MVP
- National Champion
- All-Conference (1st, 2nd, 3rd team)
- Freshman All-American
- Academic All-American

**College Stats (Position-Specific):**
- QB: Games, Comp%, Yards, TDs, INTs, Rush Yards, Rush TDs
- RB: Games, Carries, Yards, YPC, TDs, Rec, Rec Yards
- WR/TE: Games, Rec, Yards, YPR, TDs
- OL: Games Started, Sacks Allowed, Pancakes
- DL: Games, Tackles, Sacks, TFL, FF
- LB: Games, Tackles, Sacks, TFL, INT, PD
- DB: Games, Tackles, INT, PD, FF

### Phase 4: Pre-Draft Interview System
**Files to create:**
- `src/lib/scouting/interview-system.ts`
- `src/components/scouting/interview-card.tsx`

**Interview Features:**
- Schedule interviews (costs scouting points)
- 15-minute sessions (like real NFL: 60 interviews per team)
- Reveals:
  - Character/personality traits
  - Football IQ assessment
  - Work ethic indicators
  - Leadership qualities
  - Injury history hints
  - Scheme fit evaluation

**Interview Questions (Categories):**
1. Football Knowledge (scheme understanding)
2. Character Assessment (red flags, leadership)
3. Work Ethic Evaluation
4. Medical History Discussion
5. Personal Background

### Phase 5: Combine/Pro Day Events
**Files to create:**
- `src/lib/season/combine-event.ts`
- `src/app/dashboard/combine/page.tsx`

**Combine Week Experience:**
- Week 19 of season calendar
- Watch prospects perform drills
- Results revealed based on scouting investment
- "Risers" and "Fallers" after combine
- Injury concerns revealed

**Pro Day System:**
- Week 20 of season calendar
- School-specific workouts
- Private workouts (request specific prospects)
- More accurate measurements than combine

### Phase 6: Draft Day Experience
**Files to modify/create:**
- `src/app/dashboard/draft/page.tsx` - Complete overhaul
- `src/components/draft/draft-board.tsx`
- `src/components/draft/prospect-card.tsx`
- `src/components/draft/pick-ticker.tsx`
- `src/components/draft/trade-modal.tsx`

**Draft UI Features:**
- Live draft board with all 32 teams
- Pick ticker showing selections
- Trade up/down mechanics
- War room view with team needs
- Best Player Available vs. Position Need toggle
- Prospect comparison tool
- Scout grade overlay
- Real-time mock draft updates
- Auto-pick option with preferences

**Draft Rounds:**
- 7 rounds, 32 picks each (224 total)
- Compensatory picks system
- Trade value chart

### Phase 7: Rookie Camp Integration
**Files to create:**
- `src/lib/training/rookie-camp.ts`
- `src/app/dashboard/offseason/rookie-camp/page.tsx`

**Rookie Camp Features:**
- Post-draft mini-camp simulation
- True OVR partially revealed (Year 1: ±3 accuracy)
- Development plan assignment
- Position competition setup
- Depth chart integration
- "Camp standouts" and "Camp disappointments"

---

## Attribute-to-Measurable Correlation

### Speed Cluster
- 40-Yard Dash → Speed, Acceleration
- Cone Drills → Agility, Change of Direction

### Power Cluster
- Bench Press → Strength, Block Shedding, Impact Blocking
- Broad Jump → Power, Trucking, Hit Power

### Explosiveness Cluster
- Vertical Jump → Jumping, Catching in Traffic, Pass Rush
- Broad Jump → Acceleration, First Step

### Agility Cluster
- 3-Cone → Agility, Route Running, Coverage
- 20-Shuttle → Change of Direction, Man Coverage

### Size Cluster
- Arm Length → Press Coverage, Pass Blocking, Catch Radius
- Wingspan → Zone Coverage, Ball Skills, Blocking Reach
- Hand Size → Ball Security, Catching, Grip

---

## Scouting Point Costs (Revised)

| Activity | Cost | Reveals |
|----------|------|---------|
| Full Combine Report | 50 pts | All measurables + athletic grade |
| Position Workout | 30 pts | Position-specific skills |
| Medical Evaluation | 25 pts | Injury history, durability |
| Interview | 40 pts | Character, IQ, work ethic |
| Background Check | 20 pts | Off-field concerns |
| Pro Day Attendance | 0 pts (Week 20 only) | Enhanced measurable accuracy |
| Private Workout | 60 pts | Most accurate evaluation |

---

## Files to Create/Modify Summary

### New Files (12)
1. `src/lib/data/colleges.ts`
2. `src/lib/data/combine-measurables.ts`
3. `src/lib/scouting/interview-system.ts`
4. `src/lib/season/combine-event.ts`
5. `src/components/draft/draft-board.tsx`
6. `src/components/draft/prospect-card.tsx`
7. `src/components/draft/pick-ticker.tsx`
8. `src/components/draft/trade-modal.tsx`
9. `src/components/scouting/interview-card.tsx`
10. `src/lib/training/rookie-camp.ts`
11. `src/app/dashboard/combine/page.tsx`
12. `src/app/dashboard/offseason/rookie-camp/page.tsx`

### Modified Files (8)
1. `src/lib/types.ts` - Add CombineMeasurables, CollegeStats interfaces
2. `src/lib/generators/draft-generator.ts` - Generate full prospect data
3. `src/lib/generators/player-generator.ts` - Use combine data for attributes
4. `src/lib/data/physical-ranges.ts` - Add all combine measurables
5. `src/lib/scouting/types.ts` - Add interview types
6. `src/lib/scouting/scouting-utils.ts` - Attribute correlation logic
7. `src/app/dashboard/draft/page.tsx` - Complete draft room UI
8. `src/stores/scouting-store.ts` - Add interview tracking

---

## Implementation Priority

### Must Have (Core Experience)
1. Full combine measurables generation
2. Expanded college database (130+)
3. Draft day UI with pick ticker
4. Prospect cards with scouting grades

### Should Have (Enhanced Realism)
5. College career stats/accolades
6. Interview system
7. Combine week simulation
8. Trade mechanics

### Nice to Have (Polish)
9. Pro Day events
10. Rookie camp integration
11. Mock draft updates
12. Compensatory pick system

---

## Sources
- [NFL Scouting Combine - Wikipedia](https://en.wikipedia.org/wiki/NFL_Scouting_Combine)
- [Todd McShay's Guide to Combine Drills - ESPN](http://www.espn.com/espn/feature/story/_/id/14837586/todd-mcshay-guide-every-combine-drill-nfl-draft)
- [NFL Football Operations - Combine](https://operations.nfl.com/journey-to-the-nfl/the-next-generation-of-nfl-stars/nfl-scouting-combine/)
- [2024 NFL Scouting Combine - PFF](https://www.pff.com/news/draft-nfl-scouting-combine-2024-schedule-participants-pff-grades)
- [NFL Combine Official Site](https://www.nfl.com/combine/)
