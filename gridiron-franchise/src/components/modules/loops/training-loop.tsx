'use client';

import { useState, useMemo, useEffect } from 'react';
import { Player, Position } from '@/lib/types';
import {
  TrainingProgress,
  PracticeFocusType,
  PracticeIntensity,
} from '@/lib/training/types';
import {
  getTeamTrainingState,
  getPlayersSortedByXP,
  getTeamTotalXP,
  getTeamAverageXP,
  setPracticeFocus,
  getPracticeFocus,
  initializeTeamTraining,
} from '@/lib/training';
import { getPlayerTeamId } from '@/lib/gm';
import { getFullGameData } from '@/lib/dev-player-store';
import { PlayerDevelopmentCard } from '@/components/training/player-development-card';
import { PracticeFocusSelector } from '@/components/training/practice-focus-selector';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type SortOption = 'xp' | 'overall' | 'potential' | 'age';
type FilterPosition = 'all' | 'offense' | 'defense' | 'special';

const OFFENSE_POSITIONS = [
  Position.QB,
  Position.RB,
  Position.WR,
  Position.TE,
  Position.LT,
  Position.LG,
  Position.C,
  Position.RG,
  Position.RT,
];
const DEFENSE_POSITIONS = [
  Position.DE,
  Position.DT,
  Position.MLB,
  Position.OLB,
  Position.CB,
  Position.FS,
  Position.SS,
];
const SPECIAL_POSITIONS = [Position.K, Position.P];

// ============================================================================
// PROPS
// ============================================================================

interface TrainingLoopProps {
  // Mode controls layout
  mode: 'standalone' | 'embedded';

  // Data - can be provided or loaded internally
  teamId?: string;
  roster?: Player[];
  week?: number;
  season?: number;

  // Embedded mode options
  maxHeight?: string;

