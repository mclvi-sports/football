/**
 * Season Simulator Engine
 *
 * Main orchestrator for 18-week season simulation.
 * Integrates game simulator with standings, injuries, and playoffs.
 */

import { Simulator } from '../sim/simulator';
import { SimStats, PlayerGameStats } from '../sim/types';
import { WeekSchedule, ScheduledGame } from '../schedule/types';
import {
  SeasonState,
  SeasonTeam,
  GameResult,
  WeekSummary,
  PlayerInjury,
  InjuryType,
  INJURY_DURATION,
  SeasonSimOptions,
  PlayoffRound,
} from './types';
import {
  createInitialStandings,
  updateStandingsWithGame,
  checkClinching,
  formatRecord,
} from './standings';
import {
  aggregateSeasonStats,
  getSeasonLeaders,
  PlayerSeasonStats,
  SeasonLeaders,
} from './season-stats';
import {
  generatePlayoffBracket,
  recordPlayoffResult,
  getCurrentRound,
  getRemainingMatchups,
  setByeTeam,
  isRoundComplete,
} from './playoffs';

// ============================================================================
// SEASON SIMULATOR CLASS
// ============================================================================

export class SeasonSimulator {
  private state: SeasonState;
  private teams: Map<string, SeasonTeam>;
  private simulator: Simulator;
  private options: SeasonSimOptions;

