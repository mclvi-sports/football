'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleCard, ModuleStatus } from './module-card';
import { ReadyIndicator, ReadyCheck } from './ready-indicator';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Store getters
import { getFullGameData, FullGameData, TeamRosterData } from '@/lib/dev-player-store';
import { getCoaching } from '@/lib/coaching/coaching-store';
import { getFacilities } from '@/lib/facilities/facilities-store';
import { getSchedule } from '@/lib/schedule/schedule-store';

// Store setters / generators
import { storeFullGameData, storeDevPlayers } from '@/lib/dev-player-store';
import { generateCoaching } from '@/lib/coaching/coaching-generator';
import { storeCoaching } from '@/lib/coaching/coaching-store';
import { generateFacilities } from '@/lib/facilities/facilities-generator';
import { storeFacilities } from '@/lib/facilities/facilities-store';
import { generateSchedule } from '@/lib/schedule/schedule-generator';
import { ScheduleGeneratorConfig } from '@/lib/schedule/types';
import { storeSchedule } from '@/lib/schedule/schedule-store';
import { Tier } from '@/lib/types';

interface ModuleData {
  rosters: FullGameData | null;
  coaching: ReturnType<typeof getCoaching>;
  facilities: ReturnType<typeof getFacilities>;
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
    coaching: null,
    facilities: null,
    schedule: null,
  });

  // Load existing data on mount
  useEffect(() => {
    loadModuleStatus();
  }, []);

  const loadModuleStatus = () => {
    setModules({
      rosters: getFullGameData(),
      coaching: getCoaching(),
      facilities: getFacilities(),
      schedule: getSchedule(),
    });
  };

  // Get team tiers from rosters
  const getTeamTiers = (): Map<string, Tier> => {
    const teamTiers = new Map<string, Tier>();
    if (modules.rosters) {
      for (const teamData of modules.rosters.teams) {
        teamTiers.set(teamData.team.id, teamData.tier);
      }
    }
    return teamTiers;
  };

  // Generate rosters (calls API)
  const generateRosters = async () => {
    setGeneratingModules((prev) => ({ ...prev, rosters: true }));
    try {
      const response = await fetch('/api/dev/generate-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        // Store the full game data
        const fullGameData: FullGameData = {
          teams: data.data.teams,
          generatedAt: data.data.generatedAt,
          totalPlayers: data.stats.totalPlayers,
          tierDistribution: data.stats.tierDistribution,
        };
        storeFullGameData(fullGameData);

        // Store all players for profile viewing
        const allPlayers = [
          ...data.data.teams.flatMap((t: TeamRosterData) => t.roster.players),
          ...data.data.freeAgents,
          ...data.data.draftClass,
        ];
        storeDevPlayers(allPlayers);

        loadModuleStatus();
      }
    } catch (error) {
      console.error('Failed to generate rosters:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, rosters: false }));
  };

  // Generate coaching staff
  const generateCoachingStaff = () => {
    setGeneratingModules((prev) => ({ ...prev, coaching: true }));
    try {
      const teamTiers = getTeamTiers();
      if (teamTiers.size === 0) {
        console.warn('No rosters found - generate rosters first');
        return;
      }
      const coachingData = generateCoaching(teamTiers);
      storeCoaching(coachingData);
      loadModuleStatus();
    } catch (error) {
      console.error('Failed to generate coaching:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, coaching: false }));
  };

  // Generate facilities
  const generateFacilitiesData = () => {
    setGeneratingModules((prev) => ({ ...prev, facilities: true }));
    try {
      const teamTiers = getTeamTiers();
      if (teamTiers.size === 0) {
        console.warn('No rosters found - generate rosters first');
        return;
      }
      const facilitiesData = generateFacilities(teamTiers);
      storeFacilities(facilitiesData);
      loadModuleStatus();
    } catch (error) {
      console.error('Failed to generate facilities:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, facilities: false }));
  };

  // Generate schedule
  const generateScheduleData = () => {
    setGeneratingModules((prev) => ({ ...prev, schedule: true }));
    try {
      // Get previous year standings from rosters if available
      // For now, use default config with randomized standings
      const config: ScheduleGeneratorConfig = {
        season: new Date().getFullYear(),
        randomizeStandings: true,
      };
      const scheduleData = generateSchedule(config);
      storeSchedule(scheduleData);
      loadModuleStatus();
    } catch (error) {
      console.error('Failed to generate schedule:', error);
    }
    setGeneratingModules((prev) => ({ ...prev, schedule: false }));
  };

  // Generate all modules in sequence
  const generateAll = async () => {
    setIsGeneratingAll(true);

    // 1. Generate rosters first (required for coaching/facilities)
    await generateRosters();

    // Wait for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 2. Generate coaching and facilities (can be parallel)
    generateCoachingStaff();
    generateFacilitiesData();

    // Wait for those to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 3. Generate schedule
    generateScheduleData();

    setIsGeneratingAll(false);
  };

  // Build module status list
  const moduleStatuses: ModuleStatus[] = [
    {
      id: 'rosters',
      name: 'Team Rosters',
      description: '32 teams, 53-man rosters, Free Agents, Draft Class',
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
      isGenerated: !!modules.rosters,
      count: modules.rosters ? 150 : 0, // Approx count
      countLabel: 'players',
    },
    {
      id: 'draft',
      name: 'Draft Class',
      description: '224 draft prospects',
      icon: <GraduationCap className="h-5 w-5" />,
      isGenerated: !!modules.rosters,
      count: 224,
      countLabel: 'prospects',
    },
    {
      id: 'coaching',
      name: 'Coaching Staff',
      description: 'HC, OC, DC with perks',
      icon: <Briefcase className="h-5 w-5" />,
      isGenerated: !!modules.coaching,
      count: modules.coaching ? 32 : 0,
      countLabel: 'staffs',
    },
    {
      id: 'facilities',
      name: 'Facilities',
      description: 'Stadium, training, medical, scouting',
      icon: <Building2 className="h-5 w-5" />,
      isGenerated: !!modules.facilities,
      count: modules.facilities ? 32 : 0,
      countLabel: 'teams',
    },
    {
      id: 'schedule',
      name: 'Season Schedule',
      description: '18-week regular season',
      icon: <Calendar className="h-5 w-5" />,
      isGenerated: !!modules.schedule,
      count: modules.schedule ? 272 : 0, // 17 games * 32 teams / 2
      countLabel: 'games',
    },
  ];

  // Build ready checks for ReadyIndicator
  const readyChecks: ReadyCheck[] = [
    { id: 'rosters', label: 'Rosters', isReady: !!modules.rosters, required: true },
    { id: 'coaching', label: 'Coaching', isReady: !!modules.coaching, required: true },
    { id: 'facilities', label: 'Facilities', isReady: !!modules.facilities, required: true },
    { id: 'schedule', label: 'Schedule', isReady: !!modules.schedule, required: true },
  ];

  const handleModuleGenerate = (moduleId: string) => {
    switch (moduleId) {
      case 'rosters':
      case 'freeagents':
      case 'draft':
        generateRosters();
        break;
      case 'coaching':
        generateCoachingStaff();
        break;
      case 'facilities':
        generateFacilitiesData();
        break;
      case 'schedule':
        generateScheduleData();
        break;
    }
  };

  const isAnyGenerating = isGeneratingAll || Object.values(generatingModules).some(Boolean);
  const allReady = readyChecks.every((c) => c.isReady);

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
      {/* Header with Generate All */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Game Setup</h2>
          <p className="text-sm text-zinc-400">Generate all required data before starting a season</p>
        </div>
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

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleStatuses.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isGenerating={generatingModules[module.id] || false}
            onGenerate={() => handleModuleGenerate(module.id)}
            disabled={
              isAnyGenerating ||
              // Disable coaching/facilities/schedule if no rosters
              (['coaching', 'facilities'].includes(module.id) && !modules.rosters)
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
    </div>
  );
}
