# Salary Cap System

## Overview

The salary cap is a hard limit on total player salary spending per season. Managing the cap is a core GM skill — balancing talent acquisition with long-term flexibility. This document covers cap structure, rookie wages, contract mechanics, and contract actions.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-free-agent-pool-system.md` | Free agent salary expectations |
| `gm-skills-perks-system.md` | Skills that modify cap (+$3-8M, salary discounts) |
| `traits-system.md` | Traits affecting contract demands (±20-30%) |

---

# PART 1: SALARY CAP STRUCTURE

## Base Cap Amount

| Year | Salary Cap | Cap Floor (90%) | Cap Growth |
|------|------------|-----------------|------------|
| Year 1 | $225.0M | $202.5M | — |
| Year 2 | $231.8M | $208.6M | +3.0% |
| Year 3 | $238.7M | $214.8M | +3.0% |
| Year 4 | $245.9M | $221.3M | +3.0% |
| Year 5 | $253.3M | $228.0M | +3.0% |
| Year 10 | $293.6M | $264.2M | +3.0% |

### Cap Growth

- **Base Growth Rate:** 3% per year
- **Variance:** ±1% based on league revenue events
- **Announced:** During offseason, before free agency opens

### Cap Floor

- Teams must spend at least **90% of the cap** on player salaries
- Calculated as rolling average over 4-year periods
- **Penalty:** Difference paid directly to players as bonus pool

---

## Cap Space Calculation

```
Cap Space = Salary Cap - Total Cap Commitments

Total Cap Commitments = 
    Active Roster Cap Hits +
    Dead Money +
    Practice Squad Salaries
