# Game Module Index

## Generators

| Generator | Library | API Endpoint |
|-----------|---------|--------------|
| Player | `lib/generators/player-generator.ts` | `/api/dev/generate-player` |
| Roster | `lib/generators/roster-generator.ts` | `/api/dev/generate-roster` |
| Team Rosters (32) | `lib/generators/full-game-generator.ts` | `/api/dev/generate-rosters` |
| Full Game | `lib/generators/full-game-generator.ts` | `/api/dev/generate-full` |
| Free Agents | `lib/generators/fa-generator.ts` | `/api/dev/generate-fa` |
| Draft Class | `lib/generators/draft-generator.ts` | `/api/dev/generate-draft` |
| GM | `lib/gm/gm-generator.ts` | `/api/dev/generate-gm` |
| Coaching | `lib/coaching/coaching-generator.ts` | `/api/dev/generate-coaching` |
| Facilities | `lib/facilities/facilities-generator.ts` | `/api/dev/generate-facilities` |
| Scouting | `lib/scouting/scouting-generator.ts` | `/api/dev/generate-scouting` |
| Schedule | `lib/schedule/schedule-generator.ts` | `/api/dev/generate-schedule` |

## Views

| View | File | Description |
|------|------|-------------|
| RosterView | `components/modules/views/roster-view.tsx` | Team roster display |
| ScheduleView | `components/modules/views/schedule-view.tsx` | Season schedule |
| StandingsView | `components/modules/views/standings-view.tsx` | League standings |
| StatsView | `components/modules/views/stats-view.tsx` | Player/team stats |

## Game Loops

| Loop | File | Description |
|------|------|-------------|
| TrainingLoop | `components/modules/loops/training-loop.tsx` | Player training gameplay |
| ScoutingLoop | `components/modules/loops/scouting-loop.tsx` | Prospect scouting gameplay |

## Supporting Libs

| Lib | Path | Purpose |
|-----|------|---------|
| GM | `lib/gm/` | GM types, generator, store |
| Season | `lib/season/` | Season state management |
| Training | `lib/training/` | Training system logic |
| Schedule | `lib/schedule/` | Schedule store |
| Coaching | `lib/coaching/` | Coaching staff store |
| Facilities | `lib/facilities/` | Team facilities store |
| Scouting | `lib/scouting/` | Scouting department store |

## Stores

| Store | File | Storage Key |
|-------|------|-------------|
| Dev Players | `lib/dev-player-store.ts` | `dev-generated-players` |
| Full Game Data | `lib/dev-player-store.ts` | `dev-full-game-data` |
| Free Agents | `lib/dev-player-store.ts` | `dev-free-agents` |
| Draft Class | `lib/dev-player-store.ts` | `dev-draft-class` |
| GMs (Legacy) | `lib/gm/gm-store.ts` | `dev-generated-gms` |
| GMs (Owner Mode) | `lib/gm/gm-store.ts` | `owner-mode-gms` |
| Coaching | `lib/coaching/coaching-store.ts` | `dev-coaching` |
| Facilities | `lib/facilities/facilities-store.ts` | `dev-facilities` |
| Scouting | `lib/scouting/scouting-store.ts` | `dev-scouting` |
| Schedule | `lib/schedule/schedule-store.ts` | `dev-schedule` |
| Career | `stores/career-store.ts` | Zustand (memory) |

## User Flows

### New Career Flow
```
/career/new → /career/new/generate → /career/new/team → /career/new/confirm → /dashboard
```

### Dev Tools Flow
```
/dashboard/dev-tools → Game Setup Dashboard → Individual generators
```

## Future Modules (Not Yet Implemented)

- DraftLoop - Draft day gameplay
- TradeLoop - Trade negotiation gameplay
- FreeAgencyLoop - FA signing gameplay
- GameSimLoop - Game simulation gameplay
