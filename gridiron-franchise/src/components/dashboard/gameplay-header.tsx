"use client";

import { usePathname } from "next/navigation";
import { Menu, Info } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { getRouteTitle } from "@/lib/constants/route-titles";

/**
 * GameplayHeader
 *
 * Compact fixed header for all dashboard pages.
 * - Left: Hamburger menu (placeholder)
 * - Center: Dynamic page title
 * - Right: Info icon (placeholder)
 */
export function GameplayHeader() {
  const pathname = usePathname();
  const { headerTitle } = useUIStore();

  // Title priority: Store override → Route map → Fallback
  const title = headerTitle ?? getRouteTitle(pathname);

  const handleMenuTap = () => {
    console.log("Menu tapped");
  };

  const handleInfoTap = () => {
    console.log("Info tapped");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-[500px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Hamburger Menu */}
        <button
          className="w-10 h-10 flex items-center justify-center -ml-2 active:opacity-70 transition-opacity"
          onClick={handleMenuTap}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold truncate">{title}</h1>

        {/* Info Button */}
        <button
          className="w-10 h-10 flex items-center justify-center -mr-2 active:opacity-70 transition-opacity"
          onClick={handleInfoTap}
          aria-label="Page info"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
