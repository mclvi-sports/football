"use client";

import Link from "next/link";

export default function DraftPage() {
  return (
    <div className="min-h-screen">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Draft</h1>
      </header>

      <main className="px-5">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold mb-4">
            D
          </div>
          <p className="text-muted-foreground">Draft room coming soon</p>
        </div>
      </main>
    </div>
  );
}
