/**
 * Archetype Templates - All 70 archetypes with attribute tier assignments
 *
 * Each archetype defines which attributes are Primary (P), Secondary (S), or Tertiary (T).
 * - Primary: Elite for the archetype (50% of attribute points)
 * - Secondary: Solid, above average (35% of attribute points)
 * - Tertiary: Weakness or irrelevant (15% of attribute points)
 *
 * Source: FINAL-player-generation-system.md
 */

import { Archetype, PlayerAttributes } from '../types';

export type AttributeTier = 'P' | 'S' | 'T';

export interface ArchetypeTemplate {
  primary: (keyof PlayerAttributes)[];
  secondary: (keyof PlayerAttributes)[];
  tertiary: (keyof PlayerAttributes)[];
}

/**
 * All 70 archetype templates organized by position group
 */
export const ARCHETYPE_TEMPLATES: Record<Archetype, ArchetypeTemplate> = {
  // ==========================================
  // QB ARCHETYPES (6)
  // ==========================================

  [Archetype.PocketPasser]: {
    primary: ['SAC', 'MAC', 'TUP', 'AWR'],
    secondary: ['DAC', 'THP', 'PRC'],
    tertiary: ['SPD', 'ACC', 'AGI', 'TOR', 'BSK'],
  },

  [Archetype.DualThreat]: {
    primary: ['SPD', 'ACC', 'AGI', 'TOR', 'BSK'],
    secondary: ['SAC', 'MAC', 'DAC', 'THP', 'TUP', 'AWR'],
    tertiary: ['PRC'],
  },

  [Archetype.Gunslinger]: {
    primary: ['DAC', 'THP'],
    secondary: ['SAC', 'MAC', 'TUP', 'TOR'],
    tertiary: ['SPD', 'ACC', 'AGI', 'AWR', 'PRC', 'BSK'],
  },

  [Archetype.FieldGeneral]: {
    primary: ['SAC', 'MAC', 'TUP', 'AWR', 'PRC'],
    secondary: ['DAC', 'THP', 'TOR', 'BSK'],
    tertiary: ['SPD', 'ACC', 'AGI'],
  },

  [Archetype.Scrambler]: {
    primary: ['SPD', 'ACC', 'AGI', 'TOR', 'BSK'],
    secondary: ['SAC', 'THP'],
    tertiary: ['MAC', 'DAC', 'AWR', 'PRC', 'TUP'],
  },

  [Archetype.GameManager]: {
    primary: ['SAC', 'AWR', 'PRC'],
    secondary: ['MAC', 'TUP'],
    tertiary: ['SPD', 'ACC', 'AGI', 'DAC', 'THP', 'TOR', 'BSK'],
  },

  // ==========================================
  // RB ARCHETYPES (6)
  // ==========================================

  [Archetype.PowerBack]: {
    primary: ['STR', 'STA', 'CAR', 'BTK', 'TRK', 'SFA'],
    secondary: ['SPD', 'ACC', 'PBK', 'VIS'],
    tertiary: ['AGI', 'CTH', 'RTE', 'ELU', 'JKM', 'SPM'],
  },

  [Archetype.SpeedBack]: {
    primary: ['SPD', 'ACC', 'AGI', 'VIS'],
    secondary: ['STA', 'CTH', 'CAR', 'ELU', 'JKM', 'SPM'],
    tertiary: ['STR', 'RTE', 'PBK', 'BTK', 'TRK', 'SFA'],
  },

  [Archetype.ElusiveBack]: {
    primary: ['ACC', 'AGI', 'ELU', 'JKM', 'SPM'],
    secondary: ['SPD', 'STA', 'CTH', 'RTE', 'CAR', 'VIS'],
    tertiary: ['STR', 'PBK', 'BTK', 'TRK', 'SFA'],
  },

  [Archetype.AllPurpose]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'CTH', 'RTE', 'PBK', 'CAR', 'BTK', 'TRK', 'ELU', 'JKM', 'SPM', 'SFA', 'VIS'],
    tertiary: [],
  },

  [Archetype.ReceivingBack]: {
    primary: ['AGI', 'CTH', 'RTE'],
    secondary: ['SPD', 'ACC', 'STA', 'CAR', 'ELU', 'JKM', 'VIS'],
    tertiary: ['STR', 'PBK', 'BTK', 'TRK', 'SPM', 'SFA'],
  },

  [Archetype.Bruiser]: {
    primary: ['STR', 'STA', 'CAR', 'BTK', 'TRK', 'SFA'],
    secondary: ['ACC', 'PBK', 'VIS'],
    tertiary: ['SPD', 'AGI', 'CTH', 'RTE', 'ELU', 'JKM', 'SPM'],
  },

  // ==========================================
  // WR ARCHETYPES (6)
  // ==========================================

  [Archetype.DeepThreat]: {
    primary: ['SPD', 'ACC', 'REL', 'DRR'],
    secondary: ['AGI', 'JMP', 'CTH', 'SPC', 'MRR', 'RAC'],
    tertiary: ['STR', 'AWR', 'CIT', 'SRR'],
  },

  [Archetype.Possession]: {
    primary: ['CTH', 'CIT', 'AWR', 'MRR'],
    secondary: ['SPD', 'ACC', 'AGI', 'JMP', 'STR', 'SPC', 'REL', 'SRR', 'RAC'],
    tertiary: ['DRR'],
  },

  [Archetype.RouteTechnician]: {
    primary: ['AGI', 'AWR', 'REL', 'SRR', 'MRR'],
    secondary: ['SPD', 'ACC', 'CTH', 'CIT', 'DRR', 'RAC'],
    tertiary: ['JMP', 'STR', 'SPC'],
  },

  [Archetype.Playmaker]: {
    primary: ['SPD', 'ACC', 'AGI', 'RAC'],
    secondary: ['JMP', 'STR', 'AWR', 'CTH', 'CIT', 'REL', 'SRR', 'MRR'],
    tertiary: ['SPC', 'DRR'],
  },

  [Archetype.RedZoneThreat]: {
    primary: ['JMP', 'STR', 'CTH', 'CIT', 'SPC'],
    secondary: ['ACC', 'AWR', 'REL', 'SRR', 'MRR', 'DRR'],
    tertiary: ['SPD', 'AGI', 'RAC'],
  },

  [Archetype.SlotSpecialist]: {
    primary: ['ACC', 'AGI', 'CTH', 'SRR', 'MRR', 'RAC'],
    secondary: ['SPD', 'AWR', 'CIT', 'REL'],
    tertiary: ['JMP', 'STR', 'SPC', 'DRR'],
  },

  // ==========================================
  // TE ARCHETYPES (6)
  // ==========================================

  [Archetype.ReceivingTE]: {
    primary: ['CTH', 'CIT', 'REL', 'RTE'],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'AWR', 'JMP'],
    tertiary: ['RBK', 'PBK'],
  },

  [Archetype.BlockingTE]: {
    primary: ['STR', 'RBK', 'PBK'],
    secondary: ['AWR'],
    tertiary: ['SPD', 'ACC', 'AGI', 'CTH', 'CIT', 'REL', 'RTE', 'JMP'],
  },

  [Archetype.HybridTE]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'CTH', 'CIT', 'REL', 'RTE', 'RBK', 'PBK', 'AWR', 'JMP'],
    tertiary: [],
  },

  [Archetype.SeamStretcher]: {
    primary: ['SPD', 'ACC', 'RTE', 'JMP'],
    secondary: ['AGI', 'STR', 'CTH', 'CIT', 'REL', 'AWR'],
    tertiary: ['RBK', 'PBK'],
  },

  [Archetype.MoveTE]: {
    primary: ['ACC', 'AGI', 'CTH', 'REL', 'AWR'],
    secondary: ['SPD', 'STR', 'CIT', 'RTE', 'RBK', 'PBK', 'JMP'],
    tertiary: [],
  },

  [Archetype.HBack]: {
    primary: ['STR', 'RBK', 'PBK'],
    secondary: ['SPD', 'ACC', 'AGI', 'CTH', 'AWR'],
    tertiary: ['CIT', 'REL', 'RTE', 'JMP'],
  },

  // ==========================================
  // OL ARCHETYPES (6) - Shared across LT, LG, C, RG, RT
  // ==========================================

  [Archetype.PassProtector]: {
    primary: ['AWR', 'PBK', 'PBP', 'PBF'],
    secondary: ['STR', 'AGI', 'STA', 'RBK', 'RBP'],
    tertiary: ['SPD', 'ACC', 'IBL', 'RBF', 'LBK'],
  },

  [Archetype.RoadGrader]: {
    primary: ['STR', 'STA', 'RBK', 'RBP', 'IBL'],
    secondary: ['AWR', 'PBK', 'PBP', 'RBF', 'LBK'],
    tertiary: ['AGI', 'SPD', 'ACC', 'PBF'],
  },

  [Archetype.Technician]: {
    primary: ['AWR', 'PBF', 'RBF'],
    secondary: ['STR', 'AGI', 'STA', 'PBK', 'PBP', 'RBK', 'RBP', 'IBL', 'LBK'],
    tertiary: ['SPD', 'ACC'],
  },

  [Archetype.Mauler]: {
    primary: ['STR', 'PBP', 'RBP', 'IBL'],
    secondary: ['AWR', 'STA', 'PBK', 'RBK'],
    tertiary: ['AGI', 'SPD', 'ACC', 'PBF', 'RBF', 'LBK'],
  },

  [Archetype.AthleticOL]: {
    primary: ['AGI', 'SPD', 'ACC', 'LBK'],
    secondary: ['STR', 'STA', 'AWR', 'PBK', 'PBP', 'PBF', 'RBK', 'RBP', 'RBF', 'IBL'],
    tertiary: [],
  },

  [Archetype.BalancedOL]: {
    primary: [],
    secondary: ['STR', 'AGI', 'AWR', 'SPD', 'ACC', 'STA', 'PBK', 'PBP', 'PBF', 'RBK', 'RBP', 'RBF', 'IBL', 'LBK'],
    tertiary: [],
  },

  // ==========================================
  // DE ARCHETYPES (6)
  // ==========================================

  [Archetype.SpeedRusher]: {
    primary: ['SPD', 'ACC', 'AGI', 'FMV'],
    secondary: ['STR', 'STA', 'AWR', 'PMV', 'BSH', 'PUR', 'TAK'],
    tertiary: ['PRC'],
  },

  [Archetype.PowerRusher]: {
    primary: ['STR', 'STA', 'PMV', 'BSH'],
    secondary: ['SPD', 'ACC', 'AWR', 'FMV', 'PUR', 'TAK'],
    tertiary: ['AGI', 'PRC'],
  },

  [Archetype.Complete]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'AWR', 'PRC', 'PMV', 'FMV', 'BSH', 'PUR', 'TAK'],
    tertiary: [],
  },

  [Archetype.RunStuffer]: {
    primary: ['STR', 'STA', 'BSH', 'PUR', 'TAK'],
    secondary: ['AWR', 'PRC', 'PMV'],
    tertiary: ['SPD', 'ACC', 'AGI', 'FMV'],
  },

  [Archetype.HybridDE]: {
    primary: ['AWR'],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'PRC', 'PMV', 'FMV', 'BSH', 'PUR', 'TAK'],
    tertiary: [],
  },

  [Archetype.RawAthlete]: {
    primary: ['SPD', 'ACC', 'STR'],
    secondary: ['AGI', 'STA', 'PUR'],
    tertiary: ['AWR', 'PRC', 'PMV', 'FMV', 'BSH', 'TAK'],
  },

  // ==========================================
  // DT ARCHETYPES (6)
  // ==========================================

  [Archetype.NoseTackle]: {
    primary: ['STR', 'STA', 'BSH'],
    secondary: ['AWR', 'PRC', 'PMV', 'TAK'],
    tertiary: ['SPD', 'ACC', 'AGI', 'FMV', 'PUR'],
  },

  [Archetype.InteriorRusher]: {
    primary: ['PMV', 'FMV'],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'AWR', 'BSH', 'PUR', 'TAK'],
    tertiary: ['PRC'],
  },

  [Archetype.RunPlugger]: {
    primary: ['STR', 'STA', 'BSH', 'TAK'],
    secondary: ['AWR', 'PRC', 'PMV', 'PUR'],
    tertiary: ['SPD', 'ACC', 'AGI', 'FMV'],
  },

  [Archetype.ThreeTech]: {
    primary: ['ACC', 'FMV', 'PUR'],
    secondary: ['SPD', 'AGI', 'STR', 'STA', 'AWR', 'PMV', 'BSH', 'TAK'],
    tertiary: ['PRC'],
  },

  [Archetype.HybridDT]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'AWR', 'PRC', 'PMV', 'FMV', 'BSH', 'PUR', 'TAK'],
    tertiary: [],
  },

  [Archetype.AthleticDT]: {
    primary: ['SPD', 'ACC', 'AGI'],
    secondary: ['STR', 'STA', 'PMV', 'FMV', 'PUR'],
    tertiary: ['AWR', 'PRC', 'BSH', 'TAK'],
  },

  // ==========================================
  // LB ARCHETYPES (6) - Shared across MLB, OLB
  // ==========================================

  [Archetype.RunStopper]: {
    primary: ['STR', 'BSH', 'PUR', 'TAK'],
    secondary: ['SPD', 'ACC', 'STA', 'AWR', 'PRC', 'PMV'],
    tertiary: ['AGI', 'MCV', 'ZCV', 'FMV'],
  },

  [Archetype.CoverageLB]: {
    primary: ['SPD', 'ACC', 'AWR', 'MCV', 'ZCV'],
    secondary: ['AGI', 'STA', 'PRC', 'PUR', 'TAK'],
    tertiary: ['STR', 'BSH', 'PMV', 'FMV'],
  },

  [Archetype.PassRusherLB]: {
    primary: ['SPD', 'ACC', 'PMV', 'FMV'],
    secondary: ['AGI', 'STR', 'STA', 'AWR', 'BSH', 'PUR', 'TAK'],
    tertiary: ['PRC', 'MCV', 'ZCV'],
  },

  [Archetype.FieldGeneralLB]: {
    primary: ['AWR', 'PRC'],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'MCV', 'ZCV', 'BSH', 'PUR', 'TAK'],
    tertiary: ['PMV', 'FMV'],
  },

  [Archetype.HybridLB]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'AWR', 'PRC', 'MCV', 'ZCV', 'BSH', 'PUR', 'TAK', 'PMV', 'FMV'],
    tertiary: [],
  },

  [Archetype.AthleticLB]: {
    primary: ['SPD', 'ACC', 'AGI', 'PUR'],
    secondary: ['STR', 'STA', 'MCV', 'ZCV', 'TAK'],
    tertiary: ['AWR', 'PRC', 'BSH', 'PMV', 'FMV'],
  },

  // ==========================================
  // CB ARCHETYPES (6)
  // ==========================================

  [Archetype.ManCover]: {
    primary: ['SPD', 'ACC', 'AGI', 'MCV', 'PRS'],
    secondary: ['STA', 'AWR', 'PRC', 'ZCV', 'CTH', 'PUR'],
    tertiary: ['STR', 'TAK', 'POW'],
  },

  [Archetype.ZoneCover]: {
    primary: ['AWR', 'PRC', 'ZCV', 'CTH'],
    secondary: ['SPD', 'ACC', 'AGI', 'STA', 'MCV', 'PUR', 'TAK'],
    tertiary: ['STR', 'PRS', 'POW'],
  },

  [Archetype.BallHawkCB]: {
    primary: ['SPD', 'ACC', 'PRC', 'CTH'],
    secondary: ['AGI', 'STA', 'AWR', 'MCV', 'ZCV', 'PUR'],
    tertiary: ['STR', 'PRS', 'TAK', 'POW'],
  },

  [Archetype.Physical]: {
    primary: ['STR', 'MCV', 'PRS'],
    secondary: ['SPD', 'ACC', 'AGI', 'STA', 'AWR', 'CTH', 'PUR', 'TAK', 'POW'],
    tertiary: ['PRC', 'ZCV'],
  },

  [Archetype.SlotCorner]: {
    primary: ['ACC', 'AGI', 'MCV'],
    secondary: ['SPD', 'STA', 'AWR', 'PRC', 'ZCV', 'PRS', 'CTH', 'PUR', 'TAK'],
    tertiary: ['STR', 'POW'],
  },

  [Archetype.HybridCB]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'AWR', 'PRC', 'MCV', 'ZCV', 'PRS', 'CTH', 'PUR', 'TAK', 'POW'],
    tertiary: [],
  },

  // ==========================================
  // S ARCHETYPES (6) - Shared across FS, SS
  // ==========================================

  [Archetype.FreeSafety]: {
    primary: ['SPD', 'ACC', 'AWR', 'PRC', 'ZCV', 'CTH'],
    secondary: ['AGI', 'STA', 'MCV', 'PUR', 'TAK'],
    tertiary: ['STR', 'PRS', 'POW'],
  },

  [Archetype.StrongSafety]: {
    primary: ['STR', 'PUR', 'TAK', 'POW'],
    secondary: ['SPD', 'ACC', 'AGI', 'STA', 'AWR', 'PRC', 'MCV', 'ZCV', 'PRS', 'CTH'],
    tertiary: [],
  },

  [Archetype.HybridS]: {
    primary: [],
    secondary: ['SPD', 'ACC', 'AGI', 'STR', 'STA', 'AWR', 'PRC', 'MCV', 'ZCV', 'PRS', 'CTH', 'PUR', 'TAK', 'POW'],
    tertiary: [],
  },

  [Archetype.BallHawkS]: {
    primary: ['SPD', 'ACC', 'PRC', 'CTH'],
    secondary: ['AGI', 'STA', 'AWR', 'MCV', 'ZCV', 'PUR'],
    tertiary: ['STR', 'PRS', 'TAK', 'POW'],
  },

  [Archetype.Enforcer]: {
    primary: ['STR', 'PUR', 'TAK', 'POW'],
    secondary: ['SPD', 'ACC', 'STA', 'AWR', 'PRS', 'CTH'],
    tertiary: ['AGI', 'PRC', 'MCV', 'ZCV'],
  },

  [Archetype.CoverageS]: {
    primary: ['SPD', 'ACC', 'AGI', 'MCV', 'ZCV'],
    secondary: ['STA', 'AWR', 'PRC', 'PRS', 'CTH', 'PUR'],
    tertiary: ['STR', 'TAK', 'POW'],
  },

  // ==========================================
  // K ARCHETYPES (5)
  // ==========================================

  [Archetype.AccurateK]: {
    primary: ['KAC', 'CON'],
    secondary: ['KPW', 'AWR', 'CLU'],
    tertiary: ['KOP'],
  },

  [Archetype.PowerK]: {
    primary: ['KPW', 'KOP'],
    secondary: ['KAC', 'AWR', 'CLU', 'CON'],
    tertiary: [],
  },

  [Archetype.ClutchK]: {
    primary: ['CLU'],
    secondary: ['KPW', 'KAC', 'AWR', 'CON'],
    tertiary: ['KOP'],
  },

  [Archetype.BalancedK]: {
    primary: [],
    secondary: ['KPW', 'KAC', 'KOP', 'AWR', 'CLU', 'CON'],
    tertiary: [],
  },

  [Archetype.KickoffSpecialist]: {
    primary: ['KOP'],
    secondary: ['KPW', 'CON'],
    tertiary: ['KAC', 'AWR', 'CLU'],
  },

  // ==========================================
  // P ARCHETYPES (5)
  // ==========================================

  [Archetype.AccurateP]: {
    primary: ['PUA', 'CON'],
    secondary: ['PPW', 'AWR'],
    tertiary: [],
  },

  [Archetype.PowerP]: {
    primary: ['PPW'],
    secondary: ['PUA', 'AWR', 'CON'],
    tertiary: [],
  },

  [Archetype.Directional]: {
    primary: ['AWR', 'PUA'],
    secondary: ['PPW', 'CON'],
    tertiary: [],
  },

  [Archetype.BalancedP]: {
    primary: [],
    secondary: ['PPW', 'PUA', 'AWR', 'CON'],
    tertiary: [],
  },

  [Archetype.Hangtime]: {
    primary: ['PPW'],
    secondary: ['PUA', 'AWR', 'CON'],
    tertiary: [],
  },
};

