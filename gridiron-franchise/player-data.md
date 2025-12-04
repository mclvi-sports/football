# Player Data Reference

Complete inventory of all player fields, attributes, traits, badges, and archetypes.

---

## Player Interface (Core Structure)

```typescript
interface Player {
  // Identity
  id: string;
  firstName: string;
  lastName: string;

  // Bio
  position: Position;
  archetype: Archetype;
  age: number;              // 21-36+
  experience: number;       // 0-15+ years
  height: number;           // inches
  weight: number;           // lbs
  fortyTime: number;        // 40-yard dash (seconds)
  college: string;
  jerseyNumber: number;     // 1-99

  // Ratings
  overall: number;          // 40-99
  potential: number;        // 0-99
  attributes: PlayerAttributes;
  traits: string[];         // 0-5 trait IDs
  badges: PlayerBadge[];    // badges with tiers

  // Contract
  contract?: {
    years: number;
    salary: number;         // millions
  };

  // Training/XP
  currentXP?: number;
  totalXPEarned?: number;
  seasonXP?: number;
}
```

---

## Positions (18)

| Position | Code | Category |
|----------|------|----------|
| Quarterback | QB | Offense |
| Running Back | RB | Offense |
| Wide Receiver | WR | Offense |
| Tight End | TE | Offense |
| Left Tackle | LT | O-Line |
| Left Guard | LG | O-Line |
| Center | C | O-Line |
| Right Guard | RG | O-Line |
| Right Tackle | RT | O-Line |
| Defensive End | DE | D-Line |
| Defensive Tackle | DT | D-Line |
| Middle Linebacker | MLB | Linebacker |
| Outside Linebacker | OLB | Linebacker |
| Cornerback | CB | Secondary |
| Free Safety | FS | Secondary |
| Strong Safety | SS | Secondary |
| Kicker | K | Special Teams |
| Punter | P | Special Teams |

---

## Attributes (34 Total)

### Physical (7)
| Code | Name | Range |
|------|------|-------|
| SPD | Speed | 1-99 |
| ACC | Acceleration | 1-99 |
| AGI | Agility | 1-99 |
| STR | Strength | 1-99 |
| JMP | Jumping | 1-99 |
| STA | Stamina | 1-99 |
| INJ | Injury | 1-99 |

### Mental (2)
| Code | Name | Range |
|------|------|-------|
| AWR | Awareness | 1-99 |
| PRC | Play Recognition | 1-99 |

### Passing (8) - QB
| Code | Name | Range |
|------|------|-------|
| THP | Throw Power | 1-99 |
| SAC | Short Accuracy | 1-99 |
| MAC | Medium Accuracy | 1-99 |
| DAC | Deep Accuracy | 1-99 |
| TUP | Throw Under Pressure | 1-99 |
| TOR | Throw on Run | 1-99 |
| PAC | Play Action | 1-99 |
| BSK | Break Sack | 1-99 |

### Rushing (8) - RB/WR
| Code | Name | Range |
|------|------|-------|
| CAR | Carrying | 1-99 |
| BTK | Break Tackle | 1-99 |
| TRK | Trucking | 1-99 |
| ELU | Elusiveness | 1-99 |
| SPM | Spin Move | 1-99 |
| JKM | Juke Move | 1-99 |
| SFA | Stiff Arm | 1-99 |
| VIS | Vision | 1-99 |

### Receiving (9) - WR/RB/TE
| Code | Name | Range |
|------|------|-------|
| CTH | Catching | 1-99 |
| CIT | Catch In Traffic | 1-99 |
| SPC | Spectacular Catch | 1-99 |
| RTE | Route Running | 1-99 |
| REL | Release | 1-99 |
| RAC | Run After Catch | 1-99 |
| SRR | Short Route Running | 1-99 |
| MRR | Medium Route Running | 1-99 |
| DRR | Deep Route Running | 1-99 |

### Blocking (8) - OL/RB/TE
| Code | Name | Range |
|------|------|-------|
| PBK | Pass Block | 1-99 |
| RBK | Run Block | 1-99 |
| IBL | Impact Block | 1-99 |
| PBP | Pass Block Power | 1-99 |
| PBF | Pass Block Finesse | 1-99 |
| RBP | Run Block Power | 1-99 |
| RBF | Run Block Finesse | 1-99 |
| LBK | Lead Block | 1-99 |

