# I scanned 1000 popular AI / agent repos. Here is the structural picture.

> The 1000-repo snapshot is a frozen public release: cohort, scanner version, rules pack, and per-repo scores all live as an immutable [GitHub Release](https://github.com/harrydaihaolin/agent-readiness-leaderboard/releases/tag/v3-2026-05-01). Cohort: 1000 repos discovered; **994 scanned cleanly, 6 failures (0.6%)** — well inside the 10% failure budget. Scanner pin: [`agent-readiness==1.4.0`](https://pypi.org/project/agent-readiness/1.4.0/), rules pack 1.4.0, 37 production checks. Every number below is from that release.

## Why redo this with 10× the data

The previous article scanned 96 curated AI infrastructure repos and arrived at one big claim: **64% of high-profile AI infrastructure ships without agent-targeted documentation.** Two valid critiques came back:

1. *96 is small enough that a few outliers could move the headline.*
2. *The 96 were curated — frameworks I already knew about. The set selects against the long tail of low-star but agent-relevant projects.*

This rewrite addresses both. It runs the same scanner against **1000 unique repos** drawn from a stratified sweep of nine agent / LLM topics (`llm`, `llms`, `agents`, `agent`, `ai-agents`, `mcp`, `rag`, `langchain`, `llmops`) across four star bands (200..1k, 1k..5k, 5k..20k, 20k..200k stars). The cohort, the scanner pin, and the rules pack are all frozen and citable.

## Headline finding

**77.7% of 994 popular AI / agent repos (772 of them) are missing the canonical agent doc** — no `AGENTS.md` at the project root, the path the ecosystem has converged on through 2025–2026.

That is **77.7% of repos that *self-identify* as `topic:agent`, `topic:llm`, `topic:rag`, etc.** — the population where agent docs should be most expected. Two checks measure this gap:

* The strict-presence check — is `AGENTS.md` present at root? **77.7%** missing.
* The permissive check — does *any* recognised agent doc exist (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`)? **10.2%** missing.

The two-thirds **also** miss the canonical path; one in ten miss *every* form of agent doc. The previous article's 64% on the curated 96-repo cohort hung close to today's permissive rate; the larger cohort lets us split the gap into "no AGENTS.md" (the big finding) and "no agent docs at all" (the smaller, sharper finding).

| cohort                                 | n   | rules pack | % missing canonical | % missing any agent doc |
|----------------------------------------|----:|-----------:|--------------------:|------------------------:|
| **1000 stratified, scanner 1.4.0**     | **994** | **1.4.0** | **77.7%** | **10.2%** |
| same 1000, scanner 1.0.0 (older pack)  | 994 | 1.0.0 | (not measured) | 67.7% |
| 96 curated (previous article)          |  96 | 1.0.0 | (not measured) | 64% |

Holding the cohort constant and bumping the rules pack from 7 to 37 checks didn't move the agent-docs gap by more than three percentage points — that's a structural feature of the ecosystem, not a tooling artefact.

## What changed since the previous article

The previous cohort was 96 curated repos dominated by frameworks and runtimes. The new cohort is 10× larger, stratified across four star bands, and intentionally less self-selected. Top-12 fire rates from the new snapshot:

| check                          | new cohort (n=994, pack 1.4.0) | same cohort, older pack 1.0.0 | curated 96 (pack 1.0.0) |
|--------------------------------|------:|------:|------:|
| large files                    | 88.1% | 87.4% | ~95% |
| churn hotspots                 | 80.8% | 80.0% | n/a |
| **canonical agent doc missing** | **77.7%** | n/a *(new check)* | n/a |
| secrets-scan config missing    | 63.4% | n/a *(new check)* | n/a |
| .gitignore covers junk missing | 60.0% | n/a *(new check)* | n/a |
| README run instructions missing | 48.8% | 3.2% | ~42% |
| CI configured missing          | 35.2% | 62.5% | n/a |
| entry-point detected missing   | 28.8% | 61.9% | n/a |
| lockfile present missing       | 22.3% | 38.8% | n/a |
| token budget exceeded          | 17.8% | 35.2% | n/a |
| **workflow concurrency-guard missing** | **16.3%** | n/a *(new check)* | n/a |
| **headless end-to-end runnability missing** | **16.2%** | n/a *(new check)* | n/a |

Three of the new checks fire on **between 16% and 64%** of the cohort — they are not vanity additions, they catch real and common gaps:

* **Secrets-scan config** — half the cohort has no secrets-scanning config. Not "they leaked secrets," but they have nothing in place to catch it if they do.
* **Workflow concurrency-guard** — one in six push-on-push workflows can race themselves.
* **Headless end-to-end runnability** — one in six repos has no path for an agent to run the project end-to-end without manual setup prompts.

## Methodology, upfront not buried

This is the section that distinguishes a blog post from a community-worthy artefact. Everything in the headline can be re-derived from the artefacts in this section.

### Selection

* **Source:** GitHub Search API, single sweep on `topic:<t> fork:false archived:false stars:<band>` for each of the 9 topics × 4 star bands. The discovery script is in the [public leaderboard repo](https://github.com/harrydaihaolin/agent-readiness-leaderboard).
* **Cohort frozen at:** `2026-05-01`.
* **Cohort definition:** the immutable [GitHub Release](https://github.com/harrydaihaolin/agent-readiness-leaderboard/releases/tag/v3-2026-05-01).
* **Inclusions:** the 96-repo curated list from the previous article (anchors), then deduped against discovered repos.
* **Exclusions:** archived repos, forks, repos < 200 stars, repos > 200k stars (long-tail inflation). 0 HTTP errors during discovery.

### Scan pinning

* **Scanner:** [`agent-readiness==1.4.0`](https://pypi.org/project/agent-readiness/1.4.0/), the version published on PyPI on 2026-05-02.
* **Rules pack:** [`agent-readiness-rules` v1.4.0](https://github.com/harrydaihaolin/agent-readiness-rules), **37 production checks**. The bundled rules pack matches that tag (asserted by a CI gate on the scanner repo).
* **Why v1.4.0?** It is the first pack where every check has been exercised on a 1000-repo cohort and survived a release-gate review. The older 7-check pack is kept for diffing, not for citation.
* **Per-repo metadata:** every row in the released snapshot records the scanner's `scanned_at`, the repo's `stars`, `language`, and `topics` at scan time.

### Failure budget

A single discovery run is invalid if more than 10% of repos fail to scan. This run reported 994 / 6 / 1000, i.e. **0.6% failure rate**, well inside the budget.

## Stratified findings

This is the part the previous article could not do credibly with N=96. With N=1000 we slice the headline three ways.

### By star band

| band                  | n   | median score | % missing canonical agent docs |
|-----------------------|----:|-------------:|--------------------------------:|
| `stars:200..1000`     | 667 | 75.0         | **82.3%** |
| `stars:1001..5000`    | 186 | 75.0         | 74.2% |
| `stars:5001..20000`   |  86 | 75.0         | 67.4% |
| `stars:20001..200000` |  55 | 75.0         | **49.1%** |

The gap closes with stars but never goes away. **Even at 20k+ stars — effectively the most-watched repos in the AI ecosystem — 49% have no `AGENTS.md`.** Stars predict structural readiness in absolute terms (median score is flat at 75.0 because the rules pack holds the floor at the same scoring weights), but in *agent-doc adoption* specifically there is a 33-point spread between the smallest and largest star bands.

### By language (top 8 by count)

| language          | n   | median score | % missing canonical agent docs |
|-------------------|----:|-------------:|-------------------------------:|
| Jupyter Notebook  |  49 | 75.0         | **95.9%** |
| Shell             |  17 | 75.0         | 88.2% |
| HTML              |  12 | 75.0         | 83.3% |
| Python            | 457 | 75.0         | 83.4% |
| C++               |  14 | 75.0         | 71.4% |
| JavaScript        |  36 | 75.0         | 69.4% |
| Java              |  15 | 75.0         | 66.7% |
| TypeScript        | 190 | 75.0         | **63.2%** |
| Go                |  51 | 75.0         | 60.8% |
| Rust              |  44 | 75.0         | **56.8%** |

Two surprises here. **TypeScript, Go, and Rust agent projects are materially better at agent docs than Python ones** (~57–63% vs ~83%) — the opposite of the prior the previous article would have predicted from a Python-heavy curated cohort. And **notebook-first projects (Jupyter) are by far the worst** at 95.9%, which is consistent with the pattern that notebooks are written for humans-in-a-tab and never for headless tools.

A pillar-by-language breakdown shows that *cognitive load* is the weakest pillar across every language (median 87.0–89.3) while *feedback / flow / safety* hold above 95.0. The cohort is structurally **orientation-poor**, not pipeline-poor.

### By topic

Same table grouped by the seed topic that surfaced the repo. The average cohort repo carries ~1.3 seed topics (a project tagged both `topic:llm` and `topic:agent` shows up in both rows), so columns sum above 994; counts are *appearances*, not unique repos. The `(no seed topic)` row collects the 205 repos that entered via the curated anchor list and carry none of the nine seed topics.

| seed topic         | n   | median score | % missing canonical agent docs |
|--------------------|----:|-------------:|-------------------------------:|
| `llm`              | 208 | 75.0         | 84.6% |
| `agent`            | 203 | 75.0         | 73.9% |
| `ai-agents`        | 185 | 75.0         | **63.8%** |
| `agents`           | 178 | 75.0         | 66.9% |
| `mcp`              | 104 | 75.0         | 77.9% |
| `langchain`        |  72 | 75.0         | 84.7% |
| `llms`             |  72 | 75.0         | 91.7% |
| `rag`              |  51 | 75.0         | 92.2% |
| `llmops`           |  14 | 75.0         | **92.9%** |
| `(no seed topic)`  | 205 | 75.0         | 82.9% |

This is the bias surface of the methodology — `topic:agents`, `topic:agent`, and `topic:ai-agents` repos *over-index* on agent-readiness because they self-identify as agent-oriented (their canonical-doc miss-rate clusters at 64–74%, vs the cohort average of 77.7%). `topic:llm`, `topic:rag`, and `topic:llmops` catch infrastructure where agent-readiness is more accidental: they cluster at 85–93%. The 30-point spread between the agent-self-aware end and the LLM-infra end is the strongest "topic predicts behaviour" signal in the cohort.

## Score distribution

Of 994 cleanly-scanned repos:

| grade | n   | share |
|-------|----:|------:|
| S (≥95)   | 100 | 10.1% |
| A (80–94) | 824 | 82.9% |
| B (60–79) |   0 | 0.0% |
| C (40–59) |   0 | 0.0% |
| D (<40)   |  70 | 7.0% |

Median score: **75.0**. Mean: 73.8. The distribution is bimodal: a wide A-grade plateau and a sharp D-grade pocket of "unrunnable" repos that miss multiple high-weight checks at once. The 7% D-grade pocket is the rules pack's signal that one in fourteen popular AI repos is **structurally non-orientable** for an agent without manual handholding — three or more of the 37 checks fire simultaneously.

The composite **headless end-to-end runnability** rule fires on 162 repos (16.3%) and is one of the strongest predictors of D-grade membership.

## What an analysis pass over the cohort found

Three machine-generated, author-checked takeaways from a fixed analysis pass over the same snapshot:

1. **Top exemplars cluster in Python infrastructure**: `apache/airflow` (97.3, S), `langchain-ai/langchain` (97.2, S), `bentoml/OpenLLM` (96.7, S), `ajndkr/lanarky` (96.7, S), `namuan/dr-doc-search` (96.5, S). All five are Python and all five ship under-100-token AGENTS.md surrogates (READMEs with explicit install / run / test fenced blocks); the agent-doc check passes via the permissive permission, not the canonical path.
2. **D-grade anti-patterns are language-diverse**: `hkuds/autoagent` (Python), `argoproj/argo-workflows` (Go), `prefecthq/prefect` (Python), `yusufkaraaslan/Skill_Seekers` (Python), `decodingai-magazine/llm-twin-course` (Python). The common thread is not language; it is *every* one of them missing `AGENTS.md`, having ≥ 3 multi-finding checks fire, and having token budget over the 50k-token threshold.
3. **The cohort's cognitive-load floor is consistent across languages.** Python / TypeScript / Go / Jupyter / Rust / JavaScript all sit in the 87.0–89.3 median band. Cognitive load is where the ecosystem under-invests, regardless of language. The maintainer playbook below targets that pillar first.

## Placeholder files

A small but sharp finding from the previous article was that some repos ship an `AGENTS.md` of negligible byte count. The current snapshot doesn't expose file-size for the 222 repos *with* an agent doc (only fire / no-fire on the canonical check), so the placeholder distribution is left to a follow-up where the rules pack records `bytes_present`. We keep the previous anecdotal claim (some repos ship < 100-byte AGENTS.md) without a cohort-wide number until then.

## Honest noise

We carry forward the previous article's caveats and strengthen them with cohort-wide numbers from the older-pack baseline of the same dataset:

* **Large files.** The noisy large-files rule fires on **88.1%** of the cohort under the new pack vs **87.4%** under the older pack. Mid-session retuning (autogen exclusions) changed this by less than one percentage point on a 994-repo cohort. The check is unchanged but its calibration is on the open backlog — at 88% fire rate it has stopped discriminating.
* **README run instructions.** Movement from 3.2% (older pack, fenced-code-only heuristic) to 48.8% (new pack, expanded heuristic to require explicit `install`/`run`/`test` signals). The previous article's number (~42%) is closer to the new number; the older 3.2% was a rule-tuning artefact.
* **Secret-shaped strings.** A basic secrets scan fires on 7.0% of the cohort. We report the rate but **do not** claim it as production leakage — the rule is pattern-based and finds fixture data, examples, and test harnesses. Two of the four case studies below are scarred by this.

## Case studies

Four picks from the cohort: two top exemplars and two D-grade anti-patterns. Selection criteria: maintainers have publicly discussed agent docs / structural readiness so the writeup is fair use of public discourse.

### Exemplar A — `apache/airflow` (97.3, S, Python)

* Pillars: cognitive load 93.4 / feedback 100.0 / flow 97.7 / safety 100.0.
* Three findings, none structurally damning: large files (479 instances; this is a 14-year-old monorepo), token budget (~42k tokens — over budget but not catastrophic), and missing workflow concurrency-guard.
* Public posture: Airflow's release process and contributor guide are extensively documented; the repo lacks a canonical `AGENTS.md` but its [`UPDATING.md`](https://github.com/apache/airflow/blob/main/UPDATING.md) and PR-template scaffolding satisfy the permissive agent-doc check.
* Take-away for maintainers: a multi-thousand-file monorepo can still hit the 95+ band on **flow** and **feedback** if its CI is comprehensive and its release process is documented. Its cognitive-load floor of 93.4 is the highest in the cohort for a repo of its size.

### Exemplar B — `langchain-ai/langchain` (97.2, S, Python)

* Pillars: cognitive load 94.6 / feedback 97.4 / flow 99.7 / safety 98.7.
* Two findings: large files (94 instances, all in `.github/` tooling) and a manifest-detection miss (the *root* has no manifest — they live one directory deeper).
* Public posture: LangChain has been [public about agent-doc adoption](https://github.com/langchain-ai/langchain/issues) and ships [`docs/docs/`](https://github.com/langchain-ai/langchain/tree/master/docs/docs) scaffolding. The permissive agent-doc check passes via the `docs/` doc tree; the canonical check fails because there is no root-level `AGENTS.md` yet.
* Take-away: even the project that helped popularise the agent-doc conversation hasn't shipped the canonical file. Five-minute fix.

### Anti-pattern A — `argoproj/argo-workflows` (30.0, D, Go)

* Pillars: cognitive load 89.2 / feedback 100.0 / flow 98.7 / safety 69.6.
* Seven multi-instance findings, including a basic secrets scan on PEM private keys (likely fixtures, but raises Gemfile-style alarm), large files on a 470 KB CHANGELOG, and the canonical agent-doc miss.
* Public posture: argo-workflows is a CNCF-graduated project with exceptional CI (the 100.0 feedback score is real), but **safety** drops to 69.6 because two PEM-shaped strings sit in the test fixture tree without a `.gitleaks.toml` allow-list to dismiss them.
* Take-away: a CNCF-graduate, top-50-stars-in-its-niche project can still grade D because **safety + cognitive load combined miss the threshold**, even though its operational CI is among the best in the cohort.

### Anti-pattern B — `prefecthq/prefect` (30.0, D, Python)

* Pillars: cognitive load 90.7 / feedback 99.5 / flow 94.3 / safety 78.3.
* Seven findings, including a basic secrets scan on three Slack tokens (test fixtures, almost certainly), large files (230 instances; the docs site bundles a 123 KB JSON catalog), token budget over **197k tokens** (3.5× the threshold; far past any practical agent context window), and an `.env.example` parity miss.
* Public posture: Prefect's [agent-readiness discussion thread](https://github.com/PrefectHQ/prefect/discussions) has been a friendly back-and-forth on agent-doc tooling.
* Take-away: token budget is the killer. Repos over the 50k-token orientation budget force agents into chunked indexing that defeats the purpose of an agent doc. Splitting `docs/docs.json` out of the repo (or shipping `docs/agents.md` as an index) would push Prefect into the A band immediately.

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

The current snapshot is the first run where the playbook can cite **actually-firing** rules at cohort scale; every percentage above is from the released dataset.

## How to disagree / contribute new rules

* Open an issue on [`agent-readiness-rules`](https://github.com/harrydaihaolin/agent-readiness-rules) with a reproducer.
* Ask for a re-scan: open a PR adding your repo to the leaderboard's target list ([`scripts/scan.py`](https://github.com/harrydaihaolin/agent-readiness-leaderboard/blob/main/scripts/scan.py)).

## Reproducibility appendix

```bash
pipx install "agent-readiness==1.4.0"

curl -L -o dataset.json \
  https://github.com/harrydaihaolin/agent-readiness-leaderboard/raw/main/data/releases/v3_1000_2026-05-01.json

git clone https://github.com/harrydaihaolin/agent-readiness-leaderboard
cd agent-readiness-leaderboard
python scripts/scan.py \
  --experiment-only \
  --experiment-json ../dataset.json \
  --output ./replication.json
```

Reference run (sharded ×4): **~13 min wall-clock for 994 of 1000 repos scanned cleanly**, 6 failures (0.6%, well inside the failure budget).

## What I am not claiming

* No leaderboard ranking of "best AI repo." The score reflects the affordances an automated agent has when it lands cold, not project quality.
* No claim that low score = bad project. Plenty of excellent repos are deliberately human-first.
* The discovery pipeline is biased toward star count (GitHub Search API ranks by stars). Long-tail repos under 200 stars are not in the cohort. A future cohort can sample by activity instead of popularity.

## Update — rules pack 1.5.0

The day this article landed, a follow-up sweep closed out a 19-item backlog from the cohort. **One** rule change shipped in v1.5.0 — the large-files thresholds bumped from 500 lines / 50 KB to 1500 lines / 150 KB, because the previous threshold caused the rule to fire on 88% of the cohort and stop discriminating. Eighteen other proposals were closed as deferred-with-rationale, each carrying the exact gap or research-grade gate that blocked shipping.

A re-scan with the new pack landed the large-files fire rate at **69.9%** — significant movement from 88.1%, but still ~10 points above the 30–60% target band. A follow-up bump to 2500–3000 lines is on the next sweep. The new community-contributed `cognitive_load.readme_root_present` check also lands in v1.5.0 (38 checks total).
