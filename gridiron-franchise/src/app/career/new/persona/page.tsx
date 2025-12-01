"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PersonaSummary } from "@/components/career/persona/persona-summary";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";

export default function PersonaConfirmPage() {
  const router = useRouter();
  const { persona, buildPersona, selectedArchetype, selectedBackground } =
    useCareerStore();

  // Build persona on mount if we have selections
  useEffect(() => {
    if (selectedArchetype && selectedBackground && !persona) {
      buildPersona();
    }
  }, [selectedArchetype, selectedBackground, persona, buildPersona]);

  // Redirect if missing selections
  useEffect(() => {
    if (!selectedArchetype) {
      router.replace("/career/new/archetype");
    } else if (!selectedBackground) {
      router.replace("/career/new/background");
    }
  }, [selectedArchetype, selectedBackground, router]);

  function handleSelectTeam() {
    router.push("/career/new/team");
  }

  // Don't render until we have a persona
  if (!persona) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/career/new/background"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold flex-1">Your GM Profile</h1>
        <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
          Step 3/3
        </span>
      </div>

      {/* Persona Summary */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <PersonaSummary persona={persona} />
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-[400px] mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/career/new/background")}
            className="flex-1"
          >
            Change
          </Button>
          <Button onClick={handleSelectTeam} className="flex-1">
            Select Team →
          </Button>
        </div>
      </div>
    </div>
  );
}
