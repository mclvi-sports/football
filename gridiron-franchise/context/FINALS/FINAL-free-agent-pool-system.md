# Free Agent Pool Generation System

## Overview

The free agent pool contains players available for signing outside of the draft. This includes veterans released or not re-signed by teams, plus undrafted rookies who weren't signed during the UDFA period.

This document defines how to generate the initial free agent market and maintain it throughout the season.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-player-generation-system.md` | Core player generation (used by this system) |
| `FINAL-roster-generation-system.md` | Teams release players to this pool |
| `FINAL-draft-class-system.md` | Unsigned UDFAs flow here |

---

## Free Agent Pool Types

### Initial Pool (Game Start)

Generated when starting a new franchise. Represents players available at the start of the season.

| Pool Size | 150-200 players |
|-----------|-----------------|
| Quality | Mostly backups, few starters |
| Age | Skews older (why unsigned) |
| Positions | All positions represented |

### In-Season Pool (Dynamic)

Changes throughout the season as players are:
- Released by teams
- Signed from the pool
- Added after injuries (emergency call-ups)

---

## Initial Pool Quality Distribution

### OVR Distribution

| OVR Range | Percentage | Count (of 175) | Description |
|-----------|------------|----------------|-------------|
| 80+ | 3% | 5-6 | Former starters, aging stars |
| 75-79 | 10% | 17-18 | Fringe starters |
| 70-74 | 25% | 43-44 | Quality backups |
| 65-69 | 35% | 61-62 | Depth players |
| 60-64 | 20% | 35-36 | Fringe roster |
| <60 | 7% | 12-13 | Practice squad level |

### Why Are They Available?

Each free agent has a reason for being unsigned:

| Reason | Percentage | Typical Profile |
|--------|------------|-----------------|
| Age/Decline | 30% | 30+ years old, past prime |
| Injury History | 20% | Injury Prone trait, medical concerns |
| Cap Casualty | 15% | Good player, team needed cap space |
| Character Concerns | 10% | Negative traits (Diva, Hot Head) |
| Young & Unproven | 15% | Low OVR, undrafted or cut rookie |
| Market Timing | 10% | Seeking better contract, holdout |

---

## Age Distribution

Free agents skew older than active rosters:

| Age Range | Percentage | Notes |
|-----------|------------|-------|
| 22-24 | 15% | Young cuts, UDFAs |
| 25-27 | 20% | Prime but flawed |
| 28-30 | 30% | Aging veterans |
| 31-33 | 25% | Past prime |
| 34+ | 10% | Career twilight |

### Average Age by OVR

| OVR Range | Average Age |
|-----------|-------------|
| 80+ | 31 |
| 75-79 | 30 |
| 70-74 | 29 |
| 65-69 | 27 |
| <65 | 25 |

Higher OVR free agents tend to be older (why else would they be available?).

---

## Position Distribution

All positions should be represented in the pool:

| Position | Count | % of Pool | Notes |
|----------|-------|-----------|-------|
| QB | 8-12 | 5-7% | Always backups available |
| RB | 15-20 | 9-11% | Shorter careers, more turnover |
| WR | 20-26 | 12-15% | High roster churn |
| TE | 10-14 | 6-8% | Moderate availability |
| OT | 12-16 | 7-9% | Premium, harder to find |
| IOL | 14-18 | 8-10% | More available |
| DE | 14-18 | 8-10% | Pass rusher market |
| DT | 10-14 | 6-8% | Space eaters available |
| LB | 16-22 | 10-12% | High turnover |
| CB | 14-18 | 8-10% | Speed-dependent, injuries |
| S | 12-16 | 7-9% | Moderate availability |
| K | 3-5 | 2-3% | Specialists |
| P | 3-5 | 2-3% | Specialists |

---

## Trait Distribution

Free agents have higher rates of negative traits (explaining availability):

### Positive vs Negative Balance

| Category | Percentage | Notes |
|----------|------------|-------|
| Positive Traits Only | 40% | Still good players |
| Mixed (Positive + Negative) | 35% | Trade-offs |
| Negative Traits Only | 15% | Character risks |
| No Notable Traits | 10% | Neutral |

### Common Free Agent Traits

#### Positive (Why They're Worth Signing)

| Trait | Prevalence | Notes |
|-------|------------|-------|
| Veteran Mentor | 15% | Older players, locker room value |
| Team First | 12% | Will take less money |
| Consistent | 10% | Reliable performer |
| Clutch | 8% | Performs in big moments |

#### Negative (Why They're Available)

| Trait | Prevalence | Notes |
|-------|------------|-------|
| Injury Prone | 20% | Medical red flags |
| Money Motivated | 15% | Priced themselves out |
| Declining | 12% | Age-related drop |
| Diva | 8% | Locker room concerns |
| Lazy | 6% | Effort questions |
| Hot Head | 5% | Discipline issues |

---

## Badge Distribution

Free agents typically have fewer badges than equivalent OVR roster players:

| OVR | Typical Badges | Notes |
|-----|----------------|-------|
| 80+ | 2-3 | Former starters retain some |
| 75-79 | 1-2 | Declining veterans |
| 70-74 | 0-1 | Backup level |
| <70 | 0 | No badges |

### Badge Tier for Free Agents

| Tier | Percentage |
|------|------------|
| Bronze | 60% |
| Silver | 35% |
| Gold | 5% |
| HoF | 0% |

---

## Contract Expectations

Free agents have salary expectations based on OVR:

### Base Salary Demands

| OVR | Annual Salary | Contract Length |
|-----|---------------|-----------------|
| 85+ | $12-18M | 2-4 years |
| 80-84 | $8-12M | 2-3 years |
| 75-79 | $4-8M | 1-3 years |
| 70-74 | $2-4M | 1-2 years |
| 65-69 | $1-2M | 1 year |
| <65 | $750K-1M | 1 year (minimum) |

### Modifiers

| Factor | Salary Modifier |
|--------|-----------------|
| Age 30+ | -10% to -20% |
| Injury Prone | -15% to -25% |
| Money Motivated | +15% to +25% |
| Team First | -10% to -15% |
| Multiple Negative Traits | -20% to -30% |
| High Demand Position (QB, OT, DE) | +10% to +20% |

### Time on Market

Players lower expectations the longer they're unsigned:

| Weeks Unsigned | Demand Reduction |
|----------------|------------------|
| 1-2 | 0% |
| 3-4 | -5% |
| 5-8 | -10% |
| 9-12 | -20% |
| 13+ | -30% (will sign minimum) |

---

## Free Agent Generation Algorithm

### Initial Pool Generation

```
function generateInitialFreeAgentPool():
    pool = []
    targetSize = random(150, 200)
    
    // Step 1: Determine position distribution
    positionCounts = calculatePositionDistribution(targetSize)
    
    // Step 2: Generate each free agent
    for i in 1 to targetSize:
        // Select position
        position = selectPosition(positionCounts)
        positionCounts[position]--
        
        // Determine OVR (skewed toward backups)
        ovr = generateFreeAgentOVR()
        
        // Determine age (skewed older)
        age = generateFreeAgentAge(ovr)
        
        // Determine reason for availability
        reason = selectAvailabilityReason(ovr, age)
        
        // Generate player using core system
        player = generatePlayer(
            position: position,
            targetOVR: ovr,
            age: age,
            context: "free_agent"
        )
        
        // Assign traits (higher negative rate)
        player.traits = assignFreeAgentTraits(reason, ovr)
        
        // Calculate experience from age
        player.experience = age - random(21, 23)
        
        // Assign badges (fewer than roster players)
        player.badges = assignFreeAgentBadges(ovr, player.experience)
        
        // Set contract demands
        player.contractDemand = calculateContractDemand(player)
        
        // Set availability reason
        player.availabilityReason = reason
        
        pool.add(player)
    
    // Step 3: Validate pool
    validateFreeAgentPool(pool)
    
    return pool
