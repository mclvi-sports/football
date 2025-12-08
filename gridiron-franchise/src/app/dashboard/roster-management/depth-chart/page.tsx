"use client";

/**
 * Depth Chart Page - Manage team depth chart
 *
 * Allows users to reorder players at each position.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCareerStore } from "@/stores/career-store";

export default function DepthChartPage() {
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <main className="px-5 pt-4 space-y-4">
        {/* Placeholder Card */}
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Depth Chart</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag and drop players to set your starting lineup and backups at each position.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
