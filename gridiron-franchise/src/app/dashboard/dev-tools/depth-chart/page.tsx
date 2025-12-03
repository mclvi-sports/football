'use client';

import Link from 'next/link';

export default function DepthChartViewPage() {
  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Depth Chart View</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage team depth charts
        </p>
      </header>

      <main className="px-5">
        <div className="bg-secondary/50 border border-border rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Depth chart management system is under construction.
          </p>
        </div>
      </main>
    </div>
  );
}
