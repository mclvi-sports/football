# Training & Development System

## Overview

The Training & Development System governs how players improve (or decline) over time. Players earn **XP** through games, practices, and special events, then spend XP to improve attributes and unlock badges. Development is modified by facilities, coaching staff, GM skills, and player traits.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-season-calendar-system.md` | Training timing, XP periods |
| `FINAL-facilities-system.md` | Training Room & Weight Room bonuses |
| `FINAL-gm-skills-perks-system.md` | Category 4 Player Development perks |
| `FINAL-coaching-staff-system.md` | Position coach bonuses |
| `FINAL-badge-system.md` | Badge XP costs and progression |
| `FINAL-traits-system.md` | Development-affecting traits |
| `FINAL-player-generation-system.md` | Starting attributes and potential |

---

# PART 1: XP EARNING SYSTEM

## XP Sources Overview

| Source | When | Base XP | Notes |
|--------|------|---------|-------|
| Game Played | Each game | 50 | All rostered players |
| Win Bonus | Each win | +25 | Stacks with base |
| Performance Bonus | Each game | +10 to +100 | Based on game grade |
| Weekly Practice | Wed-Fri | 30-60 | Based on focus |
| Bye Week Practice | Bye week | +50% | Bonus to practice XP |
| Training Camp | Weeks 13-15 | 200-400 | Offseason intensive |
| Offseason Program | Weeks 1-12 | 100-200 | Voluntary workouts |
| Pro Bowl Selection | End of season | 500 | One-time bonus |
| All-Pro Selection | End of season | 750 | One-time bonus |
| Weekly Award | Per award | 200 | Player of Week |
| MVP Award | End of season | 1,000 | Season award |

---

## Game Performance XP

### Performance Grade Bonuses

| Game Grade | XP Bonus | Description |
|------------|----------|-------------|
| 90-100 | +100 | Elite performance |
| 85-89 | +75 | Excellent |
| 80-84 | +50 | Very Good |
| 75-79 | +35 | Good |
| 70-74 | +20 | Average |
| 65-69 | +10 | Below Average |
| <65 | +0 | Poor |

### Position-Specific Performance Metrics

| Position | Key Stats for Grade |
|----------|---------------------|
| QB | Passer rating, completion %, TDs, INTs |
| RB | Yards, YPC, TDs, fumbles |
| WR/TE | Receptions, yards, TDs, drops |
| OL | Sacks allowed, pancakes, penalties |
| DL | Tackles, sacks, TFLs, pressures |
| LB | Tackles, sacks, coverage grade |
| DB | INTs, PDs, completion % allowed |
| K | FG %, XP %, longest make |
| P | Average distance, inside 20 |

---

## Weekly Practice XP

### Practice Focus Options

| Focus | Affected Positions | Base XP |
|-------|-------------------|---------|
| Passing Game | QB, WR, TE | 50 |
| Running Game | RB, OL | 50 |
| Pass Rush | DL, OLB | 50 |
| Coverage | DB, LB | 50 |
| Red Zone Offense | QB, WR, TE, RB | 45 |
| Red Zone Defense | All Defense | 45 |
| Special Teams | K, P | 50 |
| Conditioning | All Players | 30 |
| Film Study | All Players | 40 (Mental only) |
| Light/Recovery | All Players | 20 |

### Practice Intensity Modifiers

| Intensity | XP Modifier | Injury Risk |
|-----------|-------------|-------------|
| High | +50% | +15% injury chance |
| Normal | 0% | Normal |
| Light | -30% | -50% injury chance |
| Rest | -100% | No injury risk |

---

## Training Camp XP (Weeks 13-15)

### Daily Schedule

| Day | Activity | XP |
|-----|----------|-----|
| Morning | Position drills | 30 |
| Afternoon | Team practice | 40 |
| Evening | Film study | 20 |
| **Daily Total** | | 90 |

### Weekly Totals (6 practice days)

| Week | Focus | Total XP |
|------|-------|----------|
| Week 13 | Conditioning | 400-500 |
| Week 14 | Installation | 350-450 |
| Week 15 | Preparation | 300-400 |
| **Camp Total** | | 1,050-1,350 |

### Rookie Bonus

- Rookies earn **+25% XP** during training camp
- First-time starters earn **+15% XP**

---

## Offseason Program XP (Weeks 1-12)

### Voluntary Workouts

| Participation | Weekly XP | Season Total |
|---------------|-----------|--------------|
| Full (5 days) | 40 | 480 |
| Partial (3 days) | 25 | 300 |
| Minimal (1 day) | 10 | 120 |
| None | 0 | 0 |

### Participation Factors

| Factor | Likelihood |
|--------|------------|
| Young players (21-25) | 90% full participation |
| Prime players (26-30) | 70% full participation |
| Veterans (31+) | 50% full participation |
| Gym Rat trait | 100% full participation |
| Team Leader trait | 85% full participation |
| Lazy trait | 20% full participation |

---

## Bye Week XP

### Enhanced Practice Week

| Activity | Normal XP | Bye Week XP |
|----------|-----------|-------------|
| Practice | 50 | 75 (+50%) |
| Film Study | 40 | 60 (+50%) |
| Extra Sessions | 0 | 30 |
| **Total** | 90 | 165 |

### Recovery Option

- Can choose **Recovery Focus** instead
- 0 XP gain but:
  - All minor injuries heal
  - Fatigue reset to 0
  - +5% attribute boost next game

---

# PART 2: ATTRIBUTE PROGRESSION

## XP Cost Formula

### Base Cost per Attribute Point

```
Cost = BaseCost * (1 + (CurrentValue - 60) * 0.05) * PositionModifier * AgeModifier
```

### Base Costs by Attribute Category

| Category | Base Cost | Notes |
|----------|-----------|-------|
| Physical (SPD, ACC, AGI, STR) | 150 | Harder to improve |
| Technical (Position-specific) | 100 | Standard |
| Mental (AWR, PRC) | 75 | Easiest to improve |
| Durability (STA, INJ) | 125 | Moderate |

### Position Modifier

Players improve position-relevant attributes more efficiently:

| Relevance | Modifier | Example |
|-----------|----------|---------|
| Primary | 0.8x | QB improving THP |
| Secondary | 1.0x | QB improving SPD |
| Tertiary | 1.3x | QB improving TAK |

---

## Age-Based Development

### Development Windows

| Age Range | Physical | Technical | Mental | Overall |
|-----------|----------|-----------|--------|---------|
| 21-22 | +3/year | +2/year | +1/year | Growing |
| 23-24 | +2/year | +2/year | +2/year | Developing |
| 25-27 | +1/year | +1/year | +2/year | Prime |
| 28-29 | 0/year | +1/year | +1/year | Maintaining |
| 30-32 | -1/year | 0/year | +1/year | Early Decline |
| 33-35 | -2/year | -1/year | 0/year | Declining |
| 36+ | -3/year | -2/year | -1/year | Steep Decline |

### Age Modifier for XP Costs

| Age | XP Cost Modifier |
|-----|------------------|
| 21-24 | 0.8x (cheaper) |
| 25-27 | 1.0x (standard) |
| 28-30 | 1.2x (more expensive) |
| 31-33 | 1.5x |
| 34+ | 2.0x |

---

## Potential Ceiling

### Potential Tiers

| Tier | Max OVR | Rarity |
|------|---------|--------|
| Superstar | 95-99 | 5% |
| Star | 88-94 | 15% |
| Starter | 80-87 | 35% |
| Backup | 72-79 | 30% |
| Bust | 65-71 | 15% |

### Ceiling Enforcement

- **Soft Cap:** At 90% of potential, XP costs +50%
- **Hard Cap:** At 100% of potential, cannot improve further
- **Overachiever Trait:** Can exceed potential by +3 OVR

### Potential Revelation

| Source | Accuracy |
|--------|----------|
| Generation | Exact (hidden from player) |
| Scout Report | ±5 OVR |
| 1 Season Played | ±3 OVR |
| 3 Seasons Played | ±1 OVR |
| 5+ Seasons | Exact |

---

## Automatic Progression (AI Teams)

### AI Development Formula

```
YearlyGrowth = BaseDevelopment * PotentialMod * AgeMod * FacilityMod * Random(0.8, 1.2)
```

### Base Development by Role

| Role | Base Development |
|------|------------------|
| Starter | +2 OVR/year |
| Backup | +1 OVR/year |
| Practice Squad | +0.5 OVR/year |

### Development Caps

- Cannot exceed potential
- Age decline still applies
- Max +5 OVR per season

---

# PART 3: DEVELOPMENT MODIFIERS

## Facility Bonuses

### Training Room Impact

| Quality | XP Bonus | Recovery Bonus |
|---------|----------|----------------|
| 10-star | +30% | -40% injury time |
| 8-star | +20% | -30% injury time |
| 6-star | +12% | -20% injury time |
| 4-star | +5% | -10% injury time |
| 2-star | 0% | 0% |

### Weight Room Impact

| Quality | Physical XP | Strength/Season | Speed/Season |
|---------|-------------|-----------------|--------------|
| 10-star | +40% | +2.0 | +1.5 |
| 8-star | +30% | +1.5 | +1.0 |
| 6-star | +20% | +1.0 | +0.7 |
| 4-star | +10% | +0.5 | +0.4 |
| 2-star | 0% | +0.2 | +0.2 |

### Practice Facility Impact

| Quality | Practice XP | Scheme Learning |
|---------|-------------|-----------------|
| 10-star | +30% | 2 games |
| 8-star | +20% | 3 games |
| 6-star | +12% | 4 games |
| 4-star | +5% | 5 games |
| 2-star | 0% | 6 games |

---

## Coaching Staff Bonuses

### Position Coach Impact

| Coach OVR | XP Bonus | Max Improvement |
|-----------|----------|-----------------|
| 95-99 | +25% | +4 OVR/year |
| 90-94 | +20% | +3 OVR/year |
| 85-89 | +15% | +3 OVR/year |
| 80-84 | +10% | +2 OVR/year |
| 75-79 | +5% | +2 OVR/year |
| 70-74 | 0% | +1 OVR/year |
| <70 | -5% | +1 OVR/year |

### Coordinator Impact

| Coordinator OVR | Side XP Bonus |
|-----------------|---------------|
| 95-99 | +15% (all offense/defense) |
| 90-94 | +12% |
| 85-89 | +8% |
| 80-84 | +5% |
| <80 | 0% |

### Scheme Fit Bonus

| Fit Level | XP Bonus |
|-----------|----------|
| Perfect Fit | +15% |
| Good Fit | +8% |
| Neutral | 0% |
| Poor Fit | -10% |
| Scheme Mismatch | -20% |

---

## GM Skill Bonuses

### Category 4: Player Development Skills

| Skill | Tier | Effect |
|-------|------|--------|
| Coach's Favorite | Bronze | Pick 2 players for +25% XP |
| Coach's Favorite | Silver | Pick 3 players for +50% XP |
| Coach's Favorite | Gold | Pick 5 players for +100% XP |
| Training Boost | Bronze | All under 25: +1 dev speed |
| Training Boost | Silver | All under 25: +2 dev speed |
| Training Boost | Gold | All under 27: +3 dev speed |
| Veteran Mentor | Bronze | 30+ decline 25% slower |
| Veteran Mentor | Silver | 30+ decline 50% slower |
| Veteran Mentor | Gold | 30+ no decline until 33 |
| Position Coach | Bronze | +15% XP for position group |
| Position Coach | Silver | +25% XP for position group |
| Position Coach | Gold | +40% XP for position group |
| Scheme Fit Master | Bronze | Adapt 25% faster |
| Scheme Fit Master | Silver | Adapt 50% faster |
| Scheme Fit Master | Gold | Instant adapt, +2 OVR scheme fit |

---

## Trait Effects on Development

### Positive Traits

| Trait | Effect |
|-------|--------|
| Gym Rat | +20% physical XP, always attends workouts |
| Quick Learner | +15% all XP |
| Film Junkie | +25% mental XP |
| Team Leader | +10% team XP when on roster |
| High Motor | +10% practice XP |
| Focused | +5% XP, no distractions |

### Negative Traits

| Trait | Effect |
|-------|--------|
| Lazy | -20% practice XP, 50% workout attendance |
| Slow Learner | -15% all XP |
| Unfocused | -10% XP, scheme learning +2 games |
| Party Animal | -15% XP during season |
| Injury Prone | -10% training camp XP (extra rest needed) |

---

# PART 4: BADGE PROGRESSION

## Badge XP Costs

| Tier | Cost | Cumulative |
|------|------|------------|
| Bronze | 500 | 500 |
| Silver | 1,500 | 2,000 |
| Gold | 3,500 | 5,500 |
| Hall of Fame | 8,000 | 13,500 |

## Badge Slots by OVR

| OVR Range | Slots |
|-----------|-------|
| 60-69 | 2 |
| 70-74 | 3 |
| 75-79 | 4 |
| 80-84 | 5 |
| 85-99 | 6 |

## Badge Unlock Priority

Players can only unlock badges appropriate for their position:

| Position | Unlockable Badges |
|----------|------------------|
| QB | Universal + QB badges (8 total) |
| RB | Universal + RB badges (8 total) |
| WR | Universal + WR badges (8 total) |
| TE | Universal + TE badges (7 total) |
| OL | Universal + OL badges (7 total) |
| DL | Universal + DL badges (7 total) |
| LB | Universal + LB badges (7 total) |
| DB | Universal + DB badges (8 total) |
| K | Universal + K badges (7 total) |
| P | Universal + P badges (6 total) |

---

# PART 5: SPECIAL TRAINING MODES

## Position Change Training

### Viable Position Changes

| From | To | Training Time | OVR Loss |
|------|-----|---------------|----------|
| QB | WR | 1 offseason | -5 |
| RB | WR | 1 offseason | -3 |
| WR | CB | 1 offseason | -4 |
| TE | DE | 1 offseason | -5 |
| OLB | DE | 1 offseason | -2 |
| CB | FS/SS | 1 offseason | -1 |
| FS | SS | Immediate | -1 |
| DE | OLB | 1 offseason | -3 |

### Position Change Process

1. Declare position change (offseason only)
2. Training camp focused on new position
3. All non-transferrable badges locked
4. New position-specific badges available
5. OVR recalculated for new position

---

## Injury Rehab Training

### Rehab Focus

| Injury Type | Focus | Effect |
|-------------|-------|--------|
| Soft Tissue | Conditioning | -20% recovery time |
| Bone/Joint | Strength | Normal recovery, +5% STR |
| Concussion | Mental | Normal recovery, +5 AWR |

### Return-to-Play Protocol

| Phase | Duration | Activity |
|-------|----------|----------|
| 1: Rest | Varies | No training XP |
| 2: Light | 1-2 weeks | 25% XP |
| 3: Moderate | 1 week | 50% XP |
| 4: Full | Cleared | 100% XP |

---

## Focus Training (Special Assignment)

### Single Attribute Focus

- **Cost:** Sacrifice 50% of weekly XP
- **Benefit:** +100% XP to one attribute
- **Limit:** One attribute per week
- **Best For:** Addressing specific weaknesses

### Example

```
Normal week: 50 XP to all attributes
Focus week: 25 XP to all, 100 XP to SPD
```

---

# PART 6: XP ECONOMY BALANCE

## Expected XP Per Season

### By Role

| Role | Regular Season | Playoffs | Total |
|------|----------------|----------|-------|
| Franchise Star | 2,500-3,500 | 500-800 | 3,000-4,300 |
| Starter | 1,800-2,500 | 300-500 | 2,100-3,000 |
| Backup | 800-1,200 | 100-200 | 900-1,400 |
| Practice Squad | 400-600 | 0 | 400-600 |

### Yearly Breakdown (Starter)

| Source | XP |
|--------|-----|
| Games (17 × 50) | 850 |
| Wins (10 × 25) | 250 |
| Performance (avg 35/game) | 595 |
| Practice (18 weeks × 50) | 900 |
| Training Camp | 400 |
| Offseason Program | 300 |
| **Total** | 3,295 |

---

## Attribute Improvement Rates

### Cost Examples (Starting at 75)

| Attribute | Base Cost | With Bonuses (30%) | Points Affordable |
|-----------|-----------|-------------------|-------------------|
| Physical | 188 | 131 | 25 points/season |
| Technical | 125 | 88 | 37 points/season |
| Mental | 94 | 66 | 50 points/season |

### Realistic Yearly Growth

| Age | XP Available | Points Improvable | OVR Change |
|-----|--------------|-------------------|------------|
| 22 | 3,000 | 30-40 | +2 to +4 |
| 25 | 3,000 | 25-35 | +1 to +3 |
| 28 | 2,500 | 15-25 | +0 to +2 |
| 32 | 2,000 | 10-15 | -1 to +1 |

---

## Badge Progression Timeline

### Realistic Badge Development

| Career Stage | Expected Badges |
|--------------|-----------------|
| Rookie | 0-1 Bronze |
| Year 2-3 | 1-2 Bronze, 0-1 Silver |
| Year 4-6 | 2-3 Silver, 0-1 Gold |
| Year 7-10 | 2-3 Gold, 0-1 HoF |
| Elite Veteran | 2-3 Gold, 1-2 HoF |

---

# PART 7: UI SPECIFICATIONS

## Training Dashboard Layout

```
┌────────────────────────────────────────────────┐
│  ← Back          TRAINING           Week 8     │
├────────────────────────────────────────────────┤
│                                                │
│  TEAM XP POOL: 45,230                          │
│  Average Player XP: 852                        │
│                                                │
│  THIS WEEK'S PRACTICE FOCUS:                   │
│  ┌────────────────────────────────────────┐   │
│  │  ○ Passing Game  ○ Running Game        │   │
│  │  ● Pass Rush     ○ Coverage            │   │
│  │  ○ Red Zone      ○ Special Teams       │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  PLAYER DEVELOPMENT                            │
│  ─────────────────────────────────────────    │
│                                                │
│  J. Smith (QB) - 87 OVR                       │
│  XP: 2,450  Potential: 94  Age: 25            │
│  ████████████░░░░░░░░ 65% to next upgrade     │
│  [VIEW] [TRAIN]                               │
│                                                │
│  K. Jones (RB) - 82 OVR                       │
│  XP: 1,890  Potential: 88  Age: 23            │
│  ██████████████░░░░░░ 72% to next upgrade     │
│  [VIEW] [TRAIN]                               │
│                                                │
│  [SORT: OVR ▼] [FILTER: ALL POSITIONS]       │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Player Development Card

