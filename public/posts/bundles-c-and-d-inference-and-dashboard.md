# Bundles C and D: an ontology inference reasoner and a live dashboard for multi-repo workspaces

> Three things shipped in the last week — `agent-readiness` **3.3.0 →
> 3.4.1**, `agent-readiness-mcp` **0.6.0 → 0.7.0**, `agent-readiness-skill`
> **0.1.0 → 0.2.0**, and `agent-readiness-insights-protocol` **0.10.0 →
> 0.11.0**. They land two design bundles end-to-end: **Bundle C** (the
> ontology inference reasoner) and **Bundle D** (dashboard mode for
> multi-repo workspaces). This post walks both in dependency order and
> tells you what's now different at the keyboard.

## TL;DR

1. **An ontology forward-chainer with six derived rules** (Bundle C,
   `agent-readiness` 3.3.0). The scanner now derives findings from your
   declared ontology — Repo / Library / Protocol / RulesPack atoms and
   the relationships between them — and surfaces them under a new
   `pillar: ontology, namespace: inference` register. The most
   important one: *coupled consumers must agree on the major version*,
   the dep-graph drift that both Mabl and Bishoy Labib's
   agentic-engineering writeups flag as the single most critical
   failure mode for multi-repo agent work.
2. **A live dashboard for multi-repo workspaces** (Bundle D,
   `agent-readiness` 3.4.x + dashboard SPA). The skill auto-launches a
   browser surface that streams per-repo progress over Server-Sent
   Events, lets the user answer interactive prompts inline, and stays
   out of the chat. No more 4-minute spinner while 30 repos scan
   sequentially.
3. **The skill rewrote `SKILL.md` for mode selection**
   (`agent-readiness-skill` 0.2.0). The skill itself now knows when to
   launch the dashboard vs stay in chat, and how to poll the new MCP
   status envelope (`sse_url`, `prompts_pending_count`,
   `mode_exit_requested`) hands-off — one call per chat turn, never in
   a loop.

## 1. The forward-chainer (Bundle C)

The scanner has had an *ontology* concept for a few months — a
`ontology/` directory with declared `Repo`, `Library`, `Protocol`, and
`RulesPack` atoms, plus `Link` instances like `dependsOn`,
`providesProtocol`, `consumesProtocol`, `releasedAs`. Ratifying atoms
is human-gated; once ratified, the ontology is the system-of-record for
how your repos relate to each other.

Until 3.3.0 the rules engine treated the ontology as inert data — you
could query it, but the scanner wouldn't *infer* anything from it. The
v3.3.0 release ships a small, deliberately-boring forward-chainer that
runs after rule evaluation and emits a `DerivedViolation` for each fact
it can prove:

```python
@dataclass(frozen=True)
class DerivedViolation:
    rule_id: str
    detail: str
    subject_id: str | None = None
    severity: str = "warn"
```

Six evaluators ship in `agent_readiness/ontology/reasoning/evaluators/`
and register themselves via a `@register` decorator:

| Inference rule | What it catches |
|---|---|
| `coupled_consumers_must_agree_on_major` | Two repos depend on the same Library via the same Protocol but pin different major versions. **The dep-graph drift.** |
| `releasable_requires_release_workflow` | A Repo claims the `Releasable` interface but has no detectable release workflow. |
| `documented_repo_requires_agents_md` | A Repo claims the `Documented` interface but no `AGENTS.md` / `CLAUDE.md` / `.cursorrules` exists at the root. |
| `protocol_change_requires_consumer_bump` | A Protocol's major version moves forward but at least one ratified consumer still pins the previous major. |
| `tested_requires_test_command` | A Repo claims `Tested` but no `test_command.discoverable` finding can be satisfied. |
| `cross_tenant_action_needs_intent_template` | An `Action` chain detected by `bootstrap_propose_action_intent_types` crosses a tenant boundary without a ratified Intent template. |

