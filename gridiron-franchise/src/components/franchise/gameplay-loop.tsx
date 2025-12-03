'use client';

import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SeasonState } from '@/lib/season/types';
import { LEAGUE_TEAMS, TeamInfo } from '@/lib/data/teams';
import { PlayoffBracket } from './playoff-bracket';
import {
  RosterView,
  ScheduleView,
  StandingsView,
  StatsView,
  ScoutingLoop,
  TrainingLoop,
} from '@/components/modules';
import { getPlayerTeamId } from '@/lib/gm';
import { getFullGameData } from '@/lib/dev-player-store';
import { initializeTeamTraining, getTeamTrainingState } from '@/lib/training';
import { Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Users,
  ClipboardList,
  Dumbbell,
  Calendar,
  ListOrdered,
  BarChart3,
  Trophy,
  Play,
  FastForward,
  SkipForward,
  Loader2,
  Lock,
} from 'lucide-react';

// Note: Calendar, ListOrdered, BarChart3 still used for section tab icons

// ============================================================================
// TYPES
// ============================================================================

type GameplaySection =
  | 'scouting'
  | 'roster'
  | 'training'
  | 'gameprep'
  | 'schedule'
  | 'standings'
  | 'stats'
  | 'playoffs';

interface GameplaySectionConfig {
  id: GameplaySection;
  label: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
  category: 'gameplay' | 'season';
}

interface Team {
  id: string;
  abbrev: string;
  name: string;
  city: string;
}

// ============================================================================
// GAMEPLAY LOOP COMPONENT
// ============================================================================

interface GameplayLoopProps {
  seasonState: SeasonState | null;
  isSimulating?: boolean;
  onSimulateWeek?: () => void;
  onSimulateSeason?: () => void;
  onSimulatePlayoffs?: () => void;
  onReset?: () => void;
}

