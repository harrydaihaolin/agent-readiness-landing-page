# I scanned 96 popular AI infra repos. Most are not agent ready.

The pitch that LLM agents are now part of the developer toolchain assumes the toolchain is shaped for them. So I pointed [`agent-readiness`](https://github.com/harrydaihaolin/agent-readiness) at the AI ecosystem itself — 96 of the most-starred frameworks, runtimes, vector stores, and orchestration tools — and looked at what would happen if a coding agent landed in each of them with no human nearby.

The most uncomfortable finding came first: **64% of these repos do not have an AGENTS.md, CLAUDE.md, .cursor/rules/, or any other agent-targeted documentation**. That is the infrastructure for AI agents shipping without docs for AI agents.

## The 64% gap

The canonical agent-doc check is one of the simpler ones in the rules pack. It looks for any of `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/*.mdc`, `.github/copilot-instructions.md`, and a long tail of related conventions. Sixty-one of the ninety-six repos have none of them.

The list of who is missing it is the surprising part:

- `anthropics/anthropic-sdk-python` — the official SDK from the company that publishes the AGENTS.md convention.
- `microsoft/autogen`, `microsoft/promptflow`, `microsoft/semantic-kernel`, `microsoft/TaskWeaver`, `microsoft/graphrag` — Microsoft's full agent surface.
- `openai/swarm`, `openai/openai-python` — same pattern at OpenAI.
- `huggingface/peft`, `huggingface/accelerate`, `huggingface/text-generation-inference` — most of the HF training stack.
- `ollama/ollama`, `langchain-ai/langgraph`, `run-llama/llama_index`, `stanfordnlp/dspy`, `letta-ai/letta`, `dagster-io/dagster`, `kubernetes/kubernetes`.

These are not stragglers. Together they are most of the runtime, training, and orchestration surface the agents people are building actually depend on. None of them tell an agent landing in the repo what its canonical commands are, what files to leave alone, or how the contributors expect a change to look.

## The placeholder tell

A more interesting cluster sits inside the 36% that *do* have an agent doc. A separate consistency check looks for `AGENTS.md` / `CLAUDE.md` files smaller than 100 bytes — placeholders that signal awareness of the convention without commitment to it. Four repos hit it:

- `Significant-Gravitas/AutoGPT` — `CLAUDE.md` is **11 bytes**. One line.
- `modelcontextprotocol/python-sdk` — placeholder agent doc in the SDK for the protocol Anthropic shipped specifically so agents could navigate code.
- `vllm-project/vllm` — same.
- `n8n-io/n8n` — same.

The rule does not name and shame; it just measures. But the optics are hard to miss. AutoGPT, of all repos, has set out the file an agent would read first and put eleven bytes in it.

## The unrunnable tail

The harshest single rule in the new pack is the headless end-to-end runnability check. It fires only when a repo simultaneously has (a) no agent-targeted docs anywhere, (b) no conventional entry point — no `[project.scripts]`, no `package.json` `bin`/`main`, no `main.py`/`main.go`/`index.ts`, etc. — and (c) no statically-discoverable test command. Three of the ninety-six trip it:

- `TencentQQGYLab/AppAgent`
- `kubeflow/kubeflow`
- `simular-ai/Agent-S`

For those three, an agent landing in the repo cannot read a doc, cannot run anything, and cannot verify anything. Even a perfect plan from the README is dead-on-arrival without trial and error. That is a small minority — but it is also the absolute floor of the agent-readiness distribution, and it includes one of Google's open-source ML platforms and a top-25 agent framework.

## The README that does not tell you how to run anything

Forty-two percent of the repos (40 of 96) miss the run-instructions check. The rule looks for the basics — fenced code blocks, plus install / run / test signals. The repos that miss it include `anthropics/anthropic-sdk-python`, `microsoft/autogen`, `microsoft/semantic-kernel`, `microsoft/graphrag`, `kubernetes/kubernetes`, `langchain-ai/langgraph`, and `huggingface/smolagents`. Several have READMEs full of prose and screenshots but no copy-pasteable command an agent can run verbatim. Several have a "Get started" link that points to a docs site — fine for humans, opaque to a sandboxed agent that cannot browse.

## What I am not claiming

The first cut of this post led with a "popular repos are leaking secrets" angle that did not survive the rewrite. After the secrets check filters out fixture and example paths (`example|fixture|mock|sample|docs|test*`), 12 of 96 repos still show secret-shaped strings — but most of those are still fixture data indistinguishable from real keys at scan time. I am not claiming twelve popular repos are leaking real keys. The signal is real and worth looking at on a repo-by-repo basis; it is not a headline.

## Honest noise: the file-size rule

The single largest finding bucket is still the large-files check at 96% repo coverage even after halved weight and a default exclude list (lock files, changelogs, binary assets, vendored dependencies). This is over-firing — the next iteration will either lower its weight further or extend the excludes to autogenerated bindings (`*_pb2.py`, `*.generated.*`) and schema dumps. The rule is queued for a follow-up release and is not part of any conclusion above.

## Method

`agent-readiness` is an open-source CLI ([github.com/harrydaihaolin/agent-readiness](https://github.com/harrydaihaolin/agent-readiness)) with rules in a separate pack ([github.com/harrydaihaolin/agent-readiness-rules](https://github.com/harrydaihaolin/agent-readiness-rules)). For this scan the 96-repo curated set was shallow-cloned and scored, and warn / error findings were aggregated by check and by repo. The headless end-to-end runnability rule was new for this run and shipped to the rules pack shortly after.

The [public leaderboard](https://harrydaihaolin.github.io/agent-readiness-leaderboard/) re-runs the same scan daily. An `AGENTS.md` is the cheapest single change a maintainer of any of the 61 repos above can make.
