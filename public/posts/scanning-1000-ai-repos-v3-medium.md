# I scanned 1000 popular AI / agent repos. Here is the structural picture.

> **What this is.** A static-analysis scan of 1000 popular open-source AI / agent repositories, looking for the structural signals that decide whether a coding agent (Claude Code, Cursor, Copilot, etc.) can actually pick up the project, find its entry point, run its tests, and not blow up its context window. The scanner is open source: [`agent-readiness`](https://pypi.org/project/agent-readiness/1.4.0/) on PyPI, 37 production checks, rules pack v1.4.0. The full snapshot — cohort, scanner version, rules pack, per-repo scores — is a frozen [GitHub Release](https://github.com/harrydaihaolin/agent-readiness-leaderboard/releases/tag/v3-2026-05-01). Cohort: 1000 repos discovered; **994 scanned cleanly, 6 failures (0.6%)**. Every number below is from that release.

## What "agent readiness" means

When a coding agent opens a repo for the first time, it's solving four problems at once:

- **Cognitive load** — can it figure out what this project *is* without reading every file? (`AGENTS.md`, README structure, token budget for orientation, entry-point discoverability.)
- **Feedback** — when it makes a change, does the project tell it whether the change works? (CI configured, tests runnable headlessly, lockfiles present.)
- **Flow** — can it iterate without stepping on its own toes? (Workflow concurrency guards, `.gitignore` hygiene, manifest detection.)
- **Safety** — will it accidentally commit a secret, or trip a brittle pre-commit hook? (Secrets-scan config, `.env.example` parity, large-file checks.)

The scanner has 37 checks across these four pillars, scores each repo 0–100, and grades on an S/A/B/C/D scale. A passing repo is one an agent can orient itself in within its context budget and run end-to-end without a human in the loop.

## Headline finding

**77.7% of 994 popular AI / agent repos (772 of them) are missing the canonical agent doc** — no `AGENTS.md` at the project root, the path the ecosystem has converged on through 2025–2026.

That's **77.7% of repos that *self-identify* as `topic:agent`, `topic:llm`, `topic:rag`, etc.** — the population where agent docs should be most expected. Two checks measure this gap:

- The strict-presence check — is `AGENTS.md` present at root? **77.7%** missing.
- The permissive check — does *any* recognised agent doc exist (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`)? **10.2%** missing.

Two-thirds of the cohort miss the canonical path; one in ten miss *every* form of agent doc.

## Top-12 findings, by fire rate

The checks the rules pack flagged most often across the 994-repo cohort:

- **large files** — 88.1%
- **churn hotspots** — 80.8%
- **canonical agent doc missing** — **77.7%**
- **secrets-scan config missing** — 63.4%
- **`.gitignore` covers junk missing** — 60.0%
- **README run instructions missing** — 48.8%
- **CI configured missing** — 35.2%
- **entry-point detected missing** — 28.8%
- **lockfile present missing** — 22.3%
- **token budget exceeded** — 17.8%
- **workflow concurrency-guard missing** — 16.3%
- **headless end-to-end runnability missing** — 16.2%

Three of these are worth dwelling on:

- **Secrets-scan config (63.4%).** Not "they leaked secrets" — they have nothing in place to *catch it* if they do.
- **Workflow concurrency-guard (16.3%).** One in six push-on-push workflows can race themselves on rapid pushes.
- **Headless end-to-end runnability (16.2%).** One in six repos has no path for an agent to run the project end-to-end without manual setup prompts.

## Methodology

Everything in the headline can be re-derived from the artefacts in this section.

### Selection

- **Source:** GitHub Search API, single sweep on `topic:<t> fork:false archived:false stars:<band>` for each of 9 topics (`llm`, `llms`, `agents`, `agent`, `ai-agents`, `mcp`, `rag`, `langchain`, `llmops`) × 4 star bands (200..1k, 1k..5k, 5k..20k, 20k..200k stars).
- **Cohort frozen at:** `2026-05-01`.
- **Cohort definition:** the immutable [GitHub Release](https://github.com/harrydaihaolin/agent-readiness-leaderboard/releases/tag/v3-2026-05-01).
- **Exclusions:** archived repos, forks, repos < 200 stars, repos > 200k stars. 0 HTTP errors during discovery.

### Scan pinning

- **Scanner:** [`agent-readiness==1.4.0`](https://pypi.org/project/agent-readiness/1.4.0/), the version published on PyPI on 2026-05-02.
- **Rules pack:** [`agent-readiness-rules` v1.4.0](https://github.com/harrydaihaolin/agent-readiness-rules), **37 production checks**.
- **Per-repo metadata:** every row in the released snapshot records the scanner's `scanned_at`, the repo's `stars`, `language`, and `topics` at scan time.

### Failure budget

A discovery run is invalid if more than 10% of repos fail to scan. This run reported 994 / 6 / 1000 — a **0.6% failure rate**, well inside budget.

## Stratified findings

With N=1000 we can slice the headline three ways.

### By star band

Each entry: **band — n / median score / % missing canonical agent docs**.

- **`stars:200..1000`** — n=667, median 75.0, **82.3%** missing
- **`stars:1001..5000`** — n=186, median 75.0, 74.2% missing
- **`stars:5001..20000`** — n=86, median 75.0, 67.4% missing
- **`stars:20001..200000`** — n=55, median 75.0, **49.1%** missing

The gap closes with stars but never goes away. **Even at 20k+ stars — effectively the most-watched repos in the AI ecosystem — 49% have no `AGENTS.md`.** Stars predict structural readiness in absolute terms, but in *agent-doc adoption* specifically there is a 33-point spread between the smallest and largest star bands.

### By language (top 10 by count)

Each entry: **language — n / median score / % missing canonical agent docs**.

- **Jupyter Notebook** — n=49, median 75.0, **95.9%** missing
- **Shell** — n=17, median 75.0, 88.2% missing
- **Python** — n=457, median 75.0, 83.4% missing
- **HTML** — n=12, median 75.0, 83.3% missing
- **C++** — n=14, median 75.0, 71.4% missing
- **JavaScript** — n=36, median 75.0, 69.4% missing
- **Java** — n=15, median 75.0, 66.7% missing
- **TypeScript** — n=190, median 75.0, **63.2%** missing
- **Go** — n=51, median 75.0, 60.8% missing
- **Rust** — n=44, median 75.0, **56.8%** missing

Two surprises. **TypeScript, Go, and Rust agent projects are materially better at agent docs than Python ones** (~57–63% vs ~83%), even though the popular-AI cohort is dominated by Python. And **notebook-first projects (Jupyter) are by far the worst** at 95.9%, consistent with the pattern that notebooks are written for humans-in-a-tab and never for headless tools.

A pillar-by-language breakdown shows that *cognitive load* is the weakest pillar across every language (median 87.0–89.3) while *feedback / flow / safety* hold above 95.0. The cohort is structurally **orientation-poor**, not pipeline-poor.

### By topic

Grouped by the seed topic that surfaced the repo. The average cohort repo carries ~1.3 seed topics (a project tagged both `topic:llm` and `topic:agent` shows up in both rows), so counts sum above 994 — they are *appearances*, not unique repos. The `(no seed topic)` row collects 205 repos that entered via curated anchors and carry none of the nine seed topics.

Each entry: **seed topic — n / median score / % missing canonical agent docs**.

- **`llm`** — n=208, median 75.0, 84.6% missing
- **`agent`** — n=203, median 75.0, 73.9% missing
- **`ai-agents`** — n=185, median 75.0, **63.8%** missing
- **`agents`** — n=178, median 75.0, 66.9% missing
- **`mcp`** — n=104, median 75.0, 77.9% missing
- **`langchain`** — n=72, median 75.0, 84.7% missing
- **`llms`** — n=72, median 75.0, 91.7% missing
- **`rag`** — n=51, median 75.0, 92.2% missing
- **`llmops`** — n=14, median 75.0, **92.9%** missing
- **`(no seed topic)`** — n=205, median 75.0, 82.9% missing

`topic:agents`, `topic:agent`, and `topic:ai-agents` repos *over-index* on agent-readiness because they self-identify as agent-oriented (canonical-doc miss-rate 64–74%, vs the cohort average of 77.7%). `topic:llm`, `topic:rag`, and `topic:llmops` catch infrastructure where agent-readiness is more accidental: they cluster at 85–93%. The 30-point spread between the agent-self-aware end and the LLM-infra end is the strongest "topic predicts behaviour" signal in the cohort.

## Score distribution

Of 994 cleanly-scanned repos:

- **S (≥95)** — 100 repos, 10.1%
- **A (80–94)** — 824 repos, 82.9%
- **B (60–79)** — 0 repos, 0.0%
- **C (40–59)** — 0 repos, 0.0%
- **D (<40)** — 70 repos, 7.0%

Median score: **75.0**. Mean: 73.8. The distribution is bimodal: a wide A-grade plateau and a sharp D-grade pocket of "unrunnable" repos that miss multiple high-weight checks at once. The 7% D-grade pocket is the rules pack's signal that **one in fourteen popular AI repos is structurally non-orientable** for an agent without manual handholding — three or more of the 37 checks fire simultaneously.

The composite **headless end-to-end runnability** rule fires on 162 repos (16.3%) and is one of the strongest predictors of D-grade membership.

## Three takeaways from the cohort

1. **Top exemplars cluster in Python infrastructure.** `apache/airflow` (97.3, S), `langchain-ai/langchain` (97.2, S), `bentoml/OpenLLM` (96.7, S), `ajndkr/lanarky` (96.7, S), `namuan/dr-doc-search` (96.5, S). All five are Python and all five ship under-100-token AGENTS.md surrogates (READMEs with explicit install / run / test fenced blocks); the agent-doc check passes via the permissive permission, not the canonical path.
2. **D-grade anti-patterns are language-diverse.** `hkuds/autoagent` (Python), `argoproj/argo-workflows` (Go), `prefecthq/prefect` (Python), `yusufkaraaslan/Skill_Seekers` (Python), `decodingai-magazine/llm-twin-course` (Python). The common thread is not language; it is *every* one of them missing `AGENTS.md`, having ≥ 3 multi-finding checks fire, and having token budget over the 50k-token threshold.
3. **The cohort's cognitive-load floor is consistent across languages.** Python / TypeScript / Go / Jupyter / Rust / JavaScript all sit in the 87.0–89.3 median band. Cognitive load is where the ecosystem under-invests, regardless of language. The maintainer playbook below targets that pillar first.

## Honest noise

Three caveats about the rules pack worth flagging up-front:

- **Large files (88.1% fire rate).** At 88% fire rate the check has stopped discriminating. Recalibration is on the open backlog.
- **README run instructions (48.8% fire rate).** The check requires explicit `install` / `run` / `test` headings with fenced commands, not just the words appearing in prose.
- **Secret-shaped strings (7.0% fire rate).** A basic secrets scan. We report the rate but **do not** claim it as production leakage — the rule is pattern-based and finds fixture data, examples, and test harnesses. Two of the four case studies below are scarred by this.

## Case studies

Four picks from the cohort: two top exemplars and two D-grade anti-patterns. Selection criteria: maintainers have publicly discussed agent docs / structural readiness so the writeup is fair use of public discourse.

### Exemplar A — `apache/airflow` (97.3, S, Python)

- Pillars: cognitive load 93.4 / feedback 100.0 / flow 97.7 / safety 100.0.
- Three findings, none structurally damning: large files (479 instances; this is a 14-year-old monorepo), token budget (~42k tokens — over budget but not catastrophic), and missing workflow concurrency-guard.
- Public posture: Airflow's release process and contributor guide are extensively documented; the repo lacks a canonical `AGENTS.md` but its [`UPDATING.md`](https://github.com/apache/airflow/blob/main/UPDATING.md) and PR-template scaffolding satisfy the permissive agent-doc check.
- Take-away: a multi-thousand-file monorepo can still hit the 95+ band on **flow** and **feedback** if its CI is comprehensive and its release process is documented. Its cognitive-load floor of 93.4 is the highest in the cohort for a repo of its size.

### Exemplar B — `langchain-ai/langchain` (97.2, S, Python)

- Pillars: cognitive load 94.6 / feedback 97.4 / flow 99.7 / safety 98.7.
- Two findings: large files (94 instances, all in `.github/` tooling) and a manifest-detection miss (the *root* has no manifest — they live one directory deeper).
- Public posture: LangChain has been [public about agent-doc adoption](https://github.com/langchain-ai/langchain/issues) and ships [`docs/docs/`](https://github.com/langchain-ai/langchain/tree/master/docs/docs) scaffolding. The permissive agent-doc check passes via the `docs/` doc tree; the canonical check fails because there is no root-level `AGENTS.md` yet.
- Take-away: even the project that helped popularise the agent-doc conversation hasn't shipped the canonical file. Five-minute fix.

### Anti-pattern A — `argoproj/argo-workflows` (30.0, D, Go)

- Pillars: cognitive load 89.2 / feedback 100.0 / flow 98.7 / safety 69.6.
- Seven multi-instance findings, including a basic secrets scan on PEM private keys (likely fixtures, but raises Gemfile-style alarm), large files on a 470 KB CHANGELOG, and the canonical agent-doc miss.
- Public posture: argo-workflows is a CNCF-graduated project with exceptional CI (the 100.0 feedback score is real), but **safety** drops to 69.6 because two PEM-shaped strings sit in the test fixture tree without a `.gitleaks.toml` allow-list to dismiss them.
- Take-away: a CNCF-graduate, top-50-stars-in-its-niche project can still grade D because **safety + cognitive load combined miss the threshold**, even when its operational CI is among the best in the cohort.

### Anti-pattern B — `prefecthq/prefect` (30.0, D, Python)

- Pillars: cognitive load 90.7 / feedback 99.5 / flow 94.3 / safety 78.3.
- Seven findings, including a basic secrets scan on three Slack tokens (test fixtures, almost certainly), large files (230 instances; the docs site bundles a 123 KB JSON catalog), token budget over **197k tokens** (3.5× the threshold; far past any practical agent context window), and an `.env.example` parity miss.
- Public posture: Prefect's [agent-readiness discussion thread](https://github.com/PrefectHQ/prefect/discussions) has been a friendly back-and-forth on agent-doc tooling.
- Take-away: token budget is the killer. Repos over the 50k-token orientation budget force agents into chunked indexing that defeats the purpose of an agent doc. Splitting `docs/docs.json` out of the repo (or shipping `docs/agents.md` as an index) would push Prefect into the A band immediately.

## Maintainer playbook

Concrete priority-ordered fix list, each backed by an exact rule the pack fires for the listed problem on this cohort. Order is by inverse cost (cheap fixes first):

1. **Ship `AGENTS.md`** at the project root — fires on 77.7% of cohort. Five-minute task: copy the [recommended template](https://github.com/harrydaihaolin/agent-readiness-rules/blob/main/templates/AGENTS.md) and fill the four sections.
2. **Add a `.gitleaks.toml` allow-list** — fires on 63.4%. Even a one-line `[allowlist] paths = ["tests/**"]` satisfies the check and lets real secret regressions actually surface.
3. **Fill out `.gitignore`** — fires on 60.0%. The check looks for 12 standard groups (`__pycache__/`, `dist/`, `build/`, `node_modules/`, etc.); cover ≥ 11 to pass.
4. **Add `install` / `run` / `test` headings to README** — fires on 48.8%. The check is header-and-fence based; explicit fenced commands matter more than prose.
5. **Add a CI test step that doesn't no-op** — fires on 35.2%. A `make test` invocation in any `.github/workflows/*.yml` satisfies it.
6. **Detect an entry point** — fires on 28.8%. `main.py`, `index.js`, `cmd/`, `bin/`, `__main__.py` are all recognised; this is a directory-layout fix, not a document fix.
7. **Add a top-level `concurrency:` block to push-on-push workflows** — fires on 16.3%. Three lines: `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`.
8. **Add a `headless` smoke step** — fires on 16.2%. One Makefile target that runs the project end-to-end without manual prompts.

Every percentage above is from the released dataset.

## Try it on your own repo

- **Scan it yourself:** `pip install agent-readiness==1.4.0` then `agent-readiness scan path/to/repo`. The output is a JSON score card with per-pillar breakdowns and per-rule fire reasons.
- **Disagree with a rule?** Open an issue on [`agent-readiness-rules`](https://github.com/harrydaihaolin/agent-readiness-rules) with a reproducer.
- **Want your repo on the leaderboard?** Open a PR adding it to ([`scripts/scan.py`](https://github.com/harrydaihaolin/agent-readiness-leaderboard/blob/main/scripts/scan.py)).
