# Football Franchise Mobile Game - Facilities System

## Overview
Team facilities include **Stadium**, **Practice Facility**, **Training Room**, and **Weight Room**. Each facility has a quality rating that impacts player performance, development, injury prevention, fan experience, and revenue. Facilities can be upgraded over time.

---

## FACILITY TYPES

### 1. STADIUM
### 2. PRACTICE FACILITY
### 3. TRAINING ROOM (Medical Facility)
### 4. WEIGHT ROOM (Strength & Conditioning)

---

## 1. STADIUM

### Primary Functions
- Home field advantage
- Fan experience and attendance
- Revenue generation
- Team morale
- Weather impact

### Stadium Attributes

#### Overall Quality
- Scale: 1-10 stars (⭐)
- Affects home field advantage and revenue
- **Tiers:**
  - ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10): Elite (new, state-of-the-art)
  - ⭐⭐⭐⭐⭐⭐⭐⭐ (8-9): Great (modern amenities)
  - ⭐⭐⭐⭐⭐⭐ (6-7): Good (solid facility)
  - ⭐⭐⭐⭐ (4-5): Average (aging but functional)
  - ⭐⭐ (2-3): Poor (needs renovation)
  - ⭐ (1): Very Poor (outdated, falling apart)

#### Capacity
- Range: 55,000 - 85,000 seats
- Affects potential revenue
- Larger = more ticket sales, but harder to fill

#### Surface Type
- **Grass (Natural)**
  - +2 player injury rating (softer)
  - +5% home field advantage (players prefer)
  - Higher maintenance cost
  
- **Turf (Artificial)**
  - -2 player injury rating (harder surface)
  - Consistent year-round
  - Lower maintenance cost

#### Dome vs Open Air
- **Dome/Retractable Roof**
  - No weather impact on games
  - +$2M revenue per season (year-round events)
  - +3% home field advantage (comfort)
  
- **Open Air**
  - Weather affects games
  - Lower revenue (weather-dependent)
  - Authentic outdoor experience

#### Weather Effects (Open Air Only)
- **Cold Weather Stadium** (Northern cities)
  - Bonus: -3 to visiting team attributes in cold/snow
  - Home team accustomed to conditions
  
- **Hot Weather Stadium** (Southern cities)
  - Bonus: -2 to visiting team stamina in heat
  - Home team better conditioned
  
- **Neutral Weather** (Moderate climate)
  - No weather bonuses

#### Noise Level
- Scale: 1-10
- Based on capacity, design, fan passion
- **Effect:**
  - 10: +5 home field advantage (deafening)
  - 8-9: +4 home field advantage (very loud)
  - 6-7: +3 home field advantage (loud)
  - 4-5: +2 home field advantage (moderate)
  - 1-3: +1 home field advantage (quiet)

#### Luxury Suites
- Range: 50-200 suites
- **Revenue Impact:**
  - 150+: +$8M per season
  - 100-149: +$5M per season
  - 75-99: +$3M per season
  - 50-74: +$1M per season

---

### Stadium Impact Breakdown

#### Home Field Advantage
**Formula:** Base +3 OVR + (Quality × 0.3) + Noise Level
- **10-star stadium:** +6 OVR at home
- **8-star stadium:** +5 OVR at home
- **6-star stadium:** +4 OVR at home
- **4-star stadium:** +3 OVR at home
- **2-star stadium:** +2 OVR at home

#### Fan Morale & Attendance
- Elite stadium: 100% attendance, +20% fan morale
- Great stadium: 95% attendance, +15% fan morale
- Good stadium: 85% attendance, +10% fan morale
- Average stadium: 75% attendance, 0% fan morale
- Poor stadium: 60% attendance, -10% fan morale

#### Revenue Generation
**Formula:** (Capacity × Ticket Price) + Suites + Concessions
- **Elite stadium:** $50M per season
- **Great stadium:** $35M per season
- **Good stadium:** $25M per season
- **Average stadium:** $18M per season
- **Poor stadium:** $12M per season

#### Player Morale
- Playing in elite stadium: +5% team morale
- Playing in poor stadium: -5% team morale
- Affects free agent signings

---

### Stadium Upgrades

#### Renovation Options

**Surface Upgrade**
- **Cost:** $15M
- **Effect:** Convert grass ↔ turf
- **Time:** 1 offseason

**Roof Installation**
- **Cost:** $200M
- **Effect:** Add retractable roof
- **Time:** 2 offseasons
- **Benefit:** Weather immunity, +$2M annual revenue

