# Components Reference

**Gridiron Franchise Component Library**

Framework: React 19 + Shadcn/UI
Version: 0.1.0

---

## Overview

Components follow Shadcn/UI conventions with Tailwind CSS styling. All components use the `cn()` utility for className merging.

```typescript
import { cn } from '@/lib/utils'
```

---

## UI Primitives (`src/components/ui/`)

Base components from Shadcn/UI. Do not modify directly.

### Button

```tsx
import { Button } from '@/components/ui/button'

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon

<Button variant="default" size="lg">
  Start Game
</Button>

<Button variant="outline" size="sm">
  Cancel
</Button>

<Button variant="ghost" size="icon">
  <Icon />
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Player Name</CardTitle>
    <CardDescription>QB - 88 OVR</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Player details...</p>
  </CardContent>
  <CardFooter>
    <Button>View Profile</Button>
  </CardFooter>
</Card>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Game Settings</DialogTitle>
      <DialogDescription>Configure your preferences</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="roster">
  <TabsList>
    <TabsTrigger value="roster">Roster</TabsTrigger>
    <TabsTrigger value="depth">Depth Chart</TabsTrigger>
  </TabsList>
  <TabsContent value="roster">
    {/* Roster content */}
  </TabsContent>
  <TabsContent value="depth">
    {/* Depth chart content */}
  </TabsContent>
</Tabs>
```

### Select

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

<Select onValueChange={setPosition}>
  <SelectTrigger>
    <SelectValue placeholder="Select position" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="QB">Quarterback</SelectItem>
    <SelectItem value="RB">Running Back</SelectItem>
    <SelectItem value="WR">Wide Receiver</SelectItem>
  </SelectContent>
</Select>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge'

// Variants: default, secondary, destructive, outline

<Badge>Starter</Badge>
<Badge variant="secondary">Backup</Badge>
<Badge variant="destructive">Injured</Badge>
```

### Progress

```tsx
import { Progress } from '@/components/ui/progress'

<Progress value={75} /> {/* 75% filled */}
```

### Sheet (Mobile Drawer)

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <MenuIcon />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    {/* Navigation items */}
  </SheetContent>
</Sheet>
```

---

## Feature Components

### Authentication (`src/components/auth/`)

#### SignInForm

Email/password sign in with validation.

```tsx
import SignInForm from '@/components/auth/sign-in-form'

<SignInForm />
```

Props: None (self-contained)

#### SignUpForm

Account creation with password strength indicator.

```tsx
import SignUpForm from '@/components/auth/sign-up-form'

<SignUpForm />
```

#### PasswordStrength

Visual password strength indicator.

```tsx
import PasswordStrength from '@/components/auth/password-strength'

<PasswordStrength password={password} />
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `password` | string | Password to evaluate |

---

### Menu (`src/components/menu/`)

#### MenuButtonPrimary

Main CTA button for primary actions.

```tsx
import MenuButtonPrimary from '@/components/menu/menu-button-primary'

<MenuButtonPrimary href="/career/load">
  Continue Career
</MenuButtonPrimary>
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `href` | string | Navigation target |
| `children` | ReactNode | Button text |
| `disabled` | boolean | Disable button |

#### MenuButtonSecondary

Secondary action buttons.

```tsx
import MenuButtonSecondary from '@/components/menu/menu-button-secondary'

<MenuButtonSecondary href="/career/new">
  New Career
</MenuButtonSecondary>
```

---

### Career (`src/components/career/`)

#### ArchetypeCard

Individual GM archetype display.

```tsx
import ArchetypeCard from '@/components/career/persona/archetype-card'

<ArchetypeCard
  archetype={archetypeData}
  isSelected={selectedId === archetypeData.id}
  onSelect={() => handleSelect(archetypeData.id)}
  hasSynergy={synergyCheck(archetypeData.id)}
/>
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `archetype` | GMArchetype | Archetype data object |
| `isSelected` | boolean | Selection state |
| `onSelect` | () => void | Selection handler |
| `hasSynergy` | boolean | Show synergy indicator |

#### BackgroundCard

GM background selection card.

```tsx
import BackgroundCard from '@/components/career/persona/background-card'

