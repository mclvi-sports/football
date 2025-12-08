"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, ClipboardList, ArrowLeftRight, Layers, HeartPulse } from "lucide-react";
import { NavCard } from "@/components/dashboard/nav-card";
import { useCareerStore } from "@/stores/career-store";

export default function RosterManagementPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();

  // Redirect if no team selected - only after hydration
  useEffect(() => {
    if (_hasHydrated && !selectedTeam) {
      router.replace("/");
    }
  }, [selectedTeam, _hasHydrated, router]);

  // Wait for hydration before rendering
  if (!_hasHydrated || !selectedTeam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <main className="px-5 pt-4 space-y-6">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            title="Team Roster"
            icon={<Users className="w-6 h-6" />}
            href="/dashboard/roster-management/roster"
          />
          <NavCard
            title="Free Agency"
            icon={<UserPlus className="w-6 h-6" />}
            href="/dashboard/roster-management/fa"
          />
          <NavCard
            title="Practice Squad"
            icon={<ClipboardList className="w-6 h-6" />}
            href="/dashboard/roster-management/ps"
            disabled
          />
          <NavCard
            title="Trades"
            icon={<ArrowLeftRight className="w-6 h-6" />}
            href="/dashboard/roster-management/trades"
            disabled
          />
          <NavCard
            title="Depth Chart"
            icon={<Layers className="w-6 h-6" />}
            href="/dashboard/roster-management/depth-chart"
          />
          <NavCard
            title="Injuries"
            icon={<HeartPulse className="w-6 h-6" />}
            href="/dashboard/roster-management/injuries"
            disabled
          />
        </div>
      </main>
    </div>
  );
}