/**
 * Maps positions to their valid archetypes
 */
export const POSITION_ARCHETYPES: Record<string, Archetype[]> = {
  QB: [
    Archetype.PocketPasser,
    Archetype.DualThreat,
    Archetype.Gunslinger,
    Archetype.FieldGeneral,
    Archetype.Scrambler,
    Archetype.GameManager,
  ],
  RB: [
    Archetype.PowerBack,
    Archetype.SpeedBack,
    Archetype.ElusiveBack,
    Archetype.AllPurpose,
    Archetype.ReceivingBack,
    Archetype.Bruiser,
  ],
  WR: [
    Archetype.DeepThreat,
    Archetype.Possession,
    Archetype.RouteTechnician,
    Archetype.Playmaker,
    Archetype.RedZoneThreat,
    Archetype.SlotSpecialist,
  ],
  TE: [
    Archetype.ReceivingTE,
    Archetype.BlockingTE,
    Archetype.HybridTE,
    Archetype.SeamStretcher,
    Archetype.MoveTE,
    Archetype.HBack,
  ],
  LT: [
    Archetype.PassProtector,
    Archetype.RoadGrader,
    Archetype.Technician,
    Archetype.Mauler,
    Archetype.AthleticOL,
    Archetype.BalancedOL,
  ],
  LG: [
    Archetype.PassProtector,
    Archetype.RoadGrader,
    Archetype.Technician,
    Archetype.Mauler,
    Archetype.AthleticOL,
    Archetype.BalancedOL,
  ],
  C: [
    Archetype.PassProtector,
    Archetype.RoadGrader,
    Archetype.Technician,
    Archetype.Mauler,
    Archetype.AthleticOL,
    Archetype.BalancedOL,
  ],
  RG: [
    Archetype.PassProtector,
    Archetype.RoadGrader,
    Archetype.Technician,
    Archetype.Mauler,
    Archetype.AthleticOL,
    Archetype.BalancedOL,
  ],
  RT: [
    Archetype.PassProtector,
    Archetype.RoadGrader,
    Archetype.Technician,
    Archetype.Mauler,
    Archetype.AthleticOL,
    Archetype.BalancedOL,
  ],
  DE: [
    Archetype.SpeedRusher,
    Archetype.PowerRusher,
    Archetype.Complete,
    Archetype.RunStuffer,
    Archetype.HybridDE,
    Archetype.RawAthlete,
  ],
  DT: [
    Archetype.NoseTackle,
    Archetype.InteriorRusher,
    Archetype.RunPlugger,
    Archetype.ThreeTech,
    Archetype.HybridDT,
    Archetype.AthleticDT,
  ],
  MLB: [
    Archetype.RunStopper,
    Archetype.CoverageLB,
    Archetype.PassRusherLB,
    Archetype.FieldGeneralLB,
    Archetype.HybridLB,
    Archetype.AthleticLB,
  ],
  OLB: [
    Archetype.RunStopper,
    Archetype.CoverageLB,
    Archetype.PassRusherLB,
    Archetype.FieldGeneralLB,
    Archetype.HybridLB,
    Archetype.AthleticLB,
  ],
  CB: [
    Archetype.ManCover,
    Archetype.ZoneCover,
    Archetype.BallHawkCB,
    Archetype.Physical,
    Archetype.SlotCorner,
    Archetype.HybridCB,
  ],
  FS: [
    Archetype.FreeSafety,
    Archetype.StrongSafety,
    Archetype.HybridS,
    Archetype.BallHawkS,
    Archetype.Enforcer,
    Archetype.CoverageS,
  ],
  SS: [
    Archetype.FreeSafety,
    Archetype.StrongSafety,
    Archetype.HybridS,
    Archetype.BallHawkS,
    Archetype.Enforcer,
    Archetype.CoverageS,
  ],
  K: [
    Archetype.AccurateK,
    Archetype.PowerK,
    Archetype.ClutchK,
    Archetype.BalancedK,
    Archetype.KickoffSpecialist,
  ],
  P: [
    Archetype.AccurateP,
    Archetype.PowerP,
    Archetype.Directional,
    Archetype.BalancedP,
    Archetype.Hangtime,
  ],
};

