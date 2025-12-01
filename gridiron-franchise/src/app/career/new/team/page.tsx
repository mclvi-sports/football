"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { teams } from "@/data/teams";
import { TeamList } from "@/components/career/team-list";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";

export default function TeamSelectionPage() {
  const router = useRouter();
  const { persona, selectedTeam, setTeam } = useCareerStore();

  // Redirect if no persona
  useEffect(() => {
    if (!persona) {
      router.replace("/career/new/archetype");
    }
  }, [persona, router]);

  function handleNext() {
    if (selectedTeam) {
      router.push("/career/new/confirm");
    }
  }

  if (!persona) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/career/new/persona"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">Select Team</h1>
      </div>

      {/* Team List */}
      <TeamList
        teams={teams}
        selectedTeam={selectedTeam}
        onSelectTeam={setTeam}
      />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-[400px] mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selectedTeam}
            className="w-full"
            size="lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
