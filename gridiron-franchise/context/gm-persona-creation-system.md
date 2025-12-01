# GM Persona Creation System

## Overview

When starting a new career, the user creates their General Manager persona. This affects starting bonuses, playstyle strengths, and how they build their franchise. The GM persona is defined by two choices: **Background** and **Archetype**.

---

## New Career Flow (Updated)

```
┌─────────────────────────────────────────────────────────────┐
│  1. SELECT BACKGROUND      Where did you come from?         │
│         ↓                                                   │
│  2. SELECT ARCHETYPE       What's your management style?    │
│         ↓                                                   │
│  3. SELECT TEAM            Which franchise will you lead?   │
│         ↓                                                   │
│  4. GAME SETTINGS          Difficulty, season length, etc.  │
│         ↓                                                   │
│  5. CONFIRM & START        Review and begin                 │
└─────────────────────────────────────────────────────────────┘
```

---

# PART 1: GM BACKGROUNDS

## Overview

Your background represents your career path before becoming a GM. It provides **passive bonuses** that last your entire career and affects how NPCs (players, agents, coaches) perceive you.

---

## Background Options

### 🏈 Former Player

**Description:** You played in the league before transitioning to the front office. You understand the game from a player's perspective.

**Starting Bonuses:**
- +15% player trust (easier contract negotiations with players)
- +10% locker room morale baseline
- Players are 10% more likely to sign with your team in free agency

**Passive Effects:**
- Can personally mentor 1 player per season (+15% XP boost)
- Better at evaluating physical attributes during scouting
- Players less likely to hold out or request trades

**Weakness:**
- -10% owner patience (expected to win sooner)
- Slightly worse at evaluating mental attributes

**Best Paired With:** Player Developer, Motivator archetypes

---

### 📊 Analytics Expert

**Description:** You rose through the ranks using data, statistics, and advanced metrics. You see the game through numbers.

**Starting Bonuses:**
- +20% scouting accuracy for hidden attributes
- See advanced stats for all players (not just your team)
- +10% accuracy on trade value assessments

**Passive Effects:**
- Unlock "Analytics Dashboard" showing win probability, efficiency metrics
- Better at identifying undervalued players
- Can see player regression/progression trends earlier

**Weakness:**
- -10% player trust (seen as "numbers guy")
- -5% locker room connection

**Best Paired With:** Scout Guru, Cap Wizard archetypes

---

### 🎓 College Scout

**Description:** You spent years evaluating college talent before getting your shot. You know prospects better than anyone.

**Starting Bonuses:**
- +25% scouting accuracy for draft prospects
- Reveal 2 additional hidden traits per draft class
- +15% chance to identify "sleeper" picks (rounds 4-7)

**Passive Effects:**
- See prospect's college stats and combine results in more detail
- Better projection of rookie development curves
- Connections reveal 1 team's draft board per year

**Weakness:**
- -10% free agent evaluation accuracy
- Less effective at evaluating veteran players

**Best Paired With:** Scout Guru, Draft Day Trader archetypes

---

### 📋 Coaching Tree

**Description:** You worked your way up through coaching staffs before moving to the front office. You understand schemes and player development.

**Starting Bonuses:**
- +15% player development speed (all players)
- +10% scheme fit accuracy when evaluating players
- Coaches are 15% cheaper to hire

**Passive Effects:**
- Can see how players fit specific offensive/defensive schemes
- Better at identifying coaching talent
- Players develop faster in their first 2 seasons with you

**Weakness:**
- -10% contract negotiation skill
- Slightly worse at cap management

**Best Paired With:** Player Developer, Motivator archetypes

---

### 💼 Agent/Contract Specialist

**Description:** You represented players before switching sides. You know every trick in the negotiation playbook.

**Starting Bonuses:**
- +20% contract negotiation effectiveness
- See exact player salary demands before negotiating
- +10% salary cap efficiency (reduce cap hits)

**Passive Effects:**
- Can restructure contracts more effectively
- Players accept team-friendly deals more often
- Better at identifying players who will outperform contracts

**Weakness:**
- -10% scouting accuracy
- -5% player trust (seen as "suit")

**Best Paired With:** Cap Wizard, Trade Shark archetypes

