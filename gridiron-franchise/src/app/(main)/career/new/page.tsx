"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { teams, Team } from "@/data/teams";
import { TeamList } from "@/components/career/team-list";
import { Button } from "@/components/ui/button";

export default function NewCareerPage() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  function handleNext() {
    if (selectedTeam) {
      router.push(`/career/new/confirm?team=${selectedTeam.id}`);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">Select Team</h1>
      </div>

      {/* Team List */}
      <TeamList
        teams={teams}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
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
