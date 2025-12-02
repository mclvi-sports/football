/**
 * Coaching Modifiers
 *
 * Applies coach perk effects to game simulation.
 * Based on the coaching staff system.
 */

import {
  Coach,
  CoachingStaff,
  Perk,
  PerkTier,
  HCPerkId,
  OCPerkId,
  DCPerkId,
  STPerkId,
  HCAttributes,
  OCAttributes,
  DCAttributes,
  STCAttributes,
} from '../coaching/types';
import { GameType } from './types';

// ============================================================================
// PERK EFFECT VALUES
// ============================================================================

/**
 * Numerical effects for HC perks by tier
 */
export const HC_PERK_EFFECTS: Record<HCPerkId, Record<PerkTier, Record<string, number>>> = {
  motivator: {
    1: { moraleBonus: 0.10 },
    2: { moraleBonus: 0.20 },
    3: { moraleBonus: 0.30, neverQuits: 1 },
  },
  genius_mind: {
    1: { awarenessBonus: 2 },
    2: { awarenessBonus: 4 },
    3: { awarenessBonus: 6, perfectGamePlan: 1 },
  },
  disciplinarian: {
    1: { penaltyReduction: 0.25 },
    2: { penaltyReduction: 0.50 },
    3: { penaltyReduction: 0.75, noPersonalFouls: 1 },
  },
  winners_mentality: {
    1: { playoffOvrBonus: 2 },
    2: { playoffOvrBonus: 4 },
    3: { playoffOvrBonus: 6, clutchBonus: 1 },
  },
  clock_master: {
    1: { timeoutEfficiency: 0.10, extraChallenges: 1 },
    2: { timeoutEfficiency: 0.20, extraChallenges: 2, twoMinuteDrill: 1 },
    3: { timeoutEfficiency: 0.30, extraChallenges: 3, twoMinuteDrill: 1, autoWinTies: 1 },
  },
  players_coach: {
    1: { loyaltyBonus: 0.05, holdoutReduction: 0.10 },
    2: { loyaltyBonus: 0.10, holdoutReduction: 0.25 },
    3: { loyaltyBonus: 0.20, holdoutReduction: 0.50, discounts: 1 },
  },
};

/**
 * Numerical effects for OC perks by tier
 */
export const OC_PERK_EFFECTS: Record<OCPerkId, Record<PerkTier, Record<string, number>>> = {
  qb_whisperer: {
    1: { qbXpBonus: 0.25 },
    2: { qbXpBonus: 0.50, qbOvrBonus: 2 },
    3: { qbXpBonus: 0.75, qbOvrBonus: 4, unlockPotential: 1 },
  },
  red_zone_specialist: {
    1: { redZoneTdRate: 0.10 },
    2: { redZoneTdRate: 0.20 },
    3: { redZoneTdRate: 0.30, goalLinePackage: 1 },
  },
  tempo_tactician: {
    1: { noHuddleEfficiency: 0.05 },
    2: { noHuddleEfficiency: 0.10, defenseFatigue: 1 },
    3: { noHuddleEfficiency: 0.15, defenseFatigue: 2, hurryUpMastery: 1 },
  },
  run_game_architect: {
    1: { ypcBonus: 0.3 },
    2: { ypcBonus: 0.6, rbXpBonus: 0.25 },
    3: { ypcBonus: 1.0, rbXpBonus: 0.25, eliteRunBlocking: 1 },
  },
  passing_guru: {
    1: { completionBonus: 0.03 },
    2: { completionBonus: 0.05, wrTeXpBonus: 0.25 },
    3: { completionBonus: 0.08, wrTeXpBonus: 0.25, deepBallSpecialist: 1 },
  },
  play_designer: {
    1: { trickPlaySuccess: 0.10 },
    2: { trickPlaySuccess: 0.20, uniqueFormations: 1 },
    3: { trickPlaySuccess: 0.30, uniqueFormations: 1, unpredictable: 1 },
  },
};

/**
 * Numerical effects for DC perks by tier
 */
