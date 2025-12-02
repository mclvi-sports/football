# Coaching Staff System

## Overview

The coaching staff consists of **Head Coach (HC)**, **Offensive Coordinator (OC)**, **Defensive Coordinator (DC)**, and **Special Teams Coordinator (ST)**. Each coach has ratings, schemes, perks, and impacts team performance, player development, and game outcomes. Coaching salaries come from the Owner Budget, not the Salary Cap.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-facilities-system.md` | Coach effectiveness affected by practice facility |
| `FINAL-salarycap.md` | Salary cap is for players only; coaches paid from owner budget |
| `FINAL-player-generation-system.md` | Player development rates |

---

# PART 1: COACH TYPES & ROLES

## Head Coach (HC)

**Primary Responsibilities:**
- Overall team leadership and strategy
- Game management (challenges, timeouts, clock management)
- Team morale and culture
- Player discipline
- Affects entire roster

**Impact Areas:**
- Team chemistry/morale
- In-game decision making
- Player development (small boost to all)
- Challenge success rate
- Timeout management

---

## Offensive Coordinator (OC)

**Primary Responsibilities:**
- Offensive game planning and play calling
- Offensive player development
- Offensive scheme implementation

**Impact Areas:**
- Offensive player attribute boosts
- Offensive player development speed
- Offensive play success rate
- QB development (major focus)

---

## Defensive Coordinator (DC)

**Primary Responsibilities:**
- Defensive game planning and play calling
- Defensive player development
- Defensive scheme implementation

**Impact Areas:**
- Defensive player attribute boosts
- Defensive player development speed
- Defensive play success rate
- Turnover generation

---

## Special Teams Coordinator (ST)

**Primary Responsibilities:**
- Special teams units and strategy
- Kicker/Punter development
- Return game coordination

**Impact Areas:**
- Kicker/Punter performance
- Return game effectiveness
- Special teams player development
- Field position advantage

---

# PART 2: COACH ATTRIBUTES

## Core Ratings (All Coaches)

### Overall Rating (OVR)

| Range | Tier | Description |
|-------|------|-------------|
| 90-99 | Elite | Best in the league |
| 85-89 | Great | Top tier coordinator/HC |
| 80-84 | Good | Quality starter |
| 75-79 | Average | Serviceable |
| 70-74 | Below Average | Needs development |
| 60-69 | Poor | Liability |

### Universal Attributes

| Attribute | Range | Effect |
|-----------|-------|--------|
| Scheme Knowledge | 60-99 | Execution quality of schemes |
| Player Development | 60-99 | +5% to +50% XP boost |
| Motivation | 60-99 | +2% to +15% team chemistry |
| Game Planning | 60-99 | +1 to +5 OVR bonus in games |
| Adaptability | 60-99 | Better halftime adjustments |

---

## Position-Specific Attributes

### Head Coach

| Attribute | Effect |
|-----------|--------|
| Leadership (60-99) | Team morale impact |
| Clock Management (60-99) | Timeout usage, end-game decisions |
| Challenge Success (60-99) | Challenge flag success rate |
| Discipline (60-99) | Reduces team penalties |

### Offensive Coordinator

| Attribute | Effect |
|-----------|--------|
| Play Calling (60-99) | Offensive efficiency |
| Red Zone Offense (60-99) | Scoring efficiency |
| QB Development (60-99) | QB XP bonus |

### Defensive Coordinator

| Attribute | Effect |
|-----------|--------|
| Play Calling (60-99) | Defensive efficiency |
| Red Zone Defense (60-99) | Prevents TDs |
| Turnover Creation (60-99) | INT/fumble chance |

### Special Teams Coordinator

| Attribute | Effect |
|-----------|--------|
| Kicking Game (60-99) | K/P performance boost |
| Return Game (60-99) | Return yards, TD chance |
| Coverage Units (60-99) | Limit opponent returns |

---

# PART 3: COACHING SCHEMES

## Offensive Schemes

| Scheme | Philosophy | Best For | Bonuses | Penalties |
|--------|------------|----------|---------|-----------|
| West Coast | Short timing passes | Accurate QBs, possession WRs | +3 Short Acc, +2 Short RR | -2 Deep Acc |
| Spread | Space defense, fast tempo | Mobile QBs, fast WRs | +3 Speed, +2 Route Running | -2 Run Block |
| Pro Style | Balanced run/pass | Pocket QBs, power RBs | +2 all offensive | None |
| Air Raid | Vertical passing | Strong arms, deep threats | +4 Deep Acc, +3 Deep RR | -3 Run Block, -2 Carry |
| Power Run | Physical downhill | Power RBs, strong OL | +4 Truck, +3 Run Block, +2 STR | -3 all passing |
| Zone Run | Outside zone, misdirection | Elusive RBs, athletic OL | +4 Elusive, +3 AGI, +2 Vision | -2 Trucking |

---

## Defensive Schemes

| Scheme | Philosophy | Best For | Bonuses | Penalties |
|--------|------------|----------|---------|-----------|
| 4-3 Base | Four DL, three LBs | Strong DL, versatile LBs | +3 DL pass rush, +2 LB tackle | -2 DB coverage |
| 3-4 Base | Three DL, four LBs | Big DL, rush OLBs | +3 OLB rush, +2 flexibility | -2 DL run stop |
| Cover 2 | Two deep safeties | Fast safeties, zone CBs | +4 Zone, +3 deep defense | -3 Man, weak intermediate |
| Cover 3 | Three deep zones | Ball-hawk DBs | +3 Zone, +2 INTs | -2 run defense |
| Man Blitz | Aggressive man + pressure | Lockdown CBs, rushers | +5 Man, +4 pass rush | -4 Zone, big play risk |
| Zone Blitz | Disguised pressure | Smart LBs, versatile DL | +3 Play Rec, +3 Blitz | -2 Man |

---

## Special Teams Philosophy

| Philosophy | Effect | Bonus | Penalty |
|------------|--------|-------|---------|
| Aggressive Returns | Return everything | +5 return yards, +3% TD chance | +2% turnover risk |
| Conservative | Fair catch often | -3% turnover risk | -5 return yards |
| Coverage Specialist | Elite coverage | -10 opponent return yards | Neutral |

---

## Scheme Fit System

| Fit Level | OVR Modifier | Description |
|-----------|--------------|-------------|
| Perfect | +5 OVR | Ideal match |
| Good | +2 OVR | Solid fit |
| Neutral | 0 | Neither helps nor hurts |
| Poor | -2 OVR | Awkward fit |
| Terrible | -5 OVR | Wrong system entirely |

**Changing Schemes:** Players take 4 games to adjust to new scheme.

---

# PART 4: COACHING PERKS

## Head Coach Perks

| Perk | Tier 1 | Tier 2 | Tier 3 |
|------|--------|--------|--------|
| Motivator | +10% morale | +20% morale | +30% morale, never quit |
| Genius Mind | +2 AWR all | +4 AWR all | +6 AWR, perfect game plans |
| Disciplinarian | -25% penalties | -50% penalties | -75% penalties |
| Winner's Mentality | +2 playoff OVR | +3 playoff OVR | +5 playoff OVR |
| Clock Master | +20% timeout efficiency | +40%, better 2-min | Perfect clock management |
| Rebuild Specialist | +10% young dev | +25% young dev | +50% young dev |

**Traits (not tiered):**
- **Aggressive:** +10% big play, +10% turnover risk
- **Conservative:** -10% turnover risk, -10% big play

---

## Offensive Coordinator Perks

| Perk | Tier 1 | Tier 2 | Tier 3 |
|------|--------|--------|--------|
| QB Whisperer | +25% QB dev | +50% QB dev | +100% QB dev |
| Run Game Specialist | +3 RB/OL run | +5 RB/OL run | +8 RB/OL run |
| Passing Game Guru | +3 passing | +5 passing | +8 passing |
| Red Zone Maestro | +5 RZ offense | +8 RZ offense | +12 RZ, 90%+ TD |
| Tempo Controller | +10% no-huddle | +20%, tires D | +30%, no subs |
| Creative Play Caller | 10 trick plays | 20 tricks, +10% | 30 tricks, +25% |

---

## Defensive Coordinator Perks

| Perk | Tier 1 | Tier 2 | Tier 3 |
|------|--------|--------|--------|
| Defensive Genius | +3 all defense | +5 all defense | +8 all, top 5 D |
| Turnover Creator | +25% TO chance | +50% TO chance | +75% TO, 3+/game |
| Blitz Master | +3 blitz rush | +5 blitz rush | +8 blitz, 5+ sacks |
| Run Stopper | +3 run defense | +5 run defense | +8 run, <75 yards |
| Coverage Specialist | +3 coverage | +5 coverage | +8 coverage, lockdown |
| DB Developer | +25% DB dev | +50% DB dev | +100% DB dev |

---

## Special Teams Coordinator Perks

| Perk | Tier 1 | Tier 2 | Tier 3 |
|------|--------|--------|--------|
| Kicking Coach | +3 K/P | +5 K/P | +8 K/P, 95%+ FG |
| Return Specialist | +5 return yards | +10 yards | +15 yards, TD every 3 games |
| Coverage Expert | -5 opp yards | -10 opp yards | -15 yards, no ST scores |
| Field Position Master | +3 avg position | +5 avg position | +8 position |

---

## Perk Unlock Costs

| Tier | XP Cost |
|------|---------|
| Tier 1 | 1,000 XP |
| Tier 2 | 3,000 XP |
| Tier 3 | 7,000 XP |

---

# PART 5: COACH SALARIES

## Salary by Position and OVR

Coach salaries come from the **Owner Budget**, not the Salary Cap.

### Head Coach Salaries

| OVR | Annual Salary | Typical Contract |
|-----|---------------|------------------|
| 95-99 | $12M - $15M | 4-5 years |
| 90-94 | $10M - $12M | 4-5 years |
| 85-89 | $8M - $10M | 3-4 years |
| 80-84 | $6M - $8M | 3-4 years |
| 75-79 | $4M - $6M | 2-3 years |
| 70-74 | $2M - $4M | 2-3 years |
| 60-69 | $1M - $2M | 1-2 years |

### Coordinator Salaries

| OVR | OC Salary | DC Salary | ST Salary |
|-----|-----------|-----------|-----------|
| 90-99 | $4M - $6M | $4M - $6M | $2M - $3M |
| 85-89 | $3M - $4M | $3M - $4M | $1.5M - $2M |
| 80-84 | $2M - $3M | $2M - $3M | $1M - $1.5M |
| 75-79 | $1.5M - $2M | $1.5M - $2M | $800K - $1M |
| 70-74 | $1M - $1.5M | $1M - $1.5M | $600K - $800K |
| 60-69 | $500K - $1M | $500K - $1M | $400K - $600K |

---

## Total Staff Salary Examples

| Staff Quality | HC | OC | DC | ST | Total |
|---------------|----|----|----|----|-------|
| Elite | $14M | $5M | $5M | $2.5M | $26.5M |
| Great | $9M | $3.5M | $3.5M | $1.8M | $17.8M |
| Good | $7M | $2.5M | $2.5M | $1.2M | $13.2M |
| Average | $5M | $1.8M | $1.8M | $900K | $9.5M |
| Below Average | $3M | $1.2M | $1.2M | $700K | $6.1M |

---

## Performance Bonuses

| Achievement | Bonus |
|-------------|-------|
| Make Playoffs | +$500K |
| Win Division | +$750K |
| Conference Championship | +$1M |
| Win Championship | +$2M |
| Coach of the Year | +$1M |

---

# PART 6: STARTING COACHES BY TEAM TIER

## Coach Ratings by Team Quality

At franchise start, teams have coaches matching their tier:

### Elite Teams (3 teams)

| Position | OVR Range | Avg |
|----------|-----------|-----|
| HC | 88-95 | 91 |
| OC | 85-92 | 88 |
| DC | 85-92 | 88 |
| ST | 78-85 | 81 |

### Good Teams (8 teams)

| Position | OVR Range | Avg |
|----------|-----------|-----|
| HC | 82-89 | 85 |
| OC | 80-87 | 83 |
| DC | 80-87 | 83 |
| ST | 75-82 | 78 |

### Average Teams (12 teams)

| Position | OVR Range | Avg |
|----------|-----------|-----|
| HC | 76-83 | 79 |
| OC | 74-81 | 77 |
| DC | 74-81 | 77 |
| ST | 70-77 | 73 |

### Below Average Teams (6 teams)

| Position | OVR Range | Avg |
|----------|-----------|-----|
| HC | 70-78 | 74 |
| OC | 68-76 | 72 |
| DC | 68-76 | 72 |
| ST | 65-73 | 69 |

### Rebuilding Teams (3 teams)

| Position | OVR Range | Avg |
|----------|-----------|-----|
| HC | 65-75 | 70 |
| OC | 63-73 | 68 |
| DC | 63-73 | 68 |
| ST | 62-70 | 66 |

---

# PART 7: COACH GENERATION

## Generating a Coach

```
function generateCoach(position, targetOVR):
    coach = {
        position: position,
        age: generateAge(position, targetOVR),
        experience: generateExperience(age),
        
        // Generate attributes
        attributes: generateAttributes(position, targetOVR),
        ovr: calculateOVR(attributes),
        
        // Scheme and philosophy
        scheme: pickRandomScheme(position),
        philosophy: pickPhilosophy(),  // Aggressive, Balanced, Conservative
        
        // Perks based on OVR and experience
        perks: generatePerks(targetOVR, experience),
        
        // Contract expectations
        salaryDemand: calculateSalary(position, ovr),
        contractYears: calculateContractLength(ovr, age)
    }
    
    return coach
