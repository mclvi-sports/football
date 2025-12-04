'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SkillCard } from './skill-card';
import { SkillTierBadge } from './skill-tier-badge';
import { GMPointsDisplay } from './gm-points-display';
import { useGMPointsStore } from '@/stores/gm-points-store';
import { useGMEquipmentStore } from '@/stores/gm-equipment-store';
import { useGMPrestigeStore } from '@/stores/gm-prestige-store';
import {
  allSkills,
  skillCategories,
  getSkillsByCategory,
  getStandardSkills,
  platinumSkills,
  diamondSkills,
} from '@/lib/data/gm-skills';
import type { SkillCategoryId, SkillTierId, GMSkillDefinition } from '@/types/gm-skills';
import type { EquipmentSlot } from '@/types/gm-equipment';
import { ownsSkill, getOwnedTier } from '@/lib/gm-skills-utils';

interface SkillsMenuProps {
  className?: string;
}

export function SkillsMenu({ className }: SkillsMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategoryId | 'all'>(
    'all'
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Store hooks - access raw state to avoid infinite loop from new array refs
  const availableGP = useGMPointsStore((s) => s.getAvailablePoints());
  const purchaseSkill = useGMPointsStore((s) => s.purchaseSkill);
  const slots = useGMEquipmentStore((s) => s.equipment.slots);
  const isEquipped = useGMEquipmentStore((s) => s.isEquipped);
  const equip = useGMEquipmentStore((s) => s.equip);
  const unequip = useGMEquipmentStore((s) => s.unequip);
  const canAccessPlatinum = useGMPrestigeStore((s) => s.canAccessPlatinum());
  const canAccessDiamond = useGMPrestigeStore((s) => s.canAccessDiamond());

  // Derive equipped and empty slots from raw state
  const equippedSkills = useMemo(
    () => slots.filter((s): s is EquipmentSlot & { equippedSkillId: string } =>
      s.isUnlocked && s.equippedSkillId !== null
    ),
    [slots]
  );
  const emptySlots = useMemo(
    () => slots.filter((s) => s.isUnlocked && s.equippedSkillId === null),
    [slots]
  );

  // Mock owned skills state (in real app, this would come from a store)
  const [ownedSkills, setOwnedSkills] = useState<
    { skillId: string; unlockedTier: SkillTierId; purchasedAt: number }[]
  >([]);

  // Get available skills based on prestige
  const availableSkills = useMemo(() => {
    let skills = getStandardSkills();

    if (canAccessPlatinum) {
      skills = [...skills, ...platinumSkills];
    }

    if (canAccessDiamond) {
      skills = [...skills, ...diamondSkills];
    }

    return skills;
  }, [canAccessPlatinum, canAccessDiamond]);

  // Filter by category
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') {
      return availableSkills;
    }
    return availableSkills.filter((s) => s.category === selectedCategory);
  }, [availableSkills, selectedCategory]);

  // Handle purchase
  const handlePurchase = (skillId: string, tier: SkillTierId, cost: number) => {
    const skill = allSkills.find((s) => s.id === skillId);
    if (!skill) return;

    const success = purchaseSkill(skillId, skill.name, tier, cost);
    if (success) {
      setOwnedSkills((prev) => {
        const existing = prev.find((s) => s.skillId === skillId);
        if (existing) {
          return prev.map((s) =>
            s.skillId === skillId ? { ...s, unlockedTier: tier } : s
          );
        }
        return [...prev, { skillId, unlockedTier: tier, purchasedAt: Date.now() }];
      });
    }
  };

  // Handle equip
  const handleEquip = (skillId: string, tier: SkillTierId) => {
    const firstEmpty = emptySlots[0];
    if (!firstEmpty) return;

    equip({
      slotIndex: firstEmpty.slotIndex,
      skillId,
      tier,
    });
  };

  // Handle unequip
  const handleUnequip = (skillId: string) => {
    const equippedSlot = equippedSkills.find((s) => s.equippedSkillId === skillId);
    if (equippedSlot) {
      unequip(equippedSlot.slotIndex);
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold">Skills Library</h2>
        <GMPointsDisplay showBreakdown />
      </div>

      {/* Category tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={(v) => setSelectedCategory(v as SkillCategoryId | 'all')}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start gap-1 p-2 bg-secondary/30 rounded-none overflow-x-auto">
          <TabsTrigger value="all" className="text-xs px-3">
            All
          </TabsTrigger>
          {skillCategories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs px-3">
              <span className="mr-1">{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="flex-1 m-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  ownedTier={getOwnedTier(ownedSkills, skill.id)}
                  isEquipped={isEquipped(skill.id)}
                  availableGP={availableGP}
                  onPurchase={handlePurchase}
                  onEquip={handleEquip}
                  onUnequip={handleUnequip}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SkillsMenuCompactProps {
  onOpenFull?: () => void;
  className?: string;
}

export function SkillsMenuCompact({ onOpenFull, className }: SkillsMenuCompactProps) {
  // Access raw state to avoid infinite loop from new array refs
  const slots = useGMEquipmentStore((s) => s.equipment.slots);

  // Derive equipped skills from raw state
  const equippedSkills = useMemo(
    () => slots.filter((s): s is EquipmentSlot & { equippedSkillId: string } =>
      s.isUnlocked && s.equippedSkillId !== null
    ),
    [slots]
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Equipped Skills</h3>
        {onOpenFull && (
          <Button variant="ghost" size="sm" onClick={onOpenFull}>
            View All
          </Button>
        )}
      </div>

      {equippedSkills.length === 0 ? (
        <p className="text-sm text-muted-foreground">No skills equipped</p>
      ) : (
        <div className="space-y-2">
          {equippedSkills.map((slot) => {
            const skill = allSkills.find((s) => s.id === slot.equippedSkillId);
            if (!skill) return null;

            return (
              <div
                key={slot.slotIndex}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
              >
                <span>
                  {skillCategories.find((c) => c.id === skill.category)?.icon}
                </span>
                <span className="text-sm font-medium flex-1">{skill.name}</span>
                <SkillTierBadge tier={slot.equippedTier!} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
