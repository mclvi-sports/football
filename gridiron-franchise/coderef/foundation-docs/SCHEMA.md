# Schema Reference

**Gridiron Franchise Data Schema Documentation**

Date: December 2025
Schema Version: 0.1.0

---

## Overview

This document defines all TypeScript interfaces and data structures used in Gridiron Franchise. The primary type definitions are in `src/lib/types.ts` with GM-specific types in `src/types/gm-persona.ts`.

---

## Core Game Types

### Position

All 18 NFL positions.

```typescript
type Position =
  | 'QB' | 'RB' | 'WR' | 'TE'           // Offense Skill
  | 'LT' | 'LG' | 'C' | 'RG' | 'RT'     // Offensive Line
  | 'DE' | 'DT' | 'MLB' | 'OLB'         // Defensive Front
  | 'CB' | 'FS' | 'SS'                  // Secondary
  | 'K' | 'P'                           // Special Teams
```

### Tier

Team quality tiers for roster generation.

```typescript
type Tier = 'Elite' | 'Good' | 'Average' | 'Below Average' | 'Rebuilding'
```

| Tier | OVR Range | Description |
|------|-----------|-------------|
| Elite | 85-92 | Championship contender |
| Good | 80-87 | Playoff team |
| Average | 75-82 | .500 team |
| Below Average | 70-77 | Rebuilding |
| Rebuilding | 65-72 | Full rebuild |

---

## Player Schema

### Player

Complete player object.

```typescript
interface Player {
  id: string                    // UUID
  firstName: string
  lastName: string
  position: Position
  archetype: string             // e.g., 'field_general', 'power_back'
  age: number                   // 21-40
  experience: number            // Years in league
  height: number                // Inches (66-82)
  weight: number                // Pounds (175-365)
  fortyTime: number             // 40-yard dash (4.2-5.5)
  college: string
  jerseyNumber: number          // 0-99, position-specific rules
  overall: number               // 40-99
  potential: number             // 40-99
  attributes: PlayerAttributes
  traits: string[]              // Trait IDs
  badges: PlayerBadge[]
  contract?: Contract
}
```

### PlayerAttributes

All 40+ player attributes.

```typescript
interface PlayerAttributes {
  // Physical (all positions)
  SPD: number  // Speed
  ACC: number  // Acceleration
  AGI: number  // Agility
  STR: number  // Strength
  JMP: number  // Jump
  STA: number  // Stamina
  INJ: number  // Injury resistance

  // Mental (all positions)
  AWR: number  // Awareness
  PRC: number  // Play Recognition

  // Passing (QB)
  THP: number  // Throw Power
  SAC: number  // Short Accuracy
  MAC: number  // Medium Accuracy
  DAC: number  // Deep Accuracy
  TUP: number  // Throw Under Pressure
  TOR: number  // Throw on Run
  PAC: number  // Play Action
  BSK: number  // Break Sack

  // Rushing (RB, QB)
  CAR: number  // Carrying
  BTK: number  // Break Tackle
  TRK: number  // Trucking
  ELU: number  // Elusiveness
  SPM: number  // Spin Move
  JKM: number  // Juke Move
  SFA: number  // Stiff Arm
  VIS: number  // Ball Carrier Vision

  // Receiving (WR, TE, RB)
  CTH: number  // Catching
  CIT: number  // Catch in Traffic
  SPC: number  // Spectacular Catch
  RTE: number  // Route Running
  REL: number  // Release
  RAC: number  // Run After Catch
  SRR: number  // Short Route Running
  MRR: number  // Medium Route Running
  DRR: number  // Deep Route Running

  // Blocking (OL, TE)
  PBK: number  // Pass Block
  RBK: number  // Run Block
  IBL: number  // Impact Block
  PBP: number  // Pass Block Power
  PBF: number  // Pass Block Finesse
  RBP: number  // Run Block Power
  RBF: number  // Run Block Finesse
  LBK: number  // Lead Block

  // Defense
  TAK: number  // Tackling
  POW: number  // Power Moves
  PMV: number  // Pass Rush Power
  FMV: number  // Pass Rush Finesse
  BSH: number  // Block Shedding
  PUR: number  // Pursuit
  MCV: number  // Man Coverage
  ZCV: number  // Zone Coverage
  PRS: number  // Press

  // Special Teams
  KPW: number  // Kick Power
  KAC: number  // Kick Accuracy
  PPW: number  // Punt Power
  PUA: number  // Punt Accuracy

  // Intangibles
  CLU: number  // Clutch
  CON: number  // Consistency
}
```

