'use client';

import { SimTeam } from '@/lib/sim/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TeamSelectProps {
  label?: string;
  teams: SimTeam[];
  selectedTeamId: string | null;
  onSelect: (teamId: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function TeamSelect({ label, teams, selectedTeamId, onSelect, disabled, compact }: TeamSelectProps) {
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  const getOvrClass = (ovr: number) => {
    if (ovr >= 90) return 'bg-yellow-400 text-zinc-900';
    if (ovr >= 85) return 'bg-green-500 text-white';
    if (ovr >= 80) return 'bg-blue-600 text-white';
    return 'bg-orange-500 text-zinc-900';
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-1">
        {label && <span className="text-[10px] tracking-wider text-zinc-500">{label}</span>}
        <Select value={selectedTeamId || ''} onValueChange={onSelect} disabled={disabled}>
          <SelectTrigger className="w-40 border-zinc-700 bg-zinc-900 h-9">
            <SelectValue placeholder="Select team">
              {selectedTeam && (
                <div className="flex items-center gap-2">
                  <span className="truncate">{selectedTeam.abbrev}</span>
                  <span className={cn('rounded px-1 py-0.5 text-[10px] font-semibold', getOvrClass(selectedTeam.ovr))}>
                    {selectedTeam.ovr}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] border-zinc-700 bg-zinc-900">
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id} className="focus:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <span>{team.city} {team.name}</span>
                  <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold', getOvrClass(team.ovr))}>
                    {team.ovr}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs tracking-wider text-zinc-500">
        <div className="h-0.5 w-2 bg-yellow-400" />
        {label}
      </div>

      <Select value={selectedTeamId || ''} onValueChange={onSelect} disabled={disabled}>
        <SelectTrigger className="w-full border-zinc-700 bg-zinc-900">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] border-zinc-700 bg-zinc-900">
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id} className="focus:bg-zinc-800">
              <div className="flex items-center gap-2">
                <span>{team.city} {team.name}</span>
                <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold', getOvrClass(team.ovr))}>
                  {team.ovr}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTeam && (
        <div className="flex items-center justify-between rounded bg-zinc-950 p-2 text-sm">
          <span className="text-zinc-500">OVR</span>
          <span className={cn('rounded px-2 py-0.5 text-sm font-semibold', getOvrClass(selectedTeam.ovr))}>
            {selectedTeam.ovr}
          </span>
        </div>
      )}
    </div>
  );
}
