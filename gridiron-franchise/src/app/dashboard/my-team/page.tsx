"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCareerStore } from "@/stores/career-store";

export default function MyTeamPage() {
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
        {/* Coming Soon Card */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4"
            style={{
              backgroundColor: selectedTeam.colors.primary,
              color: selectedTeam.colors.secondary,
            }}
          >
            {selectedTeam.id}
          </div>
          <h2 className="text-xl font-bold mb-2">{selectedTeam.city} {selectedTeam.name}</h2>
          <p className="text-muted-foreground mb-4">Team details coming soon</p>
          <p className="text-sm text-muted-foreground">
            View team stats, history, stadium info, and more
          </p>
        </div>
      </main>
    </div>
  );
}
