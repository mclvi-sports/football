# Schemes Data Reference

Complete inventory of offensive, defensive, and special teams schemes.

---

## Scheme Types

```typescript
type OffensiveScheme =
  | 'west_coast' | 'spread' | 'pro_style'
  | 'air_raid' | 'power_run' | 'zone_run';

type DefensiveScheme =
  | '4-3' | '3-4' | 'cover_2'
  | 'cover_3' | 'man_blitz' | 'zone_blitz';

type STPhilosophy =
  | 'aggressive' | 'conservative' | 'coverage_specialist';
```

---

## Scheme Fit System

| Fit Level | OVR Modifier |
|-----------|--------------|
| perfect | +5 |
| good | +2 |
| neutral | 0 |
| poor | -2 |
| terrible | -5 |

### Adjustment Period
- Base: 4 weeks to learn new scheme
- Same family: -1 week
- High awareness (85+): -1 week
- Quick learner trait: -1 week
- Slow learner trait: +2 weeks
- Age 30+: +1 week
- Range: 1-6 weeks

---

## Scheme Families

| Family | Schemes |
|--------|---------|
| Passing | west_coast, air_raid, spread |
| Running | power_run, zone_run |
| Balanced | pro_style |
| Man Defense | man_blitz |
| Zone Defense | cover_2, cover_3, zone_blitz |
| Front Based | 4-3, 3-4 |

---

## Offensive Schemes (6)

### West Coast

| Property | Value |
|----------|-------|
| Philosophy | Short timing passes |
| Play Style | Short, timing-based passing attack that uses the pass to set up the run |
| Pass Distribution | Short 55%, Medium 35%, Deep 10% |
| Strong Against | man_blitz |
| Weak Against | cover_2 |

**Attribute Bonuses:** +3 Short Accuracy, +2 Short Route Running, +2 Catch In Traffic, +1 Awareness

**Attribute Penalties:** -2 Deep Accuracy, -1 Deep Route Running

**Ideal Personnel:**
- QB: Field General, West Coast (Short Accuracy, Awareness)
- RB: Receiving Back, All Purpose (Catching, Route Running)
- WR: Possession, Route Technician (Short Route Running, Catch In Traffic)
- TE: Receiving TE (Catching, Route Running)
- OL: Pass Protector (Pass Blocking)

---

### Spread

| Property | Value |
|----------|-------|
| Philosophy | Space the field, tempo |
| Play Style | Space the defense horizontally/vertically using multiple receivers |
| Pass Distribution | Short 40%, Medium 35%, Deep 25% |
| Strong Against | 3-4, zone_blitz |
| Weak Against | 4-3, man_blitz |

**Attribute Bonuses:** +3 Speed (skill positions), +2 Route Running, +2 Agility, +2 Throw On Run

**Attribute Penalties:** -2 Run Blocking, -1 Trucking

**Ideal Personnel:**
- QB: Dual-Threat, Scrambler (Speed, Throw On Run)
- RB: Speed Back, Scat Back (Speed, Receiving)
- WR: Deep Threat, Playmaker (Speed, Route Running)
- TE: Athletic TE (Speed, Receiving)
- OL: Athletic Blocker (Agility, Pass Blocking)

---

### Pro Style

| Property | Value |
|----------|-------|
| Philosophy | Balanced attack |
| Play Style | Most versatile scheme - can adjust to any situation |
| Pass Distribution | Short 40%, Medium 40%, Deep 20% |
| Strong Against | None |
| Weak Against | None |

**Attribute Bonuses:** +2 All Offensive, +2 Play Action

**Attribute Penalties:** None

**Ideal Personnel:**
- QB: Field General, Pocket Passer (All Accuracies)
- RB: All Purpose, Power Back (Speed, Trucking, Catching)
- WR: Possession, Red Zone (Catching, Route Running)
- TE: Balanced TE (Blocking, Receiving)
- OL: Balanced Blocker (Run Blocking, Pass Blocking)

---

### Air Raid

| Property | Value |
|----------|-------|
| Philosophy | Vertical passing |
| Play Style | Pass-heavy, high risk/high reward with emphasis on big plays |
| Pass Distribution | Short 25%, Medium 35%, Deep 40% |
| Strong Against | cover_3 |
| Weak Against | cover_2, man_blitz |

