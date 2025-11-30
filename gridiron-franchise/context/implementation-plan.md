# Simulation Engine Integration Plan

## 1. Core Logic (Completed)
- [x] Define Types (`src/types/engine.ts`)
- [x] Port Engine Logic (`src/lib/sim-engine/football-simulator.ts`)

## 2. State Management
- [ ] Create **Game Store** (`src/stores/game-store.ts`)
    - Store the `FootballSimulator` instance
    - Expose actions: `startGame`, `simPlay`, `simDrive`, `resetGame`
    - Manage UI state (e.g., `isSimulating`, `debugMode`)

## 3. UI Components
Create a new directory: `src/components/game/`
- [ ] **Scoreboard.tsx**: Display score, quarter, clock, down/distance.
- [ ] **FieldVisualizer.tsx**: Visual representation of the field and ball position.
- [ ] **PlayLog.tsx**: Scrollable list of play results with "glass" styling.
- [ ] **GameControls.tsx**: Buttons for simulation actions.
- [ ] **StatsPanel.tsx**: Tabbed view for Team and Player stats.

## 4. Page Integration
- [ ] Create `src/app/game/page.tsx`
    - Assemble the components
    - Connect to `game-store`
    - Ensure responsive layout (Grid system from prototype)

## 5. Future Enhancements
- [ ] **Team Data Integration**: Connect `Team` objects from `src/types/index.ts` to the simulator.
- [ ] **Ratings Impact**: Modify `football-simulator.ts` to use Team/Player ratings for RNG calculations.
- [ ] **Settings**: Allow user to toggle "Fast Mode" or "Detailed Logs".
