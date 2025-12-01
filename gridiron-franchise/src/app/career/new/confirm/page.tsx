"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";

export default function ConfirmCareerPage() {
  const router = useRouter();
  const { persona, selectedTeam } = useCareerStore();

  // Redirect if missing selections
  useEffect(() => {
    if (!persona) {
      router.replace("/career/new/archetype");
    } else if (!selectedTeam) {
      router.replace("/career/new/team");
    }
  }, [persona, selectedTeam, router]);

  function handleStartCareer() {
    // Navigate to dashboard (keep state so dashboard can access team/persona)
    router.push("/dashboard");
  }

  if (!persona || !selectedTeam) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-40px)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const { archetype, background, synergy } = persona;

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
        <h1 className="text-xl font-bold">Confirm Career</h1>
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
          {selectedTeam.abbreviation}
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

      {/* GM Persona Preview */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
          Your GM Profile
        </h3>

        {/* Persona Icons */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-base font-bold text-primary">
            {archetype.icon}
          </div>
          <span className="text-lg text-muted-foreground">+</span>
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-base font-bold text-primary">
            {background.icon}
          </div>
        </div>

        {/* Names */}
        <div className="text-center">
          {synergy && (
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
              "{synergy.name}"
            </p>
          )}
          <p className="font-semibold">
            {archetype.name} + {background.name}
          </p>
        </div>

        {/* Starting Skill */}
        <div className="bg-secondary/50 border border-border rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">Starting Skill</p>
          <p className="font-medium text-sm">
            {archetype.skill.name}{" "}
            <span className="text-muted-foreground">
              ({archetype.skill.tier})
            </span>
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
          <span className="text-muted-foreground">Difficulty:</span>{" "}
          <span className="font-medium">Normal</span>
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
