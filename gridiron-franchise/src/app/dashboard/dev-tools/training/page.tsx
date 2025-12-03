'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingLoop } from '@/components/modules';
import { Player, Position, Archetype, PlayerAttributes } from '@/lib/types';
import {
  initializeTeamTraining,
  clearTrainingStore,
  addPlayerXP,
  advanceWeek,
  startNewSeason,
  exportTrainingStore,
  getTeamTrainingState,
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

  const attributes: PlayerAttributes = {
    SPD: baseValue, ACC: baseValue, AGI: baseValue, STR: baseValue,
    JMP: baseValue, STA: baseValue, INJ: baseValue, AWR: baseValue, PRC: baseValue,
    THP: pos === Position.QB ? 80 : 40, SAC: pos === Position.QB ? 80 : 40,
    MAC: pos === Position.QB ? 75 : 40, DAC: pos === Position.QB ? 70 : 40,
    TUP: pos === Position.QB ? 70 : 40, TOR: pos === Position.QB ? 70 : 40,
    PAC: pos === Position.QB ? 70 : 40, BSK: pos === Position.QB ? 70 : 40,
    CAR: baseValue, BTK: baseValue, TRK: baseValue, ELU: baseValue,
    SPM: baseValue, JKM: baseValue, SFA: baseValue, VIS: baseValue,
    CTH: baseValue, CIT: baseValue, SPC: baseValue, RTE: baseValue,
    REL: baseValue, RAC: baseValue, SRR: baseValue, MRR: baseValue, DRR: baseValue,
    PBK: baseValue, RBK: baseValue, IBL: baseValue, PBP: baseValue,
    PBF: baseValue, RBP: baseValue, RBF: baseValue, LBK: baseValue,
    TAK: baseValue, POW: baseValue, PMV: baseValue, FMV: baseValue,
    BSH: baseValue, PUR: baseValue, MCV: baseValue, ZCV: baseValue, PRS: baseValue,
    KPW: pos === Position.K ? 85 : 40, KAC: pos === Position.K ? 85 : 40,
    KOP: 40, PPW: 40, PUA: 40, CLU: 40, CON: 40, RET: 40,
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

  // Check if already initialized
  useEffect(() => {
    const existingState = getTeamTrainingState(teamId);
    if (existingState) {
      setInitialized(true);
      updateStoreDisplay();
    }
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

        {/* Tabs */}
        <Tabs defaultValue="training">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="training">Training Loop</TabsTrigger>
            <TabsTrigger value="store">Store State</TabsTrigger>
          </TabsList>

          {/* Training Loop Module */}
          <TabsContent value="training" className="mt-4">
            {initialized ? (
              <TrainingLoop
                mode="standalone"
                teamId={teamId}
                roster={testRoster}
                week={week}
                season={season}
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
