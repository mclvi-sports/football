"use client";

import { usePathname } from "next/navigation";
import { GameplayHeader } from "@/components/dashboard/gameplay-header";
import { BottomTabBar } from "@/components/dashboard/bottom-tab-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dev Tools pages keep their own headers/footers
  const isDevTools = pathname.startsWith("/dashboard/dev-tools");

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname === "/dashboard") return "home";
    if (pathname.startsWith("/dashboard/roster")) return "roster";
    if (pathname.startsWith("/dashboard/schedule")) return "schedule";
    if (pathname.startsWith("/dashboard/draft")) return "draft";
    if (pathname.startsWith("/dashboard/settings")) return "settings";
    return "home";
  };

  return (
    <div className="min-h-screen bg-background">
      {!isDevTools && <GameplayHeader />}
      <div
        style={!isDevTools ? { paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' } : undefined}
      >
        {children}
      </div>
      {!isDevTools && <BottomTabBar activeTab={getActiveTab()} />}
    </div>
  );
}
