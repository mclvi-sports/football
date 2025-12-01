"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "home", label: "Home", icon: "H" },
  { id: "roster", label: "Roster", icon: "R" },
  { id: "schedule", label: "Schedule", icon: "S" },
  { id: "draft", label: "Draft", icon: "D" },
  { id: "settings", label: "Settings", icon: "G" },
];

interface BottomTabBarProps {
  activeTab: string;
  onTabChange?: (tabId: string) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-[500px] mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Icon placeholder */}
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                  isActive ? "bg-primary/20" : "bg-transparent"
                )}
              >
                {tab.icon}
              </div>
              {/* Label */}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
