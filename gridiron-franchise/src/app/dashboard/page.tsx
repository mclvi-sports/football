"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users } from "lucide-react";
import { TeamCard } from "@/components/dashboard/team-card";
import { NavCard } from "@/components/dashboard/nav-card";
import { useCareerStore } from "@/stores/career-store";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();

  // Redirect if no team selected (Owner model) - only after hydration
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
      {/* Content */}
      <main className="px-5 pt-4 space-y-6">
        {/* Team Card */}
        <TeamCard team={selectedTeam} />

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            title="Schedule"
            icon={<Calendar className="w-6 h-6" />}
            href="/dashboard/schedule"
          />
          <NavCard
            title="Roster"
            icon={<Users className="w-6 h-6" />}
            href="/dashboard/roster"
          />
        </div>
      </main>
    </div>
  );
}
