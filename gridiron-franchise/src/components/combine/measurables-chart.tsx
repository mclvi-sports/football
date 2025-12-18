'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Position, type CombineMeasurables } from '@/lib/types';
import { formatMeasurable, getPositionAverage } from '@/lib/season/combine-event';
import {
  COMBINE_MEASURABLES_BY_POSITION,
  type MeasurableRange,
} from '@/lib/data/combine-measurables';

interface MeasurablesChartProps {
  measurables: CombineMeasurables;
  position: Position;
  fortyTime: number;
  height: number;
  weight: number;
  prospectName?: string;
  showComparison?: boolean;
}

interface MeasurableBarProps {
  label: string;
  value: number;
  formattedValue: string;
  isElite: boolean;
  isConcern: boolean;
  positionAvg?: number;
  range?: MeasurableRange;
  lowerIsBetter?: boolean;
}

function MeasurableBar({
  label,
  value,
  formattedValue,
  isElite,
  isConcern,
  positionAvg,
  range,
  lowerIsBetter = false,
}: MeasurableBarProps) {
  // Calculate percentage position in range
  let percentage = 50;
  if (range) {
    const rangeSize = range.max - range.min;
    if (lowerIsBetter) {
      // For time-based measurements, lower is better
      percentage = ((range.max - value) / rangeSize) * 100;
    } else {
      percentage = ((value - range.min) / rangeSize) * 100;
    }
    percentage = Math.max(0, Math.min(100, percentage));
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium',
              isElite && 'text-green-400',
              isConcern && 'text-red-400'
            )}
          >
            {formattedValue}
          </span>
          {isElite && (
            <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
              Elite
            </Badge>
          )}
          {isConcern && (
            <Badge variant="outline" className="text-xs text-red-400 border-red-500/30">
              Concern
            </Badge>
          )}
        </div>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Position average marker */}
        {positionAvg !== undefined && range && (
          <div
            className="absolute top-0 h-full w-0.5 bg-gray-500"
            style={{
              left: `${lowerIsBetter
                ? ((range.max - positionAvg) / (range.max - range.min)) * 100
                : ((positionAvg - range.min) / (range.max - range.min)) * 100
              }%`,
            }}
            title={`Position Avg: ${positionAvg}`}
          />
        )}
        {/* Elite threshold marker */}
        {range?.elite && (
          <div
            className="absolute top-0 h-full w-0.5 bg-green-500/50"
            style={{
              left: `${lowerIsBetter
                ? ((range.max - range.elite) / (range.max - range.min)) * 100
                : ((range.elite - range.min) / (range.max - range.min)) * 100
              }%`,
            }}
            title={`Elite: ${range.elite}`}
          />
        )}
        {/* Value bar */}
        <div
          className={cn(
            'absolute left-0 top-0 h-full rounded-full transition-all',
            isElite ? 'bg-green-500' : isConcern ? 'bg-red-500' : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function MeasurablesChart({
  measurables,
  position,
  fortyTime,
  height,
  weight,
  prospectName,
  showComparison = true,
}: MeasurablesChartProps) {
  const ranges = COMBINE_MEASURABLES_BY_POSITION[position];

  const getMeasurableData = (key: string, rawValue: number, lowerIsBetter = false) => {
    const formatted = formatMeasurable(key, rawValue, position);
    const avg = showComparison ? getPositionAverage(key, position) : undefined;
    const range = ranges?.[key as keyof typeof ranges];
    return {
      formattedValue: formatted.value,
      isElite: formatted.isElite,
      isConcern: formatted.isConcern,
      positionAvg: avg ?? undefined,
      range,
      lowerIsBetter,
    };
  };

  // Format height as feet'inches"
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remaining = inches % 12;
    return `${feet}'${remaining}"`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {prospectName ? `${prospectName} Measurables` : 'Combine Measurables'}
        </CardTitle>
        <CardDescription>
          Position: {position} • Compared to position average
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Physical Measurements */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Physical Measurements</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xl font-bold">{formatHeight(height)}</p>
              <p className="text-xs text-muted-foreground">Height</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xl font-bold">{weight}</p>
              <p className="text-xs text-muted-foreground">Weight (lbs)</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xl font-bold">{measurables.wingspan.toFixed(1)}"</p>
              <p className="text-xs text-muted-foreground">Wingspan</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MeasurableBar
              label="Arm Length"
              value={measurables.armLength}
              {...getMeasurableData('armLength', measurables.armLength)}
            />
            <MeasurableBar
              label="Hand Size"
              value={measurables.handSize}
              {...getMeasurableData('handSize', measurables.handSize)}
            />
          </div>
        </div>

        {/* Speed Tests */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Speed & Agility</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div
              className={cn(
                'rounded-lg p-3',
                fortyTime <= 4.40 ? 'bg-green-500/10' : fortyTime >= 4.70 ? 'bg-red-500/10' : 'bg-muted/30'
              )}
            >
              <p
                className={cn(
                  'text-2xl font-bold',
                  fortyTime <= 4.40 && 'text-green-400',
                  fortyTime >= 4.70 && 'text-red-400'
                )}
              >
                {fortyTime.toFixed(2)}s
              </p>
              <p className="text-xs text-muted-foreground">40-Yard Dash</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-2xl font-bold">{measurables.threeCone.toFixed(2)}s</p>
              <p className="text-xs text-muted-foreground">3-Cone Drill</p>
            </div>
          </div>
          <MeasurableBar
            label="20-Yard Shuttle"
            value={measurables.twentyShuttle}
            {...getMeasurableData('twentyShuttle', measurables.twentyShuttle, true)}
          />
        </div>

        {/* Explosiveness */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Explosiveness</h4>
          <MeasurableBar
            label="Vertical Jump"
            value={measurables.verticalJump}
            {...getMeasurableData('verticalJump', measurables.verticalJump)}
          />
          <MeasurableBar
            label="Broad Jump"
            value={measurables.broadJump}
            {...getMeasurableData('broadJump', measurables.broadJump)}
          />
        </div>

        {/* Strength */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Strength</h4>
          <MeasurableBar
            label="Bench Press (225 lbs)"
            value={measurables.benchPress}
            {...getMeasurableData('benchPress', measurables.benchPress)}
          />
        </div>

        {/* Legend */}
        {showComparison && (
          <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-gray-500" />
              <span>Position Avg</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500/50" />
              <span>Elite Threshold</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MeasurablesChart;
