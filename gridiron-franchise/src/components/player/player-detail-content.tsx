"use client";

/**
 * PlayerDetailContent - Shared player detail UI
 *
 * Used by:
 * - player-detail-modal.tsx (modal wrapper for roster flow)
 * - page.tsx (page route for direct access)
 *
 * Uses:
 * - career-stats-tab.tsx (Career tab)
 * - @/lib/types (Player type)
 * - @/lib/data/traits (TRAITS_BY_ID)
 * - @/lib/data/badges (BADGES_BY_ID)
 * - @/lib/data/physical-ranges (heightToString)
 */

import { useState } from "react";
import { Player, Position, PlayerAttributes } from "@/lib/types";
import { heightToString } from "@/lib/data/physical-ranges";
import { TRAITS_BY_ID } from "@/lib/data/traits";
import { BADGES_BY_ID } from "@/lib/data/badges";
import { cn } from "@/lib/utils";
import { CareerStatsTab } from "@/components/player/career-stats-tab";
import { useCareerStore } from "@/stores/career-store";

type TabId =
  | "attributes"
  | "badges"
  | "traits"
  | "stats"
  | "career"
  | "contract"
  | "bio";

// ============================================================================
// ATTRIBUTE GROUPINGS
// ============================================================================

const PHYSICAL_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "SPD",
  "ACC",
  "AGI",
  "STR",
  "JMP",
  "STA",
  "INJ",
];

const MENTAL_ATTRIBUTES: (keyof PlayerAttributes)[] = ["AWR", "PRC"];

const PASSING_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "THP",
  "SAC",
  "MAC",
  "DAC",
  "TUP",
  "TOR",
  "PAC",
  "BSK",
];

const RUSHING_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "CAR",
  "BTK",
  "TRK",
  "ELU",
  "SPM",
  "JKM",
  "SFA",
  "VIS",
];

const RECEIVING_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "CTH",
  "CIT",
  "SPC",
  "RTE",
  "REL",
  "RAC",
  "SRR",
  "MRR",
  "DRR",
];

const BLOCKING_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "PBK",
  "RBK",
  "IBL",
  "PBP",
  "PBF",
  "RBP",
  "RBF",
  "LBK",
];

const DEFENSE_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "TAK",
  "POW",
  "PMV",
  "FMV",
  "BSH",
  "PUR",
  "MCV",
  "ZCV",
  "PRS",
];

const KICKING_ATTRIBUTES: (keyof PlayerAttributes)[] = [
  "KPW",
  "KAC",
  "KOP",
  "PPW",
  "PUA",
  "CLU",
  "CON",
];

