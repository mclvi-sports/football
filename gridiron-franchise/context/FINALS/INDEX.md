# FINALS Folder Index

**Purpose:** Finalized game design documents - the authoritative source for all game systems.

**Total Files:** 13
**Last Updated:** December 2025

---

## File Index

| File | Lines | Category |
|------|-------|----------|
| FINAL-player-generation-system.md | ~2163 | Core |
| FINAL-roster-generation-system.md | ~816 | Core |
| FINAL-draft-class-system.md | ~800 | Core |
| FINAL-free-agent-pool-system.md | ~541 | Core |
| FINAL-traits-system.md | ~733 | Player |
| FINAL-badge-system.md | ~600 | Player |
| FINAL-salarycap.md | ~690 | Economy |
| FINAL-coaching-staff-system.md | ~700 | Staff |
| FINAL-scout-system.md | ~875 | Staff |
| FINAL-facilities-system.md | ~600 | Management |
| FINAL-gm-skills-perks-system.md | ~749 | Management |
| FINAL-season-calendar-system.md | ~1130 | Gameplay |
| sim-engine-v2.html | ~1705 | Reference |

---

## Document Summaries

### Core Generation Systems

#### FINAL-player-generation-system.md
**Status:** MASTER DOCUMENT
**Summary:** Complete player generation system with 70 archetypes across 18 positions. Defines all attributes (physical, mental, position-specific), jersey number rules, age/experience distribution, height/weight ranges, and attribute generation formulas. Players have primary + secondary archetypes that shape their attribute profiles.

**Key Data:**
- 18 positions (QB, RB, WR, TE, LT, LG, C, RG, RT, DE, DT, MLB, OLB, CB, FS, SS, K, P)
- 70 archetypes (e.g., Field General, Scrambler, Power Back, Deep Threat)
- OVR calculation weights by position
- Attribute ranges: 40-99

---

#### FINAL-roster-generation-system.md
**Status:** MASTER DOCUMENT
**Summary:** Defines 53-man roster template with exact position counts, depth chart slots, and OVR expectations per slot. Includes 5 team tiers (Elite, Good, Average, Below Average, Rebuilding) with different OVR distributions. Covers age balance, trait/badge allocation at team level.

**Key Data:**
- 53 active roster + 16 practice squad
- Position counts: 3 QB, 4 RB, 6 WR, 3 TE, 9 OL, 5 DE, 4 DT, 6 LB, 6 CB, 4 S, 1 K, 1 P
- Team tier OVR ranges: Elite (85-92), Good (80-87), Average (75-82), etc.

---

#### FINAL-draft-class-system.md
**Status:** MASTER DOCUMENT
**Summary:** Draft class generation with 275 prospects across 7 rounds. Defines OVR curves by round, potential distribution, trait revelation through scouting, and bust/steal probabilities. Includes combine events and pro day mechanics.

**Key Data:**
- 275 draft prospects (32 per round + compensatory)
- Round 1 OVR: 72-82, Round 7 OVR: 58-68
- Potential tiers: Superstar, Star, Starter, Backup, Bust Risk
- Bust rates: 15% (R1), 25% (R2-3), 35% (R4-5), 50% (R6-7)

---

#### FINAL-free-agent-pool-system.md
**Status:** MASTER DOCUMENT
**Summary:** Free agent market generation with 150-200 players. Defines quality distribution (mostly backups, few starters), age skew (older players), availability reasons (age, injury, character, cap casualty), and contract demand formulas.

**Key Data:**
- Pool size: 150-200 players
- OVR distribution: 3% at 80+, 35% at 65-69, etc.
- Age skew: 30% aged 28-30, 25% aged 31-33
- Higher negative trait rates than roster players

---

### Player Systems

#### FINAL-traits-system.md
**Status:** MASTER DOCUMENT
**Summary:** 44 traits across 7 categories affecting gameplay, development, chemistry, and contracts. Includes trait synergies, conflicts, visibility rules (hidden vs revealed by scouting), and trait evolution over career.

**Key Data:**
- 7 categories: Leadership, Work Ethic, On-Field, Durability, Contract, Clutch, Character
- 44 total traits with rarity percentages
- Synergy combos (e.g., Gym Rat + Focused = Workout Warrior)
- Trait acquisition/loss triggers

---

#### FINAL-badge-system.md
**Status:** MASTER DOCUMENT
**Summary:** 43 badges with 4 tiers (Bronze, Silver, Gold, Hall of Fame). Position-specific and universal badges that activate in specific game situations. Includes badge progression and XP requirements.

**Key Data:**
- 4 tiers: Bronze (+2-5), Silver (+4-8), Gold (+6-12), HoF (+9-15)
- Situational activation: Clutch, Red Zone, Prime Time, Playoffs
- Position-specific badges for each position group

