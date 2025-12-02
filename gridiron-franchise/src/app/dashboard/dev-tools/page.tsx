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
            title="Roster"
            icon="R"
            href="/dashboard/dev-tools/roster"
            description="Generate team rosters"
          />
          <NavCard
            title="Roster View"
            icon="RV"
            href="/dashboard/dev-tools/roster-view"
            description="Mockup roster UI"
            variant="highlight"
          />
          <NavCard
            title="Free Agents"
            icon="FA"
            href="/dashboard/dev-tools/fa"
            description="Generate FA pool"
          />
          <NavCard
            title="Draft Class"
            icon="DC"
            href="/dashboard/dev-tools/draft"
            description="Generate draft class"
          />
          <NavCard
            title="Full New Game"
            icon="ALL"
            href="/dashboard/dev-tools/full"
            description="Generate all data"
          />
          <NavCard
            title="Game Simulator"
            icon="SIM"
            href="/dashboard/dev-tools/sim"
            description="Simulate games"
            variant="highlight"
          />
          <NavCard
            title="Schedule"
            icon="CAL"
            href="/dashboard/dev-tools/schedule"
            description="Generate schedule"
          />
        </div>
      </main>
    </div>
  );
}