---

### 📰 Media/Front Office Insider

**Description:** You covered the league or worked in league operations before becoming a GM. You know how the business works.

**Starting Bonuses:**
- +15% trade acceptance rate (other GMs trust you)
- See other teams' needs and priorities
- +10% owner satisfaction baseline

**Passive Effects:**
- Advance warning of rule changes and league decisions
- Better relationships with other GMs (easier trades)
- Media criticism has less impact on job security

**Weakness:**
- -15% player evaluation accuracy
- Less connection with players

**Best Paired With:** Trade Shark, Cap Wizard archetypes

---

## Background Summary Table

| Background | Primary Bonus | Secondary Bonus | Weakness |
|------------|---------------|-----------------|----------|
| Former Player | +15% player trust | +10% morale | -10% owner patience |
| Analytics Expert | +20% hidden scouting | Advanced stats access | -10% player trust |
| College Scout | +25% prospect scouting | Sleeper identification | -10% FA evaluation |
| Coaching Tree | +15% development speed | Cheaper coaches | -10% negotiation |
| Agent/Specialist | +20% negotiation | See salary demands | -10% scouting |
| Media/Insider | +15% trade acceptance | See team needs | -15% player evaluation |

---

# PART 2: GM ARCHETYPES

## Overview

Your archetype represents your **management philosophy** and **playstyle**. It determines your starting skill, initial bonuses, and the types of GM Skills that cost less to unlock.

---

## Archetype Options

### 🔍 Scout Guru

**Philosophy:** "The draft is where championships are built."

**Description:** You believe in building through the draft. Finding diamonds in the rough and developing homegrown talent is your specialty.

**Starting Skill:** Hidden Gem (Bronze) — Reveal true potential of 1 late-round prospect per draft

**Starting Bonuses:**
- +2 scouting points per prospect evaluated
- 15% discount on all Scouting & Draft category skills
- Start with 1 extra 5th round pick in Year 1

**Playstyle Strengths:**
- Excellent at rebuilding teams
- Find value in late rounds
- Identify busts before drafting them

**Playstyle Weaknesses:**
- Less effective in free agency
- May struggle with win-now situations

**Recommended For:** Patient players who enjoy long-term team building

---

### 💰 Cap Wizard

**Philosophy:** "Every dollar matters. Cap space is a resource."

**Description:** You're a master of the salary cap. You structure deals, find bargains, and always have cap flexibility when you need it.

**Starting Skill:** Salary Cap Wizard (Bronze) — +$3M extra cap space each season

**Starting Bonuses:**
- +$5M cap space in Year 1
- 15% discount on all Contracts & Money category skills
- See cap implications of every move before confirming

**Playstyle Strengths:**
- Always have cap space for opportunities
- Sign good players to team-friendly deals
- Avoid salary cap hell

**Playstyle Weaknesses:**
- May undervalue elite talent
- Players may feel underappreciated

**Recommended For:** Players who enjoy roster construction puzzles

---

### 🔄 Trade Shark

**Philosophy:** "The phone is always ringing. Every player has a price."

**Description:** You're always looking for the next deal. You believe in acquiring value through trades and aren't afraid to make bold moves.

**Starting Skill:** Trade Master (Bronze) — CPU teams 10% more willing to accept fair trades

**Starting Bonuses:**
- +1 trade offer per week from other teams
- 15% discount on all Trades category skills
- See trade interest level for any player on your roster

**Playstyle Strengths:**
- Acquire players other teams undervalue
- Flip assets for profit
- Make blockbuster moves

**Playstyle Weaknesses:**
- Team chemistry may suffer from turnover
- Long-term planning is harder

**Recommended For:** Active players who enjoy wheeling and dealing

---

### ⭐ Player Developer

**Philosophy:** "Give me potential. I'll unlock greatness."

**Description:** You have a gift for developing talent. Raw prospects become stars under your guidance. Veterans extend their careers.

**Starting Skill:** Training Boost (Bronze) — All players under 25 gain +1 to development speed

**Starting Bonuses:**
- +20% XP gain for all players in Year 1
- 15% discount on all Player Development category skills
- Start with a free "development focus" slot

