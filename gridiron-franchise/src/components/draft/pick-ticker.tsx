'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { DraftSelection } from '@/stores/draft-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';

interface PickTickerProps {
  selections: DraftSelection[];
  currentPickNumber: number;
  maxHeight?: string;
  horizontal?: boolean;
}

export function PickTicker({
  selections,
  currentPickNumber,
  maxHeight = '300px',
  horizontal = false,
}: PickTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest pick
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selections.length]);

  const getTeamInfo = (teamId: string) => {
    return LEAGUE_TEAMS.find((t) => t.id === teamId);
  };

  if (horizontal) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {selections.slice(-10).map((selection) => {
          const team = getTeamInfo(selection.teamId);
          return (
            <div
              key={selection.pick.overall}
              className="flex shrink-0 items-center gap-2 rounded-lg border bg-card p-2"
              style={{
                borderColor: team?.colors.primary,
              }}
            >
              <Badge variant="outline" className="text-xs">
                #{selection.pick.overall}
              </Badge>
              <span className="text-sm font-medium">
                {selection.prospect.position} {selection.prospect.lastName}
              </span>
              <span className="text-xs text-muted-foreground">{team?.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Picks</CardTitle>
          <Badge variant="outline">{selections.length} made</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div ref={scrollRef} className="space-y-1 p-3 pt-0">
            {selections
              .slice()
              .reverse()
              .slice(0, 20)
              .map((selection) => {
                const team = getTeamInfo(selection.teamId);
                const isRecent = selection.pick.overall >= currentPickNumber - 3;

                return (
                  <div
                    key={selection.pick.overall}
                    className={cn(
                      'flex items-center gap-2 rounded-lg p-2 transition-all',
                      isRecent ? 'bg-primary/5' : 'bg-muted/20'
                    )}
                  >
                    {/* Pick number */}
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: team?.colors.primary + '30',
                        color: team?.colors.primary,
                      }}
                    >
                      {selection.pick.overall}
                    </div>

                    {/* Team */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{team?.city} {team?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Round {selection.pick.round}, Pick {selection.pick.pick}
                      </p>
                    </div>

                    {/* Player */}
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {selection.prospect.firstName} {selection.prospect.lastName}
                      </p>
                      <div className="flex items-center justify-end gap-1">
                        <Badge variant="outline" className="text-xs px-1.5">
                          {selection.prospect.position}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {selection.prospect.overall} OVR
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

            {selections.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No picks made yet
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default PickTicker;
