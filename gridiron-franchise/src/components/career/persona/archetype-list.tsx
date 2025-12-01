"use client";

import type { GMArchetype } from "@/types/gm-persona";
import { ArchetypeCard } from "./archetype-card";

interface ArchetypeListProps {
  archetypes: GMArchetype[];
  selectedArchetype: GMArchetype | null;
  onSelectArchetype: (archetype: GMArchetype) => void;
}

export function ArchetypeList({
  archetypes,
  selectedArchetype,
  onSelectArchetype,
}: ArchetypeListProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 space-y-3 scrollbar-hide">
      {archetypes.map((archetype) => (
        <ArchetypeCard
          key={archetype.id}
          archetype={archetype}
          isSelected={selectedArchetype?.id === archetype.id}
          onSelect={onSelectArchetype}
        />
      ))}
    </div>
  );
}
