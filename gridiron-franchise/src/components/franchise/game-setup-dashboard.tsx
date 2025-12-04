'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleCard, ModuleStatus } from './module-card';
import { ReadyIndicator, ReadyCheck } from './ready-indicator';
import { TeamSelectionModal } from './team-selection-modal';
import { GMCreationModal } from './gm-creation-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  Loader2,
  RefreshCw,
  Trash2,
  UserCog,
  Search,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Store getters
import { getFullGameData, FullGameData, TeamRosterData, getFreeAgents, getDraftClass } from '@/lib/dev-player-store';
import { getCoaching } from '@/lib/coaching/coaching-store';
import { getFacilities } from '@/lib/facilities/facilities-store';
import { getSchedule } from '@/lib/schedule/schedule-store';
import { getGMs, storeGMs, clearGMs, getOwnerModeGMs, LeagueGMs, OwnerModeGMs, GMBackground, GMArchetype } from '@/lib/gm';
import { getScouting, storeScouting, clearScouting } from '@/lib/scouting/scouting-store';
import { LeagueScouting } from '@/lib/scouting/types';
import { Player } from '@/lib/types';

// Store setters and clearers
import { storeFullGameData, storeDevPlayers, clearFullGameData, clearDevPlayers, storeFreeAgents, storeDraftClass, clearFreeAgents, clearDraftClass } from '@/lib/dev-player-store';
import { storeCoaching, clearCoaching } from '@/lib/coaching/coaching-store';
import { storeFacilities, clearFacilities } from '@/lib/facilities/facilities-store';
import { storeSchedule, clearSchedule } from '@/lib/schedule/schedule-store';
import { Tier } from '@/lib/types';

interface ModuleData {
  rosters: FullGameData | null;
  freeAgents: Player[];
  draftClass: Player[];
  gm: LeagueGMs | OwnerModeGMs | null;
  coaching: ReturnType<typeof getCoaching>;
  facilities: ReturnType<typeof getFacilities>;
  scouting: LeagueScouting | null;
  schedule: ReturnType<typeof getSchedule>;
}

interface GameSetupDashboardProps {
  onStartSeason?: () => void;
}