### Defense (9) - DL/LB/DB
| Code | Name | Range |
|------|------|-------|
| TAK | Tackling | 1-99 |
| POW | Hit Power | 1-99 |
| PMV | Power Moves | 1-99 |
| FMV | Finesse Moves | 1-99 |
| BSH | Block Shedding | 1-99 |
| PUR | Pursuit | 1-99 |
| MCV | Man Coverage | 1-99 |
| ZCV | Zone Coverage | 1-99 |
| PRS | Press | 1-99 |

### Special Teams (8) - K/P
| Code | Name | Range |
|------|------|-------|
| KPW | Kick Power | 1-99 |
| KAC | Kick Accuracy | 1-99 |
| KOP | Kickoff Power | 1-99 |
| PPW | Punt Power | 1-99 |
| PUA | Punt Accuracy | 1-99 |
| CLU | Clutch | 1-99 |
| CON | Consistency | 1-99 |
| RET | Return | 1-99 |

---

## Traits (46 Total)

Rarity: common, uncommon, rare, very_rare

### Leadership & Locker Room (6)
| ID | Name | Rarity |
|----|------|--------|
| vocal_leader | Vocal Leader | uncommon |
| veteran_mentor | Veteran Mentor | rare |
| team_first | Team First | uncommon |
| diva | Diva | rare |
| quiet | Quiet | common |
| locker_room_cancer | Locker Room Cancer | very_rare |

### Work Ethic & Development (7)
| ID | Name | Rarity |
|----|------|--------|
| gym_rat | Gym Rat | uncommon |
| film_junkie | Film Junkie | uncommon |
| focused | Focused | uncommon |
| lazy | Lazy | rare |
| early_bloomer | Early Bloomer | uncommon |
| late_bloomer | Late Bloomer | uncommon |
| winners_mentality | Winner's Mentality | uncommon |

### On-Field Mentality (7)
| ID | Name | Rarity |
|----|------|--------|
| hot_head | Hot Head | rare |
| cool_under_pressure | Cool Under Pressure | rare |
| showboat | Showboat | uncommon |
| business_like | Business-Like | common |
| aggressive | Aggressive | common |
| conservative | Conservative | common |
| trash_talker | Trash Talker | uncommon |

### Durability & Health (7)
| ID | Name | Rarity |
|----|------|--------|
| iron_man | Iron Man | rare |
| injury_prone | Injury Prone | uncommon |
| slow_healer | Slow Healer | uncommon |
| fast_healer | Fast Healer | uncommon |
| plays_through_pain | Plays Through Pain | uncommon |
| durable | Durable | common |
| fragile | Fragile | uncommon |

### Contract & Loyalty (6)
| ID | Name | Rarity |
|----|------|--------|
| money_motivated | Money Motivated | common |
| ring_chaser | Ring Chaser | uncommon |
| loyal | Loyal | uncommon |
| mercenary | Mercenary | common |
| team_player_contract | Team Player Contract | uncommon |
| holdout_risk | Holdout Risk | rare |

### Clutch & Pressure (6)
| ID | Name | Rarity |
|----|------|--------|
| ice_in_veins | Ice In Veins | rare |
| chokes_under_pressure | Chokes Under Pressure | rare |
| prime_time_player | Prime Time Player | uncommon |
| stage_fright | Stage Fright | rare |
| comeback_artist | Comeback Artist | rare |
| closer | Closer | uncommon |

### Character & Discipline (7)
| ID | Name | Rarity |
|----|------|--------|
| high_character | High Character | common |
| character_concerns | Character Concerns | rare |
| disciplined | Disciplined | common |
| undisciplined | Undisciplined | uncommon |
| high_football_iq | High Football IQ | uncommon |
| low_football_iq | Low Football IQ | rare |
| football_genius | Football Genius | very_rare |

---

## Badges (45 Total)

Tiers: bronze (2-5 boost), silver (4-8), gold (6-12), hof (9-15)

