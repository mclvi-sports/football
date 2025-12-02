# Game Menu Implementation

**Workorder:** WO-GAME-MENU-001
**Status:** Complete
**Commit:** pending

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/(main)/page.tsx` | Main game menu with career navigation |
| `/settings` | `src/app/(main)/settings/page.tsx` | Settings placeholder page |
| `/credits` | `src/app/(main)/credits/page.tsx` | Credits placeholder page |

## File Structure

```
src/
├── app/(main)/
│   ├── layout.tsx              # Shared layout with logo/branding
│   ├── page.tsx                # Main menu with career buttons
│   ├── settings/
│   │   └── page.tsx            # Settings placeholder
│   └── credits/
│       └── page.tsx            # Credits placeholder
└── components/menu/
    ├── menu-button-primary.tsx   # Continue Career button (blue)
    ├── menu-button-secondary.tsx # New/Load Career buttons (dark)
    └── menu-footer.tsx           # Settings, Credits, version tag
```

## Components

### MenuButtonPrimary
Primary call-to-action button for continuing an active career.

```tsx
<MenuButtonPrimary
  title="Continue Career"
  subtitle="Week 4 vs. Miami Sharks"
  href="/career"
  icon="▶"  // optional, defaults to ▶
/>
```

**Props:**
- `title` (string) - Main button text
- `subtitle` (string, optional) - Secondary text showing game state
- `href` (string) - Navigation target
- `icon` (ReactNode, optional) - Right-side icon

**Styling:** Blue gradient background, white text, 20px padding, rounded-2xl

### MenuButtonSecondary
Secondary navigation buttons for New Career and Load Career.

```tsx
<MenuButtonSecondary
  label="New Career"
  icon="⊕"
  href="/career/new"
/>
```

**Props:**
- `label` (string) - Button text
- `icon` (ReactNode) - Left-side icon in dark box
- `href` (string) - Navigation target

**Styling:** Dark zinc background, border, 40x40 icon container, rounded-2xl

### MenuFooter
Footer with Settings, Credits buttons and version tag.

```tsx
<MenuFooter version="v0.1.0-alpha" />
```

**Props:**
- `version` (string, optional) - Version string, defaults to "v0.1.0-alpha"

**Contains:**
- 2-column grid of footer buttons
- Version tag centered below

## User Flow

```
/auth (Sign In)
    ↓ success
/ (Main Menu)
    ├── Continue Career → /career (not implemented)
    ├── New Career → /career/new (not implemented)
    ├── Load Career → /career/load (not implemented)
    ├── Settings → /settings (placeholder)
    └── Credits → /credits (placeholder)
```

## Design Specifications

### Layout
- Max width: 400px
- Padding: 24px horizontal, 48-64px vertical
- Logo: 72x72px with blue gradient background
- Title: 28px font-bold

### Colors (CSS Variables)
- `--bg-primary`: #09090b (background)
- `--bg-secondary`: #18181b (zinc-900)
- `--border`: #27272a (zinc-800)
- `--accent`: #3b82f6 (blue-500)
- `--accent-hover`: #2563eb (blue-600)

### Button Styles
| Type | Background | Border | Padding | Border Radius |
|------|------------|--------|---------|---------------|
| Primary | blue-500 | none | 20px | 16px |
| Secondary | zinc-900 | zinc-800 | 18px 20px | 16px |
| Footer | transparent | none | 12px | none |

## Mock Data

The main menu page currently uses hardcoded placeholder data:

```tsx
const hasActiveCareeer = true;
const currentWeek = 4;
const currentOpponent = "Miami Sharks";
```

**TODO:** Replace with actual career data from LeagueStore when implemented.

## Dependencies

- `next/link` - Client-side navigation
- No external dependencies beyond Next.js

## Related Features

- **Auth UI** (WO-AUTH-UI-001) - Sign in redirects to this menu
- **Career Mode** (future) - Will provide actual game state data
- **Settings** (future) - Full settings implementation
- **Credits** (future) - Full credits with attributions

## Next Steps

- [ ] Implement career data fetching from LeagueStore
- [ ] Create /career route group for game screens
- [ ] Implement Settings page with audio/display options
- [ ] Add user account management to Settings
- [ ] Hide "Continue Career" when no active career exists
- [ ] Add loading states for career data
