You bought the seats. Your team is on Claude Code, Cursor, Copilot, and Cline. The agents look astonishing in the demo videos and then quietly fail on _your_ codebase.

The model is the variable you can't change. The repository is the one you can.

`agent-readiness` is a small, MIT-licensed CLI that puts a number on how ready a codebase is for autonomous coding agents — across cognitive load, feedback loops, flow, and safety — and hands you a prioritised punchlist of fixes. Like Lighthouse, but for agentic accessibility.

This post is about why we built it, what we're measuring, and the research that says the same things that hurt human developers hurt agents twice as hard.

## What the research actually says

There is a well-trodden body of work on what makes humans productive in software. The current standard is the **DevEx framework** — Forsgren, Storey, Maddila, Smith, and Houck (2024), _DevEx: What Actually Drives Productivity_, ACM Queue / Communications of the ACM. The paper distils developer experience into three dimensions:

1. **Feedback loops** — how fast and clear the signal is after a change. Slow CI, flaky tests, and silent failures aren't annoyances; they're the variable that explains the gap between "we shipped" and "we're stuck."
2. **Cognitive load** — how much a developer has to hold in their head to make a correct change. Cluttered repo roots, missing docs, ambiguous naming, gigantic files. The framework explicitly calls this out as the dimension teams underestimate the most.
3. **Flow state** — the ability to make progress without unplanned interruptions. Onboarding friction, mid-task tool failures, broken local dev environments — the accumulated tax that turns a forty-five-minute change into a four-hour one.

The paper's central claim is that these three dimensions are the _measurable_ substrate underneath every higher-level productivity discussion (DORA, SPACE, your favourite OKR). It's not abstract. The authors give concrete examples — a slow build that lengthens cycle time, an unclear codebase that lengthens the time to first commit — and show that small improvements in any one dimension compound.

> "Optimising for developer experience requires understanding the friction developers experience in their day-to-day work and systematically removing it." — Forsgren et al., DevEx

Now read that quote again, with one substitution: replace _developers_ with _agents_.

## Agents are headless developers

Your AI coding agent is a developer with a small set of unusual constraints:

- **It is headless.** No browser, no dashboard, no clickable buttons. If important state is reachable only through a UI, it's invisible to the agent.
- **It cannot ask a senior engineer for help.** When stuck, a junior on your team pings someone in Slack. The agent guesses, hallucinates, or thrashes.
- **Its working memory is a context window.** Cognitive load isn't a metaphor for the agent — it's a hard constraint. Past a certain point, the agent literally cannot see the whole picture at once.
- **It treats every signal as gospel.** Slow tests don't just frustrate; they actively confuse the agent into believing nothing happened.

In other words, an agent experiences DevEx friction the same way a developer does, but with the worst possible coping strategy: it keeps going. Where a human notices the friction and works around it, the agent commits half-broken changes, opens malformed pull requests, or quietly gives up after burning a hundred dollars of inference.

The DevEx paper's three dimensions map almost one-to-one onto what makes a repo agent-friendly:

| DevEx (human) | agent-readiness (agent) |
|---|---|
| Feedback loops | Are tests discoverable and fast? Is `make test` enough, or does the agent have to read three READMEs to find out? |
| Cognitive load | Are files and modules sized for the context window? Is there an `AGENTS.md` / `CLAUDE.md` / `.cursorrules` so the agent doesn't have to reverse-engineer house style? |
| Flow state | Can the agent run the project headlessly, end-to-end, without a manual setup step that requires a human to click something? |

We added a fourth dimension because agents have one failure mode humans don't: confidently committing AWS credentials.

| | |
|---|---|
| **Safety** | Are secrets gitignored? Are destructive scripts (`rm -rf`, force-push hooks) gated? Is the agent kept inside a sandbox? |

That's the rubric. Four pillars. One score.

## What `agent-readiness` actually does

The CLI is a static analyser plus an optional sandboxed runtime check. Run it on a repo and you get this:

```
$ agent-readiness scan .

AI Readiness  62 / 100

  Cognitive load     70 / 100
  Feedback loops     40 / 100   ← biggest drag
  Flow & reliability 75 / 100
  Safety             OK

Top friction (fix these first):
  1. test_command.discoverable — no test invocation found in Makefile,
     package.json, or pyproject.toml
  2. agent_docs.present — no AGENTS.md / CLAUDE.md / .cursorrules at root
  3. headless.no_setup_prompts — README mentions "log in to the dashboard"
     during setup; agents can't traverse this
```

A few design choices, all consequences of the DevEx framing:

**Agents are headless. So is the tool.** No interactive prompts, no required dashboards, stable JSON via `--json`, exit codes that mean things, machine-readable findings via SARIF. If the tool itself violated headlessness, it'd be hypocritical.

**Code quality counts only where it predicts agent success.** Mega-files, ambiguous names, dead code, missing types — those have direct lines to agent failure modes and get measured. We don't reproduce the full SonarQube taxonomy. Other tools do that well.

**Untrusted code runs in Docker, always.** Any check that executes scripts from the target repo runs inside a sandboxed container. Safety is a cap on the score, not a soft warning.

**Each finding has a one-line action and a verify command.** Not "this is bad" but "here is the file, here is the change to make, here is the shell command that returns 0 when you've made it." The same checks that score the repo also tell an agent (or a human) the exact next move that raises the score.

## What you do with the score

```bash
pip install agent-readiness
agent-readiness scan .

# Or in CI, gate merges below a threshold:
agent-readiness scan . --fail-below 70

# Or generate an HTML report for the team:
agent-readiness scan . --report report.html

# Or output SARIF for GitHub code scanning:
agent-readiness scan . --sarif findings.sarif
```

The score is not the point. The _delta_ is. Add an `AGENTS.md`, watch cognitive load go up. Add a discoverable test command, watch feedback loops go up. The DevEx paper's whole argument is that these are the right dimensions to measure precisely because they're the ones you can move.

The companion [public leaderboard](https://harrydaihaolin.github.io/agent-readiness-leaderboard/) runs this scan daily against ~140 of the most-watched AI/agent infrastructure repos in the world. We'll write up what we found there in the next post — the short version is that it's worse than you'd guess.

## Closing

Forsgren and her co-authors weren't writing about coding agents. They were writing about humans, in 2024, before agentic coding was a serious production workload. The framework holds up anyway, and we think that's the most interesting thing about this whole project: the friction that hurts you is the same friction that hurts your tools, and a tool that measures it well measures both.

If your team has agents in production and they're failing on your repo, the codebase is the variable you can change.

```bash
pip install agent-readiness
agent-readiness scan .
```

We'll wait.

---

**Citations**

- Forsgren, N., Storey, M.-A., Maddila, C., Smith, T., Zimmermann, T., & Houck, B. (2024). _DevEx: What Actually Drives Productivity._ Communications of the ACM / ACM Queue. <https://queue.acm.org/detail.cfm?id=3595878>
- `agent-readiness` source: <https://github.com/harrydaihaolin/agent-readiness>
- Public leaderboard: <https://harrydaihaolin.github.io/agent-readiness-leaderboard/>
