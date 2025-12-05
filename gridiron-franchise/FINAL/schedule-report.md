# NFL Schedule Generation: Research Report

> Research conducted: December 2025
> Purpose: Understanding NFL scheduling algorithms for Gridiron Franchise implementation

---

## Executive Summary

The NFL uses **Mixed Integer Programming (MIP)** solvers—specifically **Gurobi Optimizer**—to generate their 272-game, 18-week schedule. This is a fundamentally different approach than greedy algorithms, guaranteeing valid solutions when they exist. Our current greedy implementation achieves ~96% success (261/272 games), but 100% reliability requires adopting similar optimization techniques.

---

## 1. The NFL Scheduling Problem

### Scale
- **32 teams**, each playing **17 games** over **18 weeks** (1 bye week)
- **272 total games** per season
- **1 quadrillion+ possible schedules** (10^19 combinations)
- **26,000+ constraints** must be satisfied

### The 17-Game Formula (Since 2021)

Each team's opponents are determined by:

| Games | Opponent Type | Details |
|-------|---------------|---------|
| 6 | Division | 2 games vs each of 3 division rivals (home/away) |
| 4 | Rotating Intra-Conference | Full division on rotation (cycles every 3 years) |
| 4 | Inter-Conference | Full division on rotation (cycles every 4 years) |
| 2 | Same-Place Intra-Conference | Teams that finished same position in other 2 divisions |
| 1 | 17th Game | Inter-conference opponent based on prior year standings |

**Total: 17 games per team = 272 unique games league-wide**

---

## 2. How the NFL Actually Does It

### Technology Stack

| Component | Details |
|-----------|---------|
| **Solver** | Gurobi Optimizer (commercial MIP solver, adopted 2013) |
| **Infrastructure** | 4,000+ AWS EC2 Spot instances |
| **Output** | 50,000+ feasible schedules generated for comparison |
| **Timeline** | ~10 weeks from Super Bowl to schedule release |
| **Team** | 3-4 executives + optimization experts |

### The Mathematical Approach: Binary Integer Programming

```
Decision Variable:
  x[i,j,k] ∈ {0,1} = 1 if team i plays at team j in week k

Objective Function:
  Maximize TV value, competitive balance, travel efficiency, etc.

Subject to Constraints:
  - Each team plays exactly once per week (or bye)
  - Each team plays exactly 17 games total
  - Each team has exactly 1 bye in weeks 5-14
  - Division rivals play exactly twice (one home, one away)
  - No more than 3 consecutive road games
  - No more than 3 consecutive home games
  - Minimum rest after Monday night games
  - Stadium availability (concerts, baseball, etc.)
  - International game slots
  - TV broadcast distribution requirements
  - And 26,000+ more...
```

### Why MIP Works (and Greedy Doesn't)

| Approach | How It Works | Guarantees Solution? |
|----------|--------------|---------------------|
| **Greedy** | Places games one at a time, picks "best" available slot | No - gets stuck in local optima |
| **MIP Solver** | Formulates as math problem, explores solution space systematically | Yes - if solution exists, finds it |

