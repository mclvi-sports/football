"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTeamById } from "@/data/teams";
import { Button } from "@/components/ui/button";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const teamId = searchParams.get("team");
  const team = teamId ? getTeamById(teamId) : null;

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No team selected</p>
        <Link href="/career/new" className="text-primary hover:underline mt-4 block">
          ← Back to team selection
        </Link>
      </div>
    );
  }

  function handleStartCareer() {
    // TODO: Initialize career in store
    // For now, redirect to main menu
    router.push("/");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/career/new"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">Confirm Selection</h1>
      </div>

      {/* Team Preview */}
      <div className="text-center space-y-6">
        {/* Team Logo */}
        <div
          className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg"
          style={{
            backgroundColor: team.colors.primary,
            color: team.colors.secondary,
          }}
        >
          {team.abbreviation}
        </div>

        {/* Team Info */}
        <div>
          <p className="text-muted-foreground">{team.city}</p>
          <h2 className="text-3xl font-bold">{team.name}</h2>
          <p className="text-sm text-muted-foreground mt-2">{team.division}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Career Info */}
        <div className="bg-card border border-border rounded-xl p-4 text-left space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Conference:</span>{" "}
            <span className="font-medium">{team.conference}</span>
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
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <Button onClick={handleStartCareer} className="w-full" size="lg">
          Start Career
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/career/new")}
          className="w-full"
        >
          Change Team
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmCareerPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
