'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GMBackground,
  GMArchetype,
  getBackgroundsList,
  getArchetypesList,
  getSynergy,
  calculateBonuses,
  GMBonuses,
} from '@/lib/gm';
import { cn } from '@/lib/utils';
import {
  Briefcase,
  Target,
  Sparkles,
  ChevronRight,
  Check,
  ArrowLeft,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface GMCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTeam: { id: string; name: string; city: string } | null;
  onComplete: (background: GMBackground, archetype: GMArchetype) => void;
}

type Step = 'background' | 'archetype' | 'confirm';

// ============================================================================
// BONUS DISPLAY
// ============================================================================

interface BonusListProps {
  bonuses: Partial<GMBonuses>;
  className?: string;
}

function BonusList({ bonuses, className }: BonusListProps) {
  const bonusLabels: Record<keyof GMBonuses, string> = {
    scoutingAccuracy: 'Scouting Accuracy',
    contractDemands: 'Contract Demands',
    tradeAcceptance: 'Trade Acceptance',
    playerDevelopment: 'Player Development',
    freeAgentAppeal: 'Free Agent Appeal',
    teamMorale: 'Team Morale',
    capSpace: 'Cap Space',
    ownerPatience: 'Owner Patience',
    coachAppeal: 'Coach Appeal',
    fanLoyalty: 'Fan Loyalty',
    sleepersPerDraft: 'Sleepers Per Draft',
  };

  const entries = Object.entries(bonuses).filter(([, value]) => value !== 0);

  if (entries.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {entries.map(([key, value]) => {
        const isPositive = (value as number) > 0;
        const label = bonusLabels[key as keyof GMBonuses] || key;
        const displayValue = key === 'capSpace'
          ? `${isPositive ? '+' : ''}$${value}M`
          : key === 'sleepersPerDraft'
          ? `+${value} sleeper${(value as number) > 1 ? 's' : ''}`
          : `${isPositive ? '+' : ''}${value}%`;

        return (
          <Badge
            key={key}
            variant="outline"
            className={cn(
              'text-xs',
              isPositive || key === 'contractDemands'
                ? 'border-green-500/30 text-green-400'
                : 'border-red-500/30 text-red-400'
            )}
          >
            {displayValue} {label}
          </Badge>
        );
      })}
    </div>
  );
}

// ============================================================================
// SELECTION CARD
// ============================================================================

interface SelectionCardProps {
  name: string;
  description: string;
  bonuses: Partial<GMBonuses>;
  extra?: string;
  isSelected: boolean;
  onClick: () => void;
}

