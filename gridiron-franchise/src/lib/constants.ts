/**
 * Constants - Roster templates and position-archetype mappings
 *
 * This file defines the 53-man roster structure and archetype weights per position.
 * Updated to use new position-disambiguated archetype enum values.
 */

import { Position, Archetype } from './types';

/**
 * Position-specific archetype weights
 * Weights represent relative probability of selection (higher = more common)
 */
export const POSITION_ARCHETYPES: Record<Position, { archetype: Archetype; weight: number }[]> = {
  [Position.QB]: [
    { archetype: Archetype.PocketPasser, weight: 25 },
    { archetype: Archetype.DualThreat, weight: 20 },
    { archetype: Archetype.Gunslinger, weight: 15 },
    { archetype: Archetype.FieldGeneral, weight: 10 },
    { archetype: Archetype.Scrambler, weight: 15 },
    { archetype: Archetype.GameManager, weight: 15 },
  ],
  [Position.RB]: [
    { archetype: Archetype.PowerBack, weight: 20 },
    { archetype: Archetype.SpeedBack, weight: 20 },
    { archetype: Archetype.ElusiveBack, weight: 20 },
    { archetype: Archetype.AllPurpose, weight: 15 },
    { archetype: Archetype.ReceivingBack, weight: 15 },
    { archetype: Archetype.Bruiser, weight: 10 },
  ],
  [Position.WR]: [
    { archetype: Archetype.DeepThreat, weight: 20 },
    { archetype: Archetype.Possession, weight: 20 },
    { archetype: Archetype.RouteTechnician, weight: 15 },
    { archetype: Archetype.Playmaker, weight: 15 },
    { archetype: Archetype.RedZoneThreat, weight: 15 },
    { archetype: Archetype.SlotSpecialist, weight: 15 },
  ],
  [Position.TE]: [
    { archetype: Archetype.ReceivingTE, weight: 25 },
    { archetype: Archetype.BlockingTE, weight: 20 },
    { archetype: Archetype.HybridTE, weight: 20 },
    { archetype: Archetype.SeamStretcher, weight: 15 },
    { archetype: Archetype.MoveTE, weight: 10 },
    { archetype: Archetype.HBack, weight: 10 },
  ],
  [Position.LT]: [
    { archetype: Archetype.PassProtector, weight: 25 },
    { archetype: Archetype.RoadGrader, weight: 20 },
    { archetype: Archetype.Technician, weight: 20 },
    { archetype: Archetype.Mauler, weight: 15 },
    { archetype: Archetype.AthleticOL, weight: 10 },
    { archetype: Archetype.BalancedOL, weight: 10 },
  ],
  [Position.LG]: [
    { archetype: Archetype.PassProtector, weight: 25 },
    { archetype: Archetype.RoadGrader, weight: 20 },
    { archetype: Archetype.Technician, weight: 20 },
    { archetype: Archetype.Mauler, weight: 15 },
    { archetype: Archetype.AthleticOL, weight: 10 },
    { archetype: Archetype.BalancedOL, weight: 10 },
  ],
  [Position.C]: [
    { archetype: Archetype.PassProtector, weight: 25 },
    { archetype: Archetype.RoadGrader, weight: 20 },
    { archetype: Archetype.Technician, weight: 20 },
    { archetype: Archetype.Mauler, weight: 15 },
    { archetype: Archetype.AthleticOL, weight: 10 },
    { archetype: Archetype.BalancedOL, weight: 10 },
  ],
  [Position.RG]: [
    { archetype: Archetype.PassProtector, weight: 25 },
    { archetype: Archetype.RoadGrader, weight: 20 },
    { archetype: Archetype.Technician, weight: 20 },
    { archetype: Archetype.Mauler, weight: 15 },
    { archetype: Archetype.AthleticOL, weight: 10 },
    { archetype: Archetype.BalancedOL, weight: 10 },
  ],
  [Position.RT]: [
    { archetype: Archetype.PassProtector, weight: 25 },
    { archetype: Archetype.RoadGrader, weight: 20 },
    { archetype: Archetype.Technician, weight: 20 },
    { archetype: Archetype.Mauler, weight: 15 },
    { archetype: Archetype.AthleticOL, weight: 10 },
    { archetype: Archetype.BalancedOL, weight: 10 },
  ],
  [Position.DE]: [
    { archetype: Archetype.SpeedRusher, weight: 25 },
    { archetype: Archetype.PowerRusher, weight: 20 },
    { archetype: Archetype.Complete, weight: 15 },
    { archetype: Archetype.RunStuffer, weight: 15 },
    { archetype: Archetype.HybridDE, weight: 15 },
    { archetype: Archetype.RawAthlete, weight: 10 },
  ],
  [Position.DT]: [
    { archetype: Archetype.NoseTackle, weight: 25 },
    { archetype: Archetype.InteriorRusher, weight: 20 },
    { archetype: Archetype.RunPlugger, weight: 20 },
    { archetype: Archetype.ThreeTech, weight: 15 },
    { archetype: Archetype.HybridDT, weight: 10 },
    { archetype: Archetype.AthleticDT, weight: 10 },
  ],
  [Position.MLB]: [
    { archetype: Archetype.FieldGeneralLB, weight: 20 },
    { archetype: Archetype.RunStopper, weight: 20 },
    { archetype: Archetype.PassRusherLB, weight: 15 },
    { archetype: Archetype.CoverageLB, weight: 20 },
    { archetype: Archetype.HybridLB, weight: 15 },
    { archetype: Archetype.AthleticLB, weight: 10 },
  ],
  [Position.OLB]: [
    { archetype: Archetype.PassRusherLB, weight: 25 },
    { archetype: Archetype.RunStopper, weight: 20 },
    { archetype: Archetype.CoverageLB, weight: 20 },
    { archetype: Archetype.HybridLB, weight: 15 },
    { archetype: Archetype.FieldGeneralLB, weight: 10 },
    { archetype: Archetype.AthleticLB, weight: 10 },
  ],
  [Position.CB]: [
    { archetype: Archetype.ManCover, weight: 25 },
    { archetype: Archetype.ZoneCover, weight: 20 },
    { archetype: Archetype.BallHawkCB, weight: 15 },
    { archetype: Archetype.Physical, weight: 15 },
    { archetype: Archetype.SlotCorner, weight: 15 },
    { archetype: Archetype.HybridCB, weight: 10 },
  ],
  [Position.FS]: [
    { archetype: Archetype.FreeSafety, weight: 25 },
    { archetype: Archetype.BallHawkS, weight: 20 },
    { archetype: Archetype.HybridS, weight: 20 },
    { archetype: Archetype.CoverageS, weight: 15 },
    { archetype: Archetype.StrongSafety, weight: 10 },
    { archetype: Archetype.Enforcer, weight: 10 },
  ],
  [Position.SS]: [
    { archetype: Archetype.StrongSafety, weight: 25 },
    { archetype: Archetype.Enforcer, weight: 20 },
    { archetype: Archetype.HybridS, weight: 20 },
    { archetype: Archetype.FreeSafety, weight: 15 },
    { archetype: Archetype.BallHawkS, weight: 10 },
    { archetype: Archetype.CoverageS, weight: 10 },
  ],
  [Position.K]: [
    { archetype: Archetype.AccurateK, weight: 30 },
    { archetype: Archetype.PowerK, weight: 25 },
    { archetype: Archetype.ClutchK, weight: 20 },
    { archetype: Archetype.BalancedK, weight: 15 },
    { archetype: Archetype.KickoffSpecialist, weight: 10 },
  ],
  [Position.P]: [
    { archetype: Archetype.AccurateP, weight: 30 },
    { archetype: Archetype.PowerP, weight: 25 },
    { archetype: Archetype.Directional, weight: 20 },
    { archetype: Archetype.BalancedP, weight: 15 },
    { archetype: Archetype.Hangtime, weight: 10 },
  ],
};

/**
 * 53-man roster template
 * Defines how many players at each position
 */
export const ROSTER_TEMPLATE: { position: Position; count: number }[] = [
  { position: Position.QB, count: 3 },
  { position: Position.RB, count: 4 },
  { position: Position.WR, count: 6 },
  { position: Position.TE, count: 3 },
  { position: Position.LT, count: 2 },
  { position: Position.LG, count: 2 },
  { position: Position.C, count: 2 },
  { position: Position.RG, count: 2 },
  { position: Position.RT, count: 2 },
  { position: Position.DE, count: 4 },
  { position: Position.DT, count: 4 },
  { position: Position.MLB, count: 2 },
  { position: Position.OLB, count: 4 },
  { position: Position.CB, count: 5 },
  { position: Position.FS, count: 2 },
  { position: Position.SS, count: 2 },
  { position: Position.K, count: 1 },
  { position: Position.P, count: 1 },
];