```

### Cap Space Status

| Cap Space | Status | Flexibility |
|-----------|--------|-------------|
| $50M+ | Excellent | Can sign any free agent |
| $30-50M | Good | Room for major additions |
| $15-30M | Moderate | Selective signings only |
| $5-15M | Tight | Depth moves only |
| $0-5M | Minimal | Must cut/restructure to sign |
| Negative | Over Cap | Must get compliant before season |

### Rollover Cap Space

- Unused cap space rolls over to next season
- **Maximum Rollover:** No limit
- **Example:** $10M unused in Year 1 → Year 2 cap becomes $241.8M

---

## What Counts Against the Cap

| Item | Counts | Notes |
|------|--------|-------|
| Base Salary | ✅ Yes | Full amount in current year |
| Signing Bonus | ✅ Yes | Prorated over contract length (max 5 years) |
| Roster Bonus | ✅ Yes | Full amount when earned |
| Option Bonus | ✅ Yes | Prorated like signing bonus |
| Workout Bonus | ✅ Yes | When earned |
| Incentives (Likely) | ✅ Yes | Based on prior year performance |
| Incentives (Unlikely) | ❌ No* | Counts next year if earned |
| Dead Money | ✅ Yes | Accelerated bonus from cut/trade |
| Practice Squad | ✅ Yes | At reduced rate (~$15K/week) |
| IR Players | ✅ Yes | Full cap hit remains |

---

# PART 2: ROOKIE WAGE SCALE

All draft picks have slotted salaries based on pick position. Contracts are fully guaranteed.

## Rookie Contract Structure

| Round | Contract Length | 5th Year Option | Guaranteed |
|-------|-----------------|-----------------|------------|
| 1 | 4 years | Yes (team option) | 100% |
| 2-7 | 4 years | No | 100% |
| UDFA | 3 years | No | Year 1 only |

---

## Round 1 Rookie Salaries

| Pick | Year 1 | Year 2 | Year 3 | Year 4 | Total Value | 5th Year Option |
|------|--------|--------|--------|--------|-------------|-----------------|
| 1 | $12.5M | $13.2M | $14.0M | $14.8M | $54.5M | $35.0M |
| 2 | $11.8M | $12.5M | $13.2M | $14.0M | $51.5M | $32.0M |
| 3 | $11.2M | $11.8M | $12.5M | $13.2M | $48.7M | $30.0M |
| 4 | $10.6M | $11.2M | $11.8M | $12.5M | $46.1M | $28.0M |
| 5 | $10.0M | $10.6M | $11.2M | $11.8M | $43.6M | $26.0M |
| 6-10 | $8.5M | $9.0M | $9.5M | $10.0M | $37.0M | $22.0M |
| 11-16 | $6.5M | $6.9M | $7.3M | $7.7M | $28.4M | $18.0M |
| 17-24 | $4.8M | $5.1M | $5.4M | $5.7M | $21.0M | $14.0M |
| 25-32 | $3.5M | $3.7M | $3.9M | $4.1M | $15.2M | $11.0M |

### 5th Year Option

- **Decision Deadline:** After Year 3 (before Year 4 begins)
- **Salary:** Based on transition tag value for position
- **Guarantee:** Fully guaranteed for injury at exercise, fully guaranteed at start of Year 5
- **Decline:** Team can decline, player becomes free agent after Year 4

---

## Round 2-7 Rookie Salaries

| Round | Year 1 | Year 2 | Year 3 | Year 4 | Total Value |
|-------|--------|--------|--------|--------|-------------|
| 2 (33-64) | $2.2M | $2.4M | $2.6M | $2.8M | $10.0M |
| 3 (65-100) | $1.3M | $1.4M | $1.5M | $1.6M | $5.8M |
| 4 (101-135) | $1.05M | $1.12M | $1.19M | $1.26M | $4.6M |
| 5 (136-176) | $0.95M | $1.00M | $1.05M | $1.10M | $4.1M |
| 6 (177-220) | $0.88M | $0.92M | $0.96M | $1.00M | $3.8M |
| 7 (221-259) | $0.82M | $0.86M | $0.90M | $0.94M | $3.5M |

---

## UDFA Contracts

| Component | Value |
|-----------|-------|
| Length | 3 years |
| Year 1 | $0.75M (minimum salary) |
| Year 2 | $0.85M |
| Year 3 | $0.95M |
| Signing Bonus | $5K - $25K |
| Guaranteed | Year 1 salary only |

---

# PART 3: VETERAN CONTRACTS

## Contract Components

### Base Salary

- **Definition:** Fixed annual payment for playing
- **Cap Hit:** Full amount counts in current year
- **Range:** $0.95M (minimum) to $55M+ (elite QBs)

### Signing Bonus

- **Definition:** Upfront cash payment at signing
- **Cap Hit:** Prorated evenly over contract length (max 5 years)
- **Range:** $0 to $75M+
- **Key Mechanic:** Converts immediate cash to spread cap hit

**Example:** $25M signing bonus on 5-year deal = $5M cap hit per year

### Roster Bonus

- **Definition:** Paid if player is on roster on specific date
- **Cap Hit:** Full amount in year earned
- **Common Dates:** Day 1 of league year, start of training camp
- **Use:** Creates easy cut points if player underperforms

### Option Bonus

- **Definition:** Bonus paid if team exercises contract option
- **Cap Hit:** Prorated over remaining contract years (max 5)
- **Use:** Extends team control while deferring cap hit

### Incentives

| Type | Cap Treatment | Example |
|------|---------------|---------|
| Likely To Be Earned (LTBE) | Counts in current year | Pro Bowl player has "make Pro Bowl" bonus |
| Not Likely To Be Earned (NLTBE) | Counts next year if earned | Non-Pro Bowl player has same bonus |

---

## Veteran Minimum Salary

Based on years of NFL experience:

| Experience | Minimum Salary | Cap Charge* |
|------------|----------------|-------------|
| 0 years (Rookie) | $0.75M | $0.75M |
| 1 year | $0.87M | $0.87M |
| 2 years | $0.95M | $0.95M |
| 3 years | $1.02M | $1.02M |
| 4 years | $1.10M | $1.10M |
| 5 years | $1.17M | $1.17M |
| 6 years | $1.24M | $1.24M |
| 7+ years | $1.30M | $1.30M |

*Veteran Salary Benefit: Players with 4+ years signed at minimum only count $1.02M against cap (difference paid from league fund)

---

## Contract Length

| Length | Common Use | Notes |
|--------|------------|-------|
| 1 year | Prove-it deals, veterans | Maximum flexibility |
| 2 years | Bridge contracts | Short-term commitment |
| 3 years | Standard deal | Balance of security and flexibility |
| 4 years | Core players | Common for established starters |
| 5 years | Franchise cornerstones | Long-term commitment |
| 6 years | Elite players | Rare, maximum security |
| 7 years | Maximum allowed | Very rare |

---

## Guaranteed Money Types

| Type | Definition | Risk Level |
|------|------------|------------|
| Fully Guaranteed | Paid no matter what | Highest (for team) |
| Guaranteed for Injury | Paid if player is injured | Medium |
| Guaranteed for Skill | Paid if cut for skill (not injury) | Lower |
| Non-Guaranteed | Only paid if on roster | Lowest (for team) |

### Typical Guarantee Structure

| Contract Type | Guaranteed % | Notes |
|---------------|--------------|-------|
| Franchise QB | 60-80% | Highest security |
| Elite Non-QB | 40-60% | Star player deals |
| Quality Starter | 25-40% | Solid commitment |
| Depth/Backup | 0-25% | Year 1 only typical |
| Veteran Minimum | 0% | No guarantees |

---

## Market Value by Position

### Top of Market (Elite Players)

| Position | Annual Average | Total Value | Guaranteed |
|----------|----------------|-------------|------------|
| QB | $50-55M | $250-275M | $150-175M |
| DE/Edge | $28-32M | $140-160M | $80-100M |
| WR | $28-32M | $140-160M | $75-95M |
| OT | $23-26M | $115-130M | $65-80M |
| CB | $21-24M | $105-120M | $55-70M |
| DT | $20-23M | $100-115M | $50-65M |
| LB | $18-22M | $90-110M | $45-60M |
| S | $14-17M | $70-85M | $35-50M |
| TE | $14-17M | $70-85M | $35-50M |
| RB | $12-16M | $60-80M | $25-40M |
| IOL | $14-18M | $70-90M | $40-55M |
| K/P | $5-7M | $20-28M | $10-15M |

### Solid Starter Market

| Position | Annual Average |
|----------|----------------|
| QB | $25-35M |
| DE/Edge | $15-20M |
| WR | $14-20M |
| OT | $12-18M |
| CB | $12-16M |
| Other | $8-14M |

### Backup Market

| Position | Annual Average |
|----------|----------------|
| QB | $5-10M |
| All Others | $2-5M |

---

## Salary by OVR (Guideline)

| OVR | Market Value (AAV) | Notes |
|-----|-------------------|-------|
| 95-99 | $30-55M | Position-dependent premium |
| 90-94 | $20-35M | Elite starter money |
| 85-89 | $12-22M | Quality starter |
| 80-84 | $6-14M | Starter level |
| 75-79 | $3-8M | Low-end starter/top backup |
| 70-74 | $2-4M | Quality backup |
| 65-69 | $1-2M | Depth |
| <65 | $0.95-1.3M | Minimum salary |

---

# PART 4: CONTRACT ACTIONS

## Signing Free Agents

### Process

1. Identify target free agent
2. Check available cap space
3. Make offer (years, total value, guaranteed)
4. Player evaluates offer vs other teams
5. Player accepts or rejects
6. If accepted, contract counts against cap immediately

### Offer Components

| Component | Player Preference |
|-----------|-------------------|
| Total Value | Higher = better |
| Guaranteed Money | Higher = better |
| Annual Average | Higher = better |
| Contract Length | Depends on age |
| Role/Playing Time | Starting role preferred |
| Team Competitiveness | Contenders preferred |
| Facilities | Better facilities = bonus |

---

## Contract Extensions

Extend a player's contract before it expires.

### Benefits

- Lock up player before free agency
- Often at discount vs open market
- Spread cap hit over more years
- Reduce current year cap hit via signing bonus

### Rules

- Can extend anytime during contract
- New money starts after current deal ends
- Signing bonus can prorate over new years
- Maximum contract: 7 years total from signing

### Extension Discount

| Years Remaining | Typical Discount |
|-----------------|------------------|
| 3+ years | 10-15% below market |
| 2 years | 5-10% below market |
| 1 year | 0-5% below market |
| Final year | Market rate or premium |

---

## Contract Restructures

Convert base salary to signing bonus to create cap space.

### How It Works

```
Before Restructure:
- Base Salary: $20M (full cap hit)

