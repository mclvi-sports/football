/**
 * Perk Activation Feed
 *
 * Shows a live feed of scout perk activations during scouting.
 * Visual callouts when perks trigger (sleeper found, bust flagged, etc.)
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useMemo } from "react";
import {
  Sparkles,
  AlertTriangle,
  Eye,
  Zap,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PerkActivation } from "@/lib/scouting-hub/types";

// ============================================================================
// TYPES
// ============================================================================

interface PerkActivationFeedProps {
  activations: PerkActivation[];
  maxDisplay?: number;
  compact?: boolean;
  onProspectClick?: (prospectId: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ACTIVATION_CONFIG = {
  sleeper_found: {
    icon: Sparkles,
    label: "Sleeper Found",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  bust_flagged: {
    icon: AlertTriangle,
    label: "Bust Flagged",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  trait_revealed: {
    icon: Eye,
    label: "Trait Revealed",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  high_potential: {
    icon: Zap,
    label: "High Potential",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function PerkActivationFeed({
  activations,
  maxDisplay = 10,
  compact = false,
  onProspectClick,
}: PerkActivationFeedProps) {
  // Sort by timestamp (newest first) and limit display
  const sortedActivations = useMemo(() => {
    return [...activations]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxDisplay);
  }, [activations, maxDisplay]);

  if (sortedActivations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Sparkles className="w-6 h-6 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No perk activations yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Scout perks will trigger as reports are generated
        </p>
      </div>
    );
  }

  if (compact) {
    return <CompactFeed activations={sortedActivations} onProspectClick={onProspectClick} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Perk Activations</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {activations.length} total
        </Badge>
      </div>

      <div className="space-y-2">
        {sortedActivations.map((activation) => (
          <ActivationCard
            key={activation.id}
            activation={activation}
            onClick={() => onProspectClick?.(activation.prospectId)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ACTIVATION CARD
// ============================================================================

interface ActivationCardProps {
  activation: PerkActivation;
  onClick?: () => void;
}

function ActivationCard({ activation, onClick }: ActivationCardProps) {
  const config = ACTIVATION_CONFIG[activation.activationType];
  const Icon = config.icon;

  const timeAgo = formatTimeAgo(activation.timestamp);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition-all hover:bg-secondary/30",
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            config.bgColor
          )}
        >
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={cn("text-[10px]", config.color)}>
              {config.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>

          <p className="font-medium text-sm">{activation.prospectName}</p>
          <p className="text-xs text-muted-foreground truncate">{activation.effect}</p>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-[10px]">
              {activation.perkName}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              by {activation.scoutName}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// COMPACT FEED
// ============================================================================

interface CompactFeedProps {
  activations: PerkActivation[];
  onProspectClick?: (prospectId: string) => void;
}

function CompactFeed({ activations, onProspectClick }: CompactFeedProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-secondary/20">
      <div className="px-3 py-2 bg-secondary/50 border-b border-border/50 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Recent Activations</span>
        <Badge variant="outline" className="ml-auto text-[10px]">
          {activations.length}
        </Badge>
      </div>

      <div className="divide-y divide-border/30 max-h-64 overflow-y-auto">
        {activations.map((activation) => {
          const config = ACTIVATION_CONFIG[activation.activationType];
          const Icon = config.icon;

          return (
            <button
              key={activation.id}
              onClick={() => onProspectClick?.(activation.prospectId)}
              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-secondary/30 transition-colors text-left"
            >
              <Icon className={cn("w-4 h-4 shrink-0", config.color)} />
              <span className="flex-1 truncate text-sm">{activation.prospectName}</span>
              <Badge
                variant="outline"
                className={cn("text-[10px] shrink-0", config.color)}
              >
                {config.label}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// ACTIVATION TOAST (for real-time notifications)
// ============================================================================

interface ActivationToastProps {
  activation: PerkActivation;
  onDismiss?: () => void;
  onProspectClick?: (prospectId: string) => void;
}

export function ActivationToast({
  activation,
  onDismiss,
  onProspectClick,
}: ActivationToastProps) {
  const config = ACTIVATION_CONFIG[activation.activationType];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4",
        "rounded-xl border shadow-lg p-3 min-w-72 max-w-sm",
        config.borderColor,
        "bg-background"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            config.bgColor
          )}
        >
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("text-xs font-medium", config.color)}>
              {config.label}
            </span>
          </div>
          <p className="font-medium text-sm">{activation.prospectName}</p>
          <p className="text-xs text-muted-foreground">{activation.perkName}</p>
        </div>

        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          ×
        </button>
      </div>

      <button
        onClick={() => onProspectClick?.(activation.prospectId)}
        className="w-full mt-2 text-xs text-primary hover:underline text-center"
      >
        View Prospect
      </button>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
