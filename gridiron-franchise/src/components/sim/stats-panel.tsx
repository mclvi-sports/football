'use client';

import { SimStats, SimTeam, PlayerGameStats } from '@/lib/sim/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// ============================================================================
// TEAM STATS CARD
// ============================================================================

interface TeamStatsCardProps {
  awayStats: SimStats;
  homeStats: SimStats;
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
}

export function TeamStatsCard({ awayStats, homeStats, awayTeam, homeTeam }: TeamStatsCardProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const StatRow = ({ label, away, home }: { label: string; away: string | number; home: string | number }) => (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-zinc-400">{label}</span>
      <div className="flex gap-6">
        <span className="min-w-[50px] text-right font-mono text-red-400">{away}</span>
        <span className="min-w-[50px] text-right font-mono text-blue-400">{home}</span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm tracking-wider">TEAM STATS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 flex justify-between text-xs font-semibold text-yellow-400">
            <span>OFFENSE</span>
            <div className="flex gap-6">
              <span className="min-w-[50px] text-right text-red-400">{awayTeam?.abbrev || 'AWAY'}</span>
              <span className="min-w-[50px] text-right text-blue-400">{homeTeam?.abbrev || 'HOME'}</span>
            </div>
          </div>
          <StatRow label="Total Yards" away={awayStats.yards} home={homeStats.yards} />
          <StatRow label="Pass Yards" away={awayStats.passYards} home={homeStats.passYards} />
          <StatRow label="Rush Yards" away={awayStats.rushYards} home={homeStats.rushYards} />
          <StatRow label="First Downs" away={awayStats.firstDowns} home={homeStats.firstDowns} />
        </div>

        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 text-xs font-semibold text-yellow-400">PASSING</div>
          <StatRow
            label="Comp/Att"
            away={`${awayStats.completions}/${awayStats.attempts}`}
            home={`${homeStats.completions}/${homeStats.attempts}`}
          />
          <StatRow label="TDs" away={awayStats.passTDs} home={homeStats.passTDs} />
          <StatRow label="INTs" away={awayStats.interceptions} home={homeStats.interceptions} />
        </div>

        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 text-xs font-semibold text-yellow-400">RUSHING</div>
          <StatRow label="Carries" away={awayStats.carries} home={homeStats.carries} />
          <StatRow label="TDs" away={awayStats.rushTDs} home={homeStats.rushTDs} />
          <StatRow label="Fumbles" away={awayStats.fumbles} home={homeStats.fumbles} />
        </div>

        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 text-xs font-semibold text-yellow-400">DEFENSE</div>
          <StatRow label="Sacks" away={awayStats.sacks} home={homeStats.sacks} />
          <StatRow label="Penalties" away={awayStats.penalties} home={homeStats.penalties} />
          <StatRow
            label="TOP"
            away={formatTime(awayStats.timeOfPossession)}
            home={formatTime(homeStats.timeOfPossession)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PLAYER STATS CARD
// ============================================================================

interface PlayerStatsCardProps {
  playerStats: PlayerGameStats[];
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
}

export function PlayerStatsCard({ playerStats, awayTeam, homeTeam }: PlayerStatsCardProps) {
  // Filter players by team
  const awayPlayers = playerStats.filter((p) => p.teamId === 'away');
  const homePlayers = playerStats.filter((p) => p.teamId === 'home');

  const renderPlayerStats = (players: PlayerGameStats[], teamName: string) => {
    const passers = players.filter((p) => p.passing.attempts > 0);
    const rushers = players.filter((p) => p.rushing.carries > 0);
    const receivers = players.filter((p) => p.receiving.targets > 0);
    const defenders = players.filter((p) => p.defense.tackles > 0 || p.defense.sacks > 0 || p.defense.interceptions > 0);

    if (passers.length === 0 && rushers.length === 0 && receivers.length === 0 && defenders.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-zinc-500">
          No stats yet for {teamName}.
        </div>
      );
    }

    return (
      <ScrollArea className="h-[450px]">
        {/* Passing */}
        {passers.length > 0 && (
          <div className="mb-4 rounded border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 text-xs font-semibold text-yellow-400">PASSING</div>
            <div className="grid grid-cols-6 gap-2 text-xs text-zinc-500 pb-1 border-b border-zinc-800">
              <span className="col-span-2">Player</span>
              <span className="text-right">C/A</span>
              <span className="text-right">YDS</span>
              <span className="text-right">TD</span>
              <span className="text-right">INT</span>
            </div>
            {passers.map((p) => (
              <div key={p.playerId} className="grid grid-cols-6 gap-2 py-2 text-sm border-b border-zinc-800/50 last:border-0">
                <span className="col-span-2 truncate font-medium">{p.playerName}</span>
                <span className="text-right font-mono text-zinc-300">{p.passing.completions}/{p.passing.attempts}</span>
                <span className="text-right font-mono text-zinc-300">{p.passing.yards}</span>
                <span className="text-right font-mono text-green-400">{p.passing.touchdowns}</span>
                <span className="text-right font-mono text-red-400">{p.passing.interceptions}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rushing */}
        {rushers.length > 0 && (
          <div className="mb-4 rounded border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 text-xs font-semibold text-yellow-400">RUSHING</div>
            <div className="grid grid-cols-5 gap-2 text-xs text-zinc-500 pb-1 border-b border-zinc-800">
              <span className="col-span-2">Player</span>
              <span className="text-right">CAR</span>
              <span className="text-right">YDS</span>
              <span className="text-right">TD</span>
            </div>
            {rushers.map((p) => (
              <div key={p.playerId} className="grid grid-cols-5 gap-2 py-2 text-sm border-b border-zinc-800/50 last:border-0">
                <span className="col-span-2 truncate font-medium">{p.playerName}</span>
                <span className="text-right font-mono text-zinc-300">{p.rushing.carries}</span>
                <span className="text-right font-mono text-zinc-300">{p.rushing.yards}</span>
                <span className="text-right font-mono text-green-400">{p.rushing.touchdowns}</span>
              </div>
            ))}
          </div>
        )}

        {/* Receiving */}
        {receivers.length > 0 && (
          <div className="mb-4 rounded border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 text-xs font-semibold text-yellow-400">RECEIVING</div>
            <div className="grid grid-cols-5 gap-2 text-xs text-zinc-500 pb-1 border-b border-zinc-800">
              <span className="col-span-2">Player</span>
              <span className="text-right">REC</span>
              <span className="text-right">YDS</span>
              <span className="text-right">TD</span>
            </div>
            {receivers.map((p) => (
              <div key={p.playerId} className="grid grid-cols-5 gap-2 py-2 text-sm border-b border-zinc-800/50 last:border-0">
                <span className="col-span-2 truncate font-medium">{p.playerName}</span>
                <span className="text-right font-mono text-zinc-300">{p.receiving.catches}</span>
                <span className="text-right font-mono text-zinc-300">{p.receiving.yards}</span>
                <span className="text-right font-mono text-green-400">{p.receiving.touchdowns}</span>
              </div>
            ))}
          </div>
        )}

        {/* Defense */}
        {defenders.length > 0 && (
          <div className="mb-4 rounded border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 text-xs font-semibold text-yellow-400">DEFENSE</div>
            <div className="grid grid-cols-5 gap-2 text-xs text-zinc-500 pb-1 border-b border-zinc-800">
              <span className="col-span-2">Player</span>
              <span className="text-right">SACK</span>
              <span className="text-right">INT</span>
              <span className="text-right">PD</span>
            </div>
            {defenders.map((p) => (
              <div key={p.playerId} className="grid grid-cols-5 gap-2 py-2 text-sm border-b border-zinc-800/50 last:border-0">
                <span className="col-span-2 truncate font-medium">{p.playerName}</span>
                <span className="text-right font-mono text-zinc-300">{p.defense.sacks}</span>
                <span className="text-right font-mono text-purple-400">{p.defense.interceptions}</span>
                <span className="text-right font-mono text-zinc-300">{p.defense.passDeflections}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm tracking-wider">BOX SCORE</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="away" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="away" className="text-red-400 data-[state=active]:bg-red-400/20">
              {awayTeam?.abbrev || 'AWAY'}
            </TabsTrigger>
            <TabsTrigger value="home" className="text-blue-400 data-[state=active]:bg-blue-400/20">
              {homeTeam?.abbrev || 'HOME'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="away">
            {renderPlayerStats(awayPlayers, awayTeam?.name || 'Away Team')}
          </TabsContent>

          <TabsContent value="home">
            {renderPlayerStats(homePlayers, homeTeam?.name || 'Home Team')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LEGACY COMPONENT (for backward compatibility if needed)
// ============================================================================

interface StatsPanelProps {
  awayStats: SimStats;
  homeStats: SimStats;
  awayTeam: SimTeam | null;
  homeTeam: SimTeam | null;
  playerStats: PlayerGameStats[];
}

export function StatsPanel({ awayStats, homeStats, awayTeam, homeTeam, playerStats }: StatsPanelProps) {
  return (
    <div className="space-y-4">
      <TeamStatsCard
        awayStats={awayStats}
        homeStats={homeStats}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
      />
      <PlayerStatsCard
        playerStats={playerStats}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
      />
    </div>
  );
}
