# Draft Class Generation System

## Overview

Each year, a new draft class of ~275 prospects is generated. These are incoming rookies eligible to be selected by teams over 7 rounds, plus undrafted free agents.

This document defines how to generate draft prospects with appropriate OVR distribution, potential, scouting uncertainty, and bust/steal mechanics.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-player-generation-system.md` | Core player generation (used by this system) |
| `FINAL-roster-generation-system.md` | Team rosters (receives drafted players) |
| `FINAL-free-agent-pool-system.md` | UDFA flow after draft |

---

## Draft Class Size

| Category | Count | Notes |
|----------|-------|-------|
| Draft Picks | 224 | 7 rounds × 32 teams |
| Undrafted FA | 40-60 | Signed after draft |
| **Total Class** | ~275 | All incoming rookies |

### Picks by Round

| Round | Picks | Notes |
|-------|-------|-------|
| 1 | 32 | First round |
| 2 | 32 | Second round |
| 3 | 32 | Third round |
| 4 | 32 | Fourth round |
| 5 | 32 | Fifth round |
| 6 | 32 | Sixth round |
| 7 | 32 | Seventh round |
| UDFA | 40-60 | Undrafted free agents |

---

## Prospect OVR by Round

### True OVR Ranges (What They Actually Are)

| Round | OVR Range | Average | Description |
|-------|-----------|---------|-------------|
| 1 | 72-86 | 78 | Day 1 starters, future stars |
| 2 | 68-80 | 74 | Quality starters |
| 3 | 65-76 | 70 | Starter potential |
| 4 | 62-73 | 67 | Rotational players |
| 5 | 58-70 | 64 | Depth with upside |
| 6 | 55-67 | 61 | Developmental |
| 7 | 52-64 | 58 | Long shots |
| UDFA | 50-62 | 55 | Camp bodies, rare gems |

### OVR Distribution Within Round

Not all picks in a round are equal. Distribution within each round:

| Pick Position | OVR Modifier | Example (Round 1) |
|---------------|--------------|-------------------|
| Top 5 | +3 to +5 | 78-86 |
| 6-15 | +1 to +3 | 75-83 |
| 16-25 | +0 | 72-80 |
| 26-32 | -1 to -2 | 70-78 |

---

## Prospect Potential by Round

Earlier picks have higher ceilings on average.

| Round | Potential Gap | Potential Label Distribution |
|-------|---------------|------------------------------|
| 1 | +8 to +18 | 40% Star, 40% Starter, 20% Limited |
| 2 | +6 to +15 | 25% Star, 50% Starter, 25% Limited |
| 3 | +5 to +12 | 15% Star, 50% Starter, 35% Limited |
| 4 | +4 to +10 | 10% Star, 45% Starter, 45% Limited |
| 5 | +3 to +8 | 5% Star, 40% Starter, 55% Limited |
| 6 | +2 to +7 | 5% Star, 30% Starter, 65% Limited |
| 7 | +1 to +6 | 2% Star, 25% Starter, 73% Limited |
| UDFA | +0 to +5 | 1% Star, 20% Starter, 79% Limited |

---

## Position Distribution

Each draft class has a target position mix reflecting real-world trends.

### Prospects by Position

| Position | Count | % of Class | Notes |
|----------|-------|------------|-------|
| QB | 8-12 | 3-4% | Premium position |
| RB | 15-20 | 6-7% | Devalued in draft |
| WR | 30-38 | 12-14% | High demand |
| TE | 10-14 | 4-5% | Moderate demand |
| OT | 18-24 | 7-9% | Premium OL |
| IOL | 20-26 | 8-10% | Guards and Centers |
| DE | 20-26 | 8-10% | Edge rushers valued |
| DT | 14-18 | 5-7% | Interior DL |
| LB | 22-28 | 9-11% | All linebacker types |
| CB | 24-30 | 10-12% | High demand |
| S | 16-22 | 6-8% | Both safety types |
| K | 2-4 | 1% | Rarely drafted high |
| P | 2-4 | 1% | Rarely drafted high |

### Position Distribution by Round

| Round | Premium Positions | Common Positions |
|-------|-------------------|------------------|
| 1 | QB, OT, DE, CB, WR | Rare: RB, IOL, S, LB |
| 2-3 | All positions | Balanced |
| 4-5 | IOL, LB, S, DT, TE | Less: QB, OT |
| 6-7 | All positions | More: K, P, depth |
| UDFA | All positions | Specialists common |

### Round 1 Position Probability

| Position | Round 1 Picks | Probability |
|----------|---------------|-------------|
| QB | 3-5 | 12-15% |
| OT | 4-6 | 14-18% |
| DE | 4-6 | 14-18% |
| CB | 4-5 | 12-15% |
| WR | 4-6 | 14-18% |
| LB | 2-3 | 6-9% |
| DT | 2-3 | 6-9% |
| S | 1-2 | 3-6% |
| TE | 1-2 | 3-6% |
| IOL | 1-2 | 3-6% |
| RB | 0-2 | 0-6% |
| K/P | 0 | 0% |

---

## Bust and Steal System

Not every prospect pans out as expected. Some exceed expectations (steals), others disappoint (busts).

### Bust/Steal Probability by Round

| Round | Bust % | As Expected % | Steal % |
|-------|--------|---------------|---------|
| 1 | 15% | 70% | 15% |
| 2 | 18% | 67% | 15% |
| 3 | 20% | 62% | 18% |
| 4 | 20% | 58% | 22% |
| 5 | 18% | 55% | 27% |
| 6 | 15% | 52% | 33% |
| 7 | 12% | 48% | 40% |
| UDFA | 10% | 45% | 45% |

### Bust/Steal OVR Modifiers

| Outcome | OVR Change | Potential Change | Notes |
|---------|------------|------------------|-------|
| Major Bust | -8 to -12 | -10 to -15 | Severe disappointment |
| Minor Bust | -4 to -7 | -5 to -8 | Underperforms |
| As Expected | -1 to +2 | +0 | Meets projection |
| Minor Steal | +4 to +7 | +5 to +8 | Outperforms |
| Major Steal | +8 to +12 | +10 to +15 | Hidden gem |

### When Bust/Steal is Revealed

| Timing | Revelation |
|--------|------------|
| Immediately | Hidden (scouted OVR shown) |
| After Year 1 | Partial reveal (+/- 3 OVR accuracy) |
| After Year 2 | Full reveal (true OVR known) |

---

## Scouting Uncertainty

Prospects have hidden information that only becomes clear through scouting or after being drafted.

### What's Visible vs Hidden

| Attribute | Visibility | Notes |
|-----------|------------|-------|
| Position | Visible | Always known |
| Archetype | Visible | Always known |
| Height/Weight | Visible | Always known |
| 40-Yard Dash | Visible | Combine measurable |
| Scouted OVR | Visible | Estimate (may be wrong) |
| True OVR | Hidden | Revealed after drafting |
| Potential | Partially Hidden | Label visible, exact number hidden |
| Primary Attributes | Visible | Core skills shown |
| Secondary Attributes | Partially Hidden | Some uncertainty |
| Tertiary Attributes | Hidden | Unknown until drafted |
| Traits | Mostly Hidden | 1-2 visible, rest hidden |

### Scouting Accuracy

Based on scout skill (from scout-system.md):

| Scout Rating | OVR Accuracy | Hidden Traits Revealed |
|--------------|--------------|------------------------|
| 90-99 Elite | ±1-2 OVR | 80% of traits |
| 80-89 Good | ±2-4 OVR | 60% of traits |
| 70-79 Average | ±4-6 OVR | 40% of traits |
| 60-69 Poor | ±6-10 OVR | 20% of traits |

### Scouted OVR Calculation

```
function getScoutedOVR(prospect, scoutRating):
    accuracy = getAccuracyRange(scoutRating)
    variance = random(-accuracy, +accuracy)
    scoutedOVR = prospect.trueOVR + variance
    
    // Clamp to reasonable range
    scoutedOVR = clamp(scoutedOVR, 45, 95)
    
    return scoutedOVR
