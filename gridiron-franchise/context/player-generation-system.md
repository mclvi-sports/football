# Player Generation System - Master Document

## Overview

Players are generated using **archetypes** — templates that define what type of player they are. This creates distinct, recognizable player identities rather than random stat blobs.

### Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. ARCHETYPE          What type of player?                 │
│         ↓                                                   │
│  2. TARGET OVR         How good are they? (60-99)          │
│         ↓                                                   │
│  3. POTENTIAL          What's their ceiling?                │
│         ↓                                                   │
│  4. ATTRIBUTES         Distribute based on archetype        │
│         ↓                                                   │
│  5. TRAITS             Assign traits that fit archetype     │
│         ↓                                                   │
│  6. PHYSICAL           Height, weight, measurables          │
│         ↓                                                   │
│  7. IDENTITY           Name, age, college, etc.             │
└─────────────────────────────────────────────────────────────┘
```

---

## Attribute Tier System

Each archetype defines attributes as **Primary**, **Secondary**, or **Tertiary**.

| Tier | Code | Description | Point Allocation |
|------|------|-------------|------------------|
| Primary | P | Elite for the archetype | 50% of points |
| Secondary | S | Solid, above average | 35% of points |
| Tertiary | T | Weakness or irrelevant | 15% of points |

---

## OVR and Base Points

| OVR Range | Tier Name | Base Points | Description |
|-----------|-----------|-------------|-------------|
| 95-99 | Elite | 1050-1100 | Best in the league |
| 90-94 | Star | 950-1049 | Pro Bowl caliber |
| 85-89 | Quality Starter | 875-949 | Solid starter |
| 80-84 | Starter | 800-874 | Adequate starter |
| 75-79 | Low-End Starter | 725-799 | Fringe starter |
| 70-74 | Backup | 650-724 | Quality backup |
| 65-69 | Depth | 575-649 | Emergency depth |
| 60-64 | Fringe | 500-574 | Practice squad |

---

## Potential System

### Potential Gap by Age

| Age | Typical Gap | Notes |
|-----|-------------|-------|
| 21-22 | +8 to +15 | Rookies have most room |
| 23-24 | +5 to +12 | Still developing |
| 25-26 | +3 to +8 | Approaching prime |
| 27-29 | +0 to +4 | In prime, limited growth |
| 30+ | -2 to +2 | Decline phase |

### Potential Labels

| Gap | Label | Description |
|-----|-------|-------------|
| +15 or more | Superstar | Franchise-altering ceiling |
| +10 to +14 | Star | Pro Bowl potential |
| +5 to +9 | Starter | Can develop into quality starter |
| +1 to +4 | Limited | Near ceiling already |
| 0 or negative | Maxed Out | This is who they are |

---

# OFFENSE

---

## QUARTERBACK (QB)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Pocket Passer | 25% | Classic drop-back QB, accurate, limited mobility |
| Dual-Threat | 20% | Dangerous with arm and legs, extends plays |
| Gunslinger | 15% | Big arm, high risk/reward, makes wow throws |
| Field General | 10% | Elite processor, reads defenses, leader |
| Scrambler | 15% | Mobility-first, uses legs to create |
| Game Manager | 15% | Safe, consistent, won't lose you games |

### Attribute Templates

#### Pocket Passer
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SAC | P | | SPD | T |
| MAC | P | | ACC | T |
| DAC | S | | AGI | T |
| THP | S | | AWR | P |
| TUP | P | | PRC | S |
| TOR | T | | BSK | T |

#### Dual-Threat
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SAC | S | | SPD | P |
| MAC | S | | ACC | P |
| DAC | S | | AGI | P |
| THP | S | | AWR | S |
| TUP | S | | PRC | T |
| TOR | P | | BSK | P |

#### Gunslinger
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SAC | S | | SPD | T |
| MAC | S | | ACC | T |
| DAC | P | | AGI | T |
| THP | P | | AWR | T |
| TUP | S | | PRC | T |
| TOR | S | | BSK | T |

#### Field General
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SAC | P | | SPD | T |
| MAC | P | | ACC | T |
| DAC | S | | AGI | T |
| THP | S | | AWR | P |
| TUP | P | | PRC | P |
| TOR | S | | BSK | S |

#### Scrambler
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SAC | S | | SPD | P |
| MAC | T | | ACC | P |
| DAC | T | | AGI | P |
| THP | S | | AWR | T |
| TUP | T | | PRC | T |
| TOR | P | | BSK | P |

#### Game Manager
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SAC | P | | SPD | T |
| MAC | S | | ACC | T |
| DAC | T | | AGI | T |
| THP | T | | AWR | P |
| TUP | S | | PRC | P |
| TOR | T | | BSK | T |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Pocket Passer | 6'2" - 6'6" | 215-240 lbs | 4.85-5.10s |
| Dual-Threat | 6'0" - 6'4" | 210-230 lbs | 4.50-4.75s |
| Gunslinger | 6'2" - 6'5" | 220-245 lbs | 4.80-5.05s |
| Field General | 6'1" - 6'5" | 210-235 lbs | 4.75-5.00s |
| Scrambler | 5'10" - 6'2" | 195-215 lbs | 4.35-4.55s |
| Game Manager | 6'0" - 6'4" | 205-225 lbs | 4.80-5.05s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Pocket Passer | Film Junkie, Calm Under Pressure | Vocal Leader, High Football IQ |
| Dual-Threat | Playmaker, Elusive, Improviser | Clutch, Winner's Mentality |
| Gunslinger | Aggressive, Cannon Arm, Confident | Risk Taker, Showboat |
| Field General | Vocal Leader, Film Junkie, High Football IQ | Clutch, Mentor, Team First |
| Scrambler | Elusive, Playmaker, Speedster | Improviser, Aggressive |
| Game Manager | Consistent, Conservative, High Football IQ | Team First, Professional |

---

## RUNNING BACK (RB)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Power Back | 20% | Downhill runner, breaks tackles, wears down defense |
| Speed Back | 20% | Explosive home-run threat, one cut and go |
| Elusive Back | 20% | Makes defenders miss, jump cuts, shiftiness |
| All-Purpose | 15% | Does everything well, no major weakness |
| Receiving Back | 15% | Weapon in passing game, runs routes like WR |
| Bruiser | 10% | Short yardage specialist, punishes defenders |

### Attribute Templates

#### Power Back
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CAR | P |
| ACC | S | | BTK | P |
| AGI | T | | TRK | P |
| STR | P | | ELU | T |
| STA | P | | JKM | T |
| CTH | T | | SPM | T |
| RTE | T | | SFA | P |
| PBK | S | | VIS | S |

#### Speed Back
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | CAR | S |
| ACC | P | | BTK | T |
| AGI | P | | TRK | T |
| STR | T | | ELU | S |
| STA | S | | JKM | S |
| CTH | S | | SPM | S |
| RTE | T | | SFA | T |
| PBK | T | | VIS | P |

#### Elusive Back
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CAR | S |
| ACC | P | | BTK | T |
| AGI | P | | TRK | T |
| STR | T | | ELU | P |
| STA | S | | JKM | P |
| CTH | S | | SPM | P |
| RTE | S | | SFA | T |
| PBK | T | | VIS | S |

#### All-Purpose
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CAR | S |
| ACC | S | | BTK | S |
| AGI | S | | TRK | S |
| STR | S | | ELU | S |
| STA | S | | JKM | S |
| CTH | S | | SPM | S |
| RTE | S | | SFA | S |
| PBK | S | | VIS | S |

#### Receiving Back
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CAR | S |
| ACC | S | | BTK | T |
| AGI | P | | TRK | T |
| STR | T | | ELU | S |
| STA | S | | JKM | S |
| CTH | P | | SPM | T |
| RTE | P | | SFA | T |
| PBK | T | | VIS | S |

#### Bruiser
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | T | | CAR | P |
| ACC | S | | BTK | P |
| AGI | T | | TRK | P |
| STR | P | | ELU | T |
| STA | P | | JKM | T |
| CTH | T | | SPM | T |
| RTE | T | | SFA | P |
| PBK | S | | VIS | S |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Power Back | 5'10" - 6'2" | 220-240 lbs | 4.50-4.65s |
| Speed Back | 5'8" - 5'11" | 185-205 lbs | 4.30-4.45s |
| Elusive Back | 5'8" - 5'11" | 190-210 lbs | 4.40-4.55s |
| All-Purpose | 5'9" - 6'0" | 200-220 lbs | 4.45-4.60s |
| Receiving Back | 5'8" - 6'0" | 190-210 lbs | 4.40-4.55s |
| Bruiser | 5'10" - 6'1" | 230-250 lbs | 4.55-4.75s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Power Back | Trucking, Powerful, Tough | Durable, Team First |
| Speed Back | Speedster, Home Run Threat, Explosive | Playmaker, Big Play |
| Elusive Back | Elusive, Juke Master, Shifty | Playmaker, Quick Feet |
| All-Purpose | Versatile, Reliable, Consistent | Team First, Professional |
| Receiving Back | Soft Hands, Route Runner, Playmaker | Quick Feet, Elusive |
| Bruiser | Trucking, Powerful, Short Yardage | Tough, Durable, Physical |

---

## WIDE RECEIVER (WR)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Deep Threat | 20% | Blazing speed, stretches the field vertically |
| Possession | 20% | Reliable hands, moves chains, works middle |
| Route Technician | 15% | Creates separation with footwork, not speed |
| Playmaker | 15% | YAC monster, dangerous with ball in hands |
| Red Zone Threat | 15% | Big body, wins jump balls, TD machine |
| Slot Specialist | 15% | Quick, works underneath, avoids contact |

### Attribute Templates

#### Deep Threat
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | CTH | S |
| ACC | P | | CIT | T |
| AGI | S | | SPC | S |
| JMP | S | | REL | P |
| STR | T | | SRR | T |
| AWR | T | | MRR | S |
| RAC | S | | DRR | P |

#### Possession
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | P |
| ACC | S | | CIT | P |
| AGI | S | | SPC | S |
| JMP | S | | REL | S |
| STR | S | | SRR | S |
| AWR | P | | MRR | P |
| RAC | S | | DRR | T |

#### Route Technician
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | S |
| ACC | S | | CIT | S |
| AGI | P | | SPC | T |
| JMP | T | | REL | P |
| STR | T | | SRR | P |
| AWR | P | | MRR | P |
| RAC | S | | DRR | S |

#### Playmaker
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | CTH | S |
| ACC | P | | CIT | S |
| AGI | P | | SPC | T |
| JMP | T | | REL | S |
| STR | S | | SRR | S |
| AWR | S | | MRR | S |
| RAC | P | | DRR | T |

#### Red Zone Threat
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | T | | CTH | P |
| ACC | S | | CIT | P |
| AGI | T | | SPC | P |
| JMP | P | | REL | S |
| STR | P | | SRR | S |
| AWR | S | | MRR | S |
| RAC | T | | DRR | S |

#### Slot Specialist
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | P |
| ACC | P | | CIT | S |
| AGI | P | | SPC | T |
| JMP | T | | REL | S |
| STR | T | | SRR | P |
| AWR | S | | MRR | P |
| RAC | P | | DRR | T |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Deep Threat | 5'10" - 6'2" | 175-195 lbs | 4.28-4.42s |
| Possession | 6'0" - 6'3" | 200-220 lbs | 4.48-4.60s |
| Route Technician | 5'11" - 6'2" | 190-210 lbs | 4.45-4.58s |
| Playmaker | 5'9" - 6'1" | 185-205 lbs | 4.35-4.50s |
| Red Zone Threat | 6'2" - 6'5" | 215-235 lbs | 4.50-4.65s |
| Slot Specialist | 5'8" - 5'11" | 175-195 lbs | 4.40-4.55s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Deep Threat | Speedster, Deep Ball Tracker, Home Run | Explosive, Big Play |
| Possession | Reliable Hands, Chain Mover, Consistent | High Football IQ, Professional |
| Route Technician | Route Runner, Crisp Routes, Separator | High Football IQ, Film Junkie |
| Playmaker | YAC Monster, Elusive, Explosive | Playmaker, Aggressive |
| Red Zone Threat | Jump Ball King, Contested Catch, Physical | Clutch, Red Zone Threat |
| Slot Specialist | Quick Feet, Separator, Reliable | Elusive, RAC |

---

## TIGHT END (TE)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Receiving TE | 25% | Oversized receiver, matchup nightmare |
| Blocking TE | 20% | Extra lineman, road grader, old school |
| Hybrid TE | 20% | Does both well, complete tight end |
| Seam Stretcher | 15% | Athletic freak, attacks middle of field |
| Move TE | 10% | Lines up everywhere, creates mismatches |
| H-Back | 10% | Fullback/TE hybrid, versatile blocker |

### Attribute Templates

#### Receiving TE
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | P |
| ACC | S | | CIT | P |
| AGI | S | | REL | P |
| STR | S | | RTE | P |
| RBK | T | | AWR | S |
| PBK | T | | JMP | S |

#### Blocking TE
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | T | | CTH | T |
| ACC | T | | CIT | T |
| AGI | T | | REL | T |
| STR | P | | RTE | T |
| RBK | P | | AWR | S |
| PBK | P | | JMP | T |

#### Hybrid TE
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | S |
| ACC | S | | CIT | S |
| AGI | S | | REL | S |
| STR | S | | RTE | S |
| RBK | S | | AWR | S |
| PBK | S | | JMP | S |

#### Seam Stretcher
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | CTH | S |
| ACC | P | | CIT | S |
| AGI | S | | REL | S |
| STR | S | | RTE | P |
| RBK | T | | AWR | S |
| PBK | T | | JMP | P |

#### Move TE
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | P |
| ACC | P | | CIT | S |
| AGI | P | | REL | P |
| STR | S | | RTE | S |
| RBK | S | | AWR | P |
| PBK | S | | JMP | S |

#### H-Back
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | CTH | S |
| ACC | S | | CIT | T |
| AGI | S | | REL | T |
| STR | P | | RTE | T |
| RBK | P | | AWR | S |
| PBK | P | | JMP | T |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Receiving TE | 6'3" - 6'6" | 240-260 lbs | 4.55-4.70s |
| Blocking TE | 6'3" - 6'6" | 255-275 lbs | 4.75-4.95s |
| Hybrid TE | 6'3" - 6'5" | 245-265 lbs | 4.60-4.80s |
| Seam Stretcher | 6'4" - 6'7" | 240-260 lbs | 4.50-4.65s |
| Move TE | 6'2" - 6'5" | 235-255 lbs | 4.55-4.70s |
| H-Back | 6'1" - 6'4" | 250-270 lbs | 4.65-4.85s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Receiving TE | Mismatch, Soft Hands, Red Zone Threat | Playmaker, Reliable |
| Blocking TE | Pancake, Road Grader, Physical | Tough, Team First |
| Hybrid TE | Versatile, Reliable, Consistent | Team First, Professional |
| Seam Stretcher | Deep Threat, Athletic Freak, Mismatch | Speedster, Explosive |
| Move TE | Versatile, High Football IQ, Playmaker | Route Runner, Mismatch |
| H-Back | Lead Blocker, Versatile, Physical | Tough, Team First |

---

## OFFENSIVE LINE (OL)

### Positions: LT, LG, C, RG, RT

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Pass Protector | 25% | Anchor in pass pro, brick wall |
| Road Grader | 20% | Mauler in run game, creates holes |
| Technician | 20% | Fundamentals, positioning, hand fighting |
| Mauler | 15% | Overpowers defenders, nasty streak |
| Athletic | 10% | Can pull, reach blocks, versatile |
| Balanced | 10% | No weakness, solid all-around |

### Attribute Templates

#### Pass Protector
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| STR | S | | PBK | P |
| AGI | S | | PBP | P |
| AWR | P | | PBF | P |
| SPD | T | | RBK | S |
| ACC | T | | RBP | S |
| STA | S | | RBF | T |
| IBL | T | | LBK | T |

#### Road Grader
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| STR | P | | PBK | S |
| AGI | T | | PBP | S |
| AWR | S | | PBF | T |
| SPD | T | | RBK | P |
| ACC | T | | RBP | P |
| STA | P | | RBF | S |
| IBL | P | | LBK | S |

#### Technician
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| STR | S | | PBK | S |
| AGI | S | | PBP | S |
| AWR | P | | PBF | P |
| SPD | T | | RBK | S |
| ACC | T | | RBP | S |
| STA | S | | RBF | P |
| IBL | S | | LBK | S |

#### Mauler
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| STR | P | | PBK | S |
| AGI | T | | PBP | P |
| AWR | S | | PBF | T |
| SPD | T | | RBK | S |
| ACC | T | | RBP | P |
| STA | S | | RBF | T |
| IBL | P | | LBK | T |

#### Athletic
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| STR | S | | PBK | S |
| AGI | P | | PBP | S |
| AWR | S | | PBF | S |
| SPD | P | | RBK | S |
| ACC | P | | RBP | S |
| STA | S | | RBF | S |
| IBL | S | | LBK | P |

#### Balanced
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| STR | S | | PBK | S |
| AGI | S | | PBP | S |
| AWR | S | | PBF | S |
| SPD | S | | RBK | S |
| ACC | S | | RBP | S |
| STA | S | | RBF | S |
| IBL | S | | LBK | S |

### Physical Measurables by Position

| Position | Height | Weight | 40-Yard |
|----------|--------|--------|---------|
| LT | 6'4" - 6'8" | 305-330 lbs | 5.00-5.30s |
| LG | 6'2" - 6'6" | 305-335 lbs | 5.10-5.40s |
| C | 6'1" - 6'5" | 295-320 lbs | 5.05-5.35s |
| RG | 6'2" - 6'6" | 305-335 lbs | 5.10-5.40s |
| RT | 6'4" - 6'8" | 310-340 lbs | 5.05-5.35s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Pass Protector | Anchor, Quick Feet, Technician | Consistent, Professional |
| Road Grader | Pancake, Mauler, Physical | Tough, Nasty Streak |
| Technician | High Football IQ, Fundamentals, Consistent | Film Junkie, Mentor |
| Mauler | Nasty Streak, Pancake, Physical | Aggressive, Tough |
| Athletic | Versatile, Quick Feet, Mobile | Pulling Guard, Reach Blocker |
| Balanced | Consistent, Reliable, Professional | Team First, Mentor |

---

# DEFENSE

---

## DEFENSIVE END (DE)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Speed Rusher | 25% | Blazing first step, bends the edge |
| Power Rusher | 20% | Bull rush, overpowers tackles |
| Complete | 15% | Pass rush and run defense equally |
| Run Stuffer | 15% | Sets the edge, clogs lanes |
| Hybrid | 15% | Can stand up or hand down |
| Raw Athlete | 10% | Physical tools, needs development |

### Attribute Templates

#### Speed Rusher
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | PMV | S |
| ACC | P | | FMV | P |
| AGI | P | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | S | | PRC | T |

#### Power Rusher
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | PMV | P |
| ACC | S | | FMV | S |
| AGI | T | | BSH | P |
| STR | P | | PUR | S |
| STA | P | | TAK | S |
| AWR | S | | PRC | T |

#### Complete
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | PMV | S |
| ACC | S | | FMV | S |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | S | | PRC | S |

#### Run Stuffer
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | T | | PMV | S |
| ACC | T | | FMV | T |
| AGI | T | | BSH | P |
| STR | P | | PUR | P |
| STA | P | | TAK | P |
| AWR | S | | PRC | S |

#### Hybrid
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | PMV | S |
| ACC | S | | FMV | S |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | P | | PRC | S |

#### Raw Athlete
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | PMV | T |
| ACC | P | | FMV | T |
| AGI | S | | BSH | T |
| STR | P | | PUR | S |
| STA | S | | TAK | T |
| AWR | T | | PRC | T |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Speed Rusher | 6'2" - 6'5" | 250-270 lbs | 4.55-4.75s |
| Power Rusher | 6'3" - 6'6" | 270-295 lbs | 4.70-4.90s |
| Complete | 6'3" - 6'5" | 260-280 lbs | 4.65-4.85s |
| Run Stuffer | 6'3" - 6'6" | 275-300 lbs | 4.80-5.00s |
| Hybrid | 6'2" - 6'4" | 255-275 lbs | 4.60-4.80s |
| Raw Athlete | 6'3" - 6'6" | 255-280 lbs | 4.50-4.70s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Speed Rusher | Edge Threat, First Step, Motor | Relentless, Playmaker |
| Power Rusher | Bull Rush, Powerful, Anchor | Relentless, Physical |
| Complete | Versatile, Consistent, High Motor | Professional, Reliable |
| Run Stuffer | Run Stopper, Anchor, Physical | Tough, Disciplined |
| Hybrid | Versatile, High Football IQ, Scheme Fit | Reliable, Consistent |
| Raw Athlete | High Ceiling, Athletic Freak, Explosive | Project, Upside |

---

## DEFENSIVE TACKLE (DT)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Nose Tackle | 25% | Space eater, double team absorber |
| Interior Rusher | 20% | Gets pressure up the middle |
| Run Plugger | 20% | Stops the run, clogs lanes |
| 3-Tech | 15% | Penetrating tackle, disrupts |
| Hybrid | 10% | Can play any interior spot |
| Athletic | 10% | Rare movement skills for size |

### Attribute Templates

#### Nose Tackle
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | T | | PMV | S |
| ACC | T | | FMV | T |
| AGI | T | | BSH | P |
| STR | P | | PUR | T |
| STA | P | | TAK | S |
| AWR | S | | PRC | S |

#### Interior Rusher
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | PMV | P |
| ACC | S | | FMV | P |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | S | | PRC | T |

#### Run Plugger
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | T | | PMV | S |
| ACC | T | | FMV | T |
| AGI | T | | BSH | P |
| STR | P | | PUR | S |
| STA | P | | TAK | P |
| AWR | S | | PRC | S |

#### 3-Tech
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | PMV | S |
| ACC | P | | FMV | P |
| AGI | S | | BSH | S |
| STR | S | | PUR | P |
| STA | S | | TAK | S |
| AWR | S | | PRC | T |

#### Hybrid
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | PMV | S |
| ACC | S | | FMV | S |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | S | | PRC | S |

#### Athletic
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | PMV | S |
| ACC | P | | FMV | S |
| AGI | P | | BSH | T |
| STR | S | | PUR | S |
| STA | S | | TAK | T |
| AWR | T | | PRC | T |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Nose Tackle | 6'0" - 6'4" | 320-350 lbs | 5.15-5.45s |
| Interior Rusher | 6'1" - 6'4" | 285-310 lbs | 4.85-5.10s |
| Run Plugger | 6'1" - 6'4" | 305-335 lbs | 5.05-5.30s |
| 3-Tech | 6'1" - 6'5" | 280-305 lbs | 4.80-5.05s |
| Hybrid | 6'1" - 6'4" | 290-315 lbs | 4.95-5.20s |
| Athletic | 6'2" - 6'5" | 285-310 lbs | 4.75-4.95s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Nose Tackle | Anchor, Space Eater, Immovable | Tough, Durable |
| Interior Rusher | Interior Pressure, Disruptor, Quick | Motor, Relentless |
| Run Plugger | Run Stopper, Anchor, Gap Filler | Disciplined, Physical |
| 3-Tech | Penetrator, Disruptor, Quick First Step | Motor, Playmaker |
| Hybrid | Versatile, Scheme Fit, Consistent | Reliable, Professional |
| Athletic | Athletic Freak, Upside, Explosive | High Ceiling, Project |

---

## LINEBACKER (LB)

### Positions: MLB, OLB

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Run Stopper | 20% | Downhill thumper, fills gaps |
| Coverage LB | 20% | Can run with backs and tight ends |
| Pass Rusher | 15% | Edge presence, gets to QB |
| Field General | 15% | Makes calls, gets everyone lined up |
| Hybrid | 15% | Does everything adequately |
| Athletic | 15% | Rare tools, sideline to sideline |

### Attribute Templates

#### Run Stopper
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | T |
| ACC | S | | ZCV | T |
| AGI | T | | BSH | P |
| STR | P | | PUR | P |
| STA | S | | TAK | P |
| AWR | S | | PMV | S |
| PRC | S | | FMV | T |

#### Coverage LB
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | P |
| ACC | P | | ZCV | P |
| AGI | S | | BSH | T |
| STR | T | | PUR | S |
| STA | S | | TAK | S |
| AWR | P | | PMV | T |
| PRC | S | | FMV | T |

#### Pass Rusher
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | T |
| ACC | P | | ZCV | T |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | S | | PMV | P |
| PRC | T | | FMV | P |

#### Field General
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | S |
| ACC | S | | ZCV | S |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | P | | PMV | T |
| PRC | P | | FMV | T |

#### Hybrid
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | S |
| ACC | S | | ZCV | S |
| AGI | S | | BSH | S |
| STR | S | | PUR | S |
| STA | S | | TAK | S |
| AWR | S | | PMV | S |
| PRC | S | | FMV | S |

#### Athletic
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | S |
| ACC | P | | ZCV | S |
| AGI | P | | BSH | T |
| STR | S | | PUR | P |
| STA | S | | TAK | S |
| AWR | T | | PMV | T |
| PRC | T | | FMV | T |

### Physical Measurables by Position

| Position | Height | Weight | 40-Yard |
|----------|--------|--------|---------|
| MLB | 6'0" - 6'3" | 235-255 lbs | 4.60-4.80s |
| OLB | 6'1" - 6'4" | 230-255 lbs | 4.50-4.75s |

### Physical Measurables by Archetype

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Run Stopper | 6'0" - 6'3" | 240-260 lbs | 4.65-4.85s |
| Coverage LB | 6'0" - 6'2" | 225-245 lbs | 4.45-4.65s |
| Pass Rusher | 6'2" - 6'5" | 240-260 lbs | 4.50-4.70s |
| Field General | 6'0" - 6'3" | 235-255 lbs | 4.60-4.80s |
| Hybrid | 6'0" - 6'3" | 230-250 lbs | 4.55-4.75s |
| Athletic | 6'1" - 6'4" | 225-250 lbs | 4.40-4.60s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Run Stopper | Enforcer, Thumper, Sure Tackler | Physical, Tough |
| Coverage LB | Coverage Specialist, Ball Hawk, Quick | High Football IQ, Instincts |
| Pass Rusher | Edge Threat, Blitzer, First Step | Motor, Relentless |
| Field General | Vocal Leader, High Football IQ, Film Junkie | Mentor, QB of Defense |
| Hybrid | Versatile, Consistent, Scheme Fit | Reliable, Professional |
| Athletic | Sideline to Sideline, Explosive, Playmaker | High Ceiling, Instincts |

---

## CORNERBACK (CB)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Man Cover | 25% | Lockdown in man coverage, shadows WRs |
| Zone Cover | 20% | Reads QB, breaks on ball, zone master |
| Ball Hawk | 15% | Gambles for INTs, high risk/reward |
| Physical | 15% | Press coverage, jams receivers |
| Slot Corner | 15% | Works inside, quick feet |
| Hybrid | 10% | Can play man or zone equally |

### Attribute Templates

#### Man Cover
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | P |
| ACC | P | | ZCV | S |
| AGI | P | | PRS | P |
| STR | T | | CTH | S |
| STA | S | | PUR | S |
| AWR | S | | TAK | T |
| PRC | S | | POW | T |

#### Zone Cover
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | S |
| ACC | S | | ZCV | P |
| AGI | S | | PRS | T |
| STR | T | | CTH | P |
| STA | S | | PUR | S |
| AWR | P | | TAK | S |
| PRC | P | | POW | T |

#### Ball Hawk
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | S |
| ACC | P | | ZCV | S |
| AGI | S | | PRS | T |
| STR | T | | CTH | P |
| STA | S | | PUR | S |
| AWR | S | | TAK | T |
| PRC | P | | POW | T |

#### Physical
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | P |
| ACC | S | | ZCV | T |
| AGI | S | | PRS | P |
| STR | P | | CTH | S |
| STA | S | | PUR | S |
| AWR | S | | TAK | S |
| PRC | T | | POW | S |

#### Slot Corner
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | P |
| ACC | P | | ZCV | S |
| AGI | P | | PRS | S |
| STR | T | | CTH | S |
| STA | S | | PUR | S |
| AWR | S | | TAK | S |
| PRC | S | | POW | T |

#### Hybrid
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | S |
| ACC | S | | ZCV | S |
| AGI | S | | PRS | S |
| STR | S | | CTH | S |
| STA | S | | PUR | S |
| AWR | S | | TAK | S |
| PRC | S | | POW | S |

### Physical Measurables

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Man Cover | 5'11" - 6'2" | 185-205 lbs | 4.35-4.50s |
| Zone Cover | 5'10" - 6'1" | 185-205 lbs | 4.40-4.55s |
| Ball Hawk | 5'10" - 6'1" | 180-200 lbs | 4.35-4.50s |
| Physical | 6'0" - 6'3" | 195-215 lbs | 4.45-4.60s |
| Slot Corner | 5'9" - 5'11" | 180-195 lbs | 4.38-4.52s |
| Hybrid | 5'10" - 6'1" | 185-205 lbs | 4.40-4.55s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Man Cover | Lockdown, Shutdown, Mirror | Confident, Competitor |
| Zone Cover | Ball Hawk, Instincts, High Football IQ | Film Junkie, Reliable |
| Ball Hawk | Playmaker, Gambler, Pick Artist | Aggressive, Risk Taker |
| Physical | Press Specialist, Physical, Enforcer | Tough, Aggressive |
| Slot Corner | Quick Feet, Separator, Reliable | Consistent, High Football IQ |
| Hybrid | Versatile, Scheme Fit, Consistent | Reliable, Professional |

---

## SAFETY (S)

### Positions: FS, SS

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Free Safety | 25% | Center field, range, ball skills |
| Strong Safety | 20% | Box presence, run support, hitter |
| Hybrid | 20% | Can play either safety spot |
| Ball Hawk | 15% | Turnovers, playmaking |
| Enforcer | 10% | Big hitter, intimidator |
| Coverage | 10% | Can cover like a corner |

### Attribute Templates

#### Free Safety
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | S |
| ACC | P | | ZCV | P |
| AGI | S | | PRS | T |
| STR | T | | CTH | P |
| STA | S | | PUR | S |
| AWR | P | | TAK | S |
| PRC | P | | POW | T |

#### Strong Safety
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | S |
| ACC | S | | ZCV | S |
| AGI | S | | PRS | S |
| STR | P | | CTH | S |
| STA | S | | PUR | P |
| AWR | S | | TAK | P |
| PRC | S | | POW | P |

#### Hybrid
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | S |
| ACC | S | | ZCV | S |
| AGI | S | | PRS | S |
| STR | S | | CTH | S |
| STA | S | | PUR | S |
| AWR | S | | TAK | S |
| PRC | S | | POW | S |

#### Ball Hawk
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | S |
| ACC | P | | ZCV | S |
| AGI | S | | PRS | T |
| STR | T | | CTH | P |
| STA | S | | PUR | S |
| AWR | S | | TAK | T |
| PRC | P | | POW | T |

#### Enforcer
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | S | | MCV | T |
| ACC | S | | ZCV | T |
| AGI | T | | PRS | S |
| STR | P | | CTH | S |
| STA | S | | PUR | P |
| AWR | S | | TAK | P |
| PRC | T | | POW | P |

#### Coverage
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| SPD | P | | MCV | P |
| ACC | P | | ZCV | P |
| AGI | P | | PRS | S |
| STR | T | | CTH | S |
| STA | S | | PUR | S |
| AWR | S | | TAK | T |
| PRC | S | | POW | T |

### Physical Measurables by Position

| Position | Height | Weight | 40-Yard |
|----------|--------|--------|---------|
| FS | 5'11" - 6'2" | 195-215 lbs | 4.40-4.55s |
| SS | 6'0" - 6'3" | 205-225 lbs | 4.45-4.60s |

### Physical Measurables by Archetype

| Archetype | Height | Weight | 40-Yard |
|-----------|--------|--------|---------|
| Free Safety | 5'11" - 6'2" | 195-210 lbs | 4.38-4.52s |
| Strong Safety | 6'0" - 6'3" | 210-225 lbs | 4.48-4.62s |
| Hybrid | 6'0" - 6'2" | 200-220 lbs | 4.43-4.58s |
| Ball Hawk | 5'11" - 6'2" | 195-215 lbs | 4.40-4.55s |
| Enforcer | 6'0" - 6'3" | 210-230 lbs | 4.50-4.65s |
| Coverage | 5'10" - 6'1" | 190-210 lbs | 4.35-4.50s |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Free Safety | Range, Ball Hawk, Center Field | Instincts, High Football IQ |
| Strong Safety | Enforcer, Run Support, Physical | Tough, Intimidator |
| Hybrid | Versatile, Scheme Fit, Consistent | Reliable, Professional |
| Ball Hawk | Playmaker, Pick Artist, Gambler | Aggressive, Risk Taker |
| Enforcer | Big Hitter, Intimidator, Physical | Tough, Aggressive |
| Coverage | Lockdown, Coverage Specialist, Quick | Reliable, Consistent |

---

# SPECIAL TEAMS

---

## KICKER (K)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Accurate | 30% | High percentage, reliable |
| Power | 25% | Big leg, long field goals |
| Clutch | 20% | Ice in veins, pressure performer |
| Balanced | 15% | No weakness, solid all-around |
| Kickoff Specialist | 10% | Touchback machine |

### Attribute Templates

#### Accurate
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| KPW | S | | AWR | S |
| KAC | P | | CLU | S |
| KOP | T | | CON | P |

#### Power
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| KPW | P | | AWR | S |
| KAC | S | | CLU | S |
| KOP | P | | CON | S |

#### Clutch
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| KPW | S | | AWR | S |
| KAC | S | | CLU | P |
| KOP | T | | CON | S |

#### Balanced
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| KPW | S | | AWR | S |
| KAC | S | | CLU | S |
| KOP | S | | CON | S |

#### Kickoff Specialist
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| KPW | S | | AWR | T |
| KAC | T | | CLU | T |
| KOP | P | | CON | S |

### Physical Measurables

| Archetype | Height | Weight |
|-----------|--------|--------|
| Accurate | 5'9" - 6'1" | 175-200 lbs |
| Power | 6'0" - 6'4" | 200-225 lbs |
| Clutch | 5'10" - 6'2" | 180-210 lbs |
| Balanced | 5'10" - 6'2" | 185-210 lbs |
| Kickoff Specialist | 6'0" - 6'3" | 195-220 lbs |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Accurate | Consistent, Reliable, Focused | Professional, Calm |
| Power | Big Leg, Powerful, Strong | Confident, Aggressive |
| Clutch | Ice in Veins, Clutch, Pressure Performer | Calm Under Pressure, Confident |
| Balanced | Consistent, Reliable, Professional | Focused, Calm |
| Kickoff Specialist | Touchback King, Big Leg | Consistent, Reliable |

---

## PUNTER (P)

### Archetypes

| Archetype | Rarity | Description |
|-----------|--------|-------------|
| Accurate | 30% | Pin deep, coffin corner master |
| Power | 25% | Booming punts, flip the field |
| Directional | 20% | Places punts precisely |
| Balanced | 15% | No weakness, solid all-around |
| Hangtime | 10% | High punts, coverage gets there |

### Attribute Templates

#### Accurate
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| PPW | S | | AWR | S |
| PAC | P | | CON | P |

#### Power
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| PPW | P | | AWR | S |
| PAC | S | | CON | S |

#### Directional
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| PPW | S | | AWR | P |
| PAC | P | | CON | S |

#### Balanced
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| PPW | S | | AWR | S |
| PAC | S | | CON | S |

#### Hangtime
| Attribute | Tier | | Attribute | Tier |
|-----------|------|-|-----------|------|
| PPW | P | | AWR | S |
| PAC | S | | CON | S |

### Physical Measurables

| Archetype | Height | Weight |
|-----------|--------|--------|
| Accurate | 5'11" - 6'2" | 190-215 lbs |
| Power | 6'1" - 6'5" | 210-235 lbs |
| Directional | 6'0" - 6'3" | 200-225 lbs |
| Balanced | 6'0" - 6'3" | 200-220 lbs |
| Hangtime | 6'1" - 6'4" | 205-230 lbs |

### Trait Affinities

| Archetype | High Affinity | Medium Affinity |
|-----------|---------------|-----------------|
| Accurate | Coffin Corner, Consistent, Reliable | Focused, Professional |
| Power | Big Leg, Powerful | Confident, Strong |
| Directional | Precision, High Football IQ | Consistent, Reliable |
| Balanced | Consistent, Reliable, Professional | Focused, Calm |
| Hangtime | Sky Punter, Consistent | Reliable, Calm |

---

# APPENDIX

---

## Generation Algorithm Summary

### Step 1: Select Archetype
Roll based on position rarity table.

### Step 2: Determine OVR
Based on roster need or random within tier.

### Step 3: Calculate Base Points
Use OVR-to-points table.

### Step 4: Distribute Points
- Primary attributes: 50% of points
- Secondary attributes: 35% of points
- Tertiary attributes: 15% of points

### Step 5: Apply Variance
±3 to each attribute (min 40, max 99).

### Step 6: Calculate Final OVR
Use position-specific weights from `positions-attributes-system.md`.

### Step 7: Determine Potential
Based on age, roll gap from table.

### Step 8: Assign Traits
- 1-2 traits from High Affinity (40% chance each)
- 0-1 traits from Medium Affinity (25% chance each)
- 20% chance of bonus random trait

### Step 9: Generate Physical
Roll within archetype ranges.

### Step 10: Generate Identity
Name, age, college, draft info from pools.

---

## Attribute Quick Reference

### Offense
| Code | Attribute | Positions |
|------|-----------|-----------|
| SAC | Short Accuracy | QB |
| MAC | Medium Accuracy | QB |
| DAC | Deep Accuracy | QB |
| THP | Throw Power | QB |
| TUP | Throw Under Pressure | QB |
| TOR | Throw on Run | QB |
| BSK | Break Sacks | QB |
| CAR | Carrying | RB |
| BTK | Break Tackle | RB |
| TRK | Trucking | RB |
| ELU | Elusiveness | RB |
| JKM | Juke Move | RB |
| SPM | Spin Move | RB |
| SFA | Stiff Arm | RB |
| VIS | Vision | RB |
| CTH | Catching | RB, WR, TE |
| RTE | Route Running | RB, TE |
| CIT | Catch in Traffic | WR, TE |
| SPC | Spectacular Catch | WR |
| REL | Release | WR, TE |
| SRR | Short Route Running | WR |
| MRR | Medium Route Running | WR |
| DRR | Deep Route Running | WR |
| RAC | Run After Catch | WR |
| PBK | Pass Blocking | RB, TE, OL |
| RBK | Run Blocking | TE, OL |
| PBP | Pass Block Power | OL |
| PBF | Pass Block Finesse | OL |
| RBP | Run Block Power | OL |
| RBF | Run Block Finesse | OL |
| IBL | Impact Blocking | OL |
| LBK | Lead Block | OL |

### Defense
| Code | Attribute | Positions |
|------|-----------|-----------|
| PMV | Power Moves | DL, LB |
| FMV | Finesse Moves | DL, LB |
| BSH | Block Shedding | DL, LB |
| PUR | Pursuit | DL, LB, DB |
| TAK | Tackling | DL, LB, DB |
| MCV | Man Coverage | LB, DB |
| ZCV | Zone Coverage | LB, DB |
| PRS | Press Coverage | DB |
| POW | Hit Power | DB |

### Shared
| Code | Attribute | Positions |
|------|-----------|-----------|
| SPD | Speed | All |
| ACC | Acceleration | All |
| AGI | Agility | All |
| STR | Strength | All |
| STA | Stamina | All |
| AWR | Awareness | All |
| PRC | Play Recognition | QB, DL, LB, DB |
| JMP | Jumping | WR, TE, DB |
| CLU | Clutch | K |
| CON | Consistency | K, P |

### Special Teams
| Code | Attribute | Positions |
|------|-----------|-----------|
| KPW | Kick Power | K |
| KAC | Kick Accuracy | K |
| KOP | Kickoff Power | K |
| PPW | Punt Power | P |
| PAC | Punt Accuracy | P |

---

## Full Position List

| Position | Code | Group |
|----------|------|-------|
| Quarterback | QB | Offense |
| Running Back | RB | Offense |
| Wide Receiver | WR | Offense |
| Tight End | TE | Offense |
| Left Tackle | LT | Offense |
| Left Guard | LG | Offense |
| Center | C | Offense |
| Right Guard | RG | Offense |
| Right Tackle | RT | Offense |
| Defensive End | DE | Defense |
| Defensive Tackle | DT | Defense |
| Outside Linebacker | OLB | Defense |
| Middle Linebacker | MLB | Defense |
| Cornerback | CB | Defense |
| Free Safety | FS | Defense |
| Strong Safety | SS | Defense |
| Kicker | K | Special Teams |
| Punter | P | Special Teams |

---

## Archetype Count Summary

| Position | Archetypes |
|----------|------------|
| QB | 6 |
| RB | 6 |
| WR | 6 |
| TE | 6 |
| OL | 6 |
| DE | 6 |
| DT | 6 |
| LB | 6 |
| CB | 6 |
| S | 6 |
| K | 5 |
| P | 5 |
| **Total** | **70** |

---

**Status:** Master Player Generation Document Complete
**Positions Covered:** 18 (all positions)
**Archetypes Defined:** 70 across all positions
**Version:** 1.0
**Date:** November 2025
