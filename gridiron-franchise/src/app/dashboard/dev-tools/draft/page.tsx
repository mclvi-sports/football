'use client';

import Link from 'next/link';
import { DraftView } from '@/components/modules';

export default function DraftGeneratorPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Draft Class Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate draft classes with configurable depth and talent levels
        </p>
      </header>

      <main className="px-5">
        <DraftView mode="standalone" />
      </main>
    </div>
  );
}
