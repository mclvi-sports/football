"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NavCardProps {
  title: string;
  icon: string | ReactNode;
  href: string;
  description?: string;
  variant?: "default" | "highlight";
}

export function NavCard({
  title,
  icon,
  href,
  description,
  variant = "default",
}: NavCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95",
        variant === "default" &&
          "bg-secondary/50 border-border hover:bg-secondary/80",
        variant === "highlight" &&
          "bg-primary/10 border-primary/30 hover:bg-primary/20"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-2",
          variant === "default" && "bg-secondary text-foreground",
          variant === "highlight" && "bg-primary/20 text-primary"
        )}
      >
        {icon}
      </div>
      <span className="font-semibold text-sm">{title}</span>
      {description && (
        <span className="text-xs text-muted-foreground mt-1 text-center">
          {description}
        </span>
      )}
    </Link>
  );
}
