# Simulation Engine Upgrade Plan: "Gridiron Realism"

## Objective
Upgrade the `FootballSimulator` from a prototype RNG engine to a deep, attribute-driven simulation that fully implements the `game-elements-specification.md`.

---

## Phase 1: Data Structures & Types
**Goal:** Ensure the engine can "speak" the language of the Game Design Document.

1.  **Update `src/types/engine.ts`**:
    -   Add `EnginePlayer` interface (normalized version of `Player` with calculated ratings).
    -   Add `EngineTeam` interface (includes Scheme, Playbook tendencies, and Unit Ratings).
    -   Add `PlayContext` type (Down, Distance, Time, Score, Field Position).

2.  **Create `src/lib/sim-engine/types.ts`**:
    -   Define specific interaction types: `BlockResult`, `RouteResult`, `PassRushResult`.

---

## Phase 2: The "Duel" System (Interaction Logic)
**Goal:** Replace flat probabilities with Unit vs. Unit and Player vs. Player calculations.

1.  **Implement Unit Rating Calculators (`src/lib/sim-engine/ratings.ts`)**:
    -   `getOffensiveLineRating(players)`: Avg of PassBlock/RunBlock.
    -   `getDefensiveFrontRating(players)`: Avg of BlockShed/PassRush.
    -   `getSecondaryRating(players)`: Avg of Coverage/Speed.

2.  **Implement Interaction Resolvers (`src/lib/sim-engine/interactions.ts`)**:
    -   **Trenches:** `resolveLineInteraction(olRating, dlRating, scheme)`
        -   Output: `Pressure` (High/Low) or `RunGap` (Open/Closed).
    -   **Passing:** `resolvePassOutcome(qb, wr, db, pressure)`
        -   Output: `Catch`, `Incomplete`, `Interception`, `Sack`.
    -   **Running:** `resolveRunOutcome(rb, front7, gapQuality)`
        -   Output: `YardsGained`, `BreakTackle`, `Fumble`.

---

## Phase 3: Situational Awareness (The "Brain")
**Goal:** Make the AI play like a real coach.

1.  **Create `PlayCaller` Class (`src/lib/sim-engine/play-caller.ts`)**:
    -   **Inputs:** Game State (Score, Time, Down), Team Tendencies (Aggressive/Conservative).
    -   **Logic:**
        -   *4-Minute Offense:* Run ball to burn clock.
        -   *2-Minute Drill:* Pass to sidelines, hurry up.
        -   *Red Zone:* Tighten playbook, focus on power run/fade routes.
    -   **Output:** `PlayCall` (e.g., "Shotgun Pass Deep", "I-Form Run Inside").

2.  **Integrate Fatigue & Morale**:
    -   Add `stamina` tracking to the Engine State.
    -   Apply penalties to ratings when stamina is low.

---

## Phase 4: Integration & Refactoring
**Goal:** Connect the new deep engine to the existing app.

1.  **Refactor `FootballSimulator` Class**:
    -   Replace `simulatePlay()` monolithic function with modular calls:
        1.  `playCaller.selectPlay(offense)`
        2.  `playCaller.selectDefense(defense)`
        3.  `interactions.resolve(offenseCall, defenseCall)`
    -   Update `GameStore` to handle the richer data output.

2.  **Update UI**:
    -   Show "Key Matchup" on the scoreboard (e.g., "Star WR vs Rookie CB").
    -   Enhance Play Log with narrative details ("OL collapsed under pressure!").

---

## Phase 5: Testing & Tuning
**Goal:** Balance the numbers.

1.  **Run "Season Simulations"**:
    -   Simulate 1,000 games.
    -   Check stats against NFL averages (e.g., Yards/Game ~350, Completion % ~64%).
2.  **Adjust Coefficients**: Tweak the math in `interactions.ts` until the stats look realistic.