  // Callbacks
  onPracticeFocusChange?: (focus: PracticeFocusType, intensity: PracticeIntensity) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function TrainingLoop({
  mode,
  teamId: providedTeamId,
  roster: providedRoster,
  week: providedWeek,
  season: providedSeason,
  maxHeight = mode === 'embedded' ? '500px' : undefined,
  onPracticeFocusChange,
}: TrainingLoopProps) {
  const [sortBy, setSortBy] = useState<SortOption>('xp');
  const [filterPosition, setFilterPosition] = useState<FilterPosition>('all');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data if not provided
  const { teamId, roster, week, season } = useMemo(() => {
    // Use provided values if available
    if (providedTeamId && providedRoster && providedWeek !== undefined && providedSeason !== undefined) {
      return {
        teamId: providedTeamId,
        roster: providedRoster,
        week: providedWeek,
        season: providedSeason,
      };
    }

    // Otherwise load from storage
    const playerTeamId = getPlayerTeamId();
    const gameData = getFullGameData();

    if (!playerTeamId || !gameData) {
      return { teamId: null, roster: [], week: 1, season: 1 };
    }

    const teamData = gameData.teams.find((t) => t.team.id === playerTeamId);
    return {
      teamId: playerTeamId,
      roster: teamData?.roster.players || [],
      week: 1, // Default - should be passed via props
      season: 1,
    };
  }, [providedTeamId, providedRoster, providedWeek, providedSeason]);

  // Initialize training when component mounts
  useEffect(() => {
    if (teamId && roster.length > 0 && !isInitialized) {
      const existingState = getTeamTrainingState(teamId);
      if (!existingState) {
        initializeTeamTraining(teamId, roster);
      }
      setIsInitialized(true);
    }
  }, [teamId, roster, isInitialized]);

  // Get training state
  const teamState = teamId ? getTeamTrainingState(teamId) : null;
  const practiceFocus = teamId ? getPracticeFocus(teamId) : null;
  const [currentFocus, setCurrentFocus] = useState<PracticeFocusType>(
    practiceFocus?.focus || 'conditioning'
  );
  const [currentIntensity, setCurrentIntensity] = useState<PracticeIntensity>(
    practiceFocus?.intensity || 'normal'
  );

  // Calculate team stats
  const totalXP = teamId ? getTeamTotalXP(teamId) : 0;
  const averageXP = teamId ? getTeamAverageXP(teamId) : 0;

  // Get player progress map
  const playerProgressMap = useMemo(() => {
    const map: Record<string, TrainingProgress | null> = {};
    for (const player of roster) {
      map[player.id] = teamState?.playerProgress[player.id] || null;
    }
    return map;
  }, [roster, teamState]);

  // Filter and sort roster
  const filteredRoster = useMemo(() => {
    let filtered = [...roster];

    // Filter by position group
    if (filterPosition !== 'all') {
      const positions =
        filterPosition === 'offense'
          ? OFFENSE_POSITIONS
          : filterPosition === 'defense'
          ? DEFENSE_POSITIONS
          : SPECIAL_POSITIONS;
      filtered = filtered.filter((p) => positions.includes(p.position));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'xp':
          const aXP = playerProgressMap[a.id]?.currentXP || 0;
          const bXP = playerProgressMap[b.id]?.currentXP || 0;
          return bXP - aXP;
        case 'overall':
          return b.overall - a.overall;
        case 'potential':
          return b.potential - a.potential;
        case 'age':
          return a.age - b.age;
        default:
          return 0;
      }
    });

    return filtered;
  }, [roster, filterPosition, sortBy, playerProgressMap]);

  // Handle focus change
  const handleFocusChange = (focus: PracticeFocusType) => {
    if (!teamId) return;
    setCurrentFocus(focus);
    setPracticeFocus(teamId, focus, currentIntensity);
    onPracticeFocusChange?.(focus, currentIntensity);
  };

  const handleIntensityChange = (intensity: PracticeIntensity) => {
    if (!teamId) return;
    setCurrentIntensity(intensity);
    setPracticeFocus(teamId, currentFocus, intensity);
    onPracticeFocusChange?.(currentFocus, intensity);
  };

  // Empty state
  if (!teamId || roster.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Dumbbell className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">
            {mode === 'standalone'
              ? 'Select a team from the Full Game page first'
              : 'No team selected'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header - Standalone only */}
      {mode === 'standalone' && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Training Center</h3>
            <p className="text-sm text-zinc-400">Week {week} · Season {season}</p>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Week</div>
          <div className="text-xl font-bold">{week}</div>
        </div>
        <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Season</div>
          <div className="text-xl font-bold">{season}</div>
        </div>
        <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Team XP</div>
          <div className="text-xl font-bold text-primary">{totalXP.toLocaleString()}</div>
        </div>
        <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Avg XP</div>
          <div className="text-xl font-bold">{averageXP}</div>
        </div>
      </div>

      {/* Content Container */}
      <div
        className="space-y-4"
        style={{ maxHeight: maxHeight, overflowY: maxHeight ? 'auto' : undefined }}
      >
        {/* Tabs */}
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="practice">Practice Focus</TabsTrigger>
            <TabsTrigger value="roster">Player Development</TabsTrigger>
          </TabsList>

          {/* Practice Focus Tab */}
          <TabsContent value="practice" className="space-y-4">
            <PracticeFocusSelector
              currentFocus={currentFocus}
              currentIntensity={currentIntensity}
              onFocusChange={handleFocusChange}
              onIntensityChange={handleIntensityChange}
            />
          </TabsContent>

          {/* Roster Tab */}
          <TabsContent value="roster" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {(['all', 'offense', 'defense', 'special'] as FilterPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setFilterPosition(pos)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-medium transition-colors',
                      filterPosition === pos
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {pos.charAt(0).toUpperCase() + pos.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {(['xp', 'overall', 'potential', 'age'] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-medium transition-colors',
                      sortBy === opt
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Player List */}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRoster.map((player) => (
                <div
                  key={player.id}
                  onClick={() =>
                    setSelectedPlayerId(selectedPlayerId === player.id ? null : player.id)
                  }
                  className="cursor-pointer"
                >
                  <PlayerDevelopmentCard
                    player={player}
                    progress={playerProgressMap[player.id]}
                    compact={selectedPlayerId !== player.id}
                  />
                </div>
              ))}
            </div>

            {filteredRoster.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No players in this category
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