<BackgroundCard
  background={backgroundData}
  isSelected={selectedId === backgroundData.id}
  onSelect={() => handleSelect(backgroundData.id)}
/>
```

#### SynergyBadge

Synergy indicator badge.

```tsx
import SynergyBadge from '@/components/career/persona/synergy-badge'

<SynergyBadge synergy={synergyData} />
```

#### PersonaSummary

Complete persona display with all bonuses.

```tsx
import PersonaSummary from '@/components/career/persona/persona-summary'

<PersonaSummary persona={gmPersona} />
```

Props:
| Prop | Type | Description |
|------|------|-------------|
| `persona` | GMPersona | Complete persona object |

#### TeamCard

Team selection card.

```tsx
import TeamCard from '@/components/career/team-card'

<TeamCard
  team={teamData}
  isSelected={selectedTeam === teamData.id}
  onSelect={() => handleSelect(teamData)}
/>
```

#### TeamList

Grid of all NFL teams.

```tsx
import TeamList from '@/components/career/team-list'

<TeamList
  teams={allTeams}
  selectedTeam={selectedTeam}
  onSelectTeam={handleSelectTeam}
/>
```

---

### Dashboard (`src/components/dashboard/`)

#### TeamCard

Dashboard team info display.

```tsx
import TeamCard from '@/components/dashboard/team-card'

<TeamCard team={currentTeam} />
```

#### NavCard

Navigation information cards.

```tsx
import NavCard from '@/components/dashboard/nav-card'

<NavCard
  title="Roster"
  description="Manage your 53-man roster"
  href="/dashboard/roster"
  icon={<UsersIcon />}
/>
```

#### BottomTabBar

Fixed mobile navigation bar.

```tsx
import BottomTabBar from '@/components/dashboard/bottom-tab-bar'

<BottomTabBar />
```

Props: None (uses current route for active state)

---

### Dev Tools (`src/components/dev-tools/`)

#### PlayerCard

Individual player display for dev tools.

```tsx
import PlayerCard from '@/components/dev-tools/player-card'

<PlayerCard player={playerData} />
```

#### RosterPlayerCard

Compact player card for roster view.

```tsx
import RosterPlayerCard from '@/components/dev-tools/roster-player-card'

<RosterPlayerCard player={playerData} slot={1} />
```

---

## Utility Components

### ThemeProvider

Next Themes provider wrapper.

```tsx
// In layout.tsx
import { ThemeProvider } from '@/components/theme-provider'

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### ThemeToggle

Dark/light mode toggle button.

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

<ThemeToggle />
```

---

## Component Patterns

### State Management

Use Zustand for shared state, local useState for component-only state:

```tsx
// Shared state
import { useCareerStore } from '@/stores/career-store'

function Component() {
  const { archetype, setArchetype } = useCareerStore()
  // ...
}

// Local state
function Component() {
  const [isOpen, setIsOpen] = useState(false)
  // ...
}
```

### Conditional Classes

Always use `cn()` for conditional className:

```tsx
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'large' && 'large-classes'
)}>
```

### Form Handling

Use React Hook Form with Zod:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from '@/lib/validations/auth'

const form = useForm({
  resolver: zodResolver(signInSchema),
  defaultValues: { email: '', password: '' }
})
```

---

## AI Agent Notes

When creating components:

1. **Location**: Feature components in `src/components/[feature]/`
2. **Styling**: Use Tailwind classes, avoid inline styles
3. **Props**: Define TypeScript interfaces for all props
4. **State**: Zustand for shared, useState for local
5. **cn() Utility**: Always use for className composition
6. **Accessibility**: Include proper aria attributes

---

**Framework:** React 19 + Shadcn/UI
**Version:** 0.1.0
