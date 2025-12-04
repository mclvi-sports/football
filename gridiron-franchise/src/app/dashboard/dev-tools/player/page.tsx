"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayerCard } from "@/components/dev-tools/player-card";
import { Player, Position, Archetype } from "@/lib/types";
import { POSITION_ARCHETYPES } from "@/lib/data/archetype-templates";
import { cn } from "@/lib/utils";

export default function SinglePlayerGeneratorPage() {
  const router = useRouter();
  const [position, setPosition] = useState<Position | "random">("random");
  const [targetOvr, setTargetOvr] = useState<number>(75);
  const [archetype, setArchetype] = useState<Archetype | "random">("random");
  const [slot, setSlot] = useState<number>(1);
  const [player, setPlayer] = useState<Player | null>(null);
  const [history, setHistory] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  // Get archetypes for selected position
  const availableArchetypes = position !== "random"
    ? POSITION_ARCHETYPES[position] || []
    : [];

  const generatePlayer = async () => {
    setLoading(true);
    try {
      const body: Record<string, unknown> = {};

      if (position !== "random") {
        body.position = position;
      }
      body.targetOvr = targetOvr;
      if (archetype !== "random" && position !== "random") {
        body.archetype = archetype;
      }
      body.slot = slot;

      const response = await fetch("/api/dev/generate-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        setPlayer(data.player);
        setHistory((prev) => [data.player, ...prev].slice(0, 10)); // Keep last 10
      }
    } catch (error) {
      console.error("Failed to generate player:", error);
    }
    setLoading(false);
  };

  const handlePlayerClick = (playerId: string) => {
    router.push(`/dashboard/dev-tools/player/${playerId}`);
  };

  // Reset archetype when position changes
  const handlePositionChange = (newPosition: Position | "random") => {
    setPosition(newPosition);
    setArchetype("random");
  };

  return (
    <div className="min-h-screen pb-8">
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          ← Back to Dev Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Single Player Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test player generation with custom parameters
        </p>
      </header>

      <main className="px-5 space-y-6">
        {/* Controls */}
        <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Position */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => handlePositionChange(e.target.value as Position | "random")}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="random">Random</option>
                <optgroup label="Offense">
                  <option value={Position.QB}>QB</option>
                  <option value={Position.RB}>RB</option>
                  <option value={Position.WR}>WR</option>
                  <option value={Position.TE}>TE</option>
                  <option value={Position.LT}>LT</option>
                  <option value={Position.LG}>LG</option>
                  <option value={Position.C}>C</option>
                  <option value={Position.RG}>RG</option>
                  <option value={Position.RT}>RT</option>
                </optgroup>
                <optgroup label="Defense">
                  <option value={Position.DE}>DE</option>
                  <option value={Position.DT}>DT</option>
                  <option value={Position.MLB}>MLB</option>
                  <option value={Position.OLB}>OLB</option>
                  <option value={Position.CB}>CB</option>
                  <option value={Position.FS}>FS</option>
                  <option value={Position.SS}>SS</option>
                </optgroup>
                <optgroup label="Special Teams">
                  <option value={Position.K}>K</option>
                  <option value={Position.P}>P</option>
                </optgroup>
              </select>
            </div>

            {/* Target OVR */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Target OVR: {targetOvr}
              </label>
              <input
                type="range"
                min={50}
                max={99}
                value={targetOvr}
                onChange={(e) => setTargetOvr(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>50</span>
                <span>75</span>
                <span>99</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Archetype */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Archetype
              </label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value as Archetype | "random")}
                disabled={position === "random"}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm disabled:opacity-50"
              >
                <option value="random">Random</option>
                {availableArchetypes.map((arch) => (
                  <option key={arch} value={arch}>
                    {arch.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Depth Slot */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Depth Slot
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(parseInt(e.target.value))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value={1}>Starter (1)</option>
                <option value={2}>Backup (2)</option>
                <option value={3}>Depth (3)</option>
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">
                Affects age distribution
              </p>
            </div>
          </div>

          <button
            onClick={generatePlayer}
            disabled={loading}
            className={cn(
              "w-full px-6 py-3 rounded-lg font-semibold text-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Generating..." : "Generate Player"}
          </button>
        </div>

        {/* Current Player */}
        {player && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Generated Player
            </h2>
            <div
              onClick={() => handlePlayerClick(player.id)}
              className="cursor-pointer hover:scale-[1.01] transition-transform"
            >
              <PlayerCard player={player} compact={false} />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-yellow-400">{player.overall}</div>
                <div className="text-[10px] text-muted-foreground">OVR</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-green-400">{player.potential}</div>
                <div className="text-[10px] text-muted-foreground">POT</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                <div className="text-lg font-bold">{player.age}</div>
                <div className="text-[10px] text-muted-foreground">Age</div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-lg p-2 text-center">
                <div className="text-lg font-bold">{player.experience}</div>
                <div className="text-[10px] text-muted-foreground">Exp</div>
              </div>
            </div>

            {/* Archetype & Physical */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary/50 border border-border rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Archetype</div>
                <div className="font-medium text-sm">
                  {player.archetype.replace(/_/g, " ")}
                </div>
              </div>
              <div className="bg-secondary/50 border border-border rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Physical</div>
                <div className="font-medium text-sm">
                  {player.height}" / {player.weight} lbs
                </div>
              </div>
            </div>

            {/* Traits */}
            {player.traits && player.traits.length > 0 && (
              <div className="bg-secondary/50 border border-border rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-2">Traits</div>
                <div className="flex flex-wrap gap-1">
                  {player.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-0.5 bg-secondary rounded text-xs"
                    >
                      {trait.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {player.badges && player.badges.length > 0 && (
              <div className="bg-secondary/50 border border-border rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-2">Badges</div>
                <div className="flex flex-wrap gap-1">
                  {player.badges.map((badge, i) => (
                    <span
                      key={i}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs",
                        badge.tier === "hof" && "bg-amber-500/20 text-amber-400",
                        badge.tier === "gold" && "bg-yellow-500/20 text-yellow-400",
                        badge.tier === "silver" && "bg-gray-400/20 text-gray-300",
                        badge.tier === "bronze" && "bg-orange-700/20 text-orange-400"
                      )}
                    >
                      {badge.id.replace(/_/g, " ")} ({badge.tier})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generation History */}
        {history.length > 1 && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Recent ({history.length - 1})
            </h2>
            <div className="space-y-2">
              {history.slice(1).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPlayer(p)}
                  className="cursor-pointer hover:bg-secondary/30 transition-colors"
                >
                  <PlayerCard player={p} compact={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!player && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-2">🏈</div>
            <p>Configure options and click Generate to create a player</p>
          </div>
        )}
      </main>
    </div>
  );
}
