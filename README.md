# agent-readiness-landing-page

The marketing site for [agent-readiness](https://github.com/harrydaihaolin/agent-readiness):
the Bronze/Silver/Team/Enterprise tier breakdown, four-pillar feature
overview, and a clear "Bronze stays open source forever" message. Built with
Vite + React + TypeScript + Tailwind. Deploys to GitHub Pages.

## Quick start

```bash
make install
make dev      # http://localhost:5173
make build    # static dist/
```

## Stack

- Vite 5 + React 18 + TypeScript 5.5
- Tailwind v3 (dark theme by default, accent palette in `tailwind.config.js`)
- ESLint v9 + Prettier
- Vitest for component tests

## Deployment

Pushes to `main` build and deploy to GitHub Pages via
`.github/workflows/deploy.yml`. The site lives at
`https://harrydaihaolin.github.io/agent-readiness-landing-page/`.

## Project layout

```
src/
  App.tsx                # top-level layout
  main.tsx               # React entry
  styles.css             # Tailwind layers + design tokens
  components/            # Nav, Hero, Stats, Features, OpenSourceCallout, Pricing, Faq, Footer
  data/                  # tier copy, stats, FAQ items, feature pillars (typed)
```

To change pricing copy, edit `src/data/tiers.ts` — that's the single
source of truth for tier headlines and CTAs.

## License

Site code is MIT, matching the rest of the OSS ecosystem.
