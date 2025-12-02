# Gridiron Franchise

**NFL Franchise Management Simulation Game**

Version: 0.1.0
Date: December 2025
Maintainer: willh

---

## Overview

Gridiron Franchise is a mobile-first web application for NFL team franchise management simulation. Create a GM persona, select your team, and build a dynasty through drafting, free agency, and player development.

### Key Features

- **GM Persona System**: Choose from 6 backgrounds and 6 archetypes with synergy bonuses
- **70 Player Archetypes**: Across 18 NFL positions with unique attribute profiles
- **Full Roster Management**: 53-man rosters with depth charts
- **Draft System**: Scout and draft prospects with hidden potential
- **Free Agency**: Sign veterans to fill roster needs
- **Progressive Web App**: Mobile-first design with offline support

---

## Quickstart

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (for authentication)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd gridiron-franchise

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.6
- Local: http://localhost:3000
- Environments: .env.local
✓ Ready in 2.3s
```

### First Run

1. Open `http://localhost:3000`
2. Click "New Career" from main menu
3. Select GM background (Former Player, Analytics Expert, etc.)
4. Choose GM archetype (Scout Guru, Cap Wizard, etc.)
5. Pick your NFL team
6. Confirm and start playing

---

## Usage Examples

### Development Tools

Access dev tools at `/dashboard/dev-tools` to test generators:

```bash
# Generate a test roster via API
curl -X POST http://localhost:3000/api/dev/generate-roster \
  -H "Content-Type: application/json" \
  -d '{"tier": "Good"}'
```

### Available Team Tiers

| Tier | OVR Range | Description |
|------|-----------|-------------|
| Elite | 85-92 | Super Bowl contender |
| Good | 80-87 | Playoff team |
| Average | 75-82 | .500 team |
| Below Average | 70-77 | Rebuilding |
| Rebuilding | 65-72 | Full rebuild |

---

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components (Shadcn/UI based)
├── lib/           # Utilities, types, generators
├── data/          # Static game data (teams, personas)
├── stores/        # Zustand state management
└── types/         # TypeScript definitions
```

---

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: React 19 + Shadcn/UI + Tailwind CSS 4
- **State**: Zustand
- **Backend**: Supabase (auth + database)
- **PWA**: next-pwa for offline support

---

## Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Supabase connection fails**
- Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active

**PWA not updating**
- Clear browser cache and service worker
- Hard refresh with Ctrl+Shift+R

---

## AI Agent Notes

When working with this codebase:

1. **Type Safety**: All game data uses strict TypeScript interfaces in `src/lib/types.ts`
2. **FINALS Documents**: Authoritative game design specs in `context/FINALS/`
3. **Generators**: Player/roster generation in `src/lib/generators/`
4. **Component Patterns**: Use Shadcn/UI conventions with `cn()` utility
5. **State Management**: Career state in Zustand store at `src/stores/career-store.ts`

---

**Version:** 0.1.0
**Last Updated:** December 2025
