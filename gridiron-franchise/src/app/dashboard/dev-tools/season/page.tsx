'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Play, FastForward, SkipForward, RotateCcw, Trophy, Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { getFullGameData, TeamRosterData } from '@/lib/dev-player-store';
import { adaptTeamRoster } from '@/lib/sim/team-adapter';
import { SimTeam } from '@/lib/sim/types';
import { SeasonSimulator, SeasonTeam, TeamStanding, WeekSummary, GameResult, formatRecord, formatStreak } from '@/lib/season';
import { generateSchedule } from '@/lib/schedule/schedule-generator';
import { WeekSchedule, ScheduleGeneratorConfig } from '@/lib/schedule/types';

// Helper to convert SimTeam to SeasonTeam
function toSeasonTeam(team: SimTeam, division: string, conference: 'Atlantic' | 'Pacific', byeWeek: number): SeasonTeam {
  return {
    ...team,
    division,
    conference,
    byeWeek,
    seasonStats: {
      gamesPlayed: 0,
      totalYards: 0,
      totalPassYards: 0,
      totalRushYards: 0,
      totalPointsScored: 0,
      totalPointsAllowed: 0,
      turnoversCommitted: 0,
      turnoversTaken: 0,
      sacks: 0,
      sacksAllowed: 0,
    },
  };
}

// Division assignments for teams (would come from team data in production)
const DIVISION_MAP: Record<number, { division: string; conference: 'Atlantic' | 'Pacific' }> = {
  0: { division: 'Atlantic East', conference: 'Atlantic' },
  1: { division: 'Atlantic East', conference: 'Atlantic' },
  2: { division: 'Atlantic East', conference: 'Atlantic' },
  3: { division: 'Atlantic East', conference: 'Atlantic' },
  4: { division: 'Atlantic North', conference: 'Atlantic' },
  5: { division: 'Atlantic North', conference: 'Atlantic' },
  6: { division: 'Atlantic North', conference: 'Atlantic' },
  7: { division: 'Atlantic North', conference: 'Atlantic' },
  8: { division: 'Atlantic South', conference: 'Atlantic' },
  9: { division: 'Atlantic South', conference: 'Atlantic' },
  10: { division: 'Atlantic South', conference: 'Atlantic' },
  11: { division: 'Atlantic South', conference: 'Atlantic' },
  12: { division: 'Atlantic West', conference: 'Atlantic' },
  13: { division: 'Atlantic West', conference: 'Atlantic' },
  14: { division: 'Atlantic West', conference: 'Atlantic' },
  15: { division: 'Atlantic West', conference: 'Atlantic' },
  16: { division: 'Pacific East', conference: 'Pacific' },
  17: { division: 'Pacific East', conference: 'Pacific' },
  18: { division: 'Pacific East', conference: 'Pacific' },
  19: { division: 'Pacific East', conference: 'Pacific' },
  20: { division: 'Pacific North', conference: 'Pacific' },
  21: { division: 'Pacific North', conference: 'Pacific' },
  22: { division: 'Pacific North', conference: 'Pacific' },
  23: { division: 'Pacific North', conference: 'Pacific' },
  24: { division: 'Pacific South', conference: 'Pacific' },
  25: { division: 'Pacific South', conference: 'Pacific' },
  26: { division: 'Pacific South', conference: 'Pacific' },
  27: { division: 'Pacific South', conference: 'Pacific' },
  28: { division: 'Pacific West', conference: 'Pacific' },
  29: { division: 'Pacific West', conference: 'Pacific' },
  30: { division: 'Pacific West', conference: 'Pacific' },
  31: { division: 'Pacific West', conference: 'Pacific' },
};

