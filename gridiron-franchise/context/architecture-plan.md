# Franchise App Architecture & Simulation Integration Plan

## 1. The "Two Worlds" Architecture
The application is divided into two distinct state "worlds" to prevent pollution and manage performance.

### World A: Franchise Mode (Persistent)
- **Scope**: Roster management, free agency, facilities, league standings.
- **Data Source**: `LeagueStore` (The "Database").
- **Time Unit**: Weeks (Week 1 -> Week 2).
- **Persistence**: Saved to LocalStorage/Database.

### World B: Game Mode (Ephemeral)
- **Scope**: The live match visualizer (Scoreboard, Field, Play Log).
- **Data Source**: `GameStore` (Temporary snapshot).
- **Time Unit**: Seconds (Q1 15:00 -> Q1 14:20).
- **Persistence**: None (Wiped after game completion).

---

## 2. Data Flow Cycle

### Phase 1: Pre-Game (The "Handshake")
**Trigger**: User clicks "Play Game" or "Simulate Week".
1.  **Snapshotting**: Copy `Team` and `Player` data from `LeagueStore`.
2.  **Normalization (Adapter Pattern)**:
    - Convert complex Franchise data (Attributes + Traits + Morale) into simplified Engine ratings.
    - *Example*: `Player.attributes.speed` + `Player.morale` -> `EnginePlayer.speedRating`.
3.  **Initialization**: Hydrate the `GameStore` with these snapshot teams.

### Phase 2: In-Game (The Simulation)
**Context**: The `FootballSimulator` class running the logic.
1.  **The Loop**: Engine calculates play results based on RNG and Ratings.
2.  **The UI**: React components (`Scoreboard`, `FieldVisualizer`) subscribe to `GameStore`.
3.  **Interaction**: User actions (e.g., "Simulate Drive") trigger Engine methods, which update `GameStore`.

### Phase 3: Post-Game (The "Debrief")
**Trigger**: `gameOver === true`.
1.  **Stat Extraction**: Retrieve `GameStats` (yards, TDs, etc.) from `GameStore`.
2.  **League Update (Commit)**:
    - Update Standings (Wins/Losses).
    - Append stats to Player Season Totals.
    - **XP Calculation**: Award progression points based on performance.
    - **Injury Application**: Apply any in-game injuries to the persistent roster.
3.  **Cleanup**: Reset `GameStore` for the next match.

---

## 3. Technical Implementation Strategy

### A. Store Separation
- **`useLeagueStore`**: Handles the "Meta" game.
- **`useGameStore`**: Handles the "Live" game.
- *Rule*: The Game Store never writes directly to the League Store. The "Post-Game" handler functions as the bridge.

### B. Simulation Modes
1.  **Visualizer (User's Game)**:
    - Uses `setInterval` (e.g., 1000ms ticks).
    - Updates UI on every tick.
    - "Slow" simulation for entertainment.
2.  **Background Sim (CPU Games)**:
    - Uses `while` loops.
    - Instantiates "Headless" simulators for all other 14 matchups.
    - Runs instantly (milliseconds).
    - Updates League Store in one batch operation.

### C. The Matchup Adapter
Create a utility `src/lib/sim-engine/adapter.ts`:
```typescript
function createEngineTeam(franchiseTeam: Team): EngineTeam {
    return {
        id: franchiseTeam.id,
        offenseRating: calculateOffenseRating(franchiseTeam),
        defenseRating: calculateDefenseRating(franchiseTeam),
        // ... other normalized stats
    };
}
```

## 4. Next Steps
1.  **Implement `GameStore`**: Create the Zustand store for the ephemeral game state.
2.  **Build UI Components**: Port the HTML/CSS visualizer to React components.
3.  **Create Adapter**: Write the logic to convert Franchise Teams to Engine Teams.
4.  **Connect "Play" Button**: Wire up the dashboard to trigger the Pre-Game Handshake.
