# Roster Generation System

## Overview

This document defines how to generate complete 53-man rosters for all 32 teams. It covers roster structure, depth chart slots, OVR expectations, team quality tiers, and the generation algorithm.

---

## Roster Structure

### 53-Man Roster Template

| Position | Count | Slots | Notes |
|----------|-------|-------|-------|
| QB | 3 | QB1, QB2, QB3 | Starter + 2 backups |
| RB | 4 | RB1, RB2, RB3, RB4 | Feature back + committee |
| WR | 6 | WR1, WR2, WR3, WR4, WR5, WR6 | 3 starters + depth |
| TE | 3 | TE1, TE2, TE3 | Starter + backups |
| LT | 2 | LT1, LT2 | Starter + swing tackle |
| LG | 2 | LG1, LG2 | Starter + backup |
| C | 2 | C1, C2 | Starter + backup |
| RG | 2 | RG1, RG2 | Starter + backup |
| RT | 2 | RT1, RT2 | Starter + swing tackle |
| DE | 4 | DE1, DE2, DE3, DE4 | 2 starters + rotation |
| DT | 4 | DT1, DT2, DT3, DT4 | 2 starters + rotation |
| MLB | 2 | MLB1, MLB2 | Starter + backup |
| OLB | 4 | OLB1, OLB2, OLB3, OLB4 | 2 starters + depth |
| CB | 5 | CB1, CB2, CB3, CB4, CB5 | 2 outside + slot + depth |
| FS | 2 | FS1, FS2 | Starter + backup |
| SS | 2 | SS1, SS2 | Starter + backup |
| K | 1 | K1 | Kicker |
| P | 1 | P1 | Punter |

**Total: 53 players**

---

### Position Group Totals

| Group | Positions | Total Players |
|-------|-----------|---------------|
| Offense | QB, RB, WR, TE, OL | 26 |
| Defense | DL, LB, DB | 25 |
| Special Teams | K, P | 2 |
| **Total** | — | **53** |

---

## Depth Chart Slot OVR Expectations

### OVR by Slot Number

Each slot has an expected OVR range. Slot 1 = best player at position, higher slots = depth.

| Slot | Role | OVR Range | Description |
|------|------|-----------|-------------|
| 1 | Elite Starter | 82-99 | Best player at position |
| 2 | Starter/Key Backup | 75-88 | Second starter or primary backup |
| 3 | Rotation/Backup | 68-80 | Rotational player or backup |
| 4 | Depth | 62-74 | Emergency depth |
| 5 | Deep Depth | 58-70 | Rarely plays |
| 6 | Bottom Roster | 55-68 | Practice squad level |

---

### Position-Specific OVR by Slot

#### Quarterbacks (3)

| Slot | Role | OVR Range |
|------|------|-----------|
| QB1 | Starter | 78-95 |
| QB2 | Backup | 68-78 |
| QB3 | 3rd String | 58-70 |

#### Running Backs (4)

| Slot | Role | OVR Range |
|------|------|-----------|
| RB1 | Feature Back | 80-94 |
| RB2 | Complementary | 74-84 |
| RB3 | 3rd Down/Backup | 68-78 |
| RB4 | Depth | 60-72 |

#### Wide Receivers (6)

| Slot | Role | OVR Range |
|------|------|-----------|
| WR1 | Primary Target | 82-96 |
| WR2 | Secondary Target | 78-88 |
| WR3 | Slot/3rd Starter | 74-84 |
| WR4 | Rotational | 68-78 |
| WR5 | Depth | 62-72 |
| WR6 | Bottom Roster | 58-68 |

#### Tight Ends (3)

| Slot | Role | OVR Range |
|------|------|-----------|
| TE1 | Starter | 78-92 |
| TE2 | Backup/TE2 Sets | 70-80 |
| TE3 | Blocking/Depth | 62-74 |

#### Offensive Tackles (4 total: 2 LT, 2 RT)

| Slot | Role | OVR Range |
|------|------|-----------|
| LT1 | Starting Left Tackle | 80-95 |
| LT2 | Swing Tackle | 68-78 |
| RT1 | Starting Right Tackle | 78-92 |
| RT2 | Swing Tackle | 66-76 |

#### Interior Offensive Line (6 total: 2 LG, 2 C, 2 RG)

