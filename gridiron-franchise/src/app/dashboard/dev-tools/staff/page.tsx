'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Store getters
import { getGMs, LeagueGMs, GM } from '@/lib/gm';
import { getCoaching } from '@/lib/coaching/coaching-store';
import { LeagueCoaching, CoachingStaff, Coach, CoachPosition, Perk } from '@/lib/coaching/types';
import { getScouting } from '@/lib/scouting/scouting-store';
import { LeagueScouting, ScoutingDepartment, Scout, ScoutRole, SCOUT_ROLES, POSITION_EXPERTISE, REGIONAL_EXPERTISE } from '@/lib/scouting/types';
import { getFullGameData } from '@/lib/dev-player-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import {
  OFFENSIVE_SCHEMES,
  DEFENSIVE_SCHEMES,
  ST_PHILOSOPHIES,
} from '@/lib/schemes/scheme-data';
import {
  GM_BACKGROUNDS,
  GM_ARCHETYPES,
  getSynergy,
} from '@/lib/gm/gm-data';

type ViewTab = 'overview' | 'gm' | 'coaching' | 'scouting';

// ============================================================================
// RATING HELPERS
// ============================================================================

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

// ============================================================================
// COACHING HELPERS
// ============================================================================

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

const PHILOSOPHY_COLORS: Record<string, string> = {
  aggressive: 'bg-red-500/20 text-red-400 border-red-500/40',
  balanced: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  conservative: 'bg-green-500/20 text-green-400 border-green-500/40',
  innovative: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
};

function getSchemeDisplayName(schemeId: string): string {
  if (schemeId in OFFENSIVE_SCHEMES) {
    return OFFENSIVE_SCHEMES[schemeId as keyof typeof OFFENSIVE_SCHEMES].name;
  }
  if (schemeId in DEFENSIVE_SCHEMES) {
    return DEFENSIVE_SCHEMES[schemeId as keyof typeof DEFENSIVE_SCHEMES].name;
  }
  if (schemeId in ST_PHILOSOPHIES) {
    return ST_PHILOSOPHIES[schemeId as keyof typeof ST_PHILOSOPHIES].name;
  }
  return schemeId.replace(/_/g, ' ').replace(/-/g, ' ');
}

// ============================================================================
// SCOUTING HELPERS
// ============================================================================

const ROLE_ICONS: Record<ScoutRole, string> = {
  director: '👔',
  area: '🗺️',
  pro: '🏈',
  national: '🌎',
};

// ============================================================================
// GM CARD
// ============================================================================

