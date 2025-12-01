"use client";

import type { GMArchetype, GMBackground, GMSynergy } from "@/types/gm-persona";
import { BackgroundCard } from "./background-card";
import { getSynergy } from "@/lib/gm-persona-utils";

interface BackgroundListProps {
  backgrounds: GMBackground[];
  selectedBackground: GMBackground | null;
  selectedArchetype: GMArchetype;
  onSelectBackground: (background: GMBackground) => void;
}

export function BackgroundList({
  backgrounds,
  selectedBackground,
  selectedArchetype,
  onSelectBackground,
}: BackgroundListProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 space-y-3 scrollbar-hide">
      {backgrounds.map((background) => {
        const synergy = getSynergy(background.id, selectedArchetype.id);
        return (
          <BackgroundCard
            key={background.id}
            background={background}
            isSelected={selectedBackground?.id === background.id}
            synergy={synergy}
            onSelect={onSelectBackground}
          />
        );
      })}
    </div>
  );
}
