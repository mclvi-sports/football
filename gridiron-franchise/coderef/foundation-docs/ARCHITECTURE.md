# Architecture

**Gridiron Franchise System Design**

Date: December 2025
Version: 0.1.0

---

## System Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React 19  │  │  Zustand    │  │    Service Worker       │  │
│  │  Components │  │   Store     │  │    (PWA Cache)          │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
│         │                │                                       │
│         └────────┬───────┘                                       │
│                  ▼                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Next.js App Router (Pages)                      ││
│  │  /(main)  /auth  /career  /dashboard                        ││
│  └──────────────────────────┬──────────────────────────────────┘│
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Next.js)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  API Routes         │  │  Server Components              │   │
│  │  /api/dev/*         │  │  (RSC with Supabase SSR)        │   │
│  └──────────┬──────────┘  └──────────────┬──────────────────┘   │
│             │                            │                       │
│             └────────────┬───────────────┘                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Game Logic Layer (src/lib/)                     ││
│  │  generators/  data/  types.ts  constants.ts                 ││
│  └──────────────────────────┬──────────────────────────────────┘│
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE (Backend)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  Auth Service       │  │  PostgreSQL Database            │   │
│  │  (User sessions)    │  │  (Game saves, user data)        │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Boundaries

### Layer 1: Presentation (`src/app/`, `src/components/`)

Handles all UI rendering and user interaction.

| Module | Responsibility |
|--------|----------------|
| `app/(main)/` | Main menu, settings, credits |
| `app/auth/` | Authentication flows |
| `app/career/` | Career creation wizard |
| `app/dashboard/` | Game interface (roster, draft, etc.) |
| `components/ui/` | Shadcn/UI primitives |
| `components/*/` | Feature-specific components |

### Layer 2: State Management (`src/stores/`)

Client-side state using Zustand.

| Store | Purpose |
|-------|---------|
| `career-store.ts` | Career creation wizard state |
| (planned) `game-store.ts` | Active game state |

### Layer 3: Game Logic (`src/lib/`)

Pure functions for game mechanics.

| Module | Responsibility |
|--------|----------------|
| `generators/` | Procedural generation (players, rosters, draft) |
| `data/` | Static game data (archetypes, traits, badges) |
| `types.ts` | Core TypeScript interfaces |
| `constants.ts` | Game constants (roster template, weights) |

### Layer 4: Backend Integration (`src/lib/supabase/`)

Supabase client setup and utilities.

| Module | Purpose |
|--------|---------|
| `client.ts` | Browser Supabase client |
| `server.ts` | Server-side Supabase client |
| `middleware.ts` | Auth session management |
| `auth.ts` | Auth helper functions |

---

## Data Flow

### Career Creation Flow

```
User selects background
        │
        ▼
┌───────────────────┐
│ career-store      │ setBackground(id)
└────────┬──────────┘
         │
         ▼
User selects archetype
         │
         ▼
┌───────────────────┐
│ career-store      │ setArchetype(id)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ gm-persona-utils  │ getSynergy(), calculateBonuses()
└────────┬──────────┘
         │
         ▼
User selects team
         │
         ▼
┌───────────────────┐
│ career-store      │ setTeam(team)
└────────┬──────────┘
         │
         ▼
Confirmation page shows complete persona
         │
         ▼
┌───────────────────┐
│ buildPersona()    │ → API → Supabase (save)
└───────────────────┘
```

### Player Generation Flow

```
generatePlayer(position, targetOVR, age)
        │
        ▼
┌───────────────────────┐
│ Select archetype      │ Based on position pool
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Generate attributes   │ Archetype-driven tiers → OVR values
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Generate physicals    │ Position-specific ranges
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Assign traits         │ Weighted random + conflict check
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Assign badges         │ Position + OVR-based
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Calculate overall     │ Position-weighted attribute sum
└───────────┬───────────┘
            │
            ▼
        Player object
```

---

## Stack Decisions

### Why Next.js 16 with App Router?

- **Server Components**: Reduce client JS bundle, better initial load
- **File-based routing**: Clear page organization
- **API Routes**: Built-in serverless functions for dev tools
- **PWA Support**: `next-pwa` integration for offline play

### Why Zustand over Redux?

- **Simplicity**: No boilerplate, direct state mutations
- **Size**: ~1KB vs Redux's larger footprint
- **TypeScript**: First-class inference without extra setup
- **Scope**: Game state is per-session, not global enterprise state

### Why Supabase?

- **Auth**: Built-in email/password, social login ready
- **PostgreSQL**: Full SQL for complex game data queries
- **Real-time**: Future multiplayer/league features
- **Row Level Security**: Secure game saves per user

### Why Shadcn/UI?

- **Ownership**: Components copied to codebase, not black-box npm package
- **Accessibility**: Radix UI primitives with proper ARIA
- **Customization**: Full control over styling via Tailwind
- **Consistency**: "new-york" variant provides cohesive design

---

## Key Design Patterns

### Archetype-Driven Generation

Players are generated based on archetypes that define attribute tier distributions:

```typescript
// Example: Power Back archetype
{
  primaryAttributes: { CAR: 'elite', TRK: 'elite', BTK: 'high' },
  secondaryAttributes: { SPD: 'mid', ELU: 'mid' },
  weakAttributes: { CTH: 'low', RTE: 'low' }
}
```

Tiers map to OVR ranges, creating realistic player profiles.

### Tier-Based Roster Generation

Teams have tiers (Elite → Rebuilding) that determine OVR distributions:

```typescript
ROSTER_TEMPLATE = [
  { position: 'QB', slot: 1, expected_ovr_offset: 0 },  // Starter
  { position: 'QB', slot: 2, expected_ovr_offset: -8 }, // Backup
  // ...
]
```

### Trait Conflict System

Traits have defined conflicts to prevent illogical combinations:

```typescript
conflicts: {
  'gym_rat': ['lazy'],
  'team_first': ['diva', 'money_motivated'],
  // ...
}
```

---

## Directory Structure Rationale

```
src/
├── app/                 # Next.js pages (file-based routing)
│   ├── (main)/          # Route group with shared layout
│   ├── api/             # API routes (serverless functions)
│   └── ...
├── components/          # React components
│   ├── ui/              # Shadcn primitives (Button, Card, etc.)
│   └── [feature]/       # Feature-specific (auth, career, dashboard)
├── lib/                 # Non-React code
│   ├── data/            # Static game data (traits, badges, archetypes)
│   ├── generators/      # Procedural generation functions
│   ├── supabase/        # Backend client setup
│   └── validations/     # Zod schemas
├── data/                # Application data (teams, personas)
├── stores/              # Zustand state stores
└── types/               # Shared TypeScript definitions
```

**Reasoning:**
- `lib/` = pure functions, testable without React
- `components/ui/` = reusable primitives
- `components/[feature]/` = composed feature components
- `data/` vs `lib/data/`: App data (teams) vs game rules (traits)

---

## AI Agent Notes

When modifying architecture:

1. **Game Logic Location**: All game rules in `src/lib/`, never in components
2. **Type Changes**: Update `src/lib/types.ts` first, then fix downstream
3. **New Pages**: Use App Router conventions, co-locate loading.tsx/error.tsx
4. **State Addition**: Prefer Zustand store over React useState for shared state
5. **FINALS Authority**: Design docs in `context/FINALS/` are authoritative

---

**Date:** December 2025
**Version:** 0.1.0