| Slot | Role | OVR Range |
|------|------|-----------|
| LG1 | Starting Left Guard | 78-92 |
| LG2 | Backup Guard | 66-76 |
| C1 | Starting Center | 78-92 |
| C2 | Backup Center | 66-76 |
| RG1 | Starting Right Guard | 78-92 |
| RG2 | Backup Guard | 66-76 |

#### Defensive Ends (4)

| Slot | Role | OVR Range |
|------|------|-----------|
| DE1 | Starting Edge | 80-95 |
| DE2 | Starting Edge | 78-90 |
| DE3 | Rotational | 70-80 |
| DE4 | Depth | 64-74 |

#### Defensive Tackles (4)

| Slot | Role | OVR Range |
|------|------|-----------|
| DT1 | Starting NT/3-Tech | 80-94 |
| DT2 | Starting DT | 76-88 |
| DT3 | Rotational | 70-80 |
| DT4 | Depth | 64-74 |

#### Linebackers (6 total: 2 MLB, 4 OLB)

| Slot | Role | OVR Range |
|------|------|-----------|
| MLB1 | Starting Mike | 80-94 |
| MLB2 | Backup Mike | 68-78 |
| OLB1 | Starting Will | 78-92 |
| OLB2 | Starting Sam | 76-90 |
| OLB3 | Rotational | 68-78 |
| OLB4 | Depth | 62-72 |

#### Cornerbacks (5)

| Slot | Role | OVR Range |
|------|------|-----------|
| CB1 | CB1 Outside | 82-96 |
| CB2 | CB2 Outside | 78-88 |
| CB3 | Slot Corner | 74-84 |
| CB4 | Rotational | 68-78 |
| CB5 | Depth | 62-72 |

#### Safeties (4 total: 2 FS, 2 SS)

| Slot | Role | OVR Range |
|------|------|-----------|
| FS1 | Starting Free Safety | 80-94 |
| FS2 | Backup FS | 68-78 |
| SS1 | Starting Strong Safety | 78-92 |
| SS2 | Backup SS | 66-76 |

#### Special Teams (2)

| Slot | Role | OVR Range |
|------|------|-----------|
| K1 | Kicker | 72-92 |
| P1 | Punter | 70-90 |

---

## Team Quality Tiers

Not all teams are equal. At league start, teams are assigned to quality tiers that affect their overall roster strength.

### Tier Distribution (32 Teams)

| Tier | Team Count | Description | Team OVR Range |
|------|------------|-------------|----------------|
| Elite | 3 | Super Bowl contenders | 86-92 |
| Good | 8 | Playoff caliber | 82-86 |
| Average | 12 | Middle of the pack | 78-82 |
| Below Average | 6 | Struggling | 74-78 |
| Rebuilding | 3 | Bottom of the league | 70-74 |

### Tier Effects on Roster Generation

| Tier | Slot 1 OVR Modifier | Depth Quality | Star Players (90+) |
|------|---------------------|---------------|-------------------|
| Elite | +5 to +8 | Strong throughout | 4-6 |
| Good | +3 to +5 | Solid starters | 2-4 |
| Average | +0 | Average depth | 1-2 |
| Below Average | -3 to -5 | Weak depth | 0-1 |
| Rebuilding | -5 to -8 | Thin roster | 0 |

---

## Team Quality Assignment

### Option A: Random Distribution

```
Shuffle all 32 teams
Assign first 3 to Elite
Assign next 8 to Good
Assign next 12 to Average
Assign next 6 to Below Average
Assign last 3 to Rebuilding
```

### Option B: Conference Balance

Ensure each conference has balanced tier distribution:

| Tier | Atlantic Conference | Pacific Conference |
|------|--------------------|--------------------|
| Elite | 1-2 | 1-2 |
| Good | 4 | 4 |
| Average | 6 | 6 |
| Below Average | 3 | 3 |
| Rebuilding | 1-2 | 1-2 |

### Option C: Division Balance

Ensure each division has variety:

| Division (4 teams) | Recommended Mix |
|--------------------|-----------------|
| Competitive | 1 Good, 2 Average, 1 Below Average |
| Balanced | 1 Good, 1 Average, 1 Below Average, 1 Rebuilding |
| Top Heavy | 1 Elite, 1 Good, 1 Average, 1 Rebuilding |

