# Offseason Flow System

## Overview

The Offseason Flow System defines the complete progression from season end to Week 1 of the new season. It encompasses 18 distinct phases covering awards, free agency, scouting, the draft, and training camp. Each phase has specific mechanics, user decisions, and narrative moments.

The offseason spans **Weeks 1-18** of the 40-week calendar, transitioning the game from playoffs through roster construction to the start of the regular season.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-season-calendar-system.md` | Week timing, deadlines, calendar integration |
| `FINAL-draft-class-system.md` | Prospect generation, bust/steal mechanics |
| `FINAL-free-agent-pool-system.md` | FA pool generation, player availability |
| `FINAL-salarycap.md` | Cap management, contract structures |
| `FINAL-coaching-staff-system.md` | Coaching hires, staff bonuses |
| `FINAL-scout-system.md` | Scouting accuracy, prospect evaluation |
| `FINAL-training-system.md` | XP earning during camp, player development |
| `FINAL-gm-skills-perks-system.md` | GM Points earned from offseason achievements |
| `FINAL-traits-system.md` | Trait reveals during scouting |

---

# PART 1: OFFSEASON TIMELINE

## Complete 18-Phase Flow

| # | Phase | Week(s) | Duration | Key Actions |
|---|-------|---------|----------|-------------|
| 1 | Season End | 1 | 3 days | Super Bowl, stats finalized |
| 2 | Awards & Pro Bowl | 1-2 | 7 days | MVP, All-Pro, Pro Bowl |
| 3 | Coaching Changes | 2-3 | 7 days | Firings, hiring carousel |
| 4 | Franchise Tag Window | 3-4 | 7 days | Tag designations |
| 5 | Free Agency - Own Players | 4-5 | 7 days | Re-sign expiring contracts |
| 6 | Free Agency - Open Market | 5-7 | 14 days | Legal tampering, FA frenzy |
| 7 | Senior Bowl / Shrine Game | 6 | 3 days | All-star game scouting |
| 8 | NFL Combine | 7-8 | 5 days | Athletic testing, interviews |
| 9 | Pro Days | 8-10 | 14 days | School-specific workouts |
| 10 | Individual Workouts | 10-11 | 10 days | Private visits, medicals |
| 11 | Draft | 11-12 | 3 days | 7 rounds, 224 picks |
| 12 | UDFA Signing | 12 | 2 days | Undrafted free agent rush |
| 13 | OTAs / Minicamp | 12-14 | 14 days | Voluntary workouts |
| 14 | Rookie Camp | 14-15 | 5 days | Rookies-only practice |
| 15 | Training Camp | 15-17 | 14 days | Full squad, roster battles |
| 16 | Preseason Games | 17-18 | 10 days | 3 exhibition games |
| 17 | Final Cuts | 18 | 2 days | 70 → 53 roster |
| 18 | Practice Squad | 18 | 2 days | Form 16-man PS |

→ **Week 19: Regular Season Begins**

---

## Timeline Visual

```
WEEK:  1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19
       |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
       ├────┴────┤    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
       AWARDS    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
                 ├────┤    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
                 COACH|    |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
                      ├────┤    |    |    |    |    |    |    |    |    |    |    |    |    |    |
                      TAG  |    |    |    |    |    |    |    |    |    |    |    |    |    |    |
                           ├────┴────┴────┤    |    |    |    |    |    |    |    |    |    |    |
                           FREE AGENCY    |    |    |    |    |    |    |    |    |    |    |    |
                                ├─────────┴────┴────┴────┤    |    |    |    |    |    |    |    |
                                SCOUTING (SR BOWL→WORKOUTS)   |    |    |    |    |    |    |    |
                                                              ├────┤    |    |    |    |    |    |
                                                              DRAFT|    |    |    |    |    |    |
                                                                   ├────┴────┴────┤    |    |    |
                                                                   OTAs / MINICAMP|    |    |    |
                                                                                  ├────┴────┤    |
                                                                                  TRAINING  |    |
                                                                                            ├────┤
                                                                                            PRE  |
                                                                                                 WEEK 1
```

---

# PART 2: PHASE DETAILS

## Phase 1: Season End

### Timing
- **Week:** 1 (Days 1-3)
- **Trigger:** Super Bowl completed

### Events

| Event | Description | User Action |
|-------|-------------|-------------|
| Super Bowl Result | Championship winner determined | Watch/Sim |
| Season Stats Finalized | All player stats locked | View |
| Player Grades Calculated | Performance grades assigned | View |
| Contract Years Resolved | Expiring contracts flagged | Review |
| Injury Status Updated | Offseason recovery begins | Review |

### System Actions

```
function processSeasonEnd():
    // Finalize all season statistics
    for player in allPlayers:
        player.seasonStats.lock()
        player.performanceGrade = calculateGrade(player)

    // Mark expiring contracts
    for contract in allContracts:
        if contract.yearsRemaining == 0:
            contract.status = 'EXPIRING'
            player.freeAgentStatus = 'PENDING'

    // Begin injury recovery
    for injury in seasonInjuries:
        injury.startOffseasonRecovery()

    // Trigger coach evaluation
    for team in allTeams:
        team.evaluateCoachingStaff()
```

### Narrative Elements
- "Your season is complete. [Team] finished [record]."
- Championship recap for winning team
- Season summary for all teams
- Sets tone for offseason narrative

---

## Phase 2: Awards & Pro Bowl

### Timing
- **Week:** 1-2 (Days 4-10)
- **Duration:** 7 days

### Awards Ceremony

| Award | Criteria | GM Points |
|-------|----------|-----------|
| MVP | Best overall player | +1000 |
| Offensive POY | Best offensive player | +750 |
| Defensive POY | Best defensive player | +750 |
| Offensive ROY | Best offensive rookie | +500 |
| Defensive ROY | Best defensive rookie | +500 |
| Comeback POY | Best return from injury/decline | +400 |
| Coach of Year | Best coaching performance | +300 |

### All-Pro Teams

| Selection | Description | GM Points |
|-----------|-------------|-----------|
| 1st Team All-Pro | Best at position (1 per position) | +300 per player |
| 2nd Team All-Pro | Second best at position | +150 per player |

### Pro Bowl

| Element | Description |
|---------|-------------|
| Selection | Top players by conference |
| Format | Skills competition + game (simulated) |
| XP Bonus | +200 XP for participants |
| Injury Risk | 5% chance of minor injury |
| Opt-Out | Championship game participants skip |

### Award Voting Algorithm

```
function calculateMVPVotes(player):
    score = 0

    // Statistics (40%)
    score += normalizeStats(player.seasonStats) * 0.40

    // Team Success (25%)
    score += (team.wins / 17) * 100 * 0.25

    // OVR Rating (20%)
    score += player.ovr * 0.20

    // Narrative Bonus (15%)
    if player.hasNarrativeBonus:  // comeback, underdog, etc.
        score += 15

    return score
