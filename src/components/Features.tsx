import { features } from '../data/features';

const PILLAR_BADGES: Record<string, string> = {
  cognitive_load: 'CL',
  feedback: 'FB',
  flow: 'FL',
  safety: 'SF',
  coordination: 'CO',
  inference: 'IN',
};

export default function Features() {
  return (
    <section id="features" className="container-narrow py-20">
      <div className="mb-10 max-w-2xl">
        <span className="pill mb-3">Six dimensions</span>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          What gets measured.
        </h2>
        <p className="mt-3 text-white/70">
          Four base pillars roll up to a single score per repo. Multi-repo
          workspaces add a <b>Coordination</b> pillar; declared ontologies
          add an <b>Inference</b> namespace that derives violations from
          your atoms and relationships.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((f) => (
          <article key={f.pillar} className="card">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 font-mono text-xs text-accent-soft">
                {PILLAR_BADGES[f.pillar]}
              </span>
              <h3 className="text-lg font-semibold">{f.title}</h3>
            </div>
            <p className="text-white/75">{f.body}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {f.examples.map((ex) => (
                <li key={ex} className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-soft/80" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
