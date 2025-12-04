'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SkillTierBadge } from './skill-tier-badge';
import type { GMSkillDefinition, SkillTierId } from '@/types/gm-skills';
import { skillCategories } from '@/lib/data/gm-skills';
import { Lock, Check, ChevronRight } from 'lucide-react';

interface SkillCardProps {
  skill: GMSkillDefinition;
  ownedTier: SkillTierId | null;
  isEquipped?: boolean;
  availableGP: number;
  onPurchase?: (skillId: string, tier: SkillTierId, cost: number) => void;
  onEquip?: (skillId: string, tier: SkillTierId) => void;
  onUnequip?: (skillId: string) => void;
  className?: string;
  compact?: boolean;
}

export function SkillCard({
  skill,
  ownedTier,
  isEquipped = false,
  availableGP,
  onPurchase,
  onEquip,
  onUnequip,
  className,
  compact = false,
}: SkillCardProps) {
  const category = skillCategories.find((c) => c.id === skill.category);
  const isOwned = ownedTier !== null;

  // Find next purchasable tier
  const tierOrder: SkillTierId[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const ownedTierIndex = ownedTier ? tierOrder.indexOf(ownedTier) : -1;
  const nextTier = skill.tiers.find((t) => tierOrder.indexOf(t.tier) > ownedTierIndex);
  const canAffordNext = nextTier ? availableGP >= nextTier.cost : false;

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-3 rounded-lg border bg-secondary/30',
          isEquipped && 'border-primary/50 bg-primary/5',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{category?.icon}</span>
          <div>
            <p className="font-medium text-sm">{skill.name}</p>
            {ownedTier && <SkillTierBadge tier={ownedTier} className="mt-0.5" />}
          </div>
        </div>
        {isEquipped && <Check className="h-4 w-4 text-primary" />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-secondary/30 p-4 transition-all',
        isEquipped && 'border-primary/50 bg-primary/5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category?.icon}</span>
          <div>
            <h3 className="font-semibold">{skill.name}</h3>
            <p className="text-xs text-muted-foreground">{category?.name}</p>
          </div>
        </div>
        {isOwned && <SkillTierBadge tier={ownedTier!} />}
      </div>

      {/* Tier effects */}
      <div className="space-y-2 mb-4">
        {skill.tiers.map((tierEffect) => {
          const tierIndex = tierOrder.indexOf(tierEffect.tier);
          const isUnlocked = tierIndex <= ownedTierIndex;
          const isNext = tierIndex === ownedTierIndex + 1;

          return (
            <div
              key={tierEffect.tier}
              className={cn(
                'flex items-start gap-2 p-2 rounded-lg text-sm',
                isUnlocked && 'bg-primary/10',
                isNext && 'bg-amber-500/10 border border-amber-500/30',
                !isUnlocked && !isNext && 'opacity-50'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isUnlocked ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <SkillTierBadge tier={tierEffect.tier} />
                  {!isUnlocked && (
                    <span className="text-xs text-amber-500">{tierEffect.cost} GP</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{tierEffect.effect}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {skill.note && (
        <p className="text-xs text-muted-foreground italic mb-3">{skill.note}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Purchase next tier */}
        {nextTier && onPurchase && (
          <Button
            size="sm"
            variant={canAffordNext ? 'default' : 'outline'}
            disabled={!canAffordNext}
            onClick={() => onPurchase(skill.id, nextTier.tier, nextTier.cost)}
            className="flex-1"
          >
            {canAffordNext ? (
              <>
                Unlock {nextTier.tier} ({nextTier.cost} GP)
              </>
            ) : (
              <>Need {nextTier.cost - availableGP} more GP</>
            )}
          </Button>
        )}

        {/* Equip/Unequip */}
        {isOwned && onEquip && onUnequip && (
          <Button
            size="sm"
            variant={isEquipped ? 'secondary' : 'outline'}
            onClick={() =>
              isEquipped ? onUnequip(skill.id) : onEquip(skill.id, ownedTier!)
            }
            className="flex-shrink-0"
          >
            {isEquipped ? 'Unequip' : 'Equip'}
          </Button>
        )}
      </div>
    </div>
  );
}

interface SkillCardMiniProps {
  skill: GMSkillDefinition;
  tier: SkillTierId;
  onClick?: () => void;
  className?: string;
}

export function SkillCardMini({ skill, tier, onClick, className }: SkillCardMiniProps) {
  const category = skillCategories.find((c) => c.id === skill.category);
  const tierEffect = skill.tiers.find((t) => t.tier === tier);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span>{category?.icon}</span>
        <span className="font-medium text-sm">{skill.name}</span>
        <SkillTierBadge tier={tier} />
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1">
        {tierEffect?.effect}
      </p>
    </button>
  );
}
