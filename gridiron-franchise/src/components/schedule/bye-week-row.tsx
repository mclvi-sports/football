'use client';

import { getTeamById } from '@/lib/data/teams';

interface ByeWeekRowProps {
  teamIds: string[];
}

/**
 * Small team circle for bye week display
 */
function TeamCircle({ teamId }: { teamId: string }) {
  const team = getTeamById(teamId);
  const color = team?.colors?.primary || '#6b7280';

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold text-[10px] w-8 h-8"
      style={{ backgroundColor: color }}
      title={team ? `${team.city} ${team.name}` : teamId}
    >
      {teamId}
    </div>
  );
}

export function ByeWeekRow({ teamIds }: ByeWeekRowProps) {
  if (!teamIds || teamIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/30 border border-border">
      <span className="text-sm text-muted-foreground font-medium">On Bye:</span>
      <div className="flex items-center gap-2 flex-wrap">
        {teamIds.map((teamId) => (
          <TeamCircle key={teamId} teamId={teamId} />
        ))}
      </div>
    </div>
  );
}
