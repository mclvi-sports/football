'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { storeCoaching, getCoaching, getCachedStats } from '@/lib/coaching/coaching-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import {
  LeagueCoaching,
  CoachingStaff,
  CoachingStats,
  Coach,
  CoachPosition,
} from '@/lib/coaching/types';
import {
  OFFENSIVE_SCHEMES,
  DEFENSIVE_SCHEMES,
  ST_PHILOSOPHIES,
} from '@/lib/schemes/scheme-data';
import { Tier } from '@/lib/types';

type ViewTab = 'overview' | 'by-team' | 'rankings' | 'schemes';

const POSITION_LABELS: Record<CoachPosition, string> = {
  HC: 'Head Coach',
  OC: 'Offensive Coordinator',
  DC: 'Defensive Coordinator',
  STC: 'Special Teams Coordinator',
};

const POSITION_ICONS: Record<CoachPosition, string> = {
  HC: '👔',
  OC: '🏈',
  DC: '🛡️',
  STC: '⚡',
};

const RATING_COLOR = (rating: number): string => {
  if (rating >= 90) return 'text-yellow-400';
  if (rating >= 85) return 'text-green-400';
  if (rating >= 80) return 'text-blue-400';
  if (rating >= 75) return 'text-zinc-300';
  if (rating >= 70) return 'text-orange-400';
  return 'text-red-400';
};

const RATING_BG = (rating: number): string => {
  if (rating >= 90) return 'bg-yellow-500/20 border-yellow-500/40';
  if (rating >= 85) return 'bg-green-500/20 border-green-500/40';
  if (rating >= 80) return 'bg-blue-500/20 border-blue-500/40';
  if (rating >= 75) return 'bg-zinc-500/20 border-zinc-500/40';
  if (rating >= 70) return 'bg-orange-500/20 border-orange-500/40';
  return 'bg-red-500/20 border-red-500/40';
};

const PHILOSOPHY_COLORS: Record<string, string> = {
  aggressive: 'bg-red-500/20 text-red-400 border-red-500/40',
  balanced: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  conservative: 'bg-green-500/20 text-green-400 border-green-500/40',
  innovative: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
};

function getSchemeDisplayName(schemeId: string): string {
  // Check offensive schemes
  if (schemeId in OFFENSIVE_SCHEMES) {
    return OFFENSIVE_SCHEMES[schemeId as keyof typeof OFFENSIVE_SCHEMES].name;
  }
  // Check defensive schemes
  if (schemeId in DEFENSIVE_SCHEMES) {
    return DEFENSIVE_SCHEMES[schemeId as keyof typeof DEFENSIVE_SCHEMES].name;
  }
  // Check ST philosophies
  if (schemeId in ST_PHILOSOPHIES) {
    return ST_PHILOSOPHIES[schemeId as keyof typeof ST_PHILOSOPHIES].name;
  }
  // Fallback: format the string
  return schemeId.replace(/_/g, ' ').replace(/-/g, ' ');
}

