'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  WeekNavigation,
  GameCard,
  ByeWeekRow,
  GamePreviewModal,
} from '@/components/schedule';
import { BoxScoreModal } from '@/components/franchise/box-score-modal';
import { getSchedule, getWeekScheduleByNumber } from '@/lib/schedule/schedule-store';
import { LeagueSchedule, ScheduledGame } from '@/lib/schedule/types';
import { GameResult, SeasonState } from '@/lib/season/types';
import { getTeamById } from '@/lib/data/teams';
import { useCareerStore } from '@/stores/career-store';

const SEASON_STATE_KEY = 'seasonState';

export default function SchedulePage() {
  const { selectedTeam } = useCareerStore();
  const [schedule, setSchedule] = useState<LeagueSchedule | null>(null);
  const [seasonState, setSeasonState] = useState<SeasonState | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [previewGame, setPreviewGame] = useState<ScheduledGame | null>(null);
  const [boxScoreGame, setBoxScoreGame] = useState<GameResult | null>(null);

  // Load schedule and season state from session storage
  useEffect(() => {
    const loadedSchedule = getSchedule();
    setSchedule(loadedSchedule);

    // Try to load season state for completed games
    const storedSeasonState = sessionStorage.getItem(SEASON_STATE_KEY);
    if (storedSeasonState) {
      try {
        const parsed = JSON.parse(storedSeasonState);
        setSeasonState(parsed);
        // Default to current week in season
        setCurrentWeek(parsed.week || 1);
      } catch {
        // Ignore parse errors
      }
    }

    setIsLoading(false);
  }, []);

  // Get current week's schedule
  const weekSchedule = useMemo(() => {
    if (!schedule) return null;
    return getWeekScheduleByNumber(currentWeek);
  }, [schedule, currentWeek]);

  // Get completed games for current week
  const completedGamesMap = useMemo(() => {
    const map = new Map<string, GameResult>();
    if (!seasonState?.completedGames) return map;

    for (const game of seasonState.completedGames) {
      if (game.week === currentWeek) {
        // Key by both team IDs to find match
        map.set(`${game.awayTeamId}-${game.homeTeamId}`, game);
      }
    }
    return map;
  }, [seasonState, currentWeek]);

  // Find result for a scheduled game
  const getGameResult = (game: ScheduledGame): GameResult | undefined => {
    return completedGamesMap.get(`${game.awayTeamId}-${game.homeTeamId}`);
  };

  // Handle game click
  const handleGameClick = (game: ScheduledGame, result?: GameResult) => {
    if (result) {
      // Show box score modal
      setBoxScoreGame(result);
    } else {
      // Show preview modal
      setPreviewGame(game);
    }
  };

  // Get user's team ID (for highlighting)
  const userTeamId = selectedTeam?.id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Empty state - no schedule generated
  if (!schedule || !weekSchedule) {
    return (
      <div>
        <main className="px-5 pt-4">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold mb-4">
              S
            </div>
            <p className="text-muted-foreground mb-2">No schedule generated yet</p>
            <p className="text-sm text-muted-foreground">
              Generate a schedule from the Dev Tools to see it here
            </p>
          </div>
        </main>
      </div>
    );
  }

  const awayTeam = boxScoreGame ? getTeamById(boxScoreGame.awayTeamId) : null;
  const homeTeam = boxScoreGame ? getTeamById(boxScoreGame.homeTeamId) : null;

  return (
    <div>
      <main className="px-5 pt-4 pb-8">
        {/* Week Navigation */}
        <div className="mb-6">
          <WeekNavigation
            currentWeek={currentWeek}
            totalWeeks={18}
            season={schedule.season}
            onWeekChange={setCurrentWeek}
          />
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {weekSchedule.games.map((game) => {
            const result = getGameResult(game);
            return (
              <GameCard
                key={game.id}
                game={game}
                result={result}
                userTeamId={userTeamId}
                onGameClick={handleGameClick}
              />
            );
          })}
        </div>

        {/* Bye Week Teams */}
        {weekSchedule.byeTeams && weekSchedule.byeTeams.length > 0 && (
          <ByeWeekRow teamIds={weekSchedule.byeTeams} />
        )}
      </main>

      {/* Preview Modal (upcoming games) */}
      <GamePreviewModal
        game={previewGame}
        open={!!previewGame}
        onOpenChange={(open) => !open && setPreviewGame(null)}
      />

      {/* Box Score Modal (finished games) */}
      <BoxScoreModal
        game={boxScoreGame}
        awayTeam={awayTeam ? { id: awayTeam.id, abbrev: awayTeam.id, name: awayTeam.name, city: awayTeam.city } : null}
        homeTeam={homeTeam ? { id: homeTeam.id, abbrev: homeTeam.id, name: homeTeam.name, city: homeTeam.city } : null}
        open={!!boxScoreGame}
        onOpenChange={(open) => !open && setBoxScoreGame(null)}
      />
    </div>
  );
}
