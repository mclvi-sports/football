# Schemes System

## Overview

The Schemes System defines all offensive, defensive, and special teams schemes in the game. Schemes affect play calling tendencies, provide attribute bonuses/penalties, and determine player fit ratings. Schemes are separate from coaches—coaches have scheme preferences, but schemes themselves are system-wide definitions.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-coaching-staff-system.md` | Coach scheme preferences |
| `FINAL-player-generation-system.md` | Player attributes affected by schemes |
| `FINAL-roster-generation-system.md` | Team scheme assignments |
| `FINAL-traits-system.md` | Traits that interact with schemes |
| `sim-engine-v2.html` | Simulation scheme effects |

---

# PART 1: OFFENSIVE SCHEMES

## Scheme Overview

| Scheme | Philosophy | Play Style |
|--------|------------|------------|
| West Coast | Short timing passes | Possession, high completion |
| Spread | Space the field | Tempo, athleticism |
| Pro Style | Balanced attack | Versatile, adaptable |
| Air Raid | Vertical passing | Aggressive, big plays |
| Power Run | Physical running | Downhill, control clock |
| Zone Run | Outside zone | Misdirection, cutbacks |

---

## West Coast Offense

### Philosophy
Short, timing-based passing attack that uses the pass to set up the run. Emphasizes ball control, high completion percentage, and yards after catch.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| QB | Field General, West Coast | Short Accuracy, Decision Making |
| RB | Receiving Back, All-Purpose | Catching, Route Running |
| WR | Possession, Route Technician | Short Route, Catch in Traffic |
| TE | Receiving TE | Catching, Route Running |
| OL | Pass Protectors | Pass Blocking |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Short Accuracy | +3 |
| Short Route Running | +2 |
| Catch in Traffic | +2 |
| Awareness | +1 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Deep Accuracy | -2 |
| Deep Route Running | -1 |

### Play Calling Tendencies

| Situation | Pass % | Run % |
|-----------|--------|-------|
| 1st & 10 | 55% | 45% |
| 2nd & Short | 50% | 50% |
| 2nd & Long | 70% | 30% |
| 3rd & Short | 45% | 55% |
| 3rd & Long | 85% | 15% |
| Red Zone | 55% | 45% |
| Goal Line | 40% | 60% |

### Pass Distribution

| Route Depth | Frequency |
|-------------|-----------|
| Short (0-10 yds) | 55% |
| Medium (10-20 yds) | 35% |
| Deep (20+ yds) | 10% |

---

## Spread Offense

### Philosophy
Space the defense horizontally and vertically using multiple receivers and formations. Emphasizes tempo, athlete mismatches, and exploiting defensive weaknesses.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| QB | Dual-Threat, Scrambler | Speed, Throw on Run |
| RB | Speed Back, Scat Back | Speed, Receiving |
| WR | Deep Threat, Playmaker | Speed, Route Running |
| TE | Athletic TE | Speed, Receiving |
| OL | Athletic Blockers | Agility, Pass Blocking |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Speed (skill positions) | +3 |
| Route Running (all) | +2 |
| Agility | +2 |
| Throw on the Run | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Run Blocking | -2 |
| Trucking | -1 |

### Play Calling Tendencies

| Situation | Pass % | Run % |
|-----------|--------|-------|
| 1st & 10 | 60% | 40% |
| 2nd & Short | 55% | 45% |
| 2nd & Long | 75% | 25% |
| 3rd & Short | 50% | 50% |
| 3rd & Long | 90% | 10% |
| Red Zone | 60% | 40% |
| Goal Line | 50% | 50% |

### Pass Distribution

| Route Depth | Frequency |
|-------------|-----------|
| Short (0-10 yds) | 40% |
| Medium (10-20 yds) | 35% |
| Deep (20+ yds) | 25% |

---

## Pro Style Offense

### Philosophy
Balanced attack that can adjust to any situation. Uses multiple formations, play-action, and a mix of run and pass. The most versatile scheme.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| QB | Field General, Pocket Passer | All passing attributes |
| RB | All-Purpose, Power Back | Balance of skills |
| WR | Possession, Red Zone | Balanced receivers |
| TE | Balanced TE | Blocking and Receiving |
| OL | Balanced Line | Run and Pass Blocking |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| All Offensive Attributes | +2 |
| Play Action | +2 |

### Attribute Penalties

None (jack of all trades, master of none)

### Play Calling Tendencies

| Situation | Pass % | Run % |
|-----------|--------|-------|
| 1st & 10 | 50% | 50% |
| 2nd & Short | 45% | 55% |
| 2nd & Long | 65% | 35% |
| 3rd & Short | 40% | 60% |
| 3rd & Long | 80% | 20% |
| Red Zone | 50% | 50% |
| Goal Line | 35% | 65% |

### Pass Distribution

| Route Depth | Frequency |
|-------------|-----------|
| Short (0-10 yds) | 40% |
| Medium (10-20 yds) | 40% |
| Deep (20+ yds) | 20% |

---

## Air Raid Offense

### Philosophy
Pass-heavy attack that stretches the field vertically. High risk, high reward with emphasis on big plays and explosive offense.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| QB | Gunslinger, Strong Arm | Deep Accuracy, Throw Power |
| RB | Receiving Back | Pass Protection, Catching |
| WR | Deep Threat, Playmaker | Speed, Deep Route Running |
| TE | Receiving TE | Speed, Deep Routes |
| OL | Pass Protectors | Pass Blocking |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Deep Accuracy | +4 |
| Deep Route Running | +3 |
| Throw Power | +2 |
| Speed (WR) | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Run Blocking | -3 |
| Carrying | -2 |
| Trucking | -2 |

### Play Calling Tendencies

| Situation | Pass % | Run % |
|-----------|--------|-------|
| 1st & 10 | 70% | 30% |
| 2nd & Short | 65% | 35% |
| 2nd & Long | 85% | 15% |
| 3rd & Short | 60% | 40% |
| 3rd & Long | 95% | 5% |
| Red Zone | 65% | 35% |
| Goal Line | 55% | 45% |

### Pass Distribution

| Route Depth | Frequency |
|-------------|-----------|
| Short (0-10 yds) | 25% |
| Medium (10-20 yds) | 35% |
| Deep (20+ yds) | 40% |

---

## Power Run Offense

### Philosophy
Physical, downhill running attack that establishes dominance at the line of scrimmage. Control the clock, wear down defenses, and impose your will.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| QB | Game Manager | Handoff execution, Play Action |
| RB | Power Back, Bruiser | Trucking, Break Tackle, Strength |
| FB | Lead Blocker | Run Blocking, Strength |
| WR | Blocking WR | Run Block, Strength |
| TE | Blocking TE | Run Blocking |
| OL | Maulers | Run Blocking, Strength |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Trucking | +4 |
| Run Blocking | +3 |
| Strength | +2 |
| Break Tackle | +2 |
| Carrying | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| All Passing Attributes | -3 |
| Route Running | -2 |

### Play Calling Tendencies

| Situation | Pass % | Run % |
|-----------|--------|-------|
| 1st & 10 | 30% | 70% |
| 2nd & Short | 25% | 75% |
| 2nd & Long | 45% | 55% |
| 3rd & Short | 20% | 80% |
| 3rd & Long | 65% | 35% |
| Red Zone | 30% | 70% |
| Goal Line | 15% | 85% |

### Pass Distribution

| Route Depth | Frequency |
|-------------|-----------|
| Short (0-10 yds) | 50% |
| Medium (10-20 yds) | 35% |
| Deep (20+ yds) | 15% |

---

## Zone Run Offense

### Philosophy
Outside zone running that creates cutback lanes and uses misdirection. Requires athletic linemen and patient runners who can find holes.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| QB | Play Action Specialist | Play Action, Bootleg |
| RB | Speed Back, Zone Runner | Vision, Agility, Elusiveness |
| WR | Blocking WR, Playmaker | Run Blocking, YAC |
| TE | Athletic TE | Blocking, Receiving |
| OL | Athletic Blockers | Agility, Run Blocking |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Elusiveness | +4 |
| Agility | +3 |
| Ball Carrier Vision | +3 |
| Juke Move | +2 |
| Play Action | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Trucking | -2 |
| Power Moves (OL) | -1 |

### Play Calling Tendencies

| Situation | Pass % | Run % |
|-----------|--------|-------|
| 1st & 10 | 40% | 60% |
| 2nd & Short | 35% | 65% |
| 2nd & Long | 55% | 45% |
| 3rd & Short | 30% | 70% |
| 3rd & Long | 70% | 30% |
| Red Zone | 40% | 60% |
| Goal Line | 30% | 70% |

### Pass Distribution

| Route Depth | Frequency |
|-------------|-----------|
| Short (0-10 yds) | 45% |
| Medium (10-20 yds) | 40% |
| Deep (20+ yds) | 15% |

---

# PART 2: DEFENSIVE SCHEMES

## Scheme Overview

| Scheme | Base Formation | Philosophy |
|--------|----------------|------------|
| 4-3 Base | 4 DL, 3 LB | Balanced, strong vs run |
| 3-4 Base | 3 DL, 4 LB | Versatile, disguised pressure |
| Cover 2 | 2 Deep Safeties | Zone coverage, protect deep |
| Cover 3 | 3 Deep Zones | Turnover focus, ball hawks |
| Man Blitz | Man Coverage + Pressure | Aggressive, high risk |
| Zone Blitz | Zone + Disguised Pressure | Confuse QB, create turnovers |

---

## 4-3 Base Defense

### Philosophy
Traditional defense with four down linemen and three linebackers. Strong against the run with natural pass rush from the defensive line.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| DE | Speed Rusher, Power Rusher | Pass Rush, Speed |
| DT | Run Stuffer, Interior Pressure | Block Shedding, Strength |
| MLB | Run Stopper | Tackle, Play Recognition |
| OLB | Coverage LB | Zone Coverage, Speed |
| CB | Press Corner, Zone Corner | Coverage, Speed |
| S | Box Safety, Deep Safety | Tackle, Coverage |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| DL Pass Rush | +3 |
| LB Tackling | +2 |
| Block Shedding | +2 |
| Run Defense | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| DB Coverage | -2 |
| Zone Coverage (LB) | -1 |

### Personnel Packages

| Package | Personnel | Usage |
|---------|-----------|-------|
| Base | 4 DL, 3 LB, 4 DB | Standard downs |
| Nickel | 4 DL, 2 LB, 5 DB | Passing situations |
| Dime | 4 DL, 1 LB, 6 DB | Obvious pass |
| Goal Line | 5 DL, 4 LB, 2 DB | Short yardage |

---

## 3-4 Base Defense

### Philosophy
Three down linemen with four linebackers creates versatility and disguised pressure. Can rush from anywhere, making it hard for offense to identify blitzers.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| DE | 3-4 End | Block Shedding, Strength |
| NT | Nose Tackle | Strength, Block Shedding |
| ILB | Run Stopper, Coverage | Tackle, Zone Coverage |
| OLB | Edge Rusher | Pass Rush, Speed |
| CB | Press Corner | Man Coverage |
| S | Hybrid Safety | Versatility |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| OLB Pass Rush | +3 |
| Flexibility/Disguise | +2 |
| Zone Coverage | +2 |
| Play Recognition | +1 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| DL Run Stopping | -2 |
| Interior Pressure | -1 |

### Personnel Packages

| Package | Personnel | Usage |
|---------|-----------|-------|
| Base | 3 DL, 4 LB, 4 DB | Standard downs |
| Nickel | 3 DL, 3 LB, 5 DB | Passing situations |
| Big Nickel | 3 DL, 2 LB, 6 DB | Spread offense |
| Bear | 4 DL, 4 LB, 3 DB | Run defense |

---

## Cover 2 Defense

### Philosophy
Two deep safeties split the field in half, with cornerbacks playing flat zones. Protects against deep passes but can be vulnerable in the middle of the field.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| DE | Speed Rusher | Pass Rush |
| DT | Interior Pressure | Pass Rush |
| LB | Coverage LB | Zone Coverage, Speed |
| CB | Zone Corner | Zone Coverage, Tackling |
| S | Deep Safety, Range | Zone Coverage, Range |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Zone Coverage | +4 |
| Deep Ball Defense | +3 |
| Safety Range | +2 |
| LB Coverage | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Man Coverage | -3 |
| Intermediate Defense | -2 |

### Coverage Rules

| Zone | Responsibility |
|------|----------------|
| Deep Half (S) | Deep pass, 20+ yards |
| Flat (CB) | Short outside, 0-10 yards |
| Hook/Curl (LB) | Intermediate middle |
| Middle Read | MLB reads QB |

---

## Cover 3 Defense

### Philosophy
Three deep zones with four underneath. Creates opportunities for turnovers with deep defenders reading the quarterback. Single-high safety look.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| DE | Speed Rusher | Pass Rush |
| DT | Run Stuffer | Block Shedding |
| LB | Ball Hawk LB | Play Recognition, INT |
| CB | Ball Hawk | Zone Coverage, Catching |
| FS | Center Field | Range, Ball Skills |
| SS | Box Safety | Run Support |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Zone Coverage | +3 |
| Interceptions | +2 |
| Ball Hawk Ability | +2 |
| Play Recognition | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Run Defense | -2 |
| Man Coverage | -2 |

### Coverage Rules

| Zone | Responsibility |
|------|----------------|
| Deep Third (FS) | Middle deep |
| Deep Third (CB) | Outside deep |
| Flat (OLB/S) | Short outside |
| Hook (ILB) | Middle underneath |

---

## Man Blitz Defense

### Philosophy
Aggressive man-to-man coverage with frequent blitzing. High risk, high reward—can dominate or get burned for big plays.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| DE | Speed Rusher | Pass Rush, Speed |
| DT | Interior Pressure | Pass Rush |
| LB | Blitzer | Blitzing, Speed |
| CB | Shutdown Corner | Man Coverage, Press |
| S | Man Coverage | Man Coverage, Speed |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Man Coverage | +5 |
| Pass Rush | +4 |
| Press Coverage | +3 |
| Blitzing | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Zone Coverage | -4 |
| Deep Ball Defense | -3 |
| Run Defense | -1 |

### Blitz Packages

| Package | Rushers | Risk Level |
|---------|---------|------------|
| 4-Man Rush | 4 | Low |
| 5-Man Blitz | 5 | Medium |
| 6-Man Blitz | 6 | High |
| All-Out Blitz | 7+ | Very High |

---

## Zone Blitz Defense

### Philosophy
Disguised pressure with zone coverage behind it. Drops linemen into coverage while blitzing from unexpected positions. Confuses quarterbacks and creates turnovers.

### Ideal Personnel

| Position | Ideal Archetype | Key Attributes |
|----------|-----------------|----------------|
| DE | Versatile End | Pass Rush, Zone Coverage |
| DT | Athletic Interior | Agility, Coverage |
| LB | Hybrid LB | Blitz, Coverage, Versatility |
| CB | Zone Corner | Zone Coverage |
| S | Hybrid Safety | Blitz, Coverage |

### Attribute Bonuses

| Attribute | Bonus |
|-----------|-------|
| Play Recognition | +3 |
| Blitzing | +3 |
| Zone Coverage | +2 |
| Disguise | +2 |

### Attribute Penalties

| Attribute | Penalty |
|-----------|---------|
| Man Coverage | -2 |
| Deep Ball Defense | -1 |

### Zone Blitz Concepts

| Concept | Description |
|---------|-------------|
| Fire Zone | 5 rush, 3 deep, 3 under |
| Overload | Blitz one side, zone other |
| Simulated Pressure | Show blitz, drop into zone |
| Delayed Blitz | LB waits, then rushes |

---

# PART 3: SPECIAL TEAMS PHILOSOPHIES

## Philosophy Overview

| Philosophy | Focus | Risk Level |
|------------|-------|------------|
| Aggressive Returns | Return everything | High |
| Conservative | Ball security first | Low |
| Coverage Specialist | Elite coverage | Medium |

---

## Aggressive Returns

### Philosophy
Return everything possible. Focus on big plays and field position advantages through explosive returns.

### Bonuses

| Effect | Value |
|--------|-------|
| Return Yards | +5 average |
| Return TD Chance | +3% |
| Fair Catch Frequency | -40% |

### Penalties

| Effect | Value |
|--------|-------|
| Turnover Risk | +2% |
| Starting Field Position Variance | High |

### Ideal Personnel
- Elite speed returner
- Strong blocking on return team
- Risk-tolerant players

---

## Conservative Returns

### Philosophy
Prioritize ball security and smart decisions. Fair catch when appropriate, avoid mistakes.

### Bonuses

| Effect | Value |
|--------|-------|
| Turnover Risk | -3% |
| Consistent Field Position | +5 yards average |
| Muff/Fumble Chance | -50% |

### Penalties

| Effect | Value |
|--------|-------|
| Return Yards | -5 average |
| Return TD Chance | -2% |

### Ideal Personnel
- Sure-handed returner
- Good decision makers
- Ball security focus

---

## Coverage Specialist

### Philosophy
Elite coverage units that limit opponent returns. Focus on tackling, lane discipline, and preventing big plays.

### Bonuses

| Effect | Value |
|--------|-------|
| Opponent Return Yards | -10 average |
| Coverage Tackles | +25% |
| Big Play Prevention | +20% |

### Penalties

| Effect | Value |
|--------|-------|
| Return Game | Neutral |
| Special Teams Injuries | +5% (aggressive tackling) |

### Ideal Personnel
- Fast coverage players
- Good tacklers
- Disciplined lane runners

---

# PART 4: PLAYER SCHEME FIT

## Fit System Overview

Players have a natural fit for certain schemes based on their archetype and attributes. Scheme fit affects their in-game performance.

### Fit Levels

| Fit Level | OVR Modifier | Description |
|-----------|--------------|-------------|
| Perfect | +5 OVR | Ideal match, maximizes potential |
| Good | +2 OVR | Solid fit, performs well |
| Neutral | +0 OVR | Neither helps nor hurts |
| Poor | -2 OVR | Awkward fit, underperforms |
| Terrible | -5 OVR | Wrong system entirely |

---

## Calculating Scheme Fit

### Step 1: Check Archetype Affinity

Each archetype has natural scheme affinities:

```
ARCHETYPE_SCHEME_FIT = {
  // QB Archetypes
  'field_general': { 'West Coast': 'perfect', 'Pro Style': 'good', 'Air Raid': 'neutral' },
  'scrambler': { 'Spread': 'perfect', 'Zone Run': 'good', 'Power Run': 'poor' },
  'gunslinger': { 'Air Raid': 'perfect', 'Spread': 'good', 'Power Run': 'terrible' },
  
  // RB Archetypes
  'power_back': { 'Power Run': 'perfect', 'Pro Style': 'good', 'Air Raid': 'terrible' },
  'speed_back': { 'Zone Run': 'perfect', 'Spread': 'good', 'Power Run': 'poor' },
  'receiving_back': { 'West Coast': 'perfect', 'Spread': 'good', 'Power Run': 'poor' },
  
  // WR Archetypes
  'deep_threat': { 'Air Raid': 'perfect', 'Spread': 'good', 'West Coast': 'poor' },
  'possession': { 'West Coast': 'perfect', 'Pro Style': 'good', 'Air Raid': 'neutral' },
  'playmaker': { 'Spread': 'perfect', 'West Coast': 'good', 'Power Run': 'poor' },
  
  // Continue for all archetypes...
}
```

### Step 2: Check Key Attributes

If archetype doesn't have direct affinity, calculate from attributes:

```
function calculateSchemeFit(player, scheme):
    keyAttributes = scheme.keyAttributes
    playerScores = []
    
    for attr in keyAttributes:
        threshold = scheme.attributeThresholds[attr]
        playerValue = player.attributes[attr]
        
        if playerValue >= threshold.perfect:
            playerScores.push('perfect')
        else if playerValue >= threshold.good:
            playerScores.push('good')
        else if playerValue >= threshold.neutral:
            playerScores.push('neutral')
        else if playerValue >= threshold.poor:
            playerScores.push('poor')
        else:
            playerScores.push('terrible')
    
    return averageFit(playerScores)
