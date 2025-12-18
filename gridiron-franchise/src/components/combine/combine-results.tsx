'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { CombineResults, CombinePerformance, CombineStoryline } from '@/lib/season/combine-event';
import type { DraftProspect } from '@/lib/generators/draft-generator';

interface CombineResultsProps {
  results: CombineResults;
  onSelectProspect?: (prospect: DraftProspect) => void;
}

const STOCK_BADGE_COLORS = {
  riser: 'bg-green-500/20 text-green-400 border-green-500/30',
  faller: 'bg-red-500/20 text-red-400 border-red-500/30',
  stable: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const IMPRESSION_ICONS = {
  excellent: '🌟',
  good: '👍',
  average: '➡️',
  concerning: '⚠️',
  poor: '❌',
};

function ProspectRow({
  prospect,
  performance,
  onClick,
}: {
  prospect: DraftProspect;
  performance?: CombinePerformance;
  onClick?: () => void;
}) {
  const stockChange = performance?.stockChange || 'stable';
  const delta = performance?.draftStockDelta || 0;

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg p-3 transition-colors',
        'hover:bg-muted/50 cursor-pointer',
        stockChange === 'riser' && 'bg-green-500/5',
        stockChange === 'faller' && 'bg-red-500/5'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-semibold">
          {prospect.position}
        </div>
        <div>
          <p className="font-medium">
            {prospect.firstName} {prospect.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {prospect.collegeData.name} • Round {prospect.round}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {performance?.eliteTests && performance.eliteTests.length > 0 && (
          <Badge variant="outline" className="text-xs text-green-400">
            {performance.eliteTests.length} Elite
          </Badge>
        )}
        {performance?.concernTests && performance.concernTests.length > 0 && (
          <Badge variant="outline" className="text-xs text-yellow-400">
            {performance.concernTests.length} Concern
          </Badge>
        )}
        <Badge className={cn('font-semibold', STOCK_BADGE_COLORS[stockChange])}>
          {stockChange === 'riser' && `+${delta}`}
          {stockChange === 'faller' && delta}
          {stockChange === 'stable' && '—'}
        </Badge>
      </div>
    </div>
  );
}

function StorylineCard({ prospect, storyline }: { prospect: DraftProspect; storyline: CombineStoryline }) {
  const isPositive = ['workout_warrior', 'interview_star', 'surprise_athlete', 'position_flexibility'].includes(
    storyline.type
  );

  return (
    <Card className={cn('border', isPositive ? 'border-green-500/30' : 'border-red-500/30')}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{storyline.headline}</CardTitle>
            <CardDescription>
              {prospect.position} • {prospect.collegeData.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn(isPositive ? 'text-green-400' : 'text-red-400')}>
            {storyline.type.replace(/_/g, ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{storyline.description}</p>
      </CardContent>
    </Card>
  );
}

function TopPerformersSection({
  performers,
  performances,
  onSelect,
}: {
  performers: DraftProspect[];
  performances: CombinePerformance[];
  onSelect?: (prospect: DraftProspect) => void;
}) {
  const getPerformance = (id: string) => performances.find((p) => p.prospectId === id);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Top 10 Athletes</h3>
      <div className="grid gap-2">
        {performers.map((prospect, idx) => (
          <div
            key={prospect.id}
            className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 cursor-pointer hover:bg-muted/50"
            onClick={() => onSelect?.(prospect)}
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full font-bold',
                idx < 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-muted'
              )}
            >
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {prospect.firstName} {prospect.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {prospect.position} • {prospect.collegeData.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{prospect.fortyTime.toFixed(2)}s</p>
              <p className="text-xs text-muted-foreground">40-yard</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CombineResultsDisplay({ results, onSelectProspect }: CombineResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const getPerformance = (id: string) => results.performances.find((p) => p.prospectId === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>NFL Combine Results</CardTitle>
              <CardDescription>
                Week {results.week} • {results.year} Draft Class
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={STOCK_BADGE_COLORS.riser}>
                {results.risers.length} Risers
              </Badge>
              <Badge className={STOCK_BADGE_COLORS.faller}>
                {results.fallers.length} Fallers
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risers">Risers</TabsTrigger>
          <TabsTrigger value="fallers">Fallers</TabsTrigger>
          <TabsTrigger value="storylines">Storylines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TopPerformersSection
              performers={results.topPerformers}
              performances={results.performances}
              onSelect={onSelectProspect}
            />
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold">{results.prospects.length}</p>
                    <p className="text-sm text-muted-foreground">Total Prospects</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold">{results.storylines.length}</p>
                    <p className="text-sm text-muted-foreground">Storylines</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold text-green-400">{results.risers.length}</p>
                    <p className="text-sm text-muted-foreground">Stock Rising</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-2xl font-bold text-red-400">{results.fallers.length}</p>
                    <p className="text-sm text-muted-foreground">Stock Falling</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-400">Combine Risers</CardTitle>
              <CardDescription>Prospects who exceeded expectations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.risers.map((prospect) => (
                <ProspectRow
                  key={prospect.id}
                  prospect={prospect}
                  performance={getPerformance(prospect.id)}
                  onClick={() => onSelectProspect?.(prospect)}
                />
              ))}
              {results.risers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No risers from this combine</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fallers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-400">Combine Fallers</CardTitle>
              <CardDescription>Prospects who disappointed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.fallers.map((prospect) => (
                <ProspectRow
                  key={prospect.id}
                  prospect={prospect}
                  performance={getPerformance(prospect.id)}
                  onClick={() => onSelectProspect?.(prospect)}
                />
              ))}
              {results.fallers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No fallers from this combine</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storylines" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {results.storylines.map(({ prospect, storyline }, idx) => (
              <StorylineCard key={idx} prospect={prospect} storyline={storyline} />
            ))}
            {results.storylines.length === 0 && (
              <p className="col-span-2 text-center text-muted-foreground py-8">
                No major storylines from this combine
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CombineResultsDisplay;
