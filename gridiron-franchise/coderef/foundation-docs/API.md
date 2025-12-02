# API Reference

**Gridiron Franchise API Documentation**

Date: December 2025
Version: 0.1.0

---

## Overview

Gridiron Franchise uses Next.js API Routes for server-side functionality. Currently, the API provides development endpoints for testing data generators.

**Base URL:** `http://localhost:3000/api`

---

## Authentication

API routes currently do not require authentication. Production deployment should implement Supabase auth middleware.

---

## Development Endpoints

These endpoints are for development/testing only and should be disabled in production.

### POST /api/dev/generate-roster

Generate a complete 53-man roster.

**Request:**
```json
{
  "tier": "Good",
  "teamId": "KC"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tier` | string | Yes | Team tier: Elite, Good, Average, Below Average, Rebuilding |
| `teamId` | string | No | Optional team abbreviation |

**Response:**
```json
{
  "success": true,
  "roster": {
    "players": [
      {
        "id": "uuid",
        "firstName": "Patrick",
        "lastName": "Smith",
        "position": "QB",
        "archetype": "field_general",
        "age": 27,
        "experience": 5,
        "overall": 88,
        "attributes": { ... },
        "traits": ["clutch", "film_junkie"],
        "badges": [{ "id": "pocket_presence", "tier": "gold" }]
      }
    ],
    "depthChart": {
      "QB": ["player-id-1", "player-id-2", "player-id-3"]
    }
  },
  "stats": {
    "totalPlayers": 53,
    "averageOVR": 76.4,
    "positionBreakdown": { "QB": 3, "RB": 4, ... }
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/dev/generate-roster \
  -H "Content-Type: application/json" \
  -d '{"tier": "Good"}'
```

---

### POST /api/dev/generate-fa

Generate a free agent pool.

**Request:**
```json
{
  "poolSize": 175,
  "qualityTier": "mixed"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `poolSize` | number | No | Target pool size (default: 150-200) |
| `qualityTier` | string | No | Quality distribution: high, medium, low, mixed |

**Response:**
```json
{
  "success": true,
  "freeAgents": [
    {
      "id": "uuid",
      "firstName": "Marcus",
      "lastName": "Williams",
      "position": "CB",
      "archetype": "zone_cover",
      "age": 30,
      "overall": 78,
      "availabilityReason": "cap_casualty",
      "contractDemand": {
        "salary": 5000000,
        "years": 2
      },
      "traits": ["veteran_mentor", "injury_prone"],
      "badges": []
    }
  ],
  "stats": {
    "totalPlayers": 175,
    "averageOVR": 68.2,
    "averageAge": 28.5,
    "byPosition": { "QB": 10, "RB": 18, ... }
  }
}
```

---

### POST /api/dev/generate-draft

Generate a draft class.

**Request:**
```json
{
  "totalProspects": 275,
  "talentLevel": "average"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `totalProspects` | number | No | Number of prospects (default: 275) |
| `talentLevel` | string | No | Overall class quality: strong, average, weak |

**Response:**
```json
{
  "success": true,
  "prospects": [
    {
      "id": "uuid",
      "firstName": "Caleb",
      "lastName": "Johnson",
      "position": "QB",
      "archetype": "dual_threat",
      "age": 22,
      "college": "Ohio State",
      "overall": 76,
      "projectedRound": 1,
      "projectedPick": [1, 5],
      "scoutingGrade": "A",
      "traits": ["high_motor", "quick_learner"],
      "badges": []
    }
  ],
  "stats": {
    "totalProspects": 275,
    "averageOVR": 67.3,
    "byRound": { "1": 32, "2": 32, ... },
    "byPosition": { "QB": 12, "RB": 24, ... }
  }
}
```

---

### POST /api/dev/generate-full

Generate complete game data (roster + FA pool + draft class).

**Request:**
```json
{
  "options": {
    "roster": { "tier": "Good" },
    "freeAgents": { "poolSize": 175 },
    "draft": { "totalProspects": 275 }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roster": { ... },
    "freeAgents": [ ... ],
    "draftClass": [ ... ]
  },
  "stats": {
    "generationTime": "1.2s",
    "totalPlayers": 503
  }
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TIER",
    "message": "Tier must be one of: Elite, Good, Average, Below Average, Rebuilding"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TIER` | 400 | Invalid team tier value |
| `INVALID_POSITION` | 400 | Invalid position value |
| `GENERATION_FAILED` | 500 | Internal generation error |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |

---

## Rate Limits

Development endpoints have no rate limits. Production will implement:

| Endpoint Type | Limit |
|---------------|-------|
| Generation | 10/minute |
| Read | 100/minute |
| Write | 30/minute |

---

## Data Types

### Tier

```typescript
type Tier = 'Elite' | 'Good' | 'Average' | 'Below Average' | 'Rebuilding'
```

### Position

```typescript
type Position =
  | 'QB' | 'RB' | 'WR' | 'TE'           // Offense
  | 'LT' | 'LG' | 'C' | 'RG' | 'RT'     // O-Line
  | 'DE' | 'DT' | 'MLB' | 'OLB'         // Defense
  | 'CB' | 'FS' | 'SS'                  // Secondary
  | 'K' | 'P'                           // Special Teams
```

### Availability Reason (Free Agents)

```typescript
type AvailabilityReason =
  | 'age_decline'
  | 'injury_history'
  | 'cap_casualty'
  | 'character_concerns'
  | 'young_unproven'
  | 'market_timing'
```

---

## AI Agent Notes

When working with API routes:

1. **Location**: API routes in `src/app/api/dev/`
2. **Generator Import**: Use functions from `src/lib/generators/`
3. **Validation**: Add Zod schemas for request validation
4. **Error Format**: Always return `{ success, error? }` structure
5. **Types**: Import from `src/lib/types.ts`

---

**Date:** December 2025
**Version:** 0.1.0
