# Context Folder Index

Documentation, specifications, and mockups for Gridiron Franchise.

## Root Files

| File | Description |
|------|-------------|
| `architecture-plan.md` | System architecture overview |
| `game-elements-specification.md` | Core game elements and mechanics |
| `implementation-plan.md` | Development roadmap |
| `player-generation-system-guide.md` | Complete player generation guide |

---

## Folders

### `/coaching-staff`
| File | Description |
|------|-------------|
| `coaching-staff-system.md` | Coaching staff mechanics and hiring |

### `/draft` *(empty)*
Reserved for draft system documentation.

### `/facilities`
| File | Description |
|------|-------------|
| `facilities-system.md` | Team facilities and upgrades |

### `/financials` *(empty)*
Reserved for salary cap and financial systems.

### `/gameflows` *(empty)*
Reserved for game flow documentation.

### `/gm`
| File | Description |
|------|-------------|
| `gm-persona-creation-system.md` | GM persona creation flow |
| `gm-skills-perks-system.md` | GM skills, perks, and progression |

### `/mocks`
HTML mockups for UI screens.

| File | Description |
|------|-------------|
| `auth-screen-mockup.html` | Login/signup screens |
| `coach-profile-mockup.html` | Coach profile view |
| `football-simulator.html` | Game simulation UI |
| `game-menu-mockup.html` | Main game menu |
| `gm-persona-mockup.html` | GM persona creation |
| `new-career-mockup.html` | New career flow |
| `player-profile-mockup.html` | Player profile view |
| `roster-page-mockup.html` | Team roster view |

### `/players-and-roster`
| File | Description |
|------|-------------|
| `badges-system.md` | Player badge definitions |
| `FINAL-draft-class-system.md` | Draft class generation spec |
| `FINAL-free-agent-pool-system.md` | Free agent pool spec |
| `FINAL-player-generation-system.md` | Core player generation spec |
| `FINAL-roster-generation-system.md` | Team roster generation spec |
| `name-pools.csv` | First/last name pools |
| `positions-attributes-system.md` | Positions and attributes |
| `traits-system.md` | Player traits definitions |

### `/sim-logic`
| File | Description |
|------|-------------|
| `engine-upgrade-plan.md` | Simulation engine improvements |
| `sim-engine.html` | Interactive sim engine prototype |

### `/sql`
| File | Description |
|------|-------------|
| `setup_teams.sql` | Database schema for teams |

### `/support-staff`
| File | Description |
|------|-------------|
| `scout-system.md` | Scouting system mechanics |

### `/teams`
| File | Description |
|------|-------------|
| `football-teams.csv` | All 32 team definitions |
| `team-identities-outline.md` | Team identity and branding |

### `/ui`
| File | Description |
|------|-------------|
| `football-game-theme-spec.md` | Visual theme specification |
| `ui-ux-design-specification.md` | UI/UX design guidelines |

---

# Document Summaries & Commentary

## Root Files

### `architecture-plan.md`
**Status:** Early draft / Conceptual
**Summary:** High-level technical architecture for the app. Covers client/server split, database design (Supabase), authentication flow, and core data models.
**Commentary:** Generic architecture doc. Useful for initial planning but many details have evolved. The actual implementation uses Next.js App Router which isn't fully reflected here.

### `game-elements-specification.md`
**Status:** Comprehensive specification
**Summary:** Detailed game design document covering all core systems: team management, player attributes, simulation engine mechanics, seasonal progression, contracts/salary cap, drafting, free agency, and trading. Defines the "rules" of the football GM simulation.
**Commentary:** This is the game design bible. Very thorough. Should be referenced for any gameplay feature implementation. Some sections are aspirational (playoff brackets, awards) while core systems (roster, players) are well-defined.

### `implementation-plan.md`
**Status:** Outdated roadmap
**Summary:** Original development phases from Nov 2025. Lists MVP features, stretch goals, and timeline estimates.
**Commentary:** Largely superseded by actual development. The player generation system and dev tools are further along than this plan anticipated. Useful for historical context only.

### `player-generation-system-guide.md`
**Status:** CURRENT - Implemented
**Summary:** Complete technical guide for player generation including 70 archetypes, physical attribute ranges by position, attribute formulas, traits, and badges. This is the specification that was used to build the current player generator.
**Commentary:** This is the source of truth for player generation. The code in `src/lib/generators/player-generator.ts` implements this spec. Keep in sync with any changes.

---

## `/coaching-staff`