export const DC_PERK_EFFECTS: Record<DCPerkId, Record<PerkTier, Record<string, number>>> = {
  turnover_machine: {
    1: { turnoverChance: 0.10 },
    2: { turnoverChance: 0.20 },
    3: { turnoverChance: 0.30, stripSpecialist: 1 },
  },
  pass_rush_specialist: {
    1: { passRushBonus: 2 },
    2: { passRushBonus: 4, deDtXpBonus: 0.25 },
    3: { passRushBonus: 6, deDtXpBonus: 0.25, eliteBlitz: 1 },
  },
  coverage_master: {
    1: { coverageBonus: 2 },
    2: { coverageBonus: 4, cbSXpBonus: 0.25 },
    3: { coverageBonus: 6, cbSXpBonus: 0.25, shutdown: 1 },
  },
  run_stuffer: {
    1: { opponentYpcPenalty: 0.3 },
    2: { opponentYpcPenalty: 0.6, lbXpBonus: 0.25 },
    3: { opponentYpcPenalty: 1.0, lbXpBonus: 0.25, goalLineStand: 1 },
  },
  blitz_master: {
    1: { blitzSuccess: 0.15 },
    2: { blitzSuccess: 0.25, disguisedLooks: 1 },
    3: { blitzSuccess: 0.35, disguisedLooks: 1, chaosDefense: 1 },
  },
  bend_dont_break: {
    1: { opponentRedZoneTdReduction: 0.10 },
    2: { opponentRedZoneTdReduction: 0.20, forceFgs: 1 },
    3: { opponentRedZoneTdReduction: 0.30, forceFgs: 1, goalLineElite: 1 },
  },
};

/**
 * Numerical effects for STC perks by tier
 */
export const STC_PERK_EFFECTS: Record<STPerkId, Record<PerkTier, Record<string, number>>> = {
  leg_whisperer: {
    1: { kpRatingBonus: 3 },
    2: { kpRatingBonus: 5, clutchKicking: 1 },
    3: { kpRatingBonus: 8, clutchKicking: 1, iceProof: 1 },
  },
  return_specialist: {
    1: { returnYardsBonus: 5 },
    2: { returnYardsBonus: 10, returnTdChance: 0.02 },
    3: { returnYardsBonus: 15, returnTdChance: 0.05 },
  },
  coverage_ace: {
    1: { opponentReturnYardsPenalty: 5 },
    2: { opponentReturnYardsPenalty: 10, stTackles: 0.25 },
    3: { opponentReturnYardsPenalty: 15, stTackles: 0.25, eliteGunners: 1 },
  },
  situational_genius: {
    1: { fakeSuccess: 0.15 },
    2: { fakeSuccess: 0.25, onsideKick: 0.10 },
    3: { fakeSuccess: 0.35, onsideKick: 0.20, surprisePlays: 1 },
  },
};

// ============================================================================
// PERK LOOKUP
// ============================================================================

/**
 * Get numerical effect value for a perk
 */
export function getPerkEffect(perk: Perk): Record<string, number> {
  const id = perk.id;
  const tier = perk.tier;

  // Check each perk category
  if (id in HC_PERK_EFFECTS) {
    return HC_PERK_EFFECTS[id as HCPerkId][tier] || {};
  }
  if (id in OC_PERK_EFFECTS) {
    return OC_PERK_EFFECTS[id as OCPerkId][tier] || {};
  }
  if (id in DC_PERK_EFFECTS) {
    return DC_PERK_EFFECTS[id as DCPerkId][tier] || {};
  }
  if (id in STC_PERK_EFFECTS) {
    return STC_PERK_EFFECTS[id as STPerkId][tier] || {};
  }

  return {};
}

// ============================================================================
// GAME MODIFIER CALCULATION
// ============================================================================

export interface CoachingGameModifiers {
  // Team-wide bonuses
  teamOvrBonus: number;
  awarenessBonus: number;
  moraleBonus: number;
  penaltyReduction: number;

  // Offensive bonuses
  qbOvrBonus: number;
  completionBonus: number;
  ypcBonus: number;
  redZoneTdRate: number;
  noHuddleEfficiency: number;

  // Defensive bonuses
  turnoverChance: number;
  passRushBonus: number;
  coverageBonus: number;
  opponentYpcPenalty: number;
  blitzSuccess: number;
  opponentRedZoneTdReduction: number;

