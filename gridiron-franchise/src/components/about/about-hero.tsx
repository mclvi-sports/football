"use client";

import { ABOUT_STATS } from "@/lib/data/about-content";

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/30 border border-border rounded-lg p-3 text-center">
      <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function AboutHero() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-4">
        <div className="w-20 h-20 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🏈</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Gridiron Franchise</h2>
          <p className="text-muted-foreground mt-1">
            The Ultimate Football Management Simulation
          </p>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Build a dynasty. Develop players. Outsmart the competition.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ABOUT_STATS.map((stat) => (
          <StatBox key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  );
}
