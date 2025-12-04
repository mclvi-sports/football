"use client";

import { TeamInfo } from "@/lib/data/teams";
import { TeamCard } from "./team-card";

interface TeamListProps {
  teams: TeamInfo[];
  selectedTeam?: TeamInfo | null;
  onSelectTeam: (team: TeamInfo) => void;
}

export function TeamList({ teams, selectedTeam, onSelectTeam }: TeamListProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
      <div className="grid gap-3">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            selected={selectedTeam?.id === team.id}
            onSelect={onSelectTeam}
          />
        ))}
      </div>
    </div>
  );
}
