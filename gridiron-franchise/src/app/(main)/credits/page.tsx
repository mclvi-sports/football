import Link from "next/link";

export default function CreditsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
          <span className="text-3xl">ℹ️</span>
        </div>
        <h2 className="text-xl font-bold">Credits</h2>
        <p className="text-muted-foreground mt-2">Gridiron Franchise</p>
      </div>

      {/* Credits Content */}
      <div className="space-y-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">Development</p>
            <p className="text-sm text-muted-foreground">Your Name Here</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">AI Assistant</p>
            <p className="text-sm text-muted-foreground">Claude (Anthropic)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Built With</p>
            <p className="text-sm text-muted-foreground">
              Next.js, Supabase, shadcn/ui, Tailwind CSS
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600">
          © 2025 Gridiron Franchise. All rights reserved.
        </p>
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
