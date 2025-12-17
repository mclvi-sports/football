# Elite Draft Experience - Comprehensive Plan

---

## UI Mockups (Mobile-First, 390px width)

### Draft Room - Main View (`/dashboard/draft`)

```
┌─────────────────────────────────────┐
│ ◀ Draft Room            Round 1    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │  🔴 PICK 12 • YOUR PICK         │ │
│ │  ━━━━━━━━━━━━━━━━━━━━━  0:42   │ │
│ │  [  MAKE SELECTION  ]          │ │
│ │  [  TRADE PICK  ]              │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─ Recent Picks ─────────────────┐ │
│ │ 11. DEN  QB  J. Williams  A    │ │
│ │ 10. NYJ  WR  M. Harrison  A-   │ │
│ │  9. CHI  OT  A. Fautanu   B+   │ │
│ │  8. ATL  EDGE D. Murphy   A    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [ My Board ] [ By Position ] [BPA] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ⭐ 1. Caleb Williams       A+   │ │
│ │    QB • USC • 6'1" 215         │ │
│ │    40: 4.52 • Vert: 34"        │ │
│ │    Scout: Elite prospect       │ │
│ │                      [COMPARE] │ │
│ ├─────────────────────────────────┤ │
│ │    2. Marvin Harrison Jr  A    │ │
│ │    WR • Ohio State • 6'4" 205  │ │
│ │    40: 4.38 • Vert: 38"        │ │
│ │    Scout: Day 1 starter        │ │
│ │                      [COMPARE] │ │
│ ├─────────────────────────────────┤ │
│ │    3. Malik Nabers        A    │ │
│ │    WR • LSU • 6'0" 200         │ │
│ │    40: 4.35 • Vert: 36"        │ │
│ │    Scout: Electric playmaker   │ │
│ │                      [COMPARE] │ │
│ ├─────────────────────────────────┤ │
│ │ ~~4. Rome Odunze~~  DRAFTED    │ │
│ │    WR • Washington (Rd 1 #9)   │ │
│ └─────────────────────────────────┘ │
│                                     │
│         [ Load More ]               │
└─────────────────────────────────────┘
```

### Prospect Card - Expanded View (Bottom Sheet)

```
┌─────────────────────────────────────┐
│ ━━━━━━━━━━                          │  ← drag handle
├─────────────────────────────────────┤
│  ┌────┐  CALEB WILLIAMS             │
│  │ QB │  USC Trojans                │
│  │ A+ │  Projected: Top 3           │
│  └────┘                             │
├─────────────────────────────────────┤
│ MEASURABLES                         │
│ ┌───────┬───────┬───────┬────────┐  │
│ │Height │Weight │ Arms  │ Hands  │  │
│ │ 6'1"  │ 215   │ 32.5" │ 9.5"   │  │
│ └───────┴───────┴───────┴────────┘  │
│ ┌───────┬───────┬───────┬────────┐  │
│ │  40   │ Vert  │ Broad │3-Cone  │  │
│ │ 4.52  │  34"  │ 118"  │ 7.02   │  │
│ └───────┴───────┴───────┴────────┘  │
│ ┌───────┬───────┐                   │
│ │Shuttle│ Bench │                   │
│ │ 4.25  │  18   │                   │
│ └───────┴───────┘                   │
├─────────────────────────────────────┤
│ COLLEGE CAREER                      │
│ 2023: 3,633 yds • 30 TD • 5 INT     │
│ 2022: 4,537 yds • 42 TD • 5 INT     │
│ • Heisman Trophy Winner (2022)      │
│ • All-American (1st Team)           │
│ • Pac-12 Player of the Year         │
├─────────────────────────────────────┤
│ SCOUTING REPORT          85% Known  │
│ ┌─────────────────────────────────┐ │
│ │ ✓ Arm Talent: Elite             │ │
│ │ ✓ Mobility: Above Average       │ │
│ │ ✓ Football IQ: High             │ │
│ │ ? Leadership: [INTERVIEW REQ]   │ │
│ │ ? Durability: [MEDICAL REQ]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ TRAITS REVEALED                     │
│ [Clutch] [Cannon Arm] [Scrambler]   │
│ [???] [???]                         │
├─────────────────────────────────────┤
│ TEAM FIT                            │
│ Scheme Fit: ████████░░ 82%          │
│ Need Level: ████████████ HIGH       │
├─────────────────────────────────────┤
│ [  DRAFT  ]  [ADD TO BOARD] [SCOUT] │
└─────────────────────────────────────┘
```

