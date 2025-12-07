"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, FolderOpen } from "lucide-react";
import { MenuButtonPrimary } from "@/components/menu/menu-button-primary";
import { MenuButtonSecondary } from "@/components/menu/menu-button-secondary";
import { listSaves, loadGame } from "@/lib/supabase/save-game";
import type { SaveSlotMetadata } from "@/lib/supabase/types";

export default function MainMenuPage() {
  const router = useRouter();
  const [lastSave, setLastSave] = useState<SaveSlotMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    async function fetchLastSave() {
      const saves = await listSaves();
      // Find most recently updated save
      const filledSaves = saves.filter((s) => !s.isEmpty) as SaveSlotMetadata[];
      if (filledSaves.length > 0) {
        const mostRecent = filledSaves.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )[0];
        setLastSave(mostRecent);
      }
      setIsLoading(false);
    }
    fetchLastSave();
  }, []);

  const handleContinue = async () => {
    if (!lastSave) return;
    setIsContinuing(true);
    const result = await loadGame(lastSave.id);
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(result.error || "Failed to load game");
      setIsContinuing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo and Branding */}
        <div className="text-center mb-12">
          <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <span className="text-4xl">🏈</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight">
            Gridiron Franchise
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team. Build a dynasty.
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4">
          {/* Continue Career (Primary) - only show if save exists */}
          {!isLoading && lastSave && (
            <MenuButtonPrimary
              title="Continue Career"
              subtitle={`${lastSave.teamName || "Team"} - Season ${lastSave.season}, Week ${lastSave.week}`}
              onClick={handleContinue}
              disabled={isContinuing}
            />
          )}

          {/* New Career */}
          <MenuButtonSecondary
            label="New Career"
            icon={<PlusCircle className="w-5 h-5" />}
            href="/career/new"
          />

          {/* Load Career */}
          <MenuButtonSecondary
            label="Load Career"
            icon={<FolderOpen className="w-5 h-5" />}
            href="/career/load"
          />
        </div>
      </div>
    </div>
  );
}
