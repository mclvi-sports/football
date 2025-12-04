# In-Season Weekly Flow System

## Overview

The Weekly Flow System defines the day-by-day activities during each regular season week. From post-game analysis through gameplan preparation, this system structures all user decisions and game mechanics between games.

The regular season spans **18 weeks** (Weeks 19-36 of the 40-week calendar), with each week following a structured flow of activities, practices, and preparation.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-season-calendar-system.md` | Overall season timing, week numbers |
| `FINAL-training-system.md` | XP earning, player development |
| `FINAL-scout-system.md` | Scouting mechanics, accuracy |
| `FINAL-offseason-system.md` | Practice squad rules, roster management |
| `FINAL-schemes-system.md` | Gameplan options, scheme effects |
| `FINAL-traits-system.md` | Trait activations during games |
| `FINAL-gm-skills-perks-system.md` | GM Points from weekly achievements |

---

# PART 1: WEEKLY CALENDAR

## Standard Week (Sunday 1:00 PM Game)

| Day | Time | Activity | User Involvement |
|-----|------|----------|------------------|
| **Sunday** | 1:00 PM | GAME | Watch/Sim |
| **Monday** | All Day | Recovery & Analysis | Review grades |
| **Tuesday** | All Day | Day Off / Film Study | Scouting |
| **Wednesday** | AM | Practice 1 - Installation | Set focus |
| **Wednesday** | PM | Injury Report (Initial) | Review injuries |
| **Thursday** | AM | Practice 2 - Refinement | Gameplan |
| **Thursday** | PM | Injury Report (Update) | Designations |
| **Friday** | AM | Practice 3 - Walkthrough | Final prep |
| **Friday** | PM | Injury Report (Final) | Final status |
| **Saturday** | AM | Travel (away) / Meetings | Matchup review |
| **Saturday** | PM | Final Walkthrough | Rest |
| **Sunday** | 1:00 PM | GAME | Watch/Sim |

---

## Thursday Night Football Week

Short week - only 4 days between games.

| Day | Activity | Notes |
|-----|----------|-------|
| **Sunday** | GAME | Previous game |
| **Monday** | Recovery ONLY | No practice, mandatory rest |
| **Tuesday** | Light Practice | Walkthrough only, +injury risk |
| **Wednesday** | Practice + Travel | Abbreviated |
| **Thursday** | GAME | Primetime |

### TNF Modifiers

| Element | Effect |
|---------|--------|
| Practice XP | -50% (less practice time) |
| Injury Recovery | Reduced time to heal |
| Fatigue | +10% for all players |
| Gameplan Prep | Limited adjustments |

---

## Sunday Night Football Week

Normal week with late kickoff.

| Day | Activity | Notes |
|-----|----------|-------|
| Sunday-Saturday | Standard Week | Normal schedule |
| **Sunday** | 8:20 PM Kickoff | Extra prep time same day |

### SNF Modifiers

| Element | Effect |
|---------|--------|
| Practice XP | Normal |
| Primetime Bonus | +10% XP for good performance |
| Narrative | National spotlight |
| Badge Activation | "Big Game" badges active |

---

## Monday Night Football Week

Extra day of preparation.

| Day | Activity | Notes |
|-----|----------|-------|
| **Sunday** | OFF (no game) | Extra rest |
| **Monday** | Travel / Light Practice | Away teams travel |
| **Monday** | 8:15 PM Kickoff | Primetime |
| **Tuesday** | Recovery | Post-game |

### MNF Modifiers (Previous Week)

| Element | Effect |
|---------|--------|
| Practice XP | +25% (extra practice day) |
| Injury Recovery | Extra day to heal |
| Gameplan Prep | +10% effectiveness |
| Scouting | Extra opponent scout time |

---

## Bye Week

Full week of rest and development.

| Day | Activity | Notes |
|-----|----------|-------|
| **Sunday** | OFF | No game |
| **Mon-Wed** | Recovery Focus | Injuries heal at 150% rate |
| **Thu-Fri** | Development Practice | +50% XP bonus |
| **Saturday** | Light Meetings | Scheme review |
| **Sunday** | Extra Scouting | +1 scout assignment |

### Bye Week Benefits

| Benefit | Value |
|---------|-------|
| Fatigue Reset | All players to 100% |
| Minor Injury Heal | 100% recovery |
| Moderate Injury | +50% recovery progress |
| Practice XP | +50% bonus |
| Scouting | Extra assignment |
| Morale Boost | +5 team morale |

---

# PART 2: DAY-BY-DAY BREAKDOWN

## Sunday: Game Day

### Pre-Game
| Activity | Timing | Details |
|----------|--------|---------|
| Final Gameplan | 2 hours before | Last adjustments |
| Injury Decisions | 90 minutes before | Game-time decisions |
| Inactive List | 90 minutes before | 7 players inactive |
| Starting Lineup | 60 minutes before | Confirm starters |

### Game
| Element | User Control |
|---------|--------------|
| Watch Full | Full game simulation |
| Watch Key Plays | Highlights only |
| Simulate | Skip to results |
| Timeout Management | If watching |
| Play Selection | Future feature |

### Post-Game (Immediate)
| Activity | Details |
|----------|---------|
| Final Score | Win/Loss recorded |
| Stat Summary | Key stats displayed |
| Injury Check | New injuries revealed |
| Narrative Moment | Breakout, struggle, rivalry |

---

## Monday: Recovery & Analysis

### Activities

| Time | Activity | User Action |
|------|----------|-------------|
| Morning | Injury Assessment | Review severity |
| Morning | Performance Grades | View all player grades |
| Midday | XP Distribution | Automatic, can view |
| Afternoon | Film Review | View play breakdowns |
| Evening | Recovery Protocol | Set intensity |

### Performance Grades

| Grade | Description | XP Multiplier |
|-------|-------------|---------------|
| A+ | Exceptional | 2.0x |
| A | Excellent | 1.5x |
| B+ | Very Good | 1.25x |
| B | Good | 1.0x |
| C | Average | 0.75x |
| D | Below Average | 0.5x |
| F | Poor | 0.25x |

### XP Distribution

```
function distributeGameXP(player, gameStats):
    baseXP = 50  // All rostered players

    // Win bonus
    if team.won:
        baseXP += 25

    // Performance grade
    grade = calculateGrade(player, gameStats)
    gradeMultiplier = GRADE_MULTIPLIERS[grade]

    // Position-specific bonuses
    positionBonus = calculatePositionBonus(player, gameStats)

    // Snap count factor
    snapFactor = player.snaps / expectedSnaps

    totalXP = (baseXP + positionBonus) * gradeMultiplier * snapFactor

    return Math.round(totalXP)
