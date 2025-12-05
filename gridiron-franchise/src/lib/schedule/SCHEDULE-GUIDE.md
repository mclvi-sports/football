# NFL Schedule Generator Guide

> **Workorder:** WO-SCHEDULE-SOLVER-001
> **Status:** Complete
> **Last Updated:** December 2024

---

## Overview (Human-Readable)

This module generates a complete 18-week NFL-style schedule for 32 teams. Each team plays exactly 17 games with 1 bye week, following real NFL scheduling rules:

- **Division Games (6):** Play each division rival twice (home and away)
- **Rotating Conference (4):** Play all 4 teams from one rotating same-conference division
- **Same-Place Conference (2):** Play teams that finished in same division position from 2 other conference divisions
- **Inter-Conference (4):** Play all 4 teams from one rotating opposite-conference division
- **17th Game (1):** Play same-place finisher from another inter-conference division

**Total: 272 games across the league (32 teams × 17 games ÷ 2)**

---

## Quick Start

```typescript
import { generateSchedule, getScheduleStats, validateSchedule } from '@/lib/schedule';

// Generate a full season schedule
const schedule = generateSchedule({ season: 2025 });

// Check stats
const stats = getScheduleStats(schedule);
console.log(stats.totalGames); // 272

// Validate
const validation = validateSchedule(schedule);
console.log(validation.isValid); // true
```

---

## Technical Reference (Agentic Coder)

### File Structure

```
src/lib/schedule/
├── index.ts              # Barrel exports
├── types.ts              # TypeScript interfaces
├── schedule-generator.ts # Main generation logic
├── schedule-store.ts     # Zustand store for runtime access
├── csp-solver.ts         # CSP solver (backup, not primary)
├── constraints.ts        # Constraint functions
└── SCHEDULE-GUIDE.md     # This file
```

### Key Interfaces

```typescript
// src/lib/schedule/types.ts

interface LeagueSchedule {
  season: number;
  weeks: WeekSchedule[];
  teamSchedules: Record<string, TeamSchedule>;
  generatedAt: string;
}

interface WeekSchedule {
  week: number;                    // 1-18
  games: ScheduledGame[];          // Games this week
  byeTeams: string[];              // Team IDs on bye
  thursdayGame: ScheduledGame | null;
  sundayNightGame: ScheduledGame | null;
  mondayNightGame: ScheduledGame | null;
  earlyGames: ScheduledGame[];
  lateGames: ScheduledGame[];
}

interface ScheduledGame {
  id: string;                      // "W1-BOS@PHI"
  week: number;
  awayTeamId: string;
  homeTeamId: string;
  timeSlot: TimeSlot;              // 'early' | 'late' | 'primetime'
  gameType: GameType;              // 'division' | 'conference' | 'inter_conference' | 'rotating'
  isPrimeTime: boolean;
  dayOfWeek: DayOfWeek;
}

interface TeamSchedule {
  teamId: string;
  games: ScheduledGame[];          // All 17 games
  byeWeek: number;                 // 5-17
  homeGames: number;
  awayGames: number;
}
```

### Primary Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `generateSchedule(config)` | schedule-generator.ts | Generate complete schedule (with retry) |
| `validateSchedule(schedule)` | schedule-generator.ts | Validate schedule constraints |
| `getScheduleStats(schedule)` | schedule-generator.ts | Get breakdown statistics |
| `distributeGamesToWeeks()` | schedule-generator.ts | MRV placement algorithm |
| `hybridPlacement()` | schedule-generator.ts | Core MRV greedy placement |
| `assignPrimeTimeSlots()` | schedule-generator.ts | Assign TNF/SNF/MNF slots |
| `initializeSchedule(schedule)` | schedule-store.ts | Load into Zustand store |
| `getSchedule()` | schedule-store.ts | Get current schedule from store |
| `getWeekScheduleByNumber(week)` | schedule-store.ts | Get specific week |
| `getTeamSchedule(teamId)` | schedule-store.ts | Get team's schedule |

### Algorithm Details

The schedule generator uses a **Hybrid MRV (Minimum Remaining Values) algorithm with random restarts**:

#### Phase 1: Matchup Generation
```
For each team:
  1. Generate 6 division matchups (2 per rival)
  2. Generate 4 rotating conference matchups
  3. Generate 2 same-place conference matchups
  4. Generate 4 inter-conference matchups
  5. Generate 1 17th-game matchup

Deduplicate to get 272 unique games
```

#### Phase 2: Bye Week Assignment
```
Distribute 32 teams across weeks 5-17 with even counts:
  Weeks 5-11: 2 teams each (14 teams)
  Weeks 12-14: 4 teams each (12 teams)
  Weeks 15-17: 2 teams each (6 teams)
  Total: 32 teams

Key insight: Division rivals are assigned to DIFFERENT bye weeks
to maximize scheduling flexibility.
```

