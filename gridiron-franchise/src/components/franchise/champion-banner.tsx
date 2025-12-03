'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BoxScoreModal } from './box-score-modal';
import { GameResult } from '@/lib/season/types';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

interface ChampionBannerProps {
  champion: {
    teamId: string;
    teamName: string;
  };
  team: Team | null;
  championshipGame: GameResult | null;
  runnerUp?: Team | null;
}

export function ChampionBanner({
  champion,
  team,
  championshipGame,
  runnerUp,
}: ChampionBannerProps) {
  const [showBoxScore, setShowBoxScore] = useState(false);

  // Determine runner up from championship game
  const getRunnerUp = (): Team | null => {
    if (runnerUp) return runnerUp;
    if (!championshipGame) return null;
    const runnerUpId =
      championshipGame.awayTeamId === champion.teamId
        ? championshipGame.homeTeamId
        : championshipGame.awayTeamId;
    return { id: runnerUpId, abbrev: runnerUpId, name: '', city: '' };
  };

  const runnerUpTeam = getRunnerUp();

  return (
    <>
      <Card className="relative overflow-hidden border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-yellow-500/20">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
          <Sparkles className="absolute top-4 right-4 h-6 w-6 text-yellow-400/30" />
          <Sparkles className="absolute bottom-4 left-4 h-4 w-4 text-yellow-400/20" />
        </div>

        <CardContent className="relative p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Trophy Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <Star className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 fill-yellow-400" />
            </div>

            {/* Champion Text */}
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-yellow-400 font-semibold flex items-center gap-2 justify-center">
                <Star className="h-3 w-3 fill-yellow-400" />
                League Champion
                <Star className="h-3 w-3 fill-yellow-400" />
              </div>
              <h2 className="text-3xl font-black text-white">
                {team?.city || ''} {team?.name || champion.teamName}
              </h2>
              {team?.abbrev && (
                <div className="text-lg font-bold text-yellow-400">{team.abbrev}</div>
              )}
            </div>

            {/* Championship Game Score */}
            {championshipGame && (
              <div className="bg-zinc-900/50 rounded-lg px-6 py-3 border border-yellow-500/20">
                <div className="text-xs text-zinc-400 mb-1">Championship Game</div>
                <div className="flex items-center gap-4 text-lg font-bold">
                  <span
                    className={cn(
                      championshipGame.awayScore > championshipGame.homeScore
                        ? 'text-yellow-400'
                        : 'text-zinc-400'
                    )}
                  >
                    {championshipGame.awayTeamId === champion.teamId
                      ? team?.abbrev || champion.teamId
                      : runnerUpTeam?.abbrev || championshipGame.awayTeamId}
                  </span>
                  <span className="text-white">
                    {championshipGame.awayScore} - {championshipGame.homeScore}
                  </span>
                  <span
                    className={cn(
                      championshipGame.homeScore > championshipGame.awayScore
                        ? 'text-yellow-400'
                        : 'text-zinc-400'
                    )}
                  >
                    {championshipGame.homeTeamId === champion.teamId
                      ? team?.abbrev || champion.teamId
                      : runnerUpTeam?.abbrev || championshipGame.homeTeamId}
                  </span>
                </div>
              </div>
            )}

            {/* View Box Score Button */}
            {championshipGame && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBoxScore(true)}
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                View Championship Box Score
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Box Score Modal */}
      {championshipGame && (
        <BoxScoreModal
          game={championshipGame}
          awayTeam={
            championshipGame.awayTeamId === champion.teamId
              ? team
              : runnerUpTeam
          }
          homeTeam={
            championshipGame.homeTeamId === champion.teamId
              ? team
              : runnerUpTeam
          }
          open={showBoxScore}
          onOpenChange={setShowBoxScore}
        />
      )}
    </>
  );
}
