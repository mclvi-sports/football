"use client";

import Link from "next/link";

export default function FAGeneratorPage() {
  return (
    <div className="min-h-screen">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Free Agent Generator</h1>
      </header>

      <main className="px-5">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-sm">
            Generate free agent pools with configurable size, quality distribution, and position quotas.
          </p>
        </div>
      </main>
    </div>
  );
}
