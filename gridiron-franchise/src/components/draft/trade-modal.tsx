'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { DraftPick, Trade, TradePackage } from '@/stores/draft-store';
import { LEAGUE_TEAMS, type TeamInfo } from '@/lib/data/teams';
import {
  getPickValue,
  evaluateTrade,
  type TradeOffer,
} from '@/lib/draft/trade-value-chart';

interface TradeModalProps {
  open: boolean;
  onClose: () => void;
  userTeamId: string;
  userPicks: DraftPick[];
  allTeamPicks: Record<string, DraftPick[]>;
  onProposeTrade: (trade: Trade) => void;
  currentPickNumber: number;
}

export function TradeModal({
  open,
  onClose,
  userTeamId,
  userPicks,
  allTeamPicks,
  onProposeTrade,
  currentPickNumber,
}: TradeModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [offeredPicks, setOfferedPicks] = useState<number[]>([]);
  const [requestedPicks, setRequestedPicks] = useState<number[]>([]);

  // Get available teams to trade with
  const availableTeams = useMemo(() => {
    return LEAGUE_TEAMS.filter((t) => t.id !== userTeamId);
  }, [userTeamId]);

  // Get selected team's picks
  const selectedTeamPicks = useMemo(() => {
    if (!selectedTeam) return [];
    return allTeamPicks[selectedTeam]?.filter((p) => p.overall >= currentPickNumber) || [];
  }, [selectedTeam, allTeamPicks, currentPickNumber]);

  // Get user's available picks
  const availableUserPicks = useMemo(() => {
    return userPicks.filter((p) => p.overall >= currentPickNumber);
  }, [userPicks, currentPickNumber]);

  // Calculate trade value
  const tradeEvaluation = useMemo(() => {
    if (offeredPicks.length === 0 || requestedPicks.length === 0) return null;

    const offer: TradeOffer = {
      offeredPicks,
      requestedPicks,
    };

    return evaluateTrade(offer);
  }, [offeredPicks, requestedPicks]);

  // Toggle pick selection
  const toggleOfferedPick = (pickNumber: number) => {
    setOfferedPicks((prev) =>
      prev.includes(pickNumber)
        ? prev.filter((p) => p !== pickNumber)
        : [...prev, pickNumber]
    );
  };

  const toggleRequestedPick = (pickNumber: number) => {
    setRequestedPicks((prev) =>
      prev.includes(pickNumber)
        ? prev.filter((p) => p !== pickNumber)
        : [...prev, pickNumber]
    );
  };

  // Submit trade
  const handleSubmit = () => {
    if (!selectedTeam || offeredPicks.length === 0 || requestedPicks.length === 0) return;

    const trade: Trade = {
      id: `trade-${Date.now()}`,
      timestamp: Date.now(),
      team1Id: userTeamId,
      team2Id: selectedTeam,
      pickNumber: currentPickNumber,
      team1Package: {
        picksOffered: availableUserPicks.filter((p) => offeredPicks.includes(p.overall)),
        picksRequested: selectedTeamPicks.filter((p) => requestedPicks.includes(p.overall)),
      },
      team2Package: {
        picksOffered: selectedTeamPicks.filter((p) => requestedPicks.includes(p.overall)),
        picksRequested: availableUserPicks.filter((p) => offeredPicks.includes(p.overall)),
      },
    };

    onProposeTrade(trade);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTeam('');
    setOfferedPicks([]);
    setRequestedPicks([]);
    onClose();
  };

  const getTeamInfo = (teamId: string) => {
    return LEAGUE_TEAMS.find((t) => t.id === teamId);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Trade Picks</DialogTitle>
          <DialogDescription>
            Select picks to trade with another team
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Team Selection */}
          <div>
            <label className="text-sm font-medium">Trade Partner</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a team..." />
              </SelectTrigger>
              <SelectContent>
                {availableTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.city} {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTeam && (
            <div className="grid grid-cols-2 gap-4">
              {/* Your Picks */}
              <div>
                <p className="mb-2 text-sm font-medium">Your Picks (Offering)</p>
                <ScrollArea className="h-48 rounded-md border p-2">
                  <div className="space-y-1">
                    {availableUserPicks.map((pick) => {
                      const isSelected = offeredPicks.includes(pick.overall);
                      const value = getPickValue(pick.overall);

                      return (
                        <div
                          key={pick.overall}
                          className={cn(
                            'flex items-center justify-between rounded p-2 cursor-pointer transition-colors',
                            isSelected ? 'bg-primary/20' : 'hover:bg-muted/50'
                          )}
                          onClick={() => toggleOfferedPick(pick.overall)}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{pick.overall}
                            </Badge>
                            <span className="text-sm">
                              R{pick.round} P{pick.pick}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {value} pts
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <p className="mt-1 text-xs text-muted-foreground">
                  Selected: {getPickValue(0) + offeredPicks.reduce((sum, p) => sum + getPickValue(p), 0)} pts
                </p>
              </div>

              {/* Their Picks */}
              <div>
                <p className="mb-2 text-sm font-medium">
                  {getTeamInfo(selectedTeam)?.name}'s Picks (Requesting)
                </p>
                <ScrollArea className="h-48 rounded-md border p-2">
                  <div className="space-y-1">
                    {selectedTeamPicks.map((pick) => {
                      const isSelected = requestedPicks.includes(pick.overall);
                      const value = getPickValue(pick.overall);

                      return (
                        <div
                          key={pick.overall}
                          className={cn(
                            'flex items-center justify-between rounded p-2 cursor-pointer transition-colors',
                            isSelected ? 'bg-primary/20' : 'hover:bg-muted/50'
                          )}
                          onClick={() => toggleRequestedPick(pick.overall)}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{pick.overall}
                            </Badge>
                            <span className="text-sm">
                              R{pick.round} P{pick.pick}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {value} pts
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <p className="mt-1 text-xs text-muted-foreground">
                  Selected: {requestedPicks.reduce((sum, p) => sum + getPickValue(p), 0)} pts
                </p>
              </div>
            </div>
          )}

          {/* Trade Evaluation */}
          {tradeEvaluation && (
            <div
              className={cn(
                'rounded-lg p-4',
                tradeEvaluation.percentageDiff >= 0
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Trade Evaluation</p>
                  <p className="text-xs text-muted-foreground">
                    {tradeEvaluation.pick1Value} pts offered vs {tradeEvaluation.pick2Value} pts requested
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    className={cn(
                      tradeEvaluation.percentageDiff >= 0
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    )}
                  >
                    {tradeEvaluation.percentageDiff >= 0 ? '+' : ''}
                    {tradeEvaluation.percentageDiff.toFixed(1)}%
                  </Badge>
                  <p className="mt-1 text-xs capitalize">
                    {tradeEvaluation.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTeam || offeredPicks.length === 0 || requestedPicks.length === 0}
          >
            Propose Trade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TradeModal;
