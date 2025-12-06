"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MenuButtonPrimary } from "@/components/menu/menu-button-primary";
import { MenuButtonSecondary } from "@/components/menu/menu-button-secondary";
import { MenuFooter } from "@/components/menu/menu-footer";
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
    <div className="flex flex-col min-h-[500px]">
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
          icon="⊕"
          href="/career/new"
        />

        {/* Load Career */}
        <MenuButtonSecondary
          label="Load Career"
          icon="📂"
          href="/career/load"
        />
      </div>

      {/* Footer */}
      <MenuFooter />
    </div>
  );
}