**Attribute Bonuses:** +4 Deep Accuracy, +3 Deep Route Running, +2 Throw Power, +2 WR Speed

**Attribute Penalties:** -3 Run Blocking, -2 Carrying, -2 Trucking

**Ideal Personnel:**
- QB: Gunslinger, Strong Arm (Deep Accuracy, Throw Power)
- RB: Receiving Back (Pass Protection, Catching)
- WR: Deep Threat, Playmaker (Speed, Deep Route Running)
- TE: Receiving TE (Speed, Deep Route Running)
- OL: Pass Protector (Pass Blocking)

---

### Power Run

| Property | Value |
|----------|-------|
| Philosophy | Physical downhill |
| Play Style | Physical running attack that controls clock and wears down defenses |
| Pass Distribution | Short 50%, Medium 35%, Deep 15% |
| Strong Against | 3-4 |
| Weak Against | 4-3, cover_2 |

**Attribute Bonuses:** +4 Trucking, +3 Run Blocking, +2 Strength, +2 Break Tackle, +2 Carrying

**Attribute Penalties:** -3 All Passing, -2 Route Running

**Ideal Personnel:**
- QB: Game Manager (Play Action)
- RB: Power Back, Bruiser (Trucking, Break Tackle, Strength)
- FB: Lead Blocker (Run Blocking, Strength)
- WR: Blocking WR (Run Blocking, Strength)
- TE: Blocking TE (Run Blocking)
- OL: Mauler (Run Blocking, Strength)

---

### Zone Run

| Property | Value |
|----------|-------|
| Philosophy | Outside zone, misdirection |
| Play Style | Creates cutback lanes using athletic linemen and patient runners |
| Pass Distribution | Short 45%, Medium 40%, Deep 15% |
| Strong Against | 4-3 |
| Weak Against | 3-4, zone_blitz |

**Attribute Bonuses:** +4 Elusiveness, +3 Agility, +3 Ball Carrier Vision, +2 Juke Move, +2 Play Action

**Attribute Penalties:** -2 Trucking, -1 OL Power Moves

**Ideal Personnel:**
- QB: Play Action Specialist (Play Action, Throw On Run)
- RB: Speed Back, Zone Runner (Vision, Agility, Elusiveness)
- WR: Blocking WR, Playmaker (Run Blocking, YAC)
- TE: Athletic TE (Blocking, Receiving)
- OL: Athletic Blocker (Agility, Run Blocking)

---

## Defensive Schemes (6)

### 4-3 Base

| Property | Value |
|----------|-------|
| Formation | 4 DL, 3 LB |
| Philosophy | Strong against the run with natural pass rush from D-Line |
| Strong Against | spread, power_run |
| Weak Against | zone_run |

**Attribute Bonuses:** +3 Pass Rush (DE/DT), +2 Tackle (LB), +2 Block Shedding, +2 Run Defense

**Attribute Penalties:** -2 Coverage (CB/S), -1 Zone Coverage (LB)

**Personnel Packages:**
- Base: 4 DL, 3 LB, 4 DB (Standard downs)
- Nickel: 4 DL, 2 LB, 5 DB (Passing situations)
- Dime: 4 DL, 1 LB, 6 DB (Obvious pass)
- Goal Line: 5 DL, 4 LB, 2 DB (Short yardage)

---

### 3-4 Base

| Property | Value |
|----------|-------|
| Formation | 3 DL, 4 LB |
| Philosophy | Versatility and disguised pressure from anywhere |
| Strong Against | zone_run |
| Weak Against | spread, power_run |

**Attribute Bonuses:** +3 Pass Rush (OLB), +2 Flexibility, +2 Zone Coverage, +1 Play Recognition

**Attribute Penalties:** -2 Run Stopping (DL), -1 Interior Pressure

**Personnel Packages:**
- Base: 3 DL, 4 LB, 4 DB (Standard downs)
- Nickel: 3 DL, 3 LB, 5 DB (Passing situations)
- Big Nickel: 3 DL, 2 LB, 6 DB (Spread offense)
- Bear: 4 DL, 4 LB, 3 DB (Run defense)

---

### Cover 2

