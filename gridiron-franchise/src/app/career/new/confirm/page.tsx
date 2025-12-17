"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";
import { getPlayerGM, GM, GM_BACKGROUNDS, GM_ARCHETYPES } from "@/lib/gm";
import { getTeamById, getFullGameData, TeamRosterData } from "@/lib/dev-player-store";
import { LEAGUE_TEAMS } from "@/lib/data/teams";
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
const SPECIAL_TEAMS_POSITIONS = [Position.K, Position.P];

function calculateUnitRatings(players: Player[]) {
  const offPlayers = players.filter(p => OFFENSE_POSITIONS.includes(p.position));
  const defPlayers = players.filter(p => DEFENSE_POSITIONS.includes(p.position));
  const stPlayers = players.filter(p => SPECIAL_TEAMS_POSITIONS.includes(p.position));

  const offAvg = offPlayers.length > 0
    ? Math.round(offPlayers.reduce((sum, p) => sum + p.overall, 0) / offPlayers.length)
    : 0;
  const defAvg = defPlayers.length > 0
    ? Math.round(defPlayers.reduce((sum, p) => sum + p.overall, 0) / defPlayers.length)
    : 0;
  const stAvg = stPlayers.length > 0
    ? Math.round(stPlayers.reduce((sum, p) => sum + p.overall, 0) / stPlayers.length)
    : 0;

  return { offense: offAvg, defense: defAvg, specialTeams: stAvg };
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
    if (!teamData) return { offense: 0, defense: 0, specialTeams: 0 };
    return calculateUnitRatings(teamData.roster.players);
  }, [teamData]);

  const topOffensePlayers = useMemo(() => {
    if (!teamData) return [];
    const offPlayers = teamData.roster.players.filter(p => OFFENSE_POSITIONS.includes(p.position));
    return getTopPlayers(offPlayers, 5);
  }, [teamData]);

  const topDefensePlayers = useMemo(() => {
    if (!teamData) return [];
    const defPlayers = teamData.roster.players.filter(p => DEFENSE_POSITIONS.includes(p.position));
    return getTopPlayers(defPlayers, 5);
  }, [teamData]);

  // Get division teams with their OVR (including user's team)
  const divisionTeams = useMemo(() => {
    if (!selectedTeam) return [];
    const fullData = getFullGameData();
    if (!fullData) return [];

    // Find all teams in same division
    return LEAGUE_TEAMS
      .filter(t => t.division === selectedTeam.division)
      .map(team => {
        const teamData = fullData.teams.find(t => t.team.id === team.id);
        return {
          id: team.id,
          city: team.city,
          name: team.name,
          colors: team.colors,
          avgOvr: teamData?.stats.avgOvr || 0,
          isUserTeam: team.id === selectedTeam.id,
        };
      })
      .sort((a, b) => b.avgOvr - a.avgOvr); // Sort by OVR descending
  }, [selectedTeam]);

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
    <div className="flex flex-col min-h-screen">
      {/* Safe area spacer for phone notches */}
      <div className="shrink-0 bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }} />

      {/* Content - Full screen, scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-44 space-y-4">

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
            <h1 className="text-lg font-bold truncate">
              {selectedTeam.city} {selectedTeam.name}
            </h1>
            <p className="text-xs text-muted-foreground">{selectedTeam.division}</p>
          </div>
        </div>

        {/* Ratings Grid - 2x4 */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1: Player Ratings */}
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">OVR</p>
            <p className="text-lg font-bold">{teamData?.stats.avgOvr || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">OFF</p>
            <p className="text-lg font-bold">{unitRatings.offense || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">DEF</p>
            <p className="text-lg font-bold">{unitRatings.defense || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">ST</p>
            <p className="text-lg font-bold">{unitRatings.specialTeams || "--"}</p>
          </div>
          {/* Row 2: Team Ratings */}
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Staff</p>
            <p className="text-lg font-bold">{coaching?.avgOvr || "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Facilities</p>
            <p className="text-lg font-bold">{facilities ? ratingToGrade(facilities.averageRating) : "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Avg Age</p>
            <p className="text-lg font-bold">{teamData?.stats.avgAge ? Math.round(teamData.stats.avgAge) : "--"}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
            <p className="text-[10px] text-muted-foreground uppercase">Chemistry</p>
            <p className="text-lg font-bold">{coaching?.staffChemistry || "--"}</p>
          </div>
        </div>

        {/* Top Players - Offense & Defense */}
        <div className="grid grid-cols-2 gap-2">
          {/* Offense */}
          <div className="bg-secondary/50 border border-border rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase mb-2">Top Offense</p>
            <div className="space-y-1">
              {topOffensePlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">
                    <span className="text-muted-foreground">{player.position}</span>{" "}
                    <span className="font-medium">{player.firstName[0]}. {player.lastName}</span>
                  </span>
                  <span className="font-bold ml-1">{player.overall}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Defense */}
          <div className="bg-secondary/50 border border-border rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase mb-2">Top Defense</p>
            <div className="space-y-1">
              {topDefensePlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">
                    <span className="text-muted-foreground">{player.position}</span>{" "}
                    <span className="font-medium">{player.firstName[0]}. {player.lastName}</span>
                  </span>
                  <span className="font-bold ml-1">{player.overall}</span>
                </div>
              ))}
            </div>
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
        </div>

        {/* Division Standings */}
        <div className="bg-secondary/50 border border-border rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground uppercase mb-2">
            {selectedTeam.division} Standings
          </p>
          <div className="space-y-2">
            {divisionTeams.map((team, index) => (
              <div
                key={team.id}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  team.isUserTeam ? 'bg-primary/10 border border-primary/30' : 'bg-background/50'
                }`}
              >
                {/* Rank */}
                <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>

                {/* Team Logo */}
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    backgroundColor: team.colors.primary,
                    color: team.colors.secondary,
                  }}
                >
                  {team.id}
                </div>

                {/* Team Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${team.isUserTeam ? 'font-semibold' : 'font-medium'}`}>
                    {team.city} {team.name}
                  </p>
                </div>

                {/* OVR */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{team.avgOvr}</p>
                  <p className="text-[10px] text-muted-foreground">OVR</p>
                </div>
              </div>
            ))}
          </div>
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
