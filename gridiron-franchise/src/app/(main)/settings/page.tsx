import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <span className="text-3xl">⚙️</span>
        </div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-2">Coming soon</p>
      </div>

      {/* Placeholder Content */}
      <div className="space-y-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-sm text-muted-foreground">
            Game settings, audio controls, and account management will be available here.
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
