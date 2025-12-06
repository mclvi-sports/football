"use client";

import { Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type SortOption = "ovr-desc" | "ovr-asc" | "name" | "position" | "age";

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "ovr-desc", label: "Overall (High to Low)" },
  { id: "ovr-asc", label: "Overall (Low to High)" },
  { id: "name", label: "Name (A-Z)" },
  { id: "position", label: "Position" },
  { id: "age", label: "Age (Youngest First)" },
];

interface RosterSortSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function RosterSortSheet({
  open,
  onOpenChange,
  sortBy,
  onSortChange,
}: RosterSortSheetProps) {
  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Sort By</SheetTitle>
        </SheetHeader>
        <div className="space-y-1 pb-6">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={cn(
                "w-full flex items-center justify-between",
                "px-4 py-3 rounded-lg",
                "text-left transition-colors",
                sortBy === option.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary"
              )}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {sortBy === option.id && <Check className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
