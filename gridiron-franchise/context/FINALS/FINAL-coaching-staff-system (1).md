# Coaching Staff System

## Overview

The Coaching Staff System defines how coaches function within the franchise. Coaches have ratings, perks, contracts, and directly impact team performance, player development, and game outcomes. Each coach has a scheme preference (defined in `FINAL-schemes-system.md`).

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-schemes-system.md` | Scheme definitions and player fit |
| `FINAL-player-generation-system.md` | Player attributes coaches develop |
| `FINAL-season-calendar-system.md` | Hiring windows, contract timing |
| `FINAL-salarycap.md` | Coach salary impacts |
| `FINAL-facilities-system.md` | Facility bonuses to coaching |

---

# PART 1: COACHING ROLES

## Staff Structure

| Role | Abbr | Required | Reports To |
|------|------|----------|------------|
| Head Coach | HC | Yes | Owner/GM |
| Offensive Coordinator | OC | Yes | HC |
| Defensive Coordinator | DC | Yes | HC |
| Special Teams Coordinator | STC | Yes | HC |

---

## Head Coach (HC)

### Primary Responsibilities
- Overall team leadership and culture
- Game management (timeouts, challenges, clock)
- Final say on 4th down decisions
- Team discipline and morale
- Media relations (affects morale)

### Impact Areas

| Area | Effect |
|------|--------|
| Team Chemistry | Direct modifier to team morale |
| Game Decisions | Timeout usage, challenge success |
| Player Development | Small XP boost to all players |
| Discipline | Reduces team penalty frequency |
| Halftime Adjustments | 2nd half performance modifier |

### Scheme Preference
- HC has preferred offensive AND defensive scheme
- Can override coordinator schemes (chemistry penalty)
- Best results when HC + coordinators aligned

---

## Offensive Coordinator (OC)

### Primary Responsibilities
- Offensive game planning and play calling
- Offensive player development focus
- Scheme implementation and adjustments
- Red zone play design

### Impact Areas

| Area | Effect |
|------|--------|
| Play Calling | Offensive efficiency rating |
| QB Development | Bonus XP for quarterbacks |
| Skill Position Dev | Bonus XP for RB, WR, TE |
| Red Zone | Scoring efficiency in red zone |
| Tempo | No-huddle/hurry-up effectiveness |

### Scheme Preference
- OC has one offensive scheme specialty
- Players with matching scheme fit get bonuses
- See `FINAL-schemes-system.md` for scheme details

---

## Defensive Coordinator (DC)

### Primary Responsibilities
- Defensive game planning and play calling
- Defensive player development focus
- Scheme implementation and adjustments
- Turnover creation strategy

### Impact Areas

| Area | Effect |
|------|--------|
| Play Calling | Defensive efficiency rating |
| Front 7 Development | Bonus XP for DL, LB |
| Secondary Development | Bonus XP for CB, S |
| Red Zone Defense | TD prevention rate |
| Turnovers | INT and fumble creation chance |

### Scheme Preference
- DC has one defensive scheme specialty
- Players with matching scheme fit get bonuses
- See `FINAL-schemes-system.md` for scheme details

---

## Special Teams Coordinator (STC)

### Primary Responsibilities
- All special teams units
- Kicker and punter development
- Return game strategy
- Coverage unit preparation

### Impact Areas

| Area | Effect |
|------|--------|
| Kicking Game | K/P performance modifier |
| Return Game | Return yards and TD chance |
| Coverage Units | Opponent return limitation |
| Fake Plays | Success rate of fakes |
| Field Position | Net punting, kickoff depth |

### Philosophy Preference
- STC has special teams philosophy
- Aggressive, Conservative, or Coverage Specialist
- See `FINAL-schemes-system.md` for details

---

# PART 2: COACH ATTRIBUTES

## Overall Rating (OVR)

| Range | Tier | Description |
|-------|------|-------------|
| 90-99 | Elite | Top 5 in the league, future HoF |
| 85-89 | Great | Pro Bowl caliber coordinator/HC |
| 80-84 | Good | Quality starter, above average |
| 75-79 | Average | Serviceable, middle of pack |
| 70-74 | Below Average | Needs development or replacement |
| 60-69 | Poor | Liability, should be replaced |

---

## Universal Attributes (All Coaches)

| Attribute | Range | Effect |
|-----------|-------|--------|
| Scheme Mastery | 60-99 | Execution quality of preferred scheme |
| Player Development | 60-99 | XP modifier for players under this coach |
| Motivation | 60-99 | Impact on player morale and effort |
| Game Planning | 60-99 | Weekly preparation quality |
| Adaptability | 60-99 | In-game and halftime adjustments |

### Attribute Effect Scaling

| Rating | Dev XP Bonus | Motivation Bonus | Game Plan Bonus |
|--------|--------------|------------------|-----------------|
| 60-69 | +5% | +2% chemistry | +1 OVR in games |
| 70-79 | +15% | +5% chemistry | +2 OVR in games |
| 80-89 | +30% | +10% chemistry | +3 OVR in games |
| 90-99 | +50% | +15% chemistry | +5 OVR in games |

---

## Position-Specific Attributes

### Head Coach

| Attribute | Range | Effect |
|-----------|-------|--------|
| Leadership | 60-99 | Team morale ceiling, locker room control |
| Clock Management | 60-99 | Timeout usage, end-game decisions |
| Challenge Success | 60-99 | % chance challenge is successful |
| Discipline | 60-99 | Reduces team penalty frequency |
| Media Handling | 60-99 | Protects players from distractions |

### Offensive Coordinator

| Attribute | Range | Effect |
|-----------|-------|--------|
| Play Calling | 60-99 | Offensive play success rate |
| Red Zone Offense | 60-99 | TD% vs FG% in red zone |
| QB Development | 60-99 | Bonus XP for QBs specifically |
| Tempo Control | 60-99 | No-huddle effectiveness |
| Creativity | 60-99 | Trick play success, unpredictability |

### Defensive Coordinator

| Attribute | Range | Effect |
|-----------|-------|--------|
| Play Calling | 60-99 | Defensive play success rate |
| Red Zone Defense | 60-99 | TD prevention in red zone |
| Turnover Creation | 60-99 | INT and forced fumble chance |
| Blitz Design | 60-99 | Pressure package effectiveness |
| Coverage Disguise | 60-99 | Pre-snap confusion for offense |

### Special Teams Coordinator

| Attribute | Range | Effect |
|-----------|-------|--------|
| Kicking Game | 60-99 | K/P performance modifier |
| Return Game | 60-99 | Return yards, TD chance |
| Coverage Units | 60-99 | Limits opponent returns |
| Situational | 60-99 | Fake punt/FG success, onside kicks |
| Gunner Development | 60-99 | Special teams player performance |

---

# PART 3: COACH PERKS

## Perk System Overview

- Coaches can have up to **3 perks**
- Each perk has **3 tiers** (unlockable with XP)
- Perks are earned through experience or hired with
- Position-specific perks available

---

## Head Coach Perks

### Motivator
| Tier | Effect |
|------|--------|
| 1 | +10% team morale |
| 2 | +20% team morale |
| 3 | +30% team morale, team never "gives up" |

### Genius Mind
| Tier | Effect |
|------|--------|
| 1 | +2 AWR to all players |
| 2 | +4 AWR to all players |
| 3 | +6 AWR to all players, perfect game plans |

### Disciplinarian
| Tier | Effect |
|------|--------|
| 1 | -25% team penalties |
| 2 | -50% team penalties |
| 3 | -75% team penalties, no personal fouls |

### Winner's Mentality
| Tier | Effect |
|------|--------|
| 1 | +2 OVR in playoff games |
| 2 | +4 OVR in playoff games |
| 3 | +6 OVR in playoff games, clutch bonus |

### Clock Master
| Tier | Effect |
|------|--------|
| 1 | Better timeout usage, +1 challenge/game |
| 2 | Optimal 2-minute drill, +2 challenges |
| 3 | Perfect clock management, auto-win ties |

### Players' Coach
| Tier | Effect |
|------|--------|
| 1 | +5% player loyalty, -10% holdouts |
| 2 | +10% loyalty, -25% holdouts |
| 3 | +20% loyalty, players take discounts |

---

## Offensive Coordinator Perks

### QB Whisperer
| Tier | Effect |
|------|--------|
| 1 | +25% QB XP gain |
| 2 | +50% QB XP gain, +2 QB OVR |
| 3 | +75% QB XP gain, +4 QB OVR, unlocks potential |

### Red Zone Specialist
| Tier | Effect |
|------|--------|
| 1 | +10% red zone TD rate |
| 2 | +20% red zone TD rate |
| 3 | +30% red zone TD rate, goal line package |

### Tempo Tactician
| Tier | Effect |
|------|--------|
| 1 | No-huddle +5% efficiency |
| 2 | No-huddle +10%, defense fatigues faster |
| 3 | No-huddle +15%, hurry-up mastery |

### Run Game Architect
| Tier | Effect |
|------|--------|
| 1 | +0.3 YPC team average |
| 2 | +0.6 YPC, +25% RB XP |
| 3 | +1.0 YPC, elite run blocking bonus |

### Passing Guru
| Tier | Effect |
|------|--------|
| 1 | +3% completion rate |
| 2 | +5% completion, +25% WR/TE XP |
| 3 | +8% completion, deep ball specialist |

### Play Designer
| Tier | Effect |
|------|--------|
| 1 | +10% trick play success |
| 2 | +20% trick plays, unique formations |
| 3 | +30% trick plays, unpredictable offense |

---

## Defensive Coordinator Perks

### Turnover Machine
| Tier | Effect |
|------|--------|
| 1 | +10% turnover chance |
| 2 | +20% turnover chance |
| 3 | +30% turnover chance, strip specialist |

### Pass Rush Specialist
| Tier | Effect |
|------|--------|
| 1 | +2 to all pass rush moves |
| 2 | +4 pass rush, +25% DE/DT XP |
| 3 | +6 pass rush, blitz packages elite |

### Coverage Master
| Tier | Effect |
|------|--------|
| 1 | +2 to all coverage ratings |
| 2 | +4 coverage, +25% CB/S XP |
| 3 | +6 coverage, shutdown ability |

### Run Stuffer
| Tier | Effect |
|------|--------|
| 1 | -0.3 opponent YPC |
| 2 | -0.6 YPC, +25% LB XP |
| 3 | -1.0 YPC, goal line stand specialist |

### Blitz Master
| Tier | Effect |
|------|--------|
| 1 | +15% blitz success rate |
| 2 | +25% blitz success, disguised looks |
| 3 | +35% blitz success, chaos defense |

### Bend Don't Break
| Tier | Effect |
|------|--------|
| 1 | -10% opponent red zone TD rate |
| 2 | -20% red zone TDs, force FGs |
| 3 | -30% red zone TDs, goal line elite |

---

## Special Teams Coordinator Perks

### Leg Whisperer
| Tier | Effect |
|------|--------|
| 1 | +3 to K/P ratings |
| 2 | +5 K/P ratings, clutch kicking |
| 3 | +8 K/P ratings, ice-proof kickers |

### Return Specialist
| Tier | Effect |
|------|--------|
| 1 | +5 return yards average |
| 2 | +10 return yards, +2% return TD |
| 3 | +15 return yards, +5% return TD |

### Coverage Ace
| Tier | Effect |
|------|--------|
| 1 | -5 opponent return yards |
| 2 | -10 return yards, +25% ST tackles |
| 3 | -15 return yards, elite gunners |

### Situational Genius
| Tier | Effect |
|------|--------|
| 1 | +15% fake punt/FG success |
| 2 | +25% fakes, +10% onside kick |
| 3 | +35% fakes, +20% onside, surprise plays |

---

# PART 4: COACH CONTRACTS

## Contract Structure

| Component | Description |
|-----------|-------------|
| Years | 1-6 year terms |
| Annual Salary | $500K - $15M per year |
| Signing Bonus | 0-50% of total value |
| Buyout | Remaining guaranteed if fired |

---

## Salary Expectations by OVR

| OVR Range | HC Salary | Coordinator Salary |
|-----------|-----------|-------------------|
| 90-99 | $12M - $15M | $6M - $8M |
| 85-89 | $9M - $12M | $4M - $6M |
| 80-84 | $6M - $9M | $2.5M - $4M |
| 75-79 | $4M - $6M | $1.5M - $2.5M |
| 70-74 | $2M - $4M | $800K - $1.5M |
| 60-69 | $1M - $2M | $500K - $800K |

---

## Contract Negotiations

### Factors Affecting Demands

| Factor | Effect on Demands |
|--------|-------------------|
| Recent Success | +10-30% salary |
| Championships | +20-50% salary |
| Age (young) | Longer term preferred |
| Age (old) | Shorter term, higher annual |
| Market Competition | +5-20% if multiple offers |
| Team Prestige | -5-15% for elite franchises |
| Facilities | -5-10% for top facilities |

### Negotiation Outcomes

| Result | Description |
|--------|-------------|
| Accepted | Coach signs at offered terms |
| Counter | Coach proposes different terms |
| Rejected | Coach declines, seeks other offers |
| Bidding War | Multiple teams competing |

---

## Firing & Buyouts

### Firing Process
1. Select coach to fire
2. Pay buyout (remaining guaranteed money)
3. Team morale drops if coach was popular
4. Must hire replacement before next game

### Buyout Calculation

```
Buyout = Remaining Years × Annual Salary × Guarantee %

