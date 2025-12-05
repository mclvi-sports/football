# Schedule Data Reference

Complete inventory of season structure, matchup rules, and prime time scheduling.

---

## Season Structure

| Property | Value |
|----------|-------|
| Total Weeks | 18 |
| Games per Team | 17 |
| Bye Week Range | Weeks 5-14 |
| Teams per Bye | 2 (average) |

---

## Game Type Breakdown (17 Games)

| Game Type | Count | Description |
|-----------|-------|-------------|
| Division | 6 | 2 games vs each division rival (H/A) |
| Conference | 4 | 1 game vs each team in rotating division |
| Inter-Conference | 4 | 1 game vs each team in opposite conf division |
| Rotating | 3 | Same-place finishers from other divisions |
| **Total** | **17** | |

---

## Division Matchups (6 Games)

Each team plays all 3 division rivals twice:
- 1 Home game
- 1 Away game

---

## Conference Matchups (4 Games)

Teams play every team in one rotating same-conference division:

| Your Division | Rotating Division |
|---------------|-------------------|
| Atlantic North | Atlantic South |
| Atlantic South | Atlantic East |
| Atlantic East | Atlantic West |
| Atlantic West | Atlantic North |
| Pacific North | Pacific South |
| Pacific South | Pacific East |
| Pacific East | Pacific West |
| Pacific West | Pacific North |

---

## Inter-Conference Matchups (4 Games)

Teams play every team in one opposite-conference division:

| Your Division | Opponent Division |
|---------------|-------------------|
| Atlantic North | Pacific North |
| Atlantic South | Pacific South |
| Atlantic East | Pacific East |
| Atlantic West | Pacific West |

---

## Rotating Matchups (3 Games)

Based on previous season standings:
- Same-place finisher from 2 other same-conference divisions
- Same-place finisher from 1 other opposite-conference division

---

## Time Slots (5)

| Slot | Day | Description |
|------|-----|-------------|
| early | Sunday | 1:00 PM games |
| late | Sunday | 4:25 PM games |
| sunday_night | Sunday | Prime time |
| monday_night | Monday | Prime time |
| thursday_night | Thursday | Prime time |

---

## Prime Time Selection

Prime time games are selected based on market size:

### Market Size Rankings (Top 15)

| Rank | Team | Market |
|------|------|--------|
| 1 | NYE | 100 |
| 2 | LAL | 98 |
| 3 | CHI | 95 |
| 4 | DAL | 95 |
| 5 | HOU | 90 |
| 6 | PHI | 88 |
| 7 | SFO | 87 |
| 8 | MIA | 85 |
| 9 | ATL | 85 |
| 10 | BOS | 85 |
| 11 | WAS | 82 |
| 12 | DEN | 80 |
| 13 | SEA | 80 |
| 14 | PHX | 78 |
| 15 | DET | 76 |

### Market Size Rankings (16-32)

| Rank | Team | Market |
|------|------|--------|
| 16 | BKN | 75 |
| 17 | OAK | 74 |
| 18 | LVA | 73 |
| 19 | SAN | 72 |
| 20 | PIT | 70 |
| 21 | BAL | 68 |
| 22 | CLE | 67 |
| 23 | IND | 66 |
| 24 | AUS | 65 |
| 25 | ORL | 64 |
| 26 | CLT | 62 |
| 27 | POR | 60 |
| 28 | SAC | 58 |
| 29 | NWK | 55 |
| 30 | VAN | 52 |
| 31 | SDS | 50 |
| 32 | HON | 45 |

---

## Schedule Interfaces

### ScheduledGame

```typescript
interface ScheduledGame {
  id: string;           // e.g., "WK1-BOS-PHI"
  week: number;         // 1-18
  awayTeamId: string;
  homeTeamId: string;
  timeSlot: TimeSlot;
  gameType: GameType;
  isPrimeTime: boolean;
  dayOfWeek: GameDay;   // thursday | sunday | monday
}
```

### TeamSchedule

```typescript
interface TeamSchedule {
  teamId: string;
  games: ScheduledGame[];
  byeWeek: number;
  homeGames: number;
  awayGames: number;
  primeTimeGames: number;
  divisionGames: number;       // 6
  conferenceGames: number;     // 4
  interConferenceGames: number; // 4
  rotatingGames: number;       // 3
}
```

### WeekSchedule

```typescript
interface WeekSchedule {
  week: number;
  games: ScheduledGame[];
  byeTeams: string[];
  thursdayGame: ScheduledGame | null;
  sundayNightGame: ScheduledGame | null;
  mondayNightGame: ScheduledGame | null;
  earlyGames: ScheduledGame[];
  lateGames: ScheduledGame[];
}
```

---

## Bye Week Rules

| Rule | Details |
|------|---------|
| Range | Weeks 5-14 only |
| Teams per week | ~2-4 teams |
| No byes | Weeks 1-4, 15-18 |
| Balance | Attempt even distribution |

---

## Home/Away Balance

| Property | Target |
|----------|--------|
| Home Games | 8 or 9 |
| Away Games | 8 or 9 |
| Division Balance | 3 home, 3 away |

---

## Schedule Statistics

```typescript
interface ScheduleStats {
  totalGames: number;           // ~272
  gamesPerTeam: number;         // 17
  primeTimeGames: {
    thursday: number;
    sundayNight: number;
    mondayNight: number;
    total: number;
  };
  byeWeekDistribution: Record<number, number>;
  homeAwayBalance: {
    balanced: number;
    avgHomeGames: number;
    avgAwayGames: number;
  };
  gameTypeBreakdown: {
    division: number;           // 96 total
    conference: number;         // 64 total
    interConference: number;    // 64 total
    rotating: number;           // 48 total
  };
}
```

---

## Division Places

Used for rotating matchups:

```typescript
type DivisionPlace = 1 | 2 | 3 | 4;

interface TeamStanding {
  teamId: string;
  divisionPlace: DivisionPlace;
  conference: string;
  division: string;
}
```

---

## Summary

| Category | Count |
|----------|-------|
| Weeks | 18 |
| Games per Team | 17 |
| Time Slots | 5 |
| Game Types | 4 |
| Market Size Rankings | 32 |
| Bye Weeks | 10 (weeks 5-14) |
