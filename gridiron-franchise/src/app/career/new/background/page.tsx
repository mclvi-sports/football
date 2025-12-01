"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { backgrounds } from "@/data/gm-personas";
import { BackgroundList } from "@/components/career/persona/background-list";
import { Button } from "@/components/ui/button";
import { useCareerStore } from "@/stores/career-store";

export default function BackgroundSelectionPage() {
  const router = useRouter();
  const {
    selectedArchetype,
    selectedBackground,
    setBackground,
  } = useCareerStore();

  // Redirect if no archetype selected
  useEffect(() => {
    if (!selectedArchetype) {
      router.replace("/career/new/archetype");
    }
  }, [selectedArchetype, router]);

  function handleNext() {
    if (selectedBackground) {
      router.push("/career/new/persona");
    }
  }

  // Don't render until we have an archetype
  if (!selectedArchetype) {
    return null;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/career/new/archetype"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold flex-1">Your Background</h1>
        <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
          Step 2/3
        </span>
      </div>

      {/* Selected Archetype Badge */}
      <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-3 py-2.5 mb-4">
        <span className="text-xs font-bold bg-background text-primary px-1.5 py-0.5 rounded">
          {selectedArchetype.icon}
        </span>
        <span className="text-sm text-muted-foreground">
          Archetype:{" "}
          <span className="font-semibold text-foreground">
            {selectedArchetype.name}
          </span>
        </span>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground mb-4">
        How did you become a GM?
      </p>

      {/* Background List */}
      <BackgroundList
        backgrounds={backgrounds}
        selectedBackground={selectedBackground}
        selectedArchetype={selectedArchetype}
        onSelectBackground={setBackground}
      />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-[400px] mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selectedBackground}
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
