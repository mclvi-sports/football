/**
 * Scheme Data
 *
 * Complete definitions for all offensive, defensive, and special teams schemes.
 * Based on FINAL-schemes-system.md
 */

import {
  OffensiveScheme,
  DefensiveScheme,
  STPhilosophy,
  OffensiveSchemeDefinition,
  DefensiveSchemeDefinition,
  STPhilosophyDefinition,
} from './types';

// ============================================================================
// OFFENSIVE SCHEMES
// ============================================================================

export const OFFENSIVE_SCHEMES: Record<OffensiveScheme, OffensiveSchemeDefinition> = {
  west_coast: {
    id: 'west_coast',
    name: 'West Coast',
    philosophy: 'Short timing passes',
    playStyle: 'Short, timing-based passing attack that uses the pass to set up the run. Emphasizes ball control, high completion percentage, and yards after catch.',

    idealPersonnel: [
      { position: 'QB', idealArchetypes: ['field_general', 'west_coast'], keyAttributes: ['shortAccuracy', 'awareness'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'RB', idealArchetypes: ['receiving_back', 'all_purpose'], keyAttributes: ['catching', 'routeRunning'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'WR', idealArchetypes: ['possession', 'route_technician'], keyAttributes: ['shortRouteRunning', 'catchInTraffic'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'TE', idealArchetypes: ['receiving_te'], keyAttributes: ['catching', 'routeRunning'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'OL', idealArchetypes: ['pass_protector'], keyAttributes: ['passBlocking'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
    ],

    attributeBonuses: [
      { attribute: 'shortAccuracy', value: 3 },
      { attribute: 'shortRouteRunning', value: 2 },
      { attribute: 'catchInTraffic', value: 2 },
      { attribute: 'awareness', value: 1 },
    ],
    attributePenalties: [
      { attribute: 'deepAccuracy', value: -2 },
      { attribute: 'deepRouteRunning', value: -1 },
    ],

    playCallingTendencies: {
      first_and_10: { pass: 55, run: 45 },
      second_and_short: { pass: 50, run: 50 },
      second_and_long: { pass: 70, run: 30 },
      third_and_short: { pass: 45, run: 55 },
      third_and_long: { pass: 85, run: 15 },
      red_zone: { pass: 55, run: 45 },
      goal_line: { pass: 40, run: 60 },
    },
    passDistribution: { short: 55, medium: 35, deep: 10 },

    strongAgainst: ['man_blitz'],
    weakAgainst: ['cover_2'],
  },

  spread: {
    id: 'spread',
    name: 'Spread',
    philosophy: 'Space the field, tempo',
    playStyle: 'Space the defense horizontally and vertically using multiple receivers and formations. Emphasizes tempo, athlete mismatches, and exploiting defensive weaknesses.',

    idealPersonnel: [
      { position: 'QB', idealArchetypes: ['dual_threat', 'scrambler'], keyAttributes: ['speed', 'throwOnRun'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'RB', idealArchetypes: ['speed_back', 'scat_back'], keyAttributes: ['speed', 'receiving'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'WR', idealArchetypes: ['deep_threat', 'playmaker'], keyAttributes: ['speed', 'routeRunning'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'TE', idealArchetypes: ['athletic_te'], keyAttributes: ['speed', 'receiving'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'OL', idealArchetypes: ['athletic_blocker'], keyAttributes: ['agility', 'passBlocking'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
    ],

    attributeBonuses: [
      { attribute: 'speed', value: 3, positions: ['QB', 'RB', 'WR', 'TE'] },
      { attribute: 'routeRunning', value: 2 },
      { attribute: 'agility', value: 2 },
      { attribute: 'throwOnRun', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'runBlocking', value: -2 },
      { attribute: 'trucking', value: -1 },
    ],

    playCallingTendencies: {
      first_and_10: { pass: 60, run: 40 },
      second_and_short: { pass: 55, run: 45 },
      second_and_long: { pass: 75, run: 25 },
      third_and_short: { pass: 50, run: 50 },
      third_and_long: { pass: 90, run: 10 },
      red_zone: { pass: 60, run: 40 },
      goal_line: { pass: 50, run: 50 },
    },
    passDistribution: { short: 40, medium: 35, deep: 25 },

    strongAgainst: ['3-4', 'zone_blitz'],
    weakAgainst: ['4-3', 'man_blitz'],
  },

  pro_style: {
    id: 'pro_style',
    name: 'Pro Style',
    philosophy: 'Balanced attack',
    playStyle: 'Balanced attack that can adjust to any situation. Uses multiple formations, play-action, and a mix of run and pass. The most versatile scheme.',

    idealPersonnel: [
      { position: 'QB', idealArchetypes: ['field_general', 'pocket_passer'], keyAttributes: ['shortAccuracy', 'mediumAccuracy', 'deepAccuracy'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'RB', idealArchetypes: ['all_purpose', 'power_back'], keyAttributes: ['speed', 'trucking', 'catching'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'WR', idealArchetypes: ['possession', 'red_zone'], keyAttributes: ['catching', 'routeRunning'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'TE', idealArchetypes: ['balanced_te'], keyAttributes: ['blocking', 'receiving'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'OL', idealArchetypes: ['balanced_blocker'], keyAttributes: ['runBlocking', 'passBlocking'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
    ],

    attributeBonuses: [
      { attribute: 'allOffensive', value: 2 },
      { attribute: 'playAction', value: 2 },
    ],
    attributePenalties: [],

    playCallingTendencies: {
      first_and_10: { pass: 50, run: 50 },
      second_and_short: { pass: 45, run: 55 },
      second_and_long: { pass: 65, run: 35 },
      third_and_short: { pass: 40, run: 60 },
      third_and_long: { pass: 80, run: 20 },
      red_zone: { pass: 50, run: 50 },
      goal_line: { pass: 35, run: 65 },
    },
    passDistribution: { short: 40, medium: 40, deep: 20 },

    strongAgainst: [],
    weakAgainst: [],
  },

  air_raid: {
    id: 'air_raid',
    name: 'Air Raid',
    philosophy: 'Vertical passing',
    playStyle: 'Pass-heavy attack that stretches the field vertically. High risk, high reward with emphasis on big plays and explosive offense.',

    idealPersonnel: [
      { position: 'QB', idealArchetypes: ['gunslinger', 'strong_arm'], keyAttributes: ['deepAccuracy', 'throwPower'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'RB', idealArchetypes: ['receiving_back'], keyAttributes: ['passProtection', 'catching'], thresholds: { perfect: 70, good: 65, neutral: 60, poor: 55 } },
      { position: 'WR', idealArchetypes: ['deep_threat', 'playmaker'], keyAttributes: ['speed', 'deepRouteRunning'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'TE', idealArchetypes: ['receiving_te'], keyAttributes: ['speed', 'deepRouteRunning'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'OL', idealArchetypes: ['pass_protector'], keyAttributes: ['passBlocking'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
    ],

    attributeBonuses: [
      { attribute: 'deepAccuracy', value: 4 },
      { attribute: 'deepRouteRunning', value: 3 },
      { attribute: 'throwPower', value: 2 },
      { attribute: 'speed', value: 2, positions: ['WR'] },
    ],
    attributePenalties: [
      { attribute: 'runBlocking', value: -3 },
      { attribute: 'carrying', value: -2 },
      { attribute: 'trucking', value: -2 },
    ],

    playCallingTendencies: {
      first_and_10: { pass: 70, run: 30 },
      second_and_short: { pass: 65, run: 35 },
      second_and_long: { pass: 85, run: 15 },
      third_and_short: { pass: 60, run: 40 },
      third_and_long: { pass: 95, run: 5 },
      red_zone: { pass: 65, run: 35 },
      goal_line: { pass: 55, run: 45 },
    },
    passDistribution: { short: 25, medium: 35, deep: 40 },

    strongAgainst: ['cover_3'],
    weakAgainst: ['cover_2', 'man_blitz'],
  },

  power_run: {
    id: 'power_run',
    name: 'Power Run',
    philosophy: 'Physical downhill',
    playStyle: 'Physical, downhill running attack that establishes dominance at the line of scrimmage. Control the clock, wear down defenses, and impose your will.',

    idealPersonnel: [
      { position: 'QB', idealArchetypes: ['game_manager'], keyAttributes: ['playAction'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'RB', idealArchetypes: ['power_back', 'bruiser'], keyAttributes: ['trucking', 'breakTackle', 'strength'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'FB', idealArchetypes: ['lead_blocker'], keyAttributes: ['runBlocking', 'strength'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'WR', idealArchetypes: ['blocking_wr'], keyAttributes: ['runBlocking', 'strength'], thresholds: { perfect: 70, good: 65, neutral: 60, poor: 55 } },
      { position: 'TE', idealArchetypes: ['blocking_te'], keyAttributes: ['runBlocking'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'OL', idealArchetypes: ['mauler'], keyAttributes: ['runBlocking', 'strength'], thresholds: { perfect: 90, good: 85, neutral: 80, poor: 75 } },
    ],

    attributeBonuses: [
      { attribute: 'trucking', value: 4 },
      { attribute: 'runBlocking', value: 3 },
      { attribute: 'strength', value: 2 },
      { attribute: 'breakTackle', value: 2 },
      { attribute: 'carrying', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'allPassing', value: -3 },
      { attribute: 'routeRunning', value: -2 },
    ],

    playCallingTendencies: {
      first_and_10: { pass: 30, run: 70 },
      second_and_short: { pass: 25, run: 75 },
      second_and_long: { pass: 45, run: 55 },
      third_and_short: { pass: 20, run: 80 },
      third_and_long: { pass: 65, run: 35 },
      red_zone: { pass: 30, run: 70 },
      goal_line: { pass: 15, run: 85 },
    },
    passDistribution: { short: 50, medium: 35, deep: 15 },

    strongAgainst: ['3-4'],
    weakAgainst: ['4-3', 'cover_2'],
  },

  zone_run: {
    id: 'zone_run',
    name: 'Zone Run',
    philosophy: 'Outside zone, misdirection',
    playStyle: 'Outside zone running that creates cutback lanes and uses misdirection. Requires athletic linemen and patient runners who can find holes.',

    idealPersonnel: [
      { position: 'QB', idealArchetypes: ['play_action_specialist'], keyAttributes: ['playAction', 'throwOnRun'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'RB', idealArchetypes: ['speed_back', 'zone_runner'], keyAttributes: ['vision', 'agility', 'elusiveness'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'WR', idealArchetypes: ['blocking_wr', 'playmaker'], keyAttributes: ['runBlocking', 'yardsAfterCatch'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'TE', idealArchetypes: ['athletic_te'], keyAttributes: ['blocking', 'receiving'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'OL', idealArchetypes: ['athletic_blocker'], keyAttributes: ['agility', 'runBlocking'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
    ],

    attributeBonuses: [
      { attribute: 'elusiveness', value: 4 },
      { attribute: 'agility', value: 3 },
      { attribute: 'ballCarrierVision', value: 3 },
      { attribute: 'jukeMove', value: 2 },
      { attribute: 'playAction', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'trucking', value: -2 },
      { attribute: 'powerMoves', value: -1, positions: ['OL'] },
    ],

    playCallingTendencies: {
      first_and_10: { pass: 40, run: 60 },
      second_and_short: { pass: 35, run: 65 },
      second_and_long: { pass: 55, run: 45 },
      third_and_short: { pass: 30, run: 70 },
      third_and_long: { pass: 70, run: 30 },
      red_zone: { pass: 40, run: 60 },
      goal_line: { pass: 30, run: 70 },
    },
    passDistribution: { short: 45, medium: 40, deep: 15 },

    strongAgainst: ['4-3'],
    weakAgainst: ['3-4', 'zone_blitz'],
  },
};

// ============================================================================
// DEFENSIVE SCHEMES
// ============================================================================

export const DEFENSIVE_SCHEMES: Record<DefensiveScheme, DefensiveSchemeDefinition> = {
  '4-3': {
    id: '4-3',
    name: '4-3 Base',
    baseFormation: '4 DL, 3 LB',
    philosophy: 'Traditional defense with four down linemen and three linebackers. Strong against the run with natural pass rush from the defensive line.',

    idealPersonnel: [
      { position: 'DE', idealArchetypes: ['speed_rusher', 'power_rusher'], keyAttributes: ['passRush', 'speed'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'DT', idealArchetypes: ['run_stuffer', 'interior_pressure'], keyAttributes: ['blockShedding', 'strength'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'MLB', idealArchetypes: ['run_stopper'], keyAttributes: ['tackle', 'playRecognition'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'OLB', idealArchetypes: ['coverage_lb'], keyAttributes: ['zoneCoverage', 'speed'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'CB', idealArchetypes: ['press_corner', 'zone_corner'], keyAttributes: ['coverage', 'speed'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'S', idealArchetypes: ['box_safety', 'deep_safety'], keyAttributes: ['tackle', 'coverage'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
    ],

    attributeBonuses: [
      { attribute: 'passRush', value: 3, positions: ['DE', 'DT'] },
      { attribute: 'tackle', value: 2, positions: ['LB'] },
      { attribute: 'blockShedding', value: 2 },
      { attribute: 'runDefense', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'coverage', value: -2, positions: ['CB', 'S'] },
      { attribute: 'zoneCoverage', value: -1, positions: ['LB'] },
    ],

    personnelPackages: [
      { name: 'Base', personnel: '4 DL, 3 LB, 4 DB', usage: 'Standard downs' },
      { name: 'Nickel', personnel: '4 DL, 2 LB, 5 DB', usage: 'Passing situations' },
      { name: 'Dime', personnel: '4 DL, 1 LB, 6 DB', usage: 'Obvious pass' },
      { name: 'Goal Line', personnel: '5 DL, 4 LB, 2 DB', usage: 'Short yardage' },
    ],

    strongAgainst: ['spread', 'power_run'],
    weakAgainst: ['zone_run'],
  },

  '3-4': {
    id: '3-4',
    name: '3-4 Base',
    baseFormation: '3 DL, 4 LB',
    philosophy: 'Three down linemen with four linebackers creates versatility and disguised pressure. Can rush from anywhere, making it hard for offense to identify blitzers.',

    idealPersonnel: [
      { position: 'DE', idealArchetypes: ['3_4_end'], keyAttributes: ['blockShedding', 'strength'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'NT', idealArchetypes: ['nose_tackle'], keyAttributes: ['strength', 'blockShedding'], thresholds: { perfect: 90, good: 85, neutral: 80, poor: 75 } },
      { position: 'ILB', idealArchetypes: ['run_stopper', 'coverage'], keyAttributes: ['tackle', 'zoneCoverage'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'OLB', idealArchetypes: ['edge_rusher'], keyAttributes: ['passRush', 'speed'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'CB', idealArchetypes: ['press_corner'], keyAttributes: ['manCoverage'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'S', idealArchetypes: ['hybrid_safety'], keyAttributes: ['versatility'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
    ],

    attributeBonuses: [
      { attribute: 'passRush', value: 3, positions: ['OLB'] },
      { attribute: 'flexibility', value: 2 },
      { attribute: 'zoneCoverage', value: 2 },
      { attribute: 'playRecognition', value: 1 },
    ],
    attributePenalties: [
      { attribute: 'runStopping', value: -2, positions: ['DL'] },
      { attribute: 'interiorPressure', value: -1 },
    ],

    personnelPackages: [
      { name: 'Base', personnel: '3 DL, 4 LB, 4 DB', usage: 'Standard downs' },
      { name: 'Nickel', personnel: '3 DL, 3 LB, 5 DB', usage: 'Passing situations' },
      { name: 'Big Nickel', personnel: '3 DL, 2 LB, 6 DB', usage: 'Spread offense' },
      { name: 'Bear', personnel: '4 DL, 4 LB, 3 DB', usage: 'Run defense' },
    ],

    strongAgainst: ['zone_run'],
    weakAgainst: ['spread', 'power_run'],
  },

  cover_2: {
    id: 'cover_2',
    name: 'Cover 2',
    baseFormation: '2 Deep Safeties',
    philosophy: 'Two deep safeties split the field in half, with cornerbacks playing flat zones. Protects against deep passes but can be vulnerable in the middle of the field.',

    idealPersonnel: [
      { position: 'DE', idealArchetypes: ['speed_rusher'], keyAttributes: ['passRush'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'DT', idealArchetypes: ['interior_pressure'], keyAttributes: ['passRush'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'LB', idealArchetypes: ['coverage_lb'], keyAttributes: ['zoneCoverage', 'speed'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'CB', idealArchetypes: ['zone_corner'], keyAttributes: ['zoneCoverage', 'tackle'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'S', idealArchetypes: ['deep_safety', 'range_safety'], keyAttributes: ['zoneCoverage', 'range'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
    ],

    attributeBonuses: [
      { attribute: 'zoneCoverage', value: 4 },
      { attribute: 'deepBallDefense', value: 3 },
      { attribute: 'safetyRange', value: 2 },
      { attribute: 'lbCoverage', value: 2, positions: ['LB'] },
    ],
    attributePenalties: [
      { attribute: 'manCoverage', value: -3 },
      { attribute: 'intermediateDefense', value: -2 },
    ],

    personnelPackages: [
      { name: 'Tampa 2', personnel: 'MLB drops deep', usage: 'Protect middle' },
      { name: 'Cover 2 Man', personnel: 'Man under, 2 deep', usage: 'Hybrid coverage' },
    ],

    strongAgainst: ['air_raid', 'power_run'],
    weakAgainst: ['west_coast'],
  },

  cover_3: {
    id: 'cover_3',
    name: 'Cover 3',
    baseFormation: '3 Deep Zones',
    philosophy: 'Three deep zones with four underneath. Creates opportunities for turnovers with deep defenders reading the quarterback. Single-high safety look.',

    idealPersonnel: [
      { position: 'DE', idealArchetypes: ['speed_rusher'], keyAttributes: ['passRush'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'DT', idealArchetypes: ['run_stuffer'], keyAttributes: ['blockShedding'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'LB', idealArchetypes: ['ball_hawk_lb'], keyAttributes: ['playRecognition', 'interception'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'CB', idealArchetypes: ['ball_hawk'], keyAttributes: ['zoneCoverage', 'catching'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'FS', idealArchetypes: ['center_field'], keyAttributes: ['range', 'ballSkills'], thresholds: { perfect: 90, good: 85, neutral: 80, poor: 75 } },
      { position: 'SS', idealArchetypes: ['box_safety'], keyAttributes: ['runSupport'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
    ],

    attributeBonuses: [
      { attribute: 'zoneCoverage', value: 3 },
      { attribute: 'interception', value: 2 },
      { attribute: 'ballHawkAbility', value: 2 },
      { attribute: 'playRecognition', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'runDefense', value: -2 },
      { attribute: 'manCoverage', value: -2 },
    ],

    personnelPackages: [
      { name: 'Cover 3 Sky', personnel: 'SS in box', usage: 'Run support' },
      { name: 'Cover 3 Cloud', personnel: 'CB in flat', usage: 'Pattern match' },
    ],

    strongAgainst: [],
    weakAgainst: ['air_raid'],
  },

  man_blitz: {
    id: 'man_blitz',
    name: 'Man Blitz',
    baseFormation: 'Man Coverage + Pressure',
    philosophy: 'Aggressive man-to-man coverage with frequent blitzing. High risk, high reward—can dominate or get burned for big plays.',

    idealPersonnel: [
      { position: 'DE', idealArchetypes: ['speed_rusher'], keyAttributes: ['passRush', 'speed'], thresholds: { perfect: 90, good: 85, neutral: 80, poor: 75 } },
      { position: 'DT', idealArchetypes: ['interior_pressure'], keyAttributes: ['passRush'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'LB', idealArchetypes: ['blitzer'], keyAttributes: ['blitzing', 'speed'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'CB', idealArchetypes: ['shutdown_corner'], keyAttributes: ['manCoverage', 'press'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'S', idealArchetypes: ['man_coverage'], keyAttributes: ['manCoverage', 'speed'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
    ],

    attributeBonuses: [
      { attribute: 'manCoverage', value: 5 },
      { attribute: 'passRush', value: 4 },
      { attribute: 'pressCoverage', value: 3 },
      { attribute: 'blitzing', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'zoneCoverage', value: -4 },
      { attribute: 'deepBallDefense', value: -3 },
      { attribute: 'runDefense', value: -1 },
    ],

    personnelPackages: [
      { name: '4-Man Rush', personnel: '4 rushers', usage: 'Low risk' },
      { name: '5-Man Blitz', personnel: '5 rushers', usage: 'Medium risk' },
      { name: '6-Man Blitz', personnel: '6 rushers', usage: 'High risk' },
      { name: 'All-Out Blitz', personnel: '7+ rushers', usage: 'Very high risk' },
    ],

    strongAgainst: ['spread'],
    weakAgainst: ['west_coast', 'air_raid'],
  },

  zone_blitz: {
    id: 'zone_blitz',
    name: 'Zone Blitz',
    baseFormation: 'Zone + Disguised Pressure',
    philosophy: 'Disguised pressure with zone coverage behind it. Drops linemen into coverage while blitzing from unexpected positions. Confuses quarterbacks and creates turnovers.',

    idealPersonnel: [
      { position: 'DE', idealArchetypes: ['versatile_end'], keyAttributes: ['passRush', 'zoneCoverage'], thresholds: { perfect: 80, good: 75, neutral: 70, poor: 65 } },
      { position: 'DT', idealArchetypes: ['athletic_interior'], keyAttributes: ['agility', 'coverage'], thresholds: { perfect: 75, good: 70, neutral: 65, poor: 60 } },
      { position: 'LB', idealArchetypes: ['hybrid_lb'], keyAttributes: ['blitzing', 'coverage', 'versatility'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'CB', idealArchetypes: ['zone_corner'], keyAttributes: ['zoneCoverage'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
      { position: 'S', idealArchetypes: ['hybrid_safety'], keyAttributes: ['blitzing', 'coverage'], thresholds: { perfect: 85, good: 80, neutral: 75, poor: 70 } },
    ],

    attributeBonuses: [
      { attribute: 'playRecognition', value: 3 },
      { attribute: 'blitzing', value: 3 },
      { attribute: 'zoneCoverage', value: 2 },
      { attribute: 'disguise', value: 2 },
    ],
    attributePenalties: [
      { attribute: 'manCoverage', value: -2 },
      { attribute: 'deepBallDefense', value: -1 },
    ],

    personnelPackages: [
      { name: 'Fire Zone', personnel: '5 rush, 3 deep, 3 under', usage: 'Standard zone blitz' },
      { name: 'Overload', personnel: 'Blitz one side, zone other', usage: 'Create confusion' },
      { name: 'Simulated Pressure', personnel: 'Show blitz, drop into zone', usage: 'Disguise' },
      { name: 'Delayed Blitz', personnel: 'LB waits, then rushes', usage: 'Surprise pressure' },
    ],

    strongAgainst: ['zone_run'],
    weakAgainst: ['spread'],
  },
};

// ============================================================================
// SPECIAL TEAMS PHILOSOPHIES
// ============================================================================

export const ST_PHILOSOPHIES: Record<STPhilosophy, STPhilosophyDefinition> = {
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive Returns',
    focus: 'Return everything possible',
    riskLevel: 'high',

    bonuses: [
      { effect: 'Return Yards', value: '+5 average' },
      { effect: 'Return TD Chance', value: '+3%' },
      { effect: 'Fair Catch Frequency', value: '-40%' },
    ],
    penalties: [
      { effect: 'Turnover Risk', value: '+2%' },
      { effect: 'Starting Field Position Variance', value: 'High' },
    ],

    idealPersonnel: [
      'Elite speed returner',
      'Strong blocking on return team',
      'Risk-tolerant players',
    ],
  },

  conservative: {
    id: 'conservative',
    name: 'Conservative',
    focus: 'Ball security first',
    riskLevel: 'low',

    bonuses: [
      { effect: 'Turnover Risk', value: '-3%' },
      { effect: 'Consistent Field Position', value: '+5 yards average' },
      { effect: 'Muff/Fumble Chance', value: '-50%' },
    ],
    penalties: [
      { effect: 'Return Yards', value: '-5 average' },
      { effect: 'Return TD Chance', value: '-2%' },
    ],

    idealPersonnel: [
      'Sure-handed returner',
      'Good decision makers',
      'Ball security focus',
    ],
  },

  coverage_specialist: {
    id: 'coverage_specialist',
    name: 'Coverage Specialist',
    focus: 'Elite coverage units',
    riskLevel: 'medium',

    bonuses: [
      { effect: 'Opponent Return Yards', value: '-10 average' },
      { effect: 'Coverage Tackles', value: '+25%' },
      { effect: 'Big Play Prevention', value: '+20%' },
    ],
    penalties: [
      { effect: 'Return Game', value: 'Neutral' },
      { effect: 'Special Teams Injuries', value: '+5% (aggressive tackling)' },
    ],

    idealPersonnel: [
      'Fast coverage players',
      'Good tacklers',
      'Disciplined lane runners',
    ],
  },
};

// ============================================================================
// HELPER ARRAYS
// ============================================================================

export const ALL_OFFENSIVE_SCHEMES: OffensiveScheme[] = [
  'west_coast', 'spread', 'pro_style', 'air_raid', 'power_run', 'zone_run',
];

export const ALL_DEFENSIVE_SCHEMES: DefensiveScheme[] = [
  '4-3', '3-4', 'cover_2', 'cover_3', 'man_blitz', 'zone_blitz',
];

export const ALL_ST_PHILOSOPHIES: STPhilosophy[] = [
  'aggressive', 'conservative', 'coverage_specialist',
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getOffensiveScheme(id: OffensiveScheme): OffensiveSchemeDefinition {
  return OFFENSIVE_SCHEMES[id];
}

export function getDefensiveScheme(id: DefensiveScheme): DefensiveSchemeDefinition {
  return DEFENSIVE_SCHEMES[id];
}

export function getSTPhilosophy(id: STPhilosophy): STPhilosophyDefinition {
  return ST_PHILOSOPHIES[id];
}

export function getRandomOffensiveScheme(): OffensiveScheme {
  return ALL_OFFENSIVE_SCHEMES[Math.floor(Math.random() * ALL_OFFENSIVE_SCHEMES.length)];
}

export function getRandomDefensiveScheme(): DefensiveScheme {
  return ALL_DEFENSIVE_SCHEMES[Math.floor(Math.random() * ALL_DEFENSIVE_SCHEMES.length)];
}

export function getRandomSTPhilosophy(): STPhilosophy {
  return ALL_ST_PHILOSOPHIES[Math.floor(Math.random() * ALL_ST_PHILOSOPHIES.length)];
}
