/**
 * Simulation Engine
 *
 * Core game simulation class that uses actual roster data,
 * trait effects, and badge bonuses to simulate games.
 */

import { Player, Position } from '../types';
import {
  SimState,
  SimStats,
  SimTeam,
  PlayResult,
  PlayType,
  PlayResultType,
  PlayerGameStats,
  GameSettings,
  GameSituation,
  GameType,
  WEATHER_MODIFIERS,
  HOME_ADVANTAGE_VALUES,
} from './types';
import { getStarter, formatPlayerName } from './team-adapter';
import { detectSituation, getTraitModifier, getInjuryChanceModifier, getPenaltyChanceModifier, getAggressiveModifiers, getBallHawkModifier } from './trait-effects';
import { getPlayerBadgeBonus, getPlayBonuses } from './badge-effects';
import {
  calculateSchemeGameModifiers,
  shouldPass,
  determinePassDepth,
  getPassYardsRange,
  SchemeGameModifiers,
} from './scheme-modifiers';
import {
  calculateCoachingGameModifiers,
  CoachingGameModifiers,
} from './coaching-modifiers';
import {
  calculateFacilityGameModifiers,
  FacilityGameModifiers,
} from './facility-modifiers';

// ============================================================================
// SIMULATOR CLASS
// ============================================================================

export class Simulator {
  state: SimState;
  stats: { away: SimStats; home: SimStats };
  settings: {
    away: SimTeam | null;
    home: SimTeam | null;
    gameType: 'regular' | 'primetime' | 'playoff' | 'championship';
    weather: 'clear' | 'rain' | 'snow' | 'wind';
    homeAdvantage: 'normal' | 'loud' | 'dome' | 'neutral';
  };
  playerStats: Map<string, PlayerGameStats>;
  plays: number;
  debugLog: string[];

  // Module integration modifiers (calculated at game start)
  private schemeModifiers: { away: SchemeGameModifiers | null; home: SchemeGameModifiers | null };
  private coachingModifiers: { away: CoachingGameModifiers | null; home: CoachingGameModifiers | null };
  private facilityModifiers: { away: FacilityGameModifiers | null; home: FacilityGameModifiers | null };

  constructor() {
    this.state = this.createInitialState();
    this.stats = { away: this.createEmptyStats(), home: this.createEmptyStats() };
    this.settings = {
      away: null,
      home: null,
      gameType: 'regular',
      weather: 'clear',
      homeAdvantage: 'normal',
    };
    this.playerStats = new Map();
    this.plays = 0;
    this.debugLog = [];

    // Initialize module modifiers
    this.schemeModifiers = { away: null, home: null };
    this.coachingModifiers = { away: null, home: null };
    this.facilityModifiers = { away: null, home: null };
  }

  private createInitialState(): SimState {
    return {
      quarter: 1,
      clock: 900,
      possession: null,
      ball: 75,
      down: 1,
      yardsToGo: 10,
      awayScore: 0,
      homeScore: 0,
      isOver: false,
      isKickoff: true,
      isOvertime: false,
    };
  }

  private createEmptyStats(): SimStats {
    return {
      yards: 0,
      passYards: 0,
      rushYards: 0,
      firstDowns: 0,
      completions: 0,
      attempts: 0,
      passTDs: 0,
      interceptions: 0,
      carries: 0,
      rushTDs: 0,
      fumbles: 0,
      sacks: 0,
      penalties: 0,
      timeOfPossession: 0,
    };
  }

  private initPlayerStats(player: Player, teamId: string): PlayerGameStats {
    return {
      playerId: player.id,
      playerName: formatPlayerName(player, 'full'),
      position: player.position,
      teamId,
      passing: { attempts: 0, completions: 0, yards: 0, touchdowns: 0, interceptions: 0, sacked: 0 },
      rushing: { carries: 0, yards: 0, touchdowns: 0, fumbles: 0, long: 0 },
      receiving: { targets: 0, catches: 0, yards: 0, touchdowns: 0, long: 0 },
      defense: { tackles: 0, sacks: 0, interceptions: 0, passDeflections: 0, fumbleRecoveries: 0 },
      kicking: { fgAttempts: 0, fgMade: 0, xpAttempts: 0, xpMade: 0, punts: 0, puntYards: 0 },
    };
  }

  private getPlayerStats(player: Player, teamId: string): PlayerGameStats {
    if (!this.playerStats.has(player.id)) {
      this.playerStats.set(player.id, this.initPlayerStats(player, teamId));
    }
    return this.playerStats.get(player.id)!;
  }

  /**
   * Select a defender to credit with a tackle based on play type
   */
  private selectTackler(defTeam: SimTeam, playType: 'run' | 'pass'): Player | null {
    const depthChart = defTeam.depthChart as Record<Position, string[]>;

    // For run plays: LB most likely, then DL, then DB
    // For pass plays: DB most likely, then LB
    const weights = playType === 'run'
      ? [
          { position: Position.MLB, weight: 0.35 },
          { position: Position.OLB, weight: 0.15 },
          { position: Position.DT, weight: 0.20 },
          { position: Position.DE, weight: 0.15 },
          { position: Position.CB, weight: 0.08 },
          { position: Position.SS, weight: 0.05 },
          { position: Position.FS, weight: 0.02 },
        ]
      : [
          { position: Position.CB, weight: 0.35 },
          { position: Position.SS, weight: 0.20 },
          { position: Position.FS, weight: 0.15 },
          { position: Position.MLB, weight: 0.15 },
          { position: Position.OLB, weight: 0.10 },
          { position: Position.DE, weight: 0.05 },
        ];

    const roll = Math.random();
    let cumulative = 0;

    for (const { position, weight } of weights) {
      cumulative += weight;
      if (roll < cumulative) {
        const starter = getStarter(defTeam.roster, depthChart, position);
        if (starter) return starter;
      }
    }

    // Fallback to MLB
    return getStarter(defTeam.roster, depthChart, Position.MLB) || null;
  }

  /**
   * Credit a defender with a tackle
   */
  private creditTackle(def: 'away' | 'home', playType: 'run' | 'pass'): Player | null {
    const defTeam = this.settings[def]!;
    const tackler = this.selectTackler(defTeam, playType);

    if (tackler) {
      const tacklerStats = this.getPlayerStats(tackler, def);
      tacklerStats.defense.tackles++;
    }

    return tackler;
  }

  reset(): void {
    this.state = this.createInitialState();
    this.stats = { away: this.createEmptyStats(), home: this.createEmptyStats() };
    this.playerStats = new Map();
    this.plays = 0;
    this.debugLog = [];

    // Reset module modifiers
    this.schemeModifiers = { away: null, home: null };
    this.coachingModifiers = { away: null, home: null };
    this.facilityModifiers = { away: null, home: null };
  }

