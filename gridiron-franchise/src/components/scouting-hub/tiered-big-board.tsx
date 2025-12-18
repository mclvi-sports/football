/**
 * Tiered Big Board
 *
 * User's custom draft board with 5 tiers:
 * - Elite: Must draft if available
 * - Starters: Day 1 starters
 * - Contributors: Rotational players
 * - Depth: Practice squad / depth
 * - Do Not Draft: Avoid
 *
 * Supports click-to-move between tiers (mobile-friendly).
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { useState, useMemo } from "react";
import {
  Crown,
  Star,
  Users,
  Layers,
  Ban,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useScoutingHubStore } from "@/stores/scouting-hub-store";
import { useDraftStore } from "@/stores/draft-store";
import type { DraftProspect } from "@/lib/generators/draft-generator";
import type { BoardTier, TieredBoard } from "@/lib/scouting-hub/types";
import { BOARD_TIER_INFO } from "@/lib/scouting-hub/types";

// ============================================================================
// TYPES
// ============================================================================

interface TieredBigBoardProps {
  onProspectClick?: (prospectId: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TIER_ORDER: BoardTier[] = ["elite", "starters", "contributors", "depth", "do_not_draft"];

const TIER_ICONS: Record<BoardTier, typeof Crown> = {
  elite: Crown,
  starters: Star,
  contributors: Users,
  depth: Layers,
  do_not_draft: Ban,
};

// ============================================================================
// COMPONENT
// ============================================================================

export function TieredBigBoard({ onProspectClick }: TieredBigBoardProps) {
  const { draftClass } = useDraftStore();
  const {
    tieredBoard,
    moveProspectToTier,
    removeProspectFromBoard,
  } = useScoutingHubStore();

  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addToTier, setAddToTier] = useState<BoardTier | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<string | null>(null);

  // Get prospects not on board
  const prospectsOnBoard = useMemo(() => {
    const allIds = new Set<string>();
    for (const tier of TIER_ORDER) {
      for (const id of tieredBoard[tier]) {
        allIds.add(id);
      }
    }
    return allIds;
  }, [tieredBoard]);

  // Map prospect IDs to data
  const prospectMap = useMemo(() => {
    return new Map(draftClass.map((p) => [p.id, p]));
  }, [draftClass]);

  const handleAddToTier = (tier: BoardTier) => {
    setAddToTier(tier);
    setAddSheetOpen(true);
  };

  const handleSelectProspect = (prospectId: string) => {
    if (addToTier) {
      moveProspectToTier(prospectId, addToTier);
      setAddSheetOpen(false);
      setAddToTier(null);
    }
  };

  const handleMoveUp = (prospectId: string, currentTier: BoardTier) => {
    const currentIndex = TIER_ORDER.indexOf(currentTier);
    if (currentIndex > 0) {
      moveProspectToTier(prospectId, TIER_ORDER[currentIndex - 1]);
    }
  };

  const handleMoveDown = (prospectId: string, currentTier: BoardTier) => {
    const currentIndex = TIER_ORDER.indexOf(currentTier);
    if (currentIndex < TIER_ORDER.length - 1) {
      moveProspectToTier(prospectId, TIER_ORDER[currentIndex + 1]);
    }
  };

  const totalOnBoard = TIER_ORDER.reduce(
    (sum, tier) => sum + tieredBoard[tier].length,
    0
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Your Big Board</h2>
          <p className="text-xs text-muted-foreground">
            {totalOnBoard} prospects ranked
          </p>
        </div>
      </div>

      {/* Tiers */}
      <div className="space-y-3">
        {TIER_ORDER.map((tier) => (
          <TierSection
            key={tier}
            tier={tier}
            prospectIds={tieredBoard[tier]}
            prospectMap={prospectMap}
            onAdd={() => handleAddToTier(tier)}
            onMoveUp={(id) => handleMoveUp(id, tier)}
            onMoveDown={(id) => handleMoveDown(id, tier)}
            onRemove={removeProspectFromBoard}
            onProspectClick={onProspectClick}
            isFirst={tier === "elite"}
            isLast={tier === "do_not_draft"}
          />
        ))}
      </div>

      {/* Add Prospect Sheet */}
      <AddProspectSheet
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        tier={addToTier}
        prospects={draftClass}
        prospectsOnBoard={prospectsOnBoard}
        onSelect={handleSelectProspect}
      />
    </div>
  );
}

