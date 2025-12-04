"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";
import { getPlayerGM, GM, GM_BACKGROUNDS, GM_ARCHETYPES } from "@/lib/gm";

export default function ConfirmCareerPage() {
  const router = useRouter();
  const { selectedTeam } = useCareerStore();
  const [gm, setGM] = useState<GM | null>(null);

  // Load GM data
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
  }, [selectedTeam, router]);

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
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/career/new/team"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">Meet Your GM</h1>
      </div>

      {/* Team Preview */}
      <div className="text-center space-y-4">
        {/* Team Logo */}
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg"
          style={{
            backgroundColor: selectedTeam.colors.primary,
            color: selectedTeam.colors.secondary,
          }}
        >
          {selectedTeam.id}
        </div>

        {/* Team Info */}
        <div>
          <p className="text-sm text-muted-foreground">{selectedTeam.city}</p>
          <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedTeam.division}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* GM Profile */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
          Your General Manager
        </h3>

        {/* GM Name */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            {gm.firstName} {gm.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Age {gm.age} • {gm.experience} years experience
          </p>
        </div>

        {/* Background & Archetype */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Background</p>
            <p className="font-semibold text-sm">{background.name}</p>
          </div>
          <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Archetype</p>
            <p className="font-semibold text-sm">{archetype.name}</p>
          </div>
        </div>

        {/* Synergy */}
        {gm.hasSynergy && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
            <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">
              Synergy Active
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {background.name} + {archetype.name} bonuses enhanced
            </p>
          </div>
        )}

        {/* Contract */}
        <div className="bg-secondary/50 border border-border rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Contract</p>
          <p className="font-medium text-sm">
            {gm.contract.years} years • ${gm.contract.salary}M/year
          </p>
        </div>
      </div>

      {/* Career Info */}
      <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-2">
        <p className="text-sm">
          <span className="text-muted-foreground">Conference:</span>{" "}
          <span className="font-medium">{selectedTeam.conference}</span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Starting Season:</span>{" "}
          <span className="font-medium">2025</span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Role:</span>{" "}
          <span className="font-medium">Team Owner</span>
        </p>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-[400px] mx-auto space-y-3">
          <Button onClick={handleStartCareer} className="w-full" size="lg">
            Start Career
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/career/new/team")}
            className="w-full"
          >
            Change Team
          </Button>
        </div>
      </div>
    </div>
  );
}
