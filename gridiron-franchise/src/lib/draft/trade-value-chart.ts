/**
 * NFL Draft Trade Value Chart
 *
 * Classic Jimmy Johnson trade value chart with modern adjustments.
 * Used to evaluate and negotiate pick trades.
 *
 * WO-DRAFT-EXPERIENCE-001 - Phase 4
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TradeValueResult {
  pick1Value: number;
  pick2Value: number;
  difference: number;
  percentageDiff: number;
  isFair: boolean; // Within 10% is considered fair
  recommendation: 'accept' | 'decline' | 'counter';
}

export interface TradeOffer {
  offeredPicks: number[]; // Overall pick numbers
  requestedPicks: number[]; // Overall pick numbers
  futurePicksOffered?: FuturePickValue[];
  futurePicksRequested?: FuturePickValue[];
}

export interface FuturePickValue {
  round: number;
  yearsAway: number; // 1 = next year, 2 = two years away
}

// ─────────────────────────────────────────────────────────────────────────────
// Jimmy Johnson Trade Value Chart
// Based on classic NFL chart with some adjustments
// ─────────────────────────────────────────────────────────────────────────────

export const PICK_VALUES: Record<number, number> = {
  // Round 1 (picks 1-32)
  1: 3000,
  2: 2600,
  3: 2200,
  4: 1800,
  5: 1700,
  6: 1600,
  7: 1500,
  8: 1400,
  9: 1350,
  10: 1300,
  11: 1250,
  12: 1200,
  13: 1150,
  14: 1100,
  15: 1050,
  16: 1000,
  17: 950,
  18: 900,
  19: 875,
  20: 850,
  21: 800,
  22: 780,
  23: 760,
  24: 740,
  25: 720,
  26: 700,
  27: 680,
  28: 660,
  29: 640,
  30: 620,
  31: 600,
  32: 590,

  // Round 2 (picks 33-64)
  33: 580,
  34: 560,
  35: 550,
  36: 540,
  37: 530,
  38: 520,
  39: 510,
  40: 500,
  41: 490,
  42: 480,
  43: 470,
  44: 460,
  45: 450,
  46: 440,
  47: 430,
  48: 420,
  49: 410,
  50: 400,
  51: 390,
  52: 380,
  53: 370,
  54: 360,
  55: 350,
  56: 340,
  57: 330,
  58: 320,
  59: 310,
  60: 300,
  61: 292,
  62: 284,
  63: 276,
  64: 270,

  // Round 3 (picks 65-96)
  65: 265,
  66: 260,
  67: 255,
  68: 250,
  69: 245,
  70: 240,
  71: 235,
  72: 230,
  73: 225,
  74: 220,
  75: 215,
  76: 210,
  77: 205,
  78: 200,
  79: 195,
  80: 190,
  81: 185,
  82: 180,
  83: 175,
  84: 170,
  85: 165,
  86: 160,
  87: 155,
  88: 150,
  89: 145,
  90: 140,
  91: 136,
  92: 132,
  93: 128,
  94: 124,
  95: 120,
  96: 116,

  // Round 4 (picks 97-128)
  97: 112,
  98: 108,
  99: 104,
  100: 100,
  101: 96,
  102: 92,
  103: 88,
  104: 84,
  105: 80,
  106: 78,
  107: 76,
  108: 74,
  109: 72,
  110: 70,
  111: 68,
  112: 66,
  113: 64,
  114: 62,
  115: 60,
  116: 58,
  117: 56,
  118: 54,
  119: 52,
  120: 50,
  121: 49,
  122: 48,
  123: 47,
  124: 46,
  125: 45,
  126: 44,
  127: 43,
  128: 42,

  // Round 5 (picks 129-160)
  129: 41,
  130: 40,
  131: 39.5,
  132: 39,
  133: 38.5,
  134: 38,
  135: 37.5,
  136: 37,
  137: 36.5,
  138: 36,
  139: 35.5,
  140: 35,
  141: 34.5,
  142: 34,
  143: 33.5,
  144: 33,
  145: 32.5,
  146: 32,
  147: 31.5,
  148: 31,
  149: 30.5,
  150: 30,
  151: 29.5,
  152: 29,
  153: 28.5,
  154: 28,
  155: 27.5,
  156: 27,
  157: 26.5,
  158: 26,
  159: 25.5,
  160: 25,

  // Round 6 (picks 161-192)
  161: 24.5,
  162: 24,
  163: 23.5,
  164: 23,
  165: 22.5,
  166: 22,
  167: 21.5,
  168: 21,
  169: 20.5,
  170: 20,
  171: 19.5,
  172: 19,
  173: 18.5,
  174: 18,
  175: 17.5,
  176: 17,
  177: 16.5,
  178: 16,
  179: 15.5,
  180: 15,
  181: 14.5,
  182: 14,
  183: 13.5,
  184: 13,
  185: 12.5,
  186: 12,
  187: 11.5,
  188: 11,
  189: 10.5,
  190: 10,
  191: 9.5,
  192: 9,

  // Round 7 (picks 193-224)
  193: 8.5,
  194: 8,
  195: 7.8,
  196: 7.6,
  197: 7.4,
  198: 7.2,
  199: 7,
  200: 6.8,
  201: 6.6,
  202: 6.4,
  203: 6.2,
  204: 6,
  205: 5.8,
  206: 5.6,
  207: 5.4,
  208: 5.2,
  209: 5,
  210: 4.8,
  211: 4.6,
  212: 4.4,
  213: 4.2,
  214: 4,
  215: 3.8,
  216: 3.6,
  217: 3.4,
  218: 3.2,
  219: 3,
  220: 2.8,
  221: 2.6,
  222: 2.4,
  223: 2.2,
  224: 2,
};

// ─────────────────────────────────────────────────────────────────────────────
// Future Pick Multipliers
// Future picks are worth less due to uncertainty
// ─────────────────────────────────────────────────────────────────────────────

const FUTURE_PICK_MULTIPLIERS: Record<number, number> = {
  1: 0.85, // Next year picks worth 85%
  2: 0.70, // Two years away worth 70%
  3: 0.55, // Three years away worth 55%
};

// Average pick value by round for future picks
const ROUND_AVERAGE_VALUES: Record<number, number> = {
  1: 1000, // Average of all round 1 picks
  2: 420, // Average of all round 2 picks
  3: 190, // Average of all round 3 picks
  4: 70, // Average of all round 4 picks
  5: 32, // Average of all round 5 picks
  6: 15, // Average of all round 6 picks
  7: 5, // Average of all round 7 picks
};

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the trade value of a specific pick
 */