**Playstyle Strengths:**
- Turn mid-round picks into starters
- Maximize player potential
- Extend career arcs

**Playstyle Weaknesses:**
- May overpay for "potential"
- Patience required to see results

**Recommended For:** Players who enjoy watching players grow

---

### 🎯 Win-Now Executive

**Philosophy:** "Championships are the only thing that matters."

**Description:** You're aggressive. You trade picks for proven talent, sign big free agents, and push all your chips to the middle.

**Starting Skill:** Free Agent Magnet (Bronze) — Your team gets +5 appeal rating for free agents

**Starting Bonuses:**
- +15% chance to sign top free agents
- 15% discount on all Team Management category skills
- Start with +20 team morale

**Playstyle Strengths:**
- Compete immediately
- Attract star players
- Win championships faster

**Playstyle Weaknesses:**
- Future picks often traded away
- Cap trouble in 3-4 years
- Harder to sustain success

**Recommended For:** Players who want to compete immediately

---

### 🧠 Motivator

**Philosophy:** "Culture beats talent. Belief beats ability."

**Description:** You're a leader of men. Players play harder for you. Locker rooms are united. Teams exceed the sum of their parts.

**Starting Skill:** Morale Master (Bronze) — Team morale minimum is 60% (never drops below)

**Starting Bonuses:**
- +25% team chemistry in Year 1
- 15% discount on all Team Management category skills
- Players less likely to hold out or complain

**Playstyle Strengths:**
- Teams overperform their talent level
- Keep locker rooms happy
- Retain players at lower salaries (loyalty)

**Playstyle Weaknesses:**
- May overvalue "character guys"
- Less analytical approach

**Recommended For:** Players who enjoy team chemistry management

---

## Archetype Summary Table

| Archetype | Starting Skill | Primary Bonus | Skill Discount |
|-----------|----------------|---------------|----------------|
| Scout Guru | Hidden Gem (B) | +2 scouting points | Scouting & Draft |
| Cap Wizard | Salary Cap Wizard (B) | +$5M Year 1 cap | Contracts & Money |
| Trade Shark | Trade Master (B) | +1 trade offer/week | Trades |
| Player Developer | Training Boost (B) | +20% XP Year 1 | Player Development |
| Win-Now Executive | Free Agent Magnet (B) | +15% FA signing | Team Management |
| Motivator | Morale Master (B) | +25% chemistry Year 1 | Team Management |

---

# PART 3: COMBINATION BONUSES

## Overview

Certain Background + Archetype combinations unlock **synergy bonuses** — extra perks for thematic pairings.

---

## Synergy Combinations

### 🏈 + ⭐ Former Player + Player Developer
**Synergy: "The Mentor"**
- Personal mentorship boost increased to +25% XP (from +15%)
- Can mentor 2 players per season (instead of 1)
- Young players develop loyalty faster

---

### 📊 + 🔍 Analytics Expert + Scout Guru
**Synergy: "The Moneyball"**
- See prospect's statistical projections for Years 1-3
- +30% sleeper identification (instead of base)
- Unlock "Value Over Replacement" stat for all players

---

### 🎓 + 🔍 College Scout + Scout Guru
**Synergy: "The Draft Whisperer"**
- +35% prospect scouting accuracy (stacks)
- Reveal 1 additional hidden trait per prospect
- See other teams' top 3 draft targets

---

### 💼 + 💰 Agent/Specialist + Cap Wizard
**Synergy: "The Dealmaker"**
- +25% contract negotiation (stacks)
- All contracts have 10% lower cap hit
- Players never hold out under your management

---

### 📋 + ⭐ Coaching Tree + Player Developer
**Synergy: "The Academy"**
- +25% development speed (stacks to +40%)
- Rookies adjust to NFL faster (no Year 1 penalty)
- Unlock "Redshirt" option to stash rookies for bonus development

---

### 📰 + 🔄 Media/Insider + Trade Shark
**Synergy: "The Insider"**
- +25% trade acceptance (stacks)
- See exact trade value other GMs assign to players
- Get advance notice when players become available

---

### 🏈 + 🎯 Former Player + Win-Now Executive
**Synergy: "The Closer"**
- Top free agents actively seek you out
- +20% player trust with veterans
- Championship-hungry veterans take discounts to play for you

