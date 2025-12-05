# Draft Data Reference

Complete inventory of draft class generation, rounds, OVR ranges, and prospect evaluation.

---

## Draft Prospect Interface

```typescript
interface DraftProspect extends Player {
  round: number | 'UDFA';
  pick: number | null;
  potentialLabel: PotentialLabel;  // Star, Starter, Limited
  potentialGap: number;
  scoutedOvr: number;              // What scouts think (may differ from true OVR)
}

type PotentialLabel = 'Star' | 'Starter' | 'Limited';
```

---

## Draft Class Size

| Category | Count |
|----------|-------|
| Rounds | 7 |
| Picks per Round | 32 |
| Total Drafted | 224 |
| UDFAs | 40-60 (random) |
| Total Class | ~275 |

---

## OVR Ranges by Round

| Round | Min OVR | Max OVR | Average |
|-------|---------|---------|---------|
| 1 | 72 | 86 | 78 |
| 2 | 68 | 80 | 74 |
| 3 | 65 | 76 | 70 |
| 4 | 62 | 73 | 67 |
| 5 | 58 | 70 | 64 |
| 6 | 55 | 67 | 61 |
| 7 | 52 | 64 | 58 |
| UDFA | 50 | 62 | 55 |

---

## Pick Position Modifiers

Within each round, pick position affects OVR:

| Pick Range | Modifier |
|------------|----------|
| 1-5 | +3 to +5 |
| 6-15 | +1 to +3 |
| 16-25 | 0 |
| 26-32 | -1 to -2 |

---

## Potential Gap Ranges

Gap between current OVR and potential ceiling:

| Round | Min Gap | Max Gap |
|-------|---------|---------|
| 1 | 8 | 18 |
| 2 | 6 | 15 |
| 3 | 5 | 12 |
| 4 | 4 | 10 |
| 5 | 3 | 8 |
| 6 | 2 | 7 |
| 7 | 1 | 6 |
| UDFA | 0 | 5 |

---

## Potential Label Distribution

| Round | Star | Starter | Limited |
|-------|------|---------|---------|
| 1 | 40% | 40% | 20% |
| 2 | 25% | 50% | 25% |
| 3 | 15% | 50% | 35% |
| 4 | 10% | 45% | 45% |
| 5 | 5% | 40% | 55% |
| 6 | 5% | 30% | 65% |
| 7 | 2% | 25% | 73% |
| UDFA | 1% | 20% | 79% |

---

## Prospect Age Distribution

| Age | Percentage | Cumulative |
|-----|------------|------------|
| 21 | 30% | 30% |
| 22 | 45% | 75% |
| 23 | 20% | 95% |
| 24 | 5% | 100% |

---

## Position Distribution

Draft class breakdown by position:

| Position | Weight | ~Count |
|----------|--------|--------|
| QB | 4% | 11 |
| RB | 7% | 19 |
| WR | 13% | 36 |
| TE | 5% | 14 |
| LT | 4% | 11 |
| RT | 4% | 11 |
| LG | 3% | 8 |
| C | 3% | 8 |
| RG | 3% | 8 |
| DE | 9% | 25 |
| DT | 6% | 17 |
| MLB | 4% | 11 |
| OLB | 6% | 17 |
| CB | 11% | 30 |
| FS | 4% | 11 |
| SS | 4% | 11 |
| K | 1% | 3 |
| P | 1% | 3 |

---

## Scouting Integration

### Prospect Tiers & Scouting Costs

| Tier | Rounds | Points |
|------|--------|--------|
| top | 1-2 | 50 |
| mid | 3-4 | 30 |
| late | 5-7 | 15 |
| udfa | Undrafted | 10 |

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

## Scouting Noise

Scouts don't see true OVR - variance of ±3 applied:
```typescript
scoutedOvr = trueOvr + random(-3, +3)
// Clamped to 45-95 range
```

---

## Draft Grades

| Grade | Description |
|-------|-------------|
| A+ | Elite prospect |
| A | Top tier |
| A- | High first round |
| B+ | First round |
| B | Second round |
| B- | Third round |
| C+ | Day 2 |
| C | Mid-late |
| C- | Late rounds |
| D | Fringe |
| F | UDFA |

---

## Scout Report Quality

Based on scout OVR:

| Tier | Min OVR | OVR Error | Potential | Traits | Confidence |
|------|---------|-----------|-----------|--------|------------|
| ELITE | 95 | ±1 | Exact | All | 95% |
| GREAT | 85 | ±2 | Range | 4 | 85% |
| GOOD | 75 | ±4 | Tier | 3 | 72% |
| AVERAGE | 65 | ±6 | Vague | 2 | 55% |
| POOR | 60 | ±8 | Hidden | 1 | 45% |

---

## Summary

| Category | Count |
|----------|-------|
| Rounds | 7 |
| Picks per Round | 32 |
| Total Drafted | 224 |
| UDFAs | 40-60 |
| Positions | 18 |
| Potential Labels | 3 |
| Draft Grades | 11 |
