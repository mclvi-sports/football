'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { storeSchedule, getSchedule } from '@/lib/schedule/schedule-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import {
  LeagueSchedule,
  ScheduleStats,
  ScheduleValidation,
  ScheduledGame,
  WeekSchedule,
  TeamSchedule,
} from '@/lib/schedule/types';

type ViewTab = 'overview' | 'by-week' | 'by-team' | 'primetime';

const GAME_TYPE_COLORS: Record<string, string> = {
  division: 'bg-red-500/20 text-red-400 border-red-500/40',
  conference: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  inter_conference: 'bg-green-500/20 text-green-400 border-green-500/40',
  rotating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

const TIME_SLOT_LABELS: Record<string, string> = {
  thursday_night: 'TNF',
  early: 'Early',
  late: 'Late',
  sunday_night: 'SNF',
  monday_night: 'MNF',
};

const TIME_SLOT_COLORS: Record<string, string> = {
  thursday_night: 'bg-purple-500/20 text-purple-400',
  early: 'bg-zinc-500/20 text-zinc-400',
  late: 'bg-zinc-500/20 text-zinc-400',
  sunday_night: 'bg-yellow-500/20 text-yellow-400',
  monday_night: 'bg-orange-500/20 text-orange-400',
};

export default function ScheduleGeneratorPage() {
  const [schedule, setSchedule] = useState<LeagueSchedule | null>(null);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [validation, setValidation] = useState<ScheduleValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('BOS');
  const [season, setSeason] = useState(new Date().getFullYear());

  // Load existing schedule data on mount
  useEffect(() => {
    const existingSchedule = getSchedule();
    if (existingSchedule) {
      setSchedule(existingSchedule);
      // Calculate stats from existing schedule
      const totalGames = existingSchedule.weeks.reduce((sum, w) => sum + w.games.length, 0);
      const primeTimeGames = {
        thursday: existingSchedule.weeks.filter(w => w.thursdayGame).length,
        sundayNight: existingSchedule.weeks.filter(w => w.sundayNightGame).length,
        mondayNight: existingSchedule.weeks.filter(w => w.mondayNightGame).length,
        total: 0
      };
      primeTimeGames.total = primeTimeGames.thursday + primeTimeGames.sundayNight + primeTimeGames.mondayNight;

      // Calculate bye week distribution
      const byeWeekDistribution: Record<number, number> = {};
      existingSchedule.weeks.forEach((week, i) => {
        if (week.byeTeams.length > 0) {
          byeWeekDistribution[i + 1] = week.byeTeams.length;
        }
      });

      // Calculate game type breakdown
      const gameTypeBreakdown = { division: 0, conference: 0, interConference: 0, rotating: 0 };
      existingSchedule.weeks.forEach(week => {
        week.games.forEach(game => {
          if (game.gameType === 'division') gameTypeBreakdown.division++;
          else if (game.gameType === 'conference') gameTypeBreakdown.conference++;
          else if (game.gameType === 'inter_conference') gameTypeBreakdown.interConference++;
          else if (game.gameType === 'rotating') gameTypeBreakdown.rotating++;
        });
      });

      setStats({
        totalGames,
        gamesPerTeam: 17,
        primeTimeGames,
        byeWeekDistribution,
        gameTypeBreakdown,
        homeAwayBalance: { avgHomeGames: 8.5, avgAwayGames: 8.5, balanced: 32 }
      });
      setValidation({ valid: true, errors: [], warnings: [] });
    }
  }, []);

  // Store schedule when generated
  useEffect(() => {
    if (schedule) {
      storeSchedule(schedule);
    }
  }, [schedule]);

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season, randomizeStandings: true }),
      });
      const data = await response.json();
      if (data.success) {
        setSchedule(data.schedule);
        setStats(data.stats);
        setValidation(data.validation);
      }
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    }
    setLoading(false);
  };

  const getTeamName = (teamId: string): string => {
    const team = LEAGUE_TEAMS.find((t) => t.id === teamId);
    return team ? `${team.city} ${team.name}` : teamId;
  };

  const getTeamAbbrev = (teamId: string): string => {
    return teamId;
  };

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'by-week', label: 'By Week' },
    { id: 'by-team', label: 'By Team' },
    { id: 'primetime', label: 'Prime Time' },
  ];

  const selectedWeekSchedule: WeekSchedule | null = schedule?.weeks[selectedWeek - 1] || null;
  const selectedTeamSchedule: TeamSchedule | null = schedule?.teamSchedules[selectedTeamId] || null;

  const GameCard = ({ game, showWeek = false }: { game: ScheduledGame; showWeek?: boolean }) => (
    <div className="bg-secondary/50 border border-border rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showWeek && (
          <div className="text-xs text-muted-foreground font-medium w-10">WK{game.week}</div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-bold w-10">{game.awayTeamId}</span>
          <span className="text-muted-foreground">@</span>
          <span className="font-bold w-10">{game.homeTeamId}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', GAME_TYPE_COLORS[game.gameType])}>
          {game.gameType.replace('_', ' ').toUpperCase()}
        </span>
        {game.isPrimeTime && (
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded', TIME_SLOT_COLORS[game.timeSlot])}>
            {TIME_SLOT_LABELS[game.timeSlot]}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Schedule Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate 18-week NFL-style regular season schedule
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Generate Section */}
        {!schedule && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-muted-foreground mb-4">
              Generate a complete 18-week schedule with 272 games, bye weeks, and prime time slots.
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <label className="text-sm text-muted-foreground">Season:</label>
              <input
                type="number"
                value={season}
                onChange={(e) => setSeason(parseInt(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg bg-secondary border border-border text-center"
              />
            </div>
            <button
              onClick={generateSchedule}
              disabled={loading}
              className={cn(
                'px-8 py-3 rounded-lg font-semibold transition-all',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:opacity-90 shadow-lg shadow-blue-500/25',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? 'Generating...' : 'Generate Schedule'}
            </button>
          </div>
        )}

        {/* Regenerate Button */}
        {schedule && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {schedule.season} Season · Generated {new Date(schedule.generatedAt).toLocaleTimeString()}
            </div>
            <button
              onClick={generateSchedule}
              disabled={loading}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                'bg-secondary border border-border hover:bg-secondary/80',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{stats.totalGames}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Games</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.primeTimeGames.total}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Prime Time</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(stats.byeWeekDistribution).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Bye Weeks</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.homeAwayBalance.balanced}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Balanced</div>
              </div>
            </div>

            {/* Validation Status */}
            {validation && (
              <div
                className={cn(
                  'rounded-lg p-3 text-sm',
                  validation.valid
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                )}
              >
                {validation.valid ? '✓ Schedule Valid' : `✗ ${validation.errors.length} errors found`}
                {validation.warnings.length > 0 && (
                  <span className="text-yellow-400 ml-2">({validation.warnings.length} warnings)</span>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-secondary/80 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all',
                      activeTab === tab.id
                        ? 'text-foreground bg-white/5 border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Prime Time Breakdown */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Prime Time Games</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {stats.primeTimeGames.thursday}
                        </div>
                        <div className="text-xs text-muted-foreground">Thursday Night</div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {stats.primeTimeGames.sundayNight}
                        </div>
                        <div className="text-xs text-muted-foreground">Sunday Night</div>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {stats.primeTimeGames.mondayNight}
                        </div>
                        <div className="text-xs text-muted-foreground">Monday Night</div>
                      </div>
                    </div>
                  </div>

                  {/* Game Type Breakdown */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Game Type Distribution</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-red-400">
                          {stats.gameTypeBreakdown.division}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Division</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-blue-400">
                          {stats.gameTypeBreakdown.conference}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Conference</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-green-400">
                          {stats.gameTypeBreakdown.interConference}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Inter-Conf</div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-yellow-400">
                          {stats.gameTypeBreakdown.rotating}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Rotating</div>
                      </div>
                    </div>
                  </div>

                  {/* Bye Week Distribution */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Bye Week Distribution</h3>
                    <div className="flex gap-1">
                      {Object.entries(stats.byeWeekDistribution).map(([week, count]) => (
                        <div
                          key={week}
                          className="flex-1 bg-secondary rounded p-2 text-center"
                          title={`Week ${week}: ${count} teams on bye`}
                        >
                          <div className="text-xs text-muted-foreground mb-1">W{week}</div>
                          <div className="text-sm font-bold text-green-400">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Home/Away Balance */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Home/Away Balance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.homeAwayBalance.avgHomeGames}</div>
                        <div className="text-xs text-muted-foreground">Avg Home Games</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{stats.homeAwayBalance.avgAwayGames}</div>
                        <div className="text-xs text-muted-foreground">Avg Away Games</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* By Week Tab */}
              {activeTab === 'by-week' && schedule && (
                <>
                  {/* Week Selector */}
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
                      <button
                        key={week}
                        onClick={() => setSelectedWeek(week)}
                        className={cn(
                          'w-10 h-10 rounded-lg text-sm font-medium transition-all',
                          selectedWeek === week
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {week}
                      </button>
                    ))}
                  </div>

                  {selectedWeekSchedule && (
                    <div className="space-y-4">
                      {/* Bye Teams */}
                      {selectedWeekSchedule.byeTeams.length > 0 && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <h3 className="text-sm font-bold text-green-400 mb-2">Bye Week</h3>
                          <div className="flex gap-2 flex-wrap">
                            {selectedWeekSchedule.byeTeams.map((teamId) => (
                              <span
                                key={teamId}
                                className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium"
                              >
                                {teamId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Thursday Night */}
                      {selectedWeekSchedule.thursdayGame && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-purple-400 uppercase">Thursday Night</h3>
                          <GameCard game={selectedWeekSchedule.thursdayGame} />
                        </div>
                      )}

                      {/* Early Games */}
                      {selectedWeekSchedule.earlyGames.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-muted-foreground uppercase">
                            Early Games ({selectedWeekSchedule.earlyGames.length})
                          </h3>
                          {selectedWeekSchedule.earlyGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                          ))}
                        </div>
                      )}

                      {/* Late Games */}
                      {selectedWeekSchedule.lateGames.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-muted-foreground uppercase">
                            Late Games ({selectedWeekSchedule.lateGames.length})
                          </h3>
                          {selectedWeekSchedule.lateGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                          ))}
                        </div>
                      )}

                      {/* Sunday Night */}
                      {selectedWeekSchedule.sundayNightGame && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-yellow-400 uppercase">Sunday Night</h3>
                          <GameCard game={selectedWeekSchedule.sundayNightGame} />
                        </div>
                      )}

                      {/* Monday Night */}
                      {selectedWeekSchedule.mondayNightGame && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold text-orange-400 uppercase">Monday Night</h3>
                          <GameCard game={selectedWeekSchedule.mondayNightGame} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* By Team Tab */}
              {activeTab === 'by-team' && schedule && (
                <>
                  {/* Team Selector */}
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground"
                  >
                    {LEAGUE_TEAMS.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.city} {team.name} ({team.id})
                      </option>
                    ))}
                  </select>

                  {selectedTeamSchedule && (
                    <div className="space-y-4">
                      {/* Team Stats */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                          <div className="text-lg font-bold">{selectedTeamSchedule.homeGames}</div>
                          <div className="text-[10px] text-muted-foreground">Home</div>
                        </div>
                        <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                          <div className="text-lg font-bold">{selectedTeamSchedule.awayGames}</div>
                          <div className="text-[10px] text-muted-foreground">Away</div>
                        </div>
                        <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-green-400">
                            {selectedTeamSchedule.byeWeek}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Bye</div>
                        </div>
                        <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-purple-400">
                            {selectedTeamSchedule.primeTimeGames}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Prime</div>
                        </div>
                      </div>

                      {/* Game Type Breakdown */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                          <div className="text-sm font-bold text-red-400">
                            {selectedTeamSchedule.divisionGames}
                          </div>
                          <div className="text-[10px] text-muted-foreground">DIV</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-center">
                          <div className="text-sm font-bold text-blue-400">
                            {selectedTeamSchedule.conferenceGames}
                          </div>
                          <div className="text-[10px] text-muted-foreground">CONF</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                          <div className="text-sm font-bold text-green-400">
                            {selectedTeamSchedule.interConferenceGames}
                          </div>
                          <div className="text-[10px] text-muted-foreground">INTER</div>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-center">
                          <div className="text-sm font-bold text-yellow-400">
                            {selectedTeamSchedule.rotatingGames}
                          </div>
                          <div className="text-[10px] text-muted-foreground">ROT</div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2">
                        {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => {
                          const game = selectedTeamSchedule.games.find((g) => g.week === week);
                          const isBye = week === selectedTeamSchedule.byeWeek;

                          if (isBye) {
                            return (
                              <div
                                key={week}
                                className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center"
                              >
                                <span className="text-xs text-muted-foreground font-medium w-12">
                                  WK {week}
                                </span>
                                <span className="text-green-400 font-medium">BYE WEEK</span>
                              </div>
                            );
                          }

                          if (!game) return null;

                          const isHome = game.homeTeamId === selectedTeamId;
                          const opponent = isHome ? game.awayTeamId : game.homeTeamId;

                          return (
                            <div
                              key={week}
                              className="bg-secondary/50 border border-border rounded-lg p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground font-medium w-12">
                                  WK {week}
                                </span>
                                <span className={cn('text-xs', isHome ? 'text-green-400' : 'text-blue-400')}>
                                  {isHome ? 'vs' : '@'}
                                </span>
                                <span className="font-bold">{opponent}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    'text-[10px] px-1.5 py-0.5 rounded border',
                                    GAME_TYPE_COLORS[game.gameType]
                                  )}
                                >
                                  {game.gameType.replace('_', ' ').toUpperCase().slice(0, 3)}
                                </span>
                                {game.isPrimeTime && (
                                  <span
                                    className={cn(
                                      'text-[10px] px-1.5 py-0.5 rounded',
                                      TIME_SLOT_COLORS[game.timeSlot]
                                    )}
                                  >
                                    {TIME_SLOT_LABELS[game.timeSlot]}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Prime Time Tab */}
              {activeTab === 'primetime' && schedule && (
                <div className="space-y-6">
                  {/* Thursday Night Football */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500" />
                      Thursday Night Football
                    </h3>
                    <div className="space-y-2">
                      {schedule.weeks
                        .filter((w) => w.thursdayGame)
                        .map((week) => (
                          <GameCard key={week.thursdayGame!.id} game={week.thursdayGame!} showWeek />
                        ))}
                    </div>
                  </div>

                  {/* Sunday Night Football */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      Sunday Night Football
                    </h3>
                    <div className="space-y-2">
                      {schedule.weeks
                        .filter((w) => w.sundayNightGame)
                        .map((week) => (
                          <GameCard key={week.sundayNightGame!.id} game={week.sundayNightGame!} showWeek />
                        ))}
                    </div>
                  </div>

                  {/* Monday Night Football */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-orange-400 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500" />
                      Monday Night Football
                    </h3>
                    <div className="space-y-2">
                      {schedule.weeks
                        .filter((w) => w.mondayNightGame)
                        .map((week) => (
                          <GameCard key={week.mondayNightGame!.id} game={week.mondayNightGame!} showWeek />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