Example:
- 3 years left at $8M/year
- 60% guaranteed
- Buyout = 3 × $8M × 0.60 = $14.4M
```

### Firing Consequences

| Scenario | Morale Impact |
|----------|---------------|
| Fired after losing season | Minimal (-5%) |
| Fired mid-season | Moderate (-15%) |
| Fired after winning season | Severe (-25%) |
| Popular coach fired | Additional -10% |

---

# PART 5: COACH DEVELOPMENT

## XP System

### XP Sources

| Source | XP Amount |
|--------|-----------|
| Regular Season Win | 100 XP |
| Playoff Win | 250 XP |
| Division Title | 500 XP |
| Conference Championship | 1,000 XP |
| Super Bowl Win | 2,500 XP |
| Coach of the Year | 1,500 XP |
| Pro Bowl Players (per) | 50 XP |
| All-Pro Players (per) | 100 XP |

### XP Uses

| Upgrade | Cost |
|---------|------|
| +1 Attribute Point | 500 XP |
| Unlock Perk Tier 1 | 1,000 XP |
| Unlock Perk Tier 2 | 3,000 XP |
| Unlock Perk Tier 3 | 7,000 XP |

### Attribute Caps
- Maximum 99 in any attribute
- Cannot exceed OVR ceiling without promotions

---

## Age & Retirement

### Age Brackets

| Age | Status |
|-----|--------|
| 35-50 | Rising/Prime, low retirement risk |
| 51-60 | Peak experience, stable |
| 61-65 | Veteran, slight retirement risk |
| 66-70 | Late career, moderate retirement risk |
| 71+ | High retirement chance each year |

### Retirement Probability

| Age | Annual Retirement Chance |
|-----|-------------------------|
| 61-65 | 5% per year |
| 66-70 | 15% per year |
| 71-75 | 30% per year |
| 76+ | 50% per year |

### Retention Bonuses
- Offer bonus to convince coach to stay
- Costs 25-50% of annual salary
- Reduces retirement chance by half

---

# PART 6: COACH GENERATION

## Generation Algorithm

### Step 1: Determine Role
- HC, OC, DC, or STC based on need

### Step 2: Generate Base Attributes

```
For each attribute:
    base = random(roleMin, roleMax)
    variance = random(-5, +5)
    final = clamp(base + variance, 60, 99)
