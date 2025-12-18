'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Position } from '@/lib/types';
import type { DraftProspect } from '@/lib/generators/draft-generator';
import { useDraftStore } from '@/stores/draft-store';

interface ProspectCardProps {
  prospect: DraftProspect;
  showDraftButton?: boolean;
  onDraft?: () => void;
  compact?: boolean;
}

const POSITION_COLORS: Record<string, string> = {
  QB: 'text-yellow-400 border-yellow-500/30',
  RB: 'text-green-400 border-green-500/30',
  WR: 'text-blue-400 border-blue-500/30',
  TE: 'text-cyan-400 border-cyan-500/30',
  LT: 'text-orange-400 border-orange-500/30',
  LG: 'text-orange-400 border-orange-500/30',
  C: 'text-orange-400 border-orange-500/30',
  RG: 'text-orange-400 border-orange-500/30',
  RT: 'text-orange-400 border-orange-500/30',
  DE: 'text-red-400 border-red-500/30',
  DT: 'text-red-400 border-red-500/30',
  MLB: 'text-pink-400 border-pink-500/30',
  OLB: 'text-pink-400 border-pink-500/30',
  CB: 'text-purple-400 border-purple-500/30',
  FS: 'text-indigo-400 border-indigo-500/30',
  SS: 'text-indigo-400 border-indigo-500/30',
  K: 'text-gray-400 border-gray-500/30',
  P: 'text-gray-400 border-gray-500/30',
};

function formatHeight(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remaining = inches % 12;
  return `${feet}'${remaining}"`;
}