```

---

## Prospect Trait Assignment

### Trait Count for Prospects

| Trait Count | Probability |
|-------------|-------------|
| 1 trait | 25% |
| 2 traits | 50% |
| 3 traits | 25% |

### Trait Visibility by Round

| Round | Traits Visible (of 1-3) |
|-------|------------------------|
| 1 | 2-3 (well-scouted) |
| 2-3 | 1-2 |
| 4-5 | 1 |
| 6-7 | 0-1 |
| UDFA | 0-1 |

Hidden traits are revealed after player joins team.

### Negative Trait Probability for Prospects

Lower-round picks more likely to have character concerns:

| Round | Negative Trait Chance |
|-------|----------------------|
| 1 | 10% |
| 2-3 | 15% |
| 4-5 | 20% |
| 6-7 | 25% |
| UDFA | 30% |

---

## Prospect Age Distribution

All prospects are incoming rookies:

| Age | Probability | Description |
|-----|-------------|-------------|
| 21 | 30% | Underclassman |
| 22 | 45% | Senior |
| 23 | 20% | Redshirt Senior |
| 24 | 5% | Graduate/Late Bloomer |

---

## Badge Assignment for Prospects

**Prospects start with 0 badges.** Badges are earned through NFL play, not college performance.

---

## Draft Class Generation Algorithm

### Step-by-Step Process

```
function generateDraftClass(year):
    prospects = []
    
    // Step 1: Determine class size
    draftedCount = 224
    udfaCount = random(40, 60)
    totalCount = draftedCount + udfaCount
    
    // Step 2: Assign positions based on distribution
    positionCounts = calculatePositionDistribution(totalCount)
    
    // Step 3: Generate prospects for each round
    pickNumber = 1
    
    for round in 1 to 7:
        for pick in 1 to 32:
            // Determine position for this pick
            position = selectPosition(round, positionCounts)
            
            // Calculate target OVR based on round and pick
            targetOVR = calculateDraftOVR(round, pick)
            
            // Calculate potential based on round
            potential = calculateDraftPotential(round)
            
            // Determine bust/steal outcome (hidden)
            outcome = rollBustSteal(round)
            trueOVR = applyBustSteal(targetOVR, outcome)
            
            // Generate the prospect using player-generation-system
            prospect = generateProspect(
                position: position,
                targetOVR: trueOVR,
                potential: potential,
                round: round,
                pick: pickNumber
            )
            
            // Assign traits (mostly hidden)
            prospect.traits = assignProspectTraits(round)
            
            // Hide true values, show scouted estimates
            prospect.scoutedOVR = addScoutingNoise(prospect.trueOVR)
            prospect.bustStealOutcome = outcome  // Hidden
            
            prospects.add(prospect)
            pickNumber++
            positionCounts[position]--
    
    // Step 4: Generate UDFAs
    for i in 1 to udfaCount:
        position = selectPosition("UDFA", positionCounts)
        targetOVR = random(50, 62)
        potential = calculateDraftPotential("UDFA")
        
        prospect = generateProspect(
            position: position,
            targetOVR: targetOVR,
            potential: potential,
            round: "UDFA",
            pick: null
        )
        
        prospects.add(prospect)
    
    // Step 5: Validate class
    validateDraftClass(prospects)
    
    return prospects
