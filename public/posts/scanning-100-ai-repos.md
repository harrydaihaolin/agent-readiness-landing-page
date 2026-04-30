In the [previous post](/blog/introducing-agent-readiness) we shipped `agent-readiness`: a CLI that scores how ready a repository is for autonomous coding agents, anchored on the DevEx research framework. The natural next question — the one our co-author and three of you on the internal Slack asked within an hour — was the obvious one.

So how does the AI ecosystem itself measure up?

We pointed the scanner at **141 of the most-watched AI infrastructure repositories** on GitHub: agent frameworks, vector databases, inference servers, MCP tooling, RAG libraries, evaluation harnesses, the lot. We re-ran the scan every day for a week. We collated the results.

The headline: **1,127 WARN/ERROR findings across the 141 repos, on 19 distinct check IDs.** Every repo we scanned tripped at least one. The very tools building our agentic future are, on average, surprisingly hostile to agents.

Here's what we found.

> Snapshot date: 2026-04-29. The full daily-updated leaderboard lives at [harrydaihaolin.github.io/agent-readiness-leaderboard](https://harrydaihaolin.github.io/agent-readiness-leaderboard/). The numbers below come from that day's `findings.md`.

## The big three

### 1. The context-window killer: `repo_shape.large_files`

`repo_shape.large_files` fires whenever a single file is over 500 lines or 50 KB. It hit **134 of 141 repos (95%)** and accounted for **57% of all findings** — 639 individual flagged files.

A non-random sample of who tripped it: `microsoft/TaskWeaver` (`taskweaver/chat/console/chat.py`), `1Panel-dev/1Panel`, `2noise/ChatTTS`, `BloopAI/vibe-kanban`, `ChromeDevTools/chrome-devtools-mcp`, `Cinnamon/kotaemon`, `CopilotKit/CopilotKit`, `FlowiseAI/Flowise`, `FoundationAgents/MetaGPT`, `HKUDS/LightRAG`, `Significant-Gravitas/AutoGPT`. These are not weekend projects. These are flagship repos with thousands of stars.

Why this matters for agents: a Claude or Cursor session looking at one of these files is forced to either pull the whole thing into its context (eating budget that could have been spent on reasoning) or chunk it (and miss the cross-file invariants that make the change correct in the first place). Human reviewers have the same problem — but humans use IDE features, fold definitions, search-jump. An agent with a thousand-line file and a fixed context window is just stuck.

We'll come back to this one in the limitations section, because the check has known false positives. But even after the conservative discount, the underlying pattern is real and depressing.

### 2. The missing map: `agent_docs.present`

`agent_docs.present` looks for any of the canonical agent-targeted docs: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, or anything under `.cursor/rules/`. It fires when none of them exist.

It fired on **78 of 141 repos (55%)**.

Concretely: more than half of the most-watched AI infrastructure repos have **no document anywhere telling an agent how to work in them**. No house style. No "always run `make test` before committing." No "this monorepo's Python and TypeScript packages are versioned independently." Nothing.

This is the lowest-effort, highest-leverage finding in the whole report. A 60-line `AGENTS.md` would move the needle for almost half the ecosystem. The fact that it hasn't tells us how recent the agentic-coding pressure is — most of these repos were architected when "AI coding" meant Copilot tab completion, not a full agentic loop reading and writing code.

If you maintain one of these projects, this is the change to make this week. The fix takes longer to write the title for than to write.

### 3. The black box: `entry_points.detected`

`entry_points.detected` looks for an obvious way to run the project: `main.py`, `index.{js,ts}`, a `cmd/` or `bin/` directory, `__main__.py`, a `[project.scripts]` block in `pyproject.toml`, a `bin` field in `package.json`. If none of those exist, it fires.

It fired on **68 of 141 repos (48%)**.

A lot of these are libraries — and libraries don't strictly need an entry point. But here's the thing: an agent that lands on a library repo has no way to validate its change other than to write a test, and a lot of those library repos also fail `test_command.discoverable` (which fires on 50 of 141 repos, 35%). Without an entry point _or_ a discoverable test command, the agent has nothing to converge against. It's writing code into a void and hoping.

The DevEx framing is exact: this is feedback loops at zero. You can't have a fast, clear signal if there's no place to push the button.

## The surprises

### Secrets in repos that should know better

`secrets.basic_scan` is a deliberately-conservative regex sweep — AWS access keys, GitHub PATs, Google API keys, private key PEMs. We expect it to be quiet on serious projects.

It fired on **19 repos**. The list is uncomfortable: `agno-agi/agno`, `crewAIInc/crewAI`, `github/awesome-copilot`, **`gitleaks/gitleaks`**, `huginn/huginn`, `mindsdb/mindsdb`, `novuhq/novu`, `onyx-dot-app/onyx`, `pingcap/tidb`, `promptfoo/promptfoo`, `simstudioai/sim`, `skypilot-org/skypilot`, and others.

A note on `gitleaks` specifically, because it's the punchline: it's a secret-scanning tool whose own test fixtures intentionally contain tripwire strings to validate the detectors. Our check is right to fire (the bytes are real) and also wrong (it's the well-known fixture pattern). That tension — the tension between "true positive" and "actionable finding" — is exactly what we want the project to surface and learn from. Which is the next section.

### The Pareto distribution of friction

Three checks (`repo_shape.large_files`, `agent_docs.present`, `entry_points.detected`) account for **70% of all findings**. The other 16 checks share the remaining 30%.

That has a hopeful implication: the path from "median repo" to "actually agent-ready" is short. Add agent docs. Split the megafiles. Expose an entry point. You've moved the needle on roughly seven hundred findings across the ecosystem.

## Honest limitations

A piece like this is only worth writing if it leads with the criticism. There are two known issues with the data above, and we're already fixing both.

**`repo_shape.large_files` is noisy.** Manual judge analysis on a sample of the findings estimates a **~70% false-positive rate**. The check happily flags `uv.lock`, `package-lock.json`, `Cargo.lock`, generated `docs.json`, sitemaps, changelogs, and binary assets — none of which are "large source files" in any meaningful sense. The fix is in flight: a filename and extension exclusion list before the check fires. After that, the 95% repo-coverage number will come down — but the underlying pattern (real source files exceeding the context window) will still be visible, just at honest scale.

**`git.has_history` is a scanner bug, not a check bug.** All 15 of its firings are caused by a `--depth 1` shallow clone in the leaderboard scanner. Git only sees one commit, the check correctly notes that's a problem, and we've been calling that an issue with the project rather than with the leaderboard's clone strategy. The fix lives in `agent-readiness-leaderboard/scripts/scan.py`, and the check itself stays as written.

We could have hidden these and shipped a cleaner-looking post. But the project's whole pitch is that the rules are open, the false positives are tracked publicly, and the leaderboard improves over time as a closed loop. The tracked backlog of these fixes lives in [`research/ideas.md`](https://github.com/harrydaihaolin/agent-readiness-research/blob/main/research/ideas.md) — open in the spirit of the work, even when it makes us look slightly silly.

## What this means for maintainers

If you maintain one of these repos, here's the highest-leverage triage:

1. **Add an `AGENTS.md`.** Even sixty lines — house style, where tests live, how to run them, what's in scope and what isn't — moves the needle. This is the single most common gap we found.
2. **Make sure `make test` (or the equivalent) works headlessly.** No interactive prompts, no required dashboard logins. If your agent can't run your tests, your agent can't ship anything.
3. **Audit the largest five files in your repo.** Chances are at least one is a god-file that should be split. Splitting it is good for human reviewers anyway.

These three changes alone would move most of the leaderboard meaningfully.

## What this means for the rest of us

The agentic coding wave is hitting a codebase ecosystem that wasn't built for it. The DevEx paper's argument from the [previous post](/blog/introducing-agent-readiness) — that small, measurable improvements compound — applies here at planetary scale. There are 78 repos one PR away from no longer being invisible to agents. There are 134 repos with at least one file that an agent literally cannot fit in its head.

The good news is the path forward is boring: documentation, file size, entry points. The unboring news is that the median project is on the wrong side of all three, and the most-watched ones are not exempt.

The full leaderboard updates daily and welcomes scrutiny:

- **Live leaderboard:** <https://harrydaihaolin.github.io/agent-readiness-leaderboard/>
- **Scanner CLI:** <https://github.com/harrydaihaolin/agent-readiness>
- **Open rules pack:** <https://github.com/harrydaihaolin/agent-readiness-rules> — PRs welcome.

We'll re-run this analysis in three months. Move your repo before then.

---

**Methodology**

- Scanner: `agent-readiness scan --json` against shallow clones of each target repo.
- Corpus: ~95 hand-curated AI/agent infrastructure repos plus a daily-rotating discovery pool of up to 100 additional repos surfaced by GitHub Search (topics: `agents`, `llm`, `mcp`, `rag`; star range 500–80,000). Total scanned 141 distinct repos for this snapshot.
- Aggregation: `judge.py` merges curated and experiment-pool findings into `findings_raw.json`, then renders [`findings.md`](https://github.com/harrydaihaolin/agent-readiness-research/blob/main/research/findings.md).
- All numbers in this post come from the 2026-04-29 snapshot. The live leaderboard updates daily; numbers may have moved by the time you read this.
- Snapshot generation: 2026-04-29T18:51:12+00:00.