**Capacity Expansion**
- **Cost:** $50M per 5,000 seats
- **Effect:** Increase capacity
- **Time:** 1 offseason
- **Benefit:** +$3M annual revenue per 5,000 seats

**Luxury Suite Addition**
- **Cost:** $30M
- **Effect:** Add 25-50 suites
- **Time:** 1 offseason
- **Benefit:** +$2M annual revenue

**Full Renovation**
- **Cost:** $500M - $1B
- **Effect:** Upgrade to 10-star facility
- **Time:** 2-3 offseasons
- **Benefit:** All bonuses, massive revenue boost

**New Stadium**
- **Cost:** $1.5B - $2.5B
- **Effect:** Brand new 10-star stadium
- **Time:** 3-4 offseasons
- **Benefit:** Maximum everything, iconic venue

---

## 2. PRACTICE FACILITY

### Primary Functions
- Player development
- Scheme installation
- Injury prevention (proper practice conditions)
- Coach effectiveness
- Player satisfaction

### Practice Facility Attributes

#### Overall Quality
- Scale: 1-10 stars (⭐)
- **Tiers:**
  - ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10): Elite (NFL best)
  - ⭐⭐⭐⭐⭐⭐⭐⭐ (8-9): Great (top-tier)
  - ⭐⭐⭐⭐⭐⭐ (6-7): Good (solid)
  - ⭐⭐⭐⭐ (4-5): Average (adequate)
  - ⭐⭐ (2-3): Poor (outdated)
  - ⭐ (1): Very Poor (bare minimum)

#### Practice Fields
- **Number of Fields:** 2-6 full-size fields
- **Surface Quality:**
  - Elite: Identical to game field, perfect maintenance
  - Average: Decent but not game-level quality
  - Poor: Worn, inconsistent surface
  
- **Effect:**
  - 6 fields: +25% practice efficiency
  - 4 fields: +15% practice efficiency
  - 3 fields: +5% practice efficiency
  - 2 fields: 0% bonus

#### Film Room
- **Technology Level:** 1-10
- **Equipment:**
  - Elite: 4K displays, VR systems, AI analysis
  - Average: HD displays, basic playback
  - Poor: Projectors, outdated equipment
  
- **Effect on Mental Attributes:**
  - 10: +50% XP to Awareness/Play Recognition
  - 8: +35% XP to Awareness/Play Recognition
  - 6: +20% XP to Awareness/Play Recognition
  - 4: +10% XP to Awareness/Play Recognition
  - 2: 0% bonus

#### Meeting Rooms
- **Number:** 5-15 rooms
- **Quality:** 1-10
- **Effect:**
  - Elite: +10% scheme learning speed
  - Average: +5% scheme learning speed
  - Poor: 0% bonus

#### Indoor Practice Facility
- **Yes/No**
- **Effect:**
  - Yes: No weather impact on practice, +15% practice efficiency
  - No: Weather can cancel/reduce practice quality

---

### Practice Facility Impact

#### Player Development Boost
**Formula:** Base XP × (1 + Facility Bonus)
- **10-star facility:** +30% XP gain
- **8-star facility:** +20% XP gain
- **6-star facility:** +12% XP gain
- **4-star facility:** +5% XP gain
- **2-star facility:** 0% bonus

#### Injury Prevention
- **10-star facility:** -20% practice injury chance
- **8-star facility:** -15% practice injury chance
- **6-star facility:** -10% practice injury chance
- **4-star facility:** -5% practice injury chance
- **2-star facility:** 0% bonus

#### Scheme Learning
- **10-star facility:** New schemes installed in 2 games
- **8-star facility:** New schemes installed in 3 games
- **6-star facility:** New schemes installed in 4 games
- **4-star facility:** New schemes installed in 5 games
- **2-star facility:** New schemes installed in 6 games

#### Coach Effectiveness
- Elite facility: +5 to all coach ratings
- Average facility: 0 bonus
- Poor facility: -3 to all coach ratings

---

### Practice Facility Upgrades

#### Additional Practice Fields
- **Cost:** $10M per field
- **Effect:** +5% practice efficiency per field
- **Time:** 1 offseason

#### Indoor Facility Construction
- **Cost:** $75M
- **Effect:** Weather immunity, +15% efficiency
- **Time:** 1-2 offseasons

#### Film Room Upgrade
- **Cost:** $5M
- **Effect:** +2 stars to film room quality
- **Time:** 1 offseason
- **Benefit:** +10% mental attribute XP

