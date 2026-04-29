import { describe, expect, it } from 'vitest';
import { tiers } from './tiers';

describe('tiers data', () => {
  it('exposes the four canonical tiers in order', () => {
    expect(tiers.map((t) => t.id)).toEqual(['bronze', 'silver', 'team', 'enterprise']);
  });

  it('has exactly one highlight tier', () => {
    expect(tiers.filter((t) => t.highlight)).toHaveLength(1);
  });

  it('every tier has at least one feature and a CTA href', () => {
    for (const t of tiers) {
      expect(t.features.length).toBeGreaterThan(0);
      expect(t.ctaHref.length).toBeGreaterThan(0);
    }
  });
});
