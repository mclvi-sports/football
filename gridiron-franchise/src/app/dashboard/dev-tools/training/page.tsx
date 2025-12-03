'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingDashboard, PlayerDevelopmentCard, PracticeFocusSelector } from '@/components/training';
import { Player, Position, Archetype, PlayerAttributes } from '@/lib/types';
import {
  initializeTeamTraining,
  getTrainingStore,
  clearTrainingStore,
  addPlayerXP,
  getPlayerProgress,
  advanceWeek,
  startNewSeason,
  exportTrainingStore,
  PracticeFocusType,
  PracticeIntensity,
} from '@/lib/training';
import { RefreshCw, Play, Plus, Trash2 } from 'lucide-react';

// Generate test players
function generateTestPlayer(index: number): Player {
  const positions = [Position.QB, Position.RB, Position.WR, Position.TE, Position.LT, Position.DE, Position.MLB, Position.CB];
  const archetypes = [
    Archetype.FieldGeneral,
    Archetype.PowerBack,
    Archetype.DeepThreat,
    Archetype.BlockingTE,
    Archetype.PassProtector,
    Archetype.SpeedRusher,
    Archetype.RunStopper,
    Archetype.BallHawkCB,
  ];
  const firstNames = ['John', 'Mike', 'Chris', 'David', 'James', 'Robert', 'Tom', 'Steve'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson'];

  const pos = positions[index % positions.length];
  const baseValue = 70 + (index % 20);

  // Create attributes that satisfy PlayerAttributes type
  const attributes: PlayerAttributes = {
    // Physical
    SPD: baseValue,
    ACC: baseValue,
    AGI: baseValue,
    STR: baseValue,
    JMP: baseValue,
    STA: baseValue,
    INJ: baseValue,
    // Mental
    AWR: baseValue,
    PRC: baseValue,
    // Passing (QB)
    THP: pos === Position.QB ? 80 : 40,
    SAC: pos === Position.QB ? 80 : 40,
    MAC: pos === Position.QB ? 75 : 40,
    DAC: pos === Position.QB ? 70 : 40,
    TUP: pos === Position.QB ? 70 : 40,
    TOR: pos === Position.QB ? 70 : 40,
    PAC: pos === Position.QB ? 70 : 40,
    BSK: pos === Position.QB ? 70 : 40,
    // Ball Carrier
    CAR: baseValue,
    BTK: baseValue,
    TRK: baseValue,
    ELU: baseValue,
    SPM: baseValue,
    JKM: baseValue,
    SFA: baseValue,
    VIS: baseValue,
    // Receiving
    CTH: baseValue,
    CIT: baseValue,
    SPC: baseValue,
    RTE: baseValue,
    REL: baseValue,
    RAC: baseValue,
    SRR: baseValue,
    MRR: baseValue,
    DRR: baseValue,
    // Blocking
    PBK: baseValue,
    RBK: baseValue,
    IBL: baseValue,
    PBP: baseValue,
    PBF: baseValue,
    RBP: baseValue,
    RBF: baseValue,
    LBK: baseValue,
    // Defense
    TAK: baseValue,
    POW: baseValue,
    PMV: baseValue,
    FMV: baseValue,
    BSH: baseValue,
    PUR: baseValue,
    // Coverage
    MCV: baseValue,
    ZCV: baseValue,
    PRS: baseValue,
    // Kicking
    KPW: pos === Position.K ? 85 : 40,
    KAC: pos === Position.K ? 85 : 40,
    KOP: 40,
    PPW: 40,
    PUA: 40,
    CLU: 40,
    CON: 40,
    RET: 40,
  };

  return {
    id: `player-${index}`,
    firstName: firstNames[index % firstNames.length],
    lastName: lastNames[index % lastNames.length],
    position: pos,
    archetype: archetypes[index % archetypes.length],
    age: 22 + (index % 15),
    experience: index % 10,
    overall: 60 + (index % 30),
    potential: 70 + (index % 25),
    height: 72 + (index % 10),
    weight: 200 + (index % 80),
    fortyTime: 4.4 + (index % 10) * 0.05,
    traits: index % 3 === 0 ? ['Gym Rat'] : index % 4 === 0 ? ['Quick Learner'] : [],
    badges: [],
    college: 'Test University',
    jerseyNumber: 10 + index,
    attributes,
  };
}

export default function TrainingDevPage() {
  const [testRoster, setTestRoster] = useState<Player[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [week, setWeek] = useState(1);
  const [season, setSeason] = useState(1);
  const [storeState, setStoreState] = useState<string>('');

  const teamId = 'test-team-001';

  // Generate test roster on mount
  useEffect(() => {
    const players: Player[] = [];
    for (let i = 0; i < 20; i++) {
      players.push(generateTestPlayer(i));
    }
    setTestRoster(players);
  }, []);

  // Initialize training system
  const handleInitialize = () => {
    initializeTeamTraining(teamId, testRoster, season, week);
    setInitialized(true);
    updateStoreDisplay();
  };

  // Reset training system
  const handleReset = () => {
    clearTrainingStore();
    setInitialized(false);
    setWeek(1);
    setSeason(1);
    setStoreState('');
  };

  // Award random XP to a random player
  const handleAwardXP = () => {
    if (!initialized || testRoster.length === 0) return;
    const randomPlayer = testRoster[Math.floor(Math.random() * testRoster.length)];
    const randomXP = Math.floor(Math.random() * 100) + 50;
    const sources = ['game', 'practice', 'training_camp', 'bye_week'] as const;
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    addPlayerXP(teamId, randomPlayer.id, randomXP, randomSource, week, season, 'Test XP award');
    updateStoreDisplay();
  };

  // Advance week
  const handleAdvanceWeek = () => {
    advanceWeek(teamId);
    setWeek((w) => w + 1);
    updateStoreDisplay();
  };

  // New season
  const handleNewSeason = () => {
    startNewSeason();
    setWeek(1);
    setSeason((s) => s + 1);
    updateStoreDisplay();
  };

  // Update store display
  const updateStoreDisplay = () => {
    const store = exportTrainingStore();
    setStoreState(JSON.stringify(store, null, 2));
  };

  // Handle practice focus change
  const handlePracticeFocusChange = (focus: PracticeFocusType, intensity: PracticeIntensity) => {
    updateStoreDisplay();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Training System</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test player development, XP, and training features
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Control Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleInitialize} disabled={initialized}>
                <Play className="w-4 h-4 mr-2" />
                Initialize
              </Button>
              <Button onClick={handleReset} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleAwardXP} disabled={!initialized} variant="secondary">
                <Plus className="w-4 h-4 mr-2" />
                Award Random XP
              </Button>
              <Button onClick={handleAdvanceWeek} disabled={!initialized} variant="secondary">
                Advance Week
              </Button>
              <Button onClick={handleNewSeason} disabled={!initialized} variant="secondary">
                New Season
              </Button>
              <Button onClick={updateStoreDisplay} disabled={!initialized} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="bg-secondary rounded-lg px-3 py-1">
                Status: {initialized ? 'Initialized' : 'Not Initialized'}
              </div>
              <div className="bg-secondary rounded-lg px-3 py-1">
                Week: {week}
              </div>
              <div className="bg-secondary rounded-lg px-3 py-1">
                Season: {season}
              </div>
              <div className="bg-secondary rounded-lg px-3 py-1">
                Players: {testRoster.length}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cards">Player Cards</TabsTrigger>
            <TabsTrigger value="focus">Practice Focus</TabsTrigger>
            <TabsTrigger value="store">Store State</TabsTrigger>
          </TabsList>

          {/* Training Dashboard */}
          <TabsContent value="dashboard" className="mt-4">
            {initialized ? (
              <TrainingDashboard
                teamId={teamId}
                roster={testRoster}
                week={week}
                season={season}
                onPracticeFocusChange={handlePracticeFocusChange}
              />
            ) : (
              <div className="bg-secondary/50 border border-border rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🏋️</div>
                <h2 className="text-xl font-bold mb-2">Not Initialized</h2>
                <p className="text-muted-foreground mb-4">
                  Click Initialize to start the training system with test data.
                </p>
                <Button onClick={handleInitialize}>
                  <Play className="w-4 h-4 mr-2" />
                  Initialize Training System
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Player Cards Demo */}
          <TabsContent value="cards" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testRoster.slice(0, 6).map((player) => {
                const progress = initialized ? getPlayerProgress(teamId, player.id) : null;
                return (
                  <PlayerDevelopmentCard
                    key={player.id}
                    player={player}
                    progress={progress}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* Practice Focus Demo */}
          <TabsContent value="focus" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Practice Focus Selector</CardTitle>
              </CardHeader>
              <CardContent>
                <PracticeFocusSelector
                  currentFocus="conditioning"
                  currentIntensity="normal"
                  onFocusChange={(focus) => console.log('Focus:', focus)}
                  onIntensityChange={(intensity) => console.log('Intensity:', intensity)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store State */}
          <TabsContent value="store" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Storage State</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary rounded-lg p-4 overflow-auto max-h-96 text-xs">
                  {storeState || 'Click "Refresh" to view store state'}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