```

### Step 3: Calculate OVR

```
HC OVR = (Leadership×0.20 + GamePlanning×0.20 + Motivation×0.15 + 
          ClockMgmt×0.15 + Adaptability×0.15 + Discipline×0.15)

OC OVR = (PlayCalling×0.25 + RedZone×0.20 + QBDev×0.20 + 
          Tempo×0.15 + Creativity×0.10 + SchemeMastery×0.10)

DC OVR = (PlayCalling×0.25 + TurnoverCreation×0.20 + BlitzDesign×0.20 + 
          RedZoneDef×0.15 + CoverageDisguise×0.10 + SchemeMastery×0.10)

STC OVR = (KickingGame×0.30 + ReturnGame×0.25 + CoverageUnits×0.25 + 
           Situational×0.20)
```

### Step 4: Assign Scheme Preference
- Random selection weighted by archetype tendencies
- See `FINAL-schemes-system.md`

### Step 5: Assign Perks
| OVR Range | Perk Count | Max Tier |
|-----------|------------|----------|
| 90+ | 3 | Tier 3 |
| 85-89 | 2-3 | Tier 2-3 |
| 80-84 | 2 | Tier 2 |
| 75-79 | 1-2 | Tier 1-2 |
| 70-74 | 1 | Tier 1 |
| 60-69 | 0-1 | Tier 1 |

### Step 6: Generate Demographics
- Name from name pools
- Age: 35-70 (weighted toward 45-60)
- Experience: age - 35 + random(-5, +5)

---

## Coach Pool Generation

### League Pool Size
- 8 available HCs
- 15 available OCs
- 15 available DCs
- 10 available STCs

### OVR Distribution in Pool

| Tier | % of Pool |
|------|-----------|
| Elite (90+) | 5% |
| Great (85-89) | 15% |
| Good (80-84) | 25% |
| Average (75-79) | 30% |
| Below Avg (70-74) | 20% |
| Poor (60-69) | 5% |

---

# PART 7: STAFF SYNERGIES

## Philosophy Alignment

### Aligned Staff
- HC, OC, DC share similar philosophy
- **Bonus:** +10% team chemistry, +2 team OVR

### Mixed Staff
- Conflicting philosophies on staff
- **Penalty:** -10% team chemistry, -1 team OVR

### Philosophy Types

| Philosophy | Description |
|------------|-------------|
| Aggressive | High risk, high reward |
| Conservative | Ball control, limit mistakes |
| Balanced | Situational approach |
| Innovative | Trick plays, unusual formations |

---

## Experience Synergies

### Veteran Staff
- All coaches 55+ with 10+ years experience
- **Bonus:** +5% player development, +3 clock management

### Young Staff
- All coaches under 45
- **Bonus:** +10% innovation, +5% player connection

### Mentor Dynamic
- Veteran coach (55+) with young coach (under 40)
- Young coach gains +50% XP
- Potential succession planning

---

## Coaching Trees

### Tree Bonuses
- Coaches who worked together previously
- +5% chemistry between their units
- Shared terminology and concepts

### Famous Trees (Examples)
- Bill Walsh tree (West Coast specialists)
- Bill Belichick tree (Defensive specialists)
- Generates connections between coaches

---

# PART 8: HIRING MARKET

## Hiring Windows

| Period | Available Actions |
|--------|-------------------|
| End of Season (Week 1) | Fire coaches, begin search |
| Coaching Search (Weeks 1-4) | Interview and hire |
| Training Camp | Emergency hires only |
| Regular Season | Cannot hire coordinators |

---

## Interview Process

### Interview Factors

| Factor | Weight |
|--------|--------|
| Coach OVR | 30% |
| Scheme Fit | 25% |
| Perk Match | 20% |
| Salary Demands | 15% |
| Age/Longevity | 10% |

### Competition
- Other teams also interviewing coaches
- Higher prestige teams get priority
- May lose coach to better offer

---

## Coordinator Poaching

### How It Works
1. Another team offers your coordinator HC job
2. You can match with promotion (if HC spot open)
3. You can offer retention bonus
4. Or lose coordinator to new team

### Poaching Factors
- Coordinator OVR 80+ attracts interest
- Winning record increases interest
- Championship appearance = high demand

---

# PART 9: IN-GAME IMPACT

## Simulation Modifiers

### Head Coach Impact

| Attribute | Simulation Effect |
|-----------|-------------------|
| Leadership | Team performs to OVR (no underperformance) |
| Clock Mgmt | Optimal timeout usage, no delay penalties |
| Challenge | Higher success rate on challenges |
| Discipline | Fewer penalties, no personal fouls |
| Adaptability | 2nd half performance boost |

### Coordinator Impact

| Attribute | Simulation Effect |
|-----------|-------------------|
| Play Calling | Unit efficiency rating |
| Red Zone | Scoring/prevention rate |
| Development | Player XP multiplier |
| Scheme Mastery | Scheme bonus fully applied |

---

## Halftime Adjustments

### How It Works
- Coaches with high Adaptability make adjustments
- Affects 2nd half performance

| Adaptability | 2nd Half Modifier |
|--------------|-------------------|
| 90+ | +5% efficiency, exploit weakness |
| 80-89 | +3% efficiency |
| 70-79 | +1% efficiency |
| 60-69 | No adjustment |
| <60 | -2% (outcoached) |

---

## Challenge System

### Challenge Success Rate

```
Success % = Base 33% + (Challenge Attribute - 60) × 1%

