"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "light", label: "Light", icon: "L" },
  { value: "dark", label: "Dark", icon: "D" },
  { value: "system", label: "System", icon: "S" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {themes.map((t) => (
          <div
            key={t.value}
            className="h-12 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border transition-colors ${
            theme === t.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:bg-accent hover:border-accent"
          }`}
        >
          <span className="text-lg">{t.icon}</span>
          <span className="text-xs font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
