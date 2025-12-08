'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, FastForward, Zap, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getSchedule, getWeekScheduleByNumber } from '@/lib/schedule/schedule-store';
import { getTeamById as getTeamRosterById } from '@/lib/dev-player-store';
import { simulateGameWithRosters } from '@/lib/sim/game-runner';
import { SeasonState, GameResult } from '@/lib/season/types';
import { ScheduledGame } from '@/lib/schedule/types';
import { PlayResult, ScoringPlay } from '@/lib/sim/types';

const SEASON_STATE_KEY = 'seasonState';

// Extract scoring plays from play-by-play results
function extractScoringPlays(plays: PlayResult[]): ScoringPlay[] {
  const scoringPlays: ScoringPlay[] = [];
  let awayScore = 0;
  let homeScore = 0;
  let quarter = 1;
  let clock = 900; // 15:00 in seconds

  const formatClock = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  for (const play of plays) {
    // Track time - advance clock
    clock = Math.max(0, clock - play.time);
    if (clock <= 0 && quarter < 4) {
      quarter++;
      clock = 900;
    }

    // Use possession from the play itself
    const team = play.possession;

    // Check for scoring plays
    if (play.result === 'touchdown') {
      if (team === 'away') awayScore += 6;
      else homeScore += 6;

      // Check if XP is included in the description
      const hasXP = play.description.toLowerCase().includes('xp good') ||
                    (play.description.toLowerCase().includes('xp') &&
                     !play.description.toLowerCase().includes('no good'));
      if (hasXP) {
        if (team === 'away') awayScore += 1;
        else homeScore += 1;
      }

      scoringPlays.push({
        quarter,
        clock: formatClock(clock),
        team,
        type: 'TD',
        description: play.description,
        awayScore,
        homeScore,
      });
    } else if (play.result === 'fg_made') {
      if (team === 'away') awayScore += 3;
      else homeScore += 3;

      scoringPlays.push({
        quarter,
        clock: formatClock(clock),
        team,
        type: 'FG',
        description: play.description,
        awayScore,
        homeScore,
      });
    }
  }

  return scoringPlays;
}

interface SimOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userTeamId: string;
}