#### Full Renovation
- **Cost:** $150M
- **Effect:** Upgrade to 10-star facility
- **Time:** 2 offseasons
- **Benefit:** All development bonuses

---

## 3. TRAINING ROOM (Medical Facility)

### Primary Functions
- Injury treatment and recovery
- Injury prevention
- Player health monitoring
- Longevity and durability
- Return-to-play protocols

### Training Room Attributes

#### Overall Quality
- Scale: 1-10 stars (⭐)
- **Tiers:**
  - ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10): Elite (cutting-edge medical)
  - ⭐⭐⭐⭐⭐⭐⭐⭐ (8-9): Great (excellent care)
  - ⭐⭐⭐⭐⭐⭐ (6-7): Good (quality care)
  - ⭐⭐⭐⭐ (4-5): Average (adequate)
  - ⭐⭐ (2-3): Poor (basic care)
  - ⭐ (1): Very Poor (minimal resources)

#### Medical Equipment
- **Technology Level:** 1-10
- **Equipment:**
  - Elite: MRI, CT scan, cryotherapy, hyperbaric chamber
  - Average: X-ray, ultrasound, basic rehab tools
  - Poor: Limited diagnostic tools
  
- **Effect:**
  - 10: Instant accurate diagnosis
  - 8: Accurate diagnosis within hours
  - 6: Accurate diagnosis within 1 day
  - 4: Diagnosis within 2 days
  - 2: Limited diagnostic ability

#### Treatment Rooms
- **Number:** 5-20 treatment tables
- **Privacy:** Individual rooms vs open floor
- **Effect:**
  - 20 rooms: Can treat entire injured roster simultaneously
  - 10 rooms: Adequate for most situations
  - 5 rooms: Bottleneck if many injuries

#### Therapy Pool
- **Yes/No**
- **Effect:**
  - Yes: +15% recovery speed for soft tissue injuries
  - No: Standard recovery

#### Sports Science Lab
- **Yes/No**
- **Technologies:** Motion capture, biomechanics analysis
- **Effect:**
  - Yes: -10% injury chance (identify risk factors)
  - No: Standard injury rates

---

### Training Room Impact

#### Recovery Speed
**Formula:** Base Recovery Time × (1 - Facility Bonus)
- **10-star facility:** -40% recovery time (injuries heal 40% faster)
- **8-star facility:** -30% recovery time
- **6-star facility:** -20% recovery time
- **4-star facility:** -10% recovery time
- **2-star facility:** 0% bonus

#### Injury Rate Reduction
- **10-star facility:** -25% injury chance
- **8-star facility:** -18% injury chance
- **6-star facility:** -12% injury chance
- **4-star facility:** -6% injury chance
- **2-star facility:** 0% bonus

#### Injury Severity Reduction
- **10-star facility:** Major injuries → Moderate, Moderate → Minor
- **8-star facility:** 50% chance to reduce severity
- **6-star facility:** 25% chance to reduce severity
- **4-star facility:** 10% chance to reduce severity
- **2-star facility:** No severity reduction

#### Career Longevity
- **10-star facility:** Players play 2 extra years on average
- **8-star facility:** Players play 1.5 extra years
- **6-star facility:** Players play 1 extra year
- **4-star facility:** +0.5 years
- **2-star facility:** No longevity bonus

#### Re-Injury Prevention
- **10-star facility:** -50% re-injury chance
- **8-star facility:** -35% re-injury chance
- **6-star facility:** -20% re-injury chance
- **4-star facility:** -10% re-injury chance
- **2-star facility:** 0% bonus

---

### Training Room Upgrades

#### Medical Equipment Upgrade
- **Cost:** $8M
- **Effect:** +2 stars, faster diagnosis
- **Time:** 1 offseason

#### Therapy Pool Installation
- **Cost:** $5M
- **Effect:** +15% soft tissue recovery
- **Time:** 1 offseason

#### Sports Science Lab
- **Cost:** $12M
- **Effect:** -10% injury chance
- **Time:** 1 offseason

#### Expand Treatment Capacity
- **Cost:** $10M
- **Effect:** +10 treatment rooms
- **Time:** 1 offseason

#### Full Medical Center Upgrade
- **Cost:** $50M
- **Effect:** Upgrade to 10-star facility
- **Time:** 1-2 offseasons
- **Benefit:** Best injury care in league

---

## 4. WEIGHT ROOM (Strength & Conditioning)