---

## Roster Generation Algorithm

### Step-by-Step Process

```
function generateRoster(team, tier):
    roster = []
    tierModifier = getTierModifier(tier)
    
    // Step 1: Generate each position group
    for each position in ROSTER_TEMPLATE:
        slotCount = getSlotCount(position)
        
        for slot in 1 to slotCount:
            // Step 2: Determine target OVR for this slot
            baseOVR = getSlotOVR(position, slot)
            targetOVR = baseOVR + tierModifier + random(-2, +2)
            targetOVR = clamp(targetOVR, 55, 99)
            
            // Step 3: Select archetype
            archetype = weightedRandom(getArchetypes(position))
            
            // Step 4: Generate player using player-generation-system
            player = generatePlayer(
                position: position,
                archetype: archetype,
                targetOVR: targetOVR,
                ageContext: "roster"
            )
            
            // Step 5: Assign jersey number
            player.jerseyNumber = assignJerseyNumber(player, roster)
            
            // Step 6: Add to roster
            roster.add(player)
    
    // Step 7: Assign depth chart order
    organizeDepthChart(roster)
    
    // Step 8: Validate roster
    validateRoster(roster)
    
    return roster
```

### Slot OVR Calculation

```
function getSlotOVR(position, slot):
    baseRange = POSITION_SLOT_OVR[position][slot]
    return random(baseRange.min, baseRange.max)
```

### Age Distribution for Rosters

Use age distribution from player-generation-system:

| Slot | Age Tendency | Reasoning |
|------|--------------|-----------|
| 1 | 25-30 | Prime years for starters |
| 2 | 24-29 | Mix of young and veteran |
| 3 | 23-28 | Developing or veteran depth |
| 4 | 22-26 | Young depth players |
| 5-6 | 22-25 | Youngest, still developing |

---

## Balance Rules

### Age Balance

Target age distribution per team:

| Age Range | Target % | Count (of 53) |
|-----------|----------|---------------|
| 22-24 | 25% | 13-14 |
| 25-27 | 35% | 18-19 |
| 28-30 | 25% | 13-14 |
| 31+ | 15% | 7-8 |

### Experience Balance

| Experience | Target % | Notes |
|------------|----------|-------|
| Rookies (0 years) | 0% | No rookies at season start |
| 1-2 years | 20% | Young players |
| 3-5 years | 35% | Emerging talent |
| 6-8 years | 30% | Veteran core |
| 9+ years | 15% | Seasoned vets |

### Trait Balance

Ensure roster has mix of:

| Trait Category | Target |
|----------------|--------|
| Leadership traits | 3-5 players |
| High Motor traits | 5-8 players |
| Negative traits | 2-4 players max |
| Clutch traits | 2-3 players |

### Name Uniqueness

- No duplicate first + last name combinations on same roster
- No duplicate jersey numbers

---

## Depth Chart Organization

### Auto-Sort Rules

```
function organizeDepthChart(roster):
    for each position in positions:
        players = roster.getByPosition(position)
        
        // Primary sort: OVR (descending)
        // Secondary sort: Experience (descending)
        // Tertiary sort: Age (ascending for ties)
        players.sort(by: [OVR desc, Experience desc, Age asc])
        
        // Assign slot numbers
        for i, player in players:
            player.depthSlot = i + 1
```

### Manual Override Flag

Players can be flagged for depth chart override:
- `forceStarter`: Always slot 1 regardless of OVR
- `forceBackup`: Never slot 1

---

## Example: Austin Outlaws (Average Tier)

### Team Info

| Property | Value |
|----------|-------|
| Team | Austin Outlaws |
| Tier | Average |
| Tier Modifier | +0 |
| Target Team OVR | 78-82 |

### Sample Roster

#### Quarterbacks

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| QB1 | Marcus Webb | 27 | 83 | Pocket Passer |
| QB2 | Jaylen Ford | 24 | 72 | Dual-Threat |
| QB3 | Trey Morrison | 23 | 64 | Game Manager |

#### Running Backs

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| RB1 | Darius Coleman | 25 | 86 | Speed Back |
| RB2 | Andre Mitchell | 27 | 78 | Power Back |
| RB3 | Corey Simmons | 24 | 71 | Receiving Back |
| RB4 | DeShawn Price | 22 | 65 | All-Purpose |