```

### Post-Game Narratives

| Narrative Type | Trigger | Effect |
|----------------|---------|--------|
| Breakout Game | Grade A+, unexpected | +Morale, +Fan interest |
| Bounce Back | Good game after struggle | +Morale |
| Rivalry Win | Beat division rival | +Chemistry, +Fan loyalty |
| Primetime Win | Win SNF/MNF/TNF | +Prestige |
| Shutout | Held opponent to 0 | +Defensive morale |
| Comeback | Won when down 14+ | +Clutch trait chance |
| Blowout Win | Won by 21+ | +Confidence |
| Tough Loss | Lost close game | -Morale (small) |
| Blowout Loss | Lost by 21+ | -Morale, -Confidence |
| Injury to Star | Key player injured | -Morale |

---

## Tuesday: Day Off / Film Study

### Player Day Off
- No organized practice
- Individual workouts (optional)
- Treatment for injuries

### Coach/GM Activities

| Activity | Time | User Action |
|----------|------|-------------|
| Opponent Film | AM | Auto (background) |
| Self-Scout | AM | View tendencies |
| Scouting Assignments | All Day | Assign scouts |
| Trade Talks | All Day | Review/send offers |
| Waiver Wire | 4 PM | Claim players |
| PS Decisions | All Day | Protect 4 players |

### Weekly Scouting Cycle

```
function weeklyScoutingCycle(team, week):
    assignments = team.scoutingDepartment.availableAssignments

    for assignment in assignments:
        options = [
            { type: 'OPPONENT', target: nextOpponent },
            { type: 'OPPONENT', target: futureOpponent1 },
            { type: 'OPPONENT', target: futureOpponent2 },
            { type: 'DRAFT', target: collegeGame },
            { type: 'TRADE', target: tradeTarget },
            { type: 'WAIVER', target: waiverPlayers }
        ]

        // User selects or auto-assign
        assignment.target = getUserSelection(options)
```

---

## Wednesday: Practice 1 & Initial Injury Report

### Practice Activities

| Element | Options | Effect |
|---------|---------|--------|
| **Focus** | Offense / Defense / ST | +10% XP to focused group |
| **Intensity** | High / Normal / Light | XP and injury risk |
| **Position Drills** | Select up to 3 | +5% XP to positions |

### Practice Focus Options

| Focus | Positions Affected | XP Bonus |
|-------|-------------------|----------|
| Passing Game | QB, WR, TE | +10% |
| Running Game | RB, OL | +10% |
| Pass Rush | DL, Edge | +10% |
| Coverage | CB, S, LB | +10% |
| Red Zone Offense | Skill positions | +10% |
| Red Zone Defense | All defense | +10% |
| Special Teams | K, P, returners | +10% |
| Conditioning | All players | +Stamina recovery |
| Film Study | All players | +Mental XP |

### Practice Intensity

| Intensity | XP Earned | Injury Risk | Fatigue |
|-----------|-----------|-------------|---------|
| High | 30 XP/day | 3% | +10% |
| Normal | 20 XP/day | 1% | +5% |
| Light | 10 XP/day | 0.5% | +0% |
| Rest | 0 XP | 0% | -10% |

### Initial Injury Report (Wednesday PM)

| Designation | Meaning | Practice Status |
|-------------|---------|-----------------|
| **DNP** | Did Not Practice | Out (likely) |
| **Limited** | Limited Practice | Questionable |
| **Full** | Full Practice | Will play |

### Injury Report Process

```
function generateInjuryReport(team, day):
    report = []

    for player in team.injuredPlayers:
        status = evaluateInjuryStatus(player, day)

        // Wednesday is initial
        if day == 'Wednesday':
            designation = getInitialDesignation(status)
        else if day == 'Thursday':
            designation = updateDesignation(player, status)
        else if day == 'Friday':
            designation = finalDesignation(player, status)

        report.add({
            player: player,
            injury: player.currentInjury,
            practiceStatus: getPracticeStatus(player),
            designation: designation
        })

    return report
