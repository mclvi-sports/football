"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Snowflake, Briefcase, Building2, Newspaper, Play, BarChart3 } from "lucide-react";
import { TeamCard } from "@/components/dashboard/team-card";
import { NavCard } from "@/components/dashboard/nav-card";
import { SimOptionsModal } from "@/components/sim/sim-options-modal";
import { useCareerStore } from "@/stores/career-store";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedTeam, _hasHydrated } = useCareerStore();
  const [simModalOpen, setSimModalOpen] = useState(false);

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
            href="/dashboard/roster-management"
          />
          <NavCard
            title="Offseason"
            icon={<Snowflake className="w-6 h-6" />}
            href="/dashboard/offseason"
          />
          <NavCard
            title="Staff"
            icon={<Briefcase className="w-6 h-6" />}
            href="/dashboard/staff"
          />
          <NavCard
            title="Facilities"
            icon={<Building2 className="w-6 h-6" />}
            href="/dashboard/facilities"
          />
          <NavCard
            title="Stats"
            icon={<BarChart3 className="w-6 h-6" />}
            href="/dashboard/stats"
          />
          <NavCard
            title="News"
            icon={<Newspaper className="w-6 h-6" />}
            href="/dashboard/news"
          />
        </div>

        {/* Sim Button - Opens simulation options */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setSimModalOpen(true)}
            className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
              <Play className="w-6 h-6" />
            </div>
            <span className="text-lg font-semibold text-primary">Advance</span>
          </button>
        </div>
      </main>

      {/* Sim Options Modal */}
      <SimOptionsModal
        open={simModalOpen}
        onOpenChange={setSimModalOpen}
        userTeamId={selectedTeam.id}
      />
    </div>
  );
}
