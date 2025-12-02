# Facilities System

## Overview

Team facilities include **Stadium**, **Practice Facility**, **Training Room**, and **Weight Room**. Each facility has a quality rating (1-10 stars) that impacts player performance, development, injury prevention, fan experience, and revenue. Facilities can be upgraded over time using the Owner Budget.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-salarycap.md` | Salary cap is separate from facility spending |
| `FINAL-roster-generation-system.md` | Team tiers affect starting facilities |
| `coaching-staff-system.md` | Coach salaries come from owner budget |

---

# PART 1: OWNER BUDGET

## Salary Cap vs Owner Budget

Teams have **two separate financial pools**:

| Pool | Purpose | Source |
|------|---------|--------|
| **Salary Cap** | Player salaries only | League-mandated limit ($225M Year 1) |
| **Owner Budget** | Everything else | Team revenue + owner wealth |

### Owner Budget Uses

| Expense | Typical Cost |
|---------|--------------|
| Facility Upgrades | $5M - $2.5B |
| Facility Maintenance | $4M - $16M/year |
| Coaching Staff | $15M - $40M/year |
| Front Office Staff | $5M - $15M/year |
| Scouting Department | $5M - $12M/year |
| Player Amenities | $2M - $5M/year |

---

## Owner Budget by Team Tier

Starting owner budget varies by team wealth:

| Owner Tier | Annual Budget | Upgrade Fund | Flexibility |
|------------|---------------|--------------|-------------|
| Wealthy | $150M | $500M+ | Can build new stadium |
| Solid | $120M | $250-400M | Can do major renovations |
| Moderate | $90M | $100-200M | Incremental upgrades |
| Budget | $70M | $50-100M | Maintenance focus |
| Cheap | $50M | $25-50M | Minimal improvements |

### Owner Tier Distribution (32 Teams)

| Tier | Count | Notes |
|------|-------|-------|
| Wealthy | 4 | New money, aggressive spenders |
| Solid | 8 | Stable organizations |
| Moderate | 12 | Middle of the pack |
| Budget | 6 | Careful spenders |
| Cheap | 2 | Bare minimum investment |

---

## Annual Budget Breakdown

Typical allocation for a **Moderate Owner** ($90M budget):

| Category | Amount | % of Budget |
|----------|--------|-------------|
| Coaching Staff | $25M | 28% |
| Facility Maintenance | $8M | 9% |
| Scouting | $8M | 9% |
| Front Office | $10M | 11% |
| Player Amenities | $4M | 4% |
| **Discretionary** | $35M | 39% |

Discretionary funds can be used for:
- Facility upgrades
- Signing bonus cash (separate from cap)
- Special projects

---

## Revenue Impact on Budget

Facility investments affect future revenue, which increases owner budget:

| Stadium Quality | Annual Revenue | Budget Impact |
|-----------------|----------------|---------------|
| 10-star | $50M | +$15M to budget |
| 8-star | $35M | +$8M to budget |
| 6-star | $25M | +$3M to budget |
| 4-star | $18M | Baseline |
| 2-star | $12M | -$4M to budget |

**Virtuous Cycle:** Better facilities → more revenue → bigger budget → more upgrades

---

# PART 2: STARTING FACILITY RATINGS

## Facility Ratings by Team Tier

At franchise start, teams have facilities based on their quality tier:

### Elite Teams (3 teams)

| Facility | Rating | Notes |
|----------|--------|-------|
| Stadium | 9-10 | State-of-the-art |
| Practice Facility | 8-9 | Top-tier |
| Training Room | 8-10 | Cutting-edge medical |
| Weight Room | 8-9 | Professional grade |
| **Average** | 8.5-9.5 | League best |

### Good Teams (8 teams)

| Facility | Rating | Notes |
|----------|--------|-------|
| Stadium | 7-9 | Modern |
| Practice Facility | 7-8 | Quality |
| Training Room | 7-8 | Good care |
| Weight Room | 7-8 | Well-equipped |
| **Average** | 7-8 | Above average |

### Average Teams (12 teams)

| Facility | Rating | Notes |
|----------|--------|-------|
| Stadium | 5-7 | Functional |
| Practice Facility | 5-7 | Adequate |
| Training Room | 5-7 | Standard |
| Weight Room | 5-7 | Basic needs met |
| **Average** | 5-7 | Middle of pack |

### Below Average Teams (6 teams)

| Facility | Rating | Notes |
|----------|--------|-------|
| Stadium | 4-6 | Aging |
| Practice Facility | 4-5 | Outdated |
| Training Room | 4-6 | Basic |
| Weight Room | 4-5 | Limited |
| **Average** | 4-5.5 | Needs work |

### Rebuilding Teams (3 teams)

| Facility | Rating | Notes |
|----------|--------|-------|
| Stadium | 3-5 | Old or small market |
| Practice Facility | 3-4 | Bare minimum |
| Training Room | 3-5 | Basic care |
| Weight Room | 3-4 | Outdated |
| **Average** | 3-4.5 | Significant upgrades needed |

---

## Facility Rating Generation

```
function generateTeamFacilities(teamTier):
    ranges = FACILITY_RANGES[teamTier]
    
    stadium = random(ranges.stadium.min, ranges.stadium.max)
    practice = random(ranges.practice.min, ranges.practice.max)
    training = random(ranges.training.min, ranges.training.max)
    weight = random(ranges.weight.min, ranges.weight.max)
    
    // Add variance within team
    // Some teams have one standout facility
    if random() < 0.30:
        bestFacility = pickRandom([stadium, practice, training, weight])
        bestFacility += 1  // One facility is notably better
    
    // Some teams have one weak spot
    if random() < 0.25:
        worstFacility = pickRandom([stadium, practice, training, weight])
        worstFacility -= 1  // One facility lags behind
    
    return {
        stadium: clamp(stadium, 1, 10),
        practice: clamp(practice, 1, 10),
        training: clamp(training, 1, 10),
        weight: clamp(weight, 1, 10)
    }
