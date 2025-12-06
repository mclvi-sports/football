"use client";

import { useEffect, useState } from "react";
import { Position } from "@/lib/types";
import {
  getPlayerCareerStats,
  PlayerCareerStats,
  PassingStats,
  RushingStats,
  ReceivingStats,
  DefenseStats,
  KickingStats,
  CareerSeasonEntry,
} from "@/lib/career-stats";
import { cn } from "@/lib/utils";

interface CareerStatsTabProps {
  playerId: string;
  position: Position;
}

type StatCategory = "passing" | "rushing" | "receiving" | "defense" | "kicking";

// Determine which stat category to show based on position
function getPrimaryStatCategory(position: Position): StatCategory {
  switch (position) {
    case Position.QB:
      return "passing";
    case Position.RB:
      return "rushing";
    case Position.WR:
    case Position.TE:
      return "receiving";
    case Position.DE:
    case Position.DT:
    case Position.MLB:
    case Position.OLB:
    case Position.CB:
    case Position.FS:
    case Position.SS:
      return "defense";
    case Position.K:
    case Position.P:
      return "kicking";
    default:
      return "rushing";
  }
}

export function CareerStatsTab({ playerId, position }: CareerStatsTabProps) {
  const [careerStats, setCareerStats] = useState<PlayerCareerStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stats = getPlayerCareerStats(playerId);
    setCareerStats(stats);
    setLoading(false);
  }, [playerId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    );
  }

  if (!careerStats || careerStats.seasons.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-wide mb-3">
          Career Statistics
        </h3>
        <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
          No career stats available yet.
          <br />
          <span className="text-xs">
            Stats will accumulate as seasons are completed.
          </span>
        </div>
      </div>
    );
  }

  const primaryCategory = getPrimaryStatCategory(position);

  return (
    <div className="space-y-6">
      {/* Career Totals */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wide mb-3">
          Career Totals ({careerStats.seasons.length} seasons)
        </h3>
        <CareerTotalsCard
          totals={careerStats.careerTotals}
          category={primaryCategory}
          gamesPlayed={careerStats.careerTotals.gamesPlayed}
        />
      </div>

      {/* Year-by-Year Table */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wide mb-3">
          Season-by-Season
        </h3>
        <div className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <SeasonTable seasons={careerStats.seasons} category={primaryCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CAREER TOTALS CARD
// ============================================================================

interface CareerTotalsCardProps {
  totals: PlayerCareerStats["careerTotals"];
  category: StatCategory;
  gamesPlayed: number;
}

function CareerTotalsCard({
  totals,
  category,
  gamesPlayed,
}: CareerTotalsCardProps) {
  return (
    <div className="bg-secondary/30 border border-border rounded-xl p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatBox label="Games" value={gamesPlayed.toString()} />
        {category === "passing" && (
          <>
            <StatBox label="Pass Yds" value={totals.passing.yards.toLocaleString()} highlight />
            <StatBox label="Pass TDs" value={totals.passing.touchdowns.toString()} />
            <StatBox label="INTs" value={totals.passing.interceptions.toString()} />
            <StatBox label="Comp%" value={`${totals.passing.completionPct.toFixed(1)}%`} />
            <StatBox label="Rating" value={totals.passing.passerRating.toFixed(1)} />
          </>
        )}
        {category === "rushing" && (
          <>
            <StatBox label="Rush Yds" value={totals.rushing.yards.toLocaleString()} highlight />
            <StatBox label="Rush TDs" value={totals.rushing.touchdowns.toString()} />
            <StatBox label="Carries" value={totals.rushing.carries.toString()} />
            <StatBox label="YPC" value={totals.rushing.yardsPerCarry.toFixed(1)} />
            <StatBox label="Fumbles" value={totals.rushing.fumbles.toString()} />
          </>
        )}
        {category === "receiving" && (
          <>
            <StatBox label="Rec Yds" value={totals.receiving.yards.toLocaleString()} highlight />
            <StatBox label="Rec TDs" value={totals.receiving.touchdowns.toString()} />
            <StatBox label="Catches" value={totals.receiving.catches.toString()} />
            <StatBox label="Targets" value={totals.receiving.targets.toString()} />
            <StatBox label="YPC" value={totals.receiving.yardsPerCatch.toFixed(1)} />
          </>
        )}
        {category === "defense" && (
          <>
            <StatBox label="Tackles" value={totals.defense.tackles.toString()} highlight />
            <StatBox label="Sacks" value={totals.defense.sacks.toFixed(1)} />
            <StatBox label="INTs" value={totals.defense.interceptions.toString()} />
            <StatBox label="PDs" value={totals.defense.passDeflections.toString()} />
            <StatBox label="FF" value={totals.defense.fumbleRecoveries.toString()} />
          </>
        )}
        {category === "kicking" && (
          <>
            <StatBox label="FG Made" value={totals.kicking.fgMade.toString()} highlight />
            <StatBox label="FG%" value={`${totals.kicking.fgPct.toFixed(1)}%`} />
            <StatBox label="XP Made" value={totals.kicking.xpMade.toString()} />
            <StatBox label="XP%" value={`${totals.kicking.xpPct.toFixed(1)}%`} />
            <StatBox label="Punts" value={totals.kicking.punts.toString()} />
          </>
        )}
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatBox({ label, value, highlight }: StatBoxProps) {
  return (
    <div className="text-center p-3 bg-secondary/30 rounded-lg">
      <div className="text-[10px] text-muted-foreground uppercase mb-1">
        {label}
      </div>
      <div
        className={cn(
          "text-lg font-bold",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================================
// SEASON TABLE
// ============================================================================

interface SeasonTableProps {
  seasons: CareerSeasonEntry[];
  category: StatCategory;
}

function SeasonTable({ seasons, category }: SeasonTableProps) {
  // Sort seasons by year descending (most recent first)
  const sortedSeasons = [...seasons].sort((a, b) => b.year - a.year);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border bg-secondary/50">
          <th className="px-3 py-2 text-left font-bold text-xs uppercase">
            Year
          </th>
          <th className="px-3 py-2 text-left font-bold text-xs uppercase">
            Team
          </th>
          <th className="px-3 py-2 text-center font-bold text-xs uppercase">
            G
          </th>
          {category === "passing" && (
            <>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                CMP/ATT
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                YDS
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                TD
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                INT
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                RTG
              </th>
            </>
          )}
          {category === "rushing" && (
            <>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                CAR
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                YDS
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                TD
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                AVG
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                FUM
              </th>
            </>
          )}
          {category === "receiving" && (
            <>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                REC
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                TGT
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                YDS
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                TD
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                AVG
              </th>
            </>
          )}
          {category === "defense" && (
            <>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                TKL
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                SCK
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                INT
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                PD
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                FF
              </th>
            </>
          )}
          {category === "kicking" && (
            <>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                FGM
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                FGA
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                FG%
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                XPM
              </th>
              <th className="px-3 py-2 text-right font-bold text-xs uppercase">
                XP%
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {sortedSeasons.map((season) => (
          <tr
            key={season.year}
            className="border-b border-border/50 hover:bg-secondary/30"
          >
            <td className="px-3 py-2 font-medium">{season.year}</td>
            <td className="px-3 py-2 text-muted-foreground">
              {season.teamAbbrev}
            </td>
            <td className="px-3 py-2 text-center">{season.gamesPlayed}</td>
            {category === "passing" && (
              <>
                <td className="px-3 py-2 text-right">
                  {season.passing.completions}/{season.passing.attempts}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {season.passing.yards.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right text-green-400">
                  {season.passing.touchdowns}
                </td>
                <td className="px-3 py-2 text-right text-red-400">
                  {season.passing.interceptions}
                </td>
                <td className="px-3 py-2 text-right">
                  {season.passing.passerRating.toFixed(1)}
                </td>
              </>
            )}
            {category === "rushing" && (
              <>
                <td className="px-3 py-2 text-right">{season.rushing.carries}</td>
                <td className="px-3 py-2 text-right font-medium">
                  {season.rushing.yards.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right text-green-400">
                  {season.rushing.touchdowns}
                </td>
                <td className="px-3 py-2 text-right">
                  {season.rushing.yardsPerCarry.toFixed(1)}
                </td>
                <td className="px-3 py-2 text-right text-red-400">
                  {season.rushing.fumbles}
                </td>
              </>
            )}
            {category === "receiving" && (
              <>
                <td className="px-3 py-2 text-right">{season.receiving.catches}</td>
                <td className="px-3 py-2 text-right">{season.receiving.targets}</td>
                <td className="px-3 py-2 text-right font-medium">
                  {season.receiving.yards.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right text-green-400">
                  {season.receiving.touchdowns}
                </td>
                <td className="px-3 py-2 text-right">
                  {season.receiving.yardsPerCatch.toFixed(1)}
                </td>
              </>
            )}
            {category === "defense" && (
              <>
                <td className="px-3 py-2 text-right">{season.defense.tackles}</td>
                <td className="px-3 py-2 text-right">{season.defense.sacks.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-green-400">
                  {season.defense.interceptions}
                </td>
                <td className="px-3 py-2 text-right">{season.defense.passDeflections}</td>
                <td className="px-3 py-2 text-right">{season.defense.fumbleRecoveries}</td>
              </>
            )}
            {category === "kicking" && (
              <>
                <td className="px-3 py-2 text-right">{season.kicking.fgMade}</td>
                <td className="px-3 py-2 text-right">{season.kicking.fgAttempts}</td>
                <td className="px-3 py-2 text-right">
                  {season.kicking.fgPct.toFixed(1)}%
                </td>
                <td className="px-3 py-2 text-right">{season.kicking.xpMade}</td>
                <td className="px-3 py-2 text-right">
                  {season.kicking.xpPct.toFixed(1)}%
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
