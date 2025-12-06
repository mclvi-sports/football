"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AboutHero, AboutTabs } from "@/components/about";

export default function AboutPage() {
  return (
    <div className="pb-32 px-5">
      {/* Hero Section */}
      <div className="pt-4">
        <AboutHero />
      </div>

      {/* Tabbed Content */}
      <div className="mt-6 -mx-5">
        <AboutTabs />
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-6 mt-6 space-y-4 px-0">
        <div className="text-center space-y-2">
          <p className="text-sm font-bold">Version 0.2.0</p>
          <p className="text-xs text-muted-foreground">
            Built with passion for football and simulation gaming
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/dev-tools" className="block">
            <Button variant="outline" className="w-full">
              Dev Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