```

---

## Age Distribution

| OVR Tier | Age Range | Peak Age |
|----------|-----------|----------|
| 90-99 Elite | 50-68 | 55-62 |
| 85-89 Great | 45-65 | 50-58 |
| 80-84 Good | 40-60 | 45-55 |
| 75-79 Average | 35-58 | 42-52 |
| 70-74 Below Avg | 32-55 | 38-48 |
| 60-69 Poor | 30-50 | 35-45 |

**Note:** Young coaches (30-40) tend to be lower OVR but have higher potential. Older coaches (60+) may retire soon.

---

## Experience by Age

| Age | Typical Experience |
|-----|-------------------|
| 30-35 | 2-5 years |
| 36-45 | 6-12 years |
| 46-55 | 13-20 years |
| 56-65 | 21-30 years |
| 66+ | 30+ years |

---

## Perk Generation

| OVR | Total Perk Tiers | Distribution |
|-----|------------------|--------------|
| 95-99 | 7-9 tiers | 1-2 Tier 3, 2-3 Tier 2, rest Tier 1 |
| 90-94 | 5-7 tiers | 1 Tier 3, 2 Tier 2, rest Tier 1 |
| 85-89 | 4-5 tiers | 0-1 Tier 3, 1-2 Tier 2, rest Tier 1 |
| 80-84 | 3-4 tiers | 1 Tier 2, rest Tier 1 |
| 75-79 | 2-3 tiers | All Tier 1 |
| 70-74 | 1-2 tiers | All Tier 1 |
| 60-69 | 0-1 tiers | Maybe 1 Tier 1 |

---

## Attribute Generation

```
function generateAttributes(position, targetOVR):
    // Base variance around target
    variance = 8
    
    if position == "HC":
        return {
            leadership: targetOVR + random(-variance, variance),
            gamePlanning: targetOVR + random(-variance, variance),
            motivation: targetOVR + random(-variance, variance),
            clockManagement: targetOVR + random(-variance, variance),
            adaptability: targetOVR + random(-variance, variance),
            discipline: targetOVR + random(-variance, variance),
            offensiveKnowledge: targetOVR + random(-variance, variance),
            defensiveKnowledge: targetOVR + random(-variance, variance),
            playerDevelopment: targetOVR + random(-variance, variance)
        }
    
    // Similar for OC, DC, ST with position-specific attributes
    // Clamp all values to 60-99 range
