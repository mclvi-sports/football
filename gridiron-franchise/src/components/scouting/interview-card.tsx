'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Interview, InterviewCategory } from '@/lib/scouting/types';
import { formatInterviewImpression, getQuestionCategories, getInterviewCost } from '@/lib/scouting/interview-system';

interface InterviewCardProps {
  interview?: Interview;
  prospectName: string;
  prospectPosition: string;
  prospectCollege: string;
  availablePoints: number;
  onRequestInterview?: (categories: InterviewCategory[]) => void;
  isLoading?: boolean;
}

const CATEGORY_LABELS: Record<InterviewCategory, { label: string; icon: string }> = {
  football_iq: { label: 'Football IQ', icon: '🧠' },
  character: { label: 'Character', icon: '👤' },
  work_ethic: { label: 'Work Ethic', icon: '💪' },
  leadership: { label: 'Leadership', icon: '👑' },
  medical: { label: 'Medical', icon: '🏥' },
  personal: { label: 'Personal', icon: '🏠' },
};

const IMPRESSION_COLORS: Record<Interview['overallImpression'], string> = {
  excellent: 'bg-green-500/20 text-green-400 border-green-500/30',
  good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  average: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  concerning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  poor: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const QUALITY_COLORS: Record<string, string> = {
  excellent: 'text-green-400',
  good: 'text-blue-400',
  neutral: 'text-gray-400',
  poor: 'text-yellow-400',
  red_flag: 'text-red-400',
};

export function InterviewCard({
  interview,
  prospectName,
  prospectPosition,
  prospectCollege,
  availablePoints,
  onRequestInterview,
  isLoading = false,
}: InterviewCardProps) {
  const [selectedCategories, setSelectedCategories] = useState<InterviewCategory[]>([]);
  const cost = getInterviewCost();
  const canAfford = availablePoints >= cost;

  const toggleCategory = (category: InterviewCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleRequestInterview = () => {
    if (onRequestInterview && canAfford) {
      onRequestInterview(selectedCategories.length > 0 ? selectedCategories : getQuestionCategories());
    }
  };

  // If interview completed, show results
  if (interview) {
    return (
      <Card className="rounded-xl border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{prospectName}</CardTitle>
              <CardDescription>
                {prospectPosition} - {prospectCollege}
              </CardDescription>
            </div>
            <Badge className={cn('font-semibold', IMPRESSION_COLORS[interview.overallImpression])}>
              {formatInterviewImpression(interview.overallImpression)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Q&A Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Interview Responses</h4>
            {interview.responses.map((response, idx) => {
              const question = interview.questions.find((q) => q.id === response.questionId);
              return (
                <div key={response.questionId} className="rounded-lg bg-muted/30 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-muted-foreground">{question?.question}</p>
                    <Badge variant="outline" className={cn('shrink-0', QUALITY_COLORS[response.quality])}>
                      {response.quality}
                    </Badge>
                  </div>
                  {response.revealedInfo && (
                    <p className="mt-1 text-sm font-medium">
                      Revealed: <span className="text-primary">{response.revealedInfo.replace(/_/g, ' ')}</span>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confidence: {response.confidence}%
                  </p>
                </div>
              );
            })}
          </div>

          {/* Traits Revealed */}
          {interview.traitsRevealed.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Traits Revealed</h4>
              <div className="flex flex-wrap gap-1">
                {interview.traitsRevealed.map((trait) => (
                  <Badge key={trait} variant="secondary">
                    {trait.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Flags */}
          <div className="grid grid-cols-2 gap-4">
            {interview.greenFlagsIdentified.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-green-400">Green Flags</h4>
                <ul className="space-y-1 text-sm">
                  {interview.greenFlagsIdentified.map((flag, idx) => (
                    <li key={idx} className="text-muted-foreground">
                      + {flag.replace(/_/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interview.redFlagsIdentified.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-red-400">Red Flags</h4>
                <ul className="space-y-1 text-sm">
                  {interview.redFlagsIdentified.map((flag, idx) => (
                    <li key={idx} className="text-muted-foreground">
                      - {flag.replace(/_/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Request interview UI
  return (
    <Card className="rounded-xl border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Interview {prospectName}</CardTitle>
            <CardDescription>
              {prospectPosition} - {prospectCollege}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn(!canAfford && 'text-red-400')}>
            Cost: {cost} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Focus Areas (optional - select specific topics)
          </h4>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORY_LABELS) as [InterviewCategory, { label: string; icon: string }][]).map(
              ([category, { label, icon }]) => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="gap-1"
                >
                  <span>{icon}</span>
                  {label}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Available Points */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Available Points:</span>
          <span className={cn('font-medium', !canAfford && 'text-red-400')}>{availablePoints}</span>
        </div>

        {/* Request Button */}
        <Button
          onClick={handleRequestInterview}
          disabled={!canAfford || isLoading}
          className="w-full"
        >
          {isLoading ? 'Conducting Interview...' : 'Request Interview'}
        </Button>

        {!canAfford && (
          <p className="text-center text-sm text-red-400">
            Not enough scouting points for interview
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default InterviewCard;
