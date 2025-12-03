'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamStanding } from '@/lib/season/types';
import { cn } from '@/lib/utils';
import {
  formatRecord,
  formatWinPct,
  formatPointDiff,
  formatStreak,
  formatPlayoffSeed,
  getPlayoffStatus,
} from '@/lib/franchise/game-utils';
import { Trophy, Star, X } from 'lucide-react';

interface StandingsViewProps {
  standings: TeamStanding[];
  onTeamClick?: (teamId: string) => void;
}

export function StandingsView({ standings, onTeamClick }: StandingsViewProps) {
  const [selectedConference, setSelectedConference] = useState<'all' | 'Atlantic' | 'Pacific'>(
    'all'
  );

  // Group standings by conference and division
  const groupedByConference = standings.reduce(
    (acc, team) => {
      if (!acc[team.conference]) {
        acc[team.conference] = {};
      }
      if (!acc[team.conference][team.division]) {
        acc[team.conference][team.division] = [];
      }
      acc[team.conference][team.division].push(team);
      return acc;
    },
    {} as Record<string, Record<string, TeamStanding[]>>
  );

  // Sort each division by division rank
  Object.keys(groupedByConference).forEach((conf) => {
    Object.keys(groupedByConference[conf]).forEach((div) => {
      groupedByConference[conf][div].sort((a, b) => a.divisionRank - b.divisionRank);
    });
  });

  // Get playoff teams by conference
  const getPlayoffTeams = (conference: string): TeamStanding[] => {
    return standings
      .filter((s) => s.conference === conference && s.playoffSeed !== null)
      .sort((a, b) => (a.playoffSeed || 99) - (b.playoffSeed || 99));
  };

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
                {team.eliminated && (
                  <X className="h-3 w-3 text-red-400" />
                )}
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
                {team.record.streak > 0 ? `W${team.record.streak}` : `L${Math.abs(team.record.streak)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPlayoffPicture = (conference: string) => {
    const playoffTeams = getPlayoffTeams(conference);
    const divisionWinners = playoffTeams.filter((t) => t.clinched === 'division' || t.clinched === 'bye');
    const wildcards = playoffTeams.filter((t) => t.clinched === 'wildcard');

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
                className="flex items-center justify-between rounded-lg bg-zinc-800/50 p-2"
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
      <Tabs defaultValue="division" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="division">By Division</TabsTrigger>
          <TabsTrigger value="conference">By Conference</TabsTrigger>
          <TabsTrigger value="playoff">Playoff Picture</TabsTrigger>
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
                {Object.entries(divisions)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([div, teams]) => renderDivisionTable(div, teams))}
              </div>
            ))
          ) : (
            groupedByConference[selectedConference] &&
            Object.entries(groupedByConference[selectedConference])
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
      </Tabs>
    </div>
  );
}