Example: Coach with 85 Challenge
Success = 33% + (85-60) = 58%
```

### Challenge Situations
- Scoring plays
- Turnovers
- Spot of ball
- Pass interference (limited)

---

# PART 10: UI MOCKUPS

## Coaching Staff Screen

```
┌────────────────────────────────────────┐
│  ← Back      COACHING STAFF            │
├────────────────────────────────────────┤
│                                        │
│  HEAD COACH                            │
│  ┌──────────────────────────────┐      │
│  │  [Photo]  M. WILLIAMS        │      │
│  │           85 OVR • Age 52    │      │
│  │                              │      │
│  │  Scheme: Pro Style / 3-4    │      │
│  │                              │      │
│  │  Perks:                      │      │
│  │  🎖️ Motivator (T2)          │      │
│  │  🏆 Winner's Mentality (T1)  │      │
│  │                              │      │
│  │  Contract: 3yr / $8M        │      │
│  │  [VIEW] [UPGRADE] [FIRE]     │      │
│  └──────────────────────────────┘      │
│                                        │
│  COORDINATORS                          │
│  ┌────────────────┐ ┌────────────────┐ │
│  │ OC: J. Smith   │ │ DC: R. Jones   │ │
│  │ 82 OVR         │ │ 88 OVR         │ │
│  │ West Coast     │ │ 3-4 Base       │ │
│  │ [VIEW]         │ │ [VIEW]         │ │
│  └────────────────┘ └────────────────┘ │
│  ┌────────────────┐                    │
│  │ ST: T. Brown   │                    │
│  │ 75 OVR         │                    │
│  │ Aggressive     │                    │
│  │ [VIEW]         │                    │
│  └────────────────┘                    │
│                                        │
│  Staff Chemistry: ALIGNED (+10%)       │
│                                        │
└────────────────────────────────────────┘
```

## Coach Detail Screen

```
┌────────────────────────────────────────┐
│  ← Back      J. SMITH (OC)             │
├────────────────────────────────────────┤
│                                        │
│  [Photo]   82 OVR • Age 47             │
│            12 Years Experience         │
│                                        │
│  ─────────────────────────────────     │
│  ATTRIBUTES                            │
│  Play Calling     ████████░░  85       │
│  Red Zone Off     ███████░░░  78       │
│  QB Development   ████████░░  84       │
│  Tempo Control    ██████░░░░  72       │
│  Creativity       ███████░░░  80       │
│  Scheme Mastery   ████████░░  86       │
│                                        │
│  ─────────────────────────────────     │
│  SCHEME                                │
│  Offensive: West Coast                 │
│  +3 Short Acc, +2 Short Route          │
│                                        │
│  ─────────────────────────────────     │
│  PERKS                                 │
│  🎯 QB Whisperer (Tier 2)              │
│     +50% QB XP, +2 QB OVR              │
│                                        │
│  📡 Passing Guru (Tier 1)              │
│     +3% completion rate                │
│                                        │
│  ─────────────────────────────────     │
│  XP: 4,200  [UPGRADE ATTRIBUTES]       │
│             [UPGRADE PERKS]            │
│                                        │
│  ─────────────────────────────────     │
│  CONTRACT                              │
│  Years Remaining: 2                    │
│  Annual Salary: $3.5M                  │
│  [EXTEND] [FIRE]                       │
│                                        │
└────────────────────────────────────────┘
```

## Hire Coach Screen

```
┌────────────────────────────────────────┐
│  ← Back      HIRE OFFENSIVE COORD      │
├────────────────────────────────────────┤
│                                        │
│  Filter: [All Schemes ▼] [Min OVR: 70] │
│  Sort: [Rating ▼]                      │
│                                        │
│  ─────────────────────────────────     │
│  AVAILABLE COACHES                     │
│                                        │
│  ┌──────────────────────────────┐      │
│  │  K. ANDERSON         88 OVR │      │
│  │  Age 45 • 8 Yrs Exp          │      │
│  │                              │      │
│  │  Scheme: Air Raid            │      │
│  │  Perks: 🎯 QB Whisperer (T3) │      │
│  │         📡 Passing Guru (T2) │      │
│  │                              │      │
│  │  Asking: $6M/yr, 4 years     │      │
│  │  Interest: HIGH (3 teams)    │      │
│  │  [INTERVIEW] [MAKE OFFER]    │      │
│  └──────────────────────────────┘      │
│                                        │
│  ┌──────────────────────────────┐      │
│  │  T. MARTINEZ         82 OVR │      │
│  │  Age 39 • 5 Yrs Exp          │      │
│  │                              │      │
│  │  Scheme: West Coast          │      │
│  │  Perks: 🏃 Tempo Tact (T2)   │      │
│  │                              │      │
│  │  Asking: $3M/yr, 3 years     │      │
│  │  Interest: MEDIUM (1 team)   │      │
│  │  [INTERVIEW] [MAKE OFFER]    │      │
│  └──────────────────────────────┘      │
│                                        │
└────────────────────────────────────────┘
```

---

# PART 11: INTEGRATION NOTES

## Data Structure

```typescript
interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  role: 'HC' | 'OC' | 'DC' | 'STC';
  age: number;
  experience: number;
  ovr: number;
  
  attributes: CoachAttributes;
  perks: CoachPerk[];
  
  offensiveScheme?: OffensiveScheme;  // HC, OC
  defensiveScheme?: DefensiveScheme;  // HC, DC
  stPhilosophy?: STPhilosophy;        // STC
  
  contract: CoachContract;
  xp: number;
  
  philosophy: 'aggressive' | 'conservative' | 'balanced' | 'innovative';
}

interface CoachAttributes {
  // Universal
  schemeMastery: number;
  playerDevelopment: number;
  motivation: number;
  gamePlanning: number;
  adaptability: number;
  
  // Position-specific
  [key: string]: number;
}

interface CoachPerk {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  effects: PerkEffect[];
}

interface CoachContract {
  yearsRemaining: number;
  annualSalary: number;
  guaranteedPercent: number;
  signingBonus: number;
}
```

---

## Simulation Integration

### Pre-Game
1. Calculate staff synergy bonuses
2. Apply scheme mastery modifiers
3. Set game plan quality based on Game Planning attribute

### During Game
1. Play calling influenced by coordinator OVR
2. Challenges use HC Challenge attribute
3. Timeout usage based on Clock Management
4. Halftime adjustments based on Adaptability

### Post-Game
1. Award coach XP based on result
2. Track stats for awards consideration
3. Update morale based on coaching decisions

---

**Version:** 2.0
**Date:** December 2025
**Status:** FINAL