### Universal (12)
| ID | Name | Condition |
|----|------|-----------|
| clutch | Clutch | Final 2 min of half/game, OT |
| prime_time | Prime Time | Nationally televised |
| playoff_performer | Playoff Performer | Playoffs only |
| home_field_hero | Home Field Hero | Home games |
| road_warrior | Road Warrior | Away games |
| weather_proof | Weather Proof | Rain, snow, wind |
| fourth_quarter_closer | 4th Quarter Closer | 4Q when winning |
| comeback_kid | Comeback Kid | 4Q when losing |
| division_rival_killer | Division Rival Killer | Division games |
| big_game_player | Big Game Player | Playoff implications |
| underdog_mentality | Underdog Mentality | Team is underdog |
| giant_slayer | Giant Slayer | vs 85+ OVR opponent |

### QB (4)
| ID | Name | Condition |
|----|------|-----------|
| red_zone_qb | Red Zone QB | Inside opp 20 |
| deep_ball_threat_qb | Deep Ball Threat | 30+ yard passes |
| no_huddle_specialist | No Huddle Specialist | Up-tempo offense |
| pocket_presence | Pocket Presence | Under pressure |

### RB (4)
| ID | Name | Condition |
|----|------|-----------|
| red_zone_back | Red Zone Back | Inside opp 20 |
| goal_line_back | Goal Line Back | Inside opp 5 |
| open_field_runner | Open Field Runner | Clear lane |
| third_down_back | 3rd Down Back | 3rd downs |

### WR (4)
| ID | Name | Condition |
|----|------|-----------|
| red_zone_threat_wr | Red Zone Threat | Inside opp 20 |
| deep_threat_wr | Deep Threat | 30+ yard routes |
| possession_receiver | Possession Receiver | Contested catches |
| slot_specialist_badge | Slot Specialist | Slot alignment |

### TE (3)
| ID | Name | Condition |
|----|------|-----------|
| red_zone_weapon | Red Zone Weapon | Inside opp 20 |
| seam_router | Seam Router | 15-25 yard routes |
| run_blocking_te | Run Blocking TE | Run plays |

### OL (4)
| ID | Name | Condition |
|----|------|-----------|
| pass_protector_badge | Pass Protector | Pass plays |
| road_grader_badge | Road Grader | Run plays |
| pulling_guard | Pulling Guard | Pull plays (LG/RG) |
| short_yardage_specialist | Short Yardage | 3rd/4th & 2 or less |

### DL (3)
| ID | Name | Condition |
|----|------|-----------|
| pass_rush_elite | Pass Rush Elite | Pass rush |
| run_stuffer_badge | Run Stuffer | Run defense |
| third_down_rusher | 3rd Down Rusher | 3rd down pass rush |

### LB (3)
| ID | Name | Condition |
|----|------|-----------|
| coverage_lb_badge | Coverage LB | Pass coverage |
| blitz_specialist | Blitz Specialist | Blitzing |
| run_stopper_badge | Run Stopper | Run defense |

### DB (4)
| ID | Name | Condition |
|----|------|-----------|
| lockdown_corner | Lockdown Corner | Man coverage |
| ball_hawk_badge | Ball Hawk | Ball in air |
| zone_defender | Zone Defender | Zone coverage |
| run_support | Run Support | Run defense |

### K (3)
| ID | Name | Condition |
|----|------|-----------|
| ice_in_veins_k | Ice In Veins | Game-winning kicks |
| long_range_sniper | Long Range Sniper | 50+ yard FGs |
| short_range_specialist | Short Range | Inside 40 FGs |

### P (2)
| ID | Name | Condition |
|----|------|-----------|
| coffin_corner | Coffin Corner | Punts inside 20 |
| big_leg | Big Leg | All punts |

---

## Archetypes (70 Total)

Each archetype defines primary/secondary/tertiary attribute priorities.

### QB (6)
- Pocket Passer (25%)
- Dual-Threat (20%)
- Gunslinger (15%)
- Field General (10%)
- Scrambler (15%)
- Game Manager (15%)

### RB (6)
- Power Back (20%)
- Speed Back (20%)
- Elusive Back (20%)
- All-Purpose (15%)
- Receiving Back (15%)
- Bruiser (10%)

### WR (6)
- Deep Threat (20%)
- Possession (20%)
- Route Technician (15%)
- Playmaker (15%)
- Red Zone Threat (15%)
- Slot Specialist (15%)

### TE (6)
- Receiving TE (25%)
- Blocking TE (20%)
- Hybrid TE (20%)
- Seam Stretcher (15%)
- Move TE (10%)
- H-Back (10%)