The integration into the rules engine is via a private matcher
(`agent_readiness/rules_eval/private_matchers/ontology_inference.py`)
so a rule can be written declaratively:

```yaml
# rules/ontology/inference/coupled_consumers_must_agree_on_major.yaml
id: ontology.inference.coupled_consumers_must_agree_on_major
pillar: ontology
namespace: inference
severity: warn
matcher: ontology_inference
matcher_args:
  rule_id: coupled_consumers_must_agree_on_major
explanation: |
  Two or more repos depend on the same library through the same protocol
  but pin different major versions. Agents that operate across this
  workspace will produce incoherent change-sets — fixing one consumer
  will silently break the other.
fix_prompt: |
  Open the workspace AGENTS.md and add a "## Pinning policy" section that
  declares the single major version this workspace tracks for
  <library_id>. Then bump every <library_id> pin in package manifests
  under <consumer_repos> to that major.
verify: agent-readiness ontology reason ontology/ --rule coupled_consumers_must_agree_on_major --strict
```

The widened protocol (`agent-readiness-insights-protocol` 0.10.0) added
`"inference"` as a permitted value of `Rule.namespace` so the rule pack
could publish these without a breaking change to consumers.

You can also call the reasoner directly:

```bash
agent-readiness ontology reason ontology/ --json
```

…or, from an MCP-aware agent harness:

```
reason_over_ontology(path="/path/to/repo")
```

(The MCP tool ships in `agent-readiness-mcp` 0.6.0, which also added the
`confirm_apply` round-trip for the gap-CLI flow.)

### Why this matters

The agentic-engineering literature is consistent on this: the
single most critical failure mode for multi-repo agent work is
*dep-graph drift*. The agent fixes the symptom in repo A,
unwittingly violates a contract repo B relied on, and the bug
manifests two repos away from where it was introduced. The
inference reasoner exists to catch that class of bug before the
agent runs.

It's also the first piece of the scanner that produces findings the
human couldn't have written by hand — every other check is a presence
/ absence test on a file. Inference rules are an emergent property of
the ontology graph, and the only way to get one is to ratify atoms and
let the reasoner walk the graph.

## 2. Dashboard mode (Bundle D)

The other big shift is for *multi-repo workspaces*. Scoring one repo
takes a few seconds. Scoring a workspace of 10 / 30 / 100 sibling repos
used to mean either (a) running the scanner sequentially and staring at
a chat spinner for minutes, or (b) running the scanner in parallel and
losing the ability for the scanner to ask the human a clarifying
question. Neither is good UX.

Bundle D builds a third option: a live dashboard, streamed over
Server-Sent Events, with interactive prompts answered inline in the
browser. The chat stays out of the way.

### What runs where

```
chat agent                           browser dashboard
─────────                            ─────────────────
       │                                    ▲
       │ scan_workspace_async(path)         │ SSE: events.jsonl
       ├─────────────────────────────────► (per-repo ticks,
       │                                    │  prompts, findings)
       │                                    │
       │ get_scan_status(scan_id) once       │
       │ per chat turn (hands-off)          │
       │ ◄────────── snapshot ──────────────│
       │                                    │
       │              ┌─────────────────────┴─────────────────┐
       │              │  agent-readiness-analytics-dashboard  │
       │              │  /live/<scan_id>                      │
       │              │                                       │
       │              │  ┌────────────┐  ┌──────────────┐    │
       │              │  │ Repo grid  │  │ Prompts queue│    │
       │              │  └────────────┘  └──────────────┘    │
       │              │  ┌────────────┐  ┌──────────────┐    │
       │              │  │ Pillars    │  │ Findings feed│    │
       │              │  └────────────┘  └──────────────┘    │
       │              └───────────────────────────────────────┘
```