### Primary Functions
- Physical attribute development
- Strength and speed training
- Stamina and endurance
- Injury prevention (stronger bodies)
- Player conditioning

### Weight Room Attributes

#### Overall Quality
- Scale: 1-10 stars (⭐)
- **Tiers:**
  - ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10): Elite (Olympic-level)
  - ⭐⭐⭐⭐⭐⭐⭐⭐ (8-9): Great (professional-grade)
  - ⭐⭐⭐⭐⭐⭐ (6-7): Good (well-equipped)
  - ⭐⭐⭐⭐ (4-5): Average (basic equipment)
  - ⭐⭐ (2-3): Poor (limited equipment)
  - ⭐ (1): Very Poor (outdated weights)

#### Equipment Quality
- **Free Weights:** Dumbbells, barbells, plates
- **Machines:** Leg press, cable systems, specialized equipment
- **Technology:** Force plates, velocity trackers, performance monitors
  
- **Effect:**
  - Elite: All equipment + tech + customization
  - Average: Standard weights and machines
  - Poor: Basic free weights only

#### Space & Layout
- **Square Footage:** 5,000 - 20,000 sq ft
- **Organization:** Open floor vs stations
- **Effect:**
  - 20,000 sq ft: Entire team trains simultaneously
  - 10,000 sq ft: Position groups rotate
  - 5,000 sq ft: Small groups only

#### Cardio Equipment
- **Number:** 20-50 machines
- **Types:** Treadmills, bikes, rowers, sleds
- **Effect:**
  - 50 machines: +25% stamina development
  - 35 machines: +15% stamina development
  - 20 machines: +5% stamina development

#### Speed/Agility Area
- **Turf Section:** 30-100 yards
- **Equipment:** Sleds, hurdles, resistance bands, parachutes
- **Effect:**
  - 100 yards + full equipment: +30% speed/agility XP
  - 60 yards + some equipment: +15% speed/agility XP
  - 30 yards + basic: +5% speed/agility XP

#### Recovery Equipment
- **Cryotherapy chambers**
- **Compression therapy**
- **Massage chairs**
- **Ice baths**
  
- **Effect:**
  - All equipment: +20% recovery between workouts
  - Some equipment: +10% recovery
  - Basic: 0% bonus

---

### Weight Room Impact

#### Physical Attribute Development
**Formula:** Base XP × (1 + Facility Bonus)
**Affects:** Speed, Strength, Acceleration, Agility, Stamina, Jumping

- **10-star facility:** +40% physical attribute XP
- **8-star facility:** +30% physical attribute XP
- **6-star facility:** +20% physical attribute XP
- **4-star facility:** +10% physical attribute XP
- **2-star facility:** 0% bonus

#### Strength Gains
- **10-star facility:** +2 Strength per season (young players)
- **8-star facility:** +1.5 Strength per season
- **6-star facility:** +1 Strength per season
- **4-star facility:** +0.5 Strength per season
- **2-star facility:** +0.2 Strength per season

#### Speed Development
- **10-star facility:** +1.5 Speed per season (young players)
- **8-star facility:** +1 Speed per season
- **6-star facility:** +0.7 Speed per season
- **4-star facility:** +0.4 Speed per season
- **2-star facility:** +0.2 Speed per season

#### Stamina Improvement
- **10-star facility:** +3 Stamina per season
- **8-star facility:** +2 Stamina per season
- **6-star facility:** +1.5 Stamina per season
- **4-star facility:** +1 Stamina per season
- **2-star facility:** +0.5 Stamina per season

#### Injury Prevention (Stronger Players)
- **10-star facility:** -15% injury chance (stronger bodies)
- **8-star facility:** -10% injury chance
- **6-star facility:** -7% injury chance
- **4-star facility:** -4% injury chance
- **2-star facility:** 0% bonus

#### Age Regression Delay
- **10-star facility:** Physical attributes decline 30% slower
- **8-star facility:** Physical attributes decline 20% slower
- **6-star facility:** Physical attributes decline 12% slower
- **4-star facility:** Physical attributes decline 6% slower
- **2-star facility:** Normal decline

---

### Weight Room Upgrades

#### Equipment Upgrade
- **Cost:** $5M
- **Effect:** +2 stars, better quality machines
- **Time:** 1 offseason

#### Expand Space
- **Cost:** $15M
- **Effect:** +5,000 sq ft
- **Time:** 1 offseason