| Property | Value |
|----------|-------|
| Formation | 2 Deep Safeties |
| Philosophy | Protects against deep passes, vulnerable in middle |
| Strong Against | air_raid, power_run |
| Weak Against | west_coast |

**Attribute Bonuses:** +4 Zone Coverage, +3 Deep Ball Defense, +2 Safety Range, +2 LB Coverage

**Attribute Penalties:** -3 Man Coverage, -2 Intermediate Defense

**Personnel Packages:**
- Tampa 2: MLB drops deep (Protect middle)
- Cover 2 Man: Man under, 2 deep (Hybrid coverage)

---

### Cover 3

| Property | Value |
|----------|-------|
| Formation | 3 Deep Zones |
| Philosophy | Creates turnover opportunities with deep defenders reading QB |
| Strong Against | None |
| Weak Against | air_raid |

**Attribute Bonuses:** +3 Zone Coverage, +2 Interception, +2 Ball Hawk Ability, +2 Play Recognition

**Attribute Penalties:** -2 Run Defense, -2 Man Coverage

**Personnel Packages:**
- Cover 3 Sky: SS in box (Run support)
- Cover 3 Cloud: CB in flat (Pattern match)

---

### Man Blitz

| Property | Value |
|----------|-------|
| Formation | Man Coverage + Pressure |
| Philosophy | High risk, high reward - can dominate or get burned |
| Strong Against | spread |
| Weak Against | west_coast, air_raid |

**Attribute Bonuses:** +5 Man Coverage, +4 Pass Rush, +3 Press Coverage, +2 Blitzing

**Attribute Penalties:** -4 Zone Coverage, -3 Deep Ball Defense, -1 Run Defense

**Personnel Packages:**
- 4-Man Rush: 4 rushers (Low risk)
- 5-Man Blitz: 5 rushers (Medium risk)
- 6-Man Blitz: 6 rushers (High risk)
- All-Out Blitz: 7+ rushers (Very high risk)

---

### Zone Blitz

| Property | Value |
|----------|-------|
| Formation | Zone + Disguised Pressure |
| Philosophy | Drops linemen into coverage, blitzes from unexpected positions |
| Strong Against | zone_run |
| Weak Against | spread |

**Attribute Bonuses:** +3 Play Recognition, +3 Blitzing, +2 Zone Coverage, +2 Disguise

**Attribute Penalties:** -2 Man Coverage, -1 Deep Ball Defense

**Personnel Packages:**
- Fire Zone: 5 rush, 3 deep, 3 under (Standard zone blitz)
- Overload: Blitz one side, zone other (Create confusion)
- Simulated Pressure: Show blitz, drop into zone (Disguise)
- Delayed Blitz: LB waits, then rushes (Surprise pressure)

---

## Special Teams Philosophies (3)

### Aggressive Returns

| Property | Value |
|----------|-------|
| Focus | Return everything possible |
| Risk Level | High |

**Bonuses:**
- Return Yards: +5 average
- Return TD Chance: +3%
- Fair Catch Frequency: -40%

**Penalties:**
- Turnover Risk: +2%
- Starting Field Position Variance: High

**Ideal Personnel:** Elite speed returner, strong blocking, risk-tolerant players

---

### Conservative

| Property | Value |
|----------|-------|
| Focus | Ball security first |
| Risk Level | Low |

**Bonuses:**
- Turnover Risk: -3%
- Consistent Field Position: +5 yards average
- Muff/Fumble Chance: -50%

**Penalties:**
- Return Yards: -5 average
- Return TD Chance: -2%

**Ideal Personnel:** Sure-handed returner, good decision makers, ball security focus

---

### Coverage Specialist

| Property | Value |
|----------|-------|
| Focus | Elite coverage units |
| Risk Level | Medium |

**Bonuses:**
- Opponent Return Yards: -10 average
- Coverage Tackles: +25%
- Big Play Prevention: +20%

**Penalties:**
- Return Game: Neutral
- Special Teams Injuries: +5% (aggressive tackling)

**Ideal Personnel:** Fast coverage players, good tacklers, disciplined lane runners

---

## Archetype Scheme Affinities

### QB Archetypes

