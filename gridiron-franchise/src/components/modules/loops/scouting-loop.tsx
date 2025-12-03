'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useScoutingStore } from '@/stores/scouting-store';
import { ScoutingPointsDisplay } from '@/components/scouting';
import { getDraftClass } from '@/lib/dev-player-store';
import { getScouting } from '@/lib/scouting/scouting-store';
import { getGMs } from '@/lib/gm';
import { Player } from '@/lib/types';
import {
  Scout,
  ScoutRole,
  ScoutingReport,
  SCOUT_ROLES,
  ProspectTier,
  ScoutingDepartment,
} from '@/lib/scouting/types';
import {
  generateScoutingReport,
  ProspectData,
  calculateScoutingCost,
} from '@/lib/scouting/scouting-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, ClipboardList } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type ViewTab = 'prospects' | 'reports' | 'department';
type PositionFilter = 'all' | 'offense' | 'defense' | 'special';

// ============================================================================
// PROPS
// ============================================================================

interface ScoutingLoopProps {
  // Mode controls layout
  mode: 'standalone' | 'embedded';

  // Data - can be provided or loaded internally
  department?: ScoutingDepartment;
  draftClass?: Player[];
  teamId?: string;

  // Embedded mode options
  maxHeight?: string;

  // Callbacks
  onProspectScout?: (prospectId: string, report: ScoutingReport) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

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

const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  A: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  'A-': 'bg-green-500/20 text-green-400 border-green-500/40',
  'B+': 'bg-green-500/20 text-green-400 border-green-500/40',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'B-': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'C+': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
  C: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
  'C-': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  D: 'bg-red-500/20 text-red-400 border-red-500/40',
  F: 'bg-red-500/20 text-red-400 border-red-500/40',
};

function getPositionGroup(position: string): PositionFilter {
  const offense = ['QB', 'RB', 'FB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT', 'OL'];
  const defense = ['DE', 'DT', 'NT', 'MLB', 'OLB', 'ILB', 'LOLB', 'ROLB', 'CB', 'FS', 'SS', 'S'];
  const special = ['K', 'P'];

  if (offense.includes(position)) return 'offense';
  if (defense.includes(position)) return 'defense';
  if (special.includes(position)) return 'special';
  return 'all';
}

function getProspectTier(overall: number): ProspectTier {
  if (overall >= 75) return 'top';
  if (overall >= 65) return 'mid';
  if (overall >= 55) return 'late';
  return 'udfa';
}

