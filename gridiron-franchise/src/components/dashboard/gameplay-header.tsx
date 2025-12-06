"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Calendar } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { getRouteTitle } from "@/lib/constants/route-titles";

/**
 * GameplayHeader
 *
 * Compact fixed header for all dashboard pages.
 * - Left: Dashboard (home)
 * - Center: Dynamic page title
 * - Right: Schedule
 */
export function GameplayHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { headerTitle } = useUIStore();

  // Title priority: Store override → Route map → Fallback
  const title = headerTitle ?? getRouteTitle(pathname);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-[500px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Dashboard */}
        <button
          className="w-10 h-10 flex items-center justify-center -ml-2 active:opacity-70 transition-opacity"
          onClick={() => router.push("/dashboard")}
          aria-label="Dashboard"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold truncate">{title}</h1>

        {/* Schedule */}
        <button
          className="w-10 h-10 flex items-center justify-center -mr-2 active:opacity-70 transition-opacity"
          onClick={() => router.push("/dashboard/schedule")}
          aria-label="Schedule"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
