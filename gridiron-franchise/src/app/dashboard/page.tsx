"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TeamCard } from "@/components/dashboard/team-card";
import { NavCard } from "@/components/dashboard/nav-card";
import { BottomTabBar } from "@/components/dashboard/bottom-tab-bar";
import { useCareerStore } from "@/stores/career-store";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const { selectedTeam, persona } = useCareerStore();

  // Redirect if no team/persona selected
  useEffect(() => {
    if (!selectedTeam || !persona) {
      router.replace("/");
    }
  }, [selectedTeam, persona, router]);

  if (!selectedTeam || !persona) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-sm text-muted-foreground">Season 2025 - Week 1</p>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {/* Content */}
      <main className="px-5 space-y-6">
        {/* Team Card */}
        <TeamCard team={selectedTeam} />

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            title="Next Task"
            icon="NT"
            href="/dashboard/next-task"
            variant="highlight"
          />
          <NavCard
            title="Roster"
            icon="R"
            href="/dashboard/roster"
          />
          <NavCard
            title="Schedule"
            icon="S"
            href="/dashboard/schedule"
          />
          <NavCard
            title="Stats"
            icon="ST"
            href="/dashboard/stats"
          />
          <NavCard
            title="Draft"
            icon="D"
            href="/dashboard/draft"
          />
          <NavCard
            title="News"
            icon="N"
            href="/dashboard/news"
          />
          <NavCard
            title="Facilities"
            icon="F"
            href="/dashboard/facilities"
          />
          <NavCard
            title="Staff"
            icon="ST"
            href="/dashboard/staff"
          />
          <NavCard
            title="My GM"
            icon="GM"
            href="/dashboard/my-gm"
          />
          <NavCard
            title="Dev Tools"
            icon="DEV"
            href="/dashboard/dev-tools"
            description="Test generation"
          />
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
