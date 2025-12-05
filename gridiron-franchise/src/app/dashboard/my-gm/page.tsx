"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlayerGM, GM, GM_BACKGROUNDS, GM_ARCHETYPES } from "@/lib/gm";
import { useCareerStore } from "@/stores/career-store";

export default function MyGMPage() {
  const router = useRouter();
  const { selectedTeam } = useCareerStore();
  const [gm, setGM] = useState<GM | null>(null);

  useEffect(() => {
    if (!selectedTeam) {
      router.replace("/");
      return;
    }

    const playerGM = getPlayerGM();
    if (playerGM) {
      setGM(playerGM);
    }
  }, [selectedTeam, router]);

  if (!gm) {
    return (
      <div>
        <main className="px-5 pt-4">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">Loading GM data...</p>
          </div>
        </main>
      </div>
    );
  }

  const background = GM_BACKGROUNDS[gm.background];
  const archetype = GM_ARCHETYPES[gm.archetype];

  // Get top bonuses
  const bonusEntries = Object.entries(gm.bonuses)
    .filter(([_, value]) => value !== 0)
    .sort((a, b) => Math.abs(b[1] as number) - Math.abs(a[1] as number))
    .slice(0, 5);

  const bonusLabels: Record<string, string> = {
    scoutingAccuracy: "Scouting Accuracy",
    contractDemands: "Contract Demands",
    tradeAcceptance: "Trade Acceptance",
    playerDevelopment: "Player Development",
    freeAgentAppeal: "Free Agent Appeal",
    teamMorale: "Team Morale",
    capSpace: "Cap Space",
    ownerPatience: "Owner Patience",
    coachAppeal: "Coach Appeal",
    fanLoyalty: "Fan Loyalty",
    sleepersPerDraft: "Sleepers/Draft",
  };

  return (
    <div className="pb-8">
      <main className="px-5 pt-4 space-y-6">
        {/* GM Profile Card */}
        <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary mb-4">
            {gm.firstName[0]}{gm.lastName[0]}
          </div>
          <h2 className="text-2xl font-bold">
            {gm.firstName} {gm.lastName}
          </h2>
          <p className="text-muted-foreground">
            Age {gm.age} • {gm.experience} years as GM
          </p>
        </div>

        {/* Background & Archetype */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Background</p>
            <p className="font-semibold">{background.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {background.description}
            </p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Archetype</p>
            <p className="font-semibold">{archetype.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {archetype.philosophy}
            </p>
          </div>
        </div>

        {/* Synergy */}
        {gm.hasSynergy && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
            <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              Synergy Active
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {background.name} + {archetype.name} provides enhanced bonuses
            </p>
          </div>
        )}

        {/* Contract */}
        <div className="bg-secondary/50 border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Contract</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{gm.contract.years} Years</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${gm.contract.salary}M</p>
              <p className="text-xs text-muted-foreground">Per Year</p>
            </div>
          </div>
        </div>

        {/* Key Bonuses */}
        <div className="bg-secondary/50 border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-3">Key Bonuses</p>
          <div className="space-y-2">
            {bonusEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm">{bonusLabels[key] || key}</span>
                <span
                  className={`text-sm font-medium ${
                    (value as number) > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {(value as number) > 0 ? "+" : ""}
                  {value}
                  {key === "capSpace" ? "M" : key === "sleepersPerDraft" ? "" : "%"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
