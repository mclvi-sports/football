'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameResult } from '@/lib/season/types';
import { PlayerGameStats, SimStats } from '@/lib/sim/types';
import { cn } from '@/lib/utils';
import { Star, Trophy } from 'lucide-react';
import {
  buildTeamStatsComparison,
  formatCompletionPct,
  formatYardsPerAttempt,
  formatYardsPerCarry,
  formatPasserRating,
  formatTimeOfPossession,
  getTopPassers,
  getTopRushers,
  getTopReceivers,
  getTopDefenders,
  formatWeek,
} from '@/lib/franchise/game-utils';

interface BoxScoreModalProps {
  game: GameResult | null;
  awayTeam: { id: string; abbrev: string; name: string; city: string } | null;
  homeTeam: { id: string; abbrev: string; name: string; city: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoxScoreModal({
  game,
  awayTeam,
  homeTeam,
  open,
  onOpenChange,
}: BoxScoreModalProps) {
  if (!game || !awayTeam || !homeTeam) return null;

  const awayWon = game.awayScore > game.homeScore;
  const homeWon = game.homeScore > game.awayScore;

  // Split player stats by team
  const awayPlayerStats = game.playerStats.filter((p) =>
    p.playerId.startsWith(game.awayTeamId)
  );
  const homePlayerStats = game.playerStats.filter((p) =>
    p.playerId.startsWith(game.homeTeamId)
  );

  const teamStatsComparison = buildTeamStatsComparison(game.awayStats, game.homeStats);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Box Score</DialogTitle>
          {/* Game Header */}
          <div className="text-center space-y-2">
            {/* Game Info Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
              {game.isPrimetime && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-3 w-3 fill-yellow-400" />
                  Primetime
                </span>
              )}
              {game.isPlayoff && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Trophy className="h-3 w-3" />
                  {formatWeek(game.week, true, game.playoffRound)}
                </span>
              )}
              {!game.isPlayoff && (
                <span>{formatWeek(game.week, false)}</span>
              )}
              <span className="text-zinc-600">|</span>
              <span>FINAL</span>
            </div>

            {/* Score Display */}
            <div className="flex items-center justify-center gap-6">
              {/* Away Team */}
              <div className={cn('text-right flex-1', awayWon && 'font-bold')}>
                <div className="text-sm text-zinc-400">{awayTeam.city}</div>
                <div className="text-lg">{awayTeam.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-4xl font-black',
                    awayWon ? 'text-white' : 'text-zinc-500'
                  )}
                >
                  {game.awayScore}
                </span>
                <span className="text-2xl text-zinc-600">-</span>
                <span
                  className={cn(
                    'text-4xl font-black',
                    homeWon ? 'text-white' : 'text-zinc-500'
                  )}
                >
                  {game.homeScore}
                </span>
              </div>
              {/* Home Team */}
              <div className={cn('text-left flex-1', homeWon && 'font-bold')}>
                <div className="text-sm text-zinc-400">{homeTeam.city}</div>
                <div className="text-lg">{homeTeam.name}</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="team" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">Team Stats</TabsTrigger>
            <TabsTrigger value="passing">Passing</TabsTrigger>
            <TabsTrigger value="rushing">Rushing</TabsTrigger>
            <TabsTrigger value="defense">Defense</TabsTrigger>
          </TabsList>

          {/* Team Stats Tab */}
          <TabsContent value="team" className="mt-4 space-y-4">
            <TeamStatsTable
              stats={teamStatsComparison}
              awayAbbrev={awayTeam.abbrev}
              homeAbbrev={homeTeam.abbrev}
            />
          </TabsContent>

          {/* Passing Tab */}
          <TabsContent value="passing" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <PlayerStatSection
                title={awayTeam.abbrev}
                players={getTopPassers(awayPlayerStats, 2)}
                type="passing"
              />
              <PlayerStatSection
                title={homeTeam.abbrev}
                players={getTopPassers(homePlayerStats, 2)}
                type="passing"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <PlayerStatSection
                title={`${awayTeam.abbrev} Receivers`}
                players={getTopReceivers(awayPlayerStats, 4)}
                type="receiving"
              />
              <PlayerStatSection
                title={`${homeTeam.abbrev} Receivers`}
                players={getTopReceivers(homePlayerStats, 4)}
                type="receiving"
              />
            </div>
          </TabsContent>

          {/* Rushing Tab */}
          <TabsContent value="rushing" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <PlayerStatSection
                title={awayTeam.abbrev}
                players={getTopRushers(awayPlayerStats, 4)}
                type="rushing"
              />
              <PlayerStatSection
                title={homeTeam.abbrev}
                players={getTopRushers(homePlayerStats, 4)}
                type="rushing"
              />
            </div>
          </TabsContent>

          {/* Defense Tab */}
          <TabsContent value="defense" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <PlayerStatSection
                title={awayTeam.abbrev}
                players={getTopDefenders(awayPlayerStats, 5)}
                type="defense"
              />
              <PlayerStatSection
                title={homeTeam.abbrev}
                players={getTopDefenders(homePlayerStats, 5)}
                type="defense"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Scoring Summary */}
        <div className="mt-6 border-t border-zinc-800 pt-4">
          <h3 className="text-sm font-bold text-zinc-400 mb-3">SCORING SUMMARY</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            <div className="font-semibold">Team</div>
            <div className="text-zinc-400">Q1</div>
            <div className="text-zinc-400">Q2</div>
            <div className="text-zinc-400">Q3</div>
            <div className="text-zinc-400">Q4</div>
            {/* Away */}
            <div className={cn('font-semibold', awayWon && 'text-green-400')}>
              {awayTeam.abbrev}
            </div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
            {/* Home */}
            <div className={cn('font-semibold', homeWon && 'text-green-400')}>
              {homeTeam.abbrev}
            </div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center italic">
            Quarter-by-quarter scoring not available in current simulation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// TEAM STATS TABLE
// ============================================================================

interface TeamStatsTableProps {
  stats: Array<{
    label: string;
    away: string | number;
    home: string | number;
    awayBetter?: boolean;
    homeBetter?: boolean;
  }>;
  awayAbbrev: string;
  homeAbbrev: string;
}

function TeamStatsTable({ stats, awayAbbrev, homeAbbrev }: TeamStatsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 bg-zinc-800/50 text-xs font-bold text-zinc-400 py-2">
        <div className="text-center">{awayAbbrev}</div>
        <div className="text-center">Stat</div>
        <div className="text-center">{homeAbbrev}</div>
      </div>
      {/* Rows */}
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            'grid grid-cols-3 py-2 text-sm',
            i % 2 === 0 ? 'bg-zinc-900/50' : 'bg-zinc-800/20'
          )}
        >
          <div
            className={cn(
              'text-center font-medium',
              stat.awayBetter && 'text-green-400'
            )}
          >
            {stat.away}
          </div>
          <div className="text-center text-zinc-400">{stat.label}</div>
          <div
            className={cn(
              'text-center font-medium',
              stat.homeBetter && 'text-green-400'
            )}
          >
            {stat.home}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// PLAYER STAT SECTION