```

---

## Thursday: Practice 2 & Gameplan

### Practice Activities
- Refinement of Wednesday's installation
- Situational practice (3rd down, red zone, 2-minute)
- Opponent-specific adjustments

### Gameplan System

| Category | Options |
|----------|---------|
| **Offensive Tendency** | Run Heavy / Balanced / Pass Heavy |
| **Passing Style** | Short / Intermediate / Deep |
| **Run Direction** | Inside / Outside / Balanced |
| **Tempo** | Slow / Normal / Hurry-Up |
| **Risk Level** | Conservative / Normal / Aggressive |

### Defensive Gameplan

| Category | Options |
|----------|---------|
| **Base Defense** | 4-3 / 3-4 / Nickel / Dime |
| **Coverage Style** | Man / Zone / Mixed |
| **Pressure** | Standard / Blitz Heavy / Conservative |
| **Run Fit** | Gap Sound / Aggressive / Contain |

### Gameplan Effectiveness

```
function calculateGameplanEffectiveness(userPlan, opponentTendencies, scouting):
    effectiveness = 50  // Base

    // Scouting bonus (more info = better counter)
    if scouting.opponentRevealed > 80%:
        effectiveness += 15
    else if scouting.opponentRevealed > 50%:
        effectiveness += 10

    // Matchup exploits
    for matchup in identifiedMismatches:
        if userPlan.exploits(matchup):
            effectiveness += 5

    // Counter their tendencies
    if userPlan.counters(opponentTendencies):
        effectiveness += 10

    return clamp(effectiveness, 0, 100)
```

### Thursday Injury Report Update

| Change | Meaning |
|--------|---------|
| DNP → Limited | Improving |
| Limited → Full | Nearly ready |
| Full → Limited | Setback |
| New DNP | Fresh injury |

---

## Friday: Practice 3 & Final Injury Report

### Walkthrough Practice
- Low intensity
- Final game prep
- Special situations review

### Final Injury Report Designations

| Designation | Meaning | Game Status |
|-------------|---------|-------------|
| **Out** | Will not play | 0% chance |
| **Doubtful** | Unlikely to play | 25% chance |
| **Questionable** | May or may not play | 50% chance |
| **Probable** | Will likely play | 75% chance |
| *(no designation)* | Full participant | 100% play |

### Game-Time Decision Process

```
function resolveGameTimeDecisions(team, gameTime):
    for player in team.questionablePlayers:
        // Roll against probability
        if player.designation == 'Questionable':
            playsGame = random() < 0.50
        else if player.designation == 'Doubtful':
            playsGame = random() < 0.25

        if playsGame:
            player.gameStatus = 'ACTIVE'
            player.snapLimit = calculateSnapLimit(player)
        else:
            player.gameStatus = 'INACTIVE'
            activateBackup(team, player.position)
```

---

## Saturday: Travel & Meetings

### Travel (Away Games)

| Element | Details |
|---------|---------|
| Departure | Morning flight/bus |
| Arrival | Early afternoon |
| Walk-through | Light at opponent facility |
| Team Meeting | Evening |
| Curfew | 11 PM |

### Home Games

| Element | Details |
|---------|---------|
| No Travel | Players at home |
| Walk-through | Optional light work |
| Team Meeting | Evening |
| Curfew | 11 PM |

### Matchup Preview (User View)

```
┌──────────────────────────────────────────────────┐
│  WEEK 7 MATCHUP PREVIEW                          │
├──────────────────────────────────────────────────┤
│                                                  │
│  YOUR TEAM (4-2)  vs  OPPONENTS (3-3)           │
│                                                  │
│  KEY MATCHUPS:                                   │
│  ┌────────────────────────────────────────────┐ │
│  │ Your WR1 (87) vs Their CB1 (82)            │ │
│  │ Advantage: OFFENSE (+5)                    │ │
│  ├────────────────────────────────────────────┤ │
│  │ Your OL (79 avg) vs Their DL (84 avg)     │ │
│  │ Advantage: DEFENSE (-5)                   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  SCOUTING INTEL:                                 │
│  • They run 62% of the time                     │
│  • Their QB struggles under pressure            │
│  • WR2 is their red zone threat                │
│                                                  │
│  INJURY IMPACT:                                  │
│  Your: RB1 (Q), CB2 (Out)                       │
│  Theirs: OT1 (Out), WR1 (Q)                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# PART 3: PRACTICE SYSTEM

