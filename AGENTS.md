# AGENTS.md — agent-readiness-landing-page

A static marketing site. No server, no database. Edit copy in `src/data/`,
edit visuals in `src/components/`, deploy via GitHub Pages.

## Canonical commands

| Task | Command |
|---|---|
| Install | `make install` |
| Dev server | `make dev` |
| Build static dist | `make build` |
| Lint | `make lint` |
| Test | `make test` |
| Format | `make format` |

## CI and the feedback loop

**CI is part of the feedback loop.** After you push or update a PR, **monitor GitHub Actions / workflow runs and check results**. When **CI fails**, read the logs, **fix the root cause**, and push follow-up commits. Do not stop while checks are red or ignore failing workflows.

## Do-not-touch

- `vite.config.ts` `base` is set per-environment so Pages routing works.
  Don't hardcode `/` in production builds — assets will 404.
- The `agent-readiness-landing-page` URL slug is part of the deployed
  base path; if you rename the repo, update `vite.config.ts`.

## Headless contract

`make build` is fully non-interactive. The deploy workflow runs only
`make install && make build` and uploads `dist/`. No prompts, no env
vars required to build.
