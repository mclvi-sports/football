# Coach Data Reference

Complete inventory of all coaching staff fields, attributes, perks, and contracts.

---

## Coach Interface

```typescript
interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  position: CoachPosition;
  age: number;
  experience: number;           // Years as coach
  ovr: number;                  // 60-99
  attributes: CoachAttributes;
  offensiveScheme?: OffensiveScheme;  // HC & OC
  defensiveScheme?: DefensiveScheme;  // HC & DC
  stPhilosophy?: STPhilosophy;        // STC
  philosophy: CoachPhilosophy;
  perks: Perk[];
  contract: CoachContract;
  xp: number;
  retirementRisk: number;       // 0-100%
}
```

---

## Positions (4)

| Position | Code | Description |
|----------|------|-------------|
| Head Coach | HC | Leads entire team |
| Offensive Coordinator | OC | Runs offense |
| Defensive Coordinator | DC | Runs defense |
| Special Teams Coordinator | STC | Runs special teams |

---

## Philosophy (4)

| Philosophy | Description |
|------------|-------------|
| aggressive | High risk, high reward |
| balanced | Mix of styles |
| conservative | Safe, controlled |
| innovative | Unconventional approaches |

---

## Attributes

### Base Attributes (All Coaches)

| Attribute | Range | Description |
|-----------|-------|-------------|
| schemeMastery | 60-99 | System expertise |
| playerDevelopment | 60-99 | Growing talent |
| motivation | 60-99 | Inspiring players |
| gamePlanning | 60-99 | Weekly preparation |
| adaptability | 60-99 | In-game adjustments |

### HC-Specific Attributes

| Attribute | Range | Description |
|-----------|-------|-------------|
| leadership | 60-99 | Team leadership |
| clockManagement | 60-99 | Time decisions |
| challengeSuccess | 60-99 | Challenge accuracy |
| discipline | 60-99 | Penalty prevention |
| mediaHandling | 60-99 | Press management |

### OC-Specific Attributes

| Attribute | Range | Description |
|-----------|-------|-------------|
| playCalling | 60-99 | Play selection |
| redZoneOffense | 60-99 | Scoring inside 20 |
| qbDevelopment | 60-99 | QB coaching |
| tempoControl | 60-99 | Pace management |
| creativity | 60-99 | Play design innovation |

### DC-Specific Attributes

| Attribute | Range | Description |
|-----------|-------|-------------|
| playCalling | 60-99 | Play selection |
| redZoneDefense | 60-99 | Preventing scores |
| turnoverCreation | 60-99 | Forcing turnovers |
| blitzDesign | 60-99 | Pressure packages |
| coverageDisguise | 60-99 | Coverage deception |

### STC-Specific Attributes

| Attribute | Range | Description |
|-----------|-------|-------------|
| kickingGame | 60-99 | FG/PAT success |
| returnGame | 60-99 | Return success |
| coverageUnits | 60-99 | Coverage tackling |
| situational | 60-99 | Fake/onside calls |
| gunnerDevelopment | 60-99 | Gunner coaching |

---

## Perks (22 Total)

Tiers: 1 (1000 XP), 2 (3000 XP), 3 (7000 XP)

### HC Perks (6)

| ID | Name | Tier | Effect |
|----|------|------|--------|
| motivator | Motivator | 1 | Team morale boost |
| genius_mind | Genius Mind | 2 | Game planning boost |
| disciplinarian | Disciplinarian | 1 | Reduce penalties |
| winners_mentality | Winner's Mentality | 2 | Clutch performance |
| clock_master | Clock Master | 3 | Perfect clock management |
| players_coach | Players' Coach | 1 | Player development |

### OC Perks (6)

| ID | Name | Tier | Effect |
|----|------|------|--------|
| qb_whisperer | QB Whisperer | 2 | Elite QB development |
| red_zone_specialist | Red Zone Specialist | 1 | Better red zone |
| tempo_tactician | Tempo Tactician | 1 | Tempo control |
| run_game_architect | Run Game Architect | 2 | Run scheme boost |
| passing_guru | Passing Guru | 2 | Pass scheme boost |
| play_designer | Play Designer | 3 | Custom plays |

### DC Perks (6)

| ID | Name | Tier | Effect |
|----|------|------|--------|
| turnover_machine | Turnover Machine | 2 | Force turnovers |
| pass_rush_specialist | Pass Rush Specialist | 1 | Sack production |
| coverage_master | Coverage Master | 2 | Coverage boost |
| run_stuffer | Run Stuffer | 1 | Run defense |
| blitz_master | Blitz Master | 3 | Elite pressure |
| bend_dont_break | Bend Don't Break | 1 | Prevent big plays |

### STC Perks (4)

| ID | Name | Tier | Effect |
|----|------|------|--------|
| leg_whisperer | Leg Whisperer | 1 | Kicker development |
| return_specialist | Return Specialist | 2 | Return TD boost |
| coverage_ace | Coverage Ace | 1 | Coverage tackling |
| situational_genius | Situational Genius | 3 | Fake/onside success |

---

## Contracts

```typescript
interface CoachContract {
  salary: number;               // Millions/year
  yearsTotal: number;
  yearsRemaining: number;
  guaranteedRemaining: number;  // Millions
}
```

### HC Salary Ranges (millions)

| OVR | Min | Max |
|-----|-----|-----|
| 95-99 | 12 | 15 |
| 90-94 | 9 | 12 |
| 85-89 | 6 | 9 |
| 80-84 | 4 | 6 |
| 75-79 | 2 | 4 |
| 70-74 | 1 | 2 |
| 60-69 | 0.5 | 1 |

### Coordinator Salary Ranges (millions)

| OVR | OC Min | OC Max | DC Min | DC Max | STC Min | STC Max |
|-----|--------|--------|--------|--------|---------|---------|
| 90-99 | 6 | 8 | 6 | 8 | 2 | 3 |
| 85-89 | 4 | 6 | 4 | 6 | 1.5 | 2 |
| 80-84 | 2.5 | 4 | 2.5 | 4 | 1 | 1.5 |
| 75-79 | 1.5 | 2.5 | 1.5 | 2.5 | 0.8 | 1 |
| 70-74 | 0.8 | 1.5 | 0.8 | 1.5 | 0.5 | 0.8 |
| 60-69 | 0.5 | 0.8 | 0.5 | 0.8 | 0.3 | 0.5 |

---

## Coaching Staff

```typescript
interface CoachingStaff {
  teamId: string;
  headCoach: Coach;
  offensiveCoordinator: Coach;
  defensiveCoordinator: Coach;
  specialTeamsCoordinator: Coach;
  totalSalary: number;          // Combined annual
  staffChemistry: number;       // 0-100
  avgOvr: number;
}
```

---

## Summary

| Category | Count |
|----------|-------|
| Positions | 4 |
| Base Attributes | 5 |
| Position-Specific Attributes | 5 each |
| Perks | 22 |
| Philosophies | 4 |