```

### Step 3: Apply Fit Modifier

```
effectiveOVR = player.ovr + schemeFitModifier
```

---

## Scheme Fit by Position

### QB Scheme Fit Requirements

| Scheme | Key Attributes | Perfect Threshold |
|--------|----------------|-------------------|
| West Coast | Short Acc, AWR | 85+ Short Acc |
| Spread | Speed, TOR | 80+ Speed |
| Pro Style | All passing | 80+ in all |
| Air Raid | Deep Acc, THP | 85+ Deep Acc |
| Power Run | Play Action | 75+ (minimal) |
| Zone Run | TOR, Play Action | 80+ TOR |

### RB Scheme Fit Requirements

| Scheme | Key Attributes | Perfect Threshold |
|--------|----------------|-------------------|
| West Coast | Catching, Route | 75+ Catching |
| Spread | Speed, Catching | 85+ Speed |
| Pro Style | Balanced | 75+ all |
| Air Raid | Pass Block, Catch | 70+ Pass Block |
| Power Run | Trucking, BTK | 85+ Trucking |
| Zone Run | Vision, Elusiveness | 85+ Vision |

### WR Scheme Fit Requirements

| Scheme | Key Attributes | Perfect Threshold |
|--------|----------------|-------------------|
| West Coast | Short Route, CIT | 85+ SRR |
| Spread | Speed, All Routes | 85+ Speed |
| Pro Style | Balanced | 80+ all |
| Air Raid | Deep Route, Speed | 85+ DRR |
| Power Run | Run Blocking | 70+ RBK |
| Zone Run | Run Blocking, YAC | 75+ RBK |

### Defensive Scheme Fit

| Scheme | Position | Key Attributes | Perfect Threshold |
|--------|----------|----------------|-------------------|
| 4-3 | DE | Pass Rush, Speed | 85+ PMV/FMV |
| 4-3 | DT | Block Shed, Strength | 85+ BSH |
| 3-4 | OLB | Pass Rush, Speed | 85+ PMV |
| 3-4 | NT | Strength, Block Shed | 90+ STR |
| Cover 2 | CB | Zone Coverage | 85+ ZCV |
| Cover 2 | S | Range, Zone | 85+ ZCV |
| Cover 3 | CB | Zone, Ball Skills | 80+ ZCV |
| Man Blitz | CB | Man, Press | 85+ MCV |
| Zone Blitz | LB | Versatility | 80+ ZCV, 75+ BSH |

---

## Scheme Adjustment Period

### When Schemes Change
- New coach with different scheme
- Player traded to new team
- Coordinator change mid-season

### Adjustment Timeline

| Week | Performance Modifier |
|------|---------------------|
| Week 1 | -75% of fit bonus |
| Week 2 | -50% of fit bonus |
| Week 3 | -25% of fit bonus |
| Week 4+ | Full fit bonus |

### Factors Affecting Adjustment

| Factor | Effect |
|--------|--------|
| High Awareness | -1 week adjustment |
| "Quick Learner" trait | -1 week adjustment |
| Age 30+ | +1 week adjustment |
| "Slow Learner" trait | +2 weeks adjustment |
| Similar scheme family | -1 week adjustment |

### Scheme Families

| Family | Schemes |
|--------|---------|
| Passing | West Coast, Air Raid, Spread |
| Running | Power Run, Zone Run |
| Balanced | Pro Style |
| Man Defense | Man Blitz |
| Zone Defense | Cover 2, Cover 3, Zone Blitz |
| Front-Focused | 4-3, 3-4 |

Players moving within a family adjust faster.

---

# PART 5: SIMULATION INTEGRATION

## Offensive Scheme Effects

### Play Selection Algorithm

```
function selectPlay(situation, scheme):
    baseTendencies = scheme.playCallingTendencies[situation]
    
    // Adjust for game state
    if trailing && quarter >= 4:
        baseTendencies.pass += 20
        baseTendencies.run -= 20
    
    if leading && quarter >= 4:
        baseTendencies.run += 15
        baseTendencies.pass -= 15
    
    // Random selection based on tendencies
    return weightedRandom(baseTendencies)
