"use client";

import { usePathname } from "next/navigation";
import { GameplayHeader } from "@/components/dashboard/gameplay-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dev Tools pages keep their own headers
  const isDevTools = pathname.startsWith("/dashboard/dev-tools");

  return (
    <div className="min-h-screen bg-background">
      {!isDevTools && <GameplayHeader />}
      <div className={!isDevTools ? "pt-14" : ""}>
        {children}
      </div>
    </div>
  );
}