```

### OVR Generation (Weighted Toward Backups)

```
function generateFreeAgentOVR():
    roll = random()
    
    if roll < 0.03:       // 3%
        return random(80, 86)
    else if roll < 0.13:  // 10%
        return random(75, 79)
    else if roll < 0.38:  // 25%
        return random(70, 74)
    else if roll < 0.73:  // 35%
        return random(65, 69)
    else if roll < 0.93:  // 20%
        return random(60, 64)
    else:                 // 7%
        return random(55, 59)
```

### Age Generation

```
function generateFreeAgentAge(ovr):
    // Higher OVR = older (why else unsigned?)
    if ovr >= 80:
        baseAge = 30
    else if ovr >= 75:
        baseAge = 29
    else if ovr >= 70:
        baseAge = 28
    else if ovr >= 65:
        baseAge = 26
    else:
        baseAge = 24
    
    // Add variance
    age = baseAge + random(-2, +4)
    
    // Clamp to valid range
    return clamp(age, 22, 38)
```

### Trait Assignment for Free Agents

```
function assignFreeAgentTraits(reason, ovr):
    traits = []
    
    // Base trait assignment from archetype
    traits.addAll(selectArchetypeTraits(1, 2))
    
    // Add reason-based traits
    switch reason:
        case "Age/Decline":
            // 50% chance of explicit decline-related trait
            if random() < 0.5:
                traits.add("Declining")
        
        case "Injury History":
            traits.add("Injury Prone")
        
        case "Character Concerns":
            negatives = ["Diva", "Hot Head", "Lazy", "Locker Room Cancer"]
            traits.add(selectRandom(negatives))
        
        case "Cap Casualty":
            // Often good character, just expensive
            if random() < 0.4:
                traits.add("Team First")
        
        case "Young & Unproven":
            // No special traits
            pass
        
        case "Market Timing":
            traits.add("Money Motivated")
    
    // 20% chance of additional positive trait
    if random() < 0.20:
        positives = ["Veteran Mentor", "Consistent", "Clutch"]
        traits.add(selectRandom(positives))
    
    return traits
