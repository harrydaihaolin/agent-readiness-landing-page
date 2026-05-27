export default function DashboardMode() {
  return (
    <section id="dashboard-mode" className="container-narrow py-20">
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <span className="pill mb-3">New in v3.4.x</span>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Multi-repo workspaces get a live dashboard.
          </h2>
          <p className="mt-4 text-white/70">
            Scoring a single repo takes seconds — but scoring a workspace of
            10, 30, or 100 sibling repos used to mean staring at a spinner in
            chat for minutes. The skill now auto-launches a browser dashboard
            that streams every repo's progress over SSE, and lets the user
            answer the scanner's interactive prompts inline.
          </p>
          <ul className="mt-6 space-y-3 text-white/75">
            <li className="flex gap-3">
              <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-soft/80" />
              <span>
                <b>Per-repo grid loads progressively.</b> Each card lights up
                as that repo enqueues, starts, ticks through evaluators, and
                lands its score.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-soft/80" />
              <span>
                <b>Prompts queue, not a chat interrupt.</b> Six prompt types
                (classify, members, umbrella, top-action, ratify, clarify)
                land as cards in the browser instead of blocking the
                conversation.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-soft/80" />
              <span>
                <b>Exit anytime.</b> Click the <i>Exit dashboard</i> button or
                type <code className="rounded bg-ink-800/80 px-1.5 py-0.5 text-[0.95em]">/agent-readiness exit-dashboard</code>{' '}
                in chat. The scan keeps running; the surface changes.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent-soft/80" />
              <span>
                <b>Same scoring engine.</b> Chat mode and dashboard mode share
                the wheel — the dashboard is the surface, not a different
                product.
              </span>
            </li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href="https://github.com/harrydaihaolin/agent-readiness-skill#use-it"
            >
              Try the skill
            </a>
            <a
              className="btn-ghost"
              href="https://github.com/harrydaihaolin/agent-readiness-analytics-dashboard"
            >
              Dashboard repo
            </a>
          </div>
        </div>
        <div>
          <pre className="overflow-x-auto rounded-xl border border-ink-700 bg-ink-800/80 p-5 font-mono text-[13px] leading-6 text-white/90 shadow-2xl">
{`$ agent-readiness scan-and-view . --children .
[live] http://localhost:8765/live/scan_2026_05_26_01

  ┌──────────────────────────────────────────┐
  │  agent-readiness          ░░░░░ queued   │
  │  agent-readiness-mcp      ▓▓▓░░ running  │
  │  agent-readiness-rules    ▓▓▓▓▓  82 / 100│
  │  agent-readiness-skill    ▓▓▓▓▓  91 / 100│
  │  …                                       │
  └──────────────────────────────────────────┘

  Prompts (1)
    ▸ Ratify proposed Repo: payments-svc?    [yes][no][skip]
`}
          </pre>
          <p className="mt-3 text-xs text-white/50">
            The skill talks to the dashboard over SSE + a small JSON API;
            <code className="mx-1 rounded bg-ink-800/80 px-1.5 py-0.5">get_scan_status</code>
            on the MCP side carries{' '}
            <code className="rounded bg-ink-800/80 px-1.5 py-0.5">sse_url</code>,{' '}
            <code className="rounded bg-ink-800/80 px-1.5 py-0.5">prompts_pending_count</code>, and{' '}
            <code className="rounded bg-ink-800/80 px-1.5 py-0.5">mode_exit_requested</code>{' '}
            so chat-side stays hands-off.
          </p>
        </div>
      </div>
    </section>
  );
}
