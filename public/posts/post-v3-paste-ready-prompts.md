# What shipped since the 1000-repo article: paste-ready prompts and an agent-led voice

> The v3 article (May 2, 2026) showed that 77.7% of popular AI repos still
> ship without a canonical `AGENTS.md`. It scored repos with `agent-readiness`
> **1.4.0** and rules pack **1.4.0**. The three weeks since have closed the
> gap between *describing friction* and *handing the agent a paste-ready
> fix*. This post is a tour of the wheels and rule packs that shipped in
> that window — `agent-readiness` **2.4.0 → 2.4.2** and rules pack
> **v2.0.2 → v2.3.0** — and what each one changes for the agent at the
> keyboard.

## TL;DR

Five concrete changes, in dependency order:

1. **Every WARN/ERROR finding now carries a `fix_prompt` block** — one
   paragraph of agent-led prose plus a `verify` command. Drops the
   "what now?" mode after a scan. (rules pack **v2.1.0**, all 38 rules.)
2. **The scanner stopped being Python/JavaScript-first.** Language
   tables now resolve `{language_test_command}` and
   `{package_manager}` on ~20 languages and 27 manifest types; CI
   detection covers 50+ providers, not just GitHub Actions / GitLab /
   CircleCI. (engine **2.4.1**, rules pack **v2.2.0**.)
3. **`explanation` and `fix_prompt` now share an agent-led voice.**
   23 of 38 rules had their `explanation` lede rewritten so the first
   sentence answers *what does the agent lose if this is ignored?*
   instead of describing the abstract code-quality state. (rules pack
   **v2.3.0**.)
4. **The scanner can apply its top recommendation.** A new
   `apply_action` executor plus `--apply-top-action --verify` flags
   let CI close the loop: pick the highest-priority finding, write the
   fix, run the rule's own `verify` command, exit non-zero if it
   regressed. (engine **2.4.0**.)
5. **MCP exposes the prompts directly to the agent harness.** A new
   `list_friction(path)` tool returns every WARN/ERROR plus its
   rendered `fix_prompt`, sorted by `score_impact`. Drops findings
   without a prompt — the contract is *paste-ready only*. (engine
   **2.4.x** + `agent-readiness-mcp`.)

## 1. `fix_prompt` on every rule

Before v2.1.0, the rules pack carried two kinds of fields: a structured
`action` (deterministic, machine-readable) and a freeform `fix_hint`
(human-readable, sometimes empty). An agent reading a scan would get a
JSON action like

```json
{
  "kind": "create_file",
  "path": "AGENTS.md",
  "content": "..."
}
```

…and a one-liner of prose. That's usable but not very paste-ready —
the agent still has to compose the prompt it would feed itself.

**v2.1.0** rewrote that contract. Every one of the 38 rules now ships
a `fix_prompt` block: one paragraph of agent-targeted prose, written
as a single instruction the harness can paste into the next turn,
ending in a `verify` shell command the agent can run to confirm the
fix landed. An example from `headless.unrunnable_e2e` on a bare
README-only repo:

```
1. headless.unrunnable_e2e — repo is unrunnable end-to-end by an agent.
   (+90.0 pts)
   prompt> Without this, an agent landing in the repo cannot read
   agent-targeted docs, cannot find an entry point, and cannot discover a
   test command — it is functionally agent-blind. Fix the cheapest of
   the three first: create AGENTS.md at the repo root naming a canonical
   entry point and a canonical test command...
   verify> test -f AGENTS.md && make -n test && grep -E ...
```

Pipe `agent-readiness scan . --json` and the prompt comes back in the
finding payload; no extra renderer needed.

## 2. Language coverage stopped being a footnote

The v3 article called out that the scanner's friction text resolved
fluently on Python and JavaScript and degraded to a generic phrasing
on anything else. **v2.4.1** + rules pack **v2.2.0** closed that gap:

- `_LANGUAGE_BY_MANIFEST` grew from 16 to 27 manifest entries — Pipfile,
  `build.sbt` (Scala), `pubspec.yaml` (Dart), `stack.yaml` +
  `cabal.project` (Haskell), `deps.edn` (Clojure), `rebar.config`
  (Erlang), `dune-project` (OCaml), `Project.toml` (Julia),
  `DESCRIPTION` (R), `CMakeLists.txt` (C++), `Makefile.PL` + `cpanfile`
  (Perl) all detect now.
