import type { Tier } from '../data/tiers';

interface Props {
  tier: Tier;
}

export default function PricingCard({ tier }: Props) {
  const ctaClass =
    tier.ctaKind === 'primary'
      ? 'btn-primary w-full'
      : tier.ctaKind === 'email'
        ? 'btn-ghost w-full border-accent/40 text-accent-soft hover:bg-accent/10'
        : 'btn-ghost w-full';

  return (
    <article
      className={`card flex h-full flex-col ${
        tier.highlight ? 'border-accent/50 ring-1 ring-accent/40 shadow-[0_0_60px_-20px_rgba(167,139,250,0.55)]' : ''
      }`}
    >
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
          {tier.badge && <span className="pill">{tier.badge}</span>}
        </div>
        <p className="mt-1 text-sm text-white/65">{tier.tagline}</p>
        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">{tier.price}</span>
          {tier.priceCadence && (
            <span className="text-sm text-white/50">{tier.priceCadence}</span>
          )}
        </div>
      </header>

      <ul className="mb-6 flex-1 space-y-3 text-sm text-white/80">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a className={ctaClass} href={tier.ctaHref}>
        {tier.ctaLabel}
      </a>
    </article>
  );
}