export function SimOptionsModal({ open, onOpenChange, userTeamId }: SimOptionsModalProps) {
  const router = useRouter();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState('');

  // Get or create season state
  const getSeasonState = (): SeasonState => {
    const stored = sessionStorage.getItem(SEASON_STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize new season state
    return {
      year: 2025,
      week: 1,
      phase: 'regular',
      schedule: [],
      standings: [],
      completedGames: [],
      injuries: [],
      playoffBracket: null,
    };
  };

  const saveSeasonState = (state: SeasonState) => {
    try {
      sessionStorage.setItem(SEASON_STATE_KEY, JSON.stringify(state));
    } catch (e) {
      // If quota exceeded, try clearing old data and saving again
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old season data...');
        sessionStorage.removeItem(SEASON_STATE_KEY);
        try {
          sessionStorage.setItem(SEASON_STATE_KEY, JSON.stringify(state));
        } catch {
          console.error('Still cannot save after clearing - data too large');
        }
      }
    }
  };

  // Simulate a single game with timeout protection
  const simulateGame = (game: ScheduledGame, week: number): GameResult | null => {
    const awayTeam = getTeamRosterById(game.awayTeamId);
    const homeTeam = getTeamRosterById(game.homeTeamId);

    if (!awayTeam || !homeTeam) {
      console.error(`Missing team data for ${game.awayTeamId} vs ${game.homeTeamId}`);
      return null;
    }

    try {
      const startTime = Date.now();
      const result = simulateGameWithRosters(awayTeam, homeTeam, {
        gameType: game.isPrimeTime ? 'primetime' : 'regular',
      });
      const elapsed = Date.now() - startTime;

      // Log slow simulations for debugging
      if (elapsed > 500) {
        console.warn(`Slow game sim (${elapsed}ms): ${game.awayTeamId} @ ${game.homeTeamId}`);
      }

      // Is this the user's game?
      const isUserGame = game.awayTeamId === userTeamId || game.homeTeamId === userTeamId;

      // Convert to season GameResult format (minimal data to save storage space)
      return {
        gameId: game.id,
        week,
        awayTeamId: game.awayTeamId,
        homeTeamId: game.homeTeamId,
        awayScore: result.awayScore,
        homeScore: result.homeScore,
        awayStats: result.teamStats.away,
        homeStats: result.teamStats.home,
        // Don't store full playerStats to save storage - only store for user's games
        playerStats: isUserGame ? result.playerStats : [],
        // Extract scoring plays for user's games
        scoringPlays: isUserGame ? extractScoringPlays(result.plays) : undefined,
        isPrimetime: game.isPrimeTime || false,
        isPlayoff: false,
      };
    } catch (error) {
      console.error(`Error simulating game ${game.awayTeamId} @ ${game.homeTeamId}:`, error);
      return null;
    }
  };

  // Find user's next game
  const findNextGame = (): ScheduledGame | null => {
    const state = getSeasonState();
    const schedule = getSchedule();
    if (!schedule) return null;

    // Look for user's next unplayed game starting from current week
    for (let week = state.week; week <= 18; week++) {
      const weekSchedule = getWeekScheduleByNumber(week);
      if (!weekSchedule) continue;

      const userGame = weekSchedule.games.find(
        g => g.awayTeamId === userTeamId || g.homeTeamId === userTeamId
      );

      if (userGame) {
        // Check if already played
        const alreadyPlayed = state.completedGames.some(
          cg => cg.gameId === userGame.id ||
            (cg.awayTeamId === userGame.awayTeamId && cg.homeTeamId === userGame.homeTeamId && cg.week === week)
        );

        if (!alreadyPlayed) {
          return userGame;
        }
      }
    }

    return null;
  };

  // Handle Play Game - navigate to game simulator with user's next game
  const handlePlayGame = () => {
    const nextGame = findNextGame();

    if (nextGame) {
      // Store the game info for the simulator to read
      sessionStorage.setItem('pendingGame', JSON.stringify({
        awayTeamId: nextGame.awayTeamId,
        homeTeamId: nextGame.homeTeamId,
        week: nextGame.week,
        gameId: nextGame.id,
        isPrimeTime: nextGame.isPrimeTime,
      }));
    }

    onOpenChange(false);
    router.push('/dashboard/dev-tools/sim');
  };

  // Handle Sim Week
  const handleSimWeek = async () => {
    setIsSimulating(true);
    const state = getSeasonState();
    const schedule = getSchedule();

    if (!schedule) {
      setSimProgress('No schedule found. Generate a schedule first.');
      setIsSimulating(false);
      return;
    }

    const weekSchedule = getWeekScheduleByNumber(state.week);
    if (!weekSchedule) {
      setSimProgress(`No games found for week ${state.week}`);
      setIsSimulating(false);
      return;
    }

    setSimProgress(`Simulating Week ${state.week}...`);

    // Simulate each game in the week
    const newResults: GameResult[] = [];
    for (let i = 0; i < weekSchedule.games.length; i++) {
      const game = weekSchedule.games[i];

      // Check if already simulated
      const alreadyPlayed = state.completedGames.some(
        g => g.gameId === game.id || (g.awayTeamId === game.awayTeamId && g.homeTeamId === game.homeTeamId && g.week === state.week)
      );

      if (alreadyPlayed) continue;

      setSimProgress(`Game ${i + 1}/${weekSchedule.games.length}: ${game.awayTeamId} @ ${game.homeTeamId}`);

      const result = simulateGame(game, state.week);
      if (result) {
        newResults.push(result);
      }

      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Update state
    state.completedGames = [...state.completedGames, ...newResults];
    state.week = Math.min(state.week + 1, 18);
    saveSeasonState(state);

    setSimProgress(`Week complete! ${newResults.length} games simulated.`);

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('seasonStateUpdated'));

    setTimeout(() => {
      setIsSimulating(false);
      setSimProgress('');
      onOpenChange(false);
      router.refresh();
    }, 1000);
  };

  // Handle Sim Season
  const handleSimSeason = async () => {
    setIsSimulating(true);
    setSimProgress('Starting...');

    let totalGames = 0;
    let failedGames = 0;

    try {
      // Brief delay to let UI update
      await new Promise(resolve => setTimeout(resolve, 50));

      const state = getSeasonState();
      const schedule = getSchedule();

      if (!schedule) {
        setSimProgress('No schedule found.');
        return;
      }

      const totalWeeks = schedule.weeks?.length || 18;

      // Simulate all remaining weeks
      for (let week = state.week; week <= totalWeeks; week++) {
        setSimProgress(`Week ${week}/${totalWeeks}`);

        const weekSchedule = getWeekScheduleByNumber(week);
        if (!weekSchedule?.games) continue;

        for (const game of weekSchedule.games) {
          const alreadyPlayed = state.completedGames.some(
            g => g.gameId === game.id ||
              (g.awayTeamId === game.awayTeamId && g.homeTeamId === game.homeTeamId && g.week === week)
          );

          if (alreadyPlayed) continue;

          try {
            const result = simulateGame(game, week);
            if (result) {
              state.completedGames.push(result);
              totalGames++;
            } else {
              failedGames++;
            }
          } catch (error) {
            failedGames++;
          }
        }

        state.week = week + 1;

        // Let UI breathe every few weeks
        if (week % 4 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      // Final save
      state.week = totalWeeks;
      state.phase = 'playoffs';
      saveSeasonState(state);

      setSimProgress(`Done! ${totalGames} games`);
    } catch (error) {
      console.error('Season sim error:', error);
      setSimProgress('Error occurred');
    } finally {
      // ALWAYS stop spinner
      setIsSimulating(false);

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('seasonStateUpdated'));

      // Close modal after brief delay
      setTimeout(() => {
        onOpenChange(false);
        router.refresh();
      }, 800);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md p-0 border-zinc-800 bg-zinc-950">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-lg font-bold text-white">Advance Season</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-3">
          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-zinc-400">{simProgress}</p>
            </div>
          ) : (
            <>
              {/* Play Game */}
              <button
                onClick={handlePlayGame}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-600/20 text-green-500">
                  <Play className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Play Game</div>
                  <div className="text-sm text-zinc-400">Control your next game live</div>
                </div>
              </button>

              {/* Sim Week */}
              <button
                onClick={handleSimWeek}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600/20 text-blue-500">
                  <FastForward className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Sim Week</div>
                  <div className="text-sm text-zinc-400">Simulate all games this week</div>
                </div>
              </button>

              {/* Sim Season */}
              <button
                onClick={handleSimSeason}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-600/20 text-amber-500">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Sim Season</div>
                  <div className="text-sm text-zinc-400">Simulate remaining season</div>
                </div>
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
