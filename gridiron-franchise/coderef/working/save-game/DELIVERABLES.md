# DELIVERABLES: save-game

**Project**: gridiron-franchise
**Feature**: save-game
**Workorder**: WO-SAVE-GAME-001
**Status**: 🚧 Not Started
**Generated**: 2025-12-06

---

## Executive Summary

**Goal**: Persist game state to Supabase so progress persists across devices and sessions

**Description**: Implement cloud save/load functionality with 5 slots per user via Supabase. Users can manually save and load their complete game state including GM progression, scouting data, and career stats.

---

## Implementation Phases

### Phase 1: Auth Wiring

**Description**: Connect existing auth UI to Supabase auth functions

**Estimated Duration**: TBD

**Deliverables**:
- Login form connected to Supabase signIn
- Signup form connected to Supabase signUp
- Logout functionality working
- Auth state accessible throughout app

### Phase 2: Database Setup

**Description**: Create Supabase schema and type definitions

**Estimated Duration**: TBD

**Deliverables**:
- save_games table created in Supabase
- RLS policies ensuring user isolation
- TypeScript types for database tables

### Phase 3: Save/Load Service

**Description**: Implement core save and load functionality

**Estimated Duration**: TBD

**Deliverables**:
- collectGameState gathers all store data
- saveGame persists to Supabase
- loadGame retrieves and hydrates stores
- listSaves returns user's save slots
- deleteSave removes a slot

### Phase 4: UI Components

**Description**: Build save slots interface and dialogs

**Estimated Duration**: TBD

**Deliverables**:
- SaveSlotCard showing metadata
- SaveSlots grid with 5 slots
- Save and Load confirmation dialogs
- Saves page accessible from navigation


---

## Metrics

### Code Changes
- **Lines of Code Added**: TBD
- **Lines of Code Deleted**: TBD
- **Net LOC**: TBD
- **Files Modified**: TBD

### Commit Activity
- **Total Commits**: TBD
- **First Commit**: TBD
- **Last Commit**: TBD
- **Contributors**: TBD

### Time Investment
- **Days Elapsed**: TBD
- **Hours Spent (Wall Clock)**: TBD

---

## Task Completion Checklist

- [ ] [AUTH-001] Identify existing auth UI components and their locations
- [ ] [AUTH-002] Wire login form to signIn function from auth.ts
- [ ] [AUTH-003] Wire signup form to signUp function from auth.ts
- [ ] [AUTH-004] Wire logout button to signOut function
- [ ] [AUTH-005] Add auth state provider/context for session management
- [ ] [DB-001] Create save_games table migration SQL
- [ ] [DB-002] Create RLS policies for user data isolation
- [ ] [DB-003] Create Supabase type definitions for save_games table
- [ ] [SVC-001] Create collectGameState function to gather all store data
- [ ] [SVC-002] Create saveGame function to upsert to Supabase
- [ ] [SVC-003] Create listSaves function to fetch user's 5 slots
- [ ] [SVC-004] Create loadGame function to fetch save by ID
- [ ] [SVC-005] Create hydrateStores function to restore all store state
- [ ] [SVC-006] Create deleteSave function to remove a save slot
- [ ] [UI-001] Create SaveSlotCard component with metadata display
- [ ] [UI-002] Create SaveSlots container with 5 slots grid
- [ ] [UI-003] Create SaveDialog for save confirmation with name input
- [ ] [UI-004] Create LoadDialog for load confirmation
- [ ] [UI-005] Create saves page at /dashboard/saves
- [ ] [UI-006] Add Saves route to route-titles.ts and navigation
- [ ] [INT-001] Add persist middleware to career-store if missing

---

## Files Created/Modified

- **src/lib/supabase/save-game.ts** - Save/load service functions
- **src/lib/supabase/types.ts** - Supabase table type definitions
- **src/components/save/save-slots.tsx** - Save slots UI with 5 slots
- **src/components/save/save-slot-card.tsx** - Individual save slot card
- **src/components/save/save-dialog.tsx** - Save confirmation dialog
- **src/components/save/load-dialog.tsx** - Load confirmation dialog
- **src/app/dashboard/saves/page.tsx** - Save management page
- **supabase/migrations/001_save_games.sql** - Database schema migration
- **src/lib/supabase/auth.ts** - TBD
- **src/stores/career-store.ts** - TBD
- **src/lib/constants/route-titles.ts** - TBD

---

## Success Criteria

- No success criteria defined

---

## Notes

*This deliverables report was automatically generated from plan.json.*
*Use `/update-deliverables` to populate metrics from git history after implementation.*

**Last Updated**: 2025-12-06