/**
 * Archetype rarity weights by position (percentage chance)
 * Source: FINAL-player-generation-system.md
 */
export const ARCHETYPE_RARITY: Record<Archetype, number> = {
  // QB
  [Archetype.PocketPasser]: 25,
  [Archetype.DualThreat]: 20,
  [Archetype.Gunslinger]: 15,
  [Archetype.FieldGeneral]: 10,
  [Archetype.Scrambler]: 15,
  [Archetype.GameManager]: 15,

  // RB
  [Archetype.PowerBack]: 20,
  [Archetype.SpeedBack]: 20,
  [Archetype.ElusiveBack]: 20,
  [Archetype.AllPurpose]: 15,
  [Archetype.ReceivingBack]: 15,
  [Archetype.Bruiser]: 10,

  // WR
  [Archetype.DeepThreat]: 20,
  [Archetype.Possession]: 20,
  [Archetype.RouteTechnician]: 15,
  [Archetype.Playmaker]: 15,
  [Archetype.RedZoneThreat]: 15,
  [Archetype.SlotSpecialist]: 15,

  // TE
  [Archetype.ReceivingTE]: 25,
  [Archetype.BlockingTE]: 20,
  [Archetype.HybridTE]: 20,
  [Archetype.SeamStretcher]: 15,
  [Archetype.MoveTE]: 10,
  [Archetype.HBack]: 10,

  // OL
  [Archetype.PassProtector]: 25,
  [Archetype.RoadGrader]: 20,
  [Archetype.Technician]: 20,
  [Archetype.Mauler]: 15,
  [Archetype.AthleticOL]: 10,
  [Archetype.BalancedOL]: 10,

  // DE
  [Archetype.SpeedRusher]: 25,
  [Archetype.PowerRusher]: 20,
  [Archetype.Complete]: 15,
  [Archetype.RunStuffer]: 15,
  [Archetype.HybridDE]: 15,
  [Archetype.RawAthlete]: 10,

  // DT
  [Archetype.NoseTackle]: 25,
  [Archetype.InteriorRusher]: 20,
  [Archetype.RunPlugger]: 20,
  [Archetype.ThreeTech]: 15,
  [Archetype.HybridDT]: 10,
  [Archetype.AthleticDT]: 10,

  // LB
  [Archetype.RunStopper]: 20,
  [Archetype.CoverageLB]: 20,
  [Archetype.PassRusherLB]: 15,
  [Archetype.FieldGeneralLB]: 15,
  [Archetype.HybridLB]: 15,
  [Archetype.AthleticLB]: 15,

  // CB
  [Archetype.ManCover]: 25,
  [Archetype.ZoneCover]: 20,
  [Archetype.BallHawkCB]: 15,
  [Archetype.Physical]: 15,
  [Archetype.SlotCorner]: 15,
  [Archetype.HybridCB]: 10,

  // S
  [Archetype.FreeSafety]: 25,
  [Archetype.StrongSafety]: 20,
  [Archetype.HybridS]: 20,
  [Archetype.BallHawkS]: 15,
  [Archetype.Enforcer]: 10,
  [Archetype.CoverageS]: 10,

  // K
  [Archetype.AccurateK]: 30,
  [Archetype.PowerK]: 25,
  [Archetype.ClutchK]: 20,
  [Archetype.BalancedK]: 15,
  [Archetype.KickoffSpecialist]: 10,

  // P
  [Archetype.AccurateP]: 30,
  [Archetype.PowerP]: 25,
  [Archetype.Directional]: 20,
  [Archetype.BalancedP]: 15,
  [Archetype.Hangtime]: 10,
};
