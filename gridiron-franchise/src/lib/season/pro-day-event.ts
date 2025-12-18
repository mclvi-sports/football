/**
 * Pro Day Event Simulation
 *
 * Week 20 (post-Combine) pro day simulation that:
 * - Allows teams to visit specific schools for free
 * - Enables private workouts with highest accuracy (60 points)
 * - Provides enhanced measurable accuracy vs combine
 * - Limited private workout slots (10-15 per team)
 *
 * Based on DRAFT-SYSTEM-ENHANCED.md specification
 */

import { Position } from '../types';
import { DraftProspect } from '../generators/draft-generator';
import { College, getCollegesByTier, type CollegeTier } from '../data/colleges';

// ============================================================================
// TYPES
// ============================================================================

export interface ProDayVisit {
  id: string;
  collegeId: string;
  collegeName: string;
  week: number;
  prospects: ProDayProspectResult[];
  attendedBy: string[]; // Team IDs that attended
}

export interface ProDayProspectResult {
  prospectId: string;
  prospectName: string;
  position: Position;
  // Measurable refinements - these are more accurate than combine
  measurableAdjustments: MeasurableAdjustment[];
  // Pro day specific events
  interviewConducted: boolean;
  workoutNotes: string;
  teamImpression: 'very_positive' | 'positive' | 'neutral' | 'negative';
}

export interface MeasurableAdjustment {
  measurable: string;
  combineValue: number;
  proDayValue: number;
  difference: number;
  improved: boolean;
}

export interface PrivateWorkout {
  id: string;
  prospectId: string;
  prospectName: string;
  teamId: string;
  week: number;
  pointsCost: number;
  // High accuracy evaluation
  revealedAttributes: RevealedAttribute[];
  characterAssessment: CharacterAssessment;
  workoutGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  notes: string;
}

export interface RevealedAttribute {
  attribute: string;
  trueValue: number;
  confidence: number; // 90-100% for private workouts
}

export interface CharacterAssessment {
  overallImpression: 'excellent' | 'good' | 'average' | 'concerning' | 'poor';
  workEthic: 'elite' | 'high' | 'average' | 'low';
  coachability: 'excellent' | 'good' | 'average' | 'poor';
  maturity: 'very_mature' | 'mature' | 'average' | 'immature';
  competitiveness: 'elite' | 'high' | 'average' | 'low';
}

