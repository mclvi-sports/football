'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BracketMatchup } from './bracket-matchup';
import { BoxScoreModal } from './box-score-modal';
import { ChampionBanner } from './champion-banner';
import { PlayoffBracket as PlayoffBracketType, GameResult } from '@/lib/season/types';
import { Trophy } from 'lucide-react';

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

interface PlayoffBracketProps {
  bracket: PlayoffBracketType | null;
  teams: Map<string, Team>;
}

export function PlayoffBracket({ bracket, teams }: PlayoffBracketProps) {
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);

  if (!bracket) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-zinc-400">Playoffs Not Started</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Complete the regular season to unlock the playoff bracket
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleMatchupClick = (gameResult: GameResult) => {
    setSelectedGame(gameResult);
  };

  const getTeamInfo = (teamId: string): Team | null => {
    return teams.get(teamId) || null;
  };

  return (
    <div className="space-y-6">
      {/* Champion Banner */}
      {bracket.champion && (
        <ChampionBanner
          champion={bracket.champion}
          team={teams.get(bracket.champion.teamId) || null}
          championshipGame={bracket.championship?.gameResult || null}
        />
      )}

      {/* Bracket Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* Atlantic Conference */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold text-blue-400 text-center">Atlantic Conference</h2>

          {/* Wild Card Round */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-400 uppercase">Wild Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bracket.atlanticWildCard.length > 0 ? (
                bracket.atlanticWildCard.map((matchup, i) => (
                  <BracketMatchup
                    key={`atl-wc-${i}`}
                    matchup={matchup}
                    teams={teams}
                    onClick={handleMatchupClick}
                    size="sm"
                  />
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-2">TBD</p>
              )}
            </CardContent>
          </Card>

          {/* Divisional Round */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-400 uppercase">Divisional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bracket.atlanticDivisional.length > 0 ? (
                bracket.atlanticDivisional.map((matchup, i) => (
                  <BracketMatchup
                    key={`atl-div-${i}`}
                    matchup={matchup}
                    teams={teams}
                    onClick={handleMatchupClick}
                    size="sm"
                  />
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-2">TBD</p>
              )}
            </CardContent>
          </Card>

          {/* Conference Championship */}
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-blue-400 uppercase">
                Atlantic Championship
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bracket.atlanticChampionship ? (
                <BracketMatchup
                  matchup={bracket.atlanticChampionship}
                  teams={teams}
                  onClick={handleMatchupClick}
                  size="md"
                />
              ) : (
                <div className="text-center py-4 text-zinc-500 text-sm">TBD</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Championship */}
        <div className="lg:col-span-1 flex items-center justify-center">
          <Card className="w-full border-yellow-500/30 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-yellow-400 uppercase text-center flex items-center justify-center gap-1">
                <Trophy className="h-3 w-3" />
                Championship
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bracket.championship ? (
                <BracketMatchup
                  matchup={bracket.championship}
                  teams={teams}
                  onClick={handleMatchupClick}
                  size="md"
                />
              ) : (
                <div className="text-center py-4 text-zinc-500 text-sm">TBD</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pacific Conference */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-bold text-red-400 text-center">Pacific Conference</h2>

          {/* Wild Card Round */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-400 uppercase">Wild Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bracket.pacificWildCard.length > 0 ? (
                bracket.pacificWildCard.map((matchup, i) => (
                  <BracketMatchup
                    key={`pac-wc-${i}`}
                    matchup={matchup}
                    teams={teams}
                    onClick={handleMatchupClick}
                    size="sm"
                  />
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-2">TBD</p>
              )}
            </CardContent>
          </Card>

          {/* Divisional Round */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-400 uppercase">Divisional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bracket.pacificDivisional.length > 0 ? (
                bracket.pacificDivisional.map((matchup, i) => (
                  <BracketMatchup
                    key={`pac-div-${i}`}
                    matchup={matchup}
                    teams={teams}
                    onClick={handleMatchupClick}
                    size="sm"
                  />
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-2">TBD</p>
              )}
            </CardContent>
          </Card>

          {/* Conference Championship */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-red-400 uppercase">
                Pacific Championship
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bracket.pacificChampionship ? (
                <BracketMatchup
                  matchup={bracket.pacificChampionship}
                  teams={teams}
                  onClick={handleMatchupClick}
                  size="md"
                />
              ) : (
                <div className="text-center py-4 text-zinc-500 text-sm">TBD</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Playoff Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-400 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
          Winner
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-dashed border-zinc-600" />
          Pending
        </div>
        <span className="text-zinc-600">|</span>
        <span>Click any completed matchup to view box score</span>
      </div>

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