```

---

## Example Free Agent Pool (Sample)

### Top Available (80+ OVR)

| Name | Pos | Age | OVR | Reason | Traits | Demand |
|------|-----|-----|-----|--------|--------|--------|
| Terrance Brooks | DE | 32 | 84 | Age/Decline | Veteran Mentor, Declining | $10M/2yr |
| Marcus Washington | CB | 30 | 82 | Cap Casualty | Team First | $9M/2yr |
| Darius Coleman | WR | 31 | 81 | Injury History | Injury Prone | $7M/1yr |
| Andre Mitchell | OT | 33 | 80 | Age/Decline | Veteran Mentor | $8M/2yr |
| Jamal Foster | QB | 34 | 80 | Age/Decline | Film Junkie, Declining | $6M/1yr |

### Mid-Tier (70-79 OVR)

| Name | Pos | Age | OVR | Reason | Traits | Demand |
|------|-----|-----|-----|--------|--------|--------|
| Corey Simmons | RB | 28 | 76 | Injury History | Injury Prone | $3M/1yr |
| Derek Stone | LB | 29 | 74 | Character | Hot Head | $3M/1yr |
| Malik Turner | WR | 27 | 73 | Cap Casualty | Consistent | $4M/2yr |
| Travis King | IOL | 30 | 72 | Market Timing | Money Motivated | $5M/2yr |
| Kyle Patterson | TE | 31 | 71 | Age/Decline | Team First | $2.5M/1yr |

### Depth (60-69 OVR)

| Name | Pos | Age | OVR | Reason | Traits | Demand |
|------|-----|-----|-----|--------|--------|--------|
| Jaylen Ford | QB | 25 | 68 | Young/Unproven | — | $1.5M/1yr |
| Trey Morrison | RB | 24 | 66 | Young/Unproven | — | $1M/1yr |
| Cam Douglas | WR | 26 | 65 | Cap Casualty | — | $1.2M/1yr |
| Rashad Perry | CB | 28 | 64 | Character | Lazy | $1M/1yr |
| Nate Griffin | DT | 27 | 63 | Injury History | Injury Prone | $900K/1yr |

---

## In-Season Pool Changes

### Players Added to Pool

| Event | When |
|-------|------|
| Team releases player | Immediately available |
| Contract expires | Offseason |
| Unsigned UDFAs | After UDFA signing period |
| Failed physicals | After trade falls through |

### Players Removed from Pool

| Event | When |
|-------|------|
| Signed by team | Immediately |
| Retires | After 2+ weeks unsigned (age 34+) |
| Out of league | After full season unsigned |

### Weekly Pool Refresh

```
function weeklyPoolUpdate(pool, week):
    // Age out players
    for player in pool:
        player.weeksUnsigned++
        
        // Reduce contract demands
        if player.weeksUnsigned >= 3:
            player.contractDemand *= 0.95
        
        // Retirement check for old players
        if player.age >= 34 and player.weeksUnsigned >= 2:
            if random() < 0.20:  // 20% chance per week
                player.retired = true
                pool.remove(player)
    
    // Add any newly released players
    for player in newlyReleasedPlayers:
        pool.add(player)
