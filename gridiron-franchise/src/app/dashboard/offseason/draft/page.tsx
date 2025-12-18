"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOffseasonStore } from "@/stores/offseason-store";
import { useDraftStore } from "@/stores/draft-store";
import { useCareerStore } from "@/stores/career-store";
import DraftPageContent from "@/app/dashboard/draft/page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Users, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DraftProspect } from "@/lib/generators/draft-generator";

/**
 * Offseason Draft Page
 *
 * Wraps the existing draft page and integrates with offseason flow.
 * - Sets phase to in-progress when entering
 * - Shows completion screen with UDFA signing after draft ends
 * - Marks phase complete when user continues to rookie camp
 */
export default function OffseasonDraftPage() {
  const router = useRouter();
  const { setPhaseStatus, completePhase, isPhaseCompleted } = useOffseasonStore();
  const draft = useDraftStore();
  const career = useCareerStore();

  const { isComplete, _hasHydrated, draftClass, availableProspects, selections, userTeamId } = draft;

  const [showCompletion, setShowCompletion] = useState(false);
  const [signedUDFAs, setSignedUDFAs] = useState<string[]>([]);
  const [showUDFAPanel, setShowUDFAPanel] = useState(false);

  // Get undrafted prospects
  const undraftedProspects = useMemo(() => {
    if (!_hasHydrated || !isComplete) return [];
    return draftClass.filter(p => availableProspects.includes(p.id));
  }, [_hasHydrated, isComplete, draftClass, availableProspects]);

  // Get user's drafted players
  const userDraftedCount = useMemo(() => {
    if (!userTeamId) return 0;
    return selections.filter(s => s.teamId === userTeamId).length;
  }, [selections, userTeamId]);

  // Mark draft as in-progress when entering
  useEffect(() => {
    if (!isPhaseCompleted("draft")) {
      setPhaseStatus("draft", "in-progress");
    }
  }, [setPhaseStatus, isPhaseCompleted]);

  // Show completion screen when draft finishes
  useEffect(() => {
    if (_hasHydrated && isComplete && !isPhaseCompleted("draft")) {
      setShowCompletion(true);
    }
  }, [_hasHydrated, isComplete, isPhaseCompleted]);

  const handleSignUDFA = (prospect: DraftProspect) => {
    if (signedUDFAs.length >= 10) return; // Max 10 UDFAs
    if (signedUDFAs.includes(prospect.id)) return;
    setSignedUDFAs(prev => [...prev, prospect.id]);
  };

  const handleRemoveUDFA = (prospectId: string) => {
    setSignedUDFAs(prev => prev.filter(id => id !== prospectId));
  };

  const handleContinueToRookieCamp = () => {
    // Store signed UDFAs in session storage for rookie camp to access
    if (signedUDFAs.length > 0) {
      sessionStorage.setItem('signedUDFAs', JSON.stringify(signedUDFAs));
    }
    completePhase("draft");
    router.push("/dashboard/offseason/rookie-camp");
  };

  // Show completion screen with UDFA signing
  if (showCompletion) {
    const signedProspects = undraftedProspects.filter(p => signedUDFAs.includes(p.id));
    const availableUDFAs = undraftedProspects.filter(p => !signedUDFAs.includes(p.id));

    return (
      <div className="space-y-6 px-5 pt-4 pb-20">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Draft Complete!</h1>
          <p className="text-muted-foreground">
            Week 21 • {userDraftedCount} players drafted
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{userDraftedCount}</p>
              <p className="text-xs text-muted-foreground">Drafted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{signedUDFAs.length}</p>
              <p className="text-xs text-muted-foreground">UDFAs Signed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{undraftedProspects.length}</p>
              <p className="text-xs text-muted-foreground">Available UDFAs</p>
            </CardContent>
          </Card>
        </div>

        {/* UDFA Signing Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  UDFA Signings
                </CardTitle>
                <CardDescription>
                  Sign up to 10 undrafted free agents ({signedUDFAs.length}/10)
                </CardDescription>
              </div>
              <Button
                variant={showUDFAPanel ? "secondary" : "default"}
                onClick={() => setShowUDFAPanel(!showUDFAPanel)}
              >
                {showUDFAPanel ? "Hide Available" : "Browse UDFAs"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Signed UDFAs */}
            {signedProspects.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Signed ({signedProspects.length})</p>
                <div className="space-y-2">
                  {signedProspects.map(prospect => (
                    <div
                      key={prospect.id}
                      className="flex items-center gap-3 rounded-lg bg-green-500/10 border border-green-500/20 p-3"
                    >
                      <Badge variant="outline">{prospect.position}</Badge>
                      <div className="flex-1">
                        <p className="font-medium">
                          {prospect.firstName} {prospect.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {prospect.collegeData?.name}
                        </p>
                      </div>
                      <Badge variant="secondary">{prospect.scoutedOvr || "??"} OVR</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUDFA(prospect.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available UDFAs Panel */}
            {showUDFAPanel && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Available UDFAs ({availableUDFAs.length})
                </p>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 pr-4">
                    {availableUDFAs
                      .sort((a, b) => (b.scoutedOvr || 0) - (a.scoutedOvr || 0))
                      .slice(0, 50) // Show top 50 by scouted OVR
                      .map(prospect => (
                        <div
                          key={prospect.id}
                          className="flex items-center gap-3 rounded-lg bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
                        >
                          <Badge variant="outline">{prospect.position}</Badge>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {prospect.firstName} {prospect.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {prospect.collegeData?.name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge variant="secondary">{prospect.scoutedOvr || "??"}</Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSignUDFA(prospect)}
                            disabled={signedUDFAs.length >= 10}
                          >
                            Sign
                          </Button>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {!showUDFAPanel && signedProspects.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No UDFAs signed yet. Browse available players to find hidden gems.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={handleContinueToRookieCamp} className="gap-2">
            Continue to Rookie Camp
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Render the draft page content during draft
  return <DraftPageContent />;
}
