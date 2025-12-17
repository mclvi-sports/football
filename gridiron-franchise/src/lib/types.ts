export enum Position {
  QB = 'QB',
  RB = 'RB',
  WR = 'WR',
  TE = 'TE',
  LT = 'LT',
  LG = 'LG',
  C = 'C',
  RG = 'RG',
  RT = 'RT',
  DE = 'DE',
  DT = 'DT',
  MLB = 'MLB',
  OLB = 'OLB',
  CB = 'CB',
  FS = 'FS',
  SS = 'SS',
  K = 'K',
  P = 'P',
}

export enum Archetype {
  // QB (6)
  PocketPasser = 'Pocket Passer',
  DualThreat = 'Dual-Threat',
  Gunslinger = 'Gunslinger',
  FieldGeneral = 'Field General',
  Scrambler = 'Scrambler',
  GameManager = 'Game Manager',

  // RB (6)
  PowerBack = 'Power Back',
  SpeedBack = 'Speed Back',
  ElusiveBack = 'Elusive Back',
  AllPurpose = 'All-Purpose',
  ReceivingBack = 'Receiving Back',
  Bruiser = 'Bruiser',

  // WR (6)
  DeepThreat = 'Deep Threat',
  Possession = 'Possession',
  RouteTechnician = 'Route Technician',
  Playmaker = 'Playmaker',
  RedZoneThreat = 'Red Zone Threat',
  SlotSpecialist = 'Slot Specialist',

  // TE (6)
  ReceivingTE = 'Receiving TE',
  BlockingTE = 'Blocking TE',
  HybridTE = 'Hybrid TE',
  SeamStretcher = 'Seam Stretcher',
  MoveTE = 'Move TE',
  HBack = 'H-Back',

  // OL (6) - shared across LT, LG, C, RG, RT
  PassProtector = 'Pass Protector',
  RoadGrader = 'Road Grader',
  Technician = 'Technician',
  Mauler = 'Mauler',
  AthleticOL = 'Athletic OL',
  BalancedOL = 'Balanced OL',

  // DE (6)
  SpeedRusher = 'Speed Rusher',
  PowerRusher = 'Power Rusher',
  Complete = 'Complete',
  RunStuffer = 'Run Stuffer',
  HybridDE = 'Hybrid DE',
  RawAthlete = 'Raw Athlete',

  // DT (6)
  NoseTackle = 'Nose Tackle',
  InteriorRusher = 'Interior Rusher',
  RunPlugger = 'Run Plugger',
  ThreeTech = '3-Tech',
  HybridDT = 'Hybrid DT',
  AthleticDT = 'Athletic DT',

  // LB (6) - shared across MLB, OLB
  RunStopper = 'Run Stopper',
  CoverageLB = 'Coverage LB',
  PassRusherLB = 'Pass Rusher LB',
  FieldGeneralLB = 'Field General LB',
  HybridLB = 'Hybrid LB',
  AthleticLB = 'Athletic LB',

  // CB (6)
  ManCover = 'Man Cover',
  ZoneCover = 'Zone Cover',
  BallHawkCB = 'Ball Hawk CB',
  Physical = 'Physical',
  SlotCorner = 'Slot Corner',
  HybridCB = 'Hybrid CB',

  // S (6) - shared across FS, SS
  FreeSafety = 'Free Safety',
  StrongSafety = 'Strong Safety',
  HybridS = 'Hybrid S',
  BallHawkS = 'Ball Hawk S',
  Enforcer = 'Enforcer',
  CoverageS = 'Coverage S',

  // K (5)
  AccurateK = 'Accurate K',
  PowerK = 'Power K',
  ClutchK = 'Clutch K',
  BalancedK = 'Balanced K',
  KickoffSpecialist = 'Kickoff Specialist',

  // P (5)
  AccurateP = 'Accurate P',
  PowerP = 'Power P',
  Directional = 'Directional',
  BalancedP = 'Balanced P',
  Hangtime = 'Hangtime',
}

export enum Tier {
  Elite = 'Elite',
  Good = 'Good',
  Average = 'Average',
  BelowAverage = 'Below Average',
  Rebuilding = 'Rebuilding',
}

export interface PlayerAttributes {
  // Physical (shared)
  SPD: number; // Speed
  ACC: number; // Acceleration
  AGI: number; // Agility
  STR: number; // Strength
  JMP: number; // Jumping
  STA: number; // Stamina
  INJ: number; // Injury