function playerToProspectData(player: Player): ProspectData {
  const potentialGap = player.potential - player.overall;
  const isSleeper = potentialGap >= 15 && player.overall < 70;
  const isBust = potentialGap <= -10 || (player.overall >= 75 && player.potential < 70);

  return {
    id: player.id,
    trueOvr: player.overall,
    truePotential: player.potential,
    traits: player.traits || [],
    attributes: player.attributes as unknown as Record<string, number>,
    isBust,
    isSleeper,
    position: player.position,
  };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ProspectCard({
  prospect,
  report,
  onScout,
  canScout,
  scoutingCost,
}: {
  prospect: Player;
  report?: ScoutingReport;
  onScout: () => void;
  canScout: boolean;
  scoutingCost: number;
}) {
  const hasReport = !!report;

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
            {prospect.position}
          </div>
          <div>
            <div className="font-bold">
              {prospect.firstName} {prospect.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{prospect.college}</div>
          </div>
        </div>

        {hasReport ? (
          <div
            className={cn(
              'px-2 py-1 rounded border text-sm font-bold',
              GRADE_COLORS[report.draftGrade]
            )}
          >
            {report.draftGrade}
          </div>
        ) : (
          <div className="text-2xl font-bold text-zinc-600">?</div>
        )}
      </div>

      {/* Physical measurables (always visible) */}
      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">Age</div>
          <div className="font-medium">{prospect.age}</div>
        </div>
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">Ht</div>
          <div className="font-medium">
            {Math.floor(prospect.height / 12)}&apos;{prospect.height % 12}&quot;
          </div>
        </div>
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">Wt</div>
          <div className="font-medium">{prospect.weight}</div>
        </div>
        <div className="bg-secondary rounded p-1.5 text-center">
          <div className="text-muted-foreground">40</div>
          <div className="font-medium">{prospect.fortyTime.toFixed(2)}</div>
        </div>
      </div>

      {/* Scouting Report Preview */}
      {hasReport ? (
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Scouted OVR</span>
            <span className={cn('font-bold', RATING_COLOR(report.scoutedOvr))}>
              {report.scoutedOvr}{' '}
              <span className="text-xs text-zinc-500">({report.ovrConfidence}% conf)</span>
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Projection</span>
            <span>Round {report.roundProjection}</span>
          </div>
          {report.potentialValue && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential</span>
              <span>
                {typeof report.potentialValue === 'number'
                  ? report.potentialValue
                  : Array.isArray(report.potentialValue)
                  ? `${report.potentialValue[0]}-${report.potentialValue[1]}`
                  : report.potentialValue}
              </span>
            </div>
          )}
          {report.bustRisk > 40 && (
            <div className="flex justify-between text-sm text-red-400">
              <span>Bust Risk</span>
              <span>{report.bustRisk}%</span>
            </div>
          )}
          {report.sleeperFlag && (
            <div className="text-xs text-yellow-400 flex items-center gap-1">
              <span>⭐</span> Sleeper Alert
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-border pt-3">
          <button
            onClick={onScout}
            disabled={!canScout}
            className={cn(
              'w-full py-2 rounded-lg text-sm font-medium transition-all',
              canScout
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            )}
          >
            Scout ({scoutingCost} pts)
          </button>
        </div>
      )}
    </div>
  );
}

function ScoutSelector({
  scouts,
  selectedScoutId,
  onSelect,
}: {
  scouts: Scout[];
  selectedScoutId: string | null;
  onSelect: (scoutId: string) => void;
}) {
  return (
    <div className="space-y-2">
      {scouts.map((scout) => (
        <button
          key={scout.id}
          onClick={() => onSelect(scout.id)}
          className={cn(
            'w-full p-3 rounded-lg border text-left transition-all',
            selectedScoutId === scout.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-border bg-secondary/50 hover:border-zinc-600'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{ROLE_ICONS[scout.role]}</span>
              <div>
                <div className="font-medium text-sm">
                  {scout.firstName} {scout.lastName}
                </div>
                <div className="text-xs text-muted-foreground">{SCOUT_ROLES[scout.role].name}</div>
              </div>
            </div>
            <div className={cn('text-lg font-bold', RATING_COLOR(scout.ovr))}>{scout.ovr}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ReportCard({ report, prospect }: { report: ScoutingReport; prospect?: Player }) {
  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'px-3 py-1.5 rounded border text-lg font-bold',
              GRADE_COLORS[report.draftGrade]
            )}
          >
            {report.draftGrade}
          </div>
          <div>
            {prospect && (
              <>
                <div className="font-bold">
                  {prospect.firstName} {prospect.lastName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {prospect.position} · {prospect.college}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={cn('text-2xl font-bold', RATING_COLOR(report.scoutedOvr))}>
            {report.scoutedOvr}
          </div>
          <div className="text-xs text-muted-foreground">{report.ovrConfidence}% confidence</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Round Projection</div>
          <div className="font-bold">Round {report.roundProjection}</div>
        </div>
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Potential</div>
          <div className="font-bold">
            {report.potentialValue === undefined
              ? '???'
              : typeof report.potentialValue === 'number'
              ? report.potentialValue
              : Array.isArray(report.potentialValue)
              ? `${report.potentialValue[0]}-${report.potentialValue[1]}`
              : report.potentialValue}
          </div>
        </div>
      </div>

      {/* Bust Risk */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Bust Risk</span>
          <span className={report.bustRisk >= 50 ? 'text-red-400' : ''}>{report.bustRisk}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              report.bustRisk >= 50 ? 'bg-red-500' : 'bg-green-500'
            )}
            style={{ width: `${report.bustRisk}%` }}
          />
        </div>
      </div>

      {/* Sleeper Flag */}
      {report.sleeperFlag && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <span>⭐</span>
            <span className="font-medium">Sleeper Alert</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            This prospect may outperform their draft position
          </div>
        </div>
      )}

      {/* Traits */}
      {report.traitsRevealed.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">
            Traits ({report.traitsRevealed.length} revealed, {report.traitsHidden} hidden)
          </div>
          <div className="flex flex-wrap gap-1">
            {report.traitsRevealed.map((trait) => (
              <span key={trait} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-sm text-zinc-400 italic border-t border-border pt-3">
        &quot;{report.textSummary}&quot;
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ScoutingLoop({
  mode,
  department: providedDepartment,
  draftClass: providedDraftClass,
  teamId: providedTeamId,
  maxHeight = mode === 'embedded' ? '500px' : undefined,
  onProspectScout,
}: ScoutingLoopProps) {
  // Scouting store
  const storeDepartment = useScoutingStore((s) => s.department);
  const currentWeek = useScoutingStore((s) => s.currentWeek);
  const currentPeriod = useScoutingStore((s) => s.currentPeriod);
  const weeklyPointsAvailable = useScoutingStore((s) => s.weeklyPointsAvailable);
  const weeklyPointsSpent = useScoutingStore((s) => s.weeklyPointsSpent);
  const assignments = useScoutingStore((s) => s.assignments);
  const storeReports = useScoutingStore((s) => s.reports);
  const assignScout = useScoutingStore((s) => s.assignScout);
  const generateReportAction = useScoutingStore((s) => s.generateReport);
  const initializeDepartment = useScoutingStore((s) => s.initializeDepartment);

  // Use provided data or store data
  const department = providedDepartment || storeDepartment;

  // Local state
  const [draftClass, setDraftClass] = useState<Player[]>(providedDraftClass || []);
  const [activeTab, setActiveTab] = useState<ViewTab>('prospects');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all');
  const [selectedScoutId, setSelectedScoutId] = useState<string | null>(null);
  const [scoutingProspectId, setScoutingProspectId] = useState<string | null>(null);

  const weeklyPointsTotal = weeklyPointsAvailable + weeklyPointsSpent;

  // Load draft class and initialize department if needed
  useEffect(() => {
    if (!providedDraftClass) {
      const draft = getDraftClass();
      if (draft) {
        setDraftClass(draft);
      }
    }

    // Initialize department from storage if not in store and not provided
    if (!department) {
      const gms = getGMs();
      const scouting = getScouting();
      if (gms && scouting) {
        const teamId = providedTeamId || gms.playerTeamId;
        const dept = scouting.teams[teamId];
        if (dept) {
          initializeDepartment(dept, teamId);
        }
      }
    }
  }, [department, initializeDepartment, providedDraftClass, providedTeamId]);

  // Get all scouts
  const allScouts = useMemo(() => {
    if (!department) return [];
    const scouts: Scout[] = [department.director];
    scouts.push(...department.areaScouts);
    if (department.proScout) scouts.push(department.proScout);
    if (department.nationalScout) scouts.push(department.nationalScout);
    return scouts;
  }, [department]);

  // Filter prospects
  const filteredProspects = useMemo(() => {
    let prospects = [...draftClass];
    if (positionFilter !== 'all') {
      prospects = prospects.filter((p) => getPositionGroup(p.position) === positionFilter);
    }
    return prospects.sort((a, b) => b.overall - a.overall);
  }, [draftClass, positionFilter]);

  // Get reports array
  const reportsArray = useMemo(() => {
    return Object.values(storeReports);
  }, [storeReports]);

  const pointsRemaining = weeklyPointsAvailable;

  const handleScoutProspect = (prospectId: string) => {
    setScoutingProspectId(prospectId);
    if (!selectedScoutId && allScouts.length > 0) {
      setSelectedScoutId(allScouts[0].id);
    }
  };

  const confirmScout = () => {
    if (!scoutingProspectId || !selectedScoutId) return;

    const prospect = draftClass.find((p) => p.id === scoutingProspectId);
    const scout = allScouts.find((s) => s.id === selectedScoutId);

    if (!prospect || !scout) return;

    const tier = getProspectTier(prospect.overall);
    const cost = calculateScoutingCost(tier, currentPeriod);

    if (cost > pointsRemaining) return;

    // Use store to assign scout (handles point deduction)
    const success = assignScout(selectedScoutId, scoutingProspectId, tier);
    if (!success) return;

    // Generate report
    const prospectData = playerToProspectData(prospect);
    const report = generateScoutingReport(scout, prospectData, currentWeek);

    // Find the assignment we just created
    const assignment = assignments.find(
      (a) => a.scoutId === selectedScoutId && a.prospectId === scoutingProspectId && !a.reportGenerated
    );
    if (assignment) {
      generateReportAction(assignment.id, report);
    }

    // Callback
    onProspectScout?.(scoutingProspectId, report);

    setScoutingProspectId(null);
  };

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'prospects', label: `Prospects (${draftClass.length})`, icon: <Search className="w-4 h-4" /> },
    { id: 'reports', label: `Reports (${reportsArray.length})`, icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'department', label: 'My Scouts', icon: <Users className="w-4 h-4" /> },
  ];

  // Empty state - no department
  if (!department) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Search className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">
            {mode === 'standalone'
              ? 'Generate a scouting department from the Full Game page first'
              : 'No scouting department available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Empty state - no draft class
  if (draftClass.length === 0) {
    return (
      <div className="space-y-4">
        <ScoutingPointsDisplay
          available={weeklyPointsAvailable}
          spent={weeklyPointsSpent}
          total={weeklyPointsTotal}
          currentWeek={currentWeek}
          currentPeriod={currentPeriod}
          assignmentCount={assignments.filter((a) => a.week === currentWeek).length}
        />
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400">
              {mode === 'standalone'
                ? 'Generate a draft class from the Full Game page first'
                : 'No draft class available'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header - Standalone only */}
      {mode === 'standalone' && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Scouting Department</h3>
            <p className="text-sm text-zinc-400">{department.scoutCount} scouts · Week {currentWeek}</p>
          </div>
        </div>
      )}

      {/* Points Display */}
      <ScoutingPointsDisplay
        available={weeklyPointsAvailable}
        spent={weeklyPointsSpent}
        total={weeklyPointsTotal}
        currentWeek={currentWeek}
        currentPeriod={currentPeriod}
        assignmentCount={assignments.filter((a) => a.week === currentWeek).length}
      />

      {/* Content Container */}
      <div
        className="space-y-4"
        style={{ maxHeight: maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
      >
        {/* Tabs */}
        <div className="bg-secondary/80 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2',
                  activeTab === tab.id
                    ? 'text-foreground bg-white/5 border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'prospects' && (
          <div className="space-y-4">
            {/* Position Filter */}
            <div className="flex gap-2">
              {(['all', 'offense', 'defense', 'special'] as PositionFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPositionFilter(filter)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                    positionFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Prospect Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProspects.map((prospect) => {
                const report = storeReports[prospect.id];
                const tier = getProspectTier(prospect.overall);
                const cost = calculateScoutingCost(tier, currentPeriod);
                const canScout = cost <= pointsRemaining && !report;

                return (
                  <ProspectCard
                    key={prospect.id}
                    prospect={prospect}
                    report={report}
                    onScout={() => handleScoutProspect(prospect.id)}
                    canScout={canScout}
                    scoutingCost={cost}
                  />
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reportsArray.length === 0 ? (
              <div className="bg-secondary/50 border border-border rounded-xl p-8 text-center">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No scouting reports yet</p>
                <p className="text-sm text-zinc-500 mt-1">Scout prospects to generate reports</p>
              </div>
            ) : (
              reportsArray
                .sort((a, b) => b.scoutedOvr - a.scoutedOvr)
                .map((report) => {
                  const prospect = draftClass.find((p) => p.id === report.prospectId);
                  return <ReportCard key={report.id} report={report} prospect={prospect} />;
                })
            )}
          </div>
        )}

        {activeTab === 'department' && (
          <div className="space-y-4">
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="font-bold">Scouting Department</div>
                  <div className="text-sm text-muted-foreground">{department.scoutCount} scouts</div>
                </div>
                <div className="text-right">
                  <div className={cn('text-2xl font-bold', RATING_COLOR(department.avgOvr))}>
                    {department.avgOvr}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg OVR</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground">Weekly Points</div>
                  <div className="font-bold text-green-400">{department.weeklyPoints}</div>
                </div>
                <div className="bg-secondary rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground">Budget</div>
                  <div className="font-bold">${department.totalBudget.toFixed(1)}M</div>
                </div>
              </div>
            </div>

            {allScouts.map((scout) => (
              <div key={scout.id} className="bg-secondary/50 border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ROLE_ICONS[scout.role]}</span>
                    <div>
                      <div className="font-bold">
                        {scout.firstName} {scout.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {SCOUT_ROLES[scout.role].name}
                      </div>
                    </div>
                  </div>
                  <div className={cn('text-2xl font-bold', RATING_COLOR(scout.ovr))}>
                    {scout.ovr}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
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
                    <div className="font-medium text-green-400">{scout.weeklyPoints}</div>
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between bg-secondary/50 rounded px-2 py-1">
                    <span className="text-muted-foreground">Talent Eval</span>
                    <span className={RATING_COLOR(scout.attributes.talentEvaluation)}>
                      {scout.attributes.talentEvaluation}
                    </span>
                  </div>
                  <div className="flex justify-between bg-secondary/50 rounded px-2 py-1">
                    <span className="text-muted-foreground">Potential</span>
                    <span className={RATING_COLOR(scout.attributes.potentialAssessment)}>
                      {scout.attributes.potentialAssessment}
                    </span>
                  </div>
                  <div className="flex justify-between bg-secondary/50 rounded px-2 py-1">
                    <span className="text-muted-foreground">Bust Detection</span>
                    <span className={RATING_COLOR(scout.attributes.bustDetection)}>
                      {scout.attributes.bustDetection}
                    </span>
                  </div>
                  <div className="flex justify-between bg-secondary/50 rounded px-2 py-1">
                    <span className="text-muted-foreground">Sleeper</span>
                    <span className={RATING_COLOR(scout.attributes.sleeperDiscovery)}>
                      {scout.attributes.sleeperDiscovery}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scout Selection Modal */}
      {scoutingProspectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-border rounded-xl p-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Select Scout</h3>

            {(() => {
              const prospect = draftClass.find((p) => p.id === scoutingProspectId);
              const tier = prospect ? getProspectTier(prospect.overall) : 'mid';
              const cost = calculateScoutingCost(tier, currentPeriod);

              return (
                <>
                  {prospect && (
                    <div className="bg-secondary rounded-lg p-3 mb-4">
                      <div className="font-medium">
                        {prospect.firstName} {prospect.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {prospect.position} · {prospect.college}
                      </div>
                      <div className="text-sm text-green-400 mt-1">Cost: {cost} points</div>
                    </div>
                  )}

                  <ScoutSelector
                    scouts={allScouts}
                    selectedScoutId={selectedScoutId}
                    onSelect={setSelectedScoutId}
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setScoutingProspectId(null)}
                      className="flex-1 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmScout}
                      disabled={!selectedScoutId || cost > pointsRemaining}
                      className={cn(
                        'flex-1 py-2 rounded-lg font-medium',
                        selectedScoutId && cost <= pointsRemaining
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                      )}
                    >
                      Scout
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
