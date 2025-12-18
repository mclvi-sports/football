'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useDraftStore } from '@/stores/draft-store';
import { useCareerStore } from '@/stores/career-store';
import { useOffseasonStore } from '@/stores/offseason-store';
import type { DraftProspect } from '@/lib/generators/draft-generator';
import {
  runRookieCamp,
  getDevelopmentFocusLabel,
  getPerformanceBadgeClass,
  type RookieCampResult,
  type RookieCampSummary,
} from '@/lib/training/rookie-camp';
import { ChevronLeft, Trophy, CheckCircle2 } from 'lucide-react';

/**
 * Offseason Rookie Camp Page
 *
 * Evaluates all rookies (drafted + UDFAs) at Week 22.
 * Integrates with offseason flow for phase completion.
 */
export default function OffseasonRookieCampPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [campResults, setCampResults] = useState<RookieCampSummary | null>(null);
  const [selectedRookie, setSelectedRookie] = useState<RookieCampResult | null>(null);
  const [campStarted, setCampStarted] = useState(false);
  const [signedUDFAs, setSignedUDFAs] = useState<DraftProspect[]>([]);

  const career = useCareerStore();
  const draft = useDraftStore();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();

  const { selections, userTeamId, isComplete, draftClass, availableProspects, _hasHydrated } = draft;

  // Get user's draft picks
  const userRookies = useMemo(() => {
    if (!userTeamId) return [];
    return selections
      .filter((s) => s.teamId === userTeamId)
      .map((s) => s.prospect);
  }, [selections, userTeamId]);

  // Combine drafted rookies + signed UDFAs
  const allRookies = useMemo(() => {
    return [...userRookies, ...signedUDFAs];
  }, [userRookies, signedUDFAs]);

  // Mark phase as in-progress
  useEffect(() => {
    if (!isPhaseCompleted('rookie-camp')) {
      setPhaseStatus('rookie-camp', 'in-progress');
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  // Load signed UDFAs from session storage
  useEffect(() => {
    if (_hasHydrated) {
      const storedUDFAs = sessionStorage.getItem('signedUDFAs');
      if (storedUDFAs) {
        try {
          const udfaIds: string[] = JSON.parse(storedUDFAs);
          const udfaProspects = draftClass.filter(p => udfaIds.includes(p.id));
          setSignedUDFAs(udfaProspects);
        } catch {
          // Ignore parse errors
        }
      }
      setIsLoading(false);
    }
  }, [_hasHydrated, draftClass]);

  const handleStartCamp = () => {
    if (allRookies.length === 0) return;

    const results = runRookieCamp(allRookies, userTeamId || '', 2025, 22);
    setCampResults(results);
    setCampStarted(true);

    // Select first rookie by default
    if (results.rookies.length > 0) {
      setSelectedRookie(results.rookies[0]);
    }
  };

  const handleComplete = () => {
    completePhase('rookie-camp');
    // Clear the UDFA storage
    sessionStorage.removeItem('signedUDFAs');
    router.push('/dashboard/offseason');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Rookie Camp...</p>
        </div>
      </div>
    );
  }

  if (!isComplete) {
    return (
      <div className="space-y-6 px-5 pt-4 pb-20">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Rookie Camp</h1>
          <p className="text-muted-foreground mb-6">
            Complete the draft first to begin rookie camp
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard/offseason/draft')}>
            Go to Draft
          </Button>
        </div>
      </div>
    );
  }

  if (allRookies.length === 0) {
    return (
      <div className="space-y-6 px-5 pt-4 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/offseason')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Rookie Camp</h1>
            <p className="text-sm text-muted-foreground">Week 22</p>
          </div>
          <Button onClick={handleComplete}>
            Done
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No rookies to evaluate. Complete the draft and sign UDFAs.
          </p>
        </div>
      </div>
    );
  }

  // Pre-camp view
  if (!campStarted || !campResults) {
    return (
      <div className="space-y-6 px-5 pt-4 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 py-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/offseason')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Rookie Camp</h1>
            <p className="text-sm text-muted-foreground">Week 22</p>
          </div>
        </div>

        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Ready for Evaluation</h2>
          <p className="text-muted-foreground mb-6">
            {allRookies.length} rookies ready for camp
            {signedUDFAs.length > 0 && ` (${userRookies.length} drafted, ${signedUDFAs.length} UDFAs)`}
          </p>

          <Button size="lg" onClick={handleStartCamp}>
            Start Camp Evaluation
          </Button>
        </div>

        {/* Rookie Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Incoming Rookies</CardTitle>
            <CardDescription>Your draft class awaits evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userRookies.map((rookie) => (
                <div
                  key={rookie.id}
                  className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
                >
                  <Badge variant="outline">{rookie.position}</Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {rookie.firstName} {rookie.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {rookie.collegeData?.name} • Round {rookie.round}
                    </p>
                  </div>
                  <Badge variant="secondary">{rookie.potentialLabel}</Badge>
                </div>
              ))}
              {signedUDFAs.map((rookie) => (
                <div
                  key={rookie.id}
                  className="flex items-center gap-3 rounded-lg bg-orange-500/10 border border-orange-500/20 p-3"
                >
                  <Badge variant="outline">{rookie.position}</Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {rookie.firstName} {rookie.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {rookie.collegeData?.name}
                    </p>
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">UDFA</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Camp results view
  return (
    <div className="space-y-6 px-5 pt-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 py-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/offseason')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Rookie Camp Complete</h1>
          <p className="text-sm text-muted-foreground">
            Week 22 • {campResults.rookies.length} rookies evaluated
          </p>
        </div>
        <Button onClick={handleComplete} className="gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Complete Offseason
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{campResults.rookies.length}</p>
            <p className="text-xs text-muted-foreground">Total Rookies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{campResults.averageRevealedOvr.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg Revealed OVR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-400">{campResults.standouts.length}</p>
            <p className="text-xs text-muted-foreground">Standouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-400">{campResults.concerns.length}</p>
            <p className="text-xs text-muted-foreground">Concerns</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rookie List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rookies</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-3 pt-0">
                  {campResults.rookies.map((result) => {
                    const isSelected = selectedRookie?.prospectId === result.prospectId;
                    const isUDFA = signedUDFAs.some(u => u.id === result.prospectId);

                    return (
                      <div
                        key={result.prospectId}
                        className={cn(
                          'flex items-center gap-2 rounded-lg p-2 cursor-pointer transition-colors',
                          'hover:bg-muted/50',
                          isSelected && 'bg-primary/10 border border-primary/30'
                        )}
                        onClick={() => setSelectedRookie(result)}
                      >
                        <Badge variant="outline" className="w-10 justify-center shrink-0">
                          {result.prospect.position}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {result.prospect.firstName} {result.prospect.lastName}
                          </p>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className={cn('text-xs', getPerformanceBadgeClass(result.performance))}
                            >
                              {result.performance}
                            </Badge>
                            {isUDFA && (
                              <Badge className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
                                UDFA
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">{result.revealedOvr}</p>
                          <p className="text-xs text-muted-foreground">OVR</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Rookie Detail */}
        <div className="lg:col-span-2">
          {selectedRookie ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-base">
                        {selectedRookie.prospect.position}
                      </Badge>
                      <CardTitle>
                        {selectedRookie.prospect.firstName} {selectedRookie.prospect.lastName}
                      </CardTitle>
                      {signedUDFAs.some(u => u.id === selectedRookie.prospectId) && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          UDFA
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {selectedRookie.prospect.collegeData?.name}
                      {selectedRookie.prospect.round && ` • Round ${selectedRookie.prospect.round}`}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-base', getPerformanceBadgeClass(selectedRookie.performance))}
                  >
                    {selectedRookie.performance}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* OVR Display */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg bg-muted/30 p-4">
                    <p className="text-3xl font-bold">{selectedRookie.revealedOvr}</p>
                    <p className="text-xs text-muted-foreground">Revealed OVR</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-4">
                    <p className="text-3xl font-bold">{selectedRookie.projectedYear1Ovr}</p>
                    <p className="text-xs text-muted-foreground">Year 1 Projection</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-4">
                    <p className="text-3xl font-bold">{selectedRookie.prospect.potential}</p>
                    <p className="text-xs text-muted-foreground">Potential</p>
                  </div>
                </div>

                {/* Development Focus */}
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Development Focus
                  </p>
                  <p className="text-lg font-semibold">
                    {getDevelopmentFocusLabel(selectedRookie.developmentFocus)}
                  </p>
                </div>

                {/* Camp Notes */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Camp Notes</p>
                  <div className="space-y-2">
                    {selectedRookie.campNotes.map((note, idx) => (
                      <p key={idx} className="text-sm bg-muted/30 rounded p-2">
                        "{note}"
                      </p>
                    ))}
                  </div>
                </div>

                {/* Standout Drills */}
                {selectedRookie.standoutDrills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-2">Standout Drills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRookie.standoutDrills.map((drill) => (
                        <Badge
                          key={drill}
                          variant="outline"
                          className="border-green-500/30 text-green-400"
                        >
                          {drill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Areas to Improve */}
                {selectedRookie.areasToImprove.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-2">Areas to Improve</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRookie.areasToImprove.map((area) => (
                        <Badge
                          key={area}
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Traits */}
                {selectedRookie.prospect.traits && selectedRookie.prospect.traits.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Traits</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRookie.prospect.traits.map((trait) => (
                        <Badge key={trait} variant="secondary" className="text-xs">
                          {trait.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">Select a rookie to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
