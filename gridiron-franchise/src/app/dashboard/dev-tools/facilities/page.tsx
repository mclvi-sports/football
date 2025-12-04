'use client';

import Link from 'next/link';
import { FacilitiesView } from '@/components/modules';

export default function FacilitiesGeneratorPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Facilities Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate team facilities with stadium, practice, training, and weight room ratings
        </p>
      </header>

      <main className="px-5">
        <FacilitiesView mode="standalone" showTeamSelector={true} />
      </main>
    </div>
  );
}
