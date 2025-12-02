# Player Generation System - User Guide

This guide documents the complete player generation system for Gridiron Franchise, including all data files, types, and generation logic.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [File Index](#file-index)
3. [Core Types](#core-types)
4. [Archetype System](#archetype-system)
5. [Attribute System](#attribute-system)
6. [Trait System](#trait-system)
7. [Badge System](#badge-system)
8. [Physical Measurables](#physical-measurables)
9. [OVR & Roster Generation](#ovr--roster-generation)
10. [Usage Examples](#usage-examples)

---

## System Overview

The player generation system creates realistic NFL-style players with:

- **70 Archetypes** across 18 positions
- **46 Traits** across 7 categories affecting gameplay, contracts, and team chemistry
- **40+ Badges** providing situational bonuses with 4 tiers (Bronze/Silver/Gold/HOF)
- **Physical Measurables** (height, weight, 40-yard dash) specific to position and archetype
- **Attribute Distribution** using Primary/Secondary/Tertiary tiers
- **Position-Specific OVR Ranges** for realistic roster depth

---

## File Index

### Data Files (`src/lib/data/`)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `archetype-templates.ts` | 70 archetype definitions with attribute tiers | `ARCHETYPE_TEMPLATES`, `POSITION_ARCHETYPES`, `ARCHETYPE_RARITY` |
| `traits.ts` | 46 trait definitions with effects and conflicts | `TRAITS`, `TRAITS_BY_RARITY`, `POSITIVE_TRAITS`, `NEGATIVE_TRAITS`, `traitsConflict()` |
| `badges.ts` | 40+ badge definitions with tier effects | `BADGES`, `getBadgesForPosition()`, `getBadgeCount()`, `BADGE_TIER_WEIGHTS` |
| `physical-ranges.ts` | Height/weight/40-time ranges per archetype | `POSITION_PHYSICAL_RANGES`, `ARCHETYPE_PHYSICAL_RANGES`, `generatePhysicals()`, `heightToString()` |
| `slot-ovr-tables.ts` | Position-specific OVR by depth chart slot | `SLOT_OVR_TABLES`, `TIER_MODIFIERS`, `calculateTargetOvr()` |

### Generator Files (`src/lib/generators/`)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `player-generator.ts` | Creates individual players | `generatePlayer()`, `loadNameDatabase()` |
| `roster-generator.ts` | Creates full team rosters | `generateTeamRoster()`, `generateLeagueRosters()`, `getRosterStats()` |

### Type Definitions (`src/lib/`)

| File | Purpose | Key Exports |
|------|---------|-------------|
| `types.ts` | Core type definitions | `Position`, `Archetype`, `Player`, `PlayerAttributes`, `Tier`, `TraitCategory`, `BadgeTier` |
| `constants.ts` | Roster template and archetype mappings | `ROSTER_TEMPLATE`, `POSITION_ARCHETYPES` |

### Test Scripts (`scripts/`)

| File | Purpose |
|------|---------|
| `generate-mock-roster.ts` | Test script to generate and display sample rosters |

---

## Core Types

### Position Enum (18 positions)

```typescript
enum Position {
  QB, RB, WR, TE,           // Offense - Skill
  LT, LG, C, RG, RT,        // Offense - Line
  DE, DT, MLB, OLB,         // Defense - Front 7
  CB, FS, SS,               // Defense - Secondary
  K, P                      // Special Teams
}
```

### Player Interface

```typescript
interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  archetype: Archetype;
  age: number;
  experience: number;        // Years in league (0-15+)
  height: number;            // in inches
  weight: number;            // in lbs
  fortyTime: number;         // 40-yard dash in seconds
  college: string;
  jerseyNumber: number;
  overall: number;           // 55-99
  potential: number;         // 0-99
  attributes: PlayerAttributes;
  traits: string[];          // Trait IDs
  badges: PlayerBadge[];     // {id, tier}
  contract?: { years: number; salary: number };
}
```

### Team Tiers

```typescript
enum Tier {
  Elite = 'elite',           // +5 to +8 OVR modifier
  Good = 'good',             // +3 to +5 OVR modifier
  Average = 'average',       // +0 to +2 OVR modifier
  BelowAverage = 'below_average', // -3 to 0 OVR modifier
  Rebuilding = 'rebuilding'  // -5 to -2 OVR modifier
}
```

---

## Archetype System

### Overview

Each position has 5-6 archetypes representing different playstyles. Archetypes determine:
- Which attributes are prioritized
- Physical measurable ranges
- Badge eligibility

### Archetypes by Position (70 total)

#### Offense

| Position | Archetypes |
|----------|------------|
| **QB** (6) | Pocket Passer, Dual Threat, Gunslinger, Field General, Scrambler, Game Manager |
| **RB** (6) | Power Back, Speed Back, Elusive Back, All-Purpose, Receiving Back, Bruiser |
| **WR** (6) | Deep Threat, Possession, Route Technician, Playmaker, Red Zone Threat, Slot Specialist |
| **TE** (6) | Receiving TE, Blocking TE, Hybrid TE, Seam Stretcher, Move TE, H-Back |
| **OL** (6) | Pass Protector, Road Grader, Technician, Mauler, Athletic OL, Balanced OL |

#### Defense

| Position | Archetypes |
|----------|------------|
| **DE** (6) | Speed Rusher, Power Rusher, Complete, Run Stuffer, Hybrid DE, Raw Athlete |
| **DT** (6) | Nose Tackle, Interior Rusher, Run Plugger, 3-Tech, Hybrid DT, Athletic DT |
| **LB** (6) | Field General LB, Run Stopper, Pass Rusher LB, Coverage LB, Hybrid LB, Athletic LB |
| **CB** (6) | Man Cover, Zone Cover, Ball Hawk CB, Physical, Slot Corner, Hybrid CB |
| **S** (6) | Free Safety, Strong Safety, Ball Hawk S, Hybrid S, Coverage S, Enforcer |

#### Special Teams

| Position | Archetypes |
|----------|------------|
| **K** (5) | Accurate K, Power K, Clutch K, Balanced K, Kickoff Specialist |
| **P** (5) | Accurate P, Power P, Directional, Balanced P, Hangtime |

### Attribute Tiers

Each archetype defines attributes as:

| Tier | Point Distribution | Description |
|------|-------------------|-------------|
| **Primary** | 50% | Elite attributes for this archetype |
| **Secondary** | 35% | Solid, above average |
| **Tertiary** | 15% | Weakness or less relevant |

**Example: Pocket Passer QB**
```typescript
{
  primary: ['SAC', 'MAC', 'TUP', 'AWR'],      // Short/Medium accuracy, pressure, awareness
  secondary: ['DAC', 'THP', 'PRC'],            // Deep accuracy, power, recognition
  tertiary: ['SPD', 'ACC', 'AGI', 'TOR', 'BSK'] // Mobility attributes
}
```

---

## Attribute System

### All Player Attributes (40+)

#### Physical (All Positions)
| Code | Name | Description |
|------|------|-------------|
| SPD | Speed | Straight-line speed |
| ACC | Acceleration | Time to reach top speed |
| AGI | Agility | Change of direction |
| STR | Strength | Power for blocks/tackles |
| JMP | Jumping | Vertical leap |
| STA | Stamina | Fatigue resistance |
| INJ | Injury | Injury resistance |

#### Mental (All Positions)
| Code | Name | Description |
|------|------|-------------|
| AWR | Awareness | Field awareness |
| PRC | Play Recognition | Reading plays |

#### Passing (QB)
| Code | Name | Description |
|------|------|-------------|
| THP | Throw Power | Arm strength |
| SAC | Short Accuracy | 0-20 yard accuracy |
| MAC | Medium Accuracy | 20-40 yard accuracy |
| DAC | Deep Accuracy | 40+ yard accuracy |
| TUP | Throw Under Pressure | Accuracy when pressured |
| TOR | Throw on Run | Accuracy while moving |
| BSK | Break Sack | Escaping sacks |

#### Carrying/Receiving (RB/WR/TE)
| Code | Name | Description |
|------|------|-------------|
| CAR | Carrying | Ball security |
| BTK | Break Tackle | Breaking tackles |
| TRK | Trucking | Running through defenders |
| ELU | Elusiveness | Avoiding tackles |
| JKM | Juke Move | Juke effectiveness |
| SPM | Spin Move | Spin effectiveness |
| SFA | Stiff Arm | Stiff arm power |
| CTH | Catching | Catch ability |
| SPC | Spectacular Catch | Difficult catches |
| CIT | Catch in Traffic | Catching with contact |
| RTE | Route Running | Route precision |
| REL | Release | Getting off press |
| RAC | Run After Catch | YAC ability |

#### Blocking (OL/TE)
| Code | Name | Description |
|------|------|-------------|
| PBK | Pass Block | Pass protection |
| RBK | Run Block | Run blocking |
| PBP | Pass Block Power | Strength in pass pro |
| PBF | Pass Block Finesse | Technique in pass pro |
| RBP | Run Block Power | Strength in run blocking |
| RBF | Run Block Finesse | Technique in run blocking |
| LBK | Lead Block | Blocking in space |
| IMP | Impact Block | Pancake potential |

#### Defense
| Code | Name | Description |
|------|------|-------------|
| TAK | Tackling | Tackle ability |
| HTP | Hit Power | Hit strength |
| BSH | Block Shedding | Getting off blocks |
| POW | Power Moves | Bull rush |
| FNM | Finesse Moves | Swim/spin moves |
| PRS | Pursuit | Chase angles |
| ZCV | Zone Coverage | Zone ability |
| MCV | Man Coverage | Man coverage ability |
| PRS | Press | Press coverage |

#### Special Teams
| Code | Name | Description |
|------|------|-------------|
| KOP | Kick Power | Leg strength |
| KAC | Kick Accuracy | Precision |
| PPW | Punt Power | Punt distance |
| PUA | Punt Accuracy | Punt placement |

---

## Trait System

### Overview

Traits represent personality, character, and intangibles. They affect:
- Gameplay performance
- Player development
- Team chemistry
- Contract negotiations
- Unique player stories

### Trait Categories (7)

| Category | Description | Count |
|----------|-------------|-------|
| Leadership | Locker room presence and mentoring | 6 |
| Work Ethic | Practice habits and improvement | 8 |
| On-Field | In-game mentality and focus | 7 |
| Durability | Physical resilience | 6 |
| Contract | Business and money attitudes | 6 |
| Clutch | Pressure performance | 7 |
| Character | Off-field behavior | 6 |

### Trait Rarity

| Rarity | Weight | Description |
|--------|--------|-------------|
| Common | 25% | Frequently appears |
| Uncommon | 12-15% | Moderately rare |
| Rare | 5-8% | Significant traits |
| Legendary | 2-3% | Elite, defining traits |

### Sample Traits

#### Leadership Traits
| Trait | Rarity | Effects |
|-------|--------|---------|
| Vocal Leader | Uncommon | +15% team morale, +10% chemistry |
| Veteran Mentor | Rare | +1 dev tier to 2 young players |
| Team First | Uncommon | +20% chemistry, -5% contract demands |
| Diva | Rare | -15% chemistry, +20% demands, +3 attributes when featured |

#### Work Ethic Traits
| Trait | Rarity | Effects |
|-------|--------|---------|
| Gym Rat | Uncommon | +10% physical XP, slower decline |
| Film Junkie | Uncommon | +15% mental XP |
| High Football IQ | Rare | +5% XP, faster scheme learning |
| Low Football IQ | Uncommon | -5% XP, slower scheme learning |

#### Clutch Traits
| Trait | Rarity | Effects |
|-------|--------|---------|
| Ice in Veins | Rare | +5 attributes in clutch moments |
| Clutch Gene | Legendary | +8 attributes in clutch moments |
| Chokes | Uncommon | -5 attributes in clutch moments |
| Comeback Artist | Rare | +5 attributes when trailing |

### Trait Conflicts

Certain traits cannot coexist:
- `Vocal Leader` conflicts with `Quiet`, `Diva`
- `Team First` conflicts with `Diva`, `Selfish`, `Money Motivated`
- `Gym Rat` conflicts with `Lazy`
- `High Football IQ` conflicts with `Low Football IQ`

---

## Badge System

### Overview

Badges provide situational attribute boosts when specific conditions are met. Unlike traits (permanent personality), badges activate during games.

### Badge Tiers

| Tier | Boost Range | Weight |
|------|-------------|--------|
| Bronze | +2 to +3 | 50% |
| Silver | +4 to +5 | 30% |
| Gold | +6 to +8 | 15% |
| Hall of Fame | +9 to +12 | 5% |

### Badge Types

| Type | Count | Description |
|------|-------|-------------|
| Universal | 12 | Available to all positions |
| Position-Specific | 28+ | Only for certain positions |

### Universal Badges (All Positions)

| Badge | Condition | HOF Effect |
|-------|-----------|------------|
| Clutch | Final 2 min / OT | +12 all attributes |
| Prime Time | National TV games | +7 OVR |
| Playoff Performer | Playoff games | +10 OVR |
| Home Field Hero | Home games | +7 OVR |
| Road Warrior | Away games | +5 OVR |
| Division Rival Killer | vs Division | +7 OVR |
| Weather Proof | Bad weather | +8 OVR |
| Underdog Mentality | When underdog | +8 OVR |
| Giant Slayer | vs Top teams | +7 OVR |
| 4th Quarter Closer | 4th quarter | +8 OVR |
| Big Game Player | Prime time | +8 OVR |
| Comeback Kid | Trailing games | +10 OVR |

### Position-Specific Badges (Examples)

#### QB Badges
| Badge | Condition |
|-------|-----------|
| Pocket Presence | In clean pocket |
| Escape Artist | Avoiding pressure |
| Deep Ball Specialist | 30+ yard throws |

#### RB Badges
| Badge | Condition |
|-------|-----------|
| Goal Line Back | Inside 5-yard line |
| Open Field Runner | Broken tackles |
| Red Zone Back | In red zone |

#### WR/TE Badges
| Badge | Condition |
|-------|-----------|
| Contested Catch | With defender |
| Deep Threat | 30+ yard routes |
| Red Zone Threat | In red zone |

#### Defensive Badges
| Badge | Condition |
|-------|-----------|
| Pass Rush Elite | Pass rushing |
| Ball Hawk | Interception opportunities |
| Blitz Specialist | When blitzing |

---

## Physical Measurables

### Overview

Each player has realistic physical measurements based on position and archetype:
- **Height** (in inches, displayed as feet'inches")
- **Weight** (in pounds)
- **40-Yard Dash** (in seconds)

### Position Ranges (Fallback)

| Position | Height | Weight | 40-Time |
|----------|--------|--------|---------|
| QB | 5'10"-6'6" | 195-245 lbs | 4.35-5.10s |
| RB | 5'8"-6'2" | 185-250 lbs | 4.30-4.75s |
| WR | 5'8"-6'5" | 175-235 lbs | 4.28-4.65s |
| TE | 6'1"-6'7" | 235-275 lbs | 4.50-4.95s |
| OT | 6'4"-6'8" | 305-340 lbs | 5.00-5.35s |
| OG | 6'2"-6'6" | 305-335 lbs | 5.10-5.40s |
| C | 6'1"-6'5" | 295-320 lbs | 5.05-5.35s |
| DE | 6'2"-6'6" | 250-300 lbs | 4.50-5.00s |
| DT | 6'0"-6'5" | 285-350 lbs | 4.85-5.30s |
| LB | 6'0"-6'4" | 225-265 lbs | 4.45-4.85s |
| CB | 5'9"-6'2" | 175-210 lbs | 4.30-4.55s |
| S | 5'10"-6'3" | 195-225 lbs | 4.35-4.60s |
| K/P | 5'10"-6'4" | 180-220 lbs | 4.60-5.20s |

### Archetype-Specific Ranges

Archetypes modify the ranges. Examples:

| Archetype | Height | Weight | 40-Time |
|-----------|--------|--------|---------|
| Speed Back | 5'8"-5'11" | 185-205 lbs | 4.30-4.45s |
| Power Back | 5'10"-6'1" | 220-250 lbs | 4.50-4.70s |
| Deep Threat WR | 5'10"-6'3" | 175-195 lbs | 4.28-4.42s |
| Possession WR | 6'0"-6'4" | 200-220 lbs | 4.45-4.60s |

---

## OVR & Roster Generation

### Slot OVR Tables

Each position has defined OVR ranges per depth chart slot:

#### Offensive Positions

| Position | Slot 1 | Slot 2 | Slot 3 | Slot 4+ |
|----------|--------|--------|--------|---------|
| QB | 78-95 | 68-78 | 58-70 | - |
| RB | 80-94 | 74-84 | 68-78 | 60-72 |
| WR | 82-96 | 78-88 | 74-84 | 62-72 |
| TE | 78-92 | 70-80 | 62-74 | - |
| OL | 78-95 | 66-78 | - | - |

#### Defensive Positions

| Position | Slot 1 | Slot 2 | Slot 3 | Slot 4+ |
|----------|--------|--------|--------|---------|
| DE | 80-94 | 76-86 | 70-80 | 62-72 |
| DT | 78-92 | 74-84 | 68-78 | 60-70 |
| MLB | 80-94 | 68-78 | - | - |
| OLB | 78-92 | 74-84 | 68-78 | 62-72 |
| CB | 80-94 | 76-86 | 72-82 | 64-74 |
| S | 78-92 | 70-80 | - | - |

### Tier Modifiers

Team quality affects all player OVRs:

| Tier | Min Modifier | Max Modifier |
|------|--------------|--------------|
| Elite | +5 | +8 |
| Good | +3 | +5 |
| Average | +0 | +2 |
| Below Average | -3 | 0 |
| Rebuilding | -5 | -2 |

### Roster Template (51 players)

| Position | Count |
|----------|-------|
| QB | 3 |
| RB | 4 |
| WR | 6 |
| TE | 3 |
| OL (LT, LG, C, RG, RT) | 10 (2 each) |
| DE | 4 |
| DT | 4 |
| MLB | 2 |
| OLB | 4 |
| CB | 5 |
| FS | 2 |
| SS | 2 |
| K | 1 |
| P | 1 |

---

## Usage Examples

### Generate a Single Player

```typescript
import { generatePlayer } from '@/lib/generators/player-generator';
import { Position } from '@/lib/types';

// Simple usage - position and target OVR
const player = generatePlayer(Position.QB, 85);

// With options
const player = generatePlayer({
  position: Position.WR,
  targetOvr: 88,
  archetype: Archetype.DeepThreat,
  age: 25,
  slot: 1
});
```

### Generate a Full Roster

```typescript
import { generateTeamRoster, getRosterStats } from '@/lib/generators/roster-generator';
import { Tier } from '@/lib/types';

// Generate roster for an elite team
const roster = generateTeamRoster('team-001', Tier.Elite);

// Get stats
const stats = getRosterStats(roster);
console.log(`Average OVR: ${stats.avgOvr}`);
console.log(`Average Age: ${stats.avgAge}`);
```

### Access Player Details

```typescript
const player = roster.players[0];

console.log(`${player.firstName} ${player.lastName}`);
console.log(`Position: ${player.position}, Archetype: ${player.archetype}`);
console.log(`OVR: ${player.overall}, Potential: ${player.potential}`);
console.log(`Age: ${player.age}, Experience: ${player.experience} years`);

// Physical measurements
import { heightToString, weightToString } from '@/lib/data/physical-ranges';
console.log(`Height: ${heightToString(player.height)}`);
console.log(`Weight: ${weightToString(player.weight)}`);
console.log(`40-Time: ${player.fortyTime.toFixed(2)}s`);

// Traits
import { TRAITS } from '@/lib/data/traits';
player.traits.forEach(traitId => {
  const trait = TRAITS.find(t => t.id === traitId);
  console.log(`Trait: ${trait?.name}`);
});

// Badges
import { BADGES } from '@/lib/data/badges';
player.badges.forEach(badge => {
  const badgeDef = BADGES.find(b => b.id === badge.id);
  console.log(`Badge: ${badgeDef?.name} (${badge.tier})`);
});
```

### Run Test Script

```bash
npx tsx scripts/generate-mock-roster.ts
```

This generates sample rosters for Elite, Average, and Rebuilding tiers with full output.

---

## Generation Algorithm

### Player Generation Flow

1. **Select Archetype** - Weighted random based on position
2. **Generate Identity** - Name, college, jersey number
3. **Calculate Age** - Based on slot (starters older, depth younger)
4. **Calculate Experience** - `age - 21`, clamped 0-15
5. **Generate Attributes** - Distribute points by tier (P/S/T)
6. **Generate Physical Measurements** - Based on archetype ranges
7. **Calculate Potential** - Age-based gap from current OVR
8. **Generate Traits** - 1-4 traits with conflict checking
9. **Generate Badges** - Based on OVR and experience

### Trait Generation Rules

- Players get 1-4 traits (weighted: 15% get 1, 40% get 2, 35% get 3, 10% get 4)
- Higher OVR players (85+) get an extra trait roll
- Lower OVR players (70-) have higher chance of negative traits
- Conflicting traits are filtered out
- Negative traits limited to 1 per player

### Badge Generation Rules

- Badge count based on OVR: 70- = 1, 71-79 = 1-2, 80-89 = 2-3, 90+ = 3-4
- Experience adds bonus badges: 5+ years = +1, 10+ years = +2
- Position-specific badges filtered by player position
- Tier weights: Bronze 50%, Silver 30%, Gold 15%, HOF 5%

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12 | Initial implementation with 70 archetypes, 46 traits, 40+ badges |
