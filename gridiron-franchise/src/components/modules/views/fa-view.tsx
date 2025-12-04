'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerCard } from '@/components/dev-tools/player-card';
import { Player, Position } from '@/lib/types';
import { getFreeAgents, storeFreeAgents, storeDevPlayers } from '@/lib/dev-player-store';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// ============================================================================
// TYPES
// ============================================================================

type FAQuality = 'high' | 'medium' | 'low' | 'mixed';
type PositionFilter = 'all' | 'offense' | 'defense' | 'special';

interface FAStats {
  totalPlayers: number;
  avgOvr: number;
  avgAge: number;
  positionCounts: Record<Position, number>;
  ovrDistribution: { range: string; count: number }[];
}

interface FAViewProps {
  mode: 'standalone' | 'embedded';
  maxHeight?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

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
// HELPER FUNCTIONS
// ============================================================================

function calculateStatsFromPlayers(players: Player[]): FAStats {
  const avgOvr = Math.round(players.reduce((sum, p) => sum + p.overall, 0) / players.length);
  const avgAge = Math.round(players.reduce((sum, p) => sum + p.age, 0) / players.length);
  const positionCounts = players.reduce((acc, p) => {
    acc[p.position] = (acc[p.position] || 0) + 1;
    return acc;
  }, {} as Record<Position, number>);
  const ovrRanges = [
    { range: '80+', min: 80, max: 99 },
    { range: '70-79', min: 70, max: 79 },
    { range: '60-69', min: 60, max: 69 },
    { range: '<60', min: 0, max: 59 },
  ];
  const ovrDistribution = ovrRanges.map(({ range, min, max }) => ({
    range,
    count: players.filter((p) => p.overall >= min && p.overall <= max).length,
  }));

  return { totalPlayers: players.length, avgOvr, avgAge, positionCounts, ovrDistribution };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FAView({ mode, maxHeight = mode === 'embedded' ? '500px' : undefined }: FAViewProps) {
  const router = useRouter();
  const [size, setSize] = useState<number>(100);
  const [quality, setQuality] = useState<FAQuality>('mixed');
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<FAStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('compact');

  // Load existing FA data on mount
  useEffect(() => {
    const existingFA = getFreeAgents();
    if (existingFA.length > 0) {
      setPlayers(existingFA);
      setStats(calculateStatsFromPlayers(existingFA));
    }
  }, []);

  // Store players when generated
  useEffect(() => {
    if (players.length > 0) {
      storeDevPlayers(players);
      storeFreeAgents(players);
    }
  }, [players]);

  const generateFA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dev/generate-fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size, quality }),
      });
      const data = await response.json();
      if (data.success) {
        setPlayers(data.players);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to generate FA pool:', error);
    }
    setLoading(false);
  };

  const handlePlayerClick = (playerId: string) => {
    router.push(`/dashboard/dev-tools/player/${playerId}`);
  };

  const getFilteredPlayers = () => {
    if (positionFilter === 'all') return players;
    if (positionFilter === 'offense') return players.filter((p) => OFFENSE_POSITIONS.includes(p.position));
    if (positionFilter === 'defense') return players.filter((p) => DEFENSE_POSITIONS.includes(p.position));
    return players.filter((p) => SPECIAL_POSITIONS.includes(p.position));
  };

  const filteredPlayers = getFilteredPlayers();

  // No data state
  if (players.length === 0 && !loading) {
    if (mode === 'embedded') {
      return (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-3">🏷️</div>
            <p className="text-sm text-muted-foreground">No free agent data available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pool Size</label>
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value={50}>50 Players</option>
                <option value={100}>100 Players</option>
                <option value={150}>150 Players</option>
                <option value={200}>200 Players</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as FAQuality)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="high">High (72-85 OVR)</option>
                <option value="medium">Medium (65-76 OVR)</option>
                <option value="low">Low (55-68 OVR)</option>
                <option value="mixed">Mixed (55-82 OVR)</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateFA}
            disabled={loading}
            className={cn(
              'w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {loading ? 'Generating...' : 'Generate Free Agents'}
          </button>
        </div>

        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-2">🏷️</div>
          <p>Configure options and click Generate to create a free agent pool</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('space-y-4', mode === 'embedded' && 'overflow-y-auto')}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {/* Controls (standalone only) */}
      {mode === 'standalone' && (
        <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pool Size</label>
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value={50}>50 Players</option>
                <option value={100}>100 Players</option>
                <option value={150}>150 Players</option>
                <option value={200}>200 Players</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as FAQuality)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="high">High (72-85 OVR)</option>
                <option value="medium">Medium (65-76 OVR)</option>
                <option value="low">Low (55-68 OVR)</option>
                <option value="mixed">Mixed (55-82 OVR)</option>
              </select>
            </div>
          </div>
          <button
            onClick={generateFA}
            disabled={loading}
            className={cn(
              'w-full px-6 py-2.5 rounded-lg font-semibold text-sm transition-all',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {loading ? 'Generating...' : 'Generate Free Agents'}
          </button>
        </div>
      )}

      {/* Stats Summary */}
      {stats && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <div className="text-xs text-muted-foreground">Players</div>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.avgOvr}</div>
              <div className="text-xs text-muted-foreground">Avg OVR</div>
            </div>
            <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.avgAge}</div>
              <div className="text-xs text-muted-foreground">Avg Age</div>
            </div>
          </div>

          {/* OVR Distribution */}
          <div className="bg-secondary/50 border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-2">OVR Distribution</div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {stats.ovrDistribution.map((d) => (
                <div key={d.range} className="bg-secondary rounded-lg p-2">
                  <div className="font-bold">{d.count}</div>
                  <div className="text-[10px] text-muted-foreground">{d.range}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Position Filter & View Toggle */}
      <div className="flex gap-2">
        {(['all', 'offense', 'defense', 'special'] as PositionFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setPositionFilter(filter)}
            className={cn(
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
              positionFilter === filter
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            )}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Showing {filteredPlayers.length} players</span>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('compact')}
            className={cn(
              'px-3 py-1 rounded text-xs',
              viewMode === 'compact' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
            )}
          >
            Compact
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              'px-3 py-1 rounded text-xs',
              viewMode === 'cards' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
            )}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Players List */}
      <div className={cn(viewMode === 'cards' ? 'grid grid-cols-1 gap-3' : 'space-y-2')}>
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => handlePlayerClick(player.id)}
            className="cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <PlayerCard player={player} compact={viewMode === 'compact'} />
          </div>
        ))}
      </div>
    </div>
  );
}