  // Special teams bonuses
  kpRatingBonus: number;
  returnYardsBonus: number;
  opponentReturnYardsPenalty: number;
  fakeSuccess: number;
  onsideKick: number;

  // Attribute-based bonuses
  gameplanningBonus: number;
  clockManagementBonus: number;

  // Special flags
  isPlayoffGame: boolean;
  playoffOvrBonus: number;
}

/**
 * Calculate all coaching modifiers for a game
 */
export function calculateCoachingGameModifiers(
  staff: CoachingStaff,
  gameType: GameType
): CoachingGameModifiers {
  const isPlayoff = gameType === 'playoff' || gameType === 'championship';

  // Initialize modifiers
  const modifiers: CoachingGameModifiers = {
    teamOvrBonus: 0,
    awarenessBonus: 0,
    moraleBonus: 0,
    penaltyReduction: 0,
    qbOvrBonus: 0,
    completionBonus: 0,
    ypcBonus: 0,
    redZoneTdRate: 0,
    noHuddleEfficiency: 0,
    turnoverChance: 0,
    passRushBonus: 0,
    coverageBonus: 0,
    opponentYpcPenalty: 0,
    blitzSuccess: 0,
    opponentRedZoneTdReduction: 0,
    kpRatingBonus: 0,
    returnYardsBonus: 0,
    opponentReturnYardsPenalty: 0,
    fakeSuccess: 0,
    onsideKick: 0,
    gameplanningBonus: 0,
    clockManagementBonus: 0,
    isPlayoffGame: isPlayoff,
    playoffOvrBonus: 0,
  };

  // Process HC perks
  for (const perk of staff.headCoach.perks) {
    const effects = getPerkEffect(perk);
    applyPerkEffects(modifiers, effects);
  }

  // Process OC perks
  for (const perk of staff.offensiveCoordinator.perks) {
    const effects = getPerkEffect(perk);
    applyPerkEffects(modifiers, effects);
  }

  // Process DC perks
  for (const perk of staff.defensiveCoordinator.perks) {
    const effects = getPerkEffect(perk);
    applyPerkEffects(modifiers, effects);
  }

  // Process STC perks
  for (const perk of staff.specialTeamsCoordinator.perks) {
    const effects = getPerkEffect(perk);
    applyPerkEffects(modifiers, effects);
  }

  // Apply coach attributes
  const hcAttrs = staff.headCoach.attributes as HCAttributes;
  const ocAttrs = staff.offensiveCoordinator.attributes as OCAttributes;
  const dcAttrs = staff.defensiveCoordinator.attributes as DCAttributes;
  const stcAttrs = staff.specialTeamsCoordinator.attributes as STCAttributes;

  // Game planning bonus (average of all coordinators)
  modifiers.gameplanningBonus =
    ((hcAttrs.gamePlanning - 70) / 30) * 3 +
    ((ocAttrs.gamePlanning - 70) / 30) * 2 +
    ((dcAttrs.gamePlanning - 70) / 30) * 2;

  // Clock management from HC
  modifiers.clockManagementBonus = ((hcAttrs.clockManagement - 70) / 30) * 5;

  // Apply playoff OVR bonus if applicable
  if (isPlayoff && modifiers.playoffOvrBonus > 0) {
    modifiers.teamOvrBonus += modifiers.playoffOvrBonus;
  }

  // Staff chemistry bonus
  if (staff.staffChemistry >= 80) {
    modifiers.teamOvrBonus += 2;
  } else if (staff.staffChemistry >= 60) {
    modifiers.teamOvrBonus += 1;
  } else if (staff.staffChemistry < 40) {
    modifiers.teamOvrBonus -= 1;
  }

  return modifiers;
}

/**
 * Apply perk effects to modifiers object
 */
