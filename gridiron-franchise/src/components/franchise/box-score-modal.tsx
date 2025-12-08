'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { BoxScore } from '@/components/sim/box-score';
import { GameResult } from '@/lib/season/types';

interface BoxScoreModalProps {
  game: GameResult | null;
  awayTeam: { id: string; abbrev: string; name: string; city: string } | null;
  homeTeam: { id: string; abbrev: string; name: string; city: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoxScoreModal({
  game,
  awayTeam,
  homeTeam,
  open,
  onOpenChange,
}: BoxScoreModalProps) {
  if (!game || !awayTeam || !homeTeam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-hidden p-0 border-zinc-800">
        <BoxScore
          awayTeam={{
            id: awayTeam.id,
            name: awayTeam.name,
            abbrev: awayTeam.abbrev,
          }}
          homeTeam={{
            id: homeTeam.id,
            name: homeTeam.name,
            abbrev: homeTeam.abbrev,
          }}
          awayScore={game.awayScore}
          homeScore={game.homeScore}
          awayStats={game.awayStats}
          homeStats={game.homeStats}
          playerStats={game.playerStats}
          scoringPlays={game.scoringPlays}
          isFinal={true}
          onBack={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
