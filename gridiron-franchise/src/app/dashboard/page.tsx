"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomTabBar } from "@/components/dashboard/bottom-tab-bar";
import { TeamCard } from "@/components/dashboard/team-card";
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
    <div className="pb-20">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <p className="text-sm text-muted-foreground">Season 2025 - Week 1</p>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {/* Content */}
      <main className="px-5 space-y-4">
        {/* Team Card */}
        <TeamCard team={selectedTeam} />
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
