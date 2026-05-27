export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="container-narrow pt-20 pb-16 text-center md:pt-28 md:pb-24">
        <span className="pill mb-6">
          v3.4.1 — live dashboard for multi-repo workspaces + ontology inference
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Score how AI-agent-ready your repo really is.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-white/70">
          Ask your coding agent to score the repo and apply the top fix — or
          run the same scoring engine from the CLI in CI. Cognitive load,
          feedback loops, flow, safety, and (for multi-repo workspaces)
          coordination, with paste-ready fix prompts on every finding.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            className="btn-primary"
            href="https://github.com/harrydaihaolin/agent-readiness-skill#install"
          >
            Install the skill
          </a>
          <a
            className="btn-ghost"
            href="https://github.com/harrydaihaolin/agent-readiness#install--as-a-cli"
          >
            Or install the CLI
          </a>
          <a
            className="btn-ghost"
            href="https://harrydaihaolin.github.io/agent-readiness-leaderboard/"
            target="_blank"
            rel="noreferrer"
          >
            Leaderboard
          </a>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-white/50">
              Skill — in Claude Code
            </p>
            <pre className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-800/80 p-4 font-mono text-[13px] leading-6 text-white/90 shadow-2xl">
{`/plugin marketplace add \\
  harrydaihaolin/agent-readiness-skill
/plugin install \\
  agent-readiness@agent-readiness-skill

> score this workspace
… opens the live dashboard`}
            </pre>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-white/50">
              CLI — for shell or CI
            </p>
            <pre className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-800/80 p-4 font-mono text-[13px] leading-6 text-white/90 shadow-2xl">
{`$ pip install agent-readiness
$ agent-readiness scan . --fail-below 70
[CL] 92  [FB] 64  [FL] 81  [SF] 100
overall: 84  (PASS — threshold 70)`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
