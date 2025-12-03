"use client";

import type { GMPersona } from "@/types/gm-persona";

interface PersonaSummaryProps {
  persona: GMPersona;
}

export function PersonaSummary({ persona }: PersonaSummaryProps) {
  const { archetype, background, synergy, startingSkill } = persona;

  return (
    <div className="space-y-4 pb-24">
      {/* Header - Icons + Names */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-4 mb-3">
          {/* Archetype Icon */}
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary">
            {archetype.icon}
          </div>

          <span className="text-2xl text-muted-foreground">+</span>

          {/* Background Icon */}
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary">
            {background.icon}
          </div>
        </div>

        {/* Synergy Name */}
        {synergy && (
          <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">
            "{synergy.name}"
          </p>
        )}

        {/* Persona Name */}
        <p className="text-lg font-bold">
          {archetype.name} + {background.name}
        </p>
      </div>

      {/* Background Passive Bonus */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-4">
        <h3 className="text-xs font-bold text-green-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span>✓</span> Background Bonus
        </h3>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="text-green-500 mt-0.5">•</span>
          <span>{background.passiveBonus}</span>
        </div>
      </div>

      {/* Archetype Synergy Bonus */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-4">
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span>⚡</span> Archetype Bonus
        </h3>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>{archetype.synergyBonus}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 italic">
          {archetype.recommendedFor}
        </p>
      </div>

      {/* Starting Skill Section */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3">
          Starting Skill
        </h3>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
          <p className="font-semibold mb-1">{startingSkill.name}</p>
          <p className="text-xs text-primary font-medium mb-2">
            {startingSkill.tier} Tier
          </p>
          <p className="text-sm text-muted-foreground">
            {startingSkill.description}
          </p>
        </div>
      </div>

      {/* Synergy Bonus Section */}
      {synergy && (
        <div className="bg-secondary/50 border border-amber-500/30 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-3">
            ★ Synergy: {synergy.name}
          </h3>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>{synergy.bonus}</span>
          </div>
        </div>
      )}

      {/* Skill Discount */}
      <div className="bg-secondary/50 border border-border rounded-2xl p-4">
        <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span>💰</span> Skill Discount
        </h3>
        <p className="text-sm text-muted-foreground">
          15% discount on <span className="font-medium text-purple-400">{archetype.skillDiscountCategory.replace('_', ' ')}</span> skills
        </p>
      </div>
    </div>
  );
}