```

### User Decisions
- View awards ceremony
- Review GM Points earned
- Set Pro Bowl participation (optional)

---

## Phase 3: Coaching Changes

### Timing
- **Week:** 2-3 (Days 8-21)
- **Duration:** 7-10 days

### AI Coach Firings

| Factor | Weight | Threshold |
|--------|--------|-----------|
| Win Percentage | 35% | <.375 in 2+ years |
| Playoff Appearances | 25% | 0 in 3 years |
| Owner Patience | 20% | Based on owner trait |
| Recent Trend | 10% | Regression triggers |
| Contract Status | 10% | Lame duck firing |

### Coaching Carousel

| Phase | Duration | Description |
|-------|----------|-------------|
| Interview Requests | Days 1-3 | Teams request to interview |
| Interviews | Days 4-7 | Formal interviews conducted |
| Offers | Days 5-8 | Teams extend offers |
| Hires Announced | Days 7-10 | All positions filled |

### Available Positions

| Position | Impact | Salary Range |
|----------|--------|--------------|
| Head Coach | Scheme, morale, development | $6M-$15M/year |
| Offensive Coordinator | Offensive scheme | $2M-$5M/year |
| Defensive Coordinator | Defensive scheme | $2M-$5M/year |
| Position Coaches | Player development bonuses | $500K-$1.5M/year |

### User Actions

| If User Team Has... | Options |
|---------------------|---------|
| Fired Coach | Interview candidates, make hire |
| All Coaches | Review staff, optional changes |
| Coordinator Poached | Interview replacements |

### Candidate Pool

```
function generateCoachingCandidates(position):
    candidates = []

    // Current coordinators (promotion)
    for team in allTeams:
        if team.oc.promotionReady or team.dc.promotionReady:
            candidates.add(team.coordinator)

    // College coaches
    candidates.add(generateCollegeCoaches(3-5))

    // Former head coaches
    for coach in unemployedCoaches:
        if coach.experience >= 2:
            candidates.add(coach)

    return candidates.sortByRating()
```

---

## Phase 4: Franchise Tag Window

### Timing
- **Week:** 3-4 (Days 15-28)
- **Deadline:** End of Week 4

### Tag Types

| Tag | Cost | Player Rights | Limit |
|-----|------|---------------|-------|
| Franchise Tag | Top 5 avg salary at position | Cannot negotiate elsewhere | 1 per team |
| Transition Tag | Top 10 avg salary at position | Can negotiate, team matches | 1 per team |

### Tag Costs by Position (Example)

| Position | Franchise Tag | Transition Tag |
|----------|---------------|----------------|
| QB | $32.4M | $27.8M |
| DE | $20.1M | $17.2M |
| WR | $19.5M | $16.7M |
| CB | $18.4M | $15.8M |
| OT | $18.0M | $15.4M |
| LB | $16.8M | $14.4M |
| S | $14.1M | $12.1M |
| RB | $12.5M | $10.7M |
| TE | $11.3M | $9.7M |

### Tag Logic

```
function canApplyFranchiseTag(team, player):
    if team.franchiseTagUsed:
        return false
    if player.contract.status != 'EXPIRING':
        return false
    if player.franchiseTagHistory >= 3:
        return false  // Max 3 consecutive tags

    tagCost = calculateFranchiseTagCost(player.position)
    if team.capSpace < tagCost:
        return false

    return true

function applyFranchiseTag(team, player):
    cost = calculateFranchiseTagCost(player.position)

    // Create 1-year contract
    contract = {
        years: 1,
        value: cost,
        guaranteed: cost,
        type: 'FRANCHISE_TAG'
    }

    player.contract = contract
    player.freeAgentStatus = 'TAGGED'
    team.franchiseTagUsed = true
    team.capSpace -= cost
```

### User Decisions
- View expiring contracts
- Select player to tag (optional)
- Review cap implications

---

## Phase 5: Free Agency - Own Players

### Timing
- **Week:** 4-5 (Days 22-35)
- **Duration:** 7-10 days

### Priority Window

Before the open market, teams negotiate with their own expiring contracts.

| Player Interest Level | Description | Discount |
|-----------------------|-------------|----------|
| Loyal | Wants to stay | -15% market value |
| Open | Will consider | -5% market value |
| Exploring | Testing market | 0% |
| Unhappy | Wants out | +10% to re-sign |

### Re-Signing Factors

| Factor | Impact |
|--------|--------|
| Team Success | Winning teams attract |
| Role/Playing Time | Starters want to stay |
| Coaching Stability | New coach = uncertainty |
| Relationship | Chemistry with teammates |
| Market Value | Fair contract expected |

### Negotiation Flow

```
function negotiateExtension(team, player):
    // Get player's asking price
    marketValue = calculateMarketValue(player)
    loyaltyModifier = getLoyaltyModifier(player, team)
    askingPrice = marketValue * loyaltyModifier

    // User makes offer
    offer = getUserOffer()

    // Evaluate offer
    if offer.totalValue >= askingPrice * 0.95:
        if offer.guaranteed >= askingPrice * 0.40:
            return 'ACCEPTED'

    // Counter-offer logic
    gap = askingPrice - offer.totalValue
    if gap < askingPrice * 0.10:
        return generateCounterOffer(player, offer)
    else:
        return 'REJECTED'
