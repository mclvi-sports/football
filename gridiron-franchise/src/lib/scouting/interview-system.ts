/**
 * Interview System
 *
 * Pre-draft interview system for evaluating prospects beyond physical attributes.
 * Reveals character traits, work ethic, football IQ, and potential red flags.
 */

import { randomUUID } from 'crypto';
import {
  Interview,
  InterviewCategory,
  InterviewQuestion,
  InterviewResponse,
  InterviewRevealType,
  INTERVIEW_POINT_COST,
  INTERVIEW_QUESTION_COUNT,
  INTERVIEW_REVEAL_ACCURACY,
  Scout,
} from './types';

// ============================================================================
// QUESTION BANKS
// ============================================================================

const FOOTBALL_IQ_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'fiq_1',
    category: 'football_iq',
    question: 'Walk me through your pre-snap read process.',
    reveals: 'attribute_hint',
    difficulty: 3,
  },
  {
    id: 'fiq_2',
    category: 'football_iq',
    question: 'How do you adjust when the defense shows a different look?',
    reveals: 'scheme_fit',
    difficulty: 4,
  },
  {
    id: 'fiq_3',
    category: 'football_iq',
    question: 'What was the most complex offensive/defensive scheme you ran in college?',
    reveals: 'attribute_hint',
    difficulty: 2,
  },
  {
    id: 'fiq_4',
    category: 'football_iq',
    question: 'How do you prepare for game day mentally?',
    reveals: 'trait',
    difficulty: 2,
  },
  {
    id: 'fiq_5',
    category: 'football_iq',
    question: 'Describe a play where you had to make a split-second decision.',
    reveals: 'attribute_hint',
    difficulty: 3,
  },
];

const CHARACTER_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'chr_1',
    category: 'character',
    question: 'Tell me about a time you faced adversity and how you handled it.',
    reveals: 'trait',
    difficulty: 2,
  },
  {
    id: 'chr_2',
    category: 'character',
    question: 'How do you handle criticism from coaches?',
    reveals: 'character_flag',
    difficulty: 3,
  },
  {
    id: 'chr_3',
    category: 'character',
    question: 'Describe your relationship with your college teammates.',
    reveals: 'leadership_quality',
    difficulty: 2,
  },
  {
    id: 'chr_4',
    category: 'character',
    question: 'What would your biggest critic say about you?',
    reveals: 'character_flag',
    difficulty: 4,
  },
  {
    id: 'chr_5',
    category: 'character',
    question: 'Have you ever had any issues off the field we should know about?',
    reveals: 'bust_risk',
    difficulty: 5,
  },
];

const WORK_ETHIC_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'wrk_1',
    category: 'work_ethic',
    question: 'Describe your typical training routine.',
    reveals: 'work_ethic_indicator',
    difficulty: 2,
  },
  {
    id: 'wrk_2',
    category: 'work_ethic',
    question: 'How do you spend your off-season?',
    reveals: 'trait',
    difficulty: 2,
  },
  {
    id: 'wrk_3',
    category: 'work_ethic',
    question: 'What areas of your game are you actively working to improve?',
    reveals: 'work_ethic_indicator',
    difficulty: 3,
  },
  {
    id: 'wrk_4',
    category: 'work_ethic',
    question: 'Tell me about a time you went above and beyond in your preparation.',
    reveals: 'trait',
    difficulty: 3,
  },
  {
    id: 'wrk_5',
    category: 'work_ethic',
    question: 'How do you balance football with other aspects of life?',
    reveals: 'character_flag',
    difficulty: 2,
  },
];

const LEADERSHIP_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'ldr_1',
    category: 'leadership',
    question: 'Were you a team captain? If so, what did that mean to you?',
    reveals: 'leadership_quality',
    difficulty: 2,
  },
  {
    id: 'ldr_2',
    category: 'leadership',
    question: 'How do you motivate teammates who are struggling?',
    reveals: 'trait',
    difficulty: 3,
  },
  {
    id: 'ldr_3',
    category: 'leadership',
    question: 'Describe a situation where you had to lead by example.',
    reveals: 'leadership_quality',
    difficulty: 3,
  },
  {
    id: 'ldr_4',
    category: 'leadership',
    question: 'How do you handle disagreements with coaches or teammates?',
    reveals: 'character_flag',
    difficulty: 4,
  },
  {
    id: 'ldr_5',
    category: 'leadership',
    question: 'What makes someone a good leader in the locker room?',
    reveals: 'trait',
    difficulty: 2,
  },
];

const MEDICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'med_1',
    category: 'medical',
    question: 'Tell me about any injuries you\'ve had and your recovery process.',
    reveals: 'injury_concern',
    difficulty: 3,
  },
  {
    id: 'med_2',
    category: 'medical',
    question: 'How has your body held up through your college career?',
    reveals: 'injury_concern',
    difficulty: 2,
  },
  {
    id: 'med_3',
    category: 'medical',
    question: 'Are there any lingering issues we should know about?',
    reveals: 'bust_risk',
    difficulty: 4,
  },
  {
    id: 'med_4',
    category: 'medical',
    question: 'How do you take care of your body during the season?',
    reveals: 'trait',
    difficulty: 2,
  },
  {
    id: 'med_5',
    category: 'medical',
    question: 'Have you ever played through an injury? How did that go?',
    reveals: 'injury_concern',
    difficulty: 3,
  },
];

const PERSONAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'per_1',
    category: 'personal',
    question: 'What motivates you to play football?',
    reveals: 'trait',
    difficulty: 1,
  },
  {
    id: 'per_2',
    category: 'personal',
    question: 'Where do you see yourself in 5 years?',
    reveals: 'work_ethic_indicator',
    difficulty: 2,
  },
  {
    id: 'per_3',
    category: 'personal',
    question: 'What\'s the most important thing for you in choosing a team?',
    reveals: 'character_flag',
    difficulty: 2,
  },
  {
    id: 'per_4',
    category: 'personal',
    question: 'Tell me about your family and support system.',
    reveals: 'trait',
    difficulty: 2,
  },
  {
    id: 'per_5',
    category: 'personal',
    question: 'What do you do outside of football?',
    reveals: 'character_flag',
    difficulty: 1,
  },
];

const ALL_QUESTIONS: Record<InterviewCategory, InterviewQuestion[]> = {
  football_iq: FOOTBALL_IQ_QUESTIONS,
  character: CHARACTER_QUESTIONS,
  work_ethic: WORK_ETHIC_QUESTIONS,
  leadership: LEADERSHIP_QUESTIONS,
  medical: MEDICAL_QUESTIONS,
  personal: PERSONAL_QUESTIONS,
};

// ============================================================================
// TRAIT MAPPING FOR REVEALS
// ============================================================================