```
┌────────────────────────────────────────────────┐
│  J. SMITH - QB                                 │
│  87 OVR  |  Age: 25  |  Potential: 94         │
├────────────────────────────────────────────────┤
│                                                │
│  XP AVAILABLE: 2,450                           │
│                                                │
│  ATTRIBUTES                                    │
│  ──────────────────────────────────────────   │
│  THP: 88  [+1 for 145 XP]                     │
│  SAC: 85  [+1 for 120 XP]                     │
│  MAC: 86  [+1 for 125 XP]                     │
│  DAC: 82  [+1 for 115 XP]                     │
│  AWR: 84  [+1 for 90 XP]                      │
│  SPD: 78  [+1 for 170 XP]  ⚠️ Non-primary     │
│                                                │
│  BADGES (4/6 slots)                           │
│  ──────────────────────────────────────────   │
│  🎯 Clutch (Silver) - [Upgrade: 3,500 XP]     │
│  🎯 Red Zone QB (Bronze) - [Upgrade: 1,500]   │
│  ⭐ Prime Time (Bronze) - [Upgrade: 1,500]    │
│  🛡️ Pocket Presence (Bronze)                  │
│  [ ] Empty Slot - [Browse Badges]             │
│  [ ] Empty Slot - [Browse Badges]             │
│                                                │
│  MODIFIERS ACTIVE:                            │
│  +20% XP (Training Room 8★)                   │
│  +15% XP (OC 88 OVR)                          │
│  +25% XP (Coach's Favorite - Bronze)          │
│                                                │
│  [CLOSE]                                       │
└────────────────────────────────────────────────┘
```

