'use client';

import { useState } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { SimStats, PlayerGameStats, ScoringPlay } from '@/lib/sim/types';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface TeamInfo {
  id: string;
  name: string;
  abbrev: string;
  primaryColor?: string;
}

interface BoxScoreProps {
  awayTeam: TeamInfo;
  homeTeam: TeamInfo;
  awayScore: number;
  homeScore: number;
  awayStats: SimStats;
  homeStats: SimStats;
  playerStats: PlayerGameStats[];
  scoringPlays?: ScoringPlay[];
  isFinal?: boolean;
  onBack?: () => void;
}

type TabType = 'team' | 'player' | 'scoring';

// ============================================================================
// STAT ROW COMPONENT
// ============================================================================

interface StatRowProps {
  label: string;
  awayValue: string | number;
  homeValue: string | number;
  awayColor?: string;
  homeColor?: string;
  isLast?: boolean;
}

function StatRow({ label, awayValue, homeValue, awayColor = '#3b82f6', homeColor = '#ef4444', isLast }: StatRowProps) {
  // Calculate percentages for the bar
  const awayNum = typeof awayValue === 'string' ? parseFloat(awayValue) || 0 : awayValue;
  const homeNum = typeof homeValue === 'string' ? parseFloat(homeValue) || 0 : homeValue;
  const total = awayNum + homeNum;
  const awayPct = total > 0 ? (awayNum / total) * 100 : 50;
  const homePct = total > 0 ? (homeNum / total) * 100 : 50;

  return (
    <div className={cn('px-3 py-2 sm:px-4 sm:py-3', !isLast && 'border-b border-zinc-800')}>
      <div className="flex justify-between items-center text-white font-semibold text-xs sm:text-sm mb-1.5">
        <span className="w-12 sm:w-16">{awayValue}</span>
        <span className="text-zinc-400 text-[11px] sm:text-sm">{label}</span>
        <span className="w-12 sm:w-16 text-right">{homeValue}</span>
      </div>
      <div className="flex items-center gap-0.5">
        <div className="flex-1 h-1.5 sm:h-2 rounded-l-full bg-zinc-700 overflow-hidden">
          <div
            className="h-full rounded-l-full transition-all duration-300"
            style={{ width: `${awayPct}%`, backgroundColor: awayColor }}
          />
        </div>
        <div className="flex-1 h-1.5 sm:h-2 rounded-r-full bg-zinc-700 overflow-hidden flex justify-end">
          <div
            className="h-full rounded-r-full transition-all duration-300"
            style={{ width: `${homePct}%`, backgroundColor: homeColor }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STAT SECTION COMPONENT
// ============================================================================

interface StatSectionProps {
  title: string;
  children: React.ReactNode;
}

function StatSection({ title, children }: StatSectionProps) {
  return (
    <div>
      <h3 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] px-3 sm:px-4 pb-1.5 pt-3 sm:pt-4">
        {title}
      </h3>
      <div className="flex flex-col bg-zinc-900/50">{children}</div>
    </div>
  );
}

// ============================================================================
// PLAYER STATS TAB
// ============================================================================

interface PlayerStatsTabProps {
  playerStats: PlayerGameStats[];
  awayTeam: TeamInfo;
  homeTeam: TeamInfo;
}

// Calculate passer rating
function calcPasserRating(comp: number, att: number, yds: number, td: number, int: number): string {
  if (att === 0) return '0.0';
  const a = Math.min(Math.max(((comp / att) - 0.3) * 5, 0), 2.375);
  const b = Math.min(Math.max(((yds / att) - 3) * 0.25, 0), 2.375);
  const c = Math.min(Math.max((td / att) * 20, 0), 2.375);
  const d = Math.min(Math.max(2.375 - ((int / att) * 25), 0), 2.375);
  return (((a + b + c + d) / 6) * 100).toFixed(1);
}

function PlayerStatsTab({ playerStats, awayTeam, homeTeam }: PlayerStatsTabProps) {
  const awayPlayers = playerStats.filter(p => p.teamId === 'away');
  const homePlayers = playerStats.filter(p => p.teamId === 'home');

  // Get all players with stats in each category (sorted by primary stat)
  const getPassers = (players: PlayerGameStats[]) =>
    players.filter(p => p.passing.attempts > 0).sort((a, b) => b.passing.yards - a.passing.yards);
  const getRushers = (players: PlayerGameStats[]) =>
    players.filter(p => p.rushing.carries > 0).sort((a, b) => b.rushing.yards - a.rushing.yards);
  const getReceivers = (players: PlayerGameStats[]) =>
    players.filter(p => p.receiving.targets > 0).sort((a, b) => b.receiving.yards - a.receiving.yards);
  const getDefenders = (players: PlayerGameStats[]) =>
    players.filter(p => p.defense.tackles > 0 || p.defense.sacks > 0 || p.defense.interceptions > 0 || p.defense.passDeflections > 0 || p.defense.fumbleRecoveries > 0)
    .sort((a, b) => (b.defense.tackles + b.defense.sacks * 2 + b.defense.interceptions * 3) - (a.defense.tackles + a.defense.sacks * 2 + a.defense.interceptions * 3));
  const getKickers = (players: PlayerGameStats[]) =>
    players.filter(p => p.kicking.fgAttempts > 0 || p.kicking.xpAttempts > 0 || p.kicking.punts > 0)
    .sort((a, b) => (b.kicking.fgMade + b.kicking.xpMade) - (a.kicking.fgMade + a.kicking.xpMade));

  // Table header component
  const TableHeader = ({ columns }: { columns: string[] }) => (
    <div className="flex text-[9px] sm:text-[10px] text-zinc-500 font-medium uppercase tracking-wider px-2 py-1 bg-zinc-800/30 border-b border-zinc-800">
      <span className="flex-1 min-w-[80px]">Player</span>
      {columns.map(col => <span key={col} className="w-8 sm:w-9 text-center flex-shrink-0">{col}</span>)}
    </div>
  );

  // Player row component
  const PlayerRow = ({ player, stats }: { player: PlayerGameStats; stats: (string | number)[] }) => (
    <div className="flex items-center px-2 py-1.5 border-b border-zinc-800/50 last:border-0 text-xs sm:text-sm">
      <div className="flex-1 min-w-[80px] truncate pr-1">
        <span className="text-white font-medium">{player.playerName}</span>
        <span className="text-zinc-500 text-[10px] ml-1">{player.position}</span>
      </div>
      {stats.map((stat, i) => (
        <span key={i} className="w-8 sm:w-9 text-center text-zinc-300 flex-shrink-0 text-[11px] sm:text-xs">{stat}</span>
      ))}
    </div>
  );

  // Team section with horizontal scroll wrapper
  const TeamSection = ({ teamAbbrev, children }: { teamAbbrev: string; children: React.ReactNode }) => (
    <div className="flex-1 min-w-0">
      <div className="px-2 py-1.5 bg-zinc-800/50 text-xs text-zinc-400 font-semibold border-b border-zinc-800">
        {teamAbbrev}
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );

  const awayPassers = getPassers(awayPlayers);
  const homePassers = getPassers(homePlayers);
  const awayRushers = getRushers(awayPlayers);
  const homeRushers = getRushers(homePlayers);
  const awayReceivers = getReceivers(awayPlayers);
  const homeReceivers = getReceivers(homePlayers);
  const awayDefenders = getDefenders(awayPlayers);
  const homeDefenders = getDefenders(homePlayers);
  const awayKickers = getKickers(awayPlayers);
  const homeKickers = getKickers(homePlayers);

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Passing */}
      {(awayPassers.length > 0 || homePassers.length > 0) && (
        <StatSection title="Passing">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <TeamSection teamAbbrev={awayTeam.abbrev}>
              <TableHeader columns={['C/A', 'YDS', 'TD', 'INT', 'SCK', 'RTG']} />
              {awayPassers.length > 0 ? awayPassers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  `${p.passing.completions}/${p.passing.attempts}`,
                  p.passing.yards,
                  p.passing.touchdowns,
                  p.passing.interceptions,
                  p.passing.sacked,
                  calcPasserRating(p.passing.completions, p.passing.attempts, p.passing.yards, p.passing.touchdowns, p.passing.interceptions)
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No passing stats</div>}
            </TeamSection>
            <TeamSection teamAbbrev={homeTeam.abbrev}>
              <TableHeader columns={['C/A', 'YDS', 'TD', 'INT', 'SCK', 'RTG']} />
              {homePassers.length > 0 ? homePassers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  `${p.passing.completions}/${p.passing.attempts}`,
                  p.passing.yards,
                  p.passing.touchdowns,
                  p.passing.interceptions,
                  p.passing.sacked,
                  calcPasserRating(p.passing.completions, p.passing.attempts, p.passing.yards, p.passing.touchdowns, p.passing.interceptions)
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No passing stats</div>}
            </TeamSection>
          </div>
        </StatSection>
      )}

      {/* Rushing */}
      {(awayRushers.length > 0 || homeRushers.length > 0) && (
        <StatSection title="Rushing">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <TeamSection teamAbbrev={awayTeam.abbrev}>
              <TableHeader columns={['CAR', 'YDS', 'AVG', 'TD', 'LNG', 'FUM']} />
              {awayRushers.length > 0 ? awayRushers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  p.rushing.carries,
                  p.rushing.yards,
                  p.rushing.carries > 0 ? (p.rushing.yards / p.rushing.carries).toFixed(1) : '0.0',
                  p.rushing.touchdowns,
                  p.rushing.long,
                  p.rushing.fumbles
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No rushing stats</div>}
            </TeamSection>
            <TeamSection teamAbbrev={homeTeam.abbrev}>
              <TableHeader columns={['CAR', 'YDS', 'AVG', 'TD', 'LNG', 'FUM']} />
              {homeRushers.length > 0 ? homeRushers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  p.rushing.carries,
                  p.rushing.yards,
                  p.rushing.carries > 0 ? (p.rushing.yards / p.rushing.carries).toFixed(1) : '0.0',
                  p.rushing.touchdowns,
                  p.rushing.long,
                  p.rushing.fumbles
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No rushing stats</div>}
            </TeamSection>
          </div>
        </StatSection>
      )}

      {/* Receiving */}
      {(awayReceivers.length > 0 || homeReceivers.length > 0) && (
        <StatSection title="Receiving">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <TeamSection teamAbbrev={awayTeam.abbrev}>
              <TableHeader columns={['TGT', 'REC', 'YDS', 'AVG', 'TD', 'LNG']} />
              {awayReceivers.length > 0 ? awayReceivers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  p.receiving.targets,
                  p.receiving.catches,
                  p.receiving.yards,
                  p.receiving.catches > 0 ? (p.receiving.yards / p.receiving.catches).toFixed(1) : '0.0',
                  p.receiving.touchdowns,
                  p.receiving.long
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No receiving stats</div>}
            </TeamSection>
            <TeamSection teamAbbrev={homeTeam.abbrev}>
              <TableHeader columns={['TGT', 'REC', 'YDS', 'AVG', 'TD', 'LNG']} />
              {homeReceivers.length > 0 ? homeReceivers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  p.receiving.targets,
                  p.receiving.catches,
                  p.receiving.yards,
                  p.receiving.catches > 0 ? (p.receiving.yards / p.receiving.catches).toFixed(1) : '0.0',
                  p.receiving.touchdowns,
                  p.receiving.long
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No receiving stats</div>}
            </TeamSection>
          </div>
        </StatSection>
      )}

      {/* Defense */}
      {(awayDefenders.length > 0 || homeDefenders.length > 0) && (
        <StatSection title="Defense">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <TeamSection teamAbbrev={awayTeam.abbrev}>
              <TableHeader columns={['TKL', 'SCK', 'INT', 'PD', 'FR']} />
              {awayDefenders.length > 0 ? awayDefenders.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  p.defense.tackles,
                  p.defense.sacks,
                  p.defense.interceptions,
                  p.defense.passDeflections,
                  p.defense.fumbleRecoveries
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No defensive stats</div>}
            </TeamSection>
            <TeamSection teamAbbrev={homeTeam.abbrev}>
              <TableHeader columns={['TKL', 'SCK', 'INT', 'PD', 'FR']} />
              {homeDefenders.length > 0 ? homeDefenders.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  p.defense.tackles,
                  p.defense.sacks,
                  p.defense.interceptions,
                  p.defense.passDeflections,
                  p.defense.fumbleRecoveries
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No defensive stats</div>}
            </TeamSection>
          </div>
        </StatSection>
      )}

      {/* Kicking */}
      {(awayKickers.length > 0 || homeKickers.length > 0) && (
        <StatSection title="Kicking">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            <TeamSection teamAbbrev={awayTeam.abbrev}>
              <TableHeader columns={['FG', 'XP', 'PNT', 'AVG']} />
              {awayKickers.length > 0 ? awayKickers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  `${p.kicking.fgMade}/${p.kicking.fgAttempts}`,
                  `${p.kicking.xpMade}/${p.kicking.xpAttempts}`,
                  p.kicking.punts,
                  p.kicking.punts > 0 ? (p.kicking.puntYards / p.kicking.punts).toFixed(1) : '-'
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No kicking stats</div>}
            </TeamSection>
            <TeamSection teamAbbrev={homeTeam.abbrev}>
              <TableHeader columns={['FG', 'XP', 'PNT', 'AVG']} />
              {homeKickers.length > 0 ? homeKickers.map(p => (
                <PlayerRow key={p.playerId} player={p} stats={[
                  `${p.kicking.fgMade}/${p.kicking.fgAttempts}`,
                  `${p.kicking.xpMade}/${p.kicking.xpAttempts}`,
                  p.kicking.punts,
                  p.kicking.punts > 0 ? (p.kicking.puntYards / p.kicking.punts).toFixed(1) : '-'
                ]} />
              )) : <div className="px-2 py-1.5 text-zinc-500 text-xs">No kicking stats</div>}
            </TeamSection>
          </div>
        </StatSection>
      )}
    </div>
  );
}

