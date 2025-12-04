'use client';

import Link from 'next/link';
import { CoachingView } from '@/components/modules';

export default function CoachingGeneratorPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Coaching Staff Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate coaching staff with HC, OC, DC, and STC coordinators
        </p>
      </header>

      <main className="px-5">
        <CoachingView mode="standalone" showTeamSelector={true} />
      </main>
    </div>
  );
}
