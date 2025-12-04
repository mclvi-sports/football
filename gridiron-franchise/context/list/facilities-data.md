# Facilities Data Reference

Complete inventory of all facility types, ratings, bonuses, and effects.

---

## Team Facilities Interface

```typescript
interface TeamFacilities {
  teamId: string;
  ownerTier: OwnerTier;
  annualBudget: number;         // Millions
  upgradeFund: number;          // Millions
  stadium: Stadium;
  practice: PracticeFacility;
  training: TrainingRoom;
  weight: WeightRoom;

  // Computed
  averageRating: number;
  faAppealBonus: number;        // Percentage
  leagueRank: number;           // 1-32
  totalMaintenanceCost: number; // Millions/year
}
```

---

## Facility Types (4)

| Type | Description |
|------|-------------|
| stadium | Main game venue |
| practice | Practice facility |
| training | Medical/training room |
| weight | Weight room |

---

## Owner Tiers (5)

| Tier | Budget (M) | Upgrade Fund (M) | Teams |
|------|------------|------------------|-------|
| wealthy | 150 | 500-700 | 4 |
| solid | 120 | 250-400 | 8 |
| moderate | 90 | 100-200 | 12 |
| budget | 70 | 50-100 | 6 |
| cheap | 50 | 25-50 | 2 |

---

## Stadium

```typescript
interface Stadium {
  rating: number;               // 1-10
  capacity: number;             // 55,000-85,000
  surface: SurfaceType;
  type: StadiumType;
  climate: Climate;
  noiseLevel: number;           // 1-10
  luxurySuites: number;         // 50-150+
  yearBuilt: number;

  // Effects
  homeAdvantage: number;        // OVR bonus
  attendance: number;           // Percentage
  revenue: number;              // Millions/season
  moraleBonus: number;          // Percentage
}
```

### Surface Types
- grass
- turf

### Stadium Types
- dome
- retractable
- open

### Climate
- cold
- hot
- neutral

### Stadium Effects by Rating

| Rating | Home Adv | Attendance | Revenue | Morale |
|--------|----------|------------|---------|--------|
| 10 | +5 OVR | 100% | High | +15% |
| 8-9 | +4 OVR | 95% | Good | +10% |
| 6-7 | +3 OVR | 85% | Average | +5% |
| 4-5 | +2 OVR | 75% | Low | 0% |
| 1-3 | +1 OVR | 60% | Poor | -5% |

---

## Practice Facility

```typescript
interface PracticeFacility {
  rating: number;               // 1-10
  practiceFields: number;       // 2-6
  filmRoomTech: number;         // 1-10
  meetingRooms: number;         // 5-15
  hasIndoor: boolean;

  // Effects
  xpGainBonus: number;          // Percentage
  injuryPrevention: number;     // Percentage reduction
  schemeInstallWeeks: number;   // Weeks for new scheme
}
```

### Practice Effects by Rating

| Rating | XP Bonus | Injury Prevention | Scheme Install |
|--------|----------|-------------------|----------------|
| 10 | +25% | -20% | 2 weeks |
| 8-9 | +20% | -15% | 3 weeks |
| 6-7 | +15% | -10% | 4 weeks |
| 4-5 | +10% | -5% | 5 weeks |
| 1-3 | +5% | 0% | 6 weeks |

---

## Training Room (Medical)

```typescript
interface TrainingRoom {
  rating: number;               // 1-10
  treatmentRooms: number;       // 5-20
  hasTherapyPool: boolean;
  hasSportsLab: boolean;

  // Effects
  recoverySpeedBonus: number;   // Percentage faster
  injuryRateReduction: number;  // Percentage
  severityReduction: number;    // Percentage
  longevityBonus: number;       // Years added
}
```

### Training Room Effects by Rating

| Rating | Recovery | Injury Rate | Severity | Longevity |
|--------|----------|-------------|----------|-----------|
| 10 | +40% | -25% | -30% | +2 years |
| 8-9 | +30% | -20% | -25% | +1.5 years |
| 6-7 | +20% | -15% | -15% | +1 year |
| 4-5 | +10% | -10% | -10% | +0.5 years |
| 1-3 | +5% | -5% | -5% | 0 years |

---

## Weight Room

```typescript
interface WeightRoom {
  rating: number;               // 1-10
  equipmentQuality: number;     // 1-10
  spaceSqFt: number;            // 5,000-20,000
  cardioMachines: number;       // 20-50
  speedAgilityYards: number;    // 30-100
  hasRecoveryEquipment: boolean;

  // Effects
  physicalXpBonus: number;      // Percentage
  strengthPerSeason: number;
  speedPerSeason: number;
  injuryPrevention: number;     // Percentage
  ageDeclineReduction: number;  // Percentage
}
```

### Weight Room Effects by Rating

| Rating | Physical XP | STR/Season | SPD/Season | Injury Prev | Age Decline |
|--------|-------------|------------|------------|-------------|-------------|
| 10 | +30% | +2 | +1 | -15% | -25% |
| 8-9 | +25% | +1.5 | +0.75 | -12% | -20% |
| 6-7 | +20% | +1 | +0.5 | -8% | -15% |
| 4-5 | +15% | +0.5 | +0.25 | -5% | -10% |
| 1-3 | +10% | +0.25 | +0.1 | -2% | -5% |

---

## Maintenance Costs

| Rating | Cost (M/year) |
|--------|---------------|
| 10 | 5.0 |
| 9 | 4.0 |
| 8 | 3.0 |
| 7 | 2.5 |
| 6 | 2.0 |
| 5 | 1.5 |
| 4 | 1.0 |
| 3 | 0.75 |
| 2 | 0.5 |
| 1 | 0.25 |

---

## League Facilities

```typescript
interface LeagueFacilities {
  teams: Record<string, TeamFacilities>;
  generatedAt: string;
}
```

### Facilities Stats

```typescript
interface FacilitiesStats {
  avgStadiumRating: number;
  avgPracticeRating: number;
  avgTrainingRating: number;
  avgWeightRating: number;
  avgOverallRating: number;
  eliteFacilities: number;      // 9-10 rating
  goodFacilities: number;       // 7-8 rating
  averageFacilities: number;    // 5-6 rating
  poorFacilities: number;       // 1-4 rating
  ownerTierDistribution: Record<OwnerTier, number>;
  totalLeagueRevenue: number;
  topTeams: { teamId: string; rating: number }[];
  bottomTeams: { teamId: string; rating: number }[];
}
```

---

## Rating Tiers

| Tier | Rating | Description |
|------|--------|-------------|
| Elite | 9-10 | Best in league |
| Good | 7-8 | Above average |
| Average | 5-6 | Middle of pack |
| Poor | 1-4 | Needs upgrade |

---

## Summary

| Category | Count |
|----------|-------|
| Facility Types | 4 |
| Owner Tiers | 5 |
| Rating Scale | 1-10 |
| Surface Types | 2 |
| Stadium Types | 3 |
| Climate Types | 3 |
