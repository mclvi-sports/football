"use client";

/**
 * Stats Page - League-wide career statistics leaderboards
 *
 * Displays career stats for all players with category tabs.
 * Clicking a player row opens their PlayerDetailModal.
 */

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { PlayerDetailModal } from "@/components/player/player-detail-modal";
import { useCareerStore } from "@/stores/career-store";
import { getAllCareerStats } from "@/lib/career-stats/career-stats-store";
import { PlayerCareerStats } from "@/lib/career-stats/types";
import { LEAGUE_TEAMS } from "@/lib/data/teams";

// ============================================================================
// TYPES
// ============================================================================

type StatCategory = "passing" | "rushing" | "receiving" | "defense" | "kicking";

const STAT_TABS: { id: StatCategory; label: string }[] = [
  { id: "passing", label: "Passing" },
  { id: "rushing", label: "Rushing" },
  { id: "receiving", label: "Receiving" },
  { id: "defense", label: "Defense" },
  { id: "kicking", label: "Kicking" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTeamColors(teamId: string): { primary: string; secondary: string } | undefined {
  const team = LEAGUE_TEAMS.find((t) => t.id === teamId);
  return team?.colors;
}

function getPlayerTeamId(stats: PlayerCareerStats): string {
  // Get the most recent team from seasons
  if (stats.seasons.length > 0) {
    return stats.seasons[stats.seasons.length - 1].teamId;
  }
  return "FA";
}

// ============================================================================
// STAT TABLE COMPONENTS
// ============================================================================

interface PassingTableProps {
  players: PlayerCareerStats[];
  onPlayerClick: (playerId: string, teamId: string) => void;
}

function PassingTable({ players, onPlayerClick }: PassingTableProps) {
  const sorted = useMemo(() => {
    return [...players]
      .filter((p) => p.careerTotals.passing.attempts > 0)
      .sort((a, b) => b.careerTotals.passing.yards - a.careerTotals.passing.yards)
      .slice(0, 50);
  }, [players]);

  if (sorted.length === 0) {
    return <EmptyState message="No passing stats available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 px-2 font-medium">#</th>
            <th className="py-2 px-2 font-medium">Player</th>
            <th className="py-2 px-2 font-medium text-right">GP</th>
            <th className="py-2 px-2 font-medium text-right">CMP</th>
            <th className="py-2 px-2 font-medium text-right">ATT</th>
            <th className="py-2 px-2 font-medium text-right">YDS</th>
            <th className="py-2 px-2 font-medium text-right">TD</th>
            <th className="py-2 px-2 font-medium text-right">INT</th>
            <th className="py-2 px-2 font-medium text-right">RTG</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, idx) => {
            const teamId = getPlayerTeamId(player);
            return (
              <tr
                key={player.playerId}
                onClick={() => onPlayerClick(player.playerId, teamId)}
                className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="text-xs text-muted-foreground">{player.position} - {teamId}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right">{player.careerTotals.gamesPlayed}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.passing.completions.toLocaleString()}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.passing.attempts.toLocaleString()}</td>
                <td className="py-2 px-2 text-right font-semibold">{player.careerTotals.passing.yards.toLocaleString()}</td>
                <td className="py-2 px-2 text-right text-green-500">{player.careerTotals.passing.touchdowns}</td>
                <td className="py-2 px-2 text-right text-red-500">{player.careerTotals.passing.interceptions}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.passing.passerRating.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface RushingTableProps {
  players: PlayerCareerStats[];
  onPlayerClick: (playerId: string, teamId: string) => void;
}

function RushingTable({ players, onPlayerClick }: RushingTableProps) {
  const sorted = useMemo(() => {
    return [...players]
      .filter((p) => p.careerTotals.rushing.carries > 0)
      .sort((a, b) => b.careerTotals.rushing.yards - a.careerTotals.rushing.yards)
      .slice(0, 50);
  }, [players]);

  if (sorted.length === 0) {
    return <EmptyState message="No rushing stats available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 px-2 font-medium">#</th>
            <th className="py-2 px-2 font-medium">Player</th>
            <th className="py-2 px-2 font-medium text-right">GP</th>
            <th className="py-2 px-2 font-medium text-right">CAR</th>
            <th className="py-2 px-2 font-medium text-right">YDS</th>
            <th className="py-2 px-2 font-medium text-right">AVG</th>
            <th className="py-2 px-2 font-medium text-right">TD</th>
            <th className="py-2 px-2 font-medium text-right">LNG</th>
            <th className="py-2 px-2 font-medium text-right">FUM</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, idx) => {
            const teamId = getPlayerTeamId(player);
            return (
              <tr
                key={player.playerId}
                onClick={() => onPlayerClick(player.playerId, teamId)}
                className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="text-xs text-muted-foreground">{player.position} - {teamId}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right">{player.careerTotals.gamesPlayed}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.rushing.carries.toLocaleString()}</td>
                <td className="py-2 px-2 text-right font-semibold">{player.careerTotals.rushing.yards.toLocaleString()}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.rushing.yardsPerCarry.toFixed(1)}</td>
                <td className="py-2 px-2 text-right text-green-500">{player.careerTotals.rushing.touchdowns}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.rushing.long}</td>
                <td className="py-2 px-2 text-right text-red-500">{player.careerTotals.rushing.fumbles}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface ReceivingTableProps {
  players: PlayerCareerStats[];
  onPlayerClick: (playerId: string, teamId: string) => void;
}

function ReceivingTable({ players, onPlayerClick }: ReceivingTableProps) {
  const sorted = useMemo(() => {
    return [...players]
      .filter((p) => p.careerTotals.receiving.catches > 0)
      .sort((a, b) => b.careerTotals.receiving.yards - a.careerTotals.receiving.yards)
      .slice(0, 50);
  }, [players]);

  if (sorted.length === 0) {
    return <EmptyState message="No receiving stats available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 px-2 font-medium">#</th>
            <th className="py-2 px-2 font-medium">Player</th>
            <th className="py-2 px-2 font-medium text-right">GP</th>
            <th className="py-2 px-2 font-medium text-right">TGT</th>
            <th className="py-2 px-2 font-medium text-right">REC</th>
            <th className="py-2 px-2 font-medium text-right">YDS</th>
            <th className="py-2 px-2 font-medium text-right">AVG</th>
            <th className="py-2 px-2 font-medium text-right">TD</th>
            <th className="py-2 px-2 font-medium text-right">LNG</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, idx) => {
            const teamId = getPlayerTeamId(player);
            return (
              <tr
                key={player.playerId}
                onClick={() => onPlayerClick(player.playerId, teamId)}
                className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="text-xs text-muted-foreground">{player.position} - {teamId}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right">{player.careerTotals.gamesPlayed}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.receiving.targets.toLocaleString()}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.receiving.catches.toLocaleString()}</td>
                <td className="py-2 px-2 text-right font-semibold">{player.careerTotals.receiving.yards.toLocaleString()}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.receiving.yardsPerCatch.toFixed(1)}</td>
                <td className="py-2 px-2 text-right text-green-500">{player.careerTotals.receiving.touchdowns}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.receiving.long}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface DefenseTableProps {
  players: PlayerCareerStats[];
  onPlayerClick: (playerId: string, teamId: string) => void;
}

function DefenseTable({ players, onPlayerClick }: DefenseTableProps) {
  const sorted = useMemo(() => {
    return [...players]
      .filter((p) => p.careerTotals.defense.tackles > 0)
      .sort((a, b) => b.careerTotals.defense.tackles - a.careerTotals.defense.tackles)
      .slice(0, 50);
  }, [players]);

  if (sorted.length === 0) {
    return <EmptyState message="No defensive stats available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 px-2 font-medium">#</th>
            <th className="py-2 px-2 font-medium">Player</th>
            <th className="py-2 px-2 font-medium text-right">GP</th>
            <th className="py-2 px-2 font-medium text-right">TKL</th>
            <th className="py-2 px-2 font-medium text-right">SCK</th>
            <th className="py-2 px-2 font-medium text-right">INT</th>
            <th className="py-2 px-2 font-medium text-right">PD</th>
            <th className="py-2 px-2 font-medium text-right">FF</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, idx) => {
            const teamId = getPlayerTeamId(player);
            return (
              <tr
                key={player.playerId}
                onClick={() => onPlayerClick(player.playerId, teamId)}
                className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="text-xs text-muted-foreground">{player.position} - {teamId}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right">{player.careerTotals.gamesPlayed}</td>
                <td className="py-2 px-2 text-right font-semibold">{player.careerTotals.defense.tackles.toLocaleString()}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.defense.sacks.toFixed(1)}</td>
                <td className="py-2 px-2 text-right text-green-500">{player.careerTotals.defense.interceptions}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.defense.passDeflections}</td>
                <td className="py-2 px-2 text-right">{player.careerTotals.defense.fumbleRecoveries}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface KickingTableProps {
  players: PlayerCareerStats[];
  onPlayerClick: (playerId: string, teamId: string) => void;
}

function KickingTable({ players, onPlayerClick }: KickingTableProps) {
  const sorted = useMemo(() => {
    return [...players]
      .filter((p) => p.careerTotals.kicking.fgAttempts > 0 || p.careerTotals.kicking.punts > 0)
      .sort((a, b) => {
        // Sort kickers by FG made, punters by punt yards
        const aScore = a.careerTotals.kicking.fgMade * 100 + a.careerTotals.kicking.puntYards;
        const bScore = b.careerTotals.kicking.fgMade * 100 + b.careerTotals.kicking.puntYards;
        return bScore - aScore;
      })
      .slice(0, 50);
  }, [players]);

  if (sorted.length === 0) {
    return <EmptyState message="No kicking stats available" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2 px-2 font-medium">#</th>
            <th className="py-2 px-2 font-medium">Player</th>
            <th className="py-2 px-2 font-medium text-right">GP</th>
            <th className="py-2 px-2 font-medium text-right">FGM</th>
            <th className="py-2 px-2 font-medium text-right">FGA</th>
            <th className="py-2 px-2 font-medium text-right">FG%</th>
            <th className="py-2 px-2 font-medium text-right">XPM</th>
            <th className="py-2 px-2 font-medium text-right">PNT</th>
            <th className="py-2 px-2 font-medium text-right">AVG</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, idx) => {
            const teamId = getPlayerTeamId(player);
            const isKicker = player.careerTotals.kicking.fgAttempts > 0;
            return (
              <tr
                key={player.playerId}
                onClick={() => onPlayerClick(player.playerId, teamId)}
                className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="py-2 px-2 text-muted-foreground">{idx + 1}</td>
                <td className="py-2 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{player.playerName}</span>
                    <span className="text-xs text-muted-foreground">{player.position} - {teamId}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right">{player.careerTotals.gamesPlayed}</td>
                <td className="py-2 px-2 text-right font-semibold">{isKicker ? player.careerTotals.kicking.fgMade : "-"}</td>
                <td className="py-2 px-2 text-right">{isKicker ? player.careerTotals.kicking.fgAttempts : "-"}</td>
                <td className="py-2 px-2 text-right">{isKicker ? `${player.careerTotals.kicking.fgPct.toFixed(1)}%` : "-"}</td>
                <td className="py-2 px-2 text-right">{isKicker ? player.careerTotals.kicking.xpMade : "-"}</td>
                <td className="py-2 px-2 text-right">{!isKicker ? player.careerTotals.kicking.punts : "-"}</td>
                <td className="py-2 px-2 text-right">{!isKicker ? player.careerTotals.kicking.puntAvg.toFixed(1) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground/70 mt-2">
        Generate a league to populate career stats
      </p>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function StatsPage() {
  const { _hasHydrated } = useCareerStore();

  // Data state
  const [allStats, setAllStats] = useState<PlayerCareerStats[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState<StatCategory>("passing");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Load all career stats
  useEffect(() => {
    if (!_hasHydrated) return;

    const stats = getAllCareerStats();
    setAllStats(Object.values(stats));
    setLoading(false);
  }, [_hasHydrated]);

  const handlePlayerClick = (playerId: string, teamId: string) => {
    setSelectedPlayerId(playerId);
    setSelectedTeamId(teamId);
  };

  if (!_hasHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Stats Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold">Career Statistics</h2>
        <p className="text-sm text-muted-foreground">
          {allStats.length} players with career stats
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-border overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {STAT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 min-w-[80px] py-3 text-sm font-semibold transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stat Tables */}
      <div className="px-2">
        {activeTab === "passing" && (
          <PassingTable players={allStats} onPlayerClick={handlePlayerClick} />
        )}
        {activeTab === "rushing" && (
          <RushingTable players={allStats} onPlayerClick={handlePlayerClick} />
        )}
        {activeTab === "receiving" && (
          <ReceivingTable players={allStats} onPlayerClick={handlePlayerClick} />
        )}
        {activeTab === "defense" && (
          <DefenseTable players={allStats} onPlayerClick={handlePlayerClick} />
        )}
        {activeTab === "kicking" && (
          <KickingTable players={allStats} onPlayerClick={handlePlayerClick} />
        )}
      </div>

      {/* Player Detail Modal */}
      <PlayerDetailModal
        playerId={selectedPlayerId}
        open={!!selectedPlayerId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlayerId(null);
            setSelectedTeamId(null);
          }
        }}
        teamColors={selectedTeamId ? getTeamColors(selectedTeamId) : undefined}
      />
    </div>
  );
}
