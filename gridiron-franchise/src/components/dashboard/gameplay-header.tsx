"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Calendar, Info } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { getRouteTitle } from "@/lib/constants/route-titles";

/**
 * GameplayHeader
 *
 * Compact fixed header for all dashboard pages.
 * - Left: Hamburger menu (opens nav drawer)
 * - Center: Dynamic page title
 * - Right: Info icon (placeholder)
 */
export function GameplayHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { headerTitle } = useUIStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Title priority: Store override → Route map → Fallback
  const title = headerTitle ?? getRouteTitle(pathname);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-[500px] mx-auto px-5 h-14 flex items-center justify-between">
          {/* Hamburger Menu */}
          <button
            className="w-10 h-10 flex items-center justify-center -ml-2 active:opacity-70 transition-opacity"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <h1 className="text-lg font-semibold truncate">{title}</h1>

          {/* Info Button */}
          <button
            className="w-10 h-10 flex items-center justify-center -mr-2 active:opacity-70 transition-opacity"
            onClick={() => console.log("Info tapped")}
            aria-label="Page info"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navigation Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Drawer Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span className="text-border">|</span>
            <span className="font-semibold">Menu</span>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center -mr-2 active:opacity-70 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary active:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
