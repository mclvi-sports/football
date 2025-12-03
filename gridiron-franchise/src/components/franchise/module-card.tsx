'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, RefreshCw, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModuleStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isGenerated: boolean;
  count?: number;
  countLabel?: string;
  lastGenerated?: string;
}

interface ModuleCardProps {
  module: ModuleStatus;
  isGenerating: boolean;
  onGenerate: () => void;
  onClear?: () => void;
  onView?: () => void;
  disabled?: boolean;
}

export function ModuleCard({ module, isGenerating, onGenerate, onClear, onView, disabled }: ModuleCardProps) {
  return (
    <Card
      className={cn(
        'transition-all',
        module.isGenerated
          ? 'border-green-500/50 bg-green-500/5'
          : 'border-zinc-700 bg-zinc-900/50'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Icon and Info */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                module.isGenerated ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'
              )}
            >
              {module.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{module.name}</h3>
                {module.isGenerated ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-zinc-500" />
                )}
              </div>
              <p className="text-xs text-zinc-500">{module.description}</p>
              {module.isGenerated && module.count !== undefined && (
                <p className="mt-1 text-sm font-medium text-green-400">
                  {module.count} {module.countLabel || 'items'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {module.isGenerated && onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onView}
                disabled={isGenerating || disabled}
                className="h-8 w-8 p-0 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {module.isGenerated && onClear && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                disabled={isGenerating || disabled}
                className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant={module.isGenerated ? 'outline' : 'default'}
              size="sm"
              onClick={onGenerate}
              disabled={isGenerating || disabled}
              className={cn(
                'min-w-[90px]',
                module.isGenerated && 'border-zinc-700 text-zinc-400 hover:text-white'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ...
                </>
              ) : module.isGenerated ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Regen
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
