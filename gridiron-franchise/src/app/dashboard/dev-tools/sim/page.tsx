'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GameSimulator } from '@/components/sim/game-simulator';
import { adaptTeamRoster } from '@/lib/sim/team-adapter';
import { getFullGameData, TeamRosterData } from '@/lib/dev-player-store';
import { getTeamCoachingById } from '@/lib/coaching/coaching-store';
import { getTeamFacilitiesById } from '@/lib/facilities/facilities-store';
import { SimTeam } from '@/lib/sim/types';
import { ArrowLeft } from 'lucide-react';

interface PendingGame {
  awayTeamId: string;
  homeTeamId: string;
  week: number;
  gameId: string;
  isPrimeTime?: boolean;
}

export default function SimulatorPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<SimTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingGame, setPendingGame] = useState<PendingGame | null>(null);

  // Load teams from full game data with coaching and facilities
  useEffect(() => {
    // Check for pending game from Play Game button
    const pendingGameData = sessionStorage.getItem('pendingGame');
    if (pendingGameData) {
      try {
        setPendingGame(JSON.parse(pendingGameData));
        // Clear after reading so it doesn't persist
        sessionStorage.removeItem('pendingGame');
      } catch (e) {
        console.error('Failed to parse pending game:', e);
      }
    }

    const fullGameData = getFullGameData();
    if (fullGameData && fullGameData.teams.length > 0) {
      const simTeams = fullGameData.teams.map((teamData: TeamRosterData) => {
        const simTeam = adaptTeamRoster(teamData);

        // Attach coaching staff if available
        const coaching = getTeamCoachingById(simTeam.id);
        if (coaching) {
          simTeam.coachingStaff = coaching;
        }

        // Attach facilities if available
        const facilities = getTeamFacilitiesById(simTeam.id);
        if (facilities) {
          simTeam.facilities = facilities;
        }

        return simTeam;
      });
      setTeams(simTeams);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-zinc-500">Loading teams...</div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/dev-tools')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dev Tools
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">No teams found. Generate a full game first.</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard/dev-tools/full')}>
              Go to Full Game Generator
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get pre-selected teams if there's a pending game
  const awayTeam = pendingGame ? teams.find(t => t.id === pendingGame.awayTeamId) : undefined;
  const homeTeam = pendingGame ? teams.find(t => t.id === pendingGame.homeTeamId) : undefined;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push('/dashboard')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Show game info if pending */}
      {pendingGame && (
        <div className="text-center text-sm text-zinc-400">
          Week {pendingGame.week} {pendingGame.isPrimeTime && '• Prime Time'}
        </div>
      )}

      <GameSimulator
        awayTeam={awayTeam}
        homeTeam={homeTeam}
        teams={teams}
        config={{
          layout: 'full',
          showDebug: true,
          showTeamSelection: !pendingGame, // Hide team selection if game is pre-set
          header: (
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wider">GRIDIRON ENGINE</h1>
              <p className="text-xs tracking-widest text-zinc-500">
                TEAM OVR | BADGES | TRAITS | WEATHER | HOME FIELD
              </p>
            </div>
          ),
        }}
        initialSettings={pendingGame?.isPrimeTime ? { gameType: 'primetime' } : undefined}
      />
    </div>
  );
}