```

### Attribute Application

```
function applySchemeBonus(player, scheme):
    effectiveAttributes = {...player.attributes}
    
    for bonus in scheme.attributeBonuses:
        effectiveAttributes[bonus.attribute] += bonus.value
    
    for penalty in scheme.attributePenalties:
        effectiveAttributes[penalty.attribute] -= penalty.value
    
    return effectiveAttributes
```

---

## Defensive Scheme Effects

### Coverage Assignment

```
function assignCoverage(scheme, receivers):
    if scheme.type === 'man':
        return assignManCoverage(receivers)
    else:
        return assignZoneCoverage(scheme.zones)
```

### Pressure Generation

```
function calculatePressure(scheme, oLine):
    baseRush = scheme.baseRushers
    blitzChance = scheme.blitzFrequency
    
    if random() < blitzChance:
        rushers = baseRush + scheme.blitzExtra
    else:
        rushers = baseRush
    
    return calculateRushVsBlock(rushers, oLine)
```

---

## Scheme vs Scheme Matchups

### Offensive vs Defensive Advantages

| Offense | Strong Against | Weak Against |
|---------|----------------|--------------|
| West Coast | Man Blitz | Cover 2 |
| Spread | 3-4, Zone Blitz | 4-3, Man Blitz |
| Pro Style | None specific | None specific |
| Air Raid | Cover 3 | Cover 2, Man Blitz |
| Power Run | 3-4 | 4-3, Cover 2 |
| Zone Run | 4-3 | 3-4, Zone Blitz |

### Matchup Modifier

| Matchup Result | Effect |
|----------------|--------|
| Strong Advantage | +5% efficiency |
| Slight Advantage | +2% efficiency |
| Neutral | 0% |
| Slight Disadvantage | -2% efficiency |
| Strong Disadvantage | -5% efficiency |

---

# PART 6: DATA STRUCTURES

## TypeScript Interfaces

```typescript
type OffensiveScheme = 
  | 'west_coast'
  | 'spread'
  | 'pro_style'
  | 'air_raid'
  | 'power_run'
  | 'zone_run';

