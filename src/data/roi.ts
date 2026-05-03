// ROI calculator constants and the pure-function model used by both the
// page and its tests. Keep this file dependency-free so the model can
// be tested in isolation.

export const ROI_DEFAULTS = {
  seats: 25,
  currentScore: 60,
  targetScore: 90,
  perSeatAnnual: 19 * 12,
  recoveryFactor: 0.65,
} as const;

export interface RoiInputs {
  seats: number;
  currentScore: number;
  targetScore: number;
  perSeatAnnual?: number;
  recoveryFactor?: number;
}

export interface RoiResult {
  seats: number;
  currentScore: number;
  targetScore: number;
  scoreGap: number;
  perSeatAnnual: number;
  spendAtRisk: number;
  estimatedRecovery: number;
  monthlyRecovery: number;
}

// Naive but explainable model used until we publish the real
// regression. Two-line pitch:
//
//   spend_at_risk     = seats * per_seat_annual * (1 - currentScore/100)
//   estimated_recovery = (targetScore - currentScore) / 100
//                        * recoveryFactor
//                        * spend_at_risk_at_zero
//
// where `spend_at_risk_at_zero` is the spend that would be wasted if
// the repo scored 0. The recoveryFactor (default 0.65) discounts the
// model's claim because not every readiness gain converts 1:1 to
// developer-time savings — a number we'll tighten when the SWE-bench
// experiment lands.
export function computeRoi(inputs: RoiInputs): RoiResult {
  const seats = Math.max(0, Math.floor(inputs.seats));
  const currentScore = clamp(inputs.currentScore, 0, 100);
  const targetScore = clamp(inputs.targetScore, 0, 100);
  const perSeatAnnual = inputs.perSeatAnnual ?? ROI_DEFAULTS.perSeatAnnual;
  const recoveryFactor = inputs.recoveryFactor ?? ROI_DEFAULTS.recoveryFactor;

  const totalAnnual = seats * perSeatAnnual;
  const scoreGap = Math.max(0, targetScore - currentScore);
  const spendAtRisk = totalAnnual * (1 - currentScore / 100);
  const estimatedRecovery =
    (scoreGap / 100) * recoveryFactor * totalAnnual;

  return {
    seats,
    currentScore,
    targetScore,
    scoreGap,
    perSeatAnnual,
    spendAtRisk,
    estimatedRecovery,
    monthlyRecovery: estimatedRecovery / 12,
  };
}

export function formatUsd(amount: number): string {
  if (!Number.isFinite(amount)) return '$0';
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}
