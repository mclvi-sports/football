'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GameCard } from './game-card';
import { BoxScoreModal } from './box-score-modal';
import { GameResult } from '@/lib/season/types';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWeekLabel } from '@/lib/franchise/game-utils';

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

interface ScheduleViewProps {
  games: GameResult[];
  teams: Map<string, Team>;
  currentWeek: number;
  totalWeeks: number;
  onWeekChange?: (week: number) => void;
}

export function ScheduleView({
  games,
  teams,
  currentWeek,
  totalWeeks,
  onWeekChange,
}: ScheduleViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);

  // Filter games for selected week
  const weekGames = games.filter((g) => g.week === selectedWeek);
  const regularGames = weekGames.filter((g) => !g.isPrimetime);
  const primetimeGames = weekGames.filter((g) => g.isPrimetime);

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    onWeekChange?.(week);
  };

  const goToPrevWeek = () => {
    if (selectedWeek > 1) {
      handleWeekChange(selectedWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (selectedWeek < totalWeeks) {
      handleWeekChange(selectedWeek + 1);
    }
  };

  const getTeamInfo = (teamId: string): Team | null => {
    return teams.get(teamId) || null;
  };

  const handleGameClick = (game: GameResult) => {
    setSelectedGame(game);
  };

  // Generate week options
  const weekOptions = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      {/* Week Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevWeek}
              disabled={selectedWeek <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              <Select
                value={selectedWeek.toString()}
                onValueChange={(v) => handleWeekChange(parseInt(v))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {weekOptions.map((week) => (
                    <SelectItem key={week} value={week.toString()}>
                      {getWeekLabel(week)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedWeek === currentWeek && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  Current
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextWeek}
              disabled={selectedWeek >= totalWeeks}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* No Games Message */}
      {weekGames.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-zinc-400">No games scheduled for this week</p>
            <p className="text-sm text-zinc-500 mt-1">
              {selectedWeek <= 18 ? 'This may be a bye week' : 'Playoff games not simulated yet'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Primetime Games */}
      {primetimeGames.length > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400">Primetime Games</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {primetimeGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                awayTeam={getTeamInfo(game.awayTeamId)}
                homeTeam={getTeamInfo(game.homeTeamId)}
                onClick={() => handleGameClick(game)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Regular Games */}
      {regularGames.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              {primetimeGames.length > 0 ? 'Other Games' : 'Games'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {regularGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                awayTeam={getTeamInfo(game.awayTeamId)}
                homeTeam={getTeamInfo(game.homeTeamId)}
                onClick={() => handleGameClick(game)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {weekGames.length > 0 && (
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xl font-bold">{weekGames.length}</div>
            <div className="text-xs text-zinc-400">Games</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xl font-bold">
              {weekGames.reduce((sum, g) => sum + g.awayScore + g.homeScore, 0)}
            </div>
            <div className="text-xs text-zinc-400">Total Points</div>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="text-xl font-bold">
              {Math.round(
                weekGames.reduce((sum, g) => sum + g.awayScore + g.homeScore, 0) /
                  (weekGames.length * 2)
              )}
            </div>
            <div className="text-xs text-zinc-400">Avg PPG</div>
          </div>
        </div>
      )}

      {/* Box Score Modal */}
      <BoxScoreModal
        game={selectedGame}
        awayTeam={selectedGame ? getTeamInfo(selectedGame.awayTeamId) : null}
        homeTeam={selectedGame ? getTeamInfo(selectedGame.homeTeamId) : null}
        open={!!selectedGame}
        onOpenChange={(open) => !open && setSelectedGame(null)}
      />
    </div>
  );
}
