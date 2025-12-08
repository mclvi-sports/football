"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";
import { getPlayerGM, GM, GM_BACKGROUNDS, GM_ARCHETYPES } from "@/lib/gm";
import { getTeamById, TeamRosterData } from "@/lib/dev-player-store";
import { getTeamCoachingById } from "@/lib/coaching/coaching-store";
import { getTeamFacilitiesById } from "@/lib/facilities/facilities-store";
import { CoachingStaff } from "@/lib/coaching/types";
import { TeamFacilities } from "@/lib/facilities/types";
import { Position, Player } from "@/lib/types";

// Position groups for calculating unit ratings
const OFFENSE_POSITIONS = [
  Position.QB, Position.RB, Position.WR, Position.TE,
  Position.LT, Position.LG, Position.C, Position.RG, Position.RT,
];
const DEFENSE_POSITIONS = [
  Position.DE, Position.DT, Position.MLB, Position.OLB,
  Position.CB, Position.FS, Position.SS,
];

function calculateUnitRatings(players: Player[]) {
  const offPlayers = players.filter(p => OFFENSE_POSITIONS.includes(p.position));
  const defPlayers = players.filter(p => DEFENSE_POSITIONS.includes(p.position));

  const offAvg = offPlayers.length > 0
    ? Math.round(offPlayers.reduce((sum, p) => sum + p.overall, 0) / offPlayers.length)
    : 0;
  const defAvg = defPlayers.length > 0
    ? Math.round(defPlayers.reduce((sum, p) => sum + p.overall, 0) / defPlayers.length)
    : 0;

  return { offense: offAvg, defense: defAvg };
}

function getTopPlayers(players: Player[], count = 5): Player[] {
  return [...players].sort((a, b) => b.overall - a.overall).slice(0, count);
}

function ratingToGrade(rating: number): string {
  if (rating >= 9) return "A+";
  if (rating >= 8) return "A";
  if (rating >= 7) return "B+";
  if (rating >= 6) return "B";
  if (rating >= 5) return "C+";
  if (rating >= 4) return "C";
  return "D";
}

export default function ConfirmCareerPage() {
  const router = useRouter();
  const { selectedTeam } = useCareerStore();
  const [gm, setGM] = useState<GM | null>(null);
  const [teamData, setTeamData] = useState<TeamRosterData | null>(null);
  const [coaching, setCoaching] = useState<CoachingStaff | null>(null);
  const [facilities, setFacilities] = useState<TeamFacilities | null>(null);

  // Load all data
  useEffect(() => {
    if (!selectedTeam) {
      router.replace("/career/new/team");
      return;
    }

    const playerGM = getPlayerGM();
    if (!playerGM) {
      router.replace("/career/new/generate");
      return;
    }

    setGM(playerGM);

    // Load team roster data
    const data = getTeamById(selectedTeam.id);
    setTeamData(data);

    // Load coaching staff
    const coachingData = getTeamCoachingById(selectedTeam.id);
    setCoaching(coachingData);

    // Load facilities
    const facilitiesData = getTeamFacilitiesById(selectedTeam.id);
    setFacilities(facilitiesData);
  }, [selectedTeam, router]);

  // Calculate derived data
  const unitRatings = useMemo(() => {
    if (!teamData) return { offense: 0, defense: 0 };
    return calculateUnitRatings(teamData.roster.players);
  }, [teamData]);

  const topPlayers = useMemo(() => {
    if (!teamData) return [];
    return getTopPlayers(teamData.roster.players, 5);
  }, [teamData]);

  function handleStartCareer() {
    router.push("/dashboard");
  }

  if (!selectedTeam || !gm) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-40px)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const background = GM_BACKGROUNDS[gm.background];
  const archetype = GM_ARCHETYPES[gm.archetype];

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      {/* Safe area spacer for phone notches */}
      <div className="shrink-0 bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }} />

      {/* Content - Single screen, no scroll */}
      <div className="flex-1 flex flex-col px-4 pt-3 pb-40 space-y-3">

        {/* Header: Team Identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
            style={{
              backgroundColor: selectedTeam.colors.primary,
              color: selectedTeam.colors.secondary,
            }}
          >
            {selectedTeam.id}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold truncate">
                {selectedTeam.city} {selectedTeam.name}
              </h1>
              <span className="shrink-0 px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">
                {teamData?.stats.avgOvr || "--"} OVR
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{selectedTeam.division}</p>
          </div>
        </div>

        {/* Ratings Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">OFF</p>
            <p className="text-lg font-bold">{unitRatings.offense || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">DEF</p>
            <p className="text-lg font-bold">{unitRatings.defense || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Staff</p>
            <p className="text-lg font-bold">{coaching?.avgOvr || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Facilities</p>
            <p className="text-lg font-bold">{facilities ? ratingToGrade(facilities.averageRating) : "--"}</p>
          </div>
        </div>

        {/* Top 5 Players */}
        <div className="bg-secondary/50 border border-border rounded-lg p-2">
          <p className="text-[10px] text-muted-foreground uppercase mb-1.5">Top Players</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {topPlayers.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between text-sm">
                <span className="truncate">
                  <span className="text-muted-foreground text-xs">{player.position}</span>{" "}
                  <span className="font-medium">{player.firstName[0]}. {player.lastName}</span>
                </span>
                <span className="font-bold text-xs ml-1">{player.overall}</span>
              </div>
            ))}
            {topPlayers.length === 5 && <div />} {/* Empty cell to balance grid */}
          </div>
        </div>

        {/* GM Card - Condensed */}
        <div className="bg-secondary/50 border border-border rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground uppercase mb-1">Your GM</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{gm.firstName} {gm.lastName}</p>
              <p className="text-xs text-muted-foreground">
                Age {gm.age} • {gm.experience}yr exp
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="px-2 py-0.5 bg-background border border-border rounded text-xs">
                {background.name}
              </span>
              <span className="px-2 py-0.5 bg-background border border-border rounded text-xs">
                {archetype.name}
              </span>
            </div>
          </div>
          {gm.hasSynergy && (
            <div className="mt-2 flex items-center gap-1 text-amber-500">
              <span className="text-xs">⚡</span>
              <span className="text-xs font-medium">Synergy Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-5 bg-background border-t border-border z-50">
        <div className="max-w-[400px] mx-auto space-y-3">
          <Button
            variant="outline"
            onClick={() => router.push("/career/new/team")}
            className="w-full"
          >
            Change Team
          </Button>
          <Button onClick={handleStartCareer} className="w-full" size="lg">
            Start Franchise
          </Button>
        </div>
      </footer>
    </div>
  );
}
