"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { TeamCard } from "@/components/dashboard/team-card";
import { NavCard } from "@/components/dashboard/nav-card";
import { BottomTabBar } from "@/components/dashboard/bottom-tab-bar";
import { useCareerStore } from "@/stores/career-store";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const { selectedTeam } = useCareerStore();

  // Redirect if no team selected (Owner model)
  useEffect(() => {
    if (!selectedTeam) {
      router.replace("/");
    }
  }, [selectedTeam, router]);

  if (!selectedTeam) {
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

        {/* Schedule Card */}
        <NavCard
          title="Schedule"
          icon={<Calendar className="w-6 h-6" />}
          href="/dashboard/schedule"
          description="Week 1"
        />

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            title="Dev Tools"
            icon="DEV"
            href="/dashboard/dev-tools"
          />
          <NavCard
            title="About"
            icon="?"
            href="/dashboard/about"
          />
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