  // Mental (shared)
  AWR: number; // Awareness
  PRC: number; // Play Recognition

  // Passing (QB)
  THP: number; // Throw Power
  SAC: number; // Short Accuracy
  MAC: number; // Medium Accuracy
  DAC: number; // Deep Accuracy
  TUP: number; // Throw Under Pressure
  TOR: number; // Throw on Run
  PAC: number; // Play Action
  BSK: number; // Break Sack

  // Rushing (RB)
  CAR: number; // Carrying
  BTK: number; // Break Tackle
  TRK: number; // Trucking
  ELU: number; // Elusiveness
  SPM: number; // Spin Move
  JKM: number; // Juke Move
  SFA: number; // Stiff Arm
  VIS: number; // Vision

  // Receiving (RB, WR, TE)
  CTH: number; // Catching
  CIT: number; // Catch In Traffic
  SPC: number; // Spectacular Catch
  RTE: number; // Route Running (RB, TE)
  REL: number; // Release
  RAC: number; // Run After Catch
  SRR: number; // Short Route Running (WR)
  MRR: number; // Medium Route Running (WR)
  DRR: number; // Deep Route Running (WR)

  // Blocking (RB, TE, OL)
  PBK: number; // Pass Block (generic)
  RBK: number; // Run Block (generic)
  IBL: number; // Impact Block
  PBP: number; // Pass Block Power (OL)
  PBF: number; // Pass Block Finesse (OL)
  RBP: number; // Run Block Power (OL)
  RBF: number; // Run Block Finesse (OL)
  LBK: number; // Lead Block (OL)

  // Defense (DL, LB, DB)
  TAK: number; // Tackling
  POW: number; // Hit Power
  PMV: number; // Power Moves
  FMV: number; // Finesse Moves
  BSH: number; // Block Shedding
  PUR: number; // Pursuit
  MCV: number; // Man Coverage
  ZCV: number; // Zone Coverage
  PRS: number; // Press

  // Special Teams (K, P)
  KPW: number; // Kick Power
  KAC: number; // Kick Accuracy
  KOP: number; // Kickoff Power
  PPW: number; // Punt Power
  PUA: number; // Punt Accuracy
  CLU: number; // Clutch (K)
  CON: number; // Consistency (K, P)
  RET: number; // Return
}

// Trait system types
export enum TraitCategory {
  Leadership = 'Leadership',
  WorkEthic = 'Work Ethic',
  OnField = 'On-Field',
  Durability = 'Durability',
  Contract = 'Contract',
  Clutch = 'Clutch',
  Character = 'Character',
}

export type TraitRarity = 'common' | 'uncommon' | 'rare' | 'very_rare';

export interface TraitEffect {
  type: string;
  value: number;
  description: string;
}

// Badge system types
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'hof';

export interface PlayerBadge {
  id: string;
  tier: BadgeTier;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  archetype: Archetype;
  age: number;
  experience: number; // Years in league (0-15+)
  height: number; // in inches
  weight: number; // in lbs
  fortyTime: number; // 40-yard dash time in seconds
  college: string;
  jerseyNumber: number;
  overall: number;
  potential: number; // 0-99
  attributes: PlayerAttributes;
  traits: string[];
  badges: PlayerBadge[];
  contract?: {
    years: number;
    salary: number; // in millions
  };
  // Training system fields (WO-TRAINING-SYSTEM-001 | TYPE-002)
  currentXP?: number;      // Available XP to spend
  totalXPEarned?: number;  // Lifetime XP earned
  seasonXP?: number;       // XP earned this season
}

export interface Roster {
  players: Player[];
  depthChart: Record<Position, string[]>; // Position -> Player IDs
}

export interface Team {
  id: string;
  city: string;
  name: string;
  abbr: string;
  tier: Tier;
  roster: Roster;
  overall: number;
  offense: number;
  defense: number;
}

// Combine measurables for draft prospects (extends base physical attributes)
export interface CombineMeasurables {
  // Body measurements (supplement height/weight on Player)
  armLength: number;    // inches (30-36")
  handSize: number;     // inches (8.5-11")
  wingspan: number;     // inches (72-86")

  // Athletic testing
  verticalJump: number;   // inches
  broadJump: number;      // inches
  threeCone: number;      // seconds
  twentyShuttle: number;  // seconds
  benchPress: number;     // reps at 225 lbs
}
