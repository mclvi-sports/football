'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkillTierBadge } from './skill-tier-badge';
import { SkillCardMini } from './skill-card';
import { useGMEquipmentStore } from '@/stores/gm-equipment-store';
import { getSkillById, skillCategories } from '@/lib/data/gm-skills';
import { SLOT_UNLOCK_CONDITIONS } from '@/types/gm-equipment';
import { canChangeEquipment } from '@/lib/gm-equipment-utils';
import { Lock, Plus, X } from 'lucide-react';

interface EquipmentSlotsProps {
  onSlotClick?: (slotIndex: number) => void;
  onUnequip?: (slotIndex: number) => void;
  className?: string;
}

export function EquipmentSlots({
  onSlotClick,
  onUnequip,
  className,
}: EquipmentSlotsProps) {
  // Access raw state to avoid infinite loop from getChangeWindow returning new objects
  const slots = useGMEquipmentStore((s) => s.equipment.slots);
  const maxSlots = useGMEquipmentStore((s) => s.equipment.maxSlots);
  const isOffseason = useGMEquipmentStore((s) => s.isOffseason);
  const currentPhase = useGMEquipmentStore((s) => s.currentPhase);

  // Derive changeWindow from raw state
  const changeWindow = useMemo(
    () => canChangeEquipment(isOffseason, currentPhase),
    [isOffseason, currentPhase]
  );

  // Only show slots up to maxSlots
  const visibleSlots = useMemo(
    () => slots.filter((s) => s.slotIndex <= maxSlots),
    [slots, maxSlots]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Equipment Slots</h3>
        {!changeWindow.canChange && (
          <span className="text-xs text-muted-foreground">
            {changeWindow.reason}
          </span>
        )}
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleSlots.map((slot) => {
          const skill = slot.equippedSkillId
            ? getSkillById(slot.equippedSkillId)
            : null;
          const category = skill
            ? skillCategories.find((c) => c.id === skill.category)
            : null;

          if (!slot.isUnlocked) {
            return (
              <LockedSlot
                key={slot.slotIndex}
                slotIndex={slot.slotIndex}
              />
            );
          }

          if (!skill) {
            return (
              <EmptySlot
                key={slot.slotIndex}
                slotIndex={slot.slotIndex}
                onClick={() => onSlotClick?.(slot.slotIndex)}
                disabled={!changeWindow.canChange}
              />
            );
          }

          return (
            <FilledSlot
              key={slot.slotIndex}
              slotIndex={slot.slotIndex}
              skillName={skill.name}
              skillIcon={category?.icon || '?'}
              tier={slot.equippedTier!}
              positionGroup={slot.positionGroup}
              onUnequip={() => onUnequip?.(slot.slotIndex)}
              canChange={changeWindow.canChange}
            />
          );
        })}
      </div>
    </div>
  );
}

interface LockedSlotProps {
  slotIndex: number;
}

function LockedSlot({ slotIndex }: LockedSlotProps) {
  const getUnlockProgress = useGMEquipmentStore((s) => s.getUnlockProgress);
  const progress = getUnlockProgress(slotIndex);
  const condition = SLOT_UNLOCK_CONDITIONS.find((c) => c.slotIndex === slotIndex);

  return (
    <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-secondary/20 p-4 opacity-60">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Slot {slotIndex}</span>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground mb-2">{condition?.description}</p>
      {progress.length > 0 && (
        <div className="space-y-1">
          {progress.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <Progress
                value={(p.current / p.target) * 100}
                className="h-1 flex-1"
              />
              <span className="text-xs text-muted-foreground">
                {p.current}/{p.target}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface EmptySlotProps {
  slotIndex: number;
  onClick: () => void;
  disabled?: boolean;
}

function EmptySlot({ slotIndex, onClick, disabled }: EmptySlotProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 transition-all',
        'hover:border-primary/50 hover:bg-primary/10',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/30'
      )}
    >
      <div className="flex flex-col items-center justify-center h-16 gap-2">
        <Plus className="h-6 w-6 text-primary/50" />
        <span className="text-xs text-muted-foreground">Slot {slotIndex}</span>
      </div>
    </button>
  );
}

interface FilledSlotProps {
  slotIndex: number;
  skillName: string;
  skillIcon: string;
  tier: string;
  positionGroup?: string;
  onUnequip: () => void;
  canChange: boolean;
}

function FilledSlot({
  slotIndex,
  skillName,
  skillIcon,
  tier,
  positionGroup,
  onUnequip,
  canChange,
}: FilledSlotProps) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-muted-foreground">Slot {slotIndex}</span>
        {canChange && (
          <button
            onClick={onUnequip}
            className="p-1 rounded hover:bg-secondary/50 transition-colors"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl">{skillIcon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{skillName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <SkillTierBadge tier={tier as any} />
            {positionGroup && (
              <span className="text-xs text-muted-foreground">
                ({positionGroup})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EquipmentSlotsCompactProps {
  className?: string;
}

export function EquipmentSlotsCompact({ className }: EquipmentSlotsCompactProps) {
  // Access raw state to avoid infinite loop from new array refs
  const slots = useGMEquipmentStore((s) => s.equipment.slots);
  const maxSlots = useGMEquipmentStore((s) => s.equipment.maxSlots);

  // Derive counts from raw state
  const unlockedCount = useMemo(
    () => slots.filter((s) => s.isUnlocked).length,
    [slots]
  );
  const equippedCount = useMemo(
    () => slots.filter((s) => s.isUnlocked && s.equippedSkillId !== null).length,
    [slots]
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex gap-1">
        {Array.from({ length: maxSlots }).map((_, i) => {
          const slotNum = i + 1;
          const isUnlocked = slotNum <= unlockedCount;
          const isFilled = slotNum <= equippedCount;

          return (
            <div
              key={i}
              className={cn(
                'w-3 h-3 rounded-sm border',
                isFilled && 'bg-primary border-primary',
                isUnlocked && !isFilled && 'border-primary/50',
                !isUnlocked && 'border-muted-foreground/30'
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">
        {equippedCount}/{unlockedCount} slots
      </span>
    </div>
  );
}
