import { stats } from '../data/stats';

export default function Stats() {
  return (
    <section className="border-y border-ink-700/60 bg-ink-800/40">
      <div className="container-narrow grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="stat text-accent-soft">{s.value}</div>
            <div className="mt-1 text-sm font-medium text-white">{s.label}</div>
            {s.detail && <div className="text-xs text-white/50">{s.detail}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
