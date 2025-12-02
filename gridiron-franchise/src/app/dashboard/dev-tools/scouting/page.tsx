'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { storeScouting } from '@/lib/scouting/scouting-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import {
  LeagueScouting,
  ScoutingDepartment,
  ScoutingStats,
  Scout,
  ScoutRole,
  PositionExpertise,
  RegionalExpertise,
  SCOUT_ROLES,
  POSITION_EXPERTISE,
  REGIONAL_EXPERTISE,
} from '@/lib/scouting/types';
import { Tier } from '@/lib/types';

type ViewTab = 'overview' | 'by-team' | 'rankings' | 'expertise';

const ROLE_ICONS: Record<ScoutRole, string> = {
  director: '👔',
  area: '🗺️',
  pro: '🏈',
  national: '🌎',
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

const EXPERTISE_COLORS: Record<PositionExpertise, string> = {
  offensive: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  defensive: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  special_teams: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  generalist: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
};

const REGION_COLORS: Record<RegionalExpertise, string> = {
  east_coast: 'bg-green-500/20 text-green-400 border-green-500/40',
  west_coast: 'bg-red-500/20 text-red-400 border-red-500/40',
  midwest: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  south: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  national: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
};

export default function ScoutingGeneratorPage() {
  const [scouting, setScouting] = useState<LeagueScouting | null>(null);
  const [stats, setStats] = useState<ScoutingStats | null>(null);
  const [tierAssignments, setTierAssignments] = useState<Record<string, Tier> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('BOS');

  useEffect(() => {
    if (scouting) {
      storeScouting(scouting);
    }
  }, [scouting]);

  const generateScouting = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev/generate-scouting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.success) {
        setScouting(data.scouting);
        setStats(data.stats);
        setTierAssignments(data.tierAssignments);
      }
    } catch (error) {
      console.error('Failed to generate scouting:', error);
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
    { id: 'expertise', label: 'Expertise' },
  ];

  const selectedDept: ScoutingDepartment | null = scouting?.teams[selectedTeamId] || null;

  const sortedTeams = scouting
    ? Object.values(scouting.teams).sort((a, b) => b.avgOvr - a.avgOvr)
    : [];

  const ScoutCard = ({ scout, compact = false }: { scout: Scout; compact?: boolean }) => (
    <div className={cn('bg-secondary/50 border border-border rounded-xl p-4', compact && 'p-3')}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ROLE_ICONS[scout.role]}</span>
          <div>
            <div className={cn('font-bold', compact && 'text-sm')}>
              {scout.firstName} {scout.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {SCOUT_ROLES[scout.role].name}
            </div>
          </div>
        </div>
        <div className={cn('text-2xl font-bold', RATING_COLOR(scout.ovr), compact && 'text-xl')}>
          {scout.ovr}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">Age</div>
          <div className="font-medium">{scout.age}</div>
        </div>
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">Exp</div>
          <div className="font-medium">{scout.experience} yrs</div>
        </div>
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">Salary</div>
          <div className="font-medium">${(scout.contract.salary * 1000).toFixed(0)}K</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', EXPERTISE_COLORS[scout.positionExpertise])}>
          {POSITION_EXPERTISE[scout.positionExpertise].name}
        </span>
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded border', REGION_COLORS[scout.regionalExpertise])}>
          {REGIONAL_EXPERTISE[scout.regionalExpertise].name}
        </span>
      </div>

      {!compact && (
        <>
          {/* Key Attributes */}
          <div className="grid grid-cols-2 gap-1 text-xs mb-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Talent Eval</span>
              <span className={RATING_COLOR(scout.attributes.talentEvaluation)}>
                {scout.attributes.talentEvaluation}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Potential</span>
              <span className={RATING_COLOR(scout.attributes.potentialAssessment)}>
                {scout.attributes.potentialAssessment}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bust Detection</span>
              <span className={RATING_COLOR(scout.attributes.bustDetection)}>
                {scout.attributes.bustDetection}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sleeper Find</span>
              <span className={RATING_COLOR(scout.attributes.sleeperDiscovery)}>
                {scout.attributes.sleeperDiscovery}
              </span>
            </div>
          </div>

          {/* Weekly Points */}
          <div className="bg-secondary rounded p-2 text-center mb-2">
            <span className="text-muted-foreground text-xs">Weekly Points: </span>
            <span className="font-bold text-green-400">{scout.weeklyPoints}</span>
          </div>

          {scout.perks.length > 0 && (
            <div className="border-t border-border pt-2">
              <div className="text-[10px] text-muted-foreground uppercase mb-1">Perks</div>
              <div className="flex flex-wrap gap-1">
                {scout.perks.map((perk) => (
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
        </>
      )}
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
        <h1 className="text-2xl font-bold mt-2">Scouting Department Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate scouting staff with Director, Area, Pro, and National scouts
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Generate Section */}
        {!scouting && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted-foreground mb-4">
              Generate scouting departments for all 32 teams with attributes, expertise, and perks.
            </p>
            <button
              onClick={generateScouting}
              disabled={loading}
              className={cn(
                'px-8 py-3 rounded-lg font-semibold transition-all',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:opacity-90 shadow-lg shadow-blue-500/25',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? 'Generating...' : 'Generate Scouting Departments'}
            </button>
          </div>
        )}

        {/* Regenerate Button */}
        {scouting && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Generated {new Date(scouting.generatedAt).toLocaleTimeString()}
            </div>
            <button
              onClick={generateScouting}
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
                <div className={cn('text-xl font-bold', RATING_COLOR(stats.avgScoutRating))}>
                  {stats.avgScoutRating}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Avg OVR</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-400">{stats.totalScouts}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Scouts</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-yellow-400">{stats.eliteScouts}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Elite</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-400">{stats.avgWeeklyPoints}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Avg Pts</div>
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
                  {/* Rating Distribution */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Scout Rating Distribution</h3>
                    <div className="grid grid-cols-6 gap-2">
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(95))}>
                        <div className="text-2xl font-bold text-yellow-400">{stats.eliteScouts}</div>
                        <div className="text-xs text-muted-foreground">Elite 90+</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(87))}>
                        <div className="text-2xl font-bold text-green-400">{stats.greatScouts}</div>
                        <div className="text-xs text-muted-foreground">Great 85+</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(82))}>
                        <div className="text-2xl font-bold text-blue-400">{stats.goodScouts}</div>
                        <div className="text-xs text-muted-foreground">Good 80+</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(77))}>
                        <div className="text-2xl font-bold text-zinc-300">{stats.averageScouts}</div>
                        <div className="text-xs text-muted-foreground">Avg 75+</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(72))}>
                        <div className="text-2xl font-bold text-orange-400">{stats.belowAverageScouts}</div>
                        <div className="text-xs text-muted-foreground">Below 70+</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(65))}>
                        <div className="text-2xl font-bold text-red-400">{stats.poorScouts}</div>
                        <div className="text-xs text-muted-foreground">Poor 60+</div>
                      </div>
                    </div>
                  </div>

                  {/* Top & Bottom Departments */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-green-400 mb-3">Top 5 Departments</h3>
                      <div className="space-y-2">
                        {stats.topDepartments.map((d, i) => (
                          <div key={d.teamId} className="flex justify-between items-center">
                            <span className="text-sm">
                              {i + 1}. {d.teamId}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{d.weeklyPoints} pts</span>
                              <span className="font-bold text-green-400">{d.avgOvr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-red-400 mb-3">Bottom 5 Departments</h3>
                      <div className="space-y-2">
                        {stats.bottomDepartments.map((d, i) => (
                          <div key={d.teamId} className="flex justify-between items-center">
                            <span className="text-sm">
                              {32 - 4 + i}. {d.teamId}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{d.weeklyPoints} pts</span>
                              <span className="font-bold text-red-400">{d.avgOvr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-2">League Scouting Budgets</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">${stats.totalSalaries}M</div>
                        <div className="text-xs text-muted-foreground">Total League Salaries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">${stats.avgDepartmentBudget}M</div>
                        <div className="text-xs text-muted-foreground">Avg Per Team</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* By Team Tab */}
              {activeTab === 'by-team' && scouting && (
                <>
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

                  {selectedDept && (
                    <div className="space-y-4">
                      {/* Department Overview */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{getTeamName(selectedTeamId)}</h3>
                            <div className="text-sm text-muted-foreground">Scouting Department</div>
                          </div>
                          <div className="text-right">
                            <div className={cn('text-3xl font-bold', RATING_COLOR(selectedDept.avgOvr))}>
                              {selectedDept.avgOvr}
                            </div>
                            <div className="text-xs text-muted-foreground">Avg OVR</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Budget</div>
                            <div className="font-bold">${(selectedDept.totalBudget * 1000).toFixed(0)}K</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Weekly Points</div>
                            <div className="font-bold text-green-400">{selectedDept.weeklyPoints}</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Scouts</div>
                            <div className="font-bold">{selectedDept.scoutCount}</div>
                          </div>
                        </div>
                      </div>

                      {/* Scout Cards */}
                      <ScoutCard scout={selectedDept.director} />
                      {selectedDept.areaScouts.map((scout) => (
                        <ScoutCard key={scout.id} scout={scout} />
                      ))}
                      {selectedDept.proScout && <ScoutCard scout={selectedDept.proScout} />}
                      {selectedDept.nationalScout && <ScoutCard scout={selectedDept.nationalScout} />}
                    </div>
                  )}
                </>
              )}

              {/* Rankings Tab */}
              {activeTab === 'rankings' && scouting && (
                <div className="space-y-2">
                  {sortedTeams.map((dept, index) => (
                    <div
                      key={dept.teamId}
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
                          <div className="font-bold">{dept.teamId}</div>
                          <div className="text-xs text-muted-foreground">
                            Dir: {dept.director.firstName} {dept.director.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground text-right">
                          <div>{dept.scoutCount} scouts</div>
                          <div className="text-green-400">{dept.weeklyPoints} pts/wk</div>
                        </div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(dept.avgOvr))}>
                          {dept.avgOvr}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expertise Tab */}
              {activeTab === 'expertise' && stats && (
                <div className="space-y-6">
                  {/* Position Expertise */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Position Expertise Distribution</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stats.positionExpertiseDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([expertise, count]) => (
                          <div
                            key={expertise}
                            className={cn(
                              'rounded-lg p-3 flex items-center justify-between border',
                              EXPERTISE_COLORS[expertise as PositionExpertise]
                            )}
                          >
                            <span className="text-sm">
                              {POSITION_EXPERTISE[expertise as PositionExpertise].name}
                            </span>
                            <span className="font-bold">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Regional Expertise */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Regional Expertise Distribution</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stats.regionalExpertiseDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .map(([region, count]) => (
                          <div
                            key={region}
                            className={cn(
                              'rounded-lg p-3 flex items-center justify-between border',
                              REGION_COLORS[region as RegionalExpertise]
                            )}
                          >
                            <span className="text-sm">
                              {REGIONAL_EXPERTISE[region as RegionalExpertise].name}
                            </span>
                            <span className="font-bold">{count}</span>
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