export function GameSetupDashboard({ onStartSeason }: GameSetupDashboardProps) {
  const router = useRouter();
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generatingModules, setGeneratingModules] = useState<Record<string, boolean>>({});
  const [modules, setModules] = useState<ModuleData>({
    rosters: null,
    freeAgents: [],
    draftClass: [],
    gm: null,
    coaching: null,
    facilities: null,
    scouting: null,
    schedule: null,
  });

  // GM selection modal state
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [showGMCreation, setShowGMCreation] = useState(false);
  const [selectedTeamForGM, setSelectedTeamForGM] = useState<{
    id: string;
    name: string;
    city: string;
  } | null>(null);

  // Load existing data on mount
  useEffect(() => {
    loadModuleStatus();
  }, []);

  const loadModuleStatus = () => {
    setModules({
      rosters: getFullGameData(),
      freeAgents: getFreeAgents(),
      draftClass: getDraftClass(),
      gm: getOwnerModeGMs() || getGMs(), // Check Owner mode first, then legacy
      coaching: getCoaching(),
      facilities: getFacilities(),
      scouting: getScouting(),
      schedule: getSchedule(),
    });
  };

  // Get team tiers from rosters (reads directly from storage, not state)
  const getTeamTiers = (): Map<string, Tier> => {
    const teamTiers = new Map<string, Tier>();
    const rosters = getFullGameData(); // Read from storage, not state
    if (rosters) {
      for (const teamData of rosters.teams) {
        teamTiers.set(teamData.team.id, teamData.tier);
      }
    }
    return teamTiers;
  };

  // Generate team rosters only (calls /api/dev/generate-rosters)
  const generateTeamRosters = async () => {
    setGeneratingModules((prev) => ({ ...prev, rosters: true }));
    try {
      const response = await fetch('/api/dev/generate-rosters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        // Store the team rosters data
        const fullGameData: FullGameData = {
          teams: data.teams,
          generatedAt: data.generatedAt,
          totalPlayers: data.stats.totalPlayers,
          tierDistribution: data.stats.tierDistribution,
        };
        storeFullGameData(fullGameData);

        // Store roster players for profile viewing
        const rosterPlayers = data.teams.flatMap((t: TeamRosterData) => t.roster.players);
        storeDevPlayers(rosterPlayers);

        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate team rosters:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, rosters: false }));
  };

  // Generate free agents only (calls /api/dev/generate-fa)
  const generateFreeAgentsData = async () => {
    setGeneratingModules((prev) => ({ ...prev, freeagents: true }));
    try {
      const response = await fetch('/api/dev/generate-fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        storeFreeAgents(data.players);
        // Add FA players to dev players for profile viewing
        const existingPlayers = modules.rosters?.teams.flatMap((t) => t.roster.players) || [];
        storeDevPlayers([...existingPlayers, ...data.players, ...modules.draftClass]);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate free agents:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, freeagents: false }));
  };

  // Generate draft class only (calls /api/dev/generate-draft)
  const generateDraftClassData = async () => {
    setGeneratingModules((prev) => ({ ...prev, draft: true }));
    try {
      const response = await fetch('/api/dev/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        storeDraftClass(data.players);
        // Add draft players to dev players for profile viewing
        const existingPlayers = modules.rosters?.teams.flatMap((t) => t.roster.players) || [];
        storeDevPlayers([...existingPlayers, ...modules.freeAgents, ...data.players]);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate draft class:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, draft: false }));
  };

  // Generate coaching staff via API
  const generateCoachingStaff = async () => {
    setGeneratingModules((prev) => ({ ...prev, coaching: true }));
    try {
      const teamTiers = getTeamTiers();
      if (teamTiers.size === 0) {
        console.warn('No rosters found - generate rosters first');
        setGeneratingModules((prev) => ({ ...prev, coaching: false }));
        return;
      }
      // Convert Map to object for API
      const tierObj: Record<string, Tier> = {};
      teamTiers.forEach((tier, teamId) => {
        tierObj[teamId] = tier;
      });

      const response = await fetch('/api/dev/generate-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers: tierObj }),
      });
      const data = await response.json();
      if (data.success) {
        storeCoaching(data.coaching);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate coaching:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, coaching: false }));
  };

  // Generate facilities via API
  const generateFacilitiesData = async () => {
    setGeneratingModules((prev) => ({ ...prev, facilities: true }));
    try {
      const teamTiers = getTeamTiers();
      if (teamTiers.size === 0) {
        console.warn('No rosters found - generate rosters first');
        setGeneratingModules((prev) => ({ ...prev, facilities: false }));
        return;
      }
      // Convert Map to object for API
      const tierObj: Record<string, Tier> = {};
      teamTiers.forEach((tier, teamId) => {
        tierObj[teamId] = tier;
      });

      const response = await fetch('/api/dev/generate-facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers: tierObj }),
      });
      const data = await response.json();
      if (data.success) {
        storeFacilities(data.facilities);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate facilities:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, facilities: false }));
  };

  // Generate scouting via API
  const generateScoutingData = async () => {
    setGeneratingModules((prev) => ({ ...prev, scouting: true }));
    try {
      const teamTiers = getTeamTiers();
      if (teamTiers.size === 0) {
        console.warn('No rosters found - generate rosters first');
        setGeneratingModules((prev) => ({ ...prev, scouting: false }));
        return;
      }
      // Convert Map to object for API
      const tierObj: Record<string, Tier> = {};
      teamTiers.forEach((tier, teamId) => {
        tierObj[teamId] = tier;
      });

      const response = await fetch('/api/dev/generate-scouting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamTiers: tierObj }),
      });
      const data = await response.json();
      if (data.success) {
        storeScouting(data.scouting);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate scouting:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, scouting: false }));
  };

  // Generate schedule via API
  const generateScheduleData = async () => {
    setGeneratingModules((prev) => ({ ...prev, schedule: true }));
    try {
      const response = await fetch('/api/dev/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season: new Date().getFullYear(),
          randomizeStandings: true,
        }),
      });
      const data = await response.json();
      if (data.success) {
        storeSchedule(data.schedule);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, schedule: false }));
  };

  // Generate all modules in sequence
  const generateAll = async () => {
    setIsGeneratingAll(true);

    // 1. Generate rosters, FA, and draft (can be parallel)
    await Promise.all([generateTeamRosters(), generateFreeAgentsData(), generateDraftClassData()]);

    // Wait for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 2. Generate coaching, facilities, and scouting (can be parallel, need rosters for tiers)
    await Promise.all([generateCoachingStaff(), generateFacilitiesData(), generateScoutingData()]);

    // 3. Generate schedule
    await generateScheduleData();

    setIsGeneratingAll(false);
  };

  // Clear all data
  const clearAll = () => {
    clearFullGameData();
    clearDevPlayers();
    clearFreeAgents();
    clearDraftClass();
    clearGMs();
    clearCoaching();
    clearFacilities();
    clearScouting();
    clearSchedule();
    loadModuleStatus();
  };

  // Clear individual modules
  const handleModuleClear = (moduleId: string) => {
    switch (moduleId) {
      case 'rosters':
        clearFullGameData();
        // Also clear dependent modules that need tier data
        clearGMs();
        clearCoaching();
        clearFacilities();
        clearScouting();
        // Rebuild dev players from remaining FA/Draft
        storeDevPlayers([...modules.freeAgents, ...modules.draftClass]);
        break;
      case 'freeagents':
        clearFreeAgents();
        // Rebuild dev players without FA
        const playersWithoutFA = [
          ...(modules.rosters?.teams.flatMap((t) => t.roster.players) || []),
          ...modules.draftClass,
        ];
        storeDevPlayers(playersWithoutFA);
        break;
      case 'draft':
        clearDraftClass();
        // Rebuild dev players without Draft
        const playersWithoutDraft = [
          ...(modules.rosters?.teams.flatMap((t) => t.roster.players) || []),
          ...modules.freeAgents,
        ];
        storeDevPlayers(playersWithoutDraft);
        break;
      case 'gm':
        clearGMs();
        break;
      case 'coaching':
        clearCoaching();
        break;
      case 'facilities':
        clearFacilities();
        break;
      case 'scouting':
        clearScouting();
        break;
      case 'schedule':
        clearSchedule();
        break;
    }
    loadModuleStatus();
  };

  // Build module status list
  const moduleStatuses: ModuleStatus[] = [
    {
      id: 'rosters',
      name: 'Team Rosters',
      description: '32 teams, 53-man rosters',
      icon: <Users className="h-5 w-5" />,
      isGenerated: !!modules.rosters,
      count: modules.rosters?.teams.length || 0,
      countLabel: 'teams',
    },
    {
      id: 'freeagents',
      name: 'Free Agents',
      description: 'Available veteran players',
      icon: <UserPlus className="h-5 w-5" />,
      isGenerated: modules.freeAgents.length > 0,
      count: modules.freeAgents.length,
      countLabel: 'players',
    },
    {
      id: 'draft',
      name: 'Draft Class',
      description: 'Draft prospects',
      icon: <GraduationCap className="h-5 w-5" />,
      isGenerated: modules.draftClass.length > 0,
      count: modules.draftClass.length,
      countLabel: 'prospects',
    },
    {
      id: 'gm',
      name: 'General Manager',
      description: 'Your GM + 31 CPU GMs',
      icon: <UserCog className="h-5 w-5" />,
      isGenerated: !!modules.gm,
      count: modules.gm ? 32 : 0,
      countLabel: 'GMs',
    },
    {
      id: 'coaching',
      name: 'Coaching Staff',
      description: 'HC, OC, DC with perks',
      icon: <Briefcase className="h-5 w-5" />,
      isGenerated: !!modules.coaching,
      count: modules.coaching ? Object.keys(modules.coaching.teams).length : 0,
      countLabel: 'staffs',
    },
    {
      id: 'facilities',
      name: 'Facilities',
      description: 'Stadium, training, medical',
      icon: <Building2 className="h-5 w-5" />,
      isGenerated: !!modules.facilities,
      count: modules.facilities ? Object.keys(modules.facilities.teams).length : 0,
      countLabel: 'teams',
    },
    {
      id: 'scouting',
      name: 'Scouting Dept',
      description: 'Scouts, scouting points, assignments',
      icon: <Search className="h-5 w-5" />,
      isGenerated: !!modules.scouting,
      count: modules.scouting ? Object.keys(modules.scouting.teams).length : 0,
      countLabel: 'teams',
    },
    {
      id: 'schedule',
      name: 'Season Schedule',
      description: '18-week regular season',
      icon: <Calendar className="h-5 w-5" />,
      isGenerated: !!modules.schedule,
      count: modules.schedule ? modules.schedule.weeks.reduce((sum, week) => sum + week.games.length, 0) : 0,
      countLabel: 'games',
    },
    {
      id: 'player',
      name: 'Single Player',
      description: 'Test player generation',
      icon: <User className="h-5 w-5" />,
      isGenerated: true, // Always "ready" - it's a utility tool
      count: 0,
      countLabel: '',
    },
  ];

  // Build ready checks for ReadyIndicator
  const readyChecks: ReadyCheck[] = [
    { id: 'rosters', label: 'Rosters', isReady: !!modules.rosters, required: true },
    { id: 'freeagents', label: 'Free Agents', isReady: modules.freeAgents.length > 0, required: true },
    { id: 'draft', label: 'Draft Class', isReady: modules.draftClass.length > 0, required: true },
    { id: 'gm', label: 'General Manager', isReady: !!modules.gm, required: true },
    { id: 'coaching', label: 'Coaching', isReady: !!modules.coaching, required: true },
    { id: 'facilities', label: 'Facilities', isReady: !!modules.facilities, required: true },
    { id: 'scouting', label: 'Scouting', isReady: !!modules.scouting, required: true },
    { id: 'schedule', label: 'Schedule', isReady: !!modules.schedule, required: true },
  ];

  const handleModuleGenerate = (moduleId: string) => {
    switch (moduleId) {
      case 'rosters':
        generateTeamRosters();
        break;
      case 'freeagents':
        generateFreeAgentsData();
        break;
      case 'draft':
        generateDraftClassData();
        break;
      case 'gm':
        // Open team selection modal to start GM creation flow
        setShowTeamSelection(true);
        break;
      case 'coaching':
        generateCoachingStaff();
        break;
      case 'facilities':
        generateFacilitiesData();
        break;
      case 'scouting':
        generateScoutingData();
        break;
      case 'schedule':
        generateScheduleData();
        break;
      case 'player':
        // Navigate to player generator page
        router.push('/dashboard/dev-tools/player');
        break;
    }
  };

  const handleModuleView = (moduleId: string) => {
    switch (moduleId) {
      case 'rosters':
        router.push('/dashboard/dev-tools/roster-view');
        break;
      case 'freeagents':
        router.push('/dashboard/dev-tools/fa');
        break;
      case 'draft':
        router.push('/dashboard/dev-tools/draft');
        break;
      case 'gm':
        // TODO: Add GM view page when available
        break;
      case 'coaching':
        router.push('/dashboard/dev-tools/coaching');
        break;
      case 'facilities':
        router.push('/dashboard/dev-tools/facilities');
        break;
      case 'scouting':
        router.push('/dashboard/dev-tools/scouting');
        break;
      case 'schedule':
        router.push('/dashboard/dev-tools/schedule');
        break;
      case 'player':
        router.push('/dashboard/dev-tools/player');
        break;
    }
  };

  // GM Selection Flow Handlers
  const handleTeamSelect = (teamId: string) => {
    const team = modules.rosters?.teams.find((t) => t.team.id === teamId);
    if (team) {
      setSelectedTeamForGM({
        id: team.team.id,
        name: team.team.name,
        city: team.team.city,
      });
      setShowTeamSelection(false);
      setShowGMCreation(true);
    }
  };

  const handleGMComplete = async (background: GMBackground, archetype: GMArchetype) => {
    if (!selectedTeamForGM || !modules.rosters) return;

    setGeneratingModules((prev) => ({ ...prev, gm: true }));
    setShowGMCreation(false);

    try {
      const teamTiers = getTeamTiers();
      const tierObj: Record<string, Tier> = {};
      teamTiers.forEach((tier, teamId) => {
        tierObj[teamId] = tier;
      });

      const response = await fetch('/api/dev/generate-gm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerTeamId: selectedTeamForGM.id,
          playerBackground: background,
          playerArchetype: archetype,
          teamTiers: tierObj,
        }),
      });

      const data = await response.json();
      if (data.success) {
        storeGMs(data.gms);
        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate GMs:', error);
    }

    setGeneratingModules((prev) => ({ ...prev, gm: false }));
    setSelectedTeamForGM(null);
  };

  const isAnyGenerating = isGeneratingAll || Object.values(generatingModules).some(Boolean);
  const allReady = readyChecks.every((c) => c.isReady);
  const anyGenerated = readyChecks.some((c) => c.isReady);

  const handleStartSeason = () => {
    if (onStartSeason) {
      onStartSeason();
    } else {
      // Default: navigate to season simulation
      router.push('/dashboard/dev-tools/season');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Generate All / Clear All */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Game Setup</h2>
          <p className="text-sm text-zinc-400">Generate all required data before starting a season</p>
        </div>
        <div className="flex items-center gap-2">
          {anyGenerated && (
            <Button
              variant="outline"
              onClick={clearAll}
              disabled={isAnyGenerating}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
          <Button
            onClick={generateAll}
            disabled={isAnyGenerating}
            className={cn(
              'min-w-[140px]',
              allReady ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : allReady ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate All
              </>
            ) : (
              'Generate All'
            )}
          </Button>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleStatuses.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isGenerating={generatingModules[module.id] || false}
            onGenerate={() => handleModuleGenerate(module.id)}
            onClear={() => handleModuleClear(module.id)}
            onView={() => handleModuleView(module.id)}
            disabled={
              isAnyGenerating ||
              // Disable gm/coaching/facilities/scouting if no rosters
              (['gm', 'coaching', 'facilities', 'scouting'].includes(module.id) && !modules.rosters)
            }
          />
        ))}
      </div>

      {/* Stats Summary */}
      {modules.rosters && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{modules.rosters.teams.length}</div>
                <div className="text-xs text-zinc-400">Teams</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{modules.rosters.totalPlayers}</div>
                <div className="text-xs text-zinc-400">Total Players</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {modules.schedule
                    ? modules.schedule.weeks.reduce((sum, week) => sum + week.games.length, 0)
                    : 0}
                </div>
                <div className="text-xs text-zinc-400">Games</div>
              </div>
              <div>
                <div className="text-2xl font-bold">18</div>
                <div className="text-xs text-zinc-400">Weeks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready Indicator */}
      <ReadyIndicator
        checks={readyChecks}
        onStartSeason={handleStartSeason}
        disabled={isAnyGenerating}
      />

      {/* GM Selection Modals */}
      <TeamSelectionModal
        open={showTeamSelection}
        onOpenChange={setShowTeamSelection}
        teams={modules.rosters?.teams || []}
        onSelectTeam={handleTeamSelect}
      />

      <GMCreationModal
        open={showGMCreation}
        onOpenChange={setShowGMCreation}
        selectedTeam={selectedTeamForGM}
        onComplete={handleGMComplete}
      />
    </div>
  );
}
