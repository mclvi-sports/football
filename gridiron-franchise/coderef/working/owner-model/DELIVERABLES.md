# DELIVERABLES: Owner Model

**Workorder:** WO-OWNER-MODEL-001
**Status:** 🚧 In Progress
**Started:** 2025-12-03

---

## Phase 1: API and Generation

- [ ] API-001: Modify generate-gm API to make player params optional
- [ ] GEN-001: Create league generation page with loading UI and API calls
- [ ] NAV-001: Update career entry to redirect to generate

## Phase 2: Career Flow

- [ ] TEAM-001: Update team selection to show generated teams with GM preview
- [ ] CONF-001: Update confirm page to show GM profile
- [ ] STORE-001: Update career store to use playerTeamId

## Phase 3: Dashboard Integration

- [ ] DASH-001: Update dashboard to use session storage data
- [ ] GM-001: Update my-gm page to show real GM data

## Phase 4: Cleanup

- [ ] CLEAN-001: Delete old archetype/background/persona pages

---

## Metrics

| Metric | Value |
|--------|-------|
| LOC Added | TBD |
| LOC Removed | TBD |
| Files Changed | TBD |
| Commits | TBD |

---

## Notes

- Owner model: user picks team AFTER GMs are generated
- The team's pre-assigned GM becomes "their" GM
- Future: Owner could fire/hire GMs
