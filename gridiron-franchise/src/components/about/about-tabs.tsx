"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ABOUT_TABS, AboutTab, AboutSection, AboutTabId } from "@/lib/data/about-content";

function SectionCard({ section }: { section: AboutSection }) {
  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
      <div>
        <h3 className="font-bold">{section.title}</h3>
        {section.highlight && (
          <p className="text-2xl font-bold text-primary mt-1">{section.highlight}</p>
        )}
        {section.description && (
          <p className="text-sm text-muted-foreground mt-2">{section.description}</p>
        )}
      </div>

      {/* Stats Grid */}
      {section.stats && section.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {section.stats.map((stat, i) => (
            <div key={i} className="text-center p-2 bg-secondary/50 rounded-lg">
              <p className="font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Items List */}
      {section.items && section.items.length > 0 && (
        <ul className="space-y-1.5">
          {section.items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AboutTabs() {
  const [activeTab, setActiveTab] = useState<AboutTabId>("overview");

  const currentTab = ABOUT_TABS.find((t) => t.id === activeTab) || ABOUT_TABS[0];

  return (
    <div>
      {/* Tabs - Horizontal Scrollable */}
      <div className="bg-secondary/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {ABOUT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "text-foreground border-b-2 border-primary bg-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {currentTab.sections.map((section, i) => (
          <SectionCard key={i} section={section} />
        ))}
      </div>
    </div>
  );
}
