"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TeamInfo } from "@/lib/data/teams";

interface TeamCardProps {
  team: TeamInfo;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      href="/dashboard/my-team"
      className="block bg-secondary/50 border border-border rounded-2xl p-4 transition-all hover:bg-secondary/70 active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        {/* Team Logo */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-md flex-shrink-0"
          style={{
            backgroundColor: team.colors.primary,
            color: team.colors.secondary,
          }}
        >
          {team.id}
        </div>

        {/* Team Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{team.city}</p>
          <h2 className="text-xl font-bold truncate">{team.name}</h2>
          <p className="text-xs text-muted-foreground">{team.division}</p>
        </div>

        {/* Chevron */}
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </Link>
  );
}
