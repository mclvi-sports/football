/**
 * Mock Draft Tab
 *
 * Run mock draft simulations and view projections.
 * Integrates MockDraftSimulator component.
 *
 * WO-SCOUTING-HUB-001
 */

"use client";

import { MockDraftSimulator } from "./mock-draft-simulator";

// ============================================================================
// COMPONENT
// ============================================================================

export function MockDraftTab() {
  return <MockDraftSimulator />;
}
