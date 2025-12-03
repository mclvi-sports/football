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
        {/* Full Setup */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Full Setup
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <NavCard
              title="Full New Game"
              icon="ALL"
              href="/dashboard/dev-tools/full"
              variant="highlight"
            />
          </div>
        </section>

        {/* Generators */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Generators
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <NavCard
              title="Free Agents Generator"
              icon="FA"
              href="/dashboard/dev-tools/fa"
            />
            <NavCard
              title="Draft Class Generator"
              icon="DC"
              href="/dashboard/dev-tools/draft"
            />
            <NavCard
              title="Schedule Generator"
              icon="CAL"
              href="/dashboard/dev-tools/schedule"
            />
            <NavCard
              title="Coaching Generator"
              icon="HC"
              href="/dashboard/dev-tools/coaching"
            />
            <NavCard
              title="Facilities Generator"
              icon="FAC"
              href="/dashboard/dev-tools/facilities"
            />
            <NavCard
              title="Scouting Generator"
              icon="SCT"
              href="/dashboard/dev-tools/scouting"
            />
            <NavCard
              title="Schemes Generator"
              icon="SCH"
              href="/dashboard/dev-tools/schemes"
            />
          </div>
        </section>

        {/* Views */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Views
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <NavCard
              title="Roster View"
              icon="RV"
              href="/dashboard/dev-tools/roster-view"
            />
            <NavCard
              title="Staff View"
              icon="STF"
              href="/dashboard/dev-tools/staff"
            />
            <NavCard
              title="GM Skills View"
              icon="GM"
              href="/dashboard/dev-tools/gm-skills"
            />
            <NavCard
              title="Training View"
              icon="TRN"
              href="/dashboard/dev-tools/training"
            />
            <NavCard
              title="Depth Chart View"
              icon="DPT"
              href="/dashboard/dev-tools/depth-chart"
            />
          </div>
        </section>

        {/* Gameplay Loops */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">
            Gameplay Loops
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <NavCard
              title="Game Simulator Loop"
              icon="SIM"
              href="/dashboard/dev-tools/sim"
              variant="highlight"
            />
            <NavCard
              title="Scouting Loop"
              icon="SPL"
              href="/dashboard/dev-tools/scouting-gameplay"
              variant="highlight"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