## Practice XP Calculation

```
function calculatePracticeXP(player, practice):
    baseXP = INTENSITY_XP[practice.intensity]  // 10/20/30

    // Focus bonus
    if player.position in practice.focusGroup:
        baseXP *= 1.10

    // Position drill bonus
    if player.position in practice.positionDrills:
        baseXP *= 1.05

    // Age modifier (young players learn faster)
    if player.age <= 25:
        baseXP *= 1.15
    else if player.age >= 30:
        baseXP *= 0.90

    // Scheme fit
    if player.schemeFit > 80:
        baseXP *= 1.05

    // Coaching bonus
    baseXP *= (1 + positionCoach.developmentBonus / 100)

    return Math.round(baseXP)
```

## Weekly Practice XP Summary

| Week Type | Wed | Thu | Fri | Total |
|-----------|-----|-----|-----|-------|
| Standard | 20 | 20 | 10 | 50 XP |
| TNF (short) | 10 | 0 | 0 | 10 XP |
| MNF (long) | 20 | 20 | 20 | 60 XP |
| Bye Week | 30 | 30 | 15 | 75 XP |

## Practice Injuries

| Intensity | Injury Rate | Severity Distribution |
|-----------|-------------|----------------------|
| High | 3% per practice | 60% minor, 30% moderate, 10% major |
| Normal | 1% per practice | 80% minor, 15% moderate, 5% major |
| Light | 0.5% per practice | 95% minor, 5% moderate |

---

# PART 4: GAMEPLAN SYSTEM

## Offensive Gameplan Options

### Run/Pass Tendency

| Setting | Run % | Pass % | Effect |
|---------|-------|--------|--------|
| Run Heavy | 55% | 45% | +5% run success, -5% pass efficiency |
| Balanced | 50% | 50% | No modifier |
| Pass Heavy | 40% | 60% | +5% pass efficiency, -5% run success |

### Tempo

| Setting | Plays/Game | Effect |
|---------|------------|--------|
| Slow | 55-60 | +Time of Possession, +Fatigue (opponent) |
| Normal | 60-65 | Balanced |
| Hurry-Up | 70-75 | +Scoring chances, +Fatigue (self) |

### Risk Level

| Setting | Effect |
|---------|--------|
| Conservative | Fewer turnovers, fewer big plays |
| Normal | Balanced |
| Aggressive | More big plays, more turnovers |

## Defensive Gameplan Options

### Pressure Level

| Setting | Blitz % | Effect |
|---------|---------|--------|
| Conservative | 15% | Fewer sacks, better coverage |
| Standard | 25% | Balanced |
| Blitz Heavy | 40% | More sacks/TFL, bigger plays allowed |

### Coverage Style

| Setting | Man % | Zone % | Effect |
|---------|-------|--------|--------|
| Man Heavy | 70% | 30% | Better vs. short passes |
| Mixed | 50% | 50% | Balanced |
| Zone Heavy | 30% | 70% | Better vs. deep passes |

## Gameplan Application

```
function applyGameplan(userPlan, game):
    // Offensive application
    game.playCalling.runPassRatio = userPlan.offense.tendency
    game.playCalling.tempo = userPlan.offense.tempo

    if userPlan.offense.risk == 'Aggressive':
        game.modifiers.bigPlayChance += 15
        game.modifiers.turnoverRisk += 10

    // Defensive application
    game.playCalling.blitzRate = userPlan.defense.pressure
    game.playCalling.coverageStyle = userPlan.defense.coverage

    // Gameplan effectiveness affects all modifiers
    effectiveness = calculateGameplanEffectiveness(userPlan)
    game.modifiers.all *= (effectiveness / 50)  // Normalized to 1.0 at 50%
```

---

# PART 5: INJURY REPORT SYSTEM

## Injury Severity Levels

| Level | Recovery Time | Practice Impact |
|-------|---------------|-----------------|
| Minor | 0-1 weeks | Limited practice |
| Moderate | 2-4 weeks | DNP initially |
| Major | 4-8 weeks | Out multiple games |
| Severe | 8+ weeks | IR consideration |
| Season-Ending | Rest of season | Placed on IR |

## Weekly Injury Report Flow