---

## Offseason Development Hub

```
┌────────────────────────────────────────────────┐
│  OFFSEASON DEVELOPMENT             Week 4      │
├────────────────────────────────────────────────┤
│                                                │
│  OFFSEASON PROGRAM STATUS                      │
│  ┌────────────────────────────────────────┐   │
│  │  Participants: 48/53 (91%)             │   │
│  │  Weekly XP Earned: 1,920               │   │
│  │  Season Total: 7,680                   │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  TRAINING CAMP PREVIEW                         │
│  Starts: Week 13 (9 weeks away)               │
│  Expected XP: 1,050-1,350 per player          │
│                                                │
│  DEVELOPMENT PRIORITIES                        │
│  [ ] Young players (21-24): Focus physical    │
│  [ ] Prime players (25-28): Balance all       │
│  [ ] Veterans (29+): Maintain/mental          │
│                                                │
│  TOP DEVELOPERS THIS OFFSEASON                 │
│  1. K. Jones (RB) +4 OVR (82→86)              │
│  2. M. Davis (WR) +3 OVR (78→81)              │
│  3. J. Smith (QB) +2 OVR (85→87)              │
│                                                │
│  [SET FOCUS PLAYERS] [VIEW ALL PROGRESS]      │
│                                                │
└────────────────────────────────────────────────┘
```

