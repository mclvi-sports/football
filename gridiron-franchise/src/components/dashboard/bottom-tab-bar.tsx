"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

const tabs: Tab[] = [
  { id: "home", label: "Home", icon: "H", href: "/dashboard" },
  { id: "roster", label: "Roster", icon: "R", href: "/dashboard/roster-management" },
  { id: "schedule", label: "Schedule", icon: "S", href: "/dashboard/schedule" },
  { id: "draft", label: "Draft", icon: "D", href: "/dashboard/draft" },
  { id: "settings", label: "Settings", icon: "G", href: "/dashboard/settings" },
];

interface BottomTabBarProps {
  activeTab: string;
  onTabChange?: (tabId: string) => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          const content = (
            <>
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
            </>
          );

          // If tab has href, use Link
          if (tab.href) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {content}
              </Link>
            );
          }

          // Otherwise use button
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