#### Wide Receivers

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| WR1 | Stefon Hayes | 26 | 88 | Deep Threat |
| WR2 | Amari Johnson | 28 | 82 | Possession |
| WR3 | Tyreek Baldwin | 24 | 77 | Slot Specialist |
| WR4 | Malik Turner | 25 | 72 | Route Technician |
| WR5 | Cam Douglas | 23 | 66 | Playmaker |
| WR6 | Tee Williams | 22 | 61 | Deep Threat |

#### Tight Ends

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| TE1 | Kyle Patterson | 28 | 82 | Receiving TE |
| TE2 | Jordan Brooks | 26 | 74 | Blocking TE |
| TE3 | Nate Griffin | 24 | 67 | Hybrid TE |

#### Offensive Line

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| LT1 | Terrance Williams | 29 | 85 | Pass Protector |
| LT2 | Brandon Carter | 24 | 71 | Athletic |
| LG1 | Marcus Hall | 27 | 81 | Road Grader |
| LG2 | Derek Stone | 25 | 69 | Balanced |
| C1 | Anthony Davis | 30 | 83 | Technician |
| C2 | Jason Miller | 24 | 68 | Balanced |
| RG1 | Rodney Wallace | 28 | 80 | Mauler |
| RG2 | Travis King | 23 | 67 | Road Grader |
| RT1 | Kevin Robinson | 27 | 82 | Pass Protector |
| RT2 | Justin Taylor | 25 | 70 | Balanced |

#### Defensive Ends

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| DE1 | Khalil Murray | 26 | 89 | Speed Rusher |
| DE2 | Von Jackson | 28 | 83 | Power Rusher |
| DE3 | Jaylon Foster | 24 | 74 | Hybrid |
| DE4 | Rashad Cook | 23 | 68 | Raw Athlete |

#### Defensive Tackles

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| DT1 | Demarcus Thompson | 27 | 85 | Nose Tackle |
| DT2 | Calais Brown | 29 | 80 | Interior Rusher |
| DT3 | Fletcher Green | 25 | 73 | Run Plugger |
| DT4 | Shaq Adams | 23 | 67 | Athletic |

#### Linebackers

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| MLB1 | Lavonte Harris | 28 | 87 | Field General |
| MLB2 | Bobby Jenkins | 24 | 72 | Run Stopper |
| OLB1 | Deion Wright | 26 | 84 | Pass Rusher |
| OLB2 | Jaire Bell | 27 | 79 | Coverage LB |
| OLB3 | Xavien Howard | 24 | 71 | Hybrid |
| OLB4 | Marlon Perry | 22 | 65 | Athletic |

#### Cornerbacks

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| CB1 | Derwin Sanders | 25 | 88 | Man Cover |
| CB2 | Minkah Lewis | 27 | 81 | Zone Cover |
| CB3 | Jaylon Ward | 24 | 76 | Slot Corner |
| CB4 | Deion Cox | 23 | 70 | Physical |
| CB5 | Tre Richardson | 22 | 64 | Ball Hawk |

#### Safeties

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| FS1 | Dalvin Reed | 26 | 84 | Free Safety |
| FS2 | Derrick Bailey | 24 | 71 | Ball Hawk |
| SS1 | Saquon Moore | 27 | 81 | Strong Safety |
| SS2 | Cam Porter | 23 | 68 | Enforcer |

#### Special Teams

| Slot | Name | Age | OVR | Archetype |
|------|------|-----|-----|-----------|
| K1 | Jake Sullivan | 29 | 82 | Accurate |
| P1 | Ryan Walsh | 27 | 78 | Power |

### Roster Summary

| Metric | Value |
|--------|-------|
| Total Players | 53 |
| Average OVR | 76.2 |
| Star Players (90+) | 0 |
| Starters 85+ | 8 |
| Players 22-24 | 14 (26%) |
| Players 25-27 | 20 (38%) |
| Players 28-30 | 16 (30%) |
| Players 31+ | 3 (6%) |

---

## Validation Rules

Before finalizing a roster, validate:

