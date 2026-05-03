# From freeform fix_hint to deterministic concrete action

> **The principle**: every friction the rules engine surfaces must map to a deterministic concrete action that lets an autonomous coding agent know exactly what to change, in which file, and how to verify the change worked, without asking a human or making a guess.

Five rule-pack versions over ten months. Same 1000-repo cohort. One thesis: structured actions beat clever prose, and the data has to back the claim.

## Headline chart: M7 rule-coverage of the action contract

| Version | Date | Rules | Rules with structured action | M7 rule-coverage |
|---|---|---:|---:|---:|
| **v1.0.0** | July 2025 | 7 | — | 0.0% |
| **v1.4.0** | Apr 2026 | 37 | — | 37.8% |
| **v1.5.0** | May 2026 | 38 | — | 36.8% |
| **v2.0.1** | May 2026 | 38 | 38 | 100.0% |
| **v2.2.0** | May 2026 | 38 | 38 | 100.0% |

M7 went from **0% in v1.0.0** (no structured templates at all) to **~38% in v1.4.0/v1.5.0** (a few rules with `fix_template`) to **100% in v2.0.1+** (all 38 rules ship `action` + `verify` blocks). That is not a metric drift — it is the principle made measurable.

## D1/D2/D3 actionability across versions (50-finding LLM-judge)

| Version | D1 deterministic | D2 concrete | D3 agent-applicable |
|---|---:|---:|---:|
| **v1.0.0** | — | — | — |
| **v1.4.0** | — | — | — |
| **v1.5.0** | 44.0% | 44.0% | 38.0% |
| **v2.0.1** | 100.0% | 100.0% | 62.0% |
| **v2.2.0** | 100.0% | 100.0% | 68.0% |

v1.0/v1.4 are blank because they predate the action contract — the judge has nothing structural to score. v1.5.0 is the Phase 0B frozen baseline.

## McNemar's paired significance test (same 50 findings, before vs after)

| Comparison | Dim | YES before | YES after | Δ | b regress | c improve | method | p | verdict |
|---|:---:|---:|---:|---:|---:|---:|:---:|---:|:---|
| v1.5.0 → v2.0.1 (EXP-1) | D1 | 22/50 (44.0%) | 50/50 (100.0%) | +56.0% | 0 | 28 | `chi2_yates` | < 0.0001 | improvement (p < 0.001) |
| v1.5.0 → v2.0.1 (EXP-1) | D2 | 22/50 (44.0%) | 50/50 (100.0%) | +56.0% | 0 | 28 | `chi2_yates` | < 0.0001 | improvement (p < 0.001) |
| v1.5.0 → v2.0.1 (EXP-1) | D3 | 19/50 (38.0%) | 31/50 (62.0%) | +24.0% | 1 | 13 | `binomial_exact` | < 0.01 | improvement (p < 0.01) |
| v1.5.0 → v2.2.0 (EXP-1+3) | D1 | 22/50 (44.0%) | 50/50 (100.0%) | +56.0% | 0 | 28 | `chi2_yates` | < 0.0001 | improvement (p < 0.001) |
| v1.5.0 → v2.2.0 (EXP-1+3) | D2 | 22/50 (44.0%) | 50/50 (100.0%) | +56.0% | 0 | 28 | `chi2_yates` | < 0.0001 | improvement (p < 0.001) |
| v1.5.0 → v2.2.0 (EXP-1+3) | D3 | 19/50 (38.0%) | 34/50 (68.0%) | +30.0% | 0 | 15 | `binomial_exact` | < 0.0001 | improvement (p < 0.001) |
| v2.0.1 → v2.2.0 (EXP-3 isolation) | D1 | 50/50 (100.0%) | 50/50 (100.0%) | +0.0% | 0 | 0 | `no_discordants` | 1.0000 | no change |
| v2.0.1 → v2.2.0 (EXP-3 isolation) | D2 | 50/50 (100.0%) | 50/50 (100.0%) | +0.0% | 0 | 0 | `no_discordants` | 1.0000 | no change |
| v2.0.1 → v2.2.0 (EXP-3 isolation) | D3 | 31/50 (62.0%) | 34/50 (68.0%) | +6.0% | 0 | 3 | `binomial_exact` | 0.2500 | no significant change |