### `coaching-staff-system.md`
**Status:** Design complete, not implemented
**Summary:** Defines coaching staff roles (HC, OC, DC, position coaches), their attributes (scheme knowledge, player development, play calling), hiring/firing mechanics, and impact on team performance. Includes progression system.
**Commentary:** Well-designed system ready for implementation. Should integrate with roster generation (coach scheme affects player fit). Lower priority until core gameplay is solid.

---

## `/facilities`

### `facilities-system.md`
**Status:** Design complete, not implemented
**Summary:** Team facility upgrades (training center, medical, scouting, stadium). Each facility has levels (1-5) with costs and benefits. Affects player development, injury recovery, draft scouting, and revenue.
**Commentary:** Nice-to-have feature. Adds depth but not essential for MVP. Could be Phase 2-3 feature.

---

## `/gm`

### `gm-persona-creation-system.md`
**Status:** CURRENT - Partially implemented
**Summary:** The GM persona creation flow where players build their GM identity. Covers name/age selection, background choices (Playing Career, Front Office, Analytics), personality traits, and initial stat allocation.
**Commentary:** This was recently implemented (see `src/app/new-career/`). The UI mockup and system design are being followed. Core flow is working.

### `gm-skills-perks-system.md`
**Status:** Design complete, partially implemented
**Summary:** GM progression system with 5 skill trees (Talent Evaluation, Cap Management, Negotiation, Leadership, Analytics). Each tree has 3 tiers of perks. GMs earn XP from successful moves and unlock perks.
**Commentary:** Complements the persona creation. The perks provide meaningful gameplay bonuses. Ready for implementation once core career mode is stable.

---

## `/mocks`

All HTML mockups are visual references for UI implementation.

| Mockup | Status | Notes |
|--------|--------|-------|
| `auth-screen-mockup.html` | Reference | Clean auth UI design |
| `coach-profile-mockup.html` | Reference | Coach detail view |
| `football-simulator.html` | Prototype | Interactive sim engine demo |
| `game-menu-mockup.html` | Reference | Main menu design |
| `gm-persona-mockup.html` | IMPLEMENTED | Used for new career flow |
| `new-career-mockup.html` | IMPLEMENTED | Team selection UI |
| `player-profile-mockup.html` | Reference | Full player profile view |
| `roster-page-mockup.html` | IMPLEMENTED | Used for dev-tools roster view |

---

## `/players-and-roster`

### `badges-system.md`
**Status:** CURRENT - Implemented
**Summary:** 47 player badges across 7 categories (Physical, Mental, Leadership, etc.) with 4 tiers (Bronze, Silver, Gold, HoF). Each badge has specific effects on simulation.
**Commentary:** Fully implemented in `src/lib/data/badges.ts`. The badge assignment logic is in the player generator.

### `FINAL-player-generation-system.md`
**Status:** CURRENT - Implemented
**Summary:** Core player generation spec including attribute distribution, OVR calculation, archetype bonuses, age curves, and experience mapping. This is the foundation for all player creation.
**Commentary:** The authoritative spec for player generation. The "FINAL" prefix indicates this supersedes earlier drafts. Implemented in `player-generator.ts`.

### `FINAL-roster-generation-system.md`
**Status:** CURRENT - Implemented
**Summary:** 53-man roster template with position counts, depth chart slots, OVR expectations by slot, and team tier system (Elite/Good/Average/Below Average/Rebuilding). Includes trait and badge distribution guidelines.
**Commentary:** Used by `roster-generator.ts`. Very detailed with exact position counts and OVR ranges. Version 2.0 includes trait/badge balancing rules.

### `FINAL-draft-class-system.md`
**Status:** CURRENT - Implemented
**Summary:** Annual draft class generation (~275 prospects). Covers OVR by round, potential distribution, bust/steal mechanics, scouting uncertainty, and position distribution. 7 rounds + UDFAs.
**Commentary:** Implemented in `draft-generator.ts`. The bust/steal system adds replayability. Integrates with scout system for uncertainty.

### `FINAL-free-agent-pool-system.md`
**Status:** CURRENT - Implemented
**Summary:** Free agent market generation (150-200 players). Defines quality distribution (mostly backups), age skew (older), reasons for availability (injury, cap casualty, character), and contract expectations.
**Commentary:** Implemented in `fa-generator.ts`. The "why are they available" system adds narrative depth.

### `name-pools.csv`
**Status:** CURRENT - In use
**Summary:** 538 first names and 750 last names with rarity weights (common/uncommon). Used for procedural name generation.
**Commentary:** Good variety. Mix of traditional and modern football names. The rarity system prevents repetitive names.

