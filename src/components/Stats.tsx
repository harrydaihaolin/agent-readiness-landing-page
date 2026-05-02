import { stats } from '../data/stats';

export default function Stats() {
  return (
    <section className="border-y border-ink-700/60 bg-ink-800/40">
      <div className="container-narrow grid grid-cols-2 gap-6 py-10 md:grid-cols-5">
        {stats.map((s) => {
          const inner = (
            <>
              <div className="stat text-accent-soft">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-white">{s.label}</div>
              {s.detail && <div className="text-xs text-white/50">{s.detail}</div>}
            </>
          );
          return s.href ? (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center md:text-left transition hover:opacity-90"
            >
              {inner}
            </a>
          ) : (
            <div key={s.label} className="text-center md:text-left">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
