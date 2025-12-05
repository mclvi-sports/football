# Generators Reference

Natural language overview of how each generator works in the system.

---

## Overview

The game uses 11 generators to create league data. They fall into three categories:

| Category | Generators |
|----------|------------|
| Player Data | Player, Roster, Free Agent, Draft |
| Staff & Facilities | GM, Coaching, Scouting, Facilities |
| League Structure | Schedule |
| Orchestration | League Generator, Full Game Generator |

---

## Player Generator

**Purpose:** Creates individual players with realistic attributes, traits, and badges.

**How It Works:**

1. **Archetype Selection** - Every player gets an archetype (70 total across 18 positions). The archetype determines which attributes are primary, secondary, and tertiary for that player. For example, a "Pocket Passer" QB prioritizes Throw Power and Throw Accuracy, while a "Scrambler" QB prioritizes Speed and Agility.

2. **Attribute Distribution** - The generator allocates attribute points based on the target OVR:
   - Primary attributes get 50% of the "good" points (closer to target)
   - Secondary attributes get 35%
   - Tertiary attributes get 15%

   This creates realistic variation where players excel at their archetype's strengths.

3. **Trait Generation** - Players receive personality and performance traits based on OVR:
   - Elite players (90+): 3-5 traits, only 20% chance of negative traits
   - Good players (80-89): 2-4 traits, 30% negative chance
   - Average players (70-79): 2-3 traits, 40% negative chance

   The system checks for trait conflicts (can't be "Clutch" and "Chokes Under Pressure").

4. **Badge Generation** - Badges are earned through experience and OVR:
   - More experienced, higher-rated players get more badges
   - Badge tiers: Bronze, Silver, Gold, Hall of Fame
   - Badges match position (QBs get passing badges, not blocking badges)

5. **Potential Calculation** - Younger players have higher potential gaps:
   - Age 21-22: potential is 8-15 points above current OVR
   - Age 23-24: potential is 5-12 points above
   - Age 25-27: potential is 3-8 points above
   - Age 28+: potential gap shrinks to 0-5

**Key Insight:** The archetype system ensures players feel distinct even at the same position and OVR. Two 85-rated QBs will play very differently if one is a Pocket Passer and another is a Dual Threat.

---

## Roster Generator

**Purpose:** Creates 53-man rosters for each team with realistic depth charts and contracts.

**How It Works:**

1. **Slot-Based OVR Targets** - The roster uses a "slot" system where each position spot has an expected OVR based on team tier:
   - Starter slots target higher OVRs (adjusted by team tier)
   - Backup slots target lower OVRs
   - Elite teams have starters around 85-95 OVR
   - Rebuilding teams have starters around 70-78 OVR

2. **Position Requirements** - Each roster fills:
   - 3 QBs, 4 RBs, 6 WRs, 3 TEs
   - 9 offensive linemen (tackles, guards, center)
   - 8 defensive linemen (ends, tackles)
   - 7 linebackers (middle and outside)
   - 10 defensive backs (corners, safeties)
   - 3 specialists (K, P, LS)

3. **Contract Generation** - Contracts are based on OVR and position value:
   - 95+ OVR: $30-55M annually
   - 90-94 OVR: $20-35M
   - 85-89 OVR: $12-22M
   - Lower-rated players get veteran minimum ($750K-$1.3M based on experience)

   Contract length depends on age and OVR (young stars get 4-5 year deals, aging veterans get 1-2 years).

**Key Insight:** The tier system creates realistic league parity. Elite teams aren't just "better at every position" - they have more high-end starters and better depth.

---

## Free Agent Generator

**Purpose:** Creates a pool of 150-200 unsigned players available for teams to sign.

**How It Works:**

1. **Pool Size** - Generates 150-200 free agents (configurable).

2. **OVR Distribution** - Free agents skew toward mid-tier talent:
   - 3% are 80+ OVR (solid starters)
   - 10% are 75-79 OVR (low-end starters)
   - 25% are 70-74 OVR (backups)
   - 35% are 65-69 OVR (depth pieces)
   - 20% are 60-64 OVR (roster fillers)
   - 7% are below 60 OVR (camp bodies)

3. **Availability Reasons** - Each free agent has a reason they're unsigned:
   - Age Decline (30%): Older players past their prime
   - Injury History (20%): Players with durability concerns
   - Cap Casualty (15%): Good players cut for cap reasons
   - Character Concerns (10%): Talent but red flags
   - Young & Unproven (15%): Low-experience players
   - Market Timing (10%): Just waiting for the right offer

   The reason affects their asking price and willingness to sign.

4. **Contract Demands** - Free agents want contracts based on their OVR:
   - Higher-rated players demand more money and longer terms
   - Players with character concerns or injury history accept discounts
   - Young players may take prove-it deals

**Key Insight:** The availability reason system adds narrative depth. A 78 OVR player cut as a "cap casualty" is a different signing than a 78 OVR player with "character concerns."

---

## Draft Generator

**Purpose:** Creates ~275 rookie prospects for the annual draft (224 drafted + 40-60 UDFAs).

**How It Works:**

1. **Round-Based OVR Ranges** - Draft position determines OVR:
   - Round 1: 72-86 OVR (average 78)
   - Round 2: 68-80 OVR (average 74)
   - Round 3: 65-76 OVR (average 70)
   - Rounds 4-7: Decreasing ranges down to 52-64 for Round 7
   - UDFAs: 50-62 OVR (average 55)

2. **Pick Position Modifier** - Earlier picks in each round get boosted:
   - Picks 1-5: +3 to +5 OVR bonus
   - Picks 6-15: +1 to +3 bonus
   - Picks 16-25: No modifier
   - Picks 26-32: -1 to -2 penalty

3. **Potential Labels** - Each prospect gets a ceiling assessment:
   - Star: Can become elite (90+ potential)
   - Starter: Solid NFL career
   - Limited: Likely a backup at best

   Round 1 has 40% Star prospects; Round 7 has only 2%.

4. **Potential Gap** - The difference between current OVR and ceiling:
   - Round 1 picks: 8-18 point gap (high upside)
   - Late round picks: 1-6 point gap (what you see is what you get)

5. **Scouting Noise** - Scouts don't see true OVR:
   - Scouted OVR varies by ±3 from true OVR
   - This creates draft uncertainty and "steals" vs "busts"

6. **Age Distribution** - Most prospects are 21-22:
   - 21 years old: 30%
   - 22 years old: 45%
   - 23 years old: 20%
   - 24 years old: 5%

**Key Insight:** The scouting noise system means you can't trust rankings perfectly. A player scouted at 82 OVR might actually be 79 or 85 - creating realistic draft uncertainty.

---

## GM Generator

**Purpose:** Creates a General Manager for each team with distinct philosophies and skills.

**How It Works:**

1. **Background Selection** - Each GM has a career background (6 types):
   - Scout: Came up through scouting ranks
   - Coach: Former coordinator or position coach
   - Agent: Player representation background
   - Analytics: Data-driven front office
   - Player: Former NFL player
   - Executive: Traditional front office path

2. **Archetype Assignment** - GMs have a management style (6 types):
   - Talent Scout: Prioritizes player evaluation
   - Cap Wizard: Excels at contract management
   - Trade Master: Active in making deals
   - Developer: Focuses on player growth
   - Culture Builder: Creates winning environment
   - Win Now: Aggressive, short-term focus

3. **Synergy Bonus** - When background matches archetype, the GM gets a synergy bonus:
   - Scout background + Talent Scout archetype = bonus
   - Analytics background + Cap Wizard = bonus
   - This makes certain GMs more effective at their specialty

4. **Age and Experience** - GM age ranges 35-68:
   - Higher-rated GMs tend to be older (more experienced)
   - Age affects retirement risk

5. **Contract Generation** - Based on team tier:
   - Elite teams pay more for experienced GMs
   - Rebuilding teams may have cheaper, unproven GMs

**Key Insight:** The background/archetype synergy system means hiring the right GM matters. A team wanting to rebuild through the draft should target a GM with scout background and talent scout archetype.

---

## Coaching Generator

**Purpose:** Creates 4-coach staffs for each team: Head Coach, Offensive Coordinator, Defensive Coordinator, and Special Teams Coordinator.

**How It Works:**

1. **Tier-Based OVR Ranges** - Team quality affects coaching quality:
   - Elite HC: 88-95 OVR | Elite Coordinators: 80-88 OVR
   - Good HC: 82-88 OVR | Good Coordinators: 78-85 OVR
   - Rebuilding HC: 65-75 OVR | Rebuilding Coordinators: 62-72 OVR

2. **Attribute Generation** - Each coach has 10 attributes with ±6 variance from their OVR:
   - Head Coaches: Leadership, Game Management, Clock Management, Challenge Decisions, Motivation, Player Development, Recruiting, Media Relations, Adjustments, Preparation
   - Coordinators: Scheme-specific attributes (Play Calling, Blitz Design, etc.)

3. **Scheme Assignment** - Coaches have offensive/defensive philosophies:
   - Offensive: West Coast, Air Raid, Pro Style, Spread, Power Run
   - Defensive: 4-3, 3-4, Tampa 2, Cover 3, Aggressive

4. **Perk Generation** - Coaches earn perks based on OVR:
   - 95+ OVR: 5-7 total perk tiers
   - 85-89 OVR: 3-4 perk tiers
   - Below 75 OVR: 0-1 perk tiers

   Perks provide bonuses like "Red Zone Specialist" or "Fourth Quarter Coach"

5. **Staff Chemistry** - The system calculates how well coaches work together:
   - Aligned philosophies (same scheme family) boost chemistry
   - Mismatched philosophies reduce team effectiveness
   - HC scheme affects entire staff

**Key Insight:** The scheme system matters for roster building. If your OC runs Air Raid, you need speed receivers; if your DC runs 3-4, you need specific linebacker types.

---

## Scouting Generator

**Purpose:** Creates scouting departments for all 32 teams with directors and scouts.

**How It Works:**

1. **Department Size by Tier** - Better teams have larger scouting staffs:
   - Elite: Director + 2 Area Scouts + Pro Scout (4 total)
   - Good: Director + Area Scout + Pro Scout (3 total)
   - Average: Director + Area Scout (2 total)
   - Below Average/Rebuilding: Director only (1 scout)

2. **Scout Roles** - Four types with different purposes:
   - Director: Oversees department, highest salary
   - Area Scout: Covers college regions, finds draft talent
   - Pro Scout: Evaluates other team's rosters, finds trade/FA targets
   - National Scout: Elite teams only, covers entire country

3. **Expertise** - Each scout has specializations:
   - Position Expertise: Offensive, Defensive, Special Teams, or Generalist
   - Regional Expertise: East Coast, West Coast, Midwest, South, or National

   Directors and Pro Scouts tend to be "National" coverage.

4. **Attributes & Perks** - Six core attributes:
   - Talent Evaluation: How well they assess current ability
   - Potential Assessment: How well they project development
   - Trait Recognition: Spotting personality traits
   - Bust Detection: Identifying red flags
   - Sleeper Discovery: Finding late-round gems
   - Work Ethic: How many scouting points they generate weekly

5. **Weekly Points** - Scouts generate scouting points based on work ethic:
   - Points are spent to scout draft prospects
   - Better scouts generate more points per week
   - This creates resource management decisions

**Key Insight:** The scouting system creates real tradeoffs. A team with a small department can't scout every prospect thoroughly - they must prioritize.

---

## Facilities Generator

**Purpose:** Creates stadium and training facilities for each team.

**How It Works:**

1. **Four Facility Types:**
   - Stadium: Affects home field advantage and revenue
   - Practice Facility: Affects all training XP gains
   - Training Room: Affects injury prevention and recovery
   - Weight Room: Affects physical attribute development

2. **Owner Tier System** - Owners fall into 5 wealth categories:
   - Wealthy: Rating 8-10, high upgrade budget
   - Solid: Rating 6-9, good budget
   - Moderate: Rating 4-8, average budget
   - Budget: Rating 3-7, limited funds
   - Cheap: Rating 2-5, minimal investment

3. **Rating Effects** - Each facility rating (1-10) provides bonuses:

   **Training Room:**
   - 10-star: +30% XP bonus
   - 5-star: +8% XP bonus
   - 1-2 star: No bonus

   **Weight Room:**
   - 10-star: +40% physical attribute XP
   - 5-star: +15% physical XP

   **Practice Facility:**
   - 10-star: +30% practice XP
   - 5-star: +8% practice XP

   **Stadium:**
   - Higher ratings increase home field advantage
   - Also affects ticket revenue

4. **Upgrade System** - Teams have upgrade budgets based on owner tier:
   - Wealthy owners provide $20-30M annually
   - Cheap owners provide only $3-8M
   - Upgrades take time and money to complete

**Key Insight:** Facilities compound over time. A team with 10-star training facilities develops players 30% faster - over several seasons, this creates a significant talent advantage.

---

## Schedule Generator

**Purpose:** Creates the 18-week regular season schedule for all 32 teams.

**How It Works:**

1. **Game Type Requirements** - Each team plays 17 games:
   - 6 Division games (2 vs each rival)
   - 4 Conference games (rotating same-conference division)
   - 4 Inter-Conference games (rotating opposite-conference division)
   - 3 Rotating games (same-place finishers from other divisions)

2. **Division Rotation** - Conference matchups follow a set rotation:
   - Atlantic North plays Atlantic South
   - Atlantic South plays Atlantic East
   - And so on...

   Inter-conference follows geographic pairing (Atlantic North vs Pacific North).

3. **Bye Week Assignment** - Teams get byes during weeks 5-14:
   - Distributed to have ~3-4 teams off each bye week
   - No byes in weeks 1-4 or 15-18

4. **Game Distribution** - The system assigns games to weeks:
   - Ensures no team plays twice in one week
   - Respects bye weeks
   - Tries to balance early/late season difficulty

5. **Prime Time Selection** - Best games get prime time slots:
   - Thursday Night: Weeks 2-17
   - Sunday Night: All weeks
   - Monday Night: Weeks 1-17

   Selection based on market size (NYE, LAL, CHI, DAL are top markets) and rivalry factor (division games get priority).

6. **Time Slot Assignment** - Remaining games split between:
   - Early Sunday (1:00 PM): ~60% of Sunday games
   - Late Sunday (4:25 PM): ~40% of Sunday games

**Key Insight:** The schedule generator respects real NFL structure. Division games are weighted toward late season, and big market teams get more prime time exposure.

---

## League Generator (Orchestrator)

**Purpose:** Coordinates all generators to create a complete league in the correct order.

**How It Works:**

1. **Generation Order** - Modules must be generated in sequence:
   ```
   1. Rosters (creates team tiers, needed by everything else)
   2. Free Agents (standalone player pool)
   3. Draft Class (standalone prospect pool)
   4. GMs (uses team tiers)
   5. Coaching (uses team tiers)
   6. Facilities (uses team tiers)
   7. Scouting (uses team tiers)    [4-7 run in parallel]
   8. Schedule (standalone)
   ```

2. **Parallel Execution** - Steps 4-7 (GMs, Coaching, Facilities, Scouting) can run simultaneously since they all depend only on team tiers, not each other.

3. **Progress Callbacks** - The generator reports progress for UI updates:
   - Each step has status: pending, loading, complete, error
   - Callbacks fire when steps change state

4. **Error Handling** - If a step fails:
   - The generator continues with other steps if possible
   - Individual failures are reported via callbacks
   - Critical failures (rosters) abort the entire process

5. **Data Storage** - Each generated module is stored separately:
   - Rosters → storeFullGameData + storeDevPlayers
   - Free Agents → storeFreeAgents
   - Draft Class → storeDraftClass
   - GMs → storeOwnerModeGMs
   - Coaching → storeCoaching
   - Facilities → storeFacilities
   - Scouting → storeScouting
   - Schedule → storeSchedule

**Key Insight:** The league generator is the "single source of truth" for creating new leagues. Both the new game flow and dev tools use this same function.

---

## Full Game Generator

**Purpose:** Simpler alternative that generates rosters, free agents, and draft class together without API calls.

**How It Works:**

1. **Direct Generation** - Unlike the League Generator (which uses APIs), this generates data directly in memory:
   - Calls generateAllTeamRosters()
   - Calls generateFAPool()
   - Calls generateDraftClass()

2. **Tier Distribution** - Assigns team quality tiers:
   - 3 Elite teams
   - 8 Good teams
   - 12 Average teams
   - 6 Below Average teams
   - 3 Rebuilding teams

3. **Return Value** - Returns a combined object with:
   - All 32 team rosters
   - 175 free agents
   - ~275 draft prospects
   - Total player count and generation timestamp

**Key Insight:** This generator is useful for testing or scenarios where you need player data without the full staff/facilities infrastructure.

---

## Summary

| Generator | Input | Output | Depends On |
|-----------|-------|--------|------------|
| Player | Position, OVR, Age | Single Player | None |
| Roster | Team ID, Tier | 53-man roster | Player |
| Free Agent | Pool size | 150-200 players | Player |
| Draft | None | ~275 prospects | Player |
| GM | Team tiers | 32 GMs | Roster (tiers) |
| Coaching | Team tiers | 128 coaches | Roster (tiers) |
| Scouting | Team tiers | 32 departments | Roster (tiers) |
| Facilities | Team tiers | 128 facilities | Roster (tiers) |
| Schedule | Season year | 272 games | None |
| League | None | Everything | All above |
| Full Game | None | Players only | Player, Roster, FA, Draft |