```

### Helper Functions

```
function calculateDraftOVR(round, pickInRound):
    baseRange = ROUND_OVR_RANGES[round]
    
    // Adjust for pick position within round
    if pickInRound <= 5:
        modifier = random(3, 5)
    else if pickInRound <= 15:
        modifier = random(1, 3)
    else if pickInRound <= 25:
        modifier = 0
    else:
        modifier = random(-2, -1)
    
    return random(baseRange.min, baseRange.max) + modifier

function calculateDraftPotential(round):
    gapRange = ROUND_POTENTIAL_GAPS[round]
    gap = random(gapRange.min, gapRange.max)
    
    // Determine label
    labelRoll = random()
    distribution = ROUND_POTENTIAL_DISTRIBUTION[round]
    
    if labelRoll < distribution.star:
        label = "Star"
    else if labelRoll < distribution.star + distribution.starter:
        label = "Starter"
    else:
        label = "Limited"
    
    return { gap: gap, label: label }

function rollBustSteal(round):
    roll = random()
    probs = ROUND_BUST_STEAL_PROBABILITY[round]
    
    if roll < probs.majorBust:
        return "MajorBust"
    else if roll < probs.majorBust + probs.minorBust:
        return "MinorBust"
    else if roll < probs.majorBust + probs.minorBust + probs.expected:
        return "Expected"
    else if roll < probs.majorBust + probs.minorBust + probs.expected + probs.minorSteal:
        return "MinorSteal"
    else:
        return "MajorSteal"