```
SUNDAY (Game)
    ↓ New injuries occur
MONDAY (Assessment)
    ↓ Severity determined
TUESDAY (Treatment)
    ↓ Recovery begins
WEDNESDAY (Initial Report)
    ↓ DNP / Limited / Full
THURSDAY (Update)
    ↓ Status may change
FRIDAY (Final Report)
    ↓ Out / Doubtful / Questionable
SATURDAY (Preparation)
    ↓ Game-time decisions identified
SUNDAY (Game)
    ↓ 90 min before: Final status
```

## Playing Through Injury

| Designation | Snap Limit | Performance Penalty |
|-------------|------------|---------------------|
| Probable | 100% | -2% |
| Questionable (plays) | 75% | -5% |
| Doubtful (plays) | 50% | -10% |
| Out | 0% | N/A |

## Injury Recovery Modifiers

| Factor | Recovery Modifier |
|--------|-------------------|
| Bye Week | +50% |
| Elite Training Facility | +20% |
| Elite Medical Staff | +15% |
| Age 26+ | -10% per year over 26 |
| Previous Injury (same) | -20% |
| Iron Man trait | +10% |

---

# PART 6: SCOUTING LOOP

## Scouting Resources Per Week

| Resource | Base Assignments | Modifiers |
|----------|------------------|-----------|
| Scout Staff | 3 assignments | +1 per additional scout |
| GM Skills | +1 if "Inside Sources" | |
| Bye Week | +1 bonus | |

## Scouting Targets

### 1. Opponent Scouting

| Weeks Out | Information Revealed |
|-----------|---------------------|
| 3 weeks | Basic tendencies (40%) |
| 2 weeks | Detailed tendencies (70%) |
| 1 week | Full breakdown (100%) |

### 2. Draft Prospect Scouting (In-Season)

| Activity | Information |
|----------|-------------|
| Watch College Game | Performance grade, 1 trait |
| Deep Dive (2 weeks) | Full measurables estimate, 2 traits |
| Character Check | Background, interview notes |

### 3. Trade Target Scouting

| Information | Scout Required |
|-------------|----------------|
| Current OVR | Average scout |
| Contract details | Basic info |
| Hidden traits | Good scout |
| Injury history | Good scout |
| Locker room fit | Elite scout |

### 4. Waiver Wire Scouting

| Activity | Result |
|----------|--------|
| Scan Waivers | See all available |
| Deep Scout (1) | Full player profile |

## Scouting Assignment UI

```
┌──────────────────────────────────────────────────┐
│  SCOUTING ASSIGNMENTS - WEEK 7                   │
├──────────────────────────────────────────────────┤
│  Available: 4 assignments                        │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Assignment 1: [Next Opponent - CHI]  ✓     │ │
│  │ Assignment 2: [Future Opp - GB]            │ │
│  │ Assignment 3: [Draft - Alabama vs LSU]     │ │
│  │ Assignment 4: [UNASSIGNED]                 │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  [AUTO-ASSIGN]  [CONFIRM]                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# PART 7: PRACTICE SQUAD MANAGEMENT

## Weekly PS Rules

| Rule | Details |
|------|---------|
| Size | 16 players |
| Protected | 4 per week (cannot be signed by others) |
| Elevation | Up to 2 players per game (3x season limit each) |
| Signing | Other teams can sign unprotected PS players |

## Weekly PS Workflow

```
TUESDAY
    ├── Protect 4 PS players
    ├── Review other teams' cuts
    └── Consider signing replacements

SATURDAY
    ├── Elevate 0-2 PS players for game
    └── Finalize active roster (53)

SUNDAY (Post-Game)
    ├── Elevated players return to PS
    └── Track elevation count (3 max per player)
```

## PS Elevation System

```
function elevateToActiveRoster(psPlayer):
    if psPlayer.elevationCount >= 3:
        // Must sign to 53-man roster
        return 'MUST_SIGN_TO_53'

    if team.activeRoster.size >= 53:
        // Must make corresponding move
        return 'NEED_ROSTER_MOVE'

    psPlayer.elevationCount++
    psPlayer.status = 'ELEVATED'

    return 'SUCCESS'

function postGameReturnToPS(player):
    if player.status == 'ELEVATED':
        player.status = 'PRACTICE_SQUAD'
        // Counts against 3-elevation limit
```

## PS Poaching Defense

```
function handlePSSigningAttempt(otherTeam, psPlayer):
    if psPlayer.protected:
        return 'BLOCKED_PROTECTED'

    // Notify user
    notification = {
        type: 'PS_SIGNING_ATTEMPT',
        player: psPlayer,
        signingTeam: otherTeam,
        deadline: 24 hours
    }

    // User can match (promote to 53)
    if user.matches():
        psPlayer.promoteToActive()
        return 'MATCHED'
    else:
        psPlayer.signWith(otherTeam)
        return 'LOST_PLAYER'
