# Scout Data Reference

Complete inventory of all scout fields, attributes, perks, and scouting system.

---

## Scout Interface

```typescript
interface Scout {
  id: string;
  firstName: string;
  lastName: string;
  role: ScoutRole;
  age: number;
  experience: number;           // Years as scout
  ovr: number;                  // 60-99
  attributes: ScoutAttributes;
  positionExpertise: PositionExpertise;
  regionalExpertise: RegionalExpertise;
  perks: Perk[];
  contract: ScoutContract;
  xp: number;
  weeklyPoints: number;         // From work ethic
  retirementRisk: number;       // 0-100%
}
```

---

## Roles (4)

| Role | Description | Per Team |
|------|-------------|----------|
| director | Lead all scouting | 1 |
| area | Cover college region | 0-2 |
| pro | Evaluate FA/trades | 0-1 |
| national | Generalist coverage | 0-1 |

---

## Position Expertise (4)

| Expertise | Positions | Bonus | Penalty |
|-----------|-----------|-------|---------|
| offensive | QB, RB, WR, TE, OL | +10 offense | -5 defense |
| defensive | DL, LB, DB | +10 defense | -5 offense |
| special_teams | K, P | +15 specialists | -5 others |
| generalist | All | None | None |

---

## Regional Expertise (5)

| Region | Conferences | Bonus |
|--------|-------------|-------|
| east_coast | ACC, Big Ten (E), SEC (E) | +10 region, +5% sleeper |
| west_coast | Pac-12, Mountain West, Big 12 (W) | +10 region, +5% sleeper |
| midwest | Big Ten (W), Big 12 (C) | +10 region, +5% sleeper |
| south | SEC (W), ACC (S), C-USA | +10 region, +5% sleeper |
| national | All regions | None |

---

## Attributes (6)

| Attribute | Range | Description |
|-----------|-------|-------------|
| talentEvaluation | 60-99 | OVR assessment accuracy |
| potentialAssessment | 60-99 | Projecting player ceiling |
| traitRecognition | 60-99 | Identifying player traits |
| bustDetection | 60-99 | Spotting underperformers |
| sleeperDiscovery | 60-99 | Finding hidden talent |
| workEthic | 60-99 | Coverage thoroughness |

---

## Perks (21 Total)

### Tier 1 (1000 XP)

| ID | Name | Effect |
|----|------|--------|
| sharp_eye | Sharp Eye | +5 Talent Evaluation |
| data_analyst | Data Analyst | +5 Potential Assessment |
| trait_hunter | Trait Hunter | +5 Trait Recognition, +1 trait revealed |
| red_flag_detector | Red Flag Detector | +5 Bust Detection |
| diamond_finder | Diamond Finder | +5 Sleeper Discovery, +1 hidden gem |
| college_connections | College Connections | +10 at 5 chosen schools |
| raw_talent_spotter | Raw Talent Spotter | +10 physical, -5 mental |
| cerebral_scout | Cerebral Scout | +10 mental, -5 physical |
| speed_scout | Speed Scout | See exact Speed rating |

### Tier 2 (3000 XP)

| ID | Name | Requires | Effect |
|----|------|----------|--------|
| elite_evaluator | Elite Evaluator | sharp_eye | +10 Talent, ±2 OVR accuracy |
| future_sight | Future Sight | data_analyst | +10 Potential, see range ±3 |
| mind_reader | Mind Reader | trait_hunter | +10 Trait, reveal all major traits |
| bust_buster | Bust Buster | red_flag_detector | +10 Bust, 75% accuracy |
| hidden_gem_expert | Hidden Gem Expert | diamond_finder | +10 Sleeper, 3-4/draft |
| pro_scout_expert | Pro Scout Expert | - | +15 FA evaluation |
| durability_expert | Durability Expert | - | +15 injury rating eval |

### Tier 3 (7000 XP)

| ID | Name | Requires | Effect |
|----|------|----------|--------|
| perfect_scout | Perfect Scout | elite_evaluator | +15 Talent, exact OVR |
| oracle | Oracle | future_sight | +15 Potential, exact ceiling |
| psychologist | Psychologist | mind_reader | +15 Trait, ALL revealed |
| bust_proof | Bust Proof | bust_buster | +15 Bust, 90%+ accuracy |
| treasure_hunter | Treasure Hunter | hidden_gem_expert | +15 Sleeper, 5+/draft |

---

## Contracts

```typescript
interface ScoutContract {
  salary: number;               // Millions/year
  yearsTotal: number;
  yearsRemaining: number;
}
```