```

### User Actions
- View all expiring contracts
- Prioritize re-signing targets
- Make contract offers
- Negotiate terms (years, guaranteed, structure)

---

## Phase 6: Free Agency - Open Market

### Timing
- **Week:** 5-7 (Days 29-49)
- **Duration:** 14-21 days

### Market Phases

| Phase | Timing | Market Multiplier | Description |
|-------|--------|-------------------|-------------|
| Legal Tampering | Days 1-2 | N/A | Negotiate only, no signing |
| FA Frenzy | Days 3-7 | 150% | Bidding wars, top players |
| Active Market | Days 8-14 | 100% | Normal market |
| Slow Market | Days 15-21 | 75% | Bargains available |
| Post-Draft | Week 12+ | 50% | Remaining veterans |

### Free Agent Tiers

| Tier | OVR Range | Typical Contract | Interest Level |
|------|-----------|------------------|----------------|
| Elite | 85+ | $20M+/year, 4-5 years | 10+ teams |
| Quality Starter | 78-84 | $10-20M/year, 3-4 years | 5-10 teams |
| Solid Starter | 72-77 | $5-10M/year, 2-3 years | 3-8 teams |
| Depth | 65-71 | $2-5M/year, 1-2 years | 2-5 teams |
| Veteran Min | <65 | $1.2M, 1 year | 1-3 teams |

### Bidding War System

```
function simulateFreeAgentSigning(player):
    // Get interested teams
    interestedTeams = getInterestedTeams(player)
    offers = []

    for team in interestedTeams:
        if team.canAfford(player):
            offer = generateOffer(team, player)
            offers.add(offer)

    // Player evaluates offers
    for offer in offers:
        score = evaluateOffer(player, offer)
        offer.attractiveness = score

    // Signing decision
    if userOffer in offers:
        // Give user chance to match/beat
        bestAI = offers.filter(notUser).maxBy(attractiveness)
        return promptUserToMatch(bestAI)
    else:
        return selectBestOffer(offers)

function evaluateOffer(player, offer):
    score = 0

    // Money (40%)
    score += (offer.totalValue / marketValue) * 40

    // Guaranteed (25%)
    score += (offer.guaranteed / offer.totalValue) * 25

    // Team Success (15%)
    score += (team.recentWinPct * 100) * 0.15

    // Role (10%)
    if offer.role == 'STARTER':
        score += 10

    // Location/Preference (10%)
    score += locationPreference * 0.10

    return score
```

### AI Team Behavior

| Team Need Level | Spending Behavior |
|-----------------|-------------------|
| Critical Need | Overpay 10-20% |
| High Need | Pay market value |
| Moderate Need | Slight discount |
| Low Need | Bargain hunting only |

### User Interface

| View | Information |
|------|-------------|
| Market Board | All available FAs, sorted by position/OVR |
| Cap Tracker | Current space, projected space |
| Offer History | Pending offers, results |
| Target List | User's priority targets |
| News Feed | Signings as they happen |

### User Actions
- Browse free agent market
- Make contract offers
- Compete in bidding wars
- Track rival team signings

---

## Phase 7: Senior Bowl / Shrine Game

### Timing
- **Week:** 6 (Days 36-38)
- **Duration:** 3 days

### Purpose
Scouting opportunity for small-school prospects and players needing to prove themselves.

### Participants
- 100-120 draft-eligible players
- Emphasis on non-Power 5 prospects
- Players with questions about their game

### Scouting Reveals

| Scout Level | Information Revealed |
|-------------|---------------------|
| Elite (90+) | 2-3 traits, interview notes |
| Good (80-89) | 2 traits, basic character |
| Average (70-79) | 1 trait |
| Poor (<70) | General impression only |

### Stock Changes

```
function processSeniorBowl(prospect):
    // Performance roll
    performance = random(1, 100)

    if performance >= 90:
        prospect.stockChange = 'MAJOR_RISER'
        prospect.scoutedOVR += random(3, 6)
        prospect.revealedTraits += 1
    else if performance >= 75:
        prospect.stockChange = 'RISER'
        prospect.scoutedOVR += random(1, 3)
    else if performance >= 25:
        prospect.stockChange = 'NONE'
    else if performance >= 10:
        prospect.stockChange = 'FALLER'
        prospect.scoutedOVR -= random(1, 3)
    else:
        prospect.stockChange = 'MAJOR_FALLER'
        prospect.scoutedOVR -= random(3, 5)
        prospect.revealedConcerns += 1
```

### Narrative Elements
- "Day 1 Practice Notes: [Player] turning heads"
- "Stock Rising: [Player] showing NFL-ready skills"
- "Concern: [Player] struggled in 1-on-1s"

### User Actions
- Assign scout to event (or sim)
- Review prospect updates
- Adjust draft board

---

## Phase 8: NFL Combine

### Timing
- **Week:** 7-8 (Days 43-52)
- **Duration:** 5 days (by position group)

### Combine Schedule

| Day | Position Groups |
|-----|-----------------|
| Day 1 | QB, WR, TE |
| Day 2 | RB, OL |
| Day 3 | DL, LB |
| Day 4 | DB |
| Day 5 | Specialists, makeup tests |

### Measurables Revealed

| Test | What It Measures | Position Importance |
|------|------------------|---------------------|
| 40-Yard Dash | Straight-line speed | WR, CB, RB high |
| Bench Press | Upper body strength | OL, DL high |
| Vertical Jump | Explosiveness | WR, CB, LB high |
| Broad Jump | Lower body power | All positions |
| 3-Cone Drill | Agility, change of direction | All positions |
| 20-Yard Shuttle | Lateral quickness | DB, LB high |
| Position Drills | Sport-specific skills | Varies |

### Combine Results Format

```
interface CombineResults {
    height: string;        // "6'3"
    weight: number;        // 218 lbs
    armLength: number;     // 33.5"
    handSize: number;      // 9.75"
    fortyYard: number;     // 4.42
    benchPress: number;    // 18 reps
    vertical: number;      // 38.5"
    broadJump: number;     // 10'6"
    threeCone: number;     // 6.89
    shuttle: number;       // 4.12
    medicalGrade: string;  // 'CLEAR' | 'FLAG' | 'CONCERN'
}
```

### Medical Evaluations

| Grade | Description | Impact |
|-------|-------------|--------|
| CLEAR | No concerns | None |
| FLAG | Minor issue noted | -2 to -5 draft value |
| CONCERN | Significant history | -5 to -15 draft value |
| FAIL | Major unreported issue | May go undrafted |

### Interview Reveals

| Scout Access | Interview Information |
|--------------|----------------------|
| Elite | Full character profile, leadership |
| Good | 2-3 personality traits |
| Average | 1-2 traits, basic intel |
| Poor | Superficial impression |

### Combine Warriors vs. Game Tape

```
function adjustForCombinePerformance(prospect, results):
    expectedResults = getExpectedResults(prospect.trueOVR, prospect.position)

    // Calculate variance from expected
    variance = calculateVariance(results, expectedResults)

    if variance > 15:  // Combine warrior
        prospect.combineBonus = true
        prospect.scoutedOVR += random(2, 5)
        // Flag: may not translate to field
        if random() < 0.40:
            prospect.hiddenConcern = 'WORKOUT_WARRIOR'

    else if variance < -15:  // Poor combine
        prospect.scoutedOVR -= random(2, 4)
        // May be undervalued
        if random() < 0.30:
            prospect.hiddenBonus = 'BETTER_ON_FIELD'