export function ProspectCard({
  prospect,
  showDraftButton = false,
  onDraft,
  compact = false,
}: ProspectCardProps) {
  const { userBoard, addProspectTag, removeProspectTag, setProspectNote } = useDraftStore();

  const tags = userBoard.tags[prospect.id] || [];
  const note = userBoard.notes[prospect.id] || '';
  const positionColor = POSITION_COLORS[prospect.position] || '';

  const quickTags = ['Sleeper', 'Value', 'Reach', 'Risky', 'Safe', 'Target'];

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={cn('text-lg px-3 py-1', positionColor)}>
              {prospect.position}
            </Badge>
            <div className="flex-1">
              <h3 className="font-semibold">
                {prospect.firstName} {prospect.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {prospect.collegeData?.name} • Round {prospect.round}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{prospect.overall}</p>
              <p className="text-xs text-muted-foreground">OVR</p>
            </div>
            {showDraftButton && (
              <Button onClick={onDraft} size="sm">
                Draft
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn('text-base', positionColor)}>
                {prospect.position}
              </Badge>
              <CardTitle>
                {prospect.firstName} {prospect.lastName}
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              {prospect.collegeData?.name} • {prospect.collegeData?.conference}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{prospect.overall}</p>
            <p className="text-xs text-muted-foreground">Overall</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="measurables">Measurables</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-3">
            {/* Key Stats */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-lg font-bold">{prospect.potential}</p>
                <p className="text-xs text-muted-foreground">Potential</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-lg font-bold">{prospect.age}</p>
                <p className="text-xs text-muted-foreground">Age</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-lg font-bold">{prospect.experience}</p>
                <p className="text-xs text-muted-foreground">Exp</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-lg font-bold">R{prospect.round}</p>
                <p className="text-xs text-muted-foreground">Proj</p>
              </div>
            </div>

            {/* Potential Label */}
            <div className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
              <span className="text-sm text-muted-foreground">Potential Label</span>
              <Badge
                className={cn(
                  prospect.potentialLabel === 'Star' && 'bg-yellow-500/20 text-yellow-400',
                  prospect.potentialLabel === 'Starter' && 'bg-green-500/20 text-green-400',
                  prospect.potentialLabel === 'Limited' && 'bg-gray-500/20 text-gray-400'
                )}
              >
                {prospect.potentialLabel}
              </Badge>
            </div>

            {/* Traits */}
            {prospect.traits && prospect.traits.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Traits</p>
                <div className="flex flex-wrap gap-1">
                  {prospect.traits.map((trait) => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* College Career */}
            {prospect.collegeCareer && (
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">College Career</p>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded bg-muted/30 p-2">
                    <p className="font-semibold">{prospect.collegeCareer.stats.gamesPlayed}</p>
                    <p className="text-xs text-muted-foreground">Games</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="font-semibold">{prospect.collegeCareer.stats.gamesStarted}</p>
                    <p className="text-xs text-muted-foreground">Starts</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="font-semibold">{prospect.collegeCareer.stats.years}</p>
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                </div>
                {prospect.collegeCareer.accolades.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {prospect.collegeCareer.accolades.map((acc) => (
                      <Badge key={acc} variant="outline" className="text-xs">
                        {acc}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="measurables" className="space-y-4 pt-3">
            {/* Physical */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-xl font-bold">{formatHeight(prospect.height)}</p>
                <p className="text-xs text-muted-foreground">Height</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-xl font-bold">{prospect.weight}</p>
                <p className="text-xs text-muted-foreground">Weight</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p
                  className={cn(
                    'text-xl font-bold',
                    prospect.fortyTime <= 4.4 && 'text-green-400',
                    prospect.fortyTime >= 4.7 && 'text-red-400'
                  )}
                >
                  {prospect.fortyTime.toFixed(2)}s
                </p>
                <p className="text-xs text-muted-foreground">40-Yard</p>
              </div>
            </div>

            {/* Combine Measurables */}
            {prospect.combineMeasurables && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-between rounded bg-muted/20 p-2">
                    <span className="text-sm text-muted-foreground">Vertical</span>
                    <span className="font-medium">{prospect.combineMeasurables.verticalJump}"</span>
                  </div>
                  <div className="flex justify-between rounded bg-muted/20 p-2">
                    <span className="text-sm text-muted-foreground">Broad</span>
                    <span className="font-medium">{prospect.combineMeasurables.broadJump}"</span>
                  </div>
                  <div className="flex justify-between rounded bg-muted/20 p-2">
                    <span className="text-sm text-muted-foreground">3-Cone</span>
                    <span className="font-medium">
                      {prospect.combineMeasurables.threeCone.toFixed(2)}s
                    </span>
                  </div>
                  <div className="flex justify-between rounded bg-muted/20 p-2">
                    <span className="text-sm text-muted-foreground">Shuttle</span>
                    <span className="font-medium">
                      {prospect.combineMeasurables.twentyShuttle.toFixed(2)}s
                    </span>
                  </div>
                  <div className="flex justify-between rounded bg-muted/20 p-2">
                    <span className="text-sm text-muted-foreground">Bench</span>
                    <span className="font-medium">{prospect.combineMeasurables.benchPress} reps</span>
                  </div>
                  <div className="flex justify-between rounded bg-muted/20 p-2">
                    <span className="text-sm text-muted-foreground">Wingspan</span>
                    <span className="font-medium">{prospect.combineMeasurables.wingspan.toFixed(1)}"</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-3">
            {/* Quick Tags */}
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Quick Tags</p>
              <div className="flex flex-wrap gap-1">
                {quickTags.map((tag) => {
                  const isActive = tags.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isActive ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() =>
                        isActive
                          ? removeProspectTag(prospect.id, tag)
                          : addProspectTag(prospect.id, tag)
                      }
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Personal Note</p>
              <textarea
                value={note}
                onChange={(e) => setProspectNote(prospect.id, e.target.value)}
                placeholder="Add notes about this prospect..."
                className="w-full rounded-md border bg-background p-2 text-sm"
                rows={3}
              />
            </div>

            {/* Active Tags */}
            {tags.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Active Tags</p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="cursor-pointer"
                      onClick={() => removeProspectTag(prospect.id, tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Draft Button */}
        {showDraftButton && (
          <Button onClick={onDraft} className="w-full" size="lg">
            Draft {prospect.firstName} {prospect.lastName}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ProspectCard;
