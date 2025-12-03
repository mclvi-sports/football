"use client";

import { PracticeFocusType, PracticeIntensity } from "@/lib/training/types";
import { PRACTICE_BASE_XP, PRACTICE_INTENSITY_MODIFIERS } from "@/lib/training";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PracticeFocusSelectorProps {
  currentFocus: PracticeFocusType;
  currentIntensity: PracticeIntensity;
  onFocusChange: (focus: PracticeFocusType) => void;
  onIntensityChange: (intensity: PracticeIntensity) => void;
  disabled?: boolean;
}

const FOCUS_OPTIONS: {
  value: PracticeFocusType;
  label: string;
  description: string;
  icon: string;
  positions: string;
}[] = [
  {
    value: "passing",
    label: "Passing Game",
    description: "QB, WR, TE development",
    icon: "🏈",
    positions: "QB, WR, TE",
  },
  {
    value: "running",
    label: "Running Game",
    description: "RB, OL development",
    icon: "🏃",
    positions: "RB, OL",
  },
  {
    value: "pass_rush",
    label: "Pass Rush",
    description: "DE, DT, OLB development",
    icon: "💨",
    positions: "DE, DT, OLB",
  },
  {
    value: "coverage",
    label: "Coverage",
    description: "CB, S, LB development",
    icon: "🛡️",
    positions: "CB, FS, SS, LB",
  },
  {
    value: "red_zone_offense",
    label: "Red Zone Offense",
    description: "Scoring plays",
    icon: "🎯",
    positions: "QB, WR, TE, RB",
  },
  {
    value: "red_zone_defense",
    label: "Red Zone Defense",
    description: "Goal line stands",
    icon: "🚫",
    positions: "DL, LB, DB",
  },
  {
    value: "special_teams",
    label: "Special Teams",
    description: "K, P development",
    icon: "⚡",
    positions: "K, P",
  },
  {
    value: "conditioning",
    label: "Conditioning",
    description: "All players benefit",
    icon: "💪",
    positions: "All",
  },
  {
    value: "film_study",
    label: "Film Study",
    description: "Mental development",
    icon: "📺",
    positions: "All",
  },
  {
    value: "recovery",
    label: "Recovery",
    description: "Rest and heal",
    icon: "🩹",
    positions: "All",
  },
];

const INTENSITY_OPTIONS: {
  value: PracticeIntensity;
  label: string;
  modifier: number;
  risk: string;
}[] = [
  { value: "light", label: "Light", modifier: PRACTICE_INTENSITY_MODIFIERS.light, risk: "Very Low" },
  { value: "normal", label: "Normal", modifier: PRACTICE_INTENSITY_MODIFIERS.normal, risk: "Normal" },
  { value: "high", label: "High", modifier: PRACTICE_INTENSITY_MODIFIERS.high, risk: "Elevated" },
];

export function PracticeFocusSelector({
  currentFocus,
  currentIntensity,
  onFocusChange,
  onIntensityChange,
  disabled = false,
}: PracticeFocusSelectorProps) {
  const selectedFocusOption = FOCUS_OPTIONS.find((f) => f.value === currentFocus);
  const baseXP = PRACTICE_BASE_XP[currentFocus];
  const intensityMod = PRACTICE_INTENSITY_MODIFIERS[currentIntensity];
  const estimatedXP = Math.round(baseXP * intensityMod);

  return (
    <div className="space-y-4">
      {/* Focus Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Practice Focus</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FOCUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => !disabled && onFocusChange(option.value)}
              disabled={disabled}
              className={cn(
                "p-3 rounded-xl border text-left transition-colors",
                currentFocus === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/50 hover:bg-secondary",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="text-lg mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
              <div className="text-[10px] text-muted-foreground">{option.positions}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Focus Details */}
      {selectedFocusOption && (
        <div className="bg-secondary rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{selectedFocusOption.icon}</span>
            <div>
              <div className="font-medium">{selectedFocusOption.label}</div>
              <div className="text-xs text-muted-foreground">
                {selectedFocusOption.description}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Affected Positions: {selectedFocusOption.positions}
          </div>
        </div>
      )}

      {/* Intensity Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Practice Intensity</h3>
        <div className="flex gap-2">
          {INTENSITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => !disabled && onIntensityChange(option.value)}
              disabled={disabled}
              className={cn(
                "flex-1 p-3 rounded-xl border text-center transition-colors",
                currentIntensity === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/50 hover:bg-secondary",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round(option.modifier * 100)}% XP
              </div>
              <div className="text-[10px] text-muted-foreground">
                Injury Risk: {option.risk}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* XP Estimate */}
      <div className="bg-secondary/50 rounded-xl p-3 text-center">
        <div className="text-xs text-muted-foreground mb-1">Estimated XP per Player</div>
        <div className="text-2xl font-bold text-primary">{estimatedXP}</div>
        <div className="text-xs text-muted-foreground">
          (Base {baseXP} × {Math.round(intensityMod * 100)}% intensity)
        </div>
      </div>
    </div>
  );
}