#### Speed/Agility Area
- **Cost:** $3M
- **Effect:** 100-yard turf section + equipment
- **Time:** 1 offseason
- **Benefit:** +20% speed/agility XP

#### Recovery Equipment Addition
- **Cost:** $4M
- **Effect:** Cryo, compression, massage
- **Time:** 1 offseason
- **Benefit:** +15% recovery speed

#### Technology Integration
- **Cost:** $6M
- **Effect:** Force plates, velocity trackers, data analytics
- **Time:** 1 offseason
- **Benefit:** +10% training efficiency

#### Complete Renovation
- **Cost:** $40M
- **Effect:** Upgrade to 10-star facility
- **Time:** 1-2 offseasons
- **Benefit:** Maximum physical development

---

## FACILITY SYNERGIES

### All Elite (10-Star) Facilities
- **Bonus:** +5% to all bonuses (stacking multiplier)
- **Reputation:** Best facilities in league
- **Free Agent Draw:** +20% FA appeal
- **Effect:** Dynasty-building infrastructure

### 3 Elite Facilities
- **Bonus:** +3% to all bonuses
- **Reputation:** Top-tier organization
- **Free Agent Draw:** +12% FA appeal

### 2 Elite Facilities
- **Bonus:** +2% to all bonuses
- **Free Agent Draw:** +7% FA appeal

### All Poor (2-Star or Below)
- **Penalty:** -5% to all effects
- **Reputation:** Cheapskate organization
- **Free Agent Draw:** -15% FA appeal
- **Effect:** Players want to leave

---

## FACILITY BUDGETS & COSTS

### Annual Maintenance
- **10-star facility:** $5M per year
- **8-star facility:** $3M per year
- **6-star facility:** $2M per year
- **4-star facility:** $1M per year
- **2-star facility:** $500K per year

### Total Facility Investment
**To have all 4 facilities at 10 stars:**
- Stadium: $1.5B - $2.5B (new) or $500M (renovation)
- Practice Facility: $150M
- Training Room: $50M
- Weight Room: $40M
- **Total:** $1.74B - $2.74B

**Annual ROI:**
- Elite facilities generate +$40M revenue per year
- Elite facilities save $20M in injuries/development
- **Total:** $60M per year
- **Payback:** 29-46 years (long-term investment)

---

## FACILITY MANAGEMENT UI

### Facilities Overview Screen
```
┌────────────────────────────────────────┐
│  ← Back      FACILITIES                │
├────────────────────────────────────────┤
│                                        │
│  STADIUM                               │
│  ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10)                    │
│  Capacity: 68,000 • Grass • Dome      │
│  Home Advantage: +5 OVR                │
│  Revenue: $35M/season                  │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  PRACTICE FACILITY                     │
│  ⭐⭐⭐⭐⭐⭐ (6/10)                        │
│  4 Fields • Indoor Facility           │
│  Player Dev: +12% XP                   │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  TRAINING ROOM                         │
│  ⭐⭐⭐⭐⭐⭐⭐ (7/10)                       │
│  Recovery: -20% time                   │
│  Injury Rate: -12%                     │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  WEIGHT ROOM                           │
│  ⭐⭐⭐⭐⭐⭐⭐⭐⭐ (9/10)                    │
│  Physical Dev: +35% XP                 │
│  Strength Gains: +1.8/season           │
│  [VIEW] [UPGRADE]                      │
│                                        │
│  OVERALL: 7.5/10 ⭐                    │
│  Free Agent Appeal: +10%               │
└────────────────────────────────────────┘
```

### Stadium Detail Screen
```
┌────────────────────────────────────────┐
│  ← Back      STADIUM                   │
├────────────────────────────────────────┤
│  QUALITY: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10)            │
│                                        │
│  SPECIFICATIONS                        │
│  Capacity: 68,000                      │
│  Surface: Natural Grass                │
│  Type: Retractable Roof                │
│  Luxury Suites: 120                    │
│  Noise Level: 8/10                     │
│                                        │
│  EFFECTS                               │
│  Home Field Advantage: +5 OVR          │
│  Fan Attendance: 95%                   │
│  Revenue: $35M/season                  │
│  Player Morale: +10%                   │
│                                        │
│  UPGRADES AVAILABLE                    │
│  ┌──────────────────────────────┐     │
│  │  Add 25 Luxury Suites        │     │
│  │  Cost: $30M                   │     │
│  │  Effect: +$2M revenue         │     │
│  │  Time: 1 offseason            │     │
│  │  [PURCHASE]                   │     │
│  └──────────────────────────────┘     │
│                                        │
│  ┌──────────────────────────────┐     │
│  │  Full Renovation (10⭐)       │     │
│  │  Cost: $500M                  │     │
│  │  Effect: +6 OVR home adv      │     │
│  │  Time: 2 offseasons           │     │
│  │  [PURCHASE]                   │     │
│  └──────────────────────────────┘     │
└────────────────────────────────────────┘
```