```

### User Actions
- Watch combine coverage (narrative)
- Review measurables for all prospects
- Flag medical concerns
- Update draft board

---

## Phase 9: Pro Days

### Timing
- **Week:** 8-10 (Days 50-63)
- **Duration:** 14 days (multiple schools)

### Purpose
School-specific workouts where prospects can improve on combine numbers.

### Pro Day Schedule
- Major schools: Full coverage
- Mid-major schools: Partial coverage
- Small schools: Limited coverage

### What's Revealed

| Element | Description |
|---------|-------------|
| Improved Measurables | Retests of combine drills |
| Position-Specific Drills | On-field skills |
| Throwing Sessions | QB arm strength, accuracy |
| Scheme Fit | Coach evaluations |

### Pro Day Adjustments

```
function processProDay(prospect, team):
    // Prospects can improve combine numbers
    retest = random()

    if retest > 0.6:  // 40% improve
        improvement = random(0.02, 0.08)  // 40 time
        prospect.combineResults.fortyYard -= improvement
        prospect.proDay.improved = true

    // Position drills
    drillGrade = evaluateDrills(prospect)
    if drillGrade > 85:
        prospect.scoutedOVR += random(1, 2)
    else if drillGrade < 60:
        prospect.scoutedOVR -= random(1, 2)

    // Team-specific evaluation
    schemeFit = evaluateSchemeFit(prospect, team.scheme)
    return { drillGrade, schemeFit, improved: prospect.proDay.improved }
```

### Narrative Elements
- "[QB] showed improved velocity at [School] Pro Day"
- "[WR] ran unofficial 4.38, better than combine"
- "Coaches came away impressed with [Player's] footwork"

### User Actions
- Send scouts to priority pro days
- Review updated measurables
- Evaluate scheme fit grades

---

## Phase 10: Individual Workouts

### Timing
- **Week:** 10-11 (Days 64-77)
- **Duration:** 10-14 days

### Visit Limits

| Category | Limit | Notes |
|----------|-------|-------|
| Top 30 Visits | 30 per team | Formal pre-draft visits |
| Local Workouts | Unlimited | Prospects within 100 miles |
| Virtual Meetings | Unlimited | Video calls, film review |

### What's Revealed

| Element | Description | Scout Level Required |
|---------|-------------|---------------------|
| Full Medical | Complete injury history | Good (80+) |
| Character Deep Dive | Background, interviews | Good (80+) |
| Scheme Fit | Position coach evaluation | Average (70+) |
| Hidden Concerns | Red flags | Elite (90+) |
| Ceiling Confirmation | True potential | Elite (90+) |

### Workout Process

```
function conductPrivateWorkout(team, prospect):
    // Use a visit slot
    if team.remainingVisits <= 0:
        return 'NO_VISITS_REMAINING'

    team.remainingVisits--

    // Gather information based on scout level
    scout = team.scoutDepartment.getScout(prospect.position)

    reveals = {
        medical: scout.ovr >= 80,
        character: scout.ovr >= 80,
        schemeFit: scout.ovr >= 70,
        concerns: scout.ovr >= 90,
        ceiling: scout.ovr >= 90
    }

    // Update prospect intel
    for reveal in reveals:
        if reveals[reveal]:
            prospect.intel[reveal] = getActualValue(prospect, reveal)

    return { reveals, updatedProspect: prospect }
```

### Final Grade Adjustments

After workouts, scouts make final adjustments:

| Adjustment | Trigger | Change |
|------------|---------|--------|
| Scheme Star | Perfect fit confirmed | +3 to +5 |
| Solid Fit | Good scheme match | +1 to +2 |
| Poor Fit | Scheme mismatch | -2 to -4 |
| Character Concern | Red flag found | -5 to -10 |
| Medical Flag | Injury concern | -3 to -8 |
| Ceiling Raised | Potential confirmed | +3 to +6 potential |

### User Actions
- Schedule private workouts (use visit slots)
- Prioritize target prospects
- Review all gathered intel
- Finalize draft board

---

## Phase 11: Draft

### Timing
- **Week:** 11-12 (Days 71-73)
- **Duration:** 3 days

### Draft Structure

| Round | Picks | Time per Pick | Day |
|-------|-------|---------------|-----|
| 1 | 32 | 10 minutes | Day 1 |
| 2 | 32 | 7 minutes | Day 2 |
| 3 | 32 + Comp | 5 minutes | Day 2 |
| 4-7 | 32 + Comp each | 5 minutes | Day 3 |

### Pick Order

| Determination | Rule |
|---------------|------|
| Non-Playoff Teams | Inverse of record (worst picks first) |
| Playoff Teams | By playoff finish |
| Tiebreaker | Strength of schedule |
| Compensatory | End of rounds 3-7 |

### Trade During Draft

| Trade Type | Allowed |
|------------|---------|
| Pick for Pick | Yes |
| Pick for Player | Yes (with restrictions) |
| Future Picks | Up to 2 years out |
| Pick Swaps | Yes |

### Trade Value Chart (Sample)

| Pick | Value | Pick | Value |
|------|-------|------|-------|
| 1 | 3000 | 17 | 950 |
| 2 | 2600 | 32 | 590 |
| 5 | 1700 | 33 | 580 |
| 10 | 1300 | 64 | 270 |
| 15 | 1050 | 96 | 116 |

### AI Draft Logic

```
function aiMakePick(team, availableProspects):
    // Calculate team needs
    needs = calculateTeamNeeds(team)

    // Get BPA (Best Player Available)
    bpa = availableProspects[0]

    // Get best player at need positions
    bestNeed = getBestAtNeed(availableProspects, needs)

    // Decision logic
    bpaValue = bpa.value
    needValue = bestNeed.value * getNeedMultiplier(needs[bestNeed.position])

    if bpaValue > needValue * 1.15:
        // BPA significantly better
        return bpa
    else if needValue > bpaValue * 1.10:
        // Need significantly better
        return bestNeed
    else:
        // Close - go with need
        return bestNeed