#### Phase 3: Game Placement (Hybrid MRV)
```
Repeat up to 5000 attempts with different bye week configurations:
  1. Assign bye weeks (shuffled but division-aware)
  2. Calculate valid weeks for each game (not during either team's bye)
  3. While unplaced games remain:
     a. Find game with FEWEST valid weeks (MRV heuristic)
     b. Among ties, prefer division games (most constrained)
     c. Place in least-loaded available week
     d. Mark both teams as busy for that week
  4. If all 272 games placed → success
  5. Else try next attempt with new bye week shuffle
```

#### Why MRV Works

The MRV (Minimum Remaining Values) heuristic places the most constrained games first. This prevents situations where easy games are placed first, blocking slots needed by hard-to-schedule games.

**Example**: If TeamA vs TeamB can only go in weeks 5, 8, or 12 (due to bye conflicts), place it early. Don't let other games consume those slots first.

#### Hybrid Placement Function

```typescript
// schedule-generator.ts:455
function hybridPlacement(
  allGames: ScheduledGame[],
  byeWeeks: Map<string, number>
): PlacementResult {
  // For each unplaced game, calculate available weeks
  // Select game with minimum available options (MRV)
  // Place in least-loaded week
  // Repeat until all placed or stuck
}
```

### Constants

```typescript
// schedule-generator.ts
const TOTAL_WEEKS = 18;
const BYE_WEEK_START = 5;
const BYE_WEEK_END = 17;
const GAMES_PER_TEAM = 17;
const TOTAL_TEAMS = 32;
const TOTAL_GAMES = 272;  // (32 * 17) / 2
```

### Division/Conference Rotation Maps

```typescript
// Rotating same-conference division opponent
const ROTATING_DIVISION: Record<string, string> = {
  atlantic: 'metro',      metro: 'atlantic',
  southern: 'central',    central: 'southern',
  pacific: 'mountain',    mountain: 'pacific',
  western: 'coastal',     coastal: 'western',
};

// Inter-conference division opponent
const INTER_CONFERENCE_ROTATION: Record<string, string> = {
  atlantic: 'pacific',    metro: 'mountain',
  southern: 'western',    central: 'coastal',
  pacific: 'atlantic',    mountain: 'metro',
  western: 'southern',    coastal: 'central',
};
```

---

## How It Works (Human-Readable)

### The Problem

