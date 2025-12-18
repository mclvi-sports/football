'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { COMBINE_SCHEDULE, type CombineResults } from '@/lib/season/combine-event';
import { CombineResultsDisplay } from '@/components/combine/combine-results';
import { MeasurablesChart } from '@/components/combine/measurables-chart';

export default function CombinePage() {
  const [draftClass, setDraftClass] = useState<DraftProspect[]>([]);
  const [combineResults, setCombineResults] = useState<CombineResults | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<DraftProspect | null>(null);
  const [activeDay, setActiveDay] = useState<string>('1');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch draft class and combine results from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/draft/generate?size=275&year=2025&week=19&combine=true');
        const data = await response.json();

        if (data.success) {
          setDraftClass(data.draftClass);
          setCombineResults(data.combineResults);
        } else {
          console.error('Failed to load draft data:', data.error);
        }
      } catch (error) {
        console.error('Error loading combine data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get prospects for current day
  const dayProspects = useMemo(() => {
    const dayPositions = COMBINE_SCHEDULE[parseInt(activeDay)] || [];
    let filtered = draftClass.filter((p) => dayPositions.includes(p.position as Position));

    if (positionFilter !== 'all') {
      filtered = filtered.filter((p) => p.position === positionFilter);
    }

    // Sort by round, then by overall
    return filtered.sort((a, b) => {
      const roundA = typeof a.round === 'number' ? a.round : 8;
      const roundB = typeof b.round === 'number' ? b.round : 8;
      if (roundA !== roundB) return roundA - roundB;
      return b.overall - a.overall;
    });
  }, [draftClass, activeDay, positionFilter]);

  // Get positions for current day
  const dayPositions = useMemo(() => {
    return COMBINE_SCHEDULE[parseInt(activeDay)] || [];
  }, [activeDay]);

  const getPerformance = (prospectId: string) => {
    return combineResults?.performances.find((p) => p.prospectId === prospectId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading NFL Combine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5 pt-4 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">NFL Combine</h1>
          <p className="text-muted-foreground">Week 19 • 2025 Draft Class</p>
        </div>
        {combineResults && (
          <div className="flex gap-2">
            <Badge className="bg-green-500/20 text-green-400">
              {combineResults.risers.length} Risers
            </Badge>
            <Badge className="bg-red-500/20 text-red-400">
              {combineResults.fallers.length} Fallers
            </Badge>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">By Day</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="prospect">Prospect</TabsTrigger>
        </TabsList>

        {/* Schedule View */}
        <TabsContent value="schedule" className="space-y-4">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(COMBINE_SCHEDULE).map(([day, positions]) => (
              <Button
                key={day}
                variant={activeDay === day ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveDay(day)}
                className="shrink-0"
              >
                Day {day}
                <span className="ml-2 text-xs opacity-70">
                  ({positions.length} pos)
                </span>
              </Button>
            ))}
          </div>

          {/* Position Filter */}
          <div className="flex items-center gap-4">
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {dayPositions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {dayProspects.length} prospects
            </span>
          </div>

          {/* Prospects Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dayProspects.map((prospect) => {
              const performance = getPerformance(prospect.id);
              const stockChange = performance?.stockChange || 'stable';

              return (
                <Card
                  key={prospect.id}
                  className={cn(
                    'cursor-pointer transition-all hover:border-primary/50',
                    stockChange === 'riser' && 'border-green-500/30',
                    stockChange === 'faller' && 'border-red-500/30'
                  )}
                  onClick={() => setSelectedProspect(prospect)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {prospect.firstName} {prospect.lastName}
                        </CardTitle>
                        <CardDescription>
                          {prospect.position} • {prospect.collegeData.name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Rd {prospect.round}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <p className="font-semibold">{prospect.fortyTime.toFixed(2)}s</p>
                        <p className="text-xs text-muted-foreground">40-yd</p>
                      </div>
                      <div>
                        <p className="font-semibold">{prospect.combineMeasurables.verticalJump}"</p>
                        <p className="text-xs text-muted-foreground">Vert</p>
                      </div>
                      <div>
                        <p className="font-semibold">{prospect.combineMeasurables.benchPress}</p>
                        <p className="text-xs text-muted-foreground">Bench</p>
                      </div>
                    </div>

                    {/* Performance Badges */}
                    {performance && (
                      <div className="flex flex-wrap gap-1">
                        {performance.eliteTests.slice(0, 2).map((test) => (
                          <Badge
                            key={test}
                            variant="outline"
                            className="text-xs text-green-400 border-green-500/30"
                          >
                            {test}
                          </Badge>
                        ))}
                        {performance.concernTests.slice(0, 1).map((test) => (
                          <Badge
                            key={test}
                            variant="outline"
                            className="text-xs text-red-400 border-red-500/30"
                          >
                            {test}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stock Change */}
                    {stockChange !== 'stable' && (
                      <div
                        className={cn(
                          'text-center text-sm font-medium',
                          stockChange === 'riser' ? 'text-green-400' : 'text-red-400'
                        )}
                      >
                        {stockChange === 'riser' ? '↑' : '↓'} {performance?.draftStockDelta || 0} spots
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Results View */}
        <TabsContent value="results">
          {combineResults && (
            <CombineResultsDisplay
              results={combineResults}
              onSelectProspect={setSelectedProspect}
            />
          )}
        </TabsContent>

        {/* Prospect Detail View */}
        <TabsContent value="prospect" className="space-y-4">
          {selectedProspect ? (
            <>
              {/* Prospect Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        {selectedProspect.firstName} {selectedProspect.lastName}
                      </CardTitle>
                      <CardDescription>
                        {selectedProspect.position} • {selectedProspect.collegeData.name} •{' '}
                        {selectedProspect.collegeData.conference}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        selectedProspect.collegeData.tier === 'blue_blood' && 'text-yellow-400',
                        selectedProspect.collegeData.tier === 'elite' && 'text-purple-400'
                      )}
                    >
                      Round {selectedProspect.round}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{selectedProspect.overall}</p>
                      <p className="text-xs text-muted-foreground">Overall</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedProspect.potential}</p>
                      <p className="text-xs text-muted-foreground">Potential</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedProspect.age}</p>
                      <p className="text-xs text-muted-foreground">Age</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedProspect.experience}</p>
                      <p className="text-xs text-muted-foreground">Exp</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Measurables Chart */}
              <MeasurablesChart
                measurables={selectedProspect.combineMeasurables}
                position={selectedProspect.position as Position}
                fortyTime={selectedProspect.fortyTime}
                height={selectedProspect.height}
                weight={selectedProspect.weight}
                prospectName={`${selectedProspect.firstName} ${selectedProspect.lastName}`}
              />

              {/* College Career */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">College Career</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {selectedProspect.collegeCareer.stats.gamesPlayed}
                      </p>
                      <p className="text-xs text-muted-foreground">Games</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {selectedProspect.collegeCareer.stats.gamesStarted}
                      </p>
                      <p className="text-xs text-muted-foreground">Starts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {selectedProspect.collegeCareer.stats.years}
                      </p>
                      <p className="text-xs text-muted-foreground">Years</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {selectedProspect.collegeCareer.captain ? 'Yes' : 'No'}
                      </p>
                      <p className="text-xs text-muted-foreground">Captain</p>
                    </div>
                  </div>

                  {/* Accolades */}
                  {selectedProspect.collegeCareer.accolades.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Accolades</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProspect.collegeCareer.accolades.map((accolade) => (
                          <Badge key={accolade} variant="secondary">
                            {accolade}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Traits */}
              {selectedProspect.traits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Traits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedProspect.traits.map((trait) => (
                        <Badge key={trait} variant="outline">
                          {trait.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <div>
                <p className="text-muted-foreground">Select a prospect to view details</p>
                <p className="text-sm text-muted-foreground">
                  Click on any prospect from the schedule or results tabs
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
