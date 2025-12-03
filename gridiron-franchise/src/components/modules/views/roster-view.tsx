'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Player, Position, Tier } from '@/lib/types';
import { RosterPlayerCard } from '@/components/dev-tools/roster-player-card';
import { getFullGameData, TeamRosterData } from '@/lib/dev-player-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type TabType = 'all' | 'offense' | 'defense' | 'special';
type SortOption = 'ovr' | 'position' | 'age' | 'potential';

const OFFENSE_POSITIONS = [
  Position.QB, Position.RB, Position.WR, Position.TE,
  Position.LT, Position.LG, Position.C, Position.RG, Position.RT,
];

const DEFENSE_POSITIONS = [
  Position.DE, Position.DT, Position.MLB, Position.OLB,
  Position.CB, Position.FS, Position.SS,
];

const SPECIAL_POSITIONS = [Position.K, Position.P];

// ============================================================================
// PROPS
// ============================================================================

interface RosterViewProps {
  // Mode controls layout
  mode: 'standalone' | 'embedded';

  // Data - can be provided or loaded internally
  roster?: Player[];
  teamId?: string;
  teamName?: string;

  // Standalone mode options
  showTeamSelector?: boolean;

  // Embedded mode options
  maxHeight?: string;

  // Callbacks
  onPlayerClick?: (playerId: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function RosterView({
  mode,
  roster: providedRoster,
  teamId: providedTeamId,
  teamName: providedTeamName,
  showTeamSelector = mode === 'standalone',
  maxHeight = mode === 'embedded' ? '500px' : undefined,
  onPlayerClick,
}: RosterViewProps) {
  const router = useRouter();

  // State for team selection (standalone mode)
  const [selectedTeamId, setSelectedTeamId] = useState<string>(providedTeamId || 'BOS');

  // State for filtering/sorting
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('ovr');
  const [searchQuery, setSearchQuery] = useState('');

  // Load roster data
  const { roster, teamId, teamName, tier } = useMemo(() => {
    // If roster is provided, use it
    if (providedRoster && providedTeamId) {
      return {
        roster: providedRoster,
        teamId: providedTeamId,
        teamName: providedTeamName || providedTeamId,
        tier: null,
      };
    }

    // Otherwise, load from storage
    const gameData = getFullGameData();
    if (!gameData) {
      return { roster: [], teamId: selectedTeamId, teamName: '', tier: null };
    }

    const teamData = gameData.teams.find(t => t.team.id === selectedTeamId);
    if (!teamData) {
      return { roster: [], teamId: selectedTeamId, teamName: '', tier: null };
    }

    return {
      roster: teamData.roster.players,
      teamId: teamData.team.id,
      teamName: `${teamData.team.city} ${teamData.team.name}`,
      tier: teamData.tier,
    };
  }, [providedRoster, providedTeamId, providedTeamName, selectedTeamId]);

  // Calculate stats
  const stats = useMemo(() => {
    if (roster.length === 0) {
      return { totalPlayers: 0, avgOvr: 0, avgAge: 0, avgPotential: 0 };
    }

    const totalOvr = roster.reduce((sum, p) => sum + p.overall, 0);
    const totalAge = roster.reduce((sum, p) => sum + p.age, 0);
    const totalPotential = roster.reduce((sum, p) => sum + p.potential, 0);

    return {
      totalPlayers: roster.length,
      avgOvr: Math.round(totalOvr / roster.length),
      avgAge: Math.round((totalAge / roster.length) * 10) / 10,
      avgPotential: Math.round(totalPotential / roster.length),
    };
  }, [roster]);

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    let result = [...roster];

    // Filter by tab
    if (activeTab === 'offense') {
      result = result.filter((p) => OFFENSE_POSITIONS.includes(p.position));
    } else if (activeTab === 'defense') {
      result = result.filter((p) => DEFENSE_POSITIONS.includes(p.position));
    } else if (activeTab === 'special') {
      result = result.filter((p) => SPECIAL_POSITIONS.includes(p.position));
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'ovr':
          return b.overall - a.overall;
        case 'age':
          return a.age - b.age;
        case 'potential':
          return b.potential - a.potential;
        case 'position':
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });

    return result;
  }, [roster, activeTab, sortBy, searchQuery]);

  const handlePlayerClick = (playerId: string) => {
    if (onPlayerClick) {
      onPlayerClick(playerId);
    } else {
      router.push(`/dashboard/dev-tools/player/${playerId}`);
    }
  };

  // Empty state
  if (roster.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400">
            {mode === 'standalone'
              ? 'Generate rosters from the Full Game page first'
              : 'No roster data available'}
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
            <h3 className="text-lg font-bold">{teamName}</h3>
            {tier && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded",
                tier === Tier.Elite ? "bg-yellow-500/20 text-yellow-400" :
                tier === Tier.Good ? "bg-green-500/20 text-green-400" :
                tier === Tier.Average ? "bg-blue-500/20 text-blue-400" :
                tier === Tier.BelowAverage ? "bg-orange-500/20 text-orange-400" :
                "bg-red-500/20 text-red-400"
              )}>
                {tier}
              </span>
            )}
          </div>

          {showTeamSelector && (
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
            >
              {LEAGUE_TEAMS.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.city} {team.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Embedded header */}
      {mode === 'embedded' && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{teamName}</h3>
            <p className="text-sm text-zinc-400">{stats.totalPlayers} players</p>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold">{stats.totalPlayers}</div>
          <div className="text-[10px] text-zinc-400 uppercase">Roster</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-blue-400">{stats.avgOvr}</div>
          <div className="text-[10px] text-zinc-400 uppercase">Avg OVR</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-400">{stats.avgPotential}</div>
          <div className="text-[10px] text-zinc-400 uppercase">Avg POT</div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
          <div className="text-lg font-bold">{stats.avgAge}</div>
          <div className="text-[10px] text-zinc-400 uppercase">Avg Age</div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className={cn(
              'w-full pl-9 pr-3 py-2',
              'bg-zinc-800/50 border border-zinc-700 rounded-lg',
              'text-sm placeholder:text-zinc-500',
              'focus:outline-none focus:border-primary/50'
            )}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
        >
          <option value="ovr">Overall</option>
          <option value="potential">Potential</option>
          <option value="position">Position</option>
          <option value="age">Age</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-800/30 rounded-lg p-1">
        {(['all', 'offense', 'defense', 'special'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all',
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            {tab === 'special' ? 'ST' : tab}
          </button>
        ))}
      </div>

      {/* Player Count */}
      <div className="text-xs text-zinc-500">
        Showing {filteredPlayers.length} of {roster.length} players
      </div>

      {/* Player List */}
      <div
        className="space-y-2 overflow-y-auto pr-1"
        style={{ maxHeight: maxHeight }}
      >
        {filteredPlayers.map((player) => (
          <RosterPlayerCard
            key={player.id}
            player={player}
            onClick={() => handlePlayerClick(player.id)}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredPlayers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-zinc-500 text-sm">No players match your filters</p>
        </div>
      )}
    </div>
  );
}