---

### 📊 + 💰 Analytics Expert + Cap Wizard
**Synergy: "The Optimizer"**
- See projected cap hits for next 3 seasons
- Identify "declining value" players before regression
- +15% accuracy on contract value assessments

---

## Synergy Summary Table

| Background | Archetype | Synergy Name | Key Bonus |
|------------|-----------|--------------|-----------|
| Former Player | Player Developer | The Mentor | +25% mentor XP, 2 slots |
| Analytics Expert | Scout Guru | The Moneyball | 3-year stat projections |
| College Scout | Scout Guru | The Draft Whisperer | +35% prospect accuracy |
| Agent/Specialist | Cap Wizard | The Dealmaker | 10% lower cap hits |
| Coaching Tree | Player Developer | The Academy | +40% development |
| Media/Insider | Trade Shark | The Insider | See exact trade values |
| Former Player | Win-Now Executive | The Closer | Veterans seek you out |
| Analytics Expert | Cap Wizard | The Optimizer | 3-year cap projections |

---

# PART 4: UI/UX FOR PERSONA CREATION

## Screen 1: Select Background

```
┌──────────────────────────────────────────────┐
│  ← Back       YOUR BACKGROUND                │
├──────────────────────────────────────────────┤
│                                              │
│  How did you become a GM?                    │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  🏈 FORMER PLAYER                      │ │
│  │  You played in the league before       │ │
│  │  transitioning to the front office.    │ │
│  │                                         │ │
│  │  • +15% player trust                   │ │
│  │  • +10% locker room morale             │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  📊 ANALYTICS EXPERT                   │ │
│  │  You rose through the ranks using      │ │
│  │  data and advanced metrics.            │ │
│  │                                         │ │
│  │  • +20% hidden attribute scouting      │ │
│  │  • Access to advanced stats            │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [Scroll for more...]                        │
│                                              │
└──────────────────────────────────────────────┘
```

## Screen 2: Select Archetype

```
┌──────────────────────────────────────────────┐
│  ← Back      YOUR PLAYSTYLE        Next →    │
├──────────────────────────────────────────────┤
│                                              │
│  Background: 📊 Analytics Expert             │
│                                              │
│  How do you build a winner?                  │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  🔍 SCOUT GURU              ⭐ SYNERGY │ │
│  │  "The draft is where championships     │ │
│  │   are built."                          │ │
│  │                                         │ │
│  │  Starting Skill: Hidden Gem (Bronze)   │ │
│  │  • +2 scouting points per prospect     │ │
│  │  • 15% discount: Scouting skills       │ │
│  │                                         │ │
│  │  🎯 SYNERGY BONUS: "The Moneyball"     │ │
│  │  See 3-year stat projections           │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  💰 CAP WIZARD              ⭐ SYNERGY │ │
│  │  "Every dollar matters."               │ │
│  │                                         │ │
│  │  Starting Skill: Salary Cap Wizard (B) │ │
│  │  • +$5M cap space Year 1               │ │
│  │                                         │ │
│  │  🎯 SYNERGY BONUS: "The Optimizer"     │ │
│  │  See 3-year cap projections            │ │
│  └────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

## Screen 3: Confirm Persona

```
┌──────────────────────────────────────────────┐
│  ← Back       YOUR GM PROFILE      Next →    │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │         📊 ANALYTICS EXPERT            │ │
│  │              +                          │ │
│  │         🔍 SCOUT GURU                  │ │
│  │                                         │ │
│  │     ⭐ "THE MONEYBALL" ⭐               │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  YOUR STRENGTHS:                             │
│  • +20% hidden attribute scouting           │
│  • +25% prospect scouting accuracy          │
│  • See 3-year statistical projections       │
│  • Access to advanced analytics             │
│  • 15% discount on Scouting skills          │
│                                              │
│  YOUR WEAKNESSES:                            │
│  • -10% player trust                        │
│  • -10% free agent evaluation               │
│                                              │
│  STARTING SKILL:                             │
│  🔍 Hidden Gem (Bronze)                     │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  [CONFIRM AND SELECT TEAM]             │ │
│  └────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