```

---

# PART 8: XP & DEVELOPMENT

## Weekly XP Sources

| Source | Base XP | Notes |
|--------|---------|-------|
| Game Played | 50 | All active players |
| Win Bonus | +25 | Additional for wins |
| Performance Grade | 0.25x - 2.0x | Multiplier on base |
| Practice (3 days) | 30-90 | Intensity dependent |
| Prime Time | +20% | SNF/MNF/TNF |
| Bye Week Bonus | +50% | Practice XP only |

## XP to Attribute Conversion

```
function convertXPToAttributes(player):
    // Check if enough XP for upgrade
    for attribute in player.attributes:
        threshold = getUpgradeThreshold(attribute.category)

        while player.attributeXP[attribute.category] >= threshold:
            player.attributeXP[attribute.category] -= threshold

            // Roll for upgrade
            if canUpgrade(player, attribute):
                upgradeSuccess = rollUpgrade(player, attribute)
                if upgradeSuccess:
                    attribute.value += 1
                    player.ovr = recalculateOVR(player)
```

## Development Events

| Event | Trigger | Effect |
|-------|---------|--------|
| Breakout | 3 consecutive A+ games | +3 to key attribute |
| Regression | 3 consecutive D games | -1 to key attribute |
| Confidence Boost | Game-winning play | +Clutch trait chance |
| Slump | 5 games without TD | -2 temporary |
| Injury Return | First game back | 90% effectiveness |

## Badge Progress

| Badge Level | XP Required | Notes |
|-------------|-------------|-------|
| Bronze | 500 | Entry level |
| Silver | 1500 | +500 from Bronze |
| Gold | 3500 | +2000 from Silver |
| Hall of Fame | 8000 | Elite level |

---

# PART 9: NARRATIVES & EVENTS

## Weekly Narrative Types

### Performance Narratives

| Type | Trigger | Impact |
|------|---------|--------|
| Player of Week | Top performer | +Morale, +Fan interest |
| Breakout Star | Unknown player excels | +Value, +Morale |
| Bounce Back | Good game after bad | +Confidence |
| Struggling | 3+ bad games | -Morale, trade value |
| Milestone | Reaches career mark | +XP bonus |

### Team Narratives

| Type | Trigger | Impact |
|------|---------|--------|
| Winning Streak | 4+ consecutive wins | +Morale, +Chemistry |
| Losing Streak | 3+ consecutive losses | -Morale, -Chemistry |
| Rivalry Week | Play division rival | +Intensity |
| Playoff Push | In hunt, must-win | +Focus |
| Eliminated | Out of playoffs | -Morale |

### League Narratives

| Type | Trigger | User Impact |
|------|---------|-------------|
| Trade Rumor | AI considering trade | Option to counter-offer |
| Injury Report | Star player injured | Waiver opportunity |
| Suspension | Player suspended | Roster consideration |
| Hot Seat | Coach on hot seat | AI behavior change |

## Narrative UI

```
┌──────────────────────────────────────────────────┐
│  THIS WEEK IN THE LEAGUE                         │
├──────────────────────────────────────────────────┤
│                                                  │
│  🌟 PLAYER OF THE WEEK                          │
│  Marcus Johnson, WR - Your Team                  │
│  8 catches, 156 yards, 2 TDs                     │
│                                                  │
│  📰 AROUND THE LEAGUE                           │
│  • CHI star QB out 4-6 weeks with leg injury    │
│  • NYG fires OC after blowout loss              │
│  • Trade rumor: DAL shopping star RB             │
│                                                  │
│  📈 STORYLINES                                   │
│  Your team is on a 3-game winning streak!        │
│  Playoff odds have increased to 78%              │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# PART 10: BYE WEEK SPECIAL

## Bye Week Schedule

| Day | Activity | User Action |
|-----|----------|-------------|
| Sunday | OFF | Rest |
| Monday | Recovery | Injury treatment |
| Tuesday | Light Work | Development focus |
| Wednesday | Full Practice | +50% XP |
| Thursday | Full Practice | +50% XP |
| Friday | Situational | Scheme work |
| Saturday | Meetings | Scouting |
| Sunday | Extra Scouting | +1 assignment |

## Bye Week Benefits

```
function processByeWeek(team):
    // Reset fatigue
    for player in team.roster:
        player.fatigue = 0

    // Accelerate injury recovery
    for injury in team.injuries:
        injury.recoveryProgress += injury.weeklyRecovery * 1.5

    // Bonus practice XP
    for player in team.roster:
        player.earnXP(player.practiceXP * 1.5)

    // Extra scouting
    team.scoutingAssignments += 1

    // Morale boost
    team.morale += 5
```

## Bye Week Strategy Options

| Strategy | Effect |
|----------|--------|
| Rest Focus | Maximum fatigue recovery, minimal XP |
| Development | Heavy practice, maximum XP |
| Healing | Focus on injured players |
| Scouting | Extra draft/trade scouting |
| Balanced | Moderate all benefits |

