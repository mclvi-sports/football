'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamStanding } from '@/lib/season/types';
import { cn } from '@/lib/utils';
import {
  formatRecord,
  formatWinPct,
  formatPointDiff,
  getPlayoffStatus,
  formatPlayoffSeed,
} from '@/lib/franchise/game-utils';
import { Trophy, Star, X, Users } from 'lucide-react';

// ============================================================================
// PROPS
// ============================================================================

interface StandingsViewProps {
  // Mode controls layout
  mode: 'standalone' | 'embedded';

  // Data - can be provided or loaded internally
  standings?: TeamStanding[];

  // Display options
  showPlayoffPicture?: boolean;

  // Embedded mode options
  maxHeight?: string;

  // Callbacks
  onTeamClick?: (teamId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function StandingsView({
  mode,
  standings = [],
  showPlayoffPicture = true,
  maxHeight = mode === 'embedded' ? '500px' : undefined,
  onTeamClick,
}: StandingsViewProps) {
  const [selectedConference, setSelectedConference] = useState<'all' | 'Atlantic' | 'Pacific'>(
    'all'
  );

  // Group standings by conference and division
  const groupedByConference = useMemo(() => {
    const grouped: Record<string, Record<string, TeamStanding[]>> = {};
    standings.forEach((team) => {
      if (!grouped[team.conference]) {
        grouped[team.conference] = {};
      }
      if (!grouped[team.conference][team.division]) {
        grouped[team.conference][team.division] = [];
      }
      grouped[team.conference][team.division].push(team);
    });
    // Sort each division by division rank
    Object.keys(grouped).forEach((conf) => {
      Object.keys(grouped[conf]).forEach((div) => {
        grouped[conf][div].sort((a, b) => a.divisionRank - b.divisionRank);
      });
    });
    return grouped;
  }, [standings]);

  // Get playoff teams by conference
  const getPlayoffTeams = (conference: string): TeamStanding[] => {
    return standings
      .filter((s) => s.conference === conference && s.playoffSeed !== null)
      .sort((a, b) => (a.playoffSeed || 99) - (b.playoffSeed || 99));
  };

  // Empty state
  if (standings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">
            {mode === 'standalone'
              ? 'Generate a season from the Full Game page first'
              : 'No standings data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderDivisionTable = (division: string, teams: TeamStanding[]) => (
    <div key={division} className="space-y-2">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide px-2">
        {division}
      </h3>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-1 bg-zinc-800/50 text-xs font-bold text-zinc-400 py-2 px-3">
          <div className="col-span-4">Team</div>
          <div className="text-center">W</div>
          <div className="text-center">L</div>
          <div className="text-center">T</div>
          <div className="text-center">PCT</div>
          <div className="text-center">PF</div>
          <div className="text-center">PA</div>
          <div className="text-center">DIFF</div>
          <div className="text-center">STRK</div>
        </div>
        {/* Rows */}
        {teams.map((team, i) => {
          const playoffStatus = getPlayoffStatus(team);
          return (
            <div
              key={team.teamId}
              onClick={() => onTeamClick?.(team.teamId)}
              className={cn(
                'grid grid-cols-12 gap-1 py-2 px-3 text-sm transition-colors',
                i % 2 === 0 ? 'bg-zinc-900/50' : 'bg-zinc-800/20',
                onTeamClick && 'cursor-pointer hover:bg-zinc-700/50',
                team.clinched && 'border-l-2 border-green-500',
                team.eliminated && 'opacity-50'
              )}
            >
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-zinc-500 w-4 text-center text-xs">
                  {team.divisionRank}
                </span>
                <span className="font-medium truncate">{team.teamAbbrev}</span>
                {playoffStatus && (
                  <span className="text-[10px] font-bold text-green-400">
                    {playoffStatus}
                  </span>
                )}
                {team.eliminated && <X className="h-3 w-3 text-red-400" />}
              </div>
              <div className="text-center font-medium">{team.record.wins}</div>
              <div className="text-center text-zinc-400">{team.record.losses}</div>
              <div className="text-center text-zinc-500">{team.record.ties || 0}</div>
              <div className="text-center text-zinc-300">
                {formatWinPct(team.record.wins, team.record.losses, team.record.ties)}
              </div>
              <div className="text-center text-zinc-400">{team.record.pointsFor}</div>
              <div className="text-center text-zinc-400">{team.record.pointsAgainst}</div>
              <div
                className={cn(
                  'text-center',
                  team.record.pointsFor > team.record.pointsAgainst
                    ? 'text-green-400'
                    : team.record.pointsFor < team.record.pointsAgainst
                    ? 'text-red-400'
                    : 'text-zinc-400'
                )}
              >
                {formatPointDiff(team.record.pointsFor, team.record.pointsAgainst)}
              </div>
              <div
                className={cn(
                  'text-center text-xs',
                  team.record.streak > 0 ? 'text-green-400' : 'text-red-400'
                )}
              >
                {team.record.streak > 0
                  ? `W${team.record.streak}`
                  : `L${Math.abs(team.record.streak)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPlayoffPicture = (conference: string) => {
    const playoffTeams = getPlayoffTeams(conference);

    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400">{conference} Playoff Picture</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {playoffTeams.length === 0 ? (
            <p className="text-zinc-500 text-sm">Playoff picture not determined yet</p>
          ) : (
            playoffTeams.map((team) => (
              <div
                key={team.teamId}
                onClick={() => onTeamClick?.(team.teamId)}
                className={cn(
                  'flex items-center justify-between rounded-lg bg-zinc-800/50 p-2',
                  onTeamClick && 'cursor-pointer hover:bg-zinc-700/50'
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      team.playoffSeed === 1
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-zinc-700 text-zinc-300'
                    )}
                  >
                    {team.playoffSeed}
                  </span>
                  <span className="font-medium">{team.teamAbbrev}</span>
                  {team.clinched === 'bye' && (
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  )}
                </div>
                <div className="text-sm text-zinc-400">
                  {formatRecord(team.record.wins, team.record.losses, team.record.ties)}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header - Standalone only */}
      {mode === 'standalone' && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">League Standings</h3>
            <p className="text-sm text-zinc-400">{standings.length} teams</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="space-y-4"
        style={{ maxHeight: maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
      >
        <Tabs defaultValue="division" className="w-full">
          <TabsList className={cn('grid w-full', showPlayoffPicture ? 'grid-cols-3' : 'grid-cols-2')}>
            <TabsTrigger value="division">By Division</TabsTrigger>
            <TabsTrigger value="conference">By Conference</TabsTrigger>
            {showPlayoffPicture && <TabsTrigger value="playoff">Playoff Picture</TabsTrigger>}
          </TabsList>

          {/* Division View */}
          <TabsContent value="division" className="mt-4 space-y-6">
            {/* Conference Selector */}
            <div className="flex gap-2">
              {(['all', 'Atlantic', 'Pacific'] as const).map((conf) => (
                <button
                  key={conf}
                  onClick={() => setSelectedConference(conf)}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                    selectedConference === conf
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-zinc-800/50 text-zinc-400 hover:text-white'
                  )}
                >
                  {conf === 'all' ? 'All' : conf}
                </button>
              ))}
            </div>

            {/* Division Tables */}
            {selectedConference === 'all' ? (
              Object.entries(groupedByConference).map(([conf, divisions]) => (
                <div key={conf} className="space-y-4">
                  <h2 className="text-lg font-bold">{conf} Conference</h2>
                  {Object.entries(divisions as Record<string, TeamStanding[]>)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([div, teams]) => renderDivisionTable(div, teams))}
                </div>
              ))
            ) : (
              groupedByConference[selectedConference] &&
              Object.entries(groupedByConference[selectedConference] as Record<string, TeamStanding[]>)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([div, teams]) => renderDivisionTable(div, teams))
            )}
          </TabsContent>

          {/* Conference View */}
          <TabsContent value="conference" className="mt-4 space-y-6">
            {Object.keys(groupedByConference).map((conf) => {
              const confTeams = standings
                .filter((s) => s.conference === conf)
                .sort((a, b) => a.conferenceRank - b.conferenceRank);
              return (
                <div key={conf} className="space-y-2">
                  <h2 className="text-lg font-bold">{conf} Conference</h2>
                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-1 bg-zinc-800/50 text-xs font-bold text-zinc-400 py-2 px-3">
                      <div className="col-span-4">Team</div>
                      <div className="text-center">W</div>
                      <div className="text-center">L</div>
                      <div className="text-center">PCT</div>
                      <div className="text-center col-span-2">DIV</div>
                      <div className="text-center col-span-2">CONF</div>
                      <div className="text-center">DIFF</div>
                    </div>
                    {/* Rows */}
                    {confTeams.map((team, i) => (
                      <div
                        key={team.teamId}
                        onClick={() => onTeamClick?.(team.teamId)}
                        className={cn(
                          'grid grid-cols-12 gap-1 py-2 px-3 text-sm transition-colors',
                          i % 2 === 0 ? 'bg-zinc-900/50' : 'bg-zinc-800/20',
                          i < 7 && 'border-l-2 border-green-500/50',
                          onTeamClick && 'cursor-pointer hover:bg-zinc-700/50'
                        )}
                      >
                        <div className="col-span-4 flex items-center gap-2">
                          <span className="text-zinc-500 w-4 text-center text-xs">
                            {team.conferenceRank}
                          </span>
                          <span className="font-medium">{team.teamAbbrev}</span>
                          {team.playoffSeed && (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">
                              {formatPlayoffSeed(team.playoffSeed)}
                            </span>
                          )}
                        </div>
                        <div className="text-center font-medium">{team.record.wins}</div>
                        <div className="text-center text-zinc-400">{team.record.losses}</div>
                        <div className="text-center">
                          {formatWinPct(team.record.wins, team.record.losses)}
                        </div>
                        <div className="text-center col-span-2 text-zinc-400">
                          {team.record.divisionWins}-{team.record.divisionLosses}
                        </div>
                        <div className="text-center col-span-2 text-zinc-400">
                          {team.record.conferenceWins}-{team.record.conferenceLosses}
                        </div>
                        <div
                          className={cn(
                            'text-center',
                            team.record.pointsFor > team.record.pointsAgainst
                              ? 'text-green-400'
                              : 'text-red-400'
                          )}
                        >
                          {formatPointDiff(team.record.pointsFor, team.record.pointsAgainst)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Playoff Picture */}
          {showPlayoffPicture && (
            <TabsContent value="playoff" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderPlayoffPicture('Atlantic')}
                {renderPlayoffPicture('Pacific')}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs text-zinc-400 justify-center">
                <div className="flex items-center gap-1">
                  <span className="text-green-400 font-bold">z</span> - Clinched bye
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400 font-bold">y</span> - Clinched division
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400 font-bold">x</span> - Clinched playoff
                </div>
                <div className="flex items-center gap-1">
                  <X className="h-3 w-3 text-red-400" /> - Eliminated
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
