"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOffseasonStore } from "@/stores/offseason-store";
import CombinePageContent from "@/app/dashboard/combine/page";

/**
 * Offseason Combine Page
 *
 * Wraps the existing combine page and integrates with offseason flow.
 * - Sets phase to in-progress when entering
 * - Adds header with back button and Done button
 * - Marks phase complete when user clicks Done
 */
export default function OffseasonCombinePage() {
  const router = useRouter();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();

  // Mark combine as in-progress when entering
  useEffect(() => {
    if (!isPhaseCompleted("combine")) {
      setPhaseStatus("combine", "in-progress");
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  const handleComplete = () => {
    completePhase("combine");
    router.push("/dashboard/offseason");
  };

  return (
    <div className="pb-24">
      {/* Offseason Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/offseason")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">NFL Combine</h1>
            <p className="text-xs text-muted-foreground">
              Week 19 • Athletic Testing
            </p>
          </div>
          <Button onClick={handleComplete}>Done</Button>
        </div>
      </header>

      {/* Combine Content */}
      <CombinePageContent />
    </div>
  );
}