After Restructure:
- Base Salary: $1M
- Signing Bonus: $19M (prorated over remaining years)

Example (3 years remaining):
- Year 1 Cap Hit: $1M + $6.33M = $7.33M
- Cap Savings: $12.67M in Year 1
- But: $6.33M added to Years 2 and 3
```

### Restructure Rules

- Player must agree (usually automatic)
- Creates future cap obligations
- Maximum proration: 5 years
- Minimum base salary: $1M after restructure
- **Risk:** Accelerated dead money if later cut

### When to Restructure

| Situation | Restructure? |
|-----------|--------------|
| Need cap space for key signing | ✅ Yes |
| Player is long-term cornerstone | ✅ Yes |
| Player may decline soon | ❌ No |
| Already heavily prorated | ⚠️ Caution |
| Competing this year | ✅ Yes |

---

## Releasing Players (Cuts)

### Pre-June 1 Cut

- **Dead Money:** All remaining prorated bonuses accelerate to current year
- **Cap Savings:** Full base salary + current year bonuses removed
- **When:** Default for all cuts

**Example: Player with $15M cap hit ($10M base, $5M prorated bonus)**
- Dead Money: $5M + future prorated amounts
- Cap Savings: $10M

### Post-June 1 Cut

- **Dead Money:** Split over two years (current year prorated, next year remaining)
- **Cap Savings:** Full in current year
- **When:** Designated post-June 1 (only 2 allowed per team)

**Example: Same player, 2 years remaining on prorated bonus ($5M/year)**
- Year 1 Dead Money: $5M
- Year 2 Dead Money: $5M
- Year 1 Cap Savings: $10M

### Cut Candidates

| Indicator | Cut Likely? |
|-----------|-------------|
| High salary, declining performance | ✅ Yes |
| Large cap savings, low dead money | ✅ Yes |
| Younger, cheaper replacement available | ✅ Yes |
| High dead money, low savings | ❌ No |
| Team leader / culture fit | ❌ No |
| No replacement available | ❌ No |

---

## Trades

### Salary in Trades

- Acquiring team takes on full remaining contract
- Trading team retains dead money (prorated bonuses)
- Both teams must have cap space for transaction

### Trade Example

**Player traded mid-contract:**
- Original: 4-year, $40M, $16M signing bonus ($4M/year proration)
- Traded after Year 2

**Trading Team:**
- Dead Money: $8M (remaining 2 years of bonus)
- Cap Relief: Full base salary removed

**Acquiring Team:**
- Cap Hit: Base salary only (no proration)
- Bonus already paid by original team

### Absorbing Salary in Trades

- Teams can "absorb" salary to facilitate trades
- Pay cash to offset salary
- Helps move high-salary players
- Limited to roster bonus / base salary amounts

---

## Franchise Tag

Exclusive rights tag applied to one pending free agent.

### Tag Types

| Type | Salary | Can Negotiate? | Can Sign Elsewhere? |
|------|--------|----------------|---------------------|
| Exclusive | Top 5 average | No | No |
| Non-Exclusive | Top 5 average | Yes | Yes (original team can match) |
| Transition | Top 10 average | Yes | Yes (no compensation) |

### Franchise Tag Values by Position

| Position | Exclusive Tag | Non-Exclusive Tag |
|----------|---------------|-------------------|
| QB | $35.0M | $32.5M |
| DE/Edge | $22.0M | $20.5M |
| WR | $21.5M | $20.0M |
| OT | $19.5M | $18.0M |
| CB | $18.5M | $17.0M |
| DT | $17.5M | $16.0M |
| LB | $16.0M | $14.8M |
| S | $14.5M | $13.5M |
| TE | $12.5M | $11.5M |
| RB | $11.0M | $10.2M |
| K/P | $5.5M | $5.1M |

### Franchise Tag Rules

- **Deadline:** Before free agency opens
- **Limit:** One tag per team per year
- **Contract:** One-year, fully guaranteed
- **Consecutive Tags:** Salary increases 20% if tagged twice, 44% if tagged three times
- **Long-Term Deal:** Can still negotiate extension

---

## Injured Reserve (IR)

### Cap Implications

- Player's full cap hit remains
- Cannot be cut without cap penalty
- Can reach injury settlement (partial salary paid)

### IR Designations

| Type | Return Eligible? | Cap Impact |
|------|------------------|------------|
| Regular IR | Yes (after 4 games) | Full cap hit |
| Season-Ending IR | No | Full cap hit |
| IR Settlement | Released | Pro-rated salary + dead money |

### IR Settlement

- Player is released with injury
- Team pays percentage of remaining salary
- Typical: 25-50% of remaining base salary
- Player can sign elsewhere if healthy

---

## Holdouts

Players can hold out for new contracts.

### Holdout Mechanics

| Action | Consequence |
|--------|-------------|
| Misses OTAs | No penalty |
| Misses Training Camp | Fined per day (~$50K) |
| Misses Preseason Games | Larger fines |
| Misses Regular Season | Loses accrued season, game checks |

### Holdout Resolution

| Outcome | Description |
|---------|-------------|
| New Contract | Extension signed, holdout ends |
| Trade | Player traded to team willing to pay |
| Return | Player reports, plays on current deal |
| Suspension | Team suspends player (rare) |

### Holdout Risk Factors

| Factor | Holdout Likely? |
|--------|-----------------|
| Money Motivated trait | ✅ High |
| Underpaid vs market | ✅ High |
| Final contract year | ✅ High |
| Team First trait | ❌ Low |
| Loyal trait | ❌ Low |
| Recently signed | ❌ Low |

---

# PART 5: CAP MANAGEMENT STRATEGIES

## Spend Now vs Build for Future

### Win-Now Approach

- Use most of cap space
- Structure deals with low early cap hits
- Push money to future years
- Accept future dead money risk
- Trade future picks for players

### Rebuild Approach

- Maximize cap space
- Take on bad contracts for picks
- Sign short-term deals only
- Let expensive veterans walk
- Accumulate draft picks

### Balanced Approach

- Maintain $20-30M flexibility
- Mix of long-term and short-term deals
- Extend homegrown talent at fair prices
- Selective free agent spending

---

## Common Cap Maneuvers

### Create Cap Space

| Action | Cap Effect | Risk |
|--------|------------|------|
| Restructure star player | +$10-20M | Future cap burden |
| Cut overpaid veteran | +$5-15M | Lose player, dead money |
| Trade high-salary player | +$5-15M | Lose player, dead money |
| Convert roster bonus | +$2-5M | Minor future impact |

### Avoid Cap Trouble

| Strategy | Benefit |
|----------|---------|
| Maintain $10M buffer | Emergency signings |
| Avoid backloaded deals | Prevents future crunch |
| Don't restructure repeatedly | Avoids "cap hell" |
| Balance guaranteed money | Flexibility to cut |

---

## Cap Hell Warning Signs

| Sign | Severity |
|------|----------|
| Less than $10M cap space | ⚠️ Moderate |
| Multiple restructures same player | ⚠️ Moderate |
| Top 5 players = 40%+ of cap | 🔴 High |
| Dead money > $30M | 🔴 High |
| Negative cap space | 🔴 Critical |
| No easy cuts available | 🔴 Critical |

---

## Ideal Cap Distribution

### By Position Group

| Group | Target % of Cap |
|-------|-----------------|
| Offense | 50-55% |
| Defense | 40-45% |
| Special Teams | 2-5% |

### By Player Tier

| Tier | Target % of Cap |
|------|-----------------|
| Top 5 Players | 30-35% |
| Starters (6-22) | 40-45% |
| Depth (23-53) | 20-25% |

### Top-Heavy Warning

- If top 3 players > 30% of cap = risk
- Elite QB alone can be 18-22%
- Need value contracts to balance

---

# APPENDIX: QUICK REFERENCE

## Key Numbers

| Item | Value |
|------|-------|
| Year 1 Salary Cap | $225.0M |
| Cap Floor | $202.5M (90%) |
| Annual Cap Growth | ~3% |
| Minimum Salary (Rookie) | $0.75M |
| Minimum Salary (7+ years) | $1.30M |
| Maximum Contract Length | 7 years |
| Signing Bonus Proration | 5 years max |
| Franchise Tags Allowed | 1 per team/year |
| Post-June 1 Cuts Allowed | 2 per team/year |

## Salary Cap Formulas

```
Cap Hit = Base Salary + Prorated Bonus + Roster Bonus + Likely Incentives

Dead Money = Remaining Prorated Bonus (accelerated)

Cap Savings (Cut) = Cap Hit - Dead Money

Rollover Cap = Current Cap + Unused Space
```

---

**Status:** Salary Cap System Complete
**Scope:** Cap structure, rookie wages, veteran contracts, all contract actions
**Version:** 1.0
**Date:** December 2025