McNemar's test asks: among findings where the verdict changed, did more change for the better than for the worse? When the discordant count is small (< 25) we report the exact two-sided binomial p-value; otherwise the Yates-corrected χ² approximation. Verdicts of 'no significant change' on D1 in the (v2.0.1 → v2.2.0) row are expected — D1 was at ceiling (100%) by EXP-1, so EXP-3 has no room to lift it.

## EXP-2: M1 fire-rate calibration

Orthogonal noise reduction. `repo_shape.large_files` (89% fire rate) and `git.churn_hotspots` (81%) were tuned into the 30–60% target band:

- `repo_shape.large_files`: line threshold 1500 → 3000; size threshold 150 KB → 300 KB
- `git.churn_hotspots`: min_commits 10 → 25; min_file_lines 200 → 500
- `gitignore.covers_junk`: kept at 51% (already in band; documented as no-op)

## EXP-4: per-repo top_action pin (50-repo judge eval)

- **Top-1 agreement**: 86.0% (gate ≥ 70%) — **PASS**
- **Coverage**: 100.0% of repos with ≥1 finding got a non-null pin (gate = 100%) — **PASS**
- **Pin diversity**: 15 distinct check_ids across 50 repos

Priority sort (no LLM in the ranking path): `severity (error < warn < info) > pillar (FLOW < FEEDBACK < SAFETY < COGNITIVE_LOAD) > weight desc > check_id`. The pillar order encodes a real claim: broken builds (FLOW) block every other fix; once setup works the agent needs reliable signal (FEEDBACK); SAFETY non-errors are mostly hygiene; refactor work (COGNITIVE_LOAD) is generally last.

## What 'proven' actually means here

Three distinct claims, each with its own evidence:

1. **The principle is encoded in the schema, not just promised in prose.** M7 = 100% means every rule that fires emits a structured `action.kind` and a `verify.command`. There is no path through the engine that produces freeform prose without a corresponding deterministic action.

2. **The lift is large and statistically real.** D1 and D2 went from ~44% to 100% on the paired 50-finding sample. McNemar's exact test puts the v1.5 → v2.0 transition at p < 0.0001 for both — this is not judge noise.

3. **An autonomous agent could actually use the output.** EXP-4's `top_action` pin was built specifically so a coding agent gets one concrete first move per repo — no ranking guesswork. Independent LLM judge agreed 86% of the time on a 50-repo sample, well above the pre-declared 70% gate.

## What's still left

- **D3 ceiling on refactor-discovery rules.** `repo_shape.large_files`, `git.churn_hotspots`, and similar 'go look at these candidates' rules scored D3 = 0% in EXP-3 because the action is a diagnostic, not a fix. Closing this gap needs a new probe kind — `match_findings_summary` — that injects the rule's own match output into the action template. Logged as a future EXP.
- **Live v3.3 dispatch.** The 1000-repo cohort hasn't been re-scanned with the post-EXP-4 engine yet — the next routine snapshot in the leaderboard pipeline will close that loop. For the principle's proof, the paired 50-finding judge sample is sufficient.

## How to reproduce

```bash
# Phase 0R retrospective metrics on the three frozen snapshots
python scripts/retrospective_metrics.py

# Phase 0G judge calibration (kappa >= 0.60 gate)
python scripts/evaluate_actionability.py --calibration --sample 25 \
    --judge-model gemini-2.5-flash --gold-model gemini-2.5-pro

# Phase 0B baseline + EXP-1 + EXP-3 D1/D2/D3 (same 50 findings)
python scripts/evaluate_actionability.py --sample 50 \
    --output data/exp_baseline.json
python scripts/evaluate_actionability.py --sample 50 \
    --output data/experiments/EXP-3.json --render-probes-default-python

# EXP-4 top_action pin (50 repos)
python scripts/evaluate_top_action.py --sample 50 \
    --output data/experiments/EXP-4.result.json

# Phase 2 cumulative proof (this article)
python scripts/phase2_journey.py
```

All ship notes, structural metrics, and judge transcripts are committed under `data/experiments/EXP-{1,2,3,4}.*` for review.