```

### Draft Grades

After each pick:

| Grade | Criteria |
|-------|----------|
| A+ | Steal (BPA at need, value pick) |
| A | Great value or perfect need |
| B+ | Good pick, slight reach |
| B | Solid pick, meets need |
| C | Reach or questionable fit |
| D | Significant reach |
| F | Major reach or wasted pick |

### GM Points from Draft

| Achievement | Points |
|-------------|--------|
| Steal (A+ pick) | +100 |
| Great Pick (A) | +75 |
| Good Pick (B+/B) | +50 |
| Reach (C or below) | -25 |
| Trade Up Success | +50 |
| Trade Down Value | +75 |

### User Actions
- Make picks when on the clock
- Trade up/down
- Work the phones (trade negotiations)
- Watch board fall
- React to AI picks

---

## Phase 12: UDFA Signing

### Timing
- **Week:** 12 (Days 74-75)
- **Duration:** 2 days (immediately after draft)

### UDFA Pool

| Count | OVR Range | Notes |
|-------|-----------|-------|
| 40-60 players | 50-62 | Undrafted prospects |

### Signing Priority

| Order | Team | Notes |
|-------|------|-------|
| 1-32 | Inverse draft order | Worst record picks first |

### UDFA Tiers

| Tier | Count | OVR | Signing Bonus |
|------|-------|-----|---------------|
| Priority | 10-15 | 58-62 | $20K-$100K |
| Camp Invite | 25-35 | 54-58 | $5K-$20K |
| Tryout | 10-15 | 50-54 | $0-$5K |

### Signing Competition

```
function signUDFA(udfaPlayer, interestedTeams):
    offers = []

    for team in interestedTeams:
        // Calculate offer
        bonus = calculateBonus(udfaPlayer, team)
        role = determineRole(udfaPlayer, team.roster)
        offers.add({ team, bonus, role })

    // UDFA decision factors
    for offer in offers:
        score = 0
        score += offer.bonus / 100000 * 30  // Money (30%)
        score += getRosterChance(offer.team, udfaPlayer) * 40  // Opportunity (40%)
        score += offer.team.prestige * 20  // Prestige (20%)
        score += locationPref * 10  // Location (10%)
        offer.score = score

    return offers.maxBy(score)
```

### User Actions
- Target priority UDFAs
- Compete with other teams
- Manage signing bonus pool
- Fill roster holes

---

## Phase 13: OTAs / Minicamp

### Timing
- **Week:** 12-14 (Days 78-91)
- **Duration:** 14 days

### OTA Rules

| Element | Rule |
|---------|------|
| Veteran Participation | Voluntary |
| Rookie Participation | Mandatory |
| Contact | Non-contact, no pads |
| Focus | Scheme installation, conditioning |

### XP Earning

| Activity | XP Earned | Notes |
|----------|-----------|-------|
| Full Participation | +50 XP/week | All sessions |
| Partial | +25 XP/week | Some sessions |
| Skip (Veteran) | 0 XP | No penalty |
| Rookie Absence | -Chemistry | Bad look |

### Veteran Holdouts

| Reason | Likelihood | Resolution |
|--------|------------|------------|
| Contract Dispute | 15% | Negotiation |
| Rest/Recovery | 30% | Normal |
| Personal | 10% | Returns for camp |

### Scheme Installation

```
function processOTAs(team):
    for player in team.roster:
        if player.participatesInOTAs:
            // XP gain
            player.earnXP(50 * weeksParticipated)

            // Scheme learning
            if player.experience == 0:  // Rookie
                player.schemeKnowledge += 20
            else:
                player.schemeKnowledge += 10

    // Team chemistry
    participation = team.otaParticipationRate
    if participation > 0.80:
        team.chemistry += 5
    else if participation < 0.50:
        team.chemistry -= 5
```

### User Actions
- Set practice focus
- Monitor participation
- Begin scheme installation
- Evaluate early standouts

---

## Phase 14: Rookie Camp

### Timing
- **Week:** 14-15 (Days 92-96)
- **Duration:** 5 days

### Participants
- All drafted rookies
- All signed UDFAs
- Tryout players (5-10)

### Evaluation Focus

| Area | Weight | Notes |
|------|--------|-------|
| Learning Speed | 30% | Playbook absorption |
| Physical Readiness | 25% | NFL body, conditioning |
| Technique | 25% | Position skills |
| Attitude | 20% | Coachability, effort |

### Trait Reveals

Rookie camp reveals remaining hidden traits:

```
function processRookieCamp(rookie):
    // Reveal hidden traits
    for trait in rookie.hiddenTraits:
        if random() < 0.75:  // 75% reveal rate
            rookie.knownTraits.add(trait)
            rookie.hiddenTraits.remove(trait)

    // Camp performance
    performance = evaluateCampPerformance(rookie)

    if performance > 85:
        rookie.narrativeTag = 'CAMP_STANDOUT'
        rookie.scoutedOVR += random(1, 3)
    else if performance < 50:
        rookie.narrativeTag = 'STRUGGLING'
        rookie.scoutedOVR -= random(1, 2)

    // XP gain
    rookie.earnXP(100)