| Rule | Check |
|------|-------|
| Count | Exactly 53 players |
| Positions | All positions filled per template |
| Jersey Numbers | No duplicates |
| Names | No duplicate full names |
| OVR Range | All players 55-99 OVR |
| Age Range | All players 21-40 |
| Tier Match | Team OVR within tier range |

---

## League Generation

### Full League Generation Process

```
function generateLeague():
    teams = loadTeams()  // 32 teams from football-teams.csv
    
    // Step 1: Assign tiers
    assignTiers(teams)
    
    // Step 2: Generate each roster
    for each team in teams:
        roster = generateRoster(team, team.tier)
        team.roster = roster
    
    // Step 3: Validate league
    validateLeague(teams)
    
    return teams
```

### League Validation

| Check | Requirement |
|-------|-------------|
| Total Players | 32 × 53 = 1,696 players |
| Unique Names | No duplicate full names across league |
| Tier Distribution | Matches target tier counts |
| Conference Balance | Similar strength per conference |

---

**Status:** Roster Generation System Complete
**Version:** 1.0
**Date:** December 2025

---

## Related Documents

This document focuses on **generating team rosters**. For other player generation contexts, see:

| Document | Purpose |
|----------|---------|
| `FINAL-player-generation-system.md` | Core individual player generation |
| `FINAL-draft-class-system.md` | Annual draft prospect generation |
| `FINAL-free-agent-pool-system.md` | Free agent market generation |

# TRAIT & BADGE BALANCE (TEAM-LEVEL)

## Overview

When generating full rosters, ensure trait and badge distribution creates realistic team dynamics. This section defines team-level balancing rules.

---

## Roster Trait Balance

### Leadership Trait Targets

| Trait Category | Target Count | Notes |
|----------------|--------------|-------|
| Vocal Leader | 2-4 | Team captains, veterans |
| Veteran Mentor | 1-3 | Players with 6+ years |
| Team First | 4-6 | Glue guys |

### Work Ethic Trait Targets

| Trait | Target Count | Notes |
|-------|--------------|-------|
| Gym Rat | 3-5 | Physical developers |
| Film Junkie | 3-5 | Mental developers |
| Focused | 4-6 | High performers |

### Negative Trait Limits

| Trait | Maximum Per Roster | Notes |
|-------|-------------------|-------|
| Locker Room Cancer | 0-1 | Very rare, destabilizing |
| Diva | 1-2 | Star players only |
| Lazy | 1-2 | Hidden roster landmines |
| Injury Prone | 2-4 | Realistic injury risk |
| Hot Head | 1-3 | Discipline issues |
| Money Motivated | 2-4 | Contract complications |

### Negative Trait Total

| Roster Type | Max Negative Traits |
|-------------|---------------------|
| Elite Team | 3-5 (well-managed) |
| Good Team | 4-7 |
| Average Team | 5-9 |
| Below Average | 6-10 |
| Rebuilding | 7-12 (more character risks) |

---

## Roster Badge Distribution

### Badges by Team Tier

| Team Tier | Total Badges | Avg per Badged Player |
|-----------|--------------|----------------------|
| Elite | 45-60 | 2.5 |
| Good | 35-50 | 2.0 |
| Average | 25-40 | 1.8 |
| Below Average | 15-30 | 1.5 |
| Rebuilding | 10-20 | 1.2 |

### Badge Tier Mix by Team Tier

| Team Tier | Bronze | Silver | Gold | HoF |
|-----------|--------|--------|------|-----|
| Elite | 30% | 40% | 25% | 5% |
| Good | 40% | 40% | 18% | 2% |
| Average | 50% | 38% | 11% | 1% |
| Below Average | 60% | 32% | 8% | 0% |
| Rebuilding | 70% | 25% | 5% | 0% |

### Players with Badges

| Team Tier | Players with Badges (of 53) |
|-----------|----------------------------|
| Elite | 20-25 |
| Good | 16-22 |
| Average | 12-18 |
| Below Average | 8-14 |
| Rebuilding | 5-10 |

---

## Draft Class Trait Balance

### Trait Distribution per Class (~275 prospects)

| Trait Category | Count | % of Class |
|----------------|-------|------------|
| Leadership Traits | 25-35 | 10-13% |
| Work Ethic Positive | 50-70 | 20-25% |
| On-Field Positive | 80-100 | 30-35% |
| Negative Traits | 40-55 | 15-20% |
| Neutral Traits | 60-80 | 22-28% |