export interface ProDaySchedule {
  week: number;
  year: number;
  proDays: ProDayVisit[];
  privateWorkouts: PrivateWorkout[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const PRIVATE_WORKOUT_COST = 60; // Scouting points
export const MAX_PRIVATE_WORKOUTS = 15;  // Per team limit
export const PRO_DAY_ACCURACY_BOOST = 0.15; // 15% more accurate than combine

// Pro days happen at specific schools based on tier
const PRO_DAY_SCHEDULE: Record<CollegeTier, number[]> = {
  blue_blood: [1, 2],      // Days 1-2: Top programs
  elite: [2, 3],           // Days 2-3: Elite programs
  power5: [3, 4, 5],       // Days 3-5: Power 5
  group5: [5, 6],          // Days 5-6: Group of 5
  fcs: [6, 7],             // Days 6-7: FCS schools
};

// Workout grade thresholds based on overall performance
const WORKOUT_GRADES = {
  'A+': 95,
  'A': 90,
  'A-': 85,
  'B+': 80,
  'B': 75,
  'B-': 70,
  'C+': 65,
  'C': 60,
  'C-': 55,
  'D': 45,
  'F': 0,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function calculateWorkoutGrade(score: number): PrivateWorkout['workoutGrade'] {
  for (const [grade, threshold] of Object.entries(WORKOUT_GRADES)) {
    if (score >= threshold) {
      return grade as PrivateWorkout['workoutGrade'];
    }
  }
  return 'F';
}

// ============================================================================
// PRO DAY GENERATION
// ============================================================================

/**
 * Get pro day workout notes based on position and performance
 */
function generateWorkoutNotes(
  prospect: DraftProspect,
  impression: ProDayProspectResult['teamImpression']
): string {
  const templates = {
    very_positive: [
      `${prospect.lastName} showed excellent technique and competitive drive during position drills.`,
      `Teams were impressed with ${prospect.lastName}'s attention to detail and coachability.`,
      `${prospect.lastName} looked even better than his combine performance suggested.`,
    ],
    positive: [
      `${prospect.lastName} had a solid workout, confirming his combine testing.`,
      `Scouts noted ${prospect.lastName}'s consistency in position-specific drills.`,
      `${prospect.lastName} answered questions about his game with confident performance.`,
    ],
    neutral: [
      `${prospect.lastName}'s workout matched expectations, neither impressive nor concerning.`,
      `Standard pro day workout from ${prospect.lastName}, no major changes to draft stock.`,
      `${prospect.lastName} performed as projected in all drills.`,
    ],
    negative: [
      `${prospect.lastName} struggled with some position drills, raising questions.`,
      `Some scouts left disappointed with ${prospect.lastName}'s effort level.`,
      `${prospect.lastName} didn't look as sharp as expected after the combine.`,
    ],
  };

  return getRandomItem(templates[impression]);
}

/**
 * Generate measurable adjustments for a pro day
 * Pro days typically show small improvements from combine
 */
function generateMeasurableAdjustments(prospect: DraftProspect): MeasurableAdjustment[] {
  const adjustments: MeasurableAdjustment[] = [];
  const measurables = prospect.combineMeasurables;

  // Players typically improve slightly at pro days (better conditions, home turf)
  const checkMeasurables = [
    { key: 'verticalJump', value: measurables.verticalJump, unit: '"', improveChance: 0.6 },
    { key: 'broadJump', value: measurables.broadJump, unit: '"', improveChance: 0.5 },
    { key: 'threeCone', value: measurables.threeCone, unit: 's', improveChance: 0.4, lowerBetter: true },
    { key: 'twentyShuttle', value: measurables.twentyShuttle, unit: 's', improveChance: 0.4, lowerBetter: true },
  ];

  for (const { key, value, improveChance, lowerBetter } of checkMeasurables) {
    // 40-60% chance to show improvement
    if (Math.random() < improveChance) {
      const improvement = lowerBetter
        ? -(Math.random() * 0.08) // 0-0.08 seconds faster
        : Math.random() * 2;      // 0-2 inches higher

      const proDayValue = lowerBetter
        ? Math.max(value + improvement, value * 0.95) // Can't improve by more than 5%
        : Math.min(value + improvement, value * 1.05);

      adjustments.push({
        measurable: key,
        combineValue: value,
        proDayValue: Math.round(proDayValue * 100) / 100,
        difference: Math.round((proDayValue - value) * 100) / 100,
        improved: lowerBetter ? proDayValue < value : proDayValue > value,
      });
    }
  }

  return adjustments;
}

/**
 * Generate a pro day visit for a specific college
 */
export function generateProDay(
  college: College,
  prospects: DraftProspect[],
  week: number,
  attendingTeamIds: string[] = []
): ProDayVisit {
  // Filter prospects from this college (match by name since College doesn't have id)
  const collegeProspects = prospects.filter(
    p => p.collegeData.name === college.name
  );

  const prospectResults: ProDayProspectResult[] = collegeProspects.map(prospect => {
    // Random impression weighted toward positive for better prospects
    const round = typeof prospect.round === 'number' ? prospect.round : 8;
    const positiveWeight = Math.max(0.3, 1 - (round * 0.1));

    let impression: ProDayProspectResult['teamImpression'];
    const roll = Math.random();
    if (roll < positiveWeight * 0.3) {
      impression = 'very_positive';
    } else if (roll < positiveWeight * 0.7) {
      impression = 'positive';
    } else if (roll < 0.85) {
      impression = 'neutral';
    } else {
      impression = 'negative';
    }

    return {
      prospectId: prospect.id,
      prospectName: `${prospect.firstName} ${prospect.lastName}`,
      position: prospect.position as Position,
      measurableAdjustments: generateMeasurableAdjustments(prospect),
      interviewConducted: attendingTeamIds.length > 0 && Math.random() < 0.4,
      workoutNotes: generateWorkoutNotes(prospect, impression),
      teamImpression: impression,
    };
  });

  return {
    id: generateId(),
    collegeId: college.name, // Use name as ID since College doesn't have id field
    collegeName: college.name,
    week,
    prospects: prospectResults,
    attendedBy: attendingTeamIds,
  };
}

// ============================================================================
// PRIVATE WORKOUT GENERATION
// ============================================================================

/**
 * Generate a character assessment for a prospect
 */
function generateCharacterAssessment(prospect: DraftProspect): CharacterAssessment {
  // Use prospect traits to inform assessment
  const traits = prospect.traits || [];

  // Work ethic
  let workEthic: CharacterAssessment['workEthic'] = 'average';
  if (traits.includes('gym_rat') || traits.includes('film_junkie')) {
    workEthic = 'elite';
  } else if (traits.includes('high_motor') || traits.includes('dedicated')) {
    workEthic = 'high';
  } else if (traits.includes('lazy') || traits.includes('unmotivated')) {
    workEthic = 'low';
  }

  // Coachability
  let coachability: CharacterAssessment['coachability'] = 'good';
  if (traits.includes('coachable') || traits.includes('quick_learner')) {
    coachability = 'excellent';
  } else if (traits.includes('ego') || traits.includes('stubborn')) {
    coachability = 'poor';
  }

  // Maturity
  let maturity: CharacterAssessment['maturity'] = 'mature';
  if (traits.includes('mature') || traits.includes('natural_leader')) {
    maturity = 'very_mature';
  } else if (traits.includes('immature') || traits.includes('distracted')) {
    maturity = 'immature';
  }

  // Competitiveness
  let competitiveness: CharacterAssessment['competitiveness'] = 'high';
  if (traits.includes('clutch_performer') || traits.includes('high_motor')) {
    competitiveness = 'elite';
  } else if (traits.includes('frontrunner') || traits.includes('passive')) {
    competitiveness = 'low';
  }

  // Overall impression based on components
  const positiveCount = [
    workEthic === 'elite' || workEthic === 'high',
    coachability === 'excellent' || coachability === 'good',
    maturity === 'very_mature' || maturity === 'mature',
    competitiveness === 'elite' || competitiveness === 'high',
  ].filter(Boolean).length;

  let overallImpression: CharacterAssessment['overallImpression'];
  if (positiveCount >= 4) {
    overallImpression = 'excellent';
  } else if (positiveCount >= 3) {
    overallImpression = 'good';
  } else if (positiveCount >= 2) {
    overallImpression = 'average';
  } else if (positiveCount >= 1) {
    overallImpression = 'concerning';
  } else {
    overallImpression = 'poor';
  }

  return {
    overallImpression,
    workEthic,
    coachability,
    maturity,
    competitiveness,
  };
}

/**
 * Generate revealed attributes from a private workout
 * Private workouts have 90-100% accuracy on attribute reveals
 */
function generateRevealedAttributes(prospect: DraftProspect): RevealedAttribute[] {
  const revealed: RevealedAttribute[] = [];

  // Reveal 3-5 key attributes with high confidence
  // Use correct attribute names from PlayerAttributes (SPD, STR, AGI)
  const attributesToReveal = [
    { name: 'Overall', value: prospect.overall },
    { name: 'Speed', value: prospect.attributes?.SPD || prospect.overall },
    { name: 'Strength', value: prospect.attributes?.STR || prospect.overall },
    { name: 'Agility', value: prospect.attributes?.AGI || prospect.overall },
  ];

  for (const attr of attributesToReveal) {
    // Private workouts have 90-100% accuracy
    const confidence = 90 + Math.floor(Math.random() * 11);
    revealed.push({
      attribute: attr.name,
      trueValue: attr.value,
      confidence,
    });
  }

  return revealed;
}

/**
 * Generate workout notes for a private workout
 */
function generatePrivateWorkoutNotes(
  prospect: DraftProspect,
  grade: PrivateWorkout['workoutGrade']
): string {
  const isGood = ['A+', 'A', 'A-', 'B+', 'B'].includes(grade);
  const isBad = ['C-', 'D', 'F'].includes(grade);

  if (isGood) {
    return `${prospect.lastName} showed excellent command of the position. Looked comfortable in all drills and answered every question from coaches. Premium workout.`;
  } else if (isBad) {
    return `${prospect.lastName} struggled at times during the workout. Some technique issues and conditioning concerns were noted. Further evaluation needed.`;
  } else {
    return `${prospect.lastName} had a solid workout with no major concerns. Performed as expected based on film and combine testing.`;
  }
}

/**
 * Conduct a private workout with a prospect
 */
export function conductPrivateWorkout(
  prospect: DraftProspect,
  teamId: string,
  week: number
): PrivateWorkout {
  // Calculate workout score based on overall and some randomness
  const baseScore = prospect.overall;
  const variance = randomInRange(-10, 10);
  const workoutScore = Math.max(0, Math.min(100, baseScore + variance));

  const grade = calculateWorkoutGrade(workoutScore);
  const characterAssessment = generateCharacterAssessment(prospect);
  const revealedAttributes = generateRevealedAttributes(prospect);

  return {
    id: generateId(),
    prospectId: prospect.id,
    prospectName: `${prospect.firstName} ${prospect.lastName}`,
    teamId,
    week,
    pointsCost: PRIVATE_WORKOUT_COST,
    revealedAttributes,
    characterAssessment,
    workoutGrade: grade,
    notes: generatePrivateWorkoutNotes(prospect, grade),
  };
}

// ============================================================================
// PRO DAY WEEK SIMULATION
// ============================================================================

/**
 * Get all pro days scheduled for a specific day
 */
export function getProDaysForDay(day: number): CollegeTier[] {
  const tiers: CollegeTier[] = [];
  for (const [tier, days] of Object.entries(PRO_DAY_SCHEDULE)) {
    if (days.includes(day)) {
      tiers.push(tier as CollegeTier);
    }
  }
  return tiers;
}

/**
 * Get all colleges with pro days on a specific day
 */
export function getCollegesForProDayDay(day: number): College[] {
  const tiers = getProDaysForDay(day);
  const colleges: College[] = [];

  for (const tier of tiers) {
    const tierColleges = getCollegesByTier(tier);
    if (tierColleges && tierColleges.length > 0) {
      // Select a subset of colleges (not all have pro days on same day)
      const count = Math.min(tierColleges.length, randomInRange(3, 6));
      const shuffled = [...tierColleges].sort(() => Math.random() - 0.5);
      colleges.push(...shuffled.slice(0, count));
    }
  }

  return colleges;
}

/**
 * Simulate the full pro day week
 */
export function simulateProDayWeek(
  prospects: DraftProspect[],
  year: number,
  week: number = 20
): ProDaySchedule {
  const proDays: ProDayVisit[] = [];

  // Generate pro days for 7 days
  for (let day = 1; day <= 7; day++) {
    const colleges = getCollegesForProDayDay(day);

    for (const college of colleges) {
      const proDayVisit = generateProDay(college, prospects, week);
      if (proDayVisit.prospects.length > 0) {
        proDays.push(proDayVisit);
      }
    }
  }

  return {
    week,
    year,
    proDays,
    privateWorkouts: [], // Private workouts are generated on demand
  };
}

/**
 * Check if a team can afford a private workout
 */
export function canAffordPrivateWorkout(availablePoints: number): boolean {
  return availablePoints >= PRIVATE_WORKOUT_COST;
}

/**
 * Get the cost of a private workout
 */
export function getPrivateWorkoutCost(): number {
  return PRIVATE_WORKOUT_COST;
}

/**
 * Format character assessment for display
 */
export function formatCharacterAssessment(assessment: CharacterAssessment): string {
  const labels = {
    excellent: 'Excellent - Franchise character',
    good: 'Good - Solid citizen',
    average: 'Average - No concerns',
    concerning: 'Concerning - Some questions',
    poor: 'Poor - Significant issues',
  };
  return labels[assessment.overallImpression];
}