---

# PART 8: DATA STRUCTURES

## TrainingProgress Interface

```typescript
interface TrainingProgress {
  playerId: string;
  currentXP: number;
  totalXPEarned: number;
  seasonXP: number;
  lastUpdated: string; // ISO date

  // Attribute XP tracking
  attributeXP: Record<string, number>;

  // Badge progression
  badgeProgress: {
    badgeId: string;
    tier: BadgeTier;
    xpInvested: number;
  }[];

  // Modifiers
  activeModifiers: {
    source: string;
    type: 'xp_bonus' | 'cost_reduction';
    value: number;
    expiresAt?: string;
  }[];

  // History
  history: {
    week: number;
    season: number;
    xpEarned: number;
    source: string;
  }[];
}
```

## PracticeFocus Interface

```typescript
interface PracticeFocus {
  teamId: string;
  week: number;
  focus: 'passing' | 'running' | 'pass_rush' | 'coverage' |
         'red_zone_offense' | 'red_zone_defense' |
         'special_teams' | 'conditioning' | 'film_study' | 'recovery';
  intensity: 'high' | 'normal' | 'light' | 'rest';
}
```

## DevelopmentModifiers Interface

```typescript
interface DevelopmentModifiers {
  facilityBonus: number;      // From facilities
  staffBonus: number;         // From coaches
  gmPerkBonus: number;        // From GM skills
  traitBonus: number;         // From player traits
  schemeFitBonus: number;     // From scheme matching
  ageModifier: number;        // From age curves
  totalMultiplier: number;    // Combined multiplier
}
```

