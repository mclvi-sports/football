'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameResult, TeamStanding } from '@/lib/season/types';
import { PlayerGameStats } from '@/lib/sim/types';
import { cn } from '@/lib/utils';
import {
  formatPasserRating,
  formatYardsPerCarry,
  formatCompletionPct,
} from '@/lib/franchise/game-utils';
import { BarChart3 } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface AggregatedPlayerStats {
  playerId: string;
  playerName: string;
  position: string;
  teamId: string;
  games: number;
  passing: {
    attempts: number;
    completions: number;
    yards: number;
    touchdowns: number;
    interceptions: number;
  };
  rushing: {
    carries: number;
    yards: number;
    touchdowns: number;
    fumbles: number;
  };
  receiving: {
    targets: number;
    catches: number;
    yards: number;
    touchdowns: number;
  };
  defense: {
    tackles: number;
    sacks: number;
    interceptions: number;
    passDeflections: number;
  };
}

// ============================================================================
// PROPS
// ============================================================================

interface StatsViewProps {
  // Mode controls layout
  mode: 'standalone' | 'embedded';

  // Data - required for stats
  games?: GameResult[];
  standings?: TeamStanding[];

  // Embedded mode options
  maxHeight?: string;

  // Callbacks
  onPlayerClick?: (playerId: string) => void;
  onTeamClick?: (teamId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function StatsView({
  mode,
  games = [],
  standings = [],
  maxHeight = mode === 'embedded' ? '500px' : undefined,
  onPlayerClick,
  onTeamClick,
}: StatsViewProps) {
  // Aggregate player stats from all games
  const aggregatedStats = useMemo(() => {
    const statsMap = new Map<string, AggregatedPlayerStats>();

    games.forEach((game: GameResult) => {
      game.playerStats.forEach((ps: PlayerGameStats) => {
        const existing = statsMap.get(ps.playerId);
        if (existing) {
          // Aggregate
          existing.games++;
          existing.passing.attempts += ps.passing.attempts;
          existing.passing.completions += ps.passing.completions;
          existing.passing.yards += ps.passing.yards;
          existing.passing.touchdowns += ps.passing.touchdowns;
          existing.passing.interceptions += ps.passing.interceptions;
          existing.rushing.carries += ps.rushing.carries;
          existing.rushing.yards += ps.rushing.yards;
          existing.rushing.touchdowns += ps.rushing.touchdowns;
          existing.rushing.fumbles += ps.rushing.fumbles;
          existing.receiving.targets += ps.receiving.targets;
          existing.receiving.catches += ps.receiving.catches;
          existing.receiving.yards += ps.receiving.yards;
          existing.receiving.touchdowns += ps.receiving.touchdowns;
          existing.defense.tackles += ps.defense.tackles;
          existing.defense.sacks += ps.defense.sacks;
          existing.defense.interceptions += ps.defense.interceptions;
          existing.defense.passDeflections += ps.defense.passDeflections;
        } else {
          // Create new entry
          const teamId = ps.playerId.split('-')[0] || 'UNK';
          statsMap.set(ps.playerId, {
            playerId: ps.playerId,
            playerName: ps.playerName,
            position: ps.position,
            teamId,
            games: 1,
            passing: { ...ps.passing },
            rushing: { ...ps.rushing },
            receiving: { ...ps.receiving },
            defense: { ...ps.defense },
          });
        }
      });
    });

    return Array.from(statsMap.values());
  }, [games]);

  // Get top passers
  const topPassers = useMemo(() => {
    return [...aggregatedStats]
      .filter((p) => p.passing.attempts >= 10)
      .sort((a, b) => b.passing.yards - a.passing.yards)
      .slice(0, 15);
  }, [aggregatedStats]);

  // Get top rushers
  const topRushers = useMemo(() => {
    return [...aggregatedStats]
      .filter((p) => p.rushing.carries >= 5)
      .sort((a, b) => b.rushing.yards - a.rushing.yards)
      .slice(0, 15);
  }, [aggregatedStats]);

  // Get top receivers
  const topReceivers = useMemo(() => {
    return [...aggregatedStats]
      .filter((p) => p.receiving.catches >= 2)
      .sort((a, b) => b.receiving.yards - a.receiving.yards)
      .slice(0, 15);
  }, [aggregatedStats]);

  // Get top defenders
  const topDefenders = useMemo(() => {
    return [...aggregatedStats]
      .filter((p) => p.defense.tackles > 0)
      .sort((a, b) => {
        const aScore = a.defense.tackles + a.defense.sacks * 2 + a.defense.interceptions * 3;
        const bScore = b.defense.tackles + b.defense.sacks * 2 + b.defense.interceptions * 3;
        return bScore - aScore;
      })
      .slice(0, 15);
  }, [aggregatedStats]);

  // Team stats from standings
  const teamOffenseStats = useMemo(() => {
    return [...standings].sort((a, b) => b.record.pointsFor - a.record.pointsFor).slice(0, 10);
  }, [standings]);

  const teamDefenseStats = useMemo(() => {
    return [...standings]
      .sort((a, b) => a.record.pointsAgainst - b.record.pointsAgainst)
      .slice(0, 10);
  }, [standings]);

  // Empty state
  if (games.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">
            {mode === 'standalone'
              ? 'Play some games to see stats'
              : 'No stats available yet'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderPlayerRow = (
    player: AggregatedPlayerStats,
    rank: number,
    type: 'passing' | 'rushing' | 'receiving' | 'defense'
  ) => (
    <div
      key={player.playerId}
      onClick={() => onPlayerClick?.(player.playerId)}
      className={cn(
        'grid gap-2 py-2 px-3 text-sm transition-colors',
        rank % 2 === 0 ? 'bg-zinc-900/50' : 'bg-zinc-800/20',
        onPlayerClick && 'cursor-pointer hover:bg-zinc-700/50'
      )}
      style={{
        gridTemplateColumns:
          type === 'passing'
            ? '2rem 1fr 3rem 4rem 4rem 4rem 3rem 3rem 4rem'
            : type === 'rushing'
            ? '2rem 1fr 3rem 3rem 4rem 3rem 4rem'
            : type === 'receiving'
            ? '2rem 1fr 3rem 4rem 4rem 4rem 3rem'
            : '2rem 1fr 3rem 4rem 3rem 3rem 3rem',
      }}
    >
      <div className="text-zinc-500 text-center">{rank}</div>
      <div className="truncate font-medium">{player.playerName}</div>
      <div className="text-zinc-400 text-xs text-center">{player.position}</div>

      {type === 'passing' && (
        <>
          <div className="text-center">
            {player.passing.completions}/{player.passing.attempts}
          </div>
          <div className="text-center font-medium">{player.passing.yards}</div>
          <div className="text-center text-green-400">{player.passing.touchdowns}</div>
          <div className="text-center text-red-400">{player.passing.interceptions}</div>
          <div className="text-center text-zinc-400">
            {formatCompletionPct(player.passing.completions, player.passing.attempts)}
          </div>
          <div className="text-center text-yellow-400">
            {formatPasserRating(
              player.passing.completions,
              player.passing.attempts,
              player.passing.yards,
              player.passing.touchdowns,
              player.passing.interceptions
            )}
          </div>
        </>
      )}

      {type === 'rushing' && (
        <>
          <div className="text-center">{player.rushing.carries}</div>
          <div className="text-center font-medium">{player.rushing.yards}</div>
          <div className="text-center text-green-400">{player.rushing.touchdowns}</div>
          <div className="text-center text-zinc-400">
            {formatYardsPerCarry(player.rushing.yards, player.rushing.carries)}
          </div>
        </>
      )}

      {type === 'receiving' && (
        <>
          <div className="text-center">
            {player.receiving.catches}/{player.receiving.targets}
          </div>
          <div className="text-center font-medium">{player.receiving.yards}</div>
          <div className="text-center text-green-400">{player.receiving.touchdowns}</div>
          <div className="text-center text-zinc-400">
            {(player.receiving.yards / Math.max(1, player.receiving.catches)).toFixed(1)}
          </div>
        </>
      )}

      {type === 'defense' && (
        <>
          <div className="text-center font-medium">{player.defense.tackles}</div>
          <div className="text-center text-orange-400">{player.defense.sacks.toFixed(1)}</div>
          <div className="text-center text-green-400">{player.defense.interceptions}</div>
          <div className="text-center text-zinc-400">{player.defense.passDeflections}</div>
        </>
      )}
    </div>
  );

  const renderStatHeader = (type: 'passing' | 'rushing' | 'receiving' | 'defense') => (
    <div
      className="grid gap-2 bg-zinc-800/50 text-xs font-bold text-zinc-400 py-2 px-3"
      style={{
        gridTemplateColumns:
          type === 'passing'
            ? '2rem 1fr 3rem 4rem 4rem 4rem 3rem 3rem 4rem'
            : type === 'rushing'
            ? '2rem 1fr 3rem 3rem 4rem 3rem 4rem'
            : type === 'receiving'
            ? '2rem 1fr 3rem 4rem 4rem 4rem 3rem'
            : '2rem 1fr 3rem 4rem 3rem 3rem 3rem',
      }}
    >
      <div className="text-center">#</div>
      <div>Player</div>
      <div className="text-center">POS</div>

      {type === 'passing' && (
        <>
          <div className="text-center">C/ATT</div>
          <div className="text-center">YDS</div>
          <div className="text-center">TD</div>
          <div className="text-center">INT</div>
          <div className="text-center">CMP%</div>
          <div className="text-center">RTG</div>
        </>
      )}

      {type === 'rushing' && (
        <>
          <div className="text-center">CAR</div>
          <div className="text-center">YDS</div>
          <div className="text-center">TD</div>
          <div className="text-center">YPC</div>
        </>
      )}

      {type === 'receiving' && (
        <>
          <div className="text-center">REC</div>
          <div className="text-center">YDS</div>
          <div className="text-center">TD</div>
          <div className="text-center">YPR</div>
        </>
      )}

      {type === 'defense' && (
        <>
          <div className="text-center">TKL</div>
          <div className="text-center">SCK</div>
          <div className="text-center">INT</div>
          <div className="text-center">PD</div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header - Standalone only */}
      {mode === 'standalone' && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">League Stats</h3>
            <p className="text-sm text-zinc-400">{games.length} games played</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="space-y-4"
        style={{ maxHeight: maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
      >
        <Tabs defaultValue="passing" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="passing">Passing</TabsTrigger>
            <TabsTrigger value="rushing">Rushing</TabsTrigger>
            <TabsTrigger value="receiving">Receiving</TabsTrigger>
            <TabsTrigger value="defense">Defense</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Passing Leaders */}
          <TabsContent value="passing" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Passing Leaders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-b-lg border border-zinc-800 overflow-hidden">
                  {renderStatHeader('passing')}
                  {topPassers.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500">
                      No passing stats available yet
                    </div>
                  ) : (
                    topPassers.map((p, i) => renderPlayerRow(p, i + 1, 'passing'))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rushing Leaders */}
          <TabsContent value="rushing" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Rushing Leaders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-b-lg border border-zinc-800 overflow-hidden">
                  {renderStatHeader('rushing')}
                  {topRushers.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500">
                      No rushing stats available yet
                    </div>
                  ) : (
                    topRushers.map((p, i) => renderPlayerRow(p, i + 1, 'rushing'))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receiving Leaders */}
          <TabsContent value="receiving" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Receiving Leaders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-b-lg border border-zinc-800 overflow-hidden">
                  {renderStatHeader('receiving')}
                  {topReceivers.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500">
                      No receiving stats available yet
                    </div>
                  ) : (
                    topReceivers.map((p, i) => renderPlayerRow(p, i + 1, 'receiving'))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Defensive Leaders */}
          <TabsContent value="defense" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Defensive Leaders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-b-lg border border-zinc-800 overflow-hidden">
                  {renderStatHeader('defense')}
                  {topDefenders.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500">
                      No defensive stats available yet
                    </div>
                  ) : (
                    topDefenders.map((p, i) => renderPlayerRow(p, i + 1, 'defense'))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Stats */}
          <TabsContent value="team" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Offense */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400">Best Offense (PPG)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {teamOffenseStats.map((team, i) => {
                    const gamesPlayed = team.record.wins + team.record.losses + team.record.ties;
                    const ppg =
                      gamesPlayed > 0 ? (team.record.pointsFor / gamesPlayed).toFixed(1) : '0.0';
                    return (
                      <div
                        key={team.teamId}
                        onClick={() => onTeamClick?.(team.teamId)}
                        className={cn(
                          'flex justify-between items-center py-1.5 px-2 rounded text-sm',
                          i % 2 === 0 ? 'bg-zinc-900/50' : '',
                          onTeamClick && 'cursor-pointer hover:bg-zinc-700/50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 w-4">{i + 1}</span>
                          <span className="font-medium">{team.teamAbbrev}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-400">{team.record.pointsFor} pts</span>
                          <span className="font-bold text-green-400">{ppg}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Top Defense */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-400">
                    Best Defense (PPG Allowed)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {teamDefenseStats.map((team, i) => {
                    const gamesPlayed = team.record.wins + team.record.losses + team.record.ties;
                    const ppga =
                      gamesPlayed > 0
                        ? (team.record.pointsAgainst / gamesPlayed).toFixed(1)
                        : '0.0';
                    return (
                      <div
                        key={team.teamId}
                        onClick={() => onTeamClick?.(team.teamId)}
                        className={cn(
                          'flex justify-between items-center py-1.5 px-2 rounded text-sm',
                          i % 2 === 0 ? 'bg-zinc-900/50' : '',
                          onTeamClick && 'cursor-pointer hover:bg-zinc-700/50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 w-4">{i + 1}</span>
                          <span className="font-medium">{team.teamAbbrev}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-400">{team.record.pointsAgainst} pts</span>
                          <span className="font-bold text-blue-400">{ppga}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
