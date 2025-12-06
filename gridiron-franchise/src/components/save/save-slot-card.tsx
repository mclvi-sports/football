"use client";

import { Save, Trash2, Download, Clock } from "lucide-react";
import type { SaveSlot } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SaveSlotCardProps {
  slot: SaveSlot;
  onSave: (slotNumber: number) => void;
  onLoad: (saveId: string) => void;
  onDelete: (saveId: string) => void;
  isLoading?: boolean;
}

export function SaveSlotCard({
  slot,
  onSave,
  onLoad,
  onDelete,
  isLoading,
}: SaveSlotCardProps) {
  if (slot.isEmpty) {
    return (
      <div className="bg-secondary/30 border border-border border-dashed rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground font-bold">
                {slot.slotNumber}
              </span>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Empty Slot</div>
              <div className="text-xs text-muted-foreground/60">
                No save data
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSave(slot.slotNumber)}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold",
              "bg-primary/20 text-primary"
            )}
          >
            {slot.slotNumber}
          </div>
          <div>
            <div className="font-medium text-sm">{slot.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(slot.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-background/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground uppercase">Team</div>
          <div className="text-xs font-medium truncate">
            {slot.teamName || "—"}
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground uppercase">
            Season
          </div>
          <div className="text-xs font-medium">{slot.season}</div>
        </div>
        <div className="bg-background/50 rounded-lg p-2">
          <div className="text-[10px] text-muted-foreground uppercase">Week</div>
          <div className="text-xs font-medium">{slot.week}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          className="flex-1"
          onClick={() => onLoad(slot.id)}
          disabled={isLoading}
        >
          <Download className="w-4 h-4 mr-1" />
          Load
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => onSave(slot.slotNumber)}
          disabled={isLoading}
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(slot.id)}
          disabled={isLoading}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