```

### Narrative Elements
- "Standout: [Rookie] turning heads with route running"
- "[Rookie] struggling to learn playbook"
- "Tryout player [Name] earned roster spot"

### User Actions
- Observe practice reports
- Evaluate rookie progress
- Make early depth chart decisions
- Sign standout tryout players

---

## Phase 15: Training Camp

### Timing
- **Week:** 15-17 (Days 99-112)
- **Duration:** 14 days

### Roster Management

| Stage | Roster Size | Action |
|-------|-------------|--------|
| Camp Start | 70-75 | Signed camp bodies |
| Mid-Camp | 70 | Minor cuts |
| Pre-Preseason | 70 | Evaluation period |

### Position Battles

```
function evaluatePositionBattle(candidates):
    for candidate in candidates:
        score = 0

        // OVR (40%)
        score += candidate.ovr * 0.40

        // Scheme Fit (25%)
        score += candidate.schemeFit * 0.25

        // Camp Performance (20%)
        score += candidate.campGrade * 0.20

        // Veteran Bonus (10%)
        if candidate.experience > 0:
            score += 10

        // Contract (5%)
        score += (candidate.salary / maxSalary) * 5

        candidate.battleScore = score

    return candidates.sortBy(battleScore).reverse()
```

### XP Earning

| Activity | XP per Day | Total (14 days) |
|----------|------------|-----------------|
| Full Practice | 20 XP | 280 XP |
| Light Day | 10 XP | Variable |
| Day Off | 0 XP | Recovery |

### Injury Risk

| Intensity | Injury Rate | Severity |
|-----------|-------------|----------|
| High | 5% per practice | Minor to moderate |
| Normal | 2% per practice | Usually minor |
| Light | 0.5% per practice | Minor only |

### Camp Battles Tracked

| Position | Battle Type | Resolution |
|----------|-------------|------------|
| QB | Starter vs. backup | Week 16 |
| RB | Carries distribution | Ongoing |
| WR | 3-5 spots | Week 17 |
| CB | Starting duo | Week 16 |
| All | Bubble players | Preseason |

### User Actions
- Set practice intensity
- Monitor position battles
- Manage injury risk
- Make preliminary depth chart
- Identify cut candidates

---

## Phase 16: Preseason Games

### Timing
- **Week:** 17-18 (Days 113-122)
- **Duration:** 10 days (3 games)

### Game Schedule

| Game | Week | Starters Play | Evaluation Focus |
|------|------|---------------|------------------|
| Game 1 | 17 | 1 quarter | Scheme test, rust removal |
| Game 2 | 17-18 | 1-2 quarters | Starter evaluation |
| Game 3 | 18 | Minimal/none | Bubble players only |

### Playing Time Distribution

| Roster Status | Game 1 | Game 2 | Game 3 |
|---------------|--------|--------|--------|
| Starters | 15-20 snaps | 25-35 snaps | 0-5 snaps |
| Backups | 25-35 snaps | 25-35 snaps | 20-30 snaps |
| Bubble | 20-30 snaps | 15-25 snaps | 40-50 snaps |

### Performance Grading

```
function gradePreseasonPerformance(player, gameStats):
    grade = 70  // Base grade

    // Position-specific adjustments
    switch player.position:
        case 'QB':
            grade += (gameStats.passer_rating - 80) * 0.3
            grade += gameStats.touchdowns * 5
            grade -= gameStats.interceptions * 10

        case 'RB':
            grade += (gameStats.yards_per_carry - 4.0) * 10
            grade += gameStats.touchdowns * 8

        // ... other positions

    // Cap grade
    return clamp(grade, 40, 99)
```

### Bubble Player Evaluation

| Grade | Likelihood to Make Roster |
|-------|---------------------------|
| 90+ | Lock (starter potential) |
| 80-89 | Likely (solid backup) |
| 70-79 | 50/50 (needs final game) |
| 60-69 | Unlikely (PS candidate) |
| <60 | Cut candidate |

### Injury Risk (Preseason)

| Player Type | Risk Level |
|-------------|------------|
| Starters | 3% per quarter |
| Backups | 2% per quarter |
| Bubble | 1% per quarter |

### User Actions
- Set playing time distribution
- Watch/sim games
- Review performance grades
- Finalize cut list
- Manage injury situations

---

## Phase 17: Final Cuts (70 → 53)

### Timing
- **Week:** 18 (Days 123-124)
- **Deadline:** Tuesday 4:00 PM

### Cut Process

```
function processFinalCuts(team):
    roster = team.roster
    targetSize = 53

    // Calculate cut priority
    for player in roster:
        player.cutPriority = calculateCutPriority(player)

    // Sort by cut priority (highest = most likely to cut)
    roster.sortBy(cutPriority).reverse()

    // Cut to 53
    while roster.size > targetSize:
        playerToCut = roster[0]

        // User confirmation for key players
        if playerToCut.ovr >= 70 or playerToCut.salary >= 1000000:
            confirmed = promptUserConfirmation(playerToCut)
            if !confirmed:
                // Find next cut candidate
                continue

        // Process cut
        processPlayerCut(playerToCut)
        roster.remove(playerToCut)

function calculateCutPriority(player):
    priority = 0

    // Lower OVR = higher cut priority
    priority += (100 - player.ovr) * 2

    // Lower salary = higher cut priority
    priority += (10 - player.salary_millions) * 5

    // Less experience = higher cut priority
    if player.experience == 0:
        priority += 20

    // Position depth (more depth = higher priority for cuts)
    depthAtPosition = team.getDepthAt(player.position)
    if depthAtPosition > 4:
        priority += 15

    // Scheme fit
    if player.schemeFit < 60:
        priority += 10

    return priority
