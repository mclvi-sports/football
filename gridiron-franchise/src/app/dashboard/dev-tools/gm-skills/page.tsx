'use client';

import Link from 'next/link';
import { GMSkillsView } from '@/components/modules';
import { GMPointsDisplay, PrestigeBadge } from '@/components/gm';

export default function GMSkillsDevPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold">GM Skills System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Test GM Points, Skills, Equipment, and Prestige
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PrestigeBadge />
            <GMPointsDisplay />
          </div>
        </div>
      </header>

      <main className="px-5">
        <GMSkillsView mode="standalone" />
      </main>
    </div>
  );
}
