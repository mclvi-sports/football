import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <span className="text-3xl">⚙️</span>
        </div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-2">Customize your experience</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Theme Setting */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Appearance
          </label>
          <ThemeToggle />
        </div>

        {/* Placeholder for future settings */}
        <div className="p-4 bg-muted/50 border border-border rounded-xl">
          <p className="text-sm text-muted-foreground">
            More settings coming soon: audio controls, notifications, and account management.
          </p>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center pt-4">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}
