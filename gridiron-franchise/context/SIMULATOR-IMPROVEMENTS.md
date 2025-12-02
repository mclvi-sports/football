# Game Simulator Improvements

Prioritized list of improvements for the Gridiron Franchise Simulator engine (`src/lib/sim/simulator.ts`), ordered from highest impact to nice-to-have.

## 1. Stamina & Fatigue System (Critical)
*   **Issue:** Players currently perform at 100% efficiency for every snap.
*   **Fix:** Implement a `stamina` pool that drains per play. As stamina drops, attributes (Speed, Strength) degrade. This forces realistic substitutions and makes the "Workhorse" trait valuable.

## 2. 1v1 Positional Matchups
*   **Issue:** Defense is largely calculated by aggregate "Team Defense OVR".
*   **Fix:** Calculate specific interactions: `WR Release` vs `CB Press`, `OL Block` vs `DL Power Move`. If you have a star DE against a rookie RT, that specific matchup should result in 3-4 sacks, not just a general team bonus.

## 3. Expanded Play Types (Schematic Depth)
*   **Issue:** Currently just "Run" or "Pass".
*   **Fix:** Add granularity: `Run Inside`, `Run Outside`, `Short Pass`, `Deep Pass`, `Play Action`. Defenses pick `Blitz`, `Zone`, `Man`. Rock-paper-scissors logic (e.g., Blitz kills Run, but loses to Quick Pass).

## 4. Live In-Game Injuries
*   **Issue:** `Injury Prone` exists as a modifier, but players don't seem to actually get hurt and leave the game.
*   **Fix:** If an injury roll fails, the player must be removed from the `currentLineup` for the rest of the game (or X plays), forcing the simulator to use the Depth Chart backup.

## 5. "Hot Hand" & Rhythm Mechanic
*   **Issue:** Every play is mathematically independent.
*   **Fix:** Add a temporary `momentum` modifier. If a QB completes 3 passes in a row, give a +5% accuracy boost. If he throws a pick, give a -5% "shaken" penalty for the next drive.

## 6. Advanced Clock Management AI
*   **Issue:** The "Clutch" logic is simple.
*   **Fix:** Implement "2-Minute Drill" logic: Offense goes into "Hurry Up" (less time off clock), Defense plays "Prevent" (allows yards, prevents TDs). AI should use timeouts strategically to stop the clock.

## 7. Attribute-Based Penalties
*   **Issue:** Penalties are mostly random chance.
*   **Fix:** Tie specific penalties to attributes. Low `Awareness` = False Starts. Low `Discipline` = Personal Fouls. Aggressive CBs should get more Pass Interference calls.

## 8. Drive Consistency (The "Choke" Factor)
*   **Issue:** Drives feel like a sequence of random events.
*   **Fix:** Track "Drive Momentum". A 10-play drive should wear down the defense (lowering their stats temporarily), making a TD more likely the longer the drive goes.

## 9. Weather Physics
*   **Issue:** Weather is a flat stat penalty.
*   **Fix:** Make it physical. "Wind" should affect FG range and deep pass accuracy specifically. "Rain" should increase fumble chance and drop rate but not affect short passes.

## 10. Special Teams Nuance
*   **Issue:** Kicking is very binary.
*   **Fix:** Add blocked kicks (based on Special Teams OVR), muffed punts, and directional kicking (coffin corner punts) to make field position battles more organic.