export function getPickValue(overallPick: number): number {
  // Handle picks beyond 224 (compensatory)
  if (overallPick > 224) {
    return Math.max(1, 2 - (overallPick - 224) * 0.1);
  }

  return PICK_VALUES[overallPick] ?? 1;
}

/**
 * Get the value of a future pick
 */
export function getFuturePickValue(round: number, yearsAway: number): number {
  const baseValue = ROUND_AVERAGE_VALUES[round] ?? 5;
  const multiplier = FUTURE_PICK_MULTIPLIERS[yearsAway] ?? 0.5;
  return baseValue * multiplier;
}

/**
 * Calculate total value of multiple picks
 */
export function calculatePackageValue(
  picks: number[],
  futurePicks?: FuturePickValue[]
): number {
  let total = picks.reduce((sum, pick) => sum + getPickValue(pick), 0);

  if (futurePicks) {
    total += futurePicks.reduce(
      (sum, fp) => sum + getFuturePickValue(fp.round, fp.yearsAway),
      0
    );
  }

  return total;
}

/**
 * Evaluate a trade offer
 */
export function evaluateTrade(offer: TradeOffer): TradeValueResult {
  const offeredValue = calculatePackageValue(
    offer.offeredPicks,
    offer.futurePicksOffered
  );
  const requestedValue = calculatePackageValue(
    offer.requestedPicks,
    offer.futurePicksRequested
  );

  const difference = offeredValue - requestedValue;
  const percentageDiff =
    requestedValue > 0 ? (difference / requestedValue) * 100 : 0;
  const isFair = Math.abs(percentageDiff) <= 10;

  let recommendation: 'accept' | 'decline' | 'counter';
  if (percentageDiff >= 5) {
    recommendation = 'accept';
  } else if (percentageDiff >= -10) {
    recommendation = 'counter';
  } else {
    recommendation = 'decline';
  }

  return {
    pick1Value: offeredValue,
    pick2Value: requestedValue,
    difference,
    percentageDiff,
    isFair,
    recommendation,
  };
}

