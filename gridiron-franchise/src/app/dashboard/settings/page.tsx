"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Save, Cloud, Home, Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";
import { signOut } from "@/lib/supabase/auth";
import { saveGame } from "@/lib/supabase/save-game";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  async function handleQuickSave() {
    setIsSaving(true);
    setSaveStatus(null);
    const result = await saveGame(1, "Quick Save");
    setIsSaving(false);
    if (result.success) {
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(null), 2000);
    } else {
      setSaveStatus(result.error || "Failed to save");
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <main className="px-5 pt-4 space-y-6">
        {/* Account Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Account
          </h2>
          <div className="bg-secondary/50 border border-border rounded-xl p-4">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user?.email}</div>
                    <div className="text-xs text-muted-foreground">Signed in</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleQuickSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : saveStatus || "Quick Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard/saves")}
                    className="flex-1"
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    Cloud Saves
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Sign in to save your progress to the cloud.
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/auth")}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Theme Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Appearance
          </h2>
          <ThemeToggle />
        </section>

        {/* Developer Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Developer
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/dev-tools")}
            className="w-full"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Dev Tools
          </Button>
        </section>

        {/* Navigation Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Navigation
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Main Menu
          </Button>
        </section>
      </main>
    </div>
  );
}
