'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { storeFacilities, getFacilities, getCachedStats } from '@/lib/facilities/facilities-store';
import { getFullGameData } from '@/lib/dev-player-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import {
  LeagueFacilities,
  TeamFacilities,
  FacilitiesStats,
  OwnerTier,
} from '@/lib/facilities/types';
import { Tier } from '@/lib/types';

type ViewTab = 'overview' | 'by-team' | 'rankings' | 'owners';

const OWNER_TIER_COLORS: Record<OwnerTier, string> = {
  wealthy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  solid: 'bg-green-500/20 text-green-400 border-green-500/40',
  moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  budget: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  cheap: 'bg-red-500/20 text-red-400 border-red-500/40',
};

const OWNER_TIER_LABELS: Record<OwnerTier, string> = {
  wealthy: 'Wealthy',
  solid: 'Solid',
  moderate: 'Moderate',
  budget: 'Budget',
  cheap: 'Cheap',
};

const RATING_COLOR = (rating: number): string => {
  if (rating >= 9) return 'text-yellow-400';
  if (rating >= 7) return 'text-green-400';
  if (rating >= 5) return 'text-blue-400';
  if (rating >= 3) return 'text-orange-400';
  return 'text-red-400';
};

const RATING_BG = (rating: number): string => {
  if (rating >= 9) return 'bg-yellow-500/20 border-yellow-500/40';
  if (rating >= 7) return 'bg-green-500/20 border-green-500/40';
  if (rating >= 5) return 'bg-blue-500/20 border-blue-500/40';
  if (rating >= 3) return 'bg-orange-500/20 border-orange-500/40';
  return 'bg-red-500/20 border-red-500/40';
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const stars = Math.round(rating);
  const sizeClass = size === 'lg' ? 'text-lg' : 'text-xs';
  return (
    <div className={cn('flex gap-0.5', sizeClass)}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={i < stars ? 'text-yellow-400' : 'text-zinc-600'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function FacilitiesGeneratorPage() {
  const [facilities, setFacilities] = useState<LeagueFacilities | null>(null);
  const [stats, setStats] = useState<FacilitiesStats | null>(null);
  const [tierAssignments, setTierAssignments] = useState<Record<string, Tier> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('BOS');
  const [hasRosters, setHasRosters] = useState(false);

  // Load existing facilities data on mount and check for rosters
  useEffect(() => {
    const existingFacilities = getFacilities();
    const existingStats = getCachedStats();
    if (existingFacilities) {
      setFacilities(existingFacilities);
      if (existingStats) {
        setStats(existingStats);
      }
    }
    // Check if rosters exist in storage
    const fullGameData = getFullGameData();
    setHasRosters(!!fullGameData && fullGameData.teams.length > 0);
  }, []);

  // Store facilities when generated
  useEffect(() => {
    if (facilities) {
      storeFacilities(facilities);
    }
  }, [facilities]);

  const generateFacilities = async () => {
    setLoading(true);
    try {
      // Build teamTiers from stored roster data
      const fullGameData = getFullGameData();
      const teamTiers: Record<string, Tier> = {};
      if (fullGameData) {
        for (const teamData of fullGameData.teams) {
          teamTiers[teamData.team.id] = teamData.tier;
        }
      }

      const response = await fetch('/api/dev/generate-facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers }),
      });
      const data = await response.json();
      if (data.success) {
        setFacilities(data.facilities);
        setStats(data.stats);
        setTierAssignments(data.tierAssignments);
      }
    } catch (error) {
      console.error('Failed to generate facilities:', error);
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
    { id: 'owners', label: 'Owners' },
  ];

  const selectedTeamFacilities: TeamFacilities | null =
    facilities?.teams[selectedTeamId] || null;

  const sortedTeams = facilities
    ? Object.values(facilities.teams).sort((a, b) => b.averageRating - a.averageRating)
    : [];

  const teamsByOwnerTier = facilities
    ? Object.values(facilities.teams).reduce(
        (acc, team) => {
          if (!acc[team.ownerTier]) acc[team.ownerTier] = [];
          acc[team.ownerTier].push(team);
          return acc;
        },
        {} as Record<OwnerTier, TeamFacilities[]>
      )
    : ({} as Record<OwnerTier, TeamFacilities[]>);

  const FacilityCard = ({
    title,
    rating,
    details,
    effects,
  }: {
    title: string;
    rating: number;
    details: { label: string; value: string | number | boolean }[];
    effects: { label: string; value: string | number }[];
  }) => (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold">{title}</h4>
        <div className={cn('text-2xl font-bold', RATING_COLOR(rating))}>{rating}</div>
      </div>
      <StarRating rating={rating} />
      <div className="grid grid-cols-2 gap-2 text-xs">
        {details.map((d) => (
          <div key={d.label} className="flex justify-between">
            <span className="text-muted-foreground">{d.label}</span>
            <span className="font-medium">
              {typeof d.value === 'boolean' ? (d.value ? '✓' : '✗') : d.value}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-2 space-y-1">
        <div className="text-[10px] text-muted-foreground uppercase font-bold">Effects</div>
        {effects.map((e) => (
          <div key={e.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{e.label}</span>
            <span className={cn('font-medium', Number(e.value) > 0 ? 'text-green-400' : '')}>
              {typeof e.value === 'number' && e.value > 0 ? `+${e.value}` : e.value}
            </span>
          </div>
        ))}
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
        <h1 className="text-2xl font-bold mt-2">Facilities Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate team facilities with stadium, practice, training, and weight room ratings
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Generate Section */}
        {!facilities && (
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">🏟️</div>
            <p className="text-muted-foreground mb-4">
              Generate facilities for all 32 teams with ratings, effects, and owner tiers.
            </p>
            {!hasRosters && (
              <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm">
                Rosters must be generated first. Generate rosters from the Full page to enable tier-based facilities generation.
              </div>
            )}
            <button
              onClick={generateFacilities}
              disabled={loading || !hasRosters}
              className={cn(
                'px-8 py-3 rounded-lg font-semibold transition-all',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:opacity-90 shadow-lg shadow-blue-500/25',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {loading ? 'Generating...' : 'Generate Facilities'}
            </button>
          </div>
        )}

        {/* Regenerate Button */}
        {facilities && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Generated {new Date(facilities.generatedAt).toLocaleTimeString()}
            </div>
            <button
              onClick={generateFacilities}
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
                <div className="text-[10px] text-muted-foreground uppercase">Avg Rating</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-yellow-400">{stats.eliteFacilities}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Elite</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-green-400">{stats.goodFacilities}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Good</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-blue-400">{stats.averageFacilities}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Average</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-red-400">{stats.poorFacilities}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Poor</div>
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
                  {/* Facility Type Averages */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Average Ratings by Type</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgStadiumRating))}>
                        <div className="text-2xl mb-1">🏟️</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgStadiumRating))}>
                          {stats.avgStadiumRating}
                        </div>
                        <div className="text-xs text-muted-foreground">Stadium</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgPracticeRating))}>
                        <div className="text-2xl mb-1">🏈</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgPracticeRating))}>
                          {stats.avgPracticeRating}
                        </div>
                        <div className="text-xs text-muted-foreground">Practice</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgTrainingRating))}>
                        <div className="text-2xl mb-1">🏥</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgTrainingRating))}>
                          {stats.avgTrainingRating}
                        </div>
                        <div className="text-xs text-muted-foreground">Training</div>
                      </div>
                      <div className={cn('rounded-lg p-3 text-center border', RATING_BG(stats.avgWeightRating))}>
                        <div className="text-2xl mb-1">🏋️</div>
                        <div className={cn('text-2xl font-bold', RATING_COLOR(stats.avgWeightRating))}>
                          {stats.avgWeightRating}
                        </div>
                        <div className="text-xs text-muted-foreground">Weight</div>
                      </div>
                    </div>
                  </div>

                  {/* Owner Tier Distribution */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-3">Owner Tier Distribution</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {(['wealthy', 'solid', 'moderate', 'budget', 'cheap'] as OwnerTier[]).map(
                        (tier) => (
                          <div
                            key={tier}
                            className={cn(
                              'rounded-lg p-3 text-center border',
                              OWNER_TIER_COLORS[tier]
                            )}
                          >
                            <div className="text-2xl font-bold">
                              {stats.ownerTierDistribution[tier]}
                            </div>
                            <div className="text-xs capitalize">{tier}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* League Revenue */}
                  <div className="bg-secondary/50 border border-border rounded-xl p-4">
                    <h3 className="text-sm font-bold mb-2">Total League Stadium Revenue</h3>
                    <div className="text-3xl font-bold text-green-400">
                      ${stats.totalLeagueRevenue}M
                    </div>
                    <div className="text-xs text-muted-foreground">Per Season</div>
                  </div>

                  {/* Top & Bottom Teams */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-green-400 mb-3">Top 5 Facilities</h3>
                      <div className="space-y-2">
                        {stats.topTeams.map((t, i) => (
                          <div key={t.teamId} className="flex justify-between items-center">
                            <span className="text-sm">
                              {i + 1}. {t.teamId}
                            </span>
                            <span className="font-bold text-green-400">{t.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-red-400 mb-3">Bottom 5 Facilities</h3>
                      <div className="space-y-2">
                        {stats.bottomTeams.map((t, i) => (
                          <div key={t.teamId} className="flex justify-between items-center">
                            <span className="text-sm">
                              {32 - 4 + i}. {t.teamId}
                            </span>
                            <span className="font-bold text-red-400">{t.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* By Team Tab */}
              {activeTab === 'by-team' && facilities && (
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

                  {selectedTeamFacilities && (
                    <div className="space-y-4">
                      {/* Team Overview */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{getTeamName(selectedTeamId)}</h3>
                            <div className="text-sm text-muted-foreground">
                              Rank #{selectedTeamFacilities.leagueRank} of 32
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={cn(
                                'text-3xl font-bold',
                                RATING_COLOR(selectedTeamFacilities.averageRating)
                              )}
                            >
                              {selectedTeamFacilities.averageRating}
                            </div>
                            <StarRating rating={selectedTeamFacilities.averageRating} />
                          </div>
                        </div>

                        {/* Owner Info */}
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          <div
                            className={cn(
                              'rounded-lg p-2 text-center border',
                              OWNER_TIER_COLORS[selectedTeamFacilities.ownerTier]
                            )}
                          >
                            <div className="text-xs text-muted-foreground">Owner</div>
                            <div className="font-bold capitalize">
                              {selectedTeamFacilities.ownerTier}
                            </div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Budget</div>
                            <div className="font-bold">${selectedTeamFacilities.annualBudget}M</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">Upgrade Fund</div>
                            <div className="font-bold">${selectedTeamFacilities.upgradeFund}M</div>
                          </div>
                          <div className="bg-secondary rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground">FA Appeal</div>
                            <div
                              className={cn(
                                'font-bold',
                                selectedTeamFacilities.faAppealBonus > 0
                                  ? 'text-green-400'
                                  : selectedTeamFacilities.faAppealBonus < 0
                                    ? 'text-red-400'
                                    : ''
                              )}
                            >
                              {selectedTeamFacilities.faAppealBonus > 0 ? '+' : ''}
                              {selectedTeamFacilities.faAppealBonus}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Facility Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <FacilityCard
                          title="🏟️ Stadium"
                          rating={selectedTeamFacilities.stadium.rating}
                          details={[
                            { label: 'Capacity', value: selectedTeamFacilities.stadium.capacity.toLocaleString() },
                            { label: 'Surface', value: selectedTeamFacilities.stadium.surface },
                            { label: 'Type', value: selectedTeamFacilities.stadium.type },
                            { label: 'Climate', value: selectedTeamFacilities.stadium.climate },
                            { label: 'Noise', value: selectedTeamFacilities.stadium.noiseLevel },
                            { label: 'Suites', value: selectedTeamFacilities.stadium.luxurySuites },
                            { label: 'Built', value: selectedTeamFacilities.stadium.yearBuilt },
                          ]}
                          effects={[
                            { label: 'Home Adv', value: `+${selectedTeamFacilities.stadium.homeAdvantage} OVR` },
                            { label: 'Attendance', value: `${selectedTeamFacilities.stadium.attendance}%` },
                            { label: 'Revenue', value: `$${selectedTeamFacilities.stadium.revenue}M` },
                            { label: 'Morale', value: `${selectedTeamFacilities.stadium.moraleBonus}%` },
                          ]}
                        />
                        <FacilityCard
                          title="🏈 Practice"
                          rating={selectedTeamFacilities.practice.rating}
                          details={[
                            { label: 'Fields', value: selectedTeamFacilities.practice.practiceFields },
                            { label: 'Film Tech', value: selectedTeamFacilities.practice.filmRoomTech },
                            { label: 'Meeting Rooms', value: selectedTeamFacilities.practice.meetingRooms },
                            { label: 'Indoor', value: selectedTeamFacilities.practice.hasIndoor },
                          ]}
                          effects={[
                            { label: 'XP Gain', value: `${selectedTeamFacilities.practice.xpGainBonus}%` },
                            { label: 'Injury Prev', value: `${selectedTeamFacilities.practice.injuryPrevention}%` },
                            { label: 'Scheme Install', value: `${selectedTeamFacilities.practice.schemeInstallWeeks} wks` },
                          ]}
                        />
                        <FacilityCard
                          title="🏥 Training Room"
                          rating={selectedTeamFacilities.training.rating}
                          details={[
                            { label: 'Treatment', value: selectedTeamFacilities.training.treatmentRooms },
                            { label: 'Pool', value: selectedTeamFacilities.training.hasTherapyPool },
                            { label: 'Sports Lab', value: selectedTeamFacilities.training.hasSportsLab },
                          ]}
                          effects={[
                            { label: 'Recovery', value: `${selectedTeamFacilities.training.recoverySpeedBonus}%` },
                            { label: 'Injury Rate', value: `-${selectedTeamFacilities.training.injuryRateReduction}%` },
                            { label: 'Severity', value: `${selectedTeamFacilities.training.severityReduction}%` },
                            { label: 'Longevity', value: `+${selectedTeamFacilities.training.longevityBonus} yrs` },
                          ]}
                        />
                        <FacilityCard
                          title="🏋️ Weight Room"
                          rating={selectedTeamFacilities.weight.rating}
                          details={[
                            { label: 'Equipment', value: selectedTeamFacilities.weight.equipmentQuality },
                            { label: 'Space', value: `${(selectedTeamFacilities.weight.spaceSqFt / 1000).toFixed(0)}k sqft` },
                            { label: 'Cardio', value: selectedTeamFacilities.weight.cardioMachines },
                            { label: 'Agility', value: `${selectedTeamFacilities.weight.speedAgilityYards} yds` },
                            { label: 'Recovery Eq', value: selectedTeamFacilities.weight.hasRecoveryEquipment },
                          ]}
                          effects={[
                            { label: 'Physical XP', value: `${selectedTeamFacilities.weight.physicalXpBonus}%` },
                            { label: 'Strength/Yr', value: `+${selectedTeamFacilities.weight.strengthPerSeason}` },
                            { label: 'Speed/Yr', value: `+${selectedTeamFacilities.weight.speedPerSeason}` },
                            { label: 'Age Decline', value: `-${selectedTeamFacilities.weight.ageDeclineReduction}%` },
                          ]}
                        />
                      </div>

                      {/* Maintenance Cost */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                        <div className="text-sm text-muted-foreground">Annual Maintenance Cost</div>
                        <div className="text-2xl font-bold text-red-400">
                          ${selectedTeamFacilities.totalMaintenanceCost}M
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Rankings Tab */}
              {activeTab === 'rankings' && facilities && (
                <div className="space-y-2">
                  {sortedTeams.map((team, index) => (
                    <div
                      key={team.teamId}
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
                          <div className="font-bold">{team.teamId}</div>
                          <div className="text-xs text-muted-foreground">
                            {getTeamName(team.teamId)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground text-right">
                          <div>
                            🏟️ {team.stadium.rating} · 🏈 {team.practice.rating}
                          </div>
                          <div>
                            🏥 {team.training.rating} · 🏋️ {team.weight.rating}
                          </div>
                        </div>
                        <div
                          className={cn('text-2xl font-bold', RATING_COLOR(team.averageRating))}
                        >
                          {team.averageRating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Owners Tab */}
              {activeTab === 'owners' && facilities && (
                <div className="space-y-6">
                  {(['wealthy', 'solid', 'moderate', 'budget', 'cheap'] as OwnerTier[]).map(
                    (tier) => (
                      <div key={tier} className="space-y-2">
                        <h3
                          className={cn(
                            'text-sm font-bold flex items-center gap-2',
                            tier === 'wealthy'
                              ? 'text-yellow-400'
                              : tier === 'solid'
                                ? 'text-green-400'
                                : tier === 'moderate'
                                  ? 'text-blue-400'
                                  : tier === 'budget'
                                    ? 'text-orange-400'
                                    : 'text-red-400'
                          )}
                        >
                          <span
                            className={cn(
                              'w-3 h-3 rounded-full',
                              tier === 'wealthy'
                                ? 'bg-yellow-500'
                                : tier === 'solid'
                                  ? 'bg-green-500'
                                  : tier === 'moderate'
                                    ? 'bg-blue-500'
                                    : tier === 'budget'
                                      ? 'bg-orange-500'
                                      : 'bg-red-500'
                            )}
                          />
                          {OWNER_TIER_LABELS[tier]} Owners ({teamsByOwnerTier[tier]?.length || 0})
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {(teamsByOwnerTier[tier] || [])
                            .sort((a, b) => b.averageRating - a.averageRating)
                            .map((team) => (
                              <div
                                key={team.teamId}
                                className={cn(
                                  'rounded-lg p-3 border flex items-center justify-between',
                                  OWNER_TIER_COLORS[tier]
                                )}
                              >
                                <div>
                                  <div className="font-bold">{team.teamId}</div>
                                  <div className="text-xs opacity-75">
                                    ${team.annualBudget}M budget
                                  </div>
                                </div>
                                <div className={cn('text-xl font-bold', RATING_COLOR(team.averageRating))}>
                                  {team.averageRating}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )
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