export default function SeasonPage() {
  const router = useRouter();
  const simulatorRef = useRef<SeasonSimulator | null>(null);

  // State
  const [teams, setTeams] = useState<SimTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Season options
  const [simulateInjuries, setSimulateInjuries] = useState(true);
  const [verboseLogging, setVerboseLogging] = useState(false);

  // Season state
  const [currentWeek, setCurrentWeek] = useState(1);
  const [phase, setPhase] = useState<'regular' | 'playoffs' | 'offseason'>('regular');
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [weekSummaries, setWeekSummaries] = useState<WeekSummary[]>([]);
  const [selectedConference, setSelectedConference] = useState<'Atlantic' | 'Pacific'>('Atlantic');
  const [statsCategory, setStatsCategory] = useState<'team' | 'passing' | 'rushing' | 'receiving' | 'defense'>('team');

  // Load teams
  useEffect(() => {
    const fullGameData = getFullGameData();
    if (fullGameData && fullGameData.teams.length > 0) {
      const simTeams = fullGameData.teams.map((teamData: TeamRosterData) => adaptTeamRoster(teamData));
      setTeams(simTeams);
    }
    setLoading(false);
  }, []);

  // Start new season
  const startSeason = useCallback(() => {
    if (teams.length < 32) {
      alert(`Need 32 teams for a full season. Currently have ${teams.length} teams.`);
      return;
    }

    // Convert SimTeams to SeasonTeams with division assignments
    const seasonTeams: SeasonTeam[] = teams.slice(0, 32).map((team, index) => {
      const divInfo = DIVISION_MAP[index] || { division: 'Atlantic East', conference: 'Atlantic' as const };
      const byeWeek = 5 + (index % 14); // Bye weeks 5-18
      return toSeasonTeam(team, divInfo.division, divInfo.conference, byeWeek);
    });

    // Generate schedule
    const schedule = generateSchedule({
      season: 2025,
      randomizeStandings: true,
    });

    // Create simulator
    simulatorRef.current = new SeasonSimulator({
      year: 2025,
      teams: seasonTeams,
      schedule: schedule.weeks,
      simulateInjuries,
      injuryRate: 0.03,
      enableProgression: false,
      verboseLogging,
    });

    // Update state
    const state = simulatorRef.current.getState();
    setStandings(state.standings);
    setCurrentWeek(state.week);
    setPhase(state.phase as 'regular' | 'playoffs' | 'offseason');
    setIsStarted(true);
    setWeekSummaries([]);
  }, [teams, simulateInjuries, verboseLogging]);

  // Simulate one week
  const simWeek = useCallback(() => {
    if (!simulatorRef.current) return;

    setIsSimulating(true);

    try {
      const summary = simulatorRef.current.simulateWeek();
      const state = simulatorRef.current.getState();

      setWeekSummaries(prev => [...prev, summary]);
      setStandings(state.standings);
      setCurrentWeek(state.week);
      setPhase(state.phase as 'regular' | 'playoffs' | 'offseason');
    } catch (error) {
      console.error('Simulation error:', error);
    }

    setIsSimulating(false);
  }, []);

  // Simulate entire regular season
  const simRegularSeason = useCallback(async () => {
    if (!simulatorRef.current) return;

    setIsSimulating(true);

    // Simulate week by week with a small delay for UI updates
    const simulateNextWeek = () => {
      const state = simulatorRef.current!.getState();
      if (state.phase === 'regular') {
        const summary = simulatorRef.current!.simulateWeek();
        const newState = simulatorRef.current!.getState();

        setWeekSummaries(prev => [...prev, summary]);
        setStandings(newState.standings);
        setCurrentWeek(newState.week);
        setPhase(newState.phase as 'regular' | 'playoffs' | 'offseason');

        setTimeout(simulateNextWeek, 50);
      } else {
        setIsSimulating(false);
      }
    };

    simulateNextWeek();
  }, []);

  // Simulate playoffs
  const simPlayoffs = useCallback(async () => {
    if (!simulatorRef.current) return;

    setIsSimulating(true);

    const simulateNextRound = () => {
      const state = simulatorRef.current!.getState();
      if (state.phase === 'playoffs') {
        const summary = simulatorRef.current!.simulateWeek();
        const newState = simulatorRef.current!.getState();

        setWeekSummaries(prev => [...prev, summary]);
        setStandings(newState.standings);
        setCurrentWeek(newState.week);
        setPhase(newState.phase as 'regular' | 'playoffs' | 'offseason');

        setTimeout(simulateNextRound, 100);
      } else {
        setIsSimulating(false);
      }
    };

    simulateNextRound();
  }, []);

  // Reset season
  const resetSeason = useCallback(() => {
    simulatorRef.current = null;
    setIsStarted(false);
    setStandings([]);
    setWeekSummaries([]);
    setCurrentWeek(1);
    setPhase('regular');
  }, []);

  // Get division standings
  const getDivisionStandings = (division: string) => {
    return standings
      .filter(s => s.division === division)
      .sort((a, b) => a.divisionRank - b.divisionRank);
  };

  // Get playoff teams
  const getPlayoffTeams = (conference: 'Atlantic' | 'Pacific') => {
    return standings
      .filter(s => s.conference === conference && s.playoffSeed !== null)
      .sort((a, b) => (a.playoffSeed || 0) - (b.playoffSeed || 0));
  };

  // Get latest week's games
  const latestWeekGames = weekSummaries.length > 0
    ? weekSummaries[weekSummaries.length - 1].games
    : [];

  // Aggregate player stats across all games
  const getAggregatedPlayerStats = useCallback(() => {
    const playerMap = new Map<string, {
      playerId: string;
      playerName: string;
      position: string;
      teamAbbrev: string;
      passing: { attempts: number; completions: number; yards: number; touchdowns: number; interceptions: number };
      rushing: { carries: number; yards: number; touchdowns: number };
      receiving: { targets: number; catches: number; yards: number; touchdowns: number };
      defense: { tackles: number; sacks: number; interceptions: number; passDeflections: number };
    }>();

    // Aggregate all player stats from all games
    for (const summary of weekSummaries) {
      for (const game of summary.games) {
        for (const ps of game.playerStats) {
          const teamId = ps.teamId === 'away' ? game.awayTeamId : game.homeTeamId;
          const team = simulatorRef.current?.getTeam(teamId);
          const key = ps.playerId;

          if (!playerMap.has(key)) {
            playerMap.set(key, {
              playerId: ps.playerId,
              playerName: ps.playerName,
              position: ps.position,
              teamAbbrev: team?.abbrev || '???',
              passing: { attempts: 0, completions: 0, yards: 0, touchdowns: 0, interceptions: 0 },
              rushing: { carries: 0, yards: 0, touchdowns: 0 },
              receiving: { targets: 0, catches: 0, yards: 0, touchdowns: 0 },
              defense: { tackles: 0, sacks: 0, interceptions: 0, passDeflections: 0 },
            });
          }

          const player = playerMap.get(key)!;
          player.passing.attempts += ps.passing.attempts;
          player.passing.completions += ps.passing.completions;
          player.passing.yards += ps.passing.yards;
          player.passing.touchdowns += ps.passing.touchdowns;
          player.passing.interceptions += ps.passing.interceptions;
          player.rushing.carries += ps.rushing.carries;
          player.rushing.yards += ps.rushing.yards;
          player.rushing.touchdowns += ps.rushing.touchdowns;
          player.receiving.targets += ps.receiving.targets;
          player.receiving.catches += ps.receiving.catches;
          player.receiving.yards += ps.receiving.yards;
          player.receiving.touchdowns += ps.receiving.touchdowns;
          player.defense.tackles += ps.defense.tackles;
          player.defense.sacks += ps.defense.sacks;
          player.defense.interceptions += ps.defense.interceptions;
          player.defense.passDeflections += ps.defense.passDeflections;
        }
      }
    }

    return Array.from(playerMap.values());
  }, [weekSummaries]);

  // Get team stats sorted
  const getTeamStats = useCallback(() => {
    const teams = simulatorRef.current?.getTeams() || [];
    return teams
      .map(t => ({
        ...t,
        ppg: t.seasonStats.gamesPlayed > 0 ? (t.seasonStats.totalPointsScored / t.seasonStats.gamesPlayed).toFixed(1) : '0.0',
        papg: t.seasonStats.gamesPlayed > 0 ? (t.seasonStats.totalPointsAllowed / t.seasonStats.gamesPlayed).toFixed(1) : '0.0',
        ypg: t.seasonStats.gamesPlayed > 0 ? (t.seasonStats.totalYards / t.seasonStats.gamesPlayed).toFixed(1) : '0.0',
        turnoverDiff: t.seasonStats.turnoversTaken - t.seasonStats.turnoversCommitted,
      }))
      .sort((a, b) => b.seasonStats.totalPointsScored - a.seasonStats.totalPointsScored);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/dev-tools')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Season Simulator</h1>
            <p className="text-muted-foreground">
              Simulate an 18-week season with playoffs
            </p>
          </div>
        </div>

        {isStarted && (
          <div className="flex items-center gap-4">
            <Badge variant={phase === 'playoffs' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {phase === 'regular' ? `Week ${currentWeek}` :
               phase === 'playoffs' ? 'PLAYOFFS' :
               'OFFSEASON'}
            </Badge>
          </div>
        )}
      </div>

      {/* Pre-game Setup */}
      {!isStarted && (
        <Card>
          <CardHeader>
            <CardTitle>Season Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={simulateInjuries ? 'default' : 'outline'}
                onClick={() => setSimulateInjuries(!simulateInjuries)}
                size="sm"
              >
                {simulateInjuries ? '✓' : '○'} Simulate Injuries
              </Button>
              <Button
                variant={verboseLogging ? 'default' : 'outline'}
                onClick={() => setVerboseLogging(!verboseLogging)}
                size="sm"
              >
                {verboseLogging ? '✓' : '○'} Verbose Logging
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Teams loaded:</strong> {teams.length} / 32 required
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This will simulate a full 18-week regular season followed by playoffs.
                All modules (schemes, coaching, facilities) are integrated.
              </p>
            </div>

            <Button
              onClick={startSeason}
              disabled={teams.length < 32}
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start 2025 Season
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Season UI */}
      {isStarted && (
        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Button onClick={simWeek} disabled={isSimulating || phase === 'offseason'}>
                  <Play className="mr-2 h-4 w-4" />
                  Sim Week
                </Button>
                <Button
                  onClick={simRegularSeason}
                  disabled={isSimulating || phase !== 'regular'}
                  variant="secondary"
                >
                  <FastForward className="mr-2 h-4 w-4" />
                  Sim Regular Season
                </Button>
                <Button
                  onClick={simPlayoffs}
                  disabled={isSimulating || phase !== 'playoffs'}
                  variant="secondary"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Sim Playoffs
                </Button>
                <div className="flex-1" />
                <Button onClick={resetSeason} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              {phase === 'regular' && (
                <Progress value={(currentWeek - 1) / 18 * 100} className="mt-4" />
              )}
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="standings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="standings">
                <TrendingUp className="mr-2 h-4 w-4" />
                Standings
              </TabsTrigger>
              <TabsTrigger value="results">
                <Calendar className="mr-2 h-4 w-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="stats">
                <BarChart3 className="mr-2 h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="playoffs">
                <Trophy className="mr-2 h-4 w-4" />
                Playoffs
              </TabsTrigger>
            </TabsList>

            {/* Standings Tab */}
            <TabsContent value="standings" className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedConference === 'Atlantic' ? 'default' : 'outline'}
                  onClick={() => setSelectedConference('Atlantic')}
                  size="sm"
                >
                  Atlantic
                </Button>
                <Button
                  variant={selectedConference === 'Pacific' ? 'default' : 'outline'}
                  onClick={() => setSelectedConference('Pacific')}
                  size="sm"
                >
                  Pacific
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[`${selectedConference} East`, `${selectedConference} North`, `${selectedConference} South`, `${selectedConference} West`].map(division => (
                  <Card key={division}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">{division}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted-foreground text-xs">
                            <th className="text-left py-1">Team</th>
                            <th className="text-center">W-L</th>
                            <th className="text-center">PCT</th>
                            <th className="text-center">STR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getDivisionStandings(division).map((team, idx) => (
                            <tr key={team.teamId} className={idx === 0 ? 'font-semibold' : ''}>
                              <td className="py-1 flex items-center gap-2">
                                {team.playoffSeed && (
                                  <Badge variant="outline" className="text-xs">
                                    {team.playoffSeed}
                                  </Badge>
                                )}
                                {team.teamAbbrev}
                              </td>
                              <td className="text-center">{formatRecord(team.record)}</td>
                              <td className="text-center">
                                {((team.record.wins / (team.record.wins + team.record.losses + team.record.ties || 1)) * 100).toFixed(0)}%
                              </td>
                              <td className="text-center">{formatStreak(team.record.streak)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Week {currentWeek > 1 ? currentWeek - 1 : '-'} Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {latestWeekGames.length === 0 ? (
                    <p className="text-muted-foreground">No games played yet.</p>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {latestWeekGames.map((game, idx) => {
                          const awayTeam = simulatorRef.current?.getTeam(game.awayTeamId);
                          const homeTeam = simulatorRef.current?.getTeam(game.homeTeamId);
                          const awayWon = game.awayScore > game.homeScore;

                          return (
                            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className={`flex items-center gap-2 ${awayWon ? 'font-bold' : ''}`}>
                                <span className="w-12 text-right">{game.awayScore}</span>
                                <span>{awayTeam?.abbrev || game.awayTeamId}</span>
                              </div>
                              <span className="text-muted-foreground text-sm">@</span>
                              <div className={`flex items-center gap-2 ${!awayWon ? 'font-bold' : ''}`}>
                                <span>{homeTeam?.abbrev || game.homeTeamId}</span>
                                <span className="w-12">{game.homeScore}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              {/* Category selector */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'team', label: 'Team Stats' },
                  { value: 'passing', label: 'Passing' },
                  { value: 'rushing', label: 'Rushing' },
                  { value: 'receiving', label: 'Receiving' },
                  { value: 'defense', label: 'Defense' },
                ].map(cat => (
                  <Button
                    key={cat.value}
                    variant={statsCategory === cat.value ? 'default' : 'outline'}
                    onClick={() => setStatsCategory(cat.value as typeof statsCategory)}
                    size="sm"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              {weekSummaries.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">
                      Stats will appear after games are played.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Team Stats */}
                  {statsCategory === 'team' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-background">
                              <tr className="text-muted-foreground text-xs border-b">
                                <th className="text-left py-2 px-2">Team</th>
                                <th className="text-center px-2">GP</th>
                                <th className="text-center px-2">PTS</th>
                                <th className="text-center px-2">PPG</th>
                                <th className="text-center px-2">PAPG</th>
                                <th className="text-center px-2">YDS</th>
                                <th className="text-center px-2">PASS</th>
                                <th className="text-center px-2">RUSH</th>
                                <th className="text-center px-2">TO+/-</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTeamStats().map((team, idx) => (
                                <tr key={team.id} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                                  <td className="py-2 px-2 font-medium">{team.abbrev}</td>
                                  <td className="text-center px-2">{team.seasonStats.gamesPlayed}</td>
                                  <td className="text-center px-2">{team.seasonStats.totalPointsScored}</td>
                                  <td className="text-center px-2">{team.ppg}</td>
                                  <td className="text-center px-2">{team.papg}</td>
                                  <td className="text-center px-2">{team.seasonStats.totalYards}</td>
                                  <td className="text-center px-2">{team.seasonStats.totalPassYards}</td>
                                  <td className="text-center px-2">{team.seasonStats.totalRushYards}</td>
                                  <td className={`text-center px-2 ${team.turnoverDiff > 0 ? 'text-green-500' : team.turnoverDiff < 0 ? 'text-red-500' : ''}`}>
                                    {team.turnoverDiff > 0 ? '+' : ''}{team.turnoverDiff}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {/* Passing Leaders */}
                  {statsCategory === 'passing' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Passing Leaders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-background">
                              <tr className="text-muted-foreground text-xs border-b">
                                <th className="text-left py-2 px-2">Player</th>
                                <th className="text-center px-2">Team</th>
                                <th className="text-center px-2">CMP</th>
                                <th className="text-center px-2">ATT</th>
                                <th className="text-center px-2">YDS</th>
                                <th className="text-center px-2">TD</th>
                                <th className="text-center px-2">INT</th>
                                <th className="text-center px-2">CMP%</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getAggregatedPlayerStats()
                                .filter(p => p.passing.attempts >= 10)
                                .sort((a, b) => b.passing.yards - a.passing.yards)
                                .slice(0, 20)
                                .map((player, idx) => (
                                  <tr key={player.playerId} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                                    <td className="py-2 px-2 font-medium">{player.playerName}</td>
                                    <td className="text-center px-2">{player.teamAbbrev}</td>
                                    <td className="text-center px-2">{player.passing.completions}</td>
                                    <td className="text-center px-2">{player.passing.attempts}</td>
                                    <td className="text-center px-2 font-semibold">{player.passing.yards}</td>
                                    <td className="text-center px-2 text-green-500">{player.passing.touchdowns}</td>
                                    <td className="text-center px-2 text-red-500">{player.passing.interceptions}</td>
                                    <td className="text-center px-2">
                                      {((player.passing.completions / player.passing.attempts) * 100).toFixed(1)}%
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {/* Rushing Leaders */}
                  {statsCategory === 'rushing' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Rushing Leaders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-background">
                              <tr className="text-muted-foreground text-xs border-b">
                                <th className="text-left py-2 px-2">Player</th>
                                <th className="text-center px-2">Team</th>
                                <th className="text-center px-2">POS</th>
                                <th className="text-center px-2">CAR</th>
                                <th className="text-center px-2">YDS</th>
                                <th className="text-center px-2">TD</th>
                                <th className="text-center px-2">YPC</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getAggregatedPlayerStats()
                                .filter(p => p.rushing.carries >= 5)
                                .sort((a, b) => b.rushing.yards - a.rushing.yards)
                                .slice(0, 20)
                                .map((player, idx) => (
                                  <tr key={player.playerId} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                                    <td className="py-2 px-2 font-medium">{player.playerName}</td>
                                    <td className="text-center px-2">{player.teamAbbrev}</td>
                                    <td className="text-center px-2">{player.position}</td>
                                    <td className="text-center px-2">{player.rushing.carries}</td>
                                    <td className="text-center px-2 font-semibold">{player.rushing.yards}</td>
                                    <td className="text-center px-2 text-green-500">{player.rushing.touchdowns}</td>
                                    <td className="text-center px-2">
                                      {(player.rushing.yards / player.rushing.carries).toFixed(1)}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {/* Receiving Leaders */}
                  {statsCategory === 'receiving' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Receiving Leaders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-background">
                              <tr className="text-muted-foreground text-xs border-b">
                                <th className="text-left py-2 px-2">Player</th>
                                <th className="text-center px-2">Team</th>
                                <th className="text-center px-2">POS</th>
                                <th className="text-center px-2">REC</th>
                                <th className="text-center px-2">TGT</th>
                                <th className="text-center px-2">YDS</th>
                                <th className="text-center px-2">TD</th>
                                <th className="text-center px-2">YPR</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getAggregatedPlayerStats()
                                .filter(p => p.receiving.catches >= 1)
                                .sort((a, b) => b.receiving.yards - a.receiving.yards)
                                .slice(0, 20)
                                .map((player, idx) => (
                                  <tr key={player.playerId} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                                    <td className="py-2 px-2 font-medium">{player.playerName}</td>
                                    <td className="text-center px-2">{player.teamAbbrev}</td>
                                    <td className="text-center px-2">{player.position}</td>
                                    <td className="text-center px-2">{player.receiving.catches}</td>
                                    <td className="text-center px-2">{player.receiving.targets}</td>
                                    <td className="text-center px-2 font-semibold">{player.receiving.yards}</td>
                                    <td className="text-center px-2 text-green-500">{player.receiving.touchdowns}</td>
                                    <td className="text-center px-2">
                                      {player.receiving.catches > 0
                                        ? (player.receiving.yards / player.receiving.catches).toFixed(1)
                                        : '0.0'}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {/* Defense Leaders */}
                  {statsCategory === 'defense' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Defensive Leaders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-background">
                              <tr className="text-muted-foreground text-xs border-b">
                                <th className="text-left py-2 px-2">Player</th>
                                <th className="text-center px-2">Team</th>
                                <th className="text-center px-2">POS</th>
                                <th className="text-center px-2">TKL</th>
                                <th className="text-center px-2">SACK</th>
                                <th className="text-center px-2">INT</th>
                                <th className="text-center px-2">PD</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getAggregatedPlayerStats()
                                .filter(p => p.defense.tackles > 0 || p.defense.sacks > 0)
                                .sort((a, b) => b.defense.tackles - a.defense.tackles)
                                .slice(0, 20)
                                .map((player, idx) => (
                                  <tr key={player.playerId} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                                    <td className="py-2 px-2 font-medium">{player.playerName}</td>
                                    <td className="text-center px-2">{player.teamAbbrev}</td>
                                    <td className="text-center px-2">{player.position}</td>
                                    <td className="text-center px-2 font-semibold">{player.defense.tackles}</td>
                                    <td className="text-center px-2 text-orange-500">{player.defense.sacks.toFixed(1)}</td>
                                    <td className="text-center px-2 text-green-500">{player.defense.interceptions}</td>
                                    <td className="text-center px-2">{player.defense.passDeflections}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            {/* Playoffs Tab */}
            <TabsContent value="playoffs">
              <div className="grid grid-cols-2 gap-4">
                {['Atlantic', 'Pacific'].map(conf => (
                  <Card key={conf}>
                    <CardHeader>
                      <CardTitle>{conf} Conference Playoff Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getPlayoffTeams(conf as 'Atlantic' | 'Pacific').map(team => {
                          const t = simulatorRef.current?.getTeam(team.teamId);
                          return (
                            <div key={team.teamId} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex items-center gap-2">
                                <Badge>{team.playoffSeed}</Badge>
                                <span>{t?.city} {t?.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatRecord(team.record)}
                              </span>
                            </div>
                          );
                        })}
                        {getPlayoffTeams(conf as 'Atlantic' | 'Pacific').length === 0 && (
                          <p className="text-muted-foreground text-sm">
                            Playoff picture will be available after week 1.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {simulatorRef.current?.getState().playoffBracket?.champion && (
                <Card className="mt-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                      <h2 className="text-2xl font-bold">
                        🏆 {simulatorRef.current?.getState().playoffBracket?.champion?.teamName}
                      </h2>
                      <p className="text-muted-foreground">2025 League Champions</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
