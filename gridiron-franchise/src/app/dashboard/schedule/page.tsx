'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { BoxScoreModal } from '@/components/franchise/box-score-modal';
import { GameCard } from '@/components/schedule/game-card';
import { GamePreviewModal } from '@/components/schedule/game-preview-modal';
import { getSchedule, getTeamScheduleById, getWeekScheduleByNumber } from '@/lib/schedule/schedule-store';
import { LeagueSchedule, TeamSchedule, ScheduledGame, WeekSchedule } from '@/lib/schedule/types';
import { GameResult, SeasonState } from '@/lib/season/types';
import { getTeamById, LEAGUE_TEAMS } from '@/lib/data/teams';
import { useCareerStore } from '@/stores/career-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SEASON_STATE_KEY = 'seasonState';

export default function SchedulePage() {
  const { selectedTeam } = useCareerStore();
  const [schedule, setSchedule] = useState<LeagueSchedule | null>(null);
  const [seasonState, setSeasonState] = useState<SeasonState | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(selectedTeam?.id || '');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const weekRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Modal state
  const [previewGame, setPreviewGame] = useState<ScheduledGame | null>(null);
  const [boxScoreGame, setBoxScoreGame] = useState<GameResult | null>(null);

  // Load schedule and season state
  useEffect(() => {
    const loadedSchedule = getSchedule();
    setSchedule(loadedSchedule);

    // Set default team from career store
    if (selectedTeam?.id) {
      setSelectedTeamId(selectedTeam.id);
    }

    // Try to load season state for completed games
    const storedSeasonState = sessionStorage.getItem(SEASON_STATE_KEY);
    if (storedSeasonState) {
      try {
        const parsed = JSON.parse(storedSeasonState);
        setSeasonState(parsed);
        setSelectedWeek(parsed.week || 1);
      } catch {
        // Ignore parse errors
      }
    }

    setIsLoading(false);
  }, [selectedTeam]);

  // Get selected team's schedule (if specific team selected)
  const teamSchedule: TeamSchedule | null = useMemo(() => {
    if (!schedule || !selectedTeamId || selectedTeamId === 'all') return null;
    return getTeamScheduleById(selectedTeamId);
  }, [schedule, selectedTeamId]);

  // Get week schedule (if "all" selected)
  const weekSchedule = useMemo(() => {
    if (!schedule || selectedTeamId !== 'all') return null;
    return getWeekScheduleByNumber(selectedWeek);
  }, [schedule, selectedTeamId, selectedWeek]);

  // Get completed games map
  const completedGamesMap = useMemo(() => {
    const map = new Map<string, GameResult>();
    if (!seasonState?.completedGames) return map;

    for (const game of seasonState.completedGames) {
      map.set(`${game.awayTeamId}-${game.homeTeamId}`, game);
    }
    return map;
  }, [seasonState]);

  // Find result for a scheduled game
  const getGameResult = (game: ScheduledGame): GameResult | undefined => {
    return completedGamesMap.get(`${game.awayTeamId}-${game.homeTeamId}`);
  };

  // Scroll to selected week
  useEffect(() => {
    const weekEl = weekRefs.current.get(selectedWeek);
    if (weekEl) {
      weekEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedWeek]);

  // Build week items (games + bye)
  const weekItems = useMemo(() => {
    if (!teamSchedule) return [];

    const items: { week: number; game: ScheduledGame | null; isBye: boolean }[] = [];

    for (let week = 1; week <= 18; week++) {
      if (week === teamSchedule.byeWeek) {
        items.push({ week, game: null, isBye: true });
      } else {
        const game = teamSchedule.games.find((g) => g.week === week);
        items.push({ week, game: game || null, isBye: false });
      }
    }

    return items;
  }, [teamSchedule]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Empty state
  if (!schedule) {
    return (
      <div>
        <main className="px-4 sm:px-6 lg:px-8 pt-4">
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

  const selectedTeamInfo = getTeamById(selectedTeamId);
  const awayTeam = boxScoreGame ? getTeamById(boxScoreGame.awayTeamId) : null;
  const homeTeam = boxScoreGame ? getTeamById(boxScoreGame.homeTeamId) : null;

  return (
    <div>
      <main className="px-4 sm:px-6 lg:px-8 pt-4 pb-24">
        {/* Header with dropdowns */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Team Dropdown */}
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {/* User's team first for easy access */}
              {selectedTeam && (
                <SelectItem value={selectedTeam.id}>
                  {selectedTeam.city} {selectedTeam.name}
                </SelectItem>
              )}
              {/* Other teams */}
              {LEAGUE_TEAMS.filter((team) => team.id !== selectedTeam?.id).map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.city} {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Week Dropdown */}
          <Select
            value={selectedWeek.toString()}
            onValueChange={(v) => setSelectedWeek(parseInt(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
                <SelectItem key={week} value={week.toString()}>
                  Week {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Content */}
        {selectedTeamId === 'all' ? (
          /* All Teams - Week View (Grid on desktop) */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {weekSchedule?.games
                .slice()
                .sort((a, b) => {
                  const isUserGameA = selectedTeam?.id && (a.awayTeamId === selectedTeam.id || a.homeTeamId === selectedTeam.id);
                  const isUserGameB = selectedTeam?.id && (b.awayTeamId === selectedTeam.id || b.homeTeamId === selectedTeam.id);
                  if (isUserGameA && !isUserGameB) return -1;
                  if (!isUserGameA && isUserGameB) return 1;
                  return 0;
                })
                .map((game) => {
                  const result = getGameResult(game);
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      result={result}
                      userTeamId={selectedTeam?.id}
                      onGameClick={(g, r) => r ? setBoxScoreGame(r) : setPreviewGame(g)}
                    />
                  );
                })}
            </div>

            {/* Bye Teams */}
            {weekSchedule?.byeTeams && weekSchedule.byeTeams.length > 0 && (
              <div className="mt-6 p-4 rounded-lg border border-border bg-secondary/20">
                <div className="text-xs text-muted-foreground uppercase mb-3">Bye Week</div>
                <div className="flex flex-wrap gap-2">
                  {weekSchedule.byeTeams.map((teamId) => {
                    const team = getTeamById(teamId);
                    return team ? (
                      <div
                        key={teamId}
                        className="px-3 py-1.5 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: team.colors.primary,
                          color: team.colors.secondary,
                        }}
                      >
                        {team.city} {team.name}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Team Schedule List */
          <div className="space-y-2">
            {weekItems.map(({ week, game, isBye }) => {
              const isSelected = week === selectedWeek;
              const result = game ? getGameResult(game) : undefined;

              // Determine opponent info
              let opponentId = '';
              let isHome = false;
              if (game) {
                isHome = game.homeTeamId === selectedTeamId;
                opponentId = isHome ? game.awayTeamId : game.homeTeamId;
              }
              const opponent = opponentId ? getTeamById(opponentId) : null;

              // Determine win/loss
              let resultText = '';
              let resultColor = '';
              if (result) {
                const teamScore = isHome ? result.homeScore : result.awayScore;
                const oppScore = isHome ? result.awayScore : result.homeScore;
                const won = teamScore > oppScore;
                resultText = `${won ? 'W' : 'L'} ${teamScore}-${oppScore}`;
                resultColor = won ? 'text-green-500' : 'text-red-500';
              }

              return (
                <div
                  key={week}
                  ref={(el) => {
                    if (el) weekRefs.current.set(week, el);
                  }}
                  onClick={() => {
                    if (result) {
                      setBoxScoreGame(result);
                    } else if (game) {
                      setPreviewGame(game);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-lg border transition-colors',
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-secondary/30 border-border',
                    (result || game) && 'cursor-pointer hover:bg-secondary/50',
                    game?.isPrimeTime && 'border-l-4',
                    game?.timeSlot === 'thursday_night' && 'border-l-amber-600',
                    game?.timeSlot === 'sunday_night' && 'border-l-blue-600',
                    game?.timeSlot === 'monday_night' && 'border-l-green-600'
                  )}
                >
                  {/* Week Number */}
                  <div className="w-12 text-center">
                    <div className="text-xs text-muted-foreground uppercase">Week</div>
                    <div className="text-lg font-bold">{week}</div>
                  </div>

                  {/* Game Info */}
                  <div className="flex-1">
                    {isBye ? (
                      <div className="text-muted-foreground font-medium">BYE WEEK</div>
                    ) : game && opponent ? (
                      <div className="flex items-center gap-2">
                        {/* Home/Away indicator */}
                        <span className="text-xs text-muted-foreground w-6">
                          {isHome ? 'vs' : '@'}
                        </span>
                        {/* Opponent logo */}
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: opponent.colors.primary,
                            color: opponent.colors.secondary,
                          }}
                        >
                          {opponent.id}
                        </div>
                        {/* Opponent name */}
                        <span className="font-medium">
                          {opponent.city} {opponent.name}
                        </span>
                        {/* Primetime badge */}
                        {game.isPrimeTime && (
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[10px] font-bold text-white ml-2',
                              game.timeSlot === 'thursday_night' && 'bg-amber-600',
                              game.timeSlot === 'sunday_night' && 'bg-blue-600',
                              game.timeSlot === 'monday_night' && 'bg-green-600'
                            )}
                          >
                            {game.timeSlot === 'thursday_night' && 'TNF'}
                            {game.timeSlot === 'sunday_night' && 'SNF'}
                            {game.timeSlot === 'monday_night' && 'MNF'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">—</div>
                    )}
                  </div>

                  {/* Result / Time */}
                  <div className="text-right min-w-[80px]">
                    {result ? (
                      <span className={cn('font-bold', resultColor)}>{resultText}</span>
                    ) : game ? (
                      <span className="text-xs text-muted-foreground">
                        {game.dayOfWeek === 'thursday' ? 'Thu' : game.dayOfWeek === 'monday' ? 'Mon' : 'Sun'}
                        {', '}
                        {game.timeSlot === 'early' ? '1:00 PM' :
                         game.timeSlot === 'late' ? '4:25 PM' :
                         game.timeSlot === 'sunday_night' ? '8:20 PM' :
                         game.timeSlot === 'monday_night' ? '8:15 PM' :
                         game.timeSlot === 'thursday_night' ? '8:15 PM' : game.timeSlot}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Game Preview Modal (upcoming games) */}
      <GamePreviewModal
        game={previewGame}
        open={!!previewGame}
        onOpenChange={(open) => !open && setPreviewGame(null)}
      />

      {/* Box Score Modal (completed games) */}
      <BoxScoreModal
        game={boxScoreGame}
        awayTeam={
          awayTeam
            ? { id: awayTeam.id, abbrev: awayTeam.id, name: awayTeam.name, city: awayTeam.city }
            : null
        }
        homeTeam={
          homeTeam
            ? { id: homeTeam.id, abbrev: homeTeam.id, name: homeTeam.name, city: homeTeam.city }
            : null
        }
        open={!!boxScoreGame}
        onOpenChange={(open) => !open && setBoxScoreGame(null)}
      />
    </div>
  );
}