---

### Economy Systems

#### FINAL-salarycap.md
**Status:** MASTER DOCUMENT
**Summary:** Complete salary cap mechanics including $225M base cap, rookie wage scale, veteran contracts, signing bonuses, restructures, franchise tags, and cap management strategies.

**Key Data:**
- Year 1 cap: $225M, 3% annual growth
- Cap floor: 90% ($202.5M)
- Rookie scale: R1 pick 1 = $54.5M/4yr, R7 = $3.5M/4yr
- Franchise tag values by position
- Contract restructure mechanics

---

### Staff Systems

#### FINAL-coaching-staff-system.md
**Status:** MASTER DOCUMENT
**Summary:** Coaching staff with HC, OC, DC, ST coordinators. Defines schemes (West Coast, Air Raid, 4-3, 3-4, etc.), coach attributes, XP progression, perks, and salary expectations. Includes coaching market and hiring competition.

**Key Data:**
- 4 coaching roles: HC, OC, DC, ST
- 6 offensive schemes, 5 defensive schemes
- Coach OVR: 60-99 with attribute breakdowns
- 3-tier perk system

---

#### FINAL-scout-system.md
**Status:** MASTER DOCUMENT
**Summary:** Scouting department with 1-5 scouts (Director, Area, Pro, National). Defines scouting attributes, accuracy by OVR, trait revelation, perk trees, and scouting point economy for draft evaluation.

**Key Data:**
- Scout roles: Director (required), Area (0-2), Pro (0-1), National (0-1)
- Department cost: $800K-$6M depending on size/quality
- Scouting points: 230-290/week per scout
- Report quality tiers based on scout OVR

---

### Management Systems

#### FINAL-facilities-system.md
**Status:** MASTER DOCUMENT
**Summary:** 8 facility types with 5 tiers each. Facilities provide bonuses to player development, injury recovery, scouting, and fan engagement. Funded by owner budget, not salary cap.

**Key Data:**
- 8 facilities: Training, Medical, Stadium, Practice, Film Room, Weight Room, Cafeteria, Team HQ
- 5 tiers: Basic → Elite
- Owner budget separate from salary cap
- Upgrade costs and timelines

---

#### FINAL-gm-skills-perks-system.md
**Status:** MASTER DOCUMENT
**Summary:** GM character system with 5 backgrounds (Scout, Coach, Agent, Executive, Analytics) and 5 archetypes (Builder, Trader, Developer, Negotiator, Talent Scout). Includes 8 skill categories with 3-tier perk trees and prestige system.

**Key Data:**
- 5 GM backgrounds with starting bonuses
- 5 GM archetypes with unique abilities
- 8 skill categories: Scouting, Drafting, Free Agency, Trading, Development, Contracts, Cap Management, Leadership
- Prestige system for career progression

---

### Gameplay Systems

#### FINAL-season-calendar-system.md
**Status:** MASTER DOCUMENT
**Summary:** Complete 40-week season calendar from offseason through playoffs. Defines all phases, deadlines, events, and activities. Covers free agency timing, draft, training camp, 18-game regular season, and 4-week playoffs.

**Key Data:**
- 40 weeks total: 12 offseason, 3 camp, 3 preseason, 18 regular, 4 playoffs
- Key deadlines: Franchise tag (Week 3), FA opens (Week 5), Draft (Week 12), Trade deadline (Week 27)
- Weekly schedule structure and practice focus options
- Playoff bracket structure (7 teams per conference)

---

### Reference Files

#### sim-engine-v2.html
**Status:** REFERENCE IMPLEMENTATION
**Summary:** HTML/JavaScript game simulation engine with detailed integration notes. Defines expected data structures for Player, Team, and game simulation. Includes trait/badge effect implementations and scheme modifiers.

**Key Data:**
- Expected Player object structure with all attributes
- Expected Team object structure with roster and depth chart
- Team OVR calculation formulas
- Trait effect implementations (Ice in Veins, Clutch, etc.)
- Badge tier bonuses

---

## Dev Tools Coverage

### Currently Implemented

| Generator | Uses FINALS |
|-----------|-------------|
| Roster Generator | player-generation, roster-generation |
| Draft Class Generator | draft-class-system |
| Free Agent Pool Generator | free-agent-pool-system |
| Full New Game Generator | All core systems |

### Not Yet in Dev Tools

| System | FINALS Doc |
|--------|------------|
| Coaching Staff Generator | FINAL-coaching-staff-system.md |
| Scout Department Generator | FINAL-scout-system.md |
| Facilities Generator | FINAL-facilities-system.md |

---

**Version:** 1.0
**Date:** December 2025