// ============================================================================

interface PlayerStatSectionProps {
  title: string;
  players: PlayerGameStats[];
  type: 'passing' | 'rushing' | 'receiving' | 'defense';
}

function PlayerStatSection({ title, players, type }: PlayerStatSectionProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 p-3">
        <h4 className="text-xs font-bold text-zinc-400 mb-2">{title}</h4>
        <p className="text-xs text-zinc-500">No stats available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 p-3">
      <h4 className="text-xs font-bold text-zinc-400 mb-2">{title}</h4>
      <div className="space-y-2">
        {players.map((player) => (
          <div key={player.playerId} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium truncate flex-1">{player.playerName}</span>
              <span className="text-xs text-zinc-400 ml-2">{player.position}</span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              {type === 'passing' && (
                <>
                  {player.passing.completions}/{player.passing.attempts},{' '}
                  {player.passing.yards} yds, {player.passing.touchdowns} TD,{' '}
                  {player.passing.interceptions} INT
                  <span className="ml-2 text-zinc-500">
                    ({formatPasserRating(
                      player.passing.completions,
                      player.passing.attempts,
                      player.passing.yards,
                      player.passing.touchdowns,
                      player.passing.interceptions
                    )} RTG)
                  </span>
                </>
              )}
              {type === 'rushing' && (
                <>
                  {player.rushing.carries} car, {player.rushing.yards} yds,{' '}
                  {player.rushing.touchdowns} TD
                  <span className="ml-2 text-zinc-500">
                    ({formatYardsPerCarry(player.rushing.yards, player.rushing.carries)} ypc)
                  </span>
                </>
              )}
              {type === 'receiving' && (
                <>
                  {player.receiving.catches}/{player.receiving.targets} rec,{' '}
                  {player.receiving.yards} yds, {player.receiving.touchdowns} TD
                </>
              )}
              {type === 'defense' && (
                <>
                  {player.defense.tackles} tkl, {player.defense.sacks} sacks,{' '}
                  {player.defense.interceptions} INT, {player.defense.passDeflections} PD
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