### Negative Trait Distribution in Draft

| Trait | Count per Class |
|-------|-----------------|
| Lazy | 5-10 |
| Injury Prone | 15-20 |
| Diva | 3-6 |
| Hot Head | 8-12 |
| Slow Learner | 10-15 |
| Money Motivated | 8-12 |
| Locker Room Cancer | 0-2 |

### Prospect Trait Visibility

| Round | Traits Visible (of 1-3) |
|-------|------------------------|
| 1 | 2-3 (well-scouted) |
| 2-3 | 1-2 |
| 4-5 | 1 |
| 6-7 | 0-1 |
| UDFA | 0-1 |

Hidden traits are revealed after player joins team.

---

## Free Agent Pool Trait Balance

### Trait Mix for Free Agents (~150-200 players)

| Category | Percentage | Notes |
|----------|------------|-------|
| Positive Traits | 50% | Still good players |
| Neutral Traits | 30% | Average characters |
| Negative Traits | 20% | Why they were cut/unsigned |

### Common Free Agent Negative Traits

| Trait | Prevalence | Reason |
|-------|------------|--------|
| Injury Prone | High | Medical concerns |
| Aging/Declining | High | Past prime |
| Money Motivated | Medium | Priced out of market |
| Lazy | Medium | Effort concerns |
| Locker Room Issues | Low | Cut for cause |

### Free Agent Badge Distribution

Most free agents have fewer badges (declining veterans, depth players):

| OVR | Typical Badges |
|-----|----------------|
| 80+ | 2-3 (former starters) |
| 75-79 | 1-2 |
| 70-74 | 0-1 |
| <70 | 0 |

---

## Validation Rules

### Roster Trait Validation

```
function validateRosterTraits(roster):
    // Check leadership minimum
    leadershipCount = count(roster, hasLeadershipTrait)
    assert leadershipCount >= 2
    
    // Check negative trait maximum
    negativeTotalCount = count(roster, hasNegativeTrait)
    assert negativeTotalCount <= getMaxNegatives(team.tier)
    
    // Check no more than 1 Locker Room Cancer
    cancerCount = count(roster, hasTrait("Locker Room Cancer"))
    assert cancerCount <= 1
    
    // Check trait conflicts
    for player in roster:
        assert noTraitConflicts(player.traits)
```

### Draft Class Validation

```
function validateDraftClassTraits(prospects):
    negativeCount = count(prospects, hasNegativeTrait)
    
    // 15-20% should have negative traits
    assert negativeCount >= prospects.length * 0.15
    assert negativeCount <= prospects.length * 0.20
    
    // Very rare traits should be rare
    cancerCount = count(prospects, hasTrait("Locker Room Cancer"))
    assert cancerCount <= 2
```

---

## Example: Austin Outlaws Trait Summary

### Team Tier: Average

**Leadership Traits (Target: 6-10):**
| Player | Trait |
|--------|-------|
| C1 Anthony Davis | Vocal Leader |
| MLB1 Lavonte Harris | Vocal Leader, Veteran Mentor |
| QB1 Marcus Webb | Team First |
| TE1 Kyle Patterson | Team First |
| DE1 Khalil Murray | Team First |
| WR2 Amari Johnson | Veteran Mentor |

**Count: 8 ✓**

**Negative Traits (Max: 5-9):**
| Player | Trait |
|--------|-------|
| WR1 Stefon Hayes | Diva |
| RB2 Andre Mitchell | Money Motivated |
| CB4 Deion Cox | Hot Head |
| OLB4 Marlon Perry | Lazy |
| LG2 Derek Stone | Injury Prone |
| DE4 Rashad Cook | Slow Learner |

**Count: 6 ✓**

**Badge Distribution:**
| Tier | Count |
|------|-------|
| Gold | 3 |
| Silver | 12 |
| Bronze | 18 |
| **Total** | 33 |

**Players with Badges: 16 of 53 ✓**

---

**Status:** Roster Generation System Complete
**Scope:** Team roster generation only (draft and free agents are separate concerns)
**Version:** 2.0
**Date:** December 2025