// ============================================================================
// TEAM STATS TAB
// ============================================================================

interface TeamStatsTabProps {
  awayStats: SimStats;
  homeStats: SimStats;
  awayColor?: string;
  homeColor?: string;
}

function TeamStatsTab({ awayStats, homeStats, awayColor, homeColor }: TeamStatsTabProps) {
  // Format time of possession (seconds to MM:SS)
  const formatTOP = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Offense Section */}
      <StatSection title="Offense">
        <StatRow
          label="First Downs"
          awayValue={awayStats.firstDowns}
          homeValue={homeStats.firstDowns}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Total Yards"
          awayValue={awayStats.yards}
          homeValue={homeStats.yards}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Passing Yards"
          awayValue={awayStats.passYards}
          homeValue={homeStats.passYards}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Comp - Att"
          awayValue={`${awayStats.completions}-${awayStats.attempts}`}
          homeValue={`${homeStats.completions}-${homeStats.attempts}`}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Rushing Yards"
          awayValue={awayStats.rushYards}
          homeValue={homeStats.rushYards}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Rush Attempts"
          awayValue={awayStats.carries}
          homeValue={homeStats.carries}
          awayColor={awayColor}
          homeColor={homeColor}
          isLast
        />
      </StatSection>

      {/* Turnovers Section */}
      <StatSection title="Turnovers">
        <StatRow
          label="Interceptions"
          awayValue={awayStats.interceptions}
          homeValue={homeStats.interceptions}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Fumbles Lost"
          awayValue={awayStats.fumbles}
          homeValue={homeStats.fumbles}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Total Turnovers"
          awayValue={awayStats.interceptions + awayStats.fumbles}
          homeValue={homeStats.interceptions + homeStats.fumbles}
          awayColor={awayColor}
          homeColor={homeColor}
          isLast
        />
      </StatSection>

      {/* Scoring Section */}
      <StatSection title="Scoring">
        <StatRow
          label="Passing TDs"
          awayValue={awayStats.passTDs}
          homeValue={homeStats.passTDs}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Rushing TDs"
          awayValue={awayStats.rushTDs}
          homeValue={homeStats.rushTDs}
          awayColor={awayColor}
          homeColor={homeColor}
          isLast
        />
      </StatSection>

      {/* Other Section */}
      <StatSection title="Other">
        <StatRow
          label="Sacks"
          awayValue={awayStats.sacks}
          homeValue={homeStats.sacks}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Penalties"
          awayValue={awayStats.penalties}
          homeValue={homeStats.penalties}
          awayColor={awayColor}
          homeColor={homeColor}
        />
        <StatRow
          label="Time of Possession"
          awayValue={formatTOP(awayStats.timeOfPossession)}
          homeValue={formatTOP(homeStats.timeOfPossession)}
          awayColor={awayColor}
          homeColor={homeColor}
          isLast
        />
      </StatSection>
    </div>
  );
}