```

### Waiver Wire

When teams cut players:

| Waiver Order | Claim Priority |
|--------------|----------------|
| Inverse of standings | Worst team claims first |
| Claims process | Daily at 4 PM |
| Waiver period | 24 hours for vested vets |

### Cut Player Outcomes

| Outcome | Eligibility | Description |
|---------|-------------|-------------|
| Waiver Claim | All teams | Another team picks up |
| Practice Squad | Original team priority | Sign to PS |
| Free Agent | All teams | Becomes street FA |
| Retirement | N/A | Player retires |

### User Actions
- Review final 70-man roster
- Make cut decisions
- Claim players on waivers
- Handle deadline pressure

---

## Phase 18: Practice Squad

### Timing
- **Week:** 18 (Days 124-126)
- **Duration:** 2 days after final cuts

### Practice Squad Rules

| Element | Rule |
|---------|------|
| Size | 16 players |
| Eligibility | <3 seasons accrued |
| Protected | 4 per week (can't be signed) |
| Elevation | 3x per season (game day) |
| Salary | $11,500/week |

### Priority Signing

| Order | Description |
|-------|-------------|
| 1 | Own cut players (24-hour window) |
| 2 | Other teams' cuts |
| 3 | Street free agents |

### PS Formation

```
function formPracticeSquad(team):
    ps = []
    targetSize = 16

    // Priority: own cuts
    ownCuts = team.recentCuts.filter(eligible)
    for player in ownCuts:
        if ps.size < targetSize:
            if player.agreesToPS:  // May refuse
                ps.add(player)

    // Claim other cuts
    availableCuts = getAllAvailableCuts().filter(eligible)
    while ps.size < targetSize and availableCuts.length > 0:
        target = selectBestAvailable(availableCuts, team.needs)
        if claimPlayer(target):
            ps.add(target)
        availableCuts.remove(target)

    return ps
```

### Practice Squad Poaching

| Rule | Description |
|------|-------------|
| Other Teams | Can sign any PS player to 53 |
| Original Team | Gets 24 hours to match (promote to 53) |
| Frequency | Common in-season |

### User Actions
- Sign own cuts to PS
- Claim other teams' cuts
- Set 4 protected players weekly
- Manage PS elevations (in-season)

---

# PART 3: ROSTER MANAGEMENT

## Roster Size Flow

```
SEASON END (53 + 16 PS)
     ↓
FA/DRAFT (53-60 on roster, releasing players)
     ↓
MINICAMP (60-70, sign camp bodies)
     ↓
TRAINING CAMP (70)
     ↓
PRESEASON (70, evaluation)
     ↓
FINAL CUTS (70 → 53)
     ↓
PRACTICE SQUAD (+16)
     ↓
WEEK 1 (53 + 16 PS)
```

## Roster Limits by Phase

| Phase | Active | Practice Squad | Injured Reserve |
|-------|--------|----------------|-----------------|
| Season | 53 | 16 | Unlimited |
| Offseason (Early) | No limit | N/A | N/A |
| Training Camp | 70 max | N/A | N/A |
| Regular Season | 53 | 16 | Unlimited |

## Injured Reserve Rules

| Rule | Regular Season | Offseason |
|------|----------------|-----------|
| Minimum Stay | 4 games | N/A |
| Return Designations | 8 per season | N/A |
| Offseason IR | Players on IR recover | Cleared by camp |

---

# PART 4: DATA MODELS

## Offseason State

```typescript
interface OffseasonState {
    year: number;
    currentPhase: OffseasonPhase;
    phaseDay: number;
    completedPhases: OffseasonPhase[];

    // Phase-specific data
    awards?: AwardsData;
    coaching?: CoachingChangesData;
    franchiseTag?: FranchiseTagData;
    freeAgency?: FreeAgencyState;
    scouting?: ScoutingState;
    draft?: DraftState;
    camp?: TrainingCampState;
}

type OffseasonPhase =
    | 'season_end'
    | 'awards'
    | 'coaching_changes'
    | 'franchise_tag'
    | 'fa_own_players'
    | 'fa_open_market'
    | 'senior_bowl'
    | 'combine'
    | 'pro_days'
    | 'workouts'
    | 'draft'
    | 'udfa'
    | 'otas'
    | 'rookie_camp'
    | 'training_camp'
    | 'preseason'
    | 'final_cuts'
    | 'practice_squad';
```

## Free Agency State

```typescript
interface FreeAgencyState {
    marketPhase: 'tampering' | 'frenzy' | 'active' | 'slow' | 'post_draft';
    availableFAs: FreeAgent[];
    pendingOffers: ContractOffer[];
    completedSignings: Signing[];
    userTargets: string[];  // Player IDs
    teamCapSpace: Map<string, number>;
}

interface ContractOffer {
    id: string;
    playerId: string;
    teamId: string;
    years: number;
    totalValue: number;
    guaranteed: number;
    yearlyBreakdown: number[];
    bonuses: ContractBonus[];
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    expiresAt: number;
}

interface ContractBonus {
    type: 'signing' | 'roster' | 'option' | 'incentive';
    amount: number;
    year: number;
    condition?: string;
}
```

## Scouting State

```typescript
interface ScoutingState {
    draftClass: DraftProspect[];
    scoutingEvents: ScoutingEvent[];
    userDraftBoard: string[];  // Prospect IDs in order
    visitsUsed: number;
    visitsRemaining: number;
}

interface ScoutingEvent {
    type: 'senior_bowl' | 'combine' | 'pro_day' | 'workout';
    prospectId: string;
    reveals: ScoutingReveal;
    stockChange: 'major_riser' | 'riser' | 'none' | 'faller' | 'major_faller';
}

interface ScoutingReveal {
    measurables?: Partial<CombineResults>;
    traits?: string[];
    concerns?: string[];
    character?: string;
    gradeAdjustment?: number;
    medicalFlag?: boolean;
}
```

## Draft State

```typescript
interface DraftState {
    year: number;
    currentRound: number;
    currentPick: number;
    onTheClock: string;  // Team ID
    timeRemaining: number;
    picks: DraftPick[];
    trades: DraftTrade[];
    availableProspects: string[];  // Prospect IDs
}

interface DraftPick {
    round: number;
    pick: number;
    overall: number;
    teamId: string;
    prospectId?: string;
    grade?: string;
    tradeDetails?: string;
}

interface DraftTrade {
    id: string;
    team1: string;
    team2: string;
    team1Gives: TradeAsset[];
    team2Gives: TradeAsset[];
    timestamp: number;
}

interface TradeAsset {
    type: 'pick' | 'player';
    pickInfo?: { round: number; year: number };
    playerId?: string;
}
```

## Training Camp State

```typescript
interface TrainingCampState {
    roster: RosterPlayer[];
    positionBattles: PositionBattle[];
    practiceIntensity: 'high' | 'normal' | 'light';
    injuries: CampInjury[];
    cutList: string[];
    preseasonGames: PreseasonGame[];
}

interface PositionBattle {
    position: string;
    candidates: string[];  // Player IDs
    leader: string;
    resolved: boolean;
}

