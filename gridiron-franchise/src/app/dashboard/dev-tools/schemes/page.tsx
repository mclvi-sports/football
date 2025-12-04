'use client';

import Link from 'next/link';
import { SchemesView } from '@/components/modules';

export default function SchemesPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          &larr; Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Schemes Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all offensive, defensive, and special teams schemes
        </p>
      </header>

      <main className="px-5">
        <SchemesView mode="standalone" />
      </main>
    </div>
  );
}