| Archetype | Perfect | Good | Neutral | Poor | Terrible |
|-----------|---------|------|---------|------|----------|
| Field General | west_coast | pro_style | spread, air_raid | power_run | - |
| Scrambler | spread | zone_run | west_coast, air_raid | pro_style, power_run | - |
| Dual-Threat | spread | zone_run | pro_style, west_coast | air_raid, power_run | - |
| Gunslinger | air_raid | spread | pro_style | west_coast, zone_run | power_run |
| Pocket Passer | pro_style | west_coast, air_raid | spread | power_run | zone_run |
| Game Manager | power_run | zone_run, pro_style | west_coast | spread | air_raid |

### RB Archetypes

| Archetype | Perfect | Good | Neutral | Poor | Terrible |
|-----------|---------|------|---------|------|----------|
| Power Back | power_run | pro_style | zone_run | west_coast, spread | air_raid |
| Speed Back | zone_run | spread | pro_style, west_coast | power_run, air_raid | - |
| Receiving Back | west_coast | spread, air_raid | pro_style, zone_run | power_run | - |
| All Purpose | pro_style | west_coast, spread | zone_run, power_run, air_raid | - | - |
| Bruiser | power_run | pro_style | - | zone_run, west_coast | spread, air_raid |

### WR Archetypes

| Archetype | Perfect | Good | Neutral | Poor | Terrible |
|-----------|---------|------|---------|------|----------|
| Deep Threat | air_raid | spread | pro_style | zone_run, west_coast | power_run |
| Possession | west_coast | pro_style | spread, air_raid | zone_run, power_run | - |
| Playmaker | spread | west_coast, pro_style | air_raid, zone_run | power_run | - |
| Slot | west_coast, spread | pro_style | air_raid | zone_run, power_run | - |
| Blocking WR | power_run, zone_run | pro_style | - | west_coast, spread | air_raid |

### Defensive Archetypes

| Archetype | Perfect | Good | Neutral | Poor |
|-----------|---------|------|---------|------|
| Speed Rusher | 4-3, man_blitz | cover_2, cover_3 | 3-4, zone_blitz | - |
| Power Rusher | 4-3 | 3-4, man_blitz | cover_2, cover_3 | zone_blitz |
| Run Stuffer | 4-3 | 3-4, cover_3 | cover_2 | man_blitz, zone_blitz |
| Nose Tackle | 3-4 | - | 4-3 | cover_2, cover_3, man_blitz, zone_blitz |
| Coverage LB | cover_2 | cover_3, zone_blitz | 4-3, 3-4 | man_blitz |
| Edge Rusher | 3-4, man_blitz | 4-3, zone_blitz | - | cover_2, cover_3 |
| Shutdown Corner | man_blitz | 4-3, 3-4 | cover_2 | cover_3, zone_blitz |
| Zone Corner | cover_2, cover_3 | zone_blitz | 4-3, 3-4 | man_blitz |
| Deep Safety | cover_2 | cover_3 | zone_blitz, 4-3, 3-4 | man_blitz |
| Box Safety | 4-3 | 3-4, cover_3 | cover_2, man_blitz | zone_blitz |

---

## Play Calling Tendencies

### Offensive Schemes

| Scheme | 1st & 10 | 2nd Short | 2nd Long | 3rd Short | 3rd Long | Red Zone | Goal Line |
|--------|----------|-----------|----------|-----------|----------|----------|-----------|
| West Coast | 55/45 | 50/50 | 70/30 | 45/55 | 85/15 | 55/45 | 40/60 |
| Spread | 60/40 | 55/45 | 75/25 | 50/50 | 90/10 | 60/40 | 50/50 |
| Pro Style | 50/50 | 45/55 | 65/35 | 40/60 | 80/20 | 50/50 | 35/65 |
| Air Raid | 70/30 | 65/35 | 85/15 | 60/40 | 95/5 | 65/35 | 55/45 |
| Power Run | 30/70 | 25/75 | 45/55 | 20/80 | 65/35 | 30/70 | 15/85 |
| Zone Run | 40/60 | 35/65 | 55/45 | 30/70 | 70/30 | 40/60 | 30/70 |

*Format: Pass/Run %*

---

## Summary

| Category | Count |
|----------|-------|
| Offensive Schemes | 6 |
| Defensive Schemes | 6 |
| ST Philosophies | 3 |
| Scheme Fit Levels | 5 |
| Scheme Families | 6 |
