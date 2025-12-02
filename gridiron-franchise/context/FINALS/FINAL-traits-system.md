# Traits System

## Overview

Traits represent player **personality, character, and intangibles** that cannot be captured by attributes alone. Traits affect gameplay, development, team chemistry, contract negotiations, and create unique player stories. Each player has 1-5 traits that shape their career arc.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FINAL-player-generation-system.md` | Archetype-based trait affinities |
| `FINAL-scout-system.md` | Scout rating determines trait visibility |
| `FINAL-draft-class-system.md` | Prospect trait revelation |
| `FINAL-salarycap.md` | Contract traits affect negotiations |

---

# PART 1: TRAIT CATEGORIES

| Category | Color | Focus |
|----------|-------|-------|
| 1. Leadership & Locker Room | 💙 Blue | Team dynamics |
| 2. Work Ethic & Development | 💚 Green | Growth rate |
| 3. On-Field Mentality | 🔥 Orange | Play style |
| 4. Durability & Health | 🩹 Gray | Injury resistance |
| 5. Contract & Loyalty | 💰 Gold | Negotiations |
| 6. Clutch & Pressure | ❄️ Ice Blue | Big moments |
| 7. Character & Discipline | ⚖️ Purple | Off-field |

---

# PART 2: ALL TRAITS BY CATEGORY

## Category 1: Leadership & Locker Room

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| 🗣️ **Vocal Leader** | +15% morale, +10% chemistry, mentors rookies (+5% XP), captain eligible | Quiet, Diva | 15% |
| 🎖️ **Veteran Mentor** | +1 dev tier to 2 young players, +10% morale to under-25s (req: 6+ years) | Selfish, Diva | 8% |
| 🤝 **Team First** | +20% chemistry, takes pay cuts, -5% demands, no complaints | Diva, Selfish, Money Motivated | 12% |
| 😤 **Diva** | -15% chemistry if not featured, +20% demands, +3 all attrs when 10+ touches | Team First, Vocal Leader | 5% |
| 🤐 **Quiet/Reserved** | Neutral morale, cannot be captain | Vocal Leader, Diva | 25% |
| 🎉 **Locker Room Cancer** | -25% morale, -20% chemistry, may cause trade requests | All positive leadership | 2% |

---

## Category 2: Work Ethic & Development

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| 💪 **Gym Rat** | +50% practice XP, +1 physical attr/season, slower regression | Lazy | 15% |
| 📚 **Film Junkie** | +50% mental XP, 2x playbook learning, better pre-snap reads | Lazy | 12% |
| 🎯 **Focused/Driven** | +25% overall XP, high consistency, better progression | Distracted, Lazy | 15% |
| 😴 **Lazy** | -50% XP, faster regression (28+), may lose attrs in offseason | Gym Rat, Film Junkie, Focused | 5% |
| ⚡ **Early Bloomer** | +2 starting OVR, peaks at 25, declines at 28 | Late Bloomer | 10% |
| 🌱 **Late Bloomer** | -2 starting OVR, peaks at 29, maintains peak longer | Early Bloomer | 10% |
| 🏆 **Winner's Mentality** | +10% XP when winning, +5 all attrs with winning record | Selfish | 12% |

---

## Category 3: On-Field Mentality

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| 🔥 **Hot Head** | +50% penalty chance, may be ejected, +2 Hit Power/STR, -5 AWR under pressure | Cool Under Pressure, Disciplined | 8% |
| 😎 **Cool Under Pressure** | No pressure penalties, +5 all attrs clutch | Hot Head, Chokes | 8% |
| 🎭 **Showboat** | +50% celebrations, +10% taunting penalty, ±5% morale based on score | Business-Like | 10% |
| 💼 **Business-Like** | No celebrations, low penalty chance, steady performance | Showboat, Diva | 20% |
| 🎯 **Aggressive** | +10% big play chance, +10% turnover chance | Conservative | 15% |
| 🛡️ **Conservative** | -10% big play chance, -10% turnover chance | Aggressive | 15% |
| 🎪 **Trash Talker** | Gets in opponents' heads, +20% penalty chance, may draw opponent penalties, +3 Intimidation | Professional, Quiet | 8% |

---

## Category 4: Durability & Health

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| 🛡️ **Iron Man** | -75% injury chance, +50% recovery, plays through minor injuries | Injury Prone | 5% |
| 🩹 **Injury Prone** | +75% injury chance, -30% recovery, more aggravations | Iron Man | 10% |
| 🏥 **Slow Healer** | -50% recovery speed, may have setbacks | Fast Healer | 10% |
| ⚡ **Fast Healer** | +50% recovery speed | Slow Healer | 10% |
| 🤕 **Plays Through Pain** | Plays injured at -5 OVR, +10% morale, may worsen injury | — | 8% |
| 🏋️ **Durable** | -40% injury chance, longer career | Fragile | 15% |
| 🥚 **Fragile** | +40% injury chance, shorter career | Durable, Iron Man | 10% |

---

## Category 5: Contract & Loyalty

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| 💰 **Money Motivated** | +30% demands, leaves for highest bidder, may hold out | Team First, Loyal, Ring Chaser | 20% |
| 🏆 **Ring Chaser** | Takes 20-40% pay cut for contenders, prioritizes winning (usually 30+) | Money Motivated | 8% |
| 📍 **Hometown Hero/Loyal** | -20% demands with current team, unlikely to leave, may refuse trades, +20% local fan appeal | Mercenary, Money Motivated | 10% |
| 🔄 **Mercenary** | Always tests FA, +10% demands, no loyalty, easy to trade | Loyal | 15% |
| 🤝 **Team Player** | Restructures contracts, accepts team-friendly deals, -15% demands | Money Motivated, Holdout Risk | 12% |
| ⏸️ **Holdout Risk** | May hold out if underpaid, +20% demands, can refuse to play, -20% chemistry during holdout | Team Player | 5% |

---

## Category 6: Clutch & Pressure

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| ❄️ **Ice in Veins** | +10 all attrs final 2 min, +15 all attrs playoffs, makes game-winners | Chokes Under Pressure | 5% |
| 😰 **Chokes Under Pressure** | -10 all attrs final 2 min, -15 all attrs playoffs, more clutch turnovers | Ice in Veins, Cool Under Pressure | 5% |
| 🌟 **Prime Time Player** | +5 OVR in nationally televised games, loves big stage | Stage Fright | 8% |
| 😨 **Stage Fright** | -5 OVR in nationally televised/playoff games | Prime Time Player, Ice in Veins | 4% |
| 🎯 **Comeback Artist** | +8 all attrs when trailing in 4th quarter, thrives in adversity | — | 6% |
| 🔒 **Closer** | +5 all attrs when protecting lead in 4th, fewer turnovers ahead | — | 8% |

---

## Category 7: Character & Discipline

| Trait | Effect | Conflicts | Rarity |
|-------|--------|-----------|--------|
| ⚖️ **High Character** | +10% morale, +10% fan appeal, 0% suspension risk | Character Concerns | 20% |
| ⚠️ **Character Concerns** | -10% morale, -15% fan appeal, 20% suspension chance/season | High Character | 5% |
| 📏 **Disciplined** | -75% penalty chance, rarely makes mental errors, follows game plan | Undisciplined, Hot Head | 15% |
| 🎲 **Undisciplined** | +75% penalty chance, more mental errors, may freelance | Disciplined | 10% |
| 🎖️ **High Football IQ** | +10% mental XP, +3 AWR/Play Rec, better decisions | Low Football IQ | 12% |
| 🤷 **Low Football IQ** | -10% mental XP, -3 AWR/Play Rec, more mental mistakes | High Football IQ | 8% |
| 🧠 **Football Genius** | +20% mental XP, reads any scheme, rarely fooled (req: 90+ AWR + Film Junkie) | — | 2% |

---

# PART 3: TRAIT GENERATION

## Trait Count by Player Quality

| Player Type | Trait Count | Positive/Negative Ratio |
|-------------|-------------|-------------------------|
| Elite (90+ OVR) | 3-5 traits | 80% positive, 20% negative |
| Good (80-89 OVR) | 2-4 traits | 70% positive, 30% negative |
| Average (70-79 OVR) | 2-3 traits | 60% positive, 40% negative |
| Below Average (60-69 OVR) | 1-3 traits | 50% positive, 50% negative |
| Poor (<60 OVR) | 1-2 traits | 40% positive, 60% negative |

---

## Trait Count by Potential

| Potential Tier | Bonus Traits |
|----------------|--------------|
| Superstar | +1 trait, guaranteed 1 rare+ |
| Star | +1 trait |
| Starter | Normal |
| Backup | Normal |
| Bust Risk | +1 negative trait |

---

## Position-Specific Trait Affinities

Different positions have higher chances of certain traits:

### Quarterbacks

| Trait | Affinity |
|-------|----------|
| Ice in Veins | 2x more likely |
| Film Junkie | 2x more likely |
| Vocal Leader | 1.5x more likely |
| High Football IQ | 2x more likely |
| Chokes Under Pressure | 1.5x more likely |

### Running Backs

| Trait | Affinity |
|-------|----------|
| Durable | 2x more likely |
| Injury Prone | 1.5x more likely |
| Aggressive | 1.5x more likely |
| Early Bloomer | 1.5x more likely |

### Wide Receivers

| Trait | Affinity |
|-------|----------|
| Diva | 2x more likely |
| Showboat | 2x more likely |
| Prime Time Player | 1.5x more likely |
| Money Motivated | 1.5x more likely |

### Tight Ends

| Trait | Affinity |
|-------|----------|
| Team First | 1.5x more likely |
| Business-Like | 1.5x more likely |
| Durable | 1.5x more likely |

### Offensive Linemen

| Trait | Affinity |
|-------|----------|
| Quiet/Reserved | 2x more likely |
| Team First | 2x more likely |
| Durable | 1.5x more likely |
| Disciplined | 1.5x more likely |

### Defensive Linemen

| Trait | Affinity |
|-------|----------|
| Hot Head | 1.5x more likely |
| Aggressive | 2x more likely |
| Trash Talker | 1.5x more likely |
| Gym Rat | 1.5x more likely |

### Linebackers

| Trait | Affinity |
|-------|----------|
| Vocal Leader | 2x more likely |
| High Football IQ | 1.5x more likely |
| Aggressive | 1.5x more likely |
| Plays Through Pain | 1.5x more likely |

### Defensive Backs

| Trait | Affinity |
|-------|----------|
| Trash Talker | 2x more likely |
| Prime Time Player | 1.5x more likely |
| Cool Under Pressure | 1.5x more likely |
| Showboat | 1.5x more likely |

### Kickers/Punters

| Trait | Affinity |
|-------|----------|
| Ice in Veins | 3x more likely |
| Chokes Under Pressure | 2x more likely |
| Quiet/Reserved | 2x more likely |
| Focused | 2x more likely |

---

## Archetype Trait Affinities

From `FINAL-player-generation-system.md`, archetypes influence traits:

| Archetype Type | Likely Traits |
|----------------|---------------|
| Field General (QB) | Vocal Leader, Film Junkie, High Football IQ |
| Scrambler (QB) | Aggressive, Early Bloomer |
| Power Back (RB) | Durable, Plays Through Pain, Aggressive |
| Elusive Back (RB) | Showboat, Early Bloomer |
| Deep Threat (WR) | Prime Time Player, Diva |
| Possession (WR) | Team First, Disciplined |
| Mauler (OL) | Aggressive, Hot Head |
| Pass Protector (OL) | Disciplined, Team First |
| Run Stuffer (DL) | Durable, Gym Rat |
| Pass Rusher (DL) | Aggressive, Hot Head |
| Coverage LB | High Football IQ, Film Junkie |
| Run Stopper LB | Aggressive, Plays Through Pain |
| Shutdown CB | Ice in Veins, Disciplined |
| Ball Hawk CB | Aggressive, Showboat |
| Hard Hitter (S) | Aggressive, Hot Head |
| Center Fielder (S) | High Football IQ, Film Junkie |

---

# PART 4: HIDDEN VS VISIBLE TRAITS

## Trait Visibility

Not all traits are visible immediately. Scouting reveals traits over time.

### Always Visible (Physical)

| Trait | Reason |
|-------|--------|
| Iron Man | Medical records |
| Injury Prone | Medical records |
| Durable | Medical records |
| Fragile | Medical records |
| Fast Healer | Medical records |
| Slow Healer | Medical records |

### Visible at Combine/Pro Day

| Trait | How Revealed |
|-------|--------------|
| Gym Rat | Physical testing |
| Early Bloomer | Performance trajectory |
| Late Bloomer | Performance trajectory |

### Revealed by Scout Interview

| Trait | Scout Rating Needed |
|-------|---------------------|
| Vocal Leader | 70+ |
| Team First | 75+ |
| Diva | 80+ |
| Money Motivated | 75+ |
| High Character | 70+ |
| Character Concerns | 85+ |
| Film Junkie | 70+ |
| Lazy | 85+ |

### Hidden Until Drafted

| Trait | When Revealed |
|-------|---------------|
| Locker Room Cancer | After 1 season |
| Holdout Risk | Contract time |
| Ice in Veins | Clutch situations |
| Chokes Under Pressure | Clutch situations |
| Hot Head | In-game incidents |

---

## Scout Rating Impact on Trait Revelation

| Scout OVR | Traits Revealed | Hidden Trait Accuracy |
|-----------|-----------------|----------------------|
| 95-99 | All traits | 95% |
| 90-94 | 4-5 traits | 90% |
| 85-89 | 3-4 traits | 80% |
| 80-84 | 2-3 traits | 70% |
| 75-79 | 1-2 traits | 60% |
| 70-74 | 1 trait | 50% |
| 60-69 | 0-1 traits | 40% |

---

# PART 5: TRAIT ACQUISITION & EVOLUTION

## At Draft/Creation

- Players spawn with 1-5 traits based on OVR/potential
- Weighted by rarity (common = higher chance)
- Influenced by position and archetype affinities

---

## Earning Traits During Career

| Achievement | Trait Earned |
|-------------|--------------|
| 3+ game-winning drives | Ice in Veins |
| 50 games without injury | Iron Man |
| 5 years with same team | Loyal |
| 3 consecutive Pro Bowls | Prime Time Player |
| 5,000+ rushing yards by age 26 | Early Bloomer |
| First Pro Bowl at 30+ | Late Bloomer |
| 3 seasons as captain | Vocal Leader |
| Average 90%+ playbook mastery | Film Junkie |
| Lead league in penalties 2x | Undisciplined |

---

## Losing Traits

| Event | Trait Lost | Trait Gained |
|-------|------------|--------------|
| 3+ major injuries | Durable | Injury Prone |
| Off-field incident | High Character | Character Concerns |
| Multiple holdouts | Team Player | Holdout Risk |
| Team success | Money Motivated | Ring Chaser (if 30+) |
| Leadership role | Quiet | Vocal Leader |

---

## Trait Evolution by Age

| Age Range | Common Changes |
|-----------|----------------|
| 21-24 | Develop work ethic traits (Gym Rat, Film Junkie) |
| 25-28 | Develop leadership traits (Vocal Leader, Mentor) |
| 29-32 | May gain Ring Chaser, lose Money Motivated |
| 33+ | Veteran Mentor becomes available |

---

# PART 6: TRAIT SYNERGIES

## Positive Synergies

Certain trait combinations unlock bonus effects:

| Combo | Traits Required | Bonus Effect |
|-------|-----------------|--------------|
| **Workout Warrior** | Gym Rat + Focused | +25% extra XP (stacks) |
| **Clutch Gene** | Ice in Veins + Cool Under Pressure | +5 extra attrs in final minute |
| **Student of the Game** | Film Junkie + High Football IQ | +3 extra AWR, immune to scheme tricks |
| **Ironclad** | Iron Man + Durable | -90% injury chance total |
| **Team Captain** | Vocal Leader + High Character | +25% morale, +15% chemistry |
| **Money Ball** | Team First + Ring Chaser | -30% total contract demands |
| **Showtime** | Prime Time Player + Showboat | +8 OVR in prime time (instead of +5) |
| **Mentorship** | Veteran Mentor + Vocal Leader | Mentor 4 young players instead of 2 |

---

## Negative Synergies

Certain combinations create problems:

| Combo | Traits | Penalty |
|-------|--------|---------|
| **Diva Duo** | 2+ Divas on team | -30% chemistry |
| **Cancer Ward** | Locker Room Cancer + Diva | May cause mass trade requests |
| **Undisciplined Hot Head** | Hot Head + Undisciplined | 2x ejection chance |
| **Fragile and Reckless** | Fragile + Aggressive | +100% injury chance |
| **Choke Artist** | Chokes + Stage Fright | -20 all attrs in playoffs |

---

# PART 7: TRAIT LIMITS & RULES

## Limits Per Player

| Limit | Value |
|-------|-------|
| Minimum traits | 1 |
| Maximum traits | 5 |
| Average traits | 2-3 |

---

## Stacking Rules

| Rule | Description |
|------|-------------|
| Cannot stack conflicting traits | Listed in each trait definition |
| Can stack complementary traits | Gym Rat + Film Junkie OK |
| Synergy bonuses apply automatically | When requirements met |
| Max 2 traits from same category | Prevents trait hoarding |

---

## Trait Change Limits

| Limit | Value |
|-------|-------|
| Traits earned per season | Max 1 |
| Traits lost per season | Max 1 |
| Total career trait changes | Unlimited |
| Trait evolution frequency | 1 per 2-3 seasons |

---

# PART 8: TRAIT IMPACT BY SYSTEM

## Contract Negotiations

| Trait | Demand Modifier |
|-------|-----------------|
| Money Motivated | +30% |
| Holdout Risk | +20% |
| Diva | +20% |
| Mercenary | +10% |
| Team First | -5% |
| Team Player | -15% |
| Loyal | -20% |
| Ring Chaser | -20% to -40% |

---

## Team Chemistry

| Trait | Chemistry Impact |
|-------|------------------|
| Vocal Leader | +15% morale, +10% chemistry |
| Team First | +20% chemistry |
| Veteran Mentor | +10% morale (under 25s) |
| High Character | +10% morale |
| Diva | -15% if not featured |
| Locker Room Cancer | -25% morale, -20% chemistry |
| Character Concerns | -10% morale |
| Holdout Risk | -20% during holdout |

---

## Player Development

| Trait | XP Modifier |
|-------|-------------|
| Gym Rat | +50% practice XP |
| Film Junkie | +50% mental XP |
| Focused | +25% all XP |
| Winner's Mentality | +10% when winning |
| Lazy | -50% all XP |
| High Football IQ | +10% mental XP |
| Low Football IQ | -10% mental XP |
| Football Genius | +20% mental XP |

---

## Game Simulation

| Trait | Simulation Effect |
|-------|-------------------|
| Ice in Veins | +10/+15 attrs (clutch/playoffs) |
| Chokes Under Pressure | -10/-15 attrs (clutch/playoffs) |
| Prime Time Player | +5 OVR national TV |
| Stage Fright | -5 OVR national TV/playoffs |
| Comeback Artist | +8 attrs when trailing Q4 |
| Closer | +5 attrs when leading Q4 |
| Aggressive | +10% big play, +10% turnover |
| Conservative | -10% big play, -10% turnover |
| Hot Head | +50% penalty, +2 physical attrs |
| Disciplined | -75% penalty |

---

## Durability

| Trait | Injury Modifier |
|-------|-----------------|
| Iron Man | -75% chance, +50% recovery |
| Durable | -40% chance |
| Injury Prone | +75% chance, -30% recovery |
| Fragile | +40% chance |
| Fast Healer | +50% recovery |
| Slow Healer | -50% recovery |
| Plays Through Pain | Can play injured at -5 OVR |

---

# PART 9: TRAIT MENTORSHIP

## How Mentorship Works

Veterans with positive traits can pass them to young players:

| Requirement | Details |
|-------------|---------|
| Mentor age | 28+ years old |
| Mentee age | Under 25 |
| Same position group | Required |
| Time together | 2+ seasons |
| Transfer chance | 25% per eligible season |

---

## Transferable Traits

| Category | Transferable Traits |
|----------|---------------------|
| Work Ethic | Gym Rat, Film Junkie, Focused |
| Leadership | Vocal Leader, Team First |
| Mental | High Football IQ, Disciplined |
| Clutch | Ice in Veins, Cool Under Pressure |

---

## Non-Transferable Traits

| Category | Non-Transferable |
|----------|------------------|
| Physical | Iron Man, Durable, Early/Late Bloomer |
| Negative | All negative traits |
| Personality | Diva, Money Motivated, etc. |

---

# PART 10: UI MOCKUPS

## Player Card with Traits

```
┌──────────────────────────────────────┐
│  #12  J. SMITH  QB  87 OVR           │
├──────────────────────────────────────┤
│                                      │
│  [Photo/Avatar]                      │
│                                      │
│  TRAITS:                             │
│  💙 🗣️ Vocal Leader                  │
│  💚 💪 Gym Rat                       │
│  ❄️ ❄️ Ice in Veins                  │
│                                      │
│  ⭐ SYNERGY: Team Captain            │
│     +25% morale, +15% chemistry      │
│                                      │
│  [VIEW DETAILS]                      │
└──────────────────────────────────────┘
```

---

## Trait Detail View

```
┌────────────────────────────────────────┐
│  ❄️ ICE IN VEINS                       │
├────────────────────────────────────────┤
│  Performs best in clutch moments       │
│                                        │
│  EFFECTS:                              │
│  • +10 all attributes (final 2 min)    │
│  • +15 all attributes (playoffs)       │
│  • Better in close games               │
│                                        │
│  RARITY: Rare (5%)                     │
│  CATEGORY: Clutch & Pressure           │
│                                        │
│  CONFLICTS WITH:                       │
│  • Chokes Under Pressure               │
│                                        │
│  SYNERGIZES WITH:                      │
│  • Cool Under Pressure (+5 extra)      │
│                                        │
│  HOW TO EARN:                          │
│  • 3+ game-winning drives              │
│  • High playoff performance            │
└────────────────────────────────────────┘
```

---

## Scouting Report - Traits Section

```
┌────────────────────────────────────────┐
│  PROSPECT TRAITS                       │
├────────────────────────────────────────┤
│                                        │
│  CONFIRMED:                            │
│  💚 💪 Gym Rat                         │
│  💙 🤝 Team First                      │
│                                        │
│  SUSPECTED (Scout 78 OVR):             │
│  ❄️ ❄️ Ice in Veins (72% confidence)   │
│                                        │
│  HIDDEN:                               │
│  ⚖️ ? Unknown (need 85+ scout)         │
│                                        │
│  ⚠️ RED FLAGS:                         │
│  None detected                         │
│                                        │
└────────────────────────────────────────┘
```

---

# PART 11: TRAIT-BASED EVENTS

## Dynamic Events Triggered by Traits

| Trait | Possible Event |
|-------|----------------|
| Hot Head | Ejected from big game |
| Holdout Risk | Demands new contract mid-season |
| Locker Room Cancer | Causes teammate trade request |
| Diva | Complains to media about targets |
| Money Motivated | Rejects team-friendly extension |
| Vocal Leader | Gives inspiring speech (+morale) |
| Character Concerns | Suspended for off-field incident |
| Ring Chaser | Requests trade to contender |

---

# APPENDIX: QUICK REFERENCE

## All Traits Table

| Trait | Category | Effect Summary | Rarity |
|-------|----------|----------------|--------|
| Vocal Leader | Leadership | +15% morale, +10% chem | 15% |
| Veteran Mentor | Leadership | Mentors 2 young players | 8% |
| Team First | Leadership | +20% chem, -5% demands | 12% |
| Diva | Leadership | -15% chem, +20% demands | 5% |
| Quiet/Reserved | Leadership | Neutral | 25% |
| Locker Room Cancer | Leadership | -25% morale | 2% |
| Gym Rat | Work Ethic | +50% practice XP | 15% |
| Film Junkie | Work Ethic | +50% mental XP | 12% |
| Focused | Work Ethic | +25% all XP | 15% |
| Lazy | Work Ethic | -50% all XP | 5% |
| Early Bloomer | Work Ethic | +2 OVR, peaks early | 10% |
| Late Bloomer | Work Ethic | -2 OVR, peaks late | 10% |
| Winner's Mentality | Work Ethic | +10% XP winning | 12% |
| Hot Head | On-Field | +50% penalty, +2 phys | 8% |
| Cool Under Pressure | On-Field | +5 clutch attrs | 8% |
| Showboat | On-Field | +celebrations | 10% |
| Business-Like | On-Field | Steady performance | 20% |
| Aggressive | On-Field | +10% big play/TO | 15% |
| Conservative | On-Field | -10% big play/TO | 15% |
| Trash Talker | On-Field | Draws penalties | 8% |
| Iron Man | Durability | -75% injury | 5% |
| Injury Prone | Durability | +75% injury | 10% |
| Slow Healer | Durability | -50% recovery | 10% |
| Fast Healer | Durability | +50% recovery | 10% |
| Plays Through Pain | Durability | Plays injured | 8% |
| Durable | Durability | -40% injury | 15% |
| Fragile | Durability | +40% injury | 10% |
| Money Motivated | Contract | +30% demands | 20% |
| Ring Chaser | Contract | -20-40% demands | 8% |
| Loyal | Contract | -20% demands | 10% |
| Mercenary | Contract | +10% demands | 15% |
| Team Player | Contract | -15% demands | 12% |
| Holdout Risk | Contract | +20% demands | 5% |
| Ice in Veins | Clutch | +10/+15 clutch/playoff | 5% |
| Chokes Under Pressure | Clutch | -10/-15 clutch/playoff | 5% |
| Prime Time Player | Clutch | +5 OVR national TV | 8% |
| Stage Fright | Clutch | -5 OVR national TV | 4% |
| Comeback Artist | Clutch | +8 when trailing Q4 | 6% |
| Closer | Clutch | +5 when leading Q4 | 8% |
| High Character | Character | +10% morale | 20% |
| Character Concerns | Character | 20% suspension risk | 5% |
| Disciplined | Character | -75% penalty | 15% |
| Undisciplined | Character | +75% penalty | 10% |
| High Football IQ | Character | +3 AWR/Play Rec | 12% |
| Low Football IQ | Character | -3 AWR/Play Rec | 8% |
| Football Genius | Character | +20% mental XP | 2% |

**Total: 44 Traits**

---

## Rarity Distribution

| Rarity | Range | Count |
|--------|-------|-------|
| Very Rare | 1-3% | 3 traits |
| Rare | 4-8% | 12 traits |
| Uncommon | 9-15% | 17 traits |
| Common | 16-25% | 12 traits |

---

**Status:** Traits System Complete  
**Scope:** 44 traits, 7 categories, generation, visibility, synergies, evolution  
**Version:** 2.0  
**Date:** December 2025
