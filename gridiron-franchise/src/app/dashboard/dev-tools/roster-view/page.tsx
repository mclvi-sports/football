'use client';

import Link from 'next/link';
import { RosterView } from '@/components/modules';

export default function RosterViewPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Roster View</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and browse team rosters
        </p>
      </header>

      <main className="px-5">
        <RosterView mode="standalone" showTeamSelector={true} />
      </main>
    </div>
  );
}