function applyPerkEffects(
  modifiers: CoachingGameModifiers,
  effects: Record<string, number>
): void {
  for (const [key, value] of Object.entries(effects)) {
    switch (key) {
      case 'moraleBonus':
        modifiers.moraleBonus += value;
        break;
      case 'awarenessBonus':
        modifiers.awarenessBonus += value;
        break;
      case 'penaltyReduction':
        modifiers.penaltyReduction = Math.max(modifiers.penaltyReduction, value);
        break;
      case 'playoffOvrBonus':
        modifiers.playoffOvrBonus += value;
        break;
      case 'qbOvrBonus':
        modifiers.qbOvrBonus += value;
        break;
      case 'completionBonus':
        modifiers.completionBonus += value;
        break;
      case 'ypcBonus':
        modifiers.ypcBonus += value;
        break;
      case 'redZoneTdRate':
        modifiers.redZoneTdRate += value;
        break;
      case 'noHuddleEfficiency':
        modifiers.noHuddleEfficiency += value;
        break;
      case 'turnoverChance':
        modifiers.turnoverChance += value;
        break;
      case 'passRushBonus':
        modifiers.passRushBonus += value;
        break;
      case 'coverageBonus':
        modifiers.coverageBonus += value;
        break;
      case 'opponentYpcPenalty':
        modifiers.opponentYpcPenalty += value;
        break;
      case 'blitzSuccess':
        modifiers.blitzSuccess += value;
        break;
      case 'opponentRedZoneTdReduction':
        modifiers.opponentRedZoneTdReduction += value;
        break;
      case 'kpRatingBonus':
        modifiers.kpRatingBonus += value;
        break;
      case 'returnYardsBonus':
        modifiers.returnYardsBonus += value;
        break;
      case 'opponentReturnYardsPenalty':
        modifiers.opponentReturnYardsPenalty += value;
        break;
      case 'fakeSuccess':
        modifiers.fakeSuccess += value;
        break;
      case 'onsideKick':
        modifiers.onsideKick += value;
        break;
      // Flags are handled as booleans elsewhere
    }
  }
}

// ============================================================================
// XP BONUS CALCULATION
// ============================================================================

export interface CoachingXpBonuses {
  qbXpBonus: number;
  rbXpBonus: number;
  wrTeXpBonus: number;
  deDtXpBonus: number;
  lbXpBonus: number;
  cbSXpBonus: number;
}

/**
 * Calculate XP bonuses from coaching staff
 */
export function calculateCoachingXpBonuses(staff: CoachingStaff): CoachingXpBonuses {
  const bonuses: CoachingXpBonuses = {
    qbXpBonus: 0,
    rbXpBonus: 0,
    wrTeXpBonus: 0,
    deDtXpBonus: 0,
    lbXpBonus: 0,
    cbSXpBonus: 0,
  };

  // Check OC perks for offensive XP bonuses
  for (const perk of staff.offensiveCoordinator.perks) {
    const effects = getPerkEffect(perk);
    if (effects.qbXpBonus) bonuses.qbXpBonus += effects.qbXpBonus;
    if (effects.rbXpBonus) bonuses.rbXpBonus += effects.rbXpBonus;
    if (effects.wrTeXpBonus) bonuses.wrTeXpBonus += effects.wrTeXpBonus;
  }

  // Check DC perks for defensive XP bonuses
  for (const perk of staff.defensiveCoordinator.perks) {
    const effects = getPerkEffect(perk);
    if (effects.deDtXpBonus) bonuses.deDtXpBonus += effects.deDtXpBonus;
    if (effects.lbXpBonus) bonuses.lbXpBonus += effects.lbXpBonus;
    if (effects.cbSXpBonus) bonuses.cbSXpBonus += effects.cbSXpBonus;
  }

  // Add base bonus from player development attribute
  const ocDev = (staff.offensiveCoordinator.attributes.playerDevelopment - 70) / 30;
  const dcDev = (staff.defensiveCoordinator.attributes.playerDevelopment - 70) / 30;

  bonuses.qbXpBonus += ocDev * 0.15;
  bonuses.rbXpBonus += ocDev * 0.15;
  bonuses.wrTeXpBonus += ocDev * 0.15;
  bonuses.deDtXpBonus += dcDev * 0.15;
  bonuses.lbXpBonus += dcDev * 0.15;
  bonuses.cbSXpBonus += dcDev * 0.15;

  return bonuses;
}
