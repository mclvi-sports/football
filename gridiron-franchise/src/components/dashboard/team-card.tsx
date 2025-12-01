"use client";

import type { Team } from "@/data/teams";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-secondary/50 border border-border rounded-2xl p-4">
      <div className="flex items-center gap-4">
        {/* Team Logo */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-md flex-shrink-0"
          style={{
            backgroundColor: team.colors.primary,
            color: team.colors.secondary,
          }}
        >
          {team.abbreviation}
        </div>

        {/* Team Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{team.city}</p>
          <h2 className="text-xl font-bold truncate">{team.name}</h2>
          <p className="text-xs text-muted-foreground">{team.division}</p>
        </div>
      </div>
    </div>
  );
}