### PlayerBadge

Badge with tier information.

```typescript
interface PlayerBadge {
  id: string                    // Badge identifier
  tier: 'bronze' | 'silver' | 'gold' | 'hof'
}
```

### Contract

Player contract details.

```typescript
interface Contract {
  years: number                 // 1-6
  salary: number                // Annual salary in dollars
  guaranteed: number            // Guaranteed money
  signingBonus?: number
}
```

---

## Roster Schema

### Roster

Team roster with depth chart.

```typescript
interface Roster {
  players: Player[]
  depthChart: Record<Position, string[]>  // Position → Player IDs in order
}
```

### RosterTemplate

Template for roster generation.

```typescript
interface RosterSlot {
  position: Position
  slot: number                  // 1 = starter, 2 = backup, etc.
  expected_ovr_offset: number   // Offset from tier baseline
}

// Example: 53-man roster template
const ROSTER_TEMPLATE: RosterSlot[] = [
  { position: 'QB', slot: 1, expected_ovr_offset: 0 },
  { position: 'QB', slot: 2, expected_ovr_offset: -8 },
  { position: 'QB', slot: 3, expected_ovr_offset: -15 },
  // ... 50 more slots
]
```

---

## Team Schema

### Team

Complete team object.

```typescript
interface Team {
  id: string                    // Abbreviation (e.g., 'KC')
  city: string                  // e.g., 'Kansas City'
  name: string                  // e.g., 'Chiefs'
  abbr: string                  // e.g., 'KC'
  conference: 'AFC' | 'NFC'
  division: 'North' | 'South' | 'East' | 'West'
  primaryColor: string          // Hex color
  secondaryColor: string        // Hex color
  tier: Tier
  roster: Roster
  overall: number               // Team OVR
  offense: number               // Offensive rating
  defense: number               // Defensive rating
}
```

---

## Trait Schema

### Trait

Player trait definition.

```typescript
interface Trait {
  id: string                    // Unique identifier
  name: string                  // Display name
  description: string
  category: TraitCategory
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare'
  isPositive: boolean
  effect: TraitEffect
  conflicts: string[]           // IDs of conflicting traits
  positions?: Position[]        // Position restrictions (null = all)
}

type TraitCategory =
  | 'leadership'
  | 'work_ethic'
  | 'on_field'
  | 'durability'
  | 'contract'
  | 'clutch'
  | 'character'

interface TraitEffect {
  attribute?: string            // Attribute to modify
  modifier?: number             // +/- value
  special?: string              // Special effect description
}
```

---

## Badge Schema

### Badge

Performance badge definition.

```typescript
interface Badge {
  id: string
  name: string
  description: string
  category: BadgeCategory
  positions: Position[]         // Applicable positions
  tiers: {
    bronze: BadgeTierEffect
    silver: BadgeTierEffect
    gold: BadgeTierEffect
    hof: BadgeTierEffect
  }
  activation: BadgeActivation
}

type BadgeCategory =
  | 'passing'
  | 'rushing'
  | 'receiving'
  | 'blocking'
  | 'defense'
  | 'special_teams'

interface BadgeTierEffect {
  bonus: number                 // Attribute bonus when active
  description: string
}

interface BadgeActivation {
  situation: string             // When badge activates
  frequency: 'always' | 'situational' | 'rare'
}
```

---

## GM Persona Schema

### GMPersona

Complete GM character.

```typescript
interface GMPersona {
  background: GMBackground
  archetype: GMArchetype
  synergy: GMSynergy | null
  bonuses: GMBonuses
  startingSkill: GMSkill
  skillDiscountCategory: SkillCategory
  skillDiscountPercent: number
}
```

