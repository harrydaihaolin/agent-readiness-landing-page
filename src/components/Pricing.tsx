import { tiers } from '../data/tiers';
import PricingCard from './PricingCard';

export default function Pricing() {
  return (
    <section id="pricing" className="container-narrow py-20">
      <div className="mb-10 max-w-2xl">
        <span className="pill mb-3">Pricing</span>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Free forever for the OSS scanner. Pay for the engine.
        </h2>
        <p className="mt-3 text-white/70">
          Bronze stays MIT-licensed and works without an account. Silver+
          unlocks the closed insights engine, advanced match types, and MCP
          integrations.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>
    </section>
  );
}
