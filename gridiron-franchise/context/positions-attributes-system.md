# Football Franchise Mobile Game - Positions & Attributes System

## Overview
All players have **Shared Attributes** (universal to all positions) and **Position-Specific Attributes** (unique to their role).

---

## SHARED ATTRIBUTES (All Positions)

### Physical Attributes
- **Speed (SPD)** - Top running speed (0-99)
- **Acceleration (ACC)** - How quickly reaches top speed (0-99)
- **Agility (AGI)** - Change of direction ability (0-99)
- **Strength (STR)** - Physical power (0-99)
- **Stamina (STA)** - Endurance/fatigue resistance (0-99)
- **Injury (INJ)** - Durability/injury resistance (0-99)
- **Jumping (JMP)** - Vertical leap ability (0-99)

### Mental Attributes
- **Awareness (AWR)** - Football IQ, reading plays (0-99)
- **Play Recognition (PRC)** - Identifying opponent's play (0-99)

### Intangibles
- **Clutch (CLU)** - Performance in pressure situations (0-99)
- **Consistency (CON)** - Game-to-game reliability (0-99)
- **Toughness (TGH)** - Playing through pain (0-99)

---

## POSITION-SPECIFIC ATTRIBUTES

### QUARTERBACK (QB)

**Passing Attributes:**
- **Throw Power (THP)** - Distance/velocity of throws (0-99)
- **Short Accuracy (SAC)** - Accuracy on passes 0-15 yards (0-99)
- **Medium Accuracy (MAC)** - Accuracy on passes 16-30 yards (0-99)
- **Deep Accuracy (DAC)** - Accuracy on passes 31+ yards (0-99)
- **Throw on Run (TOR)** - Accuracy while moving (0-99)
- **Throw Under Pressure (TUP)** - Accuracy with pass rush (0-99)

**Mobility Attributes:**
- **Break Sacks (BSK)** - Escape tackle attempts in pocket (0-99)

---

### RUNNING BACK (RB)

**Rushing Attributes:**
- **Carrying (CAR)** - Ball security/fumble avoidance (0-99)
- **Break Tackle (BTK)** - Shake off defenders (0-99)
- **Trucking (TRK)** - Run through defenders (0-99)
- **Elusiveness (ELU)** - Avoid contact with agility (0-99)
- **Juke Move (JKM)** - Effectiveness of juke moves (0-99)
- **Spin Move (SPM)** - Effectiveness of spin moves (0-99)
- **Stiff Arm (SFA)** - Push away defenders (0-99)
- **Vision (VIS)** - See holes and running lanes (0-99)

**Receiving Attributes:**
- **Catching (CTH)** - Catch ability (0-99)
- **Route Running (RTE)** - Quality of routes (0-99)

**Blocking Attributes:**
- **Pass Blocking (PBK)** - Protect QB in pass protection (0-99)

---

### WIDE RECEIVER (WR)

**Receiving Attributes:**
- **Catching (CTH)** - Basic catch ability (0-99)
- **Catch in Traffic (CIT)** - Catch with defenders nearby (0-99)
- **Spectacular Catch (SPC)** - Make highlight-reel catches (0-99)
- **Release (REL)** - Beat press coverage at line (0-99)
- **Short Route Running (SRR)** - Route quality 0-15 yards (0-99)
- **Medium Route Running (MRR)** - Route quality 16-30 yards (0-99)
- **Deep Route Running (DRR)** - Route quality 31+ yards (0-99)

**After Catch:**
- **Run After Catch (RAC)** - YAC ability (0-99)

---

### TIGHT END (TE)

**Receiving Attributes:**
- **Catching (CTH)** - Catch ability (0-99)
- **Catch in Traffic (CIT)** - Catch with defenders nearby (0-99)
- **Release (REL)** - Beat press coverage (0-99)
- **Route Running (RTE)** - Quality of routes (0-99)

**Blocking Attributes:**
- **Run Blocking (RBK)** - Block for run plays (0-99)
- **Pass Blocking (PBK)** - Block for pass plays (0-99)

---

### OFFENSIVE LINE (OL)
*Positions: Left Tackle (LT), Left Guard (LG), Center (C), Right Guard (RG), Right Tackle (RT)*

**Blocking Attributes:**
- **Pass Blocking (PBK)** - Protect QB (0-99)
- **Pass Block Power (PBP)** - Strength in pass pro (0-99)
- **Pass Block Finesse (PBF)** - Technique in pass pro (0-99)
- **Run Blocking (RBK)** - Create holes for RB (0-99)
- **Run Block Power (RBP)** - Strength in run blocking (0-99)
- **Run Block Finesse (RBF)** - Technique in run blocking (0-99)
- **Impact Blocking (IBL)** - Pancake blocks (0-99)
- **Lead Block (LBK)** - Block on pulling plays (0-99)

---

### DEFENSIVE LINE (DL)
*Positions: Defensive End (DE), Defensive Tackle (DT)*

**Pass Rush Attributes:**
- **Power Moves (PMV)** - Bull rush, strength moves (0-99)
- **Finesse Moves (FMV)** - Spin, swim, rip moves (0-99)

**Run Defense Attributes:**
- **Block Shedding (BSH)** - Shed blocks (0-99)

**General Defense:**
- **Pursuit (PUR)** - Chase down ball carrier (0-99)
- **Tackling (TAK)** - Wrap up and bring down (0-99)

---

### LINEBACKER (LB)
*Positions: Outside Linebacker (OLB), Middle Linebacker (MLB)*

