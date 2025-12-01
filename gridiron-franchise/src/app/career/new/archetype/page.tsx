"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { archetypes } from "@/data/gm-personas";
import { ArchetypeList } from "@/components/career/persona/archetype-list";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";

export default function ArchetypeSelectionPage() {
  const router = useRouter();
  const { selectedArchetype, setArchetype } = useCareerStore();

  function handleNext() {
    if (selectedArchetype) {
      router.push("/career/new/background");
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold flex-1">Your Playstyle</h1>
        <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
          Step 1/3
        </span>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground mb-4">
        How do you build a winner?
      </p>

      {/* Archetype List */}
      <ArchetypeList
        archetypes={archetypes}
        selectedArchetype={selectedArchetype}
        onSelectArchetype={setArchetype}
      />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-[400px] mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selectedArchetype}
            className="w-full"
            size="lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
