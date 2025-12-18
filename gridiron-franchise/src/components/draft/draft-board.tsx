'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Position } from '@/lib/types';
import type { DraftProspect } from '@/lib/generators/draft-generator';
import { useDraftStore } from '@/stores/draft-store';

interface DraftBoardProps {
  prospects: DraftProspect[];
  onSelectProspect?: (prospect: DraftProspect) => void;
  selectedProspectId?: string | null;
  maxHeight?: string;
}

type SortOption = 'rank' | 'overall' | 'position' | 'name';

export function DraftBoard({
  prospects,
  onSelectProspect,
  selectedProspectId,
  maxHeight = '500px',
}: DraftBoardProps) {
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const [searchQuery, setSearchQuery] = useState('');

  const { userBoard, availableProspects, updateUserRankings } = useDraftStore();

  // Filter and sort prospects
  const filteredProspects = useMemo(() => {
    let filtered = prospects.filter((p) => availableProspects.includes(p.id));

    // Position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter((p) => p.position === positionFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.collegeData?.name?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rank':
        filtered.sort((a, b) => {
          const aIdx = userBoard.rankings.indexOf(a.id);
          const bIdx = userBoard.rankings.indexOf(b.id);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
        break;
      case 'overall':
        filtered.sort((a, b) => b.overall - a.overall);
        break;
      case 'position':
        filtered.sort((a, b) => a.position.localeCompare(b.position));
        break;
      case 'name':
        filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
        break;
    }

    return filtered;
  }, [prospects, positionFilter, sortBy, searchQuery, availableProspects, userBoard.rankings]);

  // Get unique positions
  const positions = useMemo(() => {
    const posSet = new Set(prospects.map((p) => p.position));
    return Array.from(posSet).sort();
  }, [prospects]);

  // Move prospect up/down in rankings
  const moveProspect = (prospectId: string, direction: 'up' | 'down') => {
    const currentRankings = [...userBoard.rankings];
    const idx = currentRankings.indexOf(prospectId);
    if (idx === -1) return;

    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= currentRankings.length) return;

    // Swap
    [currentRankings[idx], currentRankings[newIdx]] = [
      currentRankings[newIdx],
      currentRankings[idx],
    ];

    updateUserRankings(currentRankings);
  };

  const getRank = (prospectId: string) => {
    const idx = userBoard.rankings.indexOf(prospectId);
    return idx === -1 ? '—' : idx + 1;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Draft Board</CardTitle>
          <Badge variant="outline">{filteredProspects.length} available</Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-32 rounded-md border bg-background px-2 text-sm"
          />

          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="overall">OVR</SelectItem>
              <SelectItem value="position">Pos</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-1 p-3 pt-0">
            {filteredProspects.map((prospect) => {
              const isSelected = prospect.id === selectedProspectId;
              const rank = getRank(prospect.id);
              const tags = userBoard.tags[prospect.id] || [];

              return (
                <div
                  key={prospect.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg p-2 transition-colors cursor-pointer',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 border border-primary/30'
                  )}
                  onClick={() => onSelectProspect?.(prospect)}
                >
                  {/* Rank */}
                  <div className="flex w-8 shrink-0 flex-col items-center gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveProspect(prospect.id, 'up');
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      ▲
                    </button>
                    <span className="text-sm font-medium">{rank}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveProspect(prospect.id, 'down');
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Position badge */}
                  <Badge
                    variant="outline"
                    className={cn(
                      'w-10 justify-center shrink-0',
                      prospect.position === Position.QB && 'border-yellow-500/50 text-yellow-500',
                      [Position.LT, Position.RT].includes(prospect.position as Position) &&
                        'border-blue-500/50 text-blue-500',
                      [Position.DE, Position.DT].includes(prospect.position as Position) &&
                        'border-red-500/50 text-red-500',
                      prospect.position === Position.CB && 'border-purple-500/50 text-purple-500'
                    )}
                  >
                    {prospect.position}
                  </Badge>

                  {/* Name and college */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {prospect.collegeData?.name || 'Unknown'}
                    </p>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="hidden sm:flex gap-1">
                      {tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-1.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Overall */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{prospect.overall}</p>
                    <p className="text-xs text-muted-foreground">OVR</p>
                  </div>

                  {/* Round projection */}
                  <Badge
                    variant="outline"
                    className={cn(
                      'shrink-0',
                      prospect.round === 1 && 'border-yellow-500/50 text-yellow-500',
                      prospect.round === 2 && 'border-gray-400/50 text-gray-400',
                      prospect.round === 3 && 'border-amber-600/50 text-amber-600'
                    )}
                  >
                    R{prospect.round}
                  </Badge>
                </div>
              );
            })}

            {filteredProspects.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No prospects match filters
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default DraftBoard;
