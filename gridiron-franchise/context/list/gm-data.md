# GM Data Reference

Complete inventory of all GM fields, backgrounds, archetypes, bonuses, and synergies.

---

## GM Interface

```typescript
interface GM {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  background: GMBackground;
  archetype: GMArchetype;
  hasSynergy: boolean;
  bonuses: GMBonuses;
  age: number;
  experience: number;           // Years as GM
  contract: GMContract;
  isPlayer: boolean;            // true = user's GM
}
```

---

## Backgrounds (6)

| ID | Name | Description | Synergy Archetype |
|----|------|-------------|-------------------|
| scout | Scout | Former scouting director | talent_scout |
| cap_analyst | Cap Analyst | Salary cap expert | economist |
| coach | Coach | Former coordinator/HC | builder |
| agent | Agent | Former player agent | closer |
| analytics | Analytics | Data-driven executive | innovator |
| legacy | Legacy | Family football dynasty | culture_builder |

### Background Bonuses

| Background | Bonuses |
|------------|---------|
| scout | +10 scoutingAccuracy, +1 sleepersPerDraft |
| cap_analyst | +5 capSpace, -5 contractDemands |
| coach | +10 playerDevelopment, +5 coachAppeal |
| agent | -10 contractDemands, +10 freeAgentAppeal |
| analytics | +5 scoutingAccuracy |
| legacy | +15 fanLoyalty, +10 ownerPatience |

---

## Archetypes (6)

| ID | Name | Description | Synergy Background |
|----|------|-------------|-------------------|
| builder | The Builder | Draft and develop | coach |
| closer | The Closer | Win now, big moves | agent |
| economist | The Economist | Cap efficiency | cap_analyst |
| talent_scout | The Talent Scout | Find hidden gems | scout |
| culture_builder | The Culture Builder | Team chemistry | legacy |
| innovator | The Innovator | Analytics edge | analytics |

### Archetype Bonuses

| Archetype | Bonuses |
|-----------|---------|
| builder | +25 playerDevelopment |
| closer | +15 tradeAcceptance |
| economist | +3 capSpace |
| talent_scout | +2 sleepersPerDraft |
| culture_builder | +15 teamMorale |
| innovator | +10 scoutingAccuracy |

---

## Synergies (6)

When background + archetype match, bonus synergy unlocks.

| Background | Archetype | Synergy Name | Bonuses |
|------------|-----------|--------------|---------|
| scout | talent_scout | The Eye | +3 sleepersPerDraft, +15 scoutingAccuracy |
| cap_analyst | economist | Cap Wizard | +8 capSpace, -10 contractDemands |
| coach | builder | Player Whisperer | +40 playerDevelopment |
| agent | closer | The Dealmaker | -15 contractDemands, +25 tradeAcceptance |
| analytics | innovator | The Oracle | +20 scoutingAccuracy |
| legacy | culture_builder | The Dynasty | +25 teamMorale, +20 fanLoyalty |

---

## Bonuses

```typescript
interface GMBonuses {
  scoutingAccuracy: number;     // % bonus to prospect eval
  contractDemands: number;      // % reduction in salary demands
  tradeAcceptance: number;      // % bonus to CPU trade accept
  playerDevelopment: number;    // % bonus to young player XP
  freeAgentAppeal: number;      // % bonus to FA preference
  teamMorale: number;           // % bonus to morale floor
  capSpace: number;             // Bonus cap space (millions)
  ownerPatience: number;        // Bonus years before hot seat
  coachAppeal: number;          // % bonus to hire elite coaches
  fanLoyalty: number;           // % bonus to fan satisfaction
  sleepersPerDraft: number;     // Extra sleeper prospects revealed
}
```

### Bonus Effects

| Bonus | Effect |
|-------|--------|
| scoutingAccuracy | More accurate OVR/potential evaluations |
| contractDemands | Players ask for less money |
| tradeAcceptance | CPU more likely to accept trades |
| playerDevelopment | Young players gain more XP |
| freeAgentAppeal | FAs prefer your team |
| teamMorale | Higher morale floor |
| capSpace | Extra millions in cap |
| ownerPatience | More time before firing |
| coachAppeal | Attract better coaches |
| fanLoyalty | Fans more forgiving |
| sleepersPerDraft | More hidden gems revealed |

---

## Contracts

```typescript
interface GMContract {
  years: number;
  salary: number;               // Millions/year
}
```

---

## Game Modes

### Player GM Mode (Legacy)

```typescript
interface LeagueGMs {
  playerTeamId: string;
  playerGM: GM;
  cpuGMs: Record<string, GM>;
  generatedAt: string;
}
```

### Owner Mode

```typescript
interface OwnerModeGMs {
  mode: 'owner';
  allGMs: Record<string, GM>;   // All 32 CPU GMs
  playerTeamId: string | null;  // Set when user picks team
  generatedAt: string;
}
```

---

## Summary

| Category | Count |
|----------|-------|
| Backgrounds | 6 |
| Archetypes | 6 |
| Synergies | 6 |
| Bonus Types | 11 |
