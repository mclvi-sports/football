'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Play, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadyCheck {
  id: string;
  label: string;
  isReady: boolean;
  required: boolean;
}

interface ReadyIndicatorProps {
  checks: ReadyCheck[];
  onStartSeason: () => void;
  disabled?: boolean;
}

export function ReadyIndicator({ checks, onStartSeason, disabled }: ReadyIndicatorProps) {
  const requiredChecks = checks.filter((c) => c.required);
  const allRequiredReady = requiredChecks.every((c) => c.isReady);
  const readyCount = requiredChecks.filter((c) => c.isReady).length;
  const totalRequired = requiredChecks.length;

  return (
    <Card
      className={cn(
        'transition-all',
        allRequiredReady
          ? 'border-green-500 bg-gradient-to-r from-green-500/10 to-green-600/10'
          : 'border-yellow-500/50 bg-yellow-500/5'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Status */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                allRequiredReady ? 'bg-green-500/20' : 'bg-yellow-500/20'
              )}
            >
              {allRequiredReady ? (
                <Check className="h-6 w-6 text-green-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {allRequiredReady ? 'Ready to Play!' : 'Setup Incomplete'}
              </h3>
              <p className="text-sm text-zinc-400">
                {readyCount} / {totalRequired} required modules generated
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-wrap gap-2">
            {checks.map((check) => (
              <div
                key={check.id}
                className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                  check.isReady
                    ? 'bg-green-500/20 text-green-400'
                    : check.required
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-zinc-700 text-zinc-400'
                )}
              >
                {check.isReady ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {check.label}
              </div>
            ))}
          </div>

          {/* Start Button */}
          <Button
            size="lg"
            onClick={onStartSeason}
            disabled={!allRequiredReady || disabled}
            className={cn(
              'min-w-[160px]',
              allRequiredReady
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-zinc-700 text-zinc-400'
            )}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Season
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