```

---

## Signing Process

### Team Interest Factors

| Factor | Weight | Notes |
|--------|--------|-------|
| Position Need | 40% | Filling roster holes |
| OVR vs Depth Chart | 25% | Upgrade potential |
| Age vs Team Window | 15% | Win-now vs rebuild |
| Contract Fit | 15% | Cap space available |
| Character Fit | 5% | Trait compatibility |

### Signing Algorithm

```
function evaluateFreeAgent(team, player):
    score = 0
    
    // Position need
    need = team.getPositionNeed(player.position)
    score += need * 40
    
    // Upgrade potential
    currentBest = team.getBestAtPosition(player.position)
    if player.ovr > currentBest.ovr:
        score += (player.ovr - currentBest.ovr) * 2.5
    
    // Age fit
    if team.isWinNow() and player.age <= 30:
        score += 15
    else if team.isRebuilding() and player.age <= 26:
        score += 15
    
    // Contract fit
    if team.canAfford(player.contractDemand):
        score += 15
    else:
        score -= 20
    
    // Character fit
    if player.hasNegativeTrait():
        score -= 10
    
    return score
```

---

## Validation Rules

```
function validateFreeAgentPool(pool):
    // Check size
    assert pool.length >= 150
    assert pool.length <= 200
    
    // Check position coverage
    for position in allPositions:
        count = countByPosition(pool, position)
        assert count >= 3  // At least 3 per position
    
    // Check OVR distribution
    highOVR = count(pool, p => p.ovr >= 80)
    assert highOVR <= pool.length * 0.05  // Max 5% elite
    
    // Check age distribution
    youngCount = count(pool, p => p.age <= 25)
    assert youngCount >= pool.length * 0.10  // At least 10% young
    
    // Check negative trait distribution
    negativeCount = count(pool, p => p.hasNegativeTrait())
    assert negativeCount >= pool.length * 0.25  // At least 25% have issues
    
    // Check name uniqueness
    names = pool.map(p => p.firstName + p.lastName)
    assert names.length == unique(names).length
```

---

## Free Agent Pool Summary Stats

Target metrics for initial pool:

| Metric | Target |
|--------|--------|
| Total Size | 150-200 |
| Average OVR | 67-70 |
| Average Age | 28-29 |
| Players 80+ OVR | 5-10 (3-5%) |
| Players with Negative Traits | 40-60 (25-35%) |
| Players with Injury Prone | 30-40 (18-22%) |
| Position Coverage | All positions with 3+ |

---

**Status:** Free Agent Pool Generation System Complete
**Scope:** Free agent market generation (separate from roster and draft systems)
**Version:** 1.0
**Date:** December 2025