// Traits that can be revealed through interviews
const INTERVIEW_REVEALABLE_TRAITS: Record<InterviewCategory, string[]> = {
  football_iq: ['film_junkie', 'high_motor', 'quick_learner', 'slow_learner', 'coachable'],
  character: ['team_player', 'selfish', 'diva', 'humble', 'ego', 'locker_room_cancer'],
  work_ethic: ['gym_rat', 'first_in_last_out', 'lazy', 'unmotivated', 'dedicated'],
  leadership: ['natural_leader', 'vocal_leader', 'lead_by_example', 'quiet', 'captain_material'],
  medical: ['iron_man', 'injury_prone', 'plays_through_pain', 'cautious'],
  personal: ['mature', 'immature', 'family_oriented', 'focused', 'distracted'],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getScoutOvrRange(ovr: number): string {
  if (ovr >= 90) return '90-99';
  if (ovr >= 80) return '80-89';
  if (ovr >= 70) return '70-79';
  return '60-69';
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// INTERVIEW GENERATION
// ============================================================================

/**
 * Select interview questions based on scout quality
 */
export function selectInterviewQuestions(
  scoutOvr: number,
  categories?: InterviewCategory[]
): InterviewQuestion[] {
  const range = getScoutOvrRange(scoutOvr);
  const questionCount = INTERVIEW_QUESTION_COUNT[range] || 3;

  // If no categories specified, use all
  const targetCategories = categories || (Object.keys(ALL_QUESTIONS) as InterviewCategory[]);

  // Build question pool
  const questionPool: InterviewQuestion[] = [];
  for (const category of targetCategories) {
    questionPool.push(...ALL_QUESTIONS[category]);
  }

  // Shuffle and select
  const shuffled = shuffleArray(questionPool);
  return shuffled.slice(0, questionCount);
}

/**
 * Generate interview response based on prospect traits and scout quality
 */
export function generateInterviewResponse(
  question: InterviewQuestion,
  prospectTraits: string[],
  scoutOvr: number
): InterviewResponse {
  const range = getScoutOvrRange(scoutOvr);
  const accuracy = INTERVIEW_REVEAL_ACCURACY[range] || 0.5;

  // Determine if this question successfully reveals info
  const difficultyPenalty = (question.difficulty - 1) * 0.1; // 0-40% penalty
  const successChance = accuracy - difficultyPenalty;
  const isSuccessful = Math.random() < successChance;

  // Determine response quality based on prospect traits
  let quality: InterviewResponse['quality'] = 'neutral';
  let revealedInfo: string | null = null;

  if (isSuccessful) {
    // Check for relevant traits
    const relevantTraits = INTERVIEW_REVEALABLE_TRAITS[question.category] || [];
    const matchingTraits = prospectTraits.filter((t) => relevantTraits.includes(t));

    if (matchingTraits.length > 0) {
      // Reveal a matching trait
      revealedInfo = getRandomItem(matchingTraits);

      // Determine quality based on trait positivity
      const positiveTraits = ['film_junkie', 'high_motor', 'team_player', 'gym_rat', 'natural_leader', 'iron_man', 'mature'];
      const negativeTraits = ['slow_learner', 'selfish', 'diva', 'lazy', 'locker_room_cancer', 'injury_prone', 'immature'];

      if (positiveTraits.includes(revealedInfo)) {
        quality = Math.random() < 0.7 ? 'excellent' : 'good';
      } else if (negativeTraits.includes(revealedInfo)) {
        quality = Math.random() < 0.7 ? 'red_flag' : 'poor';
      } else {
        quality = 'neutral';
      }
    } else {
      // No matching trait, give general impression
      quality = ['excellent', 'good', 'neutral', 'neutral', 'poor'][Math.floor(Math.random() * 5)] as InterviewResponse['quality'];
    }
  }

  return {
    questionId: question.id,
    quality,
    revealedInfo,
    confidence: Math.round((isSuccessful ? accuracy : accuracy * 0.5) * 100),
  };
}

/**
 * Conduct a full interview session
 */
export function conductInterview(
  prospectId: string,
  prospectTraits: string[],
  scout: Scout,
  teamId: string,
  week: number,
  categories?: InterviewCategory[]
): Interview {
  // Select questions
  const questions = selectInterviewQuestions(scout.ovr, categories);

  // Generate responses
  const responses: InterviewResponse[] = questions.map((q) =>
    generateInterviewResponse(q, prospectTraits, scout.ovr)
  );

  // Collect revealed traits
  const traitsRevealed = responses
    .filter((r) => r.revealedInfo !== null)
    .map((r) => r.revealedInfo as string);

  // Identify flags
  const redFlagsIdentified = responses
    .filter((r) => r.quality === 'red_flag')
    .map((r) => r.revealedInfo || 'General concern');

  const greenFlagsIdentified = responses
    .filter((r) => r.quality === 'excellent')
    .map((r) => r.revealedInfo || 'Positive impression');

  // Calculate overall impression
  const qualityScores = { excellent: 2, good: 1, neutral: 0, poor: -1, red_flag: -2 };
  const avgScore = responses.reduce((sum, r) => sum + qualityScores[r.quality], 0) / responses.length;

  let overallImpression: Interview['overallImpression'];
  if (avgScore >= 1.5) overallImpression = 'excellent';
  else if (avgScore >= 0.5) overallImpression = 'good';
  else if (avgScore >= -0.5) overallImpression = 'average';
  else if (avgScore >= -1.5) overallImpression = 'concerning';
  else overallImpression = 'poor';

  return {
    id: randomUUID(),
    prospectId,
    scoutId: scout.id,
    teamId,
    week,
    pointsSpent: INTERVIEW_POINT_COST,
    questions,
    responses,
    overallImpression,
    traitsRevealed,
    redFlagsIdentified,
    greenFlagsIdentified,
    completedAt: Date.now(),
  };
}

/**
 * Get interview cost
 */
export function getInterviewCost(): number {
  return INTERVIEW_POINT_COST;
}

/**
 * Get available question categories
 */
export function getQuestionCategories(): InterviewCategory[] {
  return Object.keys(ALL_QUESTIONS) as InterviewCategory[];
}

/**
 * Format interview impression for display
 */
export function formatInterviewImpression(impression: Interview['overallImpression']): string {
  const labels: Record<Interview['overallImpression'], string> = {
    excellent: 'Excellent - Top character',
    good: 'Good - Solid answers',
    average: 'Average - Nothing special',
    concerning: 'Concerning - Some issues',
    poor: 'Poor - Major red flags',
  };
  return labels[impression];
}