Creating an NFL schedule is surprisingly complex. You need to:
- Give every team exactly 17 games
- Make sure no team plays twice in one week
- Respect bye weeks (teams can't play during their bye)
- Balance home and away games
- Follow the NFL's opponent rotation rules

With 272 games and 288 available slots (18 weeks × 16 games max), there's very little room for error.

### The Solution

We use a "smart greedy with retry" approach:

1. **First, figure out who plays whom** - Based on division standings and rotation schedules, we determine all 272 matchups.

2. **Assign bye weeks** - We spread bye weeks across weeks 5-17, making sure an even number of teams are off each week (so remaining teams can pair up). Division rivals get different bye weeks to maximize flexibility.

3. **Place games using MRV** - The Most Constrained Variable (MRV) heuristic places games with the fewest valid weeks first. This prevents "painting into corners" where easy games block slots needed by hard-to-schedule games.

4. **Retry if needed** - If the first attempt doesn't place all 272 games, we regenerate bye weeks and try again (up to 10 retries). Different bye week configurations unlock different solutions.

### Why This Works

The MRV heuristic is the key insight. By always placing the most constrained game next, we avoid dead ends. Combined with the retry mechanism (which tries fresh bye week configurations), we achieve 100% success rate.

Typical generation completes in 100ms-3s depending on how many retries are needed.

---

## Validation Rules

The `validateSchedule` function checks:

| Rule | Expected |
|------|----------|
| Total games | 272 |
| Games per team | 17 each |
| Division games | 96 total (6 per team) |
| Conference games | 32 total (2 per team) |
| Inter-conference | 80 total (5 per team) |
| Rotating games | 64 total (4 per team) |
| Bye weeks | Between 5-17 |
| **No double-plays** | **Team plays max once per week** |
| **No bye violations** | **Team doesn't play during bye** |

### Critical Validations (Errors)

The following validations produce **errors** (not warnings) that indicate a broken schedule:

```typescript
// No team plays twice in same week
for (const week of schedule.weeks) {
  const teamsThisWeek = new Set<string>();
  for (const game of week.games) {
    if (teamsThisWeek.has(game.awayTeamId) || teamsThisWeek.has(game.homeTeamId)) {
      // ERROR: Team plays multiple games in same week
    }
  }
}

// No team plays during their bye
for (const game of week.games) {
  if (week.byeTeams.includes(game.awayTeamId) || week.byeTeams.includes(game.homeTeamId)) {
    // ERROR: Team plays during bye week
  }
}
```

### Warnings (Non-Fatal)

- **Unbalanced home/away** - Some teams may have 6H/11A or 12H/5A instead of 8H/9A. This is due to deterministic home/away assignment and doesn't affect validity.

---

## Store Integration

```typescript
import { useScheduleStore } from '@/lib/schedule/schedule-store';

// In a React component
const schedule = useScheduleStore((state) => state.schedule);
const currentWeek = useScheduleStore((state) => state.currentWeek);

// Get specific data
const teamSchedule = useScheduleStore((state) =>
  state.schedule?.teamSchedules['BOS']
);
```

### Store Actions

```typescript
initializeSchedule(schedule: LeagueSchedule)  // Load schedule
getSchedule(): LeagueSchedule | null          // Get full schedule
getTeamSchedule(teamId: string): TeamSchedule | null
getWeekSchedule(weekId: string): WeekSchedule | null
getWeekScheduleByNumber(week: number): WeekSchedule | null
getUpcomingGame(teamId: string): ScheduledGame | null
clearSchedule(): void
```

---

## Performance

| Metric | Value |
|--------|-------|
| Generation time | 100ms - 5s (typically under 3s) |
| Success rate | 100% (with retry mechanism) |
| Memory usage | ~2MB for full schedule |
| Typical attempts per try | 1-130 |
| Retries needed | Usually 0-1, rarely 2+ |

### Retry Mechanism

The generator uses a two-level retry strategy:

1. **Inner loop** (5000 attempts, 4.5s limit): Tries different bye week shuffles with MRV placement
2. **Outer loop** (10 retries): If inner loop fails to place all 272, regenerates bye weeks entirely

Most generations succeed on the first try. When a retry is needed, it typically succeeds immediately with fresh bye weeks.

---

## Testing

```bash
npx tsx scripts/test-schedule.ts
```

Runs 5 iterations validating:
- 272/272 games placed
- All teams have 17 games
- Bye weeks in valid range
- Correct game type counts
- Performance under 5 seconds

---

## Troubleshooting

### "Not all teams have 17 games"
The placement algorithm failed to place all 272 games after all retries. This is rare but if it happens:
- Increase `MAX_RETRIES` in `generateSchedule()` (default: 10)
- Increase `MAX_ATTEMPTS` in `distributeGamesToWeeks()` (default: 5000)
- Increase `TIME_LIMIT_MS` in `distributeGamesToWeeks()` (default: 4500ms)

### "Bye weeks outside valid range"
Check `BYE_WEEK_START` and `BYE_WEEK_END` constants - weeks should be 5-17.

### Performance issues
The algorithm typically completes in 100ms-3s. If consistently slow:
- Check if many retries are happening (visible in console logs)
- The MRV heuristic should prevent most failures
- Consider if bye week distribution is causing conflicts

---

## Dependencies

- `@/lib/data/teams` - Team definitions (LEAGUE_TEAMS, getTeamById)
- `zustand` - State management for schedule store
- No external scheduling libraries required

---

## Future Improvements

1. **Home/Away Balancing** - Add constraint to target 8-9 home games per team
2. **Prime Time Slots** - Assign TNF/SNF/MNF games based on matchup quality
3. **Travel Optimization** - Minimize back-to-back away games for West Coast teams
4. **Rivalry Scheduling** - Place key matchups in prime weeks

---

## Code Examples

### Generate and Display Schedule

```typescript
import { generateSchedule, getScheduleStats } from '@/lib/schedule';

const schedule = generateSchedule({ season: 2025 });
const stats = getScheduleStats(schedule);

console.log(`Generated ${stats.totalGames} games`);
console.log(`Division: ${stats.gameTypeBreakdown.division}`);
console.log(`Conference: ${stats.gameTypeBreakdown.conference}`);
console.log(`Inter-conf: ${stats.gameTypeBreakdown.interConference}`);
console.log(`Rotating: ${stats.gameTypeBreakdown.rotating}`);
```

### Get Team's Full Schedule

```typescript
import { initializeSchedule, getTeamSchedule } from '@/lib/schedule';

initializeSchedule(schedule);
const bosSchedule = getTeamSchedule('BOS');

console.log(`Boston has ${bosSchedule.games.length} games`);
console.log(`Bye week: ${bosSchedule.byeWeek}`);
console.log(`Home games: ${bosSchedule.homeGames}`);

bosSchedule.games.forEach(game => {
  const opponent = game.homeTeamId === 'BOS' ? game.awayTeamId : game.homeTeamId;
  const loc = game.homeTeamId === 'BOS' ? 'vs' : '@';
  console.log(`Week ${game.week}: ${loc} ${opponent} (${game.gameType})`);
});
```

### Check if Game Has Been Played

```typescript
import { getWeekScheduleByNumber } from '@/lib/schedule';

const week5 = getWeekScheduleByNumber(5);
const game = week5.games[0];

// Check against season results store for actual game results
// (Integration with season-simulator module)
```
