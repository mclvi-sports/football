"use client";

import { cn } from "@/lib/utils";

export type TabType = "all" | "offense" | "defense" | "special";

interface RosterTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "offense", label: "Offense" },
  { id: "defense", label: "Defense" },
  { id: "special", label: "ST" },
];

export function RosterTabs({ activeTab, onTabChange }: RosterTabsProps) {
  return (
    <div className="flex border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 py-3 text-sm font-semibold transition-colors",
            activeTab === tab.id
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