The data plane is intentionally simple. The scan worker writes an
append-only `events.jsonl` (the canonical SSE event log) and an
append-only `prompts.jsonl` (the prompt state machine). The dashboard
server tails them. The browser SPA consumes the SSE stream and reduces
it into the same `WorkspaceScanSnapshot` Pydantic model the JSON API
returns — so a late-joining client can fetch the snapshot once, then
subscribe to events from the last `seq`.

Fifteen kinds of SSE event ship in the protocol (`v0.11.0`):

```
ScanQueuedEvent              RepoFindingAddedEvent
ScanStartedEvent             RepoScanCompletedEvent
ScanCompletedEvent           RepoScanFailedEvent
ScanExitedEvent              WorkspaceScoreTickEvent
RepoQueuedEvent              PromptRequestedEvent
RepoScanStartedEvent         PromptAnsweredEvent
RepoEvaluatorTickEvent       PromptExpiredEvent
                             LogLineEvent
```

Plus six prompt types, each with its own discriminated `PromptPayload` /
`PromptAnswer` pair:

```
ClassifyPromptPayload   — "is this directory code / data / docs?"
MembersPromptPayload    — "which children belong in this workspace?"
UmbrellaPromptPayload   — "do these repos form a single product?"
TopActionPromptPayload  — "apply the top action?"
RatifyPromptPayload     — "ratify this proposed atom?"
ClarifyPromptPayload    — freeform: "the scanner is stuck on X, clarify"
```

The browser PromptsQueue renders each as a card with the right
controls (radio for classify, multi-select for members, yes/no for
ratify, etc.). The scanner blocks on `wait_for_answer(timeout_s)`; if
nothing comes back the user can opt to `apply_default_immediately()`
or let the prompt expire. Either way, the chat side is uninvolved.

### How the skill knows to launch it

`agent-readiness-skill` 0.2.0 rewrote `SKILL.md` to teach the skill
mode-selection. The Phase-3 classification now branches:

| Classification | Default mode | Why |
|---|---|---|
| single repo / monorepo | **chat mode** | One repo finishes in seconds. |
| workspace (≥ 2 repos) | **dashboard mode** | Per-repo scans run in parallel; the user sees live progress and can answer prompts inline. |

When the skill enters dashboard mode it calls `scan_workspace_async`,
prints the `dashboard_url`, tells the user how to exit (chat command
*or* browser button), and **stops blocking the chat**. Each chat turn
after that, the skill calls `get_scan_status` once and reads the
v0.7.0 envelope:

| Field | What the skill does |
|---|---|
| `status` | If `completed`, summarise + offer apply. If `running`, keep brief. |
| `progress.completed / total` | One-liner: "X of Y repos done". |
| `sse_url` | Recover the dashboard URL if the user lost the tab. |
| `prompts_pending_count` | If > 0, tell the user to answer prompts in the dashboard. |
| `mode_exit_requested` | If `true`, switch back to chat mode (the user clicked Exit). |

The contract is *hands-off*: never poll in a loop, never relay prompts
into the chat unless the user explicitly asks. That's the whole point
of moving the surface out of the conversation.

### Exit either way

The dashboard is opt-in icing, not a required path. The user can exit
from either side:

- **In chat:** `/agent-readiness exit-dashboard` (or just ask). The
  skill POSTs to `/api/scans/<id>/exit` and switches back.
- **In browser:** click *"Exit dashboard mode"*. The dashboard writes
  the `exit_requested` flag; the skill's next status poll observes
  `mode_exit_requested: true` and reverts.

In both cases the scan keeps running. The dashboard server stays up
until its idle timeout. The chat reclaims the foreground.

## 3. The protocol bump (Bundle D-1, agent-readiness-insights-protocol 0.11.0)

Everything above crosses repo boundaries, which means it lives in the
protocol package — the single source of truth for cross-repo types.
v0.11.0 added a new `dashboard` module with:

- 6 `PromptPayload` types + 6 matching `PromptAnswer` types, both as
  discriminated unions.