### GMBackground

GM origin story.

```typescript
interface GMBackground {
  id: GMBackgroundId
  name: string
  icon: string                  // Emoji or icon identifier
  description: string
  bonuses: GMBonuses
  weakness: string
  bestPairedWith: GMArchetypeId[]
}

type GMBackgroundId =
  | 'former_player'
  | 'analytics_expert'
  | 'college_scout'
  | 'coaching_tree'
  | 'agent_specialist'
  | 'media_insider'
```

### GMArchetype

GM management style.

```typescript
interface GMArchetype {
  id: GMArchetypeId
  name: string
  icon: string
  philosophy: string
  bonuses: GMBonuses
  skill: GMSkill
  skillDiscountCategory: SkillCategory
}

type GMArchetypeId =
  | 'scout_guru'
  | 'cap_wizard'
  | 'trade_shark'
  | 'player_developer'
  | 'win_now_executive'
  | 'motivator'
```

### GMSynergy

Bonus when specific background + archetype combine.

```typescript
interface GMSynergy {
  id: GMSynergyId
  name: string
  description: string
  bonuses: GMBonuses
  requiredBackground: GMBackgroundId
  requiredArchetype: GMArchetypeId
}

type GMSynergyId =
  | 'the_mentor'
  | 'the_moneyball'
  | 'the_draft_whisperer'
  | 'the_dealmaker'
  | 'the_academy'
  | 'the_insider'
  | 'the_closer'
  | 'the_optimizer'
```

### GMBonuses

Quantified GM bonuses.

```typescript
interface GMBonuses {
  scoutingAccuracy: number      // -20 to +20
  contractNegotiation: number
  tradeAcceptance: number
  playerDevelopment: number
  teamMorale: number
  injuryRecovery: number
  draftPicks: number
  freeAgentInterest: number
}
```

### GMSkill

Unlockable GM ability.

```typescript
interface GMSkill {
  name: string
  tier: 1 | 2 | 3
  description: string
  category: SkillCategory
}

type SkillCategory =
  | 'scouting_draft'
  | 'contracts_money'
  | 'trades'
  | 'player_development'
  | 'team_management'
```

---

## Archetype Schema

### ArchetypeTemplate

Player archetype definition.

```typescript
interface ArchetypeTemplate {
  id: string
  name: string
  position: Position
  description: string
  primaryAttributes: Record<string, AttributeTier>
  secondaryAttributes: Record<string, AttributeTier>
  weakAttributes: Record<string, AttributeTier>
}

type AttributeTier = 'elite' | 'high' | 'mid' | 'low' | 'poor'
```

---

## Validation

### Zod Schemas

Example validation schemas:

```typescript
import { z } from 'zod'

const playerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  position: z.enum(['QB', 'RB', 'WR', ...]),
  age: z.number().int().min(21).max(45),
  overall: z.number().int().min(40).max(99),
  // ...
})

const rosterSchema = z.object({
  players: z.array(playerSchema).length(53),
  depthChart: z.record(z.array(z.string().uuid()))
})
```

---

## Relationships

```
Team (1) ─────────── (1) Roster
                          │
                          │ contains
                          ▼
                     Player (53)
                          │
                          ├── has ──► Traits (0-5)
                          ├── has ──► Badges (0-5)
                          └── has ──► Contract (0-1)

GMPersona (1) ─┬── has ──► Background (1)
               ├── has ──► Archetype (1)
               └── may ──► Synergy (0-1)
```

---

## AI Agent Notes

When modifying schemas:

1. **Primary Location**: `src/lib/types.ts` for game types
2. **GM Types**: `src/types/gm-persona.ts` for persona system
3. **Validation**: Add Zod schemas in `src/lib/validations/`
4. **FINALS Authority**: Schema must align with `context/FINALS/` docs
5. **Generator Impact**: Type changes require generator updates

---

**Date:** December 2025
**Schema Version:** 0.1.0