export function GameplayLoop({
  seasonState,
  isSimulating = false,
  onSimulateWeek,
  onSimulateSeason,
  onSimulatePlayoffs,
  onReset,
}: GameplayLoopProps) {
  const [activeSection, setActiveSection] = useState<GameplaySection>('schedule');

  // Player team state
  const [playerTeamId, setPlayerTeamId] = useState<string | null>(null);
  const [playerTeamName, setPlayerTeamName] = useState<string>('');
  const [playerRoster, setPlayerRoster] = useState<Player[]>([]);
  const [trainingInitialized, setTrainingInitialized] = useState(false);

  // Initialize player team data
  useEffect(() => {
    const teamId = getPlayerTeamId();
    if (!teamId) return;

    setPlayerTeamId(teamId);

    // Get player's roster from stored game data
    const gameData = getFullGameData();
    if (gameData) {
      const teamData = gameData.teams.find(t => t.team.id === teamId);
      if (teamData) {
        setPlayerTeamName(`${teamData.team.city} ${teamData.team.name}`);
        setPlayerRoster(teamData.roster.players);

        // Initialize training if not already done
        if (!getTeamTrainingState(teamId)) {
          initializeTeamTraining(teamId, teamData.roster.players, seasonState?.year || 1, seasonState?.week || 1);
        }
        setTrainingInitialized(true);
      }
    }
  }, [seasonState?.year, seasonState?.week]);

  // Build teams map from LEAGUE_TEAMS
  const teamsMap = useMemo(() => {
    const map = new Map<string, Team>();
    LEAGUE_TEAMS.forEach((team: TeamInfo) => {
      map.set(team.id, {
        id: team.id,
        abbrev: team.id,
        name: team.name,
        city: team.city,
      });
    });
    return map;
  }, []);

  // Season phase checks
  const isRegularSeason = seasonState?.phase === 'regular';
  const isPlayoffs = seasonState?.phase === 'playoffs';
  const isComplete = seasonState?.phase === 'offseason';

  // Get summary stats
  const gamesPlayed = seasonState?.completedGames.length || 0;
  const totalPoints = seasonState?.completedGames.reduce(
    (sum, g) => sum + g.awayScore + g.homeScore,
    0
  ) || 0;

  const sections: GameplaySectionConfig[] = [
    // Season sections
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="w-4 h-4" />,
      description: 'View weekly schedule and results',
      available: true,
      category: 'season',
    },
    {
      id: 'standings',
      label: 'Standings',
      icon: <ListOrdered className="w-4 h-4" />,
      description: 'League standings by division',
      available: true,
      category: 'season',
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Team and player statistics',
      available: true,
      category: 'season',
    },
    {
      id: 'playoffs',
      label: 'Playoffs',
      icon: <Trophy className="w-4 h-4" />,
      description: 'Playoff bracket and results',
      available: true,
      category: 'season',
    },
    // Gameplay sections
    {
      id: 'scouting',
      label: 'Scouting',
      icon: <Search className="w-4 h-4" />,
      description: 'Assign scouts, spend points, generate reports',
      available: true,
      category: 'gameplay',
    },
    {
      id: 'roster',
      label: 'Roster',
      icon: <Users className="w-4 h-4" />,
      description: 'View and manage your team roster',
      available: !!playerTeamId && playerRoster.length > 0,
      category: 'gameplay',
    },
    {
      id: 'training',
      label: 'Training',
      icon: <Dumbbell className="w-4 h-4" />,
      description: 'Practice allocation, player development',
      available: trainingInitialized && !!playerTeamId,
      category: 'gameplay',
    },
    {
      id: 'gameprep',
      label: 'Game Prep',
      icon: <ClipboardList className="w-4 h-4" />,
      description: 'Scheme adjustments, game planning',
      available: false,
      category: 'gameplay',
    },
  ];

  const seasonSections = sections.filter(s => s.category === 'season');
  const gameplaySections = sections.filter(s => s.category === 'gameplay');

  return (
    <div className="space-y-4">
      {/* Season Header */}
      <Card className={cn(
        'border transition-colors',
        isComplete ? 'border-yellow-500/50 bg-yellow-500/5' :
        isPlayoffs ? 'border-purple-500/50 bg-purple-500/5' :
        'border-blue-500/50 bg-blue-500/5'
      )}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Season Info */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{seasonState?.year || 2025} Season</h2>
                <span
                  className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full uppercase',
                    isComplete
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : isPlayoffs
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-blue-500/20 text-blue-400'
                  )}
                >
                  {isComplete ? 'Complete' : isPlayoffs ? 'Playoffs' : `Week ${seasonState?.week || 1}`}
                </span>
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                {gamesPlayed} games played · {totalPoints.toLocaleString()} total points
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2">
              {!isComplete && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onSimulateWeek}
                    disabled={isSimulating || !onSimulateWeek}
                  >
                    {isSimulating ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="mr-1 h-4 w-4" />
                    )}
                    Sim Week
                  </Button>

                  {isRegularSeason && onSimulateSeason && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onSimulateSeason}
                      disabled={isSimulating}
                    >
                      <FastForward className="mr-1 h-4 w-4" />
                      Sim to Playoffs
                    </Button>
                  )}

                  {isPlayoffs && onSimulatePlayoffs && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onSimulatePlayoffs}
                      disabled={isSimulating}
                    >
                      <SkipForward className="mr-1 h-4 w-4" />
                      Sim Playoffs
                    </Button>
                  )}
                </>
              )}

              {isComplete && onReset && (
                <Button size="sm" variant="outline" onClick={onReset}>
                  Start New Season
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{seasonState?.week || 1}</div>
          <div className="text-xs text-zinc-400">
            {isPlayoffs ? 'Playoff Week' : 'Week'}
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">{gamesPlayed}</div>
          <div className="text-xs text-zinc-400">Games</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">
            {gamesPlayed > 0 ? (totalPoints / gamesPlayed).toFixed(1) : '0'}
          </div>
          <div className="text-xs text-zinc-400">Avg Total</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold">
            {seasonState?.injuries?.length || 0}
          </div>
          <div className="text-xs text-zinc-400">Injuries</div>
        </div>
      </div>

      {/* Section Tabs - Season */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Season</div>
        <div className="flex gap-2 flex-wrap">
          {seasonSections.map((section) => (
            <button
              key={section.id}
              onClick={() => section.available && setActiveSection(section.id)}
              disabled={!section.available}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : section.available
                  ? 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  : 'bg-secondary/30 text-muted-foreground/50 cursor-not-allowed'
              )}
            >
              {section.available ? section.icon : <Lock className="w-4 h-4" />}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Tabs - Gameplay */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Gameplay</div>
        <div className="flex gap-2 flex-wrap">
          {gameplaySections.map((section) => (
            <button
              key={section.id}
              onClick={() => section.available && setActiveSection(section.id)}
              disabled={!section.available}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : section.available
                  ? 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  : 'bg-secondary/30 text-muted-foreground/50 cursor-not-allowed'
              )}
            >
              {section.available ? section.icon : <Lock className="w-4 h-4" />}
              {section.label}
              {!section.available && (
                <span className="text-[10px] uppercase tracking-wide">Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-zinc-800" />

      {/* Section Content */}
      <div className="min-h-[400px]">
        {/* Schedule Section */}
        {activeSection === 'schedule' && (
          <ScheduleView
            mode="embedded"
            seasonState={seasonState || undefined}
            teamsMap={teamsMap}
          />
        )}

        {/* Standings Section */}
        {activeSection === 'standings' && (
          <StandingsView
            mode="embedded"
            standings={seasonState?.standings}
          />
        )}

        {/* Stats Section */}
        {activeSection === 'stats' && (
          <StatsView
            mode="embedded"
            games={seasonState?.completedGames}
            standings={seasonState?.standings}
          />
        )}

        {/* Playoffs Section */}
        {activeSection === 'playoffs' && (
          seasonState?.playoffBracket ? (
            <PlayoffBracket bracket={seasonState.playoffBracket} teams={teamsMap} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
                <p className="text-zinc-400">Playoff bracket will appear after regular season</p>
              </CardContent>
            </Card>
          )
        )}

        {/* Scouting Section */}
        {activeSection === 'scouting' && (
          <ScoutingLoop
            mode="embedded"
            teamId={playerTeamId || undefined}
          />
        )}

        {/* Roster Section */}
        {activeSection === 'roster' && (
          <RosterView
            mode="embedded"
            teamId={playerTeamId || undefined}
            teamName={playerTeamName || undefined}
            roster={playerRoster.length > 0 ? playerRoster : undefined}
          />
        )}

        {/* Training Section */}
        {activeSection === 'training' && (
          <TrainingLoop
            mode="embedded"
            teamId={playerTeamId || undefined}
            roster={playerRoster.length > 0 ? playerRoster : undefined}
            week={seasonState?.week}
            season={seasonState?.year}
          />
        )}

        {/* Game Prep Section (Placeholder) */}
        {activeSection === 'gameprep' && (
          <div className="bg-secondary/50 border border-dashed border-border rounded-xl p-8 text-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Game Preparation</h3>
            <p className="text-sm text-muted-foreground">
              Study opponents, adjust schemes, and prepare for upcoming matchups.
            </p>
            <div className="mt-4 text-xs text-muted-foreground/50">Coming Soon</div>
          </div>
        )}
      </div>
    </div>
  );
}