```

---

# PART 8: COACH MARKET & HIRING

## Available Coach Pool

At any time, the coaching market contains:

| Position | Available | OVR Distribution |
|----------|-----------|------------------|
| HC Candidates | 15-25 | 3 Elite, 5 Great, 8 Good, rest Average/Below |
| OC Candidates | 20-30 | 4 Elite, 6 Great, 10 Good, rest below |
| DC Candidates | 20-30 | 4 Elite, 6 Great, 10 Good, rest below |
| ST Candidates | 15-20 | 2 Great, 5 Good, rest Average/Below |

### Pool Refresh

- Pool refreshes annually during offseason
- Fired coaches enter pool
- Retiring coaches leave pool
- New coaches generated to fill gaps

---

## Hiring Competition

### Coach Interest Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Salary Offer | 30% | Higher pay = more interest |
| Team Talent | 25% | Better roster = more interest |
| Facilities | 15% | Better facilities = more interest |
| Job Security | 15% | Longer contract = more interest |
| Market Size | 10% | Larger city = slight preference |
| Scheme Fit | 5% | If roster fits their scheme |

### Competing Offers

- Multiple teams can pursue same coach
- Higher interest score wins
- Ties broken by salary, then facilities

---

## Coordinator Poaching

Other teams can offer your coordinators HC jobs:

| Coordinator OVR | Poach Chance | Prevention |
|-----------------|--------------|------------|
| 90+ | 80% per year | Promote or match HC salary |
| 85-89 | 50% per year | Give raise (+$1M) |
| 80-84 | 25% per year | Extension |
| <80 | 5% per year | Rare |

**If Poached:** Must hire replacement (mid-season if during season)

---

## Firing & Buyouts

| Scenario | Buyout Amount |
|----------|---------------|
| Fire with years remaining | 100% of remaining guaranteed |
| Mutual separation | 50% of remaining |
| Poor performance clause | 25% of remaining |

---

# PART 9: COACH DEVELOPMENT

## XP System

### XP Gain

| Achievement | XP |
|-------------|-----|
| Win | 100 |
| Playoff Win | 250 |
| Division Title | 500 |
| Conference Title | 1,000 |
| Championship | 2,500 |
| Coach of the Year | 1,500 |

### Spending XP

| Upgrade | Cost |
|---------|------|
| +1 Attribute Point | 500 XP |
| Tier 1 Perk | 1,000 XP |
| Tier 2 Perk | 3,000 XP |
| Tier 3 Perk | 7,000 XP |

---

## Age & Retirement

| Age Range | Status |
|-----------|--------|
| 30-59 | Active, no retirement risk |
| 60-65 | Prime veteran years |
| 66-70 | May retire (10% per year) |
| 71-75 | Likely to retire (25% per year) |
| 76+ | High retirement chance (50% per year) |

**Retention:** Can offer bonus ($500K-$2M) to delay retirement 1 year

---

# PART 10: COACHING SYNERGIES

## Staff Chemistry

| Condition | Effect |
|-----------|--------|
| All same philosophy | +10% chemistry, +2 OVR |
| Mixed philosophies | -10% chemistry, -1 OVR |
| All veteran (55+, 10+ years) | +5% development, +3 clock mgmt |
| All young (<45) | +10% innovation, +5% player connection |

## Coach Trees

- Coaches who worked together have connection
- Hiring from same tree = +5% chemistry
- Historical coaching lineages tracked

---

# PART 11: IN-GAME IMPACT

## Simulation Effects

### High-Rated HC
- Better timeout usage
- Higher challenge success rate
- Better 4th down decisions
- Fewer penalties

### High-Rated OC
- More efficient play calling
- Better red zone execution
- Exploits defensive weaknesses

### High-Rated DC
- Better defensive adjustments
- Forces more turnovers
- Better pressure packages

### High-Rated ST
- Better field position
- More successful fake plays
- Better coverage

---

## Halftime Adjustments

| Adaptability | 2nd Half Boost |
|--------------|----------------|
| 95-99 | +5 OVR swing possible |
| 85-94 | +3 OVR swing possible |
| 75-84 | +1 OVR swing possible |
| <75 | No significant adjustment |

---

## Coach vs Player Balance

| Scenario | Expected Wins |
|----------|---------------|
| Elite coach + average players | 7-9 wins |
| Average coach + elite players | 11-5 wins |
| Elite coach + elite players | 13-3+ wins |
| Poor coach + elite players | 9-7 wins |

**Design Philosophy:** Coaches enhance, don't replace talent.

---

# PART 12: UI MOCKUPS

## Coaching Staff Overview

```
┌────────────────────────────────────────┐
│  ← Back      COACHING STAFF            │
├────────────────────────────────────────┤
│                                        │
│  STAFF BUDGET: $18.5M / $25M           │
│  Philosophy: Balanced ✓                │
│                                        │
│  HEAD COACH                            │
│  ┌──────────────────────────────┐      │
│  │  M. WILLIAMS    85 OVR       │      │
│  │  Age: 52 • 12 Years Exp      │      │
│  │  Scheme: Pro Style           │      │
│  │  Salary: $8M/yr (3 yrs left) │      │
│  │  [VIEW] [UPGRADE] [FIRE]     │      │
│  └──────────────────────────────┘      │
│                                        │
│  COORDINATORS                          │
│  ┌──────────────────────────────┐      │
│  │ OC: J. Smith    82 OVR       │      │
│  │ West Coast • $2.5M/yr        │      │
│  │ ⚠️ Interest from other teams │      │
│  └──────────────────────────────┘      │
│  ┌──────────────────────────────┐      │
│  │ DC: R. Jones    88 OVR       │      │
│  │ 3-4 Base • $3.5M/yr          │      │
│  └──────────────────────────────┘      │
│  ┌──────────────────────────────┐      │
│  │ ST: T. Brown    75 OVR       │      │
│  │ Aggressive • $900K/yr        │      │
│  └──────────────────────────────┘      │
│                                        │
│  [HIRE COACH]                          │
└────────────────────────────────────────┘
```

---

## Coach Hiring Screen

```
┌────────────────────────────────────────┐
│  ← Back      HIRE HEAD COACH           │
├────────────────────────────────────────┤
│                                        │
│  AVAILABLE CANDIDATES                  │
│  Filter: [All] [Scheme] [OVR]          │
│                                        │
│  ┌──────────────────────────────┐      │
│  │ ★ K. ANDERSON    91 OVR      │      │
│  │ Age: 48 • 15 Years Exp       │      │
│  │ Scheme: West Coast           │      │
│  │ Perks:                       │      │
│  │  🎖️ Motivator (T3)           │      │
│  │  🏆 Winner's Mentality (T2)  │      │
│  │  🧠 Genius Mind (T1)         │      │
│  │ Asking: $11M/yr, 4 years     │      │
│  │ Interest: HIGH (3 teams)     │      │
│  │ [MAKE OFFER]                 │      │
│  └──────────────────────────────┘      │
│                                        │
│  ┌──────────────────────────────┐      │
│  │ D. MARTINEZ     85 OVR       │      │
│  │ Age: 55 • 22 Years Exp       │      │
│  │ Scheme: Power Run            │      │
│  │ Asking: $8M/yr, 3 years      │      │
│  │ Interest: MEDIUM (1 team)    │      │
│  │ [MAKE OFFER]                 │      │
│  └──────────────────────────────┘      │
│                                        │
└────────────────────────────────────────┘
```

---

## Make Offer Screen

```
┌────────────────────────────────────────┐
│        OFFER TO K. ANDERSON            │
├────────────────────────────────────────┤
│                                        │
│  SALARY                                │
│  Asking: $11M/year                     │
│  Your Offer: [$12M]  ▲ ▼               │
│                                        │
│  CONTRACT LENGTH                       │
│  Asking: 4 years                       │
│  Your Offer: [5 years] ▲ ▼             │
│                                        │
│  TOTAL VALUE: $60M                     │
│  Budget Impact: +$4M/yr over current   │
│                                        │
│  ─────────────────────────────────     │
│  INTEREST PROJECTION                   │
│  ─────────────────────────────────     │
│  Your Offer:        ████████░░ 82%     │
│  Best Competitor:   ██████░░░░ 65%     │
│                                        │
│  ✓ LIKELY TO ACCEPT                    │
│                                        │
│  [CANCEL]          [SUBMIT OFFER]      │
│                                        │
└────────────────────────────────────────┘
```

---

# APPENDIX: QUICK REFERENCE

## Salary Ranges

| Position | OVR 60-69 | OVR 75-79 | OVR 85-89 | OVR 95-99 |
|----------|-----------|-----------|-----------|-----------|
| HC | $1-2M | $4-6M | $8-10M | $12-15M |
| OC | $500K-1M | $1.5-2M | $3-4M | $4-6M |
| DC | $500K-1M | $1.5-2M | $3-4M | $4-6M |
| ST | $400-600K | $800K-1M | $1.5-2M | $2-3M |

## Key Formulas

```
Staff Budget = HC Salary + OC Salary + DC Salary + ST Salary

Coach Interest = (Salary × 0.3) + (Talent × 0.25) + (Facilities × 0.15) 
                 + (Security × 0.15) + (Market × 0.1) + (Fit × 0.05)

Halftime Adjustment = (Adaptability - 75) / 5 OVR swing potential
```

---

**Status:** Coaching Staff System Complete
**Scope:** All 4 coach positions, attributes, schemes, perks, salaries, generation, hiring
**Version:** 2.0
**Date:** December 2025
