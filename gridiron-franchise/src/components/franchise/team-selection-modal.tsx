'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TeamRosterData } from '@/lib/dev-player-store';
import { Tier } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Users,
  Trophy,
  Star,
  Check,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface TeamSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: TeamRosterData[];
  onSelectTeam: (teamId: string) => void;
}

// ============================================================================
// TIER BADGE
// ============================================================================

function getTierColor(tier: Tier): string {
  switch (tier) {
    case Tier.Elite:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case Tier.Good:
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case Tier.Average:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case Tier.BelowAverage:
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case Tier.Rebuilding:
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  }
}

function getTierLabel(tier: Tier): string {
  switch (tier) {
    case Tier.Elite:
      return 'Elite';
    case Tier.Good:
      return 'Good';
    case Tier.Average:
      return 'Average';
    case Tier.BelowAverage:
      return 'Below Avg';
    case Tier.Rebuilding:
      return 'Rebuilding';
    default:
      return 'Unknown';
  }
}

// ============================================================================
// TEAM CARD
// ============================================================================

interface TeamCardProps {
  team: TeamRosterData;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
}

function TeamCard({ team, isExpanded, onToggleExpand, onSelect }: TeamCardProps) {
  // Get top 5 players by overall
  const topPlayers = useMemo(() => {
    return [...team.roster.players]
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 5);
  }, [team.roster.players]);

  // Get position breakdown
  const positionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    team.roster.players.forEach((p) => {
      const group = getPositionGroup(p.position);
      counts[group] = (counts[group] || 0) + 1;
    });
    return counts;
  }, [team.roster.players]);

  return (
    <Card className={cn(
      'border transition-all',
      isExpanded ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-800 hover:border-zinc-700'
    )}>
      <CardContent className="p-4">
        {/* Team Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="font-bold text-lg">{team.team.city}</div>
              <div className="text-sm text-zinc-400">{team.team.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className={getTierColor(team.tier)}>
              {getTierLabel(team.tier)}
            </Badge>
            <div className="text-right">
              <div className="text-lg font-bold">{team.stats.avgOvr}</div>
              <div className="text-xs text-zinc-500">OVR</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-zinc-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {team.stats.totalPlayers} players
          </span>
          <span>{team.team.conference} · {team.team.division}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleExpand}
            className="flex-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Roster
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                View Roster
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={onSelect}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-1" />
            Select Team
          </Button>
        </div>

        {/* Expanded Roster Preview */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
            {/* Top Players */}
            <div>
              <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Top Players
              </h4>
              <div className="space-y-1">
                {topPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between text-sm p-2 rounded bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.firstName} {player.lastName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {player.position}
                      </Badge>
                    </div>
                    <span className={cn(
                      'font-bold',
                      player.overall >= 85 ? 'text-green-400' :
                      player.overall >= 75 ? 'text-blue-400' :
                      'text-zinc-400'
                    )}>
                      {player.overall}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Breakdown */}
            <div>
              <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
                Roster Composition
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(positionCounts).map(([group, count]) => (
                  <Badge key={group} variant="outline" className="text-xs">
                    {group}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPositionGroup(position: string): string {
  const groups: Record<string, string[]> = {
    'QB': ['QB'],
    'RB': ['RB', 'FB'],
    'WR': ['WR'],
    'TE': ['TE'],
    'OL': ['LT', 'LG', 'C', 'RG', 'RT'],
    'DL': ['DE', 'DT', 'NT'],
    'LB': ['MLB', 'OLB', 'ILB', 'LOLB', 'ROLB'],
    'DB': ['CB', 'FS', 'SS', 'S'],
    'ST': ['K', 'P', 'LS'],
  };

  for (const [group, positions] of Object.entries(groups)) {
    if (positions.includes(position)) return group;
  }
  return 'Other';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TeamSelectionModal({
  open,
  onOpenChange,
  teams,
  onSelectTeam,
}: TeamSelectionModalProps) {
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [filterConference, setFilterConference] = useState<string | null>(null);

  // Get unique conferences
  const conferences = useMemo(() => {
    const set = new Set(teams.map((t) => t.team.conference));
    return Array.from(set);
  }, [teams]);

  // Filter teams
  const filteredTeams = useMemo(() => {
    let result = [...teams];
    if (filterConference) {
      result = result.filter((t) => t.team.conference === filterConference);
    }
    // Sort by tier (Elite first) then by OVR
    return result.sort((a, b) => {
      const tierOrder = { [Tier.Elite]: 0, [Tier.Good]: 1, [Tier.Average]: 2, [Tier.BelowAverage]: 3, [Tier.Rebuilding]: 4 };
      const tierDiff = (tierOrder[a.tier] ?? 5) - (tierOrder[b.tier] ?? 5);
      if (tierDiff !== 0) return tierDiff;
      return b.stats.avgOvr - a.stats.avgOvr;
    });
  }, [teams, filterConference]);

  const handleSelectTeam = (teamId: string) => {
    onSelectTeam(teamId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Select Your Team
          </DialogTitle>
        </DialogHeader>

        {/* Conference Filter */}
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm text-zinc-400">Filter:</span>
          <Button
            variant={filterConference === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterConference(null)}
          >
            All
          </Button>
          {conferences.map((conf) => (
            <Button
              key={conf}
              variant={filterConference === conf ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterConference(conf)}
            >
              {conf}
            </Button>
          ))}
        </div>

        {/* Team List */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3 pb-4">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.team.id}
                team={team}
                isExpanded={expandedTeamId === team.team.id}
                onToggleExpand={() =>
                  setExpandedTeamId(
                    expandedTeamId === team.team.id ? null : team.team.id
                  )
                }
                onSelect={() => handleSelectTeam(team.team.id)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-center text-sm text-zinc-500">
          {filteredTeams.length} teams available · Click &quot;View Roster&quot; to preview
        </div>
      </DialogContent>
    </Dialog>
  );
}