  constructor(options: SeasonSimOptions) {
    this.options = options;
    this.simulator = new Simulator();

    // Initialize teams map
    this.teams = new Map();
    for (const team of options.teams) {
      this.teams.set(team.id, {
        ...team,
        seasonStats: {
          gamesPlayed: 0,
          totalYards: 0,
          totalPassYards: 0,
          totalRushYards: 0,
          totalPointsScored: 0,
          totalPointsAllowed: 0,
          turnoversCommitted: 0,
          turnoversTaken: 0,
          sacks: 0,
          sacksAllowed: 0,
        },
      });
    }

    // Initialize season state
    this.state = {
      year: options.year,
      week: 1,
      phase: 'regular',
      schedule: options.schedule,
      standings: createInitialStandings(options.teams),
      completedGames: [],
      injuries: [],
      playoffBracket: null,
    };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get current season state
   */
  getState(): SeasonState {
    return this.state;
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): SeasonTeam | undefined {
    return this.teams.get(teamId);
  }

  /**
   * Get all teams
   */
  getTeams(): SeasonTeam[] {
    return Array.from(this.teams.values());
  }

  /**
   * Get aggregated season stats for all players
   */
  getSeasonStats(): Map<string, PlayerSeasonStats> {
    return aggregateSeasonStats(this.state.completedGames);
  }

  /**
   * Get season leaderboards
   */
  getLeaderboards(topN: number = 10): SeasonLeaders {
    const statsMap = this.getSeasonStats();
    return getSeasonLeaders(statsMap, topN);
  }

  /**
   * Simulate a single week
   */
  simulateWeek(): WeekSummary {
    if (this.state.phase === 'offseason') {
      throw new Error('Season is complete');
    }

    if (this.state.phase === 'playoffs') {
      return this.simulatePlayoffRound();
    }

    return this.simulateRegularSeasonWeek();
  }

  /**
   * Simulate entire regular season
   */
  simulateRegularSeason(): WeekSummary[] {
    const summaries: WeekSummary[] = [];

    while (this.state.phase === 'regular') {
      summaries.push(this.simulateWeek());
    }

    return summaries;
  }

  /**
   * Simulate entire playoffs
   */
  simulatePlayoffs(): WeekSummary[] {
    const summaries: WeekSummary[] = [];

    if (this.state.phase === 'regular') {
      this.startPlayoffs();
    }

    while (this.state.phase === 'playoffs') {
      summaries.push(this.simulateWeek());
    }

    return summaries;
  }

  /**
   * Simulate entire season (regular + playoffs)
   */
  simulateFullSeason(): WeekSummary[] {
    const regularSeason = this.simulateRegularSeason();
    const playoffs = this.simulatePlayoffs();
    return [...regularSeason, ...playoffs];
  }

  // ============================================================================
  // REGULAR SEASON SIMULATION
  // ============================================================================

  private simulateRegularSeasonWeek(): WeekSummary {
    const weekSchedule = this.state.schedule.find((w) => w.week === this.state.week);

    if (!weekSchedule) {
      // No more weeks, start playoffs
      this.startPlayoffs();
      return {
        week: this.state.week - 1,
        games: [],
        injuries: [],
        recoveries: [],
        standingsSnapshot: [...this.state.standings],
      };
    }

    // Process injury recoveries
    const recoveries = this.processInjuryRecoveries();

    // Simulate all games for this week
    const gameResults: GameResult[] = [];
    const newInjuries: PlayerInjury[] = [];

    for (const scheduledGame of weekSchedule.games) {
      const result = this.simulateGame(scheduledGame);
      gameResults.push(result);

      // Update standings
      this.state.standings = updateStandingsWithGame(
        this.state.standings,
        Array.from(this.teams.values()),
        result
      );

      // Check for injuries
      if (this.options.simulateInjuries) {
        const injuries = this.checkForInjuries(scheduledGame, result);
        newInjuries.push(...injuries);
        this.state.injuries.push(...injuries);
      }
    }

    // Store completed games
    this.state.completedGames.push(...gameResults);

    // Check clinching/elimination
    const remainingWeeks = 18 - this.state.week;
    this.state.standings = checkClinching(this.state.standings, remainingWeeks);

    // Log progress
    if (this.options.verboseLogging) {
      this.logWeekSummary(this.state.week, gameResults);
    }

    // Advance to next week
    const summary: WeekSummary = {
      week: this.state.week,
      games: gameResults,
      injuries: newInjuries,
      recoveries,
      standingsSnapshot: [...this.state.standings],
    };

    this.state.week++;

    // Check if regular season is complete
    if (this.state.week > 18) {
      this.startPlayoffs();
    }

    return summary;
  }

  // ============================================================================
  // GAME SIMULATION
  // ============================================================================

  private simulateGame(scheduledGame: ScheduledGame, isPlayoff = false): GameResult {
    const awayTeam = this.teams.get(scheduledGame.awayTeamId);
    const homeTeam = this.teams.get(scheduledGame.homeTeamId);

    if (!awayTeam || !homeTeam) {
      throw new Error(`Team not found: ${scheduledGame.awayTeamId} or ${scheduledGame.homeTeamId}`);
    }

    // Reset simulator
    this.simulator.reset();

    // Set up game
    this.simulator.settings.away = awayTeam;
    this.simulator.settings.home = homeTeam;
    this.simulator.settings.gameType = isPlayoff ? 'playoff' :
      scheduledGame.isPrimeTime ? 'primetime' : 'regular';
    this.simulator.settings.weather = 'clear'; // Could randomize
    this.simulator.settings.homeAdvantage = homeTeam.facilities?.stadium?.type === 'dome'
      ? 'dome'
      : 'normal';

    // Initialize game modifiers
    this.simulator.initializeGameModifiers();

    // Run simulation
    this.simulator.simulateGame();

    // Gather results
    const result: GameResult = {
      gameId: `${this.state.year}-W${this.state.week}-${awayTeam.abbrev}@${homeTeam.abbrev}`,
      week: this.state.week,
      awayTeamId: awayTeam.id,
      homeTeamId: homeTeam.id,
      awayScore: this.simulator.state.awayScore,
      homeScore: this.simulator.state.homeScore,
      awayStats: { ...this.simulator.stats.away },
      homeStats: { ...this.simulator.stats.home },
      playerStats: this.simulator.getPlayerGameStats(),
      isPrimetime: scheduledGame.isPrimeTime || false,
      isPlayoff,
    };

    // Update team season stats
    this.updateTeamSeasonStats(awayTeam, result.awayStats, result.awayScore, result.homeScore);
    this.updateTeamSeasonStats(homeTeam, result.homeStats, result.homeScore, result.awayScore);

    return result;
  }

  private updateTeamSeasonStats(
    team: SeasonTeam,
    stats: SimStats,
    pointsScored: number,
    pointsAllowed: number
  ): void {
    team.seasonStats.gamesPlayed++;
    team.seasonStats.totalYards += stats.yards;
    team.seasonStats.totalPassYards += stats.passYards;
    team.seasonStats.totalRushYards += stats.rushYards;
    team.seasonStats.totalPointsScored += pointsScored;
    team.seasonStats.totalPointsAllowed += pointsAllowed;
    team.seasonStats.turnoversCommitted += stats.fumbles + stats.interceptions;
    team.seasonStats.sacks += stats.sacks;
  }

  // ============================================================================
  // INJURIES
  // ============================================================================

  private checkForInjuries(game: ScheduledGame, result: GameResult): PlayerInjury[] {
    const injuries: PlayerInjury[] = [];
    const injuryRate = this.options.injuryRate || 0.05;

    // Check all players from both teams
    for (const playerStats of result.playerStats) {
      // Only players who participated can get injured
      const played = playerStats.passing.attempts > 0 ||
        playerStats.rushing.carries > 0 ||
        playerStats.receiving.targets > 0 ||
        playerStats.defense.tackles > 0;

      if (!played) continue;

      // Roll for injury
      if (Math.random() < injuryRate) {
        const injuryType = this.rollInjuryType();
        const duration = INJURY_DURATION[injuryType];
        const weeksOut = Math.floor(Math.random() * (duration.max - duration.min + 1)) + duration.min;

        injuries.push({
          playerId: playerStats.playerId,
          playerName: playerStats.playerName,
          teamId: playerStats.teamId === 'away' ? game.awayTeamId : game.homeTeamId,
          position: playerStats.position,
          injuryType,
          weeksRemaining: weeksOut,
          injuredWeek: this.state.week,
          description: this.getInjuryDescription(injuryType),
        });
      }
    }

    return injuries;
  }

  private rollInjuryType(): InjuryType {
    const roll = Math.random();
    if (roll < 0.50) return 'minor';
    if (roll < 0.80) return 'moderate';
    if (roll < 0.95) return 'severe';
    return 'season_ending';
  }

  private getInjuryDescription(type: InjuryType): string {
    const descriptions: Record<InjuryType, string[]> = {
      minor: ['Bruised ribs', 'Ankle sprain', 'Hamstring tightness', 'Shoulder strain'],
      moderate: ['Hamstring strain', 'MCL sprain', 'Concussion', 'High ankle sprain'],
      severe: ['ACL sprain', 'Broken arm', 'Torn labrum', 'Fractured ankle'],
      season_ending: ['Torn ACL', 'Torn Achilles', 'Fractured leg', 'Severe spinal injury'],
    };

    const options = descriptions[type];
    return options[Math.floor(Math.random() * options.length)];
  }

  private processInjuryRecoveries(): string[] {
    const recovered: string[] = [];

    this.state.injuries = this.state.injuries.filter((injury) => {
      injury.weeksRemaining--;
      if (injury.weeksRemaining <= 0) {
        recovered.push(injury.playerId);
        return false;
      }
      return true;
    });

    return recovered;
  }

  // ============================================================================
  // PLAYOFFS
  // ============================================================================

  private startPlayoffs(): void {
    this.state.phase = 'playoffs';
    this.state.week = 19; // Wild Card week
    this.state.playoffBracket = generatePlayoffBracket(this.state.standings);

    if (this.options.verboseLogging) {
      console.log('\n=== PLAYOFFS BEGIN ===');
      this.logPlayoffSeeding();
    }
  }

  private simulatePlayoffRound(): WeekSummary {
    if (!this.state.playoffBracket) {
      throw new Error('No playoff bracket');
    }

    const currentRound = getCurrentRound(this.state.playoffBracket);

    if (currentRound === 'complete' || currentRound === null) {
      this.state.phase = 'offseason';
      return {
        week: this.state.week,
        games: [],
        injuries: [],
        recoveries: [],
        standingsSnapshot: this.state.standings,
      };
    }

    // Get remaining matchups
    const matchups = getRemainingMatchups(this.state.playoffBracket);

    if (matchups.length === 0) {
      // Round complete, move to next
      this.state.week++;
      return this.simulatePlayoffRound();
    }

    const gameResults: GameResult[] = [];

    // Set bye teams for divisional round if needed
    if (currentRound === 'divisional') {
      const atlanticByeTeam = this.state.standings.find(
        (s) => s.conference === 'Atlantic' && s.playoffSeed === 1
      );
      const pacificByeTeam = this.state.standings.find(
        (s) => s.conference === 'Pacific' && s.playoffSeed === 1
      );

      if (atlanticByeTeam) {
        this.state.playoffBracket = setByeTeam(this.state.playoffBracket, 'Atlantic', atlanticByeTeam.teamId);
      }
      if (pacificByeTeam) {
        this.state.playoffBracket = setByeTeam(this.state.playoffBracket, 'Pacific', pacificByeTeam.teamId);
      }
    }

    // Simulate all matchups in this round
    for (let i = 0; i < matchups.length; i++) {
      const matchup = matchups[i];

      // Create scheduled game for playoff matchup
      const scheduledGame: ScheduledGame = {
        id: `PO-${matchup.round}-${matchup.lowerSeed.teamId}@${matchup.higherSeed.teamId}`,
        awayTeamId: matchup.lowerSeed.teamId,
        homeTeamId: matchup.higherSeed.teamId,
        week: this.state.week,
        timeSlot: 'sunday_night',
        gameType: 'division', // Playoff games
        isPrimeTime: true,
        dayOfWeek: 'sunday',
      };

      const result = this.simulateGame(scheduledGame, true);
      result.isPlayoff = true;
      result.playoffRound = currentRound;
      gameResults.push(result);

      // Find index in bracket
      const conference = matchup.conference;
      let gameIndex = 0;

      switch (currentRound) {
        case 'wild_card':
          gameIndex = conference === 'Atlantic'
            ? this.state.playoffBracket.atlanticWildCard.indexOf(matchup)
            : this.state.playoffBracket.pacificWildCard.indexOf(matchup);
          break;
        case 'divisional':
          gameIndex = conference === 'Atlantic'
            ? this.state.playoffBracket.atlanticDivisional.indexOf(matchup)
            : this.state.playoffBracket.pacificDivisional.indexOf(matchup);
          break;
      }

      this.state.playoffBracket = recordPlayoffResult(
        this.state.playoffBracket,
        currentRound,
        conference,
        gameIndex,
        result
      );
    }

    // Store completed games
    this.state.completedGames.push(...gameResults);

    // Check if playoffs complete
    if (this.state.playoffBracket.champion) {
      const champion = this.teams.get(this.state.playoffBracket.champion.teamId);
      this.state.playoffBracket.champion.teamName = champion?.name || 'Unknown';
      this.state.phase = 'offseason';

      if (this.options.verboseLogging) {
        console.log(`\n🏆 LEAGUE CHAMPIONS: ${champion?.city} ${champion?.name}!`);
      }
    }

    const summary: WeekSummary = {
      week: this.state.week,
      games: gameResults,
      injuries: [],
      recoveries: [],
      standingsSnapshot: this.state.standings,
    };

    this.state.week++;
    return summary;
  }

  // ============================================================================
  // LOGGING
  // ============================================================================

  private logWeekSummary(week: number, games: GameResult[]): void {
    console.log(`\n=== WEEK ${week} RESULTS ===`);
    for (const game of games) {
      const awayTeam = this.teams.get(game.awayTeamId);
      const homeTeam = this.teams.get(game.homeTeamId);
      console.log(
        `${awayTeam?.abbrev} ${game.awayScore} @ ${homeTeam?.abbrev} ${game.homeScore}`
      );
    }
  }

  private logPlayoffSeeding(): void {
    for (const conf of ['Atlantic', 'Pacific'] as const) {
      console.log(`\n${conf} Conference Playoff Seeds:`);
      const seeds = this.state.standings
        .filter((s) => s.conference === conf && s.playoffSeed !== null)
        .sort((a, b) => (a.playoffSeed || 0) - (b.playoffSeed || 0));

      for (const team of seeds) {
        const t = this.teams.get(team.teamId);
        console.log(
          `  ${team.playoffSeed}. ${t?.city} ${t?.name} (${formatRecord(team.record)})`
        );
      }
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create season simulator from options
 */
export function createSeasonSimulator(options: SeasonSimOptions): SeasonSimulator {
  return new SeasonSimulator(options);
}