### Salary Ranges (millions)

**Director:**
| OVR | Min | Max |
|-----|-----|-----|
| 95-99 | 1.8 | 2.2 |
| 90-94 | 1.4 | 1.8 |
| 85-89 | 1.0 | 1.4 |
| 80-84 | 0.7 | 1.0 |
| 75-79 | 0.5 | 0.7 |
| 70-74 | 0.35 | 0.5 |
| 60-69 | 0.2 | 0.35 |

**Area/National Scout:**
| OVR | Min | Max |
|-----|-----|-----|
| 90-99 | 0.8 | 1.2 |
| 85-89 | 0.6 | 0.8 |
| 80-84 | 0.45 | 0.6 |
| 75-79 | 0.3 | 0.45 |
| 70-74 | 0.2 | 0.3 |
| 60-69 | 0.15 | 0.2 |

**Pro Scout:**
| OVR | Min | Max |
|-----|-----|-----|
| 90-99 | 1.0 | 1.5 |
| 85-89 | 0.7 | 1.0 |
| 80-84 | 0.5 | 0.7 |
| 75-79 | 0.35 | 0.5 |
| 70-74 | 0.25 | 0.35 |
| 60-69 | 0.175 | 0.25 |

---

## Scouting Points System

### Prospect Tiers & Costs

| Tier | Rounds | Points |
|------|--------|--------|
| top | 1-2 | 50 |
| mid | 3-4 | 30 |
| late | 5-7 | 15 |
| udfa | Undrafted | 10 |
| free_agent | FA | 25 |
| trade_target | Trade | 40 |

### Season Period Modifiers

| Period | Weeks | Cost Modifier |
|--------|-------|---------------|
| pre_season | 1-8 | 0.75x (-25%) |
| mid_season | 9-14 | 1.0x (normal) |
| late_season | 15-18 | 1.25x (+25%) |
| combine | 19 | Free |
| pro_days | 20 | Free |
| draft | 21 | 1.0x (normal) |

---

## Scouting Reports

```typescript
interface ScoutingReport {
  id: string;
  prospectId: string;
  scoutId: string;
  generatedAt: number;
  week: number;

  scoutedOvr: number;           // True OVR ± error
  ovrConfidence: number;        // 0-100%
  potentialVisibility: PotentialVisibility;
  potentialValue?: number | [number, number] | string;

  traitsRevealed: string[];
  traitsHidden: number;
  attributesRevealed: string[];

  bustRisk: number;             // 0-100%
  sleeperFlag: boolean;

  draftGrade: DraftGrade;       // A+ to F
  roundProjection: number;      // 1-7
  textSummary: string;
}
```

### Report Quality Tiers

| Tier | Min OVR | OVR Error | Potential | Traits | Confidence |
|------|---------|-----------|-----------|--------|------------|
| ELITE | 95 | ±1 | Exact | All | 95% |
| GREAT | 85 | ±2 | Range | 4 | 85% |
| GOOD | 75 | ±4 | Tier | 3 | 72% |
| AVERAGE | 65 | ±6 | Vague | 2 | 55% |
| POOR | 60 | ±8 | Hidden | 1 | 45% |

---

## Scouting Department

```typescript
interface ScoutingDepartment {
  teamId: string;
  director: Scout;
  areaScouts: Scout[];          // 0-2
  proScout: Scout | null;       // 0-1
  nationalScout: Scout | null;  // 0-1
  totalBudget: number;          // Millions
  weeklyPoints: number;         // Combined
  scoutCount: number;
  avgOvr: number;
}
```

---

## XP System

### XP Gains

| Action | XP |
|--------|-----|
| Correct grade (±2 OVR) | 50 |
| Hidden gem found | 200 |
| Bust avoided | 150 |
| Draft hit (Rd 1-3) | 300 |
| Draft hit (Rd 4-7) | 500 |
| UDFA makes roster | 250 |

### XP Costs

| Action | XP |
|--------|-----|
| Attribute point | 500 |
| Tier 1 perk | 1000 |
| Tier 2 perk | 3000 |
| Tier 3 perk | 7000 |

---

## Retirement Risk

| Age | Risk |
|-----|------|
| 25-62 | 0% |
| 63-68 | 15% |
| 69-72 | 30% |
| 73+ | 50% |

---

## Summary

| Category | Count |
|----------|-------|
| Roles | 4 |
| Attributes | 6 |
| Position Expertise | 4 |
| Regional Expertise | 5 |
| Perks | 21 |
| Prospect Tiers | 6 |
| Season Periods | 6 |
