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
  disabled?: boolean;
}

export function NavCard({
  title,
  icon,
  href,
  description,
  variant = "default",
  disabled = false,
}: NavCardProps) {
  const content = (
    <>
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-2",
          variant === "default" && "bg-secondary text-foreground",
          variant === "highlight" && "bg-primary/20 text-primary",
          disabled && "opacity-50"
        )}
      >
        {icon}
      </div>
      <span className={cn("font-semibold text-sm", disabled && "opacity-50")}>{title}</span>
      {description && (
        <span className="text-xs text-muted-foreground mt-1 text-center">
          {description}
        </span>
      )}
    </>
  );

  if (disabled) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4 rounded-2xl border cursor-not-allowed",
          "bg-secondary/30 border-border/50"
        )}
      >
        {content}
      </div>
    );
  }

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
      {content}
    </Link>
  );
}
