import { MenuButtonPrimary } from "@/components/menu/menu-button-primary";
import { MenuButtonSecondary } from "@/components/menu/menu-button-secondary";
import { MenuFooter } from "@/components/menu/menu-footer";

export default function MainMenuPage() {
  // TODO: Replace with actual career data from store
  const hasActiveCareeer = true;
  const currentWeek = 4;
  const currentOpponent = "Miami Sharks";

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Menu Buttons */}
      <div className="flex flex-col gap-4">
        {/* Continue Career (Primary) - only show if career exists */}
        {hasActiveCareeer && (
          <MenuButtonPrimary
            title="Continue Career"
            subtitle={`Week ${currentWeek} vs. ${currentOpponent}`}
            href="/career"
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