- `_LANGUAGE_TEST_COMMAND` / `_LINT` / `_INSTALL` tables expanded to
  cover ~20 languages (previously 10/7/7). PHP, Scala, Dart, Haskell,
  Clojure, Erlang, OCaml, Julia, R, C++, Perl, Kotlin, Swift now all
  render a real command in the prompt.
- `_LOCKFILE_PACKAGE_MANAGER` grew from 12 to 22 entries: pdm,
  conda-lock, pixi, `mix.lock` (Elixir), `pubspec.lock` (Dart),
  `Package.resolved` (Swift), `stack.yaml.lock` (Haskell),
  `cabal.project.freeze`, `flake.lock` (Nix), `npm-shrinkwrap.json`.
- On the rule-pack side, `ci.configured` detection grew from 19 to
  **50+ provider config paths** — AWS CodeBuild, Codemagic, Wercker,
  Screwdriver, Concourse, Argo Workflows, Harness, Tekton, Skaffold,
  Garden, plus Forgejo / Gitea workflow paths.

The visible effect: a fix_prompt that used to read

> "For Python: run `pytest`. For JS/TS: run `npm test`. For your
> project's primary language project, run the equivalent test
> invocation."

now reads, when the probe resolves cleanly,

> "For your Elixir project: run `mix test`. Then commit the lockfile
> with `git add mix.lock`."

…and when no manifest is detected, falls back to a single sentence
that says `your project's primary language` instead of leaving the
slot blank or rendering the literal placeholder. Empty-string
fallbacks now route through a `_PromptDefaultingDict` rather than
interpolating an empty string mid-sentence.

## 3. The agent-led voice, applied to `explanation` too

This is the one the council triage on 2026-05-20 called *COPY-O3*. The
problem: a single scan output was shipping two paragraphs of friction
text whose *frame* disagreed. The structured `explanation` would read

> "High cyclomatic complexity means many independent control-flow
> paths through one function; refactoring becomes risky..."

…the abstract code-quality voice. Then the rendered `fix_prompt` led
with

> "Without this, an agent editing a high-complexity function has to
> reason across every branch before it can change one safely..."

…the agent-led voice. Same finding, two different framings; the
reader (human or agent) had to mentally reconcile them before acting.

**Rules pack v2.3.0** rewrote the `explanation` lede on **23 of 38
rules** so both fields lead with the agent consequence. The other 15
rules already opened with `an agent` / `Without this, an agent...` and
were left byte-identical.

Schema unchanged. No behaviour change. The only diff under
`src/agent_readiness/rules_pack/` is `explanation` text plus the
bumped `pack_version` in `manifest.toml`. Reviewer
reading `git diff` sees exactly that.

A separate LLM-as-judge harness — `evaluate_actionability.py
--objective explanation`, with an `O3 ≥ 0.80` YES-rate gate —
ships in the research repo to *measure* the lift independently of the
human eyeball. The harness is wired and inert; it needs an operator
with a `GEMINI_API_KEY` to run a v2.2.0 baseline and a v2.3.0
post-rewrite comparison and report the number. That measurement is
the next experiment, not a backlog promise.

## 4. Scan + apply + verify in one command

The structured `action` half of the rules pack was always machine-
readable, but the scanner never owned the apply step — `apply_action`
was a stub in `agent_readiness.apply_action` that import-failed at
runtime. **agent-readiness 2.4.0** restored the executor and wired it
to two flags:

```bash
agent-readiness scan . \
    --fail-below 90 \
    --apply-top-action \
    --verify
```

That call:

1. Scores the repo. If below 90, exits non-zero (CI gate).
2. Picks the single highest-priority structured fix (the same priority
   sort the `top_action` pin uses in the research harness).
3. Runs the action — `create_file`, `append`, `edit`, `replace` — into
   the working tree.
4. Runs the rule's own `verify` shell command. Exits non-zero if
   verify fails.

The intended use case is the dogfood workflow: every PR runs the
scanner against itself; if it can land the fix and verify it,
the PR ships. If the fix fails verify, the workflow exits 1 and the
PR is blocked until a maintainer either lowers the floor for that
repo or merges the auto-generated fix manually. The template lives
in `agent-readiness-research/.github/workflows/dogfood.yml`.

## 5. `list_friction(path)` — paste-ready from the harness

The MCP server in `agent-readiness-mcp` got a second tool alongside
the existing `scan_repo(path)`:

