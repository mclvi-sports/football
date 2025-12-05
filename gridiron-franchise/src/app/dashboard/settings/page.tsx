"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div>
      <main className="px-5 pt-4 space-y-6">
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
