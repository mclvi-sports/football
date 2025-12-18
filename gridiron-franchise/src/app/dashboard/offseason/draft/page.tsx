"use client";

import { useEffect } from "react";
import { useOffseasonStore } from "@/stores/offseason-store";
import { useDraftStore } from "@/stores/draft-store";
import DraftPageContent from "@/app/dashboard/draft/page";

/**
 * Offseason Draft Page
 *
 * Wraps the existing draft page and integrates with offseason flow.
 * - Sets phase to in-progress when entering
 * - Marks phase complete when draft finishes
 */
export default function OffseasonDraftPage() {
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();
  const { isComplete, _hasHydrated } = useDraftStore();

  // Mark draft as in-progress when entering
  useEffect(() => {
    if (!isPhaseCompleted("draft")) {
      setPhaseStatus("draft", "in-progress");
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  // Mark draft complete when finished
  useEffect(() => {
    if (_hasHydrated && isComplete && !isPhaseCompleted("draft")) {
      completePhase("draft");
    }
  }, [_hasHydrated, isComplete, completePhase, isPhaseCompleted]);

  // Render the draft page content
  return <DraftPageContent />;
}