### Upgrade Confirmation Modal
```
┌────────────────────────────────────────┐
│          Confirm Upgrade               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                        │
│  Weight Room - Complete Renovation     │
│                                        │
│  Current: ⭐⭐⭐⭐⭐⭐ (6/10)              │
│  After: ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ (10/10)          │
│                                        │
│  COST: $40,000,000                     │
│  TIME: 1 offseason                     │
│                                        │
│  NEW BENEFITS:                         │
│  • +40% physical attribute XP          │
│  • +2 Strength per season              │
│  • +1.5 Speed per season               │
│  • -15% injury chance                  │
│                                        │
│  Available Budget: $120M               │
│  Remaining: $80M                       │
│                                        │
│  [CANCEL]          [CONFIRM]           │
│                                        │
└────────────────────────────────────────┘
```

---

## STRATEGIC DECISIONS

### Facility Investment Priority

**Win-Now Team:**
1. Training Room (keep stars healthy)
2. Stadium (home field advantage)
3. Weight Room (maintain veterans)
4. Practice Facility (least urgent)

**Rebuilding Team:**
1. Practice Facility (develop young players)
2. Weight Room (build physical attributes)
3. Training Room (protect investment)
4. Stadium (upgrade later when competitive)

**Balanced Team:**
1. Even investment across all facilities
2. Bring all to 6-7 stars first
3. Then push to 8-9 stars
4. Elite facilities last (expensive)

---

## FACILITY IMPACT ON FREE AGENCY

### Free Agent Pitch Points
When recruiting free agents, facilities add pitch value:

- **10-star facility:** +15 pitch points each
- **8-star facility:** +10 pitch points each
- **6-star facility:** +5 pitch points each
- **4-star facility:** 0 pitch points
- **2-star facility:** -5 pitch points each

**Total Possible:** +60 pitch points (all elite)

**Competing Factors:**
- Salary offer
- Team success/playoff chances
- Location/city appeal
- Playing time opportunity
- **Facilities** (can be tiebreaker)

---

## FACILITY REPUTATION SYSTEM

### League-Wide Rankings
- Facilities ranked 1-12 across league
- Published annually
- Affects team prestige

### Reputation Tiers
- **Top 3:** Premier destination, +15% FA appeal
- **Top 6:** Desirable team, +8% FA appeal
- **Top 9:** Average facilities, 0% impact
- **Bottom 3:** Undesirable, -12% FA appeal

---

## ADVANCED FEATURES

### Facility Tours (Draft/Free Agency)
- Can invite draft prospects or FAs for facility tour
- Elite facilities impress players
- Increases draft/signing likelihood by 5-20%

### Facility Events
- Host charity events (+fan morale)
- Training camps open to public (+revenue)
- Community engagement (+reputation)

### Facility Aging
- Facilities degrade -0.5 stars every 10 years
- Must maintain or upgrade to prevent decline
- Annual maintenance prevents deterioration

### Historic Venues
- Some stadiums have "historic" status
- +2 home field advantage (tradition)
- Can't demolish, must preserve
- Example: "The Old Stadium has history dating back 50 years"

---

## NOTES

### Design Philosophy
- Facilities are long-term investments
- Provide tangible benefits (not cosmetic)
- Create strategic choices (where to invest?)
- Reward forward-thinking GMs

### Balance Considerations
- Elite facilities give 5-10% overall advantage
- Not game-breaking but meaningful
- Expensive to max out (forces choices)
- Takes multiple seasons to build complete infrastructure

### Realism vs Gameplay
- Real NFL teams invest billions in facilities
- Ours are simplified but impactful
- Costs scaled to game economy
- Effects noticeable but not overpowered

### Future Expansion
- Team headquarters/offices
- Sports science lab (separate facility)
- Player housing/dorms (for training camp)
- Entertainment/recreation areas

---

**Status:** Facilities System Complete
**Next Steps:** Balance costs and ROI, integrate with budget system, create facility UI
**Version:** 1.0
**Date:** November 19, 2025
