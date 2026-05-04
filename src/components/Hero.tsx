export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="container-narrow pt-20 pb-16 text-center md:pt-28 md:pb-24">
        <span className="pill mb-6">v1.1.0 — rules pack now built in</span>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Score how AI-agent-ready your repo really is.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-white/70">
          Agent-readiness measures cognitive load, feedback loops, flow, and
          safety — the four properties that decide whether an autonomous coding
          agent ships your work or thrashes for an hour.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            className="btn-primary"
            href="https://github.com/harrydaihaolin/agent-readiness#install"
          >
            Install the CLI
          </a>
          <a
            className="btn-ghost"
            href="https://harrydaihaolin.github.io/agent-readiness-leaderboard/"
            target="_blank"
            rel="noreferrer"
          >
            View the leaderboard
          </a>
        </div>

        <pre className="mx-auto mt-12 max-w-2xl overflow-x-auto rounded-xl border border-ink-700 bg-ink-800/80 p-5 text-left font-mono text-sm leading-6 text-white/90 shadow-2xl">
{`$ pip install agent-readiness
$ agent-readiness scan . --fail-below 70
[cognitive_load] 92  [feedback] 64  [flow] 81  [safety] 100
overall: 84  (PASS — threshold 70)`}
        </pre>
      </div>
    </section>
  );
}