### OL (6) - LT/LG/C/RG/RT
- Pass Protector (25%)
- Road Grader (20%)
- Technician (20%)
- Mauler (15%)
- Athletic OL (10%)
- Balanced OL (10%)

### DE (6)
- Speed Rusher (25%)
- Power Rusher (20%)
- Complete (15%)
- Run Stuffer (15%)
- Hybrid DE (15%)
- Raw Athlete (10%)

### DT (6)
- Nose Tackle (25%)
- Interior Rusher (20%)
- Run Plugger (20%)
- 3-Tech (15%)
- Hybrid DT (10%)
- Athletic DT (10%)

### LB (6) - MLB/OLB
- Run Stopper (20%)
- Coverage LB (20%)
- Pass Rusher LB (15%)
- Field General LB (15%)
- Hybrid LB (15%)
- Athletic LB (15%)

### CB (6)
- Man Cover (25%)
- Zone Cover (20%)
- Ball Hawk CB (15%)
- Physical (15%)
- Slot Corner (15%)
- Hybrid CB (10%)

### S (6) - FS/SS
- Free Safety (25%)
- Strong Safety (20%)
- Hybrid S (20%)
- Ball Hawk S (15%)
- Enforcer (10%)
- Coverage S (10%)

### K (5)
- Accurate K (30%)
- Power K (25%)
- Clutch K (20%)
- Balanced K (15%)
- Kickoff Specialist (10%)

### P (5)
- Accurate P (30%)
- Power P (25%)
- Directional (20%)
- Balanced P (15%)
- Hangtime (10%)

---

## Physical Measurables

### Height Ranges (inches)
| Position | Min | Max |
|----------|-----|-----|
| QB | 70 | 78 |
| RB | 68 | 74 |
| WR | 68 | 77 |
| TE | 73 | 79 |
| OL | 73 | 80 |
| DE | 74 | 78 |
| DT | 72 | 77 |
| LB | 72 | 76 |
| CB | 69 | 75 |
| FS | 71 | 74 |
| SS | 72 | 75 |
| K | 69 | 76 |
| P | 71 | 77 |

### Weight Ranges (lbs)
| Position | Min | Max |
|----------|-----|-----|
| QB | 195 | 245 |
| RB | 185 | 250 |
| WR | 175 | 235 |
| TE | 235 | 275 |
| OL | 295 | 340 |
| DE | 250 | 300 |
| DT | 280 | 350 |
| LB | 230 | 255 |
| CB | 175 | 215 |
| FS | 195 | 215 |
| SS | 205 | 225 |
| K | 175 | 225 |
| P | 190 | 235 |

### 40-Yard Dash (seconds)
| Position | Fast | Slow |
|----------|------|------|
| QB | 4.35 | 5.10 |
| RB | 4.30 | 4.75 |
| WR | 4.28 | 4.65 |
| TE | 4.50 | 4.95 |
| OL | 5.00 | 5.40 |
| DE | 4.50 | 5.00 |
| DT | 4.75 | 5.45 |
| LB | 4.50 | 4.80 |
| CB | 4.35 | 4.60 |
| FS | 4.40 | 4.55 |
| SS | 4.45 | 4.60 |

---

## Bio Fields

| Field | Source |
|-------|--------|
| firstName | name-pools.csv |
| lastName | name-pools.csv |
| college | 20 schools (Alabama, Ohio State, Georgia, etc.) |
| jerseyNumber | Position-specific ranges |

### Jersey Number Ranges
| Position | Primary | Secondary |
|----------|---------|-----------|
| QB, K, P | 1-19 | - |
| RB | 20-49 | 1-9 |
| WR | 10-19 | 80-89 |
| TE | 80-89 | 40-49 |
| LT, RT | 70-79 | 60-69 |
| LG, RG | 60-69 | 70-79 |
| C | 50-59 | 60-69 |
| DE | 90-99 | 50-59 |
| DT | 90-99 | 70-79 |
| MLB | 50-59 | 40-49 |
| OLB | 40-59 | 90-99 |
| CB, FS, SS | 20-39 | 40-49 |

---

## Summary

| Category | Count |
|----------|-------|
| Positions | 18 |
| Attributes | 34 |
| Traits | 46 |
| Badges | 45 |
| Archetypes | 70 |
| Physical Measurables | 3 |
| Bio Fields | 4 |
