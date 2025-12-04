'use client';

import Link from 'next/link';
import { ScoutingDeptView } from '@/components/modules';

export default function ScoutingGeneratorPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Scouting Department Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate scouting staff with Director, Area, Pro, and National scouts
        </p>
      </header>

      <main className="px-5">
        <ScoutingDeptView mode="standalone" showTeamSelector={true} />
      </main>
    </div>
  );
}
