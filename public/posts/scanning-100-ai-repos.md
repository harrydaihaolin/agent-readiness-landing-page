# I scanned 96 popular AI infra repos. Most are not agent ready.

The pitch that LLM agents are now part of the developer toolchain assumes the toolchain is shaped for them. I ran [`agent-readiness`](https://github.com/harrydaihaolin/agent-readiness) against a fixed list of ninety-six widely used open-source projects — frameworks, runtimes, vector stores, and orchestration tools — and asked a simple question: if a coding agent landed in each repo with no human nearby, what would it actually have to work with?

The most uncomfortable finding came first: **about two-thirds of these repos have no agent-targeted documentation** — no `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, or the other filenames the ecosystem has started to standardize on. That is infrastructure for AI agents shipping without docs for AI agents.

## The two-thirds gap

The scan looks for the usual agent-doc locations: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`, and a handful of related paths. **Sixty-one of the ninety-six** projects had none of them.

What surprised me was not the percentage but the *shape* of the set. The misses are not obscure forks. They cluster in places you would expect to be exemplars: widely used SDKs, major inference and training stacks, orchestration and data platforms, and projects whose own marketing assumes agents are part of the workflow. In other words, the gap is structural — it is where the ecosystem is loudest about agents, not where it is quiet.

None of those repos gives an agent a single canonical place to read how to install, run, test, or what not to touch. A human can infer from a README; an agent burns context and guesses.

## Placeholder files

A smaller but sharper pattern sits in the minority that *do* ship an agent-facing file. A few repos have an `AGENTS.md` or `CLAUDE.md` that is only a handful of bytes — effectively a stub. That reads as awareness of the convention without investment in it. One high-star agent-oriented project had an eleven-byte `CLAUDE.md`: the file exists, but there is nothing for an agent to read.

## The worst case: nothing to read, run, or verify

A stricter composite only fires when **all** of the following are missing at once: any agent-targeted doc, a conventional entry point (for example declared scripts in a manifest, or a recognised `main` / CLI layout), and any statically discoverable test signal (for example a `test` target in a Makefile, pytest config, or obvious test tree).

**Three** of the ninety-six repos hit that bar. That is a small fraction, but it is the floor: an agent there cannot read a dedicated doc, cannot find something obvious to run, and cannot find something obvious to verify. Even a perfect README is not enough if the machine-readable affordances are absent.

## READMEs that do not hand an agent a command

**About forty percent** of the corpus tripped a check for run instructions in the main README: fenced commands, and clear install / run / test signals. A fair number lean on prose, screenshots, or “see our docs site” links. That is fine for humans who can click through; it is brittle for a sandboxed agent that cannot browse the way a person does.

## What I am not claiming

An earlier draft leaned on “secrets in popular repos.” After stricter path filtering, **about one in eight** repos still contains *something* that looks like a secret to a pattern matcher. I am **not** claiming that means one in eight projects is leaking production keys. A lot of that is fixture data, examples, and test harness strings that are indistinguishable from real secrets in a static scan. Treat that bucket as “worth a human pass,” not as a headline.

## A noisy signal: very large files

The single broadest warning in the run is still “oversized” source files — it fires for almost everyone in this cohort even after excluding lockfiles, changelogs, and common binary paths. That rule is useful for surfacing cognitive load, but it is also **over-inclusive** for this population (generated code, schemas, vendored trees). I am not building conclusions on top of it; a future rules revision will narrow it. Consider it background noise, not a verdict.

## How this was measured

[`agent-readiness`](https://github.com/harrydaihaolin/agent-readiness) is an open-source CLI. Rules live in [`agent-readiness-rules`](https://github.com/harrydaihaolin/agent-readiness-rules). The public leaderboard and the underlying scan are at [`agent-readiness-leaderboard`](https://github.com/harrydaihaolin/agent-readiness-leaderboard) and [the live site](https://harrydaihaolin.github.io/agent-readiness-leaderboard/). The ninety-six projects are a curated, reproducible set — not a random sample of GitHub — so the percentages are “on this list,” not “on the entire internet.”

If you maintain one of these projects, the cheapest upgrade is still the same: add a real `AGENTS.md` (or equivalent) with install, test, run, and “do not touch” guidance. Your human contributors will thank you too.