const ATTRIBUTE_LABELS: Record<keyof PlayerAttributes, string> = {
  SPD: "Speed",
  ACC: "Acceleration",
  AGI: "Agility",
  STR: "Strength",
  JMP: "Jumping",
  STA: "Stamina",
  INJ: "Injury",
  AWR: "Awareness",
  PRC: "Play Recognition",
  THP: "Throw Power",
  SAC: "Short Accuracy",
  MAC: "Medium Accuracy",
  DAC: "Deep Accuracy",
  TUP: "Throw Under Pressure",
  TOR: "Throw on Run",
  PAC: "Play Action",
  BSK: "Break Sack",
  CAR: "Carrying",
  BTK: "Break Tackle",
  TRK: "Trucking",
  ELU: "Elusiveness",
  SPM: "Spin Move",
  JKM: "Juke Move",
  SFA: "Stiff Arm",
  VIS: "Vision",
  CTH: "Catching",
  CIT: "Catch In Traffic",
  SPC: "Spectacular Catch",
  RTE: "Route Running",
  REL: "Release",
  RAC: "Run After Catch",
  SRR: "Short Routes",
  MRR: "Medium Routes",
  DRR: "Deep Routes",
  PBK: "Pass Block",
  RBK: "Run Block",
  IBL: "Impact Block",
  PBP: "Pass Block Power",
  PBF: "Pass Block Finesse",
  RBP: "Run Block Power",
  RBF: "Run Block Finesse",
  LBK: "Lead Block",
  TAK: "Tackling",
  POW: "Hit Power",
  PMV: "Power Moves",
  FMV: "Finesse Moves",
  BSH: "Block Shedding",
  PUR: "Pursuit",
  MCV: "Man Coverage",
  ZCV: "Zone Coverage",
  PRS: "Press",
  KPW: "Kick Power",
  KAC: "Kick Accuracy",
  KOP: "Kickoff Power",
  PPW: "Punt Power",
  PUA: "Punt Accuracy",
  CLU: "Clutch",
  CON: "Consistency",
  RET: "Return",
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getPositionAttributes(position: Position): {
  primary: { title: string; attrs: (keyof PlayerAttributes)[] }[];
} {
  switch (position) {
    case Position.QB:
      return {
        primary: [
          { title: "Passing", attrs: PASSING_ATTRIBUTES },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
          { title: "Mental", attrs: MENTAL_ATTRIBUTES },
        ],
      };
    case Position.RB:
      return {
        primary: [
          { title: "Rushing", attrs: RUSHING_ATTRIBUTES },
          {
            title: "Receiving",
            attrs: ["CTH", "CIT", "RTE", "RAC"] as (keyof PlayerAttributes)[],
          },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
        ],
      };
    case Position.WR:
      return {
        primary: [
          { title: "Receiving", attrs: RECEIVING_ATTRIBUTES },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
          { title: "Mental", attrs: MENTAL_ATTRIBUTES },
        ],
      };
    case Position.TE:
      return {
        primary: [
          {
            title: "Receiving",
            attrs: ["CTH", "CIT", "SPC", "RTE", "RAC"] as (keyof PlayerAttributes)[],
          },
          {
            title: "Blocking",
            attrs: ["PBK", "RBK", "IBL"] as (keyof PlayerAttributes)[],
          },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
        ],
      };
    case Position.LT:
    case Position.LG:
    case Position.C:
    case Position.RG:
    case Position.RT:
      return {
        primary: [
          { title: "Blocking", attrs: BLOCKING_ATTRIBUTES },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
          { title: "Mental", attrs: MENTAL_ATTRIBUTES },
        ],
      };
    case Position.DE:
    case Position.DT:
      return {
        primary: [
          {
            title: "Pass Rush",
            attrs: ["PMV", "FMV", "BSH", "PUR"] as (keyof PlayerAttributes)[],
          },
          {
            title: "Run Defense",
            attrs: ["TAK", "POW", "BSH"] as (keyof PlayerAttributes)[],
          },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
        ],
      };
    case Position.MLB:
    case Position.OLB:
      return {
        primary: [
          {
            title: "Defense",
            attrs: ["TAK", "POW", "PUR", "BSH"] as (keyof PlayerAttributes)[],
          },
          {
            title: "Coverage",
            attrs: ["MCV", "ZCV", "PRS"] as (keyof PlayerAttributes)[],
          },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
        ],
      };
    case Position.CB:
    case Position.FS:
    case Position.SS:
      return {
        primary: [
          {
            title: "Coverage",
            attrs: ["MCV", "ZCV", "PRS"] as (keyof PlayerAttributes)[],
          },
          {
            title: "Defense",
            attrs: ["TAK", "POW", "PUR"] as (keyof PlayerAttributes)[],
          },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
        ],
      };
    case Position.K:
    case Position.P:
      return {
        primary: [
          { title: "Kicking", attrs: KICKING_ATTRIBUTES },
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
        ],
      };
    default:
      return {
        primary: [
          { title: "Physical", attrs: PHYSICAL_ATTRIBUTES },
          { title: "Mental", attrs: MENTAL_ATTRIBUTES },
        ],
      };
  }
}

function getAttributeColor(value: number): string {
  if (value >= 90) return "text-yellow-400";
  if (value >= 80) return "text-green-400";
  if (value >= 70) return "text-blue-400";
  return "text-muted-foreground";
}

function getAttributeBarColor(value: number): string {
  if (value >= 90) return "bg-gradient-to-r from-yellow-500 to-amber-400";
  if (value >= 80) return "bg-gradient-to-r from-green-500 to-emerald-400";
  if (value >= 70) return "bg-gradient-to-r from-blue-500 to-cyan-400";
  return "bg-muted-foreground/50";
}

function getOvrColor(ovr: number): string {
  if (ovr >= 90) return "from-yellow-400 to-amber-500";
  if (ovr >= 80) return "from-green-400 to-emerald-500";
  if (ovr >= 70) return "from-blue-400 to-cyan-500";
  return "from-gray-400 to-slate-500";
}

function getBadgeTierStyle(tier: string): { bg: string; border: string } {
  switch (tier) {
    case "hof":
      return { bg: "bg-purple-500/20", border: "border-purple-500/40" };
    case "gold":
      return { bg: "bg-yellow-500/20", border: "border-yellow-500/40" };
    case "silver":
      return { bg: "bg-slate-400/20", border: "border-slate-400/40" };
    case "bronze":
      return { bg: "bg-amber-700/20", border: "border-amber-700/40" };
    default:
      return { bg: "bg-muted", border: "border-border" };
  }
}

function formatSalary(salary: number): string {
  if (salary >= 1) {
    return `$${salary.toFixed(1)}M`;
  }
  return `$${(salary * 1000).toFixed(0)}K`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface PlayerDetailContentProps {
  player: Player;
  teamColors?: { primary: string; secondary: string };
}

export function PlayerDetailContent({ player, teamColors }: PlayerDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("attributes");
  const { selectedTeam } = useCareerStore();
  const positionAttrs = getPositionAttributes(player.position);

  // Team colors for jersey number gradient - use passed colors, or team colors, or neutral defaults
  const primaryColor = teamColors?.primary || selectedTeam?.colors.primary || "#6b7280";
  const secondaryColor = teamColors?.secondary || selectedTeam?.colors.secondary || "#4b5563";

  const tabs: { id: TabId; label: string }[] = [
    { id: "attributes", label: "Attributes" },
    { id: "badges", label: "Badges" },
    { id: "traits", label: "Traits" },
    { id: "stats", label: "Stats" },
    { id: "career", label: "Career" },
    { id: "contract", label: "Contract" },
    { id: "bio", label: "Bio" },
  ];

  return (
    <div className="pb-8">
      {/* Player Hero - Horizontal Layout */}
      <div className="px-4 py-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          {/* Jersey Number - Left */}
          <div
            className="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center text-2xl font-black shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {player.jerseyNumber}
          </div>

          {/* Name & Position - Center */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black uppercase tracking-wide truncate">
              {player.firstName} {player.lastName}
            </h1>
            <div className="text-sm text-muted-foreground">
              {player.position} · {player.archetype} ·{" "}
              <span className={cn("font-bold", getAttributeColor(player.overall))}>
                {player.overall} OVR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-background/50 border-b border-border/50">
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">
            Age
          </div>
          <div className="font-bold">{player.age}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">
            Exp
          </div>
          <div className="font-bold">{player.experience}yr</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">
            College
          </div>
          <div className="font-bold text-xs">{player.college}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-muted-foreground uppercase mb-1">
            Potential
          </div>
          <div className={cn("font-bold", getAttributeColor(player.potential))}>
            {player.potential}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-secondary/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "text-foreground border-b-2 border-primary bg-white/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Attributes Tab */}
        {activeTab === "attributes" && (
          <div className="space-y-6">
            {positionAttrs.primary.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                  {group.title}
                </h3>
                <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
                  {group.attrs.map((attr) => {
                    const value = player.attributes[attr];
                    if (value === 0) return null;
                    return (
                      <div
                        key={attr}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {ATTRIBUTE_LABELS[attr]} ({attr})
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                getAttributeBarColor(value)
                              )}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-bold min-w-[30px] text-right",
                              getAttributeColor(value)
                            )}
                          >
                            {value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                Equipped Badges ({player.badges.length}/6)
              </h3>
              {player.badges.length > 0 ? (
                <div className="space-y-2">
                  {player.badges.map((badge, i) => {
                    const badgeDef = BADGES_BY_ID[badge.id];
                    const tierStyle = getBadgeTierStyle(badge.tier);
                    return (
                      <div
                        key={i}
                        className="bg-secondary/30 border border-border rounded-xl p-3 flex items-center gap-3"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-xl",
                            tierStyle.bg,
                            "border",
                            tierStyle.border
                          )}
                        >
                          {badge.tier === "hof"
                            ? "HOF"
                            : badge.tier === "gold"
                              ? "G"
                              : badge.tier === "silver"
                                ? "S"
                                : "B"}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">
                            {badgeDef?.name || badge.id}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase">
                            {badge.tier} Tier
                          </div>
                          {badgeDef && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {badgeDef.tiers[badge.tier]?.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                  No badges equipped. Earn badges through performance or spend
                  XP to unlock.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Traits Tab */}
        {activeTab === "traits" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                Player Traits ({player.traits.length})
              </h3>
              {player.traits.length > 0 ? (
                <div className="space-y-2">
                  {player.traits.map((traitId, i) => {
                    const traitDef = TRAITS_BY_ID[traitId];
                    return (
                      <div
                        key={i}
                        className="bg-secondary/30 border border-border rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-purple-500/20 border border-purple-500/40">
                          {traitDef?.category?.[0] || "T"}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">
                            {traitDef?.name || traitId}
                          </div>
                          {traitDef && (
                            <>
                              <div className="text-xs text-muted-foreground">
                                {traitDef.description}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {traitDef.effects.map((effect, j) => (
                                  <span
                                    key={j}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                                  >
                                    {effect.description}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                  No traits assigned to this player.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                Season Stats
              </h3>
              <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                No game stats available yet.
                <br />
                <span className="text-xs">
                  Stats will populate during season play.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Career Tab */}
        {activeTab === "career" && (
          <CareerStatsTab playerId={player.id} position={player.position} />
        )}

        {/* Contract Tab */}
        {activeTab === "contract" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                Contract Details
              </h3>
              {player.contract ? (
                <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">
                      Years Remaining
                    </span>
                    <span className="font-bold">
                      {player.contract.years} years
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">
                      Annual Salary
                    </span>
                    <span className="font-bold">
                      {formatSalary(player.contract.salary)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm">
                      Total Value
                    </span>
                    <span className="font-bold">
                      {formatSalary(
                        player.contract.salary * player.contract.years
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground text-sm">
                      Status
                    </span>
                    <span className="text-green-400 font-bold">
                      Under Contract
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center">
                  <div className="text-yellow-400 font-bold mb-2">
                    Free Agent
                  </div>
                  <div className="text-muted-foreground text-sm">
                    This player is not under contract.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bio Tab */}
        {activeTab === "bio" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                Physical Measurements
              </h3>
              <div className="bg-secondary/30 border border-border rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">
                      Height
                    </div>
                    <div className="text-xl font-bold">
                      {heightToString(player.height)}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">
                      Weight
                    </div>
                    <div className="text-xl font-bold">{player.weight} lbs</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">
                      40 Time
                    </div>
                    <div className="text-xl font-bold">
                      {player.fortyTime.toFixed(2)}s
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary/30 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">
                      Age
                    </div>
                    <div className="text-xl font-bold">{player.age}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">
                Background
              </h3>
              <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-3">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground text-sm">College</span>
                  <span className="font-bold">{player.college}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground text-sm">
                    Experience
                  </span>
                  <span className="font-bold">
                    {player.experience === 0
                      ? "Rookie"
                      : `${player.experience} years`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground text-sm">
                    Position
                  </span>
                  <span className="font-bold">{player.position}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground text-sm">
                    Archetype
                  </span>
                  <span className="font-bold">{player.archetype}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