---

# PART 5: TECHNICAL IMPLEMENTATION

## GM Persona Data Structure

```typescript
interface GMPersona {
  background: GMBackground;
  archetype: GMArchetype;
  synergy: GMSynergy | null;
  
  // Calculated bonuses
  bonuses: {
    scoutingAccuracy: number;      // % modifier
    contractNegotiation: number;   // % modifier
    tradeAcceptance: number;       // % modifier
    playerDevelopment: number;     // % modifier
    playerTrust: number;           // % modifier
    teamMorale: number;            // % modifier
    capSpace: number;              // flat bonus
    ownerPatience: number;         // % modifier
  };
  
  // Starting resources
  startingSkill: GMSkill;
  startingCapBonus: number;
  startingMoraleBonus: number;
  
  // Skill discounts
  skillDiscountCategory: SkillCategory;
  skillDiscountPercent: number;    // typically 15%
}

type GMBackground = 
  | 'former_player'
  | 'analytics_expert'
  | 'college_scout'
  | 'coaching_tree'
  | 'agent_specialist'
  | 'media_insider';

type GMArchetype =
  | 'scout_guru'
  | 'cap_wizard'
  | 'trade_shark'
  | 'player_developer'
  | 'win_now_executive'
  | 'motivator';

type GMSynergy =
  | 'the_mentor'
  | 'the_moneyball'
  | 'the_draft_whisperer'
  | 'the_dealmaker'
  | 'the_academy'
  | 'the_insider'
  | 'the_closer'
  | 'the_optimizer';
```

## Bonus Calculation Example

```typescript
function calculateGMBonuses(background: GMBackground, archetype: GMArchetype): GMBonuses {
  let bonuses = getDefaultBonuses();
  
  // Apply background bonuses
  bonuses = applyBackgroundBonuses(bonuses, background);
  
  // Apply archetype bonuses
  bonuses = applyArchetypeBonuses(bonuses, archetype);
  
  // Check for synergy
  const synergy = getSynergy(background, archetype);
  if (synergy) {
    bonuses = applySynergyBonuses(bonuses, synergy);
  }
  
  return bonuses;
}
```

---

# APPENDIX

## All Backgrounds Quick Reference

| Background | Icon | Primary Strength | Primary Weakness |
|------------|------|------------------|------------------|
| Former Player | 🏈 | Player relationships | Owner expectations |
| Analytics Expert | 📊 | Hidden scouting | Player trust |
| College Scout | 🎓 | Draft prospects | Free agent eval |
| Coaching Tree | 📋 | Development speed | Negotiations |
| Agent/Specialist | 💼 | Contract negotiation | Scouting |
| Media/Insider | 📰 | Trade relationships | Player evaluation |

## All Archetypes Quick Reference

| Archetype | Icon | Starting Skill | Discount Category |
|-----------|------|----------------|-------------------|
| Scout Guru | 🔍 | Hidden Gem | Scouting & Draft |
| Cap Wizard | 💰 | Salary Cap Wizard | Contracts & Money |
| Trade Shark | 🔄 | Trade Master | Trades |
| Player Developer | ⭐ | Training Boost | Player Development |
| Win-Now Executive | 🎯 | Free Agent Magnet | Team Management |
| Motivator | 🧠 | Morale Master | Team Management |

## Combination Matrix

|  | Scout Guru | Cap Wizard | Trade Shark | Player Dev | Win-Now | Motivator |
|--|------------|------------|-------------|------------|---------|-----------|
| **Former Player** | - | - | - | ⭐ Mentor | ⭐ Closer | - |
| **Analytics** | ⭐ Moneyball | ⭐ Optimizer | - | - | - | - |
| **College Scout** | ⭐ Whisperer | - | - | - | - | - |
| **Coaching Tree** | - | - | - | ⭐ Academy | - | - |
| **Agent** | - | ⭐ Dealmaker | - | - | - | - |
| **Media/Insider** | - | - | ⭐ Insider | - | - | - |

---

**Status:** GM Persona Creation System Complete
**Components:** 6 Backgrounds, 6 Archetypes, 8 Synergies
**Version:** 1.0
**Date:** November 2025