- `scan_repo(path)` — full scan + score + finding list. The
  agent-readiness equivalent of `agent-readiness scan . --json`.
- `list_friction(path)` — every WARN/ERROR finding paired with its
  rendered `fix_prompt`, sorted by `score_impact` desc. Drops items
  that don't have a prompt; the contract is *paste-ready only*.

The terminal renderer also lost a long-standing collision with
`rich`'s markup parser: bracketed identifiers like `[project.scripts]`
and `[tool.ruff]` now render verbatim instead of being consumed as
rich tags. So whether you read the scan from the CLI or pull it
through the MCP tool, the output bytes match.

Install in Claude Code:

```
/plugin marketplace add harrydaihaolin/agent-readiness-skill
/plugin install agent-readiness@agent-readiness-skill
```

…and the harness wires `list_friction()` and `scan_repo()` for you.
The skill repo has Cursor / Claude Desktop installation steps if you
prefer the bare MCP config.

## 6. Council triage — a process change worth mentioning

Most of the changes above came out of a structured triage round on
**2026-05-20** where five subagents — Engineer, Researcher,
Designer, Investor, PM — debated eleven backlog items in turn over
shared per-item scratchpads, producing strict-format verdict blocks.
Verdicts: `keep`, `downgrade`, `defer`, `merge`, `split`, `kill`,
`archive-as-done`. The PM made the call; dissents from the other
four were captured verbatim and travelled with the verdict into the
follow-up plan.

That round produced this set of follow-ons:

- **kept / promoted**: COPY-O3 (shipped here as v2.3.0), the v3.3
  cohort re-scan, the RQ-Q1 AAIF qualification spike.
- **deferred**: the RAG-over-AGENTS.md research question, until the
  baseline cohort exists.
- **archived as done**: EXP-3, EXP-4, EXP-5 — the experiments that
  shipped as v2.0.1 / v2.2.0 work and just hadn't been formally
  closed out.
- **renamed**: the legacy `EXP-1` ID was carrying two meanings (the
  shipped *action* contract + an in-flight *copy* experiment); the
  copy half was renamed to COPY-O3 to clear the collision.

The full triage transcript — eleven scratchpad files, one per
item — lives under `.council/triage-2026-05-20/` in
`agent-readiness-research`. The point isn't the verdicts; the point
is the format. A triage round that has to produce a verdict block
in strict YAML, with named dissents and listed actions, is a much
harder thing to fudge than a meeting Slack thread.

## What's still inert

Two measurement gates are wired but waiting on operator credentials:

- **COPY-O3 ≥ 0.80 YES-rate gate.** `evaluate_actionability.py
  --objective explanation` is one CLI flag away from producing the
  number; it needs a `GEMINI_API_KEY` to run. The baseline +
  post-rewrite reproduction commands live in
  `agent-readiness-research/data/exp_o3_baseline.json` for whoever
  runs it.
- **v3.3 cohort re-scan.** The 1000-repo cohort from the v3 article
  was scanned at `agent-readiness==1.4.0` + rules pack 1.4.0. A
  re-scan at 2.4.2 + v2.3.0 would unblock the *archived-as-done*
  EXP-2 calibration claim and re-judge EXP-4 with the COPY-O3
  ledes in place. The leaderboard's next snapshot will close that
  loop.

## How to upgrade

If you're already on `agent-readiness` ≥ 2.0:

```bash
pip install --upgrade agent-readiness
agent-readiness --version   # 2.4.2
agent-readiness scan .      # picks up v2.3.0 rules pack automatically
```

The `fix_prompt`, the broader language coverage, and the agent-led
explanation voice all come down with the wheel — no flag needed.

If you're integrating with an MCP host:

```bash
pip install --upgrade agent-readiness-mcp
```

…and the next `list_friction(path)` call returns the paste-ready
prompts.

## Where this is going

The headline metric of the v3 article — `77.7% missing AGENTS.md` —
hasn't moved. The cohort hasn't been re-scanned. The point of the
last three weeks of work wasn't to lower that number; it was to make
sure that *when the number does move*, the path from finding → fix →
verify is short enough that an agent can walk it without a human in
the loop. The next post will be the cohort re-scan. The number after
that will be the apply-rate: of all the WARN/ERROR findings the
scanner reports, what fraction does the scanner's own `apply_action`
flag close on a single CI run?

Stay tuned. Or — better — point the scanner at your own repo and
see where it lands.
