'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ScoutingReport, DraftGrade, PotentialVisibility } from '@/lib/scouting/types';
import { cn } from '@/lib/utils';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  Target,
  Shield,
} from 'lucide-react';

// ============================================================================
// GRADE HELPERS
// ============================================================================

function getGradeColor(grade: DraftGrade): string {
  if (grade.startsWith('A')) return 'text-green-400';
  if (grade.startsWith('B')) return 'text-blue-400';
  if (grade.startsWith('C')) return 'text-yellow-400';
  if (grade === 'D') return 'text-orange-400';
  return 'text-red-400';
}

function getGradeBgColor(grade: DraftGrade): string {
  if (grade.startsWith('A')) return 'bg-green-500/20 border-green-500/30';
  if (grade.startsWith('B')) return 'bg-blue-500/20 border-blue-500/30';
  if (grade.startsWith('C')) return 'bg-yellow-500/20 border-yellow-500/30';
  if (grade === 'D') return 'bg-orange-500/20 border-orange-500/30';
  return 'bg-red-500/20 border-red-500/30';
}

function getPotentialDisplay(
  visibility: PotentialVisibility,
  value?: number | [number, number] | string
): string {
  switch (visibility) {
    case 'exact':
      return typeof value === 'number' ? `${value} OVR` : 'N/A';
    case 'range':
      return Array.isArray(value) ? `${value[0]}-${value[1]} OVR` : 'N/A';
    case 'tier':
      return typeof value === 'string' ? value : 'Star/Starter/Backup/Bust';
    case 'vague':
      return 'Unclear';
    case 'hidden':
      return '???';
    default:
      return 'Unknown';
  }
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return 'text-green-400';
  if (confidence >= 70) return 'text-blue-400';
  if (confidence >= 55) return 'text-yellow-400';
  return 'text-orange-400';
}

// ============================================================================
// SCOUTING REPORT CARD - FULL
// ============================================================================

interface ScoutingReportCardProps {
  report: ScoutingReport;
  prospectName?: string;
  scoutName?: string;
  className?: string;
}

export function ScoutingReportCard({
  report,
  prospectName,
  scoutName,
  className,
}: ScoutingReportCardProps) {
  return (
    <Card className={cn('bg-zinc-900/50 border-zinc-800', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              {prospectName || 'Prospect'} Report
            </CardTitle>
            {scoutName && (
              <div className="text-sm text-zinc-400 mt-1">Scouted by {scoutName}</div>
            )}
          </div>
          <div
            className={cn(
              'text-2xl font-bold px-3 py-1 rounded border',
              getGradeBgColor(report.draftGrade),
              getGradeColor(report.draftGrade)
            )}
          >
            {report.draftGrade}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Evaluations */}
        <div className="grid grid-cols-2 gap-4">
          {/* Scouted OVR */}
          <div className="p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Target className="w-3.5 h-3.5" />
              Scouted OVR
            </div>
            <div className="text-2xl font-bold text-zinc-100">{report.scoutedOvr}</div>
            <div className={cn('text-xs', getConfidenceColor(report.ovrConfidence))}>
              {report.ovrConfidence}% confidence
            </div>
          </div>

          {/* Potential */}
          <div className="p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Potential
            </div>
            <div className="text-lg font-bold text-zinc-100">
              {getPotentialDisplay(report.potentialVisibility, report.potentialValue)}
            </div>
            <div className="text-xs text-zinc-500 capitalize">
              {report.potentialVisibility} visibility
            </div>
          </div>
        </div>

        {/* Round Projection */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
          <span className="text-sm text-zinc-400">Projected Round</span>
          <Badge variant="outline" className="bg-zinc-800">
            Round {report.roundProjection}
          </Badge>
        </div>

        {/* Risk Indicators */}
        <div className="grid grid-cols-2 gap-3">
          {/* Bust Risk */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-400">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Bust Risk
              </span>
              <span
                className={cn(
                  'font-medium',
                  report.bustRisk >= 50
                    ? 'text-red-400'
                    : report.bustRisk >= 25
                    ? 'text-yellow-400'
                    : 'text-green-400'
                )}
              >
                {report.bustRisk}%
              </span>
            </div>
            <Progress
              value={report.bustRisk}
              className={cn(
                'h-1.5',
                report.bustRisk >= 50 && '[&>div]:bg-red-500',
                report.bustRisk >= 25 && report.bustRisk < 50 && '[&>div]:bg-yellow-500',
                report.bustRisk < 25 && '[&>div]:bg-green-500'
              )}
            />
          </div>

          {/* Sleeper Flag */}
          <div className="flex items-center gap-2 p-2 rounded bg-zinc-800/30">
            {report.sleeperFlag ? (
              <>
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">Sleeper Alert!</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-zinc-500" />
                <span className="text-sm text-zinc-500">No sleeper flag</span>
              </>
            )}
          </div>
        </div>

        {/* Traits */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Traits Revealed
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {report.traitsRevealed.map((trait, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs bg-zinc-800/50 flex items-center gap-1"
              >
                <Eye className="w-3 h-3 text-green-400" />
                {trait}
              </Badge>
            ))}
            {report.traitsHidden > 0 && (
              <Badge
                variant="outline"
                className="text-xs bg-zinc-800/50 text-zinc-500 flex items-center gap-1"
              >
                <EyeOff className="w-3 h-3" />
                {report.traitsHidden} hidden
              </Badge>
            )}
          </div>
        </div>

        {/* Attributes Revealed */}
        {report.attributesRevealed.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Attributes Revealed
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {report.attributesRevealed.map((attr, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs capitalize">
                  {attr}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Text Summary */}
        {report.textSummary && (
          <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
            <p className="text-sm text-zinc-300 italic">{report.textSummary}</p>
          </div>
        )}

        {/* Report Meta */}
        <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
          Generated Week {report.week} •{' '}
          {new Date(report.generatedAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SCOUTING REPORT - COMPACT
// ============================================================================

interface ScoutingReportCompactProps {
  report: ScoutingReport;
  prospectName?: string;
  onClick?: () => void;
  className?: string;
}

export function ScoutingReportCompact({
  report,
  prospectName,
  onClick,
  className,
}: ScoutingReportCompactProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer',
        'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center font-bold border',
            getGradeBgColor(report.draftGrade),
            getGradeColor(report.draftGrade)
          )}
        >
          {report.draftGrade}
        </div>
        <div>
          <div className="font-medium text-zinc-100">
            {prospectName || 'Unknown Prospect'}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>OVR {report.scoutedOvr}</span>
            <span>•</span>
            <span>Rd {report.roundProjection}</span>
            {report.sleeperFlag && (
              <>
                <span>•</span>
                <span className="text-yellow-400 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  Sleeper
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className={cn('text-sm', getConfidenceColor(report.ovrConfidence))}>
          {report.ovrConfidence}%
        </div>
        <div className="text-xs text-zinc-500">confidence</div>
      </div>
    </div>
  );
}
