"use client";

import Link from "next/link";
import { NavCard } from "@/components/dashboard/nav-card";

export default function DevToolsPage() {
  return (
    <div className="min-h-screen">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Dev Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test player and roster generation systems
        </p>
      </header>

      <main className="px-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            title="Full New Game"
            icon="ALL"
            href="/dashboard/dev-tools/full"
            variant="highlight"
          />
          <NavCard
            title="Game Simulator"
            icon="SIM"
            href="/dashboard/dev-tools/sim"
            variant="highlight"
          />
          <NavCard
            title="Roster View"
            icon="RV"
            href="/dashboard/dev-tools/roster-view"
          />
          <NavCard
            title="Free Agents"
            icon="FA"
            href="/dashboard/dev-tools/fa"
          />
          <NavCard
            title="Draft Class"
            icon="DC"
            href="/dashboard/dev-tools/draft"
          />
          <NavCard
            title="Schedule"
            icon="CAL"
            href="/dashboard/dev-tools/schedule"
          />
          <NavCard
            title="Coaching"
            icon="HC"
            href="/dashboard/dev-tools/coaching"
          />
          <NavCard
            title="Facilities"
            icon="FAC"
            href="/dashboard/dev-tools/facilities"
          />
          <NavCard
            title="Scouting"
            icon="SCT"
            href="/dashboard/dev-tools/scouting"
          />
          <NavCard
            title="Schemes"
            icon="SCH"
            href="/dashboard/dev-tools/schemes"
          />
        </div>
      </main>
    </div>
  );
}