**Coverage Attributes:**
- **Man Coverage (MCV)** - Cover receivers man-to-man (0-99)
- **Zone Coverage (ZCV)** - Cover zone assignments (0-99)

**Run Defense Attributes:**
- **Block Shedding (BSH)** - Shed blocks (0-99)
- **Pursuit (PUR)** - Chase ball carrier (0-99)
- **Tackling (TAK)** - Make tackles (0-99)

**Pass Rush Attributes:**
- **Power Moves (PMV)** - Bull rush moves (0-99)
- **Finesse Moves (FMV)** - Speed/technique moves (0-99)

---

### DEFENSIVE BACK (DB)
*Positions: Cornerback (CB), Safety (S) - Free Safety (FS), Strong Safety (SS)*

**Coverage Attributes:**
- **Man Coverage (MCV)** - Cover receivers man-to-man (0-99)
- **Zone Coverage (ZCV)** - Cover zone assignments (0-99)
- **Press Coverage (PRS)** - Jam receivers at line (0-99)

**Ball Skills:**
- **Catching (CTH)** - Intercept passes (0-99)

**Run Support:**
- **Pursuit (PUR)** - Chase ball carrier (0-99)
- **Tackling (TAK)** - Make tackles (0-99)
- **Hit Power (POW)** - Deliver big hits (0-99)

---

### KICKER (K)

**Kicking Attributes:**
- **Kick Power (KPW)** - Distance on field goals (0-99)
- **Kick Accuracy (KAC)** - Accuracy on field goals (0-99)
- **Kickoff Power (KOP)** - Distance on kickoffs (0-99)

---

### PUNTER (P)

**Punting Attributes:**
- **Punt Power (PPW)** - Distance on punts (0-99)
- **Punt Accuracy (PAC)** - Placement/coffin corner ability (0-99)

---

## ATTRIBUTE RATING SCALE

### Overall Rating Tiers
- **99-95:** Elite/Superstar
- **94-90:** Star
- **89-85:** Above Average
- **84-80:** Starter Quality
- **79-75:** Average Starter
- **74-70:** Backup Quality
- **69-65:** Depth/Special Teams
- **64-60:** Practice Squad
- **59-0:** Undrafted Free Agent

### Individual Attribute Tiers
- **99-90:** Elite
- **89-80:** Great
- **79-70:** Good
- **69-60:** Average
- **59-50:** Below Average
- **49-0:** Poor

---

## ATTRIBUTE WEIGHTS BY POSITION

### How Attributes Impact Overall Rating

**Quarterback:**
- Throw Accuracy (30%)
- Throw Power (15%)
- Awareness (15%)
- Speed/Mobility (10%)
- Other attributes (30%)

**Running Back:**
- Speed/Acceleration (25%)
- Elusiveness/Agility (20%)
- Carrying/Ball Security (15%)
- Break Tackle/Trucking (15%)
- Other attributes (25%)

**Wide Receiver:**
- Speed/Acceleration (20%)
- Catching (20%)
- Route Running (20%)
- Catch in Traffic (15%)
- Other attributes (25%)

**Tight End:**
- Catching (20%)
- Blocking (25%)
- Route Running (15%)
- Speed (10%)
- Other attributes (30%)

**Offensive Line:**
- Pass Blocking (30%)
- Run Blocking (30%)
- Strength (15%)
- Awareness (10%)
- Other attributes (15%)

**Defensive Line:**
- Pass Rush (25%)
- Run Defense (25%)
- Strength (15%)
- Block Shedding (15%)
- Other attributes (20%)

**Linebacker:**
- Tackling (20%)
- Coverage (20%)
- Pursuit (15%)
- Awareness (15%)
- Other attributes (30%)

**Defensive Back:**
- Coverage (35%)
- Speed (20%)
- Ball Skills (15%)
- Awareness (10%)
- Other attributes (20%)

**Kicker:**
- Kick Accuracy (50%)
- Kick Power (30%)
- Clutch (10%)
- Other attributes (10%)

**Punter:**
- Punt Accuracy (50%)
- Punt Power (30%)
- Consistency (10%)
- Other attributes (10%)

---

## DEVELOPMENT ARCHETYPES

### Development Traits (Affects Progression Speed)
- **Superstar (X-Factor):** Fastest progression, highest ceiling (95+ potential)
- **Star:** Fast progression, high ceiling (90-94 potential)
- **Normal:** Average progression, medium ceiling (80-89 potential)
- **Slow:** Slower progression, lower ceiling (75-79 potential)

### Age Curves by Position Group
**Early Peak (23-26):**
- RB, WR, CB, S

**Mid Peak (25-28):**
- QB, LB, DE, DT

**Late Peak (27-30):**
- OL, TE

**Decline Rates:**
- Fast Decline: RB, CB (age 28+)
- Medium Decline: WR, LB, S (age 29+)
- Slow Decline: QB, OL, TE (age 31+)

---

## NOTES

### Attribute Progression
- Players gain XP from games and practice
- XP converts to attribute increases
- Development trait affects XP multiplier
- Age affects progression (young = faster, old = regression)

### Attribute Caps
- No single attribute can exceed 99
- Overall rating calculated from weighted attributes
- Hidden "potential" rating determines ceiling

### Special Abilities/Badges (Future)
- Elite attributes (95+) could unlock special animations
- Example: 95+ Speed = "Speedster" badge
- Example: 95+ Hit Power = "Enforcer" badge

---

**Status:** Position & Attributes System Complete
**Next Steps:** Balance attribute weights, create player generator algorithm
**Version:** 1.0
**Date:** November 19, 2025