// ============================================================================
// TIER SECTION
// ============================================================================

interface TierSectionProps {
  tier: BoardTier;
  prospectIds: string[];
  prospectMap: Map<string, DraftProspect>;
  onAdd: () => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
  onProspectClick?: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

function TierSection({
  tier,
  prospectIds,
  prospectMap,
  onAdd,
  onMoveUp,
  onMoveDown,
  onRemove,
  onProspectClick,
  isFirst,
  isLast,
}: TierSectionProps) {
  const info = BOARD_TIER_INFO[tier];
  const Icon = TIER_ICONS[tier];

  return (
    <div className={cn("rounded-xl border overflow-hidden", info.color)}>
      {/* Tier Header */}
      <div className="px-4 py-2 bg-secondary/30 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="font-medium text-sm">{info.label}</span>
          <span className="text-xs text-muted-foreground">
            ({prospectIds.length})
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2"
          onClick={onAdd}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Prospects */}
      <div className="divide-y divide-border/20">
        {prospectIds.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {info.description}
          </div>
        ) : (
          prospectIds.map((id, index) => {
            const prospect = prospectMap.get(id);
            if (!prospect) return null;

            return (
              <ProspectRow
                key={id}
                prospect={prospect}
                rank={index + 1}
                onMoveUp={() => onMoveUp(id)}
                onMoveDown={() => onMoveDown(id)}
                onRemove={() => onRemove(id)}
                onClick={() => onProspectClick?.(id)}
                canMoveUp={!isFirst}
                canMoveDown={!isLast}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PROSPECT ROW
// ============================================================================

interface ProspectRowProps {
  prospect: DraftProspect;
  rank: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onClick?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function ProspectRow({
  prospect,
  rank,
  onMoveUp,
  onMoveDown,
  onRemove,
  onClick,
  canMoveUp,
  canMoveDown,
}: ProspectRowProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 hover:bg-secondary/20 transition-colors">
      {/* Rank */}
      <span className="w-5 text-xs text-muted-foreground text-right">{rank}</span>

      {/* Info - Clickable */}
      <button
        onClick={onClick}
        className="flex-1 flex items-center gap-2 min-w-0 text-left"
      >
        <Badge variant="outline" className="text-[10px] shrink-0">
          {prospect.position}
        </Badge>
        <span className="truncate text-sm font-medium">
          {prospect.firstName} {prospect.lastName}
        </span>
        <span className="text-sm font-bold ml-auto shrink-0">
          {prospect.scoutedOvr}
        </span>
      </button>

      {/* Move buttons */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1 rounded hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1 rounded hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-red-500/20 text-red-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ADD PROSPECT SHEET
// ============================================================================

interface AddProspectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: BoardTier | null;
  prospects: DraftProspect[];
  prospectsOnBoard: Set<string>;
  onSelect: (prospectId: string) => void;
}

function AddProspectSheet({
  open,
  onOpenChange,
  tier,
  prospects,
  prospectsOnBoard,
  onSelect,
}: AddProspectSheetProps) {
  const [search, setSearch] = useState("");

  const filteredProspects = useMemo(() => {
    const available = prospects.filter((p) => !prospectsOnBoard.has(p.id));

    if (!search) {
      return available.slice(0, 50); // Limit to 50 for performance
    }

    const query = search.toLowerCase();
    return available
      .filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.position.toLowerCase().includes(query)
      )
      .slice(0, 50);
  }, [prospects, prospectsOnBoard, search]);

  const tierInfo = tier ? BOARD_TIER_INFO[tier] : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh]">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            Add to {tierInfo?.label || "Board"}
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search prospects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Prospect List */}
        <div className="overflow-y-auto max-h-[calc(70vh-140px)] space-y-1">
          {filteredProspects.map((prospect) => (
            <button
              key={prospect.id}
              onClick={() => onSelect(prospect.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left"
            >
              <Badge variant="outline">{prospect.position}</Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {prospect.firstName} {prospect.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {prospect.collegeData?.name} • Rd {prospect.round}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{prospect.scoutedOvr}</p>
                <p className="text-[10px] text-muted-foreground">
                  {prospect.potentialLabel}
                </p>
              </div>
            </button>
          ))}

          {filteredProspects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No prospects found
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
