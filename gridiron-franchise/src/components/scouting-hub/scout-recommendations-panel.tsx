/**
 * Scout Recommendations Panel
 *
 * Displays scout recommendations grouped by scout and type.
 * Shows confidence levels and perk triggers.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useMemo } from "react";
import {
  User,
  Star,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScoutRecommendation } from "@/lib/scouting-hub/types";

// ============================================================================
// TYPES
// ============================================================================

interface ScoutRecommendationsPanelProps {
  recommendations: ScoutRecommendation[];
  onProspectClick?: (prospectId: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TYPE_CONFIG = {
  top_prospect: {
    icon: Star,
    label: "Top Prospect",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  sleeper: {
    icon: Sparkles,
    label: "Hidden Gem",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  bust_warning: {
    icon: AlertTriangle,
    label: "Bust Warning",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  best_available: {
    icon: Award,
    label: "Best Available",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
};

const ROLE_LABELS = {
  director: "Scouting Director",
  area: "Area Scout",
  pro: "Pro Scout",
  national: "National Scout",
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ScoutRecommendationsPanel({
  recommendations,
  onProspectClick,
}: ScoutRecommendationsPanelProps) {
  // Group recommendations by scout
  const byScout = useMemo(() => {
    const grouped = new Map<string, ScoutRecommendation[]>();
    for (const rec of recommendations) {
      const current = grouped.get(rec.scoutId) || [];
      grouped.set(rec.scoutId, [...current, rec]);
    }
    return grouped;
  }, [recommendations]);

  // Sort scouts by role priority (director first)
  const sortedScouts = useMemo(() => {
    const entries = Array.from(byScout.entries());
    const rolePriority = { director: 0, national: 1, area: 2, pro: 3 };
    return entries.sort((a, b) => {
      const roleA = a[1][0]?.scoutRole || "area";
      const roleB = b[1][0]?.scoutRole || "area";
      return rolePriority[roleA] - rolePriority[roleB];
    });
  }, [byScout]);

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          No scout recommendations available yet.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Recommendations will appear as scouts evaluate prospects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedScouts.map(([scoutId, recs]) => {
        const firstRec = recs[0];
        if (!firstRec) return null;

        return (
          <div
            key={scoutId}
            className="rounded-xl border border-border bg-secondary/20 overflow-hidden"
          >
            {/* Scout Header */}
            <div className="px-4 py-3 bg-secondary/50 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{firstRec.scoutName}</p>
                  <p className="text-xs text-muted-foreground">
                    {ROLE_LABELS[firstRec.scoutRole]}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {recs.length} {recs.length === 1 ? "pick" : "picks"}
                </Badge>
              </div>
            </div>

            {/* Recommendations */}
            <div className="divide-y divide-border/30">
              {recs.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onClick={() => onProspectClick?.(rec.prospectId)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// RECOMMENDATION CARD
// ============================================================================

interface RecommendationCardProps {
  recommendation: ScoutRecommendation;
  onClick?: () => void;
}

function RecommendationCard({ recommendation, onClick }: RecommendationCardProps) {
  const config = TYPE_CONFIG[recommendation.type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left"
    >
      {/* Type Icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          config.bgColor
        )}
      >
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{recommendation.prospectName}</p>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {recommendation.position}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {recommendation.reason}
        </p>
        {recommendation.perkTriggered && (
          <div className="flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-purple-400">
              {formatPerkName(recommendation.perkTriggered)}
            </span>
          </div>
        )}
      </div>

      {/* Confidence */}
      <div className="text-right shrink-0">
        <ConfidenceMeter confidence={recommendation.confidence} />
        <p className="text-[10px] text-muted-foreground mt-0.5">{config.label}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// ============================================================================
// CONFIDENCE METER
// ============================================================================

interface ConfidenceMeterProps {
  confidence: number;
}

function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  const getColor = () => {
    if (confidence >= 80) return "text-green-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            confidence >= 80 ? "bg-green-500" : confidence >= 60 ? "bg-yellow-500" : "bg-orange-500"
          )}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className={cn("text-xs font-medium", getColor())}>{confidence}%</span>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatPerkName(perkId: string): string {
  return perkId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