---

# PART 11: TRADE DEADLINE WEEK

## Trade Deadline Timing

- **Week 27** (Regular Season Week 9)
- **Deadline:** Tuesday at 4:00 PM

## Deadline Week Schedule

| Day | Activity | Notes |
|-----|----------|-------|
| Sunday | Normal game | Pre-deadline |
| Monday | Active trade talks | Phones buzzing |
| Tuesday AM | Last-minute deals | Frenzy |
| Tuesday 4 PM | **DEADLINE** | All trades must be complete |
| Wed-Sat | Normal week | No more trades |

## Trade Deadline Mechanics

### Pre-Deadline Activity

| Factor | Effect |
|--------|--------|
| Team in contention | More buyer interest |
| Team rebuilding | More seller interest |
| Expiring contracts | Higher trade value |
| Young players | Sellers want future picks |

### Deadline Day Flow

```
function processTradeDeadline(hour):
    // Increasing urgency as deadline approaches
    if hour >= 12:  // Noon
        aiTradeActivity *= 2

    if hour >= 15:  // 3 PM
        aiTradeActivity *= 3
        // Desperate deals happen

    if hour >= 16:  // 4 PM
        // DEADLINE
        lockAllTrades()
        announceAllTrades()
```

### Post-Deadline Rules

| Rule | Description |
|------|-------------|
| No Trades | Cannot trade players |
| Waivers | Can claim waived players |
| Free Agents | Can sign street FAs |
| Practice Squad | Can sign/promote PS |

## Deadline UI

```
┌──────────────────────────────────────────────────┐
│  TRADE DEADLINE                    ⏰ 2:47:33     │
├──────────────────────────────────────────────────┤
│                                                  │
│  INCOMING OFFERS:                                │
│  ┌────────────────────────────────────────────┐ │
│  │ CHI offers: 3rd round pick                 │ │
│  │ For: J. Smith, LB (78 OVR)                │ │
│  │ [ACCEPT] [COUNTER] [DECLINE]               │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  YOUR PENDING OFFERS:                            │
│  • To DEN: 2nd for K. Davis, DE (pending)       │
│  • To NYG: 4th for M. Brown, CB (declined)      │
│                                                  │
│  BREAKING:                                       │
│  • MIA trades RB to BUF for 2nd round pick      │
│  • LAR acquires WR from SEA                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# PART 12: PLAYOFF WEEK DIFFERENCES

## Playoff Week Intensity

| Element | Regular Season | Playoffs |
|---------|----------------|----------|
| Practice Intensity | Normal | High (+10% XP) |
| Gameplan Prep | Standard | Extended (+15% effectiveness) |
| Injury Urgency | Normal | Playing through more |
| Media Attention | Moderate | High |
| Narrative Weight | Normal | 2x impact |

## Bye Week (1st Seed)

| Benefit | Value |
|---------|-------|
| Rest | Full week off |
| Scouting | Watch potential opponents |
| Healing | Extra recovery time |
| Preparation | Study both possible opponents |

## Win-or-Go-Home Narratives

| Narrative | Trigger | Effect |
|-----------|---------|--------|
| Clutch Performance | Win playoff game | +Clutch trait |
| Choke | Lose with lead | -Confidence |
| Legacy Game | Star player dominates | +Hall of Fame buzz |
| Underdog Victory | Lower seed wins | +Morale, +Fan loyalty |
| Dynasty Builder | Win championship | +GM Points, +Prestige |

## Championship Week

| Day | Activity |
|-----|----------|
| Monday | Travel to host city |
| Tue-Fri | Media week, full practice |
| Saturday | Final walkthrough |
| Sunday | **CHAMPIONSHIP GAME** |

---

# PART 13: DATA MODELS

## Weekly State

```typescript
interface WeeklyState {
    seasonYear: number;
    weekNumber: number;  // 19-36 regular, 37-40 playoffs
    dayOfWeek: DayOfWeek;
    phase: 'regular' | 'playoffs';

    // Current week details
    opponent: string;
    gameSlot: 'early' | 'late' | 'snf' | 'mnf' | 'tnf';
    isHome: boolean;
    isByeWeek: boolean;

    // Progress tracking
    completedActivities: Activity[];
    pendingActivities: Activity[];

    // Injury tracking
    injuryReport: InjuryReport;

    // Gameplan
    offensiveGameplan: OffensiveGameplan;
    defensiveGameplan: DefensiveGameplan;
}

type DayOfWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

interface Activity {
    type: ActivityType;
    completed: boolean;
    results?: any;
}

type ActivityType =
    | 'game'
    | 'post_game_analysis'
    | 'injury_report'
    | 'practice'
    | 'film_study'
    | 'scouting'
    | 'gameplan'
    | 'travel'
    | 'meetings'
    | 'walkthrough';