// ============================================================================
// SCORING TAB
// ============================================================================

interface ScoringTabProps {
  awayTeam: TeamInfo;
  homeTeam: TeamInfo;
  awayScore: number;
  homeScore: number;
  awayStats: SimStats;
  homeStats: SimStats;
  scoringPlays?: ScoringPlay[];
  awayColor?: string;
  homeColor?: string;
}

function ScoringTab({
  awayTeam,
  homeTeam,
  awayScore,
  homeScore,
  awayStats,
  homeStats,
  scoringPlays = [],
  awayColor = '#3b82f6',
  homeColor = '#ef4444',
}: ScoringTabProps) {
  // Group scoring plays by quarter
  const playsByQuarter = scoringPlays.reduce((acc, play) => {
    if (!acc[play.quarter]) acc[play.quarter] = [];
    acc[play.quarter].push(play);
    return acc;
  }, {} as Record<number, ScoringPlay[]>);

  const quarters = Object.keys(playsByQuarter).map(Number).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Score Header */}
      <div className="px-3 sm:px-4 pt-3">
        <div className="bg-zinc-900/50 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4">
            {/* Away Team */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: awayColor }}
              >
                {awayTeam.abbrev.slice(0, 2)}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{awayTeam.abbrev}</div>
                <div className="text-zinc-400 text-xs">{awayTeam.name}</div>
              </div>
            </div>
            {/* Score */}
            <div className="text-center">
              <div className="text-white text-2xl font-bold">
                {awayScore} - {homeScore}
              </div>
              <div className="text-zinc-500 text-xs">Final</div>
            </div>
            {/* Home Team */}
            <div className="flex items-center gap-3 flex-row-reverse">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: homeColor }}
              >
                {homeTeam.abbrev.slice(0, 2)}
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{homeTeam.abbrev}</div>
                <div className="text-zinc-400 text-xs">{homeTeam.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Plays List */}
      {scoringPlays.length > 0 ? (
        <div className="px-3 sm:px-4">
          <h3 className="text-white text-base font-bold mb-3">Scoring Plays</h3>
          <div className="space-y-4">
            {quarters.map((quarter) => (
              <div key={quarter}>
                <div className="text-zinc-400 text-xs font-semibold uppercase mb-2 px-1">
                  {quarter <= 4 ? `${quarter === 1 ? '1st' : quarter === 2 ? '2nd' : quarter === 3 ? '3rd' : '4th'} Quarter` : 'Overtime'}
                </div>
                <div className="space-y-2">
                  {playsByQuarter[quarter].map((play, idx) => {
                    const teamColor = play.team === 'away' ? awayColor : homeColor;
                    const teamAbbrev = play.team === 'away' ? awayTeam.abbrev : homeTeam.abbrev;
                    const typeLabel = play.type === 'TD' ? 'TD' : play.type === 'FG' ? 'FG' : play.type === 'XP' ? 'XP' : play.type;

                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                      >
                        {/* Team badge */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: teamColor }}
                        >
                          {teamAbbrev.slice(0, 2)}
                        </div>
                        {/* Play info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {typeLabel}
                            </span>
                            <span className="text-zinc-500 text-xs">{play.clock}</span>
                          </div>
                          <p className="text-white text-sm leading-tight">{play.description}</p>
                        </div>
                        {/* Running Score */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-white text-sm font-bold">
                            {play.awayScore}-{play.homeScore}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Fallback: Show summary when no scoring plays data */
        <div className="px-3 sm:px-4">
          <h3 className="text-white text-base font-bold mb-3">Scoring Summary</h3>
          <div className="bg-zinc-900/50 rounded-lg p-4 space-y-3">
            {/* Away */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: awayColor }}
                >
                  {awayTeam.abbrev.slice(0, 2)}
                </div>
                <span className="text-white text-sm">{awayTeam.name}</span>
              </div>
              <div className="text-zinc-400 text-xs">
                {awayStats.passTDs > 0 && <span>{awayStats.passTDs} Pass TD{awayStats.passTDs > 1 ? 's' : ''}</span>}
                {awayStats.passTDs > 0 && awayStats.rushTDs > 0 && <span>, </span>}
                {awayStats.rushTDs > 0 && <span>{awayStats.rushTDs} Rush TD{awayStats.rushTDs > 1 ? 's' : ''}</span>}
              </div>
            </div>
            {/* Home */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: homeColor }}
                >
                  {homeTeam.abbrev.slice(0, 2)}
                </div>
                <span className="text-white text-sm">{homeTeam.name}</span>
              </div>
              <div className="text-zinc-400 text-xs">
                {homeStats.passTDs > 0 && <span>{homeStats.passTDs} Pass TD{homeStats.passTDs > 1 ? 's' : ''}</span>}
                {homeStats.passTDs > 0 && homeStats.rushTDs > 0 && <span>, </span>}
                {homeStats.rushTDs > 0 && <span>{homeStats.rushTDs} Rush TD{homeStats.rushTDs > 1 ? 's' : ''}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN BOX SCORE COMPONENT
// ============================================================================

export function BoxScore({
  awayTeam,
  homeTeam,
  awayScore,
  homeScore,
  awayStats,
  homeStats,
  playerStats,
  scoringPlays,
  isFinal = true,
  onBack,
}: BoxScoreProps) {
  const [activeTab, setActiveTab] = useState<TabType>('team');

  // Default colors if not provided
  const awayColor = awayTeam.primaryColor || '#3b82f6';
  const homeColor = homeTeam.primaryColor || '#ef4444';

  return (
    <div className="relative flex h-auto w-full flex-col bg-zinc-950 overflow-y-auto max-h-[85vh]">
      {/* Header Bar */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm pt-2 sm:pt-4">
        {/* Navigation */}
        <div className="flex items-center px-3 pb-1 justify-between">
          <button
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-start text-white hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-white text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Box Score
          </h1>
          <div className="w-10" />
        </div>

        {/* Score Header */}
        <div className="flex justify-between items-center px-3 py-2 sm:py-4">
          <div className="flex flex-col items-center gap-1 w-1/3">
            <div
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-xl"
              style={{ backgroundColor: awayColor }}
            >
              {awayTeam.abbrev.slice(0, 2)}
            </div>
            <span className="text-white font-semibold text-xs sm:text-base">{awayTeam.abbrev}</span>
          </div>
          <div className="text-center">
            <span className="text-white text-2xl sm:text-4xl font-bold">
              {awayScore} - {homeScore}
            </span>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-0.5">
              {isFinal ? 'Final' : 'In Progress'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 w-1/3">
            <div
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-xl"
              style={{ backgroundColor: homeColor }}
            >
              {homeTeam.abbrev.slice(0, 2)}
            </div>
            <span className="text-white font-semibold text-xs sm:text-base">{homeTeam.abbrev}</span>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex px-3 py-2">
          <div className="flex h-9 sm:h-10 flex-1 items-center justify-center rounded-lg bg-zinc-800 p-1">
            <button
              onClick={() => setActiveTab('team')}
              className={cn(
                'flex h-full grow items-center justify-center rounded-md px-2 text-xs sm:text-sm font-medium transition-all',
                activeTab === 'team'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('player')}
              className={cn(
                'flex h-full grow items-center justify-center rounded-md px-2 text-xs sm:text-sm font-medium transition-all',
                activeTab === 'player'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Players
            </button>
            <button
              onClick={() => setActiveTab('scoring')}
              className={cn(
                'flex h-full grow items-center justify-center rounded-md px-2 text-xs sm:text-sm font-medium transition-all',
                activeTab === 'scoring'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-300'
              )}
            >
              Scoring
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'team' && (
        <TeamStatsTab
          awayStats={awayStats}
          homeStats={homeStats}
          awayColor={awayColor}
          homeColor={homeColor}
        />
      )}
      {activeTab === 'player' && (
        <PlayerStatsTab
          playerStats={playerStats}
          awayTeam={awayTeam}
          homeTeam={homeTeam}
        />
      )}
      {activeTab === 'scoring' && (
        <ScoringTab
          awayTeam={awayTeam}
          homeTeam={homeTeam}
          awayScore={awayScore}
          homeScore={homeScore}
          awayStats={awayStats}
          homeStats={homeStats}
          scoringPlays={scoringPlays}
          awayColor={awayColor}
          homeColor={homeColor}
        />
      )}
    </div>
  );
}
