import { describe, expect, it } from 'vitest';
import { computeRoi, formatUsd, ROI_DEFAULTS } from './roi';

describe('computeRoi', () => {
  it('returns zero recovery when target equals current score', () => {
    const r = computeRoi({ seats: 25, currentScore: 70, targetScore: 70 });
    expect(r.estimatedRecovery).toBe(0);
    expect(r.scoreGap).toBe(0);
  });

  it('returns positive recovery when target exceeds current', () => {
    const r = computeRoi({ seats: 25, currentScore: 60, targetScore: 90 });
    expect(r.estimatedRecovery).toBeGreaterThan(0);
    expect(r.scoreGap).toBe(30);
  });

  it('clamps current and target into [0, 100]', () => {
    const r = computeRoi({ seats: 25, currentScore: -10, targetScore: 200 });
    expect(r.currentScore).toBe(0);
    expect(r.targetScore).toBe(100);
  });

  it('floors seats at zero', () => {
    const r = computeRoi({ seats: -3, currentScore: 50, targetScore: 80 });
    expect(r.seats).toBe(0);
    expect(r.estimatedRecovery).toBe(0);
  });

  it('uses default per-seat annual rate when not provided', () => {
    const r = computeRoi({ seats: 1, currentScore: 0, targetScore: 100 });
    expect(r.perSeatAnnual).toBe(ROI_DEFAULTS.perSeatAnnual);
    expect(r.spendAtRisk).toBe(ROI_DEFAULTS.perSeatAnnual);
  });

  it('matches a hand-computed value on the default scenario', () => {
    const seats = 25;
    const annual = ROI_DEFAULTS.perSeatAnnual;
    const r = computeRoi({ seats, currentScore: 60, targetScore: 90 });
    const expectedRecovery = 0.3 * ROI_DEFAULTS.recoveryFactor * seats * annual;
    expect(r.estimatedRecovery).toBeCloseTo(expectedRecovery, 5);
  });

  it('reports a monthly figure that is annual / 12', () => {
    const r = computeRoi({ seats: 50, currentScore: 50, targetScore: 80 });
    expect(r.monthlyRecovery).toBeCloseTo(r.estimatedRecovery / 12, 5);
  });
});

describe('formatUsd', () => {
  it('renders whole-dollar USD strings', () => {
    expect(formatUsd(1234)).toBe('$1,234');
    expect(formatUsd(0)).toBe('$0');
  });

  it('handles non-finite input gracefully', () => {
    expect(formatUsd(Number.NaN)).toBe('$0');
    expect(formatUsd(Number.POSITIVE_INFINITY)).toBe('$0');
  });
});