### `positions-attributes-system.md`
**Status:** CURRENT - Implemented
**Summary:** Complete attribute definitions for all 18 positions. Shared attributes (physical, mental, intangibles) plus position-specific attributes. Includes attribute weights for OVR calculation.
**Commentary:** Foundation for the type system in `src/lib/types.ts`. The attribute weights guide how OVR is calculated. Includes development archetypes and age curves.

### `traits-system.md`
**Status:** CURRENT - Implemented
**Summary:** 40+ player traits across 7 categories (Leadership, Work Ethic, On-Field Mentality, etc.). Each trait has effects, conflicts, and rarity. Traits affect gameplay, development, and contracts.
**Commentary:** Implemented in `src/lib/data/traits.ts`. The conflict system prevents incompatible traits. Trait mentorship is a nice advanced feature for later.

---

## `/sim-logic`

### `engine-upgrade-plan.md`
**Status:** Future roadmap
**Summary:** 5-phase plan to upgrade sim engine from RNG to attribute-driven. Covers unit rating calculators, interaction resolvers (trenches, passing, running), situational AI (play calling), and tuning process.
**Commentary:** The current sim engine (`football-simulator.html`) is a prototype. This plan outlines the path to a deeper simulation. Important for making the game feel realistic.

### `sim-engine.html`
**Status:** Working prototype
**Summary:** Interactive HTML/JS simulation engine demo. Shows play-by-play game simulation with basic team stats.
**Commentary:** Useful for testing sim logic in isolation. Eventually needs to be ported to React/TypeScript and integrated with the actual player data.

---

## `/sql`

### `setup_teams.sql`
**Status:** Ready for use
**Summary:** Supabase SQL script to create `teams` table with all 32 teams. Includes RLS policy for public read access.
**Commentary:** Run this in Supabase SQL editor to set up the teams table. Matches `football-teams.csv` exactly. The team data is also hardcoded in `full-game-generator.ts` for offline use.

---

## `/support-staff`

### `scout-system.md`
**Status:** Design complete, not implemented
**Summary:** Comprehensive scouting system. Scout attributes (Talent Evaluation, Potential Assessment, Bust Detection, etc.), specializations (position/regional), perks (3 tiers), scouting budget, and report quality tiers.
**Commentary:** Very detailed system. The scouting accuracy affecting draft visibility is a good mechanic. Should integrate with draft class generation. Phase 2 feature.

---

## `/teams`

### `football-teams.csv`
**Status:** CURRENT - In use
**Summary:** All 32 teams with conference, division, city, nickname, abbreviation, and 3-color scheme (primary, secondary, accent) with hex values.
**Commentary:** Source of truth for team data. Atlantic (16 teams) and Pacific (16 teams) conferences, each with 4 divisions of 4 teams. Already implemented in `full-game-generator.ts` and `setup_teams.sql`.

### `team-identities-outline.md`
**Status:** OBSOLETE - Incomplete template
**Summary:** Empty template for 12 teams (not 32) with placeholder fields for colors, mascots, and rivalries.
**Commentary:** This was an early draft before the 32-team league was finalized. The `football-teams.csv` supersedes this. Can be deleted.

---

## `/ui`

### `football-game-theme-spec.md`
**Status:** CURRENT - In use
**Summary:** Complete CSS specification for "Sunday Lights Premium" theme. Covers color palette (dark/accent/status), gradients, shadows/glows, typography, component styles (cards, badges, buttons, tabs), glass morphism, and animations.
**Commentary:** This defines the visual language. The dark cinematic theme is implemented in the app's globals.css and Tailwind config. Reference this for any new UI components.

### `ui-ux-design-specification.md`
**Status:** CURRENT - Reference
**Summary:** Mobile-first UI/UX spec. Covers app entry flow (main menu, new game setup), 5-tab bottom navigation (Home, Team, Game, Moves, More), screen flow architecture, card components, gesture interactions, and screen states.
**Commentary:** The overall app structure follows this spec. The bottom tab navigation is implemented. Each tab section describes the expected screens and flows.

---

# Redundancy & Cleanup Notes

| Status | Files |
|--------|-------|
| **KEEP - Active** | All `FINAL-*.md` files, `player-generation-system-guide.md`, `football-teams.csv`, `name-pools.csv`, `badges-system.md`, `traits-system.md`, `positions-attributes-system.md`, `ui` folder, mockups |
| **KEEP - Future** | `coaching-staff-system.md`, `facilities-system.md`, `gm-skills-perks-system.md`, `scout-system.md`, `engine-upgrade-plan.md` |
| **DELETE Candidate** | `team-identities-outline.md` (obsolete, replaced by CSV) |
| **REVIEW** | `architecture-plan.md`, `implementation-plan.md` (may be outdated) |

---

*Last updated: December 1, 2025*
