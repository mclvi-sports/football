"use client";

import { cn } from "@/lib/utils";

interface SynergyBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function SynergyBadge({ className, size = "sm" }: SynergyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-wide",
        "bg-amber-500 text-black rounded",
        size === "sm" && "text-[10px] px-1.5 py-0.5",
        size === "md" && "text-xs px-2 py-1",
        className
      )}
    >
      Synergy
    </span>
  );
}
