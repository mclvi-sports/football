/**
 * Prospect Comparison Tool
 *
 * Side-by-side comparison of 2-3 prospects.
 * Shows stats, measurables, traits, and staff opinions.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useMemo } from "react";
import { X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDraftStore } from "@/stores/draft-store";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import type { DraftProspect } from "@/lib/generators/draft-generator";

// ============================================================================
// TYPES
// ============================================================================

interface ProspectComparisonProps {
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProspectComparison({ onClose }: ProspectComparisonProps) {
  const { draftClass } = useDraftStore();
  const { comparisonProspects, removeFromComparison, clearComparison } =
    useScoutingHubStore();

  // Get full prospect data for comparison
  const prospects = useMemo(() => {
    const prospectMap = new Map(draftClass.map((p) => [p.id, p]));
    return comparisonProspects
      .map((id) => prospectMap.get(id))
      .filter((p): p is DraftProspect => p !== undefined);
  }, [draftClass, comparisonProspects]);

  if (prospects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No prospects to compare</p>
        <p className="text-xs text-muted-foreground mt-1">
          Select 2-3 prospects from the rankings to compare
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Compare Prospects</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto -mx-5 px-5">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${prospects.length}, minmax(140px, 1fr))`,
          }}
        >
          {/* Header Row - Names */}
          {prospects.map((prospect) => (
            <div
              key={prospect.id}
              className="rounded-t-xl border border-b-0 border-border bg-secondary/30 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Badge variant="outline" className="mb-1">
                    {prospect.position}
                  </Badge>
                  <p className="font-semibold text-sm truncate">
                    {prospect.firstName} {prospect.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {prospect.collegeData?.name}
                  </p>
                </div>
                <button
                  onClick={() => removeFromComparison(prospect.id)}
                  className="shrink-0 p-1 rounded hover:bg-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Stats Rows */}
          <ComparisonRow
            label="Scouted OVR"
            values={prospects.map((p) => ({
              value: p.scoutedOvr,
              display: p.scoutedOvr.toString(),
            }))}
            highlightBest
          />
          <ComparisonRow
            label="True OVR"
            values={prospects.map((p) => ({
              value: p.overall,
              display: p.overall.toString(),
            }))}
            highlightBest
          />
          <ComparisonRow
            label="Potential"
            values={prospects.map((p) => ({
              value: p.potential,
              display: p.potential.toString(),
            }))}
            highlightBest
          />
          <ComparisonRow
            label="Pot. Label"
            values={prospects.map((p) => ({
              value: 0,
              display: p.potentialLabel || "?",
            }))}
          />
          <ComparisonRow
            label="Age"
            values={prospects.map((p) => ({
              value: p.age,
              display: p.age.toString(),
            }))}
            highlightLowest
          />
          <ComparisonRow
            label="Round"
            values={prospects.map((p) => ({
              value: typeof p.round === "number" ? p.round : 8,
              display: p.round.toString(),
            }))}
            highlightLowest
          />

          {/* Physical Measurables */}
          <SectionHeader label="Measurables" colCount={prospects.length} />
          <ComparisonRow
            label="Height"
            values={prospects.map((p) => ({
              value: p.height || 0,
              display: formatHeight(p.height),
            }))}
          />
          <ComparisonRow
            label="Weight"
            values={prospects.map((p) => ({
              value: p.weight || 0,
              display: p.weight ? `${p.weight} lbs` : "-",
            }))}
          />
          <ComparisonRow
            label="40 Time"
            values={prospects.map((p) => ({
              value: p.fortyTime ? -p.fortyTime : 0, // Negative so lower is better
              display: p.fortyTime?.toFixed(2) || "-",
            }))}
            highlightBest
          />
          <ComparisonRow
            label="Vertical"
            values={prospects.map((p) => ({
              value: p.combineMeasurables?.verticalJump || 0,
              display: p.combineMeasurables?.verticalJump ? `${p.combineMeasurables.verticalJump}"` : "-",
            }))}
            highlightBest
          />
          <ComparisonRow
            label="Bench"
            values={prospects.map((p) => ({
              value: p.combineMeasurables?.benchPress || 0,
              display: p.combineMeasurables?.benchPress ? `${p.combineMeasurables.benchPress} reps` : "-",
            }))}
            highlightBest
          />

          {/* Traits */}
          <SectionHeader label="Traits" colCount={prospects.length} />
          {prospects.map((prospect) => (
            <div
              key={`traits-${prospect.id}`}
              className="border-x border-border bg-secondary/10 p-2"
            >
              <div className="flex flex-wrap gap-1">
                {prospect.traits && prospect.traits.length > 0 ? (
                  prospect.traits.map((trait) => (
                    <Badge
                      key={trait}
                      variant="secondary"
                      className="text-[9px]"
                    >
                      {formatTrait(trait)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No traits
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Footer */}
          {prospects.map((prospect) => (
            <div
              key={`footer-${prospect.id}`}
              className="rounded-b-xl border border-t-0 border-border bg-secondary/10 h-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPARISON ROW
// ============================================================================

interface ComparisonRowProps {
  label: string;
  values: { value: number; display: string }[];
  highlightBest?: boolean;
  highlightLowest?: boolean;
}

function ComparisonRow({
  label,
  values,
  highlightBest,
  highlightLowest,
}: ComparisonRowProps) {
  // Find best value
  const bestIndex = useMemo(() => {
    if (!highlightBest && !highlightLowest) return -1;
    if (values.length === 0) return -1;

    const validValues = values.filter((v) => v.value !== 0);
    if (validValues.length === 0) return -1;

    if (highlightBest) {
      const max = Math.max(...values.map((v) => v.value));
      return values.findIndex((v) => v.value === max);
    }
    if (highlightLowest) {
      const nonZeroValues = values.filter((v) => v.value > 0);
      if (nonZeroValues.length === 0) return -1;
      const min = Math.min(...nonZeroValues.map((v) => v.value));
      return values.findIndex((v) => v.value === min);
    }
    return -1;
  }, [values, highlightBest, highlightLowest]);

  return (
    <>
      {values.map((value, index) => (
        <div
          key={index}
          className={cn(
            "border-x border-border p-2 flex items-center justify-between",
            index === bestIndex && "bg-green-500/10"
          )}
        >
          <span className="text-xs text-muted-foreground">{label}</span>
          <span
            className={cn(
              "font-medium text-sm",
              index === bestIndex && "text-green-400"
            )}
          >
            {value.display}
          </span>
        </div>
      ))}
    </>
  );
}

// ============================================================================
// SECTION HEADER
// ============================================================================

interface SectionHeaderProps {
  label: string;
  colCount: number;
}

function SectionHeader({ label, colCount }: SectionHeaderProps) {
  return (
    <>
      {Array.from({ length: colCount }).map((_, i) => (
        <div
          key={i}
          className="border-x border-border bg-secondary/30 px-2 py-1"
        >
          {i === 0 && (
            <span className="text-xs font-semibold text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatHeight(inches?: number): string {
  if (!inches) return "-";
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
}

function formatTrait(trait: string): string {
  return trait
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// ============================================================================
// COMPARISON MODAL (Sheet)
// ============================================================================

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComparisonSheet({ open, onOpenChange }: ComparisonSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="pb-4">
          <SheetTitle>Prospect Comparison</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(80vh-80px)]">
          <ProspectComparison onClose={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