type DefensiveScheme = 
  | '4-3'
  | '3-4'
  | 'cover_2'
  | 'cover_3'
  | 'man_blitz'
  | 'zone_blitz';

type STPhilosophy = 
  | 'aggressive'
  | 'conservative'
  | 'coverage_specialist';

type SchemeFit = 'perfect' | 'good' | 'neutral' | 'poor' | 'terrible';

interface SchemeDefinition {
  id: string;
  name: string;
  type: 'offensive' | 'defensive' | 'special_teams';
  philosophy: string;
  
  attributeBonuses: AttributeModifier[];
  attributePenalties: AttributeModifier[];
  
  playCallingTendencies: PlayTendencies;
  idealPersonnel: PositionRequirement[];
  
  strongAgainst: string[];
  weakAgainst: string[];
}

interface AttributeModifier {
  attribute: string;
  value: number;
  positions?: string[];  // If empty, applies to all
}

interface PlayTendencies {
  [situation: string]: {
    pass: number;
    run: number;
  };
}

interface PositionRequirement {
  position: string;
  idealArchetypes: string[];
  keyAttributes: string[];
  thresholds: {
    perfect: number;
    good: number;
    neutral: number;
    poor: number;
  };
}

interface PlayerSchemeFit {
  playerId: string;
  schemeFits: {
    [schemeId: string]: {
      fit: SchemeFit;
      ovrModifier: number;
      adjustmentWeeksRemaining: number;
    };
  };
}
```

---

## Scheme Constants

```typescript
const SCHEME_FIT_MODIFIERS: Record<SchemeFit, number> = {
  'perfect': 5,
  'good': 2,
  'neutral': 0,
  'poor': -2,
  'terrible': -5
};

