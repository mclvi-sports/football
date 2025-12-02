"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Settings</h1>
      </header>

      <main className="px-5 space-y-6">
        {/* Theme Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Appearance
          </h2>
          <ThemeToggle />
        </section>
      </main>
    </div>
  );
}