export default function CoachingGeneratorPage() {
  const [coaching, setCoaching] = useState<LeagueCoaching | null>(null);
  const [stats, setStats] = useState<CoachingStats | null>(null);
  const [tierAssignments, setTierAssignments] = useState<Record<string, Tier> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('BOS');

  // Load existing coaching data on mount
  useEffect(() => {
    const existingCoaching = getCoaching();
    const existingStats = getCachedStats();
    if (existingCoaching) {
      setCoaching(existingCoaching);
      if (existingStats) {
        setStats(existingStats);
      }
    }
  }, []);

  // Store coaching when generated
  useEffect(() => {
    if (coaching) {
      storeCoaching(coaching);
    }
  }, [coaching]);

  const generateCoaching = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev/generate-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.success) {
        setCoaching(data.coaching);
        setStats(data.stats);
        setTierAssignments(data.tierAssignments);
      }
    } catch (error) {
      console.error('Failed to generate coaching:', error);
    }
    setLoading(false);
  };

  const getTeamName = (teamId: string): string => {
    const team = LEAGUE_TEAMS.find((t) => t.id === teamId);
    return team ? `${team.city} ${team.name}` : teamId;
  };

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'by-team', label: 'By Team' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'schemes', label: 'Schemes' },
  ];

  const selectedStaff: CoachingStaff | null = coaching?.teams[selectedTeamId] || null;

  const sortedTeams = coaching
    ? Object.values(coaching.teams).sort((a, b) => b.avgOvr - a.avgOvr)
    : [];

  const CoachCard = ({ coach, compact = false }: { coach: Coach; compact?: boolean }) => {
    // Get scheme display based on position
    const getCoachSchemes = () => {
      const schemes: { label: string; value: string; color: string }[] = [];

      if (coach.offensiveScheme) {
        schemes.push({
          label: 'OFF',
          value: getSchemeDisplayName(coach.offensiveScheme),
          color: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
        });
      }
      if (coach.defensiveScheme) {
        schemes.push({
          label: 'DEF',
          value: getSchemeDisplayName(coach.defensiveScheme),
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        });
      }
      if (coach.stPhilosophy) {
        schemes.push({
          label: 'ST',
          value: getSchemeDisplayName(coach.stPhilosophy),
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
        });
      }

      return schemes;
    };

    const schemes = getCoachSchemes();

    return (
      <div className={cn('bg-secondary/50 border border-border rounded-xl p-4', compact && 'p-3')}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{POSITION_ICONS[coach.position]}</span>
            <div>
              <div className={cn('font-bold', compact && 'text-sm')}>
                {coach.firstName} {coach.lastName}
              </div>
              <div className="text-xs text-muted-foreground">
                {POSITION_LABELS[coach.position]}
              </div>
            </div>
          </div>
          <div className={cn('text-2xl font-bold', RATING_COLOR(coach.ovr), compact && 'text-xl')}>
            {coach.ovr}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
          <div className="bg-secondary rounded p-1.5 text-center">
            <div className="text-muted-foreground">Age</div>
            <div className="font-medium">{coach.age}</div>
          </div>
          <div className="bg-secondary rounded p-1.5 text-center">
            <div className="text-muted-foreground">Exp</div>
            <div className="font-medium">{coach.experience} yrs</div>
          </div>
          <div className="bg-secondary rounded p-1.5 text-center">
            <div className="text-muted-foreground">Salary</div>
            <div className="font-medium">${coach.contract.salary}M</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          <span
            className={cn(
              'text-[10px] px-1.5 py-0.5 rounded border capitalize',
              PHILOSOPHY_COLORS[coach.philosophy] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40'
            )}
          >
            {coach.philosophy}
          </span>
          {schemes.map((scheme) => (
            <span
              key={scheme.label}
              className={cn('text-[10px] px-1.5 py-0.5 rounded border', scheme.color)}
              title={`${scheme.label}: ${scheme.value}`}
            >
              {scheme.value}
            </span>
          ))}
        </div>

        {coach.perks.length > 0 && (
          <div className="border-t border-border pt-2 mt-2">
            <div className="text-[10px] text-muted-foreground uppercase mb-1">Perks</div>
            <div className="flex flex-wrap gap-1">
              {coach.perks.map((perk) => (
                <span
                  key={perk.id}
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded',
                    perk.tier === 3
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : perk.tier === 2
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-zinc-500/20 text-zinc-400'
                  )}
                  title={perk.effect}
                >
                  {perk.name} T{perk.tier}
                </span>
              ))}
            </div>
          </div>
        )}

        {!compact && (
          <div className="border-t border-border pt-2 mt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract</span>
              <span>
                {coach.contract.yearsRemaining}/{coach.contract.yearsTotal} yrs
              </span>
            </div>
            {coach.retirementRisk > 0 && (
              <div className="flex justify-between text-orange-400">
                <span>Retirement Risk</span>
                <span>{coach.retirementRisk}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Coaching Staff Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate coaching staff with HC, OC, DC, and STC coordinators
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Generate Section */}
        {!coaching && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">👔</div>
            <p className="text-muted-foreground mb-4">
              Generate coaching staff for all 32 teams with attributes, schemes, and perks.
            </p>
            <button
              onClick={generateCoaching}
              disabled={loading}
              className={cn(
                'px-8 py-3 rounded-lg font-semibold transition-all',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:opacity-90 shadow-lg shadow-blue-500/25',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? 'Generating...' : 'Generate Coaching Staff'}
            </button>
          </div>
        )}

        {/* Regenerate Button */}
        {coaching && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Generated {new Date(coaching.generatedAt).toLocaleTimeString()}
            </div>
            <button
              onClick={generateCoaching}
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
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className={cn('text-xl font-bold', RATING_COLOR(stats.avgOverallRating))}>
                  {stats.avgOverallRating}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Avg OVR</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-yellow-400">{stats.eliteCoaches}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Elite</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-400">{stats.greatCoaches}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Great</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-400">{stats.goodCoaches}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Good</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-400">${stats.totalSalaries}M</div>
                <div className="text-[10px] text-muted-foreground uppercase">Total $</div>
              </div>
            </div>

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
                  {/* Position Averages */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Average Ratings by Position</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgHCRating))}>
                        <div className="text-2xl mb-1">👔</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgHCRating))}>
                          {stats.avgHCRating}
                        </div>
                        <div className="text-xs text-muted-foreground">Head Coach</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgOCRating))}>
                        <div className="text-2xl mb-1">🏈</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgOCRating))}>
                          {stats.avgOCRating}
                        </div>
                        <div className="text-xs text-muted-foreground">OC</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgDCRating))}>
                        <div className="text-2xl mb-1">🛡️</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgDCRating))}>
                          {stats.avgDCRating}
                        </div>
                        <div className="text-xs text-muted-foreground">DC</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgSTCRating))}>
                        <div className="text-2xl mb-1">⚡</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgSTCRating))}>
                          {stats.avgSTCRating}
                        </div>
                        <div className="text-xs text-muted-foreground">STC</div>
                      </div>
                    </div>
                  </div>

                  {/* Top & Bottom HCs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-green-400 mb-3">Top 5 Head Coaches</h3>
                      <div className="space-y-2">
                        {stats.topHCs.map((hc, i) => (
                          <div key={hc.teamId} className="flex justify-between items-center">
                            <span className="text-sm">
                              {i + 1}. {hc.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{hc.teamId}</span>
                              <span className="font-bold text-green-400">{hc.ovr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-red-400 mb-3">Bottom 5 Head Coaches</h3>
                      <div className="space-y-2">
                        {stats.bottomHCs.map((hc, i) => (
                          <div key={hc.teamId} className="flex justify-between items-center">
                            <span className="text-sm">
                              {32 - 4 + i}. {hc.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{hc.teamId}</span>
                              <span className="font-bold text-red-400">{hc.ovr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Salary Info */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-2">League Coaching Salaries</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">${stats.totalSalaries}M</div>
                        <div className="text-xs text-muted-foreground">Total League Salaries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">${stats.avgTeamSalary}M</div>
                        <div className="text-xs text-muted-foreground">Avg Per Team</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* By Team Tab */}
              {activeTab === 'by-team' && coaching && (
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

                  {selectedStaff && (
                    <div className="space-y-4">
                      {/* Staff Overview */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{getTeamName(selectedTeamId)}</h3>
                            <div className="text-sm text-muted-foreground">Coaching Staff</div>
                          </div>
                          <div className="text-right">
                            <div className={cn('text-3xl font-bold', RATING_COLOR(selectedStaff.avgOvr))}>
                              {selectedStaff.avgOvr}
                            </div>
                            <div className="text-xs text-muted-foreground">Avg OVR</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Total Salary</div>
                            <div className="font-bold">${selectedStaff.totalSalary}M</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Chemistry</div>
                            <div
                              className={cn(
                                'font-bold',
                                selectedStaff.staffChemistry >= 80
                                  ? 'text-green-400'
                                  : selectedStaff.staffChemistry >= 60
                                    ? 'text-yellow-400'
                                    : 'text-red-400'
                              )}
                            >
                              {selectedStaff.staffChemistry}%
                            </div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Coaches</div>
                            <div className="font-bold">4</div>
                          </div>
                        </div>
                      </div>

                      {/* Coach Cards */}
                      <CoachCard coach={selectedStaff.headCoach} />
                      <div className="grid grid-cols-1 gap-3">
                        <CoachCard coach={selectedStaff.offensiveCoordinator} />
                        <CoachCard coach={selectedStaff.defensiveCoordinator} />
                        <CoachCard coach={selectedStaff.specialTeamsCoordinator} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Rankings Tab */}
              {activeTab === 'rankings' && coaching && (
                <div className="space-y-2">
                  {sortedTeams.map((staff, index) => (
                    <div
                      key={staff.teamId}
                      className={cn(
                        'bg-secondary/50 border rounded-lg p-3 flex items-center justify-between',
                        index < 5
                          ? 'border-green-500/30'
                          : index >= 27
                            ? 'border-red-500/30'
                            : 'border-border'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            index < 5
                              ? 'bg-green-500/20 text-green-400'
                              : index >= 27
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-secondary text-muted-foreground'
                          )}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold">{staff.teamId}</div>
                          <div className="text-xs text-muted-foreground">
                            HC: {staff.headCoach.firstName} {staff.headCoach.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground text-right">
                          <div>
                            👔 {staff.headCoach.ovr} · 🏈 {staff.offensiveCoordinator.ovr}
                          </div>
                          <div>
                            🛡️ {staff.defensiveCoordinator.ovr} · ⚡ {staff.specialTeamsCoordinator.ovr}
                          </div>
                        </div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(staff.avgOvr))}>
                          {staff.avgOvr}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Schemes Tab */}
              {activeTab === 'schemes' && stats && (
                <div className="space-y-6">
                  {/* Offensive Schemes */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-orange-400 mb-3">Offensive Schemes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stats.schemeDistribution.offensive)
                        .sort((a, b) => b[1] - a[1])
                        .map(([scheme, count]) => (
                          <div
                            key={scheme}
                            className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 flex items-center justify-between"
                          >
                            <span className="text-sm">{getSchemeDisplayName(scheme)}</span>
                            <span className="font-bold text-orange-400">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Defensive Schemes */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-blue-400 mb-3">Defensive Schemes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stats.schemeDistribution.defensive)
                        .sort((a, b) => b[1] - a[1])
                        .map(([scheme, count]) => (
                          <div
                            key={scheme}
                            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-center justify-between"
                          >
                            <span className="text-sm">{getSchemeDisplayName(scheme)}</span>
                            <span className="font-bold text-blue-400">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Special Teams Philosophy */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold text-purple-400 mb-3">Special Teams Philosophy</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(stats.schemeDistribution.specialTeams)
                        .sort((a, b) => b[1] - a[1])
                        .map(([scheme, count]) => (
                          <div
                            key={scheme}
                            className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center"
                          >
                            <div className="text-2xl font-bold text-purple-400">{count}</div>
                            <div className="text-xs text-muted-foreground">{getSchemeDisplayName(scheme)}</div>
                          </div>
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