function SelectionCard({
  name,
  description,
  bonuses,
  extra,
  isSelected,
  onClick,
}: SelectionCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all',
        isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-zinc-800 hover:border-zinc-700'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-bold text-lg">{name}</div>
            <div className="text-sm text-zinc-400 mt-1">{description}</div>
            {extra && (
              <div className="text-xs text-zinc-500 mt-1 italic">{extra}</div>
            )}
          </div>
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <BonusList bonuses={bonuses} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function GMCreationModal({
  open,
  onOpenChange,
  selectedTeam,
  onComplete,
}: GMCreationModalProps) {
  const [step, setStep] = useState<Step>('background');
  const [selectedBackground, setSelectedBackground] = useState<GMBackground | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<GMArchetype | null>(null);

  const backgrounds = getBackgroundsList();
  const archetypes = getArchetypesList();

  // Check for synergy
  const synergy = useMemo(() => {
    if (!selectedBackground || !selectedArchetype) return null;
    return getSynergy(selectedBackground, selectedArchetype);
  }, [selectedBackground, selectedArchetype]);

  // Calculate total bonuses
  const totalBonuses = useMemo(() => {
    if (!selectedBackground || !selectedArchetype) return null;
    return calculateBonuses(selectedBackground, selectedArchetype);
  }, [selectedBackground, selectedArchetype]);

  const handleNext = () => {
    if (step === 'background' && selectedBackground) {
      setStep('archetype');
    } else if (step === 'archetype' && selectedArchetype) {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'archetype') {
      setStep('background');
    } else if (step === 'confirm') {
      setStep('archetype');
    }
  };

  const handleConfirm = () => {
    if (selectedBackground && selectedArchetype) {
      onComplete(selectedBackground, selectedArchetype);
      // Reset state
      setStep('background');
      setSelectedBackground(null);
      setSelectedArchetype(null);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setStep('background');
      setSelectedBackground(null);
      setSelectedArchetype(null);
    }
    onOpenChange(open);
  };

  if (!selectedTeam) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Create Your GM - {selectedTeam.city} {selectedTeam.name}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          <StepIndicator
            number={1}
            label="Background"
            isActive={step === 'background'}
            isComplete={!!selectedBackground}
          />
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <StepIndicator
            number={2}
            label="Archetype"
            isActive={step === 'archetype'}
            isComplete={!!selectedArchetype}
          />
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <StepIndicator
            number={3}
            label="Confirm"
            isActive={step === 'confirm'}
            isComplete={false}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Background */}
          {step === 'background' && (
            <div className="space-y-4">
              <div className="text-center text-zinc-400 text-sm">
                Your background provides permanent passive bonuses based on your GM&apos;s career history.
              </div>
              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg) => (
                  <SelectionCard
                    key={bg.id}
                    name={bg.name}
                    description={bg.description}
                    bonuses={bg.bonuses}
                    isSelected={selectedBackground === bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Archetype */}
          {step === 'archetype' && (
            <div className="space-y-4">
              <div className="text-center text-zinc-400 text-sm">
                Your archetype defines your management style and provides starting skills.
              </div>
              <div className="grid grid-cols-2 gap-3">
                {archetypes.map((arch) => {
                  const wouldHaveSynergy = selectedBackground && getSynergy(selectedBackground, arch.id);
                  return (
                    <SelectionCard
                      key={arch.id}
                      name={arch.name}
                      description={arch.philosophy}
                      bonuses={arch.bonuses}
                      extra={arch.startingSkill}
                      isSelected={selectedArchetype === arch.id}
                      onClick={() => setSelectedArchetype(arch.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && selectedBackground && selectedArchetype && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-zinc-700">
                  <CardContent className="p-4">
                    <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                      Background
                    </div>
                    <div className="font-bold text-lg">
                      {backgrounds.find((b) => b.id === selectedBackground)?.name}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {backgrounds.find((b) => b.id === selectedBackground)?.description}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-700">
                  <CardContent className="p-4">
                    <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
                      Archetype
                    </div>
                    <div className="font-bold text-lg">
                      {archetypes.find((a) => a.id === selectedArchetype)?.name}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {archetypes.find((a) => a.id === selectedArchetype)?.philosophy}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Synergy Bonus */}
              {synergy && (
                <Card className="border-yellow-500/50 bg-yellow-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-yellow-400">Synergy Bonus: {synergy.name}</span>
                    </div>
                    <div className="text-sm text-zinc-300 mb-3">
                      {synergy.description}
                    </div>
                    <BonusList bonuses={synergy.bonuses} />
                  </CardContent>
                </Card>
              )}

              {/* Total Bonuses */}
              <Card className="border-zinc-700">
                <CardContent className="p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wide mb-3">
                    Total Bonuses
                  </div>
                  {totalBonuses && <BonusList bonuses={totalBonuses} />}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 'background'}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          {step !== 'confirm' ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 'background' && !selectedBackground) ||
                (step === 'archetype' && !selectedArchetype)
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleConfirm}>
              <Check className="w-4 h-4 mr-1" />
              Create GM
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// STEP INDICATOR
// ============================================================================

interface StepIndicatorProps {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

function StepIndicator({ number, label, isActive, isComplete }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
          isActive
            ? 'bg-blue-500 text-white'
            : isComplete
            ? 'bg-green-500 text-white'
            : 'bg-zinc-700 text-zinc-400'
        )}
      >
        {isComplete ? <Check className="w-3 h-3" /> : number}
      </div>
      <span
        className={cn(
          'text-sm',
          isActive ? 'text-white font-medium' : 'text-zinc-500'
        )}
      >
        {label}
      </span>
    </div>
  );
}