- 15 SSE event types + the `SSEEvent` discriminated union.
- `PromptRecord` (the full prompt-state-machine entry).
- `WorkspaceScanSnapshot` (the canonical post-replay state).

All with `extra="forbid"` on the Pydantic models so a downstream that
adds a field has to bump the protocol. The schema regenerator runs as
part of the protocol's release workflow and the rule pack pins
`PROTOCOL_TAG=v0.11.0` so a mismatch fails CI.

## 4. The MCP envelope (Bundle D-3, agent-readiness-mcp 0.7.0)

`get_scan_status` used to return just `{status, progress, overall_score}`.
v0.7.0 enriched it with the four dashboard-mode fields the skill polls:

```python
{
    "status": "running",
    "progress": {"completed": 7, "total": 17},
    "overall_score": None,
    # New in v0.7.0
    "sse_url": "http://localhost:8765/api/scans/<id>/sse",
    "snapshot_url": "http://localhost:8765/api/scans/<id>/snapshot",
    "prompts_pending_count": 2,
    "mode_exit_requested": False,
}
```

The MCP doesn't know what the dashboard *looks* like — it just hands
the URL back. The browser SPA is a separate repo
(`agent-readiness-analytics-dashboard`) that the skill points the user
at.

## 5. The dashboard SPA (Bundle D-4)

The browser side is a React + TypeScript + Vite app that mirrors the
protocol types in TS. The main new pieces:

- `WorkspaceScanSSEProvider` — fetches the snapshot once, then
  subscribes to `EventSource(sse_url)` and reduces events into live
  state. Idempotent: a re-render with stale events is a no-op.
- `PromptsQueue` + `PromptCard` — renders each pending prompt with the
  right controls, posts the answer to `/api/scans/<id>/prompt/<n>/answer`,
  shows optimistic UI while the answer is in-flight.
- `ExitDashboardButton` — POSTs to `/api/scans/<id>/exit` and shows
  "Exit requested — chat will take over on next turn".
- `LivePage` — the `/live/:scanId` route that ties it all together
  (pillar sidebar, repo grid, findings feed, log tail).

The whole bundle re-bundles into the scanner wheel via the v3.4.1
patch release (`_dashboard_dist/`), so `pip install agent-readiness`
ships the live SPA. No `make dashboard` step required downstream.

## 6. What this means at the keyboard

If you're using the **CLI**, the new surfaces are:

```bash
# Inference findings
agent-readiness scan . --include inference
agent-readiness ontology reason ontology/ --json

# Workspace + dashboard
agent-readiness scan-workspace .
agent-readiness scan-and-view . --children .
# opens http://localhost:8765/live/<scan_id>
```

If you're using the **skill** in Claude Code or Cursor, the changes
are invisible-to-you-on-purpose: just talk to the agent normally and
it picks chat mode or dashboard mode based on what you ask it to scan.
*"Score this repo"* → chat. *"Score this workspace"* → dashboard. The
agent tells you when it's switching modes.

If you're building **on top of the MCP server**, the new tools are
`scan_workspace_async`, the enriched `get_scan_status` envelope, and
`reason_over_ontology`. The complete tool list lives in the
[agent-readiness-mcp README](https://github.com/harrydaihaolin/agent-readiness-mcp).

---

Bundles C and D were the last two pieces of the
[2026-05-26 ontology-driven design](https://github.com/harrydaihaolin/agent-readiness-research/blob/main/docs/superpowers/specs/2026-05-26-dashboard-mode-design.md)
and its predecessor. The next thing on deck is **runtime evidence in
the inference layer** — letting an inference rule prove its claim by
running a command in the Docker sandbox, not just by walking the
ontology graph. Watch this space.

If you've shipped a workspace where the dashboard helped or the
forward-chainer caught something the static rules missed — tell me on
[GitHub Discussions](https://github.com/harrydaihaolin/agent-readiness/discussions).