interface PreseasonGame {
    week: number;
    opponent: string;
    result?: { score: string; won: boolean };
    performances: Map<string, number>;  // Player ID -> grade
}
```

---

# PART 5: GM POINTS INTEGRATION

## Offseason GM Point Opportunities

| Achievement | Points | Phase |
|-------------|--------|-------|
| Player wins MVP | +1000 | Awards |
| Player wins OPOY/DPOY | +750 | Awards |
| Player wins ROY | +500 | Awards |
| First-Team All-Pro | +300 each | Awards |
| Second-Team All-Pro | +150 each | Awards |
| Re-sign key player | +100 | FA - Own |
| Sign top FA target | +150 | FA - Open |
| Draft steal (A+ grade) | +100 | Draft |
| Trade up success | +50 | Draft |
| Trade down value | +75 | Draft |
| Sign impact UDFA | +50 | UDFA |
| Develop breakout rookie | +200 | Camp |

---

# PART 6: UI REQUIREMENTS

## Offseason Hub

```
┌──────────────────────────────────────────────────┐
│  OFFSEASON HUB                    Year 2026      │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ CURRENT PHASE: NFL COMBINE                  │ │
│  │ Day 3 of 5 • DB Testing Today               │ │
│  │                                              │ │
│  │ [VIEW COMBINE RESULTS]  [DRAFT BOARD]       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  PHASE TIMELINE:                                 │
│  ✓ Season End    ✓ Awards    ✓ Coaching         │
│  ✓ Tags    ✓ Re-Sign    ✓ Free Agency           │
│  ● Combine    ○ Pro Days    ○ Workouts          │
│  ○ Draft    ○ UDFA    ○ OTAs    ○ Camp          │
│                                                  │
│  QUICK STATS:                                    │
│  Cap Space: $34.2M                               │
│  Roster: 62/70                                   │
│  Draft Picks: 8                                  │
│                                                  │
│  [ROSTER]  [CAP]  [SCOUTING]  [NEWS]            │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Free Agency View

```
┌──────────────────────────────────────────────────┐
│  FREE AGENCY                    Day 5 (Frenzy)   │
├──────────────────────────────────────────────────┤
│  Cap Space: $34.2M    Pending Offers: 2          │
├──────────────────────────────────────────────────┤
│                                                  │
│  TOP AVAILABLE:                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ ★ Marcus Johnson  WR  85 OVR               │ │
│  │   Age: 27  Asking: ~$18M/yr                │ │
│  │   Interest: HIGH (8 teams)                 │ │
│  │   [MAKE OFFER]  [ADD TO TARGETS]           │ │
│  └────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────┐ │
│  │ Terrell Davis  CB  82 OVR                  │ │
│  │   Age: 26  Asking: ~$14M/yr                │ │
│  │   Interest: MEDIUM (5 teams)               │ │
│  │   [MAKE OFFER]  [ADD TO TARGETS]           │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  YOUR PENDING OFFERS:                            │
│  • J. Williams (OT) - $12M/4yr - Considering    │
│  • K. Brown (LB) - $6M/3yr - Counter Received   │
│                                                  │
│  RECENT SIGNINGS:                                │
│  • CHI signs D. Miller (DE) - 4yr/$72M          │
│  • NYG signs T. Adams (S) - 3yr/$42M            │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Draft Room View

```
┌──────────────────────────────────────────────────┐
│  NFL DRAFT                   Round 1 • Pick 15   │
├──────────────────────────────────────────────────┤
│  ON THE CLOCK: YOUR TEAM          Time: 7:42     │
├──────────────────────────────────────────────────┤
│                                                  │
│  YOUR BOARD (Available):                         │
│  ┌────────────────────────────────────────────┐ │
│  │ 1. Jaylen Thompson  DE  84 OVR  ★ Star     │ │
│  │    Scheme Fit: 95%  Need: HIGH             │ │
│  │    [SELECT]                                │ │
│  ├────────────────────────────────────────────┤ │
│  │ 2. Marcus Williams  OT  82 OVR  Starter    │ │
│  │    Scheme Fit: 88%  Need: MODERATE         │ │
│  │    [SELECT]                                │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  TRADE OFFERS INCOMING:                          │
│  • MIA offers Pick 22 + Pick 54 for your pick   │
│  • DEN offers Pick 18 + 2026 2nd for your pick  │
│  [VIEW TRADE OFFERS]                             │
│                                                  │
│  PREVIOUS PICKS (Round 1):                       │
│  14. DET - K. Davis, WR (A)                     │
│  13. NYJ - T. Miller, CB (B+)                   │
│  12. CLE - J. Adams, OT (A-)                    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# PART 7: INTEGRATION POINTS

## With Existing Systems

| System | Integration Point |
|--------|-------------------|
| Season Simulator | Triggers offseason after playoffs |
| Draft Generator | Provides prospect pool |
| FA Generator | Provides free agent pool |
| Training System | Camp XP, practice focus |
| GM Points | Achievement tracking |
| Scouting | Prospect evaluation accuracy |
| Salary Cap | All contract operations |
| Coaching | Staff changes, scheme effects |

## State Transitions

```
function transitionToOffseason(seasonState):
    // Save season state
    archiveSeasonState(seasonState)

    // Create offseason state
    offseasonState = {
        year: seasonState.year + 1,
        currentPhase: 'season_end',
        phaseDay: 1,
        completedPhases: []
    }

    // Initialize phase-specific data
    offseasonState.awards = prepareAwardsData(seasonState)
    offseasonState.freeAgency = prepareFreeAgencyData(allTeams)
    offseasonState.scouting = generateDraftClass()

    return offseasonState

function transitionToRegularSeason(offseasonState):
    // Validate roster sizes
    for team in allTeams:
        assert team.roster.size == 53
        assert team.practiceSquad.size <= 16

    // Create new season state
    seasonState = {
        year: offseasonState.year,
        week: 19,  // Regular season week 1
        phase: 'regular'
    }

    // Generate schedule
    seasonState.schedule = generateSchedule(allTeams)

    return seasonState
```

---

**Status:** Offseason Flow System Complete
**Scope:** 18-phase offseason from season end to Week 1
**Version:** 1.0
**Date:** December 2025
