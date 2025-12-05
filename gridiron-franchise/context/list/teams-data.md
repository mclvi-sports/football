# Teams Data Reference

Complete inventory of all 32 teams with conferences, divisions, and colors.

---

## Team Interface

```typescript
interface TeamInfo {
  id: string;          // 3-letter abbreviation
  city: string;
  name: string;
  conference: string;  // Atlantic or Pacific
  division: string;
  colors: {
    primary: string;   // Hex color
    secondary: string; // Hex color
  };
}
```

---

## League Structure

| Level | Count |
|-------|-------|
| Conferences | 2 |
| Divisions | 8 (4 per conference) |
| Teams | 32 (4 per division) |

---

## Conferences (2)

| Conference | Divisions |
|------------|-----------|
| Atlantic | North, South, East, West |
| Pacific | North, South, East, West |

---

## Atlantic Conference (16 Teams)

### Atlantic North

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| BOS | Boston | Rebels | #0A2240 | #A8A9AD |
| PHI | Philadelphia | Ironworks | #5A5A5A | #B7410E |
| PIT | Pittsburgh | Riverhawks | #101820 | #FFB612 |
| BAL | Baltimore | Knights | #4B0082 | #CFB53B |

### Atlantic South

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| MIA | Miami | Sharks | #008E97 | #FF6F61 |
| ORL | Orlando | Thunder | #0057B8 | #FFFFFF |
| ATL | Atlanta | Firebirds | #CE1141 | #FDBB30 |
| CLT | Charlotte | Crowns | #5C2D91 | #C0C0C0 |

### Atlantic East

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| NYE | New York | Empire | #0C2340 | #FF5F00 |
| BKN | Brooklyn | Bolts | #FFD100 | #1A1A1A |
| NWK | Newark | Sentinels | #154734 | #A8A9AD |
| WAS | Washington | Monuments | #F5F5F5 | #002244 |

### Atlantic West

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| CHI | Chicago | Blaze | #FF6720 | #1A1A1A |
| DET | Detroit | Engines | #0076B6 | #B0B7BC |
| CLE | Cleveland | Forge | #EB3300 | #4C2600 |
| IND | Indianapolis | Stampede | #003DA5 | #FFFFFF |

---

## Pacific Conference (16 Teams)

### Pacific North

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| SEA | Seattle | Storm | #006B77 | #69FF47 |
| POR | Portland | Timbers | #00482B | #EBE5D5 |
| VAN | Vancouver | Grizzlies | #3D291A | #A5D8E6 |
| DEN | Denver | Summit | #5DADE2 | #FFFFFF |

### Pacific South

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| LAL | Los Angeles | Legends | #FFC72C | #1A1A1A |
| SDS | San Diego | Surf | #0077BE | #C9B037 |
| LVA | Las Vegas | Aces | #1A1A1A | #C5B358 |
| PHX | Phoenix | Scorpions | #C41E3A | #C2B280 |

### Pacific East

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| AUS | Austin | Outlaws | #1A1A1A | #BF5700 |
| HOU | Houston | Marshals | #002D62 | #CC0000 |
| DAL | Dallas | Lone Stars | #8A8D8F | #002B5C |
| SAN | San Antonio | Bandits | #1A1A1A | #E31C79 |

### Pacific West

| ID | City | Name | Primary | Secondary |
|----|------|------|---------|-----------|
| SFO | San Francisco | Gold Rush | #FFB81C | #B3002D |
| OAK | Oakland | Raiders | #A5ACAF | #1A1A1A |
| SAC | Sacramento | Kings | #5A2D82 | #8E9093 |
| HON | Honolulu | Volcanoes | #CF1020 | #1A1A1A |

---

## Helper Functions

```typescript
// Get team by ID
function getTeamById(id: string): TeamInfo | undefined;

// Get teams by division
function getTeamsByDivision(division: string): TeamInfo[];

// Get teams by conference
function getTeamsByConference(conference: string): TeamInfo[];
```

---

## Summary

| Category | Count |
|----------|-------|
| Conferences | 2 |
| Divisions | 8 |
| Teams | 32 |
| Color Properties | 2 (primary, secondary) |
