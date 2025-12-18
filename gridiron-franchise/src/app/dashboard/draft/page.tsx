'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useDraftStore, type DraftSpeed } from '@/stores/draft-store';
import { useCareerStore } from '@/stores/career-store';
import { LEAGUE_TEAMS } from '@/lib/data/teams';
import type { DraftProspect } from '@/lib/generators/draft-generator';

import { DraftBoard } from '@/components/draft/draft-board';
import { ProspectCard } from '@/components/draft/prospect-card';
import { ProspectList } from '@/components/draft/prospect-list';
import { PickTicker } from '@/components/draft/pick-ticker';
import { TeamNeedsPanel } from '@/components/draft/team-needs-panel';
import { TradeModal } from '@/components/draft/trade-modal';
import { DraftClock } from '@/components/draft/draft-clock';

type DraftView = 'board' | 'list' | 'results';

export default function DraftPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<DraftView>('board');
  const [selectedProspect, setSelectedProspect] = useState<DraftProspect | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);

  // Stores
  const career = useCareerStore();
  const draft = useDraftStore();

  const {
    _hasHydrated,
    isActive,
    isComplete,
    currentPick,
    draftClass,
    selections,
    settings,
    allPicks,
    teamNeeds,
    userTeamId,
    pickTimeRemaining,
    isPaused,
    initializeDraft,
    startDraft,
    pauseDraft,
    resumeDraft,
    makePick,
    simulateAIPick,
    setSettings,
    tickTimer,
    proposeTrade,
    isUserOnClock,
    getTeamPicks,
    getBestAvailable,
    getTeamDraftGrade,
  } = draft;

  // Initialize draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!_hasHydrated) return;

      // If draft already initialized, use existing data
      if (draftClass.length > 0) {
        setIsLoading(false);
        return;
      }

      // Fetch draft class from API
      try {
        const response = await fetch('/api/draft/generate?size=275&year=2025&combine=true');
        const data = await response.json();

        if (data.success) {
          const teamId = career.playerTeamId || 'BOS';
          initializeDraft(data.draftClass, LEAGUE_TEAMS, teamId, 2025);
        }
      } catch (error) {
        console.error('Error loading draft class:', error);
      }

      setIsLoading(false);
    };

    loadDraft();
  }, [_hasHydrated, draftClass.length, career.playerTeamId, initializeDraft]);

  // Auto-advance AI picks
  useEffect(() => {
    if (!isActive || isPaused || isComplete) return;
    if (isUserOnClock()) return;

    // AI picks after a short delay
    const timer = setTimeout(() => {
      if (settings.speed === 'instant') {
        simulateAIPick();
      } else if (settings.speed === 'fast' && pickTimeRemaining <= 0) {
        simulateAIPick();
      }
    }, settings.speed === 'instant' ? 100 : 500);

    return () => clearTimeout(timer);
  }, [isActive, isPaused, isComplete, currentPick, pickTimeRemaining, settings.speed, isUserOnClock, simulateAIPick]);

  // Handle draft pick
  const handleDraftProspect = useCallback(
    (prospect: DraftProspect) => {
      if (!isUserOnClock()) return;
      makePick(prospect.id);
      setSelectedProspect(null);
    },
    [isUserOnClock, makePick]
  );

  // Get team picks for trade modal
  const allTeamPicks = useMemo(() => {
    const picks: Record<string, typeof allPicks> = {};
    LEAGUE_TEAMS.forEach((team) => {
      picks[team.id] = getTeamPicks(team.id);
    });
    return picks;
  }, [allPicks, getTeamPicks]);

  // User team needs
  const userNeeds = useMemo(() => {
    if (!userTeamId) return null;
    return teamNeeds[userTeamId] || null;
  }, [userTeamId, teamNeeds]);

  // Draft grade
  const draftGrade = useMemo(() => {
    if (!userTeamId) return null;
    return getTeamDraftGrade(userTeamId);
  }, [userTeamId, selections, getTeamDraftGrade]);

  if (isLoading || !_hasHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Draft Room...</p>
        </div>
      </div>
    );
  }

  // Draft complete view
  if (isComplete) {
    return (
      <div className="space-y-6 px-5 pt-4 pb-20">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">Draft Complete!</h1>
          <p className="text-muted-foreground mb-4">
            {selections.length} players selected
          </p>
          {draftGrade && (
            <Badge className="text-lg px-4 py-2">
              Draft Grade: {draftGrade.grade}
            </Badge>
          )}
        </div>

        {/* User's picks */}
        <Card>
          <CardHeader>
            <CardTitle>Your Selections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selections
                .filter((s) => s.teamId === userTeamId)
                .map((selection) => (
                  <div
                    key={selection.pick.overall}
                    className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
                  >
                    <Badge variant="outline">#{selection.pick.overall}</Badge>
                    <div className="flex-1">
                      <p className="font-medium">
                        {selection.prospect.firstName} {selection.prospect.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selection.prospect.position} • {selection.prospect.collegeData?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{selection.prospect.overall}</p>
                      <p className="text-xs text-muted-foreground">OVR</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-draft view
  if (!isActive) {
    return (
      <div className="space-y-6 px-5 pt-4 pb-20">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">2025 NFL Draft</h1>
          <p className="text-muted-foreground mb-6">
            {draftClass.length} prospects • 7 rounds • 224 picks
          </p>

          {/* Settings */}
          <Card className="max-w-md mx-auto mb-6">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Draft Speed</span>
                <Select
                  value={settings.speed}
                  onValueChange={(v) => setSettings({ speed: v as DraftSpeed })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="instant">Instant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" onClick={startDraft}>
            Start Draft
          </Button>
        </div>

        {/* Preview board */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DraftBoard
            prospects={draftClass}
            onSelectProspect={setSelectedProspect}
            selectedProspectId={selectedProspect?.id}
            maxHeight="400px"
          />
          {selectedProspect ? (
            <ProspectCard prospect={selectedProspect} />
          ) : (
            <Card className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">Select a prospect to view details</p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Active draft view
  return (
    <div className="space-y-4 px-5 pt-4 pb-20">
      {/* Draft Clock */}
      <DraftClock
        currentPick={currentPick}
        timeRemaining={pickTimeRemaining}
        isUserOnClock={isUserOnClock()}
        isPaused={isPaused}
        onPause={pauseDraft}
        onResume={resumeDraft}
        onTick={tickTimer}
      />

      {/* User on clock - prominent action area */}
      {isUserOnClock() && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-lg font-semibold">You're on the clock!</p>
                <p className="text-sm text-muted-foreground">
                  Pick #{currentPick?.overall} • Round {currentPick?.round}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowTradeModal(true)}>
                  Trade Pick
                </Button>
                {selectedProspect && (
                  <Button onClick={() => handleDraftProspect(selectedProspect)}>
                    Draft {selectedProspect.lastName}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column - Prospects */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as DraftView)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">Best Available</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-4">
              <DraftBoard
                prospects={draftClass}
                onSelectProspect={setSelectedProspect}
                selectedProspectId={selectedProspect?.id}
                maxHeight="calc(100vh - 400px)"
              />
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <ProspectList
                prospects={draftClass}
                onSelectProspect={setSelectedProspect}
                onDraftProspect={isUserOnClock() ? handleDraftProspect : undefined}
                selectedProspectId={selectedProspect?.id}
                showDraftButton={isUserOnClock()}
                maxHeight="calc(100vh - 400px)"
              />
            </TabsContent>

            <TabsContent value="results" className="mt-4">
              <PickTicker
                selections={selections}
                currentPickNumber={currentPick?.overall || 0}
                maxHeight="calc(100vh - 400px)"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Prospect detail & team info */}
        <div className="space-y-4">
          {/* Selected Prospect */}
          {selectedProspect ? (
            <ProspectCard
              prospect={selectedProspect}
              showDraftButton={isUserOnClock()}
              onDraft={() => handleDraftProspect(selectedProspect)}
              compact={false}
            />
          ) : (
            <Card className="min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Select a prospect to view details
              </p>
            </Card>
          )}

          {/* Team Needs */}
          {userNeeds && (
            <TeamNeedsPanel
              needs={userNeeds}
              selections={selections}
              teamId={userTeamId || ''}
            />
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Draft Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{currentPick?.overall || 0}</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selections.length}</p>
                  <p className="text-xs text-muted-foreground">Made</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{224 - selections.length}</p>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trade Modal */}
      <TradeModal
        open={showTradeModal}
        onClose={() => setShowTradeModal(false)}
        userTeamId={userTeamId || ''}
        userPicks={getTeamPicks(userTeamId || '')}
        allTeamPicks={allTeamPicks}
        onProposeTrade={proposeTrade}
        currentPickNumber={currentPick?.overall || 0}
      />
    </div>
  );
}
