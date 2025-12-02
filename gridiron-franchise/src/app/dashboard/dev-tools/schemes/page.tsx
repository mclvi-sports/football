"use client";

import { useState } from "react";
import Link from "next/link";
import {
  OFFENSIVE_SCHEMES,
  DEFENSIVE_SCHEMES,
  ST_PHILOSOPHIES,
  ALL_OFFENSIVE_SCHEMES,
  ALL_DEFENSIVE_SCHEMES,
  ALL_ST_PHILOSOPHIES,
} from "@/lib/schemes/scheme-data";
import {
  OffensiveScheme,
  DefensiveScheme,
  OffensiveSchemeDefinition,
  DefensiveSchemeDefinition,
  STPhilosophyDefinition,
} from "@/lib/schemes/types";

type Tab = "offensive" | "defensive" | "special_teams" | "matchups";

const TABS: { id: Tab; label: string }[] = [
  { id: "offensive", label: "Offensive" },
  { id: "defensive", label: "Defensive" },
  { id: "special_teams", label: "Special Teams" },
  { id: "matchups", label: "Matchups" },
];

// Helper to format attribute names
function formatAttribute(attr: string): string {
  return attr
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

// Helper to get scheme family
function getSchemeFamily(scheme: OffensiveScheme): string {
  if (["west_coast", "air_raid", "spread"].includes(scheme)) return "Passing";
  if (["power_run", "zone_run"].includes(scheme)) return "Running";
  return "Balanced";
}

// Helper to get defensive scheme type
function getDefensiveType(scheme: DefensiveScheme): string {
  if (["4-3", "3-4"].includes(scheme)) return "Front-Based";
  if (["cover_2", "cover_3"].includes(scheme)) return "Zone Coverage";
  if (["man_blitz", "zone_blitz"].includes(scheme)) return "Pressure";
  return "Hybrid";
}

// Progress bar component
function TendencyBar({ pass, run, label }: { pass: number; run: number; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-muted-foreground truncate">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded overflow-hidden flex">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${pass}%` }}
          title={`${pass}% pass`}
        />
        <div
          className="h-full bg-green-500"
          style={{ width: `${run}%` }}
          title={`${run}% run`}
        />
      </div>
      <span className="w-12 text-right">{pass}%</span>
    </div>
  );
}

// Offensive scheme card
function OffensiveSchemeCard({ scheme }: { scheme: OffensiveSchemeDefinition }) {
  const [expanded, setExpanded] = useState(false);
  const family = getSchemeFamily(scheme.id);

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg">{scheme.name}</h3>
          <p className="text-sm text-muted-foreground italic">&quot;{scheme.philosophy}&quot;</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          family === "Passing" ? "bg-blue-500/20 text-blue-400" :
          family === "Running" ? "bg-green-500/20 text-green-400" :
          "bg-yellow-500/20 text-yellow-400"
        }`}>
          {family}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{scheme.playStyle}</p>

      {/* Attribute Modifiers */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-green-400 mb-1">BONUSES</h4>
          <div className="space-y-1">
            {scheme.attributeBonuses.map((bonus, i) => (
              <div key={i} className="text-xs flex justify-between">
                <span>{formatAttribute(bonus.attribute)}</span>
                <span className="text-green-400">+{bonus.value}</span>
              </div>
            ))}
            {scheme.attributeBonuses.length === 0 && (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-red-400 mb-1">PENALTIES</h4>
          <div className="space-y-1">
            {scheme.attributePenalties.map((penalty, i) => (
              <div key={i} className="text-xs flex justify-between">
                <span>{formatAttribute(penalty.attribute)}</span>
                <span className="text-red-400">{penalty.value}</span>
              </div>
            ))}
            {scheme.attributePenalties.length === 0 && (
              <span className="text-xs text-muted-foreground">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Play Tendencies */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">PLAY TENDENCIES (Pass %)</h4>
        <div className="space-y-1">
          <TendencyBar
            pass={scheme.playCallingTendencies.first_and_10.pass}
            run={scheme.playCallingTendencies.first_and_10.run}
            label="1st & 10"
          />
          <TendencyBar
            pass={scheme.playCallingTendencies.third_and_long.pass}
            run={scheme.playCallingTendencies.third_and_long.run}
            label="3rd & Long"
          />
          <TendencyBar
            pass={scheme.playCallingTendencies.red_zone.pass}
            run={scheme.playCallingTendencies.red_zone.run}
            label="Red Zone"
          />
        </div>
      </div>

      {/* Pass Distribution */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">PASS DISTRIBUTION</h4>
        <div className="flex gap-2">
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-blue-400">{scheme.passDistribution.short}%</div>
            <div className="text-xs text-muted-foreground">Short</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-yellow-400">{scheme.passDistribution.medium}%</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-red-400">{scheme.passDistribution.deep}%</div>
            <div className="text-xs text-muted-foreground">Deep</div>
          </div>
        </div>
      </div>

      {/* Matchups */}
      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-green-400 font-semibold">Strong vs: </span>
          {scheme.strongAgainst.length > 0
            ? scheme.strongAgainst.map((s) => DEFENSIVE_SCHEMES[s].name).join(", ")
            : "None"}
        </div>
        <div>
          <span className="text-red-400 font-semibold">Weak vs: </span>
          {scheme.weakAgainst.length > 0
            ? scheme.weakAgainst.map((s) => DEFENSIVE_SCHEMES[s].name).join(", ")
            : "None"}
        </div>
      </div>

      {/* Expandable Personnel */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "▼ Hide Personnel" : "▶ Show Ideal Personnel"}
      </button>
      {expanded && (
        <div className="mt-2 p-2 bg-muted/50 rounded text-xs space-y-1">
          {scheme.idealPersonnel.map((p, i) => (
            <div key={i}>
              <span className="font-semibold">{p.position}:</span>{" "}
              {p.idealArchetypes.join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Defensive scheme card
function DefensiveSchemeCard({ scheme }: { scheme: DefensiveSchemeDefinition }) {
  const [expanded, setExpanded] = useState(false);
  const type = getDefensiveType(scheme.id);

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg">{scheme.name}</h3>
          <p className="text-sm text-muted-foreground">{scheme.baseFormation}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          type === "Front-Based" ? "bg-orange-500/20 text-orange-400" :
          type === "Zone Coverage" ? "bg-purple-500/20 text-purple-400" :
          "bg-red-500/20 text-red-400"
        }`}>
          {type}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{scheme.philosophy}</p>

      {/* Attribute Modifiers */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-green-400 mb-1">BONUSES</h4>
          <div className="space-y-1">
            {scheme.attributeBonuses.map((bonus, i) => (
              <div key={i} className="text-xs flex justify-between">
                <span>{formatAttribute(bonus.attribute)}</span>
                <span className="text-green-400">+{bonus.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-red-400 mb-1">PENALTIES</h4>
          <div className="space-y-1">
            {scheme.attributePenalties.map((penalty, i) => (
              <div key={i} className="text-xs flex justify-between">
                <span>{formatAttribute(penalty.attribute)}</span>
                <span className="text-red-400">{penalty.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personnel Packages */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold mb-2">PERSONNEL PACKAGES</h4>
        <div className="space-y-1">
          {scheme.personnelPackages.map((pkg, i) => (
            <div key={i} className="text-xs flex justify-between">
              <span className="font-medium">{pkg.name}</span>
              <span className="text-muted-foreground">{pkg.usage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matchups */}
      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-green-400 font-semibold">Strong vs: </span>
          {scheme.strongAgainst.length > 0
            ? scheme.strongAgainst.map((s) => OFFENSIVE_SCHEMES[s].name).join(", ")
            : "None"}
        </div>
        <div>
          <span className="text-red-400 font-semibold">Weak vs: </span>
          {scheme.weakAgainst.length > 0
            ? scheme.weakAgainst.map((s) => OFFENSIVE_SCHEMES[s].name).join(", ")
            : "None"}
        </div>
      </div>

      {/* Expandable Personnel */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "▼ Hide Personnel" : "▶ Show Ideal Personnel"}
      </button>
      {expanded && (
        <div className="mt-2 p-2 bg-muted/50 rounded text-xs space-y-1">
          {scheme.idealPersonnel.map((p, i) => (
            <div key={i}>
              <span className="font-semibold">{p.position}:</span>{" "}
              {p.idealArchetypes.join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ST Philosophy card
function STPhilosophyCard({ philosophy }: { philosophy: STPhilosophyDefinition }) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg">{philosophy.name}</h3>
          <p className="text-sm text-muted-foreground italic">&quot;{philosophy.focus}&quot;</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          philosophy.riskLevel === "high" ? "bg-red-500/20 text-red-400" :
          philosophy.riskLevel === "medium" ? "bg-yellow-500/20 text-yellow-400" :
          "bg-green-500/20 text-green-400"
        }`}>
          {philosophy.riskLevel.charAt(0).toUpperCase() + philosophy.riskLevel.slice(1)} Risk
        </span>
      </div>

      {/* Bonuses & Penalties */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-xs font-semibold text-green-400 mb-1">BONUSES</h4>
          <div className="space-y-1">
            {philosophy.bonuses.map((bonus, i) => (
              <div key={i} className="text-xs">
                <span>{bonus.effect}:</span>{" "}
                <span className="text-green-400">{bonus.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-red-400 mb-1">PENALTIES</h4>
          <div className="space-y-1">
            {philosophy.penalties.map((penalty, i) => (
              <div key={i} className="text-xs">
                <span>{penalty.effect}:</span>{" "}
                <span className="text-red-400">{penalty.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ideal Personnel */}
      <div>
        <h4 className="text-xs font-semibold mb-2">IDEAL PERSONNEL</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          {philosophy.idealPersonnel.map((p, i) => (
            <li key={i}>• {p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Matchup matrix component
function MatchupMatrix() {
  const [selectedCell, setSelectedCell] = useState<{
    offense: OffensiveScheme;
    defense: DefensiveScheme;
  } | null>(null);

  // Determine matchup result
  function getMatchup(offense: OffensiveScheme, defense: DefensiveScheme): "advantage" | "disadvantage" | "neutral" {
    const offScheme = OFFENSIVE_SCHEMES[offense];
    const defScheme = DEFENSIVE_SCHEMES[defense];

    if (offScheme.strongAgainst.includes(defense)) return "advantage";
    if (offScheme.weakAgainst.includes(defense)) return "disadvantage";
    if (defScheme.strongAgainst.includes(offense)) return "disadvantage";
    if (defScheme.weakAgainst.includes(offense)) return "advantage";
    return "neutral";
  }

  return (
    <div>
      <h3 className="font-bold mb-4">Offense vs Defense Matchups</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click a cell to see matchup details. Green = offense has advantage, Red = defense has advantage.
      </p>

      <div className="overflow-x-auto">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 border bg-muted"></th>
              {ALL_DEFENSIVE_SCHEMES.map((def) => (
                <th key={def} className="p-2 border bg-muted text-center min-w-[80px]">
                  {DEFENSIVE_SCHEMES[def].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_OFFENSIVE_SCHEMES.map((off) => (
              <tr key={off}>
                <td className="p-2 border bg-muted font-semibold">
                  {OFFENSIVE_SCHEMES[off].name}
                </td>
                {ALL_DEFENSIVE_SCHEMES.map((def) => {
                  const result = getMatchup(off, def);
                  return (
                    <td
                      key={def}
                      className={`p-2 border text-center cursor-pointer transition-colors ${
                        result === "advantage"
                          ? "bg-green-500/30 hover:bg-green-500/50"
                          : result === "disadvantage"
                          ? "bg-red-500/30 hover:bg-red-500/50"
                          : "bg-muted/50 hover:bg-muted"
                      } ${
                        selectedCell?.offense === off && selectedCell?.defense === def
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => setSelectedCell({ offense: off, defense: def })}
                    >
                      {result === "advantage" ? "+" : result === "disadvantage" ? "-" : "="}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected cell details */}
      {selectedCell && (
        <div className="mt-4 p-4 bg-card border rounded-lg">
          <h4 className="font-bold mb-2">
            {OFFENSIVE_SCHEMES[selectedCell.offense].name} vs{" "}
            {DEFENSIVE_SCHEMES[selectedCell.defense].name}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-blue-400">Offensive Scheme</p>
              <p className="text-muted-foreground">
                {OFFENSIVE_SCHEMES[selectedCell.offense].philosophy}
              </p>
              <p className="mt-2">
                <span className="text-green-400">Strong vs: </span>
                {OFFENSIVE_SCHEMES[selectedCell.offense].strongAgainst.join(", ") || "None"}
              </p>
              <p>
                <span className="text-red-400">Weak vs: </span>
                {OFFENSIVE_SCHEMES[selectedCell.offense].weakAgainst.join(", ") || "None"}
              </p>
            </div>
            <div>
              <p className="font-semibold text-orange-400">Defensive Scheme</p>
              <p className="text-muted-foreground">
                {DEFENSIVE_SCHEMES[selectedCell.defense].baseFormation}
              </p>
              <p className="mt-2">
                <span className="text-green-400">Strong vs: </span>
                {DEFENSIVE_SCHEMES[selectedCell.defense].strongAgainst.join(", ") || "None"}
              </p>
              <p>
                <span className="text-red-400">Weak vs: </span>
                {DEFENSIVE_SCHEMES[selectedCell.defense].weakAgainst.join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/30 border rounded" />
          <span>+ Offense Advantage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/30 border rounded" />
          <span>- Defense Advantage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted/50 border rounded" />
          <span>= Neutral</span>
        </div>
      </div>
    </div>
  );
}

export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("offensive");

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          &larr; Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Schemes Explorer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all offensive, defensive, and special teams schemes
        </p>
      </header>

      <main className="px-5">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "offensive" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Offensive Schemes</h2>
              <span className="text-sm text-muted-foreground">
                {ALL_OFFENSIVE_SCHEMES.length} schemes
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {ALL_OFFENSIVE_SCHEMES.map((schemeId) => (
                <OffensiveSchemeCard
                  key={schemeId}
                  scheme={OFFENSIVE_SCHEMES[schemeId]}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "defensive" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Defensive Schemes</h2>
              <span className="text-sm text-muted-foreground">
                {ALL_DEFENSIVE_SCHEMES.length} schemes
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {ALL_DEFENSIVE_SCHEMES.map((schemeId) => (
                <DefensiveSchemeCard
                  key={schemeId}
                  scheme={DEFENSIVE_SCHEMES[schemeId]}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "special_teams" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Special Teams Philosophies</h2>
              <span className="text-sm text-muted-foreground">
                {ALL_ST_PHILOSOPHIES.length} philosophies
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {ALL_ST_PHILOSOPHIES.map((philosophyId) => (
                <STPhilosophyCard
                  key={philosophyId}
                  philosophy={ST_PHILOSOPHIES[philosophyId]}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "matchups" && (
          <div>
            <MatchupMatrix />
          </div>
        )}
      </main>
    </div>
  );
}
