"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Timer, MapPin, UserPlus, GraduationCap, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";
import {
  useOffseasonStore,
  OffseasonPhase,
  PHASE_METADATA,
  PHASE_WEEKS,
} from "@/stores/offseason-store";
import { OffseasonProgress, PhaseCard } from "@/components/offseason/offseason-progress";

// Phase order for rendering
const PHASE_ORDER: OffseasonPhase[] = [
  "scouting",
  "combine",
  "pro-days",
  "free-agency",
  "draft",
  "rookie-camp",
];

export default function OffseasonHubPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();
  const {
    offseasonStarted,
    offseasonComplete,
    currentSeason,
    startOffseason,
    phases,
    _hasHydrated: offseasonHydrated,
  } = useOffseasonStore();

  // Redirect if no team selected
  useEffect(() => {
    if (_hasHydrated && !selectedTeam) {
      router.replace("/");
    }
  }, [selectedTeam, _hasHydrated, router]);

  // Auto-start offseason if not started
  useEffect(() => {
    if (offseasonHydrated && !offseasonStarted) {
      startOffseason(new Date().getFullYear());
    }
  }, [offseasonHydrated, offseasonStarted, startOffseason]);

  // Wait for hydration
  if (!_hasHydrated || !offseasonHydrated || !selectedTeam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const handlePhaseClick = (phase: OffseasonPhase) => {
    const phaseData = phases.find((p) => p.phase === phase);
    if (phaseData?.status !== "locked") {
      router.push(PHASE_METADATA[phase].href);
    }
  };

  const handleCompleteOffseason = () => {
    router.push("/dashboard");
  };

  // Calculate current week based on completed phases
  const getCurrentWeek = () => {
    const lastCompleted = [...phases]
      .reverse()
      .find((p) => p.status === "completed");
    if (!lastCompleted) return 1;
    return PHASE_WEEKS[lastCompleted.phase].end;
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{currentSeason} Offseason</h1>
            <p className="text-xs text-muted-foreground">
              Week {getCurrentWeek()} • {selectedTeam.city} {selectedTeam.name}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-5 pt-4 space-y-6">
        {/* Progress Tracker */}
        <div className="bg-secondary/30 border border-border rounded-xl p-4">
          <OffseasonProgress variant="full" />
        </div>

        {/* Phase Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Offseason Activities
          </h2>

          {PHASE_ORDER.map((phase) => (
            <PhaseCard
              key={phase}
              phase={phase}
              onClick={() => handlePhaseClick(phase)}
            />
          ))}
        </div>

        {/* Complete Offseason Button */}
        {offseasonComplete && (
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleCompleteOffseason}
            >
              Continue to Season
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-secondary/30 border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">
              {phases.filter((p) => p.status === "completed").length}
            </p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">
              {phases.filter((p) => p.status === "in-progress").length}
            </p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-secondary/30 border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">
              {phases.filter((p) => p.status === "locked").length}
            </p>
            <p className="text-xs text-muted-foreground">Locked</p>
          </div>
        </div>
      </main>
    </div>
  );
}