/**
 * Find picks needed to move up to a target pick
 * Returns suggested picks to offer from available picks
 */
export function suggestTradeUp(
  targetPick: number,
  availablePicks: number[]
): { picks: number[]; value: number; targetValue: number } | null {
  const targetValue = getPickValue(targetPick);

  // Sort available picks by value (descending)
  const sortedPicks = [...availablePicks].sort(
    (a, b) => getPickValue(b) - getPickValue(a)
  );

  // Greedy algorithm to find picks that add up to target value
  const selectedPicks: number[] = [];
  let currentValue = 0;

  for (const pick of sortedPicks) {
    // Skip the target pick if we own it
    if (pick === targetPick) continue;

    // Skip picks higher than target (can't trade up using better picks)
    if (pick < targetPick) continue;

    const pickValue = getPickValue(pick);

    // Add pick if it helps reach target without massively overpaying
    if (currentValue < targetValue) {
      selectedPicks.push(pick);
      currentValue += pickValue;

      // Stop if we've reached or exceeded target by reasonable amount
      if (currentValue >= targetValue * 0.95) break;
    }
  }

  // Check if we found a viable package
  if (currentValue < targetValue * 0.9) {
    return null; // Can't reach target value
  }

  return {
    picks: selectedPicks,
    value: currentValue,
    targetValue,
  };
}

/**
 * Find what you can get for trading down from a pick
 */
export function suggestTradeDown(
  currentPick: number,
  tradingPartnerPicks: number[]
): { receive: number[]; value: number; currentValue: number } | null {
  const currentValue = getPickValue(currentPick);

  // Find partner's picks that are lower (higher number)
  const lowerPicks = tradingPartnerPicks
    .filter((p) => p > currentPick)
    .sort((a, b) => a - b);

  if (lowerPicks.length === 0) return null;

  // Find combination of picks that approximates current value
  const receivePicks: number[] = [];
  let receiveValue = 0;

  for (const pick of lowerPicks) {
    receivePicks.push(pick);
    receiveValue += getPickValue(pick);

    // Target 110-125% value to make trade worthwhile
    if (receiveValue >= currentValue * 1.1) break;
  }

  // Only suggest if we're getting decent value
  if (receiveValue < currentValue * 0.9) {
    return null;
  }

  return {
    receive: receivePicks,
    value: receiveValue,
    currentValue,
  };
}

/**
 * Get the equivalent pick for a value
 * (Find closest single pick to a given value)
 */
export function getEquivalentPick(value: number): number {
  let closestPick = 224;
  let closestDiff = Infinity;

  for (let pick = 1; pick <= 224; pick++) {
    const pickValue = getPickValue(pick);
    const diff = Math.abs(pickValue - value);

    if (diff < closestDiff) {
      closestDiff = diff;
      closestPick = pick;
    }
  }

  return closestPick;
}

/**
 * Format pick value as display string
 */
export function formatPickValue(overallPick: number): string {
  const value = getPickValue(overallPick);
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(0);
}

/**
 * Get pick position within round
 */
export function getPickDetails(overallPick: number): {
  round: number;
  pick: number;
  value: number;
} {
  const round = Math.ceil(overallPick / 32);
  const pick = ((overallPick - 1) % 32) + 1;
  const value = getPickValue(overallPick);

  return { round, pick, value };
}

/**
 * Compare two trade packages for display
 */
export function formatTradeComparison(offer: TradeOffer): string {
  const result = evaluateTrade(offer);

  const offeredStr = offer.offeredPicks.map((p) => `#${p}`).join(', ');
  const requestedStr = offer.requestedPicks.map((p) => `#${p}`).join(', ');

  return `Offering: ${offeredStr} (${result.pick1Value.toFixed(0)} pts)\n` +
    `For: ${requestedStr} (${result.pick2Value.toFixed(0)} pts)\n` +
    `Difference: ${result.difference > 0 ? '+' : ''}${result.difference.toFixed(0)} pts (${result.percentageDiff.toFixed(1)}%)\n` +
    `Recommendation: ${result.recommendation.toUpperCase()}`;
}