```

---

## Example Draft Class (Partial)

### Round 1 Sample (First 10 Picks)

| Pick | Name | Position | Scouted OVR | True OVR | Potential | Outcome |
|------|------|----------|-------------|----------|-----------|---------|
| 1 | Marcus Williams | QB | 84 | 82 | 94 (Star) | Expected |
| 2 | Jaylen Thompson | DE | 82 | 85 | 96 (Star) | Minor Steal |
| 3 | DeShawn Carter | OT | 81 | 80 | 91 (Starter) | Expected |
| 4 | Khalil Robinson | CB | 80 | 74 | 82 (Limited) | Minor Bust |
| 5 | Terrell Mitchell | WR | 80 | 81 | 93 (Star) | Expected |
| 6 | Andre Foster | DE | 79 | 79 | 90 (Starter) | Expected |
| 7 | Darius Jackson | OT | 78 | 84 | 95 (Star) | Major Steal |
| 8 | Jamal Brooks | QB | 78 | 76 | 88 (Starter) | Expected |
| 9 | Malik Harris | CB | 77 | 78 | 89 (Starter) | Expected |
| 10 | Tyreek Coleman | WR | 77 | 69 | 75 (Limited) | Major Bust |

### Round 7 Sample (Last 5 Picks)

| Pick | Name | Position | Scouted OVR | True OVR | Potential | Outcome |
|------|------|----------|-------------|----------|-----------|---------|
| 220 | Cody Walsh | P | 58 | 57 | 65 (Limited) | Expected |
| 221 | Trey Adams | RB | 56 | 62 | 74 (Starter) | Minor Steal |
| 222 | Jake Morrison | IOL | 55 | 54 | 60 (Limited) | Expected |
| 223 | Derek Stone | LB | 54 | 60 | 72 (Starter) | Major Steal |
| 224 | Marcus Bell | CB | 53 | 52 | 58 (Limited) | Expected |

### UDFA Sample

| Name | Position | Scouted OVR | True OVR | Potential | Notes |
|------|----------|-------------|----------|-----------|-------|
| Tyrod Sullivan | QB | 52 | 58 | 70 (Starter) | Hidden gem |
| Cam Douglas | WR | 55 | 54 | 62 (Limited) | Expected |
| Rashad Perry | RB | 51 | 50 | 56 (Limited) | Camp body |
| Donte Williams | CB | 53 | 61 | 76 (Starter) | Late bloomer |
| Travis Reid | K | 54 | 55 | 68 (Starter) | Specialist |

---

## Draft Class Validation

### Required Checks

```
function validateDraftClass(prospects):
    // Check total count
    assert prospects.length >= 264
    assert prospects.length <= 284
    
    // Check position distribution
    for position in allPositions:
        count = countByPosition(prospects, position)
        assert count >= POSITION_MIN[position]
        assert count <= POSITION_MAX[position]
    
    // Check OVR distribution
    round1Avg = averageOVR(prospects.filter(p => p.round == 1))
    assert round1Avg >= 75
    assert round1Avg <= 82
    
    // Check negative traits (15-20%)
    negativeCount = count(prospects, hasNegativeTrait)
    assert negativeCount >= prospects.length * 0.15
    assert negativeCount <= prospects.length * 0.25
    
    // Check name uniqueness
    names = prospects.map(p => p.firstName + p.lastName)
    assert names.length == unique(names).length
```

---

## Draft Class Summary Stats

Target metrics for a complete draft class:

| Metric | Target |
|--------|--------|
| Total Prospects | 265-285 |
| Average True OVR | 62-65 |
| Star Potential | 15-25 (6-9%) |
| Starter Potential | 100-120 (38-44%) |
| Limited Potential | 130-150 (48-55%) |
| Major Busts | 8-15 (3-5%) |
| Major Steals | 20-35 (8-13%) |
| Round 1 Avg OVR | 76-80 |
| UDFA Avg OVR | 53-57 |

---

## Integration with Other Systems

### Post-Draft Flow

```
function processDraftPick(team, prospect):
    // Reveal true OVR (partially)
    prospect.revealedOVR = prospect.trueOVR + random(-3, +3)
    
    // Set experience to rookie
    prospect.experience = 0
    
    // Assign jersey number
    prospect.jerseyNumber = assignJerseyNumber(prospect, team.roster)
    
    // Reveal hidden traits
    prospect.traits = revealTraits(prospect.traits)
    
    // Add to roster
    team.roster.add(prospect)
    
    // Update depth chart
    team.updateDepthChart()
```

### UDFA Flow

After the draft, undrafted free agents are available for signing:

```
function processUDFASigningPeriod(teams, udfaPool):
    // Teams can sign UDFAs to fill roster spots
    // Priority based on draft order (worst team picks first)
    // UDFAs not signed go to FINAL-free-agent-pool-system
    
    for team in reverseStandingsOrder(teams):
        availableUDFAs = udfaPool.filter(p => !p.signed)
        if team.rosterSpots > 0 and availableUDFAs.length > 0:
            // Team evaluates and signs UDFAs
            signedUDFA = team.selectUDFA(availableUDFAs)
            if signedUDFA:
                processDraftPick(team, signedUDFA)
                udfaPool.remove(signedUDFA)
    
    // Remaining UDFAs go to free agent pool
    freeAgentPool.addAll(udfaPool.filter(p => !p.signed))
```

### Roster Spot Requirement

Teams must clear roster spots before draft:
- 53-man roster limit
- Each pick requires 1 open spot
- Teams cut players or make trades to create space

---

**Status:** Draft Class Generation System Complete
**Scope:** Annual draft prospect generation (separate from roster and free agent systems)
**Version:** 2.0
**Date:** December 2025