```

---

# PART 3: FACILITY TYPES

## 1. STADIUM

### Primary Functions
- Home field advantage
- Fan experience and attendance
- Revenue generation
- Team morale
- Weather impact

### Stadium Attributes

#### Overall Quality (1-10 Stars)

| Rating | Tier | Description |
|--------|------|-------------|
| 10 | Elite | New, state-of-the-art |
| 8-9 | Great | Modern amenities |
| 6-7 | Good | Solid facility |
| 4-5 | Average | Aging but functional |
| 2-3 | Poor | Needs renovation |
| 1 | Very Poor | Outdated, falling apart |

#### Capacity
- **Range:** 55,000 - 85,000 seats
- Larger = more revenue potential, but harder to fill
- Sweet spot: 65,000-72,000

#### Surface Type

| Type | Injury Impact | Home Advantage | Maintenance |
|------|---------------|----------------|-------------|
| Grass (Natural) | +2 injury rating | +5% HFA | Higher cost |
| Turf (Artificial) | -2 injury rating | Neutral | Lower cost |

#### Dome vs Open Air

| Type | Weather | Revenue | Home Advantage |
|------|---------|---------|----------------|
| Dome/Retractable | No impact | +$2M/year | +3% |
| Open Air | Affects games | Standard | Weather bonus possible |

#### Weather Effects (Open Air Only)

| Climate | Effect |
|---------|--------|
| Cold Weather (North) | -3 to visiting team in cold/snow |
| Hot Weather (South) | -2 to visiting team stamina |
| Neutral | No bonus |

#### Noise Level (1-10)

| Level | Home Field Advantage |
|-------|---------------------|
| 10 | +5 OVR (deafening) |
| 8-9 | +4 OVR (very loud) |
| 6-7 | +3 OVR (loud) |
| 4-5 | +2 OVR (moderate) |
| 1-3 | +1 OVR (quiet) |

#### Luxury Suites

| Suites | Revenue Impact |
|--------|----------------|
| 150+ | +$8M/season |
| 100-149 | +$5M/season |
| 75-99 | +$3M/season |
| 50-74 | +$1M/season |

---

### Stadium Impact Summary

| Quality | Home OVR | Attendance | Revenue | Morale |
|---------|----------|------------|---------|--------|
| 10-star | +6 | 100% | $50M | +5% |
| 8-star | +5 | 95% | $35M | +3% |
| 6-star | +4 | 85% | $25M | +1% |
| 4-star | +3 | 75% | $18M | 0% |
| 2-star | +2 | 60% | $12M | -5% |

---

### Stadium Upgrades

| Upgrade | Cost | Time | Effect |
|---------|------|------|--------|
| Surface Change | $15M | 1 offseason | Grass ↔ Turf |
| Roof Installation | $200M | 2 offseasons | Weather immunity, +$2M revenue |
| Capacity +5,000 | $50M | 1 offseason | +$3M revenue |
| +25 Luxury Suites | $30M | 1 offseason | +$2M revenue |
| Full Renovation | $500M-$1B | 2-3 offseasons | Upgrade to 10-star |
| New Stadium | $1.5B-$2.5B | 3-4 offseasons | Brand new 10-star |

---

## 2. PRACTICE FACILITY

### Primary Functions
- Player development
- Scheme installation
- Injury prevention
- Coach effectiveness
- Player satisfaction

### Practice Facility Attributes

| Component | Range | Effect |
|-----------|-------|--------|
| Practice Fields | 2-6 | +5-25% practice efficiency |
| Film Room Tech | 1-10 | +0-50% mental XP |
| Meeting Rooms | 5-15 | +0-10% scheme learning |
| Indoor Facility | Yes/No | +15% efficiency, weather immunity |

---

### Practice Facility Impact

| Quality | XP Gain | Injury Prevention | Scheme Install |
|---------|---------|-------------------|----------------|
| 10-star | +30% | -20% injuries | 2 games |
| 8-star | +20% | -15% injuries | 3 games |
| 6-star | +12% | -10% injuries | 4 games |
| 4-star | +5% | -5% injuries | 5 games |
| 2-star | 0% | 0% | 6 games |

### Practice Facility Upgrades

| Upgrade | Cost | Time | Effect |
|---------|------|------|--------|
| Additional Field | $10M | 1 offseason | +5% efficiency |
| Indoor Facility | $75M | 1-2 offseasons | Weather immunity, +15% |
| Film Room Upgrade | $5M | 1 offseason | +10% mental XP |
| Full Renovation | $150M | 2 offseasons | Upgrade to 10-star |

---

## 3. TRAINING ROOM (Medical Facility)

### Primary Functions
- Injury treatment and recovery
- Injury prevention
- Player health monitoring
- Career longevity
- Return-to-play protocols

### Training Room Attributes

| Component | Effect |
|-----------|--------|
| Medical Equipment | Diagnosis speed |
| Treatment Rooms | Capacity (5-20) |
| Therapy Pool | +15% soft tissue recovery |
| Sports Science Lab | -10% injury chance |

---

### Training Room Impact

| Quality | Recovery Speed | Injury Rate | Severity Reduction | Longevity |
|---------|----------------|-------------|-------------------|-----------|
| 10-star | -40% time | -25% | Major → Moderate | +2 years |
| 8-star | -30% time | -18% | 50% chance | +1.5 years |
| 6-star | -20% time | -12% | 25% chance | +1 year |
| 4-star | -10% time | -6% | 10% chance | +0.5 years |
| 2-star | 0% | 0% | None | 0 |

### Training Room Upgrades

| Upgrade | Cost | Time | Effect |
|---------|------|------|--------|
| Equipment Upgrade | $8M | 1 offseason | +2 stars |
| Therapy Pool | $5M | 1 offseason | +15% soft tissue recovery |
| Sports Science Lab | $12M | 1 offseason | -10% injury chance |
| +10 Treatment Rooms | $10M | 1 offseason | Increased capacity |
| Full Medical Center | $50M | 1-2 offseasons | Upgrade to 10-star |

---

## 4. WEIGHT ROOM (Strength & Conditioning)

### Primary Functions
- Physical attribute development
- Strength and speed training
- Stamina and endurance
- Injury prevention (stronger bodies)
- Age regression delay

### Weight Room Attributes

| Component | Range | Effect |
|-----------|-------|--------|
| Equipment Quality | 1-10 | Training effectiveness |
| Space | 5,000-20,000 sq ft | Team capacity |
| Cardio Machines | 20-50 | +5-25% stamina XP |
| Speed/Agility Area | 30-100 yards | +5-30% speed/agility XP |
| Recovery Equipment | None/Some/Full | +0-20% workout recovery |

---

### Weight Room Impact

| Quality | Physical XP | Strength/Season | Speed/Season | Injury Prevention | Age Delay |
|---------|-------------|-----------------|--------------|-------------------|-----------|
| 10-star | +40% | +2.0 | +1.5 | -15% | -30% decline |
| 8-star | +30% | +1.5 | +1.0 | -10% | -20% decline |
| 6-star | +20% | +1.0 | +0.7 | -7% | -12% decline |
| 4-star | +10% | +0.5 | +0.4 | -4% | -6% decline |
| 2-star | 0% | +0.2 | +0.2 | 0% | Normal |

### Weight Room Upgrades

| Upgrade | Cost | Time | Effect |
|---------|------|------|--------|
| Equipment Upgrade | $5M | 1 offseason | +2 stars |
| Expand +5,000 sq ft | $15M | 1 offseason | Team capacity |
| Speed/Agility Area | $3M | 1 offseason | +20% speed XP |
| Recovery Equipment | $4M | 1 offseason | +15% workout recovery |
| Technology Integration | $6M | 1 offseason | +10% efficiency |
| Complete Renovation | $40M | 1-2 offseasons | Upgrade to 10-star |

---

# PART 4: FINANCING & CONSTRUCTION

## Financing Options

Major facility projects can be financed rather than paid upfront:

### Cash Payment
- **Discount:** 0% (full price)
- **Best For:** Wealthy owners, small projects

### Owner Financing (5-Year Loan)
- **Interest:** 4% annual
- **Structure:** Equal payments over 5 years
- **Example:** $200M project = $44M/year for 5 years ($220M total)

### Stadium Bonds (15-Year Loan)
- **Interest:** 3% annual
- **Structure:** Equal payments over 15 years
- **Example:** $1.5B stadium = $115M/year for 15 years ($1.725B total)
- **Restriction:** Stadium projects only

### Public Funding Partnership
- **City Contribution:** 20-50% of stadium cost
- **Requirements:** Commitment to stay in city 20+ years
- **Naming Rights:** City may retain partial control
- **Example:** $2B stadium, city pays $600M (30%), team pays $1.4B

---

## Financing Impact on Budget

Active loans reduce available owner budget:

| Loan Payment | Budget Impact |
|--------------|---------------|
| $0-10M/year | Minimal impact |
| $10-25M/year | Moderate squeeze |
| $25-50M/year | Significant constraint |
| $50M+/year | Major austerity |

---

## Construction Timeline

### Standard Timeline by Project

| Project | Time | Notes |
|---------|------|-------|
| Equipment Upgrade | 1 offseason | Immediate impact |
| Minor Addition | 1 offseason | Quick turnaround |
| Indoor Facility | 1-2 offseasons | Weather dependent |
| Full Renovation | 2 offseasons | Phased approach |
| Major Renovation | 2-3 offseasons | Extensive work |
| New Stadium | 3-4 offseasons | Massive project |

### Construction Phases

**New Stadium (4-year project):**

| Year | Phase | Status |
|------|-------|--------|
| Year 1 | Planning & Groundbreaking | Old stadium in use |
| Year 2 | Foundation & Structure | Old stadium in use |
| Year 3 | Interior & Systems | Old stadium in use |
| Year 4 | Finishing & Move-in | New stadium opens |

---

## Construction Delays

Major projects have risk of delays:

### Delay Probability

| Project Size | Delay Chance | Typical Delay |
|--------------|--------------|---------------|
| Minor (<$25M) | 5% | 1-2 months |
| Medium ($25-100M) | 15% | 2-4 months |
| Major ($100-500M) | 25% | 3-6 months |
| Mega (>$500M) | 40% | 6-12 months |

### Delay Causes

| Cause | Frequency | Impact |
|-------|-----------|--------|
| Weather | Common | 1-3 months |
| Supply Chain | Moderate | 2-4 months |
| Labor Issues | Rare | 3-6 months |
| Design Changes | Moderate | 1-4 months |
| Permit Problems | Rare | 2-6 months |

### Delay Consequences

| Consequence | Effect |
|-------------|--------|
| Extended Timeline | Project takes longer |
| Cost Overrun | +5-15% additional cost |
| Temporary Facilities | May need interim solutions |
| Missed Season | Open mid-season instead of Week 1 |

### Delay Mitigation

| Action | Cost | Effect |
|--------|------|--------|
| Rush Order | +10% project cost | -50% delay chance |
| Weather Insurance | +2% project cost | Covers weather delays |
| Contingency Fund | +10% budget reserve | Covers overruns |

---

## Construction Risk Example

**New Stadium: $2B Budget**

| Item | Amount |
|------|--------|
| Base Cost | $2.0B |
| Delay Risk (40% × $200M avg overrun) | +$80M expected |
| Contingency Fund (10%) | +$200M |
| Rush Order Premium | +$200M (optional) |
| **Total Realistic Budget** | $2.28B - $2.48B |

---

# PART 5: FACILITY SYNERGIES

## Synergy Bonuses

| Condition | Bonus |
|-----------|-------|
| All 4 facilities at 10-star | +5% to all effects, +20% FA appeal |
| 3 facilities at 10-star | +3% to all effects, +12% FA appeal |
| 2 facilities at 10-star | +2% to all effects, +7% FA appeal |
| All facilities below 3-star | -5% to all effects, -15% FA appeal |

---

## Annual Maintenance Costs

| Facility Quality | Annual Cost |
|------------------|-------------|
| 10-star | $5M |
| 8-star | $3M |
| 6-star | $2M |
| 4-star | $1M |
| 2-star | $500K |

**Total for all 4 facilities at 10-star:** $20M/year

### Maintenance Neglect

If maintenance is skipped:
- **Year 1:** Warning, -1 effectiveness
- **Year 2:** -1 star rating, -2 effectiveness
- **Year 3:** -2 star rating, major repairs needed (+50% cost)

---

# PART 6: STRATEGIC DECISIONS

## Investment Priority by Team Strategy

### Win-Now Team
1. **Training Room** — Keep stars healthy
2. **Stadium** — Home field advantage
3. **Weight Room** — Maintain veterans
4. **Practice Facility** — Least urgent

### Rebuilding Team
1. **Practice Facility** — Develop young players
2. **Weight Room** — Build physical attributes
3. **Training Room** — Protect investment
4. **Stadium** — Upgrade when competitive

### Balanced Team
1. Bring all facilities to 6-7 stars first
2. Then push to 8-9 stars evenly
3. Elite facilities last (expensive)

---

## Free Agency Impact

### Pitch Points by Facility

| Rating | Points per Facility |
|--------|---------------------|
| 10-star | +15 |
| 8-star | +10 |
| 6-star | +5 |
| 4-star | 0 |
| 2-star | -5 |

**Maximum:** +60 points (all elite)

### League Facility Rankings

| Rank | FA Appeal |
|------|-----------|
| Top 3 | +15% |
| Top 6 | +8% |
| Top 9 | 0% |
| Bottom 3 | -12% |

---

## Facility Tours

- Invite draft prospects or free agents
- Elite facilities impress: +5-20% signing chance
- Poor facilities hurt: -5-15% signing chance

---

## Facility Aging

- Degrade **-0.5 stars per 10 years** without major renovation
- Annual maintenance prevents degradation
- Historic venues get **+2 home field advantage** (tradition bonus)

---

# PART 7: UI MOCKUPS

## Facilities Overview Screen

```
┌────────────────────────────────────────┐
│  ← Back      FACILITIES                │
├────────────────────────────────────────┤
│                                        │
│  OWNER BUDGET: $95M remaining          │
│  Loans: $22M/year (Stadium bond)       │
│                                        │
│  STADIUM                               │
│  ★★★★★★★★ (8/10)                       │
│  Capacity: 68,000 • Grass • Dome       │
│  Home Advantage: +5 OVR                │
│  Revenue: $35M/season                  │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  PRACTICE FACILITY                     │
│  ★★★★★★ (6/10)                         │
│  4 Fields • Indoor Facility            │
│  Player Dev: +12% XP                   │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  TRAINING ROOM                         │
│  ★★★★★★★ (7/10)                        │
│  Recovery: -20% time                   │
│  Injury Rate: -12%                     │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  WEIGHT ROOM                           │
│  ★★★★★★★★★ (9/10)                      │
│  Physical Dev: +35% XP                 │
│  Strength Gains: +1.8/season           │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  OVERALL: 7.5/10                       │
│  Free Agent Appeal: +10%               │
│  League Rank: #8                       │
└────────────────────────────────────────┘
```

---

## Financing Selection Screen

```
┌────────────────────────────────────────┐
│       NEW STADIUM - FINANCING          │
├────────────────────────────────────────┤
│                                        │
│  Project Cost: $2,000,000,000          │
│                                        │
│  SELECT PAYMENT METHOD:                │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ CASH PAYMENT                   │    │
│  │ Pay: $2.0B now                 │    │
│  │ Total Cost: $2.0B              │    │
│  │ Available: $520M  ❌ INSUFFICIENT│    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ STADIUM BONDS (15 years) ✓     │    │
│  │ Pay: $115M/year                │    │
│  │ Total Cost: $1.725B            │    │
│  │ Interest: 3%                   │    │
│  │ [SELECT]                       │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ PUBLIC PARTNERSHIP             │    │
│  │ City Pays: $600M (30%)         │    │
│  │ Team Pays: $1.4B               │    │
│  │ Requirement: 20-year commit    │    │
│  │ [NEGOTIATE]                    │    │
│  └────────────────────────────────┘    │
│                                        │
│  [CANCEL]                              │
└────────────────────────────────────────┘
```

---

## Construction Progress Screen

```
┌────────────────────────────────────────┐
│       STADIUM CONSTRUCTION             │
├────────────────────────────────────────┤
│                                        │
│  NEW OUTLAWS STADIUM                   │
│  Status: UNDER CONSTRUCTION            │
│                                        │
│  ████████████░░░░░░░░ 58%              │
│                                        │
│  Phase: Interior & Systems             │
│  Time Remaining: 18 months             │
│  Expected Opening: Year 4, Week 1      │
│                                        │
│  BUDGET                                │
│  Original: $2,000M                     │
│  Current:  $2,085M (+4.25%)            │
│  Overrun:  Weather delays              │
│                                        │
│  PAYMENTS                              │
│  Paid to Date: $1,210M                 │
│  Remaining: $875M                      │
│  Next Payment: $115M (Year 3)          │
│                                        │
│  ⚠️ ALERT: 2-month weather delay       │
│  New opening: Year 4, Week 3           │
│                                        │
│  [VIEW DETAILS]                        │
└────────────────────────────────────────┘
```

---

# APPENDIX: QUICK REFERENCE

## Total Investment for All Elite

| Facility | Cost | Annual Maintenance |
|----------|------|-------------------|
| Stadium (new) | $1.5B - $2.5B | $5M |
| Practice Facility | $150M | $5M |
| Training Room | $50M | $5M |
| Weight Room | $40M | $5M |
| **Total** | $1.74B - $2.74B | $20M/year |

## ROI Calculation

| Benefit | Annual Value |
|---------|--------------|
| Elite Stadium Revenue | +$32M (vs average) |
| Injury Cost Savings | ~$10M |
| Development Acceleration | ~$8M (player value) |
| FA Signing Advantage | ~$10M (avoid overpay) |
| **Total Annual Benefit** | ~$60M |

**Payback Period:** 29-46 years (long-term investment)

---

**Status:** Facilities System Complete
**Scope:** All 4 facility types, owner budget, starting ratings, financing, construction
**Version:** 2.0
**Date:** December 2025