---

# APPENDIX: QUICK REFERENCE

## XP Sources Summary

| Source | Base XP | Max with Bonuses |
|--------|---------|------------------|
| Game (win) | 75 | 113 |
| Game (loss) | 50 | 75 |
| Performance | 10-100 | 15-150 |
| Practice | 30-60 | 45-90 |
| Training Camp | 1,050-1,350 | 1,575-2,025 |
| Offseason | 100-480 | 150-720 |

## Modifier Stack Summary

| Source | Max Bonus |
|--------|-----------|
| Training Room | +30% |
| Weight Room | +40% (physical) |
| Practice Facility | +30% |
| Coach | +25% |
| GM Perks | +100% (Coach's Favorite Gold) |
| Traits | +20% (Gym Rat) |
| **Max Total** | +245% |

## Age Quick Reference

| Age | Development Phase | XP Cost Mod |
|-----|-------------------|-------------|
| 21-24 | Growth | 0.8x |
| 25-27 | Prime | 1.0x |
| 28-30 | Maintenance | 1.2x |
| 31-33 | Early Decline | 1.5x |
| 34+ | Late Decline | 2.0x |

---

**Status:** Training System Complete
**Scope:** XP earning, attribute progression, modifiers, badges, UI specs
**Version:** 1.0
**Date:** December 2025
