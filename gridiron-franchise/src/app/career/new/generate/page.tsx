"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateLeagueData,
  GenerationStep,
  StepStatus,
  GENERATION_STEPS,
} from "@/lib/generators/league-generator";

type StepState = {
  id: GenerationStep;
  label: string;
  status: StepStatus;
};

const STEP_LABELS: Record<GenerationStep, string> = {
  rosters: "Team Rosters",
  freeagents: "Free Agents",
  draft: "Draft Class",
  gms: "General Managers",
  coaching: "Coaching Staffs",
  facilities: "Team Facilities",
  scouting: "Scouting Departments",
  schedule: "Season Schedule",
};

export default function GenerateLeaguePage() {
  const router = useRouter();
  const [steps, setSteps] = useState<StepState[]>(
    GENERATION_STEPS.map((id) => ({
      id,
      label: STEP_LABELS[id],
      status: "pending" as StepStatus,
    }))
  );
  const [error, setError] = useState<string | null>(null);

  const updateStep = useCallback((step: GenerationStep, status: StepStatus) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === step ? { ...s, status } : s))
    );
  }, []);

  const runGeneration = useCallback(async () => {
    setError(null);
    setSteps(
      GENERATION_STEPS.map((id) => ({
        id,
        label: STEP_LABELS[id],
        status: "pending" as StepStatus,
      }))
    );

    const success = await generateLeagueData({
      onStepChange: updateStep,
      onError: (step, err) => {
        setError(err.message);
      },
      onComplete: () => {
        // Redirect to team selection after short delay
        setTimeout(() => {
          router.push("/career/new/team");
        }, 500);
      },
    });

    if (!success && !error) {
      setError("Generation failed");
    }
  }, [router, updateStep, error]);

  useEffect(() => {
    runGeneration();
  }, [runGeneration]);

  const completedCount = steps.filter((s) => s.status === "complete").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-40px)] px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Creating Your League</h1>
          <p className="text-muted-foreground text-sm">
            Generating teams, players, and staff...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {completedCount} of {steps.length} complete
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                step.status === "complete" && "bg-secondary/50 border-primary/30",
                step.status === "loading" && "bg-secondary/30 border-primary/50",
                step.status === "error" && "bg-destructive/10 border-destructive/50",
                step.status === "pending" && "bg-background border-border"
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {step.status === "loading" && (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                )}
                {step.status === "complete" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
                {step.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                {step.status === "pending" && (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  step.status === "complete" && "text-foreground",
                  step.status === "loading" && "text-foreground font-medium",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-center">
            <p className="text-destructive text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                runGeneration();
              }}
              className="mt-2 text-xs underline text-muted-foreground hover:text-foreground"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
