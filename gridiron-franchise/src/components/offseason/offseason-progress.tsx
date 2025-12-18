"use client";

import { Check, Lock, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useOffseasonStore,
  OffseasonPhase,
  PhaseStatus,
  PHASE_METADATA,
} from "@/stores/offseason-store";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OffseasonProgressProps {
  /** Show compact version (just indicators) vs full version (with labels) */
  variant?: "compact" | "full";
  /** Optional class name */
  className?: string;
}

interface PhaseIndicatorProps {
  phase: OffseasonPhase;
  status: PhaseStatus;
  isCurrent: boolean;
  variant: "compact" | "full";
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Icon Component
// ─────────────────────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: PhaseStatus }) {
  switch (status) {
    case "completed":
      return <Check className="w-4 h-4" />;
    case "in-progress":
      return <CircleDot className="w-4 h-4" />;
    case "locked":
      return <Lock className="w-3 h-3" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-current" />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase Indicator Component
// ─────────────────────────────────────────────────────────────────────────────

function PhaseIndicator({ phase, status, isCurrent, variant }: PhaseIndicatorProps) {
  const metadata = PHASE_METADATA[phase];

  const statusStyles = {
    completed: "bg-green-500/20 text-green-500 border-green-500/30",
    "in-progress": "bg-primary/20 text-primary border-primary/30",
    available: "bg-secondary text-foreground border-border",
    locked: "bg-secondary/50 text-muted-foreground border-border/50",
  };

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
          statusStyles[status],
          isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background"
        )}
        title={`${metadata.label}: ${status}`}
      >
        <StatusIcon status={status} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
          statusStyles[status],
          isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background"
        )}
      >
        <StatusIcon status={status} />
      </div>
      <span
        className={cn(
          "text-[10px] font-medium text-center max-w-[50px] leading-tight",
          status === "locked" ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {metadata.label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Connector Line Component
// ─────────────────────────────────────────────────────────────────────────────

function ConnectorLine({ completed }: { completed: boolean }) {
  return (
    <div
      className={cn(
        "flex-1 h-0.5 mx-1 transition-colors",
        completed ? "bg-green-500/50" : "bg-border"
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function OffseasonProgress({
  variant = "full",
  className,
}: OffseasonProgressProps) {
  const phases = useOffseasonStore((state) => state.phases);
  const currentPhase = useOffseasonStore((state) => state.currentPhase);
  const progressPercentage = useOffseasonStore((state) => state.getProgressPercentage());

  const phaseOrder: OffseasonPhase[] = ["scouting", "combine", "pro-days", "free-agency", "draft", "rookie-camp"];

  return (
    <div className={cn("w-full", className)}>
      {/* Progress Bar (compact only) */}
      {variant === "compact" && (
        <div className="mb-2">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right mt-1">
            {progressPercentage}% Complete
          </p>
        </div>
      )}

      {/* Phase Indicators */}
      <div className="flex items-center justify-between">
        {phaseOrder.map((phase, index) => {
          const phaseData = phases.find((p) => p.phase === phase);
          const status = phaseData?.status || "locked";
          const isCurrent = currentPhase === phase;
          const isCompleted = status === "completed";

          return (
            <div key={phase} className="flex items-center flex-1 last:flex-none">
              <PhaseIndicator
                phase={phase}
                status={status}
                isCurrent={isCurrent}
                variant={variant}
              />
              {index < phaseOrder.length - 1 && (
                <ConnectorLine completed={isCompleted} />
              )}
            </div>
          );
        })}
      </div>

      {/* Summary (full only) */}
      {variant === "full" && (
        <div className="mt-4 text-center">
          <div className="h-2 bg-secondary rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {progressPercentage}% of offseason complete
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase Card Component (for hub page)
// ─────────────────────────────────────────────────────────────────────────────

interface PhaseCardProps {
  phase: OffseasonPhase;
  onClick?: () => void;
}

export function PhaseCard({ phase, onClick }: PhaseCardProps) {
  const phaseData = useOffseasonStore((state) =>
    state.phases.find((p) => p.phase === phase)
  );
  const currentPhase = useOffseasonStore((state) => state.currentPhase);

  const status = phaseData?.status || "locked";
  const isCurrent = currentPhase === phase;
  const metadata = PHASE_METADATA[phase];

  const statusBadge = {
    completed: { text: "Complete", className: "bg-green-500/20 text-green-500" },
    "in-progress": { text: "In Progress", className: "bg-primary/20 text-primary" },
    available: { text: "Available", className: "bg-blue-500/20 text-blue-500" },
    locked: { text: "Locked", className: "bg-secondary text-muted-foreground" },
  };

  const badge = statusBadge[status];

  const isClickable = status !== "locked";

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all",
        isClickable && "hover:bg-secondary/80 active:scale-[0.98]",
        !isClickable && "cursor-not-allowed opacity-60",
        isCurrent && "ring-2 ring-primary",
        status === "completed" && "border-green-500/30",
        status === "in-progress" && "border-primary/30",
        status === "available" && "border-border",
        status === "locked" && "border-border/50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            status === "completed" && "bg-green-500/20 text-green-500",
            status === "in-progress" && "bg-primary/20 text-primary",
            status === "available" && "bg-secondary text-foreground",
            status === "locked" && "bg-secondary/50 text-muted-foreground"
          )}
        >
          <StatusIcon status={status} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">{metadata.label}</h3>
            <span className="text-xs text-muted-foreground">
              {metadata.week}
            </span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                badge.className
              )}
            >
              {badge.text}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {metadata.description}
          </p>
        </div>
      </div>
    </button>
  );
}