The MIP solver uses:
- **Branch and bound** - Systematically explores possibilities
- **Constraint propagation** - Eliminates infeasible options early
- **Cutting planes** - Tightens the solution space
- **Backtracking** - Undoes decisions when stuck (greedy can't do this)

---

## 3. Key Constraints the NFL Handles

### Hard Constraints (Must Satisfy)
- Each team plays 17 games
- Each team has 1 bye week (weeks 5-14)
- Division games: exactly 6 (2 per rival)
- Home/away balance within game types
- No team plays twice in same week

### Soft Constraints (Optimize)
- Minimize travel distance
- Competitive balance (don't front-load tough opponents)
- TV viewership maximization
- Avoid back-to-back primetime road games
- Late-season divisional games for playoff drama
- Thursday game rest requirements (no short weeks after Monday games)

### Stadium/Logistics Constraints
- Shared stadium conflicts (Giants/Jets, Rams/Chargers)
- Concert/event schedules at venues
- International series games (London, Mexico City, Germany)
- Weather considerations (cold-weather teams at home late season)

---

## 4. Current Gridiron Franchise Implementation

### What We Have
```
Algorithm: Multi-attempt greedy with repair phase
Attempts: 1,000 random configurations
Success Rate: ~96% (261/272 games placed)
```

### Why It Falls Short
- Greedy can't backtrack when stuck
- Random attempts don't guarantee finding valid solution
- Repair phase (swapping games) has limited effectiveness
- No mathematical guarantee of optimality

### Current Results
```
Games Placed: 261/272 (96%)
Teams with 17 games: 13
Teams with 16 games: 16
Teams with 15 games: 3
Division games: 96/96 ✓
```

---

## 5. Recommended Solutions

### Option A: Implement OR-Tools (Recommended)

Google's **OR-Tools** is a free, open-source optimization suite that includes CP-SAT (Constraint Programming) and MIP solvers.

```typescript
// Conceptual implementation
import { CpModel, CpSolver } from 'ortools';

const model = new CpModel();

// Variables: game[away][home][week] = 1 if game scheduled
const games = {};
for (const away of teams) {
  for (const home of teams) {
    for (const week of weeks) {
      games[away][home][week] = model.newBoolVar(`${away}@${home}_w${week}`);
    }
  }
}

// Constraint: Each team plays exactly once per week (or bye)
for (const team of teams) {
  for (const week of weeks) {
    model.addAtMost(1, [...awayGames[team][week], ...homeGames[team][week]]);
  }
}

// Constraint: Each team plays exactly 17 games
for (const team of teams) {
  model.addExactly(17, allGamesForTeam[team]);
}

// Constraint: Division rivals play exactly twice
for (const [team, rival] of divisionRivalries) {
  model.addExactly(1, homeGames[team][rival]);
  model.addExactly(1, homeGames[rival][team]);
}

// Solve
const solver = new CpSolver();
const status = solver.solve(model);
// Guaranteed solution if feasible
```

**Pros:**
- Guarantees 272/272 if solvable
- Free and open source
- Well-documented
- Used in production by major companies

**Cons:**
- Requires WebAssembly or server-side Node.js
- Learning curve for constraint modeling
- Adds dependency

### Option B: Accept 96% Success Rate

For a game/simulation, 96% may be acceptable:
- Most teams get 16-17 games
- Division games are correct
- Schedule is playable

**Mitigations:**
- Add "makeup games" mechanic
- Adjust standings calculations for games played
- Log warning to user

### Option C: Simplify Constraints

Relax constraints to make greedy work:
- Expand bye week window (weeks 4-17)
- Allow flexible game counts (16-18 per team)
- Remove some matchup requirements

**Cons:**
- Less realistic NFL simulation
- May feel "off" to users who know NFL scheduling

---

## 6. Implementation Recommendation

### Short-term (Current Release)
Keep current implementation with 96% success rate. Add warning log and ensure game handles teams with 16 games gracefully.

### Medium-term (Next Update)
Integrate **OR-Tools CP-SAT solver** via:
1. Server-side API endpoint that runs solver
2. Return complete valid schedule
3. Cache/store generated schedules

### Long-term (Full Feature)
Full constraint modeling matching NFL:
- TV slot optimization
- Travel distance minimization
- Competitive balance scoring
- User-configurable constraints

---

## 7. Sources

1. [Creating the NFL Schedule - NFL Football Operations](https://operations.nfl.com/gameday/nfl-schedule/creating-the-nfl-schedule/)
2. [National Football League Scheduling - Gurobi Case Study](https://www.gurobi.com/case_studies/national-football-league-scheduling/)
3. [NFL Schedule - AWS Sports](https://aws.amazon.com/sports/nfl/schedule/)
4. [How It's Made: Anatomy of the NFL Schedule - NY Giants](https://www.giants.com/news/how-it-s-made-anatomy-of-the-nfl-schedule)
5. [NFL 17-game schedule formula - CBS Sports](https://www.cbssports.com/nfl/news/nfl-17-game-schedule-heres-how-the-complicated-scheduling-formula-will-work-with-the-extra-game/)
6. [Alleviating Competitive Imbalance in NFL Schedules - MIT Sloan](https://www.sloansportsconference.com/research-papers/alleviating-competitive-imbalance-in-nfl-schedules-an-integer-programming-approach)
7. [Google OR-Tools Documentation](https://developers.google.com/optimization)

---

## 8. Appendix: NFL Division Structure (For Reference)

### AFC
| Division | Teams |
|----------|-------|
| AFC East | Bills, Dolphins, Jets, Patriots |
| AFC North | Ravens, Bengals, Browns, Steelers |
| AFC South | Texans, Colts, Jaguars, Titans |
| AFC West | Broncos, Chiefs, Raiders, Chargers |

### NFC
| Division | Teams |
|----------|-------|
| NFC East | Cowboys, Giants, Eagles, Commanders |
| NFC North | Bears, Lions, Packers, Vikings |
| NFC South | Falcons, Panthers, Saints, Buccaneers |
| NFC West | Cardinals, Rams, 49ers, Seahawks |

---

*Report generated for Gridiron Franchise development*
