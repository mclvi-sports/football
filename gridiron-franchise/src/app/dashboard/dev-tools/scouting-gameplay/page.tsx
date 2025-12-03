'use client';

import Link from 'next/link';
import { ScoutingSection } from '@/components/franchise/scouting-section';

export default function ScoutingGameplayPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Scouting Gameplay</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scout draft prospects, assign scouts, and generate reports
        </p>
      </header>

      <main className="px-5">
        <ScoutingSection />
      </main>
    </div>
  );
}
