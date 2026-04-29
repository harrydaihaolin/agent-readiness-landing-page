export default function OpenSourceCallout() {
  return (
    <section className="container-narrow py-12">
      <div className="card flex flex-col items-start justify-between gap-6 border-accent/30 bg-gradient-to-br from-ink-800 to-ink-700/60 md:flex-row md:items-center">
        <div>
          <span className="pill mb-3">Open source</span>
          <h3 className="text-2xl font-semibold tracking-tight">
            Rules are open. Contribute one in an afternoon.
          </h3>
          <p className="mt-2 max-w-2xl text-white/70">
            The full rules pack lives at{' '}
            <a className="underline decoration-accent/60 hover:decoration-accent" href="https://github.com/harrydaihaolin/agent-readiness-rules">
              agent-readiness-rules
            </a>
            . Each rule is one YAML file. Add a check, open a PR, ship it to
            every Bronze user on the next release.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="btn-primary" href="https://github.com/harrydaihaolin/agent-readiness-rules/blob/main/CONTRIBUTING.md">
            Contributing guide
          </a>
          <a className="btn-ghost" href="https://github.com/harrydaihaolin/agent-readiness-rules">
            Browse rules
          </a>
        </div>
      </div>
    </section>
  );
}