```

## Practice State

```typescript
interface PracticeState {
    day: 'wednesday' | 'thursday' | 'friday';
    focus: PracticeFocus;
    intensity: PracticeIntensity;
    positionDrills: Position[];
    participatingPlayers: string[];  // Player IDs
    injuredOut: string[];
}

type PracticeFocus =
    | 'passing_game'
    | 'running_game'
    | 'pass_rush'
    | 'coverage'
    | 'red_zone_offense'
    | 'red_zone_defense'
    | 'special_teams'
    | 'conditioning'
    | 'film_study';

type PracticeIntensity = 'high' | 'normal' | 'light' | 'rest';
```

## Injury Report State

```typescript
interface InjuryReport {
    weekNumber: number;
    day: 'wednesday' | 'thursday' | 'friday';
    entries: InjuryReportEntry[];
}

interface InjuryReportEntry {
    playerId: string;
    injury: string;
    practiceStatus: 'dnp' | 'limited' | 'full';
    designation?: 'out' | 'doubtful' | 'questionable' | 'probable';
}
```

## Gameplan State

```typescript
interface OffensiveGameplan {
    tendency: 'run_heavy' | 'balanced' | 'pass_heavy';
    passingStyle: 'short' | 'intermediate' | 'deep';
    runDirection: 'inside' | 'outside' | 'balanced';
    tempo: 'slow' | 'normal' | 'hurry_up';
    riskLevel: 'conservative' | 'normal' | 'aggressive';
}

interface DefensiveGameplan {
    baseDefense: '4-3' | '3-4' | 'nickel' | 'dime';
    coverageStyle: 'man' | 'zone' | 'mixed';
    pressureLevel: 'conservative' | 'standard' | 'blitz_heavy';
    runFit: 'gap_sound' | 'aggressive' | 'contain';
}
```

---

# PART 14: UI REQUIREMENTS

## Weekly Hub

```
┌──────────────────────────────────────────────────┐
│  WEEK 7                          STORM (4-2)     │
├──────────────────────────────────────────────────┤
│  vs CHICAGO BEARS (3-3) • Sunday 1:00 PM         │
│  [Home Game - Thunder Dome]                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  TODAY: THURSDAY                                 │
│  ┌────────────────────────────────────────────┐ │
│  │ ✓ Morning Practice                         │ │
│  │ ○ Finalize Gameplan                        │ │
│  │ ○ Review Injury Report                     │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  QUICK ACTIONS:                                  │
│  [PRACTICE] [GAMEPLAN] [INJURIES] [SCOUTING]    │
│                                                  │
│  THIS WEEK:                                      │
│  SUN ✓ MON ✓ TUE ✓ WED ✓ THU ● FRI ○ SAT ○ SUN │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Practice View

```
┌──────────────────────────────────────────────────┐
│  THURSDAY PRACTICE                               │
├──────────────────────────────────────────────────┤
│                                                  │
│  FOCUS:          [Passing Game ▼]                │
│  INTENSITY:      [Normal ▼]                      │
│                                                  │
│  POSITION DRILLS (select up to 3):               │
│  ☑ QB  ☑ WR  ☐ RB  ☐ TE  ☐ OL                  │
│  ☐ DL  ☐ LB  ☐ CB  ☐ S   ☐ ST                  │
│                                                  │
│  PARTICIPATION:                                   │
│  52/53 players practicing                        │
│  DNP: J. Smith (hamstring)                       │
│                                                  │
│  XP PREVIEW:                                      │
│  QB: +22 XP  |  WR: +24 XP  |  Others: +18 XP   │
│                                                  │
│  [BEGIN PRACTICE]                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Gameplan View

```
┌──────────────────────────────────────────────────┐
│  GAMEPLAN vs CHICAGO BEARS                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  OFFENSE                   DEFENSE               │
│  ───────────────────      ───────────────────   │
│  Tendency: Balanced       Base: Nickel          │
│  Passing: Intermediate    Coverage: Zone        │
│  Run Dir: Inside          Pressure: Standard    │
│  Tempo: Normal            Run Fit: Gap Sound    │
│  Risk: Normal                                    │
│                                                  │
│  KEY MATCHUPS TO EXPLOIT:                        │
│  ☑ Your WR1 vs Their CB2 (mismatch)            │
│  ☑ Your DL vs Their rookie OT                  │
│                                                  │
│  SCOUTING INTEL:                                 │
│  • Bears run 58% of the time                    │
│  • Their QB averages 1.8 INTs when blitzed     │
│  • TE is their red zone weapon                  │
│                                                  │
│  [SAVE GAMEPLAN]                                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

**Status:** Weekly Flow System Complete
**Scope:** Day-by-day in-season activities, practices, gameplan, injuries, scouting
**Version:** 1.0
**Date:** December 2025