  // ============================================================================
  // DEBUG LOGGING HELPERS
  // ============================================================================

  private addDebug(message: string): void {
    this.debugLog.push(message);
  }

  private addDebugSection(title: string): void {
    this.debugLog.push(`── ${title} ──`);
  }

  /**
   * Initialize game modifiers from teams' schemes, coaching, and facilities
   * Call this after setting teams and before starting simulation
   */
  initializeGameModifiers(): void {
    const { away, home, gameType } = this.settings;

    // Calculate coaching modifiers
    if (away?.coachingStaff) {
      this.coachingModifiers.away = calculateCoachingGameModifiers(away.coachingStaff, gameType);
    }
    if (home?.coachingStaff) {
      this.coachingModifiers.home = calculateCoachingGameModifiers(home.coachingStaff, gameType);
    }

    // Calculate facility modifiers
    if (away?.facilities) {
      this.facilityModifiers.away = calculateFacilityGameModifiers(away.facilities, false);
    }
    if (home?.facilities) {
      this.facilityModifiers.home = calculateFacilityGameModifiers(home.facilities, true);
    }

    this.debugLog.push('Game modifiers initialized');
    if (this.coachingModifiers.away) {
      this.debugLog.push(`Away coaching: +${this.coachingModifiers.away.teamOvrBonus.toFixed(1)} OVR`);
    }
    if (this.coachingModifiers.home) {
      this.debugLog.push(`Home coaching: +${this.coachingModifiers.home.teamOvrBonus.toFixed(1)} OVR`);
    }
    if (this.facilityModifiers.home) {
      this.debugLog.push(`Home advantage: +${this.facilityModifiers.home.homeAdvantageBonus.toFixed(1)} from facilities`);
    }
  }

  // ============================================================================
  // SITUATION HELPERS
  // ============================================================================

  private getCurrentSituation(team: 'away' | 'home'): GameSituation {
    const teamScore = team === 'away' ? this.state.awayScore : this.state.homeScore;
    const oppScore = team === 'away' ? this.state.homeScore : this.state.awayScore;
    const oppTeam = team === 'away' ? this.settings.home : this.settings.away;
    const isHome = team === 'home';

    return detectSituation(
      this.state.quarter,
      this.state.clock,
      this.state.down,
      this.state.yardsToGo,
      this.state.ball,
      teamScore,
      oppScore,
      this.settings.gameType === 'playoff' || this.settings.gameType === 'championship',
      this.settings.gameType === 'primetime',
      this.state.possession || 'away',
      {
        isHome,
        weather: this.settings.weather,
        isDivisionGame: this.isDivisionGame(),
        opponentOvr: oppTeam?.ovr ?? 75,
      }
    );
  }

  /**
   * Check if this is a division game (teams share same division)
   */
  private isDivisionGame(): boolean {
    const away = this.settings.away;
    const home = this.settings.home;
    if (!away?.division || !home?.division) return false;
    return away.division === home.division;
  }

  isClutch(): boolean {
    return (
      this.state.quarter >= 4 &&
      this.state.clock <= 120 &&
      Math.abs(this.state.awayScore - this.state.homeScore) <= 8
    );
  }

  // ============================================================================
  // OVR CALCULATION WITH MODIFIERS
  // ============================================================================

  private getEffectiveOvr(team: SimTeam, situation: GameSituation): number {
    let ovr = team.ovr;
    const isHome = team.id === this.settings.home?.id;
    const teamSide = isHome ? 'home' : 'away';

    // Home field advantage (base)
    if (isHome) {
      ovr += HOME_ADVANTAGE_VALUES[this.settings.homeAdvantage];
    }

    // Facility modifiers (home team gets extra from stadium)
    const facilityMods = this.facilityModifiers[teamSide];
    if (facilityMods) {
      ovr += facilityMods.homeAdvantageBonus;
      ovr += facilityMods.moraleBonus * 2; // Morale bonus converts to OVR
    }

    // Coaching modifiers
    const coachingMods = this.coachingModifiers[teamSide];
    if (coachingMods) {
      ovr += coachingMods.teamOvrBonus;
      ovr += coachingMods.moraleBonus * 2; // Morale converts to OVR

      // Playoff bonus
      if (situation.isPlayoffs && coachingMods.playoffOvrBonus > 0) {
        ovr += coachingMods.playoffOvrBonus;
      }
    }

    // Get trait/badge bonuses from key players
    const qb = getStarter(team.roster, team.depthChart as Record<Position, string[]>, Position.QB);
    if (qb) {
      ovr += getTraitModifier(team.traits, qb.id, situation) * 0.3;
      ovr += getPlayerBadgeBonus(team.badges, qb.id, situation) * 0.2;
    }

    return Math.round(ovr);
  }

  private getOvrDiff(offTeam: 'away' | 'home'): number {
    const off = this.settings[offTeam];
    const def = this.settings[offTeam === 'away' ? 'home' : 'away'];
    if (!off || !def) return 0;

    const situation = this.getCurrentSituation(offTeam);
    const offOvr = this.getEffectiveOvr(off, situation);
    const defOvr = this.getEffectiveOvr(def, situation);

    return (offOvr - defOvr) * 0.015;
  }

  // ============================================================================
  // PLAYER SELECTION HELPERS
  // ============================================================================

  /**
   * Select a receiver with realistic target distribution
   * WR1: 30%, WR2: 25%, WR3: 15%, TE: 20%, RB checkdown: 10%
   */
  private selectReceiver(team: SimTeam): Player | undefined {
    const depthChart = team.depthChart as Record<Position, string[]>;
    const roll = Math.random();

    if (roll < 0.30) {
      return getStarter(team.roster, depthChart, Position.WR, 0); // WR1
    } else if (roll < 0.55) {
      return getStarter(team.roster, depthChart, Position.WR, 1); // WR2
    } else if (roll < 0.70) {
      return getStarter(team.roster, depthChart, Position.WR, 2); // WR3
    } else if (roll < 0.90) {
      return getStarter(team.roster, depthChart, Position.TE, 0); // TE
    } else {
      return getStarter(team.roster, depthChart, Position.RB, 0); // RB checkdown
    }
  }

  /**
   * Select a rusher with realistic carry distribution
   * RB1: 75%, RB2: 20%, QB scramble: 5%
   */
  private selectRusher(team: SimTeam): Player | undefined {
    const depthChart = team.depthChart as Record<Position, string[]>;
    const roll = Math.random();

    if (roll < 0.75) {
      return getStarter(team.roster, depthChart, Position.RB, 0); // RB1
    } else if (roll < 0.95) {
      return getStarter(team.roster, depthChart, Position.RB, 1); // RB2
    } else {
      return getStarter(team.roster, depthChart, Position.QB, 0); // QB scramble
    }
  }