### Trade Pick Modal

```
┌─────────────────────────────────────┐
│          TRADE OFFER                │
│              ✕                      │
├─────────────────────────────────────┤
│ TRADING UP TO PICK #8               │
├─────────────────────────────────────┤
│ YOU SEND              YOU RECEIVE   │
│ ┌───────────┐        ┌───────────┐  │
│ │ Rd 1 #12  │   ⟷   │ Rd 1 #8   │  │
│ │ Rd 2 #44  │        └───────────┘  │
│ │ Rd 4 #108 │                       │
│ └───────────┘                       │
├─────────────────────────────────────┤
│ TRADE VALUE                         │
│ Your Offer:  ████████░░ 1,850 pts   │
│ Fair Value:  ████████░░ 1,700 pts   │
│ Status: OVERPAY (+150)              │
├─────────────────────────────────────┤
│ ATL Likelihood: 72% Accept          │
├─────────────────────────────────────┤
│ [  PROPOSE TRADE  ]                 │
│ [  MODIFY OFFER   ]                 │
│ [  CANCEL         ]                 │
└─────────────────────────────────────┘
```

### Scouting View (`/dashboard/draft/scouting`)

```
┌─────────────────────────────────────┐
│ ◀ Scouting         Week 14 • 85 pts│
├─────────────────────────────────────┤
│ [ Prospects ] [ Reports ] [ Board ] │
├─────────────────────────────────────┤
│ Filter: [All ▼] Sort: [Grade ▼]     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ QB  C. Williams  USC       A+  │ │
│ │     ████████████████ 95%       │ │
│ │     [INTERVIEW 40] [MEDICAL 25]│ │
│ ├─────────────────────────────────┤ │
│ │ WR  M. Harrison  OSU       A   │ │
│ │     ████████████░░░░ 75%       │ │
│ │     [COMBINE 50] [WORKOUT 60]  │ │
│ ├─────────────────────────────────┤ │
│ │ EDGE D. Murphy   Texas     A   │ │
│ │     ████████░░░░░░░░ 50%       │ │
│ │     [COMBINE 50] [BACKGROUND 20│ │
│ ├─────────────────────────────────┤ │
│ │ OT  J. Alt       Notre D.  A-  │ │
│ │     ████░░░░░░░░░░░░ 25%       │ │
│ │     [COMBINE 50] [INTERVIEW 40]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📋 WEEKLY ACTIONS               │ │
│ │ Remaining: 3 of 5               │ │
│ │ • Interview (40 pts)            │ │
│ │ • Medical Eval (25 pts)         │ │
│ │ • Background Check (20 pts)     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Draft Board - Personal Rankings

```
┌─────────────────────────────────────┐
│ ◀ My Draft Board       15 Players  │
├─────────────────────────────────────┤
│ ┌─ TIER 1: ELITE ────────────────┐  │
│ │ ≡ 1. C. Williams  QB   USC  A+ │  │
│ │ ≡ 2. M. Harrison  WR   OSU  A  │  │
│ │ ≡ 3. M. Nabers    WR   LSU  A  │  │
│ └────────────────────────────────┘  │
│ ┌─ TIER 2: PREMIUM ──────────────┐  │
│ │ ≡ 4. D. Murphy   EDGE TEX  A   │  │
│ │ ≡ 5. J. Alt      OT   ND   A-  │  │
│ │ ≡ 6. B. Thomas   WR   UGA  A-  │  │
│ │                    [+ Add More] │  │
│ └────────────────────────────────┘  │
│ ┌─ TIER 3: SOLID STARTERS ───────┐  │
│ │ ≡ 7. Q. Mitchell CB   TOL  B+  │  │
│ │ ≡ 8. T. Spears   RB   TUL  B+  │  │
│ │                    [+ Add More] │  │
│ └────────────────────────────────┘  │
│                                     │
│ [ + NEW TIER ]                      │
├─────────────────────────────────────┤
│ Drag ≡ to reorder • Swipe to remove │
└─────────────────────────────────────┘
```

### Combine Week View (`/dashboard/combine`)

```
┌─────────────────────────────────────┐
│ ◀ NFL Combine          Week 19     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 📺 TODAY: QUARTERBACKS          │ │
│ │ Workouts in progress...         │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [ Results ] [ Schedule ] [ Risers ] │
├─────────────────────────────────────┤
│ TODAY'S RESULTS                     │
│ ┌─────────────────────────────────┐ │
│ │ C. Williams • USC               │ │
│ │ 40: 4.52 ▲ Vert: 34" Broad: 118"│ │
│ │ 3-Cone: 7.02  Shuttle: 4.25     │ │
│ │ Grade: A+ (No Change)           │ │
│ ├─────────────────────────────────┤ │
│ │ D. Daniels • LSU         📈     │ │
│ │ 40: 4.48 ▲ Vert: 38" Broad: 124"│ │
│ │ 3-Cone: 6.85  Shuttle: 4.12     │ │
│ │ Grade: B+ → A- (RISER!)         │ │
│ ├─────────────────────────────────┤ │
│ │ B. Nix • Oregon          📉     │ │
│ │ 40: 4.72 ▼ Vert: 28" Broad: 102"│ │
│ │ 3-Cone: 7.35  Shuttle: 4.48     │ │
│ │ Grade: A- → B (FALLER)          │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ COMBINE SCHEDULE                    │
│ ✓ Mon: OL, TE                       │
│ ✓ Tue: DL, LB                       │
│ ● Wed: QB, WR, RB  ← TODAY          │
│ ○ Thu: DB                           │
│ ○ Fri: Specialists                  │
└─────────────────────────────────────┘
```

### Rookie Camp View (`/dashboard/offseason/rookie-camp`)

```
┌─────────────────────────────────────┐
│ ◀ Rookie Camp           Week 22    │
├─────────────────────────────────────┤
│ YOUR 2025 DRAFT CLASS              │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Rd 1 #12  WR  M. Nabers        │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Est. OVR: 78-84  (True: ??) │ │ │
│ │ │ Camp: ⭐ STANDOUT            │ │ │
│ │ │ "Showing elite separation"  │ │ │
│ │ └─────────────────────────────┘ │ │
│ │ [Assign Development] [Mentors] │ │
│ ├─────────────────────────────────┤ │
│ │ Rd 2 #44  CB  Q. Mitchell      │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Est. OVR: 72-78  (True: ??) │ │ │
│ │ │ Camp: 📊 AS EXPECTED        │ │ │
│ │ │ "Solid technique, learning" │ │ │
│ │ └─────────────────────────────┘ │ │
│ │ [Assign Development] [Mentors] │ │
│ ├─────────────────────────────────┤ │
│ │ Rd 4 #108  RB  T. Spears       │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Est. OVR: 65-71  (True: ??) │ │ │
│ │ │ Camp: 📉 STRUGGLING         │ │ │
│ │ │ "Adjusting to NFL speed"    │ │ │
│ │ └─────────────────────────────┘ │ │
│ │ [Assign Development] [Mentors] │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ DRAFT GRADE: B+                     │
│ "Solid class addressing key needs"  │
└─────────────────────────────────────┘
```

---

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
