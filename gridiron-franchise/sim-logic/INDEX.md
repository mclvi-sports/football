# Sim Logic Reference Files

This folder contains copies of the core simulation logic files from `src/lib/`.
Organized by importance tier (Tier 1 = most critical).

---

## Tier 1: Essential (Game Won't Run Without These)

| File | Purpose |
|------|---------|
| `simulator.ts` | **The engine** - runs actual game simulation |
| `player-generator.ts` | Creates all players with ratings/attributes |
| `teams.ts` | Defines all 32 teams - foundation of everything |
| `roster-generator.ts` | Populates teams with players |
| `season-simulator.ts` | Drives the week-to-week game loop |

---

## Tier 2: Core Mechanics (Game Broken Without These)

| File | Purpose |
|------|---------|
| `standings.ts` | Tracks W/L, playoff seeding |
| `schedule-generator.ts` | Creates the 18-week schedule |
| `playoffs.ts` | Bracket/postseason logic |
| `archetype-templates.ts` | Defines player archetypes (Speed WR, etc.) |
| `slot-ovr-tables.ts` | Balances team OVR by position |
| `physical-ranges.ts` | Height/weight/speed constraints |

---

## Tier 3: Important Systems (Core Features)

| File | Purpose |
|------|---------|
| `badges.ts` | Badge definitions |
| `badge-effects.ts` | Badge bonuses in simulation |
| `traits.ts` | Personality trait definitions |
| `trait-effects.ts` | Trait effects in gameplay |
| `contract-generator.ts` | Player salaries/cap management |
| `draft-generator.ts` | Rookie classes |
| `fa-generator.ts` | Free agent pool |

---

## Tier 4: Depth Features (Enhance Experience)

| File | Purpose |
|------|---------|
| `progression-engine.ts` | Player growth over time |
| `xp-calculator.ts` | XP earning rules |
| `training-integration.ts` | Weekly training effects |
| `scheme-data.ts` | Offensive/defensive playbooks |
| `scheme-modifiers.ts` | Scheme fit bonuses |

---

## Tier 5: Management Layer (RPG Elements)

| File | Purpose |
|------|---------|
| `coaching-generator.ts` | Coach creation |
| `coaching-modifiers.ts` | Coach bonuses |
| `facilities-generator.ts` | Stadium/training facilities |
| `facility-modifiers.ts` | Facility bonuses |
| `scouting-generator.ts` | Scout reports |
| `scouting-utils.ts` | Attribute reveal logic |
| `gm-generator.ts` | GM persona creation |
| `gm-skills.ts` | GM skill tree |
| `gm-personas.ts` | GM archetypes |

---

## Tier 6: Orchestration (Convenience)

| File | Purpose |
|------|---------|
| `full-game-generator.ts` | Orchestrates all generators |
| `league-generator.ts` | League structure setup |

---

## Quick Reference

**Holy Trinity:** `simulator.ts` + `player-generator.ts` + `teams.ts`

**Total Files:** 34

**Source Locations:**
- Core: `src/lib/sim/`, `src/lib/season/`
- Generators: `src/lib/generators/`, `src/lib/schedule/`
- Data: `src/lib/data/`
- Systems: `src/lib/coaching/`, `src/lib/facilities/`, `src/lib/scouting/`, `src/lib/schemes/`, `src/lib/training/`, `src/lib/gm/`