  // ============================================================================
  // CLOCK MANAGEMENT
  // ============================================================================

  formatTime(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  getYardLine(): string {
    const pos = this.state.ball;
    if (pos <= 50) return `AWAY ${pos}`;
    return `HOME ${100 - pos}`;
  }

  private ordinal(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  }

  private changePossession(): void {
    this.state.possession = this.state.possession === 'away' ? 'home' : 'away';
    this.state.down = 1;
    this.state.yardsToGo = 10;
  }

  private advanceClock(seconds: number): void {
    this.state.clock -= seconds;
    if (this.state.clock <= 0) {
      this.state.clock = 0;
      this.state.quarter++;

      if (this.state.quarter > 4) {
        if (this.state.awayScore === this.state.homeScore) {
          this.state.clock = 600;
          this.state.isOvertime = true;
        } else {
          this.state.isOver = true;
        }
      } else {
        this.state.clock = 900;
        if (this.state.quarter === 3) {
          this.state.isKickoff = true;
          this.changePossession();
        }
      }
    }
  }

  // ============================================================================
  // PLAY EXECUTION
  // ============================================================================

  private kickoff(): PlayResult {
    const returnYards = Math.floor(Math.random() * 30) + 15;
    const isTouchback = Math.random() < 0.4;

    if (this.state.possession === 'away') {
      this.state.possession = 'home';
      this.state.ball = isTouchback ? 75 : Math.min(75, 100 - returnYards);
    } else {
      this.state.possession = 'away';
      this.state.ball = isTouchback ? 25 : Math.max(25, returnYards);
    }

    this.state.down = 1;
    this.state.yardsToGo = 10;
    this.state.isKickoff = false;

    return {
      type: 'kickoff',
      result: isTouchback ? 'touchback' : 'normal',
      description: isTouchback ? 'Touchback. Ball at the 25.' : `Kickoff returned ${returnYards} yards.`,
      yards: isTouchback ? 0 : returnYards,
      time: 5,
    };
  }

  play(): PlayResult | null {
    if (this.state.isOver) return null;
    this.plays++;
    this.debugLog = [];

    // Kickoff handling
    if (this.state.isKickoff) {
      const result = this.kickoff();
      this.advanceClock(5);
      return result;
    }

    const off = this.state.possession as 'away' | 'home';
    const def = off === 'away' ? 'home' : 'away';
    const ovrDiff = this.getOvrDiff(off);
    const weather = WEATHER_MODIFIERS[this.settings.weather];
    const offTeam = this.settings[off]!;
    const defTeam = this.settings[def]!;
    const situation = this.getCurrentSituation(off);

    this.debugLog.push(`${this.state.down}${this.ordinal(this.state.down)} & ${this.state.yardsToGo} at ${this.getYardLine()}`);
    this.debugLog.push(`${offTeam.city} (${offTeam.ovr}) vs ${defTeam.city} (${defTeam.ovr})`);
    if (this.isClutch()) this.debugLog.push('CLUTCH SITUATION');

    // Play type selection
    const { down, yardsToGo, ball, possession } = this.state;
    const inFGRange = (possession === 'away' && ball >= 65) || (possession === 'home' && ball <= 35);
    let playType: 'run' | 'pass' | 'punt' | 'fg';

    this.addDebugSection('PLAY SELECTION');

    if (down === 4) {
      // 4th down decisions - apply coaching modifiers for aggressiveness
      let goForItChance = 0.3;
      const offCoachingMods = this.coachingModifiers[off];
      if (offCoachingMods && offCoachingMods.gameplanningBonus > 0) {
        goForItChance += offCoachingMods.gameplanningBonus * 0.02; // Better game planning = smarter 4th down decisions
        this.addDebug(`  Gameplanning bonus: +${(offCoachingMods.gameplanningBonus * 0.02 * 100).toFixed(1)}% go-for-it`);
      }

      const goForItRoll = Math.random();
      if (yardsToGo <= 2 && goForItRoll < goForItChance) {
        const playRoll = Math.random();
        playType = playRoll < 0.5 ? 'run' : 'pass';
        this.addDebug(`  4th & ${yardsToGo}: Go for it! (${(goForItChance * 100).toFixed(0)}% chance, rolled ${(goForItRoll * 100).toFixed(0)})`);
        this.addDebug(`  Decision: ${playType.toUpperCase()} (rolled ${(playRoll * 100).toFixed(0)})`);
      } else if (inFGRange) {
        playType = 'fg';
        this.addDebug(`  4th down in FG range → FIELD GOAL`);
      } else {
        playType = 'punt';
        this.addDebug(`  4th & ${yardsToGo}, not in FG range → PUNT`);
      }
    } else {
      // Use scheme-based play calling when available
      if (offTeam.offensiveScheme) {
        // Calculate ball position relative to scoring zone (0-100 scale)
        const effectiveBallPos = off === 'away' ? ball : (100 - ball);
        const isPass = shouldPass(
          offTeam.offensiveScheme,
          down,
          yardsToGo,
          effectiveBallPos
        );
        playType = isPass ? 'pass' : 'run';
        this.addDebug(`  Scheme: ${offTeam.offensiveScheme}`);
        this.addDebug(`  Base tendency → ${playType.toUpperCase()}`);

        // Weather adjustment - reduce passing in bad conditions
        if (playType === 'pass' && weather.passAccuracy < -0.05) {
          const weatherRoll = Math.random();
          if (weatherRoll < Math.abs(weather.passAccuracy)) {
            playType = 'run';
            this.addDebug(`  Weather (${this.settings.weather}): Switched to RUN (${(Math.abs(weather.passAccuracy) * 100).toFixed(0)}% chance, rolled ${(weatherRoll * 100).toFixed(0)})`);
          }
        }
      } else {
        // Fallback: legacy scheme-based play calling
        let passRate = 0.55;
        let passRateBreakdown = ['Base: 55%'];
        if (offTeam.scheme === 'Air Raid' || offTeam.scheme === 'Spread') {
          passRate += 0.1;
          passRateBreakdown.push(`${offTeam.scheme}: +10%`);
        }
        if (offTeam.scheme === 'Power Run' || offTeam.scheme === 'Run Heavy') {
          passRate -= 0.15;
          passRateBreakdown.push(`${offTeam.scheme}: -15%`);
        }
        if (yardsToGo > 7) {
          passRate += 0.15;
          passRateBreakdown.push(`Long yardage (${yardsToGo}): +15%`);
        }
        if (down === 3) {
          passRate += 0.1;
          passRateBreakdown.push('3rd down: +10%');
        }
        if (weather.passAccuracy < 0) {
          passRate -= 0.1;
          passRateBreakdown.push(`Weather (${this.settings.weather}): -10%`);
        }
        const playRoll = Math.random();
        playType = playRoll < passRate ? 'pass' : 'run';
        this.addDebug(`  Pass rate: ${(passRate * 100).toFixed(0)}%`);
        this.addDebug(`    ${passRateBreakdown.join(', ')}`);
        this.addDebug(`  Rolled ${(playRoll * 100).toFixed(0)} → ${playType.toUpperCase()}`);
      }
    }

    let result: PlayResult;
    if (playType === 'run') result = this.simulateRun(off, def, ovrDiff, situation);
    else if (playType === 'pass') result = this.simulatePass(off, def, ovrDiff, situation);
    else if (playType === 'punt') result = this.simulatePunt(off);
    else result = this.simulateFieldGoal(off, situation);

    // Penalty check
    let penaltyChance = 0.08;
    if (off === 'away' && this.settings.homeAdvantage === 'loud') penaltyChance += 0.03;

    // Apply coaching penalty reduction (disciplinarian perk)
    const offCoachingPenalty = this.coachingModifiers[off];
    if (offCoachingPenalty && offCoachingPenalty.penaltyReduction > 0) {
      penaltyChance *= (1 - offCoachingPenalty.penaltyReduction); // Reduce penalty chance
    }

    // Check for disciplined/hot head traits
    const qb = getStarter(offTeam.roster, offTeam.depthChart as Record<Position, string[]>, Position.QB);
    if (qb) {
      penaltyChance *= 1 + getPenaltyChanceModifier(offTeam.traits, qb.id);
    }

    // Ensure minimum penalty chance
    penaltyChance = Math.max(0.02, penaltyChance);

    if (Math.random() < penaltyChance) {
      result = this.applyPenalty(result, off, def);
    }

    const time = result.time || Math.floor(Math.random() * 20) + 20;
    this.advanceClock(time);
    this.stats[off].timeOfPossession += time;
    result.debug = [...this.debugLog];

    return result;
  }

  // ============================================================================
  // PLAY SIMULATIONS
  // ============================================================================

  private simulateRun(off: 'away' | 'home', def: 'away' | 'home', ovrDiff: number, situation: GameSituation): PlayResult {
    const offTeam = this.settings[off]!;
    const defTeam = this.settings[def]!;

    const rusher = this.selectRusher(offTeam); // Use rotation instead of always RB1
    if (!rusher) {
      return { type: 'run', result: 'normal', description: 'Run play, no gain.', yards: 0, time: 25 };
    }

    const rusherStats = this.getPlayerStats(rusher, off);
    rusherStats.rushing.carries++;
    this.stats[off].carries++;

    // Calculate yards
    this.addDebugSection('RUSHER');
    const rusherTraitMod = getTraitModifier(offTeam.traits, rusher.id, situation);
    const rusherOvr = rusher.overall + rusherTraitMod;
    const runDefense = (defTeam.defense.dl + defTeam.defense.lb) / 2;

    this.addDebug(`  ${rusher.position} ${formatPlayerName(rusher)} (OVR ${rusher.overall}${rusherTraitMod !== 0 ? ` ${rusherTraitMod >= 0 ? '+' : ''}${rusherTraitMod.toFixed(0)} trait` : ''})`);
    this.addDebug(`  vs Run D: DL(${defTeam.defense.dl}) + LB(${defTeam.defense.lb}) = ${runDefense.toFixed(0)}`);

    this.addDebugSection('YARDS');
    const baseYards = Math.floor(Math.random() * 8) + Math.floor(Math.random() * 5) - 2;
    const matchupYards = Math.round((rusherOvr - runDefense) * 0.1 + ovrDiff * 3);
    let yards = baseYards + matchupYards;
    const yardsBreakdown: string[] = [`Base: ${baseYards}`, `Matchup: ${matchupYards >= 0 ? '+' : ''}${matchupYards}`];

    // Badge bonus
    const badgeBonus = Math.round(getPlayBonuses(offTeam.badges, rusher.id, situation, 'run') * 0.3);
    if (badgeBonus > 0) {
      yards += badgeBonus;
      yardsBreakdown.push(`Badge: +${badgeBonus}`);
    }

    // Apply coaching YPC bonus
    const offCoaching = this.coachingModifiers[off];
    if (offCoaching && offCoaching.ypcBonus > 0) {
      const ypcBonus = Math.round(offCoaching.ypcBonus);
      yards += ypcBonus;
      yardsBreakdown.push(`YPC coach: +${ypcBonus}`);
    }

    // Apply red zone bonus from coaching (improved red zone TD rate helps running)
    if (situation.inRedZone && offCoaching && offCoaching.redZoneTdRate > 0) {
      const rzBonus = Math.round(offCoaching.redZoneTdRate * 2);
      yards += rzBonus;
      yardsBreakdown.push(`Red zone coach: +${rzBonus}`);
    }

    this.addDebug(`  Yards calculation: ${yardsBreakdown.join(', ')}`);
    this.addDebug(`  Initial yards: ${yards}`);

    // Big play check (aggressive trait bonus)
    const { bigPlayBonus } = getAggressiveModifiers(offTeam.traits, rusher.id);
    const bigPlayChance = 0.05 + ovrDiff * 0.02 + bigPlayBonus;
    const bigPlayRoll = Math.random();
    if (bigPlayRoll < bigPlayChance) {
      const bigPlayYards = Math.floor(Math.random() * 30) + 15;
      this.addDebug(`  BIG PLAY! (${(bigPlayChance * 100).toFixed(1)}% chance${bigPlayBonus > 0 ? `, aggressive: +${(bigPlayBonus * 100).toFixed(1)}%` : ''}, rolled ${(bigPlayRoll * 100).toFixed(0)})`);
      this.addDebug(`  Yards: ${yards} → ${bigPlayYards}`);
      yards = bigPlayYards;
    }

    // Fumble check
    this.addDebugSection('FUMBLE CHECK');
    const weather = WEATHER_MODIFIERS[this.settings.weather];
    let fumbleChance = 0.015 + weather.fumbleChance - ovrDiff * 0.005;
    const fumbleBreakdown = ['Base: 1.5%'];

    if (weather.fumbleChance !== 0) {
      fumbleBreakdown.push(`Weather: ${weather.fumbleChance >= 0 ? '+' : ''}${(weather.fumbleChance * 100).toFixed(1)}%`);
    }

    const injuryMod = getInjuryChanceModifier(offTeam.traits, rusher.id);
    if (injuryMod > 0) {
      fumbleChance *= 1 + injuryMod * 0.1;
      fumbleBreakdown.push(`Injury prone: +${(injuryMod * 10).toFixed(1)}%`);
    }

    // Defensive coaching turnover bonus
    const defCoaching = this.coachingModifiers[def];
    if (defCoaching && defCoaching.turnoverChance > 0) {
      fumbleChance += defCoaching.turnoverChance * 0.01;
      fumbleBreakdown.push(`DC turnover: +${(defCoaching.turnoverChance).toFixed(1)}%`);
    }

    const fumbleRoll = Math.random();
    this.addDebug(`  Fumble chance: ${(fumbleChance * 100).toFixed(2)}%`);
    this.addDebug(`    ${fumbleBreakdown.join(', ')}`);
    this.addDebug(`  Rolled ${(fumbleRoll * 100).toFixed(0)} → ${fumbleRoll < fumbleChance ? 'FUMBLE!' : 'Ball secure'}`);

    if (fumbleRoll < fumbleChance) {
      rusherStats.rushing.fumbles++;
      this.stats[off].fumbles++;
      return this.turnover(off, 'fumble', yards, rusher);
    }

    this.addDebug(`  Final: ${yards} yards`);

    rusherStats.rushing.yards += Math.max(0, yards);
    if (yards > rusherStats.rushing.long) rusherStats.rushing.long = yards;

    // Credit tackle to a defender
    const tackler = this.creditTackle(def, 'run');
    if (tackler) {
      this.addDebug(`  Tackled by ${formatPlayerName(tackler)}`);
    }

    return this.processYards(off, yards, 'run', rusher);
  }

  private simulatePass(off: 'away' | 'home', def: 'away' | 'home', ovrDiff: number, situation: GameSituation): PlayResult {
    const offTeam = this.settings[off]!;
    const defTeam = this.settings[def]!;
    const offDepthChart = offTeam.depthChart as Record<Position, string[]>;
    const defDepthChart = defTeam.depthChart as Record<Position, string[]>;

    const qb = getStarter(offTeam.roster, offDepthChart, Position.QB);
    const receiver = this.selectReceiver(offTeam); // Use rotation instead of always WR1
    const cb = getStarter(defTeam.roster, defDepthChart, Position.CB);

    if (!qb) {
      return { type: 'pass', result: 'incomplete', description: 'Pass incomplete.', yards: 0, time: 5 };
    }

    const qbStats = this.getPlayerStats(qb, off);
    qbStats.passing.attempts++;
    this.stats[off].attempts++;

    const qbTraitMod = getTraitModifier(offTeam.traits, qb.id, situation);
    const qbOvr = qb.overall + qbTraitMod;
    const receiverTraitMod = receiver ? getTraitModifier(offTeam.traits, receiver.id, situation) : 0;
    const receiverOvr = receiver ? receiver.overall + receiverTraitMod : 70;
    const olOvr = offTeam.offense.ol;
    const dlOvr = defTeam.defense.dl;
    const dbOvr = defTeam.defense.db;

    // Debug: Target selection
    this.addDebugSection('TARGET');
    const receiverName = receiver ? formatPlayerName(receiver) : 'Unknown';
    const receiverPos = receiver?.position || 'WR';
    const cbName = cb ? formatPlayerName(cb) : 'Unknown CB';
    this.addDebug(`  ${receiverPos} ${receiverName} (OVR ${receiver?.overall || 70}${receiverTraitMod !== 0 ? ` ${receiverTraitMod >= 0 ? '+' : ''}${receiverTraitMod.toFixed(0)} trait` : ''})`);
    this.addDebug(`  vs CB ${cbName} (OVR ${cb?.overall || dbOvr})`);
    this.addDebug(`  Matchup advantage: ${receiverOvr > dbOvr ? '+' : ''}${(receiverOvr - dbOvr).toFixed(0)}`);

    // Get coaching modifiers
    const offCoaching = this.coachingModifiers[off];
    const defCoaching = this.coachingModifiers[def];

    // Sack check with coaching modifiers
    this.addDebugSection('PROTECTION');
    let sackChance = 0.07 + (dlOvr - olOvr) * 0.005 - ovrDiff * 0.02;
    const sackBreakdown = [`Base: 7%`, `OL(${olOvr}) vs DL(${dlOvr}): ${((dlOvr - olOvr) * 0.5).toFixed(1)}%`];

    // Defensive pass rush bonus
    if (defCoaching && defCoaching.passRushBonus > 0) {
      sackChance += defCoaching.passRushBonus * 0.02;
      sackBreakdown.push(`Pass rush coach: +${(defCoaching.passRushBonus * 2).toFixed(1)}%`);
    }

    const finalSackChance = Math.max(0.02, sackChance);
    const sackRoll = Math.random();
    this.addDebug(`  Sack chance: ${(finalSackChance * 100).toFixed(1)}%`);
    this.addDebug(`    ${sackBreakdown.join(', ')}`);
    this.addDebug(`  Rolled ${(sackRoll * 100).toFixed(0)} → ${sackRoll < finalSackChance ? 'SACKED!' : 'Pocket holds'}`);

    if (sackRoll < finalSackChance) {
      const loss = -(Math.floor(Math.random() * 8) + 3);
      qbStats.passing.sacked++;
      this.stats[def].sacks++;

      // Credit defensive player with sack and tackle
      const de = getStarter(defTeam.roster, defDepthChart, Position.DE);
      if (de) {
        const deStats = this.getPlayerStats(de, def);
        deStats.defense.sacks++;
        deStats.defense.tackles++;
        this.addDebug(`  Sack by ${formatPlayerName(de)} for ${Math.abs(loss)} yard loss`);
      }

      return this.processYards(off, loss, 'sack', qb, de);
    }

    // Completion check with coaching modifiers
    this.addDebugSection('COMPLETION');
    const weather = WEATHER_MODIFIERS[this.settings.weather];
    let compRate = 0.65;
    const compBreakdown: string[] = ['Base: 65%'];

    const qbBonus = (qbOvr - 80) * 0.005;
    if (qbBonus !== 0) {
      compRate += qbBonus;
      compBreakdown.push(`QB(${qbOvr}): ${qbBonus >= 0 ? '+' : ''}${(qbBonus * 100).toFixed(1)}%`);
    }

    const matchupBonus = (receiverOvr - dbOvr) * 0.003;
    if (matchupBonus !== 0) {
      compRate += matchupBonus;
      compBreakdown.push(`Matchup: ${matchupBonus >= 0 ? '+' : ''}${(matchupBonus * 100).toFixed(1)}%`);
    }

    const ovrBonus = ovrDiff * 0.05;
    if (ovrBonus !== 0) {
      compRate += ovrBonus;
      compBreakdown.push(`Team OVR diff: ${ovrBonus >= 0 ? '+' : ''}${(ovrBonus * 100).toFixed(1)}%`);
    }

    if (weather.passAccuracy !== 0) {
      compRate += weather.passAccuracy;
      compBreakdown.push(`Weather: ${weather.passAccuracy >= 0 ? '+' : ''}${(weather.passAccuracy * 100).toFixed(1)}%`);
    }

    const badgeBonus = getPlayBonuses(offTeam.badges, qb.id, situation, 'pass') * 0.01;
    if (badgeBonus > 0) {
      compRate += badgeBonus;
      compBreakdown.push(`QB badges: +${(badgeBonus * 100).toFixed(1)}%`);
    }

    // Offensive coaching completion bonus
    if (offCoaching && offCoaching.completionBonus > 0) {
      compRate += offCoaching.completionBonus;
      compBreakdown.push(`OC bonus: +${(offCoaching.completionBonus * 100).toFixed(1)}%`);
    }

    // Defensive coverage bonus reduces completion
    if (defCoaching && defCoaching.coverageBonus > 0) {
      const coveragePenalty = defCoaching.coverageBonus * 0.5;
      compRate -= coveragePenalty;
      compBreakdown.push(`DC coverage: -${(coveragePenalty * 100).toFixed(1)}%`);
    }

    if (receiver) {
      const receiverStats = this.getPlayerStats(receiver, off);
      receiverStats.receiving.targets++;
    }

    this.addDebug(`  Completion chance: ${(compRate * 100).toFixed(1)}%`);
    this.addDebug(`    ${compBreakdown.join(', ')}`);

    const compRoll = Math.random();
    this.addDebug(`  Rolled ${(compRoll * 100).toFixed(0)} → ${compRoll < compRate ? 'COMPLETE!' : 'Incomplete'}`);

    if (compRoll >= compRate) {
      // Incomplete - check for INT
      this.addDebugSection('INTERCEPTION CHECK');
      let intChance = 0.08 - ovrDiff * 0.02 + (dbOvr - qbOvr) * 0.002;
      const intBreakdown = ['Base: 8%'];

      // Ball hawk bonus
      if (cb) {
        const ballHawk = getBallHawkModifier(defTeam.traits, cb.id);
        const cbBadge = getPlayBonuses(defTeam.badges, cb.id, situation, 'cover') * 0.005;
        if (ballHawk > 0) {
          intChance += ballHawk;
          intBreakdown.push(`Ball Hawk: +${(ballHawk * 100).toFixed(1)}%`);
        }
        if (cbBadge > 0) {
          intChance += cbBadge;
          intBreakdown.push(`CB badge: +${(cbBadge * 100).toFixed(1)}%`);
        }
      }

      // Defensive turnover coaching bonus
      if (defCoaching && defCoaching.turnoverChance > 0) {
        intChance += defCoaching.turnoverChance * 0.01;
        intBreakdown.push(`DC turnover: +${(defCoaching.turnoverChance).toFixed(1)}%`);
      }

      const finalIntChance = Math.max(0.02, intChance);
      const intRoll = Math.random();
      this.addDebug(`  INT chance: ${(finalIntChance * 100).toFixed(1)}%`);
      this.addDebug(`    ${intBreakdown.join(', ')}`);
      this.addDebug(`  Rolled ${(intRoll * 100).toFixed(0)} → ${intRoll < finalIntChance ? 'INTERCEPTED!' : 'Pass falls incomplete'}`);

      if (intRoll < finalIntChance) {
        qbStats.passing.interceptions++;
        this.stats[off].interceptions++;

        if (cb) {
          const cbStats = this.getPlayerStats(cb, def);
          cbStats.defense.interceptions++;
        }

        return this.turnover(off, 'interception', 0, qb, cb);
      }

      return { type: 'pass', result: 'incomplete', description: 'Pass incomplete.', yards: 0, time: 5 };
    }

    // Completion!
    qbStats.passing.completions++;
    this.stats[off].completions++;

    // Determine pass depth based on scheme when available
    this.addDebugSection('YARDS');
    let yards: number;
    let passDepthStr = 'medium';
    if (offTeam.offensiveScheme) {
      const passDepth = determinePassDepth(offTeam.offensiveScheme);
      passDepthStr = passDepth;
      const yardRange = getPassYardsRange(passDepth);
      const baseYards = Math.floor(Math.random() * (yardRange.max - yardRange.min)) + yardRange.min;
      const matchupYards = Math.round((receiverOvr - dbOvr) * 0.15);
      yards = baseYards + matchupYards;
      this.addDebug(`  Pass depth: ${passDepth.toUpperCase()} (${yardRange.min}-${yardRange.max} range)`);
      this.addDebug(`  Base yards: ${baseYards}, Matchup: ${matchupYards >= 0 ? '+' : ''}${matchupYards}`);
    } else {
      // Legacy yards calculation
      const baseYards = Math.floor(Math.random() * 12) + Math.floor(Math.random() * 6);
      const modYards = Math.round((receiverOvr - dbOvr) * 0.2 + ovrDiff * 5);
      yards = baseYards + modYards;
      this.addDebug(`  Base yards: ${baseYards}, Modifiers: ${modYards >= 0 ? '+' : ''}${modYards}`);
    }

    // Apply red zone bonus from coaching
    if (situation.inRedZone && offCoaching && offCoaching.redZoneTdRate > 0) {
      const rzBonus = Math.round(offCoaching.redZoneTdRate * 1.5);
      yards += rzBonus;
      this.addDebug(`  Red zone coaching: +${rzBonus}`);
    }

    // Big play check
    const bigPlayChance = 0.08 + ovrDiff * 0.03;
    const bigPlayRoll = Math.random();
    if (bigPlayRoll < bigPlayChance) {
      const bigPlayYards = Math.floor(Math.random() * 40) + 20;
      this.addDebug(`  BIG PLAY! (${(bigPlayChance * 100).toFixed(0)}% chance, rolled ${(bigPlayRoll * 100).toFixed(0)})`);
      this.addDebug(`  Yards: ${yards} → ${bigPlayYards}`);
      yards = bigPlayYards;
    }

    this.addDebug(`  Final: ${yards} yards (${passDepthStr} ${receiverPos} route)`);

    qbStats.passing.yards += yards;

    if (receiver) {
      const receiverStats = this.getPlayerStats(receiver, off);
      receiverStats.receiving.catches++;
      receiverStats.receiving.yards += yards;
      if (yards > receiverStats.receiving.long) receiverStats.receiving.long = yards;
    }

    // Credit tackle to a defender on completed passes
    const tackler = this.creditTackle(def, 'pass');
    if (tackler) {
      this.addDebug(`  Tackled by ${formatPlayerName(tackler)}`);
    }

    return this.processYards(off, yards, 'pass', receiver || qb);
  }

  private simulatePunt(off: 'away' | 'home'): PlayResult {
    const offTeam = this.settings[off]!;
    const depthChart = offTeam.depthChart as Record<Position, string[]>;
    const punter = getStarter(offTeam.roster, depthChart, Position.P);

    const distance = Math.floor(Math.random() * 20) + 35;
    const isTouchback = Math.random() < 0.15;

    if (punter) {
      const pStats = this.getPlayerStats(punter, off);
      pStats.kicking.punts++;
      pStats.kicking.puntYards += distance;
    }

    if (off === 'away') {
      this.state.ball = isTouchback ? 80 : Math.min(95, this.state.ball + distance);
    } else {
      this.state.ball = isTouchback ? 20 : Math.max(5, this.state.ball - distance);
    }

    this.changePossession();

    return {
      type: 'punt',
      result: isTouchback ? 'touchback' : 'normal',
      description: `Punt for ${distance} yards.${isTouchback ? ' Touchback.' : ''}`,
      yards: distance,
      time: 5,
      playerId: punter?.id,
    };
  }

  private simulateFieldGoal(off: 'away' | 'home', situation: GameSituation): PlayResult {
    const offTeam = this.settings[off]!;
    const depthChart = offTeam.depthChart as Record<Position, string[]>;
    const kicker = getStarter(offTeam.roster, depthChart, Position.K);

    const distance = off === 'away' ? (100 - this.state.ball) + 17 : this.state.ball + 17;
    const kickerOvr = kicker?.overall || 75;

    this.addDebugSection('FIELD GOAL');
    const kickerName = kicker ? formatPlayerName(kicker) : 'Unknown';
    this.addDebug(`  K ${kickerName} (OVR ${kickerOvr})`);
    this.addDebug(`  Distance: ${distance} yards`);

    const weather = WEATHER_MODIFIERS[this.settings.weather];
    const baseRate = Math.max(0.3, 1 - (distance - 20) * 0.015);
    let successRate = baseRate;
    const rateBreakdown = [`Base (${distance}yd): ${(baseRate * 100).toFixed(0)}%`];

    const kickerBonus = (kickerOvr - 80) * 0.005;
    if (kickerBonus !== 0) {
      successRate += kickerBonus;
      rateBreakdown.push(`Kicker OVR: ${kickerBonus >= 0 ? '+' : ''}${(kickerBonus * 100).toFixed(1)}%`);
    }

    if (weather.fieldGoalAccuracy !== 0) {
      successRate += weather.fieldGoalAccuracy;
      rateBreakdown.push(`Weather: ${weather.fieldGoalAccuracy >= 0 ? '+' : ''}${(weather.fieldGoalAccuracy * 100).toFixed(1)}%`);
    }

    // Apply special teams coaching bonus (kicker/punter rating bonus)
    const offCoaching = this.coachingModifiers[off];
    if (offCoaching && offCoaching.kpRatingBonus > 0) {
      const stBonus = offCoaching.kpRatingBonus * 0.01;
      successRate += stBonus;
      rateBreakdown.push(`ST coach: +${(stBonus * 100).toFixed(1)}%`);
    }

    // Clutch penalty
    if (this.isClutch()) {
      successRate -= 0.05;
      rateBreakdown.push('Clutch pressure: -5%');
      // Clutch kicker badge bonus
      if (kicker) {
        const clutchBonus = getPlayBonuses(offTeam.badges, kicker.id, situation, 'kick') * 0.02;
        if (clutchBonus > 0) {
          successRate += clutchBonus;
          rateBreakdown.push(`Clutch badge: +${(clutchBonus * 100).toFixed(1)}%`);
        }
      }
    }

    this.addDebug(`  Success rate: ${(successRate * 100).toFixed(1)}%`);
    this.addDebug(`    ${rateBreakdown.join(', ')}`);

    if (kicker) {
      const kStats = this.getPlayerStats(kicker, off);
      kStats.kicking.fgAttempts++;
    }

    const fgRoll = Math.random();
    this.addDebug(`  Rolled ${(fgRoll * 100).toFixed(0)} → ${fgRoll < successRate ? 'GOOD!' : 'NO GOOD'}`);

    if (fgRoll < successRate) {
      if (off === 'away') this.state.awayScore += 3;
      else this.state.homeScore += 3;

      if (kicker) {
        const kStats = this.getPlayerStats(kicker, off);
        kStats.kicking.fgMade++;
      }

      this.state.isKickoff = true;
      return {
        type: 'fg',
        result: 'fg_made',
        description: `${distance}-yard FG is GOOD!`,
        yards: 0,
        time: 5,
        playerId: kicker?.id,
      };
    }

    this.changePossession();
    return {
      type: 'fg',
      result: 'fg_missed',
      description: `${distance}-yard FG is NO GOOD.`,
      yards: 0,
      time: 5,
      playerId: kicker?.id,
    };
  }

  // ============================================================================
  // RESULT PROCESSING
  // ============================================================================

  private processYards(off: 'away' | 'home', yards: number, type: 'run' | 'pass' | 'sack', player?: Player, defender?: Player): PlayResult {
    // Update ball position
    if (off === 'away') {
      this.state.ball = Math.max(0, Math.min(100, this.state.ball + yards));
    } else {
      this.state.ball = Math.max(0, Math.min(100, this.state.ball - yards));
    }

    // Update stats
    if (type === 'run' && yards > 0) {
      this.stats[off].rushYards += yards;
      this.stats[off].yards += yards;
    } else if (type === 'pass' && yards > 0) {
      this.stats[off].passYards += yards;
      this.stats[off].yards += yards;
    } else if (type === 'sack') {
      this.stats[off].passYards += yards;
      this.stats[off].yards += yards;
    }

    // Touchdown check
    if ((off === 'away' && this.state.ball >= 100) || (off === 'home' && this.state.ball <= 0)) {
      this.addDebugSection('RESULT');
      this.addDebug(`  TOUCHDOWN! (${yards} yards)`);
      return this.touchdown(off, yards, type, player);
    }

    // First down check
    this.state.yardsToGo -= yards;
    if (this.state.yardsToGo <= 0) {
      this.stats[off].firstDowns++;
      this.state.down = 1;
      this.state.yardsToGo = 10;
      this.addDebugSection('RESULT');
      this.addDebug(`  FIRST DOWN at ${this.getYardLine()}`);
      return {
        type: type as PlayType,
        result: 'first_down',
        description: this.playDescription(type, yards, player),
        yards,
        time: Math.floor(Math.random() * 15) + 25,
        playerId: player?.id,
      };
    }

    // Normal down progression
    this.state.down++;
    if (this.state.down > 4) {
      this.changePossession();
      this.addDebugSection('RESULT');
      this.addDebug(`  TURNOVER ON DOWNS`);
      return {
        type: type as PlayType,
        result: 'turnover_downs',
        description: this.playDescription(type, yards, player) + ' Turnover on downs.',
        yards,
        time: Math.floor(Math.random() * 15) + 25,
        playerId: player?.id,
      };
    }

    this.addDebugSection('RESULT');
    const yardStr = yards >= 0 ? `+${yards}` : `${yards}`;
    this.addDebug(`  ${yardStr} yards → ${this.state.down}${this.ordinal(this.state.down)} & ${this.state.yardsToGo}`);

    return {
      type: type as PlayType,
      result: type === 'sack' ? 'sack' : 'normal',
      description: this.playDescription(type, yards, player),
      yards,
      time: Math.floor(Math.random() * 15) + 25,
      playerId: player?.id,
      defenderId: defender?.id,
    };
  }

  private touchdown(off: 'away' | 'home', yards: number, type: 'run' | 'pass' | 'sack', player?: Player): PlayResult {
    const offTeam = this.settings[off]!;
    const depthChart = offTeam.depthChart as Record<Position, string[]>;

    if (off === 'away') this.state.awayScore += 6;
    else this.state.homeScore += 6;

    if (type === 'run') {
      this.stats[off].rushTDs++;
      if (player) {
        const stats = this.getPlayerStats(player, off);
        stats.rushing.touchdowns++;
      }
    } else if (type === 'pass') {
      this.stats[off].passTDs++;
      if (player) {
        const stats = this.getPlayerStats(player, off);
        stats.receiving.touchdowns++;
      }
      // Also credit QB
      const qb = getStarter(offTeam.roster, depthChart, Position.QB);
      if (qb) {
        const qbStats = this.getPlayerStats(qb, off);
        qbStats.passing.touchdowns++;
      }
    }

    // Extra point
    const kicker = getStarter(offTeam.roster, depthChart, Position.K);
    const xpSuccess = Math.random() < 0.94 + ((kicker?.overall || 75) - 80) * 0.003;

    if (kicker) {
      const kStats = this.getPlayerStats(kicker, off);
      kStats.kicking.xpAttempts++;
      if (xpSuccess) kStats.kicking.xpMade++;
    }

    if (xpSuccess) {
      if (off === 'away') this.state.awayScore += 1;
      else this.state.homeScore += 1;
    }

    this.state.isKickoff = true;

    const playerName = player ? formatPlayerName(player) : 'Unknown';
    return {
      type: 'td',
      result: 'touchdown',
      description: `TOUCHDOWN! ${type === 'pass' ? 'Pass' : 'Rush'} for ${yards} yards by ${playerName}! XP ${xpSuccess ? 'GOOD' : 'NO GOOD'}.`,
      yards,
      time: 10,
      playerId: player?.id,
    };
  }

  private turnover(off: 'away' | 'home', type: 'fumble' | 'interception', yards: number, offPlayer?: Player, defPlayer?: Player): PlayResult {
    this.changePossession();

    const desc = type === 'interception' ? 'INTERCEPTED!' : 'FUMBLE RECOVERED!';
    const defName = defPlayer ? formatPlayerName(defPlayer) : '';

    return {
      type: 'turnover',
      result: type === 'interception' ? 'interception' : 'fumble',
      description: `${desc}${defName ? ` by ${defName}` : ''}`,
      yards: 0,
      time: 5,
      playerId: offPlayer?.id,
      defenderId: defPlayer?.id,
    };
  }

  private playDescription(type: 'run' | 'pass' | 'sack', yards: number, player?: Player): string {
    const team = this.settings[this.state.possession as 'away' | 'home']!;
    const playerName = player ? formatPlayerName(player) : team.name;

    if (type === 'run') {
      if (yards < 0) return `${playerName} run for loss of ${Math.abs(yards)}.`;
      if (yards === 0) return `${playerName} run for no gain.`;
      return `${playerName} run for ${yards} yards.`;
    }
    if (type === 'pass') {
      return `${playerName} catch for ${yards} yards.`;
    }
    if (type === 'sack') {
      return `QB sacked for ${Math.abs(yards)} yard loss!`;
    }
    return `Play for ${yards} yards.`;
  }

  private applyPenalty(original: PlayResult, off: 'away' | 'home', def: 'away' | 'home'): PlayResult {
    const penalties = [
      { name: 'False Start', yards: 5, onOffense: true },
      { name: 'Holding', yards: 10, onOffense: true },
      { name: 'Pass Interference', yards: 15, onOffense: false },
      { name: 'Offsides', yards: 5, onOffense: false },
    ];

    const penalty = penalties[Math.floor(Math.random() * penalties.length)];
    const onTeam = penalty.onOffense ? off : def;
    this.stats[onTeam].penalties++;

    if (penalty.onOffense) {
      if (off === 'away') {
        this.state.ball = Math.max(1, this.state.ball - penalty.yards);
      } else {
        this.state.ball = Math.min(99, this.state.ball + penalty.yards);
      }
    } else {
      if (off === 'away') {
        this.state.ball = Math.min(99, this.state.ball + penalty.yards);
      } else {
        this.state.ball = Math.max(1, this.state.ball - penalty.yards);
      }
      this.state.down = 1;
      this.state.yardsToGo = 10;
    }

    const teamName = this.settings[onTeam]!.name;
    return {
      type: 'penalty',
      result: 'penalty',
      description: `${penalty.name} on ${teamName}, ${penalty.yards} yards.`,
      yards: penalty.onOffense ? -penalty.yards : penalty.yards,
      time: 0,
    };
  }

  // ============================================================================
  // BULK SIMULATION
  // ============================================================================

  simulateDrive(): PlayResult[] {
    const results: PlayResult[] = [];
    const startPossession = this.state.possession;
    let playCount = 0;

    while (!this.state.isOver && this.state.possession === startPossession && playCount < 25) {
      const result = this.play();
      if (result) {
        results.push(result);
        if (['td', 'to', 'fg', 'punt'].includes(result.type)) break;
      }
      playCount++;
    }

    return results;
  }

  simulateQuarter(): PlayResult[] {
    const results: PlayResult[] = [];
    const startQuarter = this.state.quarter;

    while (!this.state.isOver && this.state.quarter === startQuarter) {
      const result = this.play();
      if (result) results.push(result);
    }

    return results;
  }

  simulateGame(): PlayResult[] {
    const results: PlayResult[] = [];

    while (!this.state.isOver) {
      const result = this.play();
      if (result) results.push(result);
    }

    return results;
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  getPlayerGameStats(): PlayerGameStats[] {
    return Array.from(this.playerStats.values());
  }

  getWinner(): 'away' | 'home' | 'tie' {
    if (this.state.awayScore > this.state.homeScore) return 'away';
    if (this.state.homeScore > this.state.awayScore) return 'home';
    return 'tie';
  }
}
