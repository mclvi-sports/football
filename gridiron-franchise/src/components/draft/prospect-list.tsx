'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface ProspectListProps {
  prospects: DraftProspect[];
  onSelectProspect: (prospect: DraftProspect) => void;
  onDraftProspect?: (prospect: DraftProspect) => void;
  selectedProspectId?: string | null;
  showDraftButton?: boolean;
  title?: string;
  maxHeight?: string;
}

type SortOption = 'overall' | 'value' | 'position' | 'name';

export function ProspectList({
  prospects,
  onSelectProspect,
  onDraftProspect,
  selectedProspectId,
  showDraftButton = false,
  title = 'Best Available',
  maxHeight = '400px',
}: ProspectListProps) {
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('overall');

  const { availableProspects, userBoard } = useDraftStore();

  // Filter to available prospects only
  const filteredProspects = useMemo(() => {
    let filtered = prospects.filter((p) => availableProspects.includes(p.id));

    if (positionFilter !== 'all') {
      filtered = filtered.filter((p) => p.position === positionFilter);
    }

    // Sort
    switch (sortBy) {
      case 'overall':
        filtered.sort((a, b) => b.overall - a.overall);
        break;
      case 'value':
        // Value = how much better than expected for their round
        filtered.sort((a, b) => {
          const aValue = a.overall - getExpectedOvrForRound(a.round);
          const bValue = b.overall - getExpectedOvrForRound(b.round);
          return bValue - aValue;
        });
        break;
      case 'position':
        filtered.sort((a, b) => a.position.localeCompare(b.position));
        break;
      case 'name':
        filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
        break;
    }

    return filtered;
  }, [prospects, positionFilter, sortBy, availableProspects]);

  // Get unique positions
  const positions = useMemo(() => {
    const posSet = new Set(prospects.map((p) => p.position));
    return Array.from(posSet).sort();
  }, [prospects]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">{filteredProspects.length}</Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-2 pt-2">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="h-8 flex-1">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="h-8 w-28">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">By OVR</SelectItem>
              <SelectItem value="value">By Value</SelectItem>
              <SelectItem value="position">By Pos</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-1 p-3 pt-0">
            {filteredProspects.slice(0, 50).map((prospect, idx) => {
              const isSelected = prospect.id === selectedProspectId;
              const rank = userBoard.rankings.indexOf(prospect.id) + 1;

              return (
                <div
                  key={prospect.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg p-2 transition-colors cursor-pointer',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 border border-primary/30'
                  )}
                  onClick={() => onSelectProspect(prospect)}
                >
                  {/* Rank number */}
                  <span className="w-6 text-center text-sm text-muted-foreground">
                    {idx + 1}
                  </span>

                  {/* Position */}
                  <Badge variant="outline" className="w-10 justify-center shrink-0">
                    {prospect.position}
                  </Badge>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {prospect.collegeData?.name}
                    </p>
                  </div>

                  {/* Overall */}
                  <div className="text-right shrink-0 w-12">
                    <p className="text-sm font-bold">{prospect.overall}</p>
                    <p className="text-xs text-muted-foreground">OVR</p>
                  </div>

                  {/* Draft button */}
                  {showDraftButton && onDraftProspect && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDraftProspect(prospect);
                      }}
                    >
                      Draft
                    </Button>
                  )}
                </div>
              );
            })}

            {filteredProspects.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No prospects available
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getExpectedOvrForRound(round: number | 'UDFA'): number {
  if (round === 'UDFA') return 55;
  switch (round) {
    case 1: return 78;
    case 2: return 74;
    case 3: return 70;
    case 4: return 67;
    case 5: return 64;
    case 6: return 61;
    case 7: return 58;
    default: return 55;
  }
}

export default ProspectList;