const ADJUSTMENT_WEEKS = 4;

const SCHEME_FAMILIES = {
  passing: ['west_coast', 'air_raid', 'spread'],
  running: ['power_run', 'zone_run'],
  balanced: ['pro_style'],
  man_defense: ['man_blitz'],
  zone_defense: ['cover_2', 'cover_3', 'zone_blitz'],
  front_based: ['4-3', '3-4']
};
```

---

# PART 7: UI DISPLAY

## Scheme Selection (Coach Hiring)

```
┌────────────────────────────────────────┐
│  OFFENSIVE SCHEME                      │
├────────────────────────────────────────┤
│                                        │
│  ○ West Coast                          │
│    Short passing, ball control         │
│    +3 Short Acc, +2 Short Route        │
│    Best for: Accurate QBs              │
│                                        │
│  ● Spread (SELECTED)                   │
│    Space the field, tempo              │
│    +3 Speed, +2 Route Running          │
│    Best for: Mobile QBs, fast WRs      │
│                                        │
│  ○ Air Raid                            │
│    Vertical passing attack             │
│    +4 Deep Acc, +3 Deep Route          │
│    Best for: Strong-arm QBs            │
│                                        │
│  [VIEW ALL SCHEMES]                    │
│                                        │
└────────────────────────────────────────┘
```

## Player Scheme Fit Display

```
┌────────────────────────────────────────┐
│  J. WILLIAMS - WR                      │
│  85 OVR • Deep Threat                  │
├────────────────────────────────────────┤
│                                        │
│  SCHEME FIT                            │
│                                        │
│  Air Raid      ★★★★★  Perfect (+5)    │
│  Spread        ★★★★☆  Good (+2)       │
│  Pro Style     ★★★☆☆  Neutral (0)     │
│  West Coast    ★★☆☆☆  Poor (-2)       │
│  Power Run     ★☆☆☆☆  Terrible (-5)   │
│                                        │
│  Current Scheme: Spread                │
│  Effective OVR: 87 (+2)                │
│                                        │
└────────────────────────────────────────┘
```

## Team Scheme Overview

```
┌────────────────────────────────────────┐
│  TEAM SCHEMES                          │
├────────────────────────────────────────┤
│                                        │
│  OFFENSE: Spread                       │
│  OC: J. Smith (82 OVR)                 │
│                                        │
│  Roster Fit Analysis:                  │
│  Perfect Fit: 8 players                │
│  Good Fit: 12 players                  │
│  Neutral: 18 players                   │
│  Poor Fit: 10 players                  │
│  Terrible: 5 players                   │
│                                        │
│  Net OVR Impact: +1.2                  │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  DEFENSE: Cover 3                      │
│  DC: R. Jones (88 OVR)                 │
│                                        │
│  Roster Fit Analysis:                  │
│  Perfect Fit: 5 players                │
│  Good Fit: 9 players                   │
│  Neutral: 8 players                    │
│  Poor Fit: 3 players                   │
│  Terrible: 0 players                   │
│                                        │
│  Net OVR Impact: +1.8                  │
│                                        │
└────────────────────────────────────────┘
```

---

**Version:** 1.0
**Date:** December 2025
**Status:** FINAL
