"use client";

import { Player } from "@/lib/types";
import { TrainingProgress, AgeCurve } from "@/lib/training/types";
import { getAgeCurve, getBadgeSlots } from "@/lib/training";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PlayerDevelopmentCardProps {
  player: Player;
  progress: TrainingProgress | null;
  compact?: boolean;
}

function getOvrColor(ovr: number): string {
  if (ovr >= 90) return "text-purple-400";
  if (ovr >= 80) return "text-green-400";
  if (ovr >= 70) return "text-yellow-400";
  if (ovr >= 60) return "text-orange-400";
  return "text-red-400";
}

function getXPColor(xp: number): string {
  if (xp >= 1000) return "text-purple-400";
  if (xp >= 500) return "text-green-400";
  if (xp >= 200) return "text-yellow-400";
  return "text-muted-foreground";
}

function getAgePhaseInfo(ageCurve: AgeCurve): { label: string; color: string } {
  switch (ageCurve.phase) {
    case "growth":
      return { label: "Growing", color: "text-green-400" };
    case "developing":
      return { label: "Developing", color: "text-emerald-400" };
    case "prime":
      return { label: "Prime", color: "text-blue-400" };
    case "maintenance":
      return { label: "Maintenance", color: "text-cyan-400" };
    case "early_decline":
      return { label: "Early Decline", color: "text-yellow-400" };
    case "declining":
      return { label: "Declining", color: "text-orange-400" };
    case "steep_decline":
      return { label: "Steep Decline", color: "text-red-400" };
    default:
      return { label: "Unknown", color: "text-muted-foreground" };
  }
}

export function PlayerDevelopmentCard({
  player,
  progress,
  compact = false,
}: PlayerDevelopmentCardProps) {
  const ageCurve = getAgeCurve(player.age);
  const agePhase = getAgePhaseInfo(ageCurve);
  const currentXP = progress?.currentXP || 0;
  const totalXP = progress?.totalXPEarned || 0;
  const seasonXP = progress?.seasonXP || 0;

  // Calculate potential gap
  const potentialGap = player.potential - player.overall;
  const potentialProgress = potentialGap > 0 ? ((player.overall - 40) / (player.potential - 40)) * 100 : 100;

  // Badge slots
  const badgeSlots = getBadgeSlots(player.overall);
  const usedBadgeSlots = player.badges?.length || 0;

  if (compact) {
    return (
      <div className="bg-secondary/50 border border-border rounded-xl p-3 flex items-center gap-3">
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg",
              getOvrColor(player.overall),
              "bg-secondary"
            )}
          >
            {player.overall}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">
              {player.firstName} {player.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {player.position}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={getXPColor(currentXP)}>{currentXP} XP</span>
            <span className={agePhase.color}>{agePhase.label}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">POT</div>
          <div className="font-semibold text-sm">{player.potential}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">
            {player.firstName} {player.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {player.position} · {player.archetype}
          </p>
        </div>
        <div className="text-right">
          <div
            className={cn("text-2xl font-bold", getOvrColor(player.overall))}
          >
            {player.overall}
          </div>
          <div className="text-xs text-muted-foreground">
            POT {player.potential}
          </div>
        </div>
      </div>

      {/* XP Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Available XP</div>
          <div className={cn("font-semibold", getXPColor(currentXP))}>
            {currentXP}
          </div>
        </div>
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Season XP</div>
          <div className="font-semibold">{seasonXP}</div>
        </div>
        <div className="bg-secondary rounded-lg p-2">
          <div className="text-xs text-muted-foreground">Career XP</div>
          <div className="font-semibold">{totalXP}</div>
        </div>
      </div>

      {/* Development Phase */}
      <div className="flex items-center justify-between bg-secondary rounded-lg p-2">
        <div>
          <div className="text-xs text-muted-foreground">Age {player.age}</div>
          <div className={cn("text-sm font-medium", agePhase.color)}>
            {agePhase.label}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Physical: {ageCurve.physicalChange > 0 ? "+" : ""}{ageCurve.physicalChange}</div>
          <div>Mental: {ageCurve.mentalChange > 0 ? "+" : ""}{ageCurve.mentalChange}</div>
        </div>
      </div>

      {/* Potential Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Potential Progress</span>
          <span>
            {player.overall} / {player.potential}
          </span>
        </div>
        <Progress value={potentialProgress} className="h-2" />
        {potentialGap > 0 && (
          <div className="text-xs text-muted-foreground">
            Room to grow: +{potentialGap} OVR
          </div>
        )}
      </div>

      {/* Badge Slots */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Badge Slots</span>
        <span>
          {usedBadgeSlots} / {badgeSlots}
        </span>
      </div>

      {/* XP Cost Modifier */}
      <div className="text-xs text-muted-foreground text-center">
        XP Cost Modifier: {Math.round(ageCurve.xpCostModifier * 100)}%
      </div>
    </div>
  );
}