function GMCard({ gm }: { gm: GM }) {
  const background = GM_BACKGROUNDS[gm.background];
  const archetype = GM_ARCHETYPES[gm.archetype];
  const synergy = gm.hasSynergy ? getSynergy(gm.background, gm.archetype) : null;

  const bonusEntries = Object.entries(gm.bonuses).filter(([, value]) => value !== 0);

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-2xl">
            🎩
          </div>
          <div>
            <div className="font-bold text-lg">
              {gm.firstName} {gm.lastName}
            </div>
            <div className="text-sm text-muted-foreground">General Manager</div>
          </div>
        </div>
        {gm.isPlayer && (
          <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/40">
            YOU
          </span>
        )}
      </div>

      {/* Background & Archetype */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary rounded-lg p-3">
          <div className="text-xs text-muted-foreground uppercase mb-1">Background</div>
          <div className="font-bold">{background?.name || gm.background}</div>
          <div className="text-xs text-zinc-400">{background?.description}</div>
        </div>
        <div className="bg-secondary rounded-lg p-3">
          <div className="text-xs text-muted-foreground uppercase mb-1">Archetype</div>
          <div className="font-bold">{archetype?.name || gm.archetype}</div>
          <div className="text-xs text-zinc-400">{archetype?.philosophy}</div>
        </div>
      </div>

      {/* Synergy */}
      {synergy && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400">✨</span>
            <span className="font-bold text-yellow-400">{synergy.name}</span>
          </div>
          <div className="text-xs text-zinc-300">{synergy.description}</div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
        <div className="bg-secondary rounded p-2 text-center">
          <div className="text-muted-foreground">Age</div>
          <div className="font-bold">{gm.age}</div>
        </div>
        <div className="bg-secondary rounded p-2 text-center">
          <div className="text-muted-foreground">Experience</div>
          <div className="font-bold">{gm.experience} yrs</div>
        </div>
        <div className="bg-secondary rounded p-2 text-center">
          <div className="text-muted-foreground">Contract</div>
          <div className="font-bold">{gm.contract.years} yrs</div>
        </div>
      </div>

      {/* Bonuses */}
      <div className="border-t border-border pt-3">
        <div className="text-xs text-muted-foreground uppercase mb-2">Active Bonuses</div>
        <div className="flex flex-wrap gap-1">
          {bonusEntries.map(([key, value]) => {
            const isPositive = (value as number) > 0;
            const displayValue = key === 'capSpace'
              ? `${isPositive ? '+' : ''}$${value}M`
              : key === 'sleepersPerDraft'
              ? `+${value} sleeper${(value as number) > 1 ? 's' : ''}`
              : `${isPositive ? '+' : ''}${value}%`;

            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())
              .trim();

            return (
              <span
                key={key}
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded border',
                  isPositive || key === 'contractDemands'
                    ? 'bg-green-500/20 text-green-400 border-green-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                )}
              >
                {displayValue} {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COACH CARD
// ============================================================================

function CoachCard({ coach, compact = false }: { coach: Coach; compact?: boolean }) {
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
            {coach.perks.map((perk: Perk) => (
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
            <span>{coach.contract.yearsRemaining}/{coach.contract.yearsTotal} yrs</span>
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
}

// ============================================================================
// SCOUT CARD
// ============================================================================

function ScoutCard({ scout, compact = false }: { scout: Scout; compact?: boolean }) {
  const roleInfo = SCOUT_ROLES[scout.role];
  const posExpertise = POSITION_EXPERTISE[scout.positionExpertise];
  const regExpertise = REGIONAL_EXPERTISE[scout.regionalExpertise];

  return (
    <div className={cn('bg-secondary/50 border border-border rounded-xl p-4', compact && 'p-3')}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ROLE_ICONS[scout.role]}</span>
          <div>
            <div className={cn('font-bold', compact && 'text-sm')}>
              {scout.firstName} {scout.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{roleInfo.name}</div>
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
          <div className="text-muted-foreground">Pts/Wk</div>
          <div className="font-medium">{scout.weeklyPoints}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-400 border-blue-500/40">
          {posExpertise.name}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded border bg-purple-500/20 text-purple-400 border-purple-500/40">
          {regExpertise.name}
        </span>
      </div>

      {/* Key Attributes */}
      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
        <div className="flex justify-between bg-secondary/50 rounded px-2 py-1">
          <span className="text-muted-foreground">Talent Eval</span>
          <span className={RATING_COLOR(scout.attributes.talentEvaluation)}>
            {scout.attributes.talentEvaluation}
          </span>
        </div>
        <div className="flex justify-between bg-secondary/50 rounded px-2 py-1">
          <span className="text-muted-foreground">Sleeper</span>
          <span className={RATING_COLOR(scout.attributes.sleeperDiscovery)}>
            {scout.attributes.sleeperDiscovery}
          </span>
        </div>
      </div>

      {scout.perks.length > 0 && (
        <div className="border-t border-border pt-2 mt-2">
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

      {!compact && (
        <div className="border-t border-border pt-2 mt-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Salary</span>
            <span>${(scout.contract.salary * 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contract</span>
            <span>{scout.contract.yearsRemaining}/{scout.contract.yearsTotal} yrs</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StaffViewPage() {
  const [gms, setGMs] = useState<LeagueGMs | null>(null);
  const [coaching, setCoaching] = useState<LeagueCoaching | null>(null);
  const [scouting, setScouting] = useState<LeagueScouting | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [hasData, setHasData] = useState(false);

  // Load data on mount
  useEffect(() => {
    const gmData = getGMs();
    const coachingData = getCoaching();
    const scoutingData = getScouting();
    const fullGame = getFullGameData();

    setGMs(gmData);
    setCoaching(coachingData);
    setScouting(scoutingData);

    // Set initial team to player's team if GM exists, otherwise first team
    if (gmData) {
      setSelectedTeamId(gmData.playerTeamId);
    } else if (fullGame?.teams.length) {
      setSelectedTeamId(fullGame.teams[0].team.id);
    } else {
      setSelectedTeamId('BOS');
    }

    setHasData(!!(gmData || coachingData || scoutingData));
  }, []);

  const getTeamName = (teamId: string): string => {
    const team = LEAGUE_TEAMS.find((t) => t.id === teamId);
    return team ? `${team.city} ${team.name}` : teamId;
  };

  // Get current team's staff
  const currentGM: GM | null = useMemo(() => {
    if (!gms || !selectedTeamId) return null;
    if (gms.playerTeamId === selectedTeamId) return gms.playerGM;
    return gms.cpuGMs[selectedTeamId] || null;
  }, [gms, selectedTeamId]);

  const currentCoaching: CoachingStaff | null = useMemo(() => {
    return coaching?.teams[selectedTeamId] || null;
  }, [coaching, selectedTeamId]);

  const currentScouting: ScoutingDepartment | null = useMemo(() => {
    return scouting?.teams[selectedTeamId] || null;
  }, [scouting, selectedTeamId]);

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'gm', label: 'GM' },
    { id: 'coaching', label: 'Coaching' },
    { id: 'scouting', label: 'Scouting' },
  ];

  // Get all scouts as array
  const allScouts = useMemo(() => {
    if (!currentScouting) return [];
    const scouts: Scout[] = [currentScouting.director];
    scouts.push(...currentScouting.areaScouts);
    if (currentScouting.proScout) scouts.push(currentScouting.proScout);
    if (currentScouting.nationalScout) scouts.push(currentScouting.nationalScout);
    return scouts;
  }, [currentScouting]);

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Staff Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View GM, Coaching Staff, and Scouting Department
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* No Data State */}
        {!hasData && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-muted-foreground mb-4">
              No staff data available. Generate GM, Coaching, and Scouting from the Full Game page.
            </p>
            <Link
              href="/dashboard/dev-tools/full"
              className={cn(
                'inline-block px-8 py-3 rounded-lg font-semibold transition-all',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:opacity-90 shadow-lg shadow-blue-500/25'
              )}
            >
              Go to Full Game Setup
            </Link>
          </div>
        )}

        {/* Has Data */}
        {hasData && (
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
                  {gms?.playerTeamId === team.id ? ' ⭐ Your Team' : ''}
                </option>
              ))}
            </select>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-400">
                  {currentGM ? '1' : '—'}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">GM</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className={cn(
                  'text-xl font-bold',
                  currentCoaching ? RATING_COLOR(currentCoaching.avgOvr) : 'text-zinc-500'
                )}>
                  {currentCoaching?.avgOvr || '—'}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Coach OVR</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className={cn(
                  'text-xl font-bold',
                  currentScouting ? RATING_COLOR(currentScouting.avgOvr) : 'text-zinc-500'
                )}>
                  {currentScouting?.avgOvr || '—'}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Scout OVR</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-400">
                  {(currentCoaching?.totalSalary || 0) + (currentScouting?.totalBudget || 0) + (currentGM?.contract.salary || 0)}M
                </div>
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
                <div className="space-y-4">
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="font-bold text-lg mb-4">{getTeamName(selectedTeamId)} Staff</h3>

                    {/* GM Summary */}
                    {currentGM && (
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground uppercase mb-2">General Manager</div>
                        <div className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                          <span className="text-2xl">🎩</span>
                          <div className="flex-1">
                            <div className="font-bold">{currentGM.firstName} {currentGM.lastName}</div>
                            <div className="text-xs text-zinc-400">
                              {GM_BACKGROUNDS[currentGM.background]?.name} · {GM_ARCHETYPES[currentGM.archetype]?.name}
                              {currentGM.hasSynergy && <span className="text-yellow-400 ml-1">✨ Synergy</span>}
                            </div>
                          </div>
                          {currentGM.isPlayer && (
                            <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">YOU</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Coaching Summary */}
                    {currentCoaching && (
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground uppercase mb-2">Coaching Staff</div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            currentCoaching.headCoach,
                            currentCoaching.offensiveCoordinator,
                            currentCoaching.defensiveCoordinator,
                            currentCoaching.specialTeamsCoordinator,
                          ].map((coach) => (
                            <div key={coach.id} className="flex items-center gap-2 bg-secondary rounded-lg p-2">
                              <span>{POSITION_ICONS[coach.position]}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {coach.firstName} {coach.lastName}
                                </div>
                                <div className="text-xs text-zinc-500">{coach.position}</div>
                              </div>
                              <span className={cn('font-bold', RATING_COLOR(coach.ovr))}>
                                {coach.ovr}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scouting Summary */}
                    {currentScouting && (
                      <div>
                        <div className="text-xs text-muted-foreground uppercase mb-2">Scouting Department</div>
                        <div className="grid grid-cols-2 gap-2">
                          {allScouts.map((scout) => (
                            <div key={scout.id} className="flex items-center gap-2 bg-secondary rounded-lg p-2">
                              <span>{ROLE_ICONS[scout.role]}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {scout.firstName} {scout.lastName}
                                </div>
                                <div className="text-xs text-zinc-500">{SCOUT_ROLES[scout.role].name}</div>
                              </div>
                              <span className={cn('font-bold', RATING_COLOR(scout.ovr))}>
                                {scout.ovr}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!currentGM && !currentCoaching && !currentScouting && (
                      <div className="text-center text-muted-foreground py-8">
                        No staff data for this team
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* GM Tab */}
              {activeTab === 'gm' && (
                <div className="space-y-4">
                  {currentGM ? (
                    <GMCard gm={currentGM} />
                  ) : (
                    <div className="bg-secondary/50 border border-border rounded-xl p-8 text-center">
                      <div className="text-4xl mb-4">🎩</div>
                      <p className="text-muted-foreground">No GM data available for this team</p>
                      <Link
                        href="/dashboard/dev-tools/full"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        Generate from Full Game page
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Coaching Tab */}
              {activeTab === 'coaching' && (
                <div className="space-y-4">
                  {currentCoaching ? (
                    <>
                      {/* Staff Overview */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold">{getTeamName(selectedTeamId)}</h3>
                            <div className="text-sm text-muted-foreground">Coaching Staff</div>
                          </div>
                          <div className="text-right">
                            <div className={cn('text-2xl font-bold', RATING_COLOR(currentCoaching.avgOvr))}>
                              {currentCoaching.avgOvr}
                            </div>
                            <div className="text-xs text-muted-foreground">Avg OVR</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Total Salary</div>
                            <div className="font-bold">${currentCoaching.totalSalary}M</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Chemistry</div>
                            <div className={cn(
                              'font-bold',
                              currentCoaching.staffChemistry >= 80 ? 'text-green-400' :
                              currentCoaching.staffChemistry >= 60 ? 'text-yellow-400' : 'text-red-400'
                            )}>
                              {currentCoaching.staffChemistry}%
                            </div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Coaches</div>
                            <div className="font-bold">4</div>
                          </div>
                        </div>
                      </div>

                      {/* Coach Cards */}
                      <CoachCard coach={currentCoaching.headCoach} />
                      <div className="grid grid-cols-1 gap-3">
                        <CoachCard coach={currentCoaching.offensiveCoordinator} />
                        <CoachCard coach={currentCoaching.defensiveCoordinator} />
                        <CoachCard coach={currentCoaching.specialTeamsCoordinator} />
                      </div>
                    </>
                  ) : (
                    <div className="bg-secondary/50 border border-border rounded-xl p-8 text-center">
                      <div className="text-4xl mb-4">👔</div>
                      <p className="text-muted-foreground">No coaching data available for this team</p>
                      <Link
                        href="/dashboard/dev-tools/coaching"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        Generate from Coaching page
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Scouting Tab */}
              {activeTab === 'scouting' && (
                <div className="space-y-4">
                  {currentScouting ? (
                    <>
                      {/* Department Overview */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold">{getTeamName(selectedTeamId)}</h3>
                            <div className="text-sm text-muted-foreground">Scouting Department</div>
                          </div>
                          <div className="text-right">
                            <div className={cn('text-2xl font-bold', RATING_COLOR(currentScouting.avgOvr))}>
                              {currentScouting.avgOvr}
                            </div>
                            <div className="text-xs text-muted-foreground">Avg OVR</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Budget</div>
                            <div className="font-bold">${currentScouting.totalBudget.toFixed(1)}M</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Weekly Pts</div>
                            <div className="font-bold text-green-400">{currentScouting.weeklyPoints}</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Scouts</div>
                            <div className="font-bold">{currentScouting.scoutCount}</div>
                          </div>
                        </div>
                      </div>

                      {/* Scout Cards */}
                      <div className="space-y-3">
                        {allScouts.map((scout) => (
                          <ScoutCard key={scout.id} scout={scout} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-secondary/50 border border-border rounded-xl p-8 text-center">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-muted-foreground">No scouting data available for this team</p>
                      <Link
                        href="/dashboard/dev-tools/scouting"
                        className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                      >
                        Generate from Scouting page
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
